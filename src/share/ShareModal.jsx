// Share modal — overlay that renders a chosen template at its true PNG
// resolution into a hidden node, then downloads it as a PNG. The visible
// preview shows the same node scaled down via CSS transform.

import { useMemo, useRef, useState } from 'react'
import { FONTS } from '../design.js'
import { listShows } from '../db.js'
import {
  TicketShareTemplate,
  MinimalShareTemplate,
  MultiShareTemplate,
  RecapShareTemplate,
} from './templates.jsx'
import { SIZES, DEFAULT_SIZE_ID, findSize, PREVIEW_W, previewScale } from './sizes.js'
import { downloadAsPng, buildFilename } from './download.js'

export function ShareModal({ show, theme, lang, onClose }) {
  const allShows = useMemo(() => listShows(), [])
  const [mode, setMode] = useState('single')      // 'single' | 'multi' | 'recap'
  const [style, setStyle] = useState('ticket')    // 'ticket' | 'minimal'
  const [sizeId, setSizeId] = useState(DEFAULT_SIZE_ID)
  const [hidePrice, setHidePrice] = useState(false)
  const [hideSeat, setHideSeat] = useState(false)
  const [watermark, setWatermark] = useState(true)
  const [title, setTitle] = useState('')
  const [recapYear, setRecapYear] = useState(() => pickDefaultYear(allShows))
  const [picked, setPicked] = useState(() => pickInitialMulti(allShows, show))
  const [busy, setBusy] = useState(false)

  const size = findSize(sizeId)
  const captureRef = useRef(null)

  const yearShows = useMemo(
    () => allShows.filter((s) => s.date && s.date.startsWith(String(recapYear))),
    [allShows, recapYear]
  )
  const yearOptions = useMemo(
    () => [...new Set(allShows.map((s) => s.date && s.date.slice(0, 4)).filter(Boolean))].sort().reverse(),
    [allShows]
  )

  const togglePicked = (id) => {
    setPicked((p) => {
      if (p.includes(id)) return p.filter((x) => x !== id)
      if (p.length >= 4) return p
      return [...p, id]
    })
  }
  const pickedShows = picked.map((id) => allShows.find((s) => s.id === id)).filter(Boolean)

  const handleDownload = async () => {
    if (busy) return
    setBusy(true)
    try {
      const filename = buildFilename([
        mode === 'single' ? show.artist : mode === 'multi' ? 'collection' : `recap-${recapYear}`,
        mode === 'single' ? show.date : null,
      ])
      await downloadAsPng(captureRef.current, filename)
    } catch (e) {
      alert((lang === 'zh' ? '下载失败：' : 'Download failed: ') + (e?.message || e))
    } finally {
      setBusy(false)
    }
  }

  const L = lang === 'zh' ? {
    close: '关闭', share: '分享', download: '↓ 下载 PNG',
    modeSingle: '单场', modeMulti: '多场拼图', modeRecap: '年度回顾',
    style: '风格', styleTicket: '票根风', styleMinimal: '极简风',
    sizeLabel: '尺寸', hidePrice: '隐藏价格', hideSeat: '隐藏座位',
    watermark: '加水印', title: '标题', titlePh: '可选 · 比如「我看 A 的合集」',
    pickShows: '挑选演出（最多 4 张）', year: '年份',
    longPress: '在手机上长按图片也可保存',
    busy: '生成中…',
  } : {
    close: 'Close', share: 'Share', download: '↓ Download PNG',
    modeSingle: 'Single', modeMulti: 'Multi', modeRecap: 'Year recap',
    style: 'Style', styleTicket: 'Ticket', styleMinimal: 'Minimal',
    sizeLabel: 'Size', hidePrice: 'Hide price', hideSeat: 'Hide seat',
    watermark: 'Watermark', title: 'Title', titlePh: 'Optional · "My A live collection"',
    pickShows: 'Pick shows (up to 4)', year: 'Year',
    longPress: 'On mobile, long-press the image to save',
    busy: 'Rendering…',
  }

  const renderTemplate = () => {
    if (mode === 'single' && style === 'ticket') {
      return <TicketShareTemplate
        show={show} theme={theme} lang={lang} size={size}
        options={{ hidePrice, hideSeat }} watermark={watermark}/>
    }
    if (mode === 'single' && style === 'minimal') {
      return <MinimalShareTemplate
        show={show} theme={theme} lang={lang} size={size}
        options={{ hidePrice, hideSeat }} watermark={watermark}/>
    }
    if (mode === 'multi') {
      return <MultiShareTemplate
        shows={pickedShows.length ? pickedShows : [show]}
        theme={theme} lang={lang} size={size}
        title={title} watermark={watermark}/>
    }
    return <RecapShareTemplate
      year={recapYear} shows={yearShows}
      theme={theme} lang={lang} size={size} watermark={watermark}/>
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(14, 12, 9, 0.86)',
      backdropFilter: 'blur(8px)',
      display: 'flex', flexDirection: 'column',
      overflowY: 'auto',
      paddingTop: 'env(safe-area-inset-top, 16px)',
      paddingBottom: 'env(safe-area-inset-bottom, 16px)',
    }}>
      {/* Top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '20px 22px',
      }}>
        <button onClick={onClose} style={{
          background: 'transparent', border: 'none',
          color: '#F2EBD9', cursor: 'pointer',
          fontFamily: FONTS.sans, fontSize: 16,
        }}>← {L.close}</button>
        <div style={{
          fontFamily: FONTS.condensed, fontSize: 18, fontWeight: 700,
          letterSpacing: 1, textTransform: 'uppercase', color: '#F2EBD9',
        }}>{L.share}</div>
        <div style={{ width: 50 }}/>
      </div>

      {/* Mode tabs */}
      <div style={{
        display: 'flex', gap: 8, padding: '0 22px', flexWrap: 'wrap',
      }}>
        {[
          { id: 'single', label: L.modeSingle },
          { id: 'multi', label: L.modeMulti },
          { id: 'recap', label: L.modeRecap },
        ].map((m) => (
          <button key={m.id} onClick={() => setMode(m.id)} style={{
            height: 36, padding: '0 16px', borderRadius: 999, cursor: 'pointer',
            background: mode === m.id ? '#F2EBD9' : 'transparent',
            color: mode === m.id ? '#1A1814' : '#F2EBD9',
            border: '0.5px solid rgba(242,235,217,0.3)',
            fontFamily: FONTS.sans, fontSize: 13, fontWeight: 600,
          }}>{m.label}</button>
        ))}
      </div>

      {/* Preview */}
      <div style={{
        display: 'flex', justifyContent: 'center',
        padding: '30px 12px',
      }}>
        <div style={{
          width: PREVIEW_W,
          height: PREVIEW_W * (size.h / size.w),
          position: 'relative', overflow: 'hidden',
          borderRadius: 12,
          boxShadow: '0 30px 60px rgba(0,0,0,0.5)',
        }}>
          <div ref={captureRef} style={{
            position: 'absolute', top: 0, left: 0,
            width: size.w, height: size.h,
            transform: `scale(${previewScale(size)})`,
            transformOrigin: 'top left',
          }}>
            {renderTemplate()}
          </div>
        </div>
      </div>

      {/* Options */}
      <div style={{ padding: '0 22px 16px' }}>
        {mode === 'single' && (
          <OptionRow label={L.style}>
            <Pills value={style} onChange={setStyle} options={[
              { id: 'ticket', label: L.styleTicket },
              { id: 'minimal', label: L.styleMinimal },
            ]}/>
          </OptionRow>
        )}

        <OptionRow label={L.sizeLabel}>
          <Pills value={sizeId} onChange={setSizeId}
            options={SIZES.map((s) => ({ id: s.id, label: s.label }))}/>
        </OptionRow>

        {mode === 'single' && (
          <>
            <OptionRow label={L.hidePrice}><Toggle value={hidePrice} onChange={setHidePrice}/></OptionRow>
            <OptionRow label={L.hideSeat}><Toggle value={hideSeat} onChange={setHideSeat}/></OptionRow>
          </>
        )}

        <OptionRow label={L.watermark}><Toggle value={watermark} onChange={setWatermark}/></OptionRow>

        {mode === 'multi' && (
          <>
            <OptionRow label={L.title} stacked>
              <input
                value={title} onChange={(e) => setTitle(e.target.value)}
                placeholder={L.titlePh}
                style={{
                  width: '100%', height: 38, padding: '0 12px',
                  background: 'rgba(242,235,217,0.08)', color: '#F2EBD9',
                  border: '0.5px solid rgba(242,235,217,0.3)', borderRadius: 6,
                  fontFamily: FONTS.serif, fontSize: 14, outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </OptionRow>
            <OptionRow label={`${L.pickShows} (${pickedShows.length}/4)`} stacked>
              <div style={{
                display: 'flex', flexDirection: 'column', gap: 6,
                maxHeight: 240, overflowY: 'auto', marginTop: 6,
              }}>
                {allShows.map((s) => {
                  const on = picked.includes(s.id)
                  const disabled = !on && picked.length >= 4
                  return (
                    <button key={s.id} onClick={() => togglePicked(s.id)} disabled={disabled} style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '10px 12px', borderRadius: 6, textAlign: 'left',
                      background: on ? 'rgba(242,235,217,0.18)' : 'rgba(242,235,217,0.04)',
                      border: '0.5px solid rgba(242,235,217,0.18)',
                      color: '#F2EBD9', cursor: disabled ? 'not-allowed' : 'pointer',
                      opacity: disabled ? 0.4 : 1,
                      fontFamily: FONTS.sans, fontSize: 13,
                    }}>
                      <span style={{
                        width: 18, height: 18, borderRadius: 4,
                        border: '1px solid rgba(242,235,217,0.5)',
                        background: on ? '#F2EBD9' : 'transparent',
                        flexShrink: 0,
                      }}/>
                      <span style={{ flex: 1 }}>
                        <span style={{ fontWeight: 600 }}>{s.artist}</span>
                        <span style={{ opacity: 0.6, marginLeft: 6 }}>· {s.date}</span>
                      </span>
                      <span style={{ opacity: 0.6, fontFamily: FONTS.mono, fontSize: 11 }}>
                        {s.city}
                      </span>
                    </button>
                  )
                })}
              </div>
            </OptionRow>
          </>
        )}

        {mode === 'recap' && (
          <OptionRow label={L.year}>
            <Pills value={String(recapYear)} onChange={(v) => setRecapYear(Number(v))}
              options={yearOptions.map((y) => ({ id: y, label: y }))}/>
          </OptionRow>
        )}
      </div>

      {/* Action */}
      <div style={{ padding: '8px 22px 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button
          onClick={handleDownload}
          disabled={busy}
          style={{
            height: 52, borderRadius: 999, cursor: busy ? 'wait' : 'pointer',
            background: '#F2EBD9', color: '#1A1814', border: 'none',
            fontFamily: FONTS.condensed, fontSize: 16, fontWeight: 700,
            letterSpacing: 1.5, textTransform: 'uppercase',
          }}>
          {busy ? L.busy : L.download}
        </button>
        <div style={{
          textAlign: 'center', color: 'rgba(242,235,217,0.55)',
          fontFamily: FONTS.serif, fontStyle: 'italic', fontSize: 12,
        }}>{L.longPress}</div>
      </div>
    </div>
  )
}

