// Reusable hero wrapper: prefers the animated WebP, with a poster and GIF fallback.
function HeroSection({ mediaSrc, fallbackSrc, posterSrc, blurAmount = '1px', children }) {
  return (
    <section id="home" className="hero" style={{ '--hero-blur': blurAmount }} aria-label="Home">
      <picture className="hero-media-frame" aria-hidden="true">
        <source srcSet={posterSrc} media="(prefers-reduced-motion: reduce)" type="image/png" />
        <source srcSet={mediaSrc} type="image/webp" />
        <img
          className="hero-media"
          src={fallbackSrc}
          alt=""
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
      </picture>
      <div className="hero-shade" aria-hidden="true" />
      {children}
    </section>
  )
}

export default HeroSection
