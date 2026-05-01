// Design tokens — themes, fonts, strings, show types, helpers.

// ── Paper texture (SVG, inline) — subtle fiber/grain, multi-octave turbulence
export function paperTextureUrl(opacity = 0.55, hue = 'warm') {
  const tint =
    hue === 'cool'
      ? '#9aa3b0'
      : hue === 'dark'
        ? '#3a342a'
        : '#8a6f3e'
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'>
    <filter id='n'>
      <feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' seed='4'/>
      <feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 ${opacity} 0'/>
    </filter>
    <rect width='100%' height='100%' filter='url(#n)' fill='${tint}'/>
  </svg>`
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`
}

// ── Foxing/stain — random soft warm spots so paper feels aged
export function foxingUrl(intensity = 0.06) {
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
  </svg>`
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`
}

// ── Themes
export const THEMES = {
  ivory: {
    name: 'Classic Ivory',
    paperBg: '#FBF7EE', paperFg: '#1A1A1A', paperMuted: '#7A7468',
    paperLine: 'rgba(26,26,26,0.16)', appBg: '#F4EFE2',
    stamp: '#7A1B1B', stampSecondary: '#1A1A1A', accent: '#7A1B1B',
    chipBg: 'rgba(26,26,26,0.06)', chipFg: '#1A1A1A',
    paperHue: 'warm', dark: false,
  },
  cream: {
    name: 'Cream Paper',
    paperBg: '#F2EBD9', paperFg: '#26221A', paperMuted: '#6B6151',
    paperLine: 'rgba(38,34,26,0.18)', appBg: '#E8DFC7',
    stamp: '#A53224', stampSecondary: '#1E3A52', accent: '#A53224',
    chipBg: 'rgba(38,34,26,0.08)', chipFg: '#26221A',
    paperHue: 'warm', dark: false,
  },
  noir: {
    name: 'Ink Noir',
    paperBg: '#1B1814', paperFg: '#F2EBD9', paperMuted: '#9C907B',
    paperLine: 'rgba(242,235,217,0.18)', appBg: '#0E0C09',
    stamp: '#E8554C', stampSecondary: '#E8B25A', accent: '#E8554C',
    chipBg: 'rgba(242,235,217,0.08)', chipFg: '#F2EBD9',
    paperHue: 'dark', dark: true,
  },
  rose: {
    name: 'Rose Stub',
    paperBg: '#F0DFD5', paperFg: '#2A1E1A', paperMuted: '#7A5A50',
    paperLine: 'rgba(42,30,26,0.18)', appBg: '#E5CFC2',
    stamp: '#9D2A3F', stampSecondary: '#3A2E2A', accent: '#9D2A3F',
    chipBg: 'rgba(42,30,26,0.08)', chipFg: '#2A1E1A',
    paperHue: 'warm', dark: false,
  },
  cool: {
    name: 'Cool Slate',
    paperBg: '#E5E4DC', paperFg: '#1F2228', paperMuted: '#6A6E78',
    paperLine: 'rgba(31,34,40,0.18)', appBg: '#D4D5CD',
    stamp: '#1E3A52', stampSecondary: '#A53224', accent: '#1E3A52',
    chipBg: 'rgba(31,34,40,0.08)', chipFg: '#1F2228',
    paperHue: 'cool', dark: false,
  },
}

// ── Fonts
// FONTS is intentionally mutable — App.jsx swaps the values per fontStyle
// preset (editorial / sans / typewriter) on every render so all components
// reading FONTS pick up the change.
export const FONTS = {
  serif: "'DM Serif Display', 'Cormorant Garamond', 'Playfair Display', Georgia, serif",
  sans: "'Inter Tight', 'Söhne', -apple-system, system-ui, sans-serif",
  mono: "'JetBrains Mono', 'IBM Plex Mono', 'SF Mono', ui-monospace, monospace",
  condensed: "'Anton', 'Oswald', 'Bebas Neue', 'Inter Tight', sans-serif",
}

const FONT_DEFAULTS = { ...FONTS }

export const FONT_PRESETS = {
  editorial: { ...FONT_DEFAULTS },
  sans: {
    ...FONT_DEFAULTS,
    serif: FONT_DEFAULTS.sans,
    condensed: "'Inter Tight', sans-serif",
  },
  typewriter: {
    ...FONT_DEFAULTS,
    serif: FONT_DEFAULTS.mono,
    condensed: FONT_DEFAULTS.mono,
    sans: FONT_DEFAULTS.mono,
  },
}

