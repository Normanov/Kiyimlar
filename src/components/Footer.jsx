import React from "react";

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span className="brand">
          <svg className="brand-logo" viewBox="0 0 32 32" aria-hidden="true">
            <rect width="32" height="32" rx="9" fill="#0e0e11" />
            <path d="M8.5 23V9.5L16 17l7.5-7.5V23" fill="none" stroke="#fff" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="24.8" cy="24.2" r="2.1" fill="#6d5efc" />
          </svg>
          <span className="brand-mark">MONO<span className="brand-dot">.</span></span>
        </span>
        <span>Modern essentials, made to move. Designed with care.</span>
        <span>© {new Date().getFullYear()} MONO Essentials</span>
      </div>
    </footer>
  );
}

export default Footer;
