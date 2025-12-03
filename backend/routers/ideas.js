const express = require("express");
const router = express.Router();
const Idea = require("../models/idea");

// Get all ideas
router.get("/", async (req, res) => {
  const ideas = await Idea.find().sort({ createdAt: -1 });
  res.json(ideas);
});

// Post a new idea
router.post("/", async (req, res) => {
  const { title, description, tags, name, email, roadmap } = req.body;
  const idea = new Idea({
    title,
    description,
    tags,
    postedBy: { name, email },
    roadmap,
  });
  await idea.save();
  res.status(201).json(idea);
});

// Like/unlike
router.post("/:id/like", async (req, res) => {
  const { email } = req.body;
  const idea = await Idea.findById(req.params.id);

  if (idea.likes.includes(email)) {
    idea.likes.pull(email);
  } else {
    idea.likes.push(email);
  }

  await idea.save();
  res.json(idea);
});

// Comment
router.post("/:id/comment", async (req, res) => {
  const { text, name, email } = req.body;
  const idea = await Idea.findById(req.params.id);
  idea.comments.push({ text, name, email });
  await idea.save();
  res.json(idea);
});

router.delete("/:id", async (req, res) => {
  const { email } = req.body;

  try {
    const idea = await Idea.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({ message: "Idea not found" });
    }

    if (idea.postedBy.email !== email) {
      return res
        .status(403)
        .json({
          message: "Unauthorized: Only the poster can delete this idea",
        });
    }

    await idea.deleteOne();
    res.status(200).json({ message: "Idea deleted successfully" });
  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
