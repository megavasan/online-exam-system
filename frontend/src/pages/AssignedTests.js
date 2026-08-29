import { API_BASE_URL } from "../config";
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AssignedTests({ userEmail }) {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();
  // Using a state for current time to force re-renders and check time window
  const [currentTime, setCurrentTime] = useState(new Date());

  const loadTests = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/special-tests/student/${userEmail}`);
      setTests(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error loading assigned tests", err);
      setLoading(false);
    }
  }, [userEmail]);

  useEffect(() => {
    if (userEmail) loadTests();
    const timer = setInterval(() => setCurrentTime(new Date()), 10000); // update every 10s
    return () => clearInterval(timer);
  }, [userEmail, loadTests]);

  const checkStatus = (scheduledTime) => {
    const scheduled = new Date(scheduledTime);
    const diffMinutes = (currentTime - scheduled) / 60000;

    if (diffMinutes < 0) {
      return { status: "upcoming", msg: `Starts at ${scheduled.toLocaleString()}`, color: "#64748b" };
    } else if (diffMinutes >= 0 && diffMinutes <= 5) {
      return { status: "open", msg: "Available Now", color: "#10b981" };
    } else {
      return { status: "closed", msg: "Time is over", color: "#ef4444" };
    }
  };

  if (loading) return <p>Loading assigned tests...</p>;

  return (
    <div>
      <h1 style={{ marginBottom: "20px" }}>Assigned Special Tests</h1>
      {tests.length === 0 ? (
        <p>You have no assigned special tests.</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
          {tests.map(test => {
            const timeInfo = checkStatus(test.scheduledTime);
            return (
              <div key={test._id} style={{ background: "white", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                <h3 style={{ margin: "0 0 10px 0" }}>{test.name}</h3>
                <p style={{ margin: "0 0 15px 0", fontSize: "14px", color: "var(--text-muted)" }}>
                  Scheduled: {new Date(test.scheduledTime).toLocaleString()}
                </p>
                
                <div style={{ padding: "10px", borderRadius: "5px", background: "#f8fafc", marginBottom: "15px", textAlign: "center", fontWeight: "bold", color: timeInfo.color }}>
                  {timeInfo.msg}
                </div>

                <button
                  onClick={() => nav(`/special-exam/${test._id}`)}
                  disabled={timeInfo.status !== "open"}
                  style={{
                    width: "100%",
                    padding: "10px",
                    background: timeInfo.status === "open" ? "#22c55e" : "#9ca3af",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: timeInfo.status === "open" ? "pointer" : "not-allowed"
                  }}
                >
                  Start Test
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
