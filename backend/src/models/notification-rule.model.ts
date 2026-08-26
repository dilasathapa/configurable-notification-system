import mongoose, { Document, Schema } from "mongoose";
import {
  ConditionOperator,
  NotificationChannel,
} from "../types/notification";

interface Condition {
  field: string;
  operator: ConditionOperator;
  value: string | number | boolean;
}

interface Recipient {
  name: string;
  email?: string;
  userId?: string;
}

export interface NotificationRuleDocument extends Document {
  name: string;
  eventType: string;
  conditions: Condition[];
  recipients: Recipient[];
  channels: NotificationChannel[];
  template: string;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const conditionSchema = new Schema<Condition>(
  {
    field: {
      type: String,
      required: true,
      trim: true,
    },
    operator: {
      type: String,
      required: true,
      enum: [
        "EQUALS",
        "NOT_EQUALS",
        "GREATER_THAN",
        "GREATER_THAN_OR_EQUAL",
        "LESS_THAN",
        "LESS_THAN_OR_EQUAL",
        "CONTAINS",
      ],
    },
    value: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  { _id: false }
);

const recipientSchema = new Schema<Recipient>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    userId: {
      type: String,
      trim: true,
    },
  },
  { _id: false }
);

const notificationRuleSchema =
  new Schema<NotificationRuleDocument>(
    {
      name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
      },

      eventType: {
        type: String,
        required: true,
        trim: true,
      },

      conditions: {
        type: [conditionSchema],
        required: true,
        validate: {
          validator: (conditions: Condition[]) =>
            conditions.length > 0,
          message: "At least one condition is required",
        },
      },

      recipients: {
        type: [recipientSchema],
        required: true,
        validate: {
          validator: (recipients: Recipient[]) =>
            recipients.length > 0,
          message: "At least one recipient is required",
        },
      },

      channels: {
        type: [String],
        required: true,
        enum: ["EMAIL", "IN_APP"],
        validate: {
          validator: (channels: NotificationChannel[]) =>
            channels.length > 0,
          message: "At least one channel is required",
        },
      },

      template: {
        type: String,
        required: true,
        trim: true,
        maxlength: 1000,
      },

      enabled: {
        type: Boolean,
        default: true,
      },
    },
    {
      timestamps: true,
    }
  );

notificationRuleSchema.index({
  eventType: 1,
  enabled: 1,
});

export const NotificationRule = mongoose.model<NotificationRuleDocument>(
  "NotificationRule",
  notificationRuleSchema
);