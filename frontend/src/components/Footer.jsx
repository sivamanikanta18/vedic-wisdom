import React from "react";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-ornament top"></div>
      <div className="footer-content">
        <div className="footer-mantra">
          <p className="mantra-text">Hare Krishna Hare Krishna Krishna Krishna Hare Hare</p>
          <p className="mantra-text">Hare Rama Hare Rama Rama Rama Hare Hare</p>
        </div>
        <div className="footer-divider"></div>
        <p className="footer-copyright">© 2025 Vedic Wisdom. All Rights Reserved.</p>
        <p className="footer-tagline">Spreading Ancient Spiritual Knowledge for Modern Souls</p>
      </div>
    </footer>
  );
}

export default Footer;
