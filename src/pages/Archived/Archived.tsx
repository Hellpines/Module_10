import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { NotesContext } from '../../context/NotesContext';
import NotesStatusPage from '../../components/NotesStatusPage/NotesStatusPage';

function Archived() {
    const { t } = useTranslation();
    const { unarchiveAll, isBulkProcessing } = useContext(NotesContext)!;

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
