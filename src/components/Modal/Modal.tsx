import React, { useContext, useState } from 'react';
import style from './modal.module.css';
import { Note } from '../../types/Note';
import Button from '../UI/Button/Button';
import Input from '../UI/Input/Input';
import TextArea from '../UI/TextArea/TextArea';
import { NotesContext } from '../../context/NotesContext';
import { ModalProps } from '../../types/ModalProps';
import { ReactComponent as CloseIcon } from '../../assets/icons/close-icon.svg';
import { ReactComponent as LetterIcon } from '../../assets/icons/letter-icon.svg';
import { ReactComponent as PencilIcon } from '../../assets/icons/pencil-icon.svg';

function Modal({ modalTitle, buttonTitle, isCreateMode, handleClose, onSave, title, items, noteId, status }: ModalProps) {

    const [currentTitle, setCurrentTitle] = useState(title || '');
    const [description, setDescription] = useState(
        items ? items.map(item => item.title).join('\n') : ''
    );
    const { notes } = useContext(NotesContext)!;

    const handleCurrentTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentTitle(e.target.value);
    };

    const handleDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value);
    };

    const handleSubmit = () => {
        const preparedItems = description
            .split('\n')
            .filter(item => item.trim() !== '')
            .map((itemTitle, index) => {
                const existingItem = items?.[index];

                return {
                    id: existingItem?.id || index + 1,
                    title: itemTitle,
                    isChosen: existingItem?.isChosen || false
                };
            });

        let newId: number;
        if (isCreateMode) {
            const maxId = notes.length > 0 ? Math.max(...notes.map(n => Number(n.id))) : 0;
            newId = maxId + 1;
        } else {
            newId = noteId as number;
        }
        const note: Note = {
            id: newId,
            title: currentTitle,
            items: preparedItems,
            status: isCreateMode ? 'active' : status
        };

        onSave(note);
        handleClose();
    };

    return (
        <div className={style.modalWrapper} onClick={() => handleClose()}>
            <div className={style.modal} onClick={(e) => e.stopPropagation()}>
                <p className={style.modalTitle}>{modalTitle}</p>
                <div className={style.inputs}>
                    <div className={style.inputWrapper}>
                        <label htmlFor='title'>
                            <LetterIcon className={style.letterIcon}/>
                            Title
                        </label>
                        <Input
                            className={style.inputTitle}
                            type='text'
                            id='title'
                            placeholder='Enter title'
                            value={currentTitle}
                            onChange={handleCurrentTitle}
                        />
                    </div>
                    <div className={style.inputWrapper}>
                        <label htmlFor='description'>
                            <PencilIcon className={style.pencilIcon}/>
                            Description
                        </label>
                        <TextArea
                            className={style.inputDescription}
                            id='description'
                            placeholder='Write description here...'
                            value={description}
                            onChange={handleDescription}
                        />
                    </div>
                </div>
                <div className={style.wrapperButton}>
                    <Button
                        title={buttonTitle}
                        onClick={handleSubmit}
                    />
                </div>
                <button
                    className={style.closeButton}
                    onClick={handleClose}
                >
                    <CloseIcon className={style.closeIcon}/>
                </button>
            </div>
        </div>
    );
}

export default Modal;