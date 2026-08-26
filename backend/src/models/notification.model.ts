import mongoose, { Document, Schema } from "mongoose";
import { NotificationChannel } from "../types/notification";

export type NotificationStatus =
  | "PENDING"
  | "SENT"
  | "FAILED";

export interface NotificationDocument extends Document {
  ruleId: mongoose.Types.ObjectId;
  eventId: string;
  recipient: {
    name: string;
    email?: string;
    userId?: string;
  };
  channel: NotificationChannel;
  message: string;
  status: NotificationStatus;
  createdAt: Date;
  updatedAt: Date;
}

const notificationSchema =
  new Schema<NotificationDocument>(
    {
      ruleId: {
        type: Schema.Types.ObjectId,
        ref: "NotificationRule",
        required: true,
      },

      eventId: {
        type: String,
        required: true,
        index: true,
      },

      recipient: {
        name: {
          type: String,
          required: true,
        },
        email: String,
        userId: String,
      },

      channel: {
        type: String,
        enum: ["EMAIL", "IN_APP"],
        required: true,
      },

      message: {
        type: String,
        required: true,
      },

      status: {
        type: String,
        enum: ["PENDING", "SENT", "FAILED"],
        default: "PENDING",
      },
    },
    {
      timestamps: true,
    }
  );

notificationSchema.index(
  {
    eventId: 1,
    ruleId: 1,
    channel: 1,
    "recipient.email": 1,
  },
  {
    unique: true,
  }
);

export const Notification =
  mongoose.model<NotificationDocument>(
    "Notification",
    notificationSchema
  );