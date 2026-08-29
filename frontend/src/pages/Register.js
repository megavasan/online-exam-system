import { API_BASE_URL } from "../config";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Register.css";

export default function Register() {
  const nav = useNavigate();
  const [data, setData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const register = async () => {
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/register`, data);
      setSuccess(res.data.message);
      setError("");
      setData({ name: "", email: "", password: "" });

      // Redirect to login page after 1 second
      setTimeout(() => {
        nav("/");
      }, 1000);
      
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
  <div className="center">
    <div>
      <h2>Register</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}

      <input
        placeholder="Name"
        value={data.name}
        onChange={e => setData({ ...data, name: e.target.value })}
      />

      <input
        placeholder="Email"
        value={data.email}
        onChange={e => setData({ ...data, email: e.target.value })}
      />

      <input
        type="password"
        placeholder="Password"
        value={data.password}
        onChange={e => setData({ ...data, password: e.target.value })}
      />

      <button onClick={register}>Register</button>
    </div>
  </div>
);
}