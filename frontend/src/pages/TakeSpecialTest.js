import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";


export default function TakeSpecialTest() {
  const { id } = useParams();
  const nav = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [testInfo, setTestInfo] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    if (!user?._id) {
      nav("/login");
      return;
    }
    loadTest();
  }, [id, user, nav]);

  const loadTest = async () => {
    try {
      const res = await axios.get(`http://localhost:22020/api/special-tests/${id}/start/${user.email}`);
      setTestInfo(res.data);
      setQuestions(res.data.questions);
      setStartTime(new Date()); // Start timing when questions are loaded
    } catch (err) {
      console.error("Error loading test:", err);
      setError(err.response?.data?.message || "Failed to load test. You may not be assigned or the entry window is closed.");
    }
  };

  const handleOptionChange = (questionId, option) => {
    setAnswers({ ...answers, [questionId]: option });
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      
      const endTime = new Date();
      const timeTakenSecs = Math.floor((endTime - startTime) / 1000);

      const payload = {
        userEmail: user.email,
        answers,
        timeTaken: timeTakenSecs
      };

      const res = await axios.post(`http://localhost:22020/api/special-tests/${id}/submit`, payload);

      // Redirect to a result page or dashboard
      nav("/test-submitted", { state: { score: res.data.score, total: res.data.total } });

    } catch (err) {
      console.error("Submit Error:", err);
      alert(err.response?.data?.message || "Error submitting test");
      setSubmitting(false);
    }
  };

  if (error) {
    return (
      <div style={{ padding: "40px", background: "white", borderRadius: "10px", textAlign: "center", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)", margin: "40px auto", maxWidth: "600px" }}>
        <h2 style={{ color: "#ef4444" }}>Access Denied</h2>
        <p style={{ marginTop: "10px", fontSize: "18px", color: "#333" }}>{error}</p>
        <button onClick={() => nav("/dash")} style={{ padding: "10px 20px", marginTop: "20px", background: "#22c55e", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!testInfo) return <div style={{ padding: "50px", textAlign: "center" }}>Loading test...</div>;

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      {/* Top Header */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px", paddingBottom: "10px", borderBottom: "1px solid #ccc" }}>
        <div>
          <h2 style={{ margin: 0 }}>Special Test: {testInfo.name}</h2>
          <span style={{ color: "#666", fontSize: "14px" }}>
            👤 {user.name} ({user.email})
          </span>
        </div>
      </header>

      {/* Main Question Area */}
      <main>
        <div>
          {questions.map((q, index) => {
            const qId = q._id || index.toString();
            return (
              <div key={qId} style={{ marginBottom: "20px", padding: "15px", border: "1px solid #ddd", borderRadius: "8px" }}>
                <h3>{index + 1}. {q.question}</h3>
                <div>
                  {q.options.map((opt, i) => {
                    const isSelected = answers[qId] === opt;
                    return (
                      <label
                        key={i}
                        style={{ display: "block", margin: "5px 0", padding: "10px 15px", borderRadius: "8px", backgroundColor: isSelected ? "#22c55e" : "#f3f4f6", color: isSelected ? "white" : "black", cursor: submitting ? "not-allowed" : "pointer" }}
                      >
                        <input
                          type="radio"
                          name={`question-${qId}`}
                          value={opt}
                          checked={isSelected}
                          onChange={() => handleOptionChange(qId, opt)}
                          disabled={submitting}
                          style={{ display: "none" }}
                        />
                        {opt}
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Footer */}
        <div style={{ marginTop: "30px" }}>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{ padding: "10px 20px", backgroundColor: submitting ? "#999" : "#22c55e", color: "white", border: "none", borderRadius: "5px", cursor: submitting ? "not-allowed" : "pointer", fontSize: "16px" }}
          >
            {submitting ? "Submitting..." : "Submit Test"}
          </button>
        </div>
      </main>
    </div>
  );
}
