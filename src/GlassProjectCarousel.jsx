import { useRef, useEffect, useState } from 'react';
import './GlassProjectCarousel.css';

const DEFAULT_PROJECTS = [
  {
    imageText: 'Test',
    title: 'Test Project 1',
    description: 'test',
    demoLink: '#'
  },
  {
    imageText: 'Test',
    title: 'Test Project 2',
    description: 'test',
    demoLink: '#'
  },
  {
    imageText: 'Test',
    title: 'Test Project 3',
    description: 'test',
    demoLink: '#'
  },
  {
    imageText: 'Test',
    title: 'Test Project 4',
    description: 'test',
    demoLink: '#'
  },
  {
    imageText: 'Test',
    title: 'Test Project 5',
    description: 'test',
    demoLink: '#'
  }
];

export const GlassProjectCarousel = ({
  projects = DEFAULT_PROJECTS,
  className = ''
}) => {
  const containerRef = useRef(null);
  
  // 💡 NEW: States to track if we can scroll left or right
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // 💡 NEW: Checks the current scroll position and updates button states
  const checkScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      
      // If scrollLeft is greater than 0, we can scroll left
      setCanScrollLeft(scrollLeft > 0);
      
      // If scrollLeft + width is less than total scrollable width, we can scroll right
      // (Added a 1px buffer to account for sub-pixel rounding errors in browsers)
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 1);
    }
  };

  // 💡 NEW: Listen for scroll events and window resizes to recalculate button states
  useEffect(() => {
    checkScroll(); // Check initially on mount
    
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
    }
    
    return () => {
      if (container) {
        container.removeEventListener('scroll', checkScroll);
        window.removeEventListener('resize', checkScroll);
      }
    };
  }, [projects]);

  const handleCardMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  };

  const handleCardClick = (url) => {
    if (url && url !== '#') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const scroll = (direction) => {
    if (containerRef.current) {
      const scrollAmount = direction === 'left' ? -344 : 344;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className={`glass-carousel-wrapper ${className}`}>
      <div ref={containerRef} className="glass-carousel-container">
        {projects.map((project, i) => (
          <article
            key={i}
            className="glass-card"
            onMouseMove={handleCardMove}
          >
            {/* The Placeholder Text Section */}
            <div className="glass-img-wrapper">
              <div className="glass-placeholder">
                {project.imageText}
              </div>
            </div>

            {/* The Content Section */}
            <footer className="glass-info">
              <h3 className="glass-title">{project.title}</h3>
              <p className="glass-description" title={project.description}>
                {project.description}
              </p>
              
              {/* Demo Button */}
              {project.demoLink && (
                <button 
                  className="glass-btn"
                  onClick={() => handleCardClick(project.demoLink)}
                >
                  Link
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              )}
            </footer>
          </article>
        ))}
      </div>

      <div className="glass-carousel-controls">
        {/* 💡 UPDATED: Bound the disabled prop to our tracking states */}
        <button 
          className="glass-nav-btn" 
          onClick={() => scroll('left')} 
          aria-label="Scroll left"
          disabled={!canScrollLeft}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"></polyline>
          </svg>
        </button>
        <button 
          className="glass-nav-btn" 
          onClick={() => scroll('right')} 
          aria-label="Scroll right"
          disabled={!canScrollRight}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default GlassProjectCarousel;
