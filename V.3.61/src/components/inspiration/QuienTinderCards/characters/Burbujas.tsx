import { useUniqueSvgIds } from '../useUniqueSvgIds';
import { getCharacterTransform } from '../characterTransform';
import { CharacterFrame } from '../CharacterFrame';
import type { QuienCharacterProps } from '../types';
import { useCreatureAxisPalette, getCreatureMetadata } from '../../archetypeCardComponents/creatures';

/** Paleta base de Burbujas (Libertad: azul suave; Resistencia: más intenso al rotar). */
const BURBUJAS_PALETTE = {
  b0a: '#e0f2fe',
  b0b: '#0ea5e9',
  b0c: '#0c4a6e',
  b1a: '#fce7f3',
  b1b: '#ec4899',
  b1c: '#831843',
  b2a: '#f0fdf4',
  b2b: '#22c55e',
  b2c: '#14532d',
  b3a: '#fef9c3',
  b3b: '#eab308',
  b3c: '#713f12',
  b4a: '#f5f3ff',
  b4b: '#8b5cf6',
  b4c: '#4c1d95',
  b5a: '#fff7ed',
  b5b: '#f97316',
  b5c: '#7c2d12',
  b6a: '#ecfeff',
  b6b: '#06b6d4',
  b6c: '#164e63',
  b7a: '#fdf4ff',
  b7b: '#d946ef',
  b7c: '#701a75',
  b8a: '#fff1f2',
  b8b: '#f43f5e',
  b8c: '#881337',
  b9a: '#f0fdfa',
  b9b: '#14b8a6',
  b9c: '#134e4a',
  b10a: '#fffbeb',
  b10b: '#f59e0b',
  b10c: '#78350f',
  b11a: '#eff6ff',
  b11b: '#3b82f6',
  b11c: '#1e3a8a',
  irid0: '#f472b6',
  irid1: '#38bdf8',
  irid2: '#f9a8d4',
} as const;

const CREATURE_ID = 24 as const;

type Pal = typeof BURBUJAS_PALETTE;

interface BubbleSpec {
  cx: number;
  cy: number;
  r: number;
  c1Key: keyof Pal;
  c2Key: keyof Pal;
  c3Key: keyof Pal;
}

const BUBBLES: BubbleSpec[] = [
  { cx: 100, cy: 160, r: 48, c1Key: 'b0a', c2Key: 'b0b', c3Key: 'b0c' },
  { cx: 68, cy: 130, r: 32, c1Key: 'b1a', c2Key: 'b1b', c3Key: 'b1c' },
  { cx: 136, cy: 140, r: 28, c1Key: 'b2a', c2Key: 'b2b', c3Key: 'b2c' },
  { cx: 78, cy: 200, r: 26, c1Key: 'b3a', c2Key: 'b3b', c3Key: 'b3c' },
  { cx: 130, cy: 195, r: 30, c1Key: 'b4a', c2Key: 'b4b', c3Key: 'b4c' },
  { cx: 55, cy: 165, r: 18, c1Key: 'b5a', c2Key: 'b5b', c3Key: 'b5c' },
  { cx: 148, cy: 170, r: 20, c1Key: 'b6a', c2Key: 'b6b', c3Key: 'b6c' },
  { cx: 95, cy: 108, r: 16, c1Key: 'b7a', c2Key: 'b7b', c3Key: 'b7c' },
  { cx: 115, cy: 218, r: 15, c1Key: 'b8a', c2Key: 'b8b', c3Key: 'b8c' },
  { cx: 72, cy: 235, r: 12, c1Key: 'b9a', c2Key: 'b9b', c3Key: 'b9c' },
  { cx: 145, cy: 225, r: 14, c1Key: 'b10a', c2Key: 'b10b', c3Key: 'b10c' },
  { cx: 40, cy: 145, r: 14, c1Key: 'b11a', c2Key: 'b11b', c3Key: 'b11c' },
];

interface MembraneSpec {
  d: string;
  colorKey: keyof Pal;
  strokeWidth: number;
  opacity: number;
}

