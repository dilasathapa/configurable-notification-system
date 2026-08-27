import { Component, inject, signal } from '@angular/core';

import {
  Api,
  Notification,
} from '../../core/services/api';

@Component({
  selector: 'app-notifications',
  imports: [],
  templateUrl: './notifications.html',
  styleUrl: './notifications.scss',
})
export class Notifications {
  private readonly api = inject(Api);

  notifications = signal<Notification[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.api.getNotifications().subscribe({
      next: (response) => {
        this.notifications.set(response.data);
        this.isLoading.set(false);
      },

      error: (error) => {
        console.error(
          'Failed to load notifications:',
          error,
        );

        this.isLoading.set(false);

        this.errorMessage.set(
          error?.error?.message ??
            'Unable to load notification history.',
        );
      },
    });
  }

  getStatusClass(status: string): string {
    return status.toLowerCase();
  }

  getChannelClass(channel: string): string {
    return channel.toLowerCase();
  }

  formatDate(date: string): string {
    return new Intl.DateTimeFormat('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(date));
  }
}