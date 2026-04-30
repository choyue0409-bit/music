import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { listConcerts } from '../db.js'
import MediaThumb from '../components/MediaThumb.jsx'
import EmptyState from '../components/EmptyState.jsx'

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
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {artists.map((a) => (
        <Link
          key={a.name}
          to={`/timeline?artist=${encodeURIComponent(a.name)}`}
          className="group rounded-2xl overflow-hidden bg-ink-900 border border-ink-800 hover:border-accent transition-colors"
        >
          <div className="aspect-square">
            {a.cover ? (
              <MediaThumb media={a.cover} className="w-full h-full" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-ink-800 to-ink-900 flex items-center justify-center text-4xl">
                🎵
              </div>
            )}
          </div>
          <div className="p-3">
            <div className="font-medium truncate">{a.name}</div>
            <div className="text-xs text-ink-300 mt-0.5">
              {a.list.length} 场
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
