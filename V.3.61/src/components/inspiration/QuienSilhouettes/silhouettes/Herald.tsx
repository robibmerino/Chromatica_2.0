import { useUniqueSvgIds } from '../../QuienTinderCards/useUniqueSvgIds';
import { SilhouetteFrame } from '../SilhouetteFrame';
import { getSilhouetteMetadata } from '../silhouetteMetadata';
import type { QuienSilhouetteProps } from '../types';

const SILHOUETTE_ID = 11 as const;

const DEFAULT_COLOR = '#f472b6';

const resonanceNodes = [
  { x: 162, y: 18, r: 2.5 },
  { x: 174, y: 14, r: 2 },
  { x: 167, y: 48, r: 2 },
  { x: 180, y: 52, r: 1.8 },
  { x: 185, y: 30, r: 2.2 },
  { x: 192, y: 25, r: 1.5 },
];

const fingerPaths = [
  { d: 'M120,228 C116,236 114,243 116,248' },
  { d: 'M124,226 C121,234 120,242 122,248' },
  { d: 'M128,225 C126,233 126,241 128,247' },
  { d: 'M132,226 C131,234 131,241 132,246' },
  { d: 'M136,228 C136,235 136,241 136,245' },
];

const particles = [
  { x: 42, y: 80, r: 1.8, o: 0.7 },
  { x: 160, y: 65, r: 1.4, o: 0.6 },
  { x: 35, y: 130, r: 1.2, o: 0.5 },
  { x: 170, y: 110, r: 1.6, o: 0.65 },
  { x: 50, y: 195, r: 1.0, o: 0.45 },
  { x: 158, y: 180, r: 1.3, o: 0.55 },
  { x: 38, y: 250, r: 1.1, o: 0.4 },
  { x: 165, y: 235, r: 1.5, o: 0.5 },
  { x: 75, y: 60, r: 1.2, o: 0.6 },
  { x: 128, y: 55, r: 1.0, o: 0.5 },
  { x: 55, y: 155, r: 0.9, o: 0.4 },
  { x: 148, y: 148, r: 1.1, o: 0.45 },
];

/**
 * Herald: figura levitando con manto abierto, clarín y ondas de sonido.
 * Simboliza el anuncio, la proclamación y la resonancia.
 */