function OptionRow({ label, children, stacked = false }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: stacked ? 'column' : 'row',
      alignItems: stacked ? 'stretch' : 'center',
      justifyContent: 'space-between',
      gap: 12, padding: '14px 0',
      borderBottom: '0.5px solid rgba(242,235,217,0.18)',
    }}>
      <div style={{
        fontFamily: FONTS.mono, fontSize: 11, letterSpacing: 1.5,
        color: 'rgba(242,235,217,0.7)', textTransform: 'uppercase',
      }}>{label}</div>
      <div>{children}</div>
    </div>
  )
}

function Pills({ value, onChange, options }) {
  return (
    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
      {options.map((o) => {
        const on = value === o.id
        return (
          <button key={o.id} onClick={() => onChange(o.id)} style={{
            height: 28, padding: '0 12px', borderRadius: 999, cursor: 'pointer',
            background: on ? '#F2EBD9' : 'transparent',
            color: on ? '#1A1814' : '#F2EBD9',
            border: '0.5px solid rgba(242,235,217,0.3)',
            fontFamily: FONTS.sans, fontSize: 12, fontWeight: 500,
            whiteSpace: 'nowrap',
          }}>{o.label}</button>
        )
      })}
    </div>
  )
}

function Toggle({ value, onChange }) {
  return (
    <button onClick={() => onChange(!value)} style={{
      width: 46, height: 26, borderRadius: 999, cursor: 'pointer',
      background: value ? '#A53224' : 'rgba(242,235,217,0.18)',
      border: 'none', position: 'relative', padding: 0,
    }}>
      <span style={{
        position: 'absolute', top: 3, left: value ? 23 : 3,
        width: 20, height: 20, borderRadius: '50%',
        background: '#F2EBD9',
        transition: 'left 150ms ease',
      }}/>
    </button>
  )
}

function pickDefaultYear(shows) {
  const yr = new Date().getFullYear()
  const has = shows.some((s) => s.date && s.date.startsWith(String(yr)))
  if (has) return yr
  const years = shows.map((s) => s.date && Number(s.date.slice(0, 4))).filter(Boolean)
  return years.length ? Math.max(...years) : yr
}

function pickInitialMulti(allShows, currentShow) {
  if (!currentShow) return []
  const sameArtist = allShows
    .filter((s) => s.artist === currentShow.artist)
    .map((s) => s.id)
  if (sameArtist.length >= 2) return sameArtist.slice(0, 4)
  return [currentShow.id, ...allShows.filter((s) => s.id !== currentShow.id).slice(0, 3).map((s) => s.id)]
}
