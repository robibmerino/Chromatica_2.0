import { useUniqueSvgIds } from '../../QuienTinderCards/useUniqueSvgIds';
import { SilhouetteFrame } from '../SilhouetteFrame';
import { getSilhouetteMetadata } from '../silhouetteMetadata';
import type { QuienSilhouetteProps } from '../types';

const SILHOUETTE_ID = 3 as const;

const DEFAULT_COLOR = '#34d399';

const textLinesLeft = [177, 181, 185, 189, 193];
const textLinesRight = [177, 181, 185, 189, 193];

const particles = [
  { x: 58, y: 95, r: 0.9 },
  { x: 48, y: 118, r: 0.7 },
  { x: 128, y: 128, r: 0.8 },
  { x: 42, y: 155, r: 0.6 },
  { x: 130, y: 158, r: 0.7 },
  { x: 46, y: 180, r: 0.5 },
  { x: 118, y: 178, r: 0.6 },
  { x: 88, y: 68, r: 0.8 },
  { x: 94, y: 72, r: 0.5 },
  { x: 55, y: 88, r: 0.6 },
  { x: 106, y: 132, r: 0.7 },
  { x: 40, y: 140, r: 0.5 },
];

/**
 * Archivista: figura encorvada sobre libro abierto, con pluma y símbolos flotantes.
 * Simboliza el conocimiento, la preservación y la sabiduría.
 */
