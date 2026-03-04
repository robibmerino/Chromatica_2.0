import { useUniqueSvgIds } from '../../QuienTinderCards/useUniqueSvgIds';
import { SilhouetteFrame } from '../SilhouetteFrame';
import { getSilhouetteMetadata } from '../silhouetteMetadata';
import type { QuienSilhouetteProps } from '../types';

const SILHOUETTE_ID = 9 as const;

const DEFAULT_COLOR = '#a78bfa';

const groundFingers = [
  { x1: 68, y1: 272, x2: 58, y2: 264, w: 3 },
  { x1: 71, y1: 270, x2: 64, y2: 260, w: 2.5 },
  { x1: 75, y1: 269, x2: 70, y2: 258, w: 2.5 },
  { x1: 79, y1: 270, x2: 76, y2: 260, w: 2.5 },
  { x1: 83, y1: 273, x2: 82, y2: 263, w: 2 },
];

const torsoFolds = [
  { d: 'M88 185 Q92 192 89 202', op: 0.25 },
  { d: 'M93 180 Q97 190 94 205', op: 0.2 },
  { d: 'M99 178 Q103 188 101 203', op: 0.2 },
  { d: 'M105 182 Q108 192 107 208', op: 0.18 },
  { d: 'M87 215 Q91 225 89 238', op: 0.22 },
];

const handFingers = [
  { x1: 114, y1: 222, x2: 110, y2: 213 },
  { x1: 117, y1: 220, x2: 115, y2: 210 },
  { x1: 120, y1: 221, x2: 120, y2: 212 },
  { x1: 122, y1: 224, x2: 124, y2: 215 },
];

const crystalVertices = [
  { x: 117, y: 192, size: 3 },
  { x: 126, y: 198, size: 2 },
  { x: 129, y: 207, size: 1.5 },
  { x: 107, y: 214, size: 1.5 },
  { x: 105, y: 205, size: 2 },
  { x: 110, y: 196, size: 2.5 },
];

const crystalPoints = '117,192 126,198 129,207 124,216 115,219 107,214 105,205 110,196';

const particles = [
  { x: 132, y: 195, r: 1.8, op: 0.8 },
  { x: 138, y: 208, r: 1.2, op: 0.6 },
  { x: 130, y: 218, r: 1.5, op: 0.7 },
  { x: 125, y: 192, r: 1, op: 0.5 },
  { x: 140, y: 200, r: 0.8, op: 0.4 },
  { x: 136, y: 215, r: 1.3, op: 0.6 },
  { x: 128, y: 225, r: 1, op: 0.5 },
  { x: 142, y: 210, r: 0.7, op: 0.35 },
  { x: 122, y: 185, r: 1.5, op: 0.65 },
  { x: 134, y: 228, r: 0.8, op: 0.4 },
  { x: 108, y: 185, r: 1.2, op: 0.55 },
  { x: 145, y: 205, r: 0.6, op: 0.3 },
];

/**
 * Peregrino: figura agachada con mano en el suelo y cristal luminoso en la otra.
 * Simboliza la búsqueda, la contemplación y la guía.
 */
