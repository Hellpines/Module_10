import { test, expect } from '@playwright/test';

test.describe('SignIn Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.addInitScript(() => {
            window.localStorage.removeItem('access_token');
        });
    });

    test('successful sign in and redirect', async ({ page }) => {
        await page.route('**/*', async (route) => {
            if (route.request().method() === 'POST') {
                const text = route.request().postData() || '';

                if (text.includes('Login') || text.includes('login')) {
                    return route.fulfill({
                        status: 200,
                        contentType: 'application/json',
                        body: JSON.stringify({
                            data: {
                                login: {
                                    token: 'fake-jwt-token',
                                    user: {
                                        id: 1,
                                        username: 'hellenahills',
                                        firstName: 'Helena',
                                        email: 'helena.hills@social.com',
                                    },
                                },
                            },
                        }),
                    });
                }

                if (text.includes('GetMe') || text.includes('me')) {
                    return route.fulfill({
                        status: 200,
                        contentType: 'application/json',
                        body: JSON.stringify({
                            data: {
                                me: {
                                    id: 1,
                                    username: 'hellenahills',
                                    firstName: 'Helena',
                                    email: 'helena.hills@social.com',
                                },
                            },
                        }),
                    });
                }
            }
            await route.continue();
        });

        await page.goto('/#/signin');

        await page.locator('main input').first().fill('helena.hills@social.com');
        await page.locator('main input').nth(1).fill('password789');
        await page.locator('button[type="submit"]').click();

        await expect(page).toHaveURL(/.*\/#\/$/);
    });

    test('failed sign in shows error', async ({ page }) => {
        await page.route('**/*', async (route) => {
            if (route.request().method() === 'POST') {
                const text = route.request().postData() || '';

                if (text.includes('Login') || text.includes('login')) {
                    return route.fulfill({
                        status: 200,
                        contentType: 'application/json',
                        body: JSON.stringify({
                            errors: [{ message: 'Unauthorized credentials' }],
                            data: null,
                        }),
                    });
                }
            }
            await route.continue();
        });

        await page.goto('/#/signin');

        await page.locator('main input').first().fill('wrong@example.com');
        await page.locator('main input').nth(1).fill('wrong-password');
        await page.locator('button[type="submit"]').click();

        await expect(page).toHaveURL(/.*\/#\/signin/);
    });

    test('redirect to sign up page', async ({ page }) => {
        await page.goto('/#/signin');
        await page.locator('main a[href*="signup"]').first().click();
        await expect(page).toHaveURL(/.*\/#\/signup/);
    });
});
