import {
  Component,
  OnDestroy,
  OnInit,
  inject,
  signal,
} from '@angular/core';

import { RouterLink } from '@angular/router';

import { Subject, timer } from 'rxjs';

import {
  catchError,
  finalize,
  map,
  takeUntil,
} from 'rxjs/operators';

import {
  Api,
  Notification,
  NotificationRule,
} from '../../core/services/api';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit, OnDestroy {
  private readonly api = inject(Api);
  private readonly destroy$ = new Subject<void>();

  /**
   * Dashboard KPI signals.
   *
   * They start at 0 so the cards are immediately visible.
   */
  readonly activeRules = signal(0);
  readonly totalNotifications = signal(0);
  readonly sentNotifications = signal(0);
  readonly failedNotifications = signal(0);

  /**
   * Controls the recent notification loading state.
   *
   * The loader only appears when the request takes
   * longer than 500ms.
   */
  readonly isNotificationLoading = signal(false);

  /**
   * Recent notifications displayed on the dashboard.
   */
  readonly recentNotifications = signal<
    {
      rule: string;
      recipient: string;
      channel: string;
      status: string;
      time: string;
    }[]
  >([]);

  ngOnInit(): void {
    console.log('DASHBOARD INIT');

    this.loadDashboard();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Load dashboard data.
   *
   * Rules and notifications are intentionally loaded
   * independently so one request doesn't block the other.
   */
  private loadDashboard(): void {
    this.resetDashboard();

    let rulesLoaded = false;
    let notificationsLoaded = false;

    /**
     * Don't immediately show the loader.
     *
     * If the APIs respond within 500ms, the user sees
     * the actual data without seeing a spinner.
     */
    const loadingTimer = timer(500)
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        if (
          !rulesLoaded ||
          !notificationsLoaded
        ) {
          this.isNotificationLoading.set(true);
        }
      });

    /**
     * LOAD RULES
     */
    this.api
      .getRules()
      .pipe(
        takeUntil(this.destroy$),

        map(
          (response) =>
            response.data ?? [],
        ),

        catchError((error) => {
          console.error(
            'Failed to load dashboard rules:',
            error,
          );

          return [
            [] as NotificationRule[],
          ];
        }),

        finalize(() => {
          rulesLoaded = true;

          if (notificationsLoaded) {
            loadingTimer.unsubscribe();

            this.isNotificationLoading.set(
              false,
            );
          }
        }),
      )
      .subscribe({
        next: (rules) => {
          console.log(
            'Dashboard rules:',
            rules,
          );

          this.updateRuleStats(rules);
        },
      });

    /**
     * LOAD NOTIFICATIONS
     */
    this.api
      .getNotifications()
      .pipe(
        takeUntil(this.destroy$),

        map(
          (response) =>
            response.data ?? [],
        ),

        catchError((error) => {
          console.error(
            'Failed to load dashboard notifications:',
            error,
          );

          return [
            [] as Notification[],
          ];
        }),

        finalize(() => {
          notificationsLoaded = true;

          if (rulesLoaded) {
            loadingTimer.unsubscribe();

            this.isNotificationLoading.set(
              false,
            );
          }
        }),
      )
      .subscribe({
        next: (notifications) => {
          console.log(
            'Dashboard notifications:',
            notifications,
          );

          this.updateNotificationStats(
            notifications,
          );

          this.updateRecentNotifications(
            notifications,
          );
        },
      });
  }

  /**
   * Reset dashboard values.
   */
  private resetDashboard(): void {
    this.activeRules.set(0);
    this.totalNotifications.set(0);
    this.sentNotifications.set(0);
    this.failedNotifications.set(0);

    this.isNotificationLoading.set(false);

    this.recentNotifications.set([]);
  }

  /**
   * Update Active Rules KPI.
   */
  private updateRuleStats(
    rules: NotificationRule[],
  ): void {
    const activeRules = rules.filter(
      (rule) => rule.enabled,
    ).length;

    this.activeRules.set(activeRules);

    console.log(
      'Active rules KPI:',
      activeRules,
    );
  }

  /**
   * Update notification KPIs.
   */
  private updateNotificationStats(
    notifications: Notification[],
  ): void {
    const total =
      notifications.length;

    const sent =
      notifications.filter(
        (notification) =>
          notification.status === 'SENT',
      ).length;

    const failed =
      notifications.filter(
        (notification) =>
          notification.status === 'FAILED',
      ).length;

    this.totalNotifications.set(total);
    this.sentNotifications.set(sent);
    this.failedNotifications.set(failed);

    console.log(
      'Notification KPIs:',
      {
        total,
        sent,
        failed,
      },
    );
  }

  /**
   * Update recent notifications.
   */
  private updateRecentNotifications(
    notifications: Notification[],
  ): void {
    const recent =
      notifications
        .slice()
        .sort(
          (a, b) =>
            new Date(
              b.createdAt,
            ).getTime() -
            new Date(
              a.createdAt,
            ).getTime(),
        )
        .slice(0, 5)
        .map((notification) => ({
          rule:
            notification.ruleId?.name ??
            'Unknown rule',

          recipient:
            notification.recipient?.name ??
            notification.recipient?.email ??
            'Unknown recipient',

          channel:
            notification.channel,

          status:
            notification.status,

          time:
            this.formatTime(
              notification.createdAt,
            ),
        }));

    this.recentNotifications.set(
      recent,
    );
  }

  /**
   * Convert an ISO timestamp into
   * a human-readable relative time.
   */
  private formatTime(
    date: string,
  ): string {
    if (!date) {
      return '';
    }

    const createdAt =
      new Date(date);

    if (
      Number.isNaN(
        createdAt.getTime(),
      )
    ) {
      return '';
    }

    const now = new Date();

    const difference = Math.max(
      0,
      now.getTime() -
        createdAt.getTime(),
    );

    const minutes = Math.floor(
      difference / 60000,
    );

    if (minutes < 1) {
      return 'Just now';
    }

    if (minutes < 60) {
      return `${minutes}m ago`;
    }

    const hours = Math.floor(
      minutes / 60,
    );

    if (hours < 24) {
      return `${hours}h ago`;
    }

    const days = Math.floor(
      hours / 24,
    );

    if (days < 30) {
      return `${days}d ago`;
    }

    return createdAt.toLocaleDateString(
      undefined,
      {
        month: 'short',
        day: 'numeric',
      },
    );
  }
}