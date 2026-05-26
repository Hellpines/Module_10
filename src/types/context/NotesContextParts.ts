import { Note } from '../notes/Note';

export interface NotesContextParts {
    createTodo: (note: Note) => void;
    updateTodo: (updatedNote: Note) => void;
    moveToTrash: (id: number) => void;
    addToArchive: (id: number) => void;
    removeFromArchive: (id: number) => void;
    unarchiveAll: () => void;
    deleteTodo: (id: number) => void;
    toggleChecklistItem: (noteId: number, itemId: number) => void;
    uncheckAllItems: (noteId: number) => void;
    deleteAllFromTrash: () => void;
    updateTodoBackground: (id: number, backgroundImage: string) => void;
    updateAllTodosBackground: (backgroundColor: string) => void;
    handleView: () => void;
    view: 'grid' | 'list';
    isCreating: boolean;
    isUpdatingStatus: boolean;
    isBulkProcessing: boolean;
}
