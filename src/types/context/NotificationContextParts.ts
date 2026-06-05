import { AppNotification } from '../notification/AppNotification';
import { NotificationType } from '../notification/NotificationType';

export interface NotificationContextParts {
    notifications: AppNotification[];
    showNotifications: (message: string, type: NotificationType) => void;
    closeNotification: (id: string) => void;
}
