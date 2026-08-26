import { Request, Response } from "express";
import { Notification } from "../models/notification.model";

export const getNotifications = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const notifications = await Notification.find()
      .populate("ruleId", "name")
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error) {
    console.error(
      "Failed to fetch notification history:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch notification history",
    });
  }
};