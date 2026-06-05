import { NoteStatus } from '../notes/NoteStatus';

export interface NotesStatusPageProps {
    status: NoteStatus;
    page: 'Archived' | 'Trash';
    onBulkAction: () => void;
    isBulkProcessing: boolean;
    buttonTitle: string;
    buttonTitleProcessing: string;
    loadingLabel: string;
    emptyText: string;
}
