import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI } from "../utils/api";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(""); // Clear error when user types
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email address (e.g., user@gmail.com)");
      return;
    }

    if (!formData.password) {
      setError("Password is required");
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.login(formData.email, formData.password);

      if (response.success) {
        // Save token and user data
        localStorage.setItem("authToken", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        
        // Dispatch login event to update navbar
        window.dispatchEvent(new Event('login'));
        
        // Navigate to dashboard
        navigate("/dashboard");
      }
    } catch (err) {
      console.error('Login error:', err);
      
      // Check if it's a network error
      if (err.message.includes('fetch') || err.message.includes('Failed to fetch')) {
        setError("Cannot connect to server. Please make sure the backend is running on http://localhost:5000");
      } else {
        setError(err.message || "Invalid email or password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1 className="login-title">Welcome Back! 🙏</h1>
          <p className="login-subtitle">
            Continue your spiritual journey
          </p>
        </div>

        {error && (
          <div className="error-message" style={{
            backgroundColor: '#fee',
            color: '#c33',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            textAlign: 'center',
            border: '1px solid #fcc'
          }}>
            {error}
          </div>
        )}

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="user@gmail.com"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              disabled={loading}
            />
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login 🕉️"}
          </button>
        </form>

        <div className="login-note">
          <p>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: '#D4AF37', textDecoration: 'none', fontWeight: 'bold' }}>
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
