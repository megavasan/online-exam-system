import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {

  const navigate = useNavigate();

  const [role, setRole] = useState("student");

  const [data, setData] = useState({
    email: "",
    password: ""
  });

  const [error, setError] = useState("");

  const login = async () => {

    try {

      setError("");

      if (!data.email || !data.password) {
        setError("Email and Password are required");
        return;
      }

      // Authenticate via backend API
      const res = await axios.post(
        "http://localhost:22020/api/auth/login",
        data
      );

      const user = res.data.user;

      // Validate selected role matches account role
      if (user.role !== role) {
        setError(`Unauthorized: Your account role does not match the selected '${role}' role.`);
        return;
      }

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", res.data.token);

      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dash");
      }

    } catch (err) {

      console.error(err);

      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );

    }
  };

  return (
    <div className="center">
      <div className="login-box">

        <h1>Welcome to Online Examination System</h1>

        {/* Role Selection */}
        <div style={{ marginBottom: "20px" }}>
          <button
            onClick={() => setRole("student")}
            style={{
              marginRight: "10px",
              padding: "8px 15px",
              background: role === "student" ? "#4CAF50" : "#ccc",
              border: "none",
              cursor: "pointer"
            }}
          >
            Student
          </button>

          <button
            onClick={() => setRole("admin")}
            style={{
              padding: "8px 15px",
              background: role === "admin" ? "#4CAF50" : "#ccc",
              border: "none",
              cursor: "pointer"
            }}
          >
            Admin
          </button>
        </div>

        <h2>{role === "admin" ? "Admin Login" : "Student Login"}</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={data.email}
          onChange={(e) =>
            setData({ ...data, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={data.password}
          onChange={(e) =>
            setData({ ...data, password: e.target.value })
          }
        />

        <button onClick={login}>Login</button>

        {role === "student" && (
          <p className="link-text">
            Don't have an account?{" "}
            <span onClick={() => navigate("/register")}>
              Register
            </span>
          </p>
        )}

      </div>
    </div>
  );
}