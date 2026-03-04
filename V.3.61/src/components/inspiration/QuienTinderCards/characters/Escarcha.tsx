import type { ReactNode } from 'react';
import { useUniqueSvgIds } from '../useUniqueSvgIds';
import { getCharacterTransform } from '../characterTransform';
import { CharacterFrame } from '../CharacterFrame';
import type { QuienCharacterProps } from '../types';
import { useCreatureAxisPalette, getCreatureMetadata } from '../../archetypeCardComponents/creatures';

/** Paleta base de Escarcha (Núcleo: azul claro; Horizonte: profundo al rotar). */
const ESCARCHA_PALETTE = {
  flake0: '#e0f2fe',
  flake1: '#7dd3fc',
  flake2: '#38bdf8',
  flake3: '#bae6fd',
  flake4: '#a5f3fc',
  flake5: '#67e8f9',
  flake6: '#cffafe',
  bgInner: '#082f49',
  bgOuter: '#020c14',
  coreMid: '#bae6fd',
  coreOuter: '#0369a1',
  hex0: '#e0f2fe',
  hex1: '#7dd3fc',
  hex2: '#38bdf8',
  particle: '#e0f2fe',
} as const;

const CREATURE_ID = 25 as const;

const CX = 100;
const CY = 155;

const ARMS = 6;
const HEX_RADII = [55, 42, 30];
const HEX_COLOR_KEYS: (keyof typeof ESCARCHA_PALETTE)[] = ['hex0', 'hex1', 'hex2'];

interface FlakeSpec {
  cx: number;
  cy: number;
  size: number;
  rot: number;
  colorKey: keyof typeof ESCARCHA_PALETTE;
  op: number;
}

const FLAKES: FlakeSpec[] = [
  { cx: 100, cy: 155, size: 60, rot: 0, colorKey: 'flake0', op: 0.9 },
  { cx: 100, cy: 155, size: 45, rot: 15, colorKey: 'flake1', op: 0.75 },
  { cx: 100, cy: 155, size: 30, rot: 30, colorKey: 'flake2', op: 0.85 },
  { cx: 68, cy: 115, size: 28, rot: 10, colorKey: 'flake3', op: 0.7 },
  { cx: 135, cy: 125, size: 24, rot: 25, colorKey: 'flake4', op: 0.65 },
  { cx: 60, cy: 195, size: 22, rot: 5, colorKey: 'flake5', op: 0.6 },
  { cx: 145, cy: 190, size: 26, rot: 20, colorKey: 'flake1', op: 0.65 },
  { cx: 100, cy: 220, size: 20, rot: 15, colorKey: 'flake3', op: 0.55 },
  { cx: 78, cy: 245, size: 14, rot: 8, colorKey: 'flake0', op: 0.5 },
  { cx: 128, cy: 242, size: 16, rot: 22, colorKey: 'flake6', op: 0.5 },
];

function renderSnowflake(
  cx: number,
  cy: number,
  size: number,
  rotation: number,
  color: string,
  opacity: number,
  keyPrefix: string
): ReactNode[] {
  const elements: ReactNode[] = [];
  for (let i = 0; i < ARMS; i++) {
    const angle = (i * Math.PI * 2) / ARMS + (rotation * Math.PI) / 180;
    const x2 = cx + Math.cos(angle) * size;
    const y2 = cy + Math.sin(angle) * size;
    const mx = cx + Math.cos(angle) * size * 0.5;
    const my = cy + Math.sin(angle) * size * 0.5;
    const bAngle1 = angle + Math.PI / 4;
    const bAngle2 = angle - Math.PI / 4;
    const bSize = size * 0.35;
    const x75 = cx + Math.cos(angle) * size * 0.75;
    const y75 = cy + Math.sin(angle) * size * 0.75;

    elements.push(
      <line
        key={`${keyPrefix}-arm-${i}`}
        x1={cx}
        y1={cy}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth="0.8"
        opacity={opacity}
        strokeLinecap="round"
      />,
      <line
        key={`${keyPrefix}-b1-${i}`}
        x1={mx}
        y1={my}
        x2={mx + Math.cos(bAngle1) * bSize}
        y2={my + Math.sin(bAngle1) * bSize}
        stroke={color}
        strokeWidth="0.5"
        opacity={opacity * 0.85}
        strokeLinecap="round"
      />,
      <line
        key={`${keyPrefix}-b2-${i}`}
        x1={mx}
        y1={my}
        x2={mx + Math.cos(bAngle2) * bSize}
        y2={my + Math.sin(bAngle2) * bSize}
        stroke={color}
        strokeWidth="0.5"
        opacity={opacity * 0.85}
        strokeLinecap="round"
      />,
      <line
        key={`${keyPrefix}-b3-${i}`}
        x1={x75}
        y1={y75}
        x2={x75 + Math.cos(bAngle1) * bSize * 0.5}
        y2={y75 + Math.sin(bAngle1) * bSize * 0.5}
        stroke={color}
        strokeWidth="0.4"
        opacity={opacity * 0.7}
        strokeLinecap="round"
      />,
      <line
        key={`${keyPrefix}-b4-${i}`}
        x1={x75}
        y1={y75}
        x2={x75 + Math.cos(bAngle2) * bSize * 0.5}
        y2={y75 + Math.sin(bAngle2) * bSize * 0.5}
        stroke={color}
        strokeWidth="0.4"
        opacity={opacity * 0.7}
        strokeLinecap="round"
      />,
      <circle
        key={`${keyPrefix}-tip-${i}`}
        cx={x2}
        cy={y2}
        r={1.2}
        fill={color}
        opacity={opacity * 0.9}
      />
    );
  }
  return elements;
}

