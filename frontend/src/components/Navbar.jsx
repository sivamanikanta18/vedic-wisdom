
import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logout } from "../utils/api";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = () => {
      const token = localStorage.getItem("authToken");
      setIsLoggedIn(!!token);
    };
    
    checkAuth();
    
    // Listen for login/logout events from other components
    window.addEventListener('login', checkAuth);
    window.addEventListener('logout', checkAuth);
    
    return () => {
      window.removeEventListener('login', checkAuth);
      window.removeEventListener('logout', checkAuth);
    };
  }, [location]); // Re-check on every route change

  const handleLogout = () => {
    // Clear all auth data
    logout();
    localStorage.clear(); // Clear all localStorage data
    setIsLoggedIn(false);
    navigate("/", { replace: true }); // Use replace to prevent going back
  };

  return (
    <nav className="navbar">
      <Link to="/home">Home</Link>
      <Link to="/scriptures">Scriptures</Link>
      <Link to="/essential-truths">Essential Truths</Link>
      <Link to="/chanting">Chanting</Link>
      <Link to="/quiz">Quiz</Link>
      {isLoggedIn && <Link to="/krishna-chat" className="krishna-chat-link">Ask Sastra</Link>}
      {isLoggedIn && <Link to="/events">Events</Link>}
      {isLoggedIn && <Link to="/games">Games</Link>}
      <Link to="/about">About Us</Link>
      {isLoggedIn ? (
        <>
          <Link to="/dashboard" className="dashboard-link">📊 Dashboard</Link>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
        </>
      ) : (
        <Link to="/login" className="login-link">Login</Link>
      )}
    </nav>
  );
}

export default Navbar;
