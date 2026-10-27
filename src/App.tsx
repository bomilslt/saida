import { useEffect, useReducer, useState } from 'react'
import siteConfig from './data/site-config.json'
import {
  CurtainScene,
  DeclarationScene,
  EpilogueScene,
  FinalLetterScene,
  FutureScene,
  InvitationScene,
  KingdomScene,
  PromiseScene,
  RegretsScene,
} from './scenes/Scenes'
import GalleryScene from './scenes/GalleryScene'
import {
  CHAPTER_ORDER,
  clearProgress,
  initialProgress,
  loadProgress,
  progressReducer,
  saveProgress,
  type ChapterId,
} from './animations/stateMachine'
import { useBackgroundMusic } from './components/useAudio'
import { VideoBackdrop } from './components/VideoBackdrop'

/** Transitions distinctes par scène (fondu, montée, glissement lent…). */
const sceneAnimations: Record<string, string> = {
  curtain: '',
  invitation: 'sceneFade 1.2s ease both',
  kingdom: 'sceneRise 1.6s cubic-bezier(0.2,0.8,0.2,1) both',
  declaration: 'sceneFade 2s ease both',
  gallery: 'sceneSlide 1.3s ease both',
  regrets: 'sceneFade 2.6s ease both',
  future: 'sceneRise 1.8s ease both',
  promise: 'sceneFade 3s ease both',
  epilogue: 'sceneGlow 2s ease both',
  finalletter: 'sceneFade 2.4s ease both',
}

