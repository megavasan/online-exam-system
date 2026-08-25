import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import AssignedTests from "./AssignedTests";
import { useTheme } from "../context/ThemeContext";

export default function Dashboard() {
  const nav = useNavigate();
  const [selected, setSelected] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("regular-exams");
  const { theme, toggleTheme } = useTheme();

  const user = JSON.parse(localStorage.getItem("user"));

  // Redirect if not logged in
  useEffect(() => {
    if (!user?._id) nav("/login");
  }, [user, nav]);

  const startExam = () => {
    if (!selected) {
      setError("Please select a subject to start exam");
      return;
    }
    nav(`/exam/${selected}`);
  };

  return (
    <>
      <style>{`
        body { margin:0; font-family:"Segoe UI",sans-serif; background:var(--bg-color); color:var(--text-color); }
        .layout { display:flex; height:100vh; }

        .sidebar {
          width:230px;
          background:var(--sidebar-bg);
          color:var(--sidebar-text);
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

        .nav-menu {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 20px;
        }

        .nav-btn {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.2);
          color: white;
          padding: 12px;
          border-radius: 6px;
          cursor: pointer;
          text-align: left;
        }
        
        .nav-btn:hover, .nav-btn.active {
          background: #374151;
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
          background:var(--card-bg);
          padding:25px;
          border-radius:10px;
          box-shadow:0 4px 10px rgba(0,0,0,0.05);
          text-align:center;
          cursor:pointer;
          transition:0.3s;
          border:2px solid var(--border-color);
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

          <div className="nav-menu">
            <button className={`nav-btn ${activeTab === 'regular-exams' ? 'active' : ''}`} onClick={() => setActiveTab('regular-exams')}>
              📚 Regular Exams
            </button>
            <button className={`nav-btn ${activeTab === 'special-tests' ? 'active' : ''}`} onClick={() => setActiveTab('special-tests')}>
              ⭐ Special Tests
            </button>
          </div>

          <div style={{ flexGrow: 1 }}></div>

          <button className="nav-btn" onClick={toggleTheme} style={{ marginBottom: '10px' }}>
            {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>

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
          {activeTab === 'regular-exams' && (
            <>
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
            </>
          )}

          {activeTab === 'special-tests' && (
             <AssignedTests userEmail={user?.email} />
          )}
        </div>
      </div>
    </>
  );
}