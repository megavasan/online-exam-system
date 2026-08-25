import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Exam from "./pages/Exam";
import Result from "./pages/Result";
import AdminDashboard from "./pages/AdminDashboard";
import TakeSpecialTest from "./pages/TakeSpecialTest";
import TestSubmitted from "./pages/TestSubmitted";
import { ThemeProvider } from "./context/ThemeContext";

// ✅ PrivateRoute Component
function PrivateRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?._id ? children : <Navigate to="/" />;
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />
        <Route
          path="/dash"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/exam/:subject"
          element={
            <PrivateRoute>
              <Exam />
            </PrivateRoute>
          }
        />
        <Route
          path="/special-exam/:id"
          element={
            <PrivateRoute>
              <TakeSpecialTest />
            </PrivateRoute>
          }
        />
        <Route
          path="/result"
          element={
            <PrivateRoute>
              <Result />
            </PrivateRoute>
          }
        />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/results" element={<Navigate to="/admin" replace />} />
        <Route path="/admin/performance" element={<Navigate to="/admin" replace />} />
        <Route path="/add-question" element={<Navigate to="/admin" replace />} />
        <Route path="/view-questions" element={<Navigate to="/admin" replace />} />
        {/* 404 Fallback */}
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
        <Route
          path="/test-submitted"
          element={
            <PrivateRoute>
              <TestSubmitted />
            </PrivateRoute>
          }
        />
      </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}