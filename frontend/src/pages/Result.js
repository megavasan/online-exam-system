import { useLocation, useNavigate } from "react-router-dom";

export default function Result() {
  const { state } = useLocation();
  const nav = useNavigate();

  const score = state?.score || 0;
  const total = state?.total || 0;
  const percentage = total ? ((score / total) * 100).toFixed(0) : 0;

  return (
    <>
      <style>{`
        body {
          margin: 0;
          font-family: "Segoe UI", sans-serif;
          background: #f4f6f9;
        }

        .result-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }

        .result-card {
          background: white;
          padding: 40px;
          border-radius: 12px;
          width: 350px;
          text-align: center;
          box-shadow: 0 4px 15px rgba(0,0,0,0.08);
        }

        .result-card h1 {
          margin-bottom: 20px;
        }

        .score {
          font-size: 28px;
          font-weight: bold;
          color: #22c55e;
        }

        .percentage {
          margin-top: 10px;
          font-size: 18px;
          color: #555;
        }

        .btn {
          margin-top: 20px;
          padding: 10px 20px;
          background: #22c55e;
          border: none;
          color: white;
          border-radius: 6px;
          cursor: pointer;
        }

        .btn:hover {
          background: #16a34a;
        }
      `}</style>

      <div className="result-container">
        <div className="result-card">
          <h1>Exam Result</h1>
          <div className="score">
            {score} / {total}
          </div>
          <div className="percentage">
            Percentage: {percentage}%
          </div>

          <button className="btn" onClick={() => nav("/dash")}>
            Back to Dashboard
          </button>
        </div>
      </div>
    </>
  );
}