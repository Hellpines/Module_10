'use client';

import { useState } from 'react';
import style from './profileitem.module.css';
import { ProfileItemProps } from '../../types/props/ProfileItemProps';
import { ReactComponent as ArrowIcon } from '../../assets/icons/arrow-icon.svg';

function ProfileItem({ children, expandContainerTitle, className }: ProfileItemProps) {
    const [isOpenContainer, setIsOpenContainer] = useState(true);

    const handleContainer = () => {
        setIsOpenContainer(!isOpenContainer);
    };

    return (
        <div className={style.profileItemWrapper}>
            <button
                type='button'
                className={style.expandContainerButton}
                onClick={handleContainer}
                aria-expanded={isOpenContainer}
            >
                <span className={style.containerTitle}>{expandContainerTitle}</span>
                <ArrowIcon
                    className={isOpenContainer ? style.arrowIcon : style.arrowIconReverted}
                    aria-hidden='true'
                />
            </button>

            <div
                className={`${style.profileBlock} ${isOpenContainer ? style.open : ''} ${className}`}
                role='region'
                hidden={!isOpenContainer}
            >
                {children}
            </div>
        </div>
    );
}

export default ProfileItem;
