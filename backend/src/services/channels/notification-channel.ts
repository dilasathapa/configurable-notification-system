import { NotificationDocument } from "../../models/notification.model";

export interface NotificationChannel {
  send(notification: NotificationDocument): Promise<void>;
}