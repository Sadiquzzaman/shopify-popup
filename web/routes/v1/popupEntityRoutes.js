import express from "express";
import {
  createPopUpEntity,
  deletePopup,
  getPopUpById,
  getPopUps,
  updatePopUpEntity,
} from "../../controller/popup-entity.controller.js";
import { auth } from "../../middleware/auth.js";
import { upload } from "../../middleware/multer.js";
import validate from "../../middleware/validate.js";
import {
  deletePopUps,
  popupEntitySchema
} from "../../validations/popup-entity.validation.js";

const router = express.Router();

router.post(
  "/",
  auth,
  validate(popupEntitySchema),
  createPopUpEntity
);
router.get("/", getPopUps);
router.patch("/:id",auth,upload.single("file"),  updatePopUpEntity);
router.get("/:id",auth, getPopUpById);
router.delete(
  "/",
  auth,
  validate(deletePopUps),
  deletePopup
);

export default router;
