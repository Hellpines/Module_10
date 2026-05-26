import { createContext, useCallback, useState, useEffect, useMemo } from 'react';
import { Note } from '../types/notes/Note';
import { NotesContextParts } from '../types/context/NotesContextParts';
import { ProviderProps } from '../types/props/ProviderProps';
import { useNotesMutations } from '../hooks/useNotesMutations';

export const NotesContext = createContext<NotesContextParts | null>(null);

export const NotesProvider = ({ children }: ProviderProps) => {
    const [view, setView] = useState<'grid' | 'list'>(() => {
        const savedTheme = localStorage.getItem('notes-view');
        return savedTheme === 'grid' || savedTheme === 'list' ? savedTheme : 'grid';
    });

    const handleView = useCallback(() => {
        setView((prev) => {
            return prev === 'grid' ? 'list' : 'grid';
        });
    }, []);

    useEffect(() => {
        localStorage.setItem('notes-view', view);
    }, [view]);

    const mutations = useNotesMutations();

    const createTodo = useCallback(
        (note: Note) => {
            mutations.createTodoMutation.mutate(note);
        },
        [mutations.createTodoMutation]
    );

    const updateTodo = useCallback(
        (note: Note) => {
            mutations.updateTodoMutation.mutate(note);
        },
        [mutations.updateTodoMutation]
    );

    const moveToTrash = useCallback(
        (id: number) => {
            mutations.changeStatusMutation.mutate({ id, newStatus: 'TRASH' });
        },
        [mutations.changeStatusMutation]
    );

    const addToArchive = useCallback(
        (id: number) => {
            mutations.changeStatusMutation.mutate({ id, newStatus: 'ARCHIVED' });
        },
        [mutations.changeStatusMutation]
    );

    const removeFromArchive = useCallback(
        (noteId: number) => {
            mutations.changeStatusMutation.mutate({ id: noteId, newStatus: 'NOTES' });
        },
        [mutations.changeStatusMutation]
    );

    const unarchiveAll = useCallback(() => {
        mutations.unArchiveAllMutation.mutate();
    }, [mutations.unArchiveAllMutation]);

    const deleteTodo = useCallback(
        (id: number) => {
            mutations.deleteTodoMutation.mutate(id);
        },
        [mutations.deleteTodoMutation]
    );

    const deleteAllFromTrash = useCallback(() => {
        mutations.deleteAllFromTrashMutation.mutate();
    }, [mutations.deleteAllFromTrashMutation]);

    const toggleChecklistItem = useCallback(
        (noteId: number, itemId: number) => {
            mutations.toggleChecklistItemMutation.mutate({ noteId, itemId });
        },
        [mutations.toggleChecklistItemMutation]
    );

    const uncheckAllItems = useCallback(
        (id: number) => {
            mutations.uncheckAllItemsMutation.mutate(id);
        },
        [mutations.uncheckAllItemsMutation]
    );

    const updateTodoBackground = useCallback(
        (id: number, backgroundImage: string) => {
            mutations.updateTodoBackgroundMutation.mutate({ id, backgroundImage });
        },
        [mutations.updateTodoBackgroundMutation]
    );

    const updateAllTodosBackground = useCallback(
        (backgroundColor: string) => {
            mutations.updateAllBackgroundsMutation.mutate(backgroundColor);
        },
        [mutations.updateAllBackgroundsMutation]
    );

    const isCreating = mutations.createTodoMutation.isPending;

    const isUpdatingStatus = mutations.changeStatusMutation.isPending;

    const isBulkProcessing = useMemo(
        () =>
            mutations.unArchiveAllMutation.isPending ||
            mutations.deleteAllFromTrashMutation.isPending ||
            mutations.updateAllBackgroundsMutation.isPending,
        [
            mutations.unArchiveAllMutation.isPending,
            mutations.deleteAllFromTrashMutation.isPending,
            mutations.updateAllBackgroundsMutation.isPending,
        ]
    );

    const contextValue = useMemo(
        () => ({
            createTodo,
            updateTodo,
            moveToTrash,
            addToArchive,
            removeFromArchive,
            unarchiveAll,
            deleteTodo,
            toggleChecklistItem,
            uncheckAllItems,
            deleteAllFromTrash,
            updateTodoBackground,
            updateAllTodosBackground,
            handleView,
            view,
            isCreating,
            isUpdatingStatus,
            isBulkProcessing,
        }),
        [
            createTodo,
            updateTodo,
            moveToTrash,
            addToArchive,
            removeFromArchive,
            unarchiveAll,
            deleteTodo,
            toggleChecklistItem,
            uncheckAllItems,
            deleteAllFromTrash,
            updateTodoBackground,
            updateAllTodosBackground,
            handleView,
            view,
            isCreating,
            isUpdatingStatus,
            isBulkProcessing,
        ]
    );

    return <NotesContext.Provider value={contextValue}>{children}</NotesContext.Provider>;
};
