import { useEffect, useState } from 'react'; 
import Topography from "./Topography";
import Header from "./Header";
import TextPressure from "./TextPressure";
import GradientText from "./GradientText";
import MagicBento from "./MagicBento";
import SplitText from "./SplitText";
import SkillsAccordion from './SkillsAccordion';
import GlassProjectCarousel from './GlassProjectCarousel';
import CurvedLoop from './CurvedLoop';
import CountUp from './CountUp'; 
// import ScrollReveal from './ScrollReveal';
import './App.css';

// The Ultimate Centering Wrapper
const SectionWrapper = ({ id, title, children, contentWidth = '1200px' }) => {
  return (
    <section id={id} style={{
      width: '100%',
      minHeight: '100vh', 
      display: 'flex',
      alignItems: 'center', 
      justifyContent: 'center', 
      boxSizing: 'border-box',
      paddingTop: '80px', 
      paddingBottom: '40px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: contentWidth,
        padding: '0 20px',  
        boxSizing: 'border-box'
      }}>
        {title && (
          <div style={{ marginBottom: '2rem' }}>
            <SplitText
              text={title}
              tag="h1"
              fontSize="clamp(2rem, 5vw, 4.5rem)"
              fontWeight={600}
              splitType="chars"
            />
            {/* <ScrollReveal
              text={title}
              tag="h1"
              fontSize="clamp(2rem, 5vw, 4.5rem)"
              fontWeight={600}
            /> */}
          </div>
        )}
        {children}
      </div>
    </section>
  );
};

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  return (
    <div style={{ width: '100%', minHeight: '100vh', position: 'relative', backgroundColor: '#000000', overflowX: 'hidden' }}>
      
      {/* =========================================
          💡 THE FULL-SCREEN BLACK LOADER
          ========================================= */}
      <div className={`loading-screen ${!isLoading ? 'fade-out' : ''}`}>
        <div className="loading-counter">
          <CountUp
            from={0}
            to={100}
            duration={2.5} 
            // We bypass 'onEnd' and let CountUp's internal spring tell us 
            // exactly when the screen visually renders "100"!
            onStart={() => {
              const checkValue = setInterval(() => {
                const counterElement = document.querySelector('.loading-counter span');
                if (counterElement && counterElement.textContent === '100') {
                  clearInterval(checkValue); // Stop watching
                  
                  // Wait exactly 0.5 seconds (500ms) AFTER "100" is on screen, then fade out
                  setTimeout(() => {
                    setIsLoading(false);
                  }, 500);
                }
              }, 30); // Checks every 30ms for maximum accuracy
            }}
          />
        </div>
      </div>
      {/* ========================================= */}

      {/* FIXED BACKGROUND */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.75
      }}>
        <Topography
          lowColor="#ffffff"
          midColor="#ffffff"
          highColor="#FFFFFF"
          speed={0.20}
          morphAmount={3}
          morphSpeed={0.05}
          bands={1}
          thickness={0.01}
          scale={2}
          pixelSize={1}
          glow={0.1}
          colorMode="elevation"
          contrast={3}
          brightness={1}
          fillBands={false}
          opacity={1}
          grain
          grainIntensity={0.05}
          mouseInteraction={false}
          mouseRadius={0.3}
          mouseStrength={0.4}
        />
      </div>

      {/* SCROLLABLE CONTENT */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        width: '100%',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column'
      }}>
        
        <Header />

        {/* HERO SECTION */}
        <section id="home" style={{
          width: '100%',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center', 
          boxSizing: 'border-box',
          paddingTop: '80px' 
        }}>
          <div style={{ position: 'relative', height: '30vh', minHeight: '250px', width: '90%', maxWidth: '1000px' }}>
            <TextPressure
              text="Hello!"
              flex
              alpha={false}
              stroke={false}
              width
              weight
              italic
              textColor="#ffffff"
              strokeColor="#5227FF"
              minFontSize={36}
            />
          </div>

          <div style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column', 
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '2rem',
            textAlign: 'center'
          }}>
            
            {/* The Gradient Name */}
            <div style={{
              fontSize: 'clamp(2rem, 4vw, 5.5rem)',
              fontWeight: '600',
              whiteSpace: 'nowrap'
            }}>
              <GradientText colors={["#ffffff", "#949494", "#444444"]} animationSpeed={6} showBorder={false}>
                I'm Shaurya Singhal !!
              </GradientText>
            </div>

            {/* 💡 THE SPECIALIZATION SUBTITLE: Wrapped with synchronized <GradientText> */}
            <h2 style={{
              marginTop: '15px',
              fontSize: 'clamp(1.1rem, 2vw, 1.5rem)',
              fontWeight: '400',
              letterSpacing: '3px',
              textTransform: 'uppercase',
              display: 'inline-block'
            }}>
              <GradientText colors={["#ffffff", "#949494", "#444444"]} animationSpeed={6} showBorder={false}>
                B.Tech Data Science
              </GradientText>
            </h2>
            
          </div>
        </section>

        {/* SECTIONS */}
        <SectionWrapper id="about" title="About Me !!">
          <MagicBento
            textAutoHide={true}
            enableSpotlight
            enableBorderGlow={true}
            enableTilt={false}
            enableMagnetism={true}
            clickEffect
            spotlightRadius={400}
            glowColor="255, 255, 255"
            disableAnimations={false}
          />
        </SectionWrapper>

        <SectionWrapper id="skills" title="My Skills !!">
          <SkillsAccordion
            height={480}
            gap={12}
            radius={20}
            trigger="hover"
          />
        </SectionWrapper>

        <SectionWrapper id="projects" title="Projects !!" contentWidth="90%">
          <GlassProjectCarousel />
        </SectionWrapper>
        <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.05)', margin: '0 auto', maxWidth: '90%' }}></hr>

        {/* LOOP BANNER */}
        <footer style={{ width: '100%', marginTop: '2rem', overflow: 'hidden' }}>
          <CurvedLoop
            marqueeText="Code • Learn • Build • Repeat"
            speed={1.5}
            curveAmount={200}
            interactive={true}
          />
        </footer>

        {/* COPYRIGHT SIGNATURE */}
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          color: 'rgba(255, 255, 255, 0.4)',
          fontSize: '0.9rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <p style={{ margin: 0, letterSpacing: '1px' }}>
            © {new Date().getFullYear()} Shaurya. All rights reserved.
          </p>
          <p style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
            Made with
            <svg width="16" height="16" viewBox="-11.5 -10.23174 23 20.46348" style={{ color: '#61DAFB' }}>
              <title>React Logo</title>
              <circle cx="0" cy="0" r="2.05" fill="currentColor"/>
              <g stroke="currentColor" strokeWidth="1" fill="none">
                <ellipse rx="11" ry="4.2"/><ellipse rx="11" ry="4.2" transform="rotate(60)"/><ellipse rx="11" ry="4.2" transform="rotate(120)"/>
              </g>
            </svg>
            React
          </p>
        </div>

      </div>
    </div>
  );
}

export default App;
