// stub.jsx — The ticket stub card. The signature visual of the app.
// Two zones separated by a perforation: main body (artist + meta) and stub (date + ticket no.)
// Variants: classic (paper), bold (high-contrast), minimal (clean line)

function TicketStub({
  show,
  theme,
  variant = 'classic',
  width = 348,
  lang = 'zh',
  onClick,
  showStamp = true,
}) {
  const S = STRINGS[lang];
  if (variant === 'bold') return <BoldStub show={show} theme={theme} width={width} lang={lang} onClick={onClick} showStamp={showStamp} />;
  if (variant === 'minimal') return <MinimalStub show={show} theme={theme} width={width} lang={lang} onClick={onClick} />;
  return <ClassicStub show={show} theme={theme} width={width} lang={lang} onClick={onClick} showStamp={showStamp} />;
}

// ── Classic — vintage paper ticket with stub on right ──────────────────────
function ClassicStub({ show, theme, width = 348, lang = 'zh', onClick, showStamp }) {
  const S = STRINGS[lang];
  const stubW = 88;
  const bodyW = width - stubW;
  const dateParts = parseDate(show.date);

  return (
    <div
      onClick={onClick}
      style={{
        position: 'relative', width, cursor: onClick ? 'pointer' : 'default',
        filter: 'drop-shadow(0 2px 1px rgba(0,0,0,0.08)) drop-shadow(0 8px 18px rgba(0,0,0,0.12))',
      }}
    >
      <PaperSheet
        theme={theme}
        style={{
          display: 'flex',
          borderRadius: 6,
          overflow: 'hidden',
          // micro torn-edge feel via clip-path
        }}
      >
        {/* MAIN BODY */}
        <div style={{ flex: 1, padding: '14px 16px 14px 16px', position: 'relative', minWidth: 0 }}>
          {/* top row: city · venue */}
          <div
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              fontFamily: FONTS.mono, fontSize: 9.5, letterSpacing: 1.5,
              color: theme.paperMuted, textTransform: 'uppercase',
              borderBottom: `0.5px dashed ${theme.paperLine}`,
              paddingBottom: 8, marginBottom: 10,
            }}
          >
            <span>
              {show.type && SHOW_TYPES[show.type] && (
                <span style={{ marginRight: 6, color: theme.stamp, fontWeight: 700 }}>
                  {SHOW_TYPES[show.type].glyph} {(lang === 'zh' ? SHOW_TYPES[show.type].zh : SHOW_TYPES[show.type].en).toUpperCase()}
                </span>
              )}
              · {lang === 'zh' ? show.city : show.cityEn}
            </span>
            <span>№ {show.ticketNo.replace('NO. ', '')}</span>
          </div>

          {/* artist name — big condensed */}
          <div
            style={{
              fontFamily: FONTS.condensed,
              fontSize: 30, lineHeight: 1, fontWeight: 700,
              color: theme.paperFg,
              letterSpacing: 0.2,
              textTransform: 'uppercase',
              marginTop: 2,
              wordBreak: 'break-word',
            }}
          >
            {show.artist}
          </div>

          {/* support */}
          {show.support && show.support.length > 0 && (
            <div
              style={{
                fontFamily: FONTS.serif, fontStyle: 'italic',
                fontSize: 12, color: theme.paperMuted, marginTop: 4,
              }}
            >
              with {show.support.join(' · ')}
            </div>
          )}

          {/* venue */}
          <div
            style={{
              fontFamily: FONTS.serif, fontSize: 14, marginTop: 8,
              color: theme.paperFg, fontWeight: 500,
            }}
          >
            {lang === 'zh' ? show.venue : show.venueEn}
          </div>

          {/* meta row */}
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: 10, marginTop: 10,
              fontFamily: FONTS.mono, fontSize: 9.5, color: theme.paperMuted,
              letterSpacing: 0.8,
            }}
          >
            <span>{show.seat}</span>
            <span style={{ opacity: 0.5 }}>·</span>
            <span>{show.currency}{show.price}</span>
          </div>

          {/* mood chips */}
          {show.mood && show.mood.length > 0 && (
            <div style={{ display: 'flex', gap: 5, marginTop: 12, flexWrap: 'wrap' }}>
              {(lang === 'zh' ? show.mood : show.moodEn).slice(0, 3).map((m, i) => (
                <Chip key={i} theme={theme}>{m}</Chip>
              ))}
            </div>
          )}

          {/* attended stamp */}
          {showStamp && (
            <div style={{ position: 'absolute', right: 4, bottom: 6 }}>
              <Stamp
                text={lang === 'zh' ? '到场' : 'ATTENDED'}
                color={theme.stamp}
                size={56}
                rotation={-14}
              />
            </div>
          )}
        </div>

        {/* PERFORATION */}
        <div style={{ position: 'relative', width: 1, background: 'transparent' }}>
          <div
            style={{
              position: 'absolute', inset: '6px 0',
              backgroundImage: `linear-gradient(to bottom, ${theme.paperFg} 50%, transparent 50%)`,
              backgroundSize: '1px 6px',
              opacity: 0.32,
              width: 1,
            }}
          />
          {/* notches at top and bottom of perforation */}
          <div
            style={{
              position: 'absolute', top: -6, left: -6, width: 12, height: 12,
              borderRadius: '50%', background: theme.appBg,
            }}
          />
          <div
            style={{
              position: 'absolute', bottom: -6, left: -6, width: 12, height: 12,
              borderRadius: '50%', background: theme.appBg,
            }}
          />
        </div>

        {/* STUB */}
        <div
          style={{
            width: stubW, padding: '14px 12px',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'space-between',
            position: 'relative',
          }}
        >
          {/* date — big mono */}
          <div style={{ textAlign: 'center', width: '100%' }}>
            <div
              style={{
                fontFamily: FONTS.condensed, fontSize: 11, fontWeight: 700,
                letterSpacing: 2, color: theme.paperMuted, textTransform: 'uppercase',
              }}
            >
              {dateParts.month}
            </div>
            <div
              style={{
                fontFamily: FONTS.serif, fontSize: 38, lineHeight: 1,
                fontWeight: 700, color: theme.paperFg, margin: '2px 0',
              }}
            >
              {dateParts.day}
            </div>
            <div
              style={{
                fontFamily: FONTS.mono, fontSize: 10, color: theme.paperMuted,
                letterSpacing: 1,
              }}
            >
              {dateParts.year}
            </div>
          </div>

          {/* stars */}
          <div style={{ marginTop: 8 }}>
            <Stars value={show.rating} max={5} size={10} color={theme.stamp} />
          </div>

          {/* barcode */}
          <div style={{ width: '100%', marginTop: 10 }}>
            <Barcode value={show.ticketNo} height={20} color={theme.paperFg} />
            <div
              style={{
                fontFamily: FONTS.mono, fontSize: 8.5, letterSpacing: 1,
                textAlign: 'center', color: theme.paperMuted, marginTop: 3,
              }}
            >
              {show.ticketNo}
            </div>
          </div>
        </div>
      </PaperSheet>
    </div>
  );
}

