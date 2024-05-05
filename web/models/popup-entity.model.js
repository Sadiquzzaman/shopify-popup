import { string } from "joi";
import mongoose from "mongoose";

const popupEntitySchema = new mongoose.Schema({
  background: {
    color: String,
  },
  headingField: {
    textAlignment: String,
    textContent: String,
    fontColor: String,
    fontFamily: String,
    fontSize: String,
  },
  inputFieldLabel01: {
    textAlignment: String,
    textContent: String,
    fontColor: String,
    fontFamily: String,
    fontSize: String,
  },
  inputFieldLabel02: {
    textAlignment: String,
    textContent: String,
    fontColor: String,
    fontFamily: String,
    fontSize: String,
  },
  submitButtonField: {
    textAlignment: String,
    textContent: String,
    fontColor: String,
    fontFamily: String,
    fontSize: String,
  },
  popupType: {
    type: String,
    enum: ["text", "form", "image"],
    default: "text",
  },
  totalMouseOut: {
    type: Number,
    default: 0,
  },
  totalInactivity: {
    type: Number,
    default: 0,
  },
  template_id: {
    type: string,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  activeStatus: {
    type: String,
    enum: ["active", "inactive","draft"],
    default: "inactive",
  },
  background_image: String,
  logo_image: String,
  rules: [
    {
      configurationId: {
        type: String,
      },
      description: {
        type: String,
      },
      value: {
        type: Number,
      },
      sequenceNumber: {
        type: Number,
      },
      status: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Active",
      },
    },
  ],
  shop: String,
  image_type: {
    type: String,
    enum: ["background_image", "logo_image"],
  },
  image: mongoose.Schema.Types.Mixed,
});

const PopupEntitySchema = new mongoose.Schema(popupEntitySchema, { strict: false });

const PopupEntity = mongoose.model("popupEntities", PopupEntitySchema);

export default PopupEntity;
