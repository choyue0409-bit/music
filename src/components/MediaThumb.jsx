import useMediaUrl from '../hooks/useMediaUrl.js'

export default function MediaThumb({ media, className = '', onClick }) {
  const url = useMediaUrl(media?.key)
  const isVideo = media?.type?.startsWith('video/')
  if (!url) {
    return (
      <div className={`bg-ink-800 ${className}`} style={{ opacity: 0.6 }} />
    )
  }
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative overflow-hidden bg-ink-800 ${className}`}
    >
      {isVideo ? (
        <>
          <video src={url} className="w-full h-full object-cover" muted playsInline preload="metadata" />
          <div className="absolute inset-0 flex items-center justify-center bg-ink-100/30 pointer-events-none">
            <div className="w-10 h-10 rounded-full bg-ink-950/90 text-ink-100 flex items-center justify-center text-lg font-display">▶</div>
          </div>
        </>
      ) : (
        <img src={url} alt={media.name} className="w-full h-full object-cover" loading="lazy" />
      )}
      {media.isTicket && (
        <span
          className="washi-tape absolute -top-1 left-2 text-[10px] px-3 py-0.5 font-serif italic text-ink-100"
          style={{ transform: 'rotate(-3deg)' }}
        >
          票根
        </span>
      )}
    </button>
  )
}