export default function App() {
  const [progress, dispatch] = useReducer(progressReducer, initialProgress, (init) => {
    if (!siteConfig.settings.saveProgressLocally) return init
    return loadProgress() ?? init
  })
  const music = useBackgroundMusic()
  const [showChapters, setShowChapters] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // Sauvegarde locale de la progression
  useEffect(() => {
    if (siteConfig.settings.saveProgressLocally) saveProgress(progress)
  }, [progress])

  // Transition sonore discrète entre chapitres
  useEffect(() => {
    music.chime('soft')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress.current])

  // Plein écran : suivi d'état
  useEffect(() => {
    const onChange = () => setIsFullscreen(Boolean(document.fullscreenElement))
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [])

  const goto = (chapter: ChapterId) => dispatch({ type: 'GOTO', chapter })
  const next = () => dispatch({ type: 'NEXT' })

  const restart = () => {
    clearProgress()
    dispatch({ type: 'RESET' })
    window.scrollTo({ top: 0 })
  }

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) await document.documentElement.requestFullscreen()
      else await document.exitFullscreen()
    } catch {
      /* refusé par le navigateur : on ignore proprement */
    }
  }

  const currentIdx = CHAPTER_ORDER.indexOf(progress.current)
  const chapterLabel = siteConfig.chapters.find((c) => c.id === progress.current)?.label ?? ''

  let scene = null
  switch (progress.current) {
    case 'curtain':
      scene = (
        <>
          {siteConfig.media.showVideoOnCurtainScene && <VideoBackdrop />}
          <CurtainScene onOpen={() => goto('invitation')} onOpenCurtain={music.play} />
        </>
      )
      break
    case 'invitation':
      scene = (
        <InvitationScene
          onAccept={() => {
            dispatch({ type: 'ACCEPT_QUEEN' })
            dispatch({ type: 'GOTO', chapter: 'kingdom' })
          }}
        />
      )
      break
    case 'kingdom':
      scene = (
        <KingdomScene
          onNext={next}
          secretStarEnabled={siteConfig.settings.enableSecretStar}
          onSecretFound={() => {
            music.chime('reveal')
            dispatch({ type: 'FIND_SECRET' })
          }}
        />
      )
      break
    case 'declaration':
      scene = (
        <DeclarationScene
          onNext={next}
          musicPlaying={music.playing}
          onToggleMusic={music.toggle}
          musicAvailable={music.available}
        />
      )
      break
    case 'gallery':
      scene = <GalleryScene onNext={next} />
      break
    case 'regrets':
      scene = <RegretsScene onNext={next} />
      break
    case 'future':
      scene = <FutureScene onNext={next} />
      break
    case 'promise':
      scene = <PromiseScene onContinue={next} />
      break
    case 'finalletter':
      scene = (
        <FinalLetterScene
          onRestart={restart}
          onGallery={() => goto('gallery')}
          onDeclaration={() => goto('declaration')}
        />
      )
      break
    case 'epilogue':
      scene = <EpilogueScene onBack={() => goto('promise')} />
      break
  }

  return (
    <>
      {/* HUD : indicateur de progression + contrôles globaux */}
      {progress.current !== 'curtain' && (
        <div className="hud">
          <div className="hud-progress" role="navigation" aria-label="Progression des chapitres">
            {CHAPTER_ORDER.map((id, i) => (
              <button
                key={id}
                type="button"
                className={`hud-dot ${i < currentIdx ? 'done' : ''} ${id === progress.current ? 'current' : ''}`}
                disabled={!progress.visited.includes(id)}
                onClick={() => progress.visited.includes(id) && goto(id)}
                aria-label={`Chapitre ${i + 1} : ${siteConfig.chapters[i]?.label ?? id}${progress.visited.includes(id) ? '' : ' (à découvrir)'}`}
                style={{ cursor: progress.visited.includes(id) ? 'pointer' : 'default' }}
              />
            ))}
            <span className="hud-label">{chapterLabel}</span>
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            {music.available && (
              <button type="button" className="btn-ghost" onClick={music.toggle} aria-pressed={music.playing} aria-label={music.playing ? 'Mettre la musique en pause' : 'Lancer la musique'}>
                <span className="hud-btn-full">{music.playing ? 'Musique : en cours' : 'Musique'}</span>
                <span className="hud-btn-compact" aria-hidden="true">♪</span>
              </button>
            )}
            {music.available && music.playing && (
              <input
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={music.volume}
                onChange={(e) => music.changeVolume(Number(e.target.value))}
                aria-label="Volume de la musique"
                className="hud-volume"
                style={{ accentColor: 'var(--c-gold)' }}
              />
            )}
            {siteConfig.settings.enableFullscreenButton && (
              <button type="button" className="btn-ghost" onClick={toggleFullscreen} aria-pressed={isFullscreen}>
                <span className="hud-btn-full">{isFullscreen ? 'Quitter plein écran' : 'Plein écran'}</span>
                <span className="hud-btn-compact" aria-hidden="true">⛶</span>
              </button>
            )}
            <button type="button" className="btn-ghost" onClick={() => setShowChapters((s) => !s)} aria-expanded={showChapters} aria-label="Chapitres">
              <span className="hud-btn-full">Chapitres</span>
              <span className="hud-btn-compact" aria-hidden="true">☰</span>
            </button>
            <button type="button" className="btn-ghost" onClick={restart} aria-label="Recommencer l'expérience depuis le début">
              <span className="hud-btn-full">Recommencer</span>
              <span className="hud-btn-compact" aria-hidden="true">↺</span>
            </button>
          </div>
        </div>
      )}

      {/* Menu des chapitres déjà visités (accès direct) */}
      {showChapters && (
        <div className="overlay-modal" role="dialog" aria-modal="true" aria-label="Chapitres disponibles" onClick={() => setShowChapters(false)}>
          <div className="letter-scroll" style={{ textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
            <h2>Les chapitres du royaume</h2>
            <div className="chapter-nav">
              {siteConfig.chapters.map((c) => {
                const unlocked = progress.visited.includes(c.id as ChapterId) || (c.id === 'epilogue' && progress.secretFound && progress.visited.includes('promise'))
                return (
                  <button
                    key={c.id}
                    type="button"
                    className="btn-royal"
                    style={{ opacity: unlocked ? 1 : 0.35 }}
                    disabled={!unlocked}
                    onClick={() => {
                      if (unlocked) {
                        goto(c.id as ChapterId)
                        setShowChapters(false)
                      }
                    }}
                  >
                    {c.label}
                  </button>
                )
              })}
            </div>
            <p style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: '1rem' }}>Seuls les chapitres découverts sont accessibles.</p>
            <button type="button" className="btn-ghost" style={{ marginTop: '0.8rem' }} onClick={() => setShowChapters(false)}>
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* Étoile secrète trouvée dans la scène royaume → proposition d'épilogue après la promesse */}
      {progress.secretFound && progress.current === 'promise' && (
        <button
          type="button"
          className="btn-ghost"
          style={{ position: 'fixed', bottom: 18, right: 18, zIndex: 60 }}
          onClick={() => goto('epilogue')}
        >
          Une étoile brille encore…
        </button>
      )}

      {/* Scène active — une seule à la fois, animation dédiée */}
      <div key={progress.current} style={{ animation: sceneAnimations[progress.current] || undefined }}>
        {scene}
      </div>

      <style>{`
        @keyframes sceneFade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes sceneRise { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: none; } }
        @keyframes sceneSlide { from { opacity: 0; transform: translateX(-3vw); } to { opacity: 1; transform: none; } }
        @keyframes sceneGlow { from { opacity: 0; filter: brightness(2.4) blur(4px); } to { opacity: 1; filter: none; } }
      `}</style>
    </>
  )
}
