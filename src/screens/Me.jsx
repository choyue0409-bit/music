// Me — profile + computed stats + map + favorites + spend.

import { FONTS, STRINGS, paperTextureUrl } from '../design.js'
import { Cover, Stars } from '../atoms.jsx'
import { ScreenHeader, SectionLabel } from './shared.jsx'
import { MAP_CITIES, YEAR_BARS } from '../seed.js'

export function MeScreen({ theme, lang, stats, onChangeTheme, currentTheme }) {
  const S = STRINGS[lang]
  return (
    <div style={{ paddingBottom: 100 }}>
      <ScreenHeader
        theme={theme}
        scriptLine={lang === 'zh' ? '我的现场履历' : 'live history of'}
        title={lang === 'zh' ? 'KAI · 1992' : 'KAI · 1992'}
        subtitle={`${stats.totalShows} ${lang === 'zh' ? '场 · ' : 'shows · '}${stats.cities} ${lang === 'zh' ? '座城市' : 'cities'} · ${stats.hours}h`}
      />

      <div style={{ padding: '0 20px 18px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <BigStat n={stats.thisYear} label={S.statsThisYear} theme={theme} accent/>
        <BigStat n={stats.cities} label={S.statsCities} theme={theme}/>
        <BigStat n={stats.venues} label={S.statsVenues} theme={theme}/>
        <BigStat n={`${stats.hours}h`} label={S.statsHours} theme={theme}/>
      </div>

      <div style={{ padding: '4px 20px 20px' }}>
        <SectionLabel text={lang === 'zh' ? '年度' : 'by year'} theme={theme}/>
        <div style={{
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          height: 96, marginTop: 14, gap: 6,
        }}>
          {YEAR_BARS.map((b) => {
            const max = Math.max(...YEAR_BARS.map((x) => x.count))
            const h = b.count === 0 ? 2 : (b.count / max) * 80
            return (
              <div key={b.year} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{ fontFamily: FONTS.mono, fontSize: 9, color: theme.paperMuted, letterSpacing: 0.5 }}>{b.count || ''}</div>
                <div style={{
                  width: '100%', height: h,
                  background: b.year === 2026 ? theme.stamp : theme.paperFg,
                  opacity: b.year === 2026 ? 1 : 0.85,
                  borderRadius: '1px 1px 0 0',
                }}/>
                <div style={{ fontFamily: FONTS.mono, fontSize: 9, letterSpacing: 0.5, color: theme.paperMuted }}>
                  '{String(b.year).slice(2)}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div style={{ padding: '0 20px 20px' }}>
        <SectionLabel
          text={S.map} theme={theme}
          right={
            <div style={{ fontFamily: FONTS.mono, fontSize: 10, letterSpacing: 1, color: theme.paperMuted }}>
              {stats.cities} {lang === 'zh' ? '城' : 'cities'}
            </div>
          }
        />
        <div style={{
          marginTop: 10, height: 200, borderRadius: 6,
          background: theme.paperBg,
          backgroundImage: paperTextureUrl(0.5, theme.paperHue),
          backgroundBlendMode: 'multiply',
          border: `0.5px solid ${theme.paperLine}`,
          position: 'relative', overflow: 'hidden',
        }}>
          <WorldMapDots theme={theme}/>
        </div>
      </div>

      <div style={{ padding: '0 20px 20px' }}>
        <SectionLabel text={lang === 'zh' ? '最爱' : 'favorites'} theme={theme}/>
        <div style={{ marginTop: 10 }}>
          <RankRow rank={1} title={stats.topArtist} sub={`${stats.topArtistCount} ${lang === 'zh' ? '场' : 'shows'}`} theme={theme} kind="rose"/>
          <RankRow rank={2} title={stats.topVenue} sub={`${stats.topVenueCount} ${lang === 'zh' ? '次' : 'visits'}`} theme={theme} kind="amber"/>
          <RankRow rank={3} title={stats.topCity} sub={`${stats.topCityCount} ${lang === 'zh' ? '场' : 'shows'}`} theme={theme} kind="cool"/>
        </div>
      </div>

      <div style={{ padding: '0 20px 20px' }}>
        <div style={{
          padding: '14px 16px', borderRadius: 6,
          background: theme.paperFg, color: theme.paperBg,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: paperTextureUrl(0.4, 'dark'), mixBlendMode: 'multiply', opacity: 0.4 }}/>
          <div style={{ position: 'relative' }}>
            <div style={{ fontFamily: FONTS.mono, fontSize: 10, letterSpacing: 1.5, opacity: 0.7, textTransform: 'uppercase' }}>
              {S.statsTotalSpend}
            </div>
            <div style={{ fontFamily: FONTS.condensed, fontSize: 28, fontWeight: 700, marginTop: 4 }}>
              ¥{stats.totalSpend.toLocaleString()}
            </div>
          </div>
          <div style={{ position: 'relative', fontFamily: FONTS.serif, fontStyle: 'italic', fontSize: 12, opacity: 0.7, textAlign: 'right' }}>
            {lang === 'zh' ? '一辈子' : 'all-time'}<br/>
            {lang === 'zh' ? '里 ' + stats.totalShows + ' 张票' : stats.totalShows + ' tickets'}
          </div>
        </div>
      </div>

      {onChangeTheme && (
        <div style={{ padding: '8px 20px 30px' }}>
          <SectionLabel text={lang === 'zh' ? '主题' : 'Theme'} theme={theme}/>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
            {['cream', 'ivory', 'rose', 'cool', 'noir'].map((t) => {
              const on = currentTheme === t
              return (
                <button key={t} onClick={() => onChangeTheme(t)} style={{
                  height: 30, padding: '0 12px', borderRadius: 999, cursor: 'pointer',
                  border: `0.5px solid ${theme.paperLine}`,
                  background: on ? theme.paperFg : 'transparent',
                  color: on ? theme.paperBg : theme.paperFg,
                  fontFamily: FONTS.sans, fontSize: 12, fontWeight: 500,
                }}>{t}</button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

function BigStat({ n, label, theme, accent = false }) {
  return (
    <div style={{
      padding: '14px 14px 12px', borderRadius: 6,
      border: `0.5px solid ${theme.paperLine}`,
      background: theme.paperBg,
      backgroundImage: paperTextureUrl(0.4, theme.paperHue),
      backgroundBlendMode: 'multiply',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        fontFamily: FONTS.condensed, fontSize: 36, fontWeight: 700,
        lineHeight: 1, color: accent ? theme.stamp : theme.paperFg,
      }}>{n}</div>
      <div style={{
        fontFamily: FONTS.mono, fontSize: 10, letterSpacing: 1.5,
        color: theme.paperMuted, textTransform: 'uppercase', marginTop: 6,
      }}>{label}</div>
    </div>
  )
}

function RankRow({ rank, title, sub, theme, kind }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0',
      borderBottom: `0.5px solid ${theme.paperLine}`,
    }}>
      <div style={{
        width: 22, fontFamily: FONTS.condensed, fontSize: 22, fontWeight: 700,
        color: theme.paperMuted, lineHeight: 1,
      }}>{String(rank).padStart(2, '0')}</div>
      <Cover kind={kind} size={36} rounded={3}/>
      <div style={{ flex: 1 }}>
        <div style={{ fontFamily: FONTS.serif, fontSize: 15, fontWeight: 500, color: theme.paperFg }}>{title}</div>
        <div style={{ fontFamily: FONTS.mono, fontSize: 10, letterSpacing: 1, color: theme.paperMuted, marginTop: 2 }}>{sub}</div>
      </div>
      <Stars value={5} max={5} size={9} color={theme.stamp}/>
    </div>
  )
}

function WorldMapDots({ theme }) {
  const project = (lat, lng) => {
    const x = ((lng + 180) / 360) * 100
    const y = ((75 - lat) / 135) * 100
    return { x, y }
  }
  return (
    <>
      <svg width="100%" height="100%" viewBox="0 0 400 200" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
        <g fill="none" stroke={theme.paperFg} strokeWidth="0.6" opacity="0.45" strokeLinejoin="round">
          <path d="M30 50 Q 45 35 70 38 Q 95 42 100 70 Q 90 95 65 100 Q 40 95 32 80 Z"/>
          <path d="M85 110 Q 95 105 100 130 Q 95 160 85 170 Q 75 160 78 130 Z"/>
          <path d="M180 50 Q 200 42 215 50 Q 220 70 205 78 Q 185 75 178 65 Z"/>
          <path d="M195 90 Q 220 88 230 110 Q 225 145 210 160 Q 195 150 192 125 Z"/>
          <path d="M225 50 Q 280 38 330 55 Q 345 75 320 95 Q 280 100 240 88 Z"/>
          <path d="M310 130 Q 340 125 350 140 Q 345 155 320 153 Q 305 145 308 138 Z"/>
        </g>
        <g stroke={theme.paperLine} strokeWidth="0.3" fill="none">
          <line x1="0" y1="100" x2="400" y2="100"/>
          <line x1="200" y1="0" x2="200" y2="200"/>
        </g>
      </svg>
      {MAP_CITIES.map((c) => {
        const p = project(c.lat, c.lng)
        const r = Math.min(14, 4 + c.count * 0.6)
        return (
          <div
            key={c.name}
            style={{
              position: 'absolute', left: `${p.x}%`, top: `${p.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <div style={{
              width: r, height: r, borderRadius: '50%',
              background: theme.stamp, opacity: 0.85,
              boxShadow: `0 0 0 1px ${theme.paperBg}, 0 0 0 ${r/2}px ${theme.stamp}26`,
            }}/>
          </div>
        )
      })}
      <div style={{
        position: 'absolute', top: 8, left: 10,
        fontFamily: FONTS.mono, fontSize: 8.5, letterSpacing: 1.5,
        color: theme.paperMuted, textTransform: 'uppercase',
      }}>WORLD · {MAP_CITIES.reduce((a, c) => a + c.count, 0)} SHOWS</div>
    </>
  )
}
