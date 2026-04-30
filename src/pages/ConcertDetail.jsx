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
      <div className="text-center py-20 text-ink-300">
        没找到这场演出
        <div className="mt-4">
          <button onClick={() => navigate('/')} className="text-accent">回到首页</button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <button
          onClick={() => navigate(-1)}
          className="text-ink-300 hover:text-ink-100 text-2xl leading-none"
        >
          ‹
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{concert.artist}</h1>
          <div className="text-ink-300 mt-1">{formatDate(concert.date)}</div>
        </div>
        <Link
          to={`/concert/${concert.id}/edit`}
          className="px-3 py-1.5 rounded-lg bg-ink-800 border border-ink-700 text-sm hover:border-accent"
        >
          编辑
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <Info label="城市" value={concert.city} />
        <Info label="国家 / 地区" value={concert.country} />
        <Info label="场馆" value={concert.venue} />
        <Info label="票价" value={concert.price} />
        <Info label="同行" value={concert.companions} />
        <Info label="评分" value={concert.rating ? '★'.repeat(concert.rating) : ''} />
      </div>

      {concert.notes && (
        <section>
          <h2 className="text-lg font-semibold mb-2">那天的回忆</h2>
          <p className="whitespace-pre-wrap text-ink-100/90 bg-ink-900 border border-ink-800 rounded-2xl p-4 leading-relaxed">
            {concert.notes}
          </p>
        </section>
      )}

      {grouped.tickets.length > 0 && (
        <MediaSection title="票根" items={grouped.tickets} onOpen={setViewing} />
      )}
      {grouped.photos.length > 0 && (
        <MediaSection title="照片" items={grouped.photos} onOpen={setViewing} />
      )}
      {grouped.videos.length > 0 && (
        <MediaSection title="视频" items={grouped.videos} onOpen={setViewing} />
      )}

      {viewing && <MediaViewer media={viewing} onClose={() => setViewing(null)} />}
    </div>
  )
}

function Info({ label, value }) {
  if (!value) return null
  return (
    <div className="bg-ink-900 border border-ink-800 rounded-xl px-3 py-2.5">
      <div className="text-xs text-ink-300">{label}</div>
      <div className="mt-0.5 truncate">{value}</div>
    </div>
  )
}

function MediaSection({ title, items, onOpen }) {
  return (
    <section>
      <h2 className="text-lg font-semibold mb-2">
        {title} <span className="text-xs text-ink-300 font-normal">{items.length}</span>
      </h2>
      <div className="grid grid-cols-3 gap-2">
        {items.map((m) => (
          <MediaThumb
            key={m.id}
            media={m}
            className="w-full aspect-square rounded-lg cursor-pointer"
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
