import React, { useState, useEffect } from "react";
import axios from "axios";

export default function SpecialTestsAdmin({ onViewReport }) {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  // Form State
  const [name, setName] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]); // Array of selected emails
  const [allStudents, setAllStudents] = useState([]);
  const [questions, setQuestions] = useState([]);
  
  // Current Question State
  const [qQuestion, setQQuestion] = useState("");
  const [qOpt1, setQOpt1] = useState("");
  const [qOpt2, setQOpt2] = useState("");
  const [qOpt3, setQOpt3] = useState("");
  const [qOpt4, setQOpt4] = useState("");
  const [qAnswer, setQAnswer] = useState("");

  useEffect(() => {
    loadTests();
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const res = await axios.get("http://localhost:22020/api/admin/student-results");
      // Filter out any student account that has "admin" in its name or email
      const studentsOnly = res.data.filter(user => 
        user.role !== "admin" && 
        !user.name.toLowerCase().includes("admin") &&
        !user.email.toLowerCase().includes("admin")
      );
      setAllStudents(studentsOnly);
    } catch (err) {
      console.error("Error loading students", err);
    }
  };

  const loadTests = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:22020/api/special-tests");
      setTests(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error loading special tests", err);
      setLoading(false);
    }
  };

  const handleAddQuestion = () => {
    if (!qQuestion || !qOpt1 || !qOpt2 || !qOpt3 || !qOpt4 || !qAnswer) {
      alert("Please fill all fields for the question.");
      return;
    }
    const newQuestion = {
      question: qQuestion,
      options: [qOpt1, qOpt2, qOpt3, qOpt4],
      answer: qAnswer,
    };
    setQuestions([...questions, newQuestion]);
    
    // Clear question form
    setQQuestion(""); setQOpt1(""); setQOpt2(""); setQOpt3(""); setQOpt4(""); setQAnswer("");
  };

  const handleCreateTest = async (e) => {
    e.preventDefault();
    
    let finalQuestions = [...questions];
    if (qQuestion && qOpt1 && qOpt2 && qOpt3 && qOpt4 && qAnswer) {
      finalQuestions.push({
        question: qQuestion,
        options: [qOpt1, qOpt2, qOpt3, qOpt4],
        answer: qAnswer,
      });
    }

    if (!name || !scheduledTime || finalQuestions.length === 0) {
      alert("Please provide name, scheduled time, and at least one question.");
      return;
    }
    
    if (selectedStudents.length === 0) {
        alert("Please assign at least one student.");
        return;
    }

    const assignedStudents = selectedStudents;

    try {
      await axios.post("http://localhost:22020/api/special-tests", {
        name,
        scheduledTime,
        durationMinutes: 30, // Hardcoded or add a field
        assignedStudents,
        questions: finalQuestions
      });
      setToast("Special Test Created Successfully!");
      setTimeout(() => setToast(null), 3000);
      
      // Reset form
      setName(""); setScheduledTime(""); setSelectedStudents([]); setQuestions([]);
      loadTests();
    } catch (err) {
      console.error("Error creating special test", err);
      alert("Failed to create special test.");
    }
  };

  return (
    <div style={{ position: "relative" }}>
      {toast && (
        <div style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          backgroundColor: "#10b981",
          color: "white",
          padding: "15px 20px",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          zIndex: 1000,
          fontWeight: "600"
        }}>
          ✅ {toast}
        </div>
      )}
      <h3 className="card-title-header" style={{ marginBottom: "20px" }}>Create Special Test</h3>
      <form onSubmit={handleCreateTest} style={{ background: "var(--card-bg)", padding: "20px", borderRadius: "10px", marginBottom: "30px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        <div className="form-group">
          <label>Test Name</label>
          <input type="text" className="form-input" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Scheduled Date & Time</label>
          <input type="datetime-local" className="form-input" value={scheduledTime} onChange={e => setScheduledTime(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Assign Students</label>
          <div style={{ maxHeight: "150px", overflowY: "auto", border: "1px solid var(--border-color)", borderRadius: "5px", padding: "10px", background: "var(--bg-main)" }}>
              {allStudents.length === 0 ? <p style={{ color: "#666", fontSize: "14px" }}>No students found.</p> : null}
              {allStudents.map(student => (
                  <label key={student._id} style={{ display: "block", marginBottom: "8px", cursor: "pointer" }}>
                      <input 
                          type="checkbox" 
                          style={{ marginRight: "10px" }}
                          checked={selectedStudents.includes(student.email)}
                          onChange={(e) => {
                              if (e.target.checked) {
                                  setSelectedStudents([...selectedStudents, student.email]);
                              } else {
                                  setSelectedStudents(selectedStudents.filter(email => email !== student.email));
                              }
                          }}
                      />
                      {student.name} ({student.email})
                  </label>
              ))}
          </div>
          <div style={{ marginTop: "10px" }}>
            <button type="button" onClick={() => setSelectedStudents(allStudents.map(s => s.email))} style={{ padding: "5px 10px", marginRight: "10px", cursor: "pointer" }}>Select All</button>
            <button type="button" onClick={() => setSelectedStudents([])} style={{ padding: "5px 10px", cursor: "pointer" }}>Deselect All</button>
          </div>
        </div>

        <h4 style={{ marginTop: "20px", marginBottom: "10px" }}>Add Questions ({questions.length} Added)</h4>
        <div style={{ padding: "15px", border: "1px solid var(--border-color)", borderRadius: "8px", background: "var(--bg-main)" }}>
          <div className="form-group">
            <label>Question</label>
            <input type="text" className="form-input" value={qQuestion} onChange={e => setQQuestion(e.target.value)} />
          </div>
          <div className="options-grid">
            <div className="form-group"><label>Option 1</label><input type="text" className="form-input" value={qOpt1} onChange={e => setQOpt1(e.target.value)} /></div>
            <div className="form-group"><label>Option 2</label><input type="text" className="form-input" value={qOpt2} onChange={e => setQOpt2(e.target.value)} /></div>
            <div className="form-group"><label>Option 3</label><input type="text" className="form-input" value={qOpt3} onChange={e => setQOpt3(e.target.value)} /></div>
            <div className="form-group"><label>Option 4</label><input type="text" className="form-input" value={qOpt4} onChange={e => setQOpt4(e.target.value)} /></div>
          </div>
          <div className="form-group">
            <label>Correct Answer Value</label>
            <select className="form-select" value={qAnswer} onChange={e => setQAnswer(e.target.value)}>
              <option value="">-- Choose correct value --</option>
              {qOpt1 && <option value={qOpt1}>{qOpt1}</option>}
              {qOpt2 && <option value={qOpt2}>{qOpt2}</option>}
              {qOpt3 && <option value={qOpt3}>{qOpt3}</option>}
              {qOpt4 && <option value={qOpt4}>{qOpt4}</option>}
            </select>
          </div>
          <button type="button" className="submit-btn" onClick={handleAddQuestion} style={{ marginTop: "10px", width: "auto" }}>
            Add Question to Test
          </button>
        </div>

        <button type="submit" className="submit-btn" style={{ marginTop: "20px" }}>Create Special Test</button>
      </form>

      <h3 className="card-title-header" style={{ marginBottom: "20px" }}>Existing Special Tests</h3>
      {loading ? <p>Loading tests...</p> : (
        <div className="questions-grid">
          {tests.map(test => (
            <div key={test._id} className="question-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h4 style={{ margin: "0 0 10px 0" }}>{test.name}</h4>
                <p style={{ margin: "0 0 5px 0", fontSize: "14px", color: "var(--text-muted)" }}>
                  Scheduled: {new Date(test.scheduledTime).toLocaleString()}
                </p>
                <p style={{ margin: "0 0 15px 0", fontSize: "14px", color: "var(--text-muted)" }}>
                  Questions: {test.questions.length} | Students: {test.assignedStudents.length}
                </p>
              </div>
              <button className="submit-btn" onClick={() => onViewReport(test._id)} style={{ padding: "8px" }}>
                View Report
              </button>
            </div>
          ))}
          {tests.length === 0 && <p>No special tests created yet.</p>}
        </div>
      )}
    </div>
  );
}
