import mongoose, { Document, Schema } from "mongoose";

export interface ProcessedEventDocument extends Document {
  eventId: string;
  eventType: string;
  processedAt: Date;
}

const processedEventSchema =
  new Schema<ProcessedEventDocument>(
    {
      eventId: {
        type: String,
        required: true,
        unique: true,
        index: true,
      },

      eventType: {
        type: String,
        required: true,
      },

      processedAt: {
        type: Date,
        default: Date.now,
      },
    }
  );

export const ProcessedEvent =
  mongoose.model<ProcessedEventDocument>(
    "ProcessedEvent",
    processedEventSchema
  );
  