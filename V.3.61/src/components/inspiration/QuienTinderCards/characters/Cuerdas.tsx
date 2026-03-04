import { useMemo } from 'react';
import { useUniqueSvgIds } from '../useUniqueSvgIds';
import { getCharacterTransform } from '../characterTransform';
import { CharacterFrame } from '../CharacterFrame';
import type { QuienCharacterProps } from '../types';
import { useCreatureAxisPalette, getCreatureMetadata } from '../../archetypeCardComponents/creatures';

/** Paleta base de Cuerdas (Unión: tonos conectados; Singularidad: colores distintivos al rotar). */
const CUERDAS_PALETTE = {
  c0a: '#00e5ff',
  c0b: '#7c4dff',
  c1a: '#f48fb1',
  c1b: '#ff6d00',
  c2a: '#69f0ae',
  c2b: '#00bcd4',
  c3a: '#ffe082',
  c3b: '#ff4081',
  c4a: '#ce93d8',
  c4b: '#00e676',
  c5a: '#80deea',
  c5b: '#651fff',
  coreLight: '#ffffff',
  coreMid: '#e0f7fa',
  coreOuter: '#006064',
  glowLeft: '#00e5ff',
  glowRight: '#7c4dff',
  nodeWhite: '#ffffff',
  nodeCyan: '#00e5ff',
  nodePink: '#f48fb1',
  nodeGreen: '#69f0ae',
  nodeAmber: '#ffe082',
  nodeViolet: '#ce93d8',
  nodeCyan2: '#80deea',
} as const;

const CREATURE_ID = 9 as const;

const CURVES_DATA: { a: number; b: number; phase: number }[] = [
  { a: 3, b: 2, phase: 0 },
  { a: 5, b: 4, phase: Math.PI / 4 },
  { a: 4, b: 3, phase: Math.PI / 3 },
  { a: 5, b: 2, phase: Math.PI / 6 },
  { a: 7, b: 4, phase: Math.PI / 5 },
  { a: 3, b: 5, phase: Math.PI / 8 },
];

const NODE_SPECS: [number, number, keyof typeof CUERDAS_PALETTE][] = [
  [100, 100, 'nodeWhite'],
  [68, 68, 'nodeCyan'],
  [132, 68, 'nodePink'],
  [68, 132, 'nodeGreen'],
  [132, 132, 'nodeAmber'],
  [100, 55, 'nodeViolet'],
  [100, 145, 'nodeCyan2'],
  [55, 100, 'nodeCyan'],
  [145, 100, 'nodePink'],
  [78, 82, 'nodeAmber'],
  [122, 82, 'nodeGreen'],
  [78, 118, 'nodeViolet'],
  [122, 118, 'nodeCyan2'],
  [60, 60, 'nodeWhite'],
  [140, 60, 'nodeWhite'],
  [60, 140, 'nodeWhite'],
  [140, 140, 'nodeWhite'],
];

function lissajous(a: number, b: number, phase: number, scale: number): string {
  const points: string[] = [];
  for (let t = 0; t <= Math.PI * 2; t += 0.04) {
    const x = 100 + scale * Math.sin(a * t + phase);
    const y = 100 + scale * Math.cos(b * t);
    points.push(`${x},${y}`);
  }
  return points.join(' ');
}

const COLOR_KEYS = ['c0a', 'c0b', 'c1a', 'c1b', 'c2a', 'c2b', 'c3a', 'c3b', 'c4a', 'c4b', 'c5a', 'c5b'] as const;

