import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { listConcerts } from '../db.js'
import MediaThumb from '../components/MediaThumb.jsx'
import EmptyState from '../components/EmptyState.jsx'

export default function TimelineView() {
  const [params, setParams] = useSearchParams()
  const artistFilter = params.get('artist') || ''
  const all = listConcerts()

  const filtered = useMemo(() => {
    if (!artistFilter) return all
    return all.filter((c) => (c.artist || '').trim() === artistFilter)
  }, [all, artistFilter])

  const groups = useMemo(() => {
    const map = new Map()
    for (const c of filtered) {
      const year = c.date ? c.date.slice(0, 4) : '未知'
      if (!map.has(year)) map.set(year, [])
      map.get(year).push(c)
    }
    return Array.from(map.entries()).sort((a, b) => b[0].localeCompare(a[0]))
  }, [filtered])

  if (!all.length) return <EmptyState />

  return (
    <div className="space-y-8">
      {artistFilter && (
        <div className="flex items-center gap-2 text-sm">
          <span className="text-ink-300">筛选：</span>
          <span className="px-2.5 py-1 rounded-full bg-accent/20 text-accent border border-accent/30">
            {artistFilter}
          </span>
          <button
            className="text-ink-300 hover:text-ink-100 text-xs"
            onClick={() => setParams({})}
          >
            清除
          </button>
        </div>
      )}

      {groups.length === 0 && (
        <div className="text-center text-ink-300 py-12">没有匹配的记录</div>
      )}

      {groups.map(([year, items]) => (
        <section key={year}>
          <h2 className="text-xl font-bold mb-3 flex items-baseline gap-2">
            {year}
            <span className="text-xs text-ink-300 font-normal">{items.length} 场</span>
          </h2>
          <div className="space-y-3">
            {items.map((c) => (
              <Link
                key={c.id}
                to={`/concert/${c.id}`}
                className="flex gap-3 p-3 rounded-2xl bg-ink-900 border border-ink-800 hover:border-accent transition-colors"
              >
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                  {c.media?.[0] ? (
                    <MediaThumb media={c.media[0]} className="w-full h-full" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-ink-800 to-ink-700 flex items-center justify-center text-2xl">
                      🎵
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{c.artist || '未命名'}</div>
                  <div className="text-xs text-ink-300 mt-0.5">{formatDate(c.date)}</div>
                  <div className="text-xs text-ink-300 truncate mt-0.5">
                    {[c.city, c.venue].filter(Boolean).join(' · ')}
                  </div>
                  {c.rating > 0 && (
                    <div className="text-xs text-amber-400 mt-1">{'★'.repeat(c.rating)}</div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}

function formatDate(d) {
  if (!d) return '日期未填'
  const [y, m, day] = d.split('-')
  return `${y} 年 ${parseInt(m, 10)} 月 ${parseInt(day, 10)} 日`
}
