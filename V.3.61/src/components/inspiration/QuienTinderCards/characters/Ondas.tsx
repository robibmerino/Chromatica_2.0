import { useMemo } from 'react';
import { useUniqueSvgIds } from '../useUniqueSvgIds';
import { getCharacterTransform } from '../characterTransform';
import { CharacterFrame } from '../CharacterFrame';
import type { QuienCharacterProps } from '../types';
import { useCreatureAxisPalette, getCreatureMetadata } from '../../archetypeCardComponents/creatures';

/** Paleta base de Ondas (Fluidez: cian suave; Precisión: violeta definido al rotar). */
const ONDAS_PALETTE = {
  wave1a: '#00e5ff',
  wave1b: '#7c4dff',
  wave2a: '#f48fb1',
  wave2b: '#69f0ae',
  diagonal: '#ffe082',
  centerLight: '#ffffff',
  centerMid: '#e0f7fa',
  centerOuter: '#006064',
  glowLeft: '#7c4dff',
  glowRight: '#00e5ff',
  nodeCyan: '#00e5ff',
  nodePink: '#f48fb1',
  nodeViolet: '#7c4dff',
  nodeGreen: '#69f0ae',
  nodeAmber: '#fff9c4',
} as const;

const CREATURE_ID = 8 as const;

const NODE_SPECS: [number, number, keyof typeof ONDAS_PALETTE][] = [
  [45, 45, 'nodeCyan'],
  [100, 30, 'nodePink'],
  [155, 45, 'nodeViolet'],
  [30, 100, 'nodeGreen'],
  [170, 100, 'nodeCyan'],
  [45, 155, 'nodePink'],
  [100, 170, 'nodeViolet'],
  [155, 155, 'nodeGreen'],
  [72, 72, 'nodeAmber'],
  [128, 72, 'nodeAmber'],
  [72, 128, 'nodeAmber'],
  [128, 128, 'nodeAmber'],
  [100, 100, 'centerLight'],
];

export function Ondas({
  className = '',
  hideLabel,
  axisColorParams,
}: QuienCharacterProps) {
  const svgId = useUniqueSvgIds('ondas');
  const center = svgId('center');
  const glow = svgId('glow');

  const c = useCreatureAxisPalette(CREATURE_ID, ONDAS_PALETTE, axisColorParams);
  const meta = getCreatureMetadata(CREATURE_ID);

  const waves1Paths = useMemo(() => {
    const paths: { d: string; color: string; strokeWidth: number; opacity: number }[] = [];
    for (let i = 0; i < 10; i++) {
      const y = 20 + i * 18;
      const amp = 12 + i * 2;
      const freq = 0.04 + i * 0.002;
      const phase = i * 0.5;
      let d = `M 5 ${y}`;
      for (let x = 5; x <= 195; x += 3) {
        const wy = y + amp * Math.sin(freq * x * Math.PI + phase);
        d += ` L ${x} ${wy}`;
      }
      const opacity = 0.15 + (i % 3) * 0.12;
      const color = i % 2 === 0 ? c.wave1a : c.wave1b;
      paths.push({
        d,
        color,
        strokeWidth: 0.6 + (i % 3) * 0.3,
        opacity,
      });
    }
    return paths;
  }, [c.wave1a, c.wave1b]);

  const waves2Paths = useMemo(() => {
    const paths: { d: string; color: string; strokeWidth: number; opacity: number }[] = [];
    for (let i = 0; i < 10; i++) {
      const x = 20 + i * 18;
      const amp = 10 + i * 2;
      const freq = 0.04 + i * 0.002;
      const phase = i * 0.7;
      let d = `M ${x} 5`;
      for (let y = 5; y <= 195; y += 3) {
        const wx = x + amp * Math.sin(freq * y * Math.PI + phase);
        d += ` L ${wx} ${y}`;
      }
      const opacity = 0.12 + (i % 3) * 0.1;
      const color = i % 2 === 0 ? c.wave2a : c.wave2b;
      paths.push({
        d,
        color,
        strokeWidth: 0.5 + (i % 3) * 0.3,
        opacity,
      });
    }
    return paths;
  }, [c.wave2a, c.wave2b]);

  return (
    <CharacterFrame
      title={meta?.name ?? 'Ondas'}
      subtitle={meta?.subtitle ?? 'Fluidez'}
      variant={meta?.labelVariant ?? 'cyan'}
      className={className}
      hideLabel={hideLabel}
    >
      <defs>
        <radialGradient id={center} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={c.centerLight} stopOpacity="0.9" />
          <stop offset="30%" stopColor={c.centerMid} stopOpacity="0.5" />
          <stop offset="100%" stopColor={c.centerOuter} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={glow} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={c.glowLeft} stopOpacity="0.12" />
          <stop offset="50%" stopColor={c.glowRight} stopOpacity="0.06" />
          <stop offset="100%" stopColor={c.glowRight} stopOpacity="0" />
        </radialGradient>
      </defs>

      <g transform={getCharacterTransform({ translateY: 60 }) ?? undefined}>
        {/* Fondo de interferencia */}
        <ellipse cx="100" cy="100" rx="95" ry="95" fill={`url(#${glow})`} />

        {/* Ondas horizontales */}
        {waves1Paths.map(({ d, color, strokeWidth, opacity }, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            opacity={opacity}
            strokeLinecap="round"
          />
        ))}

        {/* Ondas verticales */}
        {waves2Paths.map(({ d, color, strokeWidth, opacity }, i) => (
          <path
            key={i}
            d={d}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            opacity={opacity}
            strokeLinecap="round"
          />
        ))}

        {/* Ondas diagonales extra sutiles */}
        {[0, 1, 2, 3, 4].map((i) => {
          const offset = i * 28;
          return (
            <line
              key={i}
              x1={offset}
              y1={0}
              x2={200}
              y2={200 - offset}
              stroke={c.diagonal}
              strokeWidth="0.4"
              opacity="0.06"
            />
          );
        })}
        {[0, 1, 2, 3, 4].map((i) => {
          const offset = i * 28;
          return (
            <line
              key={i}
              x1={200 - offset}
              y1={0}
              x2={0}
              y2={200 - offset}
              stroke={c.diagonal}
              strokeWidth="0.4"
              opacity="0.06"
            />
          );
        })}

        {/* Nodos de interferencia */}
        {NODE_SPECS.map(([x, y, colorKey], i) => {
          const color = c[colorKey];
          const isCenter = i === 12;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={isCenter ? 10 : 5} fill={color} opacity="0.08" />
              <circle cx={x} cy={y} r={isCenter ? 6 : 3} fill={color} opacity="0.15" />
              <circle cx={x} cy={y} r={isCenter ? 3 : 1.5} fill={color} opacity="0.7" />
              <circle cx={x} cy={y} r={isCenter ? 1.5 : 0.8} fill="white" opacity="0.9" />
            </g>
          );
        })}

        {/* Halo central */}
        <ellipse cx="100" cy="100" rx="18" ry="18" fill={`url(#${center})`} />
        <ellipse cx="100" cy="100" rx="10" ry="10" fill="white" opacity="0.15" />
        <ellipse cx="100" cy="100" rx="5" ry="5" fill="white" opacity="0.6" />
        <ellipse cx="100" cy="100" rx="2" ry="2" fill="white" opacity="1" />
      </g>
    </CharacterFrame>
  );
}
