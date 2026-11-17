import './ShinyText.css'

// The CSS animation reads these values from custom properties on this span.
function ShinyText({
  text,
  disabled = false,
  speed = 2,
  className = '',
  color = '#b5b5b5',
  shineColor = '#ffffff',
  spread = 120,
  yoyo = false,
  pauseOnHover = false,
  direction = 'left',
  delay = 0,
}) {
  const classes = [
    'shiny-text',
    disabled && 'shiny-text--disabled',
    direction === 'right' && 'shiny-text--right',
    yoyo && 'shiny-text--yoyo',
    pauseOnHover && 'shiny-text--pause-hover',
    className,
  ].filter(Boolean).join(' ')

  return (
    <span
      className={classes}
      style={{
        '--shiny-color': color,
        '--shiny-highlight': shineColor,
        '--shiny-angle': `${spread}deg`,
        '--shiny-duration': `${speed}s`,
        '--shiny-delay': `${delay}s`,
      }}
    >
      {text}
    </span>
  )
}

export default ShinyText
