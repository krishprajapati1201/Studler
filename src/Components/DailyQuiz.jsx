import React, { useEffect, useState } from "react";
import axios from "axios";
import "./DailyQuiz.css"; // Optional styling
import { useNavigate } from "react-router-dom";

const shuffle = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

const DailyQuiz = () => {
  const [quizData, setQuizData] = useState([]);
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showScore, setShowScore] = useState(false);
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
    try {
      axios
        .get("https://opentdb.com/api.php?amount=5&type=multiple")
        .then((res) => {
          const formatted = res.data.results.map((q) => ({
            question: q.question,
            options: shuffle([q.correct_answer, ...q.incorrect_answers]),
            answer: q.correct_answer,
          }));
          setQuizData(formatted);
        });
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleAnswer = (option) => {
    setSelected(option);
    if (option === quizData[current].answer) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (current + 1 < quizData.length) {
        setCurrent(current + 1);
        setSelected(null);
      } else {
        setShowScore(true);
      }
    }, 1000);
  };

  if (quizData.length === 0) return <p>Loading quiz...</p>;

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
      <div className="quiz-container">
        <h2>🧠 Daily Quiz</h2>
        {showScore ? (
          <div className="score-section">
            <h3>
              Your Score: {score} / {quizData.length}
            </h3>
          </div>
        ) : (
          <div>
            <div className="question-box">
              <h4
                dangerouslySetInnerHTML={{ __html: quizData[current].question }}
              />
              <div className="options">
                {quizData[current].options.map((option, i) => (
                  <button
                    key={i}
                    className={`option-btn ${
                      selected === option
                        ? option === quizData[current].answer
                          ? "correct"
                          : "wrong"
                        : ""
                    }`}
                    onClick={() => handleAnswer(option)}
                    dangerouslySetInnerHTML={{ __html: option }}
                    disabled={!!selected}
                  />
                ))}
              </div>
            </div>
            <p>
              Question {current + 1} of {quizData.length}
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default DailyQuiz;
