import { NotificationDocument } from "../../models/notification.model";
import { NotificationChannel } from "./notification-channel";

export class InAppChannel implements NotificationChannel {
  async send(notification: NotificationDocument): Promise<void> {
    console.log(
      `[IN_APP] Notification delivered to ${notification.recipient.name}: ${notification.message}`
    );
  }
}

export const inAppChannel = new InAppChannel();