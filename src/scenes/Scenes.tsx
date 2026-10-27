import { useEffect, useMemo, useRef, useState } from 'react'
import siteConfig from '../data/site-config.json'
import letter from '../data/love-letter.json'
import promises from '../data/promises.json'
import {
  FallingPetals,
  GoldDust,
  KingFigure,
  Lantern,
  LittleHouse,
  Palace,
  ParticleHeart,
  QueenFigure,
  Rose,
  RoyalDivider,
  SmallHeart,
  Star,
  StarField,
} from '../animations/Illustrations'
import { CurtainPanel } from '../animations/CurtainPanel'
import { VideoBackdrop } from '../components/VideoBackdrop'

/* ==================================================================== */
/* SCÈNE 1 — L'OUVERTURE DU RIDEAU                                      */
/* ==================================================================== */
export function CurtainScene({ onOpen }: { onOpen: () => void }) {
  const [opening, setOpening] = useState(false)
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const duration = reduced ? 0.4 : siteConfig.settings.curtainOpenDurationMs / 1000

  return (
    <div className="scene-shell" style={{ background: '#050505' }}>
      {/* Le royaume révélé derrière le rideau */}
      <div className="scene-inner" style={{ zIndex: 10 }}>
        {opening && (
          <>
            <h1
              className="scene-title"
              style={{
                fontSize: 'clamp(2rem, 7vw, 4.4rem)',
                animation: `revealTitle ${duration + 0.8}s ease ${Math.max(duration - 0.6, 0.2)}s both`,
                textShadow: '0 0 40px rgba(244,213,141,0.45)',
              }}
            >
              {siteConfig.kingdomName}
            </h1>
            <RoyalDivider />
            {!reduced && <GoldDust count={24} />}
            <button
              type="button"
              className="btn-royal primary"
              style={{ animation: `riseIn 1s ease ${duration + 0.9}s both`, marginTop: '2rem' }}
              onClick={onOpen}
            >
              Pénétrer dans le royaume
            </button>
          </>
        )}
      </div>

      {/* pétales qui tombent sur la scène révélée */}
      {opening && !reduced && <FallingPetals count={8} />}

      {/* Les deux rideaux */}
      <div className="curtain-stage">
        <div
          className="curtain-panel left"
          style={{
            transform: opening ? 'translateX(-102%) skewX(-2deg)' : 'none',
            transition: `transform ${duration}s cubic-bezier(0.65, 0, 0.2, 1)`,
          }}
        >
          <CurtainPanel side="left" />
        </div>
        <div
          className="curtain-panel right"
          style={{
            transform: opening ? 'translateX(102%) skewX(2deg)' : 'none',
            transition: `transform ${duration}s cubic-bezier(0.65, 0, 0.2, 1)`,
          }}
        >
          <CurtainPanel side="right" />
        </div>
      </div>

      {/* Invitation initiale au centre du rideau fermé */}
      {!opening && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.6rem',
            zIndex: 40,
            padding: '1rem',
          }}
        >
          <p className="handwriting" style={{ fontSize: 'clamp(1.3rem, 4vw, 2rem)', margin: 0, textAlign: 'center' }}>
            {siteConfig.curtainTeaser}
          </p>
          <button type="button" className="btn-royal primary" onClick={() => setOpening(true)}>
            Ouvrir le rideau
          </button>
        </div>
      )}

      <style>{`
        @keyframes revealTitle { from { opacity: 0; letter-spacing: 0.4em; filter: blur(6px); } to { opacity: 1; letter-spacing: 0.04em; filter: blur(0); } }
        @keyframes riseIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: none; } }
      `}</style>
    </div>
  )
}

/* ==================================================================== */
/* SCÈNE 2 — L'INVITATION DE LA REINE                                   */
/* ==================================================================== */
const KING_REACTIONS = [
  'Votre Majesté, mon cœur attend votre verdict…',
  'Même les étoiles espèrent un oui.',
  'Le roi commence à perdre ses moyens…',
  'Je crois que mon cœur vient de faire un petit bond.',
  'La couronne s’est légèrement inclinée d’émotion…',
]

