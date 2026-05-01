// design-system.jsx — Stub Hub (working title) shared design tokens & atoms
// Aesthetic: vintage paper ticket. Cream paper, deep ink black, stamp red.
// All values are CSS strings so theme tokens compose well.

// ── Paper texture (SVG, inline) ─────────────────────────────────────────────
// Subtle fiber/grain — NOT lines. Multi-octave turbulence with low alpha.
function paperTextureUrl(opacity = 0.55, hue = 'warm') {
  // hue: warm (default cream) | cool (slate paper) | dark
  const tint =
    hue === 'cool'
      ? '#9aa3b0'
      : hue === 'dark'
        ? '#3a342a'
        : '#8a6f3e';
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'>
    <filter id='n'>
      <feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' seed='4'/>
      <feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 ${opacity} 0'/>
    </filter>
    <rect width='100%' height='100%' filter='url(#n)' fill='${tint}'/>
  </svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
}

// Foxing/stain — random soft warm spots so paper feels aged
function foxingUrl(intensity = 0.06) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'>
    <defs>
      <radialGradient id='a' cx='30%' cy='25%' r='30%'>
        <stop offset='0%' stop-color='#a8763a' stop-opacity='${intensity}'/>
        <stop offset='100%' stop-color='#a8763a' stop-opacity='0'/>
      </radialGradient>
      <radialGradient id='b' cx='75%' cy='70%' r='35%'>
        <stop offset='0%' stop-color='#7a5a2c' stop-opacity='${intensity * 0.8}'/>
        <stop offset='100%' stop-color='#7a5a2c' stop-opacity='0'/>
      </radialGradient>
      <radialGradient id='c' cx='60%' cy='15%' r='20%'>
        <stop offset='0%' stop-color='#c9a566' stop-opacity='${intensity * 0.6}'/>
        <stop offset='100%' stop-color='#c9a566' stop-opacity='0'/>
      </radialGradient>
    </defs>
    <rect width='100%' height='100%' fill='url(#a)'/>
    <rect width='100%' height='100%' fill='url(#b)'/>
    <rect width='100%' height='100%' fill='url(#c)'/>
  </svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
}

// ── Theme tokens ────────────────────────────────────────────────────────────
const THEMES = {
  ivory: {
    name: 'Classic Ivory',
    paperBg: '#FBF7EE',
    paperFg: '#1A1A1A',
    paperMuted: '#7A7468',
    paperLine: 'rgba(26,26,26,0.16)',
    appBg: '#F4EFE2',
    stamp: '#7A1B1B',
    stampSecondary: '#1A1A1A',
    accent: '#7A1B1B',
    chipBg: 'rgba(26,26,26,0.06)',
    chipFg: '#1A1A1A',
    paperHue: 'warm',
    dark: false,
  },
  cream: {
    name: 'Cream Paper',
    paperBg: '#F2EBD9',
    paperFg: '#26221A',
    paperMuted: '#6B6151',
    paperLine: 'rgba(38,34,26,0.18)',
    appBg: '#E8DFC7',
    stamp: '#A53224',           // ink stamp red
    stampSecondary: '#1E3A52',  // navy
    accent: '#A53224',
    chipBg: 'rgba(38,34,26,0.08)',
    chipFg: '#26221A',
    paperHue: 'warm',
    dark: false,
  },
  noir: {
    name: 'Ink Noir',
    paperBg: '#1B1814',
    paperFg: '#F2EBD9',
    paperMuted: '#9C907B',
    paperLine: 'rgba(242,235,217,0.18)',
    appBg: '#0E0C09',
    stamp: '#E8554C',
    stampSecondary: '#E8B25A',
    accent: '#E8554C',
    chipBg: 'rgba(242,235,217,0.08)',
    chipFg: '#F2EBD9',
    paperHue: 'dark',
    dark: true,
  },
  rose: {
    name: 'Rose Stub',
    paperBg: '#F0DFD5',
    paperFg: '#2A1E1A',
    paperMuted: '#7A5A50',
    paperLine: 'rgba(42,30,26,0.18)',
    appBg: '#E5CFC2',
    stamp: '#9D2A3F',
    stampSecondary: '#3A2E2A',
    accent: '#9D2A3F',
    chipBg: 'rgba(42,30,26,0.08)',
    chipFg: '#2A1E1A',
    paperHue: 'warm',
    dark: false,
  },
  cool: {
    name: 'Cool Slate',
    paperBg: '#E5E4DC',
    paperFg: '#1F2228',
    paperMuted: '#6A6E78',
    paperLine: 'rgba(31,34,40,0.18)',
    appBg: '#D4D5CD',
    stamp: '#1E3A52',
    stampSecondary: '#A53224',
    accent: '#1E3A52',
    chipBg: 'rgba(31,34,40,0.08)',
    chipFg: '#1F2228',
    paperHue: 'cool',
    dark: false,
  },
};

