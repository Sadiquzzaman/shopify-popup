import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
  },
  eventType: {
    type: String,
    enum: ["View", "Click"],
    required: true,
  },
  popUpId: {
    type: String,
    ref: "popupEntities",
    required: true,
  },
});

const Event = mongoose.model("events", eventSchema);

export default Event;
