import { NotificationDocument } from "../../models/notification.model";
import { emailChannel } from "./email.channel";
import { inAppChannel } from "./in-app.channel";
import { NotificationChannel } from "./notification-channel";

const channels: Record<string, NotificationChannel> = {
  EMAIL: emailChannel,
  IN_APP: inAppChannel,
};

export const dispatchNotification = async (
  notification: NotificationDocument
): Promise<void> => {
  const channel = channels[notification.channel];

  if (!channel) {
    throw new Error(
      `Unsupported notification channel: ${notification.channel}`
    );
  }

  await channel.send(notification);
};