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
    <div className="space-y-12">
      <div className="flex items-baseline justify-between">
        <h1 className="font-display text-3xl text-ink-100">时间轴</h1>
        <span className="font-display italic text-sm text-ink-500">
          {filtered.length} memories
        </span>
      </div>

      {artistFilter && (
        <div className="flex items-center gap-3 -mt-6 text-sm font-serif">
          <span className="text-ink-500 italic">仅显示</span>
          <span
            className="washi-tape px-3 py-1 text-ink-100"
            style={{ transform: 'rotate(-1deg)' }}
          >
            {artistFilter}
          </span>
          <button
            className="text-ink-500 italic hover:text-accent text-xs"
            onClick={() => setParams({})}
          >
            清除
          </button>
        </div>
      )}

      {groups.length === 0 && (
        <div className="text-center text-ink-500 py-12 font-serif italic">没有匹配的记录</div>
      )}

      {groups.map(([year, items]) => (
        <section key={year} className="relative">
          <div
            aria-hidden
            className="absolute -top-4 -left-2 font-display text-[7rem] sm:text-[9rem] leading-none text-ink-700/40 pointer-events-none select-none"
            style={{ letterSpacing: '-0.04em' }}
          >
            {year}
          </div>
          <div className="relative pt-16 pl-5 border-l border-ink-700/70">
            <h2 className="absolute left-5 top-16 -translate-y-full pb-2 font-serif text-sm text-ink-500 italic">
              {items.length} 场 · {year}
            </h2>
            <div className="space-y-5">
              {items.map((c) => (
                <Link
                  key={c.id}
                  to={`/concert/${c.id}`}
                  className="group relative flex gap-4 p-4 paper-card hover:-translate-y-0.5 transition-transform"
                >
                  <span
                    aria-hidden
                    className="absolute -left-[26px] top-7 w-3 h-3 rounded-full bg-accent border-2 border-ink-950"
                  />
                  <div className="w-20 h-20 overflow-hidden flex-shrink-0 bg-ink-800">
                    {c.media?.[0] ? (
                      <MediaThumb media={c.media[0]} className="w-full h-full" />
                    ) : (
                      <div className="w-full h-full bg-ink-900 flex items-center justify-center font-display italic text-2xl text-ink-500">
                        ♪
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display text-lg text-ink-100 truncate">{c.artist || '未命名'}</div>
                    <div className="text-xs text-ink-500 mt-0.5 font-serif italic">{formatDate(c.date)}</div>
                    <div className="text-xs text-ink-300 truncate mt-1 font-serif">
                      {[c.city, c.venue].filter(Boolean).join(' · ') || <span className="italic text-ink-500">地点待补</span>}
                    </div>
                    {c.rating > 0 && (
                      <div className="text-xs text-accent mt-1 tracking-widest">{'★'.repeat(c.rating)}<span className="text-ink-700">{'★'.repeat(5 - c.rating)}</span></div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
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
