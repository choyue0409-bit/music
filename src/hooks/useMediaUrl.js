import { useEffect, useState } from 'react'
import { getMediaBlob } from '../db.js'

export default function useMediaUrl(key) {
  const [url, setUrl] = useState(null)
  useEffect(() => {
    let alive = true
    let objectUrl = null
    if (!key) {
      setUrl(null)
      return
    }
    getMediaBlob(key).then((blob) => {
      if (!alive || !blob) return
      objectUrl = URL.createObjectURL(blob)
      setUrl(objectUrl)
    })
    return () => {
      alive = false
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [key])
  return url
}
