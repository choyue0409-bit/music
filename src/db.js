// Local storage for shows. Uses localStorage for the show records and
// idb-keyval for binary attachments (photos/videos).
//
// On first run, seeds the store with SEED_SHOWS so the app feels lived-in
// instead of empty. The seed flag in localStorage prevents reseeding.

import { get, set, del, keys } from 'idb-keyval'
import { SEED_SHOWS } from './seed.js'

const STORAGE_KEY = 'iwasthere:shows:v1'
const SEED_FLAG = 'iwasthere:seeded:v1'

function readAll() {
  if (!localStorage.getItem(SEED_FLAG)) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_SHOWS))
    localStorage.setItem(SEED_FLAG, '1')
    return [...SEED_SHOWS]
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function writeAll(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
}

export function listShows() {
  return readAll().sort((a, b) => (b.date || '').localeCompare(a.date || ''))
}

export function getShow(id) {
  return readAll().find((s) => s.id === id) || null
}

export function saveShow(show) {
  const list = readAll()
  const idx = list.findIndex((s) => s.id === show.id)
  const now = new Date().toISOString()
  const next = { ...show, updatedAt: now, createdAt: show.createdAt || now }
  if (idx >= 0) list[idx] = next
  else list.push(next)
  writeAll(list)
  return next
}

export async function deleteShow(id) {
  const show = getShow(id)
  if (show?.media?.length) {
    await Promise.all(show.media.map((m) => del(m.key).catch(() => {})))
  }
  writeAll(readAll().filter((s) => s.id !== id))
}

export async function addMedia(showId, file) {
  const id = crypto.randomUUID()
  const key = `media:${showId}:${id}`
  await set(key, file)
  return {
    id, key,
    name: file.name, type: file.type, size: file.size,
    addedAt: new Date().toISOString(),
  }
}

export async function getMediaBlob(key) {
  return await get(key)
}

export async function removeMedia(key) {
  await del(key).catch(() => {})
}

export function newShowId() {
  return `s-${new Date().toISOString().slice(0, 10)}-${crypto.randomUUID().slice(0, 4)}`
}

// Derived stats for the Me screen.
export function computeStats(shows) {
  if (!shows.length) {
    return {
      totalShows: 0, thisYear: 0, cities: 0, venues: 0, hours: 0,
      topArtist: '—', topArtistCount: 0,
      topVenue: '—', topVenueCount: 0,
      topCity: '—', topCityCount: 0,
      totalSpend: 0,
    }
  }
  const yr = new Date().getFullYear()
  const tally = (arr) => {
    const m = new Map()
    arr.forEach((v) => v && m.set(v, (m.get(v) || 0) + 1))
    return [...m.entries()].sort((a, b) => b[1] - a[1])
  }
  const artists = tally(shows.map((s) => s.artist))
  const venues = tally(shows.map((s) => s.venue))
  const cities = tally(shows.map((s) => s.city))
  return {
    totalShows: shows.length,
    thisYear: shows.filter((s) => s.date && s.date.startsWith(String(yr))).length,
    cities: cities.length,
    venues: venues.length,
    hours: Math.round(shows.length * 2),
    topArtist: artists[0]?.[0] || '—',
    topArtistCount: artists[0]?.[1] || 0,
    topVenue: venues[0]?.[0] || '—',
    topVenueCount: venues[0]?.[1] || 0,
    topCity: cities[0]?.[0] || '—',
    topCityCount: cities[0]?.[1] || 0,
    totalSpend: shows.reduce((acc, s) => acc + (s.currency === '¥' ? Number(s.price) || 0 : 0), 0),
  }
}

export async function exportAll() {
  const list = readAll()
  const allKeys = await keys()
  const mediaKeys = allKeys.filter((k) => typeof k === 'string' && k.startsWith('media:'))
  const media = {}
  for (const k of mediaKeys) {
    const blob = await get(k)
    if (blob) media[k] = await blobToBase64(blob)
  }
  return { version: 1, exportedAt: new Date().toISOString(), shows: list, media }
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onerror = () => reject(r.error)
    r.onload = () => resolve(r.result)
    r.readAsDataURL(blob)
  })
}
