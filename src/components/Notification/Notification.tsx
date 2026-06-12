'use client';

import { createPortal } from 'react-dom';
import style from './notification.module.css';
import { ReactComponent as CloseIcon } from '../../assets/icons/close-icon.svg';
import { useTranslation } from 'react-i18next';
import { useNotification } from '../../hooks/useNotification';

function Notification() {
    const { notifications, closeNotification } = useNotification();
    const { t } = useTranslation();

    if (!notifications || notifications.length === 0) {
        return null;
    }

    return createPortal(
        <div className={style.notificationContainer}>
            {notifications.map((notif) => (
                <div
                    key={notif.id}
                    className={`
                        ${style.notification}
                        ${
                            notif.type === 'success'
                                ? style.success
                                : notif.type === 'warning'
                                  ? style.warning
                                  : style.error
                        }
                    `}
                >
                    {notif.message}
                    <button
                        type='button'
                        onClick={() => closeNotification(notif.id)}
                        className={style.closeButton}
                        aria-label={t('notifications.close')}
                    >
                        <CloseIcon className={style.closeIcon} aria-hidden='true' />
                    </button>
                </div>
            ))}
        </div>,
        document.body
    );
}

export default Notification;
