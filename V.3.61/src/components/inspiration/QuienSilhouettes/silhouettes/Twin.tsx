import { useUniqueSvgIds } from '../../QuienTinderCards/useUniqueSvgIds';
import { SilhouetteFrame } from '../SilhouetteFrame';
import { getSilhouetteMetadata } from '../silhouetteMetadata';
import type { QuienSilhouetteProps } from '../types';

const SILHOUETTE_ID = 16 as const;

const DEFAULT_COLOR = '#e879f9';
const COLOR_B = '#67e8f9';

const particlesA = [
  { cx: 38, cy: 85, r: 1.2, o: 0.6 },
  { cx: 44, cy: 110, r: 0.8, o: 0.4 },
  { cx: 36, cy: 140, r: 1.4, o: 0.5 },
  { cx: 52, cy: 68, r: 1, o: 0.7 },
  { cx: 42, cy: 160, r: 0.9, o: 0.35 },
  { cx: 60, cy: 210, r: 1.1, o: 0.3 },
  { cx: 30, cy: 125, r: 0.7, o: 0.4 },
];

const particlesB = [
  { cx: 162, cy: 85, r: 1.2, o: 0.6 },
  { cx: 156, cy: 110, r: 0.8, o: 0.4 },
  { cx: 164, cy: 140, r: 1.4, o: 0.5 },
  { cx: 148, cy: 68, r: 1, o: 0.7 },
  { cx: 158, cy: 160, r: 0.9, o: 0.35 },
  { cx: 140, cy: 210, r: 1.1, o: 0.3 },
  { cx: 170, cy: 125, r: 0.7, o: 0.4 },
];

const particlesMerge = [
  { cx: 92, cy: 118, r: 0.8, o: 0.5 },
  { cx: 108, cy: 118, r: 0.8, o: 0.5 },
  { cx: 88, cy: 135, r: 0.6, o: 0.4 },
  { cx: 112, cy: 135, r: 0.6, o: 0.4 },
];

/**
 * Twin: dos figuras enfrentadas con manos casi tocándose en el centro.
 * Simboliza la dualidad, la conexión y la complementariedad.
 */