// ── Bold variant — high-contrast, single color block ────────────────────────
function BoldStub({ show, theme, width = 348, lang = 'zh', onClick, showStamp }) {
  const S = STRINGS[lang];
  const dateParts = parseDate(show.date);
  const accent = theme.stamp;
  return (
    <div
      onClick={onClick}
      style={{
        position: 'relative', width, cursor: onClick ? 'pointer' : 'default',
        filter: 'drop-shadow(0 2px 1px rgba(0,0,0,0.08)) drop-shadow(0 8px 18px rgba(0,0,0,0.14))',
      }}
    >
      <div
        style={{
          background: accent, color: '#F2EBD9', borderRadius: 6,
          overflow: 'hidden', position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute', inset: 0,
            backgroundImage: paperTextureUrl(0.5, 'dark'),
            mixBlendMode: 'multiply', opacity: 0.7, pointerEvents: 'none',
          }}
        />
        <div style={{ position: 'relative', padding: '16px 16px 14px' }}>
          {/* tiny meta */}
          <div
            style={{
              display: 'flex', justifyContent: 'space-between',
              fontFamily: FONTS.mono, fontSize: 9.5, letterSpacing: 1.5,
              opacity: 0.85, paddingBottom: 8,
              borderBottom: '0.5px dashed rgba(242,235,217,0.4)',
            }}
          >
            <span>{dateParts.full.toUpperCase()}</span>
            <span>{show.ticketNo}</span>
          </div>
          {/* artist huge */}
          <div
            style={{
              fontFamily: FONTS.condensed, fontWeight: 700,
              fontSize: 44, lineHeight: 0.95, marginTop: 12,
              textTransform: 'uppercase', letterSpacing: -0.5,
            }}
          >
            {show.artist}
          </div>
          {/* venue */}
          <div
            style={{
              fontFamily: FONTS.serif, fontStyle: 'italic',
              fontSize: 14, marginTop: 10, opacity: 0.95,
            }}
          >
            {lang === 'zh' ? show.venue : show.venueEn} — {lang === 'zh' ? show.city : show.cityEn}
          </div>
          {/* bottom row */}
          <div
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginTop: 16,
              borderTop: '0.5px dashed rgba(242,235,217,0.4)',
              paddingTop: 10,
            }}
          >
            <Stars value={show.rating} max={5} size={12} color="#F2EBD9" />
            <div style={{ fontFamily: FONTS.mono, fontSize: 10, letterSpacing: 1 }}>
              {show.currency}{show.price}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Minimal variant — line-only, editorial ─────────────────────────────────
