import { expect, type Page } from '@playwright/test';

export type NoteMatch = RegExp | string;

export function getNoteCard(page: Page, noteName: NoteMatch) {
    return page.getByRole('button', { name: noteName }).filter({
        has: page.getByRole('button', { name: 'Note actions menu' }),
    });
}

export async function openActionsMenu(page: Page, noteName: NoteMatch) {
    const noteCard = getNoteCard(page, noteName);
    await noteCard.scrollIntoViewIfNeeded();
    const menuButton = noteCard.getByRole('button', { name: 'Note actions menu' });
    await expect(menuButton).toBeVisible();

    await expect
        .poll(async () => {
            if (await noteCard.getByRole('menu', { name: 'Actions menu' }).isVisible()) {
                return true;
            }
            await menuButton.click();
            return noteCard.getByRole('menu', { name: 'Actions menu' }).isVisible();
        })
        .toBe(true);
}

export async function clickActionsMenuItem(page: Page, noteName: NoteMatch, itemName: string) {
    const noteCard = getNoteCard(page, noteName);
    await noteCard.getByRole('menuitem', { name: itemName }).click();
}

export async function openNoteEditDialog(page: Page, noteName: NoteMatch) {
    await page.getByRole('button', { name: noteName }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.getByRole('dialog').getByRole('button', { name: 'Edit mode' }).click();
}

export async function expectNoteVisible(page: Page, noteName: NoteMatch) {
    await expect(page.getByRole('button', { name: noteName })).toBeVisible();
}

export async function expectNoteHidden(page: Page, noteName: NoteMatch) {
    await expect(page.getByRole('button', { name: noteName })).toBeHidden();
}

export async function createNote(page: Page, title: string, content: string) {
    await page.getByRole('button', { name: 'Create a note' }).click();
    await page.locator('#title').fill(title);
    await page.locator('#description').fill(content);
    const createButton = page.getByRole('dialog').getByRole('button', { name: 'Create' });
    await createButton.scrollIntoViewIfNeeded();
    await createButton.click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
}

export async function moveNoteToTrash(page: Page, title: string) {
    const noteMatcher = new RegExp(title, 'i');

    await openActionsMenu(page, noteMatcher);
    await clickActionsMenuItem(page, noteMatcher, 'Delete note');
    await expectNoteHidden(page, noteMatcher);
}
