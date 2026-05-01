// Search / Discover — search box, recent searches, mood tag cloud, upcoming.
// Real-time search filters the user's actual show list.

import { useState, useMemo } from 'react'
import { FONTS, STRINGS, paperTextureUrl } from '../design.js'
import { Cover, Chip } from '../atoms.jsx'
import { TicketStub } from '../TicketStub.jsx'
import { ScreenHeader, SectionLabel } from './shared.jsx'
import { DISCOVER, SEARCH_HISTORY, SEARCH_TAGS } from '../seed.js'

export function SearchScreen({ theme, lang, variant, shows, onOpen }) {
  const S = STRINGS[lang]
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return shows.filter((s) =>
      [s.artist, s.venue, s.venueEn, s.city, s.cityEn]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(q))
    )
  }, [query, shows])

  return (
    <div style={{ paddingBottom: 100 }}>
      <ScreenHeader
        theme={theme}
        scriptLine={lang === 'zh' ? '搜你的回忆' : 'search your memory'}
        title={S.searchTitle}
      />

      <div style={{ padding: '0 20px 16px' }}>
        <div style={{
          height: 42, borderRadius: 999,
          background: theme.paperBg,
          backgroundImage: paperTextureUrl(0.4, theme.paperHue),
          backgroundBlendMode: 'multiply',
          border: `0.5px solid ${theme.paperLine}`,
          display: 'flex', alignItems: 'center', gap: 10, padding: '0 16px',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke={theme.paperMuted} strokeWidth="1.6"/>
            <path d="M16 16l5 5" stroke={theme.paperMuted} strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={S.searchPh}
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              fontFamily: FONTS.serif, fontSize: 14, color: theme.paperFg,
            }}
          />
        </div>
      </div>

      {query && (
        <div style={{ padding: '0 20px 20px' }}>
          <SectionLabel
            text={lang === 'zh' ? '结果' : 'Results'}
            theme={theme}
            right={
              <div style={{ fontFamily: FONTS.mono, fontSize: 10, letterSpacing: 1, color: theme.paperMuted }}>
                {results.length}
              </div>
            }
          />
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
            {results.length === 0 && (
              <div style={{
                fontFamily: FONTS.serif, fontStyle: 'italic',
                fontSize: 14, color: theme.paperMuted, padding: '20px 0',
              }}>
                {lang === 'zh' ? '没找到。' : 'No matches.'}
              </div>
            )}
            {results.map((s) => (
              <TicketStub key={s.id} show={s} theme={theme} variant={variant} width={336} lang={lang} onClick={() => onOpen(s.id)}/>
            ))}
          </div>
        </div>
      )}

      {!query && (
        <>
          <div style={{ padding: '0 20px 16px' }}>
            <SectionLabel text={S.recent} theme={theme}/>
            <div style={{ marginTop: 10 }}>
              {SEARCH_HISTORY.slice(0, 4).map((q, i) => (
                <button
                  key={i}
                  onClick={() => setQuery(q)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12, width: '100%',
                    padding: '10px 0', background: 'transparent', border: 'none',
                    borderBottom: i < 3 ? `0.5px solid ${theme.paperLine}` : 'none',
                    cursor: 'pointer', textAlign: 'left',
                  }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke={theme.paperMuted} strokeWidth="1.4"/>
                    <path d="M12 7v5l3 2" stroke={theme.paperMuted} strokeWidth="1.4" strokeLinecap="round"/>
                  </svg>
                  <div style={{ flex: 1, fontFamily: FONTS.serif, fontSize: 15, color: theme.paperFg }}>{q}</div>
                  <div style={{ fontFamily: FONTS.mono, fontSize: 10, letterSpacing: 1, color: theme.paperMuted }}>↗</div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ padding: '0 20px 20px' }}>
            <SectionLabel text={S.tags} theme={theme}/>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
              {SEARCH_TAGS.map((t, i) => (
                <Chip key={i} theme={theme} accent={i === 0}>#{t}</Chip>
              ))}
            </div>
          </div>

          <div style={{ padding: '0 20px 30px' }}>
            <SectionLabel
              text={S.upcoming}
              theme={theme}
              right={
                <button style={{ background: 'transparent', border: 'none', fontFamily: FONTS.mono, fontSize: 10, letterSpacing: 1.2, color: theme.paperMuted }}>
                  {lang === 'zh' ? '全部 →' : 'ALL →'}
                </button>
              }
            />
            <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {DISCOVER.map((d) => (
                <div key={d.id} style={{
                  display: 'flex', gap: 12, padding: 12,
                  background: theme.paperBg,
                  backgroundImage: paperTextureUrl(0.4, theme.paperHue),
                  backgroundBlendMode: 'multiply',
                  border: `0.5px solid ${theme.paperLine}`,
                  borderRadius: 4, alignItems: 'center',
                }}>
                  <Cover kind={d.accent === 'red' ? 'rose' : d.accent === 'amber' ? 'amber' : 'cyan'} size={50} rounded={3}/>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontFamily: FONTS.condensed, fontSize: 18, fontWeight: 700,
                      letterSpacing: 0.2, textTransform: 'uppercase', color: theme.paperFg,
                      lineHeight: 1.05,
                    }}>{d.artist}</div>
                    <div style={{ fontFamily: FONTS.mono, fontSize: 10, letterSpacing: 1, color: theme.paperMuted, marginTop: 4 }}>
                      {d.when} · {d.venue}
                    </div>
                    <div style={{ fontFamily: FONTS.serif, fontStyle: 'italic', fontSize: 12, color: theme.paperMuted, marginTop: 2 }}>
                      {d.reason}
                    </div>
                  </div>
                  <button style={{
                    width: 30, height: 30, borderRadius: '50%',
                    background: theme.stamp, color: '#F2EBD9',
                    border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="12" height="12" viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="#F2EBD9" strokeWidth="2.4" strokeLinecap="round"/></svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
