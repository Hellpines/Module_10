import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import axios from 'axios';
import { useNotesMutations } from './useNotesMutations';
import { graphqlRequest } from '../api/graphqlRequest';
import { Note } from '../types/notes/Note';

jest.mock('axios');
jest.mock('../api/graphqlRequest', () => ({
    graphqlRequest: jest.fn(),
}));
jest.mock('../utils/getAccessToken', () => ({
    getAccessToken: () => 'test-token',
}));

const mockShowNotifications = jest.fn();
jest.mock('./useNotification', () => ({
    useNotification: () => ({
        showNotifications: mockShowNotifications,
    }),
}));

interface TranslationOptions {
    id?: number;
}

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string, options?: TranslationOptions) =>
            options?.id ? `${key}_${options.id}` : key,
    }),
}));

describe('useNotesMutations hook', () => {
    let queryClient: QueryClient;
    let wrapper: React.FC<{ children: React.ReactNode }>;
    let invalidateQueriesSpy: jest.SpyInstance;

    const mockNote: Note = {
        id: 123,
        title: 'Test Note',
        content: 'Test Content',
        status: 'NOTES',
        userId: 1,
        items: [{ id: 1, text: 'Item 1', isCompleted: false }],
    };

    beforeEach(() => {
        jest.clearAllMocks();

        queryClient = new QueryClient({
            defaultOptions: {
                mutations: { retry: false },
            },
        });

        invalidateQueriesSpy = jest.spyOn(queryClient, 'invalidateQueries');

        wrapper = ({ children }) => (
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        );
    });

    test('createTodoMutation should clear items payload, send GraphQL request, invalidate cache and show success toast', async () => {
        (graphqlRequest as jest.Mock).mockResolvedValueOnce({ createTodo: mockNote });

        const { result } = renderHook(() => useNotesMutations(), { wrapper });

        result.current.createTodoMutation.mutate(mockNote);

        await waitFor(() => expect(result.current.createTodoMutation.isSuccess).toBe(true));

        expect(graphqlRequest).toHaveBeenCalledWith(
            expect.stringContaining('mutation DoCreateTodo'),
            {
                input: {
                    title: 'Test Note',
                    content: 'Test Content',
                    items: [{ text: 'Item 1' }],
                },
            },
            'test-token'
        );

        expect(invalidateQueriesSpy).toHaveBeenCalledWith({
            queryKey: ['notes'],
            exact: false,
        });

        expect(mockShowNotifications).toHaveBeenCalledWith(
            'notifications.createSuccess',
            'success'
        );
    });

    test('createTodoMutation should handle items fallback array when note items are undefined', async () => {
        const noteWithNoItems = { ...mockNote, items: undefined };
        (graphqlRequest as jest.Mock).mockResolvedValueOnce({ createTodo: noteWithNoItems });

        const { result } = renderHook(() => useNotesMutations(), { wrapper });
        result.current.createTodoMutation.mutate(noteWithNoItems);

        await waitFor(() => expect(result.current.createTodoMutation.isSuccess).toBe(true));

        expect(graphqlRequest).toHaveBeenCalledWith(
            expect.stringContaining('mutation DoCreateTodo'),
            {
                input: {
                    title: 'Test Note',
                    content: 'Test Content',
                    items: [],
                },
            },
            'test-token'
        );
    });

    test('createTodoMutation should show error notification on failure', async () => {
        (graphqlRequest as jest.Mock).mockRejectedValueOnce(new Error('GraphQL Error'));

        const { result } = renderHook(() => useNotesMutations(), { wrapper });

        result.current.createTodoMutation.mutate(mockNote);

        await waitFor(() => expect(result.current.createTodoMutation.isError).toBe(true));

        expect(mockShowNotifications).toHaveBeenCalledWith('notifications.createError', 'error');
        expect(invalidateQueriesSpy).not.toHaveBeenCalled();
    });

    test('updateTodoMutation should update todo, invalidate cache and show success notification', async () => {
        (graphqlRequest as jest.Mock).mockResolvedValueOnce({ updateTodo: mockNote });

        const { result } = renderHook(() => useNotesMutations(), { wrapper });
        result.current.updateTodoMutation.mutate(mockNote);

        await waitFor(() => expect(result.current.updateTodoMutation.isSuccess).toBe(true));

        expect(graphqlRequest).toHaveBeenCalledWith(
            expect.stringContaining('mutation UpdateTodo'),
            {
                id: mockNote.id,
                input: {
                    title: mockNote.title,
                    content: mockNote.content,
                    items: mockNote.items,
                },
            },
            'test-token'
        );
        expect(invalidateQueriesSpy).toHaveBeenCalled();
        expect(mockShowNotifications).toHaveBeenCalledWith(
            'notifications.updateSuccess',
            'success'
        );
    });

    test('updateTodoMutation should show error notification on failure', async () => {
        (graphqlRequest as jest.Mock).mockRejectedValueOnce(new Error('Update Error'));

        const { result } = renderHook(() => useNotesMutations(), { wrapper });
        result.current.updateTodoMutation.mutate(mockNote);

        await waitFor(() => expect(result.current.updateTodoMutation.isError).toBe(true));

        expect(mockShowNotifications).toHaveBeenCalledWith('notifications.updateError', 'error');
    });

    test('changeStatusMutation should support dynamic notification parameters based on status', async () => {
        (graphqlRequest as jest.Mock).mockResolvedValue({ changeTodoStatus: mockNote });

        const { result } = renderHook(() => useNotesMutations(), { wrapper });

        result.current.changeStatusMutation.mutate({ id: 123, newStatus: 'ARCHIVED' });
        await waitFor(() => expect(result.current.changeStatusMutation.isSuccess).toBe(true));
        expect(mockShowNotifications).toHaveBeenCalledWith(
            'notifications.archiveSuccess_123',
            'success'
        );

        result.current.changeStatusMutation.mutate({ id: 123, newStatus: 'TRASH' });
        await waitFor(() => expect(result.current.changeStatusMutation.status).toBe('success'));
        expect(mockShowNotifications).toHaveBeenCalledWith(
            'notifications.moveToTrashSuccess_123',
            'success'
        );

        result.current.changeStatusMutation.mutate({ id: 123, newStatus: 'NOTES' });
        await waitFor(() => expect(result.current.changeStatusMutation.status).toBe('success'));
        expect(mockShowNotifications).toHaveBeenCalledWith(
            'notifications.unarchiveSuccess_123',
            'success'
        );
    });

    test('changeStatusMutation should display corresponding error toast based on targets on failure', async () => {
        (graphqlRequest as jest.Mock).mockRejectedValue({ error: 'Failure' });

        const { result } = renderHook(() => useNotesMutations(), { wrapper });

        result.current.changeStatusMutation.mutate({ id: 123, newStatus: 'ARCHIVED' });
        await waitFor(() => expect(result.current.changeStatusMutation.isError).toBe(true));
        expect(mockShowNotifications).toHaveBeenCalledWith('notifications.archiveError', 'error');

        result.current.changeStatusMutation.mutate({ id: 123, newStatus: 'TRASH' });
        await waitFor(() => expect(result.current.changeStatusMutation.status).toBe('error'));
        expect(mockShowNotifications).toHaveBeenCalledWith(
            'notifications.moveToTrashError',
            'error'
        );

        result.current.changeStatusMutation.mutate({ id: 123, newStatus: 'NOTES' });
        await waitFor(() => expect(result.current.changeStatusMutation.status).toBe('error'));
        expect(mockShowNotifications).toHaveBeenCalledWith('notifications.unarchiveError', 'error');
    });

    test('unArchiveAllMutation should fetch archived todos via REST and bulk update them using Promise.all', async () => {
        const mockArchivedTodos = [{ id: 1 }, { id: 2 }];

        (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockArchivedTodos });
        (axios.post as jest.Mock).mockResolvedValue({ data: {} });

        const { result } = renderHook(() => useNotesMutations(), { wrapper });

        result.current.unArchiveAllMutation.mutate();

        await waitFor(() => expect(result.current.unArchiveAllMutation.isSuccess).toBe(true));

        expect(axios.get).toHaveBeenCalledWith('/api/todos?status=ARCHIVED', expect.any(Object));
        expect(axios.post).toHaveBeenCalledWith(
            '/api/todos/1/status',
            { newStatus: 'NOTES' },
            expect.any(Object)
        );
        expect(axios.post).toHaveBeenCalledWith(
            '/api/todos/2/status',
            { newStatus: 'NOTES' },
            expect.any(Object)
        );
        expect(axios.post).toHaveBeenCalledTimes(2);

        expect(invalidateQueriesSpy).toHaveBeenCalled();
        expect(mockShowNotifications).toHaveBeenCalledWith(
            'notifications.unarchiveAllSuccess',
            'success'
        );
    });

    test('unArchiveAllMutation should trigger error handler on failure', async () => {
        (axios.get as jest.Mock).mockRejectedValueOnce(new Error('Network Failure'));

        const { result } = renderHook(() => useNotesMutations(), { wrapper });
        result.current.unArchiveAllMutation.mutate();

        await waitFor(() => expect(result.current.unArchiveAllMutation.isError).toBe(true));
        expect(mockShowNotifications).toHaveBeenCalledWith(
            'notifications.unarchiveAllError',
            'error'
        );
    });

    test('deleteTodoMutation should execute structural GraphQL deletion, invalidate cache and trigger toast notifications', async () => {
        (graphqlRequest as jest.Mock).mockResolvedValueOnce({
            deleteTodo: { id: 123, success: true },
        });

        const { result } = renderHook(() => useNotesMutations(), { wrapper });
        result.current.deleteTodoMutation.mutate(123);

        await waitFor(() => expect(result.current.deleteTodoMutation.isSuccess).toBe(true));
        expect(graphqlRequest).toHaveBeenCalledWith(
            expect.stringContaining('mutation DeleteTodo'),
            { id: 123 },
            'test-token'
        );
        expect(invalidateQueriesSpy).toHaveBeenCalled();
        expect(mockShowNotifications).toHaveBeenCalledWith(
            'notifications.deleteForeverSuccess_123',
            'success'
        );
    });

    test('deleteTodoMutation should trigger error handler on failure', async () => {
        (graphqlRequest as jest.Mock).mockRejectedValueOnce(new Error('GraphQL Error'));

        const { result } = renderHook(() => useNotesMutations(), { wrapper });
        result.current.deleteTodoMutation.mutate(123);

        await waitFor(() => expect(result.current.deleteTodoMutation.isError).toBe(true));
        expect(mockShowNotifications).toHaveBeenCalledWith(
            'notifications.deleteForeverError',
            'error'
        );
    });

    test('deleteAllFromTrashMutation should collect and drop all matching entities from server endpoints', async () => {
        const mockTrashNotes = [{ id: 5 }, { id: 6 }];
        (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockTrashNotes });
        (axios.delete as jest.Mock).mockResolvedValue({ data: {} });

        const { result } = renderHook(() => useNotesMutations(), { wrapper });
        result.current.deleteAllFromTrashMutation.mutate();

        await waitFor(() => expect(result.current.deleteAllFromTrashMutation.isSuccess).toBe(true));
        expect(axios.get).toHaveBeenCalledWith('/api/todos?status=TRASH', expect.any(Object));
        expect(axios.delete).toHaveBeenCalledWith('/api/todos/5', expect.any(Object));
        expect(axios.delete).toHaveBeenCalledWith('/api/todos/6', expect.any(Object));
        expect(invalidateQueriesSpy).toHaveBeenCalled();
        expect(mockShowNotifications).toHaveBeenCalledWith(
            'notifications.clearTrashSuccess',
            'success'
        );
    });

    test('deleteAllFromTrashMutation should trigger error notification on failure', async () => {
        (axios.get as jest.Mock).mockRejectedValueOnce(new Error('Server Drop Error'));

        const { result } = renderHook(() => useNotesMutations(), { wrapper });
        result.current.deleteAllFromTrashMutation.mutate();

        await waitFor(() => expect(result.current.deleteAllFromTrashMutation.isError).toBe(true));
        expect(mockShowNotifications).toHaveBeenCalledWith(
            'notifications.clearTrashError',
            'error'
        );
    });

    test('toggleChecklistItemMutation should mutate specific checklist item and invalidate cache', async () => {
        (graphqlRequest as jest.Mock).mockResolvedValueOnce({ toggleChecklistItem: { id: 123 } });

        const { result } = renderHook(() => useNotesMutations(), { wrapper });

        result.current.toggleChecklistItemMutation.mutate({ noteId: 123, itemId: 1 });

        await waitFor(() =>
            expect(result.current.toggleChecklistItemMutation.isSuccess).toBe(true)
        );

        expect(graphqlRequest).toHaveBeenCalledWith(
            expect.stringContaining('mutation ToggleChecklistItem'),
            { todoId: 123, itemId: 1 },
            'test-token'
        );
        expect(invalidateQueriesSpy).toHaveBeenCalled();
    });

    test('uncheckAllItemsMutation should execute uncheck operation, invoke cache renewal, and send notification', async () => {
        (graphqlRequest as jest.Mock).mockResolvedValueOnce({ uncheckAllItems: { id: 123 } });

        const { result } = renderHook(() => useNotesMutations(), { wrapper });
        result.current.uncheckAllItemsMutation.mutate(123);

        await waitFor(() => expect(result.current.uncheckAllItemsMutation.isSuccess).toBe(true));
        expect(graphqlRequest).toHaveBeenCalledWith(
            expect.stringContaining('mutation UncheckAllItems'),
            { id: 123 },
            'test-token'
        );
        expect(invalidateQueriesSpy).toHaveBeenCalled();
        expect(mockShowNotifications).toHaveBeenCalledWith(
            'notifications.uncheckAllSuccess',
            'success'
        );
    });

    test('uncheckAllItemsMutation should trigger error notification on failure', async () => {
        (graphqlRequest as jest.Mock).mockRejectedValueOnce(new Error('Uncheck Failure'));

        const { result } = renderHook(() => useNotesMutations(), { wrapper });
        result.current.uncheckAllItemsMutation.mutate(123);

        await waitFor(() => expect(result.current.uncheckAllItemsMutation.isError).toBe(true));
        expect(mockShowNotifications).toHaveBeenCalledWith(
            'notifications.uncheckAllError',
            'error'
        );
    });

    test('updateTodoBackgroundMutation should apply background update and refresh note cache structure', async () => {
        (graphqlRequest as jest.Mock).mockResolvedValueOnce({
            updateTodoBackground: { id: 123, backgroundImage: 'url' },
        });

        const { result } = renderHook(() => useNotesMutations(), { wrapper });
        result.current.updateTodoBackgroundMutation.mutate({ id: 123, backgroundImage: 'url' });

        await waitFor(() =>
            expect(result.current.updateTodoBackgroundMutation.isSuccess).toBe(true)
        );
        expect(graphqlRequest).toHaveBeenCalledWith(
            expect.stringContaining('mutation SetTodoBackground'),
            { id: 123, backgroundImage: 'url' },
            'test-token'
        );
        expect(invalidateQueriesSpy).toHaveBeenCalled();
    });

    test('updateTodoBackgroundMutation should trigger error notification on failure', async () => {
        (graphqlRequest as jest.Mock).mockRejectedValueOnce(new Error('Background update error'));

        const { result } = renderHook(() => useNotesMutations(), { wrapper });
        result.current.updateTodoBackgroundMutation.mutate({ id: 123, backgroundImage: 'url' });

        await waitFor(() => expect(result.current.updateTodoBackgroundMutation.isError).toBe(true));
        expect(mockShowNotifications).toHaveBeenCalledWith(
            'notifications.updateBackgroundError',
            'error'
        );
    });

    test('updateAllBackgroundsMutation should execute complete background payload changes over axios endpoint', async () => {
        (axios.put as jest.Mock).mockResolvedValueOnce({ data: 'success-payload' });

        const { result } = renderHook(() => useNotesMutations(), { wrapper });
        result.current.updateAllBackgroundsMutation.mutate('base64');

        await waitFor(() =>
            expect(result.current.updateAllBackgroundsMutation.isSuccess).toBe(true)
        );
        expect(axios.put).toHaveBeenCalledWith(
            '/api/background',
            { backgroundImage: 'base64' },
            expect.any(Object)
        );
        expect(invalidateQueriesSpy).toHaveBeenCalled();
        expect(mockShowNotifications).toHaveBeenCalledWith(
            'notifications.updateAllBackgroundsSuccess',
            'success'
        );
    });

    test('updateAllBackgroundsMutation should trigger error notification on failure', async () => {
        (axios.put as jest.Mock).mockRejectedValueOnce(new Error('Axios PUT Error'));

        const { result } = renderHook(() => useNotesMutations(), { wrapper });
        result.current.updateAllBackgroundsMutation.mutate('base64');

        await waitFor(() => expect(result.current.updateAllBackgroundsMutation.isError).toBe(true));
        expect(mockShowNotifications).toHaveBeenCalledWith(
            'notifications.updateAllBackgroundsError',
            'error'
        );
    });
});
