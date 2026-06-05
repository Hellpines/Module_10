import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useContext } from 'react';

import { useNotesMutations } from '../hooks/useNotesMutations';
import { NotesContext, NotesProvider } from './NotesContext';
import { Note } from '../types/notes/Note';

jest.mock('../hooks/useNotesMutations', () => ({
    useNotesMutations: jest.fn(),
}));

const mockCreateTodo = jest.fn();
const mockUpdateTodo = jest.fn();
const mockChangeStatus = jest.fn();
const mockUnArchiveAll = jest.fn();
const mockDeleteTodo = jest.fn();
const mockDeleteAllFromTrash = jest.fn();
const mockToggleChecklistItem = jest.fn();
const mockUncheckAllItems = jest.fn();
const mockUpdateTodoBackground = jest.fn();
const mockUpdateAllBackgrounds = jest.fn();

interface MutationMock {
    mutate: jest.Mock;
    isPending: boolean;
}

interface NotesMutationsTestMock {
    createTodoMutation: MutationMock;
    updateTodoMutation: MutationMock;
    changeStatusMutation: MutationMock;
    unArchiveAllMutation: MutationMock;
    deleteTodoMutation: MutationMock;
    deleteAllFromTrashMutation: MutationMock;
    toggleChecklistItemMutation: MutationMock;
    uncheckAllItemsMutation: MutationMock;
    updateTodoBackgroundMutation: MutationMock;
    updateAllBackgroundsMutation: MutationMock;
}

interface NotesMutationsPendingFlags {
    create?: boolean;
    change?: boolean;
    deleteAll?: boolean;
}

const createNotesMutationsMock = (
    pending: NotesMutationsPendingFlags = {}
): ReturnType<typeof useNotesMutations> => {
    const mock: NotesMutationsTestMock = {
        createTodoMutation: { mutate: mockCreateTodo, isPending: pending.create ?? false },
        updateTodoMutation: { mutate: mockUpdateTodo, isPending: false },
        changeStatusMutation: { mutate: mockChangeStatus, isPending: pending.change ?? false },
        unArchiveAllMutation: { mutate: mockUnArchiveAll, isPending: false },
        deleteTodoMutation: { mutate: mockDeleteTodo, isPending: false },
        deleteAllFromTrashMutation: {
            mutate: mockDeleteAllFromTrash,
            isPending: pending.deleteAll ?? false,
        },
        toggleChecklistItemMutation: { mutate: mockToggleChecklistItem, isPending: false },
        uncheckAllItemsMutation: { mutate: mockUncheckAllItems, isPending: false },
        updateTodoBackgroundMutation: { mutate: mockUpdateTodoBackground, isPending: false },
        updateAllBackgroundsMutation: { mutate: mockUpdateAllBackgrounds, isPending: false },
    };

    return mock as unknown as ReturnType<typeof useNotesMutations>;
};

const TestConsumer = () => {
    const context = useContext(NotesContext);
    if (!context) return null;

    const dummyNote: Note = { id: 123, title: 'Title', userId: 1 };

    return (
        <div>
            <span data-testid='view'>{context.view}</span>
            <span data-testid='isCreating'>{context.isCreating ? 'true' : 'false'}</span>
            <span data-testid='isUpdatingStatus'>
                {context.isUpdatingStatus ? 'true' : 'false'}
            </span>
            <span data-testid='isBulkProcessing'>
                {context.isBulkProcessing ? 'true' : 'false'}
            </span>

            <button onClick={context.handleView}>Toggle View</button>
            <button onClick={() => context.createTodo(dummyNote)}>Create</button>
            <button onClick={() => context.updateTodo(dummyNote)}>Update</button>
            <button onClick={() => context.moveToTrash(1)}>Move Trash</button>
            <button onClick={() => context.addToArchive(1)}>Add Archive</button>
            <button onClick={() => context.removeFromArchive(1)}>Remove Archive</button>
            <button onClick={context.unarchiveAll}>Unarchive All</button>
            <button onClick={() => context.deleteTodo(1)}>Delete</button>
            <button onClick={context.deleteAllFromTrash}>Delete All Trash</button>
            <button onClick={() => context.toggleChecklistItem(1, 2)}>Toggle Item</button>
            <button onClick={() => context.uncheckAllItems(1)}>Uncheck All</button>
            <button onClick={() => context.updateTodoBackground(1, 'red')}>Update BG</button>
            <button onClick={() => context.updateAllTodosBackground('blue')}>Update All BG</button>
        </div>
    );
};

