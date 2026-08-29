import { API_BASE_URL } from "../config";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Fsd() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const questions = [
    { id: "q1", question: "What does OOP stand for?", options: ["Object Oriented Programming", "Open Online Protocol", "Operational Output Processing", "Other"], answer: "Object Oriented Programming" },
    { id: "q2", question: "Which is NOT a pillar of OOP?", options: ["Encapsulation", "Inheritance", "Polymorphism", "Networking"], answer: "Networking" },
    { id: "q3", question: "MVC stands for?", options: ["Model View Controller", "Master View Control", "Module Version Control", "Main View Code"], answer: "Model View Controller" },
    { id: "q4", question: "What is REST?", options: ["Representation State Transfer", "Rapid Execution Standard Technique", "Remote Server Task", "None"], answer: "Representation State Transfer" },
    { id: "q5", question: "Which is a database?", options: ["MySQL", "React", "CSS", "Node"], answer: "MySQL" }
  ];

  const [answers, setAnswers] = useState({});

  const handleChange = (qId, value) => {
    setAnswers(prev => ({ ...prev, [qId]: value }));
  };

  const submit = async () => {
    try {
      const res = await axios.post(`${API_BASE_URL}/api/exam/submit`, {
        userId: user._id,
        subject: "FSD",
        answers
      });
      navigate("/result", { state: res.data });
    } catch (err) {
      alert(err.response?.data?.message || "Submission failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>FSD Exam</h2>
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