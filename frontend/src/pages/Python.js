import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Python() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const questions = [
    { id: "q1", question: "Python is a", options: ["Programming Language", "Database", "IDE", "Framework"], answer: "Programming Language" },
    { id: "q2", question: "Which is used for loops?", options: ["for", "while", "both", "none"], answer: "both" },
    { id: "q3", question: "Python supports?", options: ["OOP", "Procedural", "Functional", "All"], answer: "All" },
    { id: "q4", question: "Which is Python’s data type?", options: ["list", "table", "form", "record"], answer: "list" },
    { id: "q5", question: "What does 'def' keyword do?", options: ["Defines a function", "Defines a class", "Defines a variable", "Defines a loop"], answer: "Defines a function" }
  ];

  const [answers, setAnswers] = useState({});

  const handleChange = (qId, value) => setAnswers(prev => ({ ...prev, [qId]: value }));

  const submit = async () => {
    try {
      const res = await axios.post("http://localhost:22020/api/exam/submit", {
        userId: user._id,
        subject: "Python",
        answers
      });
      navigate("/result", { state: res.data });
    } catch (err) {
      alert(err.response?.data?.message || "Submission failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Python Exam</h2>
      {questions.map(q => (
        <div key={q.id} style={{ marginBottom: "15px" }}>
          <h4>{q.question}</h4>
          {q.options.map(opt => (
            <label key={opt} style={{ display: "block", cursor: "pointer" }}>
              <input
                type="radio"
                name={q.id}
                value={opt}
                checked={answers[q.id] === opt}
                onChange={() => handleChange(q.id, opt)}
              />{" "}
              {opt}
            </label>
          ))}
        </div>
      ))}
      <button onClick={submit} style={{ padding: "10px 20px", background: "#22c55e", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}>Submit</button>
    </div>
  );
}