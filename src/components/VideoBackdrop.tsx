import { useRef, useState } from 'react'
import siteConfig from '../data/site-config.json'

/**
 * Vidéo personnelle en arrière-plan.
 * - object-fit: cover, voile noir et doré pour la lisibilité.
 * - image de couverture si la vidéo est absente ou échoue.
 * - lecture auto sans son ; commande visible pour activer/couper le son.
 * - vitesse de lecture configurable (ralenti réel via playbackRate).
 *   Aucun interpolation d'images : simple réduction de vitesse native.
 */
export function VideoBackdrop({ withVeil = true }: { withVeil?: boolean }) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [videoOk, setVideoOk] = useState(true)
  const [muted, setMuted] = useState(true)

  const src = siteConfig.media.introVideo
  const poster = siteConfig.media.introPoster
  const rate = siteConfig.media.videoPlaybackRate ?? 1

  const toggleSound = () => {
    const v = videoRef.current
    if (!v) return
    v.muted = !v.muted
    setMuted(v.muted)
    // Les navigateurs exigent un geste utilisateur pour démuter : on est dans un clic.
    if (!v.muted) v.play().catch(() => undefined)
  }

  return (
    <div className="video-backdrop" aria-hidden={!videoOk}>
      {videoOk ? (
        <video
          ref={(el) => {
            videoRef.current = el
            if (el) {
              el.playbackRate = rate
            }
          }}
          src={src}
          poster={poster}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          onError={() => setVideoOk(false)}
          onLoadedMetadata={(e) => {
            e.currentTarget.playbackRate = rate
          }}
        />
      ) : poster ? (
        <img className="cover" src={poster} alt="" loading="lazy" onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')} />
      ) : null}
      {withVeil && <div className="video-veil" />}
      {videoOk && (
        <button
          type="button"
          onClick={toggleSound}
          className="btn-ghost"
          style={{ position: 'absolute', right: 16, bottom: 16, zIndex: 3 }}
          aria-label={muted ? 'Activer le son de la vidéo' : 'Couper le son de la vidéo'}
        >
          {muted ? 'Activer le son' : 'Couper le son'}
        </button>
      )}
    </div>
  )
}
