export type NotificationChannel = 'EMAIL' | 'IN_APP';

export type NotificationStatus =
  | 'PENDING'
  | 'SENT'
  | 'FAILED';

export type ConditionOperator =
  | 'EQUALS'
  | 'NOT_EQUALS'
  | 'GREATER_THAN'
  | 'GREATER_THAN_OR_EQUAL'
  | 'LESS_THAN'
  | 'LESS_THAN_OR_EQUAL'
  | 'CONTAINS';

export interface NotificationCondition {
  field: string;
  operator: ConditionOperator;
  value: string | number | boolean;
}

export interface NotificationRecipient {
  name: string;
  email?: string;
  userId?: string;
}

export interface NotificationRule {
  _id?: string;
  name: string;
  eventType: string;
  conditions: NotificationCondition[];
  recipients: NotificationRecipient[];
  channels: NotificationChannel[];
  template: string;
  enabled: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Notification {
  _id: string;
  ruleId: string | {
    _id: string;
    name: string;
  };
  eventId: string;
  recipient: NotificationRecipient;
  channel: NotificationChannel;
  message: string;
  status: NotificationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationEvent {
  eventId: string;
  eventType: string;
  data: Record<string, unknown>;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}