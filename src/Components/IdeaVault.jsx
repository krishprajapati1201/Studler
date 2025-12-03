import React, { useState, useEffect } from "react";
import axios from "axios";
import "./IdeaVault.css";
import { useNavigate } from "react-router-dom";

function IdeaVault() {
  const [ideas, setIdeas] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    tags: "",
    roadmap: "",
  });

  const user = {
    name: localStorage.getItem("name"),
    email: localStorage.getItem("email"),
  };

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
    fetchIdeas();
  }, []);

  const fetchIdeas = async () => {
    const res = await axios.get("http://localhost:5000/api/ideas");
    setIdeas(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await axios.post("http://localhost:5000/api/ideas", {
      ...form,
      tags: form.tags.split(",").map((tag) => tag.trim()),
      roadmap: form.roadmap.split("\n"),
      name: user.name,
      email: user.email,
    });
    setIdeas([res.data, ...ideas]);
    setForm({ title: "", description: "", tags: "", roadmap: "" });
  };

  const handleLike = async (id) => {
    const res = await axios.post(`http://localhost:5000/api/ideas/${id}/like`, {
      email: user.email,
    });
    setIdeas(ideas.map((idea) => (idea._id === id ? res.data : idea)));
  };

  const handleComment = async (id, text) => {
    const res = await axios.post(
      `http://localhost:5000/api/ideas/${id}/comment`,
      {
        text,
        name: user.name,
        email: user.email,
      }
    );
    setIdeas(ideas.map((idea) => (idea._id === id ? res.data : idea)));
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/ideas/${id}`, {
        data: { email: user.email },
      });
      setIdeas(ideas.filter((idea) => idea._id !== id));
    } catch (err) {
      console.error("Delete failed:", err.response?.data || err.message);
      alert("You can only delete your own ideas.");
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
      <div className="idea-container">
        <h1>💡 IdeaVault</h1>

        <form onSubmit={handleSubmit} className="idea-form">
          <input
            placeholder="Startup Idea Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <input
            placeholder="Tags (comma-separated)"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
          />
          <textarea
            placeholder="Roadmap (one step per line)"
            value={form.roadmap}
            onChange={(e) => setForm({ ...form, roadmap: e.target.value })}
          />
          <button type="submit">Post Idea</button>
        </form>

        <div className="idea-list">
          {ideas.map((idea) => (
            <div key={idea._id} className="idea-card">
              <h2>{idea.title}</h2>
              <p>{idea.description}</p>
              <div className="tags">
                {idea.tags.map((tag, idx) => (
                  <span key={idx} className="tag">
                    {tag}
                  </span>
                ))}
              </div>
              <p>
                Posted by: <strong>{idea.postedBy?.name}</strong>
              </p>

              {user.email === idea.postedBy?.email && (
                <button
                  onClick={() => handleDelete(idea._id)}
                  className="delete-button"
                >
                  🗑️ Delete
                </button>
              )}

              <div>
                <button onClick={() => handleLike(idea._id)}>
                  👍 {idea.likes.length}
                </button>
              </div>

              <div className="roadmap">
                <strong>Roadmap:</strong>
                <ul>
                  {idea.roadmap.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ul>
              </div>

              <div className="comments">
                <strong>Comments:</strong>
                <ul>
                  {idea.comments.map((c, i) => (
                    <li key={i}>
                      <strong>{c.name}:</strong> {c.text}
                    </li>
                  ))}
                </ul>
                <input
                  placeholder="Add comment..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.target.value.trim()) {
                      handleComment(idea._id, e.target.value);
                      e.target.value = "";
                    }
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default IdeaVault;
