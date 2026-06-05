import { NotificationType } from './NotificationType';

export interface AppNotification {
    id: string;
    message: string;
    type: NotificationType;
}
