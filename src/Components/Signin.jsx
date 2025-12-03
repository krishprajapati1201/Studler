// === frontend/Signin.js ===
import React, { useState } from "react";
import axios from "axios";
import "./Signin.css";
import { useNavigate } from "react-router-dom";

function Signin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSignin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/signin",
        form
      );

      if (res.status === 200) {
        navigate("/");
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("email", res.data.user.email);
        localStorage.setItem("name", res.data.user.name);
      }
      setMessage("Login successful!");
    } catch (err) {
      setMessage(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-box">
        <h2 className="signin-title">Sign In</h2>
        <form className="signin-form" onSubmit={handleSignin}>
          <input
            className="signin-input"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password"
            className="signin-input"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button type="submit" className="signin-button">
            Sign In
          </button>
        </form>
        <p className="signin-message">{message}</p>
      </div>
    </div>
  );
}

export default Signin;
