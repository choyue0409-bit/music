// Share image templates. Each is a pure-DOM component sized to the target
// PNG dimensions (e.g. 1080×1920); the parent uses transform: scale() to
// shrink them for preview, and html-to-image captures the un-scaled node.
//
// Four templates:
//   TicketShareTemplate  — single show, vintage paper ticket
//   MinimalShareTemplate — single show, clean editorial card
//   MultiShareTemplate   — up to 4 shows, gallery layout
//   RecapShareTemplate   — annual stats, magazine-cover style

import { FONTS, SHOW_TYPES, parseDate, paperTextureUrl, foxingUrl } from '../design.js'
import { PaperSheet, Stamp, Barcode, Stars, Cover, Chip } from '../atoms.jsx'

const WATERMARK = 'iwasthere · 票根'

// ─────────────────────────────────────────────────────────────────────
// Single — ticket / vintage
// ─────────────────────────────────────────────────────────────────────
export function TicketShareTemplate({ show, theme, lang, size, options = {}, watermark = true }) {
  const { hidePrice, hideSeat } = options
  const dateParts = parseDate(show.date)
  const stubW = Math.round(size.w * 0.22)
  const inset = Math.round(size.w * 0.08)
  const cardW = size.w - inset * 2
  const bodyW = cardW - stubW

  return (
    <div style={{
      width: size.w, height: size.h,
      background: theme.appBg,
      backgroundImage: `${paperTextureUrl(0.55, theme.paperHue)}, ${foxingUrl(0.05)}`,
      backgroundBlendMode: 'multiply, multiply',
      color: theme.paperFg,
      position: 'relative', overflow: 'hidden',
      padding: inset,
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      boxSizing: 'border-box',
    }}>
      {/* Top brand line */}
      <div style={{
        fontFamily: FONTS.mono, fontSize: 22, letterSpacing: 4,
        textTransform: 'uppercase', color: theme.paperMuted,
      }}>
        {lang === 'zh' ? '我去过这场' : 'I was there'}
      </div>

      {/* Big ticket */}
      <div style={{
        margin: '0 auto', width: cardW,
        filter: 'drop-shadow(0 10px 8px rgba(0,0,0,0.18)) drop-shadow(0 30px 60px rgba(0,0,0,0.18))',
      }}>
        <PaperSheet theme={theme} intense style={{
          display: 'flex', borderRadius: 18, overflow: 'hidden',
        }}>
          {/* Body */}
          <div style={{ width: bodyW, padding: '52px 56px 52px', position: 'relative' }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              fontFamily: FONTS.mono, fontSize: 22, letterSpacing: 4,
              color: theme.paperMuted, textTransform: 'uppercase',
              borderBottom: `1px dashed ${theme.paperLine}`,
              paddingBottom: 22, marginBottom: 30,
            }}>
              <span>
                {show.type && SHOW_TYPES[show.type] && (
                  <span style={{ marginRight: 16, color: theme.stamp, fontWeight: 700 }}>
                    {SHOW_TYPES[show.type].glyph} {(lang === 'zh' ? SHOW_TYPES[show.type].zh : SHOW_TYPES[show.type].en).toUpperCase()}
                  </span>
                )}
                · {lang === 'zh' ? show.city : show.cityEn}
              </span>
              <span>№ {(show.ticketNo || '').replace('NO. ', '')}</span>
            </div>

            <div style={{
              fontFamily: FONTS.condensed, fontWeight: 700,
              fontSize: 110, lineHeight: 0.95, letterSpacing: 1,
              color: theme.paperFg, textTransform: 'uppercase',
              wordBreak: 'break-word',
            }}>
              {show.artist}
            </div>

            {show.support && show.support.length > 0 && (
              <div style={{
                fontFamily: FONTS.serif, fontStyle: 'italic',
                fontSize: 32, color: theme.paperMuted, marginTop: 18,
              }}>
                with {show.support.join(' · ')}
              </div>
            )}

            <div style={{
              fontFamily: FONTS.serif, fontSize: 38, marginTop: 30,
              color: theme.paperFg, fontWeight: 500,
            }}>
              {lang === 'zh' ? show.venue : show.venueEn}
            </div>

            {(!hideSeat || !hidePrice) && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 22, marginTop: 22,
                fontFamily: FONTS.mono, fontSize: 22, color: theme.paperMuted,
                letterSpacing: 1.5,
              }}>
                {!hideSeat && show.seat && <span>{show.seat}</span>}
                {!hideSeat && !hidePrice && show.seat && show.price ? <span style={{ opacity: 0.5 }}>·</span> : null}
                {!hidePrice && show.price ? <span>{show.currency}{show.price}</span> : null}
              </div>
            )}

            {show.mood && show.mood.length > 0 && (
              <div style={{ display: 'flex', gap: 12, marginTop: 30, flexWrap: 'wrap' }}>
                {(lang === 'zh' ? show.mood : show.moodEn || show.mood).slice(0, 4).map((m, i) => (
                  <span key={i} style={{
                    display: 'inline-flex', alignItems: 'center',
                    height: 50, padding: '0 22px', borderRadius: 999,
                    fontFamily: FONTS.sans, fontSize: 24, fontWeight: 500,
                    background: i === 0 ? theme.stamp : theme.chipBg,
                    color: i === 0 ? '#F2EBD9' : theme.chipFg,
                    border: i === 0 ? 'none' : `1px solid ${theme.paperLine}`,
                  }}>{m}</span>
                ))}
              </div>
            )}

            {/* Stamp */}
            <div style={{ position: 'absolute', right: 36, bottom: 36 }}>
              <Stamp
                text={lang === 'zh' ? '到场' : 'ATTENDED'}
                color={theme.stamp}
                size={170} rotation={-12}
              />
            </div>
          </div>

          {/* Perforation */}
          <div style={{ position: 'relative', width: 2, background: 'transparent' }}>
            <div style={{
              position: 'absolute', inset: '20px 0',
              backgroundImage: `linear-gradient(to bottom, ${theme.paperFg} 50%, transparent 50%)`,
              backgroundSize: '2px 18px', opacity: 0.32, width: 2,
            }}/>
          </div>

          {/* Stub side */}
          <div style={{
            width: stubW, padding: '52px 28px',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ textAlign: 'center', width: '100%' }}>
              <div style={{
                fontFamily: FONTS.condensed, fontSize: 32, fontWeight: 700,
                letterSpacing: 6, color: theme.paperMuted, textTransform: 'uppercase',
              }}>{dateParts.month}</div>
              <div style={{
                fontFamily: FONTS.serif, fontSize: 130, lineHeight: 1,
                fontWeight: 700, color: theme.paperFg, margin: '8px 0',
              }}>{dateParts.day}</div>
              <div style={{
                fontFamily: FONTS.mono, fontSize: 28, color: theme.paperMuted,
                letterSpacing: 3,
              }}>{dateParts.year}</div>
            </div>

            <div style={{ marginTop: 16 }}>
              <Stars value={show.rating || 0} max={5} size={28} color={theme.stamp}/>
            </div>

            <div style={{ width: '100%', marginTop: 30 }}>
              <Barcode value={show.ticketNo || 'NO. 000000'} height={60} color={theme.paperFg}/>
              <div style={{
                fontFamily: FONTS.mono, fontSize: 18, letterSpacing: 2,
                textAlign: 'center', color: theme.paperMuted, marginTop: 8,
              }}>{show.ticketNo}</div>
            </div>
          </div>
        </PaperSheet>
      </div>

      {/* Footer / watermark */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        fontFamily: FONTS.mono, fontSize: 22, letterSpacing: 3,
        color: theme.paperMuted, textTransform: 'uppercase',
      }}>
        <span>{dateParts.full}</span>
        {watermark && <span>{WATERMARK}</span>}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────
