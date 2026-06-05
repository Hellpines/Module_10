import { expect, type Page } from '@playwright/test';
import { setupGraphQLMocks } from './apiMocks';

export async function clearAuthStorage(page: Page) {
    await page.addInitScript(() => {
        window.localStorage.removeItem('access_token');
    });
}

export async function waitForAppReady(page: Page) {
    await expect(page.getByText('Loading application...')).toBeHidden({ timeout: 30000 });
}

export async function waitForAuthenticated(page: Page) {
    await waitForAppReady(page);
    await expect(page.getByRole('heading', { name: /You need to sign in/i })).toBeHidden({
        timeout: 30000,
    });
    await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible({
        timeout: 30000,
    });
}

export async function loginViaUI(page: Page) {
    await clearAuthStorage(page);
    await setupGraphQLMocks(page);

    await page.goto('/#/signin', { waitUntil: 'domcontentloaded' });
    await waitForAppReady(page);

    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();

    await page.locator('#email').fill('helena.hills@social.com');
    await page.locator('#password').fill('password789');

    await page.getByRole('button', { name: 'Sign In' }).click();

    await expect(page).toHaveURL(/\/#\/$/, { timeout: 30000 });
    await expect
        .poll(async () => page.evaluate(() => localStorage.getItem('access_token')), {
            timeout: 15000,
        })
        .not.toBeNull();

    await waitForAuthenticated(page);
}

export async function authenticatePage(page: Page) {
    await loginViaUI(page);
}

function isOnAppPath(pageUrl: string, path: string) {
    if (path === '/') {
        return /\/#\/$/.test(pageUrl) || pageUrl.endsWith('/#/');
    }

    return pageUrl.includes(`#${path.startsWith('/') ? path : `/${path}`}`);
}

export async function gotoAppPage(page: Page, path = '/') {
    if (!isOnAppPath(page.url(), path)) {
        const hashPath = path === '/' ? '/#/' : `/#${path.startsWith('/') ? path : `/${path}`}`;
        await page.goto(hashPath, { waitUntil: 'domcontentloaded' });
    }

    await waitForAuthenticated(page);
}

export async function navigateViaAside(page: Page, linkName: string) {
    let nav = page.getByRole('navigation', { name: 'Main navigation' });

    if (!(await nav.isVisible())) {
        await page.getByRole('button', { name: 'Toggle navigation menu' }).click();
        nav = page
            .getByRole('dialog', { name: 'Mobile navigation' })
            .getByRole('navigation', { name: 'Main navigation' });
    }

    await nav.getByRole('link', { name: linkName }).click();
    await waitForAppReady(page);
}
