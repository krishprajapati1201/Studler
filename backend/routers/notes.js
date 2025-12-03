const express = require("express");
const router = express.Router();
const Note = require("../models/note");
const auth = require("../middleware/authMiddleware");

// GET all notes (public)
router.get("/", async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new note (authenticated)
router.post("/", auth, async (req, res) => {
  try {
    const { title, content } = req.body;

    const uploadedBy = {
      email: req.user.email,
      name: req.user.name,
    };

    const newNote = new Note({ title, content, uploadedBy });
    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE a note by ID (authenticated + owner only)
router.delete("/:id", auth, async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) return res.status(404).json({ msg: "Note not found" });

    if (note.uploadedBy.email !== req.user.email)
      return res
        .status(403)
        .json({ msg: "You can only delete your own notes" });

    await note.deleteOne();
    res.json({ msg: "Note deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE a note by ID (authenticated + owner only)
router.put("/:id", auth, async (req, res) => {
  try {
    const { title, content } = req.body;
    const note = await Note.findById(req.params.id);

    if (!note) return res.status(404).json({ msg: "Note not found" });

    if (note.uploadedBy.email !== req.user.email)
      return res
        .status(403)
        .json({ msg: "You can only update your own notes" });

    note.title = title || note.title;
    note.content = content || note.content;

    const updatedNote = await note.save();
    res.json(updatedNote);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
