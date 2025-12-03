// === server/server.js ===
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken")
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

const notesRouter = require("./routers/notes");
const authRouter = require("./routers/auth");
const ideasRouter = require("./routers/ideas");
const milestoneRoutes = require("./routers/Milestone");

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.use("/api/notes", notesRouter);
app.use("/api/auth", authRouter);
app.use("/api/ideas", ideasRouter);
app.use("/api/milestones", milestoneRoutes);

app.post("/verify-token", (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(401).json({ message: "Token required" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Token is invalid or expired" });
    }

    return res.status(200).json({ message: "Token is valid", user: decoded });
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
