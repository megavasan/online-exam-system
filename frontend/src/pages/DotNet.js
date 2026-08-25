import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function DotNet() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const questions = [
    { id: "q1", question: ".NET is developed by?", options: ["Microsoft", "Apple", "Google", "IBM"], answer: "Microsoft" },
    { id: "q2", question: "C# is a", options: ["Programming Language", "Database", "IDE", "OS"], answer: "Programming Language" },
    { id: "q3", question: "ASP.NET is used for?", options: ["Web Development", "Game Development", "Mobile Apps", "Hardware"], answer: "Web Development" },
    { id: "q4", question: "Entity Framework is?", options: ["ORM Tool", "Database", "Programming Language", "Framework"], answer: "ORM Tool" },
    { id: "q5", question: "Visual Studio is?", options: ["IDE", "Programming Language", "Database", "Web Server"], answer: "IDE" }
  ];

  const [answers, setAnswers] = useState({});

  const handleChange = (qId, value) => setAnswers(prev => ({ ...prev, [qId]: value }));

  const submit = async () => {
    try {
      const res = await axios.post("http://localhost:22020/api/exam/submit", {
        userId: user._id,
        subject: ".NET",
        answers
      });
      navigate("/result", { state: res.data });
    } catch (err) {
      alert(err.response?.data?.message || "Submission failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>.NET Exam</h2>
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