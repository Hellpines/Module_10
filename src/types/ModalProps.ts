import { Item } from './Item';
import { Note } from './Note';

interface BaseModalProps {
    modalTitle: string;
    buttonTitle: string;
}

interface CreateModalProps extends BaseModalProps {
    isCreateMode: true;
    handleClose: () => void;
    onSave: (note: Note) => void;
    title?: never; 
    items?: never;
    noteId?: never;
    status?: never;
}

interface EditModalProps extends BaseModalProps {
    isCreateMode: false;
    handleClose: () => void;
    onSave: (note: Note) => void;
    title: string;
    items: Item[];
    noteId: number;
    status: 'active';
}

export type ModalProps = CreateModalProps | EditModalProps;