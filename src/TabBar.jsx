// Bottom tab bar with center plus button.

import { FONTS, STRINGS, paperTextureUrl } from './design.js'

export function TabBar({ active, onTab, theme, lang }) {
  const S = STRINGS[lang]
  const tabs = [
    { id: 'home', label: S.tabHome, icon: 'ticket' },
    { id: 'search', label: S.tabSearch, icon: 'compass' },
    { id: 'add', label: '', icon: 'plus' },
    { id: 'me', label: S.tabMe, icon: 'me' },
  ]
  const fg = theme.paperFg
  const muted = theme.paperMuted
  const tabIcon = (id, color) => {
    if (id === 'ticket') return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M3 8a2 2 0 012-2h14a2 2 0 012 2v2a2 2 0 100 4v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2a2 2 0 100-4V8z" stroke={color} strokeWidth="1.6"/>
        <path d="M9 7v10" stroke={color} strokeWidth="1.6" strokeDasharray="1.5 2"/>
      </svg>
    )
    if (id === 'compass') return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.6"/>
        <path d="M15 9l-1.5 4.5L9 15l1.5-4.5L15 9z" fill={color} stroke={color} strokeWidth="1.6" strokeLinejoin="round"/>
      </svg>
    )
    if (id === 'me') return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="9" r="3.5" stroke={color} strokeWidth="1.6"/>
        <path d="M5 19c1.5-3.5 4-5 7-5s5.5 1.5 7 5" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    )
    return null
  }
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0,
      height: 78, paddingBottom: 'env(safe-area-inset-bottom, 16px)', zIndex: 30,
      background: theme.paperBg,
      backgroundImage: `${paperTextureUrl(0.5, theme.paperHue)}`,
      backgroundBlendMode: 'multiply',
      borderTop: `0.5px solid ${theme.paperLine}`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      maxWidth: 480, margin: '0 auto',
    }}>
      {tabs.map((t) => {
        const isActive = active === t.id
        if (t.icon === 'plus') {
          return (
            <button
              key={t.id}
              onClick={() => onTab(t.id)}
              style={{
                width: 52, height: 52, borderRadius: '50%',
                background: theme.stamp, color: '#F2EBD9',
                border: 'none', cursor: 'pointer',
                marginTop: -16,
                boxShadow: '0 4px 12px rgba(0,0,0,0.18), inset 0 0 0 0.5px rgba(0,0,0,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative', overflow: 'hidden',
              }}
            >
              <div style={{ position: 'absolute', inset: 0, backgroundImage: paperTextureUrl(0.5, 'dark'), mixBlendMode: 'multiply', opacity: 0.6 }}/>
              <svg width="24" height="24" viewBox="0 0 24 24" style={{ position: 'relative' }}>
                <path d="M12 5v14M5 12h14" stroke="#F2EBD9" strokeWidth="2.2" strokeLinecap="round"/>
              </svg>
            </button>
          )
        }
        return (
          <button
            key={t.id}
            onClick={() => onTab(t.id)}
            style={{
              flex: 1, background: 'transparent', border: 'none', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
              color: isActive ? fg : muted, padding: '6px 0',
            }}
          >
            {tabIcon(t.icon, isActive ? fg : muted)}
            <div style={{ fontFamily: FONTS.mono, fontSize: 9, letterSpacing: 1, textTransform: 'uppercase', fontWeight: isActive ? 700 : 500 }}>
              {t.label}
            </div>
          </button>
        )
      })}
    </div>
  )
}
