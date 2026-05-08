import { Note } from './Note';
import { StatusType } from './StatusType';

export interface ActionsMenuProps {
    note: Note;
    flagCheckboxes: boolean;
    status: StatusType;
    handleFlagCheckboxes: (e: React.MouseEvent) => void;
    uncheckAll: () => void;
}