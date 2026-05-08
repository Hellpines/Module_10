import { useContext } from 'react';
import style from './actionsmenu.module.css';
import { NotesContext } from '../../context/NotesContext';
import { ActionsMenuProps } from '../../types/ActionsMenuProps';

function ActionsMenu({ note, status, flagCheckboxes, uncheckAll, handleFlagCheckboxes }: ActionsMenuProps) {
    const { moveToTrash, addToArchive, removeFromArchive, deleteForever } = useContext(NotesContext)!;

    return (
        <div className={style.actionsMenu} onClick={(e) => e.stopPropagation()}>
            {status === 'trash' ? 
                <button 
                    className={style.actionItem} 
                    onClick={() => deleteForever(note.id)}
                    data-action='delete'
                >
                    Delete forever
                </button>
                :
                <button 
                    className={style.actionItem} 
                    onClick={() => moveToTrash(note.id)} 
                    data-action='move-to-trash'
                >
                    Delete note
                </button>
            }

            {status === 'active' && 
                <button 
                    className={style.actionItem} 
                    data-action='show/hide' 
                    onClick={handleFlagCheckboxes}
                >
                    {flagCheckboxes ? 'Hide' : 'Show'} checkboxes
                </button>
            }

            <button 
                className={style.actionItem} 
                onClick={note.status !== 'archived' ? () => addToArchive(note.id) : () => removeFromArchive(note.id)} 
                data-action='archive'
            >
                {note.status === 'archived' ? 'Unarchive' : 'Archive'}
            </button>
            
            {(note.items.some(item => item.isChosen) && flagCheckboxes) && 
                <button 
                    className={style.actionItem} 
                    data-action='uncheck' 
                    onClick={uncheckAll}
                >
                    Uncheck all
                </button>
            }
        </div>
    )
}

export default ActionsMenu