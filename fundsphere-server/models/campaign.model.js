const mongoose = require("mongoose");

const milestoneSchema = new mongoose.Schema({
  percentage: { type: Number, required: true },
  description: { type: String, required: true },
});

const campaignSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  goalAmount: { type: Number, required: true },
  deadline: { type: Date, required: true },
  media: [{ type: String }],
  milestones: [milestoneSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: { type: String, enum: ["draft", "published"], default: "draft" },
});

module.exports = mongoose.model("Campaign", campaignSchema);
