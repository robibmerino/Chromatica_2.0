import { useUniqueSvgIds } from '../useUniqueSvgIds';
import { CharacterFrame } from '../CharacterFrame';
import type { QuienCharacterProps } from '../types';
import { useCreatureAxisPalette, getCreatureMetadata } from '../../archetypeCardComponents/creatures';

/** Paleta base de Aurea (Armonía: dorado; Libertad: más vibrante al rotar). */
const AUREA_PALETTE = {
  layer0a: '#ff6b9d',
  layer0b: '#ff8c42',
  layer0c: '#ffd93d',
  layer1a: '#6bceff',
  layer1b: '#a78bfa',
  layer1c: '#34d399',
  layer2a: '#f472b6',
  layer2b: '#60a5fa',
  layer2c: '#fbbf24',
  layer3a: '#818cf8',
  layer3b: '#34d399',
  layer3c: '#fb7185',
  bgInner: '#1a0a2e',
  bgOuter: '#0a0014',
  coreMid: '#ffd93d',
  coreOuter: '#ff6b9d',
} as const;

const CREATURE_ID = 21 as const;

const CX = 100;
const CY = 160;

const PHI = (1 + Math.sqrt(5)) / 2;
const GOLDEN_ANGLE = 2 * Math.PI * (2 - PHI);

const LAYER_GRADIENT_KEYS = [
  ['layer0a', 'layer0b', 'layer0c'],
  ['layer1a', 'layer1b', 'layer1c'],
  ['layer2a', 'layer2b', 'layer2c'],
  ['layer3a', 'layer3b', 'layer3c'],
] as const;

const GLOW_COLOR_KEYS: (keyof typeof AUREA_PALETTE)[] = ['layer0a', 'layer0b', 'layer0c'];

const RAY_ANGLES = [0, 60, 120, 180, 240, 300];

function computeSeeds(): { x: number; y: number; size: number; layer: number; i: number; r: number }[] {
  return Array.from({ length: 200 }, (_, i) => {
    const r = Math.sqrt(i) * 8.5;
    const theta = i * GOLDEN_ANGLE;
    const x = CX + r * Math.cos(theta);
    const y = CY + r * Math.sin(theta);
    const size = Math.max(1.2, 3.5 - r * 0.022);
    const layer = r < 40 ? 0 : r < 70 ? 1 : r < 95 ? 2 : 3;
    return { x, y, size, layer, i, r };
  }).filter((s) => s.x > 10 && s.x < 190 && s.y > 10 && s.y < 310);
}

const SEEDS = computeSeeds();

export function Aurea({
  className = '',
  hideLabel,
  axisColorParams,
}: QuienCharacterProps) {
  const svgId = useUniqueSvgIds('aurea');
  const bg = svgId('bg');
  const core = svgId('core');
  const layerIds = [svgId('l0'), svgId('l1'), svgId('l2'), svgId('l3')];

  const c = useCreatureAxisPalette(CREATURE_ID, AUREA_PALETTE, axisColorParams);
  const meta = getCreatureMetadata(CREATURE_ID);

  return (
    <CharacterFrame
      title={meta?.name ?? 'Aurea'}
      subtitle={meta?.subtitle ?? 'Armonía'}
      variant={meta?.labelVariant ?? 'amber'}
      className={className}
      hideLabel={hideLabel}
    >
      <defs>
        <radialGradient id={bg} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={c.bgInner} stopOpacity="0.6" />
          <stop offset="100%" stopColor={c.bgOuter} stopOpacity="0" />
        </radialGradient>
        {LAYER_GRADIENT_KEYS.map((keys, li) => (
          <radialGradient
            key={li}
            id={layerIds[li]}
            cx="40%"
            cy="35%"
            r="60%"
          >
            <stop offset="0%" stopColor={c[keys[0]]} />
            <stop offset="50%" stopColor={c[keys[1]]} />
            <stop offset="100%" stopColor={c[keys[2]]} stopOpacity="0.6" />
          </radialGradient>
        ))}
        <radialGradient id={core} cx="35%" cy="35%" r="60%">
          <stop offset="0%" stopColor="white" />
          <stop offset="40%" stopColor={c.coreMid} />
          <stop offset="100%" stopColor={c.coreOuter} stopOpacity="0.8" />
        </radialGradient>
      </defs>

      <ellipse cx={CX} cy={CY} rx="95" ry="150" fill={`url(#${bg})`} />

      {SEEDS.map((s) => (
        <circle
          key={s.i}
          cx={s.x}
          cy={s.y}
          r={s.size}
          fill={`url(#${layerIds[s.layer]})`}
          opacity={0.5 + (1 - s.r / 100) * 0.5}
        />
      ))}

      {SEEDS.filter((s) => s.r < 30).map((s) => (
        <circle
          key={`glow-${s.i}`}
          cx={s.x}
          cy={s.y}
          r={s.size * 2.5}
          fill={c[GLOW_COLOR_KEYS[s.i % 3]]}
          opacity="0.08"
        />
      ))}

      <circle cx={CX} cy={CY} r={10} fill={`url(#${core})`} opacity="0.95" />
      <circle cx={CX} cy={CY} r={6} fill="white" opacity="0.9" />
      <circle cx={CX} cy={CY} r={3} fill="white" />
      <circle cx={CX - 2} cy={CY - 2} r={1.5} fill="white" opacity="0.8" />

      {RAY_ANGLES.map((a) => {
        const rad = (a * Math.PI) / 180;
        return (
          <line
            key={a}
            x1={CX + Math.cos(rad) * 10}
            y1={CY + Math.sin(rad) * 10}
            x2={CX + Math.cos(rad) * 18}
            y2={CY + Math.sin(rad) * 18}
            stroke="white"
            strokeWidth="0.8"
            opacity="0.6"
          />
        );
      })}
    </CharacterFrame>
  );
}
