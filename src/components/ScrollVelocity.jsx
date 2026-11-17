import { useEffect, useRef } from 'react'
import './ScrollVelocity.css'

function ScrollVelocity({
  texts = ['SHAURYA SINGHAL'],
  velocity = 42,
  numCopies = 5,
  className = '',
}) {
  // Each row gets its own measured track, animation offset, and scroll-speed response.
  const rowsRef = useRef([])

  useEffect(() => {
    const cleanups = rowsRef.current.map((row) => {
      if (!row) return () => {}

      const track = row.querySelector('.scroll-velocity-track')
      const copy = row.querySelector('.scroll-velocity-copy')
      if (!track || !copy) return () => {}
      const curveChars = Array.from(
        track.querySelectorAll('.scroll-velocity-letter, .scroll-velocity-separator')
      )

      let copyWidth = copy.getBoundingClientRect().width
      let offset = 0
      let lastTime = 0
      let previousScrollY = window.scrollY
      let smoothScrollVelocity = 0
      let frame = 0
      let active = true
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      const resizeObserver = new ResizeObserver(() => {
        copyWidth = copy.getBoundingClientRect().width
      })
      resizeObserver.observe(copy)
      resizeObserver.observe(row)

      // Bend and rotate letters based on their distance from the row's center.
      const updateCurve = () => {
        const rowBounds = row.getBoundingClientRect()
        const halfWidth = rowBounds.width / 2
        if (!halfWidth) return

        const centerX = rowBounds.left + halfWidth
        const curveDepth = Math.min(100, Math.max(24, rowBounds.width * 0.055))
        curveChars.forEach((char) => {
          const bounds = char.getBoundingClientRect()
          const position = Math.max(-1, Math.min(1, (bounds.left + bounds.width / 2 - centerX) / halfWidth))
          const verticalOffset = (1 - position * position) * curveDepth
          char.style.transform = `translateY(${verticalOffset}px) rotate(${-position * 18}deg)`
        })
      }

      // Animate the marquee and briefly increase its speed while the page is scrolling.
      const animate = (time) => {
        if (!active) return
        if (!lastTime) lastTime = time
        const delta = Math.min((time - lastTime) / 1000, 0.05)
        lastTime = time

        const scrollY = window.scrollY
        const instantVelocity = delta > 0 ? (scrollY - previousScrollY) / delta : 0
        previousScrollY = scrollY
        smoothScrollVelocity += (instantVelocity - smoothScrollVelocity) * (1 - Math.exp(-delta / 0.16))

        if (copyWidth > 0) {
          if (!reducedMotion) {
            const boost = Math.min(Math.abs(smoothScrollVelocity) / 1000 * 4, 4)
            const scrollDirection = smoothScrollVelocity < -2 ? -1 : 1
            offset -= velocity * (1 + boost) * scrollDirection * delta
            if (offset <= -copyWidth) offset += copyWidth
            if (offset > 0) offset -= copyWidth
            track.style.transform = `translate3d(${offset}px, 0, 0)`
          }
          updateCurve()
        }

        frame = requestAnimationFrame(animate)
      }

      frame = requestAnimationFrame(animate)
      return () => {
        active = false
        cancelAnimationFrame(frame)
        resizeObserver.disconnect()
      }
    })

    return () => cleanups.forEach((cleanup) => cleanup())
  }, [texts, velocity, numCopies])

  return (
    <div className={`scroll-velocity ${className}`.trim()}>
      {texts.map((text, index) => (
        <div className="scroll-velocity-row" key={`${text}-${index}`} ref={(node) => { rowsRef.current[index] = node }}>
          <div className="scroll-velocity-track">
            {Array.from({ length: Math.max(2, numCopies) }, (_, copyIndex) => (
              <span
                className="scroll-velocity-copy"
                key={copyIndex}
                aria-hidden={copyIndex !== 0}
              >
                <span className="scroll-velocity-word">
                  {Array.from(text).map((letter, letterIndex) => (
                    <span className="scroll-velocity-letter" key={letterIndex}>
                      {letter === ' ' ? '\u00a0' : letter}
                    </span>
                  ))}
                </span>
                <span className="scroll-velocity-separator" aria-hidden="true">✦</span>
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default ScrollVelocity
