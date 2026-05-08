import Note from '../Note/Note';
import style from './notelist.module.css';
import { useContext, useMemo } from 'react';
import { NotesContext } from '../../context/NotesContext';
import { Note as NoteType } from '../../types/Note';
import { NoteListProps } from '../../types/NoteListProps';

function NoteList({ handleOpenEditModal, page }: NoteListProps) {
    const { notes } = useContext(NotesContext)!;

    const currentNotes = useMemo(() => {
        if (page === 'Trash') {
            return notes.filter(note => note.status === 'trash') 
        } else if (page === 'Archived') {
            return notes.filter(note => note.status === 'archived') 
        }

        return notes.filter(note => note.status === 'active');
    }, [notes, page])

    return (
        <div className={style.noteList}>
            {currentNotes.map((note: NoteType) => {
                if (page === 'Trash' || page === 'Archived') {
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