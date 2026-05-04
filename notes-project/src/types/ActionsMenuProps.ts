import { Note } from './Note';

export interface ActionsMenuProps {
    note: Note;
    changeFlagCheckboxes: () => void;
    flagCheckboxes: boolean;
    uncheckAll: () => void;
    status: 'active' | 'archived' | 'trash'
}