export function InvitationScene({ onAccept }: { onAccept: () => void }) {
  const [refusals, setRefusals] = useState(0)
  const [message, setMessage] = useState<string | null>(null)
  const [bounceKey, setBounceKey] = useState(0)
  const [accepted, setAccepted] = useState(false)
  const [dust, setDust] = useState(false)

  // Croissance contrôlée : 1 → 1.6 max, jamais plus.
  const yesScale = Math.min(1 + refusals * 0.15, 1.6)

  const handleRefusal = (label: string) => {
    setRefusals((r) => r + 1)
    setMessage(`${KING_REACTIONS[refusals % KING_REACTIONS.length]} (${label})`)
    setBounceKey((k) => k + 1)
    setDust(true)
    window.setTimeout(() => setDust(false), 1800)
  }

  const handleAccept = () => {
    setAccepted(true)
    window.setTimeout(onAccept, 2200)
  }

  return (
    <div className="scene-shell">
      <StarField count={40} />
      <div className="scene-inner">
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <div key={bounceKey}>
            <KingFigure size={190} posture={accepted ? 'bow' : 'welcome'} bouncing={!accepted && bounceKey > 0} bowing={accepted} />
          </div>
          <div style={{ position: 'absolute', left: -70, bottom: -6 }}>
            <Rose size={46} blooming={!accepted ? true : true} />
          </div>
          <div style={{ position: 'absolute', right: -70, bottom: -6 }}>
            <Rose size={46} blooming />
          </div>
          {dust && <GoldDust count={14} />}
        </div>

        <h1 className="scene-title" style={{ marginTop: '1.4rem', fontSize: 'clamp(1.3rem, 3.6vw, 2.1rem)' }}>
          {siteConfig.invitationLine}
        </h1>
        <p className="scene-text" style={{ fontSize: '1.15rem' }}>Acceptez-vous d'entrer&nbsp;?</p>

        {message && (
          <p className="handwriting" role="status" aria-live="polite" style={{ fontSize: '1.3rem', minHeight: '1.6em' }}>
            {message}
          </p>
        )}

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center', gap: '0.4rem' }}>
          <button
            type="button"
            className="btn-royal primary"
            onClick={handleAccept}
            disabled={accepted}
            style={{
              transform: `scale(${yesScale})`,
              transition: 'transform 0.7s cubic-bezier(0.34, 1.56, 0.64, 1)',
              zIndex: 2,
            }}
          >
            Oui, j'accepte
          </button>
          <button type="button" className="btn-royal" onClick={() => handleRefusal('Non')} disabled={accepted}>
            Non
          </button>
          <button type="button" className="btn-royal" onClick={() => handleRefusal('Peut-être…')} disabled={accepted}>
            Peut-être…
          </button>
          <button type="button" className="btn-royal" onClick={() => handleRefusal('Pourquoi pas ?')} disabled={accepted}>
            Pourquoi pas&nbsp;?
          </button>
        </div>

        {accepted && (
          <p className="handwriting" style={{ fontSize: '1.5rem', marginTop: '1.6rem', animation: 'riseIn 1s ease both' }}>
            Un passage de lumière s'ouvre devant vous…
          </p>
        )}
      </div>
      <style>{`@keyframes riseIn { from { opacity: 0; transform: translateY(20px);} to { opacity: 1; transform: none; } }`}</style>
    </div>
  )
}

