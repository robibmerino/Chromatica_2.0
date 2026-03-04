import { useUniqueSvgIds } from '../../QuienTinderCards/useUniqueSvgIds';
import { SilhouetteFrame } from '../SilhouetteFrame';
import { getSilhouetteMetadata } from '../silhouetteMetadata';
import type { QuienSilhouetteProps } from '../types';

const SILHOUETTE_ID = 8 as const;

const DEFAULT_COLOR = '#e879f9';

const cx = 100;
const cy = 155;

const echoOffsets = [
  { dx: 8, dy: 2, scale: 0.98, opacity: 0.22 },
  { dx: 16, dy: 4, scale: 0.96, opacity: 0.14 },
  { dx: 24, dy: 6, scale: 0.94, opacity: 0.08 },
  { dx: 32, dy: 8, scale: 0.91, opacity: 0.04 },
];

const waveRings = [
  { r: 4, opacity: 0.7, sw: 1 },
  { r: 8, opacity: 0.45, sw: 0.8 },
  { r: 14, opacity: 0.25, sw: 0.6 },
  { r: 22, opacity: 0.12, sw: 0.5 },
  { r: 32, opacity: 0.06, sw: 0.4 },
  { r: 44, opacity: 0.03, sw: 0.3 },
];

const propagationArcs = Array.from({ length: 5 }, (_, i) => ({
  r: 25 + i * 18,
  opacity: 0.15 - i * 0.025,
  dash: `${4 + i * 2} ${6 + i * 2}`,
}));

/**
 * Eco: figura de pie con brazo extendido señalando, ondas de propagación y copias de eco.
 * Simboliza la resonancia, el eco y la propagación.
 */
