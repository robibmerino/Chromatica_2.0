import { useUniqueSvgIds } from '../../QuienTinderCards/useUniqueSvgIds';
import { SilhouetteFrame } from '../SilhouetteFrame';
import { getSilhouetteMetadata } from '../silhouetteMetadata';
import type { QuienSilhouetteProps } from '../types';

const SILHOUETTE_ID = 19 as const;

const DEFAULT_COLOR = '#818cf8';

const towerFloorsY = [105, 118, 131, 144, 157, 170];

const staircaseSteps = [0, 1, 2, 3, 4, 5, 6, 7];

const handFingerOffsets = [[-3, -4], [0, -5], [3, -4], [5, -2], [-5, -2]];
const fingertipGlows = [[-3, -4], [0, -5], [3, -4]];

const particles = [
  [52, 125, 1.2, 0.5],
  [145, 118, 0.9, 0.4],
  [48, 148, 1.0, 0.45],
  [152, 140, 0.8, 0.35],
  [62, 95, 1.4, 0.55],
  [138, 95, 1.1, 0.45],
  [75, 175, 0.8, 0.35],
  [128, 178, 0.9, 0.4],
  [50, 165, 0.7, 0.3],
  [155, 162, 0.8, 0.35],
  [68, 145, 1.0, 0.4],
  [142, 135, 0.9, 0.38],
  [58, 112, 0.8, 0.35],
  [148, 108, 1.0, 0.42],
  [122, 158, 0.7, 0.3],
  [80, 168, 0.8, 0.32],
];

/**
 * Dreamer: figura reclinada en arquitectura onírica flotante.
 * Simboliza el sueño, la imaginación y lo imposible.
 */
