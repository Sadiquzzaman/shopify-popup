import mongoose from "mongoose";

const leadSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  }, 
  name: {
    type: String,
    required: true,
  },
  popUp: {
    type: String,
    required: true,
  },
  shop: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const Lead = mongoose.model("leads", leadSchema);

export default Lead;
