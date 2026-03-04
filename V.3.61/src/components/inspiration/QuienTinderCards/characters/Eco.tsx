import { useMemo } from 'react';
import { useUniqueSvgIds } from '../useUniqueSvgIds';
import { CharacterFrame } from '../CharacterFrame';
import type { QuienCharacterProps } from '../types';
import { useCreatureAxisPalette, getCreatureMetadata } from '../../archetypeCardComponents/creatures';

/** Paleta base de Eco (Resonancia: suave; Nitidez: definido al rotar). */
const ECO_PALETTE = {
  f0a: '#00e5ff',
  f0b: '#0d47a1',
  f1a: '#e040fb',
  f1b: '#4a148c',
  f2a: '#69f0ae',
  f2b: '#1b5e20',
  f3a: '#ff6d00',
  f3b: '#bf360c',
  f4a: '#ffd740',
  f4b: '#ff6f00',
  coreLight: '#ffffff',
  coreMid: '#e0f7fa',
  coreOuter: '#00e5ff',
  int0: '#00e5ff',
  int1: '#e040fb',
  int2: '#69f0ae',
  int3: '#ffd740',
  int4: '#ff6d00',
} as const;

const CREATURE_ID = 13 as const;

const FOCI_DATA: { cx: number; cy: number; color1Key: keyof typeof ECO_PALETTE; color2Key: keyof typeof ECO_PALETTE }[] = [
  { cx: 100, cy: 160, color1Key: 'f0a', color2Key: 'f0b' },
  { cx: 68, cy: 120, color1Key: 'f1a', color2Key: 'f1b' },
  { cx: 132, cy: 125, color1Key: 'f2a', color2Key: 'f2b' },
  { cx: 80, cy: 200, color1Key: 'f3a', color2Key: 'f3b' },
  { cx: 122, cy: 195, color1Key: 'f4a', color2Key: 'f4b' },
];

const RINGS = Array.from({ length: 10 }, (_, i) => i + 1);

const INTERFERENCE_SPECS: { x: number; y: number; colorKey: keyof typeof ECO_PALETTE; r: number }[] = [
  { x: 84, y: 140, colorKey: 'int0', r: 5 },
  { x: 116, y: 142, colorKey: 'int1', r: 4 },
  { x: 100, y: 108, colorKey: 'int2', r: 6 },
  { x: 72, y: 168, colorKey: 'int3', r: 4 },
  { x: 128, y: 165, colorKey: 'int4', r: 5 },
  { x: 100, y: 185, colorKey: 'int0', r: 3.5 },
  { x: 88, y: 118, colorKey: 'int3', r: 3 },
  { x: 112, y: 116, colorKey: 'int1', r: 3.5 },
  { x: 60, y: 148, colorKey: 'int2', r: 3 },
  { x: 140, y: 150, colorKey: 'int0', r: 4 },
  { x: 78, y: 196, colorKey: 'int1', r: 3 },
  { x: 122, y: 194, colorKey: 'int3', r: 3.5 },
];

export function Eco({
  className = '',
  hideLabel,
  axisColorParams,
}: QuienCharacterProps) {
  const svgId = useUniqueSvgIds('eco');
  const core = svgId('core');

  const c = useCreatureAxisPalette(CREATURE_ID, ECO_PALETTE, axisColorParams);
  const meta = getCreatureMetadata(CREATURE_ID);

  const foci = useMemo(
    () =>
      FOCI_DATA.map((f) => ({
        ...f,
        color1: c[f.color1Key],
        color2: c[f.color2Key],
      })),
    [c]
  );

  const gradientIds = FOCI_DATA.map((_, i) => svgId(`rg${i}`));

  return (
    <CharacterFrame
      title={meta?.name ?? 'Eco'}
      subtitle={meta?.subtitle ?? 'Resonancia'}
      variant={meta?.labelVariant ?? 'cyan'}
      className={className}
      hideLabel={hideLabel}
    >
      <defs>
        {foci.map((f, fi) => (
          <radialGradient key={fi} id={gradientIds[fi]} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={f.color1} stopOpacity="0.8" />
            <stop offset="60%" stopColor={f.color2} stopOpacity="0.3" />
            <stop offset="100%" stopColor={f.color2} stopOpacity="0" />
          </radialGradient>
        ))}
        <radialGradient id={core} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={c.coreLight} stopOpacity="0.95" />
          <stop offset="40%" stopColor={c.coreMid} stopOpacity="0.6" />
          <stop offset="100%" stopColor={c.coreOuter} stopOpacity="0" />
        </radialGradient>
      </defs>

        {/* Fondo difuso */}
        <ellipse cx="100" cy="155" rx="90" ry="110" fill="#000d1a" opacity="0.4" />

        {/* Ondas de interferencia */}
        {foci.map((f, fi) =>
          RINGS.map((r, ri) => (
            <circle
              key={`${fi}-${ri}`}
              cx={f.cx}
              cy={f.cy}
              r={r * 22}
              fill="none"
              stroke={f.color1}
              strokeWidth={1.2 - ri * 0.08}
              opacity={Math.max(0, 0.55 - ri * 0.05)}
            />
          ))
        )}

        {/* Zonas de interferencia constructiva */}
        {INTERFERENCE_SPECS.map((p, i) => {
          const color = c[p.colorKey];
          return (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r={p.r * 2.5} fill={color} opacity="0.08" />
              <circle cx={p.x} cy={p.y} r={p.r} fill={color} opacity="0.9" />
              <circle cx={p.x} cy={p.y} r={p.r * 0.4} fill="white" opacity="0.95" />
            </g>
          );
        })}

        {/* Halos difusos en cada foco */}
        {foci.map((f, fi) => (
          <ellipse
            key={fi}
            cx={f.cx}
            cy={f.cy}
            rx={18}
            ry={18}
            fill={`url(#${gradientIds[fi]})`}
          />
        ))}

        {/* Núcleos de cada foco */}
        {foci.map((f, fi) => (
          <g key={fi}>
            <circle cx={f.cx} cy={f.cy} r={5} fill={f.color1} opacity="0.9" />
            <circle cx={f.cx} cy={f.cy} r={2.5} fill="white" opacity="0.95" />
          </g>
        ))}

        {/* Halo central global */}
        <ellipse cx="100" cy="158" rx="40" ry="40" fill={`url(#${core})`} />
    </CharacterFrame>
  );
}
