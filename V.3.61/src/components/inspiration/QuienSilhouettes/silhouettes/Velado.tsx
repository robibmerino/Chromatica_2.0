import { useUniqueSvgIds } from '../../QuienTinderCards/useUniqueSvgIds';
import { SilhouetteFrame } from '../SilhouetteFrame';
import { getSilhouetteMetadata } from '../silhouetteMetadata';
import type { QuienSilhouetteProps } from '../types';

const SILHOUETTE_ID = 10 as const;

const DEFAULT_COLOR = '#c084fc';

const handFingers = [
  { x1: 74, y1: 140, x2: 72, y2: 128, cx1: 73, cy1: 135, cx2: 71, cy2: 131 },
  { x1: 77, y1: 139, x2: 76, y2: 126, cx1: 76, cy1: 133, cx2: 75, cy2: 129 },
  { x1: 80, y1: 139, x2: 80, y2: 126, cx1: 80, cy1: 133, cx2: 80, cy2: 129 },
  { x1: 83, y1: 140, x2: 84, y2: 128, cx1: 83, cy1: 134, cx2: 84, cy2: 131 },
  { x1: 85, y1: 144, x2: 90, y2: 135, cx1: 87, cy1: 140, cx2: 89, cy2: 137 },
];

const particles = [
  { cx: 58, cy: 108, r: 1.2, o: 0.5 },
  { cx: 142, cy: 102, r: 0.9, o: 0.4 },
  { cx: 65, cy: 235, r: 1.1, o: 0.45 },
  { cx: 138, cy: 232, r: 0.8, o: 0.38 },
  { cx: 48, cy: 152, r: 1.0, o: 0.42 },
  { cx: 155, cy: 148, r: 1.2, o: 0.48 },
  { cx: 88, cy: 55, r: 0.9, o: 0.4 },
  { cx: 115, cy: 52, r: 1.1, o: 0.44 },
  { cx: 100, cy: 240, r: 1.0, o: 0.38 },
  { cx: 72, cy: 168, r: 0.7, o: 0.35 },
  { cx: 130, cy: 162, r: 0.8, o: 0.38 },
  { cx: 100, cy: 125, r: 0.6, o: 0.3 },
];

/**
 * Velado: figura envuelta en velos con mano emergente y luz interior.
 * Simboliza el misterio, lo oculto y la revelación.
 */
