const mongoose = require("mongoose");

const ideaSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    tags: [String], // e.g., ['Looking for dev', 'Idea only']
    postedBy: {
      name: String,
      email: String,
    },
    likes: [String], // email addresses
    comments: [
      {
        text: String,
        name: String,
        email: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    roadmap: [String], // Optional roadmap steps
  },
  { timestamps: true }
);

module.exports = mongoose.model("Idea", ideaSchema);
