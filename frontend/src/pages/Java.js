import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Java() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const questions = [
    { id: "q1", question: "Java is a", options: ["Programming Language", "Database", "IDE", "Framework"], answer: "Programming Language" },
    { id: "q2", question: "JVM stands for?", options: ["Java Virtual Machine", "Java Variable Method", "Java Verified Module", "Java View Manager"], answer: "Java Virtual Machine" },
    { id: "q3", question: "JDK includes?", options: ["Compiler", "Interpreter", "JRE", "All of the above"], answer: "All of the above" },
    { id: "q4", question: "Java supports?", options: ["OOP", "Procedural", "Functional", "All"], answer: "All" },
    { id: "q5", question: "Which is used for exception handling?", options: ["try-catch", "if-else", "switch", "for"], answer: "try-catch" }
  ];

  const [answers, setAnswers] = useState({});

  const handleChange = (qId, value) => setAnswers(prev => ({ ...prev, [qId]: value }));

  const submit = async () => {
    try {
      const res = await axios.post("http://localhost:22020/api/exam/submit", {
        userId: user._id,
        subject: "Java",
        answers
      });
      navigate("/result", { state: res.data });
    } catch (err) {
      alert(err.response?.data?.message || "Submission failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Java Exam</h2>
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