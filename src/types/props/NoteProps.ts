import { Note } from '../notes/Note';

export interface NoteProps extends Note {
    handleOpenEditModal?: (note: Note) => void;
}
