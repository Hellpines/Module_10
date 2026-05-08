import { useContext, useState } from 'react';
import style from './notes.module.css';
import Button from '../../components/UI/Button/Button';
import NoteList from '../../components/NoteList/NoteList';
import Modal from '../../components/Modal/Modal';
import { Note as NoteType } from '../../types/Note';
import { NotesContext } from '../../context/NotesContext';
import Layout from '../../components/Layout/Layout';

function Notes() {
    const [isCreateMode, setCreateMode] = useState<boolean>(false)
    const [isEditMode, setEditMode] = useState<boolean>(false)
    const [selectedNote, setSelectedNote] = useState<NoteType | null>(null)
    const { createNote, editNote } = useContext(NotesContext)!

    const handleOpenCreateModal = () => {
        setCreateMode(true);
    };

    const handleCloseCreateModal = () => {
        setCreateMode(false);
    };

    const handleOpenEditModal = (note: NoteType) => {
        setSelectedNote(note);
        setEditMode(true);
    };

    const handleCloseEditModal = () => {
        setEditMode(false);
    };

    return (
        <div>
            <Layout pageStatus='Authorized'>
                <div className={style.wrapperButton}>
                    <Button
                        onClick={handleOpenCreateModal}
                        title='Create a note'
                    />
                </div>
                <NoteList handleOpenEditModal={handleOpenEditModal} />
                {isCreateMode &&
                    <Modal
                        isCreateMode={true}
                        modalTitle='Create a new note'
                        buttonTitle='Create'
                        handleClose={handleCloseCreateModal}
                        onSave={createNote}
                    />
                }
                {isEditMode && selectedNote && selectedNote.status === 'active' && (
                    <Modal
                        isCreateMode={false}
                        modalTitle='Edit note'
                        buttonTitle='Edit'
                        handleClose={handleCloseEditModal}
                        onSave={editNote}
                        noteId={selectedNote.id}
                        title={selectedNote.title}
                        items={selectedNote.items}
                        status={selectedNote.status}
                    />
                )}
            </Layout>
        </div>
    )
}

export default Notes