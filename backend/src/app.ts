import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import ruleRoutes from "./routes/rule.routes";
import eventRoutes from "./routes/event.routes";
import notificationRoutes from "./routes/notification.routes";

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:4200",
  })
);

app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use("/api", limiter);

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Notification API is running",
  });
});

app.use("/api/rules", ruleRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/notifications", notificationRoutes);

export default app;