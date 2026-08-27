import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RuleCondition {
  field: string;
  operator: string;
  value: number;
}

export interface RuleRecipient {
  name: string;
  email: string;
}

export interface NotificationRule {
  _id?: string;
  name: string;
  eventType: string;
  conditions: RuleCondition[];
  recipients: RuleRecipient[];
  channels: string[];
  template: string;
  enabled: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface NotificationRecipient {
  name: string;
  email: string;
}

export interface NotificationRuleReference {
  _id: string;
  name: string;
}

export interface Notification {
  _id: string;
  ruleId: NotificationRuleReference;
  eventId: string;
  recipient: NotificationRecipient;
  channel: string;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface TriggerEventData {
  eventId: string;
  eventType: string;
  data: {
    orderValue: number;
  };
}

export interface TriggerEventResult {
  eventId: string;
  matchedRules: number;
  notificationsCreated: number;
}

@Injectable({
  providedIn: 'root',
})
export class Api {
  private readonly http = inject(HttpClient);

  private readonly baseUrl = 'http://localhost:5005/api';

  getRules(): Observable<ApiResponse<NotificationRule[]>> {
    return this.http.get<ApiResponse<NotificationRule[]>>(
      `${this.baseUrl}/rules`,
    );
  }

  createRule(
    rule: NotificationRule,
  ): Observable<ApiResponse<NotificationRule>> {
    return this.http.post<ApiResponse<NotificationRule>>(
      `${this.baseUrl}/rules`,
      rule,
    );
  }

  updateRule(
    id: string,
    rule: Partial<NotificationRule>,
  ): Observable<ApiResponse<NotificationRule>> {
    return this.http.put<ApiResponse<NotificationRule>>(
      `${this.baseUrl}/rules/${id}`,
      rule,
    );
  }

  deleteRule(id: string): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(
      `${this.baseUrl}/rules/${id}`,
    );
  }

  triggerEvent(
    event: TriggerEventData,
  ): Observable<ApiResponse<TriggerEventResult>> {
    return this.http.post<ApiResponse<TriggerEventResult>>(
      `${this.baseUrl}/events`,
      event,
    );
  }

  getNotifications(): Observable<ApiResponse<Notification[]>> {
    return this.http.get<ApiResponse<Notification[]>>(
      `${this.baseUrl}/notifications`,
    );
  }
}