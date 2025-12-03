// === server/models/Note.js ===
const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    uploadedBy: {
      email: {
        type: String,
      },
      name: {
        type: String,
        default: "Anonymous",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", noteSchema);
