import { Rose, Star } from './Illustrations'

/**
 * Rideau de théâtre en velours noir, broderies dorées, roses et ornements.
 * Un panneau (gauche ou droite) ; l'autre est la symétrie via scaleX(-1).
 */
export function CurtainPanel({ side }: { side: 'left' | 'right' }) {
  const pleats = [0, 1, 2, 3, 4]
  return (
    <svg viewBox="0 0 300 900" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id={`velvet-${side}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#050505" />
          <stop offset="0.45" stopColor="#1b1815" />
          <stop offset="0.7" stopColor="#0d0c0a" />
          <stop offset="1" stopColor="#000000" />
        </linearGradient>
        <linearGradient id={`pleat-${side}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="rgba(0,0,0,0)" />
          <stop offset="0.5" stopColor="rgba(0,0,0,0.55)" />
          <stop offset="1" stopColor="rgba(244,213,141,0.06)" />
        </linearGradient>
        <radialGradient id={`innerGlow-${side}`} cx="1" cy="0.5" r="1">
          <stop offset="0" stopColor="rgba(244,213,141,0.20)" />
          <stop offset="0.5" stopColor="rgba(212,175,105,0.06)" />
          <stop offset="1" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
      </defs>

      {/* corps du rideau */}
      <rect width="300" height="900" fill={`url(#velvet-${side})`} />
      {/* plis verticaux suggérés par dégradés */}
      {pleats.map((i) => (
        <rect key={i} x={20 + i * 58} width="46" height="900" fill={`url(#pleat-${side})`} opacity="0.9" />
      ))}
      {/* lumière chaude venant de l'intérieur de la scène (bord droit du panneau gauche) */}
      <rect width="300" height="900" fill={`url(#innerGlow-${side})`} />

      {/* bordure dorée intérieure */}
      <rect x="272" y="0" width="6" height="900" fill="var(--c-gold)" opacity="0.85" />
      <rect x="284" y="0" width="2" height="900" fill="var(--c-gold-bright)" opacity="0.5" />
      {/* frange dorée au bas */}
      <g stroke="var(--c-gold)" strokeWidth="2" opacity="0.8">
        {Array.from({ length: 22 }, (_, i) => (
          <line key={i} x1={8 + i * 13} y1="876" x2={8 + i * 13} y2="896" />
        ))}
      </g>
      <rect x="0" y="868" width="300" height="8" fill="var(--c-gold)" opacity="0.55" />

      {/* broderie : rinceaux dorés */}
      <g fill="none" stroke="var(--c-gold)" strokeWidth="1.6" opacity="0.55">
        <path d="M30 120 C90 150 90 210 40 240 C100 260 120 330 60 370" className="anim-sway" />
        <path d="M250 500 C200 540 210 610 260 640 C210 680 220 750 265 780" />
        <circle cx="40" cy="240" r="4" fill="var(--c-gold-bright)" stroke="none" />
        <circle cx="260" cy="640" r="4" fill="var(--c-gold-bright)" stroke="none" />
      </g>

      {/*/roses brodées — certaines s'ouvrent lentement */}
      <g transform="translate(56 430) scale(1.5)">
        <Rose size={44} blooming />
      </g>
      <g transform="translate(150 640) scale(1.2)" className="anim-sway">
        <Rose size={40} blooming />
      </g>
      <g transform="translate(96 150) scale(1.0)">
        <Rose size={36} blooming />
      </g>

      {/* étoiles brodées disséminées */}
      {[
        [210, 90], [40, 620], [180, 300], [120, 780], [230, 480],
      ].map(([x, y], i) => (
        <g key={i} transform={`translate(${x} ${y}) scale(0.8)`} style={{ animationDelay: `${i * 0.6}s` }} className="anim-star-glow">
          <Star size={18} glow={false} />
        </g>
      ))}

      {/* petit cœur caché dans la broderie : détail discret */}
      <path
        d="M230 820 C224 814 220 810 220 806 A4.5 4.5 0 0 1 230 803.5 A4.5 4.5 0 0 1 240 806 C240 810 236 814 230 820 Z"
        fill="none"
        stroke="var(--c-gold-bright)"
        strokeWidth="1"
        opacity="0.5"
      />
    </svg>
  )
}
