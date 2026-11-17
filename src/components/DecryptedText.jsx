import { useEffect, useMemo, useRef, useState } from 'react'

// Keep revealed characters fixed while replacing the rest with random characters.
function scramble(text, revealed, characters) {
  return [...text].map((character, index) => {
    if (character === ' ' || revealed.has(index)) return character
    return characters[Math.floor(Math.random() * characters.length)]
  }).join('')
}

function DecryptedText({
  text = '',
  speed = 55,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*',
  revealDirection = 'center',
  className = '',
  encryptedClassName = '',
  onComplete,
}) {
  // Reveal order is recalculated when the text or animation settings change.
  const letters = useMemo(() => [...text], [text])
  const [revealed, setRevealed] = useState(() => new Set())
  const [displayText, setDisplayText] = useState(() => scramble(text, new Set(), characters))
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    const order = letters.map((_, index) => index)
    if (revealDirection === 'end') order.reverse()
    if (revealDirection === 'center') {
      const center = Math.floor(letters.length / 2)
      order.sort((a, b) => Math.abs(a - center) - Math.abs(b - center))
    }

    const nextRevealed = new Set()

    if (letters.length === 0) {
      onCompleteRef.current?.()
      return undefined
    }

    let pointer = 0
    const timer = window.setInterval(() => {
      const next = new Set(nextRevealed)
      next.add(order[pointer])
      pointer += 1
      nextRevealed.clear()
      next.forEach((index) => nextRevealed.add(index))
      setRevealed(new Set(nextRevealed))
      setDisplayText(scramble(text, nextRevealed, characters))

      if (pointer >= order.length) {
        window.clearInterval(timer)
        setDisplayText(text)
        onCompleteRef.current?.()
      }
    }, speed)

    return () => window.clearInterval(timer)
  }, [text, speed, characters, revealDirection, letters])

  return (
    <span className="decrypted-text" aria-label={text}>
      <span aria-hidden="true">
        {letters.map((character, index) => (
          <span
            key={`${character}-${index}`}
            className={revealed.has(index) ? className : encryptedClassName}
          >
            {displayText[index] ?? character}
          </span>
        ))}
      </span>
    </span>
  )
}

export default DecryptedText
