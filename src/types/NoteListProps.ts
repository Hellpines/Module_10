import { Note } from './Note';

export interface NoteListProps {
    handleOpenEditModal?: (note: Note) => void;
    page?: 'Notes' | 'Archived' | 'Trash';
}