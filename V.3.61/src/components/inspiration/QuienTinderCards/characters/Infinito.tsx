import { useUniqueSvgIds } from '../useUniqueSvgIds';
import { CharacterFrame } from '../CharacterFrame';
import { getCharacterTransform } from '../characterTransform';
import type { QuienCharacterProps } from '../types';
import { useCreatureAxisPalette, getCreatureMetadata } from '../../archetypeCardComponents/creatures';

/** Paleta base de Infinito (Cambio: violeta fluido; Eterno: profundo al rotar). */
const INFINITO_PALETTE = {
  lem0a: '#a78bfa',
  lem0b: '#7c3aed',
  lem1a: '#c4b5fd',
  lem1b: '#8b5cf6',
  lem2a: '#ddd6fe',
  lem2b: '#a78bfa',
  lem3a: '#818cf8',
  lem3b: '#6366f1',
  lem4a: '#e0e7ff',
  lem4b: '#c7d2fe',
  lem5a: '#f5f3ff',
  lem5b: '#ede9fe',
  bgInner: '#4c1d95',
  bgOuter: '#1e1b4b',
  coreMid: '#c4b5fd',
  coreOuter: '#7c3aed',
  particle0: '#c4b5fd',
  particle1: '#818cf8',
  particle2: '#a5b4fc',
  halo: '#a78bfa',
} as const;

const CREATURE_ID = 16 as const;

const CX = 100;
const CY = 160;

const LEMNISCATES: {
  scale: number;
  rotation: number;
  color1Key: keyof typeof INFINITO_PALETTE;
  color2Key: keyof typeof INFINITO_PALETTE;
  opacity: number;
}[] = [
  { scale: 1.0, rotation: 0, color1Key: 'lem0a', color2Key: 'lem0b', opacity: 0.9 },
  { scale: 0.75, rotation: 45, color1Key: 'lem1a', color2Key: 'lem1b', opacity: 0.75 },
  { scale: 0.55, rotation: 90, color1Key: 'lem2a', color2Key: 'lem2b', opacity: 0.65 },
  { scale: 0.38, rotation: 22, color1Key: 'lem3a', color2Key: 'lem3b', opacity: 0.7 },
  { scale: 0.28, rotation: 67, color1Key: 'lem4a', color2Key: 'lem4b', opacity: 0.6 },
  { scale: 0.18, rotation: 135, color1Key: 'lem5a', color2Key: 'lem5b', opacity: 0.5 },
];

const NODE_ANGLES = [0, 45, 90, 22, 67, 135];

const HALO_RADII = [28, 42, 58];

function generateLemniscate(scale: number, cx: number, cy: number): string {
  const a = 55 * scale;
  const points: string[] = [];
  for (let t = 0; t <= Math.PI * 2; t += 0.05) {
    const denom = 1 + Math.sin(t) * Math.sin(t);
    const x = cx + (a * Math.cos(t)) / denom;
    const y = cy + (a * Math.sin(t) * Math.cos(t)) / denom;
    points.push(`${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return `M ${points.join(' L ')} Z`;
}

export function Infinito({
  className = '',
  hideLabel,
  axisColorParams,
}: QuienCharacterProps) {
  const svgId = useUniqueSvgIds('infinito');
  const bg = svgId('bg');
  const core = svgId('core');
  const gradIds = LEMNISCATES.map((_, i) => svgId(`grad-${i}`));

  const c = useCreatureAxisPalette(CREATURE_ID, INFINITO_PALETTE, axisColorParams);
  const meta = getCreatureMetadata(CREATURE_ID);

  return (
    <CharacterFrame
      title={meta?.name ?? 'Infinito'}
      subtitle={meta?.subtitle ?? 'Cambio'}
      variant={meta?.labelVariant ?? 'violet'}
      className={className}
      hideLabel={hideLabel}
    >
      <defs>
        <radialGradient id={bg} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={c.bgInner} stopOpacity="0.3" />
          <stop offset="100%" stopColor={c.bgOuter} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={core} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="40%" stopColor={c.coreMid} stopOpacity="0.9" />
          <stop offset="100%" stopColor={c.coreOuter} stopOpacity="0" />
        </radialGradient>
        {LEMNISCATES.map((l, i) => (
          <linearGradient
            key={i}
            id={gradIds[i]}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor={c[l.color1Key]} stopOpacity={l.opacity} />
            <stop
              offset="50%"
              stopColor={c[l.color2Key]}
              stopOpacity={l.opacity * 0.7}
            />
            <stop
              offset="100%"
              stopColor={c[l.color1Key]}
              stopOpacity={l.opacity * 0.4}
            />
          </linearGradient>
        ))}
      </defs>

      <g transform={getCharacterTransform({ scale: 1.3, centerX: CX, centerY: CY }) ?? undefined}>
      <ellipse cx={CX} cy={CY} rx="90" ry="110" fill={`url(#${bg})`} />

      {LEMNISCATES.map((l, i) => (
        <g key={i} transform={`rotate(${l.rotation}, ${CX}, ${CY})`}>
          <path
            d={generateLemniscate(l.scale, CX, CY)}
            fill="none"
            stroke={`url(#${gradIds[i]})`}
            strokeWidth={3.5 - i * 0.4}
            opacity={l.opacity}
          />
          <path
            d={generateLemniscate(l.scale * 0.92, CX, CY)}
            fill="none"
            stroke={c[l.color1Key]}
            strokeWidth={1}
            opacity={l.opacity * 0.4}
          />
        </g>
      ))}

      {/* Nodos en los cruces */}
      {NODE_ANGLES.map((angle, i) => {
        const r = (i + 1) * 8;
        const rad = (angle * Math.PI) / 180;
        const nodeR = 2.5 - i * 0.2;
        const nodeOpacity = 0.9 - i * 0.1;
        return (
          <g key={i}>
            <circle
              cx={CX + r * Math.cos(rad)}
              cy={CY + r * Math.sin(rad)}
              r={nodeR}
              fill="white"
              opacity={nodeOpacity}
            />
            <circle
              cx={CX - r * Math.cos(rad)}
              cy={CY - r * Math.sin(rad)}
              r={nodeR}
              fill="white"
              opacity={nodeOpacity}
            />
          </g>
        );
      })}

      {/* Partículas orbitales */}
      {Array.from({ length: 18 }).map((_, i) => {
        const angle = (i / 18) * Math.PI * 2;
        const r = 48 + (i % 3) * 18;
        const colorKey: keyof typeof INFINITO_PALETTE =
          i % 3 === 0 ? 'particle0' : i % 3 === 1 ? 'particle1' : 'particle2';
        return (
          <circle
            key={i}
            cx={CX + r * Math.cos(angle)}
            cy={CY + r * Math.sin(angle)}
            r={1 + (i % 3) * 0.5}
            fill={c[colorKey]}
            opacity={0.3 + (i % 4) * 0.15}
          />
        );
      })}

      {/* Núcleo central */}
      <circle cx={CX} cy={CY} r={18} fill={`url(#${core})`} />
      <circle cx={CX} cy={CY} r={10} fill="white" opacity="0.6" />
      <circle cx={CX} cy={CY} r={5} fill="white" opacity="0.9" />
      <circle cx={CX - 2} cy={CY - 2} r={2} fill="white" opacity="1" />

      {/* Halos */}
      {HALO_RADII.map((r, i) => (
        <circle
          key={i}
          cx={CX}
          cy={CY}
          r={r}
          fill="none"
          stroke={c.halo}
          strokeWidth={0.5}
          opacity={0.2 - i * 0.05}
        />
      ))}
      </g>
    </CharacterFrame>
  );
}
