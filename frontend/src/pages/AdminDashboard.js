import { API_BASE_URL } from "../config";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminDashboard.css";
import SpecialTestsAdmin from "./SpecialTestsAdmin";
import SpecialTestReport from "./SpecialTestReport";
import { useTheme } from "../context/ThemeContext";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const adminUser = JSON.parse(localStorage.getItem("user"));
  const { theme, toggleTheme } = useTheme();

  // Tab State
  const [activeTab, setActiveTab] = useState("results");

  // Data State
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [allQuestions, setAllQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filtering
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState("All");

  // Special Test State
  const [selectedSpecialTestId, setSelectedSpecialTestId] = useState(null);

  // Form State (Add Question)
  const [customSubject, setCustomSubject] = useState(false);
  const [questionForm, setQuestionForm] = useState({
    subject: "",
    question: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    answer: ""
  });
  const [submitting, setSubmitting] = useState(false);


  // Redirect if not admin
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "admin") {
      navigate("/");
    }
  }, [navigate]);

  // Load all initial data from MongoDB API
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.role === "admin") {
      loadData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const config = { timeout: 5000 };

      const resStudents = await axios.get(`${API_BASE_URL}/api/admin/student-results`, config);
      const resSubjects = await axios.get(`${API_BASE_URL}/api/admin/subjects`, config);
      const resQuestions = await axios.get(`${API_BASE_URL}/api/admin/all`, config);

      setStudents(resStudents.data);
      setSubjects(resSubjects.data);
      setAllQuestions(resQuestions.data);

      // Pre-select first student if list is loaded
      if (resStudents.data.length > 0) {
        setSelectedStudent(resStudents.data[0]);
      }

      // Pre-populate Add Question subject if subjects exist
      if (resSubjects.data.length > 0) {
        setQuestionForm((prev) => ({ ...prev, subject: resSubjects.data[0] }));
      }
      setLoading(false);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
      setLoading(false);
      alert("Failed to fetch data from database. Make sure the backend is running.");
      setLoading(false);
    }
  };

  // Helper metric calculations
  const calculateStudentAvg = (resultsList) => {
    if (!resultsList || resultsList.length === 0) return 0;
    const totalPercentage = resultsList.reduce((acc, r) => {
      const pct = r.total > 0 ? (r.score / r.total) * 100 : 0;
      return acc + pct;
    }, 0);
    return Math.round(totalPercentage / resultsList.length);
  };

  const getStatusClass = (avg) => {
    if (avg >= 85) return "excellent";
    if (avg >= 65) return "good";
    if (avg >= 50) return "pass";
    return "fail";
  };

  const getStatusText = (avg) => {
    if (avg >= 85) return "EXCELLENT";
    if (avg >= 65) return "GOOD";
    if (avg >= 50) return "PASS";
    return "FAIL";
  };

  // Form Submit for Add Question
  const handleAddQuestionSubmit = async (e) => {
    e.preventDefault();
    const { subject, question, option1, option2, option3, option4, answer } = questionForm;

    if (!subject.trim() || !question.trim() || !option1.trim() || !option2.trim() || !option3.trim() || !option4.trim() || !answer.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      setSubmitting(true);
      const newId = subject.toLowerCase().replace(/\s+/g, "") + Date.now();
      const payload = {
        _id: newId,
        subject: subject.trim(),
        question: question.trim(),
        options: [option1.trim(), option2.trim(), option3.trim(), option4.trim()],
        answer: answer.trim()
      };

      await axios.post(`${API_BASE_URL}/api/admin/add`, payload);
      alert(`Question Added Successfully to ${subject}! Exam time limit extended by +10 seconds.`);

      // Clear/Reset Form (keep current subject unless typed)
      setQuestionForm((prev) => ({
        ...prev,
        question: "",
        option1: "",
        option2: "",
        option3: "",
        option4: "",
        answer: ""
      }));

      // Reload databases from APIs to refresh UI
      await loadData();
    } catch (err) {
      console.error("Error submitting question:", err);
      alert("Failed to add question. Check console details.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  // Filter students based on search query
  const filteredStudents = students.filter((s) => {
    const query = searchQuery.toLowerCase();
    return (
      s.name.toLowerCase().includes(query) ||
      s.email.toLowerCase().includes(query)
    );
  });

  return (
    <div className="admin-layout">
      {/* Sidebar Navigation */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <span className="logo-icon">🔒</span>
            <h2>AdminPanel</h2>
          </div>
          <span className="sidebar-tag">Super Admin</span>
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${activeTab === "results" ? "active" : ""}`}
            onClick={() => setActiveTab("results")}
          >
            📋 Student Results
          </button>
          <button
            className={`nav-item ${activeTab === "add-question" ? "active" : ""}`}
            onClick={() => setActiveTab("add-question")}
          >
            ➕ Add Question
          </button>
          <button
            className={`nav-item ${activeTab === "view-questions" ? "active" : ""}`}
            onClick={() => setActiveTab("view-questions")}
          >
            👁️ View Questions
          </button>
          <button
            className={`nav-item ${activeTab === "special-tests" ? "active" : ""}`}
            onClick={() => setActiveTab("special-tests")}
          >
            ⭐ Special Tests
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item" onClick={toggleTheme} style={{ width: "100%", marginBottom: "10px", textAlign: "left", background: "transparent", color: "inherit", border: "1px solid rgba(255,255,255,0.2)", borderRadius: "6px" }}>
            {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>
          <button className="logout-button" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="admin-main">
        <header className="main-header">
          <div className="header-title">
            <h1>Admin Control Panel</h1>
            <p className="header-subtitle">
              Manage examinations, view real student performance statistics, and populate question banks.
            </p>
          </div>
          <div className="header-user-badge">
            <div className="avatar-circle">AD</div>
            <div className="user-info">
              <span className="user-name">Administrator</span>
              <span className="user-role">{adminUser?.email || "admin@exam.com"}</span>
            </div>
          </div>
        </header>


        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Fetching data from MongoDB database...</p>
          </div>
        ) : (
          <>
            {/* ==================== TAB 1: STUDENT RESULTS ==================== */}
            {activeTab === "results" && (
              <div className="tab-panel results-split-layout">
                {/* Left Column: Student List */}
                <div className="student-list-card">
                  <h3 className="card-title-header">Student Profiles</h3>
                  <div className="search-wrapper">
                    <span className="search-icon-inside">🔍</span>
                    <input
                      type="text"
                      className="search-input"
                      placeholder="Search students by name or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div className="student-scroll-list">
                    {filteredStudents.length === 0 ? (
                      <div style={{ color: "var(--text-muted)", textAlign: "center", padding: "20px" }}>
                        No students found.
                      </div>
                    ) : (
                      filteredStudents.map((s) => {
                        const studentAvg = calculateStudentAvg(s.results);
                        const statusClass = getStatusClass(studentAvg);
                        const isSelected = selectedStudent && selectedStudent._id === s._id;

                        return (
                          <div
                            key={s._id}
                            className={`student-item ${isSelected ? "selected" : ""}`}
                            onClick={() => setSelectedStudent(s)}
                          >
                            <div className="student-meta">
                              <span className="student-name-text">{s.name}</span>
                              <span className="student-email-text">{s.email}</span>
                            </div>
                            {s.results.length > 0 ? (
                              <span className={`student-badge-avg badge-${statusClass}`}>
                                {studentAvg}%
                              </span>
                            ) : (
                              <span className="student-badge-avg badge-none">N/A</span>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Right Column: Detailed Exam Results */}
                <div className="student-detail-card">
                  {selectedStudent ? (
                    <div>
                      <div className="detail-header">
                        <div className="detail-avatar">
                          {selectedStudent.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="detail-info-block">
                          <h2>{selectedStudent.name}</h2>
                          <p>{selectedStudent.email} • Student ID: {selectedStudent._id}</p>
                        </div>
                      </div>

                      {/* Summary metrics widgets */}
                      <div className="detail-overview-stats">
                        <div className="stat-box">
                          <span className="stat-box-label">Exams Taken</span>
                          <span className="stat-box-value">{selectedStudent.results.length}</span>
                        </div>
                        <div className="stat-box">
                          <span className="stat-box-label">Average Score</span>
                          <span className="stat-box-value">
                            {selectedStudent.results.length > 0
                              ? `${calculateStudentAvg(selectedStudent.results)}%`
                              : "—"}
                          </span>
                        </div>
                        <div className="stat-box">
                          <span className="stat-box-label">Overall Status</span>
                          <span
                            className="stat-box-value"
                            style={{
                              color:
                                selectedStudent.results.length > 0
                                  ? calculateStudentAvg(selectedStudent.results) >= 50
                                    ? "#10b981"
                                    : "#ef4444"
                                  : "var(--text-muted)"
                            }}
                          >
                            {selectedStudent.results.length > 0
                              ? getStatusText(calculateStudentAvg(selectedStudent.results))
                              : "UNRATED"}
                          </span>
                        </div>
                      </div>

                      <h3 className="detail-section-title">Academic Results</h3>
                      <div className="taken-subjects-list">
                        {selectedStudent.results.length === 0 ? (
                          <div className="detail-placeholder">
                            <span className="placeholder-icon">📝</span>
                            <span className="placeholder-title">No exams started yet</span>
                            <p>This student has not submitted any exam papers.</p>
                          </div>
                        ) : (
                          selectedStudent.results.map((r, index) => {
                            const pct = r.total > 0 ? Math.round((r.score / r.total) * 100) : 0;
                            const status = getStatusClass(pct);
                            return (
                              <div key={index} className="subject-item-row">
                                <div className="subject-info-header">
                                  <span className="subject-row-title">{r.subject} Exam</span>
                                  <span className="subject-row-score">
                                    {r.score} / {r.total} ({pct}%)
                                  </span>
                                </div>
                                <div className="subject-progress-bg">
                                  <div
                                    className={`subject-progress-fill fill-${status}`}
                                    style={{ width: `${pct}%` }}
                                  ></div>
                                </div>
                                <span className="subject-row-date">
                                  Completed: {new Date(r.date).toLocaleString()}
                                </span>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="detail-placeholder">
                      <span className="placeholder-icon">🔎</span>
                      <span className="placeholder-title">No student selected</span>
                      <p>Select a student profile from the list to inspect exam details.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ==================== TAB 2: ADD QUESTION ==================== */}
            {activeTab === "add-question" && (
              <div className="tab-panel">
                <div className="add-question-container">
                  <h3 className="card-title-header" style={{ marginBottom: "25px" }}>
                    ➕ Add Question to Bank
                  </h3>
                  <form onSubmit={handleAddQuestionSubmit}>
                    <div className="form-group">
                      <label>Subject Topic</label>
                      <div className="subject-input-row">
                        {customSubject ? (
                          <input
                            type="text"
                            className="form-input"
                            style={{ flexGrow: 1 }}
                            placeholder="Type new subject name (e.g. Science)"
                            value={questionForm.subject}
                            onChange={(e) =>
                              setQuestionForm({ ...questionForm, subject: e.target.value })
                            }
                            required
                          />
                        ) : (
                          <select
                            className="form-select"
                            value={questionForm.subject}
                            onChange={(e) =>
                              setQuestionForm({ ...questionForm, subject: e.target.value })
                            }
                            required
                          >
                            <option value="" disabled>Select a subject</option>
                            {subjects.map((sub) => (
                              <option key={sub} value={sub}>
                                {sub}
                              </option>
                            ))}
                          </select>
                        )}
                        <button
                          type="button"
                          className="toggle-subject-btn"
                          onClick={() => {
                            setCustomSubject(!customSubject);
                            setQuestionForm({ ...questionForm, subject: "" });
                          }}
                        >
                          {customSubject ? "Choose Existing" : "Create New Topic"}
                        </button>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Question Body</label>
                      <textarea
                        rows="3"
                        className="form-textarea"
                        placeholder="Write the question here..."
                        value={questionForm.question}
                        onChange={(e) =>
                          setQuestionForm({ ...questionForm, question: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="options-grid">
                      <div className="form-group">
                        <label>Option 1</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="First option"
                          value={questionForm.option1}
                          onChange={(e) =>
                            setQuestionForm({ ...questionForm, option1: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Option 2</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Second option"
                          value={questionForm.option2}
                          onChange={(e) =>
                            setQuestionForm({ ...questionForm, option2: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Option 3</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Third option"
                          value={questionForm.option3}
                          onChange={(e) =>
                            setQuestionForm({ ...questionForm, option3: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Option 4</label>
                        <input
                          type="text"
                          className="form-input"
                          placeholder="Fourth option"
                          value={questionForm.option4}
                          onChange={(e) =>
                            setQuestionForm({ ...questionForm, option4: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group" style={{ marginTop: "10px" }}>
                      <label>Correct Answer Value</label>
                      <select
                        className="form-select"
                        value={questionForm.answer}
                        onChange={(e) =>
                          setQuestionForm({ ...questionForm, answer: e.target.value })
                        }
                        required
                      >
                        <option value="">-- Choose correct value --</option>
                        {questionForm.option1 && (
                          <option value={questionForm.option1}>{questionForm.option1} (Option 1)</option>
                        )}
                        {questionForm.option2 && (
                          <option value={questionForm.option2}>{questionForm.option2} (Option 2)</option>
                        )}
                        {questionForm.option3 && (
                          <option value={questionForm.option3}>{questionForm.option3} (Option 3)</option>
                        )}
                        {questionForm.option4 && (
                          <option value={questionForm.option4}>{questionForm.option4} (Option 4)</option>
                        )}
                      </select>
                    </div>

                    {questionForm.subject && (
                      <div className="time-limit-banner">
                        <span className="banner-icon">⏱</span>
                        <div className="banner-content">
                          <h4>
                            Exam Time Limit:{" "}
                            {(() => {
                              const currentCount = allQuestions.filter(
                                (q) => q.subject.toLowerCase() === questionForm.subject.toLowerCase()
                              ).length;
                              const newCount = currentCount + 1;
                              return newCount > 5 ? 60 + (newCount - 5) * 10 : 60;
                            })()}
                            s
                          </h4>
                          <p>
                            Adding this question will extend the exam duration by +10s (current count is{" "}
                            {
                              allQuestions.filter(
                                (q) => q.subject.toLowerCase() === questionForm.subject.toLowerCase()
                              ).length
                            }
                            ).
                          </p>
                        </div>
                      </div>
                    )}

                    <button type="submit" className="submit-btn" disabled={submitting}>
                      {submitting ? "Adding question..." : "➕ Add Question to Database"}
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* ==================== TAB 3: VIEW QUESTIONS ==================== */}
            {activeTab === "view-questions" && (
              <div className="tab-panel view-questions-layout">
                <div className="subject-filter-bar">
                  <button
                    className={`filter-chip ${selectedSubjectFilter === "All" ? "active" : ""}`}
                    onClick={() => setSelectedSubjectFilter("All")}
                  >
                    Show All
                  </button>
                  {subjects.map((sub) => (
                    <button
                      key={sub}
                      className={`filter-chip ${selectedSubjectFilter === sub ? "active" : ""}`}
                      onClick={() => setSelectedSubjectFilter(sub)}
                    >
                      {sub}
                    </button>
                  ))}
                </div>

                <div className="questions-grid">
                  {(() => {
                    const filteredQuestions = allQuestions.filter(
                      (q) => selectedSubjectFilter === "All" || q.subject === selectedSubjectFilter
                    );

                    if (filteredQuestions.length === 0) {
                      return (
                        <div className="questions-empty-state" style={{ gridColumn: "1 / -1" }}>
                          <span className="placeholder-icon">📭</span>
                          <h3>No Questions Found</h3>
                          <p>There are no questions seeded or added for this subject category.</p>
                        </div>
                      );
                    }

                    return filteredQuestions.map((q, idx) => (
                      <div key={q._id || idx} className="question-card">
                        <div>
                          <div className="card-subject-tag">{q.subject}</div>
                          <h4 className="question-text">{q.question}</h4>
                          <div className="options-list">
                            {q.options.map((option, i) => {
                              const isCorrect = option === q.answer;
                              return (
                                <div
                                  key={i}
                                  className={`option-item ${isCorrect ? "correct" : ""}`}
                                >
                                  <span className="option-bullet">
                                    {String.fromCharCode(65 + i)}
                                  </span>
                                  <span>{option}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                        <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "10px" }}>
                          ID: <code style={{ color: "var(--primary-color)" }}>{q._id}</code>
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            )}

            {/* ==================== TAB 4: SPECIAL TESTS ==================== */}
            {activeTab === "special-tests" && (
                <div className="tab-panel">
                    <SpecialTestsAdmin 
                        onViewReport={(testId) => {
                            setSelectedSpecialTestId(testId);
                            setActiveTab("special-test-report");
                        }} 
                    />
                </div>
            )}

            {/* ==================== TAB 5: SPECIAL TEST REPORT ==================== */}
            {activeTab === "special-test-report" && (
                <div className="tab-panel">
                    <button className="submit-btn" onClick={() => setActiveTab("special-tests")} style={{ width: "auto", marginBottom: "20px" }}>
                        &larr; Back to Special Tests
                    </button>
                    {selectedSpecialTestId ? (
                        <SpecialTestReport testId={selectedSpecialTestId} />
                    ) : (
                        <p>No test selected.</p>
                    )}
                </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}