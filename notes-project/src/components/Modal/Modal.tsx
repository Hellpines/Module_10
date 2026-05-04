import React, { useState } from 'react';
import { ModalProps } from '../../types/ModalProps'
import { Note } from '../../types/Note'
import Button from '../UI/Button/Button'
import Input from '../UI/Input/Input'
import TextArea from '../UI/TextArea/TextArea'
import style from './modal.module.css'
import closeIcon from '../../assets/icons/close-icon.svg'
import letterIcon from '../../assets/icons/letter-icon.svg'
import pencilIcon from '../../assets/icons/pencil-icon.svg'

function Modal({ modalTitle, buttonTitle, isCreateMode, title, items, noteId, status, handleCloseCreateModal, handleCloseEditModal, createNote, editNote }: ModalProps) {
    const [currentTitle, setCurrentTitle] = useState(title || '');
    const [description, setDescription] = useState(items ? items.map(item => item.title).join('\n') : '');

    const changeCurrentTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentTitle(e.target.value);
    };

    const changeDescription = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value)
    }

    const handleSubmit = () => {
        const preparedItems = description
            .split('\n')
            .filter(item => item.trim() !== '')
            .map((item, index) => ({
                id: index + 1,
                title: item,
                isChosen: false
            }));

        const note: Note = {
            id: noteId || Date.now(),
            title: currentTitle,
            items: preparedItems,
            status: status || 'active'
        };

        if (isCreateMode && createNote) {
            createNote(note);
            handleCloseCreateModal?.();
        } else if (editNote) {
            editNote(note);
            handleCloseEditModal?.();
        }
    };

    return (
        <div className={style.modal_wrapper}>
            <div className={style.modal}>
                <p className={style.modal_title}>{modalTitle}</p>
                <div className={style.inputs}>
                    <div className={style.input_wrapper}>
                        <label htmlFor='title'><img src={letterIcon} alt='letter-icon' />Title</label>
                        <Input
                            className={style.input_title}
                            type='text'
                            id='title'
                            placeholder='Enter title'
                            value={currentTitle}
                            onChange={changeCurrentTitle}
                        />
                    </div>
                    <div className={style.input_wrapper}>
                        <label htmlFor='description'><img src={pencilIcon} alt='pencil-icon' />Description</label>
                        <TextArea
                            className={style.input_description}
                            id='description'
                            placeholder='Write description here...'
                            value={description}
                            onChange={changeDescription}
                        />
                    </div>
                </div>
                <div className={style.wrapper_button}>
                    <Button
                        className={style.confirm_button}
                        title={buttonTitle}
                        onClick={handleSubmit}
                    />
                </div>
                <button className={style.close_button} onClick={isCreateMode ? handleCloseCreateModal : handleCloseEditModal}><img src={closeIcon} alt='close' /></button>
            </div>
        </div>
    )
}

export default Modal