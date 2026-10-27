import { useEffect, useState } from 'react'
import galleryData from '../data/gallery.json'
import memoriesData from '../data/memories.json'
import videosData from '../data/videos.json'
import siteConfig from '../data/site-config.json'
import { RoyalDivider, SmallHeart } from '../animations/Illustrations'

/**
 * Galerie de souvenirs : carrousel cinématographique, mosaïque élégante,
 * vue immersive plein écran, diaporama automatique.
 * Les médias proviennent exclusivement des fichiers JSON ; aucun texte
 * n'est inventé — légende fournie ou neutre sinon.
 */

type Photo = { id: string; src: string; caption: string; date: string; alt: string; order: number; category?: string }
type VideoItem = { id: string; src: string; poster?: string; caption: string; alt: string; order: number }

const photos: Photo[] = [...(galleryData as Photo[])].sort((a, b) => a.order - b.order)
const videos: VideoItem[] = [...(videosData as VideoItem[])].sort((a, b) => a.order - b.order)

/* ------------------------------------------------------------------ */
/* Image robuste avec placeholder élégant intégré au design            */
/* ------------------------------------------------------------------ */
export function SmartImage({ photo, className }: { photo: Photo; className?: string }) {
  const [failed, setFailed] = useState(false)
  if (failed || !photo.src) {
    return (
      <div className={`photo-placeholder ${className ?? ''}`} role="img" aria-label={photo.alt}>
        <SmallHeart size={28} />
        <span>{siteConfig.settings ? 'Votre photo ici' : ''}</span>
        <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>
          {`public/media/photos/${photo.src.split('/').pop() ?? 'photo.jpg'}`}
        </span>
      </div>
    )
  }
  return (
    <img
      src={photo.src}
      alt={photo.alt}
      loading="lazy"
      className={className}
      onError={() => setFailed(true)}
    />
  )
}

