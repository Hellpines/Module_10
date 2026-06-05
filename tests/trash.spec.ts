import { test, expect } from './helpers/test';
import { authenticatePage, gotoAppPage, navigateViaAside } from './helpers/auth';
import {
    clickActionsMenuItem,
    createNote,
    expectNoteHidden,
    expectNoteVisible,
    moveNoteToTrash,
    openActionsMenu,
} from './helpers/notes';

test.describe.configure({ mode: 'serial' });

test.describe('Trash Page', () => {
    test('should load trash page with bulk action button', async ({ page }) => {
        await authenticatePage(page);
        await gotoAppPage(page, '/trash');

        await expect(page.getByRole('button', { name: 'Delete all' })).toBeVisible();
    });

    test('should navigate from aside menu', async ({ page }) => {
        await authenticatePage(page);

        await navigateViaAside(page, 'Trash');

        await expect(page).toHaveURL(/\/#\/trash/);
        await expect(page.getByRole('button', { name: 'Delete all' })).toBeVisible();
    });

    test('should delete a note forever via actions menu', async ({ page }) => {
        await authenticatePage(page);

        await createNote(page, 'Trash delete target', 'Note for permanent delete');
        await moveNoteToTrash(page, 'Trash delete target');

        await gotoAppPage(page, '/trash');
        await expectNoteVisible(page, /Trash delete target/i);

        await openActionsMenu(page, /Trash delete target/i);
        await clickActionsMenuItem(page, /Trash delete target/i, 'Delete forever');

        await expectNoteHidden(page, /Trash delete target/i);
    });

    test('should delete all notes via bulk button', async ({ page }) => {
        await authenticatePage(page);

        await createNote(page, 'Bulk trash one', 'First bulk trash note');
        await createNote(page, 'Bulk trash two', 'Second bulk trash note');
        await moveNoteToTrash(page, 'Bulk trash one');
        await moveNoteToTrash(page, 'Bulk trash two');

        await gotoAppPage(page, '/trash');
        await expect(page.getByRole('button', { name: 'Delete all' })).toBeEnabled();

        await page.getByRole('button', { name: 'Delete all' }).click();

        await expect(page.getByText('Trash has been cleared successfully!')).toBeVisible({
            timeout: 15000,
        });
    });

    test('should archive a note from trash via actions menu', async ({ page }) => {
        await authenticatePage(page);

        await createNote(page, 'Trash archive target', 'Note to restore via archive');
        await moveNoteToTrash(page, 'Trash archive target');

        await gotoAppPage(page, '/trash');
        await expectNoteVisible(page, /Trash archive target/i);

        await openActionsMenu(page, /Trash archive target/i);
        await clickActionsMenuItem(page, /Trash archive target/i, 'Archive');

        await expectNoteHidden(page, /Trash archive target/i);

        await gotoAppPage(page, '/archived');
        await expectNoteVisible(page, /Trash archive target/i);
    });
});
