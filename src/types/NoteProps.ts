import { Note as NoteType } from './Note'

export interface NoteProps extends NoteType {
    handleOpenEditModal?: (note: NoteType) => void;
}