export function Velado({
  className = '',
  color = DEFAULT_COLOR,
  hideLabel = false,
}: QuienSilhouetteProps) {
  const svgId = useUniqueSvgIds('velado');
  const ids = {
    core: svgId('core'),
    inner: svgId('inner'),
    hand: svgId('hand'),
    blur1: svgId('blur1'),
    blur2: svgId('blur2'),
    blur3: svgId('blur3'),
    veil1: svgId('veil1'),
    veil2: svgId('veil2'),
    veil3: svgId('veil3'),
  };

  const meta = getSilhouetteMetadata(SILHOUETTE_ID);

  return (
    <SilhouetteFrame
      title={meta?.name ?? 'Velado'}
      subtitle={meta?.subtitle ?? 'Misterio'}
      variant={meta?.labelVariant ?? 'violet'}
      className={className}
      hideLabel={hideLabel}
    >
      <g transform="translate(100, 160) scale(1.15) translate(-100, -160) translate(0, 18)">
        <defs>
          <radialGradient id={ids.core} cx="50%" cy="45%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="0.18" />
            <stop offset="40%" stopColor={color} stopOpacity="0.10" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={ids.inner} cx="50%" cy="45%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="0.25" />
            <stop offset="60%" stopColor={color} stopOpacity="0.12" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={ids.hand} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="0.9" />
            <stop offset="60%" stopColor={color} stopOpacity="0.5" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
          <filter id={ids.blur1}>
            <feGaussianBlur stdDeviation="6" />
          </filter>
          <filter id={ids.blur2}>
            <feGaussianBlur stdDeviation="3" />
          </filter>
          <filter id={ids.blur3}>
            <feGaussianBlur stdDeviation="1.5" />
          </filter>
          <linearGradient id={ids.veil1} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.22" />
            <stop offset="100%" stopColor={color} stopOpacity="0.06" />
          </linearGradient>
          <linearGradient id={ids.veil2} x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.18" />
            <stop offset="100%" stopColor={color} stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id={ids.veil3} x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0.20" />
            <stop offset="100%" stopColor={color} stopOpacity="0.04" />
          </linearGradient>
        </defs>

        {/* Silueta central */}
        <ellipse cx="100" cy="155" rx="22" ry="55" fill={`url(#${ids.core})`} filter={`url(#${ids.blur1})`} />

        {/* Velo 1 */}
        <path
          d="M 68,210 C 55,180 50,140 62,100 C 70,75 85,65 95,70 C 110,75 115,95 108,130 C 100,165 88,190 68,210 Z"
          fill={`url(#${ids.veil1})`}
          stroke={color}
          strokeWidth="0.8"
          strokeOpacity="0.3"
        />
        <path
          d="M 68,210 C 55,180 50,140 62,100 C 70,75 85,65 95,70 C 110,75 115,95 108,130 C 100,165 88,190 68,210 Z"
          fill="none"
          stroke={color}
          strokeWidth="0.3"
          strokeOpacity="0.7"
          filter={`url(#${ids.blur3})`}
        />
        <path d="M 72,190 C 65,165 62,135 68,108" fill="none" stroke={color} strokeWidth="0.4" strokeOpacity="0.4" />
        <path d="M 82,200 C 76,172 74,145 80,118" fill="none" stroke={color} strokeWidth="0.4" strokeOpacity="0.35" />
        <path d="M 92,205 C 88,178 87,152 90,125" fill="none" stroke={color} strokeWidth="0.4" strokeOpacity="0.3" />

        {/* Velo 2 */}
        <path
          d="M 132,90 C 145,110 150,145 142,175 C 135,198 120,215 108,210 C 95,205 90,185 96,158 C 103,130 118,108 132,90 Z"
          fill={`url(#${ids.veil2})`}
          stroke={color}
          strokeWidth="0.8"
          strokeOpacity="0.28"
        />
        <path
          d="M 132,90 C 145,110 150,145 142,175 C 135,198 120,215 108,210 C 95,205 90,185 96,158 C 103,130 118,108 132,90 Z"
          fill="none"
          stroke={color}
          strokeWidth="0.3"
          strokeOpacity="0.65"
          filter={`url(#${ids.blur3})`}
        />
        <path d="M 128,105 C 138,128 140,155 133,178" fill="none" stroke={color} strokeWidth="0.4" strokeOpacity="0.38" />
        <path d="M 118,100 C 126,124 127,150 120,172" fill="none" stroke={color} strokeWidth="0.4" strokeOpacity="0.32" />
        <path d="M 108,98 C 114,122 114,148 108,168" fill="none" stroke={color} strokeWidth="0.4" strokeOpacity="0.28" />

        {/* Velo 3 */}
        <path
          d="M 72,90 C 78,68 92,58 105,60 C 120,62 130,75 128,92 C 125,108 112,118 98,115 C 84,112 70,108 72,90 Z"
          fill={`url(#${ids.veil3})`}
          stroke={color}
          strokeWidth="0.8"
          strokeOpacity="0.32"
        />
        <path
          d="M 72,90 C 78,68 92,58 105,60 C 120,62 130,75 128,92 C 125,108 112,118 98,115 C 84,112 70,108 72,90 Z"
          fill="none"
          stroke={color}
          strokeWidth="0.3"
          strokeOpacity="0.7"
          filter={`url(#${ids.blur3})`}
        />
        <path d="M 80,88 C 86,72 98,65 112,68" fill="none" stroke={color} strokeWidth="0.4" strokeOpacity="0.4" />
        <path d="M 82,98 C 90,84 102,78 116,80" fill="none" stroke={color} strokeWidth="0.4" strokeOpacity="0.32" />

        {/* Velo 4 */}
        <path
          d="M 60,175 C 52,195 55,220 68,230 C 80,240 95,235 100,220 C 106,205 100,188 88,180 C 76,172 64,168 60,175 Z"
          fill={`url(#${ids.veil1})`}
          stroke={color}
          strokeWidth="0.8"
          strokeOpacity="0.25"
        />
        <path
          d="M 60,175 C 52,195 55,220 68,230 C 80,240 95,235 100,220 C 106,205 100,188 88,180 C 76,172 64,168 60,175 Z"
          fill="none"
          stroke={color}
          strokeWidth="0.3"
          strokeOpacity="0.6"
          filter={`url(#${ids.blur3})`}
        />
        <path d="M 64,180 C 58,198 60,215 70,225" fill="none" stroke={color} strokeWidth="0.4" strokeOpacity="0.35" />
        <path d="M 75,178 C 70,196 72,212 80,220" fill="none" stroke={color} strokeWidth="0.4" strokeOpacity="0.28" />

        {/* Velo 5 */}
        <path
          d="M 140,175 C 148,192 146,218 134,228 C 122,238 108,233 104,218 C 100,203 106,186 118,178 C 130,170 142,168 140,175 Z"
          fill={`url(#${ids.veil2})`}
          stroke={color}
          strokeWidth="0.8"
          strokeOpacity="0.25"
        />
        <path
          d="M 140,175 C 148,192 146,218 134,228 C 122,238 108,233 104,218 C 100,203 106,186 118,178 C 130,170 142,168 140,175 Z"
          fill="none"
          stroke={color}
          strokeWidth="0.3"
          strokeOpacity="0.6"
          filter={`url(#${ids.blur3})`}
        />
        <path d="M 136,180 C 142,196 140,213 130,223" fill="none" stroke={color} strokeWidth="0.4" strokeOpacity="0.35" />
        <path d="M 126,177 C 130,194 128,210 120,220" fill="none" stroke={color} strokeWidth="0.4" strokeOpacity="0.28" />

        {/* Velo 6 */}
        <path
          d="M 52,120 C 42,138 44,162 54,178 C 62,190 74,192 80,182 C 88,170 84,148 76,130 C 68,112 58,106 52,120 Z"
          fill={`url(#${ids.veil3})`}
          stroke={color}
          strokeWidth="0.7"
          strokeOpacity="0.22"
        />
        <path d="M 56,125 C 48,142 50,165 58,178" fill="none" stroke={color} strokeWidth="0.4" strokeOpacity="0.3" />

        {/* Velo 7 */}
        <path
          d="M 148,120 C 158,138 156,162 146,178 C 138,190 126,192 120,182 C 112,170 116,148 124,130 C 132,112 142,106 148,120 Z"
          fill={`url(#${ids.veil2})`}
          stroke={color}
          strokeWidth="0.7"
          strokeOpacity="0.22"
        />
        <path d="M 144,125 C 152,142 150,165 142,178" fill="none" stroke={color} strokeWidth="0.4" strokeOpacity="0.3" />

        {/* Luz interior */}
        <ellipse cx="100" cy="148" rx="18" ry="28" fill={`url(#${ids.inner})`} filter={`url(#${ids.blur2})`} />

        {/* Mano emergente */}
        <ellipse cx="78" cy="148" rx="7" ry="9" fill={color} fillOpacity="0.15" />
        <ellipse cx="78" cy="148" rx="7" ry="9" fill="none" stroke={color} strokeWidth="0.6" strokeOpacity="0.5" />
        {handFingers.map((f, i) => (
          <g key={i}>
            <path
              d={`M ${f.x1},${f.y1} C ${f.cx1},${f.cy1} ${f.cx2},${f.cy2} ${f.x2},${f.y2}`}
              fill="none"
              stroke={color}
              strokeWidth="2.5"
              strokeOpacity="0.18"
              strokeLinecap="round"
            />
            <path
              d={`M ${f.x1},${f.y1} C ${f.cx1},${f.cy1} ${f.cx2},${f.cy2} ${f.x2},${f.y2}`}
              fill="none"
              stroke={color}
              strokeWidth="1.2"
              strokeOpacity="0.55"
              strokeLinecap="round"
            />
            <path
              d={`M ${f.x1},${f.y1} C ${f.cx1},${f.cy1} ${f.cx2},${f.cy2} ${f.x2},${f.y2}`}
              fill="none"
              stroke="white"
              strokeWidth="0.4"
              strokeOpacity="0.6"
              strokeLinecap="round"
            />
          </g>
        ))}
        <ellipse cx="76" cy="145" rx="3" ry="4" fill={`url(#${ids.hand})`} />

        {/* Partículas */}
        {particles.map((p, i) => (
          <g key={i}>
            <circle cx={p.cx} cy={p.cy} r={p.r * 2.5} fill={color} fillOpacity={p.o * 0.2} />
            <circle cx={p.cx} cy={p.cy} r={p.r} fill={color} fillOpacity={p.o} />
            <circle cx={p.cx} cy={p.cy} r={p.r * 0.4} fill="white" fillOpacity={p.o * 0.8} />
          </g>
        ))}
      </g>
    </SilhouetteFrame>
  );
}
