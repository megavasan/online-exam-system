import React, { useState, useEffect } from "react";
import axios from "axios";

export default function SpecialTestReport({ testId }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (testId) {
      loadResults();
    }
  }, [testId]);

  const loadResults = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:22020/api/special-tests/${testId}/results`);
      setResults(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error loading special test results", err);
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  if (loading) return <p>Loading report...</p>;

  return (
    <div className="student-list-card" style={{ width: "100%", maxWidth: "1000px" }}>
      <h3 className="card-title-header" style={{ marginBottom: "20px" }}>Special Test Report (Ranked)</h3>
      {results.length === 0 ? (
        <p>No results submitted yet for this test.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
          <thead>
            <tr style={{ background: "#f1f5f9", textAlign: "left" }}>
              <th style={{ padding: "12px", borderBottom: "2px solid #e2e8f0" }}>Rank</th>
              <th style={{ padding: "12px", borderBottom: "2px solid #e2e8f0" }}>Student Email</th>
              <th style={{ padding: "12px", borderBottom: "2px solid #e2e8f0" }}>Score</th>
              <th style={{ padding: "12px", borderBottom: "2px solid #e2e8f0" }}>Time Taken</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, index) => (
              <tr key={r._id} style={{ borderBottom: "1px solid #e2e8f0" }}>
                <td style={{ padding: "12px" }}><strong>#{index + 1}</strong></td>
                <td style={{ padding: "12px" }}>{r.userEmail}</td>
                <td style={{ padding: "12px" }}>
                  <span style={{ fontWeight: "bold", color: r.score >= r.total / 2 ? "#10b981" : "#ef4444" }}>
                    {r.score} / {r.total}
                  </span>
                </td>
                <td style={{ padding: "12px" }}>{formatTime(r.timeTaken)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