// ── Font stacks ─────────────────────────────────────────────────────────────
const FONTS = {
  // editorial — vintage signage feel
  serif:
    "'DM Serif Display', 'Cormorant Garamond', 'Playfair Display', Georgia, serif",
  // body
  sans:
    "'Inter Tight', 'Söhne', -apple-system, system-ui, sans-serif",
  // mono — for ticket numbers, dates, codes
  mono:
    "'JetBrains Mono', 'IBM Plex Mono', 'SF Mono', ui-monospace, monospace",
  // condensed display — for big artist names
  condensed:
    "'Anton', 'Oswald', 'Bebas Neue', 'Inter Tight', sans-serif",
};

// ── Lang strings ────────────────────────────────────────────────────────────
const STRINGS = {
  zh: {
    appName: 'iwasthere',
    tagline: '看过的演出',
    tabHome: '票根',
    tabAdd: '',
    tabSearch: '探索',
    tabMe: '我',
    homeHeader: '票根',
    homeYearLabel: '年',
    homeStat: (n) => `${n} 场`,
    addTitle: '新票根',
    detailTitle: '票根',
    meTitle: '我',
    searchTitle: '探索',
    seat: '座位',
    company: '同行',
    rating: '评分',
    mood: '心情',
    note: '日记',
    setlist: '歌单',
    save: '保存',
    cancel: '取消',
    artist: '艺人 / 乐队',
    venue: '场馆',
    city: '城市',
    date: '日期',
    price: '票价',
    photo: '照片',
    scan: '扫票根',
    statsThisYear: '今年',
    statsCities: '城市',
    statsVenues: '场馆',
    statsHours: '现场小时',
    statsTopArtist: '最常听',
    statsTopVenue: '常去场馆',
    statsTotalSpend: '总票钱',
    map: '足迹',
    timeline: '时间线',
    upcoming: '快到了',
    discover: '发现',
    searchPh: '搜索艺人 / 场馆 / 城市',
    recent: '最近',
    tags: '心情标签',
    soloIndicator: '一个人',
  },
  en: {
    appName: 'iwasthere',
    tagline: 'Shows you\'ve been to',
    tabHome: 'Stubs',
    tabAdd: '',
    tabSearch: 'Explore',
    tabMe: 'Me',
    homeHeader: 'Stubs',
    homeYearLabel: '',
    homeStat: (n) => `${n} shows`,
    addTitle: 'New stub',
    detailTitle: 'Stub',
    meTitle: 'Me',
    searchTitle: 'Explore',
    seat: 'Seat',
    company: 'With',
    rating: 'Rating',
    mood: 'Mood',
    note: 'Journal',
    setlist: 'Setlist',
    save: 'Save',
    cancel: 'Cancel',
    artist: 'Artist',
    venue: 'Venue',
    city: 'City',
    date: 'Date',
    price: 'Price',
    photo: 'Photo',
    scan: 'Scan ticket',
    statsThisYear: 'this year',
    statsCities: 'cities',
    statsVenues: 'venues',
    statsHours: 'live hours',
    statsTopArtist: 'most seen',
    statsTopVenue: 'most visited',
    statsTotalSpend: 'total spend',
    map: 'Map',
    timeline: 'Timeline',
    upcoming: 'Coming up',
    discover: 'Discover',
    searchPh: 'Artist · venue · city',
    recent: 'Recent',
    tags: 'Mood tags',
    soloIndicator: 'solo',
  },
};

// ── Atoms ───────────────────────────────────────────────────────────────────

// Paper sheet — applies the texture + foxing layers to any container
function PaperSheet({ theme, children, style = {}, intense = false }) {
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
  );
}

