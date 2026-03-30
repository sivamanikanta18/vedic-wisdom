
import React, { useState, useEffect } from 'react';
import './Navbar.css';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../utils/api';

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      const user = localStorage.getItem('user');
      setIsLoggedIn(!!token);
      if (user) {
        try {
          const userData = JSON.parse(user);
          setUserRole(userData.userType || '');
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }
    };

    checkAuth();
    const interval = setInterval(checkAuth, 1000);
    return () => clearInterval(interval);
  }, [location]);

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setUserRole('');
    navigate('/', { replace: true });
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isAdmin = () => userRole === 'admin';
  const isGuide = () => userRole === 'folk_guide';
  const isFolk = () => userRole === 'folk_boy';

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
          
          {/* Folk Boy & Folk Guide - All Learning Links + Events */}
          {(isFolk() || isGuide()) && (
            <>
              <Link to="/scriptures">Scriptures</Link>
              <Link to="/essential-truths">Essential Truths</Link>
              <Link to="/chanting">Chanting</Link>
              <Link to="/quiz">Quiz</Link>
              <Link to="/games">Games</Link>
              <Link to="/krishna-chat">Ask Sastra</Link>
              <Link to="/events">Events</Link>
            </>
          )}
          
          {isAdmin() && (
            <>
              <Link to="/events">Events</Link>
              <Link to="/admin/users" className="admin-link">Admin</Link>
            </>
          )}
          
          <Link to="/about">About</Link>
          
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="dashboard-link">Dashboard</Link>
              <button onClick={handleLogout} className="logout-btn">Logout</button>
            </>
          ) : (
            <Link to="/login" className="login-link">Login</Link>
          )}
        </div>
      </nav>

      <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-header">
          <span className="mobile-menu-title">Menu</span>
          <button className="mobile-menu-close" onClick={closeMobileMenu}>✕</button>
        </div>
        
        <Link to="/home" onClick={closeMobileMenu}>Home</Link>
        
        {/* Folk Boy & Folk Guide Links */}
        {(isFolk() || isGuide()) && (
          <>
            <div className="mobile-section-title">Learning</div>
            <Link to="/scriptures" onClick={closeMobileMenu}>Scriptures</Link>
            <Link to="/essential-truths" onClick={closeMobileMenu}>Essential Truths</Link>
            <Link to="/chanting" onClick={closeMobileMenu}>Chanting</Link>
            <Link to="/quiz" onClick={closeMobileMenu}>Quiz</Link>
            <Link to="/games" onClick={closeMobileMenu}>Games</Link>
            <Link to="/krishna-chat" onClick={closeMobileMenu}>Ask Sastra</Link>
            <Link to="/events" onClick={closeMobileMenu}>Events</Link>
          </>
        )}
        
        {isAdmin() && (
          <>
            <div className="mobile-section-title">Admin</div>
            <Link to="/events" onClick={closeMobileMenu}>Events</Link>
            <Link to="/admin/users" onClick={closeMobileMenu}>User Management</Link>
          </>
        )}
        
        <div className="mobile-section-title">More</div>
        <Link to="/about" onClick={closeMobileMenu}>About</Link>
        <Link to="/krishna-chat" onClick={closeMobileMenu}>Ask Sastra</Link>
        
        {isLoggedIn ? (
          <>
            <Link to="/dashboard" className="dashboard-link" onClick={closeMobileMenu}>Dashboard</Link>
            <button onClick={() => { handleLogout(); closeMobileMenu(); }} className="logout-btn">Logout</button>
          </>
        ) : (
          <Link to="/login" className="login-link" onClick={closeMobileMenu}>Login</Link>
        )}
      </div>

      <div className={`mobile-menu-overlay ${isMobileMenuOpen ? 'active' : ''}`} onClick={closeMobileMenu} />
    </>
  );
}

export default Navbar;
