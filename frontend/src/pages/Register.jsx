import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI } from "../utils/api";
import "./Login.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    folk: "",
    folkGuide: "",
    templeCenter: "",
    password: "",
    confirmPassword: ""
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
    if (!formData.name.trim()) {
      setError("Name is required");
      return;
    }

    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email address (e.g., user@gmail.com)");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.register(
        formData.name,
        formData.email,
        formData.password,
        {
          folk: formData.folk,
          folkGuide: formData.folkGuide,
          templeCenter: formData.templeCenter
        }
      );

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
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1 className="login-title">Create Account 🙏</h1>
          <p className="login-subtitle">
            Start your spiritual journey today
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
            <label htmlFor="name">Your Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
              disabled={loading}
            />
          </div>

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
            <small style={{ color: '#666', fontSize: '12px' }}>
              Must be a valid email address
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="folk">Which folk are you from?</label>
            <input
              type="text"
              id="folk"
              name="folk"
              value={formData.folk}
              onChange={handleChange}
              placeholder="e.g., ISKCON, Gaudiya Math, etc."
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="folkGuide">Who is your folk guide?</label>
            <input
              type="text"
              id="folkGuide"
              name="folkGuide"
              value={formData.folkGuide}
              onChange={handleChange}
              placeholder="e.g., Mentor / Teacher name"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="templeCenter">Temple / Center</label>
            <input
              type="text"
              id="templeCenter"
              name="templeCenter"
              value={formData.templeCenter}
              onChange={handleChange}
              placeholder="e.g., Hyderabad, Mayapur, etc."
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
              placeholder="At least 6 characters"
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              required
              disabled={loading}
              minLength={6}
            />
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Register 🕉️"}
          </button>
        </form>

        <div className="login-note">
          <p>
            Already have an account?{" "}
            <Link to="/login" style={{ color: '#D4AF37', textDecoration: 'none', fontWeight: 'bold' }}>
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
