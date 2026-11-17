import { useEffect, useId, useMemo, useRef, useState } from 'react'
import './CurvedLoop.css'

function CurvedLoop({
  marqueeText = '',
  speed = 1.2,
  className = '',
  curveAmount = 72,
  direction = 'left',
  interactive = false,
}) {
  // Measure one wordmark so its copies can loop continuously along the SVG path.
  const text = useMemo(() => `${marqueeText.trim()}\u00a0`, [marqueeText])
  const measureRef = useRef(null)
  const textPathRef = useRef(null)
  const dragRef = useRef(false)
  const lastXRef = useRef(0)
  const velocityRef = useRef(0)
  const directionRef = useRef(direction)
  const [spacing, setSpacing] = useState(0)
  const uid = useId().replaceAll(':', '')
  const pathId = `curved-loop-${uid}`
  const path = `M-100,40 Q720,${40 + curveAmount} 1540,40`
  const repeatCount = spacing ? Math.ceil(1800 / spacing) + 2 : 1
  const textSegments = text.split('✦')

  useEffect(() => {
    const measure = () => {
      if (measureRef.current) setSpacing(measureRef.current.getComputedTextLength())
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [text])

  useEffect(() => {
    if (!spacing || !textPathRef.current) return undefined
    let frame = 0
    let isVisible = false
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    textPathRef.current.setAttribute('startOffset', `${-spacing}px`)
    if (reducedMotion) return undefined

    const animate = () => {
      frame = 0
      if (!isVisible || document.hidden) return
      if (!dragRef.current && textPathRef.current) {
        const delta = directionRef.current === 'right' ? speed : -speed
        let nextOffset = Number.parseFloat(textPathRef.current.getAttribute('startOffset') || '0') + delta
        if (nextOffset <= -spacing) nextOffset += spacing
        if (nextOffset > 0) nextOffset -= spacing
        textPathRef.current.setAttribute('startOffset', `${nextOffset}px`)
      }
      frame = window.requestAnimationFrame(animate)
    }

    const startAnimation = () => {
      if (isVisible && !document.hidden && !frame) {
        frame = window.requestAnimationFrame(animate)
      }
    }
    const stopAnimation = () => {
      if (frame) window.cancelAnimationFrame(frame)
      frame = 0
    }
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting
      if (isVisible) startAnimation()
      else stopAnimation()
    })
    const container = measureRef.current?.closest('.curved-loop-jacket')
    if (container) observer.observe(container)

    const handleVisibilityChange = () => {
      if (document.hidden) stopAnimation()
      else startAnimation()
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      stopAnimation()
    }
  }, [spacing, speed])

  const handlePointerDown = (event) => {
    // Pointer capture keeps a drag active even if the cursor leaves the text.
    if (!interactive) return
    dragRef.current = true
    lastXRef.current = event.clientX
    velocityRef.current = 0
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event) => {
    if (!interactive || !dragRef.current || !textPathRef.current || !spacing) return
    const delta = event.clientX - lastXRef.current
    lastXRef.current = event.clientX
    velocityRef.current = delta
    let nextOffset = Number.parseFloat(textPathRef.current.getAttribute('startOffset') || '0') + delta
    if (nextOffset <= -spacing) nextOffset += spacing
    if (nextOffset > 0) nextOffset -= spacing
    textPathRef.current.setAttribute('startOffset', `${nextOffset}px`)
  }

  const finishDrag = () => {
    if (!interactive) return
    dragRef.current = false
    if (velocityRef.current) directionRef.current = velocityRef.current > 0 ? 'right' : 'left'
  }

  return (
    <div
      className="curved-loop-jacket"
      style={{ visibility: spacing ? 'visible' : 'hidden', cursor: interactive ? 'grab' : 'auto' }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishDrag}
      onPointerCancel={finishDrag}
      onPointerLeave={finishDrag}
    >
      <svg className="curved-loop-svg" viewBox="0 0 1440 120" aria-hidden="true">
        <text ref={measureRef} className="curved-loop-measure" xmlSpace="preserve">{text}</text>
        <defs>
          <path id={pathId} d={path} fill="none" />
        </defs>
        {spacing > 0 && (
          <text className={className} fontWeight="700" xmlSpace="preserve">
            <textPath ref={textPathRef} href={`#${pathId}`} startOffset={`${-spacing}px`} xmlSpace="preserve">
              {Array.from({ length: repeatCount }, (_, repeatIndex) => (
                <tspan key={repeatIndex}>
                  {textSegments.map((segment, segmentIndex) => (
                    <tspan key={segmentIndex}>
                      {segment}
                      {segmentIndex < textSegments.length - 1 && <tspan className="curved-loop-star">✦</tspan>}
                    </tspan>
                  ))}
                </tspan>
              ))}
            </textPath>
          </text>
        )}
      </svg>
      <span className="sr-only">{marqueeText}</span>
    </div>
  )
}

export default CurvedLoop
