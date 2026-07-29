import { expect, test } from '@playwright/test'

const user = process.env.NEXTCLOUD_TEST_USER ?? 'alice'
const password = process.env.NEXTCLOUD_TEST_PASSWORD ?? 'alice-dev-only'

async function login(page: import('@playwright/test').Page) {
	await page.goto('/login')
	await page.locator('input[name="user"]').fill(user)
	await page.locator('input[name="password"]').fill(password)
	await page.locator('button[type="submit"]').click()
	await expect(page).not.toHaveURL(/\/login/)
}

async function chooseCreateAction(page: import('@playwright/test').Page, name: 'New short link' | 'New folder' | 'New tag') {
	const trigger = page.getByRole('button', { name: /\+ new/i })
	try {
		await trigger.click({ timeout: 3_000 })
	} catch {
		await dismissFirstRunWizard(page)
		await trigger.click()
	}
	await page.getByRole('menuitem', { name: new RegExp(`^${name}$`, 'i') }).click()
}

async function dismissFirstRunWizard(page: import('@playwright/test').Page) {
	const wizard = page.locator('#firstrunwizard[role="dialog"]')
	await wizard.waitFor({ state: 'visible', timeout: 30_000 })
	await wizard.getByRole('button', { name: /^close$/i }).click({ force: true })
	await wizard.waitFor({ state: 'hidden' })
}

async function switchView(page: import('@playwright/test').Page, name: string) {
	const rootBreadcrumb = page.locator('.content-toolbar .vue-crumb').first()
	await rootBreadcrumb.getByRole('button').click()
	await page.getByRole('menuitem', { name: new RegExp(`^${name}$`, 'i') }).click()
}

async function openRowActions(row: import('@playwright/test').Locator) {
	await row.getByRole('button', { name: /^actions for /i }).click()
}

test('complete link lifecycle, organization, redirect, statistics, and import/export', async ({ page, request, baseURL }, testInfo) => {
	await login(page)
	await page.goto('/index.php/apps/shortlinks/')

	const folderName = `Campaign ${testInfo.project.name} ${Date.now()}`
	const childName = `Launch ${testInfo.project.name} ${Date.now()}`
	await chooseCreateAction(page, 'New folder')
	await page.getByLabel(/folder name/i).fill(folderName)
	await page.getByRole('button', { name: /^create folder$/i }).click()
	await expect(page.getByText(folderName, { exact: true })).toBeVisible()
	await chooseCreateAction(page, 'New folder')
	await page.getByLabel(/folder name/i).fill(childName)
	await page.getByLabel(/parent folder/i).selectOption({ label: folderName })
	await page.getByRole('button', { name: /^create folder$/i }).click()

	const tagName = `E2E-${testInfo.project.name}-${Date.now()}`
	await chooseCreateAction(page, 'New tag')
	await page.getByLabel(/tag name/i).fill(tagName)
	await page.getByRole('button', { name: /^create tag$/i }).click()
	await expect(page.getByText(new RegExp(tagName))).toBeVisible()

	const slug = `e2e-${testInfo.project.name}-${Date.now()}`
	await chooseCreateAction(page, 'New short link')
	const dialog = page.locator('[role="dialog"]').filter({ has: page.getByRole('heading', { name: 'New short link', exact: true }) })
	await dialog.getByLabel(/destination url/i).fill(`${baseURL}/status.php`)
	await dialog.getByLabel(/^alias$/i).fill(slug)
	await dialog.getByLabel(/^title$/i).fill('E2E example')
	await dialog.getByRole('combobox', { name: 'Folder', exact: true }).selectOption({ label: childName })
	await dialog.getByRole('checkbox', { name: tagName }).check({ force: true })
	await dialog.getByRole('button', { name: /^create$/i }).click()
	await expect(dialog).toBeHidden()
	await switchView(page, 'All links')

	const row = page.getByRole('row', { name: new RegExp(slug) })
	await expect(row).toBeVisible()
	const redirect = await request.get(`/index.php/apps/shortlinks/r/${slug}`, { maxRedirects: 0, headers: { Referer: 'https://referrer.example/path?token=secret' } })
	expect(redirect.status()).toBe(302)
	expect(redirect.headers().location).toBe(`${baseURL}/status.php`)
	expect(redirect.headers()['cache-control']).toContain('no-store')

	await row.getByRole('button', { name: 'E2E example', exact: true }).press('Enter')
	await page.getByRole('button', { name: /^stats$/i }).click()
	await expect(page.getByText(/lifetime clicks:\s*1/i)).toBeVisible()
	await page.getByRole('button', { name: /^shares$/i }).click()
	await page.getByLabel(/^user or group$/i).fill('bob')
	await page.getByRole('button', { name: /search recipients/i }).click()
	await page.getByRole('button', { name: /bob \(bob\).*user/i }).click()
	await page.getByRole('button', { name: /add permission/i }).click()
	await expect(page.getByText(/bob/)).toBeVisible()
	await page.getByRole('button', { name: /^close sidebar$/i }).click()

	const download = page.waitForEvent('download')
	await page.getByRole('button', { name: /^export$/i }).click()
	await page.getByRole('menuitem', { name: /^export json$/i }).click()
	expect((await download).suggestedFilename()).toBe('shortlinks.json')

	await openRowActions(row)
	await page.getByRole('menuitem', { name: /^delete$/i }).click()
	await expect(row).toBeHidden()
	await switchView(page, 'Trash')
	const trashed = page.getByRole('row', { name: new RegExp(slug) })
	await expect(trashed).toBeVisible()
	await openRowActions(trashed)
	await page.getByRole('menuitem', { name: /^restore$/i }).click()
	await switchView(page, 'All links')
	await expect(page.getByRole('row', { name: new RegExp(slug) })).toBeVisible()
})

test('password access and mobile navigation remain operable', async ({ page, request, baseURL }, testInfo) => {
	await login(page)
	await page.goto('/index.php/apps/shortlinks/')
	const slug = `protected-${testInfo.project.name}-${Date.now()}`
	await chooseCreateAction(page, 'New short link')
	const dialog = page.locator('[role="dialog"]').filter({ has: page.getByRole('heading', { name: 'New short link', exact: true }) })
	await dialog.getByLabel(/destination url/i).fill(`${baseURL}/status.php`)
	await dialog.getByLabel(/^alias$/i).fill(slug)
	await dialog.getByLabel(/^title$/i).fill('Protected E2E')
	await dialog.getByRole('combobox', { name: 'Access', exact: true }).selectOption('password')
	await dialog.getByLabel(/^password$/i).fill('e2e-password')
	await dialog.getByRole('button', { name: /^create$/i }).click()
	await expect(dialog).toBeHidden()

	const response = await request.get(`/index.php/apps/shortlinks/r/${slug}`, { maxRedirects: 0 })
	expect(response.status()).toBe(200)
	expect(await response.text()).toContain('Protected short link')
	await page.setViewportSize({ width: 390, height: 844 })
	await expect(page.getByRole('button', { name: /\+ new/i })).toBeVisible()
})
