// Add — new stub form. Wires fields to db#saveShow.

import { useState } from 'react'
import { FONTS, STRINGS, SHOW_TYPES, paperTextureUrl } from '../design.js'
import { Stars } from '../atoms.jsx'
import { TicketStub } from '../TicketStub.jsx'
import { saveShow, newShowId } from '../db.js'

const COVER_BY_TYPE = {
  concert: 'sunset', theatre: 'cool', classical: 'electric',
  musical: 'rose', standup: 'olive', dance: 'magenta',
  festival: 'amber', other: 'cyan',
}

const MOOD_OPTIONS = {
  zh: ['哭了', '前排', '一辈子一次', '汗流浃背', '跨年', '出差', '朝圣', '蹦', '冷', '挤'],
  en: ['cried', 'front row', 'once in a lifetime', 'soaked', 'NYE', 'work trip', 'pilgrimage', 'danced', 'cold', 'crowded'],
}

export function AddScreen({ theme, lang, onClose, onSaved }) {
  const S = STRINGS[lang]
  const [type, setType] = useState('concert')
  const [artist, setArtist] = useState('')
  const [venue, setVenue] = useState('')
  const [city, setCity] = useState('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [price, setPrice] = useState('')
  const [seat, setSeat] = useState('')
  const [rating, setRating] = useState(0)
  const [moodSel, setMoodSel] = useState([])
  const [notes, setNotes] = useState('')
  const moods = MOOD_OPTIONS[lang]

  const canSave = artist.trim() && date

  const handleSave = () => {
    if (!canSave) return
    const id = newShowId()
    const ticketNo = `NO. ${String(Math.floor(Math.random() * 900000) + 100000)}`
    const show = {
      id, type,
      artist: artist.trim(),
      support: [],
      date,
      dateLabel: date,
      venue: venue.trim() || (lang === 'zh' ? '未填' : 'Unknown venue'),
      venueEn: venue.trim() || 'Unknown venue',
      city: city.trim() || (lang === 'zh' ? '—' : '—'),
      cityEn: city.trim() || '—',
      country: '',
      price: Number(price) || 0,
      currency: '¥',
      seat: seat.trim() || '',
      ticketNo,
      rating,
      mood: moodSel, moodEn: moodSel,
      company: ['solo'],
      setlistCount: 0,
      notes: notes.trim(),
      cover: COVER_BY_TYPE[type] || 'sunset',
      accent: 'red',
    }
    const saved = saveShow(show)
    if (onSaved) onSaved(saved)
    else onClose()
  }

  const previewShow = {
    id: 'preview', type,
    artist: artist || (lang === 'zh' ? '艺人 / 乐队' : 'Artist'),
    venue: venue || (lang === 'zh' ? '场馆' : 'Venue'),
    venueEn: venue || 'Venue',
    city: city || (lang === 'zh' ? '城市' : 'City'),
    cityEn: city || 'City',
    date, currency: '¥', price: price || 0, seat: seat || '—',
    ticketNo: 'NO. 002419',
    rating, mood: moodSel, moodEn: moodSel,
    support: [], company: [],
  }

  return (
    <div style={{ paddingBottom: 100 }}>
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
        <button
          onClick={handleSave}
          disabled={!canSave}
          style={{
            background: canSave ? theme.stamp : theme.chipBg,
            border: 'none', padding: '7px 14px', borderRadius: 999,
            fontFamily: FONTS.mono, fontSize: 10, letterSpacing: 1.2,
            textTransform: 'uppercase',
            color: canSave ? '#F2EBD9' : theme.paperMuted,
            cursor: canSave ? 'pointer' : 'not-allowed',
          }}>{S.save}</button>
      </div>

      <div style={{ padding: '6px 20px 20px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ transform: 'scale(0.85)', transformOrigin: 'top center' }}>
          <TicketStub
            show={previewShow} theme={theme} variant="classic"
            width={336} lang={lang} showStamp={false}
          />
        </div>
      </div>

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <FormField label={lang === 'zh' ? '类型' : 'Type'} theme={theme}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
            {Object.entries(SHOW_TYPES).map(([k, v]) => {
              const on = type === k
              return (
                <button key={k} onClick={() => setType(k)} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  height: 30, padding: '0 11px', borderRadius: 999, cursor: 'pointer',
                  border: `0.5px solid ${theme.paperLine}`,
                  background: on ? theme.paperFg : 'transparent',
                  color: on ? theme.paperBg : theme.paperFg,
                  fontFamily: FONTS.sans, fontSize: 12, fontWeight: 500,
                }}>
                  <span style={{ fontSize: 13 }}>{v.glyph}</span>
                  <span>{lang === 'zh' ? v.zh : v.en}</span>
                </button>
              )
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
          <FormField label={S.city} theme={theme} style={{ width: 110 }}>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder={lang === 'zh' ? '城市' : 'City'}
              style={inputStyle(theme)}
            />
          </FormField>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <FormField label={S.date} theme={theme} style={{ flex: 1 }}>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={{ ...inputStyle(theme), fontFamily: FONTS.mono, fontSize: 13 }}
            />
          </FormField>
          <FormField label={S.price} theme={theme} style={{ width: 110 }}>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="¥"
              style={{ ...inputStyle(theme), fontFamily: FONTS.mono, fontSize: 13 }}
            />
          </FormField>
        </div>

        <FormField label={S.seat} theme={theme}>
          <input
            value={seat}
            onChange={(e) => setSeat(e.target.value)}
            placeholder={lang === 'zh' ? '一层 · 12排 · 6座' : 'Sec · Row · Seat'}
            style={inputStyle(theme)}
          />
        </FormField>

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
              const on = moodSel.includes(m)
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
              )
            })}
          </div>
        </FormField>

        <FormField label={S.note} theme={theme}>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={lang === 'zh' ? '想留下点什么？' : 'Anything to remember?'}
            rows={4}
            style={{
              ...inputStyle(theme),
              height: 'auto', padding: '10px 12px',
              fontFamily: FONTS.serif, fontSize: 14, lineHeight: '22px',
              resize: 'vertical',
            }}
          />
        </FormField>
      </div>
    </div>
  )
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
  )
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
  }
}
