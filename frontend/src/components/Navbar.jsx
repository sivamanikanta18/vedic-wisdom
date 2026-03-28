
import React, { useState, useEffect } from "react";
import "./Navbar.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { logout } from "../utils/api";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHKMDropdownOpen, setIsHKMDropdownOpen] = useState(false);
  const [isLearnDropdownOpen, setIsLearnDropdownOpen] = useState(false);
  const [isStudentsDropdownOpen, setIsStudentsDropdownOpen] = useState(false);
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if user is logged in and get role
    const checkAuth = () => {
      const token = localStorage.getItem("authToken");
      const user = localStorage.getItem("user");
      setIsLoggedIn(!!token);
      if (user) {
        const userData = JSON.parse(user);
        setUserRole(userData.userType || '');
      }
    };
    
    checkAuth();
    
    // Listen for login/logout events from other components
    window.addEventListener('login', checkAuth);
    window.addEventListener('logout', checkAuth);
    
    return () => {
      window.removeEventListener('login', checkAuth);
      window.removeEventListener('logout', checkAuth);
    };
  }, [location]);

  // Role check functions - Only 3 roles: folk_boy, folk_guide, admin
  const isFolk = () => userRole === 'folk_boy';
  const isGuide = () => userRole === 'folk_guide';
  const isAdmin = () => userRole === 'admin';

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
    setIsHKMDropdownOpen(false);
    setIsLearnDropdownOpen(false);
    setIsStudentsDropdownOpen(false);
    setIsMoreDropdownOpen(false);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const dropdowns = document.querySelectorAll('.dropdown');
      let clickedInsideDropdown = false;
      
      dropdowns.forEach(dropdown => {
        if (dropdown.contains(event.target)) {
          clickedInsideDropdown = true;
        }
      });
      
      if (!clickedInsideDropdown) {
        setIsHKMDropdownOpen(false);
        setIsLearnDropdownOpen(false);
        setIsStudentsDropdownOpen(false);
        setIsMoreDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
          
          {/* HKM Dropdown - Hidden for Folk Boys */}
          {!isFolk() && (
            <div className="dropdown">
              <button 
                className="dropdown-toggle"
                onClick={() => {
                  setIsHKMDropdownOpen(!isHKMDropdownOpen);
                  setIsLearnDropdownOpen(false);
                  setIsStudentsDropdownOpen(false);
                  setIsMoreDropdownOpen(false);
                }}
              >
                HKM
              </button>
              <div className={`dropdown-menu ${isHKMDropdownOpen ? 'active' : ''}`}>
                <Link to="/temples" onClick={closeMobileMenu}>Temples</Link>
                <Link to="/colleges" onClick={closeMobileMenu}>Colleges</Link>
                <Link to="/community" onClick={closeMobileMenu}>Community</Link>
                {isAdmin() && <Link to="/akshaya-patra" onClick={closeMobileMenu}>Akshaya Patra</Link>}
              </div>
            </div>
          )}
          
          {/* For Folk Boy - Show Learn links + Games + Chatbot individually */}
          {isFolk() ? (
            <>
              <Link to="/scriptures">Scriptures</Link>
              <Link to="/essential-truths">Essential Truths</Link>
              <Link to="/chanting">Chanting</Link>
              <Link to="/quiz">Quiz</Link>
              <Link to="/games">Games</Link>
              <Link to="/krishna-chat">Ask Sastra</Link>
            </>
          ) : (
            /* Learn Dropdown - For non-Folk users */
            <div className="dropdown">
              <button 
                className="dropdown-toggle"
                onClick={() => {
                  setIsLearnDropdownOpen(!isLearnDropdownOpen);
                  setIsHKMDropdownOpen(false);
                  setIsStudentsDropdownOpen(false);
                  setIsMoreDropdownOpen(false);
                }}
              >
                Learn
              </button>
              <div className={`dropdown-menu ${isLearnDropdownOpen ? 'active' : ''}`}>
                <Link to="/scriptures" onClick={closeMobileMenu}>Scriptures</Link>
                <Link to="/essential-truths" onClick={closeMobileMenu}>Essential Truths</Link>
                <Link to="/chanting" onClick={closeMobileMenu}>Chanting</Link>
                <Link to="/quiz" onClick={closeMobileMenu}>Quiz</Link>
                <Link to="/games" onClick={closeMobileMenu}>Games</Link>
              </div>
            </div>
          )}
          
          {/* Guide Dropdown - Only for Guides */}
          {isGuide() && (
            <div className="dropdown">
              <button 
                className="dropdown-toggle"
                onClick={() => {
                  setIsStudentsDropdownOpen(!isStudentsDropdownOpen);
                  setIsHKMDropdownOpen(false);
                  setIsLearnDropdownOpen(false);
                  setIsMoreDropdownOpen(false);
                }}
              >
                My Students
              </button>
              <div className={`dropdown-menu ${isStudentsDropdownOpen ? 'active' : ''}`}>
                <Link to="/guide/students" onClick={closeMobileMenu}>View My Students</Link>
                <Link to="/colleges" onClick={closeMobileMenu}>All Colleges</Link>
              </div>
            </div>
          )}
          
          {/* More Dropdown - Only for Admin */}
          {isAdmin() && (
            <div className="dropdown">
              <button 
                className="dropdown-toggle"
                onClick={() => {
                  setIsMoreDropdownOpen(!isMoreDropdownOpen);
                  setIsHKMDropdownOpen(false);
                  setIsLearnDropdownOpen(false);
                  setIsStudentsDropdownOpen(false);
                }}
              >
                More
              </button>
              <div className={`dropdown-menu ${isMoreDropdownOpen ? 'active' : ''}`}>
                <Link to="/krishna-chat" onClick={closeMobileMenu}>Ask Sastra</Link>
                <Link to="/events" onClick={closeMobileMenu}>Events</Link>
                <Link to="/games" onClick={closeMobileMenu}>Games</Link>
                <Link to="/admin/users" onClick={closeMobileMenu}>User Management</Link>
              </div>
            </div>
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

        {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-header">
          <span className="mobile-menu-title">Menu</span>
          <button 
            className="mobile-menu-close" 
            onClick={closeMobileMenu}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>
        
        {/* Main Navigation */}
        <Link to="/home" onClick={closeMobileMenu}>Home</Link>
        
        {/* HKM Section - Hidden for Folk Boys */}
        {!isFolk() && (
          <>
            <div className="mobile-section-title">HKM</div>
            <Link to="/temples" onClick={closeMobileMenu}>Temples</Link>
            <Link to="/colleges" onClick={closeMobileMenu}>Colleges</Link>
            <Link to="/community" onClick={closeMobileMenu}>Community</Link>
            {isAdmin() && <Link to="/akshaya-patra" onClick={closeMobileMenu}>Akshaya Patra</Link>}
          </>
        )}
        
        {/* Learn Section - For Folk Boy, show as expanded Learning section */}
        {isFolk() ? (
          <>
            <div className="mobile-section-title">Learning</div>
            <Link to="/scriptures" onClick={closeMobileMenu}>Scriptures</Link>
            <Link to="/essential-truths" onClick={closeMobileMenu}>Essential Truths</Link>
            <Link to="/chanting" onClick={closeMobileMenu}>Chanting</Link>
            <Link to="/quiz" onClick={closeMobileMenu}>Quiz</Link>
            <Link to="/games" onClick={closeMobileMenu}>Games</Link>
            <Link to="/krishna-chat" onClick={closeMobileMenu}>Ask Sastra</Link>
          </>
        ) : (
          <>
            <div className="mobile-section-title">Learn</div>
            <Link to="/scriptures" onClick={closeMobileMenu}>Scriptures</Link>
            <Link to="/essential-truths" onClick={closeMobileMenu}>Essential Truths</Link>
            <Link to="/chanting" onClick={closeMobileMenu}>Chanting</Link>
            <Link to="/quiz" onClick={closeMobileMenu}>Quiz</Link>
            <Link to="/games" onClick={closeMobileMenu}>Games</Link>
          </>
        )}
        
        {/* Guide Section - Only for Guides */}
        {isGuide() && (
          <>
            <div className="mobile-section-title">My Students</div>
            <Link to="/guide/students" onClick={closeMobileMenu}>View My Students</Link>
            <Link to="/colleges" onClick={closeMobileMenu}>All Colleges</Link>
          </>
        )}
        
        {/* Admin Features - Only for Admin */}
        {isAdmin() && (
          <>
            <div className="mobile-section-title">Admin Features</div>
            <Link to="/krishna-chat" onClick={closeMobileMenu}>Ask Sastra</Link>
            <Link to="/events" onClick={closeMobileMenu}>Events</Link>
            <Link to="/games" onClick={closeMobileMenu}>Games</Link>
            <Link to="/admin/users" onClick={closeMobileMenu}>User Management</Link>
          </>
        )}
        
        {/* About */}
        <div className="mobile-section-title">More</div>
        <Link to="/about" onClick={closeMobileMenu}>About</Link>
        
        {/* Auth Buttons */}
        {isLoggedIn ? (
          <>
            <Link to="/dashboard" className="dashboard-link" onClick={closeMobileMenu}>Dashboard</Link>
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
