import { test as base, expect, type Page } from '@playwright/test';

export const test = base.extend({
    page: async ({ page }: { page: Page }, use: (page: Page) => Promise<void>) => {
        page.setDefaultTimeout(20000);
        await use(page);
    },
});

export { expect };
export type { Page };