// Single — minimal / editorial
// ─────────────────────────────────────────────────────────────────────
export function MinimalShareTemplate({ show, theme, lang, size, options = {}, watermark = true }) {
  const { hidePrice, hideSeat } = options
  const dateParts = parseDate(show.date)
  const inset = Math.round(size.w * 0.1)
  return (
    <div style={{
      width: size.w, height: size.h,
      background: theme.paperBg,
      color: theme.paperFg,
      position: 'relative', overflow: 'hidden',
      padding: inset,
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      boxSizing: 'border-box',
    }}>
      <div>
        <div style={{
          fontFamily: FONTS.mono, fontSize: 22, letterSpacing: 5,
          textTransform: 'uppercase', color: theme.paperMuted,
          paddingBottom: 24, borderBottom: `1px solid ${theme.paperFg}`,
        }}>
          {dateParts.full} · {lang === 'zh' ? show.city : show.cityEn}
        </div>
        <div style={{
          marginTop: 56,
          fontFamily: FONTS.serif,
          fontSize: 130, lineHeight: 1.0, letterSpacing: -2,
          fontStyle: 'italic',
          color: theme.paperFg,
          wordBreak: 'break-word',
        }}>
          {show.artist}
        </div>
        {show.support && show.support.length > 0 && (
          <div style={{
            fontFamily: FONTS.serif, fontStyle: 'italic',
            fontSize: 36, color: theme.paperMuted, marginTop: 22,
          }}>
            with {show.support.join(' · ')}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
        <Stars value={show.rating || 0} max={5} size={56} color={theme.stamp}/>
        <div style={{
          fontFamily: FONTS.serif, fontSize: 44, fontWeight: 500,
          color: theme.paperFg,
        }}>
          {lang === 'zh' ? show.venue : show.venueEn}
        </div>
        {(!hideSeat || !hidePrice) && (
          <div style={{
            fontFamily: FONTS.mono, fontSize: 22, color: theme.paperMuted,
            letterSpacing: 2,
          }}>
            {[
              !hideSeat && show.seat,
              !hidePrice && show.price ? `${show.currency}${show.price}` : null,
            ].filter(Boolean).join('  ·  ')}
          </div>
        )}
      </div>

      {show.notes && (
        <div style={{
          fontFamily: FONTS.serif, fontStyle: 'italic',
          fontSize: 30, lineHeight: 1.4, color: theme.paperFg,
          padding: '32px 0',
          borderTop: `1px solid ${theme.paperLine}`,
          borderBottom: `1px solid ${theme.paperLine}`,
        }}>
          "{show.notes.length > 140 ? show.notes.slice(0, 138) + '…' : show.notes}"
        </div>
      )}

      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        fontFamily: FONTS.mono, fontSize: 22, letterSpacing: 3,
        color: theme.paperMuted, textTransform: 'uppercase',
      }}>
        <span>№ {(show.ticketNo || '').replace('NO. ', '')}</span>
        {watermark && <span>{WATERMARK}</span>}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────
// Multi-show collage (1–4 shows)
// ─────────────────────────────────────────────────────────────────────
export function MultiShareTemplate({ shows, theme, lang, size, title = '', watermark = true }) {
  const inset = Math.round(size.w * 0.07)
  const list = shows.slice(0, 4)
  const cols = list.length >= 3 ? 2 : 1
  const rows = Math.ceil(list.length / cols)

  return (
    <div style={{
      width: size.w, height: size.h,
      background: theme.appBg,
      backgroundImage: `${paperTextureUrl(0.55, theme.paperHue)}, ${foxingUrl(0.05)}`,
      backgroundBlendMode: 'multiply, multiply',
      color: theme.paperFg,
      padding: inset,
      display: 'flex', flexDirection: 'column',
      boxSizing: 'border-box',
    }}>
      <div style={{
        fontFamily: FONTS.mono, fontSize: 22, letterSpacing: 5,
        textTransform: 'uppercase', color: theme.paperMuted,
      }}>
        {lang === 'zh' ? '看过的演出' : 'Shows I was at'}
      </div>
      <div style={{
        fontFamily: FONTS.condensed, fontSize: 96,
        fontWeight: 700, lineHeight: 1, marginTop: 12,
        textTransform: 'uppercase', letterSpacing: 0.5,
        color: theme.paperFg,
      }}>
        {title || (lang === 'zh' ? `${list.length} 张票根` : `${list.length} stubs`)}
      </div>

      <div style={{
        flex: 1, marginTop: 60, marginBottom: 40,
        display: 'grid',
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        gap: 32,
      }}>
        {list.map((s, i) => (
          <CollageStub key={s.id} show={s} theme={theme} lang={lang} skew={i % 2 === 0 ? -1.2 : 1.2}/>
        ))}
      </div>

      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        fontFamily: FONTS.mono, fontSize: 22, letterSpacing: 3,
        color: theme.paperMuted, textTransform: 'uppercase',
      }}>
        <span>{list.length} {lang === 'zh' ? '场' : 'shows'}</span>
        {watermark && <span>{WATERMARK}</span>}
      </div>
    </div>
  )
}

