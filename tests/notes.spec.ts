import { test, expect } from './helpers/test';
import { authenticatePage } from './helpers/auth';
import {
    clickActionsMenuItem,
    expectNoteHidden,
    expectNoteVisible,
    openActionsMenu,
    openNoteEditDialog,
} from './helpers/notes';

test.describe.configure({ mode: 'serial' });

test.describe('Notes Page', () => {
    test('should display notes for authenticated user', async ({ page }) => {
        await authenticatePage(page);

        await expect(page.getByRole('button', { name: 'Create a note' })).toBeVisible();
        await expect(page.getByRole('button', { name: /Weekly Project Report/i })).toBeVisible();
    });

    test('should successfully create a new note', async ({ page }) => {
        await authenticatePage(page);

        await page.getByRole('button', { name: 'Create a note' }).click();
        await expect(page.getByRole('dialog')).toBeVisible();

        await page.locator('#title').fill('Buy groceries');
        await page.locator('#description').fill('Milk, bread, cheese');
        const createButton = page.getByRole('dialog').getByRole('button', { name: 'Create' });
        await createButton.scrollIntoViewIfNeeded();
        await createButton.click();

        await expect(page.getByRole('dialog')).not.toBeVisible();
    });

    test('should successfully edit a note', async ({ page }) => {
        await authenticatePage(page);

        await openNoteEditDialog(page, /Schedule a Dentist Appointment/i);
        await page.locator('#title').fill('Dentist visit rescheduled');
        await page.getByRole('dialog').getByRole('button', { name: 'Edit' }).click();

        await expect(page.getByRole('dialog')).not.toBeVisible();
        await expectNoteVisible(page, /Dentist visit rescheduled/i);
    });

    test('should archive a note via actions menu', async ({ page }) => {
        await authenticatePage(page);

        await openActionsMenu(page, /Grocery Shopping List/i);
        await clickActionsMenuItem(page, /Grocery Shopping List/i, 'Archive');

        await expectNoteHidden(page, /Grocery Shopping List/i);
    });

    test('should move a note to trash via actions menu', async ({ page }) => {
        await authenticatePage(page);

        await openActionsMenu(page, /Pay Monthly Bills/i);
        await clickActionsMenuItem(page, /Pay Monthly Bills/i, 'Delete note');

        await expectNoteHidden(page, /Pay Monthly Bills/i);
    });

    test('should show and hide checkboxes on a note', async ({ page }) => {
        await authenticatePage(page);

        await page.getByRole('button', { name: 'Create a note' }).click();
        await page.locator('#title').fill('E2E checklist note');
        await page.locator('#description').fill('Checklist body text');
        await page.getByRole('dialog').getByRole('button', { name: 'Add item' }).click();
        await page.getByRole('dialog').getByPlaceholder('Add list item...').fill('Buy milk');
        const createButton = page.getByRole('dialog').getByRole('button', { name: 'Create' });
        await createButton.scrollIntoViewIfNeeded();
        await createButton.click();
        await expect(page.getByRole('dialog')).not.toBeVisible();

        const noteCard = page.getByRole('button', { name: /E2E checklist note/i });

        await openActionsMenu(page, /E2E checklist note/i);
        await clickActionsMenuItem(page, /E2E checklist note/i, 'Show checkboxes');

        await expect(noteCard.getByRole('checkbox')).toBeVisible();

        await openActionsMenu(page, /E2E checklist note/i);

        await page.getByRole('menuitem', { name: 'Hide checkboxes' }).click();

        await expect(noteCard.getByRole('checkbox')).toBeHidden();
        await expect(noteCard.getByText('Checklist body text')).toBeVisible();
    });
});