// Perforation row — circles cutting through ticket on left/right
function Perforation({ count = 18, color = '#E8DFC7', dotSize = 8, top = 0, side = 'top' }) {
  // side: 'top' | 'bottom' | 'left' | 'right'
  const horizontal = side === 'top' || side === 'bottom';
  const dots = Array.from({ length: count });
  return (
    <div
      style={{
        position: 'absolute',
        ...(side === 'top' ? { top: -dotSize / 2, left: 0, right: 0 } : {}),
        ...(side === 'bottom' ? { bottom: -dotSize / 2, left: 0, right: 0 } : {}),
        ...(side === 'left' ? { left: -dotSize / 2, top: 0, bottom: 0 } : {}),
        ...(side === 'right' ? { right: -dotSize / 2, top: 0, bottom: 0 } : {}),
        display: 'flex',
        flexDirection: horizontal ? 'row' : 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        pointerEvents: 'none',
        zIndex: 2,
      }}
    >
      {dots.map((_, i) => (
        <div
          key={i}
          style={{
            width: dotSize, height: dotSize, borderRadius: '50%',
            background: color,
            boxShadow: 'inset 0 1px 1px rgba(0,0,0,0.18)',
          }}
        />
      ))}
    </div>
  );
}

// Vertical dashed perforation (the tear line on a stub)
function PerforationLine({ vertical = true, color = 'currentColor', opacity = 0.35 }) {
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
  );
}

// Stamp — circular ink stamp with rotated text
function Stamp({ text = 'ATTENDED', color = '#A53224', size = 78, rotation = -12, style = {} }) {
  return (
    <div
      style={{
        position: 'relative',
        width: size, height: size,
        transform: `rotate(${rotation}deg)`,
        color,
        opacity: 0.78,
        ...style,
      }}
    >
      <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: 'block' }}>
        <circle cx="50" cy="50" r="46" fill="none" stroke={color} strokeWidth="2.5" />
        <circle cx="50" cy="50" r="40" fill="none" stroke={color} strokeWidth="0.8" />
        {/* roughen via dashed inner */}
        <circle cx="50" cy="50" r="43" fill="none" stroke={color} strokeWidth="1" strokeDasharray="2 3" opacity="0.5" />
      </svg>
      <div
        style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: FONTS.condensed,
          fontSize: size * 0.18,
          letterSpacing: '0.18em',
          fontWeight: 700,
          textAlign: 'center',
          lineHeight: 1.05,
        }}
      >
        {text}
      </div>
    </div>
  );
}

// Barcode — simple SVG, deterministic from a string
function Barcode({ value = 'NO. 000000', height = 36, color = 'currentColor' }) {
  // turn the value into a series of bar widths
  const seed = value.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const bars = [];
  let x = 0;
  for (let i = 0; i < 60; i++) {
    const w = ((seed * (i + 7)) % 5) === 0 ? 3 : ((seed * (i + 3)) % 3) === 0 ? 2 : 1;
    const isBar = ((seed + i * 13) % 5) > 1;
    if (isBar) bars.push({ x, w });
    x += w + 1;
  }
  const total = x;
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${total} ${height}`} preserveAspectRatio="none" style={{ display: 'block' }}>
      {bars.map((b, i) => (
        <rect key={i} x={b.x} y="0" width={b.w} height={height} fill={color} />
      ))}
    </svg>
  );
}

// Star rating
function Stars({ value = 5, max = 5, size = 14, color = 'currentColor' }) {
  const stars = Array.from({ length: max });
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
  );
}

// Cover — gradient placeholder keyed by name (no SVG illustrations)
const COVER_PALETTES = {
  sunset: ['#E8554C', '#E8B25A', '#A53224'],
  amber: ['#C9882B', '#E8B25A', '#6B4A1F'],
  cool: ['#3A4A5E', '#1E3A52', '#0E1B26'],
  magenta: ['#A53666', '#E85A8C', '#52182E'],
  rose: ['#9D2A3F', '#E8554C', '#3A1A22'],
  cyan: ['#2A6E78', '#5AC9D6', '#0E2A2E'],
  olive: ['#5E6B2A', '#9CA84A', '#2E3815'],
  electric: ['#1E3A52', '#5A4AC9', '#0E1830'],
  'kid-a': ['#A53224', '#D9D6CC', '#1B1814'],
};

function Cover({ kind = 'sunset', text = '', size = 56, rounded = 4, style = {} }) {
  const pal = COVER_PALETTES[kind] || COVER_PALETTES.sunset;
  const numericSize = typeof size === 'number' ? size : null;
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
  );
}

// Chip — small mood/tag pill
function Chip({ children, theme, accent = false, style = {} }) {
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
  );
}

Object.assign(window, {
  THEMES, FONTS, STRINGS,
  paperTextureUrl, foxingUrl,
  PaperSheet, Perforation, PerforationLine, Stamp, Barcode, Stars, Cover, Chip,
  COVER_PALETTES,
});
