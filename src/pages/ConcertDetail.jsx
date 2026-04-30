import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getConcert } from '../db.js'
import MediaThumb from '../components/MediaThumb.jsx'
import MediaViewer from '../components/MediaViewer.jsx'

export default function ConcertDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const concert = getConcert(id)
  const [viewing, setViewing] = useState(null)

  const grouped = useMemo(() => {
    const m = concert?.media || []
    return {
      tickets: m.filter((x) => x.isTicket),
      photos: m.filter((x) => !x.isTicket && x.type?.startsWith('image/')),
      videos: m.filter((x) => !x.isTicket && x.type?.startsWith('video/')),
    }
  }, [concert])

  if (!concert) {
    return (
      <div className="text-center py-20 text-ink-500 font-serif italic">
        没找到这场演出
        <div className="mt-4">
          <button onClick={() => navigate('/')} className="text-accent not-italic">回到首页 →</button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start gap-3">
        <button
          onClick={() => navigate(-1)}
          className="text-ink-500 hover:text-accent text-3xl leading-none font-display"
        >
          ‹
        </button>
        <div className="flex-1">
          <div className="font-display italic text-xs text-ink-500 tracking-widest uppercase mb-1">
            Live Memory
          </div>
          <h1 className="font-display text-4xl text-ink-100 leading-tight">{concert.artist}</h1>
          <div className="font-serif italic text-ink-500 mt-1">{formatDate(concert.date)}</div>
        </div>
        <Link
          to={`/concert/${concert.id}/edit`}
          className="font-serif italic text-sm text-ink-500 hover:text-accent border-b border-dashed border-ink-700 hover:border-accent pb-0.5"
        >
          编辑
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm border-y border-ink-700/60 py-5">
        <Info label="城市" value={concert.city} />
        <Info label="国家 / 地区" value={concert.country} />
        <Info label="场馆" value={concert.venue} />
        <Info label="票价" value={concert.price} />
        <Info label="同行" value={concert.companions} />
        <Info
          label="评分"
          value={
            concert.rating ? (
              <span className="tracking-widest text-accent">
                {'★'.repeat(concert.rating)}
                <span className="text-ink-700">{'★'.repeat(5 - concert.rating)}</span>
              </span>
            ) : ''
          }
        />
      </div>

      {concert.notes && (
        <section>
          <SectionTitle zh="那天的回忆" en="Notes" />
          <div
            className="font-serif text-ink-100 leading-loose whitespace-pre-wrap pt-4"
            style={{
              backgroundImage:
                'repeating-linear-gradient(to bottom, transparent 0, transparent 31px, #d8cfb8 31px, #d8cfb8 32px)',
              backgroundSize: '100% 32px',
              lineHeight: '32px',
            }}
          >
            {concert.notes}
          </div>
        </section>
      )}

      {grouped.tickets.length > 0 && (
        <MediaSection title="票根" en="Tickets" items={grouped.tickets} onOpen={setViewing} />
      )}
      {grouped.photos.length > 0 && (
        <MediaSection title="照片" en="Photos" items={grouped.photos} onOpen={setViewing} />
      )}
      {grouped.videos.length > 0 && (
        <MediaSection title="视频" en="Videos" items={grouped.videos} onOpen={setViewing} />
      )}

      {viewing && <MediaViewer media={viewing} onClose={() => setViewing(null)} />}
    </div>
  )
}

function Info({ label, value }) {
  if (!value && value !== 0) return null
  return (
    <div>
      <div className="text-[11px] text-ink-500 uppercase tracking-widest font-sans">{label}</div>
      <div className="mt-1 font-serif text-ink-100 truncate">{value}</div>
    </div>
  )
}

function SectionTitle({ zh, en }) {
  return (
    <h2 className="flex items-baseline gap-3">
      <span className="font-display text-xl text-ink-100">{zh}</span>
      <span className="font-display italic text-xs text-ink-500">{en}</span>
      <span className="flex-1 border-b border-dashed border-ink-700/70" />
    </h2>
  )
}

function MediaSection({ title, en, items, onOpen }) {
  return (
    <section className="space-y-3">
      <SectionTitle zh={title} en={`${en} · ${items.length}`} />
      <div className="grid grid-cols-3 gap-2">
        {items.map((m) => (
          <MediaThumb
            key={m.id}
            media={m}
            className="w-full aspect-square cursor-pointer"
            onClick={() => onOpen(m)}
          />
        ))}
      </div>
    </section>
  )
}

function formatDate(d) {
  if (!d) return '日期未填'
  const [y, m, day] = d.split('-')
  return `${y} 年 ${parseInt(m, 10)} 月 ${parseInt(day, 10)} 日`
}
