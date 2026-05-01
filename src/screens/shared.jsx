// Shared bits used by multiple screens — header, section label, meta cell.

import { FONTS } from '../design.js'

export function ScreenHeader({ title, subtitle, theme, right, scriptLine }) {
  return (
    <div style={{ padding: '60px 20px 14px', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          {scriptLine && (
            <div style={{
              fontFamily: FONTS.serif, fontStyle: 'italic',
              fontSize: 13, color: theme.paperMuted, marginBottom: 2,
            }}>{scriptLine}</div>
          )}
          <div style={{
            fontFamily: FONTS.condensed, fontSize: 44,
            fontWeight: 700, lineHeight: 0.95, letterSpacing: -0.5,
            color: theme.paperFg, textTransform: 'uppercase',
          }}>{title}</div>
          {subtitle && (
            <div style={{
              fontFamily: FONTS.mono, fontSize: 10, marginTop: 6,
              letterSpacing: 1.5, color: theme.paperMuted,
              textTransform: 'uppercase',
            }}>{subtitle}</div>
          )}
        </div>
        {right}
      </div>
    </div>
  )
}

export function SectionLabel({ text, theme, right }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{
        fontFamily: FONTS.mono, fontSize: 10, letterSpacing: 2,
        color: theme.paperMuted, textTransform: 'uppercase',
      }}>{text}</div>
      {right}
    </div>
  )
}

export function MetaCell({ label, value, theme }) {
  return (
    <div>
      <div style={{
        fontFamily: FONTS.mono, fontSize: 9, letterSpacing: 1.5,
        color: theme.paperMuted, textTransform: 'uppercase',
      }}>{label}</div>
      <div style={{
        fontFamily: FONTS.serif, fontSize: 16, color: theme.paperFg,
        marginTop: 4, fontWeight: 500,
      }}>{value}</div>
    </div>
  )
}
