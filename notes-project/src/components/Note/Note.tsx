import { useState, useRef, useEffect, useContext } from 'react'
import ActionsMenu from '../ActionsMenu/ActionsMenu'
import Checkbox from '../UI/Checkbox/Checkbox'
import style from './note.module.css'
import { NoteProps } from '../../types/NoteProps'
import { AppContext } from '../../context/AppContext'
import dots from '../../assets/icons/dots.svg'

function Note({ id, title, items, handleOpenEditModal, status }: NoteProps) {
    const [flagMenu, setFlagMenu] = useState(false);
    const [flagCheckboxes, setFlagCheckboxes] = useState(true);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const { toggleCheckbox, uncheckAll } = useContext(AppContext)!;
    
    const changeFlagCheckboxes = () => {
        setFlagCheckboxes(!flagCheckboxes);
    }

    const handleFlagMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        setFlagMenu(!flagMenu);
    }

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setFlagMenu(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div className={style.note} onClick={() => {
            const note = { id, title, items, status };
            if (handleOpenEditModal) {
                return handleOpenEditModal(note)
            }
        }}>
            {title && <p className={style.title}>{title}</p> }
            <ol>
                {items.map((item) => 
                    <li key={item.id}>
                        <Checkbox
                            flagCheckboxes={flagCheckboxes}
                            label={item.title}
                            checked={item.isChosen}
                            onChange={() => toggleCheckbox(id, item.id)}
                        />
                    </li>
                )}
            </ol>
            <div ref={menuRef}>
                <button 
                    className={style.dots} 
                    onClick={handleFlagMenu}
                >
                    <img src={dots} alt='actions'/>
                </button>
                {flagMenu && 
                    <ActionsMenu 
                        note={{ id, title, items, status }}
                        changeFlagCheckboxes={changeFlagCheckboxes}
                        flagCheckboxes={flagCheckboxes}
                        uncheckAll={() => uncheckAll(id)}
                        status={status}
                    />
                }
            </div>
        </div>
    )
}

export default Note