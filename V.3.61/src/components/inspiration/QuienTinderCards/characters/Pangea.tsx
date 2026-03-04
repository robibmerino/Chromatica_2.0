import { useMemo } from 'react';
import { useUniqueSvgIds } from '../useUniqueSvgIds';
import { getCharacterTransform } from '../characterTransform';
import { CharacterFrame } from '../CharacterFrame';
import type { QuienCharacterProps } from '../types';
import { useCreatureAxisPalette, getCreatureMetadata } from '../../archetypeCardComponents/creatures';

/** Paleta base de Pangea (Inclusivo: diversidad; Único: tono singular al rotar). */
const PANGEA_PALETTE = {
  s0a: '#ff1744',
  s0b: '#ff6d00',
  s1a: '#ff6d00',
  s1b: '#ffd600',
  s2a: '#76ff03',
  s2b: '#00e676',
  s3a: '#00e5ff',
  s3b: '#2979ff',
  s4a: '#651fff',
  s4b: '#d500f9',
  s5a: '#d500f9',
  s5b: '#ff4081',
  s6a: '#00e676',
  s6b: '#1de9b6',
  s7a: '#ffd600',
  s7b: '#ff1744',
  coreLight: '#ffffff',
  coreMid: '#f5f5f5',
  coreOuter: '#e0e0e0',
} as const;

const CREATURE_ID = 10 as const;

const SECTOR_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];
const SECTOR_COLOR_KEYS: (keyof typeof PANGEA_PALETTE)[] = [
  's0a', 's0b', 's1a', 's1b', 's2a', 's2b', 's3a', 's3b',
  's4a', 's4b', 's5a', 's5b', 's6a', 's6b', 's7a', 's7b',
];
const RADII = [90, 72, 55, 38];
const RING_RADII = [88, 72, 55, 38, 22];
const INNER_DISTANCES = [0.4, 0.65, 0.82];

function polarToCart(angle: number, r: number, cx = 100, cy = 100) {
  const rad = (angle * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad),
  };
}

export function Pangea({
  className = '',
  hideLabel,
  axisColorParams,
}: QuienCharacterProps) {
  const svgId = useUniqueSvgIds('pangea');
  const core = svgId('core');

  const c = useCreatureAxisPalette(CREATURE_ID, PANGEA_PALETTE, axisColorParams);
  const meta = getCreatureMetadata(CREATURE_ID);

  const sectors = useMemo(
    () =>
      SECTOR_ANGLES.map((angle, i) => ({
        angle,
        color1: c[SECTOR_COLOR_KEYS[i * 2]],
        color2: c[SECTOR_COLOR_KEYS[i * 2 + 1]],
      })),
    [c]
  );

  const sectorGradientIds = SECTOR_ANGLES.map((_, i) => svgId(`s${i}`));

  return (
    <CharacterFrame
      title={meta?.name ?? 'Pangea'}
      subtitle={meta?.subtitle ?? 'Culturas'}
      variant={meta?.labelVariant ?? 'rose'}
      className={className}
      hideLabel={hideLabel}
    >
      <defs>
        {sectors.map((s, i) => (
          <radialGradient
            key={i}
            id={sectorGradientIds[i]}
            cx="50%"
            cy="50%"
            r="100%"
          >
            <stop offset="0%" stopColor={s.color1} stopOpacity="0.7" />
            <stop offset="60%" stopColor={s.color2} stopOpacity="0.3" />
            <stop offset="100%" stopColor={s.color2} stopOpacity="0" />
          </radialGradient>
        ))}
        <radialGradient id={core} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={c.coreLight} stopOpacity="1" />
          <stop offset="40%" stopColor={c.coreMid} stopOpacity="0.8" />
          <stop offset="100%" stopColor={c.coreOuter} stopOpacity="0" />
        </radialGradient>
      </defs>

      <g transform={getCharacterTransform({ translateY: 60 }) ?? undefined}>
        {/* Sectores */}
        {sectors.map((s, i) => {
          const startAngle = s.angle - 22.5;
          const endAngle = s.angle + 22.5;
          return RADII.map((r, ri) => {
            const p1 = polarToCart(startAngle, r);
            const p2 = polarToCart(endAngle, r);
            const nextR = ri < RADII.length - 1 ? RADII[ri + 1] : 0;
            const p3 = polarToCart(endAngle, nextR);
            const p4 = polarToCart(startAngle, nextR);
            const path =
              nextR === 0
                ? `M ${p1.x} ${p1.y} A ${r} ${r} 0 0 1 ${p2.x} ${p2.y} L 100 100 Z`
                : `M ${p1.x} ${p1.y} A ${r} ${r} 0 0 1 ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${nextR} ${nextR} 0 0 0 ${p4.x} ${p4.y} Z`;
            return (
              <path
                key={`${i}-${ri}`}
                d={path}
                fill={`url(#${sectorGradientIds[i]})`}
                opacity={0.15 + ri * 0.08}
              />
            );
          });
        })}

        {/* Líneas divisorias */}
        {sectors.map((s, i) => {
          const edgeAngle = s.angle + 22.5;
          const p1 = polarToCart(edgeAngle, 2);
          const p2 = polarToCart(edgeAngle, 88);
          return (
            <line
              key={i}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke={s.color1}
              strokeWidth="0.8"
              opacity="0.5"
            />
          );
        })}

        {/* Círculos concéntricos */}
        {RING_RADII.map((r, i) => (
          <circle
            key={i}
            cx="100"
            cy="100"
            r={r}
            fill="none"
            stroke="white"
            strokeWidth="0.4"
            opacity={0.08 + i * 0.04}
          />
        ))}

        {/* Nodos en sectores */}
        {sectors.map((s, i) =>
          INNER_DISTANCES.map((dist, j) => {
            const p = polarToCart(s.angle, 88 * dist);
            return (
              <g key={`${i}-${j}`}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={2.5 - j * 0.5}
                  fill={s.color1}
                  opacity={0.3}
                />
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={1.2 - j * 0.2}
                  fill={s.color1}
                  opacity={0.7}
                />
                <circle cx={p.x} cy={p.y} r={0.5} fill="white" opacity={0.9} />
              </g>
            );
          })
        )}

        {/* Nodos en borde */}
        {sectors.map((s, i) => {
          const p = polarToCart(s.angle, 90);
          return (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r={4} fill={s.color1} opacity={0.15} />
              <circle cx={p.x} cy={p.y} r={2} fill={s.color1} opacity={0.4} />
              <circle cx={p.x} cy={p.y} r={1} fill="white" opacity={0.8} />
            </g>
          );
        })}

        {/* Núcleo */}
        <circle cx="100" cy="100" r="20" fill={`url(#${core})`} />
        <circle cx="100" cy="100" r="12" fill="white" opacity="0.2" />
        {sectors.map((s, i) => (
          <line
            key={i}
            x1="100"
            y1="100"
            x2={100 + Math.cos((s.angle * Math.PI) / 180) * 20}
            y2={100 + Math.sin((s.angle * Math.PI) / 180) * 20}
            stroke={s.color1}
            strokeWidth="0.6"
            opacity="0.4"
          />
        ))}
        <circle cx="100" cy="100" r="6" fill="white" opacity="0.9" />
        <circle cx="100" cy="100" r="3" fill="white" opacity="1" />
        <circle cx="98.5" cy="98.5" r="1.5" fill="white" opacity="0.8" />
      </g>
    </CharacterFrame>
  );
}
