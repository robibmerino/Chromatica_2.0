import { useUniqueSvgIds } from '../useUniqueSvgIds';
import { CharacterFrame } from '../CharacterFrame';
import type { QuienCharacterProps } from '../types';
import { useCreatureAxisPalette, getCreatureMetadata } from '../../archetypeCardComponents/creatures';

/** Paleta base de Complejidad (Complejidad: caótica; Sencillez: más suave al rotar). */
const COMPLEJIDAD_PALETTE = {
  seg0: '#ff0080',
  seg1: '#ff4040',
  seg2: '#ff8000',
  seg3: '#ffcc00',
  seg4: '#80ff00',
  seg5: '#00ffcc',
  seg6: '#0080ff',
  seg7: '#8000ff',
  halo: '#4400aa',
} as const;

const CREATURE_ID = 29 as const;

const CX = 100;
const CY = 160;
const MARGIN = 18;
const W = 200 - MARGIN * 2;
const H = 320 - MARGIN * 2;

function computeLorenzAttractor(): {
  segments: { d: string; colorKey: keyof typeof COMPLEJIDAD_PALETTE }[];
  glowPoints: { sx: number; sy: number; colorIdx: number }[];
} {
  const σ = 10;
  const ρ = 28;
  const β = 8 / 3;
  const dt = 0.008;

  let x = 0.1;
  let y = 0;
  let z = 20;
  const points: { x: number; y: number; z: number }[] = [];

  for (let i = 0; i < 200; i++) {
    const dx = σ * (y - x);
    const dy = x * (ρ - z) - y;
    const dz = x * y - β * z;
    x += dx * dt;
    y += dy * dt;
    z += dz * dt;
  }

  for (let i = 0; i < 1200; i++) {
    const dx = σ * (y - x);
    const dy = x * (ρ - z) - y;
    const dz = x * y - β * z;
    x += dx * dt;
    y += dy * dt;
    z += dz * dt;
    points.push({ x, y, z });
  }

  const minX = Math.min(...points.map((p) => p.x));
  const maxX = Math.max(...points.map((p) => p.x));
  const minY = Math.min(...points.map((p) => p.y));
  const maxY = Math.max(...points.map((p) => p.y));
  const minZ = Math.min(...points.map((p) => p.z));
  const maxZ = Math.max(...points.map((p) => p.z));

  const toSvg = (p: { x: number; y: number; z: number }) => ({
    sx: MARGIN + ((p.x - minX) / (maxX - minX)) * W,
    sy: MARGIN + ((p.y - minY) / (maxY - minY)) * H,
    t: (p.z - minZ) / (maxZ - minZ),
  });

  const segSize = Math.floor(points.length / 8);
  const colorKeys: (keyof typeof COMPLEJIDAD_PALETTE)[] = ['seg0', 'seg1', 'seg2', 'seg3', 'seg4', 'seg5', 'seg6', 'seg7'];

  const segments = colorKeys.map((colorKey, ci) => {
    const start = ci * segSize;
    const end = Math.min(start + segSize + 1, points.length);
    const seg = points.slice(start, end).map(toSvg);
    const d = seg.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.sx.toFixed(1)},${p.sy.toFixed(1)}`).join(' ');
    return { d, colorKey };
  });

  const glowIndices = [0, 150, 300, 450, 600, 750, 900, 1050, 1150];
  const glowPoints = glowIndices.map((i, idx) => {
    const p = points[Math.min(i, points.length - 1)];
    const svg = toSvg(p);
    return { sx: svg.sx, sy: svg.sy, colorIdx: idx % 8 };
  });

  return { segments, glowPoints };
}

const { segments: LORENZ_SEGMENTS, glowPoints: LORENZ_GLOW_POINTS } = computeLorenzAttractor();

export function Complejidad({
  className = '',
  hideLabel,
  axisColorParams,
}: QuienCharacterProps) {
  const svgId = useUniqueSvgIds('complejidad');
  const glow = svgId('glow');
  const soft = svgId('soft');

  const c = useCreatureAxisPalette(CREATURE_ID, COMPLEJIDAD_PALETTE, axisColorParams);
  const meta = getCreatureMetadata(CREATURE_ID);

  const colorKeys: (keyof typeof COMPLEJIDAD_PALETTE)[] = ['seg0', 'seg1', 'seg2', 'seg3', 'seg4', 'seg5', 'seg6', 'seg7'];

  return (
    <CharacterFrame
      title={meta?.name ?? 'Complejidad'}
      subtitle={meta?.subtitle ?? 'Complejidad'}
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
        <filter id={soft} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>

      <ellipse
        cx={CX}
        cy={CY}
        rx="85"
        ry="130"
        fill={c.halo}
        fillOpacity="0.06"
        filter={`url(#${soft})`}
      />

      {LORENZ_SEGMENTS.map((seg, i) => {
        const color = c[seg.colorKey];
        return (
          <g key={i}>
            <path
              d={seg.d}
              fill="none"
              stroke={color}
              strokeWidth="2.5"
              strokeOpacity="0.08"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={seg.d}
              fill="none"
              stroke={color}
              strokeWidth="1.2"
              strokeOpacity="0.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={seg.d}
              fill="none"
              stroke={color}
              strokeWidth="0.5"
              strokeOpacity="0.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        );
      })}

      {LORENZ_GLOW_POINTS.map((p, i) => {
        const color = c[colorKeys[p.colorIdx]];
        return (
          <g key={i}>
            <circle
              cx={p.sx}
              cy={p.sy}
              r={4}
              fill={color}
              opacity="0.15"
              filter={`url(#${glow})`}
            />
            <circle cx={p.sx} cy={p.sy} r={2} fill={color} opacity="0.5" />
            <circle cx={p.sx} cy={p.sy} r={1} fill="white" opacity="0.8" />
          </g>
        );
      })}
    </CharacterFrame>
  );
}
