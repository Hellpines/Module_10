import { test, expect } from './helpers/test';
import { authenticatePage, gotoAppPage, navigateViaAside } from './helpers/auth';
import {
    clickActionsMenuItem,
    expectNoteHidden,
    expectNoteVisible,
    openActionsMenu,
} from './helpers/notes';

test.describe.configure({ mode: 'serial' });

test.describe('Archived Page', () => {
    test('should load archived page with bulk action button', async ({ page }) => {
        await authenticatePage(page);
        await gotoAppPage(page, '/archived');

        await expect(page.getByRole('button', { name: 'Unarchive all' })).toBeVisible();
    });

    test('should navigate from aside menu', async ({ page }) => {
        await authenticatePage(page);

        await navigateViaAside(page, 'Archive');

        await expect(page).toHaveURL(/\/#\/archived/);
        await expect(page.getByRole('button', { name: 'Unarchive all' })).toBeVisible();
    });

    test('should unarchive a single note via actions menu', async ({ page }) => {
        await authenticatePage(page);

        await openActionsMenu(page, /Ideas for Next Sprint/i);
        await clickActionsMenuItem(page, /Ideas for Next Sprint/i, 'Archive');
        await expectNoteHidden(page, /Ideas for Next Sprint/i);

        await gotoAppPage(page, '/archived');
        await expectNoteVisible(page, /Ideas for Next Sprint/i);

        await openActionsMenu(page, /Ideas for Next Sprint/i);
        await clickActionsMenuItem(page, /Ideas for Next Sprint/i, 'Unarchive');

        await expectNoteHidden(page, /Ideas for Next Sprint/i);

        await gotoAppPage(page, '/');
        await expectNoteVisible(page, /Ideas for Next Sprint/i);
    });

    test('should unarchive all notes via bulk button', async ({ page }) => {
        await authenticatePage(page);

        await openActionsMenu(page, /Learning Design System Basics/i);
        await clickActionsMenuItem(page, /Learning Design System Basics/i, 'Archive');
        await expectNoteHidden(page, /Learning Design System Basics/i);

        await openActionsMenu(page, /Weekly Project Report/i);
        await clickActionsMenuItem(page, /Weekly Project Report/i, 'Archive');

        await gotoAppPage(page, '/archived');
        await expect(page.getByRole('button', { name: 'Unarchive all' })).toBeEnabled();

        await page.getByRole('button', { name: 'Unarchive all' }).click();

        await expect(page.getByText('All notes have been unarchived successfully!')).toBeVisible({
            timeout: 15000,
        });
        await expectNoteHidden(page, /Learning Design System Basics/i);
        await expectNoteHidden(page, /Weekly Project Report/i);
    });
});
