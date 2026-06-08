import { useTranslation } from 'react-i18next';
import NotesStatusPage from '../../components/NotesStatusPage/NotesStatusPage';
import { useNotes } from '../../hooks/useNotes';

function Trash() {
    const { t } = useTranslation();
    const { deleteAllFromTrash, isBulkProcessing } = useNotes();

    return (
        <NotesStatusPage
            status='TRASH'
            page='Trash'
            onBulkAction={deleteAllFromTrash}
            isBulkProcessing={isBulkProcessing}
            buttonTitle={t('trash.deleteAll')}
            buttonTitleProcessing={t('trash.deletingAll')}
            loadingLabel={t('trash.loadingTrash')}
            emptyText={t('trash.emptyTrash')}
        />
    );
}

export default Trash;
