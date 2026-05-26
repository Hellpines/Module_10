import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { NotesContext } from '../../context/NotesContext';
import NotesStatusPage from '../../components/NotesStatusPage/NotesStatusPage';

function Trash() {
    const { t } = useTranslation();
    const { deleteAllFromTrash, isBulkProcessing } = useContext(NotesContext)!;

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
