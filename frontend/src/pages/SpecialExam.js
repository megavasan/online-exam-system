import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import Timer from "../components/Timer";
import { useNavigate, useParams } from "react-router-dom";
import { API_BASE_URL } from "../config";

export default function SpecialExam() {
  const [testDetails, setTestDetails] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loadingError, setLoadingError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [violations, setViolations] = useState(0);
  const [examStarted, setExamStarted] = useState(false);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");

  const navigate = useNavigate();
  const { testId } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));

  const hasSubmitted = useRef(false);
  const questionRefs = useRef([]);
  const lastViolationTime = useRef(0);
  const startTimeRef = useRef(0);

  // ==========================
  // Redirect if not logged in
  // ==========================
  useEffect(() => {
    if (!user?._id) {
      navigate("/login");
    }
  }, [user, navigate]);

  // ==========================
  // Fetch Special Test Questions
  // ==========================
  useEffect(() => {
    if (!user?._id || !testId || !user?.email) {
      setLoadingError("Invalid user or test configuration");
      setLoading(false);
      return;
    }

    axios
      .get(`${API_BASE_URL}/api/special-tests/${testId}/start/${user.email}`)
      .then((res) => {
        const testData = res.data;
        const qList = Array.isArray(testData.questions) ? testData.questions : [];

        if (!qList.length) {
          setLoadingError("No questions found for this special test");
        } else {
          setTestDetails(testData);
          setQuestions(qList);

          const initialAnswers = {};
          qList.forEach((q, idx) => {
            const key = q._id ? q._id.toString() : idx.toString();
            initialAnswers[key] = null;
          });
          setAnswers(initialAnswers);
        }
        setLoading(false);
      })
      .catch((err) => {
        setLoadingError(
          err.response?.data?.message || "Failed to load special test questions"
        );
        setLoading(false);
      });
  }, [testId, user?._id, user?.email]);

  const enterFullscreen = () => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch((err) => {
        console.error("Error attempting to enable full-screen mode:", err.message);
      });
    }
  };

  // ==========================
  // Submit Special Exam
  // ==========================
  const submit = useCallback(async () => {
    if (hasSubmitted.current) return;
    hasSubmitted.current = true;

    try {
      setSubmitted(true);
      const timeTakenSeconds = startTimeRef.current 
        ? Math.floor((Date.now() - startTimeRef.current) / 1000) 
        : 0;

      const res = await axios.post(
        `${API_BASE_URL}/api/special-tests/${testId}/submit`,
        {
          userEmail: user.email,
          answers,
          timeTaken: timeTakenSeconds
        }
      );

      // Clean up fullscreen mode when submitted
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(err => console.log("Exit fullscreen error:", err));
      }

      alert("Special Exam Submitted Successfully!");
      navigate("/result", { state: res.data });
    } catch (err) {
      alert(err.response?.data?.message || "Submission failed");
      hasSubmitted.current = false;
      setSubmitted(false);
    }
  }, [answers, user?.email, testId, navigate]);

  // ==========================
  // Violation Handler
  // ==========================
  const handleViolation = useCallback((message) => {
    if (submitted) return;

    setViolations((prev) => {
      const newCount = prev + 1;

      if (newCount >= 3) {
        setShowWarningModal(false);
        alert("Too many violations. Exam auto submitted.");
        submit();
      } else {
        setWarningMessage(message);
        setShowWarningModal(true);
      }

      return newCount;
    });
  }, [submitted, submit]);

  // ==========================
  // Security Enforcement (Fullscreen + Focus + Tab Switch)
  // ==========================
  useEffect(() => {
    if (!examStarted || submitted) return;

    const handleSecurityViolation = (message) => {
      const now = Date.now();
      if (now - lastViolationTime.current > 3000) {
        lastViolationTime.current = now;
        handleViolation(message);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleSecurityViolation("Tab switching detected!");
      }
    };

    const handleWindowBlur = () => {
      handleSecurityViolation("Focus loss / window switching detected!");
    };

    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        handleSecurityViolation("Fullscreen mode exited!");
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [examStarted, submitted, handleViolation]);

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

  const getExamTime = () => {
    return testDetails?.durationMinutes ? testDetails.durationMinutes * 60 : 1800; // default 30 mins
  };

  if (loading) return <p>Loading special exam questions...</p>;
  if (loadingError) return <p style={{ color: "red" }}>{loadingError}</p>;

  if (!examStarted) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f3f4f6",
        fontFamily: "'Segoe UI', sans-serif"
      }}>
        <div style={{
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "12px",
          width: "480px",
          boxShadow: "0 4px 15px rgba(0, 0, 0, 0.05)",
          textAlign: "center"
        }}>
          <h2 style={{ color: "#111827", margin: "0 0 15px 0" }}>{testDetails?.name || "Special Exam"}</h2>
          <p style={{ color: "#4b5563", fontSize: "15px", lineHeight: "1.5", marginBottom: "20px" }}>
            This special exam is conducted under strict fullscreen rules to ensure academic integrity. Please read the instructions below before starting:
          </p>
          <div style={{
            backgroundColor: "#f9fafb",
            padding: "20px",
            borderRadius: "8px",
            textAlign: "left",
            fontSize: "14px",
            color: "#374151",
            lineHeight: "1.6",
            marginBottom: "30px",
            border: "1px solid #e5e7eb"
          }}>
            <strong style={{ color: "#111827", display: "block", marginBottom: "8px" }}>Rules & Warnings:</strong>
            <ul style={{ margin: 0, paddingLeft: "20px" }}>
              <li>The exam will run in <strong>Fullscreen Mode</strong>.</li>
              <li>Exiting fullscreen mode counts as a violation.</li>
              <li>Switching tabs or minimizing the browser counts as a violation.</li>
              <li>Focusing away from the test window counts as a violation.</li>
              <li><strong>After the 3rd violation, the exam will be automatically submitted immediately.</strong></li>
            </ul>
          </div>
          <button
            onClick={() => {
              enterFullscreen();
              startTimeRef.current = Date.now();
              setExamStarted(true);
            }}
            style={{
              backgroundColor: "#22c55e",
              color: "white",
              border: "none",
              padding: "14px 28px",
              borderRadius: "6px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              width: "100%"
            }}
          >
            I Agree, Enter Fullscreen & Start Special Exam
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      {examStarted && <Timer time={getExamTime()} submit={submit} />}

      <h2>{testDetails?.name} Special Exam</h2>

      {/* Question Navigator */}
      <div style={{ marginBottom: "20px" }}>
        {questions.map((q, index) => {
          const key = q._id ? q._id.toString() : index.toString();
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
        const key = q._id ? q._id.toString() : index.toString();

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
        {submitted ? "Submitting..." : "Submit Special Exam"}
      </button>

      <p style={{ marginTop: "15px", color: "red" }}>
        Violations: {violations}/3
      </p>

      {/* Custom Warning Modal */}
      {showWarningModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          backdropFilter: "blur(8px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999,
          fontFamily: "'Segoe UI', sans-serif"
        }}>
          <div style={{
            backgroundColor: "white",
            padding: "40px",
            borderRadius: "12px",
            width: "450px",
            textAlign: "center",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
            border: "2px solid #ef4444"
          }}>
            <div style={{
              fontSize: "60px",
              color: "#ef4444",
              marginBottom: "20px"
            }}>
              ⚠️
            </div>
            <h2 style={{ margin: "0 0 10px 0", color: "#111827", fontSize: "24px" }}>
              Violation Warning!
            </h2>
            <p style={{ color: "#4b5563", fontSize: "16px", margin: "0 0 20px 0" }}>
              {warningMessage}
            </p>
            <div style={{
              backgroundColor: "#fee2e2",
              color: "#b91c1c",
              padding: "12px",
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: "15px",
              marginBottom: "25px"
            }}>
              Violation Count: {violations} / 3
              <br />
              <span style={{ fontSize: "12px", fontWeight: "normal" }}>
                (At 3 violations, the exam will be automatically submitted)
              </span>
            </div>
            <button
              onClick={() => {
                enterFullscreen();
                setShowWarningModal(false);
              }}
              style={{
                backgroundColor: "#ef4444",
                color: "white",
                border: "none",
                padding: "12px 24px",
                borderRadius: "6px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                width: "100%",
                transition: "0.2s"
              }}
            >
              Resume Exam & Re-enter Fullscreen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
