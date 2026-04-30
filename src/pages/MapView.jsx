import { useMemo } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { Link } from 'react-router-dom'
import L from 'leaflet'
import { listConcerts } from '../db.js'
import EmptyState from '../components/EmptyState.jsx'

const icon = L.divIcon({
  className: '',
  html: `<div style="width:28px;height:28px;border-radius:50%;background:linear-gradient(135deg,#f472b6,#8b5cf6);border:2px solid white;box-shadow:0 4px 10px rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center;color:white;font-size:14px">🎤</div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
})

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
    <div className="space-y-5">
      <div className="h-[420px] rounded-2xl overflow-hidden border border-ink-800">
        <MapContainer center={center} zoom={points.length ? 4 : 3} className="h-full w-full">
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          {points.map((c) => (
            <Marker key={c.id} position={[c.lat, c.lng]} icon={icon}>
              <Popup>
                <div className="font-medium">{c.artist}</div>
                <div className="text-xs opacity-70">{c.date}</div>
                <div className="text-xs">{[c.city, c.venue].filter(Boolean).join(' · ')}</div>
                <Link to={`/concert/${c.id}`} className="text-xs underline mt-1 inline-block">
                  查看
                </Link>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <section>
        <h2 className="text-lg font-semibold mb-3">按城市</h2>
        {cities.length === 0 ? (
          <div className="text-ink-300 text-sm">还没有填写过城市</div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {cities.map(([city, list]) => (
              <Link
                key={city}
                to={`/timeline`}
                className="px-3 py-1.5 rounded-full bg-ink-900 border border-ink-800 text-sm hover:border-accent"
              >
                {city} <span className="text-ink-300 ml-1">{list.length}</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {points.length === 0 && (
        <p className="text-xs text-ink-500">
          提示：在编辑演出时填写经纬度，就能在地图上看到标记。可以用百度地图或 Google 地图右键复制坐标。
        </p>
      )}
    </div>
  )
}
