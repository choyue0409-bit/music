// Home — timeline of stubs grouped by month.

import { FONTS, STRINGS, SHOW_TYPES } from '../design.js'
import { TicketStub } from '../TicketStub.jsx'
import { ScreenHeader } from './shared.jsx'

export function HomeScreen({ theme, lang, variant, shows, stats, onOpen }) {
  const S = STRINGS[lang]
  const byMonth = {}
  shows.forEach((s) => {
    const [y, m] = (s.date || '').split('-')
    if (!y || !m) return
    const key = `${y}-${m}`
    if (!byMonth[key]) byMonth[key] = []
    byMonth[key].push(s)
  })
  const keys = Object.keys(byMonth).sort().reverse()
  const months = ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月']
  const monthsEn = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']

  return (
    <div style={{ paddingBottom: 100 }}>
      <ScreenHeader
        theme={theme}
        scriptLine={lang === 'zh' ? '看过的演出' : "shows you've been to"}
        title={S.homeHeader}
        subtitle={`${stats.totalShows} ${lang === 'zh' ? '场 · ' : 'shows · '}${stats.cities} ${lang === 'zh' ? '座城市' : 'cities'}`}
      />

      <div style={{ display: 'flex', gap: 6, padding: '0 20px 6px', overflowX: 'auto' }}>
        {[
          { id: 'all', glyph: '◍', zh: '全部', en: 'All' },
          { id: 'concert', ...SHOW_TYPES.concert },
          { id: 'theatre', ...SHOW_TYPES.theatre },
          { id: 'classical', ...SHOW_TYPES.classical },
          { id: 'standup', ...SHOW_TYPES.standup },
          { id: 'musical', ...SHOW_TYPES.musical },
          { id: 'dance', ...SHOW_TYPES.dance },
        ].map((tp, i) => (
          <div key={tp.id} style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            padding: '5px 11px', borderRadius: 999,
            border: `0.5px solid ${theme.paperLine}`,
            background: i === 0 ? theme.stamp : 'transparent',
            color: i === 0 ? '#F2EBD9' : theme.paperFg,
            fontFamily: FONTS.sans, fontSize: 11, fontWeight: 500,
            whiteSpace: 'nowrap', flexShrink: 0,
          }}>
            <span style={{ fontSize: 12 }}>{tp.glyph}</span>
            <span>{lang === 'zh' ? tp.zh : tp.en}</span>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 6, padding: '0 20px 10px', overflowX: 'auto' }}>
        {['ALL', '2026', '2025', '2024', '2023'].map((y, i) => (
          <div key={y} style={{
            padding: '5px 12px', borderRadius: 999,
            border: `0.5px solid ${theme.paperLine}`,
            background: i === 0 ? theme.paperFg : 'transparent',
            color: i === 0 ? theme.paperBg : theme.paperFg,
            fontFamily: FONTS.mono, fontSize: 10, letterSpacing: 1,
            whiteSpace: 'nowrap', flexShrink: 0,
          }}>{y}</div>
        ))}
      </div>

      {keys.length === 0 && (
        <div style={{
          padding: '60px 24px', textAlign: 'center',
          fontFamily: FONTS.serif, fontStyle: 'italic',
          fontSize: 15, color: theme.paperMuted,
        }}>
          {lang === 'zh' ? '还没有票根。点下面的 + 加一张吧。' : 'No stubs yet. Tap + below to add one.'}
        </div>
      )}

      {keys.map((k) => {
        const [y, m] = k.split('-')
        const monthLabel = lang === 'zh' ? months[parseInt(m, 10) - 1] : monthsEn[parseInt(m, 10) - 1]
        return (
          <div key={k} style={{ padding: '10px 20px 6px' }}>
            <div style={{
              display: 'flex', alignItems: 'baseline', gap: 8,
              marginBottom: 12, marginTop: 8,
            }}>
              <div style={{
                fontFamily: FONTS.serif, fontSize: 22, fontWeight: 500,
                color: theme.paperFg, fontStyle: lang === 'zh' ? 'normal' : 'italic',
              }}>{monthLabel}</div>
              <div style={{
                fontFamily: FONTS.mono, fontSize: 11, letterSpacing: 1.2,
                color: theme.paperMuted,
              }}>{y}</div>
              <div style={{ flex: 1, height: 0.5, background: theme.paperLine, marginLeft: 4 }}/>
              <div style={{
                fontFamily: FONTS.mono, fontSize: 10, letterSpacing: 1,
                color: theme.paperMuted,
              }}>{byMonth[k].length} {lang === 'zh' ? '场' : 'shows'}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {byMonth[k].map((s, i) => (
                <div key={s.id} style={{ transform: `rotate(${i % 2 === 0 ? -0.3 : 0.4}deg)` }}>
                  <TicketStub
                    show={s} theme={theme} variant={variant}
                    width={348} lang={lang}
                    onClick={() => onOpen(s.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
