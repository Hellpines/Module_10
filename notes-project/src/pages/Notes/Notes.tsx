import {useContext, useState} from 'react'
import Aside from '../../components/Aside/Aside'
import Header from '../../components/Header/Header'
import style from './notes.module.css'
import Button from '../../components/UI/Button/Button'
import Footer from '../../components/Footer/Footer'
import NoteList from '../../components/NoteList/NoteList'
import Modal from '../../components/Modal/Modal'
import { Note as NoteType } from '../../types/Note'
import { AppContext } from '../../context/AppContext'

function Notes() {
    const [isCreateMode, setCreateMode] = useState<boolean>(false)
    const [isEditMode, setEditMode] = useState<boolean>(false)
    const [selectedNote, setSelectedNote] = useState<NoteType | null>(null)
    const { createNote, editNote } = useContext(AppContext)!

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
            <Header pageType='Authorized' />
            <div className={style.wrapper}>
                <Aside/>
                <main>
                    <div className={style.wrapper_button}>
                        <Button 
                            onClick={handleOpenCreateModal} 
                            title='Create a note'
                        />
                    </div>
                    <NoteList handleOpenEditModal={handleOpenEditModal}/>
                    {isCreateMode && 
                        <Modal 
                            modalTitle='Create a new note'
                            buttonTitle='Create'
                            isCreateMode={isCreateMode}
                            handleCloseCreateModal={handleCloseCreateModal}
                            createNote={createNote}
                        />
                    }
                    {isEditMode && 
                        <Modal 
                            modalTitle='Edit a new note' 
                            buttonTitle='Edit' 
                            title={selectedNote?.title}
                            items={selectedNote?.items}
                            noteId={selectedNote?.id}
                            status={selectedNote?.status}
                            handleCloseEditModal={handleCloseEditModal}
                            editNote={editNote}
                        />
                    }
                </main>
            </div>
            <Footer/>
        </div>
    )
}

export default Notes