/* ==================================================================== */
/* SCÈNE 3 — L'ENTRÉE DANS LE ROYAUME                                   */
/* ==================================================================== */
export function KingdomScene({ onNext, secretStarEnabled, onSecretFound }: {
  onNext: () => void
  secretStarEnabled: boolean
  onSecretFound: () => void
}) {
  const [revealed, setRevealed] = useState(0)
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // Révélation progressive de la phrase, segment par segment.
  useEffect(() => {
    if (revealed >= 3) return
    const t = window.setTimeout(() => setRevealed((r) => r + 1), reduced ? 300 : 1600)
    return () => window.clearTimeout(t)
  }, [revealed, reduced])

  const segments = [
    'Dans ce royaume, chaque étoile porte un souvenir,',
    'chaque rose raconte un instant,',
    'et chaque chemin me ramène vers toi.',
  ]

  return (
    <div className="scene-shell">
      <StarField count={70} />
      <div className="kingdom-floor" />

      {/* Palais et lanternes */}
      <div style={{ position: 'absolute', bottom: '8%', left: 0, right: 0, zIndex: 1 }}>
        <Palace width="100%" />
      </div>
      {[12, 30, 68, 85].map((x, i) => (
        <div key={i} style={{ position: 'absolute', left: `${x}%`, top: `${12 + (i % 2) * 8}%`, zIndex: 1 }}>
          <Lantern delay={i * 1.4} />
        </div>
      ))}

      {/* Chemin doré en perspective */}
      <svg viewBox="0 0 100 40" preserveAspectRatio="none" style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '34%', zIndex: 1 }} aria-hidden="true">
        <path d="M44 0 C40 14 26 26 6 40 L94 40 C74 26 60 14 56 0 Z" fill="rgba(212,175,105,0.10)" stroke="rgba(244,213,141,0.35)" strokeWidth="0.3" />
      </svg>

      {/* Roses qui s'ouvrent au passage */}
      {[
        { x: 16, d: 0.4 }, { x: 28, d: 1.2 }, { x: 70, d: 2.0 }, { x: 82, d: 2.8 },
      ].map((r, i) => (
        <div key={i} style={{ position: 'absolute', bottom: `${6 + (i % 2) * 4}%`, left: `${r.x}%`, zIndex: 2, animationDelay: `${r.d}s` }}>
          <Rose size={40 + i * 6} blooming />
        </div>
      ))}

      {/* Deux personnages qui avancent ensemble */}
      <div className={reduced ? '' : 'anim-walk-scene'} style={{ position: 'absolute', bottom: '9%', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 10, alignItems: 'flex-end', zIndex: 3 }}>
        <KingFigure size={120} posture="walk" />
        <QueenFigure size={120} holding />
      </div>

      {/* Étoile secrète cliquable (épilogue facultatif) */}
      {secretStarEnabled && (
        <button
          type="button"
          onClick={onSecretFound}
          aria-label="Une petite étoile attire votre attention…"
          style={{ position: 'absolute', top: '16%', right: '10%', background: 'none', border: 'none', padding: 8, zIndex: 4 }}
        >
          <Star size={26} />
        </button>
      )}

      <div className="scene-inner" style={{ paddingTop: '18vh' }}>
        <div aria-live="polite">
          {segments.slice(0, revealed).map((s, i) => (
            <p key={i} className="scene-text handwriting" style={{ fontSize: 'clamp(1.2rem, 3.4vw, 1.9rem)', animation: 'softIn 1.6s ease both' }}>
              {s}
            </p>
          ))}
        </div>
        {revealed >= 3 && (
          <button type="button" className="btn-royal primary" style={{ marginTop: '1.4rem', animation: 'softIn 1.2s ease both' }} onClick={onNext}>
            Découvrir ce que mon cœur veut te dire
          </button>
        )}
      </div>
      {!reduced && <GoldDust count={16} />}
      <style>{`@keyframes softIn { from { opacity: 0; transform: translateY(14px); filter: blur(3px);} to { opacity: 1; transform: none; filter: blur(0);} }`}</style>
    </div>
  )
}

