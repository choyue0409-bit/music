// screens.jsx — All five core screens. Each is a function returning the inner
// content of an iPhone frame (status bar already provided by IOSDevice).

// ── Bottom tab bar ──────────────────────────────────────────────────────────
function TabBar({ active, onTab, theme, lang }) {
  const S = STRINGS[lang];
  const tabs = [
    { id: 'home', label: S.tabHome, icon: 'ticket' },
    { id: 'search', label: S.tabSearch, icon: 'compass' },
    { id: 'add', label: '', icon: 'plus' },
    { id: 'me', label: S.tabMe, icon: 'me' },
  ];
  const fg = theme.paperFg;
  const muted = theme.paperMuted;
  const tabIcon = (id, color) => {
    if (id === 'ticket') return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M3 8a2 2 0 012-2h14a2 2 0 012 2v2a2 2 0 100 4v2a2 2 0 01-2 2H5a2 2 0 01-2-2v-2a2 2 0 100-4V8z" stroke={color} strokeWidth="1.6"/>
        <path d="M9 7v10" stroke={color} strokeWidth="1.6" strokeDasharray="1.5 2"/>
      </svg>
    );
    if (id === 'compass') return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.6"/>
        <path d="M15 9l-1.5 4.5L9 15l1.5-4.5L15 9z" fill={color} stroke={color} strokeWidth="1.6" strokeLinejoin="round"/>
      </svg>
    );
    if (id === 'me') return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="9" r="3.5" stroke={color} strokeWidth="1.6"/>
        <path d="M5 19c1.5-3.5 4-5 7-5s5.5 1.5 7 5" stroke={color} strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    );
    return null;
  };
  return (
    <div
      style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: 78, paddingBottom: 28, zIndex: 30,
        background: theme.paperBg,
        backgroundImage: `${paperTextureUrl(0.5, theme.paperHue)}`,
        backgroundBlendMode: 'multiply',
        borderTop: `0.5px solid ${theme.paperLine}`,
        display: 'flex', alignItems: 'center', justifyContent: 'space-around',
      }}
    >
      {tabs.map((t) => {
        const isActive = active === t.id;
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
          );
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
        );
      })}
    </div>
  );
}

// ── Header ───────────────────────────────────────────────────────────────────
function ScreenHeader({ title, subtitle, theme, lang, right, scriptLine }) {
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
          <div
            style={{
              fontFamily: FONTS.condensed, fontSize: 44,
              fontWeight: 700, lineHeight: 0.95, letterSpacing: -0.5,
              color: theme.paperFg, textTransform: 'uppercase',
            }}
          >{title}</div>
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
  );
}

