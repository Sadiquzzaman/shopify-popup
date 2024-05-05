import express from "express";
import { generateLead, getLead, getLeads } from "../../controller/leads.controller.js";
import validate from "../../middleware/validate.js";
import { generateLeads, getLeadData, getLeadsData } from "../../validations/leads.validation.js";
import { auth } from "../../middleware/auth.js";

const router = express.Router();

router.post("/generate-lead",validate(generateLeads), generateLead);
router.get("/get-lead", auth,validate(getLeadsData), getLeads);
router.get("/:popUpId", auth, validate(getLeadData), getLead);

export default router;
