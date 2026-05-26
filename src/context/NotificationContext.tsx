import { createContext, useCallback, useMemo, useState } from 'react';
import { ProviderProps } from '../types/props/ProviderProps';
import { NotificationContextParts } from '../types/context/NotificationContextParts';
import { AppNotification } from '../types/notification/AppNotification';
import { NotificationType } from '../types/notification/NotificationType';

export const NotificationContext = createContext<NotificationContextParts | null>(null);

export function NotificationProvider({ children }: ProviderProps) {
    const [notification, setNotification] = useState<AppNotification | null>(null);

    const showNotification = useCallback((message: string, type: NotificationType) => {
        setNotification({ message, type });

        setTimeout(() => {
            setNotification(null);
        }, 3000);
    }, []);

    const closeNotification = useCallback(() => {
        setNotification(null);
    }, []);

    const contextValue = useMemo(
        () => ({
            notification,
            showNotification,
            closeNotification,
        }),
        [notification, showNotification, closeNotification]
    );

    return (
        <NotificationContext.Provider value={contextValue}>{children}</NotificationContext.Provider>
    );
}
