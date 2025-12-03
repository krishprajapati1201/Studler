const express = require("express");
const router = express.Router();
const Milestone = require("../models/Milestone");

// GET all milestones for a specific user (by email)
router.get("/:email", async (req, res) => {
  try {
    const milestones = await Milestone.find({ email: req.params.email });
    res.json(milestones);
  } catch (err) {
    res.status(500).json({ error: "Error fetching milestones" });
  }
});

// POST new milestone
router.post("/", async (req, res) => {
  try {
    const { email, text } = req.body;
    const newMilestone = new Milestone({ email, text });
    await newMilestone.save();
    res.status(201).json(newMilestone);
  } catch (err) {
    res.status(500).json({ error: "Error creating milestone" });
  }
});

// PUT (toggle milestone completion)
router.put("/:id", async (req, res) => {
  try {
    const milestone = await Milestone.findById(req.params.id);
    if (!milestone) {
      return res.status(404).json({ error: "Milestone not found" });
    }

    milestone.completed = !milestone.completed;
    await milestone.save();
    res.json(milestone);
  } catch (err) {
    res.status(500).json({ error: "Error updating milestone" });
  }
});

// DELETE milestone
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Milestone.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Milestone not found" });
    }
    res.json({ message: "Milestone deleted", id: deleted._id });
  } catch (err) {
    res.status(500).json({ error: "Error deleting milestone" });
  }
});

module.exports = router;
