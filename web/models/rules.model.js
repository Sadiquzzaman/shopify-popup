import mongoose from "mongoose";

const rulesSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: false,
  },
  sequenceNumber: {
    type: Number,
    required: false,
  },
});

const Rule = mongoose.model("rules", rulesSchema);

export default Rule;