const MEMBRANES: MembraneSpec[] = [
  { d: 'M100 160 Q84 145 68 130', colorKey: 'b0a', strokeWidth: 6, opacity: 0.15 },
  { d: 'M100 160 Q118 150 136 140', colorKey: 'b2a', strokeWidth: 5, opacity: 0.12 },
  { d: 'M100 160 Q89 180 78 200', colorKey: 'b3a', strokeWidth: 5, opacity: 0.12 },
  { d: 'M100 160 Q115 177 130 195', colorKey: 'b4a', strokeWidth: 6, opacity: 0.14 },
  { d: 'M68 130 Q61 147 55 165', colorKey: 'b5a', strokeWidth: 4, opacity: 0.1 },
  { d: 'M136 140 Q142 155 148 170', colorKey: 'b6a', strokeWidth: 4, opacity: 0.1 },
  { d: 'M78 200 Q75 217 72 235', colorKey: 'b9a', strokeWidth: 3, opacity: 0.1 },
  { d: 'M130 195 Q137 210 145 225', colorKey: 'b10a', strokeWidth: 3, opacity: 0.1 },
];

export function Burbujas({
  className = '',
  hideLabel,
  axisColorParams,
}: QuienCharacterProps) {
  const svgId = useUniqueSvgIds('burbujas');
  const shine = svgId('shine');
  const gradIds = BUBBLES.map((_, i) => svgId(`b${i}`));

  const c = useCreatureAxisPalette(CREATURE_ID, BURBUJAS_PALETTE, axisColorParams);
  const meta = getCreatureMetadata(CREATURE_ID);

  return (
    <CharacterFrame
      title={meta?.name ?? 'Burbujas'}
      subtitle={meta?.subtitle ?? 'Libertad'}
      variant={meta?.labelVariant ?? 'sky'}
      className={className}
      hideLabel={hideLabel}
    >
      <defs>
        {BUBBLES.map((b, i) => (
          <radialGradient
            key={i}
            id={gradIds[i]}
            cx="35%"
            cy="30%"
            r="65%"
          >
            <stop offset="0%" stopColor={c[b.c1Key]} stopOpacity="0.95" />
            <stop offset="55%" stopColor={c[b.c2Key]} stopOpacity="0.5" />
            <stop offset="100%" stopColor={c[b.c3Key]} stopOpacity="0.15" />
          </radialGradient>
        ))}
        <radialGradient id={shine} cx="30%" cy="25%" r="40%">
          <stop offset="0%" stopColor="white" stopOpacity="0.9" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g transform={getCharacterTransform({ scale: 1.08, translateY: -18, centerX: 100, centerY: 160 }) ?? undefined}>
      {/* Membranas de conexión */}
      {MEMBRANES.map((m, i) => (
        <path
          key={i}
          d={m.d}
          fill="none"
          stroke={c[m.colorKey]}
          strokeWidth={m.strokeWidth}
          opacity={m.opacity}
        />
      ))}

      {/* Burbujas */}
      {BUBBLES.map((b, i) => (
        <g key={i}>
          <circle
            cx={b.cx}
            cy={b.cy}
            r={b.r}
            fill={`url(#${gradIds[i]})`}
            stroke={c[b.c2Key]}
            strokeWidth="0.5"
            opacity="0.85"
          />
          <ellipse
            cx={b.cx - b.r * 0.3}
            cy={b.cy - b.r * 0.3}
            rx={b.r * 0.35}
            ry={b.r * 0.25}
            fill={`url(#${shine})`}
            opacity="0.6"
          />
          <circle
            cx={b.cx - b.r * 0.4}
            cy={b.cy - b.r * 0.35}
            r={b.r * 0.08}
            fill="white"
            opacity="0.8"
          />
        </g>
      ))}

      {/* Iridiscencia */}
      <path
        d={`M ${100 - 40} ${160 - 10} Q 100 ${160 - 52} ${100 + 40} ${160 - 10}`}
        fill="none"
        stroke={c.irid0}
        strokeWidth="1.5"
        opacity="0.3"
      />
      <path
        d={`M ${100 - 38} ${160 - 8} Q 100 ${160 - 48} ${100 + 38} ${160 - 8}`}
        fill="none"
        stroke={c.irid1}
        strokeWidth="1"
        opacity="0.25"
      />
      <path
        d={`M ${68 - 26} ${130 - 8} Q 68 ${130 - 34} ${68 + 26} ${130 - 8}`}
        fill="none"
        stroke={c.irid2}
        strokeWidth="1"
        opacity="0.3"
      />
      </g>
    </CharacterFrame>
  );
}
