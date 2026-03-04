import { useUniqueSvgIds } from '../useUniqueSvgIds';
import { CharacterFrame } from '../CharacterFrame';
import type { QuienCharacterProps } from '../types';
import { useCreatureAxisPalette, getCreatureMetadata } from '../../archetypeCardComponents/creatures';

/** Paleta base de Prisma (Influencia: vibrante; Introspección: más profundo al rotar). */
const PRISMA_PALETTE = {
  star0: '#ff6b9d',
  star1: '#ff9a6b',
  star2: '#ffde59',
  star3: '#a8ff6b',
  star4: '#59ffd8',
  star5: '#59b8ff',
  star6: '#9d6bff',
  star7: '#ff6bff',
  star8: '#ff6b6b',
  star9: '#ffffff',
  ring0: '#ff6b9d',
  ring1: '#ffde59',
  ring2: '#59ffd8',
  node0: '#ff6b9d',
  node1: '#ff9a6b',
  node2: '#ffde59',
  node3: '#a8ff6b',
} as const;

const CREATURE_ID = 26 as const;

const CX = 100;
const CY = 160;

const NODE_COLOR_KEYS: (keyof typeof PRISMA_PALETTE)[] = ['node0', 'node1', 'node2', 'node3'];

function starPath(
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
  points: number,
  rotation = 0
): string {
  const pts: string[] = [];
  for (let i = 0; i < points * 2; i++) {
    const angle = (i * Math.PI) / points + rotation;
    const r = i % 2 === 0 ? outerR : innerR;
    const x = cx + r * Math.cos(angle - Math.PI / 2);
    const y = cy + r * Math.sin(angle - Math.PI / 2);
    pts.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return pts.join(' ') + 'Z';
}

interface StarSpec {
  outerR: number;
  innerR: number;
  points: number;
  rot: number;
  colorKey: keyof typeof PRISMA_PALETTE;
  opacity: number;
  strokeW: number;
}

const STARS: StarSpec[] = [
  { outerR: 110, innerR: 45, points: 12, rot: 0, colorKey: 'star0', opacity: 0.13, strokeW: 0.8 },
  { outerR: 98, innerR: 40, points: 11, rot: 0.15, colorKey: 'star1', opacity: 0.15, strokeW: 0.8 },
  { outerR: 85, innerR: 34, points: 10, rot: 0.3, colorKey: 'star2', opacity: 0.18, strokeW: 0.9 },
  { outerR: 72, innerR: 29, points: 9, rot: 0.1, colorKey: 'star3', opacity: 0.2, strokeW: 0.9 },
  { outerR: 60, innerR: 23, points: 8, rot: 0.4, colorKey: 'star4', opacity: 0.24, strokeW: 1.0 },
  { outerR: 49, innerR: 18, points: 7, rot: 0.2, colorKey: 'star5', opacity: 0.28, strokeW: 1.0 },
  { outerR: 38, innerR: 14, points: 6, rot: 0.5, colorKey: 'star6', opacity: 0.35, strokeW: 1.1 },
  { outerR: 28, innerR: 10, points: 5, rot: 0.3, colorKey: 'star7', opacity: 0.45, strokeW: 1.2 },
  { outerR: 18, innerR: 7, points: 4, rot: 0.6, colorKey: 'star8', opacity: 0.65, strokeW: 1.3 },
  { outerR: 10, innerR: 4, points: 3, rot: 0.1, colorKey: 'star9', opacity: 0.85, strokeW: 1.5 },
];

const RING_RADII = [110, 85, 60];
const RING_COLOR_KEYS: (keyof typeof PRISMA_PALETTE)[] = ['ring0', 'ring1', 'ring2'];

export function Prisma({
  className = '',
  hideLabel,
  axisColorParams,
}: QuienCharacterProps) {
  const svgId = useUniqueSvgIds('prisma');
  const glow = svgId('glow');
  const glowSoft = svgId('glow-soft');

  const c = useCreatureAxisPalette(CREATURE_ID, PRISMA_PALETTE, axisColorParams);
  const meta = getCreatureMetadata(CREATURE_ID);

  return (
    <CharacterFrame
      title={meta?.name ?? 'Prisma'}
      subtitle={meta?.subtitle ?? 'Influencia'}
      variant={meta?.labelVariant ?? 'fuchsia'}
      className={className}
      hideLabel={hideLabel}
    >
      <defs>
        <filter id={glow} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id={glowSoft} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {RING_RADII.map((r, i) => (
        <circle
          key={i}
          cx={CX}
          cy={CY}
          r={r}
          fill="none"
          stroke={c[RING_COLOR_KEYS[i]]}
          strokeWidth="0.4"
          opacity="0.08"
        />
      ))}

      {STARS.map((s, i) => {
        const color = c[s.colorKey];
        return (
          <g key={i}>
            <path
              d={starPath(CX, CY, s.outerR, s.innerR, s.points, s.rot)}
              fill={color}
              fillOpacity={s.opacity * 0.3}
              stroke={color}
              strokeWidth={s.strokeW}
              strokeOpacity={s.opacity}
              filter={i > 6 ? `url(#${glow})` : undefined}
            />
            <path
              d={starPath(CX, CY, s.outerR * 0.98, s.innerR * 1.02, s.points, s.rot)}
              fill="none"
              stroke={color}
              strokeWidth={s.strokeW * 0.5}
              strokeOpacity={s.opacity * 0.4}
            />
          </g>
        );
      })}

      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i * Math.PI) / 6 - Math.PI / 2;
        const x = CX + 110 * Math.cos(angle);
        const y = CY + 110 * Math.sin(angle);
        const colorKey = NODE_COLOR_KEYS[i % 4];
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={2}
            fill={c[colorKey]}
            opacity="0.7"
            filter={`url(#${glow})`}
          />
        );
      })}

      <circle
        cx={CX}
        cy={CY}
        r={6}
        fill="white"
        opacity="0.6"
        filter={`url(#${glowSoft})`}
      />
      <circle cx={CX} cy={CY} r={3} fill="white" opacity="0.9" filter={`url(#${glow})`} />
      <circle cx={CX} cy={CY} r={1.5} fill="white" opacity="1" />
    </CharacterFrame>
  );
}
