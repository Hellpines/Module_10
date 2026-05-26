import { AppNotification } from '../notification/AppNotification';
import { NotificationType } from '../notification/NotificationType';

export interface NotificationContextParts {
    notification: AppNotification | null;
    showNotification: (message: string, type: NotificationType) => void;
    closeNotification: () => void;
}
