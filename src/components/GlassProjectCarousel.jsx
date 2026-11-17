import { useRef, useEffect, useState } from 'react';
import './GlassProjectCarousel.css';

// Replace these examples with project titles, descriptions, images, and demo links.
const DEFAULT_PROJECTS = [
  {
    title: 'Project One',
    description: 'Add a short introduction to one of your projects.',
  },
  {
    title: 'Project Two',
    description: 'Share what you built and the tools you used.',
  },
  {
    title: 'Project Three',
    description: 'Add a concise description of the problem it solves.',
  },
  {
    title: 'Project Four',
    description: 'Replace this card with another project from your portfolio.',
  }
];

export const GlassProjectCarousel = ({
  projects = DEFAULT_PROJECTS,
  className = ''
}) => {
  // Track the horizontal gallery and disable arrows at either end.
  const containerRef = useRef(null);
  
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 1);
    }
  };

  useEffect(() => {
    checkScroll();
    
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

  const scroll = (direction) => {
    // Move by one card plus the space between cards.
    if (containerRef.current) {
      const firstCard = containerRef.current.querySelector('.glass-card');
      const scrollAmount = (firstCard?.getBoundingClientRect().width ?? 344) + 20;
      const distance = direction === 'left' ? -scrollAmount : scrollAmount;
      containerRef.current.scrollBy({ left: distance, behavior: 'smooth' });
    }
  };

  return (
    <div className={`glass-carousel-wrapper ${className}`}>
      <div ref={containerRef} className="glass-carousel-container" role="region" aria-label="Project gallery">
        {projects.map((project, i) => (
          <article
            key={i}
            className="glass-card"
            onMouseMove={handleCardMove}
          >
            <div className="glass-img-wrapper">
              {project.image ? (
                <img className="glass-project-image" src={project.image} alt={`${project.title} preview`} loading="lazy" />
              ) : (
                <div className="glass-photo-placeholder">
                  <span>PROJECT {String(i + 1).padStart(2, '0')}</span>
                </div>
              )}
            </div>

            <footer className="glass-info">
              <h3 className="glass-title">{project.title}</h3>
              <p className="glass-description" title={project.description}>
                {project.description}
              </p>
              {project.demoLink && (
                <a
                  className="glass-btn"
                  href={project.demoLink}
                  target="_blank"
                  rel="noreferrer"
                >
                  View project
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </a>
              )}
              {!project.demoLink && (
                <button className="glass-btn" type="button" disabled>
                  Demo link coming soon
                </button>
              )}
            </footer>
          </article>
        ))}
      </div>

      <div className="glass-carousel-controls">
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
