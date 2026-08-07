import { useState, useEffect } from 'react';
import './Header.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Collapse the header if scrolled past 50px
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`glass-header ${isScrolled ? 'scrolled' : ''}`}>
      
      {/* 💡 UPDATED LOGO SECTION: Custom SVG + Name aligned beautifully */}
      <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        
        {/* 🚀 CUSTOM "S" CODE LOGO */}
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="s-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#5227FF" />  {/* Your signature purple */}
              <stop offset="100%" stopColor="#00C9FF" /> {/* Cyber cyan */}
            </linearGradient>
            <filter id="logo-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          
          {/* Left Bracket: < */}
          <path d="M11 9L4 16L11 23" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          
          {/* Right Bracket: > */}
          <path d="M21 9L28 16L21 23" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          
          {/* The "S" Slash: Mimics the / in < /> but forms an S */}
          <path d="M19 6L12 14L21 18L14 26" stroke="url(#s-gradient)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" filter="url(#logo-glow)"/>
        </svg>

        <strong>Shaurya</strong>
      </div>
      
      <nav className="nav-links">
        <a href="#home">Home</a>
        <a href="#about">About</a>
        <a href="#skills">My Skills</a>
        <a href="#projects">Projects</a>
      </nav>
      
      {/* Optional: Add a call-to-action button */}
      <button className="cta-button">Resume</button>
    </header>
  );
};

export default Header;
