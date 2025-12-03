const mongoose = require("mongoose");

const milestoneSchema = new mongoose.Schema(
  {
    email: { type: String, required: true }, // <- updated
    text: { type: String, required: true },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);


module.exports = mongoose.model("Milestone", milestoneSchema);
