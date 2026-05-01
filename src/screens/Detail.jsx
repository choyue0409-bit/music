// Detail — single show with cover, stub, journal, setlist, media.

import { FONTS, STRINGS, parseDate, paperTextureUrl } from '../design.js'
import { Cover, Stars, Chip } from '../atoms.jsx'
import { TicketStub } from '../TicketStub.jsx'
import { SectionLabel, MetaCell } from './shared.jsx'
import { SAMPLE_MEDIA, SAMPLE_SETLIST } from '../seed.js'

export function DetailScreen({ theme, lang, variant, show, onBack, onDelete }) {
  const S = STRINGS[lang]
  if (!show) return null
  const dateParts = parseDate(show.date)
  return (
    <div style={{ paddingBottom: 40 }}>
      <div style={{ position: 'relative', height: 220, overflow: 'hidden' }}>
        <Cover kind={show.cover || 'sunset'} text={show.artist} size="100%" rounded={0} style={{ width: '100%', height: '100%' }}/>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.55) 100%)',
        }}/>
        <button onClick={onBack} style={{
          position: 'absolute', top: 56, left: 16, zIndex: 5,
          width: 38, height: 38, borderRadius: '50%',
          background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(20px)',
          border: '0.5px solid rgba(255,255,255,0.2)',
          color: '#F2EBD9', display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
        }}>
          <svg width="14" height="22" viewBox="0 0 14 22" fill="none">
            <path d="M11 2L3 11l8 9" stroke="#F2EBD9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        {onDelete && (
          <button onClick={onDelete} style={{
            position: 'absolute', top: 56, right: 16, zIndex: 5,
            height: 38, padding: '0 14px', borderRadius: 999,
            background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(20px)',
            border: '0.5px solid rgba(255,255,255,0.2)',
            color: '#F2EBD9', cursor: 'pointer',
            fontFamily: FONTS.mono, fontSize: 10, letterSpacing: 1.2, textTransform: 'uppercase',
          }}>
            {lang === 'zh' ? '删除' : 'Delete'}
          </button>
        )}
        <div style={{
          position: 'absolute', bottom: 16, left: 16,
          fontFamily: FONTS.mono, fontSize: 11, letterSpacing: 1.5,
          color: '#F2EBD9', textTransform: 'uppercase',
          textShadow: '0 1px 2px rgba(0,0,0,0.4)',
        }}>{dateParts.month} {dateParts.day}, {dateParts.year}</div>
      </div>

      <div style={{ marginTop: -40, padding: '0 18px', position: 'relative', zIndex: 4 }}>
        <TicketStub show={show} theme={theme} variant={variant} width={366} lang={lang} showStamp={true}/>
      </div>

      <div style={{ padding: '20px 24px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        <MetaCell label={S.seat} value={show.seat || '—'} theme={theme}/>
        <MetaCell label={S.price} value={show.price ? `${show.currency || ''}${show.price}` : '—'} theme={theme}/>
        <MetaCell label={S.company} value={(show.company || []).includes('solo') ? S.soloIndicator : (show.company || []).join(' · ') || '—'} theme={theme}/>
        <MetaCell label={S.rating} value={<Stars value={show.rating || 0} max={5} size={14} color={theme.stamp}/>} theme={theme}/>
      </div>

      {show.mood && show.mood.length > 0 && (
        <div style={{ padding: '18px 24px 0' }}>
          <SectionLabel text={S.mood} theme={theme}/>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
            {(lang === 'zh' ? show.mood : (show.moodEn || show.mood)).map((m, i) => (
              <Chip key={i} theme={theme} accent={i === 0}>{m}</Chip>
            ))}
          </div>
        </div>
      )}

      {show.notes && (
        <div style={{ padding: '20px 24px 0' }}>
          <SectionLabel text={S.note} theme={theme}/>
          <div style={{
            marginTop: 10, padding: '14px 16px',
            background: theme.paperBg,
            backgroundImage: `repeating-linear-gradient(transparent, transparent 22px, ${theme.paperLine} 22px, ${theme.paperLine} 22.5px), ${paperTextureUrl(0.4, theme.paperHue)}`,
            backgroundBlendMode: 'normal, multiply',
            borderRadius: 4,
            fontFamily: FONTS.serif, fontSize: 14, lineHeight: '22px',
            color: theme.paperFg,
            border: `0.5px solid ${theme.paperLine}`,
          }}>
            {show.notes}
          </div>
        </div>
      )}

      {show.setlistCount > 0 && (
        <div style={{ padding: '20px 24px 0' }}>
          <SectionLabel
            text={`${S.setlist} (${show.setlistCount})`}
            theme={theme}
            right={
              <button style={{ background: 'transparent', border: 'none', color: theme.paperMuted, fontFamily: FONTS.mono, fontSize: 10, letterSpacing: 1.2 }}>
                VIEW ALL →
              </button>
            }
          />
          <div style={{ marginTop: 10 }}>
            {SAMPLE_SETLIST.slice(0, 5).map((song, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '8px 0', borderBottom: i < 4 ? `0.5px solid ${theme.paperLine}` : 'none',
              }}>
                <div style={{
                  width: 22, fontFamily: FONTS.mono, fontSize: 10,
                  color: theme.paperMuted, letterSpacing: 1,
                }}>{String(i + 1).padStart(2, '0')}</div>
                <div style={{ flex: 1, fontFamily: FONTS.serif, fontSize: 14, color: theme.paperFg }}>
                  {song.title}
                </div>
                {song.encore && (
                  <Chip theme={theme} style={{ height: 18, fontSize: 9 }}>encore</Chip>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ padding: '20px 24px 0' }}>
        <SectionLabel
          text={lang === 'zh' ? '现场' : 'Memories'}
          theme={theme}
          right={
            <div style={{
              fontFamily: FONTS.mono, fontSize: 10, letterSpacing: 1.2,
              color: theme.paperMuted,
            }}>{SAMPLE_MEDIA.length} {lang === 'zh' ? '条' : 'items'}</div>
          }
        />

        <div style={{
          marginTop: 14, marginBottom: 18,
          height: 220, position: 'relative',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
        }}>
          {SAMPLE_MEDIA.slice(0, 3).reverse().map((m, idx, arr) => {
            const i = arr.length - 1 - idx
            const offsets = [
              { rot: -6, x: -54, y: 8, z: 1 },
              { rot: 4, x: 60, y: 4, z: 2 },
              { rot: -1.5, x: 0, y: 0, z: 3 },
            ]
            const o = offsets[i]
            return (
              <div key={m.id} style={{
                position: 'absolute',
                transform: `translate(${o.x}px, ${o.y}px) rotate(${o.rot}deg)`,
                zIndex: o.z,
                background: '#F2EBD9',
                padding: '8px 8px 28px',
                boxShadow: '0 6px 14px rgba(0,0,0,0.22), 0 0 0 0.5px rgba(0,0,0,0.08)',
              }}>
                <div style={{ position: 'relative', width: 142, height: 142 }}>
                  <Cover kind={m.cover} size={142} rounded={0} style={{ width: 142, height: 142 }}/>
                  {m.kind === 'video' && (
                    <>
                      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.25)' }}/>
                      <div style={{
                        position: 'absolute', top: '50%', left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 38, height: 38, borderRadius: '50%',
                        background: 'rgba(255,255,255,0.92)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                      }}>
                        <svg width="14" height="14" viewBox="0 0 16 16">
                          <path d="M5 3l9 5-9 5V3z" fill="#1A1814"/>
                        </svg>
                      </div>
                      <div style={{
                        position: 'absolute', right: 4, bottom: 4,
                        background: 'rgba(0,0,0,0.65)', color: '#fff',
                        padding: '1px 5px', borderRadius: 2,
                        fontFamily: FONTS.mono, fontSize: 9, letterSpacing: 0.3,
                      }}>{m.duration}</div>
                    </>
                  )}
                </div>
                <div style={{
                  fontFamily: "'Caveat', 'DM Serif Display', cursive",
                  fontStyle: 'italic',
                  fontSize: 12, textAlign: 'center', marginTop: 4,
                  color: '#3A342A',
                }}>{lang === 'zh' ? m.caption : m.captionEn}</div>
              </div>
            )
          })}
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4,
          marginTop: 4,
        }}>
          {SAMPLE_MEDIA.map((m) => (
            <div key={m.id} style={{ position: 'relative', aspectRatio: '1 / 1' }}>
              <Cover kind={m.cover} size="100%" rounded={2} style={{ width: '100%', height: '100%' }}/>
              {m.kind === 'video' && (
                <>
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.18)', borderRadius: 2 }}/>
                  <div style={{
                    position: 'absolute', top: 4, right: 4,
                    width: 18, height: 18, borderRadius: '50%',
                    background: 'rgba(0,0,0,0.55)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="8" height="8" viewBox="0 0 16 16"><path d="M5 3l9 5-9 5V3z" fill="#fff"/></svg>
                  </div>
                  <div style={{
                    position: 'absolute', left: 4, bottom: 4,
                    fontFamily: FONTS.mono, fontSize: 8.5, letterSpacing: 0.3,
                    color: '#fff', textShadow: '0 1px 1px rgba(0,0,0,0.6)',
                  }}>{m.duration}</div>
                </>
              )}
            </div>
          ))}
          <button style={{
            aspectRatio: '1 / 1', borderRadius: 2,
            border: `1px dashed ${theme.paperFg}`,
            background: 'transparent', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            gap: 4, color: theme.paperMuted, padding: 0,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
            <div style={{ fontFamily: FONTS.mono, fontSize: 8, letterSpacing: 1, textTransform: 'uppercase' }}>
              {lang === 'zh' ? '加照片' : 'Add'}
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
