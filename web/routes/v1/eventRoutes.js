import express from "express";
import {
  generateEvent,
  getDashboardDataHandler,
  getEventCounts,
} from "../../controller/events.controller.js";
import validate from "../../middleware/validate.js";
import { generateEventValidation } from "../../validations/events.validation.js";
import { auth } from "../../middleware/auth.js";

const router = express.Router();

router.post(
  "/generate-events",
  validate(generateEventValidation),
  generateEvent
);

router.get("/event-counts/:popupId", auth, getEventCounts);

router.get("/dashboard-data", auth, getDashboardDataHandler);

export default router;
