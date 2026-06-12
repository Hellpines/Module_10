'use client';

import { expect, type Page } from '@playwright/test';

export async function clearAuthStorage(page: Page) {
    await page.evaluate(() => {
        localStorage.removeItem('access_token');
        localStorage.setItem('i18nextLng', 'en');
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
    await page.goto('/signin', { waitUntil: 'domcontentloaded' });
    await clearAuthStorage(page);
    await page.reload({ waitUntil: 'domcontentloaded' });

    const signInButton = page.getByRole('button', { name: 'Sign In' });
    await expect(signInButton).toBeVisible({ timeout: 30000 });

    await page.locator('#email').fill('helena.hills@social.com');
    await page.locator('#password').fill('password789');

    await signInButton.click();

    await expect(page.getByRole('navigation', { name: 'Main navigation' })).toBeVisible({
        timeout: 30000,
    });
}

export async function authenticatePage(page: Page) {
    await loginViaUI(page);
}

function isOnAppPath(pageUrl: string, path: string) {
    const url = new URL(pageUrl);

    if (path === '/') {
        return url.pathname === '/';
    }

    return url.pathname === (path.startsWith('/') ? path : `/${path}`);
}

export async function gotoAppPage(page: Page, path = '/') {
    if (!isOnAppPath(page.url(), path)) {
        const appPath = path === '/' ? '/' : path.startsWith('/') ? path : `/${path}`;
        await page.goto(appPath, { waitUntil: 'domcontentloaded' });
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

    const currentUrl = page.url();
    const link = nav.getByRole('link', { name: linkName });

    await expect(link).toBeVisible();
    await link.click();

    await page.waitForURL((url) => url.toString() !== currentUrl, { timeout: 30000 });
    await waitForAppReady(page);
    await waitForAuthenticated(page);
}
