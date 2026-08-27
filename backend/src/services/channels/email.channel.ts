import { NotificationDocument } from "../../models/notification.model";
import { NotificationChannel } from "./notification-channel";

class EmailChannel implements NotificationChannel {
  async send(notification: NotificationDocument): Promise<void> {
    const serviceId = process.env.EMAILJS_SERVICE_ID;
    const templateId = process.env.EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.EMAILJS_PUBLIC_KEY;
    const privateKey = process.env.EMAILJS_PRIVATE_KEY;

    if (!serviceId || !templateId || !publicKey || !privateKey) {
      throw new Error("EmailJS configuration is missing");
    }

    if (!notification.recipient.email) {
      throw new Error("Recipient email is required for email notifications");
    }

    const response = await fetch(
      "https://api.emailjs.com/api/v1.0/email/send",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,

          // EmailJS account identifier
          user_id: publicKey,

          // Private key used for backend authorization
          accessToken: privateKey,

          template_params: {
            to_email: notification.recipient.email,
            recipient_name: notification.recipient.name,
            subject: `Notification: ${notification.eventId}`,
            message: notification.message,
            event_id: notification.eventId,
          },
        }),
      },
    );

    if (!response.ok) {
      const errorText = await response.text();

      throw new Error(
        `EmailJS failed (${response.status}): ${errorText}`,
      );
    }

    console.log(
      `[EMAIL] Notification sent to ${notification.recipient.email}`,
    );
  }
}

export const emailChannel = new EmailChannel();