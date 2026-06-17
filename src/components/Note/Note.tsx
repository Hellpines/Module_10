'use client';

import { useState, useRef, useEffect, memo } from 'react';
import style from './note.module.css';
import ActionsMenu from '../ActionsMenu/ActionsMenu';
import Checkbox from '../UI/Checkbox/Checkbox';
import { NoteProps } from '../../types/props/NoteProps';
import { ReactComponent as ActionsIcon } from '../../assets/icons/dots.svg';
import { useNotes } from '../../hooks/useNotes';

const Note = memo(
    ({
        id,
        title,
        content,
        items,
        handleOpenEditModal,
        status,
        userId,
        backgroundImage,
    }: NoteProps) => {
        const [flagMenu, setFlagMenu] = useState(false);
        const [flagCheckboxes, setFlagCheckboxes] = useState(false);

        const menuRef = useRef<HTMLDivElement | null>(null);
        const triggerRef = useRef<HTMLButtonElement | null>(null);

        const { toggleChecklistItem, uncheckAllItems, view } = useNotes();

        const handleFlagCheckboxes = (e: React.MouseEvent) => {
            e.stopPropagation();
            setFlagCheckboxes(!flagCheckboxes);
        };

        const handleFlagMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
            e.stopPropagation();

            if (!flagMenu) {
                document.dispatchEvent(new MouseEvent('click'));
            }

            setFlagMenu(!flagMenu);
        };

        const handleNoteClick = () => {
            const note = {
                id,
                title,
                content,
                items,
                status,
                userId,
                backgroundImage,
            };
            if (handleOpenEditModal) {
                handleOpenEditModal(note);
            }
        };

        const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
            if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                handleNoteClick();
            }
        };

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

        const handleMenuClose = () => {
            setFlagMenu(false);
            triggerRef.current?.focus();
        };

        const isImageBg =
            backgroundImage &&
            (backgroundImage.startsWith('data:image') || backgroundImage.startsWith('http'));

        const noteStyle = {
            ...(isImageBg
                ? { backgroundImage: `url('${backgroundImage}')` }
                : backgroundImage
                  ? { backgroundColor: backgroundImage }
                  : {}),
        };

        const accessibleLabel = `${title ? title + '. ' : ''}${flagCheckboxes ? 'Checklist note' : content || 'Empty note'}`;

        return (
            <div
                className={`${style.note} ${view === 'list' && style.noteListView}`}
                style={noteStyle}
                role='button'
                tabIndex={0}
                aria-label={accessibleLabel}
                onClick={handleNoteClick}
                onKeyDown={handleKeyDown}
            >
                <div className={style.contentWrapper}>
                    {title && (
                        <p className={style.title} aria-hidden='true'>
                            {title}
                        </p>
                    )}
                    {flagCheckboxes ? (
                        <ol className={style.list} aria-label='Checklist items'>
                            {items?.map((item) => (
                                <li key={item.id}>
                                    <Checkbox
                                        checkboxId={item.id}
                                        label={item.text}
                                        checked={item.isCompleted}
                                        onChange={() => toggleChecklistItem(id, item.id)}
                                    />
                                </li>
                            ))}
                        </ol>
                    ) : (
                        <p aria-hidden='true'>{content}</p>
                    )}
                </div>
                <div
                    ref={menuRef}
                    className={style.menuWrapper}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        ref={triggerRef}
                        className={style.dots}
                        type='button'
                        aria-label='Note actions menu'
                        aria-haspopup='menu'
                        aria-expanded={flagMenu}
                        onClick={handleFlagMenu}
                    >
                        <ActionsIcon className={style.actionsIcon} aria-hidden='true' />
                    </button>
                    {flagMenu && (
                        <ActionsMenu
                            note={{ id, title, items, status, userId }}
                            status={status!}
                            flagCheckboxes={flagCheckboxes}
                            handleFlagCheckboxes={handleFlagCheckboxes}
                            uncheckAll={() => uncheckAllItems(id)}
                            onClose={handleMenuClose}
                        />
                    )}
                </div>
            </div>
        );
    }
);

Note.displayName = 'Note';

export default Note;
