import { Router } from "express";
import { triggerEvent } from "../controllers/event.controller";

const router = Router();

router.post("/", triggerEvent);

export default router;