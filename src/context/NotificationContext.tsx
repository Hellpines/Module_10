'use client';

import { createContext, useCallback, useMemo, useState } from 'react';
import { ProviderProps } from '../types/props/ProviderProps';
import { NotificationContextParts } from '../types/context/NotificationContextParts';
import { AppNotification } from '../types/notification/AppNotification';
import { NotificationType } from '../types/notification/NotificationType';

export const NotificationContext = createContext<NotificationContextParts | null>(null);

export function NotificationProvider({ children }: ProviderProps) {
    const [notifications, setNotifications] = useState<AppNotification[]>([]);

    const closeNotification = useCallback((id: string) => {
        setNotifications((prev) => {
            return prev.filter((notif) => {
                return notif.id !== id;
            });
        });
    }, []);

    const showNotifications = useCallback(
        (message: string, type: NotificationType) => {
            const maxId =
                notifications.length > 0
                    ? Math.max(...notifications.map((notif) => Number(notif.id)))
                    : 0;

            const nextId = (maxId + 1).toString();

            setNotifications((prev) => {
                return [{ id: nextId, message, type }, ...prev];
            });

            setTimeout(() => {
                closeNotification(nextId);
            }, 3000);
        },
        [closeNotification, notifications]
    );

    const contextValue = useMemo(
        () => ({
            notifications,
            showNotifications,
            closeNotification,
        }),
        [notifications, showNotifications, closeNotification]
    );

    return (
        <NotificationContext.Provider value={contextValue}>{children}</NotificationContext.Provider>
    );
}
