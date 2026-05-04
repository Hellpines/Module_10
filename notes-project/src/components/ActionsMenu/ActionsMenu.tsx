import { useContext } from 'react';
import style from './actionsmenu.module.css'
import { AppContext } from '../../context/AppContext';
import { ActionsMenuProps } from '../../types/ActionsMenuProps';

function ActionsMenu({ note, changeFlagCheckboxes, flagCheckboxes, uncheckAll, status }: ActionsMenuProps) {
    const { moveToTrash, addToArchive, removeFromArchive, deleteForever } = useContext(AppContext)!;

    return (
        <div className={style.actions_menu} onClick={(e) => e.stopPropagation()}>
            {status === 'trash' ? 
                <button 
                    className={style.action_item} 
                    onClick={() => deleteForever(note.id)}
                    data-action='delete'
                >
                    Delete forever
                </button>
                :
                <button 
                    className={style.action_item} 
                    onClick={() => moveToTrash(note.id)} 
                    data-action='move-to-trash'
                >
                    Delete note
                </button>
            }
            {status === 'active' && 
                <button 
                    className={style.action_item} 
                    data-action='show/hide' 
                    onClick={changeFlagCheckboxes}
                >
                    {flagCheckboxes ? 'Hide' : 'Show'} checkboxes
                </button>
            }

            <button 
                className={style.action_item} 
                onClick={note.status !== 'archived' ? () => addToArchive(note.id) : () => removeFromArchive(note.id)} 
                data-action='archive'
            >
                {note.status === 'archived' ? 'Unarchive' : 'Archive'}
            </button>
            {(note.items.some(item => item.isChosen) && flagCheckboxes) && 
                <button 
                    className={style.action_item} 
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