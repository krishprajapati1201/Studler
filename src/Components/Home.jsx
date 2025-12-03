import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";
import axios from "axios";


const Home = () => {

  const navigate = useNavigate()

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

  return (
    <div className="home-container">
      <h1>🎓 Welcome to Studler</h1>
      <p>
        Studler is your all-in-one student productivity platform. Whether you're
        managing tasks, brainstorming startup ideas, or collaborating with
        peers, we've got you covered.
      </p>

      <div className="navigation-buttons">
        <Link to="/studler" className="nav-button">
          📋 Go to Studler
        </Link>
        <Link to="/ideavault" className="nav-button">
          💡 Explore IdeaVault
        </Link>
        <Link to="/skilltracker" className="nav-button">
          📈 Visit SkillTracker
        </Link>
        <Link to="/dailyquiz" className="nav-button">
          🧠 Try Daily Quiz
        </Link>
      </div>
    </div>
  );
};

export default Home;