export function applyFontPreset(name) {
  const preset = FONT_PRESETS[name] || FONT_PRESETS.editorial
  Object.assign(FONTS, preset)
}

// ── Show types
export const SHOW_TYPES = {
  concert:  { zh: '演出',   en: 'Concert', glyph: '♪' },
  theatre:  { zh: '话剧',   en: 'Theatre', glyph: '✦' },
  classical:{ zh: '古典',   en: 'Classical', glyph: '♭' },
  musical:  { zh: '音乐剧', en: 'Musical', glyph: '♫' },
  standup:  { zh: '脱口秀', en: 'Stand-up', glyph: '✺' },
  dance:    { zh: '舞蹈',   en: 'Dance', glyph: '◈' },
  festival: { zh: '音乐节', en: 'Festival', glyph: '✶' },
  other:    { zh: '其他',   en: 'Other', glyph: '·' },
}

// ── Lang strings
export const STRINGS = {
  zh: {
    appName: 'iwasthere', tagline: '看过的演出',
    tabHome: '票根', tabAdd: '', tabSearch: '探索', tabMe: '我',
    homeHeader: '票根', homeYearLabel: '年',
    homeStat: (n) => `${n} 场`,
    addTitle: '新票根', detailTitle: '票根', meTitle: '我', searchTitle: '探索',
    seat: '座位', company: '同行', rating: '评分', mood: '心情',
    note: '日记', setlist: '歌单', save: '保存', cancel: '取消',
    artist: '艺人 / 乐队', venue: '场馆', city: '城市', date: '日期',
    price: '票价', photo: '照片', scan: '扫票根',
    statsThisYear: '今年', statsCities: '城市', statsVenues: '场馆',
    statsHours: '现场小时', statsTopArtist: '最常听', statsTopVenue: '常去场馆',
    statsTotalSpend: '总票钱',
    map: '足迹', timeline: '时间线', upcoming: '快到了', discover: '发现',
    searchPh: '搜索艺人 / 场馆 / 城市', recent: '最近',
    tags: '心情标签', soloIndicator: '一个人',
  },
  en: {
    appName: 'iwasthere', tagline: "Shows you've been to",
    tabHome: 'Stubs', tabAdd: '', tabSearch: 'Explore', tabMe: 'Me',
    homeHeader: 'Stubs', homeYearLabel: '',
    homeStat: (n) => `${n} shows`,
    addTitle: 'New stub', detailTitle: 'Stub', meTitle: 'Me', searchTitle: 'Explore',
    seat: 'Seat', company: 'With', rating: 'Rating', mood: 'Mood',
    note: 'Journal', setlist: 'Setlist', save: 'Save', cancel: 'Cancel',
    artist: 'Artist', venue: 'Venue', city: 'City', date: 'Date',
    price: 'Price', photo: 'Photo', scan: 'Scan ticket',
    statsThisYear: 'this year', statsCities: 'cities', statsVenues: 'venues',
    statsHours: 'live hours', statsTopArtist: 'most seen', statsTopVenue: 'most visited',
    statsTotalSpend: 'total spend',
    map: 'Map', timeline: 'Timeline', upcoming: 'Coming up', discover: 'Discover',
    searchPh: 'Artist · venue · city', recent: 'Recent',
    tags: 'Mood tags', soloIndicator: 'solo',
  },
}

// ── Cover palettes
export const COVER_PALETTES = {
  sunset: ['#E8554C', '#E8B25A', '#A53224'],
  amber: ['#C9882B', '#E8B25A', '#6B4A1F'],
  cool: ['#3A4A5E', '#1E3A52', '#0E1B26'],
  magenta: ['#A53666', '#E85A8C', '#52182E'],
  rose: ['#9D2A3F', '#E8554C', '#3A1A22'],
  cyan: ['#2A6E78', '#5AC9D6', '#0E2A2E'],
  olive: ['#5E6B2A', '#9CA84A', '#2E3815'],
  electric: ['#1E3A52', '#5A4AC9', '#0E1830'],
  'kid-a': ['#A53224', '#D9D6CC', '#1B1814'],
}

// 'YYYY-MM-DD' → { year, month (3-letter), day, full }
export function parseDate(d) {
  const [y, m, day] = d.split('-')
  const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']
  return {
    year: y,
    month: months[parseInt(m, 10) - 1],
    day,
    full: `${months[parseInt(m,10)-1]} ${day}, ${y}`,
  }
}
