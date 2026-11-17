import { useEffect, useLayoutEffect, useState } from 'react'
import HeroSection from './components/HeroSection.jsx'
import Particles from './components/Particles.jsx'
import MagicBento from './components/MagicBento.jsx'
import ShinyText from './components/ShinyText.jsx'
import SkillsAccordion from './components/AccordionGallery.jsx'
import GlassProjectCarousel from './components/GlassProjectCarousel.jsx'
import CurvedLoop from './components/CurvedLoop.jsx'
import TextPressure from './components/TextPressure.jsx'
import DecryptedText from './components/DecryptedText.jsx'
import ClickSpark from './components/ClickSpark.jsx'
import ScrollProgress from './components/ScrollProgress.jsx'
import heroAnimation from './assets/hero-animation.webp'
import heroFallback from './assets/hero section video.gif'
import heroPoster from './assets/hero-poster.png'
import shauryaLogo from './assets/shaurya-logo.svg'
import './App.css'

// Add or remove topics here. The Current Focus card rotates through this list.
const CURRENTLY_LEARNING = ['React Native', 'PostgreSQL',]
// Edit this list to change the achievement shown in the bento card.
const ACHIEVEMENTS = ['Applied for 3 Patents']

// Shared values for the footer animation, background particles, and compact layouts.
const FOOTER_WORDMARK = [' SHAURYA SINGHAL ✦']
const PAGE_PARTICLE_COLORS = ['#ffffff', '#edf4ff', '#bfdcff', '#8abaff']
const COMPACT_VIEW_QUERY = '(max-width: 640px), (max-height: 520px)'

