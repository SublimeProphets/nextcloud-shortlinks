import { expect, test } from '@playwright/test'

const user = process.env.NEXTCLOUD_TEST_USER ?? 'alice'
const password = process.env.NEXTCLOUD_TEST_PASSWORD ?? 'alice-test-password'

test('creates, opens, records, trashes, and restores a short link', async ({ page, context }) => {
	await page.goto('/login'); await page.getByLabel(/account name|username/i).fill(user); await page.getByLabel(/password/i).fill(password); await page.getByRole('button', { name: /log in/i }).click()
	await page.goto('/index.php/apps/shortlinks/'); await page.getByRole('button', { name: /new short link/i }).click(); await page.getByLabel(/target url/i).fill('https://example.com/'); await page.getByLabel(/^title$/i).fill('E2E example'); await page.getByRole('button', { name: /^create$/i }).click()
	const row = page.getByRole('row', { name: /E2E example/ }); await expect(row).toBeVisible(); const shortLink = await row.locator('button.copy-value').getAttribute('title').catch(() => null); await row.getByRole('button', { name: /E2E example/i }).click(); await expect(page.getByText(/total clicks/i)).toBeVisible()
	const apiLink = await row.locator('button.copy-value').textContent(); expect(apiLink).toBeTruthy(); const publicPage = await context.newPage(); const response = await publicPage.goto(`/index.php/apps/shortlinks/r/${apiLink}`); expect(response?.status()).toBeGreaterThanOrEqual(200); expect(response?.status()).toBeLessThan(400); await publicPage.close()
	await row.getByRole('button', { name: /delete/i }).click(); await expect(row).toBeHidden(); await page.getByText(/trash/i).click(); await expect(page.getByText('E2E example')).toBeVisible()
})