export function Peregrino({
  className = '',
  color = DEFAULT_COLOR,
  hideLabel = false,
}: QuienSilhouetteProps) {
  const svgId = useUniqueSvgIds('peregrino');
  const ids = {
    aura1: svgId('aura1'),
    aura2: svgId('aura2'),
    body: svgId('body'),
    crystalGlow: svgId('crystal-glow'),
    crystalLight: svgId('crystal-light'),
    facetCenter: svgId('facet-center'),
    maskGrad: svgId('mask'),
    fade: svgId('fade'),
  };

  const meta = getSilhouetteMetadata(SILHOUETTE_ID);

  return (
    <SilhouetteFrame
      title={meta?.name ?? 'Peregrino'}
      subtitle={meta?.subtitle ?? 'Búsqueda'}
      variant={meta?.labelVariant ?? 'violet'}
      className={className}
      hideLabel={hideLabel}
    >
      <g transform="translate(100, 160) scale(1.2) translate(-100, -160) translate(0, -28)">
        <defs>
          <radialGradient id={ids.aura1} cx="45%" cy="65%" r="45%">
            <stop offset="0%" stopColor={color} stopOpacity="0.18" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={ids.aura2} cx="45%" cy="65%" r="35%">
            <stop offset="0%" stopColor={color} stopOpacity="0.28" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
          <linearGradient id={ids.body} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.95" />
            <stop offset="60%" stopColor={color} stopOpacity="0.75" />
            <stop offset="100%" stopColor={color} stopOpacity="0.3" />
          </linearGradient>
          <radialGradient id={ids.crystalGlow} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="0.9" />
            <stop offset="30%" stopColor={color} stopOpacity="0.8" />
            <stop offset="70%" stopColor={color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={ids.crystalLight} cx="55%" cy="72%" r="40%">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="60%" stopColor={color} stopOpacity="0.12" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={ids.facetCenter} cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="40%" stopColor={color} stopOpacity="0.9" />
            <stop offset="100%" stopColor={color} stopOpacity="0.4" />
          </radialGradient>
          <radialGradient id={ids.maskGrad} cx="45%" cy="60%" r="48%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="70%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id={ids.fade}>
            <rect width="200" height="320" fill={`url(#${ids.maskGrad})`} />
          </mask>
        </defs>

        <g mask={`url(#${ids.fade})`}>
          <ellipse cx="95" cy="220" rx="80" ry="70" fill={`url(#${ids.aura1})`} />
          <ellipse cx="95" cy="210" rx="55" ry="50" fill={`url(#${ids.aura2})`} />
          <ellipse cx="115" cy="230" rx="50" ry="40" fill={`url(#${ids.crystalLight})`} />

          {/* Grietas en el suelo */}
          <g opacity="0.5">
            <line x1="75" y1="278" x2="55" y2="290" stroke={color} strokeWidth="0.7" opacity="0.6" />
            <line x1="75" y1="278" x2="60" y2="272" stroke={color} strokeWidth="0.5" opacity="0.4" />
            <line x1="75" y1="278" x2="68" y2="295" stroke={color} strokeWidth="0.6" opacity="0.5" />
            <line x1="75" y1="278" x2="85" y2="292" stroke={color} strokeWidth="0.4" opacity="0.35" />
            <line x1="75" y1="278" x2="90" y2="282" stroke={color} strokeWidth="0.5" opacity="0.4" />
          </g>

          <ellipse cx="100" cy="285" rx="60" ry="8" fill={color} opacity="0.08" />

          {/* Mano en el suelo */}
          <ellipse cx="75" cy="276" rx="9" ry="6" fill={`url(#${ids.body})`} opacity="0.85" transform="rotate(-20 75 276)" />
          {groundFingers.map((d, i) => (
            <g key={i}>
              <line x1={d.x1} y1={d.y1} x2={d.x2} y2={d.y2} stroke={color} strokeWidth={d.w + 1.5} strokeLinecap="round" opacity="0.2" />
              <line x1={d.x1} y1={d.y1} x2={d.x2} y2={d.y2} stroke={color} strokeWidth={d.w} strokeLinecap="round" opacity="0.9" />
              <line x1={d.x1} y1={d.y1} x2={d.x2} y2={d.y2} stroke="white" strokeWidth="0.6" strokeLinecap="round" opacity="0.4" />
            </g>
          ))}

          {/* Piernas */}
          <path d="M88 258 Q72 265 68 278" stroke={color} strokeWidth="8" strokeLinecap="round" opacity="0.2" />
          <path d="M88 258 Q72 265 68 278" stroke={color} strokeWidth="5.5" strokeLinecap="round" fill="none" opacity="0.85" />
          <path d="M88 258 Q72 265 68 278" stroke="white" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.3" />
          <path d="M105 255 Q118 265 125 278" stroke={color} strokeWidth="8" strokeLinecap="round" opacity="0.2" />
          <path d="M105 255 Q118 265 125 278" stroke={color} strokeWidth="5.5" strokeLinecap="round" fill="none" opacity="0.85" />
          <path d="M105 255 Q118 265 125 278" stroke="white" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.3" />
          <ellipse cx="68" cy="280" rx="7" ry="4" fill={`url(#${ids.body})`} opacity="0.7" transform="rotate(-15 68 280)" />
          <ellipse cx="126" cy="280" rx="7" ry="4" fill={`url(#${ids.body})`} opacity="0.7" transform="rotate(10 126 280)" />

          {/* Torso */}
          <path d="M82 170 Q70 200 75 240 Q85 260 97 258 Q112 258 118 245 Q125 225 118 195 Q112 170 97 162 Z" fill={color} opacity="0.12" />
          <path d="M84 172 Q73 202 78 238 Q87 257 97 256 Q110 256 116 243 Q122 224 116 196 Q110 172 97 164 Z" fill={color} opacity="0.2" />
          <path d="M86 174 Q76 204 80 236 Q88 255 97 254 Q109 254 114 241 Q120 222 114 197 Q108 174 97 167 Z" fill={`url(#${ids.body})`} opacity="0.85" />
          {torsoFolds.map((p, i) => (
            <g key={i}>
              <path d={p.d} stroke="black" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity={p.op} />
              <path d={p.d} stroke="white" strokeWidth="0.5" strokeLinecap="round" fill="none" opacity={p.op * 0.8} />
            </g>
          ))}

          {/* Brazo izquierdo */}
          <path d="M82 195 Q72 225 75 262" stroke={color} strokeWidth="7" strokeLinecap="round" opacity="0.2" />
          <path d="M82 195 Q72 225 75 262" stroke={color} strokeWidth="4.5" strokeLinecap="round" fill="none" opacity="0.85" />
          <path d="M82 195 Q72 225 75 262" stroke="white" strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.3" />

          {/* Brazo derecho */}
          <path d="M112 192 Q125 210 118 228" stroke={color} strokeWidth="7" strokeLinecap="round" opacity="0.2" />
          <path d="M112 192 Q125 210 118 228" stroke={color} strokeWidth="4.5" strokeLinecap="round" fill="none" opacity="0.85" />
          <path d="M112 192 Q125 210 118 228" stroke="white" strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.3" />

          {/* Mano sosteniendo */}
          <path d="M113 228 Q118 232 122 228 Q124 224 120 220 Q116 218 113 222 Z" fill={`url(#${ids.body})`} opacity="0.85" />
          {handFingers.map((d, i) => (
            <g key={i}>
              <line x1={d.x1} y1={d.y1} x2={d.x2} y2={d.y2} stroke={color} strokeWidth="3.5" strokeLinecap="round" opacity="0.2" />
              <line x1={d.x1} y1={d.y1} x2={d.x2} y2={d.y2} stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.9" />
              <line x1={d.x1} y1={d.y1} x2={d.x2} y2={d.y2} stroke="white" strokeWidth="0.5" strokeLinecap="round" opacity="0.35" />
            </g>
          ))}

          {/* Cristal */}
          <circle cx="117" cy="205" r="22" fill={`url(#${ids.crystalGlow})`} opacity="0.5" />
          <circle cx="117" cy="205" r="14" fill={`url(#${ids.crystalGlow})`} opacity="0.6" />
          <polygon points={crystalPoints} fill={color} opacity="0.25" />
          <polygon points="117,192 126,198 120,205" fill="white" opacity="0.55" />
          <polygon points="117,192 110,196 114,205" fill={color} opacity="0.7" />
          <polygon points="126,198 129,207 122,205" fill={color} opacity="0.45" />
          <polygon points="129,207 124,216 120,210" fill={color} opacity="0.35" />
          <polygon points="124,216 115,219 117,212" fill={color} opacity="0.3" />
          <polygon points="115,219 107,214 112,208" fill={color} opacity="0.4" />
          <polygon points="107,214 105,205 111,208" fill={color} opacity="0.5" />
          <polygon points="105,205 110,196 114,202" fill={color} opacity="0.6" />
          <circle cx="117" cy="205" r="5" fill={`url(#${ids.facetCenter})`} />
          <circle cx="117" cy="205" r="2.5" fill="white" opacity="0.95" />
          <circle cx="115" cy="203" r="1" fill="white" opacity="0.9" />
          {crystalVertices.map((v, i) => (
            <g key={i}>
              <circle cx={v.x} cy={v.y} r={v.size * 2} fill={color} opacity="0.3" />
              <circle cx={v.x} cy={v.y} r={v.size} fill="white" opacity="0.9" />
            </g>
          ))}
          <polygon points={crystalPoints} fill="none" stroke={color} strokeWidth="1.2" opacity="0.7" />
          <polygon points={crystalPoints} fill="none" stroke="white" strokeWidth="0.4" opacity="0.5" />

          {/* Hombros */}
          <ellipse cx="83" cy="182" rx="10" ry="7" fill={`url(#${ids.body})`} opacity="0.9" transform="rotate(-25 83 182)" />
          <ellipse cx="111" cy="180" rx="10" ry="7" fill={`url(#${ids.body})`} opacity="0.9" transform="rotate(15 111 180)" />

          {/* Cuello y cabeza */}
          <path d="M94 168 Q96 160 98 155" stroke={color} strokeWidth="6" strokeLinecap="round" opacity="0.85" />
          <path d="M94 168 Q96 160 98 155" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.25" />
          <circle cx="99" cy="148" r="20" fill={color} opacity="0.08" />
          <circle cx="99" cy="148" r="14" fill={color} opacity="0.14" />
          <path d="M86 155 Q88 135 99 128 Q110 135 113 155 Q110 162 99 164 Q88 162 86 155 Z" fill={`url(#${ids.body})`} opacity="0.88" />
          <ellipse cx="100" cy="152" rx="7" ry="8" fill="black" opacity="0.55" transform="rotate(15 100 152)" />
          <path d="M90 142 Q99 132 108 140" stroke="white" strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.35" />
          <ellipse cx="99" cy="158" rx="8" ry="5" fill={color} opacity="0.2" transform="rotate(15 99 158)" />

          {/* Manto */}
          <path d="M86 185 Q70 210 72 250 Q75 268 80 272" stroke={color} strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.5" />
          <path d="M86 185 Q70 210 72 250 Q75 268 80 272" stroke="white" strokeWidth="0.7" strokeLinecap="round" fill="none" opacity="0.2" />
          <path d="M113 185 Q128 205 130 240 Q128 260 124 272" stroke={color} strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.5" />
          <path d="M113 185 Q128 205 130 240 Q128 260 124 272" stroke="white" strokeWidth="0.7" strokeLinecap="round" fill="none" opacity="0.2" />

          {/* Partículas */}
          {particles.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r={p.r * 2.5} fill={color} opacity={p.op * 0.3} />
              <circle cx={p.x} cy={p.y} r={p.r} fill={color} opacity={p.op} />
              <circle cx={p.x} cy={p.y} r={p.r * 0.4} fill="white" opacity={p.op * 0.9} />
            </g>
          ))}
        </g>
      </g>
    </SilhouetteFrame>
  );
}
