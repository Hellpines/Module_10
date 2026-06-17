import type { Page } from '@playwright/test';
import type { Note } from '../../src/types/notes/Note';
import { MOCK_TOKEN, MOCK_USER, MOCK_NOTES } from './mockData';
import {
    parseGraphQLVariables,
    ChangeTodoStatusVariables,
    CreateTodoVariables,
    DeleteTodoVariables,
    UpdateProfileVariables,
    UpdateTodoVariables,
} from './graphqlTypes';

const notesByStatus = {
    NOTES: [...MOCK_NOTES.NOTES],
    ARCHIVED: [...MOCK_NOTES.ARCHIVED],
    TRASH: [...MOCK_NOTES.TRASH],
};

function resetMockNotes() {
    notesByStatus.NOTES = [...MOCK_NOTES.NOTES];
    notesByStatus.ARCHIVED = [...MOCK_NOTES.ARCHIVED];
    notesByStatus.TRASH = [...MOCK_NOTES.TRASH];
}

function moveNoteToStatus(id: number, newStatus: Note['status']) {
    const allNotes = [...notesByStatus.NOTES, ...notesByStatus.ARCHIVED, ...notesByStatus.TRASH];
    const note = allNotes.find((item) => item.id === id);

    if (!note) {
        return null;
    }

    notesByStatus.NOTES = notesByStatus.NOTES.filter((item) => item.id !== id);
    notesByStatus.ARCHIVED = notesByStatus.ARCHIVED.filter((item) => item.id !== id);
    notesByStatus.TRASH = notesByStatus.TRASH.filter((item) => item.id !== id);

    const updatedNote = { ...note, status: newStatus };

    if (newStatus === 'ARCHIVED') {
        notesByStatus.ARCHIVED = [updatedNote, ...notesByStatus.ARCHIVED];
    } else if (newStatus === 'TRASH') {
        notesByStatus.TRASH = [updatedNote, ...notesByStatus.TRASH];
    } else {
        notesByStatus.NOTES = [updatedNote, ...notesByStatus.NOTES];
    }

    return updatedNote;
}

function getNotesForStatus(status: string) {
    if (status === 'NOTES' || status === 'active') {
        return notesByStatus.NOTES;
    }

    if (status === 'ARCHIVED') {
        return notesByStatus.ARCHIVED;
    }

    if (status === 'TRASH') {
        return notesByStatus.TRASH;
    }

    return [];
}

export async function setupGraphQLMocks(page: Page) {
    resetMockNotes();

    await page.route('**/api/graphql', async (route) => {
        if (route.request().method() !== 'POST') {
            await route.continue();
            return;
        }

        const text = route.request().postData() || '';

        if (text.includes('mutation Login') || text.includes('login(email')) {
            return route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    data: {
                        login: {
                            token: MOCK_TOKEN,
                            user: MOCK_USER,
                        },
                    },
                }),
            });
        }

        if (text.includes('query GetMe') || text.includes('GetMe')) {
            return route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    data: { me: MOCK_USER },
                }),
            });
        }

        if (text.includes('mutation Logout')) {
            return route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    data: { logout: { message: 'ok' } },
                }),
            });
        }

        if (text.includes('mutation UpdateProfile')) {
            const { input = {} } = parseGraphQLVariables<UpdateProfileVariables>(
                route.request().postData()
            );

            return route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    data: {
                        updateProfile: {
                            ...MOCK_USER,
                            ...input,
                        },
                    },
                }),
            });
        }

        if (
            text.includes('DoCreateTodo') ||
            (text.includes('mutation') && text.includes('createTodo'))
        ) {
            const { input } = parseGraphQLVariables<CreateTodoVariables>(
                route.request().postData()
            );

            const createTodo: Note = {
                id: Date.now(),
                userId: MOCK_USER.id,
                title: input?.title ?? 'New note',
                content: input?.content ?? '',
                status: 'NOTES',
                items: (input?.items ?? []).map((item, index) => ({
                    id: Date.now() + index + 1,
                    text: item.text,
                    isCompleted: false,
                })),
            };

            notesByStatus.NOTES = [createTodo, ...notesByStatus.NOTES];

            return route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    data: {
                        createTodo,
                    },
                }),
            });
        }

        if (text.includes('UpdateTodo')) {
            const variables = parseGraphQLVariables<UpdateTodoVariables>(
                route.request().postData()
            );
            const id = variables.id ?? 1;
            const input = variables.input;

            const updateTodo: Note = {
                id,
                userId: MOCK_USER.id,
                title: input?.title ?? 'Updated note',
                content: input?.content ?? '',
                status: 'NOTES',
                items: input?.items ?? [],
            };

            notesByStatus.NOTES = notesByStatus.NOTES.map((note) =>
                note.id === id ? { ...note, ...updateTodo } : note
            );

            return route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    data: {
                        updateTodo,
                    },
                }),
            });
        }

        if (text.includes('ChangeTodoStatus')) {
            const { id = 1, newStatus = 'ARCHIVED' } =
                parseGraphQLVariables<ChangeTodoStatusVariables>(route.request().postData());

            moveNoteToStatus(id, newStatus);

            return route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    data: {
                        changeTodoStatus: { id, status: newStatus },
                    },
                }),
            });
        }

        if (text.includes('DeleteTodo')) {
            const { id = 1 } = parseGraphQLVariables<DeleteTodoVariables>(
                route.request().postData()
            );

            notesByStatus.NOTES = notesByStatus.NOTES.filter((note) => note.id !== id);
            notesByStatus.ARCHIVED = notesByStatus.ARCHIVED.filter((note) => note.id !== id);
            notesByStatus.TRASH = notesByStatus.TRASH.filter((note) => note.id !== id);

            return route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    data: { deleteTodo: { id, success: true } },
                }),
            });
        }

        if (text.includes('ToggleChecklistItem')) {
            return route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    data: { toggleChecklistItem: { id: 1 } },
                }),
            });
        }

        if (text.includes('UncheckAllItems')) {
            return route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    data: { uncheckAllItems: { id: 1 } },
                }),
            });
        }

        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({ data: {} }),
        });
    });

    await page.route(/\/api\/(todos|background)/, async (route) => {
        const request = route.request();
        const url = new URL(request.url());

        if (url.pathname === '/api/background') {
            return route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ success: true }),
            });
        }

        if (url.pathname === '/api/todos' && request.method() === 'GET') {
            const status = url.searchParams.get('status') ?? 'NOTES';

            return route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify(getNotesForStatus(status)),
            });
        }

        if (/\/api\/todos\/(\d+)\/status$/.test(url.pathname) && request.method() === 'POST') {
            const id = Number(url.pathname.match(/\/api\/todos\/(\d+)\/status$/)?.[1]);
            const body = request.postDataJSON() as { newStatus?: Note['status'] };
            const newStatus = body.newStatus ?? 'NOTES';

            moveNoteToStatus(id, newStatus);

            return route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ id, status: newStatus }),
            });
        }

        if (/\/api\/todos\/(\d+)$/.test(url.pathname) && request.method() === 'DELETE') {
            const id = Number(url.pathname.match(/\/api\/todos\/(\d+)$/)?.[1]);

            notesByStatus.NOTES = notesByStatus.NOTES.filter((note) => note.id !== id);
            notesByStatus.ARCHIVED = notesByStatus.ARCHIVED.filter((note) => note.id !== id);
            notesByStatus.TRASH = notesByStatus.TRASH.filter((note) => note.id !== id);

            return route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ id, success: true }),
            });
        }

        await route.continue();
    });
}
