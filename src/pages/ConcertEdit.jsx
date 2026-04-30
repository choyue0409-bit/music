import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { addMedia, deleteConcert, getConcert, newId, removeMedia, saveConcert } from '../db.js'
import MediaThumb from '../components/MediaThumb.jsx'

const empty = {
  id: '',
  artist: '',
  date: new Date().toISOString().slice(0, 10),
  city: '',
  venue: '',
  country: '',
  price: '',
  companions: '',
  rating: 0,
  notes: '',
  media: [],
  lat: '',
  lng: '',
}

export default function ConcertEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(empty)
  const [busy, setBusy] = useState(false)
  const fileInputRef = useRef(null)
  const isNew = !id

  useEffect(() => {
    if (id) {
      const c = getConcert(id)
      if (c) setForm({ ...empty, ...c })
    } else {
      setForm({ ...empty, id: newId() })
    }
  }, [id])

  const update = (k) => (e) => {
    const v = e?.target ? e.target.value : e
    setForm((f) => ({ ...f, [k]: v }))
  }

  async function onPickFiles(e) {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setBusy(true)
    try {
      const newMedia = []
      for (const f of files) {
        newMedia.push(await addMedia(form.id, f))
      }
      setForm((f) => ({ ...f, media: [...(f.media || []), ...newMedia] }))
    } finally {
      setBusy(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  async function onRemoveMedia(m) {
    if (!confirm('删除这张照片/视频吗？')) return
    await removeMedia(m.key)
    setForm((f) => ({ ...f, media: (f.media || []).filter((x) => x.id !== m.id) }))
  }

  function toggleTicket(m) {
    setForm((f) => ({
      ...f,
      media: (f.media || []).map((x) => (x.id === m.id ? { ...x, isTicket: !x.isTicket } : x)),
    }))
  }

  function onSave(e) {
    e.preventDefault()
    if (!form.artist.trim()) {
      alert('请填一下歌手/演出名')
      return
    }
    saveConcert({
      ...form,
      artist: form.artist.trim(),
      city: form.city.trim(),
      venue: form.venue.trim(),
      country: form.country.trim(),
      rating: Number(form.rating) || 0,
      lat: form.lat === '' ? null : Number(form.lat),
      lng: form.lng === '' ? null : Number(form.lng),
    })
    navigate(`/concert/${form.id}`, { replace: true })
  }

  async function onDelete() {
    if (!confirm('确定删除这场演出？所有照片视频也会删除。')) return
    await deleteConcert(form.id)
    navigate('/', { replace: true })
  }

  return (
    <form onSubmit={onSave} className="space-y-7">
      <div className="flex items-baseline justify-between border-b border-ink-700/60 pb-4">
        <div>
          <div className="font-display italic text-xs text-ink-500 tracking-widest uppercase">
            {isNew ? 'New entry' : 'Edit entry'}
          </div>
          <h1 className="font-display text-3xl text-ink-100 mt-1">
            {isNew ? '新增演出' : '编辑演出'}
          </h1>
        </div>
        <button
          type="button"
          className="font-serif italic text-sm text-ink-500 hover:text-accent"
          onClick={() => navigate(-1)}
        >
          取消
        </button>
      </div>

      <Field label="歌手 / 演出名 *">
        <input value={form.artist} onChange={update('artist')} placeholder="例如：周杰伦" required />
      </Field>

      <div className="grid grid-cols-2 gap-5">
        <Field label="日期">
          <input type="date" value={form.date} onChange={update('date')} />
        </Field>
        <Field label="评分">
          <StarPicker value={form.rating} onChange={update('rating')} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <Field label="城市">
          <input value={form.city} onChange={update('city')} placeholder="例如：上海" />
        </Field>
        <Field label="国家 / 地区">
          <input value={form.country} onChange={update('country')} placeholder="例如：中国" />
        </Field>
      </div>

      <Field label="场馆">
        <input value={form.venue} onChange={update('venue')} placeholder="例如：梅赛德斯-奔驰文化中心" />
      </Field>

      <div className="grid grid-cols-2 gap-5">
        <Field label="票价">
          <input value={form.price} onChange={update('price')} placeholder="例如：1280 元" />
        </Field>
        <Field label="同行的人">
          <input value={form.companions} onChange={update('companions')} placeholder="用逗号分隔" />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <Field label="纬度（可选）">
          <input value={form.lat} onChange={update('lat')} placeholder="例如 31.18" inputMode="decimal" />
        </Field>
        <Field label="经度（可选）">
          <input value={form.lng} onChange={update('lng')} placeholder="例如 121.59" inputMode="decimal" />
        </Field>
      </div>
      <p className="text-xs text-ink-500 -mt-4 font-serif italic">
        填了经纬度才能在地图上显示。也可以只填城市。
      </p>

      <Field label="当天的回忆">
        <textarea
          rows={6}
          value={form.notes}
          onChange={update('notes')}
          placeholder="想到啥写啥：开场曲、安可、感受、有趣的小插曲……"
          className="!leading-loose"
        />
      </Field>

      <div className="space-y-3">
        <div className="flex items-baseline justify-between">
          <div className="text-[11px] text-ink-500 uppercase tracking-widest font-sans">
            照片 / 视频 / 票根
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={busy}
            className="text-sm font-serif italic text-accent hover:underline disabled:opacity-50"
          >
            {busy ? '上传中…' : '+ 添加文件'}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*"
            className="hidden"
            onChange={onPickFiles}
          />
        </div>
        {form.media?.length > 0 ? (
          <div className="grid grid-cols-3 gap-3">
            {form.media.map((m) => (
              <div key={m.id} className="relative bg-[#fffdf7] p-1.5 pb-2 shadow-polaroid">
                <MediaThumb media={m} className="w-full aspect-square" />
                <div className="flex gap-1 mt-1.5">
                  <button
                    type="button"
                    onClick={() => toggleTicket(m)}
                    className={`text-[10px] px-1.5 py-0.5 font-serif italic ${
                      m.isTicket
                        ? 'bg-accent text-ink-950'
                        : 'border border-ink-700 text-ink-500 hover:border-accent hover:text-accent'
                    }`}
                  >
                    {m.isTicket ? '✓ 票根' : '设为票根'}
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemoveMedia(m)}
                    className="ml-auto text-[10px] px-1.5 py-0.5 font-serif italic text-accent hover:underline"
                  >
                    删
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-ink-500 py-8 text-center border border-dashed border-ink-700 font-serif italic">
            还没有添加文件
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-6 border-t border-ink-700/60">
        <button
          type="submit"
          className="flex-1 py-3 bg-accent text-ink-950 font-display tracking-widest uppercase text-sm hover:opacity-90 transition-opacity"
        >
          盖章保存
        </button>
        {!isNew && (
          <button
            type="button"
            onClick={onDelete}
            className="px-5 py-3 border border-ink-700 text-ink-500 font-serif italic hover:text-accent hover:border-accent transition-colors"
          >
            删除
          </button>
        )}
      </div>
    </form>
  )
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-[11px] text-ink-500 uppercase tracking-widest font-sans mb-1.5">
        {label}
      </span>
      {children}
    </label>
  )
}

function StarPicker({ value, onChange }) {
  const v = Number(value) || 0
  return (
    <div className="flex items-center gap-1 h-[42px]">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n === v ? 0 : n)}
          className={`text-2xl transition-colors ${n <= v ? 'text-accent' : 'text-ink-700 hover:text-ink-500'}`}
          aria-label={`${n} 星`}
        >
          ★
        </button>
      ))}
    </div>
  )
}
