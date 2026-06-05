import type { Page } from '@playwright/test';
import type { Note } from '../../src/types/notes/Note';
import { MOCK_TOKEN, MOCK_USER } from './mockData';
import {
    parseGraphQLVariables,
    ChangeTodoStatusVariables,
    DeleteTodoVariables,
    UpdateProfileVariables,
    UpdateTodoVariables,
} from './graphqlTypes';

export async function setupGraphQLMocks(page: Page) {
    await page.route('**/*', async (route) => {
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
            const createTodo: Note = {
                id: 999,
                userId: MOCK_USER.id,
                title: 'Buy groceries',
                content: 'Milk, bread, cheese',
                status: 'NOTES',
                items: [],
            };

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

        await route.continue();
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

        if (/\/api\/todos\/\d+\/status$/.test(url.pathname)) {
            return route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({ success: true }),
            });
        }

        if (/\/api\/todos\/\d+$/.test(url.pathname)) {
            return route.fulfill({
                status: 200,
                body: JSON.stringify({ success: true }),
            });
        }

        await route.continue();
    });
}