/* ==================================================================== */
/* SCÈNE 4 — LA GRANDE DÉCLARATION D'AMOUR                              */
/* ==================================================================== */
export function DeclarationScene({ onNext, musicPlaying, onToggleMusic, musicAvailable }: {
  onNext: () => void
  musicPlaying: boolean
  onToggleMusic: () => void
  musicAvailable: boolean
}) {
  const [shown, setShown] = useState(0)
  const [allAtOnce, setAllAtOnce] = useState(false)
  const total = letter.paragraphs.length
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (allAtOnce || shown >= total) return
    const t = window.setTimeout(() => setShown((s) => s + 1), reduced ? 200 : 3400)
    return () => window.clearTimeout(t)
  }, [shown, allAtOnce, total, reduced])

  const progress = Math.round(((allAtOnce ? total : shown) / total) * 100)

  return (
    <div className="scene-shell">
      {!reduced && <FallingPetals count={7} />}
      <div className="scene-inner" style={{ width: 'min(760px, 94vw)' }}>
        <h1 className="scene-title">La grande déclaration</h1>
        <RoyalDivider />

        <div className="letter-scroll" style={{ marginTop: '1.6rem' }} aria-live="polite">
          <p className="letter-opening">{letter.opening}</p>
          {(allAtOnce ? letter.paragraphs : letter.paragraphs.slice(0, shown)).map((p, i) => (
            <p key={i} className="letter-paragraph" style={allAtOnce ? undefined : { animation: 'paraIn 1.6s ease both' }}>
              {p}
            </p>
          ))}
          {shown < total && !allAtOnce && (
            <p style={{ opacity: 0.5, fontStyle: 'italic' }}>
              <span className="typewriter-caret" aria-hidden="true" />
            </p>
          )}
        </div>

        <div className="progress-thin" aria-hidden="true">
          <span style={{ width: `${progress}%` }} />
        </div>
        <p className="sr-only">Progression de la lettre : {progress}&nbsp;%</p>

        <div style={{ marginTop: '1.4rem', display: 'flex', gap: '0.6rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {!allAtOnce && shown < total && (
            <button type="button" className="btn-ghost" onClick={() => setShown(total)} aria-label="Afficher toute la lettre immédiatement">
              Lire tout immédiatement
            </button>
          )}
          {!allAtOnce && shown < total && (
            <button type="button" className="btn-ghost" onClick={() => setShown((s) => Math.min(s + 1, total))} aria-label="Paragraph suivant">
              Paragraphe suivant
            </button>
          )}
          {musicAvailable && (
            <button type="button" className="btn-ghost" onClick={onToggleMusic} aria-pressed={musicPlaying}>
              {musicPlaying ? 'Couper la musique' : 'Musique douce'}
            </button>
          )}
          {(allAtOnce || shown >= total) && (
            <button type="button" className="btn-royal primary" onClick={onNext}>
              {letter.continueLabel}
            </button>
          )}
        </div>
      </div>
      <style>{`@keyframes paraIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }`}</style>
    </div>
  )
}

