import { useEffect, useRef } from 'react'
import './ClickSpark.css'

function ClickSpark({
  sparkColor = '#70adff',
  sparkSize = 10,
  sparkRadius = 18,
  sparkCount = 8,
  duration = 420,
  easing = 'ease-out',
  extraScale = 1.1,
}) {
  // Refs let the canvas animation update without re-rendering React on every frame.
  const canvasRef = useRef(null)
  const sparksRef = useRef([])
  const configRef = useRef({ sparkColor, sparkSize, sparkRadius, sparkCount, duration, easing, extraScale })

  useEffect(() => {
    configRef.current = { sparkColor, sparkSize, sparkRadius, sparkCount, duration, easing, extraScale }
  }, [sparkColor, sparkSize, sparkRadius, sparkCount, duration, easing, extraScale])

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return undefined

    let width = window.innerWidth
    let height = window.innerHeight
    let pixelRatio = 1
    let animationFrame = 0

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      pixelRatio = Math.min(window.devicePixelRatio || 1, 1.5)
      canvas.width = Math.round(width * pixelRatio)
      canvas.height = Math.round(height * pixelRatio)
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    }

    const ease = (progress, type) => {
      if (type === 'linear') return progress
      if (type === 'ease-in') return progress * progress
      if (type === 'ease-in-out') {
        return progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress
      }
      return progress * (2 - progress)
    }

    const draw = (timestamp) => {
      context.clearRect(0, 0, width, height)
      const current = configRef.current
      sparksRef.current = sparksRef.current.filter((spark) => {
        const elapsed = timestamp - spark.startTime
        if (elapsed >= current.duration) return false

        const progress = elapsed / current.duration
        const eased = ease(progress, current.easing)
        const distance = eased * current.sparkRadius * current.extraScale
        const lineLength = current.sparkSize * (1 - eased)
        const x1 = spark.x + distance * Math.cos(spark.angle)
        const y1 = spark.y + distance * Math.sin(spark.angle)
        const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle)
        const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle)

        context.strokeStyle = current.sparkColor
        context.globalAlpha = 1 - progress
        context.lineWidth = 2
        context.beginPath()
        context.moveTo(x1, y1)
        context.lineTo(x2, y2)
        context.stroke()
        context.globalAlpha = 1
        return true
      })

      if (sparksRef.current.length) {
        animationFrame = window.requestAnimationFrame(draw)
      } else {
        animationFrame = 0
      }
    }

    const handleClick = (event) => {
      // Place a ring of short-lived line segments at the click position.
      const current = configRef.current
      const startTime = performance.now()
      const count = Math.max(1, Math.min(32, Math.round(current.sparkCount)))
      for (let index = 0; index < count; index += 1) {
        sparksRef.current.push({
          x: event.clientX,
          y: event.clientY,
          angle: (2 * Math.PI * index) / count,
          startTime,
        })
      }
      if (!animationFrame) animationFrame = window.requestAnimationFrame(draw)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('click', handleClick, true)
    return () => {
      window.removeEventListener('resize', resize)
      window.removeEventListener('click', handleClick, true)
      if (animationFrame) window.cancelAnimationFrame(animationFrame)
      sparksRef.current = []
    }
  }, [])

  return <canvas ref={canvasRef} className="click-spark-layer" aria-hidden="true" />
}

export default ClickSpark