function MinimalStub({ show, theme, width = 348, lang = 'zh', onClick }) {
  const dateParts = parseDate(show.date);
  return (
    <div
      onClick={onClick}
      style={{
        width, cursor: onClick ? 'pointer' : 'default',
        background: theme.paperBg,
        borderTop: `1px solid ${theme.paperFg}`,
        borderBottom: `1px solid ${theme.paperFg}`,
        padding: '14px 4px',
        position: 'relative',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: FONTS.serif, fontSize: 24, lineHeight: 1.05,
              fontWeight: 500, color: theme.paperFg,
              letterSpacing: -0.3,
            }}
          >
            {show.artist}
          </div>
          <div
            style={{
              fontFamily: FONTS.sans, fontSize: 12, marginTop: 4,
              color: theme.paperMuted,
            }}
          >
            {lang === 'zh' ? show.venue : show.venueEn} · {lang === 'zh' ? show.city : show.cityEn}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div
            style={{
              fontFamily: FONTS.mono, fontSize: 10, letterSpacing: 1.2,
              color: theme.paperMuted, textTransform: 'uppercase',
            }}
          >
            {dateParts.month} {dateParts.year}
          </div>
          <div
            style={{
              fontFamily: FONTS.serif, fontSize: 24, fontWeight: 500,
              color: theme.paperFg, lineHeight: 1, marginTop: 2,
            }}
          >
            {dateParts.day}
          </div>
          <div style={{ marginTop: 4 }}>
            <Stars value={show.rating} max={5} size={10} color={theme.stamp} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── helpers ────────────────────────────────────────────────────────────────
function parseDate(d) {
  // 'YYYY-MM-DD' → { year, month (3-letter), day }
  const [y, m, day] = d.split('-');
  const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
  return { year: y, month: months[parseInt(m, 10) - 1], day, full: `${months[parseInt(m,10)-1]} ${day}, ${y}` };
}

Object.assign(window, { TicketStub, ClassicStub, BoldStub, MinimalStub, parseDate });