export function Eco({
  className = '',
  color = DEFAULT_COLOR,
  hideLabel = false,
}: QuienSilhouetteProps) {
  const svgId = useUniqueSvgIds('eco');
  const ids = {
    aura1: svgId('aura1'),
    aura2: svgId('aura2'),
    aura3: svgId('aura3'),
    body: svgId('body'),
    glow: svgId('glow'),
    blur1: svgId('blur1'),
    blur2: svgId('blur2'),
    blur3: svgId('blur3'),
    blurAura: svgId('blurAura'),
    blurMed: svgId('blurMed'),
    blurSoft: svgId('blurSoft'),
  };

  const particles = Array.from({ length: 18 }, (_, i) => {
    const angle = (i / 18) * Math.PI * 2 - 0.5;
    const r = 35 + (i % 4) * 12;
    return {
      x: cx - 30 + Math.cos(angle) * r + (i % 3) * 3,
      y: cy - 70 + Math.sin(angle) * r * 0.4 + (i % 5) * 4,
      r: 0.5 + (i % 3) * 0.35,
      opacity: 0.15 + (i % 4) * 0.1,
    };
  });

  const meta = getSilhouetteMetadata(SILHOUETTE_ID);

  return (
    <SilhouetteFrame
      title={meta?.name ?? 'Eco'}
      subtitle={meta?.subtitle ?? 'Resonancia'}
      variant={meta?.labelVariant ?? 'fuchsia'}
      className={className}
      hideLabel={hideLabel}
    >
      <g transform="translate(100, 160) scale(1.15) translate(-100, -160) translate(0, 18)">
        <defs>
          <radialGradient id={ids.aura1} cx="45%" cy="45%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={ids.aura2} cx="45%" cy="45%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={ids.aura3} cx="45%" cy="45%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.45" />
            <stop offset="60%" stopColor={color} stopOpacity="0.12" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={ids.body} cx="40%" cy="30%" r="65%">
            <stop offset="0%" stopColor="white" stopOpacity="0.6" />
            <stop offset="40%" stopColor={color} stopOpacity="0.9" />
            <stop offset="100%" stopColor={color} stopOpacity="0.25" />
          </radialGradient>
          <radialGradient id={ids.glow} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="0.95" />
            <stop offset="35%" stopColor={color} stopOpacity="0.7" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
          <filter id={ids.blur1}>
            <feGaussianBlur stdDeviation="3" />
          </filter>
          <filter id={ids.blur2}>
            <feGaussianBlur stdDeviation="5" />
          </filter>
          <filter id={ids.blur3}>
            <feGaussianBlur stdDeviation="8" />
          </filter>
          <filter id={ids.blurAura}>
            <feGaussianBlur stdDeviation="14" />
          </filter>
          <filter id={ids.blurMed}>
            <feGaussianBlur stdDeviation="7" />
          </filter>
          <filter id={ids.blurSoft}>
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        {/* Deep aura */}
        <ellipse cx={cx} cy={cy} rx="85" ry="115" fill={`url(#${ids.aura1})`} filter={`url(#${ids.blurAura})`} />

        {/* Ondas de propagación — arcos desde el punto focal (fingertip) */}
        {propagationArcs.map((arc, i) => (
          <ellipse
            key={i}
            cx={cx - 54}
            cy={cy - 78}
            rx={arc.r}
            ry={arc.r * 0.45}
            fill="none"
            stroke={color}
            strokeWidth="0.8"
            strokeDasharray={arc.dash}
            opacity={arc.opacity}
            transform={`rotate(-12 ${cx - 54} ${cy - 78})`}
          />
        ))}

        {/* Echo copies — figuras que se desvanecen */}
        {echoOffsets.map((echo, i) => (
          <g
            key={i}
            transform={`translate(${echo.dx}, ${echo.dy}) scale(${echo.scale}) translate(${cx * (1 - echo.scale)}, ${cy * (1 - echo.scale)})`}
            opacity={echo.opacity}
            filter={`url(#${[ids.blur1, ids.blur2, ids.blur3, ids.blur3][i]})`}
          >
            <path
              d={`M ${cx - 2},${cy - 52} Q ${cx - 4},${cy - 48} ${cx},${cy - 45} Q ${cx + 4},${cy - 48} ${cx + 2},${cy - 52} Z`}
              fill={color}
            />
            <path
              d={`M ${cx - 12},${cy - 42} Q ${cx - 16},${cy - 10} ${cx - 10},${cy + 28} L ${cx + 10},${cy + 28} Q ${cx + 16},${cy - 10} ${cx + 12},${cy - 42} Z`}
              fill={color}
            />
            <path d={`M ${cx - 10},${cy - 38} Q ${cx - 28},${cy - 55} ${cx - 44},${cy - 72}`} fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" />
            <path d={`M ${cx - 8},${cy + 28} Q ${cx - 18},${cy + 55} ${cx - 14},${cy + 72}`} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round" />
            <path d={`M ${cx + 8},${cy + 28} Q ${cx + 18},${cy + 55} ${cx + 14},${cy + 72}`} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round" />
          </g>
        ))}

        {/* Medium aura */}
        <ellipse cx={cx} cy={cy} rx="65" ry="90" fill={`url(#${ids.aura2})`} filter={`url(#${ids.blurMed})`} />
        <ellipse cx={cx} cy={cy} rx="50" ry="72" fill={`url(#${ids.aura3})`} filter={`url(#${ids.blurSoft})`} />

        {/* Cabeza y capucha */}
        <path
          d={`M ${cx - 2},${cy - 52} Q ${cx - 4},${cy - 48} ${cx},${cy - 45} Q ${cx + 4},${cy - 48} ${cx + 2},${cy - 52} Z`}
          fill={`url(#${ids.body})`}
          opacity="0.95"
        />
        <path
          d={`M ${cx - 8},${cy - 50} Q ${cx - 12},${cy - 42} ${cx - 10},${cy - 35} Q ${cx - 6},${cy - 38} ${cx},${cy - 40} Q ${cx + 6},${cy - 38} ${cx + 10},${cy - 35} Q ${cx + 12},${cy - 42} ${cx + 8},${cy - 50} Z`}
          fill={`url(#${ids.body})`}
          opacity="0.88"
        />
        <ellipse cx={cx} cy={cy - 46} rx="6" ry="5" fill="black" opacity="0.5" />

        {/* Torso */}
        <path
          d={`M ${cx - 12},${cy - 42} Q ${cx - 16},${cy - 10} ${cx - 10},${cy + 28} L ${cx + 10},${cy + 28} Q ${cx + 16},${cy - 10} ${cx + 12},${cy - 42} Z`}
          fill={`url(#${ids.body})`}
          opacity="0.9"
        />
        <path
          d={`M ${cx - 12},${cy - 42} Q ${cx - 16},${cy - 10} ${cx - 10},${cy + 28} L ${cx + 10},${cy + 28} Q ${cx + 16},${cy - 10} ${cx + 12},${cy - 42} Z`}
          fill="none"
          stroke={color}
          strokeWidth="0.8"
          opacity="0.5"
        />
        <path d={`M ${cx - 8},${cy - 20} Q ${cx},${cy - 15} ${cx + 8},${cy - 22}`} fill="none" stroke="white" strokeWidth="0.5" opacity="0.3" />

        {/* Brazo extendido — señalando */}
        <path
          d={`M ${cx - 10},${cy - 38} Q ${cx - 22},${cy - 52} ${cx - 34},${cy - 65} Q ${cx - 42},${cy - 72} ${cx - 46},${cy - 75}`}
          fill="none"
          stroke={`url(#${ids.body})`}
          strokeWidth="7"
          strokeLinecap="round"
          opacity="0.9"
        />
        <path
          d={`M ${cx - 10},${cy - 38} Q ${cx - 22},${cy - 52} ${cx - 34},${cy - 65} Q ${cx - 42},${cy - 72} ${cx - 46},${cy - 75}`}
          fill="none"
          stroke="white"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.45"
        />
        <ellipse cx={cx - 44} cy={cy - 73} rx="5" ry="4" fill={color} opacity="0.85" />
        <line x1={cx - 46} y1={cy - 75} x2={cx - 54} y2={cy - 78} stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity="0.95" />
        <line x1={cx - 46} y1={cy - 75} x2={cx - 54} y2={cy - 78} stroke="white" strokeWidth="0.6" strokeLinecap="round" opacity="0.5" />

        {/* Brazo en reposo */}
        <path
          d={`M ${cx + 10},${cy - 35} Q ${cx + 22},${cy - 38} ${cx + 28},${cy - 32}`}
          fill="none"
          stroke={`url(#${ids.body})`}
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.75"
        />

        {/* Piernas */}
        <path d={`M ${cx - 8},${cy + 28} Q ${cx - 18},${cy + 55} ${cx - 14},${cy + 72}`} fill="none" stroke={`url(#${ids.body})`} strokeWidth="8" strokeLinecap="round" opacity="0.85" />
        <path d={`M ${cx - 8},${cy + 28} Q ${cx - 18},${cy + 55} ${cx - 14},${cy + 72}`} fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.25" />
        <path d={`M ${cx + 8},${cy + 28} Q ${cx + 18},${cy + 55} ${cx + 14},${cy + 72}`} fill="none" stroke={`url(#${ids.body})`} strokeWidth="8" strokeLinecap="round" opacity="0.85" />
        <path d={`M ${cx + 8},${cy + 28} Q ${cx + 18},${cy + 55} ${cx + 14},${cy + 72}`} fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.25" />
        <ellipse cx={cx - 14} cy={cy + 74} rx="7" ry="3.5" fill={color} opacity="0.5" />
        <ellipse cx={cx + 14} cy={cy + 74} rx="7" ry="3.5" fill={color} opacity="0.5" />

        {/* Punto focal — ondas de impacto */}
        <circle cx={cx - 54} cy={cy - 78} r="20" fill={`url(#${ids.glow})`} opacity="0.25" filter={`url(#${ids.blur2})`} />
        {waveRings.map((ring, i) => (
          <circle
            key={i}
            cx={cx - 54}
            cy={cy - 78}
            r={ring.r}
            fill="none"
            stroke={color}
            strokeWidth={ring.sw}
            opacity={ring.opacity}
          />
        ))}
        <circle cx={cx - 54} cy={cy - 78} r="3" fill="white" opacity="0.95" />
        <circle cx={cx - 54} cy={cy - 78} r="1.5" fill={color} opacity="0.9" />

        {/* Partículas de resonancia */}
        {particles.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={p.r}
            fill={i % 3 === 0 ? 'white' : color}
            opacity={p.opacity}
          />
        ))}

        {/* Eco en el suelo */}
        <ellipse cx={cx} cy={cy + 82} rx="22" ry="4" fill={color} opacity="0.1" filter={`url(#${ids.blur1})`} />
      </g>
    </SilhouetteFrame>
  );
}