/* ------------------------------------------------------------------ */
/* Carrousel principal                                                 */
/* ------------------------------------------------------------------ */
function Carousel({ onOpen }: { onOpen: (i: number) => void }) {
  const [index, setIndex] = useState(0)
  const [slideshow, setSlideshow] = useState(false)

  const prev = () => setIndex((i) => (i - 1 + photos.length) % photos.length)
  const next = () => setIndex((i) => (i + 1) % photos.length)

  // Diaporama automatique : avance toutes les 4,5 s quand il est actif.
  useEffect(() => {
    if (!slideshow) return undefined
    const t = window.setInterval(() => next(), 4500)
    return () => window.clearInterval(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slideshow])

  const current = photos[index]
  if (!current) return null

  return (
    <div
      className="carousel-stage"
      role="region"
      aria-roledescription="carrousel"
      aria-label="Nos souvenirs en carrousel"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') prev()
        if (e.key === 'ArrowRight') next()
      }}
    >
      <div className="gallery-frame" style={{ cursor: 'zoom-in' }} onClick={() => onOpen(index)}>
        <div className="inner" style={{ aspectRatio: '16/9', maxHeight: '56vh' }}>
          {/* clé = transition fondu/zoom à chaque changement */}
          <div key={current.id} style={{ width: '100%', height: '100%', animation: 'fadeZoomIn 1.1s ease both' }}>
            <SmartImage photo={current} />
          </div>
        </div>
      </div>
      <p className="carousel-caption">
        {current.caption || memoriesData.neutralCaption}
        {current.date ? ` — ${current.date}` : ''}
      </p>
      <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button type="button" className="btn-ghost" onClick={prev} aria-label="Photo précédente">
          ← Précédent
        </button>
        <button type="button" className="btn-ghost" onClick={() => setSlideshow((s) => !s)} aria-pressed={slideshow}>
          {slideshow ? 'Arrêter le diaporama' : 'Diaporama'}
        </button>
        <button type="button" className="btn-ghost" onClick={next} aria-label="Photo suivante">
          Suivant →
        </button>
      </div>
      <p style={{ fontSize: '0.75rem', opacity: 0.55, marginTop: '0.6rem' }}>
        {index + 1} / {photos.length} — flèches du clavier pour naviguer
      </p>
      <style>{`@keyframes fadeZoomIn { from { opacity: 0; transform: scale(1.04); } to { opacity: 1; transform: scale(1); } }`}</style>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Mosaïque                                                            */
/* ------------------------------------------------------------------ */
function Mosaic({ onOpen }: { onOpen: (i: number) => void }) {
  return (
    <div className="mosaic">
      {photos.map((p, i) => (
        <button
          key={p.id}
          type="button"
          className="gallery-frame"
          style={{ border: 'none', textAlign: 'left', animation: `riseIn 0.8s ease ${i * 0.12}s both` }}
          onClick={() => onOpen(i)}
          aria-label={`Agrandir : ${p.alt}`}
        >
          <div className="inner" style={{ aspectRatio: '4/3' }}>
            <SmartImage photo={p} />
          </div>
          {(p.caption || p.date) && (
            <p style={{ margin: '0.5rem 0.2rem 0', fontSize: '0.85rem', color: 'rgba(245,240,230,0.75)' }}>
              {p.caption || memoriesData.neutralCaption}
              {p.date ? ` — ${p.date}` : ''}
            </p>
          )}
        </button>
      ))}
      <style>{`@keyframes riseIn { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: none; } }`}</style>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Vue immersive                                                       */
/* ------------------------------------------------------------------ */
function Immersive({ index, onClose, onNavigate }: { index: number; onClose: () => void; onNavigate: (dir: 1 | -1) => void }) {
  const p = photos[index]
  if (!p) return null
  return (
    <div
      className="overlay-modal"
      role="dialog"
      aria-modal="true"
      aria-label={p.alt}
      onClick={onClose}
      tabIndex={-1}
      onKeyDown={(e) => {
        if (e.key === 'Escape') onClose()
        if (e.key === 'ArrowRight') onNavigate(1)
        if (e.key === 'ArrowLeft') onNavigate(-1)
      }}
      ref={(el) => el?.focus()}
    >
      <div style={{ maxWidth: '94vw', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
        <div className="gallery-frame" key={p.id} style={{ animation: 'immersiveIn 0.7s ease both' }}>
          <div className="inner" style={{ aspectRatio: 'auto', maxHeight: '72vh', overflow: 'hidden' }}>
            <SmartImage photo={p} />
          </div>
        </div>
        <p className="carousel-caption">{p.caption || memoriesData.neutralCaption}{p.date ? ` — ${p.date}` : ''}</p>
        <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center' }}>
          <button type="button" className="btn-ghost" onClick={() => onNavigate(-1)} aria-label="Photo précédente">←</button>
          <button type="button" className="btn-ghost" onClick={onClose}>Fermer</button>
          <button type="button" className="btn-ghost" onClick={() => onNavigate(1)} aria-label="Photo suivante">→</button>
        </div>
      </div>
      <style>{`@keyframes immersiveIn { from { opacity: 0; transform: translateX(40px); } to { opacity: 1; transform: none; } }`}</style>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Ruban de photos défilantes (pause possible)                         */
/* ------------------------------------------------------------------ */
export function PhotoRibbon() {
  const [paused, setPaused] = useState(false)
  if (!siteConfig.settings.enablePhotoRibbon || photos.length === 0) return null
  const items = photos.length < 3 ? [...photos, ...photos, ...photos] : photos
  const doubled = [...items, ...items]
  return (
    <div>
      <div className="ribbon-mask">
        <div className={`ribbon-track ${paused ? 'paused' : ''}`}>
          {doubled.map((p, i) => (
            <div className="ribbon-item" key={`${p.id}-${i}`}>
              <SmartImage photo={p} />
            </div>
          ))}
        </div>
      </div>
      <button type="button" className="btn-ghost" style={{ marginTop: '0.8rem' }} onClick={() => setPaused((x) => !x)} aria-pressed={paused}>
        {paused ? 'Reprendre le ruban' : 'Mettre le ruban en pause'}
      </button>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Scène galerie complète                                              */
/* ------------------------------------------------------------------ */
export default function GalleryScene({ onNext }: { onNext: () => void }) {
  const [mode, setMode] = useState<'carousel' | 'mosaic'>('carousel')
  const [immersive, setImmersive] = useState<number | null>(null)
  const video = videos[0]

  return (
    <div className="scene-shell">
      <div className="scene-inner">
        <h1 className="scene-title">Notre galerie de souvenirs</h1>
        <RoyalDivider />
        <p className="scene-text" style={{ marginTop: '1.2rem' }}>{memoriesData.galleryIntro}</p>

        <div className="chapter-nav" role="tablist" aria-label="Modes de présentation">
          <button type="button" className="btn-ghost" role="tab" aria-selected={mode === 'carousel'} onClick={() => setMode('carousel')}>
            Carrousel
          </button>
          <button type="button" className="btn-ghost" role="tab" aria-selected={mode === 'mosaic'} onClick={() => setMode('mosaic')}>
            Mosaïque
          </button>
        </div>

        <div style={{ marginTop: '1.6rem' }}>
          {mode === 'carousel' ? <Carousel onOpen={setImmersive} /> : <Mosaic onOpen={setImmersive} />}
        </div>

        {video && (
          <div style={{ marginTop: '2.4rem' }}>
            <h2 style={{ fontSize: '1.2rem' }}>Un instant en mouvement</h2>
            <div className="gallery-frame" style={{ maxWidth: 720, margin: '0 auto' }}>
              <div className="inner" style={{ aspectRatio: '16/9', background: '#000' }}>
                <video
                  src={video.src}
                  poster={video.poster}
                  controls
                  playsInline
                  preload="none"
                  muted
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    const el = e.currentTarget.parentElement
                    if (el) {
                      el.innerHTML =
                        '<div class="photo-placeholder"><span>Votre vidéo ici</span><span style="font-size:0.7rem;opacity:0.7">' +
                        video.src +
                        '</span></div>'
                    }
                  }}
                />
              </div>
            </div>
          </div>
        )}

        <PhotoRibbon />

        <div style={{ marginTop: '2.4rem' }}>
          <button type="button" className="btn-royal primary" onClick={onNext}>
            Poursuivre notre histoire
          </button>
        </div>
      </div>

      {immersive !== null && (
        <Immersive
          index={immersive}
          onClose={() => setImmersive(null)}
          onNavigate={(dir) => setImmersive((i) => ((i ?? 0) + dir + photos.length) % photos.length)}
        />
      )}
    </div>
  )
}
