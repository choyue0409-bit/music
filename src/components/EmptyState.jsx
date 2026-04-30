import { Link } from 'react-router-dom'

export default function EmptyState({
  title = '还没有任何回忆',
  hint = '写下第一场，让它留在纸上',
}) {
  return (
    <div className="text-center py-24">
      <div className="font-display italic text-2xl text-ink-500 mb-2">Live Memory</div>
      <div className="font-display text-4xl text-ink-100 mb-3">{title}</div>
      <div className="text-ink-500 text-sm font-serif italic">{hint}</div>
      <Link
        to="/concert/new"
        className="inline-block mt-8 px-6 py-2 border-2 border-accent text-accent font-serif tracking-wider hover:bg-accent hover:text-ink-950 transition-colors"
        style={{ transform: 'rotate(-1deg)' }}
      >
        添加一场演出
      </Link>
    </div>
  )
}