// ════════════════════════════════════════════════════════════════════════════
// HOME — timeline of stubs
// ════════════════════════════════════════════════════════════════════════════
function HomeScreen({ theme, lang, variant, onOpen }) {
  const S = STRINGS[lang];
  // Group by month/year
  const byMonth = {};
  SHOWS.forEach((s) => {
    const [y, m] = s.date.split('-');
    const key = `${y}-${m}`;
    if (!byMonth[key]) byMonth[key] = [];
    byMonth[key].push(s);
  });
  const keys = Object.keys(byMonth).sort().reverse();
  const months = ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];
  const monthsEn = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

  return (
    <div style={{ paddingBottom: 100 }}>
      <ScreenHeader
        theme={theme} lang={lang}
        scriptLine={lang === 'zh' ? '看过的演出' : 'shows you\'ve been to'}
        title={S.homeHeader}
        subtitle={`${STATS.totalShows} ${lang === 'zh' ? '场 · ' : 'shows · '}${STATS.cities} ${lang === 'zh' ? '座城市' : 'cities'}`}
      />

      {/* Type filter pills */}
      <div style={{
        display: 'flex', gap: 6, padding: '0 20px 6px', overflowX: 'auto',
      }}>
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

      {/* Year filter pills */}
      <div style={{
        display: 'flex', gap: 6, padding: '0 20px 10px', overflowX: 'auto',
      }}>
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

      {/* Stubs grouped by month */}
      {keys.map((k) => {
        const [y, m] = k.split('-');
        const monthLabel = lang === 'zh' ? months[parseInt(m, 10) - 1] : monthsEn[parseInt(m, 10) - 1];
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
                    show={s}
                    theme={theme}
                    variant={variant}
                    width={348}
                    lang={lang}
                    onClick={() => onOpen(s.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// DETAIL — single show, with photo strip + setlist + journal
// ════════════════════════════════════════════════════════════════════════════
function DetailScreen({ theme, lang, variant, showId, onBack }) {
  const S = STRINGS[lang];
  const show = SHOWS.find((s) => s.id === showId) || SHOWS[0];
  const dateParts = parseDate(show.date);
  return (
    <div style={{ paddingBottom: 40 }}>
      {/* big cover banner */}
      <div style={{ position: 'relative', height: 220, overflow: 'hidden' }}>
        <Cover kind={show.cover} text={show.artist} size="100%" rounded={0} style={{ width: '100%', height: '100%' }}/>
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
        {/* date badge */}
        <div style={{
          position: 'absolute', bottom: 16, left: 16,
          fontFamily: FONTS.mono, fontSize: 11, letterSpacing: 1.5,
          color: '#F2EBD9', textTransform: 'uppercase',
          textShadow: '0 1px 2px rgba(0,0,0,0.4)',
        }}>{dateParts.month} {dateParts.day}, {dateParts.year}</div>
      </div>

      {/* the actual ticket stub, lifted up */}
      <div style={{ marginTop: -40, padding: '0 18px', position: 'relative', zIndex: 4 }}>
        <TicketStub show={show} theme={theme} variant={variant} width={366} lang={lang} showStamp={true}/>
      </div>

      {/* meta grid */}
      <div style={{ padding: '20px 24px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        <MetaCell label={S.seat} value={show.seat} theme={theme}/>
        <MetaCell label={S.price} value={`${show.currency}${show.price}`} theme={theme}/>
        <MetaCell label={S.company} value={show.company.includes('solo') ? S.soloIndicator : show.company.join(' · ')} theme={theme}/>
        <MetaCell label={S.rating} value={<Stars value={show.rating} max={5} size={14} color={theme.stamp}/>} theme={theme}/>
      </div>

      {/* mood tags */}
      {show.mood.length > 0 && (
        <div style={{ padding: '18px 24px 0' }}>
          <SectionLabel text={S.mood} theme={theme}/>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
            {(lang === 'zh' ? show.mood : show.moodEn).map((m, i) => (
              <Chip key={i} theme={theme} accent={i === 0}>{m}</Chip>
            ))}
          </div>
        </div>
      )}

      {/* journal */}
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

      {/* setlist */}
      {show.setlistCount > 0 && (
        <div style={{ padding: '20px 24px 0' }}>
          <SectionLabel text={`${S.setlist} (${show.setlistCount})`} theme={theme} right={<button style={{ background: 'transparent', border: 'none', color: theme.paperMuted, fontFamily: FONTS.mono, fontSize: 10, letterSpacing: 1.2 }}>VIEW ALL →</button>}/>
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

      {/* media — photos + videos */}
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

        {/* hero polaroid stack — first photo dominant */}
        <div style={{
          marginTop: 14, marginBottom: 18,
          height: 220, position: 'relative',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
        }}>
          {SAMPLE_MEDIA.slice(0, 3).reverse().map((m, idx, arr) => {
            const i = arr.length - 1 - idx;
            const offsets = [
              { rot: -6, x: -54, y: 8, z: 1 },
              { rot: 4, x: 60, y: 4, z: 2 },
              { rot: -1.5, x: 0, y: 0, z: 3 },
            ];
            const o = offsets[i];
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
                      {/* dim overlay */}
                      <div style={{
                        position: 'absolute', inset: 0,
                        background: 'rgba(0,0,0,0.25)',
                      }}/>
                      {/* play glyph */}
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
                      {/* duration chip */}
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
            );
          })}
        </div>

        {/* thumbnail strip — full media grid */}
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
          {/* upload tile */}
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
  );
}

// Sample media — mix of photos + videos for the detail screen
const SAMPLE_MEDIA = [
  { id: 'm1', kind: 'photo', cover: 'sunset', caption: '开场前', captionEn: 'before doors' },
  { id: 'm2', kind: 'video', cover: 'magenta', duration: '0:42', caption: 'A Pearl', captionEn: 'A Pearl' },
  { id: 'm3', kind: 'photo', cover: 'rose', caption: '安可', captionEn: 'encore' },
  { id: 'm4', kind: 'video', cover: 'amber', duration: '1:08', caption: '跟唱', captionEn: 'singalong' },
  { id: 'm5', kind: 'photo', cover: 'cool', caption: '票根', captionEn: 'my stub' },
  { id: 'm6', kind: 'photo', cover: 'electric', caption: '灯光', captionEn: 'lights' },
  { id: 'm7', kind: 'video', cover: 'kid-a', duration: '0:18', caption: '散场', captionEn: 'walking out' },
];

const SAMPLE_SETLIST = [
  { title: 'Bug Like an Angel' },
  { title: 'Working for the Knife' },
  { title: 'A Pearl' },
  { title: 'I Bet on Losing Dogs' },
  { title: 'Nobody' },
  { title: 'Washing Machine Heart' },
  { title: 'My Love Mine All Mine', encore: true },
];

function MetaCell({ label, value, theme }) {
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
  );
}

function SectionLabel({ text, theme, right }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{
        fontFamily: FONTS.mono, fontSize: 10, letterSpacing: 2,
        color: theme.paperMuted, textTransform: 'uppercase',
      }}>{text}</div>
      {right}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// ADD — new stub form
// ════════════════════════════════════════════════════════════════════════════
function AddScreen({ theme, lang, onClose }) {
  const S = STRINGS[lang];
  const [artist, setArtist] = React.useState('');
  const [venue, setVenue] = React.useState('');
  const [date, setDate] = React.useState('2026-04-30');
  const [rating, setRating] = React.useState(0);
  const [moodSel, setMoodSel] = React.useState([]);
  const moods = lang === 'zh'
    ? ['哭了', '前排', '一辈子一次', '汗流浃背', '跨年', '出差', '朝圣', '蹦', '冷', '挤']
    : ['cried', 'front row', 'once in a lifetime', 'soaked', 'NYE', 'work trip', 'pilgrimage', 'danced', 'cold', 'crowded'];

  return (
    <div style={{ paddingBottom: 100 }}>
      {/* header w/ cancel/save */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '60px 20px 14px',
      }}>
        <button onClick={onClose} style={{
          background: 'transparent', border: 'none',
          fontFamily: FONTS.sans, fontSize: 14, color: theme.paperMuted, cursor: 'pointer',
        }}>{S.cancel}</button>
        <div style={{
          fontFamily: FONTS.condensed, fontSize: 18, fontWeight: 700,
          letterSpacing: 1, textTransform: 'uppercase', color: theme.paperFg,
        }}>{S.addTitle}</div>
        <button style={{
          background: theme.stamp, border: 'none',
          padding: '7px 14px', borderRadius: 999,
          fontFamily: FONTS.mono, fontSize: 10, letterSpacing: 1.2,
          textTransform: 'uppercase', color: '#F2EBD9', cursor: 'pointer',
        }}>{S.save}</button>
      </div>

      {/* live preview */}
      <div style={{ padding: '6px 20px 20px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ transform: 'scale(0.85)', transformOrigin: 'top center' }}>
          <TicketStub
            show={{
              ...SHOWS[0],
              artist: artist || (lang === 'zh' ? '艺人 / 乐队' : 'Artist'),
              venue: venue || (lang === 'zh' ? '场馆' : 'Venue'),
              venueEn: venue || 'Venue',
              date,
              rating: rating,
              mood: moodSel,
              moodEn: moodSel,
              ticketNo: 'NO. 002419',
              support: [],
            }}
            theme={theme}
            variant="classic"
            width={336}
            lang={lang}
            showStamp={false}
          />
        </div>
      </div>

      {/* form fields */}
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <FormField label={lang === 'zh' ? '类型' : 'Type'} theme={theme}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
            {Object.entries(SHOW_TYPES).map(([k, v], i) => {
              const on = i === 0;
              return (
                <div key={k} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  height: 30, padding: '0 11px', borderRadius: 999,
                  border: `0.5px solid ${theme.paperLine}`,
                  background: on ? theme.paperFg : 'transparent',
                  color: on ? theme.paperBg : theme.paperFg,
                  fontFamily: FONTS.sans, fontSize: 12, fontWeight: 500,
                }}>
                  <span style={{ fontSize: 13 }}>{v.glyph}</span>
                  <span>{lang === 'zh' ? v.zh : v.en}</span>
                </div>
              );
            })}
          </div>
        </FormField>
        <FormField label={S.artist} theme={theme}>
          <input
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            placeholder={lang === 'zh' ? '比如 Mitski' : 'e.g. Mitski'}
            style={inputStyle(theme)}
          />
        </FormField>
        <div style={{ display: 'flex', gap: 10 }}>
          <FormField label={S.venue} theme={theme} style={{ flex: 1 }}>
            <input
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              placeholder={lang === 'zh' ? '场馆名' : 'Venue'}
              style={inputStyle(theme)}
            />
          </FormField>
          <FormField label={S.date} theme={theme} style={{ width: 120 }}>
            <input
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{ ...inputStyle(theme), fontFamily: FONTS.mono, fontSize: 13 }}
            />
          </FormField>
        </div>
        <FormField label={S.rating} theme={theme}>
          <div style={{ display: 'flex', gap: 6, padding: '4px 0' }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} onClick={() => setRating(n)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
                <Stars value={rating >= n ? 1 : 0} max={1} size={28} color={theme.stamp}/>
              </button>
            ))}
          </div>
        </FormField>
        <FormField label={S.mood} theme={theme}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
            {moods.map((m) => {
              const on = moodSel.includes(m);
              return (
                <button
                  key={m}
                  onClick={() => setMoodSel(on ? moodSel.filter((x) => x !== m) : [...moodSel, m])}
                  style={{
                    height: 28, padding: '0 12px', borderRadius: 999, cursor: 'pointer',
                    border: `0.5px solid ${theme.paperLine}`,
                    background: on ? theme.paperFg : 'transparent',
                    color: on ? theme.paperBg : theme.paperFg,
                    fontFamily: FONTS.sans, fontSize: 12, fontWeight: 500,
                  }}
                >{m}</button>
              );
            })}
          </div>
        </FormField>
        <FormField label={S.scan} theme={theme}>
          <div style={{
            height: 76, borderRadius: 6,
            border: `1px dashed ${theme.paperFg}`,
            background: theme.paperBg,
            backgroundImage: paperTextureUrl(0.4, theme.paperHue),
            backgroundBlendMode: 'multiply',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            color: theme.paperMuted,
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="6" width="18" height="12" rx="1" stroke="currentColor" strokeWidth="1.4"/>
              <path d="M7 6v12M11 6v12M15 6v12M19 6v12" stroke="currentColor" strokeWidth="1" strokeDasharray="2 1.5"/>
            </svg>
            <div style={{ fontFamily: FONTS.mono, fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase' }}>
              {lang === 'zh' ? '拍一张票根' : 'Snap a ticket stub'}
            </div>
          </div>
        </FormField>

        {/* Media upload — photos + videos */}
        <FormField
          label={lang === 'zh' ? '现场照片 / 视频' : 'Photos / Videos'}
          theme={theme}
        >
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6,
            marginTop: 4,
          }}>
            {/* upload tile (camera) */}
            <button style={{
              aspectRatio: '1 / 1', borderRadius: 4,
              border: `1px dashed ${theme.paperFg}`,
              background: 'transparent', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 4, color: theme.paperMuted, padding: 0,
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M4 9a2 2 0 012-2h2l1.5-2h5L16 7h2a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2V9z" stroke="currentColor" strokeWidth="1.4"/>
                <circle cx="12" cy="13" r="3.4" stroke="currentColor" strokeWidth="1.4"/>
              </svg>
              <div style={{ fontFamily: FONTS.mono, fontSize: 8.5, letterSpacing: 1 }}>
                {lang === 'zh' ? '拍摄' : 'CAMERA'}
              </div>
            </button>
            {/* upload tile (library) */}
            <button style={{
              aspectRatio: '1 / 1', borderRadius: 4,
              border: `1px dashed ${theme.paperFg}`,
              background: 'transparent', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 4, color: theme.paperMuted, padding: 0,
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <rect x="4" y="4" width="13" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.4"/>
                <rect x="7" y="7" width="13" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.4" fill={theme.paperBg}/>
                <path d="M10 16l3-3 2 2 2-2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div style={{ fontFamily: FONTS.mono, fontSize: 8.5, letterSpacing: 1 }}>
                {lang === 'zh' ? '相册' : 'LIBRARY'}
              </div>
            </button>
            {/* mock-uploaded thumbs */}
            {[
              { kind: 'photo', cover: 'sunset' },
              { kind: 'video', cover: 'magenta', duration: '0:42' },
            ].map((m, i) => (
              <div key={i} style={{ position: 'relative', aspectRatio: '1 / 1' }}>
                <Cover kind={m.cover} size="100%" rounded={4} style={{ width: '100%', height: '100%' }}/>
                {m.kind === 'video' && (
                  <>
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.18)', borderRadius: 4 }}/>
                    <div style={{
                      position: 'absolute', top: '50%', left: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: 22, height: 22, borderRadius: '50%',
                      background: 'rgba(255,255,255,0.92)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <svg width="8" height="8" viewBox="0 0 16 16"><path d="M5 3l9 5-9 5V3z" fill="#1A1814"/></svg>
                    </div>
                    <div style={{
                      position: 'absolute', left: 4, bottom: 4,
                      fontFamily: FONTS.mono, fontSize: 8, color: '#fff',
                      textShadow: '0 1px 1px rgba(0,0,0,0.6)',
                    }}>{m.duration}</div>
                  </>
                )}
                {/* small × delete */}
                <div style={{
                  position: 'absolute', top: -4, right: -4,
                  width: 16, height: 16, borderRadius: '50%',
                  background: theme.stamp, color: '#F2EBD9',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontFamily: FONTS.sans,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
                }}>×</div>
              </div>
            ))}
          </div>
          <div style={{
            marginTop: 8, fontFamily: FONTS.serif, fontStyle: 'italic',
            fontSize: 11, color: theme.paperMuted,
          }}>
            {lang === 'zh'
              ? '糊掉的、抖的、暗的——都留着。'
              : 'Keep the blurry ones. Keep the dark ones.'}
          </div>
        </FormField>
      </div>
    </div>
  );
}

function FormField({ label, children, theme, style = {} }) {
  return (
    <div style={style}>
      <div style={{
        fontFamily: FONTS.mono, fontSize: 9.5, letterSpacing: 1.5,
        color: theme.paperMuted, textTransform: 'uppercase', marginBottom: 6,
      }}>{label}</div>
      {children}
    </div>
  );
}
function inputStyle(theme) {
  return {
    width: '100%', height: 38, padding: '0 12px',
    background: theme.paperBg,
    backgroundImage: paperTextureUrl(0.4, theme.paperHue),
    backgroundBlendMode: 'multiply',
    border: `0.5px solid ${theme.paperLine}`,
    borderRadius: 4, outline: 'none',
    fontFamily: FONTS.serif, fontSize: 15, color: theme.paperFg,
    boxSizing: 'border-box',
  };
}

// ════════════════════════════════════════════════════════════════════════════
// ME — profile & stats with map
// ════════════════════════════════════════════════════════════════════════════
function MeScreen({ theme, lang }) {
  const S = STRINGS[lang];
  return (
    <div style={{ paddingBottom: 100 }}>
      <ScreenHeader
        theme={theme} lang={lang}
        scriptLine={lang === 'zh' ? '我的现场履历' : 'live history of'}
        title={lang === 'zh' ? 'KAI · 1992' : 'KAI · 1992'}
        subtitle={`${STATS.totalShows} ${lang === 'zh' ? '场 · ' : 'shows · '}${STATS.cities} ${lang === 'zh' ? '座城市' : 'cities'} · ${STATS.hours}h`}
      />

      {/* big stat grid */}
      <div style={{ padding: '0 20px 18px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <BigStat n={STATS.thisYear} label={S.statsThisYear} theme={theme} accent/>
        <BigStat n={STATS.cities} label={S.statsCities} theme={theme}/>
        <BigStat n={STATS.venues} label={S.statsVenues} theme={theme}/>
        <BigStat n={`${STATS.hours}h`} label={S.statsHours} theme={theme}/>
      </div>

      {/* year bars */}
      <div style={{ padding: '4px 20px 20px' }}>
        <SectionLabel text={lang === 'zh' ? '年度' : 'by year'} theme={theme}/>
        <div style={{
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
          height: 96, marginTop: 14, gap: 6,
        }}>
          {YEAR_BARS.map((b) => {
            const max = Math.max(...YEAR_BARS.map((x) => x.count));
            const h = b.count === 0 ? 2 : (b.count / max) * 80;
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
            );
          })}
        </div>
      </div>

      {/* MAP */}
      <div style={{ padding: '0 20px 20px' }}>
        <SectionLabel text={S.map} theme={theme} right={
          <div style={{ fontFamily: FONTS.mono, fontSize: 10, letterSpacing: 1, color: theme.paperMuted }}>
            {STATS.cities} {lang === 'zh' ? '城' : 'cities'}
          </div>
        }/>
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

      {/* top artists */}
      <div style={{ padding: '0 20px 20px' }}>
        <SectionLabel text={lang === 'zh' ? '最爱' : 'favorites'} theme={theme}/>
        <div style={{ marginTop: 10 }}>
          <RankRow rank={1} title={STATS.topArtist} sub={`${STATS.topArtistCount} ${lang === 'zh' ? '场' : 'shows'}`} theme={theme} kind="rose"/>
          <RankRow rank={2} title={STATS.topVenue} sub={`${STATS.topVenueCount} ${lang === 'zh' ? '次' : 'visits'}`} theme={theme} kind="amber"/>
          <RankRow rank={3} title={STATS.topCity} sub={`${STATS.topCityCount} ${lang === 'zh' ? '场' : 'shows'}`} theme={theme} kind="cool"/>
        </div>
      </div>

      {/* spend */}
      <div style={{ padding: '0 20px 30px' }}>
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
              ¥{STATS.totalSpend.toLocaleString()}
            </div>
          </div>
          <div style={{ position: 'relative', fontFamily: FONTS.serif, fontStyle: 'italic', fontSize: 12, opacity: 0.7, textAlign: 'right' }}>
            {lang === 'zh' ? '一辈子' : 'all-time'}<br/>{lang === 'zh' ? '里 ' + STATS.totalShows + ' 张票' : STATS.totalShows + ' tickets'}
          </div>
        </div>
      </div>
    </div>
  );
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
  );
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
  );
}

// World map — outline + dots (no real geography, just suggestive blobs)
function WorldMapDots({ theme }) {
  // Map lng (-180..180) → x (5..95%), lat (-60..75) → y (90..10%)
  const project = (lat, lng) => {
    const x = ((lng + 180) / 360) * 100;
    const y = ((75 - lat) / 135) * 100;
    return { x, y };
  };
  return (
    <>
      {/* simplified continents — abstract organic blobs */}
      <svg width="100%" height="100%" viewBox="0 0 400 200" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0 }}>
        <g fill="none" stroke={theme.paperFg} strokeWidth="0.6" opacity="0.45" strokeLinejoin="round">
          {/* N.America */}
          <path d="M30 50 Q 45 35 70 38 Q 95 42 100 70 Q 90 95 65 100 Q 40 95 32 80 Z"/>
          {/* S.America */}
          <path d="M85 110 Q 95 105 100 130 Q 95 160 85 170 Q 75 160 78 130 Z"/>
          {/* Europe */}
          <path d="M180 50 Q 200 42 215 50 Q 220 70 205 78 Q 185 75 178 65 Z"/>
          {/* Africa */}
          <path d="M195 90 Q 220 88 230 110 Q 225 145 210 160 Q 195 150 192 125 Z"/>
          {/* Asia */}
          <path d="M225 50 Q 280 38 330 55 Q 345 75 320 95 Q 280 100 240 88 Z"/>
          {/* Australia */}
          <path d="M310 130 Q 340 125 350 140 Q 345 155 320 153 Q 305 145 308 138 Z"/>
        </g>
        {/* graticule */}
        <g stroke={theme.paperLine} strokeWidth="0.3" fill="none">
          <line x1="0" y1="100" x2="400" y2="100"/>
          <line x1="200" y1="0" x2="200" y2="200"/>
        </g>
      </svg>
      {/* dots */}
      {MAP_CITIES.map((c) => {
        const p = project(c.lat, c.lng);
        const r = Math.min(14, 4 + c.count * 0.6);
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
        );
      })}
      {/* corner label */}
      <div style={{
        position: 'absolute', top: 8, left: 10,
        fontFamily: FONTS.mono, fontSize: 8.5, letterSpacing: 1.5,
        color: theme.paperMuted, textTransform: 'uppercase',
      }}>WORLD · 47 SHOWS</div>
    </>
  );
}

// ════════════════════════════════════════════════════════════════════════════
// SEARCH / DISCOVER
// ════════════════════════════════════════════════════════════════════════════
function SearchScreen({ theme, lang }) {
  const S = STRINGS[lang];
  return (
    <div style={{ paddingBottom: 100 }}>
      <ScreenHeader
        theme={theme} lang={lang}
        scriptLine={lang === 'zh' ? '搜你的回忆' : 'search your memory'}
        title={S.searchTitle}
      />
      {/* search input */}
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
          <div style={{ flex: 1, fontFamily: FONTS.serif, fontSize: 14, color: theme.paperMuted, fontStyle: 'italic' }}>
            {S.searchPh}
          </div>
        </div>
      </div>

      {/* recent searches */}
      <div style={{ padding: '0 20px 16px' }}>
        <SectionLabel text={S.recent} theme={theme}/>
        <div style={{ marginTop: 10 }}>
          {SEARCH_HISTORY.slice(0, 4).map((q, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '10px 0', borderBottom: i < 3 ? `0.5px solid ${theme.paperLine}` : 'none',
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke={theme.paperMuted} strokeWidth="1.4"/>
                <path d="M12 7v5l3 2" stroke={theme.paperMuted} strokeWidth="1.4" strokeLinecap="round"/>
              </svg>
              <div style={{ flex: 1, fontFamily: FONTS.serif, fontSize: 15, color: theme.paperFg }}>{q}</div>
              <div style={{ fontFamily: FONTS.mono, fontSize: 10, letterSpacing: 1, color: theme.paperMuted }}>↗</div>
            </div>
          ))}
        </div>
      </div>

      {/* mood tag cloud */}
      <div style={{ padding: '0 20px 20px' }}>
        <SectionLabel text={S.tags} theme={theme}/>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
          {SEARCH_TAGS.map((t, i) => (
            <Chip key={i} theme={theme} accent={i === 0}>#{t}</Chip>
          ))}
        </div>
      </div>

      {/* upcoming / discover */}
      <div style={{ padding: '0 20px 30px' }}>
        <SectionLabel text={S.upcoming} theme={theme} right={
          <button style={{ background: 'transparent', border: 'none', fontFamily: FONTS.mono, fontSize: 10, letterSpacing: 1.2, color: theme.paperMuted }}>{lang === 'zh' ? '全部 →' : 'ALL →'}</button>
        }/>
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {DISCOVER.map((d) => (
            <div key={d.id} style={{
              display: 'flex', gap: 12, padding: '12px',
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
    </div>
  );
}

Object.assign(window, {
  TabBar, ScreenHeader,
  HomeScreen, DetailScreen, AddScreen, MeScreen, SearchScreen,
});
