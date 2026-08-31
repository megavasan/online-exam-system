import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";

export default function Dashboard() {
  const nav = useNavigate();
  const [selected, setSelected] = useState("");
  const [error, setError] = useState("");
  const [specialTests, setSpecialTests] = useState([]);
  const [specialResults, setSpecialResults] = useState([]);
  const [loadingSpecial, setLoadingSpecial] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));

  // Redirect if not logged in
  useEffect(() => {
    if (!user?._id) nav("/login");
  }, [user, nav]);

  useEffect(() => {
    if (!user?._id || !user?.email) return;

    const fetchSpecialTestsAndResults = async () => {
      try {
        const [testsRes, resultsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/special-tests/student/${user.email}`),
          axios.get(`${API_BASE_URL}/api/special-tests/results/student/${user.email}`)
        ]);
        setSpecialTests(testsRes.data);
        setSpecialResults(resultsRes.data);
      } catch (err) {
        console.error("Error fetching special tests info:", err);
      } finally {
        setLoadingSpecial(false);
      }
    };

    fetchSpecialTestsAndResults();
  }, [user?.email, user?._id]);

  const startExam = () => {
    if (!selected) {
      setError("Please select a subject to start exam");
      return;
    }
    nav(`/exam/${selected}`);
  };

  const getSpecialTestStatus = (test) => {
    const result = specialResults.find((r) => r.testId === test._id);
    if (result) {
      return { status: `Submitted (Score: ${result.score}/${result.total})`, class: "submitted", disabled: true };
    }

    const now = new Date();
    const scheduledTime = new Date(test.scheduledTime);
    const diffMs = now - scheduledTime;
    const diffMinutes = Math.floor(diffMs / 60000);

    if (diffMinutes < 0) {
      const minsLeft = Math.ceil(-diffMs / 60000);
      let timeStr = "";
      if (minsLeft > 60) {
        const hrs = Math.floor(minsLeft / 60);
        const mins = minsLeft % 60;
        timeStr = `${hrs}h ${mins}m`;
      } else {
        timeStr = `${minsLeft}m`;
      }
      return { status: `Scheduled (Starts in ${timeStr})`, class: "scheduled", disabled: true };
    } else if (diffMinutes <= 5) {
      return { status: "Available Now!", class: "available", disabled: false };
    } else {
      return { status: "Missed (Time window expired)", class: "missed", disabled: true };
    }
  };

  return (
    <>
      <style>{`
        body { margin:0; font-family:"Segoe UI",sans-serif; background:#f4f6f9; }
        .layout { display:flex; height:100vh; }

        .sidebar {
          width:230px;
          background:#111827;
          color:white;
          padding:20px;
          display:flex;
          flex-direction:column;
          justify-content:space-between;
        }

        .profile {
          text-align:center;
          margin-bottom:20px;
        }

        .profile img{
          width:70px;
          height:70px;
          border-radius:50%;
          margin-bottom:10px;
          border:3px solid #22c55e;
        }

        .profile h3{
          margin:5px 0;
          font-size:16px;
        }

        .profile p{
          font-size:13px;
          color:#9ca3af;
        }

        .logout-btn{
          background:#ef4444;
          border:none;
          padding:10px;
          border-radius:6px;
          color:white;
          cursor:pointer;
          width:100%;
        }

        .logout-btn:hover{
          background:#dc2626;
        }

        .main{
          flex:1;
          padding:30px;
        }

        .card-container{
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(180px,1fr));
          gap:20px;
          margin-bottom:30px;
        }

        .subject-card{
          background:white;
          padding:25px;
          border-radius:10px;
          box-shadow:0 4px 10px rgba(0,0,0,0.05);
          text-align:center;
          cursor:pointer;
          transition:0.3s;
          border:2px solid transparent;
        }

        .subject-card:hover{
          transform:translateY(-5px);
        }

        .subject-card.active{
          border:2px solid #22c55e;
          background:#f0fdf4;
        }

        .start-btn{
          padding:12px 25px;
          background:#22c55e;
          border:none;
          color:white;
          font-size:16px;
          border-radius:6px;
          cursor:pointer;
        }

        .start-btn:hover{
          background:#16a34a;
        }

        .error{
          color:red;
          margin-bottom:15px;
        }

        .section-title {
          margin-top: 40px;
          margin-bottom: 20px;
          font-size: 24px;
          color: #111827;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 8px;
        }

        .special-container {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
          margin-top: 20px;
          margin-bottom: 40px;
        }

        .special-card {
          background: white;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.05);
          border: 1px solid #e5e7eb;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: 0.3s;
        }

        .special-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 15px rgba(0,0,0,0.08);
        }

        .special-card h3 {
          margin: 0 0 10px 0;
          color: #111827;
        }

        .special-info {
          font-size: 14px;
          color: #4b5563;
          margin: 5px 0;
        }

        .special-status {
          font-weight: 600;
          margin-top: 15px;
          padding: 6px 12px;
          border-radius: 6px;
          text-align: center;
          font-size: 13px;
        }

        .special-status.scheduled {
          background: #fef3c7;
          color: #d97706;
        }

        .special-status.available {
          background: #d1fae5;
          color: #059669;
        }

        .special-status.submitted {
          background: #e0f2fe;
          color: #0284c7;
        }

        .special-status.missed {
          background: #fee2e2;
          color: #dc2626;
        }

        .special-action-btn {
          margin-top: 15px;
          padding: 10px;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.2s;
          text-align: center;
          text-decoration: none;
        }

        .special-action-btn.start {
          background: #22c55e;
          color: white;
        }

        .special-action-btn.start:hover {
          background: #16a34a;
        }

        .special-action-btn.disabled {
          background: #e5e7eb;
          color: #9ca3af;
          cursor: not-allowed;
        }

      `}</style>

      <div className="layout">

        {/* Sidebar */}
        <div className="sidebar">

          {/* User Profile */}
          <div className="profile">
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              alt="profile"
            />

            <h3>{user?.name || "Student"}</h3>
            <p>{user?.email}</p>
          </div>

          {/* Logout Bottom */}
          <button
            className="logout-btn"
            onClick={() => {
              localStorage.removeItem("user");
              nav("/");
            }}
          >
            Logout
          </button>

        </div>

        {/* Main Content */}
        <div className="main">
          <h1>Choose Subject</h1>

          {error && <p className="error">{error}</p>}

          <div className="card-container">
            {["Fsd", "DotNet", "Python", "Java"].map((sub) => (
              <div
                key={sub}
                className={`subject-card ${selected === sub ? "active" : ""}`}
                onClick={() => {
                  setSelected(sub);
                  setError("");
                }}
              >
                <h3>{sub}</h3>
              </div>
            ))}
          </div>

          <button
            className="start-btn"
            onClick={startExam}
            disabled={!selected}
            style={{
              opacity: !selected ? 0.5 : 1,
              cursor: !selected ? "not-allowed" : "pointer",
            }}
          >
            Start Exam
          </button>

          {/* Special Exams Section */}
          <h2 className="section-title">Assigned Special Exams</h2>
          {loadingSpecial ? (
            <p>Loading special exams...</p>
          ) : specialTests.length === 0 ? (
            <p style={{ color: "#6b7280" }}>No special exams assigned to you.</p>
          ) : (
            <div className="special-container">
              {specialTests.map((test) => {
                const info = getSpecialTestStatus(test);
                return (
                  <div key={test._id} className="special-card">
                    <div>
                      <h3>{test.name}</h3>
                      <p className="special-info">
                        <strong>Scheduled:</strong> {new Date(test.scheduledTime).toLocaleString()}
                      </p>
                      <p className="special-info">
                        <strong>Duration:</strong> {test.durationMinutes} minutes
                      </p>
                      <p className="special-info">
                        <strong>Questions:</strong> {test.questions?.length || 0}
                      </p>
                    </div>
                    <div className="special-status-container">
                      <div className={`special-status ${info.class}`}>
                        {info.status}
                      </div>
                      <button
                        className={`special-action-btn ${info.disabled ? "disabled" : "start"}`}
                        disabled={info.disabled}
                        onClick={() => nav(`/special-exam/${test._id}`)}
                        style={{ width: "100%" }}
                      >
                        Start Special Test
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}