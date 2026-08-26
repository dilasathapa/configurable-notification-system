export type ConditionOperator =
  | "EQUALS"
  | "NOT_EQUALS"
  | "GREATER_THAN"
  | "GREATER_THAN_OR_EQUAL"
  | "LESS_THAN"
  | "LESS_THAN_OR_EQUAL"
  | "CONTAINS";

export interface NotificationCondition {
  field: string;
  operator: ConditionOperator;
  value: string | number | boolean;
}

export type NotificationChannel = "EMAIL" | "IN_APP";

export interface NotificationRecipient {
  name: string;
  email?: string;
  userId?: string;
}

export interface NotificationRule {
  name: string;
  eventType: string;
  conditions: NotificationCondition[];
  recipients: NotificationRecipient[];
  channels: NotificationChannel[];
  template: string;
  enabled: boolean;
}

export interface NotificationEvent {
  eventId: string;
  eventType: string;
  data: Record<string, unknown>;
  occurredAt?: Date;
}