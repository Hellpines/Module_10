'use client';

import style from '../../views/mainpages.module.css';
import { useNotesByStatus } from '../../hooks/useNotesByStatus';
import Layout from '../Layout/Layout';
import Button from '../UI/Button/Button';
import NoteList from '../NoteList/NoteList';
import { Loader } from '../UI/Loader/Loader';
import { NotesStatusPageProps } from '../../types/props/NotesStatusPageProps';

function NotesStatusPage({
    status,
    page,
    onBulkAction,
    isBulkProcessing,
    buttonTitle,
    buttonTitleProcessing,
    loadingLabel,
    emptyText,
}: NotesStatusPageProps) {
    const { data: notes = [], isLoading } = useNotesByStatus(status);

    return (
        <Layout pageStatus='Authorized'>
            <div className={style.wrapperButton}>
                <Button
                    onClick={onBulkAction}
                    title={isBulkProcessing ? buttonTitleProcessing : buttonTitle}
                    disabled={isBulkProcessing || notes.length === 0}
                />
            </div>
            {isLoading ? (
                <Loader label={loadingLabel} />
            ) : notes.length === 0 ? (
                <div className={style.emptyContainer} role='status' aria-live='polite'>
                    <p className={style.warningText}>{emptyText}</p>
                </div>
            ) : (
                <NoteList notes={notes} page={page} />
            )}
        </Layout>
    );
}

export default NotesStatusPage;
