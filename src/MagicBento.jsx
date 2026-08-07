import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { SiLeetcode } from "react-icons/si"; 
import { FaGithub, FaLinkedin } from "react-icons/fa"; 
import { MdEmail } from "react-icons/md"; 
import './MagicBento.css';

const DEFAULT_SPOTLIGHT_RADIUS = 300;
const DEFAULT_GLOW_COLOR = '255, 255, 255';
const MOBILE_BREAKPOINT = 768;

// Card 1 is the tall photo card on the left. Cards 2-4 are "about me" text
// cards: card 2 is the large one in the middle, cards 3 and 4 stack on the
// right.
const cardData = [
  {
    type: 'photo'
  },
  {
    type: 'text',
    title: 'About Me',
    id: 'about-me-card',
    description: (
      <span>
        Hello! I'm <strong>Shaurya Singhal</strong>, from <strong>Meerut, Uttar Pradesh</strong>. 
        I completed my schooling at <strong>KL International School</strong> and am currently pursuing <strong>B.Tech in Computer Science Engineering</strong> with a specialization in <strong>Data Science</strong> at <strong>UPES, Dehradun</strong>.
        <br /><br />
        I'm passionate about exploring new technologies in the field of computer science and enjoy <strong>building projects from scratch</strong>. I love transforming ideas into real applications while constantly learning and improving my skills. My goal is to create <strong>innovative solutions</strong> that make a meaningful impact and contribute to the ever-evolving world of technology.
      </span>
    )
  },
  {
    type: 'text',
    title: 'Links',
    id: 'social-links-card',
    description: (
      <div className="bento-socials-list">
        
        {/* LEETCODE */}
        <a href="https://leetcode.com/u/Shaurya-Singhal-2006/" target="_blank" rel="noopener noreferrer" className="bento-list-item">
          <span className="list-left">
            <SiLeetcode className="list-icon" />
            LeetCode
          </span>
          <span className="list-arrow">↗</span>
        </a>
        
        {/* GITHUB */}
        <a href="https://github.com/Shaurya-Singhal-2006" target="_blank" rel="noopener noreferrer" className="bento-list-item">
          <span className="list-left">
            <FaGithub className="list-icon" />
            GitHub
          </span>
          <span className="list-arrow">↗</span>
        </a>

        {/* LINKEDIN */}
        <a href="https://linkedin.com/in/shaurya-singhal-b37aaa376" target="_blank" rel="noopener noreferrer" className="bento-list-item">
          <span className="list-left">
            <FaLinkedin className="list-icon" />
            LinkedIn
          </span>
          <span className="list-arrow">↗</span>
        </a>
        
        {/* EMAIL */}
        <a href="mailto:shaurya206@gmail.com" className="bento-list-item">
          <span className="list-left">
            <MdEmail className="list-icon" />
            Email
          </span>
          <span className="list-arrow">↗</span>
        </a>
        
      </div>
    )
  },
  {
    type: 'text',
    title: 'Current CGPA',
    id: 'cgpa-card',
    description: (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        flex: 1, 
        width: '100%', 
        height: '100%',
        marginTop: '-10px'
      }}>
        <span style={{ 
          fontSize: '3.5rem', 
          color: '#ffffff', 
          fontWeight: '900',
          letterSpacing: '-1px',
          textShadow: '0 0 20px rgba(255, 255, 255, 0.4)' 
        }}>
          8.38
        </span>
      </div>
    )
  }
];

const calculateSpotlightValues = radius => ({
  proximity: radius * 0.5,
  fadeDistance: radius * 0.75
});

const updateCardGlowProperties = (card, mouseX, mouseY, glow, radius) => {
  const rect = card.getBoundingClientRect();
  const relativeX = ((mouseX - rect.left) / rect.width) * 100;
  const relativeY = ((mouseY - rect.top) / rect.height) * 100;

  card.style.setProperty('--glow-x', `${relativeX}%`);
  card.style.setProperty('--glow-y', `${relativeY}%`);
  card.style.setProperty('--glow-intensity', glow.toString());
  card.style.setProperty('--glow-radius', `${radius}px`);
};