export function Twin({
  className = '',
  color = DEFAULT_COLOR,
  hideLabel = false,
}: QuienSilhouetteProps) {
  const svgId = useUniqueSvgIds('twin');
  const ids = {
    auraA: svgId('auraA'),
    auraB: svgId('auraB'),
    bodyGradA: svgId('bodyA'),
    bodyGradB: svgId('bodyB'),
    mergeGrad: svgId('merge'),
    glowA: svgId('glowA'),
    glowB: svgId('glowB'),
    mask: svgId('mask'),
    fadeBottom: svgId('fadeBottom'),
  };

  const meta = getSilhouetteMetadata(SILHOUETTE_ID);
  const colorB = COLOR_B;

  return (
    <SilhouetteFrame
      title={meta?.name ?? 'Gemelos'}
      subtitle={meta?.subtitle ?? 'Dualidad'}
      variant={meta?.labelVariant ?? 'fuchsia'}
      className={className}
      hideLabel={hideLabel}
    >
      <g transform="translate(0, 20)">
        <defs>
          <radialGradient id={ids.auraA} cx="35%" cy="50%" r="55%">
            <stop offset="0%" stopColor={color} stopOpacity="0.18" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={ids.auraB} cx="65%" cy="50%" r="55%">
            <stop offset="0%" stopColor={colorB} stopOpacity="0.18" />
            <stop offset="100%" stopColor={colorB} stopOpacity="0" />
          </radialGradient>
          <linearGradient id={ids.bodyGradA} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.95" />
            <stop offset="60%" stopColor={color} stopOpacity="0.7" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
          <linearGradient id={ids.bodyGradB} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={colorB} stopOpacity="0.95" />
            <stop offset="60%" stopColor={colorB} stopOpacity="0.7" />
            <stop offset="100%" stopColor={colorB} stopOpacity="0" />
          </linearGradient>
          <radialGradient id={ids.mergeGrad} cx="50%" cy="45%" r="18%">
            <stop offset="0%" stopColor="white" stopOpacity="0.35" />
            <stop offset="40%" stopColor={color} stopOpacity="0.15" />
            <stop offset="70%" stopColor={colorB} stopOpacity="0.1" />
            <stop offset="100%" stopColor="black" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={ids.glowA} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="0.9" />
            <stop offset="40%" stopColor={color} stopOpacity="0.6" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={ids.glowB} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="0.9" />
            <stop offset="40%" stopColor={colorB} stopOpacity="0.6" />
            <stop offset="100%" stopColor={colorB} stopOpacity="0" />
          </radialGradient>
          <linearGradient id={ids.fadeBottom} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="white" />
            <stop offset="100%" stopColor="black" />
          </linearGradient>
          <mask id={ids.mask}>
            <rect x="0" y="0" width="200" height="280" fill="white" />
            <rect x="0" y="220" width="200" height="60" fill={`url(#${ids.fadeBottom})`} />
          </mask>
        </defs>

        <ellipse cx="68" cy="145" rx="70" ry="110" fill={`url(#${ids.auraA})`} />
        <ellipse cx="132" cy="145" rx="70" ry="110" fill={`url(#${ids.auraB})`} />

        {/* Twin A */}
        <g mask={`url(#${ids.mask})`}>
          <ellipse cx="68" cy="130" rx="38" ry="60" fill="none" stroke={color} strokeWidth="12" opacity="0.04" />
          <ellipse cx="68" cy="130" rx="30" ry="50" fill="none" stroke={color} strokeWidth="6" opacity="0.08" />
          <ellipse cx="68" cy="62" rx="18" ry="20" fill={`url(#${ids.bodyGradA})`} opacity="0.9" />
          <ellipse cx="68" cy="66" rx="10" ry="12" fill="black" opacity="0.6" />
          <path d="M50,62 Q68,42 86,62" fill="none" stroke={color} strokeWidth="1.2" opacity="0.8" />
          <path d="M50,62 Q68,42 86,62" fill="none" stroke="white" strokeWidth="0.4" opacity="0.6" />
          <path
            d="M54,78 Q44,100 40,130 Q38,155 42,178 Q50,195 68,198 Q78,188 80,170 Q84,145 82,118 Q80,95 76,78 Z"
            fill={`url(#${ids.bodyGradA})`}
            opacity="0.75"
          />
          <path d="M54,78 Q47,100 44,130 Q42,155 46,175" fill="none" stroke="white" strokeWidth="0.6" opacity="0.3" />
          <path d="M56,90 Q52,115 50,145" fill="none" stroke={color} strokeWidth="1" opacity="0.5" />
          <path d="M62,85 Q60,115 58,148" fill="none" stroke={color} strokeWidth="0.7" opacity="0.35" />
          <path d="M72,85 Q74,110 76,140" fill="none" stroke={color} strokeWidth="0.7" opacity="0.35" />
          <path d="M78,90 Q80,115 80,145" fill="none" stroke={color} strokeWidth="1" opacity="0.5" />
          <path d="M56,90 Q52,115 50,145" fill="none" stroke="white" strokeWidth="0.3" opacity="0.25" />
          <path d="M78,90 Q80,115 80,145" fill="none" stroke="white" strokeWidth="0.3" opacity="0.25" />
          <path d="M76,95 Q88,100 96,112" fill="none" stroke={`url(#${ids.bodyGradA})`} strokeWidth="9" opacity="0.7" strokeLinecap="round" />
          <path d="M76,95 Q88,100 96,112" fill="none" stroke={color} strokeWidth="5" opacity="0.5" strokeLinecap="round" />
          <path d="M76,95 Q88,100 96,112" fill="none" stroke="white" strokeWidth="1" opacity="0.4" strokeLinecap="round" />
          <path d="M96,112 Q100,118 100,126" fill="none" stroke={color} strokeWidth="4" opacity="0.6" strokeLinecap="round" />
          <path d="M96,112 Q100,118 100,126" fill="none" stroke="white" strokeWidth="0.8" opacity="0.4" strokeLinecap="round" />
          <path d="M98,126 Q99,128 100,129" fill="none" stroke="white" strokeWidth="1.5" opacity="0.8" strokeLinecap="round" />
          <path d="M99,124 Q100,126 101,128" fill="none" stroke="white" strokeWidth="1.2" opacity="0.7" strokeLinecap="round" />
          <path d="M100,123 Q101,125 102,127" fill="none" stroke="white" strokeWidth="1" opacity="0.6" strokeLinecap="round" />
          <path d="M101,124 Q102,126 102,128" fill="none" stroke="white" strokeWidth="0.8" opacity="0.5" strokeLinecap="round" />
          <path
            d="M54,78 Q44,100 40,130 Q38,155 42,178 Q50,195 68,198 Q78,188 80,170 Q84,145 82,118 Q80,95 76,78 Z"
            fill="none"
            stroke={color}
            strokeWidth="1.2"
            opacity="0.6"
          />
          <path
            d="M54,78 Q44,100 40,130 Q38,155 42,178 Q50,195 68,198 Q78,188 80,170 Q84,145 82,118 Q80,95 76,78 Z"
            fill="none"
            stroke="white"
            strokeWidth="0.4"
            opacity="0.35"
          />
        </g>

        {/* Twin B */}
        <g mask={`url(#${ids.mask})`}>
          <ellipse cx="132" cy="130" rx="38" ry="60" fill="none" stroke={colorB} strokeWidth="12" opacity="0.04" />
          <ellipse cx="132" cy="130" rx="30" ry="50" fill="none" stroke={colorB} strokeWidth="6" opacity="0.08" />
          <ellipse cx="132" cy="62" rx="18" ry="20" fill={`url(#${ids.bodyGradB})`} opacity="0.9" />
          <ellipse cx="132" cy="66" rx="10" ry="12" fill="black" opacity="0.6" />
          <path d="M114,62 Q132,42 150,62" fill="none" stroke={colorB} strokeWidth="1.2" opacity="0.8" />
          <path d="M114,62 Q132,42 150,62" fill="none" stroke="white" strokeWidth="0.4" opacity="0.6" />
          <path
            d="M146,78 Q156,100 160,130 Q162,155 158,178 Q150,195 132,198 Q122,188 120,170 Q116,145 118,118 Q120,95 124,78 Z"
            fill={`url(#${ids.bodyGradB})`}
            opacity="0.75"
          />
          <path d="M146,78 Q153,100 156,130 Q158,155 154,175" fill="none" stroke="white" strokeWidth="0.6" opacity="0.3" />
          <path d="M144,90 Q148,115 150,145" fill="none" stroke={colorB} strokeWidth="1" opacity="0.5" />
          <path d="M138,85 Q140,115 142,148" fill="none" stroke={colorB} strokeWidth="0.7" opacity="0.35" />
          <path d="M128,85 Q126,110 124,140" fill="none" stroke={colorB} strokeWidth="0.7" opacity="0.35" />
          <path d="M122,90 Q120,115 120,145" fill="none" stroke={colorB} strokeWidth="1" opacity="0.5" />
          <path d="M144,90 Q148,115 150,145" fill="none" stroke="white" strokeWidth="0.3" opacity="0.25" />
          <path d="M122,90 Q120,115 120,145" fill="none" stroke="white" strokeWidth="0.3" opacity="0.25" />
          <path d="M124,95 Q112,100 104,112" fill="none" stroke={`url(#${ids.bodyGradB})`} strokeWidth="9" opacity="0.7" strokeLinecap="round" />
          <path d="M124,95 Q112,100 104,112" fill="none" stroke={colorB} strokeWidth="5" opacity="0.5" strokeLinecap="round" />
          <path d="M124,95 Q112,100 104,112" fill="none" stroke="white" strokeWidth="1" opacity="0.4" strokeLinecap="round" />
          <path d="M104,112 Q100,118 100,126" fill="none" stroke={colorB} strokeWidth="4" opacity="0.6" strokeLinecap="round" />
          <path d="M104,112 Q100,118 100,126" fill="none" stroke="white" strokeWidth="0.8" opacity="0.4" strokeLinecap="round" />
          <path d="M102,126 Q101,128 100,129" fill="none" stroke="white" strokeWidth="1.5" opacity="0.8" strokeLinecap="round" />
          <path d="M101,124 Q100,126 99,128" fill="none" stroke="white" strokeWidth="1.2" opacity="0.7" strokeLinecap="round" />
          <path d="M100,123 Q99,125 98,127" fill="none" stroke="white" strokeWidth="1" opacity="0.6" strokeLinecap="round" />
          <path d="M99,124 Q98,126 98,128" fill="none" stroke="white" strokeWidth="0.8" opacity="0.5" strokeLinecap="round" />
          <path
            d="M146,78 Q156,100 160,130 Q162,155 158,178 Q150,195 132,198 Q122,188 120,170 Q116,145 118,118 Q120,95 124,78 Z"
            fill="none"
            stroke={colorB}
            strokeWidth="1.2"
            opacity="0.6"
          />
          <path
            d="M146,78 Q156,100 160,130 Q162,155 158,178 Q150,195 132,198 Q122,188 120,170 Q116,145 118,118 Q120,95 124,78 Z"
            fill="none"
            stroke="white"
            strokeWidth="0.4"
            opacity="0.35"
          />
        </g>

        {/* Merge zone */}
        <ellipse cx="100" cy="125" rx="18" ry="14" fill={`url(#${ids.mergeGrad})`} />
        <ellipse cx="100" cy="128" rx="8" ry="6" fill={`url(#${ids.glowA})`} opacity="0.7" />
        <ellipse cx="100" cy="128" rx="6" ry="5" fill={`url(#${ids.glowB})`} opacity="0.5" />
        <circle cx="100" cy="128" r="3" fill="white" opacity="0.9" />
        <circle cx="100" cy="128" r="1.5" fill="white" opacity="1" />
        <path d="M98,126 Q100,124 102,126" fill="none" stroke="white" strokeWidth="0.8" opacity="0.7" />
        <path d="M97,129 Q100,126 103,129" fill="none" stroke={color} strokeWidth="0.6" opacity="0.5" />
        <path d="M97,131 Q100,128 103,131" fill="none" stroke={colorB} strokeWidth="0.6" opacity="0.5" />
        <path d="M95,122 Q100,118 105,122" fill="none" stroke={color} strokeWidth="0.5" opacity="0.3" />
        <path d="M94,132 Q100,136 106,132" fill="none" stroke={colorB} strokeWidth="0.5" opacity="0.3" />

        {particlesA.map((p, i) => (
          <circle key={`pa${i}`} cx={p.cx} cy={p.cy} r={p.r} fill={color} opacity={p.o} />
        ))}
        {particlesB.map((p, i) => (
          <circle key={`pb${i}`} cx={p.cx} cy={p.cy} r={p.r} fill={colorB} opacity={p.o} />
        ))}
        {particlesMerge.map((p, i) => (
          <circle key={`pm${i}`} cx={p.cx} cy={p.cy} r={p.r} fill="white" opacity={p.o} />
        ))}
      </g>
    </SilhouetteFrame>
  );
}
