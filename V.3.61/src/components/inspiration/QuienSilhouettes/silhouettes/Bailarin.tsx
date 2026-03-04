import { useUniqueSvgIds } from '../../QuienTinderCards/useUniqueSvgIds';
import { SilhouetteFrame } from '../SilhouetteFrame';
import { getSilhouetteMetadata } from '../silhouetteMetadata';
import type { QuienSilhouetteProps } from '../types';

const SILHOUETTE_ID = 7 as const;

const DEFAULT_COLOR = '#c084fc';

const cx = 100;
const cy = 155;

const mantleLayers = [
  { rx: 52, ry: 18, rotate: -25, opacity: 0.55, dash: '0' },
  { rx: 62, ry: 22, rotate: -18, opacity: 0.38, dash: '80 8' },
  { rx: 72, ry: 27, rotate: -10, opacity: 0.25, dash: '60 12' },
  { rx: 82, ry: 32, rotate: -3, opacity: 0.15, dash: '40 16' },
  { rx: 92, ry: 37, rotate: 6, opacity: 0.08, dash: '20 20' },
];

const torsoFolds = [
  `M ${cx - 12},${cy - 30} Q ${cx},${cy - 20} ${cx + 12},${cy - 28}`,
  `M ${cx - 13},${cy - 10} Q ${cx},${cy} ${cx + 13},${cy - 8}`,
  `M ${cx - 11},${cy + 10} Q ${cx},${cy + 18} ${cx + 11},${cy + 12}`,
];

const upperHandOffsets = [-22, -12, 0, 10, 20];
const lowerHandOffsets = [-20, -10, 0, 12, 22];

/**
 * Bailarín: figura en rotación con manto centrífugo, brazos extendidos y afterimages.
 * Simboliza el movimiento, la danza y la energía cinética.
 */
