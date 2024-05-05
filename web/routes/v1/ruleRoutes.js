import express from "express";
import { getRules } from "../../controller/rules.controller.js";
import { auth } from "../../middleware/auth.js";

const router = express.Router();

router.get("/",auth, getRules);

export default router;
