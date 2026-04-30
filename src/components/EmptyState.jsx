import { Link } from 'react-router-dom'

export default function EmptyState({ title = '还没有记录', hint = '点右下角的 + 添加你看过的第一场演出吧' }) {
  return (
    <div className="text-center py-20">
      <div className="text-6xl mb-4">🎤</div>
      <div className="text-lg font-medium">{title}</div>
      <div className="text-ink-300 mt-2 text-sm">{hint}</div>
      <Link
        to="/concert/new"
        className="inline-block mt-6 px-5 py-2.5 rounded-full bg-gradient-to-br from-accent to-accent-violet text-white font-medium"
      >
        添加一场
      </Link>
    </div>
  )
}
