import { test, expect } from './helpers/test';
import { clearAuthStorage } from './helpers/auth';

test.describe('SignIn Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/signin', { waitUntil: 'domcontentloaded' });
        await clearAuthStorage(page);
        await page.reload({ waitUntil: 'domcontentloaded' });
    });

    test('successful sign in and redirect', async ({ page }) => {
        await page.locator('main input').first().fill('helena.hills@social.com');
        await page.locator('main input').nth(1).fill('password789');
        await page.locator('button[type="submit"]').click();

        await expect(page).toHaveURL(/\/$/);
        await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible();
    });

    test('failed sign in shows error', async ({ page }) => {
        await page.route('**/api/graphql', async (route) => {
            const text = route.request().postData() || '';

            if (text.includes('mutation Login') || text.includes('login(email')) {
                return route.fulfill({
                    status: 200,
                    contentType: 'application/json',
                    body: JSON.stringify({
                        errors: [{ message: 'Unauthorized credentials' }],
                        data: null,
                    }),
                });
            }

            await route.continue();
        });

        await page.locator('main input').first().fill('wrong@example.com');
        await page.locator('main input').nth(1).fill('wrong-password');
        await page.locator('button[type="submit"]').click();

        await expect(page).toHaveURL(/\/signin$/);
    });

    test('redirect to sign up page', async ({ page }) => {
        await page.locator('main a[href*="signup"]').first().click();
        await expect(page).toHaveURL(/\/signup$/);
    });
});
