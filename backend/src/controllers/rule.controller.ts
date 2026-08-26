import { Request, Response } from "express";
import mongoose from "mongoose";
import { NotificationRule } from "../models/notification-rule.model";

export const getRules = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const rules = await NotificationRule.find()
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      data: rules,
    });
  } catch (error) {
    console.error("Failed to fetch rules:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch notification rules",
    });
  }
};

export const getRuleById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid rule ID",
      });
      return;
    }

    const rule = await NotificationRule.findById(id).lean();

    if (!rule) {
      res.status(404).json({
        success: false,
        message: "Notification rule not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: rule,
    });
  } catch (error) {
    console.error("Failed to fetch rule:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch notification rule",
    });
  }
};

export const createRule = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      name,
      eventType,
      conditions,
      recipients,
      channels,
      template,
      enabled,
    } = req.body;

    if (
      !name ||
      !eventType ||
      !conditions ||
      !recipients ||
      !channels ||
      !template
    ) {
      res.status(400).json({
        success: false,
        message: "Missing required rule fields",
      });
      return;
    }

    const rule = await NotificationRule.create({
      name,
      eventType,
      conditions,
      recipients,
      channels,
      template,
      enabled: enabled ?? true,
    });

    res.status(201).json({
      success: true,
      data: rule,
    });
  } catch (error) {
    console.error("Failed to create rule:", error);

    res.status(400).json({
      success: false,
      message: "Failed to create notification rule",
    });
  }
};

export const updateRule = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid rule ID",
      });
      return;
    }

    const rule = await NotificationRule.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!rule) {
      res.status(404).json({
        success: false,
        message: "Notification rule not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: rule,
    });
  } catch (error) {
    console.error("Failed to update rule:", error);

    res.status(400).json({
      success: false,
      message: "Failed to update notification rule",
    });
  }
};

export const toggleRule = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid rule ID",
      });
      return;
    }

    const rule = await NotificationRule.findById(id);

    if (!rule) {
      res.status(404).json({
        success: false,
        message: "Notification rule not found",
      });
      return;
    }

    rule.enabled = !rule.enabled;

    await rule.save();

    res.status(200).json({
      success: true,
      data: rule,
    });
  } catch (error) {
    console.error("Failed to toggle rule:", error);

    res.status(500).json({
      success: false,
      message: "Failed to toggle notification rule",
    });
  }
};

export const deleteRule = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    if (typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid rule ID",
      });
      return;
    }

    const rule = await NotificationRule.findByIdAndDelete(id);

    if (!rule) {
      res.status(404).json({
        success: false,
        message: "Notification rule not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Notification rule deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete rule:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete notification rule",
    });
  }
};