import { NavLink, Route, Routes } from 'react-router-dom'
import ArtistsView from './pages/ArtistsView.jsx'
import TimelineView from './pages/TimelineView.jsx'
import MapView from './pages/MapView.jsx'
import ConcertDetail from './pages/ConcertDetail.jsx'
import ConcertEdit from './pages/ConcertEdit.jsx'
import Settings from './pages/Settings.jsx'

const tabs = [
  { to: '/', label: '歌手', en: 'Artists', end: true },
  { to: '/timeline', label: '时间轴', en: 'Timeline' },
  { to: '/map', label: '地图', en: 'Map' },
]

export default function App() {
  return (
    <div className="min-h-full flex flex-col">
      <header className="sticky top-0 z-30 bg-ink-950/90 backdrop-blur-sm border-b border-ink-700/60">
        <div className="max-w-3xl mx-auto px-4 pt-5 pb-2 flex items-end justify-between">
          <NavLink to="/" className="flex items-baseline gap-3">
            <span className="font-display text-3xl tracking-tight text-ink-100">现场手账</span>
            <span className="font-display italic text-sm text-ink-500 hidden sm:inline">
              Live Memory
            </span>
          </NavLink>
          <NavLink
            to="/settings"
            className="font-serif italic text-sm text-ink-500 hover:text-accent transition-colors"
          >
            设置
          </NavLink>
        </div>
        <nav className="max-w-3xl mx-auto px-4 flex gap-6">
          {tabs.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              end={t.end}
              className={({ isActive }) =>
                `py-2.5 text-sm font-serif transition-colors border-b ${
                  isActive
                    ? 'text-accent border-accent italic'
                    : 'text-ink-500 border-transparent hover:text-ink-100'
                }`
              }
            >
              <span className="mr-1">{t.label}</span>
              <span className="font-display italic text-[11px] opacity-60">{t.en}</span>
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-6 pb-28">
        <Routes>
          <Route path="/" element={<ArtistsView />} />
          <Route path="/timeline" element={<TimelineView />} />
          <Route path="/map" element={<MapView />} />
          <Route path="/concert/new" element={<ConcertEdit />} />
          <Route path="/concert/:id" element={<ConcertDetail />} />
          <Route path="/concert/:id/edit" element={<ConcertEdit />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </main>

      <NavLink
        to="/concert/new"
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-md bg-accent text-ink-950 font-display text-3xl leading-none shadow-polaroid flex items-center justify-center hover:scale-105 hover:-rotate-6 active:scale-95 transition-all"
        style={{ transform: 'rotate(-3deg)' }}
        aria-label="添加演出"
      >
        +
      </NavLink>
    </div>
  )
}
