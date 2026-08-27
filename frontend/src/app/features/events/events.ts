import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  Api,
  TriggerEventResult,
} from '../../core/services/api';

@Component({
  selector: 'app-events',
  imports: [FormsModule],
  templateUrl: './events.html',
  styleUrl: './events.scss',
})
export class Events {
  private readonly api = inject(Api);

  eventId = '';
  eventType = 'ORDER_CREATED';
  orderValue: number | null = null;

  isSubmitting = signal(false);
  errorMessage = signal('');
  result = signal<TriggerEventResult | null>(null);

  triggerEvent(): void {
    this.errorMessage.set('');
    this.result.set(null);

    if (!this.eventId.trim()) {
      this.errorMessage.set('Event ID is required.');
      return;
    }

    if (
      this.orderValue === null ||
      this.orderValue < 0
    ) {
      this.errorMessage.set(
        'Please enter a valid order value.',
      );
      return;
    }

    this.isSubmitting.set(true);

    this.api.triggerEvent({
      eventId: this.eventId.trim(),
      eventType: this.eventType,
      data: {
        orderValue: this.orderValue,
      },
    }).subscribe({
      next: (response) => {
        this.result.set(response.data);
        this.isSubmitting.set(false);
      },

      error: (error) => {
        console.error('Failed to trigger event:', error);

        this.errorMessage.set(
          error?.error?.message ??
            'Unable to trigger event. Please try again.',
        );

        this.isSubmitting.set(false);
      },
    });
  }
}