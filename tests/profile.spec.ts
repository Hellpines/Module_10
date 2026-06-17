import { test, expect } from './helpers/test';
import {
    authenticatePage,
    gotoAppPage,
    navigateViaAside,
    clearAuthStorage,
    waitForAppReady,
} from './helpers/auth';

test.describe('Profile Page', () => {
    test('should display profile info from current user', async ({ page }) => {
        await authenticatePage(page);
        await gotoAppPage(page, '/profile');

        await expect(page.getByRole('button', { name: 'Profile Info' })).toBeVisible();
        await expect(page.locator('#username')).toHaveValue('helenahills');
        await expect(page.locator('#email')).toHaveValue('helena.hills@social.com');
        await expect(page.locator('#description')).toHaveValue(
            'Team lead overseeing product development and architecture across multiple platforms.'
        );
    });

    test('should show statistics section', async ({ page }) => {
        await authenticatePage(page);
        await gotoAppPage(page, '/profile');

        await expect(page.getByRole('button', { name: 'Statistics' })).toBeVisible();
        await expect(page.getByText('Created Notes')).toBeVisible();
        await expect(page.getByText('Archived Notes')).toBeVisible();
        await expect(page.getByText('Deleted Notes')).toBeVisible();
    });

    test('should save profile changes', async ({ page }) => {
        await authenticatePage(page);
        await gotoAppPage(page, '/profile');

        await page.locator('#username').fill('updated_user');
        await page.getByRole('button', { name: 'Save Profile Changes' }).click();

        await expect(page.locator('#username')).toHaveValue('updated_user');
    });

    test('should navigate from aside menu', async ({ page }) => {
        await authenticatePage(page);

        await navigateViaAside(page, 'Profile');

        await expect(page).toHaveURL(/\/profile$/);
        await expect(page.getByRole('button', { name: 'Profile Info' })).toBeVisible({
            timeout: 30000,
        });
        await expect(page.locator('#username')).toHaveValue('helenahills');
    });

    test('should logout and redirect to no-auth page', async ({ page }) => {
        await authenticatePage(page);
        await gotoAppPage(page, '/profile');

        await page.getByRole('button', { name: 'logout' }).click();

        await expect(page).toHaveURL(/\/noauth$/);
    });

    test('should enable dark theme', async ({ page }) => {
        await authenticatePage(page);
        await gotoAppPage(page, '/profile');

        const themeSwitch = page.getByRole('switch', { name: 'Dark Theme' });
        await expect(themeSwitch).not.toBeChecked();

        await themeSwitch.click();

        await expect(themeSwitch).toBeChecked();
        await expect
            .poll(async () => page.evaluate(() => document.body.getAttribute('data-theme')))
            .toBe('dark');
        await expect
            .poll(async () => page.evaluate(() => localStorage.getItem('app-theme')))
            .toBe('dark');
    });

    test('should switch language to Russian', async ({ page }) => {
        await authenticatePage(page);
        await gotoAppPage(page, '/profile');

        await page.locator('#language-select').click();

        await page.getByRole('option', { name: 'Русский' }).click();

        await expect(page.locator('#language-select')).toHaveText(/Русский/);
        await expect(page.getByRole('switch', { name: 'Тёмная тема' })).toBeVisible();
    });

    test('should change font size ratio', async ({ page }) => {
        await authenticatePage(page);
        await gotoAppPage(page, '/profile');

        await page.locator('#fontSize').fill('1.5');

        await expect(page.locator('#fontSize')).toHaveValue('1.5');
        await expect
            .poll(async () =>
                page.evaluate(() =>
                    document.documentElement.style.getPropertyValue('--font-size-ratio')
                )
            )
            .toBe('1.5');
    });

    test('should upload background image for all notes', async ({ page }) => {
        await authenticatePage(page);
        await gotoAppPage(page, '/profile');

        const bgInput = page.locator('input[accept="image/png, image/jpeg"]');
        await bgInput.setInputFiles({
            name: 'test-pixel.png',
            mimeType: 'image/png',
            buffer: Buffer.from(
                'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==',
                'base64'
            ),
        });

        await expect(page.getByText('All backgrounds updated successfully!')).toBeVisible({
            timeout: 15000,
        });
    });
});

test.describe('Profile Page — unauthenticated', () => {
    test('should redirect to no-auth when not logged in', async ({ page }) => {
        await page.goto('/signin', { waitUntil: 'domcontentloaded' });
        await clearAuthStorage(page);
        await page.goto('/profile', { waitUntil: 'domcontentloaded' });
        await waitForAppReady(page);

        await expect(page).toHaveURL(/\/noauth$/, { timeout: 30000 });
    });
});
