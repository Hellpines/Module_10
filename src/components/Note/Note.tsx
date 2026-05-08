import { useState, useRef, useEffect, useContext } from 'react';
import ActionsMenu from '../ActionsMenu/ActionsMenu';
import Checkbox from '../UI/Checkbox/Checkbox';
import style from './note.module.css';
import { NoteProps } from '../../types/NoteProps';
import { NotesContext } from '../../context/NotesContext';
import { ReactComponent as ActionsIcon } from '../../assets/icons/dots.svg';

function Note({ id, title, items, handleOpenEditModal, status }: NoteProps) {
    const [flagMenu, setFlagMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const { toggleCheckbox, uncheckAll, toggleCheckboxVisibility, isCheckboxVisible } = useContext(NotesContext)!;
    const flagCheckboxes = isCheckboxVisible(id);

    const handleFlagCheckboxes = (e: React.MouseEvent) => {
        e.stopPropagation();
        toggleCheckboxVisibility(id);
    };

    const handleFlagMenu = (e: React.MouseEvent<HTMLDivElement>) => {
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
            {title && <p className={style.title}>{title}</p>}
            <ol>
                {items.map((item) =>
                    <li key={item.id}>
                        <Checkbox
                            flagCheckboxes={flagCheckboxes}
                            key={item.id}
                            checkboxId={item.id}
                            label={item.title}
                            checked={item.isChosen}
                            onChange={() => toggleCheckbox(id, item.id)}
                        />
                    </li>
                )}
            </ol>
            <div ref={menuRef}>
                <div
                    className={style.dots}
                    role='button'
                    tabIndex={0}
                    onClick={handleFlagMenu}
                >
                    <ActionsIcon className={style.actionsIcon} />
                    {flagMenu &&
                        <ActionsMenu
                            note={{ id, title, items, status }}
                            handleFlagCheckboxes={handleFlagCheckboxes}
                            flagCheckboxes={flagCheckboxes}
                            uncheckAll={() => uncheckAll(id)}
                            status={status}
                        />
                    }
                </div>
            </div>
        </div>
    )
}

export default Note