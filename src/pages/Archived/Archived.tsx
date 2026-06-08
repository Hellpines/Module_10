import { useTranslation } from 'react-i18next';
import NotesStatusPage from '../../components/NotesStatusPage/NotesStatusPage';
import { useNotes } from '../../hooks/useNotes';

function Archived() {
    const { t } = useTranslation();
    const { unarchiveAll, isBulkProcessing } = useNotes();

    return (
        <NotesStatusPage
            status='ARCHIVED'
            page='Archived'
            onBulkAction={unarchiveAll}
            isBulkProcessing={isBulkProcessing}
            buttonTitle={t('archived.unarchiveAll')}
            buttonTitleProcessing={t('archived.unarchivingAll')}
            loadingLabel={t('archived.loadingArchive')}
            emptyText={t('archived.emptyArchive')}
        />
    );
}

export default Archived;