export function Dreamer({
  className = '',
  color = DEFAULT_COLOR,
  hideLabel = false,
}: QuienSilhouetteProps) {
  const svgId = useUniqueSvgIds('dreamer');
  const ids = {
    aura1: svgId('aura1'),
    aura2: svgId('aura2'),
    aura3: svgId('aura3'),
    bodyGrad: svgId('bodyGrad'),
    dreamGlow: svgId('dreamGlow'),
  };

  const meta = getSilhouetteMetadata(SILHOUETTE_ID);

  return (
    <SilhouetteFrame
      title={meta?.name ?? 'Soñador'}
      subtitle={meta?.subtitle ?? 'Imaginación'}
      variant={meta?.labelVariant ?? 'violet'}
      className={className}
      hideLabel={hideLabel}
    >
      <g transform="translate(100, 160) scale(1.08) translate(-100, -160)">
        <defs>
          <radialGradient id={ids.aura1} cx="50%" cy="70%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.18" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={ids.aura2} cx="50%" cy="70%" r="40%">
            <stop offset="0%" stopColor={color} stopOpacity="0.12" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={ids.aura3} cx="50%" cy="70%" r="30%">
            <stop offset="0%" stopColor={color} stopOpacity="0.08" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
          <linearGradient id={ids.bodyGrad} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.9" />
            <stop offset="60%" stopColor={color} stopOpacity="0.6" />
            <stop offset="100%" stopColor={color} stopOpacity="0.1" />
          </linearGradient>
          <radialGradient id={ids.dreamGlow} cx="50%" cy="30%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.15" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
        </defs>

        <ellipse cx="100" cy="230" rx="90" ry="60" fill={`url(#${ids.aura1})`} />
        <ellipse cx="100" cy="230" rx="70" ry="45" fill={`url(#${ids.aura2})`} />
        <ellipse cx="100" cy="230" rx="50" ry="30" fill={`url(#${ids.aura3})`} />

        <ellipse cx="100" cy="100" rx="80" ry="90" fill={`url(#${ids.dreamGlow})`} />

        {/* Dream architecture */}
        <rect x="55" y="185" width="35" height="4" rx="1" fill={color} opacity="0.5" />
        <rect x="56" y="185" width="33" height="4" rx="1" fill="none" stroke={color} strokeWidth="0.5" opacity="0.8" />

        <rect x="110" y="170" width="28" height="3" rx="1" fill={color} opacity="0.4" />
        <rect x="111" y="170" width="26" height="3" rx="1" fill="none" stroke={color} strokeWidth="0.5" opacity="0.7" />

        <rect x="70" y="155" width="18" height="3" rx="1" fill={color} opacity="0.3" />

        <rect x="120" y="148" width="22" height="3" rx="1" fill={color} opacity="0.25" />

        <rect x="88" y="95" width="8" height="90" rx="1" fill={color} opacity="0.25" />
        <line x1="88" y1="95" x2="88" y2="185" stroke={color} strokeWidth="0.8" opacity="0.7" />
        <line x1="96" y1="95" x2="96" y2="185" stroke={color} strokeWidth="0.8" opacity="0.7" />
        <line x1="89" y1="95" x2="89" y2="185" stroke="white" strokeWidth="0.4" opacity="0.4" />

        {towerFloorsY.map((y, i) => (
          <g key={i}>
            <line
              x1={86 - i * 1.5}
              y1={y}
              x2={98 + i * 1.5}
              y2={y}
              stroke={color}
              strokeWidth="1.5"
              opacity={0.7 - i * 0.08}
            />
            <line
              x1={86 - i * 1.5}
              y1={y}
              x2={98 + i * 1.5}
              y2={y}
              stroke="white"
              strokeWidth="0.4"
              opacity={0.3 - i * 0.04}
            />
          </g>
        ))}

        <polygon points="92,88 88,98 96,98" fill={color} opacity="0.6" />
        <polygon points="92,88 88,98 96,98" fill="none" stroke="white" strokeWidth="0.5" opacity="0.5" />
        <circle cx="92" cy="86" r="2.5" fill={color} opacity="0.9" />
        <circle cx="92" cy="86" r="1" fill="white" opacity="0.95" />

        <path d="M88,130 Q60,100 55,120 Q50,140 65,150" fill="none" stroke={color} strokeWidth="3" opacity="0.12" />
        <path d="M88,130 Q60,100 55,120 Q50,140 65,150" fill="none" stroke={color} strokeWidth="1" opacity="0.55" />
        <path d="M88,130 Q60,100 55,120 Q50,140 65,150" fill="none" stroke="white" strokeWidth="0.4" opacity="0.4" />
        <circle cx="65" cy="150" r="2" fill={color} opacity="0.6" />
        <circle cx="65" cy="150" r="0.8" fill="white" opacity="0.8" />

        {staircaseSteps.map((i) => (
          <g key={i}>
            <line
              x1={96 + i * 5}
              y1={130 - i * 8}
              x2={96 + i * 5 + 5}
              y2={130 - i * 8}
              stroke={color}
              strokeWidth="1.2"
              opacity={0.7 - i * 0.08}
            />
            <line
              x1={96 + i * 5 + 5}
              y1={130 - i * 8}
              x2={96 + i * 5 + 5}
              y2={130 - i * 8 - 8}
              stroke={color}
              strokeWidth="1.2"
              opacity={0.7 - i * 0.08}
            />
          </g>
        ))}

        <polygon points="58,108 65,95 72,108" fill={color} opacity="0.15" />
        <polygon points="58,108 65,95 72,108" fill="none" stroke={color} strokeWidth="0.8" opacity="0.5" strokeDasharray="3,2" />

        <polygon points="128,112 133,103 138,112" fill={color} opacity="0.1" />
        <polygon points="128,112 133,103 138,112" fill="none" stroke={color} strokeWidth="0.6" opacity="0.4" strokeDasharray="2,2" />

        <rect x="130" y="125" width="12" height="12" rx="1" fill={color} opacity="0.1" transform="rotate(15,136,131)" />
        <rect x="130" y="125" width="12" height="12" rx="1" fill="none" stroke={color} strokeWidth="0.7" opacity="0.4" strokeDasharray="3,2" transform="rotate(15,136,131)" />

        <line x1="55" y1="140" x2="70" y2="133" stroke={color} strokeWidth="0.7" opacity="0.35" strokeDasharray="3,3" />
        <line x1="130" y1="155" x2="148" y2="148" stroke={color} strokeWidth="0.7" opacity="0.3" strokeDasharray="3,3" />
        <line x1="60" y1="168" x2="75" y2="162" stroke={color} strokeWidth="0.6" opacity="0.25" strokeDasharray="2,3" />

        {/* Figure */}
        <ellipse cx="95" cy="248" rx="52" ry="28" fill={color} opacity="0.06" />
        <ellipse cx="95" cy="248" rx="40" ry="22" fill={color} opacity="0.1" />
        <ellipse cx="95" cy="248" rx="28" ry="15" fill={color} opacity="0.14" />

        <path
          d="M60,265 Q80,268 110,264 Q125,262 135,260"
          fill="none"
          stroke={`url(#${ids.bodyGrad})`}
          strokeWidth="10"
          strokeLinecap="round"
          opacity="0.3"
        />
        <path d="M60,265 Q80,268 110,264 Q125,262 135,260" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
        <path d="M60,265 Q80,268 110,264 Q125,262 135,260" fill="none" stroke="white" strokeWidth="0.4" strokeLinecap="round" opacity="0.35" />

        <path
          d="M75,255 Q90,252 115,250 Q128,248 138,246"
          fill="none"
          stroke={`url(#${ids.bodyGrad})`}
          strokeWidth="12"
          strokeLinecap="round"
          opacity="0.25"
        />
        <path d="M75,255 Q90,252 115,250 Q128,248 138,246" fill="none" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.6" />

        <path
          d="M75,255 Q72,240 74,225 Q76,215 80,208"
          fill="none"
          stroke={`url(#${ids.bodyGrad})`}
          strokeWidth="14"
          strokeLinecap="round"
          opacity="0.3"
        />
        <path d="M75,255 Q72,240 74,225 Q76,215 80,208" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
        <path d="M75,255 Q72,240 74,225 Q76,215 80,208" fill="none" stroke="white" strokeWidth="0.4" strokeLinecap="round" opacity="0.3" />

        <path d="M76,240 Q79,232 82,222" fill="none" stroke={color} strokeWidth="0.6" opacity="0.4" />
        <path d="M78,248 Q80,238 82,230" fill="none" stroke={color} strokeWidth="0.5" opacity="0.3" />

        <path d="M75,255 Q68,260 62,268 Q58,272 60,276" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" opacity="0.25" />
        <path d="M75,255 Q68,260 62,268 Q58,272 60,276" fill="none" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.65" />
        <circle cx="60" cy="276" r="3" fill={color} opacity="0.5" />
        <circle cx="60" cy="276" r="1.2" fill="white" opacity="0.7" />

        <path d="M60,276 Q62,268 65,258 Q68,250 72,245" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" opacity="0.25" />
        <path d="M60,276 Q62,268 65,258 Q68,250 72,245" fill="none" stroke={color} strokeWidth="0.9" strokeLinecap="round" opacity="0.65" />

        <path d="M72,245 Q74,240 76,236" fill="none" stroke={color} strokeWidth="4" strokeLinecap="round" opacity="0.3" />
        <path d="M72,245 Q74,240 76,236" fill="none" stroke={color} strokeWidth="0.8" strokeLinecap="round" opacity="0.7" />

        <ellipse cx="82" cy="222" rx="12" ry="14" fill={color} opacity="0.18" />
        <ellipse cx="82" cy="222" rx="12" ry="14" fill="none" stroke={color} strokeWidth="1.2" opacity="0.65" />
        <ellipse cx="82" cy="222" rx="12" ry="14" fill="none" stroke="white" strokeWidth="0.4" opacity="0.3" />
        <ellipse cx="83" cy="218" rx="8" ry="9" fill="black" opacity="0.35" />
        <ellipse cx="80" cy="216" rx="6" ry="7" fill={color} opacity="0.12" />

        <path d="M80,208 Q88,204 96,206 Q102,208 106,212" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" opacity="0.22" />
        <path d="M80,208 Q88,204 96,206 Q102,208 106,212" fill="none" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.6" />

        <path
          d="M106,212 Q112,205 116,196 Q119,188 118,180"
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.22"
        />
        <path d="M106,212 Q112,205 116,196 Q119,188 118,180" fill="none" stroke={color} strokeWidth="0.9" strokeLinecap="round" opacity="0.65" />
        <path d="M106,212 Q112,205 116,196 Q119,188 118,180" fill="none" stroke="white" strokeWidth="0.4" strokeLinecap="round" opacity="0.25" />

        {handFingerOffsets.map(([dx, dy], i) => (
          <line
            key={i}
            x1={118}
            y1={180}
            x2={118 + dx}
            y2={180 + dy}
            stroke={color}
            strokeWidth="0.9"
            strokeLinecap="round"
            opacity={0.7 - i * 0.05}
          />
        ))}
        {fingertipGlows.map(([dx, dy], i) => (
          <circle key={i} cx={118 + dx} cy={180 + dy} r="1.2" fill={color} opacity={0.8 - i * 0.1} />
        ))}

        <path d="M80,208 Q65,220 58,240 Q54,255 60,265" fill="none" stroke={color} strokeWidth="3" opacity="0.12" />
        <path d="M80,208 Q65,220 58,240 Q54,255 60,265" fill="none" stroke={color} strokeWidth="0.7" opacity="0.35" />

        {particles.map(([x, y, r, op], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={r * 2.5} fill={color} opacity={op * 0.3} />
            <circle cx={x} cy={y} r={r} fill={color} opacity={op} />
            <circle cx={x} cy={y} r={r * 0.4} fill="white" opacity={op * 1.2} />
          </g>
        ))}

        <ellipse cx="100" cy="180" rx="88" ry="130" fill="none" stroke={color} strokeWidth="0.5" opacity="0.08" />
      </g>
    </SilhouetteFrame>
  );
}
