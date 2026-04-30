import useMediaUrl from '../hooks/useMediaUrl.js'

export default function MediaThumb({ media, className = '', onClick }) {
  const url = useMediaUrl(media?.key)
  const isVideo = media?.type?.startsWith('video/')
  if (!url) {
    return (
      <div className={`bg-ink-800 animate-pulse ${className}`} />
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
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 pointer-events-none">
            <div className="w-10 h-10 rounded-full bg-white/90 text-black flex items-center justify-center text-lg">▶</div>
          </div>
        </>
      ) : (
        <img src={url} alt={media.name} className="w-full h-full object-cover" loading="lazy" />
      )}
      {media.isTicket && (
        <span className="absolute top-1 left-1 text-[10px] px-1.5 py-0.5 rounded bg-accent text-white">票根</span>
      )}
    </button>
  )
}
