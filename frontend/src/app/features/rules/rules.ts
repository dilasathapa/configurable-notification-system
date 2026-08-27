import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  Api,
  NotificationRule,
} from '../../core/services/api';

@Component({
  selector: 'app-rules',
  imports: [RouterLink],
  templateUrl: './rules.html',
  styleUrl: './rules.scss',
})
export class Rules implements OnInit {
  private readonly api = inject(Api);

  readonly rules = signal<NotificationRule[]>([]);
  readonly isLoading = signal(true);
  readonly errorMessage = signal('');

  ngOnInit(): void {
    this.loadRules();
  }

  loadRules(): void {

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.api.getRules().subscribe({
      next: (response) => {

        this.rules.set(response.data ?? []);
        this.isLoading.set(false);

      },

      error: (error) => {
        console.error('Failed to load rules:', error);

        this.isLoading.set(false);

        this.errorMessage.set(
          error?.error?.message ??
          'Unable to load notification rules.'
        );
      },

      complete: () => {
        console.log('Rules API request completed');
      },
    });
  }

  toggleRule(rule: NotificationRule): void {
    if (!rule._id) {
      return;
    }

    const newStatus = !rule.enabled;

    this.api.updateRule(rule._id, {
      enabled: newStatus,
    }).subscribe({
      next: () => {
        this.rules.update((currentRules) =>
          currentRules.map((currentRule) =>
            currentRule._id === rule._id
              ? {
                  ...currentRule,
                  enabled: newStatus,
                }
              : currentRule
          )
        );
      },

      error: (error) => {
        console.error('Failed to update rule:', error);
      },
    });
  }
}