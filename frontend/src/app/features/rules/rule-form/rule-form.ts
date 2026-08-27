import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterLink,
} from '@angular/router';

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
export class RuleForm implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(Api);
  private readonly changeDetector = inject(ChangeDetectorRef);

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

  isEditMode = false;
  isLoadingRule = false;
  ruleId = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    

    if (id) {
      this.isEditMode = true;
      this.ruleId = id;

      

      this.loadRule(id);
    }
  }

  loadRule(id: string): void {
    this.isLoadingRule = true;

    

    this.submitError = '';

    this.api.getRule(id).subscribe({
      next: (response) => {
        

        const rule = response.data;

        const condition = rule.conditions?.[0];
        const recipient = rule.recipients?.[0];

        this.ruleForm.patchValue({
          name: rule.name,
          eventType: rule.eventType,

          conditionField: condition?.field ?? '',
          conditionOperator: condition?.operator ?? 'GREATER_THAN',
          conditionValue: condition?.value?.toString() ?? '',

          recipientName: recipient?.name ?? '',
          recipientEmail: recipient?.email ?? '',

          emailChannel: rule.channels.includes('EMAIL'),
          inAppChannel: rule.channels.includes('IN_APP'),

          template: rule.template,
          enabled: rule.enabled,
        });

        this.isLoadingRule = false;
        this.changeDetector.detectChanges();

        
      },

      error: (error) => {

        console.error('Failed to load rule:', error);

        this.isLoadingRule = false;

        this.submitError =
          error?.error?.message ??
          'Unable to load the notification rule.';

        this.changeDetector.detectChanges();
      },
    });
  }

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
      this.submitError =
        'Select at least one notification channel.';
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

    const request$ = this.isEditMode
      ? this.api.updateRule(this.ruleId, payload)
      : this.api.createRule(payload);

    request$.subscribe({
      next: (response) => {
        

        this.isSubmitting = false;

        this.router.navigate(['/rules']);
      },

      error: (error) => {
        console.error(
          this.isEditMode
            ? 'Failed to update rule:'
            : 'Failed to create rule:',
          error,
        );

        this.isSubmitting = false;

        this.submitError =
          error?.error?.message ??
          (
            this.isEditMode
              ? 'Unable to update the notification rule. Please try again.'
              : 'Unable to create the notification rule. Please try again.'
          );
      },
    });
  }
}