export function Archivista({
  className = '',
  color = DEFAULT_COLOR,
  hideLabel = false,
}: QuienSilhouetteProps) {
  const svgId = useUniqueSvgIds('archivista');
  const ids = {
    aura1: svgId('aura1'),
    aura2: svgId('aura2'),
    body: svgId('body'),
    book: svgId('book'),
    blur1: svgId('blur1'),
    blur2: svgId('blur2'),
    blur3: svgId('blur3'),
    glow: svgId('glow'),
  };

  const cDim = `${color}55`;

  const meta = getSilhouetteMetadata(SILHOUETTE_ID);

  return (
    <SilhouetteFrame
      title={meta?.name ?? 'Archivista'}
      subtitle={meta?.subtitle ?? 'Sabiduría'}
      variant={meta?.labelVariant ?? 'emerald'}
      className={className}
      hideLabel={hideLabel}
    >
      <g transform="translate(100, 160) scale(1.48) translate(-100, -160) translate(14, 38)">
        <defs>
          <radialGradient id={ids.aura1} cx="45%" cy="50%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.13" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={ids.aura2} cx="45%" cy="50%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.22" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={ids.body} cx="40%" cy="25%" r="65%">
            <stop offset="0%" stopColor={color} stopOpacity="0.95" />
            <stop offset="55%" stopColor={color} stopOpacity="0.75" />
            <stop offset="100%" stopColor={color} stopOpacity="0.1" />
          </radialGradient>
          <radialGradient id={ids.book} cx="35%" cy="30%" r="60%">
            <stop offset="0%" stopColor="white" stopOpacity="0.9" />
            <stop offset="40%" stopColor={color} stopOpacity="0.8" />
            <stop offset="100%" stopColor={color} stopOpacity="0.3" />
          </radialGradient>
          <filter id={ids.blur1}>
            <feGaussianBlur stdDeviation="10" />
          </filter>
          <filter id={ids.blur2}>
            <feGaussianBlur stdDeviation="5" />
          </filter>
          <filter id={ids.blur3}>
            <feGaussianBlur stdDeviation="2" />
          </filter>
          <filter id={ids.glow}>
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Auras */}
        <ellipse cx="95" cy="165" rx="62" ry="75" fill={`url(#${ids.aura1})`} filter={`url(#${ids.blur1})`} />
        <ellipse cx="95" cy="165" rx="42" ry="52" fill={`url(#${ids.aura2})`} filter={`url(#${ids.blur2})`} />

        {/* Libro abierto */}
        <ellipse cx="88" cy="196" rx="28" ry="5" fill={color} opacity="0.08" filter={`url(#${ids.blur3})`} />
        <path
          d="M58,172 Q62,168 72,170 Q78,171 80,175 L80,195 Q78,197 72,196 Q62,194 58,192 Z"
          fill={`url(#${ids.book})`}
          opacity="0.85"
        />
        <path d="M58,172 Q65,174 80,175" fill="none" stroke="white" strokeWidth="0.5" opacity="0.6" />
        <path
          d="M80,175 Q86,171 96,170 Q104,169 108,172 L108,192 Q104,194 96,196 Q86,197 80,195 Z"
          fill={`url(#${ids.book})`}
          opacity="0.75"
        />
        <path d="M108,172 Q96,173 80,175" fill="none" stroke="white" strokeWidth="0.5" opacity="0.5" />
        <path d="M80,175 L80,195" stroke="white" strokeWidth="1.2" opacity="0.9" />
        <path d="M80,175 L80,195" stroke={color} strokeWidth="0.4" opacity="0.6" />

        {/* Texto página izquierda */}
        {textLinesLeft.map((y, i) => (
          <line
            key={`tl-${i}`}
            x1={61 + i * 0.3}
            y1={y}
            x2={77 - i * 0.2}
            y2={y}
            stroke="white"
            strokeWidth="0.6"
            opacity={0.5 - i * 0.06}
          />
        ))}
        {/* Texto página derecha */}
        {textLinesRight.map((y, i) => (
          <line
            key={`tr-${i}`}
            x1={83 + i * 0.2}
            y1={y}
            x2={105 - i * 0.3}
            y2={y}
            stroke="white"
            strokeWidth="0.6"
            opacity={0.45 - i * 0.05}
          />
        ))}
        <circle cx="96" cy="183" r="4" fill={color} opacity="0.25" />
        <circle cx="96" cy="183" r="2" fill="white" opacity="0.5" />

        {/* Pluma */}
        <path d="M112,155 L124,135" stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
        <path d="M112,155 L124,135" stroke="white" strokeWidth="0.8" strokeLinecap="round" opacity="0.9" />
        <path d="M124,135 Q128,128 122,130" fill="none" stroke={color} strokeWidth="0.8" opacity="0.7" />
        <path d="M122,138 Q127,132 121,134" fill="none" stroke={color} strokeWidth="0.7" opacity="0.6" />
        <path d="M120,141 Q125,136 119,138" fill="none" stroke={color} strokeWidth="0.6" opacity="0.5" />
        <path d="M124,135 Q118,129 120,133" fill="none" stroke={cDim} strokeWidth="0.8" opacity="0.7" />
        <path d="M122,138 Q116,133 118,137" fill="none" stroke={cDim} strokeWidth="0.7" opacity="0.6" />
        <path d="M112,155 L110,162" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
        <path d="M110,162 L111,165" stroke="white" strokeWidth="0.8" strokeLinecap="round" opacity="0.9" />
        <circle cx="111" cy="165" r="1.5" fill="white" opacity="0.95" filter={`url(#${ids.glow})`} />
        <circle cx="111" cy="165" r="3" fill={color} opacity="0.3" />

        {/* Manto trasero */}
        <path
          d="M72,95 Q58,110 52,140 Q48,165 54,190 Q62,195 70,192 Q66,165 68,140 Q70,120 80,110"
          fill={`url(#${ids.body})`}
          opacity="0.35"
        />
        <path d="M60,125 Q56,150 58,175" stroke={color} strokeWidth="0.5" opacity="0.3" fill="none" />
        <path d="M55,135 Q52,158 54,178" stroke={color} strokeWidth="0.4" opacity="0.25" fill="none" />

        {/* Torso encorvado */}
        <path
          d="M78,88 Q68,95 65,108 Q62,120 68,128 Q76,135 84,132 Q90,128 92,120 Q94,110 88,100 Q84,93 78,88 Z"
          fill={`url(#${ids.body})`}
          opacity="0.9"
        />
        <path d="M72,100 Q68,112 70,124" stroke="white" strokeWidth="0.6" opacity="0.4" fill="none" />
        <path d="M78,96 Q75,108 76,120" stroke="white" strokeWidth="0.4" opacity="0.3" fill="none" />

        {/* Hombro izquierdo */}
        <path
          d="M68,128 Q60,132 58,142 Q56,150 62,153 Q70,154 76,148 Q80,142 78,134 Q74,130 68,128 Z"
          fill={`url(#${ids.body})`}
          opacity="0.85"
        />

        {/* Brazo izquierdo */}
        <path
          d="M62,153 Q58,162 60,172 Q62,180 68,182"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          opacity="0.7"
        />
        <path
          d="M62,153 Q58,162 60,172 Q62,180 68,182"
          fill="none"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.5"
        />

        {/* Mano izquierda */}
        <path d="M68,182 Q66,185 64,184" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.75" />
        <path d="M68,182 Q67,186 65,186" stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
        <path d="M68,182 Q69,186 68,187" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.65" />
        <path d="M68,182 Q71,185 71,186" stroke={color} strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />
        <path d="M68,182 Q66,185 64,184" stroke="white" strokeWidth="0.5" strokeLinecap="round" opacity="0.5" />

        {/* Hombro derecho */}
        <path
          d="M84,132 Q92,130 98,136 Q104,142 100,150 Q96,156 88,155 Q82,152 80,144 Q80,136 84,132 Z"
          fill={`url(#${ids.body})`}
          opacity="0.85"
        />

        {/* Brazo derecho */}
        <path
          d="M100,150 Q108,148 114,152 Q116,156 112,158"
          fill="none"
          stroke={color}
          strokeWidth="7"
          strokeLinecap="round"
          opacity="0.7"
        />
        <path
          d="M100,150 Q108,148 114,152 Q116,156 112,158"
          fill="none"
          stroke="white"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.45"
        />

        {/* Mano derecha */}
        <path d="M112,158 Q114,155 116,153" stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity="0.75" />
        <path d="M112,158 Q115,157 117,156" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.7" />
        <path d="M112,158 Q114,160 116,160" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.65" />
        <path d="M112,158 Q112,161 113,163" stroke={color} strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />
        <path d="M112,158 Q114,155 116,153" stroke="white" strokeWidth="0.5" strokeLinecap="round" opacity="0.5" />

        {/* Piernas */}
        <path
          d="M68,128 Q64,145 60,165 Q58,178 64,188"
          fill="none"
          stroke={color}
          strokeWidth="9"
          strokeLinecap="round"
          opacity="0.65"
        />
        <path
          d="M78,132 Q76,148 74,168 Q73,180 76,190"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          opacity="0.6"
        />
        <path d="M69,135 Q66,152 63,170" stroke="white" strokeWidth="0.6" opacity="0.3" fill="none" />

        {/* Manto frontal */}
        <path
          d="M68,128 Q62,138 60,155 Q58,170 62,185 Q66,190 72,190 Q74,175 74,158 Q74,142 76,132"
          fill={`url(#${ids.body})`}
          opacity="0.4"
        />
        <path d="M64,140 Q62,158 64,178" stroke="white" strokeWidth="0.5" opacity="0.25" fill="none" />
        <path d="M70,135 Q68,155 70,175" stroke="white" strokeWidth="0.4" opacity="0.2" fill="none" />

        {/* Cabeza y capucha */}
        <path
          d="M78,88 Q76,84 76,80 Q76,76 80,74 Q84,72 86,76 Q88,80 86,84 Q84,88 80,88 Z"
          fill={`url(#${ids.body})`}
          opacity="0.9"
        />
        <path
          d="M72,80 Q70,70 74,62 Q78,56 84,58 Q90,60 90,68 Q90,76 86,82 Q82,86 76,84 Z"
          fill={`url(#${ids.body})`}
          opacity="0.88"
        />
        <path d="M76,72 Q78,66 82,66 Q86,66 86,72 Q86,78 82,80 Q78,80 76,76 Z" fill="black" opacity="0.6" />
        <ellipse cx="81" cy="73" rx="4" ry="3" fill={color} opacity="0.12" />

        {/* Símbolos flotantes */}
        <g opacity="0.8" filter={`url(#${ids.glow})`}>
          <ellipse cx="48" cy="148" rx="6" ry="6" fill={color} opacity="0.12" />
          <path d="M48,142 L52,148 L48,154 L44,148 Z" fill="none" stroke={color} strokeWidth="0.8" />
          <path d="M48,142 L52,148 L48,154 L44,148 Z" fill="none" stroke="white" strokeWidth="0.3" opacity="0.7" />
          <circle cx="48" cy="148" r="1" fill="white" opacity="0.9" />
        </g>
        <g opacity="0.75" filter={`url(#${ids.glow})`}>
          <ellipse cx="120" cy="118" rx="6" ry="6" fill={color} opacity="0.12" />
          <path d="M116,120 Q118,114 120,120" fill="none" stroke={color} strokeWidth="0.9" />
          <path d="M117,122 Q120,114 123,122" fill="none" stroke={color} strokeWidth="0.8" opacity="0.8" />
          <path d="M118,124 Q120,116 122,124" fill="none" stroke="white" strokeWidth="0.4" opacity="0.7" />
          <circle cx="120" cy="119" r="0.8" fill="white" opacity="0.85" />
        </g>
        <g opacity="0.7" filter={`url(#${ids.glow})`}>
          <ellipse cx="52" cy="108" rx="5" ry="5" fill={color} opacity="0.1" />
          <path
            d="M52,108 Q54,105 56,108 Q58,112 54,114 Q50,116 48,112 Q46,108 50,105"
            fill="none"
            stroke={color}
            strokeWidth="0.9"
          />
          <path
            d="M52,108 Q54,105 56,108 Q58,112 54,114 Q50,116 48,112 Q46,108 50,105"
            fill="none"
            stroke="white"
            strokeWidth="0.3"
            opacity="0.6"
          />
          <circle cx="52" cy="108" r="0.8" fill="white" opacity="0.8" />
        </g>
        <g opacity="0.72" filter={`url(#${ids.glow})`}>
          <ellipse cx="126" cy="145" rx="5" ry="5" fill={color} opacity="0.1" />
          <line x1="122" y1="145" x2="130" y2="145" stroke={color} strokeWidth="0.8" />
          <line x1="126" y1="141" x2="126" y2="149" stroke={color} strokeWidth="0.8" />
          <line x1="122" y1="145" x2="130" y2="145" stroke="white" strokeWidth="0.3" opacity="0.6" />
          <circle cx="126" cy="145" r="1.2" fill={color} opacity="0.8" />
          <circle cx="126" cy="145" r="0.5" fill="white" opacity="0.95" />
          <circle cx="122" cy="145" r="0.7" fill={color} opacity="0.7" />
          <circle cx="130" cy="145" r="0.7" fill={color} opacity="0.7" />
          <circle cx="126" cy="141" r="0.7" fill={color} opacity="0.7" />
          <circle cx="126" cy="149" r="0.7" fill={color} opacity="0.7" />
        </g>
        <g opacity="0.65" filter={`url(#${ids.glow})`}>
          <ellipse cx="44" cy="170" rx="5" ry="5" fill={color} opacity="0.1" />
          <path d="M44,165 L48,173 L40,173 Z" fill="none" stroke={color} strokeWidth="0.8" />
          <path d="M44,165 L48,173 L40,173 Z" fill="none" stroke="white" strokeWidth="0.3" opacity="0.6" />
          <circle cx="44" cy="170" r="0.8" fill="white" opacity="0.8" />
        </g>
        <g opacity="0.6" filter={`url(#${ids.glow})`}>
          <ellipse cx="122" cy="168" rx="5" ry="5" fill={color} opacity="0.08" />
          <line x1="118" y1="165" x2="126" y2="165" stroke={color} strokeWidth="0.8" />
          <line x1="118" y1="168" x2="126" y2="168" stroke={color} strokeWidth="0.6" />
          <line x1="119" y1="171" x2="125" y2="171" stroke={color} strokeWidth="0.5" />
          <line x1="118" y1="165" x2="126" y2="165" stroke="white" strokeWidth="0.3" opacity="0.5" />
        </g>
        <g opacity="0.68" filter={`url(#${ids.glow})`}>
          <ellipse cx="50" cy="130" rx="5" ry="5" fill={color} opacity="0.1" />
          <path d="M45,130 Q50,125 55,130 Q50,135 45,130 Z" fill="none" stroke={color} strokeWidth="0.8" />
          <path d="M45,130 Q50,125 55,130 Q50,135 45,130 Z" fill="none" stroke="white" strokeWidth="0.3" opacity="0.6" />
          <circle cx="50" cy="130" r="1.5" fill={color} opacity="0.6" />
          <circle cx="50" cy="130" r="0.6" fill="white" opacity="0.9" />
        </g>

        {/* Partículas */}
        {particles.map((p, i) => (
          <g key={`p-${i}`}>
            <circle cx={p.x} cy={p.y} r={p.r * 2.5} fill={color} opacity="0.12" />
            <circle cx={p.x} cy={p.y} r={p.r} fill="white" opacity={0.5 + (i % 3) * 0.1} />
          </g>
        ))}

        {/* Aura cabeza */}
        <ellipse
          cx="82"
          cy="72"
          rx="18"
          ry="14"
          fill={`url(#${ids.aura2})`}
          filter={`url(#${ids.blur3})`}
          opacity="0.6"
        />
      </g>
    </SilhouetteFrame>
  );
}
