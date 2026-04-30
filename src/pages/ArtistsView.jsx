import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { listConcerts } from '../db.js'
import MediaThumb from '../components/MediaThumb.jsx'
import EmptyState from '../components/EmptyState.jsx'

const TILTS = ['rotate-[-1.5deg]', 'rotate-[1deg]', 'rotate-[-0.5deg]', 'rotate-[1.5deg]', 'rotate-[-1deg]']

export default function ArtistsView() {
  const concerts = listConcerts()

  const artists = useMemo(() => {
    const map = new Map()
    for (const c of concerts) {
      const name = (c.artist || '未命名').trim()
      if (!map.has(name)) map.set(name, [])
      map.get(name).push(c)
    }
    return Array.from(map.entries())
      .map(([name, list]) => ({
        name,
        list: list.sort((a, b) => (b.date || '').localeCompare(a.date || '')),
        cover: list.find((c) => c.media?.length)?.media?.[0],
      }))
      .sort((a, b) => b.list.length - a.list.length || a.name.localeCompare(b.name))
  }, [concerts])

  if (!concerts.length) {
    return <EmptyState />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-baseline justify-between">
        <h1 className="font-display text-3xl text-ink-100">歌手</h1>
        <span className="font-display italic text-sm text-ink-500">
          {artists.length} artists · {concerts.length} shows
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-5 gap-y-8 pt-2">
        {artists.map((a, i) => (
          <Link
            key={a.name}
            to={`/timeline?artist=${encodeURIComponent(a.name)}`}
            className={`group block bg-[#fffdf7] p-2.5 pb-4 shadow-polaroid hover:-translate-y-0.5 hover:shadow-lg transition-all ${TILTS[i % TILTS.length]}`}
          >
            <div className="aspect-square bg-ink-800 overflow-hidden">
              {a.cover ? (
                <MediaThumb media={a.cover} className="w-full h-full" />
              ) : (
                <div className="w-full h-full bg-ink-900 flex items-center justify-center font-display italic text-3xl text-ink-500">
                  ♪
                </div>
              )}
            </div>
            <div className="pt-3 px-1 text-center">
              <div className="font-display italic text-base text-ink-100 truncate">{a.name}</div>
              <div className="font-serif text-[11px] text-ink-500 mt-0.5 tracking-wider">
                {a.list.length} {a.list.length === 1 ? 'show' : 'shows'}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