export function Escarcha({
  className = '',
  hideLabel,
  axisColorParams,
}: QuienCharacterProps) {
  const svgId = useUniqueSvgIds('escarcha');
  const bg = svgId('bg');
  const core = svgId('core');

  const c = useCreatureAxisPalette(CREATURE_ID, ESCARCHA_PALETTE, axisColorParams);
  const meta = getCreatureMetadata(CREATURE_ID);

  return (
    <CharacterFrame
      title={meta?.name ?? 'Escarcha'}
      subtitle={meta?.subtitle ?? 'Ramificación'}
      variant={meta?.labelVariant ?? 'sky'}
      className={className}
      hideLabel={hideLabel}
    >
      <defs>
        <radialGradient id={bg} cx="50%" cy="48%" r="50%">
          <stop offset="0%" stopColor={c.bgInner} stopOpacity="0.6" />
          <stop offset="100%" stopColor={c.bgOuter} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={core} cx="35%" cy="35%" r="60%">
          <stop offset="0%" stopColor="white" />
          <stop offset="40%" stopColor={c.coreMid} />
          <stop offset="100%" stopColor={c.coreOuter} stopOpacity="0.9" />
        </radialGradient>
      </defs>

      <g transform={getCharacterTransform({ translateY: -20 }) ?? undefined}>
      <ellipse cx={CX} cy={CY} rx="90" ry="145" fill={`url(#${bg})`} />

      {FLAKES.map((f, i) => (
        <g key={i}>
          {renderSnowflake(f.cx, f.cy, f.size, f.rot, c[f.colorKey], f.op, `f${i}`)}
          <circle
            cx={f.cx}
            cy={f.cy}
            r={f.size * 0.08}
            fill={c[f.colorKey]}
            opacity={f.op}
          />
        </g>
      ))}

      {HEX_RADII.map((r, i) => (
        <polygon
          key={i}
          points={Array.from({ length: 6 }, (_, j) => {
            const a = (j * Math.PI) / 3;
            return `${CX + r * Math.cos(a)},${CY + r * Math.sin(a)}`;
          }).join(' ')}
          fill="none"
          stroke={c[HEX_COLOR_KEYS[i]]}
          strokeWidth="0.5"
          opacity={0.3 + i * 0.1}
        />
      ))}

      {Array.from({ length: 16 }, (_, i) => {
        const a = (i * Math.PI) / 8;
        const r = 72 + (i % 3) * 12;
        return (
          <circle
            key={i}
            cx={CX + Math.cos(a) * r}
            cy={CY + Math.sin(a) * r}
            r={1.2}
            fill={c.particle}
            opacity="0.5"
          />
        );
      })}

      <circle cx={CX} cy={CY} r={10} fill={`url(#${core})`} opacity="0.95" />
      <circle cx={CX} cy={CY} r={6} fill="white" opacity="0.95" />
      <circle cx={CX} cy={CY} r={3} fill="white" />
      <circle cx={CX - 2} cy={CY - 2} r={1.5} fill="white" opacity="0.8" />
      </g>
    </CharacterFrame>
  );
}
