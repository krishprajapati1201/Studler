import React from "react";
import Studler from "./Components/Studler";
import Signup from "./Components/Signup";
import Signin from "./Components/Signin";
import IdeaVault from "./Components/IdeaVault";
import Home from "./Components/Home";
import SkillTracker from "./Components/SkillTracker"; // <-- Add this line


import { Route, Routes, useNavigate } from "react-router-dom";
import DailyQuiz from "./Components/DailyQuiz";

const App = () => {
  const navigate = useNavigate();
  return (
    <div>
  
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/studler" element={<Studler />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/ideavault" element={<IdeaVault />} />
        <Route path="/skilltracker" element={<SkillTracker />} />
        <Route path="/dailyquiz" element={<DailyQuiz />} />
      </Routes>
    </div>
  );
};

export default App;
