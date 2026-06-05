import React, { useContext, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import style from './modal.module.css';
import { Note } from '../../types/notes/Note';
import Button from '../UI/Button/Button';
import Input from '../UI/Input/Input';
import TextArea from '../UI/TextArea/TextArea';
import { ModalProps } from '../../types/props/ModalProps';
import { ReactComponent as CloseIcon } from '../../assets/icons/close-icon.svg';
import { ReactComponent as LetterIcon } from '../../assets/icons/letter-icon.svg';
import { ReactComponent as PencilIcon } from '../../assets/icons/pencil-icon.svg';
import { ReactComponent as CheckboxIcon } from '../../assets/icons/checkbox-icon.svg';
import { NotesContext } from '../../context/NotesContext';
import { CheckListItem } from '../../types/notes/CheckListItem';
import { useAuth } from '../../hooks/useAuth';
import { useFocus } from '../../hooks/useFocus';
import Checkbox from '../UI/Checkbox/Checkbox';

function Modal({
    notes,
    modalTitle,
    buttonTitle,
    isCreateMode,
    handleClose,
    onSave,
    title,
    items,
    content,
    noteId,
}: ModalProps) {
    const { t } = useTranslation();
    const { currentUser } = useAuth();
    const { updateTodoBackground, toggleChecklistItem } = useContext(NotesContext)!;

    const existingNote = notes?.find((n) => n.id === noteId);

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const modalRef = useRef<HTMLDivElement | null>(null);

    const [isEditing, setIsEditing] = useState<boolean>(isCreateMode);
    const [currentTitle, setCurrentTitle] = useState(title || '');
    const [description, setDescription] = useState(content || '');
    const [checklist, setChecklist] = useState<CheckListItem[]>(items || []);
    const [pendingBackground, setPendingBackground] = useState<string | undefined>(
        existingNote?.backgroundImage
    );

    useFocus(modalRef, true, handleClose);

    const handleCurrentTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentTitle(e.target.value);
    };

    const handleDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value);
    };

    const handleAddChecklist = () => {
        const maxId = checklist.reduce((max, item) => (item.id > max ? item.id : max), 0);

        setChecklist((prev) => {
            return [
                ...prev,
                {
                    id: maxId + 1,
                    text: '',
                    isCompleted: false,
                },
            ];
        });
    };

    const handleChecklistText = (id: number, value: string) => {
        setChecklist((prev) => {
            return prev.map((item) => {
                return item.id === id ? { ...item, text: value } : item;
            });
        });
    };

    const handleDeleteChecklist = (id: number) => {
        setChecklist((prev) => {
            return prev.filter((item) => {
                return item.id !== id;
            });
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            if (noteId) {
                setPendingBackground(base64String);
            }
        };
        reader.readAsDataURL(file);
    };

    const toggleEditMode = () => {
        setIsEditing((prev) => !prev);
    };

    const handleSubmit = () => {
        let newId: number;

        if (isCreateMode) {
            const maxId = notes.reduce((max, n) => (n.id > max ? n.id : max), 0);
            newId = maxId + 1;
        } else {
            newId = noteId;
        }

        if (!isCreateMode && pendingBackground !== existingNote?.backgroundImage) {
            updateTodoBackground(newId, pendingBackground || '');
        }

        const note: Note = {
            id: newId,
            title: currentTitle,
            content: description,
            items: checklist.filter((item) => item.text.trim() !== ''),
            status: 'NOTES',
            userId: currentUser!.id,
            backgroundImage: pendingBackground,
        };

        onSave(note);
        handleClose();
    };

    return (
        <div className={style.modalWrapper} onClick={() => handleClose()}>
            <div
                ref={modalRef}
                className={style.modal}
                onClick={(e) => e.stopPropagation()}
                role='dialog'
                aria-modal='true'
            >
                <div className={style.modalHeaderRow}>
                    <h2 className={style.modalTitle}>
                        {isEditing ? modalTitle : t('modal.viewTitle')}
                    </h2>
                    {!isCreateMode && (
                        <Button
                            title={isEditing ? t('modal.viewMode') : t('modal.editMode')}
                            onClick={toggleEditMode}
                            className={style.modeToggleButton}
                        />
                    )}
                </div>

                <div className={style.inputs}>
                    {isEditing ? (
                        <>
                            <div className={style.inputWrapper}>
                                <label htmlFor='title'>
                                    <LetterIcon className={style.letterIcon} aria-hidden='true' />
                                    <span>{t('modal.title')}</span>
                                </label>
                                <Input
                                    className={style.inputTitle}
                                    type='text'
                                    id='title'
                                    placeholder={t('modal.enterTitle')}
                                    value={currentTitle}
                                    onChange={handleCurrentTitle}
                                />
                            </div>

                            <div className={style.inputWrapper}>
                                <label htmlFor='description'>
                                    <PencilIcon className={style.pencilIcon} aria-hidden='true' />
                                    <span>{t('modal.description')}</span>
                                </label>
                                <TextArea
                                    className={style.inputDescription}
                                    id='description'
                                    placeholder={t('modal.writeDesc')}
                                    value={description}
                                    onChange={handleDescription}
                                />
                            </div>

                            <div className={style.checklistWrapper}>
                                <p className={style.checklistTitle}>
                                    <CheckboxIcon
                                        className={style.CheckboxIcon}
                                        aria-hidden='true'
                                    />
                                    <span>{t('modal.checkboxes')}</span>
                                </p>

                                <div
                                    className={style.checklistItems}
                                    role='group'
                                    aria-label={t('modal.checkboxes')}
                                >
                                    {checklist.map((item, index) => (
                                        <div key={item.id} className={style.checklistItem}>
                                            <Input
                                                type='text'
                                                placeholder={t('modal.checkItem')}
                                                value={item.text}
                                                aria-label={`${t('modal.checkItem')} ${index + 1}`}
                                                onChange={(e) =>
                                                    handleChecklistText(item.id, e.target.value)
                                                }
                                            />
                                            <Button
                                                title={t('modal.delete')}
                                                aria-label={`${t('modal.delete')} ${item.text || index + 1}`}
                                                className={style.deleteButton}
                                                onClick={() => handleDeleteChecklist(item.id)}
                                            />
                                        </div>
                                    ))}
                                </div>

                                <Button
                                    title={t('modal.addCheckbox')}
                                    onClick={handleAddChecklist}
                                />
                            </div>
                        </>
                    ) : (
                        <div className={style.viewWrapper}>
                            <div className={style.viewItem}>
                                <span className={style.viewLabel}>
                                    <LetterIcon className={style.letterIcon} aria-hidden='true' />
                                    {t('modal.title')}
                                </span>
                                <p className={style.viewTextTitle}>{currentTitle || '—'}</p>
                            </div>

                            <div className={style.viewItem}>
                                <span className={style.viewLabel}>
                                    <PencilIcon className={style.pencilIcon} aria-hidden='true' />
                                    {t('modal.description')}
                                </span>
                                <p className={style.viewTextDescription}>{description || '—'}</p>
                            </div>

                            {existingNote?.items && existingNote.items.length > 0 && (
                                <div className={style.viewChecklistWrapper}>
                                    <span className={style.viewLabel}>
                                        <CheckboxIcon
                                            className={style.CheckboxIcon}
                                            aria-hidden='true'
                                        />
                                        {t('modal.checkboxes')}
                                    </span>
                                    <div className={style.viewChecklistItems}>
                                        {existingNote.items.map((item) => (
                                            <div key={item.id} className={style.viewChecklistItem}>
                                                <Checkbox
                                                    checkboxId={item.id}
                                                    label={item.text}
                                                    checked={item.isCompleted}
                                                    onChange={() =>
                                                        toggleChecklistItem(noteId!, item.id)
                                                    }
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {!isCreateMode && isEditing && (
                    <div className={style.backgroundControlWrapper}>
                        <input
                            type='file'
                            accept='image/*'
                            ref={fileInputRef}
                            className={style.fileInput}
                            onChange={handleFileChange}
                            tabIndex={-1}
                        />
                        <Button
                            title={t('modal.changeBg')}
                            onClick={() => fileInputRef.current?.click()}
                            className={style.changeBgButton}
                        />
                    </div>
                )}

                <div className={style.wrapperButton}>
                    {isEditing && <Button title={buttonTitle} onClick={handleSubmit} />}
                </div>

                <button
                    className={style.closeButton}
                    onClick={handleClose}
                    aria-label={t('modal.close')}
                >
                    <CloseIcon className={style.closeIcon} aria-hidden='true' />
                </button>
            </div>
        </div>
    );
}

export default Modal;
