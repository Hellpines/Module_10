import Note from '../Note/Note'
import style from './notelist.module.css'
import { useContext } from 'react'
import { AppContext } from '../../context/AppContext'
import { Note as NoteType } from '../../types/Note'
import { NoteListProps } from '../../types/NoteListProps'

function NoteList({ handleOpenEditModal, pageType }: NoteListProps) {
    const { notes } = useContext(AppContext)!;

    const changeCurrentNotes = () => {
        if (pageType === 'Trash') {
            return notes.filter(note => note.status === 'trash') 
        } else if (pageType === 'Archived') {
            return notes.filter(note => note.status === 'archived') 
        }

        return notes.filter(note => note.status === 'active');
    }

    const currentNotes = changeCurrentNotes()

    return (
        <div className={style.note_list}>
            {currentNotes.map((note: NoteType) => {
                if (pageType === 'Trash' || pageType === 'Archived') {
                    return <Note 
                        key={note.id}
                        id={note.id} 
                        title={note.title} 
                        items={note.items} 
                        status={note.status}
                    />
                } else {
                    return <Note 
                        key={note.id}
                        id={note.id} 
                        title={note.title} 
                        items={note.items} 
                        status={note.status}
                        handleOpenEditModal={handleOpenEditModal}
                    />
                }})
            }
        </div>
    )
}

export default NoteList