export function Bailarin({
  className = '',
  color = DEFAULT_COLOR,
  hideLabel = false,
}: QuienSilhouetteProps) {
  const svgId = useUniqueSvgIds('bailarin');
  const ids = {
    body: svgId('body'),
    aura: svgId('aura'),
    mantle: svgId('mantle'),
    fade: svgId('fade'),
    mask: svgId('mask'),
    blur8: svgId('blur8'),
    blur6: svgId('blur6'),
    blur4: svgId('blur4'),
  };

  const particles = Array.from({ length: 16 }, (_, i) => {
    const angle = (i / 16) * Math.PI * 2 + i * 0.3;
    const r = 38 + (i % 4) * 14;
    return {
      x: cx + Math.cos(angle) * r,
      y: cy + Math.sin(angle) * r * 0.45,
      size: 1.2 - i * 0.04,
      opacity: 0.7 - i * 0.03,
    };
  });

  const meta = getSilhouetteMetadata(SILHOUETTE_ID);

  return (
    <SilhouetteFrame
      title={meta?.name ?? 'Bailarín'}
      subtitle={meta?.subtitle ?? 'Movimiento'}
      variant={meta?.labelVariant ?? 'violet'}
      className={className}
      hideLabel={hideLabel}
    >
      <g transform="translate(100, 160) scale(1.2) translate(-100, -160) translate(0, 22)">
        <defs>
          <radialGradient id={ids.body} cx="45%" cy="30%" r="65%">
            <stop offset="0%" stopColor="white" stopOpacity="0.95" />
            <stop offset="35%" stopColor={color} stopOpacity="0.85" />
            <stop offset="70%" stopColor={color} stopOpacity="0.55" />
            <stop offset="100%" stopColor={color} stopOpacity="0.1" />
          </radialGradient>
          <radialGradient id={ids.aura} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.18" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={ids.mantle} cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor={color} stopOpacity="0.6" />
            <stop offset="60%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={ids.fade} cx="50%" cy="50%" r="50%">
            <stop offset="55%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <mask id={ids.mask}>
            <ellipse cx={cx} cy={cy} rx="90" ry="85" fill={`url(#${ids.fade})`} />
          </mask>
          <filter id={ids.blur8}>
            <feGaussianBlur stdDeviation="4" />
          </filter>
          <filter id={ids.blur6}>
            <feGaussianBlur stdDeviation="3" />
          </filter>
          <filter id={ids.blur4}>
            <feGaussianBlur stdDeviation="2" />
          </filter>
        </defs>

        <g mask={`url(#${ids.mask})`}>
          <ellipse cx={cx} cy={cy} rx="88" ry="80" fill={`url(#${ids.aura})`} />

          {mantleLayers.map((l, i) => (
            <g key={i} transform={`rotate(${l.rotate}, ${cx}, ${cy})`}>
              <ellipse
                cx={cx}
                cy={cy}
                rx={l.rx + 4}
                ry={l.ry + 3}
                fill="none"
                stroke={color}
                strokeWidth="6"
                opacity={l.opacity * 0.3}
                strokeDasharray={l.dash}
              />
              <ellipse
                cx={cx}
                cy={cy}
                rx={l.rx}
                ry={l.ry}
                fill="none"
                stroke={color}
                strokeWidth="1.2"
                opacity={l.opacity}
                strokeDasharray={l.dash}
                strokeLinecap="round"
              />
              <ellipse
                cx={cx}
                cy={cy}
                rx={l.rx}
                ry={l.ry}
                fill="none"
                stroke="white"
                strokeWidth="0.4"
                opacity={l.opacity * 0.5}
                strokeDasharray={l.dash}
              />
            </g>
          ))}

          {Array.from({ length: 12 }, (_, i) => {
            const angle = (i / 12) * Math.PI * 2 - 0.4;
            const r1 = 22;
            const r2 = 58 + (i % 3) * 8;
            return (
              <line
                key={i}
                x1={cx + Math.cos(angle) * r1}
                y1={cy + Math.sin(angle) * r1 * 0.5}
                x2={cx + Math.cos(angle) * r2}
                y2={cy + Math.sin(angle) * r2 * 0.45}
                stroke={color}
                strokeWidth="0.7"
                opacity={0.15 + (i % 3) * 0.08}
                strokeLinecap="round"
              />
            );
          })}

          {particles.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r={p.size + 1.5} fill={color} opacity={p.opacity * 0.2} />
              <circle cx={p.x} cy={p.y} r={p.size} fill={color} opacity={p.opacity} />
              <circle cx={p.x} cy={p.y} r={p.size * 0.4} fill="white" opacity={p.opacity * 0.8} />
            </g>
          ))}

          {/* Brazo superior */}
          <path
            d={`M ${cx - 8},${cy - 22} Q ${cx - 38},${cy - 62} ${cx - 52},${cy - 88}`}
            fill="none"
            stroke={color}
            strokeWidth="4"
            opacity="0.06"
            strokeLinecap="round"
          />
          <path
            d={`M ${cx - 6},${cy - 22} Q ${cx - 34},${cy - 60} ${cx - 46},${cy - 84}`}
            fill="none"
            stroke={color}
            strokeWidth="5"
            opacity="0.12"
            strokeLinecap="round"
          />
          <path
            d={`M ${cx - 4},${cy - 22} Q ${cx - 30},${cy - 58} ${cx - 40},${cy - 80}`}
            fill="none"
            stroke={color}
            strokeWidth="6"
            opacity="0.18"
            strokeLinecap="round"
          />
          <path
            d={`M ${cx},${cy - 22} Q ${cx - 26},${cy - 56} ${cx - 34},${cy - 76}`}
            fill="none"
            stroke={`url(#${ids.body})`}
            strokeWidth="7"
            strokeLinecap="round"
            opacity="0.9"
          />
          <path
            d={`M ${cx},${cy - 22} Q ${cx - 26},${cy - 56} ${cx - 34},${cy - 76}`}
            fill="none"
            stroke="white"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.5"
          />

          {/* Brazo inferior */}
          <path
            d={`M ${cx + 8},${cy - 10} Q ${cx + 38},${cy + 28} ${cx + 52},${cy + 52}`}
            fill="none"
            stroke={color}
            strokeWidth="4"
            opacity="0.06"
            strokeLinecap="round"
          />
          <path
            d={`M ${cx + 6},${cy - 10} Q ${cx + 34},${cy + 26} ${cx + 46},${cy + 50}`}
            fill="none"
            stroke={color}
            strokeWidth="5"
            opacity="0.12"
            strokeLinecap="round"
          />
          <path
            d={`M ${cx + 4},${cy - 10} Q ${cx + 30},${cy + 24} ${cx + 40},${cy + 48}`}
            fill="none"
            stroke={color}
            strokeWidth="6"
            opacity="0.18"
            strokeLinecap="round"
          />
          <path
            d={`M ${cx},${cy - 10} Q ${cx + 26},${cy + 22} ${cx + 34},${cy + 44}`}
            fill="none"
            stroke={`url(#${ids.body})`}
            strokeWidth="7"
            strokeLinecap="round"
            opacity="0.9"
          />
          <path
            d={`M ${cx},${cy - 10} Q ${cx + 26},${cy + 22} ${cx + 34},${cy + 44}`}
            fill="none"
            stroke="white"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.5"
          />

          {upperHandOffsets.map((offset, i) => (
            <line
              key={i}
              x1={cx - 34 + offset * 0.3}
              y1={cy - 76}
              x2={cx - 40 + offset * 0.5}
              y2={cy - 84 - Math.abs(offset) * 0.3}
              stroke={color}
              strokeWidth="1.2"
              opacity="0.7"
              strokeLinecap="round"
            />
          ))}
          {lowerHandOffsets.map((offset, i) => (
            <line
              key={i}
              x1={cx + 34 + offset * 0.3}
              y1={cy + 44}
              x2={cx + 40 + offset * 0.5}
              y2={cy + 52 + Math.abs(offset) * 0.3}
              stroke={color}
              strokeWidth="1.2"
              opacity="0.7"
              strokeLinecap="round"
            />
          ))}

          <ellipse
            cx={cx}
            cy={cy - 10}
            rx="22"
            ry="32"
            fill={color}
            opacity="0.12"
            filter={`url(#${ids.blur8})`}
          />
          <path
            d={`M ${cx - 14},${cy - 42} C ${cx - 18},${cy - 20} ${cx - 16},${cy + 10} ${cx - 10},${cy + 28}
                  L ${cx + 10},${cy + 28} C ${cx + 16},${cy + 10} ${cx + 18},${cy - 20} ${cx + 14},${cy - 42} Z`}
            fill={`url(#${ids.body})`}
            opacity="0.85"
          />
          <path
            d={`M ${cx - 14},${cy - 42} C ${cx - 18},${cy - 20} ${cx - 16},${cy + 10} ${cx - 10},${cy + 28}
                  L ${cx + 10},${cy + 28} C ${cx + 16},${cy + 10} ${cx + 18},${cy - 20} ${cx + 14},${cy - 42} Z`}
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            opacity="0.6"
          />
          <path
            d={`M ${cx - 14},${cy - 42} C ${cx - 18},${cy - 20} ${cx - 16},${cy + 10} ${cx - 10},${cy + 28}
                  L ${cx + 10},${cy + 28} C ${cx + 16},${cy + 10} ${cx + 18},${cy - 20} ${cx + 14},${cy - 42} Z`}
            fill="none"
            stroke="white"
            strokeWidth="0.5"
            opacity="0.35"
          />

          {torsoFolds.map((d, i) => (
            <g key={i}>
              <path d={d} fill="none" stroke="black" strokeWidth="1.5" opacity="0.2" strokeLinecap="round" />
              <path d={d} fill="none" stroke="white" strokeWidth="0.5" opacity="0.25" strokeLinecap="round" />
            </g>
          ))}

          <ellipse
            cx={cx - 2}
            cy={cy - 54}
            rx="16"
            ry="16"
            fill={color}
            opacity="0.15"
            filter={`url(#${ids.blur6})`}
          />
          <ellipse cx={cx - 2} cy={cy - 54} rx="13" ry="14" fill={`url(#${ids.body})`} opacity="0.9" />
          <ellipse cx={cx - 2} cy={cy - 54} rx="13" ry="14" fill="none" stroke={color} strokeWidth="1.2" opacity="0.6" />
          <ellipse cx={cx - 2} cy={cy - 54} rx="13" ry="14" fill="none" stroke="white" strokeWidth="0.4" opacity="0.3" />
          <ellipse cx={cx - 5} cy={cy - 59} rx="5" ry="4" fill="white" opacity="0.2" />

          <line
            x1={cx}
            y1={cy - 92}
            x2={cx}
            y2={cy + 62}
            stroke={color}
            strokeWidth="4"
            opacity="0.08"
            strokeDasharray="4 6"
            strokeLinecap="round"
          />
          <line
            x1={cx}
            y1={cy - 92}
            x2={cx}
            y2={cy + 62}
            stroke={color}
            strokeWidth="1"
            opacity="0.3"
            strokeDasharray="4 6"
            strokeLinecap="round"
          />

          <path
            d={`M ${cx - 8},${cy + 28} Q ${cx - 20},${cy + 46} ${cx - 16},${cy + 68}`}
            fill="none"
            stroke={`url(#${ids.body})`}
            strokeWidth="8"
            strokeLinecap="round"
            opacity="0.85"
          />
          <path
            d={`M ${cx - 8},${cy + 28} Q ${cx - 20},${cy + 46} ${cx - 16},${cy + 68}`}
            fill="none"
            stroke="white"
            strokeWidth="1"
            opacity="0.25"
            strokeLinecap="round"
          />
          <path
            d={`M ${cx + 8},${cy + 28} Q ${cx + 22},${cy + 44} ${cx + 18},${cy + 68}`}
            fill="none"
            stroke={`url(#${ids.body})`}
            strokeWidth="8"
            strokeLinecap="round"
            opacity="0.85"
          />
          <path
            d={`M ${cx + 8},${cy + 28} Q ${cx + 22},${cy + 44} ${cx + 18},${cy + 68}`}
            fill="none"
            stroke="white"
            strokeWidth="1"
            opacity="0.25"
            strokeLinecap="round"
          />

          <ellipse cx={cx - 14} cy={cy + 70} rx="8" ry="3.5" fill={color} opacity="0.5" />
          <ellipse cx={cx + 18} cy={cy + 70} rx="8" ry="3.5" fill={color} opacity="0.5" />

          <ellipse
            cx={cx + 2}
            cy={cy + 74}
            rx="38"
            ry="8"
            fill={color}
            opacity="0.07"
            filter={`url(#${ids.blur4})`}
          />
        </g>
      </g>
    </SilhouetteFrame>
  );
}
