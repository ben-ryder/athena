import { test, expect } from '@playwright/test';

test('feature has title', async ({ page }) => {
	await page.goto('/');

	// Expect a title "to contain" a substring.
	await expect(page).toHaveTitle(/Athena/);
});
