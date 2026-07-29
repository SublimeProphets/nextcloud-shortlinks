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

test('complete link lifecycle, organization, redirect, statistics, and import/export', async ({ page, request, baseURL }) => {
	await login(page)
	await page.goto('/index.php/apps/shortlinks/')

	const folderName = `Campaign ${Date.now()}`
	const childName = `Launch ${Date.now()}`
	const folderForm = page.locator('form.navigation-create').first()
	await folderForm.getByLabel(/new folder/i).fill(folderName)
	await folderForm.getByRole('button', { name: /^add$/i }).click()
	await expect(page.getByText(folderName, { exact: true })).toBeVisible()
	await folderForm.getByLabel(/new folder/i).fill(childName)
	await folderForm.getByLabel(/parent folder/i).selectOption({ label: folderName })
	await folderForm.getByRole('button', { name: /^add$/i }).click()

	const tagName = `E2E-${Date.now()}`
	const tagForm = page.locator('form.navigation-create').nth(1)
	await tagForm.getByLabel(/new tag/i).fill(tagName)
	await tagForm.getByRole('button', { name: /^add$/i }).click()
	await expect(page.getByText(new RegExp(tagName))).toBeVisible()

	const slug = `e2e-${Date.now()}`
	await page.getByRole('button', { name: /new short link/i }).click()
	await page.getByLabel(/target url/i).fill(`${baseURL}/status.php`)
	await page.getByLabel(/alias.*optional/i).fill(slug)
	await page.getByLabel(/^title$/i).fill('E2E example')
	await page.locator('#shortlink-form').getByLabel(/^folder$/i).selectOption({ label: `— ${childName}` })
	await page.getByText(tagName, { exact: true }).last().click()
	await page.getByRole('button', { name: /^create$/i }).click()

	const row = page.getByRole('row', { name: /E2E example/ })
	await expect(row).toBeVisible()
	const redirect = await request.get(`/index.php/apps/shortlinks/r/${slug}`, { maxRedirects: 0, headers: { Referer: 'https://referrer.example/path?token=secret' } })
	expect(redirect.status()).toBe(302)
	expect(redirect.headers().location).toBe(`${baseURL}/status.php`)
	expect(redirect.headers()['cache-control']).toContain('no-store')

	await row.getByRole('button', { name: /E2E example/i }).click()
	await page.getByRole('button', { name: /^stats$/i }).click()
	await expect(page.getByText(/lifetime clicks:\s*1/i)).toBeVisible()
	await page.getByRole('button', { name: /^shares$/i }).click()
	await page.getByLabel(/^user or group$/i).fill('bob')
	await page.getByRole('button', { name: /search recipients/i }).click()
	await page.getByRole('button', { name: /bob \(bob\).*user/i }).click()
	await page.getByRole('button', { name: /add permission/i }).click()
	await expect(page.getByText(/bob/)).toBeVisible()
	await page.getByRole('button', { name: /close/i }).click()

	const download = page.waitForEvent('download')
	await page.getByRole('button', { name: /export json/i }).click()
	expect((await download).suggestedFilename()).toBe('shortlinks.json')

	await row.getByRole('button', { name: /^delete$/i }).click()
	await expect(row).toBeHidden()
	await page.getByText(/trash/i, { exact: true }).click()
	const trashed = page.getByRole('row', { name: /E2E example/ })
	await expect(trashed).toBeVisible()
	await trashed.getByRole('button', { name: /^restore$/i }).click()
	await page.getByText(/all links/i, { exact: true }).click()
	await expect(page.getByRole('row', { name: /E2E example/ })).toBeVisible()
})

test('password access and mobile navigation remain operable', async ({ page, request, baseURL }) => {
	await login(page)
	await page.goto('/index.php/apps/shortlinks/')
	const slug = `protected-${Date.now()}`
	await page.getByRole('button', { name: /new short link/i }).click()
	await page.getByLabel(/target url/i).fill(`${baseURL}/status.php`)
	await page.getByLabel(/alias.*optional/i).fill(slug)
	await page.getByLabel(/^title$/i).fill('Protected E2E')
	await page.getByLabel(/^access$/i).selectOption('password')
	await page.getByLabel(/^password$/i).fill('e2e-password')
	await page.getByRole('button', { name: /^create$/i }).click()

	const response = await request.get(`/index.php/apps/shortlinks/r/${slug}`, { maxRedirects: 0 })
	expect(response.status()).toBe(200)
	expect(await response.text()).toContain('Protected short link')
	await page.setViewportSize({ width: 390, height: 844 })
	await expect(page.getByRole('button', { name: /new short link/i })).toBeVisible()
})
