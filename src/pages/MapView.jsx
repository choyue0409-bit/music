import { useMemo } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { Link } from 'react-router-dom'
import L from 'leaflet'
import { listConcerts } from '../db.js'
import EmptyState from '../components/EmptyState.jsx'

const icon = L.divIcon({
  className: '',
  html: `<div style="width:26px;height:26px;border-radius:50%;background:#b53430;border:3px solid #f7f3ea;box-shadow:0 2px 6px rgba(42,36,25,0.35);display:flex;align-items:center;justify-content:center;color:#f7f3ea;font-family:Fraunces,serif;font-style:italic;font-weight:600;font-size:13px">♪</div>`,
  iconSize: [26, 26],
  iconAnchor: [13, 13],
})

const ROTATIONS = ['rotate(-3deg)', 'rotate(2deg)', 'rotate(-1deg)', 'rotate(4deg)', 'rotate(-2deg)']

export default function MapView() {
  const all = listConcerts()

  const points = useMemo(() => {
    return all.filter((c) => Number.isFinite(c.lat) && Number.isFinite(c.lng))
  }, [all])

  const cities = useMemo(() => {
    const map = new Map()
    for (const c of all) {
      const key = (c.city || '').trim()
      if (!key) continue
      if (!map.has(key)) map.set(key, [])
      map.get(key).push(c)
    }
    return Array.from(map.entries()).sort((a, b) => b[1].length - a[1].length)
  }, [all])

  if (!all.length) return <EmptyState />

  const center = points[0] ? [points[0].lat, points[0].lng] : [31.23, 121.47]

  return (
    <div className="space-y-8">
      <div className="flex items-baseline justify-between">
        <h1 className="font-display text-3xl text-ink-100">地图</h1>
        <span className="font-display italic text-sm text-ink-500">
          {points.length} pinned · {cities.length} cities
        </span>
      </div>

      <div className="h-[420px] overflow-hidden border border-ink-700 paper-card !p-0">
        <MapContainer center={center} zoom={points.length ? 4 : 3} className="h-full w-full">
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          {points.map((c) => (
            <Marker key={c.id} position={[c.lat, c.lng]} icon={icon}>
              <Popup>
                <div className="font-display text-base">{c.artist}</div>
                <div className="text-xs italic text-ink-500">{c.date}</div>
                <div className="text-xs">{[c.city, c.venue].filter(Boolean).join(' · ')}</div>
                <Link to={`/concert/${c.id}`} className="text-xs text-accent italic mt-1 inline-block">
                  查看 →
                </Link>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <section>
        <h2 className="font-display text-xl mb-4 flex items-baseline gap-3">
          按城市
          <span className="font-display italic text-xs text-ink-500">By city</span>
        </h2>
        {cities.length === 0 ? (
          <div className="text-ink-500 text-sm font-serif italic">还没有填写过城市</div>
        ) : (
          <div className="flex flex-wrap gap-3">
            {cities.map(([city, list], i) => (
              <Link
                key={city}
                to={`/timeline`}
                className="stamp px-4 py-1.5 text-sm font-serif inline-flex items-baseline gap-2 hover:bg-accent hover:text-ink-950 transition-colors"
                style={{ transform: ROTATIONS[i % ROTATIONS.length] }}
              >
                <span>{city}</span>
                <span className="font-display italic text-xs">×{list.length}</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {points.length === 0 && (
        <p className="text-xs text-ink-500 font-serif italic leading-relaxed">
          提示：在编辑演出时填写经纬度，就能在地图上看到标记。可以用百度地图或 Google 地图右键复制坐标。
        </p>
      )}
    </div>
  )
}
