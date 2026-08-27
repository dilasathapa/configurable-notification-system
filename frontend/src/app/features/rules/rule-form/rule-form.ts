import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { Api } from '../../../core/services/api';

@Component({
  selector: 'app-rule-form',
  imports: [
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './rule-form.html',
  styleUrl: './rule-form.scss',
})
export class RuleForm {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);

  private readonly api = inject(Api);

  readonly ruleForm = this.formBuilder.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],

    eventType: ['ORDER_CREATED', Validators.required],

    conditionField: ['orderValue', Validators.required],

    conditionOperator: ['GREATER_THAN', Validators.required],

    conditionValue: [
      '',
      [
        Validators.required,
        Validators.pattern(/^\d+(\.\d+)?$/),
      ],
    ],

    recipientName: ['', Validators.required],

    recipientEmail: [
      '',
      [
        Validators.required,
        Validators.email,
      ],
    ],

    emailChannel: [true],

    inAppChannel: [true],

    template: [
      '',
      [
        Validators.required,
        Validators.maxLength(500),
      ],
    ],

    enabled: [true],
  });

  isSubmitting = false;
  submitError = '';

  submit(): void {
    this.submitError = '';

    if (this.ruleForm.invalid) {
      this.ruleForm.markAllAsTouched();
      return;
    }

    const value = this.ruleForm.getRawValue();

    const channels: string[] = [];

    if (value.emailChannel) {
      channels.push('EMAIL');
    }

    if (value.inAppChannel) {
      channels.push('IN_APP');
    }

    if (channels.length === 0) {
      this.submitError = 'Select at least one notification channel.';
      return;
    }

    const payload = {
      name: value.name!,
      eventType: value.eventType!,
      conditions: [
        {
          field: value.conditionField!,
          operator: value.conditionOperator!,
          value: Number(value.conditionValue),
        },
      ],
      recipients: [
        {
          name: value.recipientName!,
          email: value.recipientEmail!,
        },
      ],
      channels,
      template: value.template!,
      enabled: value.enabled ?? true,
    };

    this.isSubmitting = true;

    this.api.createRule(payload).subscribe({
      next: (response) => {
        console.log('Rule created successfully:', response);

        this.isSubmitting = false;
        this.router.navigate(['/rules']);
      },

      error: (error) => {
        console.error('Failed to create rule:', error);

        this.isSubmitting = false;
        this.submitError =
          error?.error?.message ??
          'Unable to create the notification rule. Please try again.';
      },
    });
  }
}