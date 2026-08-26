import { Request, Response } from "express";
import { processEvent } from "../services/notifications/event-processing.service";

export const triggerEvent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { eventId, eventType, data } = req.body;

    if (!eventId || !eventType || !data) {
      res.status(400).json({
        success: false,
        message:
          "eventId, eventType and data are required",
      });
      return;
    }

    if (
      typeof eventId !== "string" ||
      typeof eventType !== "string" ||
      typeof data !== "object" ||
      Array.isArray(data) ||
      data === null
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid event payload",
      });
      return;
    }

    const result = await processEvent({
      eventId,
      eventType,
      data,
      occurredAt: new Date(),
    });

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Failed to process event:", error);

    res.status(500).json({
      success: false,
      message: "Failed to process event",
    });
  }
};