function CollageStub({ show, theme, lang, skew = 0 }) {
  const dateParts = parseDate(show.date)
  return (
    <div style={{
      transform: `rotate(${skew}deg)`,
      filter: 'drop-shadow(0 6px 4px rgba(0,0,0,0.15)) drop-shadow(0 18px 36px rgba(0,0,0,0.15))',
    }}>
      <PaperSheet theme={theme} style={{
        height: '100%', borderRadius: 12, overflow: 'hidden',
        padding: '36px 42px',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      }}>
        <div>
          <div style={{
            fontFamily: FONTS.mono, fontSize: 18, letterSpacing: 3,
            color: theme.paperMuted, textTransform: 'uppercase',
            paddingBottom: 14, borderBottom: `1px dashed ${theme.paperLine}`,
          }}>
            {dateParts.full}
          </div>
          <div style={{
            fontFamily: FONTS.condensed, fontWeight: 700,
            fontSize: 56, lineHeight: 1, marginTop: 22,
            textTransform: 'uppercase', color: theme.paperFg,
            wordBreak: 'break-word',
          }}>
            {show.artist}
          </div>
          <div style={{
            fontFamily: FONTS.serif, fontSize: 24, marginTop: 16,
            color: theme.paperFg,
          }}>
            {lang === 'zh' ? show.venue : show.venueEn}
          </div>
          <div style={{
            fontFamily: FONTS.mono, fontSize: 18, letterSpacing: 2,
            color: theme.paperMuted, marginTop: 6,
          }}>
            {lang === 'zh' ? show.city : show.cityEn}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <Stars value={show.rating || 0} max={5} size={20} color={theme.stamp}/>
          <Stamp text={lang === 'zh' ? '到场' : 'WAS THERE'} color={theme.stamp} size={88} rotation={-10}/>
        </div>
      </PaperSheet>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────
// Annual recap
// ─────────────────────────────────────────────────────────────────────
export function RecapShareTemplate({ year, shows, theme, lang, size, watermark = true }) {
  const inset = Math.round(size.w * 0.08)
  const totalShows = shows.length

  // Top counts
  const tally = (arr) => {
    const m = new Map()
    arr.forEach((v) => v && m.set(v, (m.get(v) || 0) + 1))
    return [...m.entries()].sort((a, b) => b[1] - a[1])
  }
  const topArtist = tally(shows.map((s) => s.artist))[0]
  const topCity = tally(shows.map((s) => s.city))[0]
  const topVenue = tally(shows.map((s) => s.venue))[0]
  const totalSpend = shows.reduce((acc, s) => acc + (s.currency === '¥' ? Number(s.price) || 0 : 0), 0)
  const moodTally = tally(shows.flatMap((s) => s.mood || []))
  const topMoods = moodTally.slice(0, 4).map(([m]) => m)

  return (
    <div style={{
      width: size.w, height: size.h,
      background: theme.appBg,
      backgroundImage: `${paperTextureUrl(0.55, theme.paperHue)}, ${foxingUrl(0.05)}`,
      backgroundBlendMode: 'multiply, multiply',
      color: theme.paperFg,
      padding: inset,
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      boxSizing: 'border-box',
    }}>
      <div>
        <div style={{
          fontFamily: FONTS.mono, fontSize: 22, letterSpacing: 5,
          textTransform: 'uppercase', color: theme.paperMuted,
        }}>
          {lang === 'zh' ? '年度回顾' : 'Year in shows'}
        </div>
        <div style={{
          fontFamily: FONTS.serif, fontSize: 220, lineHeight: 1,
          fontStyle: 'italic', fontWeight: 400, letterSpacing: -4,
          marginTop: 12,
          color: theme.paperFg,
        }}>
          {year}<span style={{ color: theme.stamp, fontStyle: 'normal' }}>.</span>
        </div>
      </div>

      <div style={{
        display: 'flex', alignItems: 'baseline', gap: 28,
        paddingTop: 20, borderTop: `1px solid ${theme.paperLine}`,
      }}>
        <div style={{
          fontFamily: FONTS.condensed, fontWeight: 700,
          fontSize: 280, lineHeight: 0.95, color: theme.stamp,
        }}>{totalShows}</div>
        <div style={{
          fontFamily: FONTS.serif, fontStyle: 'italic',
          fontSize: 48, color: theme.paperFg,
        }}>
          {lang === 'zh' ? '场现场' : 'live shows'}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 36 }}>
        <RecapStat label={lang === 'zh' ? '最常听' : 'most seen'} primary={topArtist?.[0]} sub={topArtist ? `${topArtist[1]} ${lang === 'zh' ? '场' : 'shows'}` : '—'} theme={theme}/>
        <RecapStat label={lang === 'zh' ? '常去场馆' : 'most visited'} primary={topVenue?.[0]} sub={topVenue ? `${topVenue[1]} ${lang === 'zh' ? '次' : 'visits'}` : '—'} theme={theme}/>
        <RecapStat label={lang === 'zh' ? '常去城市' : 'top city'} primary={topCity?.[0]} sub={topCity ? `${topCity[1]} ${lang === 'zh' ? '场' : 'shows'}` : '—'} theme={theme}/>
        <RecapStat label={lang === 'zh' ? '总票钱' : 'total spend'} primary={`¥${totalSpend.toLocaleString()}`} sub={`${totalShows} ${lang === 'zh' ? '张票' : 'tickets'}`} theme={theme}/>
      </div>

      {topMoods.length > 0 && (
        <div style={{
          display: 'flex', gap: 14, flexWrap: 'wrap',
          paddingTop: 30, borderTop: `1px solid ${theme.paperLine}`,
        }}>
          {topMoods.map((m, i) => (
            <span key={i} style={{
              display: 'inline-flex', alignItems: 'center',
              height: 64, padding: '0 28px', borderRadius: 999,
              fontFamily: FONTS.sans, fontSize: 30, fontWeight: 500,
              background: i === 0 ? theme.stamp : theme.chipBg,
              color: i === 0 ? '#F2EBD9' : theme.chipFg,
              border: i === 0 ? 'none' : `1px solid ${theme.paperLine}`,
            }}>#{m}</span>
          ))}
        </div>
      )}

      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        fontFamily: FONTS.mono, fontSize: 22, letterSpacing: 3,
        color: theme.paperMuted, textTransform: 'uppercase',
      }}>
        <span>{lang === 'zh' ? '我的现场年度' : 'my live year'}</span>
        {watermark && <span>{WATERMARK}</span>}
      </div>
    </div>
  )
}

function RecapStat({ label, primary, sub, theme }) {
  return (
    <div>
      <div style={{
        fontFamily: FONTS.mono, fontSize: 20, letterSpacing: 4,
        color: theme.paperMuted, textTransform: 'uppercase',
      }}>{label}</div>
      <div style={{
        fontFamily: FONTS.condensed, fontWeight: 700,
        fontSize: 52, lineHeight: 1.05, marginTop: 12,
        color: theme.paperFg, textTransform: 'uppercase',
        wordBreak: 'break-word',
      }}>{primary || '—'}</div>
      <div style={{
        fontFamily: FONTS.serif, fontStyle: 'italic',
        fontSize: 24, color: theme.paperMuted, marginTop: 6,
      }}>{sub}</div>
    </div>
  )
}