const GlobalSpotlight = ({
  gridRef,
  disableAnimations = false,
  enabled = true,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  glowColor = DEFAULT_GLOW_COLOR
}) => {
  const spotlightRef = useRef(null);

  useEffect(() => {
    if (disableAnimations || !gridRef?.current || !enabled) return;

    const spotlight = document.createElement('div');
    spotlight.className = 'global-spotlight';
    spotlight.style.cssText = `
      position: fixed;
      width: 800px;
      height: 800px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle,
        rgba(${glowColor}, 0.15) 0%,
        rgba(${glowColor}, 0.08) 15%,
        rgba(${glowColor}, 0.04) 25%,
        rgba(${glowColor}, 0.02) 40%,
        rgba(${glowColor}, 0.01) 65%,
        transparent 70%
      );
      z-index: 200;
      opacity: 0;
      transform: translate(-50%, -50%);
      mix-blend-mode: screen;
    `;
    document.body.appendChild(spotlight);
    spotlightRef.current = spotlight;

    const handleMouseMove = e => {
      if (!spotlightRef.current || !gridRef.current) return;

      const section = gridRef.current.closest('.bento-section');
      const rect = section?.getBoundingClientRect();
      const mouseInside =
        rect && e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;

      const cards = gridRef.current.querySelectorAll('.magic-bento-card');

      if (!mouseInside) {
        gsap.to(spotlightRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
        cards.forEach(card => {
          card.style.setProperty('--glow-intensity', '0');
        });
        return;
      }

      const { proximity, fadeDistance } = calculateSpotlightValues(spotlightRadius);
      let minDistance = Infinity;

      cards.forEach(card => {
        const cardRect = card.getBoundingClientRect();
        const centerX = cardRect.left + cardRect.width / 2;
        const centerY = cardRect.top + cardRect.height / 2;
        const distance =
          Math.hypot(e.clientX - centerX, e.clientY - centerY) - Math.max(cardRect.width, cardRect.height) / 2;
        const effectiveDistance = Math.max(0, distance);

        minDistance = Math.min(minDistance, effectiveDistance);

        let glowIntensity = 0;
        if (effectiveDistance <= proximity) {
          glowIntensity = 1;
        } else if (effectiveDistance <= fadeDistance) {
          glowIntensity = (fadeDistance - effectiveDistance) / (fadeDistance - proximity);
        }

        updateCardGlowProperties(card, e.clientX, e.clientY, glowIntensity, spotlightRadius);
      });

      gsap.to(spotlightRef.current, {
        left: e.clientX,
        top: e.clientY,
        duration: 0.1,
        ease: 'power2.out'
      });

      const targetOpacity =
        minDistance <= proximity
          ? 0.8
          : minDistance <= fadeDistance
            ? ((fadeDistance - minDistance) / (fadeDistance - proximity)) * 0.8
            : 0;

      gsap.to(spotlightRef.current, {
        opacity: targetOpacity,
        duration: targetOpacity > 0 ? 0.2 : 0.5,
        ease: 'power2.out'
      });
    };

    const handleMouseLeave = () => {
      gridRef.current?.querySelectorAll('.magic-bento-card').forEach(card => {
        card.style.setProperty('--glow-intensity', '0');
      });
      if (spotlightRef.current) {
        gsap.to(spotlightRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      spotlightRef.current?.parentNode?.removeChild(spotlightRef.current);
    };
  }, [gridRef, disableAnimations, enabled, spotlightRadius, glowColor]);

  return null;
};

const BentoCardGrid = ({ children, gridRef }) => (
  <div className="bento-wrapper">
    <div className="card-grid bento-section" ref={gridRef}>
      {children}
    </div>
  </div>
);

const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};

const MagicBento = ({
  textAutoHide = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  disableAnimations = false,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  enableTilt = false,
  glowColor = DEFAULT_GLOW_COLOR,
  clickEffect = true,
  enableMagnetism = true,
  photoSrc = null
}) => {
  const gridRef = useRef(null);
  const isMobile = useMobileDetection();
  const shouldDisableAnimations = disableAnimations || isMobile;

  return (
    <>
      {enableSpotlight && (
        <GlobalSpotlight
          gridRef={gridRef}
          disableAnimations={shouldDisableAnimations}
          enabled={enableSpotlight}
          spotlightRadius={spotlightRadius}
          glowColor={glowColor}
        />
      )}

      <BentoCardGrid gridRef={gridRef}>
        {cardData.map((card, index) => {
          const baseClassName = `magic-bento-card ${card.type === 'photo' ? 'magic-bento-card--photo' : ''} ${textAutoHide ? 'magic-bento-card--text-autohide' : ''} ${enableBorderGlow ? 'magic-bento-card--border-glow' : ''}`;

          return (
            <div
              key={index}
              className={baseClassName}
              style={{ '--glow-color': glowColor }}
              ref={el => {
                if (!el) return;

                const handleMouseMove = e => {
                  if (shouldDisableAnimations) return;

                  const rect = el.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;
                  const centerX = rect.width / 2;
                  const centerY = rect.height / 2;

                  if (enableTilt) {
                    const rotateX = ((y - centerY) / centerY) * -10;
                    const rotateY = ((x - centerX) / centerX) * 10;
                    gsap.to(el, {
                      rotateX,
                      rotateY,
                      duration: 0.1,
                      ease: 'power2.out',
                      transformPerspective: 1000
                    });
                  }

                  if (enableMagnetism) {
                    const magnetX = (x - centerX) * 0.05;
                    const magnetY = (y - centerY) * 0.05;
                    gsap.to(el, {
                      x: magnetX,
                      y: magnetY,
                      duration: 0.3,
                      ease: 'power2.out'
                    });
                  }
                };

                const handleMouseLeave = () => {
                  if (shouldDisableAnimations) return;

                  if (enableTilt) {
                    gsap.to(el, {
                      rotateX: 0,
                      rotateY: 0,
                      duration: 0.3,
                      ease: 'power2.out'
                    });
                  }

                  if (enableMagnetism) {
                    gsap.to(el, {
                      x: 0,
                      y: 0,
                      duration: 0.3,
                      ease: 'power2.out'
                    });
                  }
                };

                const handleClick = e => {
                  if (!clickEffect || shouldDisableAnimations) return;

                  const rect = el.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  const y = e.clientY - rect.top;

                  const maxDistance = Math.max(
                    Math.hypot(x, y),
                    Math.hypot(x - rect.width, y),
                    Math.hypot(x, y - rect.height),
                    Math.hypot(x - rect.width, y - rect.height)
                  );

                  const ripple = document.createElement('div');
                  ripple.style.cssText = `
                    position: absolute;
                    width: ${maxDistance * 2}px;
                    height: ${maxDistance * 2}px;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(${glowColor}, 0.4) 0%, rgba(${glowColor}, 0.2) 30%, transparent 70%);
                    left: ${x - maxDistance}px;
                    top: ${y - maxDistance}px;
                    pointer-events: none;
                    z-index: 1000;
                  `;

                  el.appendChild(ripple);

                  gsap.fromTo(
                    ripple,
                    {
                      scale: 0,
                      opacity: 1
                    },
                    {
                      scale: 1,
                      opacity: 0,
                      duration: 0.8,
                      ease: 'power2.out',
                      onComplete: () => ripple.remove()
                    }
                  );
                };

                el.addEventListener('mousemove', handleMouseMove);
                el.addEventListener('mouseleave', handleMouseLeave);
                el.addEventListener('click', handleClick);
              }}
            >
              {card.type === 'photo' ? (
                photoSrc ? (
                  <img src={photoSrc} alt="Profile" className="magic-bento-card__photo" />
                ) : (
                  <div className="magic-bento-card__photo-placeholder">
                    <span>Add a photo via the photoSrc prop</span>
                  </div>
                )
              ) : (
                <div className="magic-bento-card__content">
                  <h2 className="magic-bento-card__title">{card.title}</h2>
                  <div className={`magic-bento-card__description ${card.id === 'about-me-card' ? 'magic-bento-card__description--compact' : ''}`}>
                    {card.description}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </BentoCardGrid>
    </>
  );
};

export default MagicBento;
