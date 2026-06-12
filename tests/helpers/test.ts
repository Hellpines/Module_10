import { test as base, expect, type Page } from '@playwright/test';
import { setupGraphQLMocks } from './apiMocks';

export const test = base.extend({
    page: async ({ page }: { page: Page }, use: (page: Page) => Promise<void>) => {
        page.setDefaultTimeout(20000);
        await setupGraphQLMocks(page);
        await use(page);
    },
});

export { expect };
export type { Page };
