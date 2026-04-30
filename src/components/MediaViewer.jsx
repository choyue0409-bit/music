import { useEffect } from 'react'
import useMediaUrl from '../hooks/useMediaUrl.js'

export default function MediaViewer({ media, onClose }) {
  const url = useMediaUrl(media?.key)
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!media) return null
  const isVideo = media.type?.startsWith('video/')

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white text-xl"
        onClick={onClose}
      >
        ✕
      </button>
      {url && (
        isVideo ? (
          <video
            src={url}
            className="max-h-full max-w-full rounded-lg"
            controls
            autoPlay
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <img
            src={url}
            alt={media.name}
            className="max-h-full max-w-full rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        )
      )}
    </div>
  )
}
