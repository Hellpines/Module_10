import { Note } from './Note';

export interface NoteListProps {
    handleOpenEditModal?: (note: Note) => void;
    pageType?: 'Archived' | 'Trash';
}