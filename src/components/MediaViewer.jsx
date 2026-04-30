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
      className="fixed inset-0 z-50 backdrop-blur-sm flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(42,36,25,0.92)' }}
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-ink-950/10 hover:bg-ink-950/20 text-ink-950 text-2xl font-display"
        onClick={onClose}
      >
        ×
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