/* ==================================================================== */
/* SCÈNE 6 — REGRETS ET PARDON                                          */
/* ==================================================================== */
export function RegretsScene({ onNext }: { onNext: () => void }) {
  const [shown, setShown] = useState(0)
  const total = promises.regretsParagraphs.length

  useEffect(() => {
    if (shown >= total) return
    const t = window.setTimeout(() => setShown((s) => s + 1), 900)
    return () => window.clearTimeout(t)
  }, [shown, total])

  return (
    <div className="scene-shell" style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 30%, rgba(212,175,105,0.05), transparent 60%), #080808' }}>
      <div className="scene-inner" style={{ width: 'min(640px, 92vw)' }}>
        <KingFigure size={150} posture="sad" />
        <h1 className="scene-title" style={{ fontSize: 'clamp(1.4rem, 4vw, 2.2rem)' }}>{promises.regretsTitle}</h1>
        <div aria-live="polite">
          {promises.regretsParagraphs.slice(0, shown).map((p, i) => (
            <p key={i} className="letter-paragraph" style={{ animation: 'paraIn 2s ease both', textAlign: 'center' }}>{p}</p>
          ))}
        </div>
        {shown >= total && (
          <p className="handwriting" style={{ fontSize: 'clamp(1.2rem, 3.4vw, 1.7rem)', marginTop: '1.6rem', animation: 'paraIn 2.4s ease both' }}>
            «&nbsp;{promises.regretsClosing}&nbsp;»
          </p>
        )}
        {shown >= total && (
          <button type="button" className="btn-royal primary" style={{ marginTop: '1.8rem' }} onClick={onNext}>
            Avancer ensemble vers demain
          </button>
        )}
      </div>
      <style>{`@keyframes paraIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
    </div>
  )
}

/* ==================================================================== */
/* SCÈNE 7 — LE FUTUR QUE J'IMAGINE                                     */
/* ==================================================================== */
export function FutureScene({ onNext }: { onNext: () => void }) {
  const [step, setStep] = useState(0)
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (step >= 4) return
    const t = window.setTimeout(() => setStep((s) => s + 1), reduced ? 250 : 1500)
    return () => window.clearTimeout(t)
  }, [step, reduced])

  return (
    <div className="scene-shell" style={{ background: 'radial-gradient(ellipse 90% 60% at 50% 100%, rgba(244,213,141,0.14), transparent 60%), #0a0908' }}>
      <StarField count={50} />

      {/* Horizon lumineux */}
      <div style={{ position: 'absolute', bottom: '22%', left: '50%', transform: 'translateX(-50%)', width: '60%', height: '2px', background: 'linear-gradient(90deg, transparent, var(--c-gold-bright), transparent)', opacity: step >= 1 ? 0.9 : 0, transition: 'opacity 2s' }} aria-hidden="true" />

      {/* Chemin qui se prolonge */}
      <svg viewBox="0 0 100 30" preserveAspectRatio="none" style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '26%' }} aria-hidden="true">
        <path d="M46 30 C48 20 49 10 50 0 C51 10 52 20 54 30 Z" fill="rgba(244,213,141,0.16)" opacity={step >= 1 ? 1 : 0} style={{ transition: 'opacity 2s' }} />
      </svg>

      {/* Maison, fleurs, fenêtres illuminées */}
      <div style={{ position: 'absolute', bottom: '20%', left: '12%', opacity: step >= 2 ? 1 : 0, transform: step >= 2 ? 'none' : 'translateY(16px)', transition: 'all 2s ease' }}>
        <LittleHouse size={130} />
      </div>
      {[24, 36, 62, 74, 86].map((x, i) => (
        <div key={i} style={{ position: 'absolute', bottom: `${5 + (i % 3) * 3}%`, left: `${x}%`, opacity: step >= 2 ? 1 : 0, transition: `opacity 1.8s ease ${i * 0.4}s` }}>
          <Rose size={30 + (i % 3) * 8} blooming={step >= 2} />
        </div>
      ))}

      {/* Deux personnages marchant vers l'horizon */}
      <div style={{ position: 'absolute', bottom: '8%', left: '50%', transform: step >= 3 ? 'translateX(-50%) translateY(-4vh)' : 'translateX(-50%)', transition: 'transform 6s ease-in-out', display: 'flex', gap: 8, alignItems: 'flex-end', zIndex: 3 }}>
        <KingFigure size={110} posture="walk" />
        <QueenFigure size={110} holding />
      </div>

      <div className="scene-inner" style={{ paddingBottom: '34vh' }}>
        <h1 className="scene-title">{promises.futureTitle}</h1>
        <div aria-live="polite">
          {promises.futureParagraphs.map((p, i) => (
            <p key={i} className="scene-text" style={{ opacity: step > i ? 1 : 0, transition: 'opacity 2s ease' }}>{p}</p>
          ))}
        </div>
        {step >= 4 && (
          <>
            <p className="handwriting" style={{ fontSize: 'clamp(1.3rem, 4vw, 2rem)', animation: 'paraIn 2s ease both', maxWidth: '24ch', margin: '1rem auto' }}>
              {promises.futureStrongLine}
            </p>
            <button type="button" className="btn-royal primary" style={{ animation: 'paraIn 1.5s ease 0.6s both' }} onClick={onNext}>
              ma promesse
            </button>
          </>
        )}
      </div>
      <style>{`@keyframes paraIn { from { opacity: 0; transform: translateY(12px);} to { opacity: 1; transform: none;} }`}</style>
    </div>
  )
}

/* ==================================================================== */
/* SCÈNE 8 — LA PROMESSE FINALE                                         */
/* ==================================================================== */
export function PromiseScene({ onContinue }: { onContinue: () => void }) {
  const [phase, setPhase] = useState(0) // 0 noir, 1 lumière, 2 personnages, 3 cœur, 4 texte, 5 question
  const [answer, setAnswer] = useState<'yes' | 'maybe' | 'later' | null>(null)
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (phase >= 5) return
    const t = window.setTimeout(() => setPhase((p) => p + 1), reduced ? 350 : 2100)
    return () => window.clearTimeout(t)
  }, [phase, reduced])

  return (
    <div className="scene-shell" style={{ background: phase < 1 ? '#030303' : undefined }}>
      {/* Lumière dorée centrale */}
      <div style={{
        position: 'absolute', left: '50%', top: '45%', transform: 'translate(-50%,-50%)',
        width: phase >= 1 ? '70vmin' : '0', height: phase >= 1 ? '70vmin' : '0',
        background: 'radial-gradient(circle, rgba(244,213,141,0.22), transparent 65%)',
        transition: 'all 3s ease', zIndex: 1,
      }} aria-hidden="true" />

      <div className="scene-inner">
        {/* Personnages qui se rapprochent */}
        {phase >= 2 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 0, marginBottom: '-1.2rem' }}>
            <div style={{ transform: 'translateX(24px)', transition: 'transform 3s ease' }}>
              <KingFigure size={120} posture="welcome" />
            </div>
            <div style={{ transform: 'translateX(-24px)', transition: 'transform 3s ease' }}>
              <QueenFigure size={120} holding />
            </div>
          </div>
        )}

        {/* Cœur formé de particules */}
        {phase >= 3 && (
          <div style={{ animation: 'heartAppear 2.6s ease both', margin: '0.5rem auto' }}>
            <ParticleHeart size={220} />
          </div>
        )}

        {/* Déclaration finale */}
        {phase >= 4 && (
          <p className="handwriting" style={{ fontSize: 'clamp(1.4rem, 4.6vw, 2.4rem)', maxWidth: '30ch', margin: '1.4rem auto', lineHeight: 1.6, animation: 'paraIn 3s ease both' }}>
            {promises.promiseFinal}
          </p>
        )}

        {phase >= 5 && !answer && (
          <div style={{ animation: 'paraIn 1.5s ease both' }}>
            <p className="scene-text">{promises.finalQuestion}</p>
            <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button type="button" className="btn-royal primary" onClick={() => setAnswer('yes')}>Oui, avec toi</button>
              <button type="button" className="btn-royal" onClick={() => setAnswer('maybe')}>Peut-être…</button>
              <button type="button" className="btn-royal" onClick={() => setAnswer('later')}>Laissons le temps</button>
            </div>
          </div>
        )}

        {answer && (
          <div style={{ animation: 'paraIn 1.6s ease both' }}>
            <p className="handwriting" style={{ fontSize: 'clamp(1.2rem, 3.6vw, 1.8rem)', maxWidth: '36ch', margin: '1rem auto' }}>
              {promises.finalAnswers[answer]}
            </p>
            <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1.4rem' }}>
              <button type="button" className="btn-royal primary" onClick={onContinue}>
                Poursuivre…
              </button>
            </div>
            <div style={{ marginTop: '1.6rem', display: 'flex', justifyContent: 'center', gap: 12, opacity: 0.8 }}>
              <SmallHeart size={18} filled />
              <Star size={18} />
              <SmallHeart size={18} />
            </div>
          </div>
        )}
      </div>
      {!reduced && phase >= 3 && <GoldDust count={20} />}
      <style>{`
        @keyframes heartAppear { from { opacity: 0; transform: scale(0.6); } to { opacity: 1; transform: scale(1); } }
        @keyframes paraIn { from { opacity: 0; transform: translateY(14px);} to { opacity: 1; transform: none;} }
      `}</style>
    </div>
  )
}

/* ==================================================================== */
/* SCÈNE 9 — ÉPILOGUE SECRET                                            */
/* ==================================================================== */
export function EpilogueScene({ onBack }: { onBack: () => void }) {
  return (
    <div className="scene-shell">
      <StarField count={80} />
      {!window.matchMedia('(prefers-reduced-motion: reduce)').matches && <GoldDust count={26} />}
      <div className="scene-inner" style={{ width: 'min(620px, 92vw)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <Star size={54} />
        </div>
        <h1 className="scene-title" style={{ fontSize: 'clamp(1.4rem, 4vw, 2.2rem)' }}>L'épilogue secret</h1>
        <RoyalDivider />
        <div className="letter-scroll" style={{ marginTop: '1.4rem' }}>
          <p className="letter-opening">Une lettre que le royaume gardait pour toi…</p>
          <p className="letter-paragraph handwriting" style={{ fontSize: 'clamp(1.2rem, 3vw, 1.5rem)' }}>
            {promises.epilogue.secretLetter}
          </p>
        </div>
        <button type="button" className="btn-royal" style={{ marginTop: '1.6rem' }} onClick={onBack}>
          Revenir à la promesse
        </button>
      </div>
    </div>
  )
}

/* ==================================================================== */
/* SCÈNE FINALE — LA LETTRE QUI S'ÉCRIT DEVANT ELLE                     */
/* ==================================================================== */
export function FinalLetterScene({ onRestart, onGallery, onDeclaration }: { onRestart: () => void; onGallery: () => void; onDeclaration: () => void }) {
  const fullText = useMemo(
    () => `${letter.opening}\n\n${letter.paragraphs.join('\n\n')}\n\n${letter.closing}`,
    [],
  )
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const speed = siteConfig.settings.animationSpeed || 1

  const [typed, setTyped] = useState(reduced ? fullText.length : 0)
  const [skipRequested, setSkipRequested] = useState(false)
  const done = typed >= fullText.length
  const containerRef = useRef<HTMLDivElement | null>(null)
  const quillRef = useRef<HTMLSpanElement | null>(null)

  // Machine à écrire : environ 26 caractères/seconde divisés par la vitesse.
  useEffect(() => {
    if (done && !skipRequested) return
    if (!reduced && skipRequested) {
      setTyped(fullText.length)
      return
    }
    if (reduced) {
      setTyped(fullText.length)
      return
    }
    const t = window.setTimeout(() => {
      setTyped((n) => Math.min(n + 2, fullText.length))
    }, 45 / speed)
    return () => window.clearTimeout(t)
  }, [typed, done, skipRequested, fullText, reduced, speed])

  // La plume suit la dernière lettre tapée + défilement doux.
  useEffect(() => {
    const el = document.getElementById('final-letter-text')
    const quill = quillRef.current
    if (!el || !quill) return
    const range = document.createRange()
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
    let remaining = typed
    let node: Node | null = null
    while ((node = walker.nextNode())) {
      const len = node.textContent?.length ?? 0
      if (remaining <= len) {
        range.setStart(node, Math.max(remaining, 0))
        range.collapse(true)
        break
      }
      remaining -= len
      range.setEndAfter(node)
      range.collapse(true)
    }
    const rects = range.getClientRects()
    const rect = rects.length ? rects[0] : el.getBoundingClientRect()
    const host = containerRef.current?.getBoundingClientRect()
    if (host) {
      quill.style.left = `${rect.left - host.left + 10}px`
      quill.style.top = `${rect.top - host.top - 34}px`
    }
  }, [typed])

  // Signature manuscrite animée après la lettre.
  const signaturePath = 'M14 44 C24 20 34 12 40 16 C46 20 34 42 28 50 C24 56 26 60 34 56 C46 50 58 34 66 26 C70 22 74 24 72 32 C70 42 60 52 66 54 C74 56 86 40 96 30 C102 24 108 26 104 36 C100 46 96 52 104 52 C114 52 124 40 132 34'

  return (
    <div className="scene-shell" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 20%, rgba(212,175,105,0.08), transparent 60%), #060605' }}>
      {!reduced && <FallingPetals count={6} />}
      <div className="scene-inner" style={{ width: 'min(760px, 94vw)' }}>
        <div style={{ position: 'relative' }} ref={containerRef}>
          <div className="letter-scroll" style={{ minHeight: '40vh' }}>
            <pre
              id="final-letter-text"
              style={{
                fontFamily: 'var(--font-hand)',
                fontSize: 'clamp(1.15rem, 3vw, 1.55rem)',
                lineHeight: 1.9,
                color: 'var(--c-ivory)',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                margin: 0,
              }}
              aria-label={fullText}
            >
              {fullText.slice(0, typed)}
              {!done && <span className="typewriter-caret" />}
            </pre>

            {/* Plume qui suit l'écriture */}
            {!done && (
              <span ref={quillRef} style={{ position: 'absolute', transition: 'left 0.12s linear, top 0.12s linear', pointerEvents: 'none', zIndex: 5 }}>
                <QuillLocal />
                <span className="quill-glow" style={{ position: 'absolute', left: -2, top: 44 }} />
              </span>
            )}
          </div>
        </div>

        {/* Signature tracée à la main */}
        {done && (
          <div style={{ marginTop: '1.2rem', animation: 'fadeUp 1.6s ease both', textAlign: 'right', paddingRight: '8%' }}>
            <svg viewBox="0 0 140 70" width={200} height={100} aria-label={`Signature : ${letter.signature}`}>
              <path
                className="signature-path draw-stroke"
                style={{ ['--len' as string]: 420, ['--draw-duration' as string]: reduced ? '0.01s' : '3.2s' }}
                d={signaturePath}
              />
            </svg>
            <p className="letter-signature" style={{ marginRight: '6%', marginTop: '-0.4em' }}>{letter.signature}</p>
          </div>
        )}

        <div style={{ marginTop: '1.6rem', display: 'flex', gap: '0.7rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {!done && (
            <button type="button" className="btn-ghost" onClick={() => setSkipRequested(true)}>
              Terminer la lecture
            </button>
          )}
          {done && (
            <>
              <button type="button" className="btn-royal primary" onClick={onRestart}>
                Revivre l'expérience
              </button>
              <button type="button" className="btn-royal" onClick={onDeclaration}>
                Relire la déclaration
              </button>
              <button type="button" className="btn-royal" onClick={onGallery}>
                Retrouver nos souvenirs
              </button>
            </>
          )}
        </div>
      </div>
      <style>{`@keyframes fadeUp { from { opacity: 0; transform: translateY(16px);} to { opacity: 1; transform: none;} }`}</style>
    </div>
  )
}

/* Petite plume locale (évite un import circulaire de Quill si besoin) */
function QuillLocal() {
  return (
    <svg viewBox="0 0 60 80" width={34} height={45} aria-hidden="true" style={{ transform: 'rotate(-8deg)' }}>
      <path d="M8 74 C20 50 34 22 54 6 C56 30 46 56 26 70 C20 74 14 76 8 74 Z" fill="var(--c-velvet)" stroke="var(--c-gold-bright)" strokeWidth="1.8" />
      <path d="M14 70 C26 52 38 30 50 12" stroke="var(--c-gold)" strokeWidth="1" fill="none" opacity="0.7" />
      <path d="M8 74 L4 78" stroke="var(--c-gold-bright)" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  )
}
