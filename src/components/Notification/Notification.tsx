import { createPortal } from 'react-dom';
import style from './notification.module.css';
import { ReactComponent as CloseIcon } from '../../assets/icons/close-icon.svg';
import { useTranslation } from 'react-i18next';
import { useNotification } from '../../hooks/useNotification';

function Notification() {
    const { notification, closeNotification } = useNotification();
    const { t } = useTranslation();

    if (!notification) {
        return null;
    }

    return createPortal(
        <div
            className={`
                ${style.notification}
                ${
                    notification.type === 'success'
                        ? style.success
                        : notification.type === 'warning'
                          ? style.warning
                          : style.error
                }
            `}
        >
            {notification.message}
            <button
                type='button'
                onClick={closeNotification}
                className={style.closeButton}
                aria-label={t('notifications.close')}
            >
                <CloseIcon className={style.closeIcon} aria-hidden='true' />
            </button>
        </div>,
        document.body
    );
}

export default Notification;
