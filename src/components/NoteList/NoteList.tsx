'use client';

import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import style from './notelist.module.css';
import Note from '../Note/Note';
import { Note as NoteType } from '../../types/notes/Note';
import { NoteListProps } from '../../types/props/NoteListProps';
import { useAuth } from '../../hooks/useAuth';

const NoteList = memo(({ notes, handleOpenEditModal, page }: NoteListProps) => {
    const { t } = useTranslation();
    const { currentUser } = useAuth();

    const getListLabel = () => {
        if (page === 'Trash') return t('noteList.trashLabel');
        if (page === 'Archived') return t('noteList.archiveLabel');
        return t('noteList.mainLabel');
    };

    return (
        <div className={style.noteList} aria-label={getListLabel()}>
            {notes.map((note: NoteType) => (
                <Note
                    key={note.id}
                    {...note}
                    userId={currentUser!.id}
                    handleOpenEditModal={
                        page === 'Trash' || page === 'Archived' ? undefined : handleOpenEditModal
                    }
                />
            ))}
        </div>
    );
});

NoteList.displayName = 'NoteList';

export default NoteList;
