import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import style from '../mainpages.module.css';
import Button from '../../components/UI/Button/Button';
import NoteList from '../../components/NoteList/NoteList';
import Modal from '../../components/Modal/Modal';
import Layout from '../../components/Layout/Layout';
import { Note as NoteType } from '../../types/notes/Note';
import { Loader } from '../../components/UI/Loader/Loader';
import { useNotesByStatus } from '../../hooks/useNotesByStatus';
import { useNotes } from '../../hooks/useNotes';

function Notes() {
    const { t } = useTranslation();

    const [isCreateMode, setCreateMode] = useState<boolean>(false);
    const [isEditMode, setEditMode] = useState<boolean>(false);
    const [selectedNote, setSelectedNote] = useState<NoteType | null>(null);

    const { createTodo, updateTodo, isCreating, isUpdatingStatus } = useNotes();

    const { data: activeNotes = [], isLoading } = useNotesByStatus('NOTES');

    const handleOpenCreateModal = () => {
        setCreateMode(true);
    };

    const handleCloseCreateModal = () => {
        setCreateMode(false);
    };

    const handleOpenEditModal = useCallback((note: NoteType) => {
        setSelectedNote(note);
        setEditMode(true);
    }, []);

    const handleCloseEditModal = () => {
        setEditMode(false);
    };

    return (
        <Layout pageStatus='Authorized'>
            <div className={style.wrapperButton}>
                <Button
                    onClick={handleOpenCreateModal}
                    title={t('notes.createNote')}
                    disabled={isLoading || isUpdatingStatus || isCreating}
                />
            </div>
            {isLoading ? (
                <Loader label={t('notes.loadingNotes')} />
            ) : activeNotes.length === 0 ? (
                <div className={style.emptyContainer} role='status' aria-live='polite'>
                    <p className={style.warningText}>{t('notes.emptyList')}</p>
                </div>
            ) : (
                <NoteList notes={activeNotes} handleOpenEditModal={handleOpenEditModal} />
            )}
            {isCreateMode && (
                <Modal
                    notes={activeNotes}
                    isCreateMode={true}
                    modalTitle={t('notes.createModalTitle')}
                    buttonTitle={t('notes.createButton')}
                    handleClose={handleCloseCreateModal}
                    onSave={createTodo}
                />
            )}
            {isEditMode && selectedNote && selectedNote.status === 'NOTES' && (
                <Modal
                    notes={activeNotes}
                    isCreateMode={false}
                    modalTitle={t('notes.editModalTitle')}
                    buttonTitle={t('notes.editButton')}
                    handleClose={handleCloseEditModal}
                    onSave={updateTodo}
                    noteId={selectedNote.id}
                    title={selectedNote.title}
                    items={selectedNote.items}
                    content={selectedNote.content}
                />
            )}
        </Layout>
    );
}

export default Notes;
