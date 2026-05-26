import { CheckListItem } from './CheckListItem';
import { NoteStatus } from './NoteStatus';

export interface Note {
    id: number;
    title: string;
    content?: string;
    items?: CheckListItem[];
    status?: NoteStatus;
    backgroundImage?: string;
    userId: number;
    createdAt?: string;
    updatedAt?: string;
}
