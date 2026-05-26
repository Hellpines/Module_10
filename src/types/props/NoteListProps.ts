import { Note } from '../notes/Note';

export interface NoteListProps {
    notes: Note[];
    handleOpenEditModal?: (note: Note) => void;
    page?: 'Notes' | 'Archived' | 'Trash';
}
