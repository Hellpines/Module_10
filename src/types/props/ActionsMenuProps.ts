import { Note } from '../notes/Note';
import { NoteStatus } from '../notes/NoteStatus';

export interface ActionsMenuProps {
    note: Note;
    flagCheckboxes: boolean;
    status: NoteStatus;
    handleFlagCheckboxes: (e: React.MouseEvent) => void;
    uncheckAll: () => void;
    onClose: () => void;
}
