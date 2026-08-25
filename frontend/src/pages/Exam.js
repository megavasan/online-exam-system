import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Timer from "../components/Timer";
import { useNavigate, useParams } from "react-router-dom";

export default function Exam() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loadingError, setLoadingError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [violations, setViolations] = useState(0);

  const navigate = useNavigate();
  const { subject } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));

  const hasSubmitted = useRef(false);
  const questionRefs = useRef([]);
  const lastViolationTime = useRef(0);

  // ==========================
  // Redirect if not logged in
  // ==========================
  useEffect(() => {
    if (!user?._id) {
      navigate("/login");
    }
  }, [user, navigate]);

  // ==========================
  // Fetch Questions
  // ==========================
  useEffect(() => {
    if (!user?._id || !subject) {
      setLoadingError("Invalid user or subject");
      setLoading(false);
      return;
    }

    axios
      .get(`http://localhost:22020/api/exam/start/${user._id}/${subject}`)
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : [];

        if (!data.length) {
          setLoadingError("No questions found");
        } else {
          setQuestions(data);

          const initialAnswers = {};
          data.forEach((q) => {
            initialAnswers[q._id.toString()] = null;
          });
          setAnswers(initialAnswers);
        }

        setLoading(false);
      })
      .catch((err) => {
        setLoadingError(
          err.response?.data?.message || "Failed to load questions"
        );
        setLoading(false);
      });
  }, [subject, user?._id]);

  // ==========================
  // Violation Handler
  // ==========================
  const handleViolation = (message) => {
    if (submitted) return;

    setViolations((prev) => {
      const newCount = prev + 1;

      alert(`${message} (Violation ${newCount}/3)`);

      if (newCount >= 3) {
        alert("Too many violations. Exam auto submitted.");
        submit();
      }

      return newCount;
    });
  };

  // ==========================
  // Tab Switch Detection
  // (No double counting bug)
  // ==========================
  useEffect(() => {
    const handleVisibilityChange = () => {
      const now = Date.now();

      if (
        document.hidden &&
        !submitted &&
        now - lastViolationTime.current > 2000
      ) {
        lastViolationTime.current = now;
        handleViolation("Tab switching detected!");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, [submitted]);

  // ==========================
  // Option Select
  // ==========================
  const handleOptionClick = (key, option) => {
    if (submitted) return;

    setAnswers((prev) => ({
      ...prev,
      [key]: option,
    }));
  };

  // ==========================
  // Submit Exam
  // ==========================
  const submit = async () => {
    if (hasSubmitted.current) return;
    hasSubmitted.current = true;

    try {
      setSubmitted(true);

      const res = await axios.post(
        "http://localhost:22020/api/exam/submit",
        {
          answers,
          userId: user._id,
          subject,
        }
      );

      navigate("/test-submitted", { state: res.data });
    } catch (err) {
      alert(err.response?.data?.message || "Submission failed");
      hasSubmitted.current = false;
      setSubmitted(false);
    }
  };

  const getExamTime = () => {
    const count = questions.length;
    return count > 5 ? 60 + (count - 5) * 10 : 60;
  };

  if (loading) return <p>Loading questions...</p>;
  if (loadingError) return <p style={{ color: "red" }}>{loadingError}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <Timer time={getExamTime()} submit={submit} />

      <h2>{subject} Exam</h2>

      {/* Question Navigator */}
      <div style={{ marginBottom: "20px" }}>
        {questions.map((q, index) => {
          const key = q._id.toString();
          const answered = answers[key];

          return (
            <button
              key={index}
              onClick={() =>
                questionRefs.current[index]?.scrollIntoView({
                  behavior: "smooth",
                })
              }
              style={{
                margin: "5px",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                border: "none",
                backgroundColor: answered ? "green" : "red",
                color: "white",
                cursor: "pointer",
              }}
            >
              {index + 1}
            </button>
          );
        })}
      </div>

      {/* Questions */}
      {questions.map((q, index) => {
        const key = q._id.toString();

        return (
          <div
            ref={(el) => (questionRefs.current[index] = el)}
            key={key}
            style={{
              marginBottom: "20px",
              padding: "15px",
              border: "1px solid #ddd",
              borderRadius: "8px",
            }}
          >
            <h3>
              {index + 1}. {q.question}
            </h3>

            {q.options.map((option, i) => {
              const isSelected = answers[key] === option;

              return (
                <label
                  key={i}
                  style={{
                    display: "block",
                    margin: "5px 0",
                    padding: "10px 15px",
                    borderRadius: "8px",
                    backgroundColor: isSelected ? "#22c55e" : "#f3f4f6",
                    color: isSelected ? "white" : "black",
                    cursor: submitted ? "not-allowed" : "pointer",
                  }}
                >
                  <input
                    type="radio"
                    name={key}
                    value={option}
                    checked={isSelected}
                    onChange={() => handleOptionClick(key, option)}
                    disabled={submitted}
                    style={{ display: "none" }}
                  />
                  {option}
                </label>
              );
            })}
          </div>
        );
      })}

      {/* Submit Button */}
      <button
        onClick={submit}
        disabled={submitted || Object.values(answers).every((a) => !a)}
        style={{
          padding: "10px 20px",
          backgroundColor: submitted ? "#999" : "#22c55e",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: submitted ? "not-allowed" : "pointer",
        }}
      >
        {submitted ? "Submitting..." : "Submit Exam"}
      </button>

      <p style={{ marginTop: "15px", color: "red" }}>
        Violations: {violations}/3
      </p>
    </div>
  );
}