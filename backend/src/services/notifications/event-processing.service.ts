import { NotificationRule } from "../../models/notification-rule.model";
import { Notification } from "../../models/notification.model";
import { NotificationEvent } from "../../types/notification";
import { ruleEngine } from "../rules/rule-engine.service";

export interface EventProcessingResult {
  eventId: string;
  matchedRules: number;
  notificationsCreated: number;
}

export const processEvent = async (
  event: NotificationEvent
): Promise<EventProcessingResult> => {
  const rules = await NotificationRule.find({
    eventType: event.eventType,
    enabled: true,
  }).lean();

  let matchedRules = 0;
  let notificationsCreated = 0;

  for (const rule of rules) {
    const matches = ruleEngine.evaluateRule(
      rule.conditions,
      event.data
    );

    if (!matches) {
      continue;
    }

    matchedRules++;

    for (const recipient of rule.recipients) {
      for (const channel of rule.channels) {
        const message = renderTemplate(
          rule.template,
          event.data
        );

        const notification = await Notification.create({
        ruleId: rule._id,
        eventId: event.eventId,
        recipient,
        channel,
        message,
        status: "PENDING",
        });

        try {
            const { dispatchNotification } = await import(
                "../channels/channel-dispatcher.service"
            );

            await dispatchNotification(notification);

            notification.status = "SENT";
            await notification.save();
            } catch (error) {
            console.error(
                `Failed to send ${channel} notification:`,
                error
            );

            notification.status = "FAILED";
            await notification.save();
        }

        notificationsCreated++;
      }
    }
  }

  return {
    eventId: event.eventId,
    matchedRules,
    notificationsCreated,
  };
};

const renderTemplate = (
  template: string,
  data: Record<string, unknown>
): string => {
  return template.replace(
    /\{\{(\w+)\}\}/g,
    (match, key: string) => {
      const value = data[key];

      return value !== undefined
        ? String(value)
        : match;
    }
  );
};