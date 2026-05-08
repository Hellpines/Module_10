import { Note } from './Note';

export interface NotesContextParts {
    notes: Note[];
    createNote: (note: Note) => void;
    editNote: (updatedNote: Note) => void;
    moveToTrash: (id: number) => void;
    addToArchive: (id: number) => void;
    removeFromArchive: (id: number) => void;
    unarchiveAll: () => void;
    deleteForever: (id: number) => void;
    toggleCheckbox: (noteId: number, itemId: number) => void;
    uncheckAll: (noteId: number) => void;
    deleteAllFromTrash: () => void;
    toggleCheckboxVisibility: (noteId: number) => void;
    isCheckboxVisible: (noteId: number) => boolean;
}