function App() {
  // These flags control the intro animation, compact particle settings, and shrinking header.
  const [isScrolled, setIsScrolled] = useState(false)
  const [isCompactViewport, setIsCompactViewport] = useState(() => window.matchMedia(COMPACT_VIEW_QUERY).matches)
  const [introFinished, setIntroFinished] = useState(false)
  const [isIntroLeaving, setIsIntroLeaving] = useState(false)
  const [showIntro, setShowIntro] = useState(true)

  useLayoutEffect(() => {
    // Lock the document before the intro is first painted, then restore scrolling
    // as soon as the intro overlay is removed.
    document.documentElement.classList.toggle('intro-active', showIntro)
    return () => document.documentElement.classList.remove('intro-active')
  }, [showIntro])

  useEffect(() => {
    if (!introFinished) return undefined

    // Let the text reveal finish before sliding away and removing the intro overlay.
    const leaveTimer = window.setTimeout(() => setIsIntroLeaving(true), 450)
    const removeTimer = window.setTimeout(() => setShowIntro(false), 2200)
    return () => {
      window.clearTimeout(leaveTimer)
      window.clearTimeout(removeTimer)
    }
  }, [introFinished])

  useEffect(() => {
    // Update the header only when the page crosses the small scroll threshold.
    let frame = 0
    const updateHeader = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        const scrollY = window.scrollY
        setIsScrolled((wasScrolled) => wasScrolled ? scrollY > 8 : scrollY > 24)
      })
    }
    window.addEventListener('scroll', updateHeader, { passive: true })
    updateHeader()
    return () => {
      window.removeEventListener('scroll', updateHeader)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  useEffect(() => {
    // Fewer background particles are used on narrow or short screens.
    const query = window.matchMedia(COMPACT_VIEW_QUERY)
    const updateViewport = () => setIsCompactViewport(query.matches)
    updateViewport()
    query.addEventListener('change', updateViewport)
    return () => query.removeEventListener('change', updateViewport)
  }, [])

  return (
    <main className="portfolio-page">
      <a className="skip-link" href="#about">Skip to main content</a>
      {/* Intro overlay: it is removed after its text reveal and exit animation. */}
      {showIntro && (
        <div className={`site-intro${isIntroLeaving ? ' is-leaving' : ''}`} aria-hidden="true">
          <div className="site-intro-content">
            <DecryptedText
              text="<>SHAURYA SINGHAL</>"
              speed={100}
              revealDirection="start"
              className="site-intro-revealed"
              encryptedClassName="site-intro-encrypted"
              onComplete={() => setIntroFinished(true)}
            />
            <svg className="site-intro-loader" viewBox="0 0 200 200" aria-hidden="true">
              <defs>
                <radialGradient id="site-intro-loader-gradient" cx=".66" fx=".66" cy=".3125" fy=".3125" gradientTransform="scale(1.5)">
                  <stop offset="0" stopColor="#70adff" />
                  <stop offset=".3" stopColor="#70adff" stopOpacity=".9" />
                  <stop offset=".6" stopColor="#70adff" stopOpacity=".6" />
                  <stop offset=".8" stopColor="#70adff" stopOpacity=".3" />
                  <stop offset="1" stopColor="#70adff" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle
                transformOrigin="center"
                fill="none"
                stroke="url(#site-intro-loader-gradient)"
                strokeWidth="15"
                strokeLinecap="round"
                strokeDasharray="200 1000"
                strokeDashoffset="0"
                cx="100"
                cy="100"
                r="70"
              >
                <animateTransform
                  type="rotate"
                  attributeName="transform"
                  calcMode="spline"
                  dur="5s"
                  values="360;0"
                  keyTimes="0;1"
                  keySplines="0 0 1 1"
                  repeatCount="indefinite"
                />
              </circle>
              <circle
                transformOrigin="center"
                fill="none"
                opacity=".2"
                stroke="#70adff"
                strokeWidth="15"
                strokeLinecap="round"
                cx="100"
                cy="100"
                r="70"
              />
            </svg>
          </div>
        </div>
      )}
      {!showIntro && <>
        <ScrollProgress />
        <ClickSpark />
      </>}
      {/* Fixed navigation links target the page sections below. */}
      <header className={`site-header${isScrolled ? ' is-scrolled' : ''}`}>
        <a className="site-name" href="#home" aria-label="Shaurya Singhal, home">
          <img className="site-logo" src={shauryaLogo} alt="" />
          <span>Shaurya</span>
        </a>
        <nav className="site-nav" aria-label="Main navigation">
          <a className="home-link" href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#projects">Projects</a>
        </nav>
      </header>
      {/* HeroSection handles the background media; its children are the visible hero copy. */}
      <HeroSection mediaSrc={heroAnimation} fallbackSrc={heroFallback} posterSrc={heroPoster} blurAmount="1px">
        <div className="hero-wordmark">
          <TextPressure
            text="Hello!"
            className="hero-wordmark-text"
            minFontSize={20}
            textColor="#f5f3f1"
            width={false}
            weight
            italic={false}
          />
          <p className="hero-intro">
            <span className="hero-intro-line">
              I am{' '}
              <ShinyText text="Shaurya Singhal" speed={3.4} color="#70adff" shineColor="#e6f2ff" />
              , a <strong>B.Tech CSE</strong> student
            </span>
            <span className="hero-intro-line">
              specializing in{' '}
              <ShinyText text="Data Science" speed={3.4} color="#70adff" shineColor="#e6f2ff" />
              ,
            </span>
            <span className="hero-intro-line">
              focused on turning <strong>ideas</strong> into{' '}
              <ShinyText text="solutions" speed={3.4} color="#70adff" shineColor="#e6f2ff" />
              {' '}that actually{' '}
              <ShinyText text="help people" speed={3.4} color="#70adff" shineColor="#e6f2ff" />.
            </span>
          </p>
          <div className="hero-actions" aria-label="Portfolio actions">
            <a className="hero-action hero-action-primary" href="#projects">
              Explore Projects <span aria-hidden="true">→</span>
            </a>
            <a className="hero-action hero-action-secondary" href="/Shaurya-Singhal-CV.pdf" download="Shaurya-Singhal-CV.pdf">
              Download CV <span aria-hidden="true">↓</span>
            </a>
          </div>
        </div>
        <a className="scroll-cue" href="#about">
          <span>Scroll Down</span>
          <span className="scroll-mouse" aria-hidden="true"><span /></span>
        </a>
      </HeroSection>
      {/* Main portfolio sections. Their ids are the targets used by navigation links. */}
      <section className="about-section" id="about" aria-labelledby="about-title">
        <div className="about-content">
          <h2 id="about-title" className="about-title">
            About{' '}
            <ShinyText
              text="Me"
              speed={3.4}
              delay={0.5}
              color="#70adff"
              shineColor="#e6f2ff"
            />
          </h2>
          <MagicBento
            learningItems={CURRENTLY_LEARNING}
            achievements={ACHIEVEMENTS}
            glowColor="37, 99, 235"
            spotlightRadius={260}
            particleCount={8}
            enableTilt
            enableMagnetism = {false}
            clickEffect
          />
        </div>
      </section>
      <section className="skills-section" id="skills" aria-labelledby="skills-title">
        <div className="skills-content">
          <h2 id="skills-title" className="about-title">
            <span className="skills-title-prefix">My </span>
            <ShinyText
              text="Skills"
              speed={3.4}
              delay={0.5}
              color="#70adff"
              shineColor="#e6f2ff"
            />
          </h2>
          <SkillsAccordion
            className="skills-accordion"
            defaultIndex={0}
            accentColor="#79b2ff"
            overlayColor="transparent"
            textColor="#f5f8ff"
            height={480}
            gap={12}
            radius={18}
            expandRatio={0.55}
            duration={0.55}
            trigger="hover"
          />
        </div>
      </section>
      <section className="projects-section" id="projects" aria-labelledby="projects-title">
        <div className="projects-content">
          <h2 id="projects-title" className="animated-gradient-text projects-title">
            <span className="gradient-overlay" aria-hidden="true" />
            <span className="text-content">
              <span className="projects-title-prefix">My</span>
              <span className="projects-title-highlight">Projects</span>
            </span>
          </h2>
          <GlassProjectCarousel className="portfolio-projects" />
        </div>
      </section>
      {/* Decorative background particles sit behind the section content. */}
      <div className="particle-scroll-space" aria-hidden="true" />
      <div className="particle-layer" id="particle-field" aria-hidden="true">
        <div className="particle-blend" />
        <Particles
          className="hero-particles"
          particleColors={PAGE_PARTICLE_COLORS}
          particleCount={isCompactViewport ? 1200 : 2500}
          particleSpread={11}
          speed={0.1}
          particleBaseSize={isCompactViewport ? 48 : 66}
          alphaParticles
          pixelRatio={1}
        />
      </div>
      {/* The animated name and copyright close the page. */}
      <footer className="site-footer" aria-label="Portfolio footer">
        <CurvedLoop
          marqueeText={FOOTER_WORDMARK[0]}
          speed={2.2}
          curveAmount={94}
          direction="left"
          interactive={true}
          className="footer-curved-text"
        />
        <p className="footer-copyright">
          © {new Date().getFullYear()} Shaurya Singhal. All rights reserved.
        </p>
      </footer>
    </main>
  )
}

export default App