describe('NotesContext/NotesProvider', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        window.localStorage.clear();
        jest.spyOn(Storage.prototype, 'setItem');

        jest.mocked(useNotesMutations).mockReturnValue(createNotesMutationsMock());
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('initializes with default grid view', () => {
        render(
            <NotesProvider>
                <TestConsumer />
            </NotesProvider>
        );
        expect(screen.getByTestId('view').textContent).toBe('grid');
    });

    test('initializes with saved list view from localStorage', () => {
        window.localStorage.setItem('notes-view', 'list');
        render(
            <NotesProvider>
                <TestConsumer />
            </NotesProvider>
        );
        expect(screen.getByTestId('view').textContent).toBe('list');
    });

    test('toggles view and updates localStorage', async () => {
        render(
            <NotesProvider>
                <TestConsumer />
            </NotesProvider>
        );
        await userEvent.click(screen.getByText('Toggle View'));
        expect(screen.getByTestId('view').textContent).toBe('list');
        expect(Storage.prototype.setItem).toHaveBeenCalledWith('notes-view', 'list');
    });

    test('triggers mutations correctly', async () => {
        render(
            <NotesProvider>
                <TestConsumer />
            </NotesProvider>
        );
        const dummyNote: Note = { id: 123, title: 'Title', userId: 1 };

        await userEvent.click(screen.getByText('Create'));
        expect(mockCreateTodo).toHaveBeenCalledWith(dummyNote);

        await userEvent.click(screen.getByText('Update'));
        expect(mockUpdateTodo).toHaveBeenCalledWith(dummyNote);

        await userEvent.click(screen.getByText('Move Trash'));
        expect(mockChangeStatus).toHaveBeenCalledWith({ id: 1, newStatus: 'TRASH' });

        await userEvent.click(screen.getByText('Add Archive'));
        expect(mockChangeStatus).toHaveBeenCalledWith({ id: 1, newStatus: 'ARCHIVED' });

        await userEvent.click(screen.getByText('Remove Archive'));
        expect(mockChangeStatus).toHaveBeenCalledWith({ id: 1, newStatus: 'NOTES' });

        await userEvent.click(screen.getByText('Unarchive All'));
        expect(mockUnArchiveAll).toHaveBeenCalled();

        await userEvent.click(screen.getByText('Delete'));
        expect(mockDeleteTodo).toHaveBeenCalledWith(1);

        await userEvent.click(screen.getByText('Delete All Trash'));
        expect(mockDeleteAllFromTrash).toHaveBeenCalled();

        await userEvent.click(screen.getByText('Toggle Item'));
        expect(mockToggleChecklistItem).toHaveBeenCalledWith({ noteId: 1, itemId: 2 });

        await userEvent.click(screen.getByText('Uncheck All'));
        expect(mockUncheckAllItems).toHaveBeenCalledWith(1);

        await userEvent.click(screen.getByText('Update BG'));
        expect(mockUpdateTodoBackground).toHaveBeenCalledWith({ id: 1, backgroundImage: 'red' });

        await userEvent.click(screen.getByText('Update All BG'));
        expect(mockUpdateAllBackgrounds).toHaveBeenCalledWith('blue');
    });

    test('reflects pending states correctly', () => {
        jest.mocked(useNotesMutations).mockReturnValue(
            createNotesMutationsMock({ create: true, change: true, deleteAll: true })
        );

        render(
            <NotesProvider>
                <TestConsumer />
            </NotesProvider>
        );
        expect(screen.getByTestId('isCreating').textContent).toBe('true');
        expect(screen.getByTestId('isUpdatingStatus').textContent).toBe('true');
        expect(screen.getByTestId('isBulkProcessing').textContent).toBe('true');
    });
});
