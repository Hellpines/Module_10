import { useContext, useEffect, useRef, useState, useLayoutEffect } from 'react';
import { useTranslation } from 'react-i18next';
import style from './actionsmenu.module.css';
import { NotesContext } from '../../context/NotesContext';
import { ActionsMenuProps } from '../../types/props/ActionsMenuProps';

function ActionsMenu({
    note,
    flagCheckboxes,
    status,
    uncheckAll,
    handleFlagCheckboxes,
    onClose,
}: ActionsMenuProps) {
    const { t } = useTranslation();
    const { moveToTrash, addToArchive, removeFromArchive, deleteTodo } = useContext(NotesContext)!;
    const menuRef = useRef<HTMLDivElement>(null);

    const [positionClass, setPositionClass] = useState(style.rightDown);

    useLayoutEffect(() => {
        const menu = menuRef.current;
        if (!menu) return;

        const rect = menu.getBoundingClientRect();

        const overflowRight = rect.right > window.innerWidth;
        const overflowBottom = rect.bottom > window.innerHeight;

        if (overflowRight && overflowBottom) {
            setPositionClass(style.leftUp);
        } else if (overflowRight) {
            setPositionClass(style.leftDown);
        } else if (overflowBottom) {
            setPositionClass(style.rightUp);
        } else {
            setPositionClass(style.rightDown);
        }
    }, []);

    useEffect(() => {
        const menu = menuRef.current;
        if (!menu) return;

        const buttons = Array.from(menu.querySelectorAll('button'));
        if (buttons.length === 0) return;

        buttons[0].focus();

        const handleKeyDown = (e: KeyboardEvent) => {
            const currentIndex = buttons.indexOf(document.activeElement as HTMLButtonElement);

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                const nextIndex = (currentIndex + 1) % buttons.length;
                buttons[nextIndex].focus();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                const prevIndex = (currentIndex - 1 + buttons.length) % buttons.length;
                buttons[prevIndex].focus();
            } else if (e.key === 'Escape') {
                e.preventDefault();
                onClose?.();
            }
        };

        menu.addEventListener('keydown', handleKeyDown);
        return () => menu.removeEventListener('keydown', handleKeyDown);
    }, [status, flagCheckboxes, onClose]);

    return (
        <div
            ref={menuRef}
            className={`${style.actionsMenu} ${positionClass}`}
            onClick={(e) => e.stopPropagation()}
            role='menu'
            aria-label={t('actionsMenu.menuLabel')}
        >
            {status === 'TRASH' ? (
                <button
                    role='menuitem'
                    className={style.actionItem}
                    onClick={() => deleteTodo(note.id)}
                    data-action='delete'
                >
                    {t('actionsMenu.deleteForever')}
                </button>
            ) : (
                <button
                    role='menuitem'
                    className={style.actionItem}
                    onClick={() => moveToTrash(note.id)}
                    data-action='move-to-trash'
                >
                    {t('actionsMenu.deleteNote')}
                </button>
            )}

            {status === 'NOTES' && (
                <button
                    role='menuitem'
                    className={style.actionItem}
                    data-action='show/hide'
                    onClick={handleFlagCheckboxes}
                >
                    {flagCheckboxes
                        ? t('actionsMenu.hideCheckboxes')
                        : t('actionsMenu.showCheckboxes')}
                </button>
            )}

            <button
                role='menuitem'
                className={style.actionItem}
                onClick={
                    note.status !== 'ARCHIVED'
                        ? () => addToArchive(note.id)
                        : () => removeFromArchive(note.id)
                }
                data-action='archive'
            >
                {note.status === 'ARCHIVED' ? t('actionsMenu.unarchive') : t('actionsMenu.archive')}
            </button>

            {note.items?.some((item) => item.isCompleted) && flagCheckboxes && (
                <button
                    role='menuitem'
                    className={style.actionItem}
                    data-action='uncheck'
                    onClick={uncheckAll}
                >
                    {t('actionsMenu.uncheckAll')}
                </button>
            )}
        </div>
    );
}

export default ActionsMenu;
