
import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logout } from "../utils/api";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-brand">
          <Link to="/home" className="navbar-title">Vedic Wisdom</Link>
        </div>
        <button 
          className="mobile-menu-btn" 
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? '✕' : '☰'}
        </button>
        
        <div className="navbar-links">
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
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-header">
          <span className="mobile-menu-title">Vedic Wisdom</span>
          <button 
            className="mobile-menu-close" 
            onClick={closeMobileMenu}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>
        <Link to="/home" onClick={closeMobileMenu}>Home</Link>
        <Link to="/scriptures" onClick={closeMobileMenu}>Scriptures</Link>
        <Link to="/essential-truths" onClick={closeMobileMenu}>Essential Truths</Link>
        <Link to="/chanting" onClick={closeMobileMenu}>Chanting</Link>
        <Link to="/quiz" onClick={closeMobileMenu}>Quiz</Link>
        {isLoggedIn && <Link to="/krishna-chat" className="krishna-chat-link" onClick={closeMobileMenu}>Ask Sastra</Link>}
        {isLoggedIn && <Link to="/events" onClick={closeMobileMenu}>Events</Link>}
        {isLoggedIn && <Link to="/games" onClick={closeMobileMenu}>Games</Link>}
        <Link to="/about" onClick={closeMobileMenu}>About Us</Link>
        {isLoggedIn ? (
          <>
            <Link to="/dashboard" className="dashboard-link" onClick={closeMobileMenu}>📊 Dashboard</Link>
            <button onClick={() => { handleLogout(); closeMobileMenu(); }} className="logout-btn">Logout</button>
          </>
        ) : (
          <Link to="/login" className="login-link" onClick={closeMobileMenu}>Login</Link>
        )}
      </div>

      {/* Overlay */}
      <div 
        className={`mobile-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`}
        onClick={closeMobileMenu}
      />
    </>
  );
}

export default Navbar;
