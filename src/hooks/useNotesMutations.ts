import axios from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Note } from '../types/notes/Note';
import { graphqlRequest } from '../api/graphqlRequest';
import { getAccessToken } from '../utils/getAccessToken';
import { useNotification } from './useNotification';

export const useNotesMutations = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const { showNotification } = useNotification();

    const invalidateNotes = () => {
        queryClient.invalidateQueries({
            queryKey: ['notes'],
            exact: false,
        });
    };

    const createTodoMutation = useMutation({
        mutationFn: async (note: Note) => {
            const cleanItems =
                note.items?.map((item) => {
                    return { text: item.text };
                }) || [];

            const data = await graphqlRequest<{ createTodo: Note }>(
                `
                    mutation DoCreateTodo($input: CreateTodoInput!) { 
                        createTodo(input: $input) { 
                            id 
                            title 
                            content 
                            status 
                            items { 
                                id 
                                text 
                                isCompleted 
                            } 
                        }
                    }
                `,
                {
                    input: {
                        title: note.title,
                        content: note.content,
                        items: cleanItems,
                    },
                },
                getAccessToken()
            );

            return data.createTodo;
        },

        onSuccess: () => {
            invalidateNotes();

            showNotification(t('notifications.createSuccess'), 'success');
        },
        onError: () => {
            showNotification(t('notifications.createError'), 'error');
        },
    });

    const updateTodoMutation = useMutation({
        mutationFn: async (updatedNote: Note) => {
            const data = await graphqlRequest<{ updateTodo: Note }>(
                `
                    mutation UpdateTodo($id: Int, $input: UpdateTodoInput) {
                        updateTodo(id: $id, input: $input) {
                            id
                            title
                            content
                            status
                        }
                    }
                `,
                {
                    id: updatedNote.id,
                    input: {
                        title: updatedNote.title,
                        content: updatedNote.content,
                        items: updatedNote.items,
                    },
                },
                getAccessToken()
            );

            return data.updateTodo;
        },

        onSuccess: () => {
            invalidateNotes();

            showNotification(t('notifications.updateSuccess'), 'success');
        },
        onError: () => {
            showNotification(t('notifications.updateError'), 'error');
        },
    });

    const changeStatusMutation = useMutation({
        mutationFn: async ({
            id,
            newStatus,
        }: {
            id: number;
            newStatus: 'TRASH' | 'ARCHIVED' | 'NOTES';
        }) => {
            const data = await graphqlRequest<{ changeTodoStatus: Note }>(
                `
                    mutation ChangeTodoStatus($id: Int, $newStatus: NoteStatus) {
                        changeTodoStatus(id: $id, newStatus: $newStatus) { 
                            id 
                            status 
                        }
                    }
                `,
                {
                    id,
                    newStatus,
                },
                getAccessToken()
            );

            return {
                data: data.changeTodoStatus,
                newStatus,
            };
        },
        onSuccess: (_, variables) => {
            invalidateNotes();

            const messages = {
                TRASH: t('notifications.moveToTrashSuccess', { id: variables.id }),
                ARCHIVED: t('notifications.archiveSuccess', { id: variables.id }),
                NOTES: t('notifications.unarchiveSuccess', { id: variables.id }),
            };

            showNotification(messages[variables.newStatus], 'success');
        },
        onError: (_, variables) => {
            const errors = {
                TRASH: t('notifications.moveToTrashError'),
                ARCHIVED: t('notifications.archiveError'),
                NOTES: t('notifications.unarchiveError'),
            };

            showNotification(errors[variables.newStatus], 'error');
        },
    });

    const unArchiveAllMutation = useMutation({
        mutationFn: async () => {
            const token = getAccessToken();

            const response = await axios.get('/api/todos?status=ARCHIVED', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const archivedNotes = response.data;

            await Promise.all(
                archivedNotes.map((note: Note) =>
                    axios.post(
                        `/api/todos/${note.id}/status`,
                        { newStatus: 'NOTES' },
                        { headers: { Authorization: `Bearer ${token}` } }
                    )
                )
            );
        },
        onSuccess: () => {
            invalidateNotes();

            showNotification(t('notifications.unarchiveAllSuccess'), 'success');
        },
        onError: () => {
            showNotification(t('notifications.unarchiveAllError'), 'error');
        },
    });

    const deleteTodoMutation = useMutation({
        mutationFn: async (id: number) => {
            const data = await graphqlRequest<{ deleteTodo: { id: number; success: boolean } }>(
                `
                    mutation DeleteTodo($id: Int) {
                        deleteTodo(id: $id) {
                            id
                            success
                        }
                    }
                `,
                {
                    id,
                },
                getAccessToken()
            );

            return data.deleteTodo;
        },

        onSuccess: async (_, id) => {
            invalidateNotes();

            showNotification(t('notifications.deleteForeverSuccess', { id }), 'success');
        },

        onError: () => {
            showNotification(t('notifications.deleteForeverError'), 'error');
        },
    });

    const deleteAllFromTrashMutation = useMutation({
        mutationFn: async () => {
            const token = getAccessToken();

            const response = await axios.get('/api/todos?status=TRASH', {
                headers: { Authorization: `Bearer ${token}` },
            });

            const trashNotes = response.data;

            await Promise.all(
                trashNotes.map((note: Note) =>
                    axios.delete(`/api/todos/${note.id}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                )
            );
        },
        onSuccess: () => {
            invalidateNotes();

            showNotification(t('notifications.clearTrashSuccess'), 'success');
        },
        onError: () => {
            showNotification(t('notifications.clearTrashError'), 'error');
        },
    });

    const toggleChecklistItemMutation = useMutation({
        mutationFn: async ({ noteId, itemId }: { noteId: number; itemId: number }) => {
            const data = await graphqlRequest<{ toggleChecklistItem: Note }>(
                `
                    mutation ToggleChecklistItem($todoId: Int, $itemId: Int) {
                        toggleChecklistItem(todoId: $todoId, itemId: $itemId) {
                            id
                        }
                    }
                `,
                {
                    todoId: noteId,
                    itemId,
                },
                getAccessToken()
            );

            return data.toggleChecklistItem;
        },

        onSuccess: () => {
            invalidateNotes();
        },
    });

    const uncheckAllItemsMutation = useMutation({
        mutationFn: async (noteId: number) => {
            const data = await graphqlRequest<{ uncheckAllItems: Note }>(
                `
                    mutation UncheckAllItems($id: Int) {
                        uncheckAllItems(id: $id) {
                            id
                        }
                    }
                `,
                {
                    id: noteId,
                },
                getAccessToken()
            );

            return data.uncheckAllItems;
        },

        onSuccess: () => {
            invalidateNotes();

            showNotification(t('notifications.uncheckAllSuccess'), 'success');
        },

        onError: () => {
            showNotification(t('notifications.uncheckAllError'), 'error');
        },
    });

    const updateTodoBackgroundMutation = useMutation({
        mutationFn: async ({ id, backgroundImage }: { id: number; backgroundImage: string }) => {
            const data = await graphqlRequest<{ updateTodoBackground: Note }>(
                `
                mutation SetTodoBackground($id: Int!, $backgroundImage: String!) {
                    updateTodoBackground(id: $id, backgroundImage: $backgroundImage) {
                        id
                        backgroundImage
                    }
                }
            `,
                {
                    id,
                    backgroundImage,
                },
                getAccessToken()
            );

            return data.updateTodoBackground;
        },
        onSuccess: (_) => {
            invalidateNotes();
        },
        onError: () => {
            showNotification(t('notifications.updateBackgroundError'), 'error');
        },
    });

    const updateAllBackgroundsMutation = useMutation({
        mutationFn: async (base64String: string) => {
            const response = await axios.put(
                '/api/background',
                {
                    backgroundImage: base64String,
                },
                {
                    headers: {
                        Authorization: `Bearer ${getAccessToken()}`,
                    },
                }
            );

            return response.data;
        },
        onSuccess: () => {
            invalidateNotes();

            showNotification(t('notifications.updateAllBackgroundsSuccess'), 'success');
        },
        onError: () => {
            showNotification(t('notifications.updateAllBackgroundsError'), 'error');
        },
    });

    return {
        createTodoMutation,
        updateTodoMutation,
        changeStatusMutation,
        unArchiveAllMutation,
        deleteTodoMutation,
        deleteAllFromTrashMutation,
        toggleChecklistItemMutation,
        uncheckAllItemsMutation,
        updateTodoBackgroundMutation,
        updateAllBackgroundsMutation,
    };
};