export function Cuerdas({
  className = '',
  hideLabel,
  axisColorParams,
}: QuienCharacterProps) {
  const svgId = useUniqueSvgIds('cuerdas');
  const core = svgId('core');
  const glow = svgId('glow');

  const c = useCreatureAxisPalette(CREATURE_ID, CUERDAS_PALETTE, axisColorParams);
  const meta = getCreatureMetadata(CREATURE_ID);

  const gradientIds = CURVES_DATA.map((_, i) => svgId(`g${i}`));

  const curves = useMemo(
    () =>
      CURVES_DATA.map((data, i) => ({
        ...data,
        color1: c[COLOR_KEYS[i * 2]],
        color2: c[COLOR_KEYS[i * 2 + 1]],
      })),
    [c]
  );

  return (
    <CharacterFrame
      title={meta?.name ?? 'Cuerdas'}
      subtitle={meta?.subtitle ?? 'Unión'}
      variant={meta?.labelVariant ?? 'cyan'}
      className={className}
      hideLabel={hideLabel}
    >
      <defs>
        {curves.map((curve, i) => (
          <linearGradient
            key={i}
            id={gradientIds[i]}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor={curve.color1} stopOpacity="0.7" />
            <stop offset="50%" stopColor={curve.color2} stopOpacity="0.5" />
            <stop offset="100%" stopColor={curve.color1} stopOpacity="0.7" />
          </linearGradient>
        ))}
        <radialGradient id={core} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={c.coreLight} stopOpacity="1" />
          <stop offset="50%" stopColor={c.coreMid} stopOpacity="0.5" />
          <stop offset="100%" stopColor={c.coreOuter} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={glow} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={c.glowLeft} stopOpacity="0.1" />
          <stop offset="100%" stopColor={c.glowRight} stopOpacity="0" />
        </radialGradient>
      </defs>

      <g transform={getCharacterTransform({ scale: 1.2, translateY: 40, centerX: 100, centerY: 100 }) ?? undefined}>
        <ellipse cx="100" cy="100" rx="95" ry="95" fill={`url(#${glow})`} />

        {/* Capa fondo */}
        {curves.map((curve, i) => (
          <polyline
            key={`bg-${i}`}
            points={lissajous(curve.a, curve.b, curve.phase, 78 - i * 4)}
            fill="none"
            stroke={curve.color1}
            strokeWidth={3 + i * 0.5}
            opacity={0.04}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}

        {/* Capa media */}
        {curves.map((curve, i) => (
          <polyline
            key={`mid-${i}`}
            points={lissajous(curve.a, curve.b, curve.phase, 72 - i * 3)}
            fill="none"
            stroke={`url(#${gradientIds[i]})`}
            strokeWidth={1.2 - i * 0.05}
            opacity={0.25 + (i % 3) * 0.08}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}

        {/* Capa superior */}
        {curves.map((curve, i) => (
          <polyline
            key={`top-${i}`}
            points={lissajous(curve.a, curve.b, curve.phase + 0.1, 65 - i * 2)}
            fill="none"
            stroke={curve.color1}
            strokeWidth={0.6}
            opacity={0.45 + (i % 2) * 0.1}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}

        {/* Curvas rotadas (primeras 3) */}
        {curves.slice(0, 3).map((curve, i) => (
          <polyline
            key={`rot-${i}`}
            points={lissajous(curve.b, curve.a, curve.phase + Math.PI / 2, 60 - i * 3)}
            fill="none"
            stroke={curve.color2}
            strokeWidth={0.5}
            opacity={0.2 + i * 0.05}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}

        {/* Nodos */}
        {NODE_SPECS.map(([x, y, colorKey], i) => {
          const color = c[colorKey];
          const isCenter = i === 0;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={isCenter ? 10 : 4} fill={color} opacity="0.08" />
              <circle cx={x} cy={y} r={isCenter ? 5 : 2.5} fill={color} opacity="0.2" />
              <circle cx={x} cy={y} r={isCenter ? 2.5 : 1.2} fill={color} opacity="0.7" />
              <circle cx={x} cy={y} r={isCenter ? 1.2 : 0.6} fill="white" opacity="0.9" />
            </g>
          );
        })}

        {/* Núcleo */}
        <ellipse cx="100" cy="100" rx="16" ry="16" fill={`url(#${core})`} />
        <ellipse cx="100" cy="100" rx="8" ry="8" fill="white" opacity="0.3" />
        <ellipse cx="100" cy="100" rx="4" ry="4" fill="white" opacity="0.8" />
        <ellipse cx="100" cy="100" rx="2" ry="2" fill="white" opacity="1" />
        <ellipse cx="98.5" cy="98.5" rx="1" ry="1" fill="white" opacity="0.7" />
      </g>
    </CharacterFrame>
  );
}
