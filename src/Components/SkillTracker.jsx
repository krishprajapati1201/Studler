import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SkillTracker.css";
import { useNavigate } from "react-router-dom";

// You'd get this from login/session/auth context
const userEmail = localStorage.getItem("email"); // Replace with actual user email

const SkillTracker = () => {
  const [streak, setStreak] = useState(3);
  const [milestones, setMilestones] = useState([]);
  const [newMilestone, setNewMilestone] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/signin");
        return;
      }

      try {
        await axios.post("http://localhost:5000/verify-token", {
          token,
        });
        // Token is valid
      } catch (err) {
        // Token is invalid or expired
        localStorage.removeItem("token");
        navigate("/signin");
      }
    };

    checkToken();
  }, [navigate]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/milestones/${userEmail}`)
      .then((res) => setMilestones(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleAddMilestone = async () => {
    if (!newMilestone.trim()) return;
    try {
      const res = await axios.post("http://localhost:5000/api/milestones/", {
        email: userEmail,
        text: newMilestone,
      });
      setMilestones([res.data, ...milestones]);
      setNewMilestone("");
    } catch (err) {
      console.error(err);
    }
  };

  const toggleMilestone = async (id) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/milestones/${id}`);
      setMilestones(milestones.map((m) => (m._id === id ? res.data : m)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMilestone = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/milestones/${id}`);
      setMilestones(milestones.filter((m) => m._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <button
        style={{
          padding: "1rem",
          borderRadius: "0.625rem",
          border: "none",
          outline: "none",
          marginLeft: "1rem",
          marginTop: "1rem",
          cursor: "pointer",
          backgroundColor: "blue",
        }}
        onClick={() => navigate("/")}
      >
        Home
      </button>
      <div className="tracker-container">
        <h1>📈 SkillTracker Dashboard</h1>
        <p>Track your growth in coding, design, soft skills, and more!</p>

        <div className="streak-box">
          🔥 Current Streak: <strong>{streak} days</strong>
        </div>

        <div className="section">
          <h2>✅ Milestone Checklist</h2>
          <div className="add-milestone">
            <input
              type="text"
              value={newMilestone}
              onChange={(e) => setNewMilestone(e.target.value)}
              placeholder="Add a new milestone..."
            />
            <button onClick={handleAddMilestone}>Add</button>
          </div>
          <ul className="milestone-list">
            {milestones.map((m) => (
              <li key={m._id} className={m.completed ? "completed" : ""}>
                <span onClick={() => toggleMilestone(m._id)}>{m.text}</span>
                <button
                  onClick={() => handleDeleteMilestone(m._id)}
                  className="delete-btn"
                >
                  ❌
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="section">
          <h2>📊 Your Progress Graph (Coming Soon)</h2>
          <p>[Placeholder for future graph integration]</p>
        </div>
      </div>
    </>
  );
};

export default SkillTracker;
