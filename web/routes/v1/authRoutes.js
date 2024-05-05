import express from "express";
import {
  loginWithUserId,
  register,
  shopInfo,
  shopifyAuth,
  signUp,
  verifyEmailToken
} from "../../controller/auth.controller.js";
import validate from "../../middleware/validate.js";
import { login, signUpSchema, userSchema, verifyEmail } from "../../validations/auth.validation.js";
import { auth } from "../../middleware/auth.js";

const router = express.Router();

router.post("/register", validate(userSchema), register);
router.post("/sign-up", validate(signUpSchema), signUp);
router.get("/verify-email", validate(verifyEmail), verifyEmailToken);
router.post("/login", validate(login), loginWithUserId);
router.get("/shopify-auth", shopifyAuth);
router.get("/shop-info", auth, shopInfo);


export default router;
