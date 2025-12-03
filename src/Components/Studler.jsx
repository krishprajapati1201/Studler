import React, { useEffect, useState } from "react";
import "./Studler.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Studler() {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ title: "", content: "" });
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [user, setUser] = useState({ email: "", name: "" });

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
    const email = localStorage.getItem("email");
    const name = localStorage.getItem("name");
    const token = localStorage.getItem("token");

    if (!token) return;

    setUser({ email, name });

    axios
      .get("http://localhost:5000/api/notes")
      .then((res) => setNotes(res.data))
      .catch((err) => console.error("Error fetching notes", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    try {
      if (editingNoteId) {
        // Update
        const res = await axios.put(
          `http://localhost:5000/api/notes/${editingNoteId}`,
          form,
          { headers }
        );
        setNotes(notes.map((n) => (n._id === editingNoteId ? res.data : n)));
        setEditingNoteId(null);
      } else {
        // Create
        const res = await axios.post("http://localhost:5000/api/notes", form, {
          headers,
        });
        setNotes([res.data, ...notes]);
      }

      setForm({ title: "", content: "" });
    } catch (err) {
      console.error("Error saving note", err);
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    try {
      await axios.delete(`http://localhost:5000/api/notes/${id}`, { headers });
      setNotes(notes.filter((note) => note._id !== id));
    } catch (err) {
      console.error("Error deleting note", err);
    }
  };

  const handleEdit = (note) => {
    setEditingNoteId(note._id);
    setForm({ title: note.title, content: note.content });
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
      <div className="container">
        <h1>Student NotesHub</h1>

        <form onSubmit={handleSubmit} className="form">
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Note Title"
            className="input"
          />
          <textarea
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            placeholder="Note Content"
          />
          <button type="submit" className="button">
            {editingNoteId ? "Update Note" : "Upload"}
          </button>
        </form>

        <h2>All Notes</h2>
        <ul>
          {notes.map((note) => {
            const isOwner = note.uploadedBy?.email === user.email;
            return (
              <li key={note._id}>
                <h3>{note.title}</h3>
                <p>{note.content}</p>
                <small>
                  Uploaded by: {note.uploadedBy?.name || "Anonymous"}
                </small>
                {isOwner && (
                  <div>
                    <button
                      onClick={() => handleEdit(note)}
                      className="edit-btn"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(note._id)}
                      className="delete-btn"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

export default Studler;
