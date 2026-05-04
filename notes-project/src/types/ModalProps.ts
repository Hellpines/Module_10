import { Item } from './Item';
import { Note } from './Note';

export interface ModalProps {
    modalTitle: string;
    buttonTitle: string;
    isCreateMode?: boolean;
    title?: string;
    items?: Item[];
    noteId?: number;
    status?: 'active' | 'archived' | 'trash';
    handleCloseCreateModal?: () => void;
    handleCloseEditModal?: () => void;
    createNote?: (note: Note) => void;
    editNote?: (note: Note) => void;
}