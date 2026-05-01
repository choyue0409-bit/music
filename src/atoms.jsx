// Reusable design atoms — paper sheet, perforation, stamp, barcode, stars,
// cover, chip. All take a `theme` prop from design.js#THEMES.

import { FONTS, COVER_PALETTES, paperTextureUrl, foxingUrl } from './design.js'

export function PaperSheet({ theme, children, style = {}, intense = false }) {
  return (
    <div
      style={{
        position: 'relative',
        background: theme.paperBg,
        backgroundImage: `${paperTextureUrl(intense ? 0.7 : 0.5, theme.paperHue)}, ${foxingUrl(intense ? 0.09 : 0.05)}`,
        backgroundBlendMode: 'multiply, multiply',
        color: theme.paperFg,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export function PerforationLine({ vertical = true, color = 'currentColor', opacity = 0.35 }) {
  return (
    <div
      style={{
        position: 'absolute',
        ...(vertical
          ? { top: 8, bottom: 8, width: 1 }
          : { left: 8, right: 8, height: 1 }),
        backgroundImage: vertical
          ? `linear-gradient(to bottom, ${color} 50%, transparent 50%)`
          : `linear-gradient(to right, ${color} 50%, transparent 50%)`,
        backgroundSize: vertical ? '1px 6px' : '6px 1px',
        opacity,
      }}
    />
  )
}

export function Stamp({ text = 'ATTENDED', color = '#A53224', size = 78, rotation = -12, style = {} }) {
  return (
    <div
      style={{
        position: 'relative',
        width: size, height: size,
        transform: `rotate(${rotation}deg)`,
        color, opacity: 0.78,
        ...style,
      }}
    >
      <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block' }}>
        <circle cx="50" cy="50" r="46" fill="none" stroke={color} strokeWidth="2.5" />
        <circle cx="50" cy="50" r="40" fill="none" stroke={color} strokeWidth="0.8" />
        <circle cx="50" cy="50" r="43" fill="none" stroke={color} strokeWidth="1" strokeDasharray="2 3" opacity="0.5" />
      </svg>
      <div
        style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: FONTS.condensed,
          fontSize: size * 0.18,
          letterSpacing: '0.18em',
          fontWeight: 700, textAlign: 'center', lineHeight: 1.05,
        }}
      >
        {text}
      </div>
    </div>
  )
}

export function Barcode({ value = 'NO. 000000', height = 36, color = 'currentColor' }) {
  const seed = value.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const bars = []
  let x = 0
  for (let i = 0; i < 60; i++) {
    const w = ((seed * (i + 7)) % 5) === 0 ? 3 : ((seed * (i + 3)) % 3) === 0 ? 2 : 1
    const isBar = ((seed + i * 13) % 5) > 1
    if (isBar) bars.push({ x, w })
    x += w + 1
  }
  const total = x
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${total} ${height}`} preserveAspectRatio="none" style={{ display: 'block' }}>
      {bars.map((b, i) => (
        <rect key={i} x={b.x} y="0" width={b.w} height={height} fill={color} />
      ))}
    </svg>
  )
}

export function Stars({ value = 5, max = 5, size = 14, color = 'currentColor' }) {
  const stars = Array.from({ length: max })
  return (
    <div style={{ display: 'inline-flex', gap: 2, color }}>
      {stars.map((_, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 16 16">
          <path
            d="M8 1l2.2 4.5 4.8.7-3.5 3.4.8 4.8L8 12l-4.3 2.4.8-4.8L1 6.2l4.8-.7L8 1z"
            fill={i < value ? color : 'none'}
            stroke={color}
            strokeWidth="1"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </div>
  )
}

export function Cover({ kind = 'sunset', text = '', size = 56, rounded = 4, style = {} }) {
  const pal = COVER_PALETTES[kind] || COVER_PALETTES.sunset
  const numericSize = typeof size === 'number' ? size : null
  return (
    <div
      style={{
        width: size, height: size, borderRadius: rounded,
        background: `linear-gradient(135deg, ${pal[0]} 0%, ${pal[1]} 60%, ${pal[2]} 100%)`,
        position: 'relative', overflow: 'hidden',
        boxShadow: 'inset 0 0 0 0.5px rgba(0,0,0,0.2)',
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute', inset: 0,
          backgroundImage: paperTextureUrl(0.45, 'dark'),
          mixBlendMode: 'multiply', opacity: 0.5,
        }}
      />
      {text && numericSize && (
        <div
          style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: FONTS.condensed, color: '#F2EBD9',
            fontSize: numericSize * 0.28, letterSpacing: '0.04em',
            textShadow: '0 1px 2px rgba(0,0,0,0.4)',
          }}
        >
          {text}
        </div>
      )}
      {text && !numericSize && (
        <div
          style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: FONTS.condensed, color: '#F2EBD9',
            fontSize: 56, letterSpacing: '0.04em',
            textShadow: '0 1px 2px rgba(0,0,0,0.4)',
            textTransform: 'uppercase',
            padding: '0 24px', textAlign: 'center', lineHeight: 1.05,
          }}
        >
          {text}
        </div>
      )}
    </div>
  )
}

export function Chip({ children, theme, accent = false, style = {} }) {
  return (
    <span
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        height: 22, padding: '0 9px', borderRadius: 999,
        fontFamily: FONTS.sans, fontSize: 11, fontWeight: 500,
        letterSpacing: 0.2, whiteSpace: 'nowrap',
        background: accent ? theme.stamp : theme.chipBg,
        color: accent ? '#F2EBD9' : theme.chipFg,
        border: accent ? 'none' : `0.5px solid ${theme.paperLine}`,
        ...style,
      }}
    >
      {children}
    </span>
  )
}
