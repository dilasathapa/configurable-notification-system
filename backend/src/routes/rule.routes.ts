import { Router } from "express";
import {
  createRule,
  deleteRule,
  getRuleById,
  getRules,
  toggleRule,
  updateRule,
} from "../controllers/rule.controller";

const router = Router();

router.get("/", getRules);
router.post("/", createRule);
router.get("/:id", getRuleById);
router.put("/:id", updateRule);
router.patch("/:id/toggle", toggleRule);
router.delete("/:id", deleteRule);

export default router;