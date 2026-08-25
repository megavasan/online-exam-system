import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function TestSubmitted() {
  const navigate = useNavigate();
  const location = useLocation();
  const scoreData = location.state;

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      backgroundColor: "var(--bg-color, #f4f6f9)",
      color: "var(--text-color, #333)",
      fontFamily: "'Segoe UI', sans-serif"
    }}>
      <div style={{
        background: "var(--card-bg, white)",
        padding: "40px",
        borderRadius: "12px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
        textAlign: "center",
        maxWidth: "400px",
        width: "90%"
      }}>
        <div style={{ fontSize: "80px", marginBottom: "10px" }}>✅</div>
        <h2 style={{ margin: "0 0 20px 0", color: "#10b981", fontSize: "28px" }}>Submitted</h2>
        <p style={{ fontSize: "16px", color: "var(--text-muted, #666)", marginBottom: "30px" }}>
          Your test has been successfully submitted!
        </p>

        {scoreData && typeof scoreData.score !== 'undefined' && (
          <div style={{ marginBottom: "30px", padding: "15px", backgroundColor: "rgba(16, 185, 129, 0.1)", borderRadius: "8px" }}>
            <h3 style={{ margin: "0 0 5px 0", color: "#065f46" }}>Your Score</h3>
            <p style={{ margin: "0", fontSize: "24px", fontWeight: "bold", color: "#10b981" }}>
              {scoreData.score} / {scoreData.total}
            </p>
          </div>
        )}

        <button 
          onClick={() => navigate("/dash")}
          style={{
            backgroundColor: "#22c55e",
            color: "white",
            border: "none",
            padding: "12px 24px",
            fontSize: "16px",
            fontWeight: "bold",
            borderRadius: "8px",
            cursor: "pointer",
            width: "100%",
            transition: "background-color 0.2s"
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = "#16a34a"}
          onMouseOut={(e) => e.target.style.backgroundColor = "#22c55e"}
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}
