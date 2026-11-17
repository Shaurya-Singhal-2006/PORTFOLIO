import { useEffect, useRef } from 'react'
import './ScrollProgress.css'

function ScrollProgress() {
  const trackRef = useRef(null)
  const fillRef = useRef(null)

  useEffect(() => {
    // Convert the document's scroll position into a 0–1 value for the progress bar.
    const updateProgress = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = scrollableHeight > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollableHeight)) : 0
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${progress})`
      if (trackRef.current) trackRef.current.setAttribute('aria-valuenow', String(Math.round(progress * 100)))
    }

    let frame = 0
    const scheduleProgressUpdate = () => {
      if (frame) return
      frame = window.requestAnimationFrame(() => {
        frame = 0
        updateProgress()
      })
    }

    updateProgress()
    window.addEventListener('scroll', scheduleProgressUpdate, { passive: true })
    window.addEventListener('resize', updateProgress)
    return () => {
      window.removeEventListener('scroll', scheduleProgressUpdate)
      window.removeEventListener('resize', updateProgress)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div
      ref={trackRef}
      className="scroll-progress-track"
      role="progressbar"
      aria-label="Page scroll progress"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow="0"
    >
      <span ref={fillRef} className="scroll-progress-fill" />
    </div>
  )
}

export default ScrollProgress
