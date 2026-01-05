import React from "react";
import "./Header.css";

function Header() {
  return (
    <header className="header">
      <div className="header-ornament top"></div>
      <div className="header-content">
        <div className="tilaka-symbol">
          <svg viewBox="0 0 100 180" className="tilaka-svg">
            {/* Complete U-shape with two vertical lines curving down */}
            <path 
              d="M 32 10 L 32 80 Q 32 100, 50 105 Q 68 100, 68 80 L 68 10" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="12" 
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Tulasi leaf/teardrop shape - wider at top, pointed at bottom */}
            <path 
              d="M 35 105 Q 30 115, 30 125 Q 30 140, 40 155 L 50 170 L 60 155 Q 70 140, 70 125 Q 70 115, 65 105 Q 57.5 107, 50 107 Q 42.5 107, 35 105 Z" 
              fill="currentColor"
            />
          </svg>
        </div>
        <h1 className="header-title">
          <span className="title-main">Vedic Wisdom</span>
          <span className="title-sanskrit">वैदिक ज्ञान</span>
        </h1>
        <p className="header-subtitle">A Sacred Journey Through Ancient Spiritual Knowledge</p>
        <div className="header-divider">
          <span className="divider-dot"></span>
          <span className="divider-line"></span>
          <span className="divider-dot"></span>
        </div>
      </div>
      <div className="header-ornament bottom"></div>
    </header>
  );
}

export default Header;
