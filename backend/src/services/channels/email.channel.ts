import { NotificationDocument } from "../../models/notification.model";
import { NotificationChannel } from "./notification-channel";

export class EmailChannel implements NotificationChannel {
  async send(notification: NotificationDocument): Promise<void> {
    if (!notification.recipient.email) {
      throw new Error(
        "Recipient email is required for email notifications"
      );
    }

    console.log(
      `[EMAIL] Sending notification to ${notification.recipient.email}: ${notification.message}`
    );

    // Real email provider integration will be added later.
  }
}

export const emailChannel = new EmailChannel();