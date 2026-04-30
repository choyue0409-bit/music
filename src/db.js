import { get, set, del, keys } from 'idb-keyval'

const STORAGE_KEY = 'lm:concerts:v1'

function readAll() {
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

export function listConcerts() {
  return readAll().sort((a, b) => (b.date || '').localeCompare(a.date || ''))
}

export function getConcert(id) {
  return readAll().find((c) => c.id === id) || null
}

export function saveConcert(concert) {
  const list = readAll()
  const idx = list.findIndex((c) => c.id === concert.id)
  const now = new Date().toISOString()
  const next = {
    ...concert,
    updatedAt: now,
    createdAt: concert.createdAt || now,
  }
  if (idx >= 0) list[idx] = next
  else list.push(next)
  writeAll(list)
  return next
}

export async function deleteConcert(id) {
  const concert = getConcert(id)
  if (concert?.media?.length) {
    await Promise.all(concert.media.map((m) => del(m.key).catch(() => {})))
  }
  writeAll(readAll().filter((c) => c.id !== id))
}

export async function addMedia(concertId, file) {
  const id = crypto.randomUUID()
  const key = `media:${concertId}:${id}`
  await set(key, file)
  return {
    id,
    key,
    name: file.name,
    type: file.type,
    size: file.size,
    isTicket: false,
    addedAt: new Date().toISOString(),
  }
}

export async function getMediaBlob(key) {
  return await get(key)
}

export async function removeMedia(key) {
  await del(key).catch(() => {})
}

export async function exportAll() {
  const list = readAll()
  const allKeys = await keys()
  const mediaKeys = allKeys.filter((k) => typeof k === 'string' && k.startsWith('media:'))
  const media = {}
  for (const k of mediaKeys) {
    const blob = await get(k)
    if (blob) {
      media[k] = await blobToBase64(blob)
    }
  }
  return { version: 1, exportedAt: new Date().toISOString(), concerts: list, media }
}

export async function importAll(payload) {
  if (!payload || !Array.isArray(payload.concerts)) throw new Error('文件格式不对')
  writeAll(payload.concerts)
  if (payload.media) {
    for (const [k, b64] of Object.entries(payload.media)) {
      const blob = await base64ToBlob(b64)
      await set(k, blob)
    }
  }
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onerror = () => reject(r.error)
    r.onload = () => resolve(r.result)
    r.readAsDataURL(blob)
  })
}

async function base64ToBlob(dataUrl) {
  const res = await fetch(dataUrl)
  return await res.blob()
}

export function newId() {
  return crypto.randomUUID()
}
