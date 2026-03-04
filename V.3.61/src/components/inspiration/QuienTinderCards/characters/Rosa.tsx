import { useMemo } from 'react';
import { useUniqueSvgIds } from '../useUniqueSvgIds';
import { CharacterFrame } from '../CharacterFrame';
import { getCharacterTransform } from '../characterTransform';
import type { QuienCharacterProps } from '../types';
import { useCreatureAxisPalette, getCreatureMetadata } from '../../archetypeCardComponents/creatures';

/** Paleta base de Rosa (Minimalista: fucsia suave; Sofisticada: púrpura profundo al rotar). */
const ROSA_PALETTE = {
  rose0: '#f0abfc',
  rose1: '#c084fc',
  rose2: '#a855f7',
  rose3: '#e879f9',
  rose4: '#d946ef',
  bgInner: '#581c87',
  bgOuter: '#2e1065',
  coreMid: '#e879f9',
  coreOuter: '#7e22ce',
  ring: '#c084fc',
  particle0: '#f0abfc',
  particle1: '#c084fc',
  particle2: '#e879f9',
  particle3: '#a855f7',
} as const;

const CREATURE_ID = 19 as const;

const CX = 100;
const CY = 160;

const RING_RADII = [20, 35, 50, 65, 80];

interface RoseSpec {
  n: number;
  k: number;
  r: number;
  colorKey: keyof typeof ROSA_PALETTE;
  w: number;
  opacity: number;
  offset: number;
}

const ROSES: RoseSpec[] = [
  { n: 3, k: 1, r: 72, colorKey: 'rose0', w: 2.5, opacity: 0.8, offset: 0 },
  { n: 5, k: 2, r: 60, colorKey: 'rose1', w: 2, opacity: 0.7, offset: 0.3 },
  { n: 4, k: 1, r: 52, colorKey: 'rose2', w: 2, opacity: 0.75, offset: 0.6 },
  { n: 7, k: 3, r: 45, colorKey: 'rose3', w: 1.5, opacity: 0.65, offset: 0.9 },
  { n: 2, k: 1, r: 38, colorKey: 'rose4', w: 1.5, opacity: 0.7, offset: 1.2 },
  { n: 5, k: 1, r: 30, colorKey: 'rose0', w: 1.2, opacity: 0.6, offset: 1.5 },
  { n: 3, k: 2, r: 22, colorKey: 'rose1', w: 1, opacity: 0.55, offset: 0.4 },
  { n: 6, k: 1, r: 15, colorKey: 'rose3', w: 0.8, opacity: 0.65, offset: 0.7 },
];

const PARTICLE_COLOR_KEYS: (keyof typeof ROSA_PALETTE)[] = [
  'particle0',
  'particle1',
  'particle2',
  'particle3',
];

function rosaPoints(
  n: number,
  k: number,
  r: number,
  cx: number,
  cy: number,
  offset = 0
): string {
  const points: string[] = [];
  const tMax = Math.PI * 2 * (k % 2 === 0 ? 2 : 1);
  for (let t = 0; t <= tMax; t += 0.04) {
    const radius = r * Math.cos((n / k) * t + offset);
    const x = cx + radius * Math.cos(t);
    const y = cy + radius * Math.sin(t);
    points.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return points.join(' ');
}

export function Rosa({
  className = '',
  hideLabel,
  axisColorParams,
}: QuienCharacterProps) {
  const svgId = useUniqueSvgIds('rosa');
  const bg = svgId('bg');
  const core = svgId('core');

  const c = useCreatureAxisPalette(CREATURE_ID, ROSA_PALETTE, axisColorParams);
  const meta = getCreatureMetadata(CREATURE_ID);

  const rosePolylines = useMemo(() => {
    return ROSES.map((rose, i) => ({
      main: rosaPoints(rose.n, rose.k, rose.r, CX, CY, rose.offset),
      rotated: rosaPoints(rose.n, rose.k, rose.r * 0.85, CX, CY, rose.offset + 0.5),
      color: c[rose.colorKey],
      w: rose.w,
      opacity: rose.opacity,
      i,
    }));
  }, [c]);

  return (
    <CharacterFrame
      title={meta?.name ?? 'Rosa'}
      subtitle={meta?.subtitle ?? 'Minimalista'}
      variant={meta?.labelVariant ?? 'fuchsia'}
      className={className}
      hideLabel={hideLabel}
    >
      <defs>
        <radialGradient id={bg} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={c.bgInner} stopOpacity="0.25" />
          <stop offset="100%" stopColor={c.bgOuter} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={core} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="40%" stopColor={c.coreMid} stopOpacity="0.8" />
          <stop offset="100%" stopColor={c.coreOuter} stopOpacity="0" />
        </radialGradient>
      </defs>

      <g transform={getCharacterTransform({ scale: 1.2, centerX: CX, centerY: CY }) ?? undefined}>
      <ellipse cx={CX} cy={CY} rx="95" ry="115" fill={`url(#${bg})`} />

      {/* Rosas paramétricas en capas */}
      {rosePolylines.map((rp) => (
        <g key={rp.i}>
          <polyline
            points={rp.main}
            fill="none"
            stroke={rp.color}
            strokeWidth={rp.w}
            opacity={rp.opacity}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <g transform={`rotate(${rp.i * 15}, ${CX}, ${CY})`}>
            <polyline
              points={rp.rotated}
              fill="none"
              stroke={rp.color}
              strokeWidth={rp.w * 0.6}
              opacity={rp.opacity * 0.4}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </g>
      ))}

      {/* Anillos de referencia */}
      {RING_RADII.map((r, i) => (
        <circle
          key={i}
          cx={CX}
          cy={CY}
          r={r}
          fill="none"
          stroke={c.ring}
          strokeWidth={0.4}
          opacity={0.15 - i * 0.02}
          strokeDasharray={`${2 + i} ${3 + i}`}
        />
      ))}

      {/* Partículas en los pétalos */}
      {Array.from({ length: 30 }).map((_, i) => {
        const angle = (i / 30) * Math.PI * 2;
        const r = 15 + (i % 6) * 12;
        const petal = Math.cos((3 / 1) * angle) * r;
        const colorKey = PARTICLE_COLOR_KEYS[i % 4];
        return (
          <circle
            key={i}
            cx={CX + petal * Math.cos(angle)}
            cy={CY + petal * Math.sin(angle)}
            r={0.8 + (i % 3) * 0.5}
            fill={c[colorKey]}
            opacity={0.5 + (i % 4) * 0.1}
          />
        );
      })}

      {/* Núcleo */}
      <circle cx={CX} cy={CY} r={16} fill={`url(#${core})`} />
      <circle cx={CX} cy={CY} r={8} fill="white" opacity="0.75" />
      <circle cx={CX} cy={CY} r={4} fill="white" opacity="0.95" />
      <circle cx={CX - 2} cy={CY - 2} r={1.5} fill="white" opacity="1" />
      </g>
    </CharacterFrame>
  );
}
