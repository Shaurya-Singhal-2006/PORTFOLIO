import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

// Small helpers turn pointer distance into font-axis values for the variable font.
const distance = (a, b) => Math.hypot(b.x - a.x, b.y - a.y)

const getAttribute = (distanceFromPointer, maxDistance, min, max) => {
  const value = max - Math.abs((max * distanceFromPointer) / maxDistance)
  return Math.max(min, value + min)
}

function TextPressure({
  text = 'Compressa',
  fontFamily = 'Roboto Flex',
  fontUrl = 'https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wdth,wght@8..144,25..151,100..1000&display=swap',
  width = true,
  weight = true,
  italic = true,
  alpha = false,
  flex = true,
  stroke = false,
  scale = false,
  textColor = '#fff',
  strokeColor = '#f00',
  className = '',
  minFontSize = 24,
}) {
  // Track pointer positions separately so the visual response can ease smoothly each frame.
  const containerRef = useRef(null)
  const titleRef = useRef(null)
  const spansRef = useRef([])
  const pointerRef = useRef({ x: 0, y: 0 })
  const easedPointerRef = useRef({ x: 0, y: 0 })
  const [fontSize, setFontSize] = useState(minFontSize)
  const [scaleY, setScaleY] = useState(1)
  const [lineHeight, setLineHeight] = useState(1)
  const chars = [...text]

  useEffect(() => {
    const updatePointer = (event) => {
      pointerRef.current = { x: event.clientX, y: event.clientY }
    }
    const updateTouch = (event) => {
      const touch = event.touches[0]
      if (touch) updatePointer(touch)
    }

    window.addEventListener('mousemove', updatePointer)
    window.addEventListener('touchmove', updateTouch, { passive: true })
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      const center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
      pointerRef.current = center
      easedPointerRef.current = center
    }

    return () => {
      window.removeEventListener('mousemove', updatePointer)
      window.removeEventListener('touchmove', updateTouch)
    }
  }, [])

  // Fit the title to its container, then optionally scale its height to match.
  const setSize = useCallback(() => {
    if (!containerRef.current || !titleRef.current) return
    const { width: containerWidth, height: containerHeight } = containerRef.current.getBoundingClientRect()
    setFontSize(Math.max(containerWidth / (chars.length / 2), minFontSize))
    setScaleY(1)
    setLineHeight(1)

    requestAnimationFrame(() => {
      if (!titleRef.current || !scale) return
      const titleHeight = titleRef.current.getBoundingClientRect().height
      if (titleHeight > 0) {
        const ratio = containerHeight / titleHeight
        setScaleY(ratio)
        setLineHeight(ratio)
      }
    })
  }, [chars.length, minFontSize, scale])

  useEffect(() => {
    let timeoutId
    const resize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(setSize, 100)
    }
    resize()
    window.addEventListener('resize', resize)
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener('resize', resize)
    }
  }, [setSize])

  useEffect(() => {
    const container = containerRef.current
    if (!container || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    let frameId = 0
    let isVisible = false
    const animate = () => {
      frameId = 0
      if (!isVisible || document.hidden) return

      const pointer = pointerRef.current
      const easedPointer = easedPointerRef.current
      easedPointer.x += (pointer.x - easedPointer.x) / 15
      easedPointer.y += (pointer.y - easedPointer.y) / 15

      if (titleRef.current) {
        const maxDistance = titleRef.current.getBoundingClientRect().width / 2
        spansRef.current.forEach((span) => {
          if (!span || maxDistance === 0) return
          const rect = span.getBoundingClientRect()
          const charCenter = { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 }
          const d = distance(easedPointer, charCenter)
          const variationWidth = width ? Math.floor(getAttribute(d, maxDistance, 5, 200)) : 100
          const variationWeight = weight ? Math.floor(getAttribute(d, maxDistance, 350, 650)) : 500
          const variationItalic = italic ? getAttribute(d, maxDistance, 0, 1).toFixed(2) : 0
          const opacity = alpha ? getAttribute(d, maxDistance, 0, 1).toFixed(2) : 1
          span.style.fontVariationSettings = `'wght' ${variationWeight}, 'wdth' ${variationWidth}, 'ital' ${variationItalic}`
          if (alpha) span.style.opacity = opacity
        })
      }

      frameId = window.requestAnimationFrame(animate)
    }

    const startAnimation = () => {
      if (isVisible && !document.hidden && !frameId) {
        frameId = window.requestAnimationFrame(animate)
      }
    }

    const stopAnimation = () => {
      if (frameId) window.cancelAnimationFrame(frameId)
      frameId = 0
    }

    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting
      if (isVisible) startAnimation()
      else stopAnimation()
    })
    observer.observe(container)

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
  }, [alpha, italic, weight, width])

  const styles = useMemo(() => (
    <style>{`
      @import url('${fontUrl}');
      .text-pressure.flex { display: flex; justify-content: space-between; }
      .text-pressure.stroke span { position: relative; color: ${textColor}; }
      .text-pressure.stroke span::after {
        content: attr(data-char); position: absolute; inset: 0; color: transparent;
        z-index: -1; -webkit-text-stroke: 3px ${strokeColor};
      }
      .text-pressure-title { color: ${textColor}; }
    `}</style>
  ), [fontUrl, textColor, strokeColor])

  const classes = [className, flex && 'flex', stroke && 'stroke'].filter(Boolean).join(' ')

  return (
    <div ref={containerRef} className="text-pressure-container">
      {styles}
      <h1
        ref={titleRef}
        className={`text-pressure-title text-pressure ${classes}`}
        style={{
          fontFamily,
          textTransform: 'uppercase',
          fontSize,
          lineHeight,
          transform: `scale(1, ${scaleY})`,
          transformOrigin: 'center top',
          margin: 0,
          textAlign: 'center',
          userSelect: 'none',
          whiteSpace: 'nowrap',
          fontWeight: 100,
          width: '100%',
        }}
      >
        {chars.map((char, index) => (
          <span
            key={`${char}-${index}`}
            ref={(element) => { spansRef.current[index] = element }}
            data-char={char}
            style={{ display: 'inline-block', color: stroke ? undefined : textColor }}
          >
            {char}
          </span>
        ))}
      </h1>
    </div>
  )
}

export default TextPressure
