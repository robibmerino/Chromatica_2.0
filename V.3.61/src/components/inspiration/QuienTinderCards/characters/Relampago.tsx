import type { ReactNode } from 'react';
import { getCharacterTransform } from '../characterTransform';
import { useMemo } from 'react';
import { useUniqueSvgIds } from '../useUniqueSvgIds';
import { CharacterFrame } from '../CharacterFrame';
import type { QuienCharacterProps } from '../types';
import { useCreatureAxisPalette, getCreatureMetadata } from '../../archetypeCardComponents/creatures';

/** Paleta base de Relámpago (Impacto: ámbar intenso; Armonía: más suave al rotar). */
const RELAMPAGO_PALETTE = {
  br1: '#fde68a',
  br2: '#fcd34d',
  br3: '#f59e0b',
  br4: '#fff7ed',
  br5: '#fef3c7',
  coreLight: '#fde68a',
  coreMid: '#f59e0b',
  coreOuter: '#92400e',
  haloInner: '#fef3c7',
  haloOuter: '#f59e0b',
  particle0: '#fde68a',
  particle1: '#fcd34d',
  particle2: '#fff7ed',
  particle3: '#f59e0b',
  haloStroke: '#fde68a',
} as const;

const CREATURE_ID = 17 as const;

const CX = 100;
const CY = 160;

const HALO_RADII = [22, 38, 56, 75];

interface BranchSpec {
  angle: number;
  length: number;
  depth: number;
  colorKey: keyof typeof RELAMPAGO_PALETTE;
  groupOpacity: number;
  key: string;
}

const BRANCH_SPECS: BranchSpec[] = [
  { angle: -90, length: 48, depth: 5, colorKey: 'br1', groupOpacity: 0.85, key: 'a' },
  { angle: -50, length: 42, depth: 4, colorKey: 'br2', groupOpacity: 0.75, key: 'b' },
  { angle: -130, length: 42, depth: 4, colorKey: 'br1', groupOpacity: 0.75, key: 'c' },
  { angle: 0, length: 38, depth: 4, colorKey: 'br3', groupOpacity: 0.65, key: 'd' },
  { angle: 180, length: 38, depth: 4, colorKey: 'br3', groupOpacity: 0.65, key: 'e' },
  { angle: 90, length: 32, depth: 4, colorKey: 'br2', groupOpacity: 0.55, key: 'f' },
  { angle: -70, length: 60, depth: 4, colorKey: 'br4', groupOpacity: 0.4, key: 'g' },
  { angle: -110, length: 55, depth: 4, colorKey: 'br4', groupOpacity: 0.4, key: 'h' },
  { angle: 30, length: 45, depth: 3, colorKey: 'br5', groupOpacity: 0.3, key: 'i' },
  { angle: 150, length: 45, depth: 3, colorKey: 'br5', groupOpacity: 0.3, key: 'j' },
];

function renderBranches(
  x: number,
  y: number,
  angle: number,
  length: number,
  depth: number,
  color: string,
  key: string
): ReactNode[] {
  if (depth === 0 || length < 3) return [];
  const rad = (angle * Math.PI) / 180;
  const x2 = x + length * Math.cos(rad);
  const y2 = y + length * Math.sin(rad);
  const opacity = 0.3 + depth * 0.12;
  const width = depth * 0.8;
  return [
    <line
      key={key}
      x1={x}
      y1={y}
      x2={x2}
      y2={y2}
      stroke={color}
      strokeWidth={width}
      opacity={opacity}
      strokeLinecap="round"
    />,
    ...renderBranches(x2, y2, angle - 25, length * 0.68, depth - 1, color, `${key}l`),
    ...renderBranches(x2, y2, angle + 20, length * 0.72, depth - 1, color, `${key}r`),
    ...renderBranches(x2, y2, angle - 8, length * 0.78, depth - 1, color, `${key}m`),
  ];
}

const PARTICLE_COLOR_KEYS: (keyof typeof RELAMPAGO_PALETTE)[] = [
  'particle0',
  'particle1',
  'particle2',
  'particle3',
];

export function Relampago({
  className = '',
  hideLabel,
  axisColorParams,
}: QuienCharacterProps) {
  const svgId = useUniqueSvgIds('relampago');
  const core = svgId('core');
  const halo = svgId('halo');

  const c = useCreatureAxisPalette(CREATURE_ID, RELAMPAGO_PALETTE, axisColorParams);
  const meta = getCreatureMetadata(CREATURE_ID);

  const branchGroups = useMemo(() => {
    return BRANCH_SPECS.map((spec) => (
      <g key={spec.key} opacity={spec.groupOpacity}>
        {renderBranches(CX, CY, spec.angle, spec.length, spec.depth, c[spec.colorKey], spec.key)}
      </g>
    ));
  }, [c]);

  return (
    <CharacterFrame
      title={meta?.name ?? 'Relámpago'}
      subtitle={meta?.subtitle ?? 'Impacto'}
      variant={meta?.labelVariant ?? 'amber'}
      className={className}
      hideLabel={hideLabel}
    >
      <defs>
        <radialGradient id={core} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="30%" stopColor={c.coreLight} stopOpacity="0.9" />
          <stop offset="70%" stopColor={c.coreMid} stopOpacity="0.5" />
          <stop offset="100%" stopColor={c.coreOuter} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={halo} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={c.haloInner} stopOpacity="0.3" />
          <stop offset="100%" stopColor={c.haloOuter} stopOpacity="0" />
        </radialGradient>
      </defs>

      <g transform={getCharacterTransform({ translateY: 24 }) ?? undefined}>
      <ellipse cx={CX} cy={CY} rx="95" ry="120" fill={`url(#${halo})`} />

      {branchGroups}

      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i / 24) * Math.PI * 2;
        const r = 30 + (i % 5) * 18;
        const colorKey = PARTICLE_COLOR_KEYS[i % 4];
        return (
          <circle
            key={i}
            cx={CX + r * Math.cos(angle)}
            cy={CY + r * Math.sin(angle)}
            r={0.8 + (i % 3) * 0.6}
            fill={c[colorKey]}
            opacity={0.4 + (i % 3) * 0.2}
          />
        );
      })}

      {HALO_RADII.map((r, i) => (
        <circle
          key={i}
          cx={CX}
          cy={CY}
          r={r}
          fill="none"
          stroke={c.haloStroke}
          strokeWidth={0.6}
          opacity={0.15 - i * 0.03}
        />
      ))}

      <circle cx={CX} cy={CY} r={20} fill={`url(#${core})`} />
      <circle cx={CX} cy={CY} r={10} fill="white" opacity="0.7" />
      <circle cx={CX} cy={CY} r={5} fill="white" opacity="0.95" />
      <circle cx={CX - 2} cy={CY - 2} r={2} fill="white" opacity="1" />
      </g>
    </CharacterFrame>
  );
}