export function Herald({
  className = '',
  color = DEFAULT_COLOR,
  hideLabel = false,
}: QuienSilhouetteProps) {
  const svgId = useUniqueSvgIds('herald');
  const ids = {
    aura1: svgId('aura1'),
    aura2: svgId('aura2'),
    aura3: svgId('aura3'),
    body: svgId('body'),
    cloak: svgId('cloak'),
    horn: svgId('horn'),
    lev: svgId('lev'),
    blur1: svgId('blur1'),
    blur2: svgId('blur2'),
    blur3: svgId('blur3'),
    glow: svgId('glow'),
    fade: svgId('fade'),
    fadeG: svgId('fade-g'),
    faceVoid: svgId('face-void'),
  };

  const meta = getSilhouetteMetadata(SILHOUETTE_ID);

  return (
    <SilhouetteFrame
      title={meta?.name ?? 'Heraldo'}
      subtitle={meta?.subtitle ?? 'Proclamación'}
      variant={meta?.labelVariant ?? 'rose'}
      className={className}
      hideLabel={hideLabel}
    >
      <g transform="translate(0, 0)">
        <defs>
          {/* Auras */}
          <radialGradient id={ids.aura1} cx="50%" cy="45%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.18" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={ids.aura2} cx="50%" cy="45%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.10" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={ids.aura3} cx="50%" cy="45%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.06" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>

          {/* Silueta */}
          <linearGradient id={ids.body} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.95" />
            <stop offset="60%" stopColor={color} stopOpacity="0.75" />
            <stop offset="100%" stopColor={color} stopOpacity="0.10" />
          </linearGradient>

          {/* Manto */}
          <linearGradient id={ids.cloak} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.60" />
            <stop offset="100%" stopColor={color} stopOpacity="0.05" />
          </linearGradient>

          {/* Clarín */}
          <linearGradient id={ids.horn} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={color} stopOpacity="0.90" />
            <stop offset="100%" stopColor="white" stopOpacity="0.70" />
          </linearGradient>

          {/* Halo de levitación */}
          <radialGradient id={ids.lev} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="70%" stopColor={color} stopOpacity="0.08" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>

          {/* Blur filters */}
          <filter id={ids.blur1} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
          <filter id={ids.blur2} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
          <filter id={ids.blur3} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" />
          </filter>
          <filter id={ids.glow} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" />
          </filter>

          {/* Máscara de desvanecimiento */}
          <radialGradient id={ids.fadeG} cx="50%" cy="45%" r="52%">
            <stop offset="40%" stopColor="white" />
            <stop offset="100%" stopColor="black" />
          </radialGradient>
          <mask id={ids.fade}>
            <rect width="200" height="320" fill={`url(#${ids.fadeG})`} />
          </mask>
        </defs>

        {/* Halo de levitación en el suelo */}
        <ellipse cx="100" cy="295" rx="35" ry="8" fill={`url(#${ids.lev})`} />
        <ellipse cx="100" cy="295" rx="20" ry="4" fill={color} opacity="0.06" />

        {/* Auras de profundidad */}
        <ellipse
          cx="100"
          cy="155"
          rx="90"
          ry="130"
          fill={`url(#${ids.aura3})`}
          filter={`url(#${ids.blur1})`}
        />
        <ellipse
          cx="100"
          cy="150"
          rx="70"
          ry="105"
          fill={`url(#${ids.aura2})`}
          filter={`url(#${ids.blur2})`}
        />
        <ellipse
          cx="100"
          cy="148"
          rx="52"
          ry="82"
          fill={`url(#${ids.aura1})`}
          filter={`url(#${ids.blur3})`}
        />

        <g mask={`url(#${ids.fade})`}>
          {/* Manto — abierto por levitación */}
          <path
            d="M85,155 C70,175 45,200 30,240 C25,255 28,265 35,268 C50,260 70,235 85,200 Z"
            fill={`url(#${ids.cloak})`}
            opacity="0.7"
          />
          <path d="M80,165 C65,190 45,215 32,248" stroke={color} strokeWidth="0.6" opacity="0.4" />
          <path d="M75,175 C60,200 42,225 30,255" stroke={color} strokeWidth="0.4" opacity="0.25" />

          <path
            d="M115,155 C130,175 155,200 170,240 C175,255 172,265 165,268 C150,260 130,235 115,200 Z"
            fill={`url(#${ids.cloak})`}
            opacity="0.7"
          />
          <path d="M120,165 C135,190 155,215 168,248" stroke={color} strokeWidth="0.6" opacity="0.4" />
          <path d="M125,175 C140,200 158,225 170,255" stroke={color} strokeWidth="0.4" opacity="0.25" />

          <path
            d="M88,155 C86,185 84,215 86,260 C88,275 100,280 112,275 C116,215 114,185 112,155 Z"
            fill={`url(#${ids.cloak})`}
            opacity="0.5"
          />

          {/* Brazo izquierdo — hacia arriba, con clarín */}
          <path
            d="M88,148 C82,138 72,122 62,108 C58,102 55,96 56,90"
            stroke={`url(#${ids.body})`}
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M88,148 C82,138 72,122 62,108 C58,102 55,96 56,90"
            stroke={color}
            strokeWidth="14"
            strokeLinecap="round"
            opacity="0.08"
            filter={`url(#${ids.blur3})`}
          />
          <path
            d="M56,90 C54,82 52,72 54,64 C56,58 60,55 64,54"
            stroke={`url(#${ids.body})`}
            strokeWidth="6"
            strokeLinecap="round"
          />
          <ellipse cx="66" cy="52" rx="6" ry="8" fill={color} opacity="0.85" transform="rotate(-20,66,52)" />

          {/* Clarín geométrico */}
          <rect
            x="60"
            y="40"
            width="14"
            height="5"
            rx="2"
            fill={color}
            opacity="0.9"
            transform="rotate(-35,60,40)"
          />
          <path
            d="M65,44 C72,38 85,32 100,28 C112,25 122,24 130,26"
            stroke={`url(#${ids.horn})`}
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M65,44 C72,38 85,32 100,28 C112,25 122,24 130,26"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            opacity="0.12"
            filter={`url(#${ids.blur3})`}
          />
          <circle cx="82" cy="36" r="4" stroke={color} strokeWidth="1.5" opacity="0.8" fill="none" />
          <circle cx="82" cy="36" r="2" fill={color} opacity="0.6" />
          <circle cx="98" cy="29" r="3.5" stroke={color} strokeWidth="1.5" opacity="0.8" fill="none" />
          <circle cx="98" cy="29" r="1.8" fill={color} opacity="0.6" />
          <circle cx="114" cy="25" r="3" stroke={color} strokeWidth="1.2" opacity="0.7" fill="none" />
          <circle cx="114" cy="25" r="1.5" fill={color} opacity="0.5" />
          <path
            d="M130,20 L138,23 L141,31 L136,38 L128,38 L124,31 Z"
            fill={color}
            opacity="0.25"
            stroke={color}
            strokeWidth="1"
          />
          <path
            d="M130,20 L138,23 L141,31 L136,38 L128,38 L124,31 Z"
            stroke="white"
            strokeWidth="0.5"
            opacity="0.6"
            fill="none"
          />
          <path d="M126,23 L130,21" stroke="white" strokeWidth="1" opacity="0.7" strokeLinecap="round" />
          <path d="M138,24 L140,28" stroke="white" strokeWidth="0.8" opacity="0.5" strokeLinecap="round" />

          {/* Ondas de sonido */}
          <path
            d="M141,29 C148,20 158,16 165,18 C170,25 168,35 160,42 C155,46 148,46 143,42"
            stroke={color}
            strokeWidth="1.2"
            opacity="0.75"
            fill="none"
            strokeDasharray="3,2"
          />
          <path
            d="M141,29 C152,15 168,10 178,14 C185,22 182,38 172,48 C165,54 155,55 147,50"
            stroke={color}
            strokeWidth="0.9"
            opacity="0.55"
            fill="none"
            strokeDasharray="4,3"
          />
          <path
            d="M141,29 C156,10 175,4 187,10 C196,20 194,40 182,53 C174,62 161,64 151,58"
            stroke={color}
            strokeWidth="0.7"
            opacity="0.38"
            fill="none"
            strokeDasharray="5,4"
          />
          <path
            d="M141,29 C160,6 182,-2 194,6 C204,18 201,44 187,59 C178,69 163,72 152,65"
            stroke={color}
            strokeWidth="0.5"
            opacity="0.22"
            fill="none"
            strokeDasharray="6,5"
          />
          <path
            d="M141,29 C164,2 188,-8 199,2 C211,16 207,48 191,65 C181,77 164,80 152,72"
            stroke={color}
            strokeWidth="0.4"
            opacity="0.12"
            fill="none"
            strokeDasharray="7,6"
          />

          {resonanceNodes.map((n, i) => (
            <g key={i}>
              <circle cx={n.x} cy={n.y} r={n.r + 3} fill={color} opacity="0.08" />
              <circle cx={n.x} cy={n.y} r={n.r} fill={color} opacity="0.7" />
              <circle cx={n.x} cy={n.y} r={n.r * 0.4} fill="white" opacity="0.8" />
            </g>
          ))}

          {/* Brazo derecho — hacia abajo, palma abierta */}
          <path
            d="M112,148 C120,160 132,172 140,182 C145,189 148,196 146,202"
            stroke={`url(#${ids.body})`}
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M112,148 C120,160 132,172 140,182 C145,189 148,196 146,202"
            stroke={color}
            strokeWidth="14"
            strokeLinecap="round"
            opacity="0.08"
            filter={`url(#${ids.blur3})`}
          />
          <path
            d="M146,202 C147,210 146,220 142,226 C139,230 134,232 130,230"
            stroke={`url(#${ids.body})`}
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            d="M124,228 C120,235 118,242 120,246 C122,248 126,246 128,242"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.8"
          />
          {fingerPaths.map((f, i) => (
            <path
              key={i}
              d={f.d}
              stroke={color}
              strokeWidth="2.5"
              strokeLinecap="round"
              opacity={0.85 - i * 0.06}
            />
          ))}

          {/* Torso */}
          <path
            d="M88,148 C86,142 86,135 88,128 C90,120 94,115 100,113 C106,115 110,120 112,128 C114,135 114,142 112,148 Z"
            fill={`url(#${ids.body})`}
            opacity="0.9"
          />
          <path d="M92,118 C91,128 91,138 92,148" stroke="white" strokeWidth="0.5" opacity="0.25" />
          <path d="M100,113 C100,125 100,137 100,149" stroke="white" strokeWidth="0.5" opacity="0.2" />
          <path d="M108,118 C109,128 109,138 108,148" stroke="white" strokeWidth="0.5" opacity="0.25" />
          <path d="M93,118 C91,128 91,138 93,148" stroke="white" strokeWidth="0.4" opacity="0.35" />

          {/* Cabeza */}
          <rect
            x="95"
            y="100"
            width="10"
            height="14"
            rx="4"
            fill={`url(#${ids.body})`}
            opacity="0.85"
          />
          <ellipse cx="100" cy="88" rx="16" ry="18" fill={`url(#${ids.body})`} opacity="0.9" />

          {/* Capucha */}
          <path
            d="M82,92 C80,78 84,65 92,58 C96,55 100,54 104,55 C110,57 116,62 118,70 C120,78 118,88 116,95"
            fill={color}
            opacity="0.5"
          />
          <path
            d="M82,92 C80,78 84,65 92,58 C96,55 100,54 104,55 C110,57 116,62 118,70 C120,78 118,88 116,95"
            stroke={color}
            strokeWidth="0.8"
            fill="none"
            opacity="0.7"
          />

          {/* Vacío facial */}
          <radialGradient id={ids.faceVoid} cx="50%" cy="60%" r="50%">
            <stop offset="0%" stopColor="black" stopOpacity="0.9" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
          <ellipse cx="100" cy="90" rx="10" ry="12" fill={`url(#${ids.faceVoid})`} />

          {/* Piernas */}
          <path
            d="M93,155 C90,170 88,185 88,205 C88,218 90,228 92,235"
            stroke={`url(#${ids.body})`}
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path
            d="M107,155 C110,170 112,185 112,205 C112,218 110,228 108,235"
            stroke={`url(#${ids.body})`}
            strokeWidth="10"
            strokeLinecap="round"
          />
          <path d="M90,165 C89,180 89,200 90,220" stroke="white" strokeWidth="0.5" opacity="0.2" />
          <path d="M110,165 C111,180 111,200 110,220" stroke="white" strokeWidth="0.5" opacity="0.2" />

          <ellipse cx="91" cy="238" rx="8" ry="5" fill={color} opacity="0.6" transform="rotate(-10,91,238)" />
          <ellipse cx="109" cy="238" rx="8" ry="5" fill={color} opacity="0.6" transform="rotate(10,109,238)" />

          {/* Luminiscencia de borde */}
          <path
            d="M88,148 C86,142 86,110 88,92 C80,78 84,62 100,54 C116,62 120,78 112,92 C114,110 114,142 112,148 C120,160 146,202 109,238 C93,238 55,268 88,148 Z"
            fill="none"
            stroke={color}
            strokeWidth="0.5"
            opacity="0.3"
            filter={`url(#${ids.glow})`}
          />
        </g>

        {/* Partículas flotantes */}
        {particles.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={p.r + 2.5} fill={color} opacity={p.o * 0.15} />
            <circle cx={p.x} cy={p.y} r={p.r} fill={color} opacity={p.o} />
            <circle cx={p.x} cy={p.y} r={p.r * 0.4} fill="white" opacity={0.8} />
          </g>
        ))}
      </g>
    </SilhouetteFrame>
  );
}
