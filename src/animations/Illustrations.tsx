import { useMemo } from 'react'

/**
 * Illustrations SVG originales et réutilisables.
 * Chaque composant est autonome et animable individuellement
 * (classes .anim-* définies dans styles/illustrations.css).
 */

type SvgProps = {
  className?: string
  width?: number | string
  height?: number | string
  title?: string
}

/* ------------------------------------------------------------------ */
/* Rose stylisée — pétales concentriques dorés/ivoire                  */
/* ------------------------------------------------------------------ */
export function Rose({
  className = '',
  size = 64,
  blooming = true,
  color = 'var(--c-gold)',
  accent = 'var(--c-gold-bright)',
}: SvgProps & { size?: number; blooming?: boolean; color?: string; accent?: string }) {
  return (
    <svg
      viewBox="0 0 64 96"
      width={size}
      height={(size * 96) / 64}
      className={className}
      role="img"
      aria-label="Rose dessinée"
    >
      {/* tige et feuilles */}
      <path d="M32 44 C31 60 33 74 32 94" stroke="#5d5233" strokeWidth="2" fill="none" />
      <path d="M32 66 C24 62 18 64 14 70 C22 74 29 72 32 66 Z" fill="#6b5f3a" opacity="0.85" className="anim-sway" />
      <path d="M32 78 C40 74 46 76 50 82 C42 86 35 84 32 78 Z" fill="#5d5233" opacity="0.85" />
      {/* sépales */}
      <path d="M32 46 L24 38 M32 46 L40 38 M32 46 L32 36" stroke="#6b5f3a" strokeWidth="1.6" />
      {/* couronne externe */}
      <g className={blooming ? 'anim-bloom' : ''}>
        <path d="M32 8 C44 10 50 20 46 30 C42 40 22 40 18 30 C14 20 20 10 32 8 Z" fill={color} opacity="0.55" />
        <path d="M32 12 C41 13 46 21 43 28 C40 36 24 36 21 28 C18 21 23 13 32 12 Z" fill={color} opacity="0.8" />
        <path d="M32 16 C38 17 42 22 40 27 C38 33 26 33 24 27 C22 22 26 17 32 16 Z" fill={accent} opacity="0.9" />
        <path d="M32 20 C35.5 20.5 38 24 36.5 27 C35 30.5 29 30.5 27.5 27 C26 24 28.5 20.5 32 20 Z" fill={color} />
        <circle cx="32" cy="25" r="2.4" fill={accent} />
      </g>
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Étoile à cinq branches                                              */
/* ------------------------------------------------------------------ */
export function Star({ className = '', size = 24, glow = true }: SvgProps & { size?: number; glow?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={`${glow ? 'anim-star-glow' : ''} ${className}`}
      role="img"
      aria-label="Étoile dorée"
    >
      <path
        d="M12 2 L14.4 8.6 L21.5 9 L15.9 13.5 L17.8 20.6 L12 16.6 L6.2 20.6 L8.1 13.5 L2.5 9 L9.6 8.6 Z"
        fill="var(--c-gold-bright)"
      />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Petit cœur dessiné à la main                                        */
/* ------------------------------------------------------------------ */
export function SmallHeart({ className = '', size = 20, filled = false }: SvgProps & { size?: number; filled?: boolean }) {
  return (
    <svg viewBox="0 0 32 30" width={size} height={(size * 30) / 32} className={className} role="img" aria-label="Cœur dessiné">
      <path
        d="M16 27 C7 20 3 15 3 10.5 A6.5 6.5 0 0 1 16 7 A6.5 6.5 0 0 1 29 10.5 C29 15 25 20 16 27 Z"
        fill={filled ? 'var(--c-gold)' : 'none'}
        stroke="var(--c-gold-bright)"
        strokeWidth="1.6"
      />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Pétales flottants (couche décorative plein écran)                   */
/* ------------------------------------------------------------------ */
export function FallingPetals({ count = 10 }: { count?: number }) {
  const petals = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: `${(i * 97 + 13) % 100}%`,
        delay: `${(i * 1.7) % 9}s`,
        duration: `${9 + ((i * 3.1) % 7)}s`,
        scale: 0.5 + ((i * 37) % 60) / 100,
      })),
    [count],
  )
  return (
    <div className="starfield" aria-hidden="true">
      {petals.map((p) => (
        <svg
          key={p.id}
          viewBox="0 0 20 24"
          width={16 * p.scale + 8}
          style={{
            position: 'absolute',
            left: p.left,
            top: '-40px',
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
          className="anim-petal-fall"
        >
          <path d="M10 0 C17 6 19 14 10 24 C1 14 3 6 10 0 Z" fill="var(--c-gold)" opacity="0.5" />
        </svg>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Particules dorées montantes                                         */
/* ------------------------------------------------------------------ */
export function GoldDust({ count = 18 }: { count?: number }) {
  const dots = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: `${(i * 53 + 7) % 100}%`,
        bottom: `${(i * 17) % 20}%`,
        delay: `${(i * 1.3) % 8}s`,
        duration: `${7 + ((i * 2.7) % 6)}s`,
        size: 2 + ((i * 13) % 4),
      })),
    [count],
  )
  return (
    <div className="starfield" aria-hidden="true">
      {dots.map((d) => (
        <span
          key={d.id}
          className="gold-dust anim-dust-rise"
          style={{
            left: d.left,
            bottom: d.bottom,
            width: d.size,
            height: d.size,
            animationDelay: d.delay,
            animationDuration: d.duration,
          }}
        />
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Ciel étoilé + constellation "FC" discrète (détail caché)           */
/* ------------------------------------------------------------------ */
export function StarField({ count = 60 }: { count?: number }) {
  const stars = useMemo(() => {
    let seed = 7
    const rnd = () => {
      seed = (seed * 9301 + 49297) % 233280
      return seed / 233280
    }
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: rnd() * 100,
      y: rnd() * 62,
      r: 0.6 + rnd() * 1.6,
      delay: rnd() * 4,
    }))
  }, [count])
  return (
    <svg className="starfield" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
      {stars.map((s) => (
        <circle
          key={s.id}
          cx={s.x}
          cy={s.y}
          r={s.r * 0.28}
          fill="var(--c-ivory)"
          className="twinkle"
          style={{ animationDelay: `${s.delay}s` }}
        />
      ))}
      {/* Constellation discrète en haut à droite : détail caché */}
      <g stroke="var(--c-gold-bright)" strokeWidth="0.12" opacity="0.5">
        <polyline points="82,10 85,14 88,11 91,15 89,19" fill="none" />
        <polyline points="93,12 96,10 97,14" fill="none" />
        {[
          [82, 10], [85, 14], [88, 11], [91, 15], [89, 19], [93, 12], [96, 10], [97, 14],
        ].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="0.45" fill="var(--c-gold-bright)" className="twinkle" style={{ animationDelay: `${i * 0.4}s` }} />
        ))}
      </g>
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Personnage en stick — le Roi (couronne, cape suggérée)              */
/* posture: 'welcome' | 'bow' | 'sad' | 'walk'                          */
/* ------------------------------------------------------------------ */
export function KingFigure({
  size = 180,
  posture = 'welcome',
  bouncing = false,
  bowing = false,
}: {
  size?: number
  posture?: 'welcome' | 'bow' | 'sad' | 'walk'
  bouncing?: boolean
  bowing?: boolean
}) {
  const headTilt = posture === 'sad' ? 14 : posture === 'bow' ? 22 : -4
  const armWave = posture === 'welcome'
  const sadArms = posture === 'sad'
  return (
    <svg
      viewBox="0 0 120 170"
      width={size}
      height={(size * 170) / 120}
      className={[
        'anim-breathe',
        bouncing ? 'anim-bounce-once' : '',
        bowing ? 'anim-bow' : '',
      ].join(' ')}
      role="img"
      aria-label="Le roi, personnage dessiné en lignes dorées"
    >
      {/* cape suggérée */}
      <path d="M60 58 C40 74 36 120 40 142 L80 142 C84 120 80 74 60 58 Z" fill="var(--c-velvet)" stroke="var(--c-gold)" strokeWidth="1.4" opacity="0.9" />
      {/* corps */}
      <line x1="60" y1="52" x2="60" y2="112" stroke="var(--c-gold-bright)" strokeWidth="3" strokeLinecap="round" />
      {/* jambes */}
      {posture === 'walk' ? (
        <>
          <g className="anim-leg-a" style={{ transformOrigin: '60px 112px' }}>
            <line x1="60" y1="112" x2="48" y2="150" stroke="var(--c-gold-bright)" strokeWidth="3" strokeLinecap="round" />
          </g>
          <g className="anim-leg-b" style={{ transformOrigin: '60px 112px' }}>
            <line x1="60" y1="112" x2="72" y2="150" stroke="var(--c-gold-bright)" strokeWidth="3" strokeLinecap="round" />
          </g>
        </>
      ) : (
        <>
          <line x1="60" y1="112" x2="50" y2="152" stroke="var(--c-gold-bright)" strokeWidth="3" strokeLinecap="round" />
          <line x1="60" y1="112" x2="70" y2="152" stroke="var(--c-gold-bright)" strokeWidth="3" strokeLinecap="round" />
        </>
      )}
      {/* bras */}
      {armWave && (
        <g className="anim-wave" style={{ transformOrigin: '60px 66px' }}>
          <path d="M60 66 C74 60 82 48 86 36" stroke="var(--c-gold-bright)" strokeWidth="3" fill="none" strokeLinecap="round" />
          <circle cx="87" cy="33" r="3.4" fill="var(--c-ivory)" />
        </g>
      )}
      {armWave && (
        <path d="M60 66 C50 76 46 88 46 98" stroke="var(--c-gold-bright)" strokeWidth="3" fill="none" strokeLinecap="round" />
      )}
      {sadArms && (
        <>
          <path d="M60 66 C52 76 50 88 52 98" stroke="var(--c-gold-bright)" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M60 66 C68 76 70 88 68 98" stroke="var(--c-gold-bright)" strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* petite larme suggérée */}
          <path d="M66 30 C67 33 66 35 65 35 C64 35 63 33 64 30 Z" fill="var(--c-gold-bright)" opacity="0.7" />
        </>
      )}
      {(posture === 'bow' || posture === 'walk') && (
        <>
          <path d="M60 66 C50 74 46 84 46 94" stroke="var(--c-gold-bright)" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M60 66 C70 74 74 84 74 94" stroke="var(--c-gold-bright)" strokeWidth="3" fill="none" strokeLinecap="round" />
        </>
      )}
      {/* tête */}
      <g style={{ transform: `rotate(${headTilt}deg)`, transformOrigin: '60px 40px' }}>
        <circle cx="60" cy="34" r="15" fill="none" stroke="var(--c-gold-bright)" strokeWidth="3" />
        {/* regards suggérés */}
        <circle cx="55" cy="32" r="1.6" fill="var(--c-ivory)" />
        <circle cx="65" cy="32" r="1.6" fill="var(--c-ivory)" />
        {/* sourire ou tristesse */}
        {posture === 'sad' ? (
          <path d="M55 42 Q60 39 65 42" stroke="var(--c-ivory)" strokeWidth="1.6" fill="none" />
        ) : (
          <path d="M55 40 Q60 44 65 40" stroke="var(--c-ivory)" strokeWidth="1.6" fill="none" />
        )}
        {/* couronne */}
        <path
          d="M46 18 L48 8 L54 15 L60 5 L66 15 L72 8 L74 18 Z"
          fill="var(--c-gold)"
          stroke="var(--c-gold-bright)"
          strokeWidth="1.2"
        />
        <circle cx="60" cy="9" r="1.8" fill="var(--c-gold-bright)" />
      </g>
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Personnage en stick — la Reine (diadème, robe suggestive)          */
/* ------------------------------------------------------------------ */
export function QueenFigure({ size = 180, holding = false }: { size?: number; holding?: boolean }) {
  return (
    <svg
      viewBox="0 0 120 170"
      width={size}
      height={(size * 170) / 120}
      className="anim-breathe"
      role="img"
      aria-label="La reine, personnage dessiné en lignes ivoire"
    >
      {/* robe */}
      <path d="M60 56 C42 78 34 120 32 152 L88 152 C86 120 78 78 60 56 Z" fill="var(--c-velvet)" stroke="var(--c-ivory)" strokeWidth="1.3" opacity="0.92" />
      <path d="M40 120 Q60 128 80 120" stroke="var(--c-gold)" strokeWidth="1.2" fill="none" opacity="0.7" />
      <path d="M37 136 Q60 145 83 136" stroke="var(--c-gold)" strokeWidth="1.2" fill="none" opacity="0.7" />
      {/* buste */}
      <line x1="60" y1="50" x2="60" y2="86" stroke="var(--c-ivory)" strokeWidth="2.6" strokeLinecap="round" />
      {/* bras */}
      {holding ? (
        <path d="M60 62 C68 70 74 76 80 80" stroke="var(--c-ivory)" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      ) : (
        <>
          <path d="M60 62 C52 70 48 78 47 86" stroke="var(--c-ivory)" strokeWidth="2.6" fill="none" strokeLinecap="round" />
          <path d="M60 62 C68 70 72 78 73 86" stroke="var(--c-ivory)" strokeWidth="2.6" fill="none" strokeLinecap="round" />
        </>
      )}
      {/* tête inclinée avec douceur */}
      <g style={{ transform: 'rotate(-6deg)', transformOrigin: '60px 36px' }}>
        <circle cx="60" cy="32" r="14" fill="none" stroke="var(--c-ivory)" strokeWidth="2.6" />
        <circle cx="55.5" cy="30" r="1.5" fill="var(--c-gold-bright)" />
        <circle cx="64.5" cy="30" r="1.5" fill="var(--c-gold-bright)" />
        <path d="M56 38 Q60 41.5 64 38" stroke="var(--c-gold-bright)" strokeWidth="1.5" fill="none" />
        {/* diadème */}
        <path d="M47 18 Q60 10 73 18 L71 21 Q60 15 49 21 Z" fill="var(--c-gold)" />
        <circle cx="60" cy="13.5" r="2" fill="var(--c-gold-bright)" />
      </g>
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Château / palais stylisé pour la silhouette nocturne               */
/* ------------------------------------------------------------------ */
export function Palace({ width = '100%' }: { width?: number | string }) {
  return (
    <svg
      viewBox="0 0 600 220"
      width={width}
      preserveAspectRatio="xMidYMax meet"
      style={{ display: 'block', opacity: 0.9 }}
      role="img"
      aria-label="Palais royal stylisé"
    >
      <defs>
        <linearGradient id="palaceGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1b1915" />
          <stop offset="1" stopColor="#0b0a09" />
        </linearGradient>
      </defs>
      <path
        d="M0 220 L0 170 L60 170 L60 120 L80 100 L100 120 L100 170 L160 170 L160 110 L180 90 L200 110 L200 60 L215 40 L230 60 L230 110 L250 95 L270 110 L300 80 L330 110 L350 95 L370 110 L370 60 L385 40 L400 60 L400 110 L420 90 L440 110 L440 170 L500 170 L500 120 L520 100 L540 120 L540 170 L600 170 L600 220 Z"
        fill="url(#palaceGrad)"
        stroke="var(--c-gold)"
        strokeWidth="1.2"
      />
      {/* fenêtres illuminées */}
      {[
        [212, 70], [382, 70], [296, 100], [90, 140], [510, 140], [180, 140], [420, 140],
      ].map(([x, y], i) => (
        <rect key={i} x={x} y={y} width="7" height="11" rx="3" fill="var(--c-gold-bright)" className="twinkle" style={{ animationDelay: `${i * 0.7}s` }} />
      ))}
      {/* drapeaux */}
      <path d="M215 40 L215 26 L232 31 L215 36" fill="var(--c-gold)" className="anim-sway" />
      <path d="M385 40 L385 26 L402 31 L385 36" fill="var(--c-gold)" className="anim-sway" />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Lanterne flottante                                                  */
/* ------------------------------------------------------------------ */
export function Lantern({ size = 34, delay = 0 }: { size?: number; delay?: number }) {
  return (
    <svg
      viewBox="0 0 40 60"
      width={size}
      height={size * 1.5}
      className="anim-lantern"
      style={{ animationDelay: `${delay}s` }}
      role="img"
      aria-label="Lanterne lumineuse"
    >
      <line x1="20" y1="0" x2="20" y2="12" stroke="var(--c-gold)" strokeWidth="1.2" />
      <rect x="10" y="12" width="20" height="30" rx="8" fill="rgba(244,213,141,0.22)" stroke="var(--c-gold)" strokeWidth="1.4" />
      <ellipse cx="20" cy="27" rx="5" ry="8" fill="var(--c-gold-bright)" opacity="0.85" />
      <rect x="12" y="42" width="16" height="4" rx="2" fill="var(--c-gold)" />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Ornement royal (séparateur de titres)                               */
/* ------------------------------------------------------------------ */
export function RoyalDivider({ width = 260 }: { width?: number }) {
  return (
    <svg viewBox="0 0 260 24" width={width} height={24} aria-hidden="true" style={{ maxWidth: '80vw' }}>
      <path d="M0 12 H95" stroke="var(--c-gold)" strokeWidth="1" opacity="0.7" />
      <path d="M165 12 H260" stroke="var(--c-gold)" strokeWidth="1" opacity="0.7" />
      <path d="M130 4 C136 8 138 10 138 12 C138 15 134 18 130 20 C126 18 122 15 122 12 C122 10 124 8 130 4 Z" fill="none" stroke="var(--c-gold-bright)" strokeWidth="1.2" />
      <circle cx="100" cy="12" r="2" fill="var(--c-gold)" />
      <circle cx="160" cy="12" r="2" fill="var(--c-gold)" />
      <path d="M112 12 Q121 6 122 12 Q121 18 112 12 Z" fill="var(--c-gold)" opacity="0.6" />
      <path d="M148 12 Q139 6 138 12 Q139 18 148 12 Z" fill="var(--c-gold)" opacity="0.6" />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Cadre décoratif d'angle (utilisé autour des scènes)                 */
/* ------------------------------------------------------------------ */
export function CornerOrnament({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 90 90" width={72} height={72} className={className} aria-hidden="true">
      <path d="M4 90 C4 40 40 4 90 4" fill="none" stroke="var(--c-gold)" strokeWidth="1.4" />
      <path d="M12 90 C12 48 48 12 90 12" fill="none" stroke="var(--c-gold)" strokeWidth="0.8" opacity="0.6" />
      <circle cx="30" cy="30" r="3" fill="var(--c-gold-bright)" opacity="0.8" />
      <path d="M30 30 C22 22 22 14 30 8 C34 16 34 24 30 30 Z" fill="var(--c-gold)" opacity="0.5" />
      <path d="M30 30 C38 38 46 38 52 30 C44 26 36 26 30 30 Z" fill="var(--c-gold)" opacity="0.5" />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Plume d'écriture (scène finale)                                     */
/* ------------------------------------------------------------------ */
export function Quill({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 80" width={44} height={58} className={className} role="img" aria-label="Plume d'écriture">
      <path d="M8 74 C20 50 34 22 54 6 C56 30 46 56 26 70 C20 74 14 76 8 74 Z" fill="var(--c-velvet)" stroke="var(--c-gold-bright)" strokeWidth="1.6" />
      <path d="M14 70 C26 52 38 30 50 12" stroke="var(--c-gold)" strokeWidth="1" fill="none" opacity="0.7" />
      <path d="M8 74 L4 78" stroke="var(--c-gold-bright)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Maison du futur                                                     */
/* ------------------------------------------------------------------ */
export function LittleHouse({ size = 120 }: { size?: number }) {
  return (
    <svg viewBox="0 0 140 110" width={size} height={(size * 110) / 140} role="img" aria-label="Petite maison illuminée">
      <path d="M20 50 L70 14 L120 50" fill="none" stroke="var(--c-gold-bright)" strokeWidth="2.4" strokeLinecap="round" />
      <rect x="30" y="50" width="80" height="50" fill="var(--c-velvet)" stroke="var(--c-gold)" strokeWidth="1.6" />
      <rect x="58" y="70" width="22" height="30" rx="2" fill="none" stroke="var(--c-gold-bright)" strokeWidth="1.6" />
      <rect x="38" y="58" width="14" height="14" rx="2" fill="var(--c-gold-bright)" opacity="0.85" className="twinkle" />
      <rect x="86" y="58" width="14" height="14" rx="2" fill="var(--c-gold-bright)" opacity="0.85" className="twinkle" style={{ animationDelay: '1.2s' }} />
      <path d="M100 24 L100 10 L108 10 L108 32" fill="var(--c-velvet)" stroke="var(--c-gold)" strokeWidth="1.4" />
    </svg>
  )
}

/* ------------------------------------------------------------------ */
/* Grand cœur formé par des particules (promesse finale)               */
/* ------------------------------------------------------------------ */
export function ParticleHeart({ size = 260 }: { size?: number }) {
  const pts = useMemo(() => {
    // Points paramétriques d'un cœur, pseudo-aléatoires et stables
    const out: { x: number; y: number; r: number; d: number }[] = []
    for (let i = 0; i < 90; i++) {
      const t = (i / 90) * Math.PI * 2
      const jitter = ((i * 37) % 10) - 5
      const x = 16 * Math.pow(Math.sin(t), 3)
      const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 6 * Math.cos(3 * t) - 2 * Math.cos(4 * t))
      out.push({ x: 50 + x * 2.6 + jitter * 0.6, y: 50 + y * 2.6 + jitter * 0.4, r: 0.6 + ((i * 13) % 5) * 0.22, d: (i % 12) * 0.18 })
    }
    return out
  }, [])
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className="anim-heartbeat" role="img" aria-label="Cœur formé de particules dorées">
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={p.r} fill="var(--c-gold-bright)" className="twinkle" style={{ animationDelay: `${p.d}s` }} />
      ))}
      <path
        d="M50 78 C28 62 18 50 18 38 A14 14 0 0 1 50 30 A14 14 0 0 1 82 38 C82 50 72 62 50 78 Z"
        fill="none"
        stroke="var(--c-gold)"
        strokeWidth="0.5"
        opacity="0.45"
      />
    </svg>
  )
}
