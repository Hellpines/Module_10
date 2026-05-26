import { CheckListItem } from '../notes/CheckListItem';
import { Note } from '../notes/Note';

interface BaseModalProps {
    notes: Note[];
    modalTitle: string;
    buttonTitle: string;
    handleClose: () => void;
    onSave: (note: Note) => void;
}

interface CreateModalProps extends BaseModalProps {
    isCreateMode: true;
    title?: never;
    items?: never;
    content?: never;
    noteId?: never;
}

interface EditModalProps extends BaseModalProps {
    isCreateMode: false;
    title: string;
    items?: CheckListItem[] | undefined;
    content?: string | undefined;
    noteId: number;
}

export type ModalProps = CreateModalProps | EditModalProps;
