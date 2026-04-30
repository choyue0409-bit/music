import { NavLink, Route, Routes } from 'react-router-dom'
import ArtistsView from './pages/ArtistsView.jsx'
import TimelineView from './pages/TimelineView.jsx'
import MapView from './pages/MapView.jsx'
import ConcertDetail from './pages/ConcertDetail.jsx'
import ConcertEdit from './pages/ConcertEdit.jsx'
import Settings from './pages/Settings.jsx'

const tabs = [
  { to: '/', label: '歌手', end: true },
  { to: '/timeline', label: '时间轴' },
  { to: '/map', label: '地图' },
]

export default function App() {
  return (
    <div className="min-h-full flex flex-col">
      <header className="sticky top-0 z-30 bg-ink-950/80 backdrop-blur-md border-b border-ink-800">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2">
            <span className="text-2xl">🎤</span>
            <span className="font-semibold tracking-wide">现场手账</span>
          </NavLink>
          <NavLink
            to="/settings"
            className="text-ink-300 hover:text-ink-100 text-sm"
          >
            设置
          </NavLink>
        </div>
        <nav className="max-w-3xl mx-auto px-4 flex gap-1">
          {tabs.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              end={t.end}
              className={({ isActive }) =>
                `flex-1 text-center py-2.5 text-sm transition-colors border-b-2 ${
                  isActive
                    ? 'text-ink-100 border-accent'
                    : 'text-ink-300 border-transparent hover:text-ink-100'
                }`
              }
            >
              {t.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-5 pb-24">
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
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-accent to-accent-violet text-white text-3xl shadow-2xl shadow-accent/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
        aria-label="添加演出"
      >
        +
      </NavLink>
    </div>
  )
}
