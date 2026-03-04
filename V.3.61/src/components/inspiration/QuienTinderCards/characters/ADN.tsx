import { useMemo } from 'react';
import { useUniqueSvgIds } from '../useUniqueSvgIds';
import { getCharacterTransform } from '../characterTransform';
import { CharacterFrame } from '../CharacterFrame';
import type { QuienCharacterProps } from '../types';
import { useCreatureAxisPalette, getCreatureMetadata } from '../../archetypeCardComponents/creatures';

/** Paleta base de ADN (Evolución: fucsia/cian; Legado: tonos profundos al rotar). */
const ADN_PALETTE = {
  chainALight: '#e040fb',
  chainAMid: '#ab47bc',
  chainADark: '#7b1fa2',
  chainBLight: '#00e5ff',
  chainBMid: '#26c6da',
  chainBDark: '#0097a7',
  nodeALight: '#e040fb',
  nodeAOuter: '#7b1fa2',
  nodeBLight: '#00e5ff',
  nodeBOuter: '#006064',
  bgLeft: '#e040fb',
  bgRight: '#00e5ff',
  rungA: '#e040fb',
  rungB: '#00e5ff',
  rungCenter1: '#ffd740',
  rungCenter2: '#69f0ae',
  colorsA: '#e040fb',
  colorsA2: '#ab47bc',
  colorsA3: '#7b1fa2',
  colorsA4: '#9c27b0',
  colorsA5: '#ce93d8',
  colorsB: '#00e5ff',
  colorsB2: '#26c6da',
  colorsB3: '#0097a7',
  colorsB4: '#4dd0e1',
  colorsB5: '#80deea',
} as const;

const CREATURE_ID = 11 as const;

const STEPS = 18;
const HEIGHT = 200;
const START_Y = 60;
const AMPLITUDE = 38;

const COLORS_A: (keyof typeof ADN_PALETTE)[] = [
  'colorsA', 'colorsA2', 'colorsA3', 'colorsA4', 'colorsA5',
];
const COLORS_B: (keyof typeof ADN_PALETTE)[] = [
  'colorsB', 'colorsB2', 'colorsB3', 'colorsB4', 'colorsB5',
];

export function ADN({
  className = '',
  hideLabel,
  axisColorParams,
}: QuienCharacterProps) {
  const svgId = useUniqueSvgIds('adn');
  const nodeA = svgId('node-a');
  const nodeB = svgId('node-b');
  const bg = svgId('bg');

  const c = useCreatureAxisPalette(CREATURE_ID, ADN_PALETTE, axisColorParams);
  const meta = getCreatureMetadata(CREATURE_ID);

  const { chainA, chainB, rungs, pathA, pathB } = useMemo(() => {
    const chainA = Array.from({ length: STEPS + 1 }, (_, i) => {
      const t = i / STEPS;
      const y = START_Y + t * HEIGHT;
      const x = 100 + Math.sin(t * Math.PI * 3) * AMPLITUDE;
      return { x, y };
    });

    const chainB = Array.from({ length: STEPS + 1 }, (_, i) => {
      const t = i / STEPS;
      const y = START_Y + t * HEIGHT;
      const x = 100 + Math.sin(t * Math.PI * 3 + Math.PI) * AMPLITUDE;
      return { x, y };
    });

    const rungs = Array.from({ length: 9 }, (_, i) => {
      const idx = Math.round((i / 8) * STEPS);
      return { a: chainA[idx], b: chainB[idx], i };
    });

    const pathA = chainA
      .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
      .join(' ');
    const pathB = chainB
      .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
      .join(' ');

    return { chainA, chainB, rungs, pathA, pathB };
  }, []);

  return (
    <CharacterFrame
      title={meta?.name ?? 'ADN'}
      subtitle={meta?.subtitle ?? 'Evolución'}
      variant={meta?.labelVariant ?? 'fuchsia'}
      className={className}
      hideLabel={hideLabel}
    >
      <defs>
        <radialGradient id={nodeA} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="40%" stopColor={c.nodeALight} stopOpacity="0.9" />
          <stop offset="100%" stopColor={c.nodeAOuter} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={nodeB} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="40%" stopColor={c.nodeBLight} stopOpacity="0.9" />
          <stop offset="100%" stopColor={c.nodeBOuter} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={bg} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={c.bgLeft} stopOpacity="0.08" />
          <stop offset="50%" stopColor={c.bgRight} stopOpacity="0.05" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g transform={getCharacterTransform({ translateY: -15 }) ?? undefined}>
        {/* Halo de fondo */}
        <ellipse cx="100" cy="160" rx="75" ry="110" fill={`url(#${bg})`} />

        {/* Cadena A */}
        <path d={pathA} fill="none" stroke={c.chainALight} strokeWidth="6" opacity="0.08" strokeLinecap="round" strokeLinejoin="round" />
        <path d={pathA} fill="none" stroke={c.chainAMid} strokeWidth="2.5" opacity="0.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d={pathA} fill="none" stroke={c.chainALight} strokeWidth="1" opacity="0.9" strokeLinecap="round" strokeLinejoin="round" />

        {/* Cadena B */}
        <path d={pathB} fill="none" stroke={c.chainBLight} strokeWidth="6" opacity="0.08" strokeLinecap="round" strokeLinejoin="round" />
        <path d={pathB} fill="none" stroke={c.chainBMid} strokeWidth="2.5" opacity="0.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d={pathB} fill="none" stroke={c.chainBLight} strokeWidth="1" opacity="0.9" strokeLinecap="round" strokeLinejoin="round" />

        {/* Conexiones transversales */}
        {rungs.map((r, i) => (
          <g key={i}>
            <line
              x1={r.a.x}
              y1={r.a.y}
              x2={r.b.x}
              y2={r.b.y}
              stroke="white"
              strokeWidth="2"
              opacity="0.08"
            />
            <line
              x1={r.a.x}
              y1={r.a.y}
              x2={r.b.x}
              y2={r.b.y}
              stroke={i % 2 === 0 ? c.rungA : c.rungB}
              strokeWidth="0.8"
              opacity="0.7"
            />
            <circle
              cx={(r.a.x + r.b.x) / 2}
              cy={(r.a.y + r.b.y) / 2}
              r="2"
              fill={i % 2 === 0 ? c.rungCenter1 : c.rungCenter2}
              opacity="0.9"
            />
            <circle
              cx={(r.a.x + r.b.x) / 2}
              cy={(r.a.y + r.b.y) / 2}
              r="0.8"
              fill="white"
              opacity="0.95"
            />
          </g>
        ))}

        {/* Nodos cadena A */}
        {chainA
          .filter((_, i) => i % 2 === 0)
          .map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r={7} fill={`url(#${nodeA})`} />
              <circle
                cx={p.x}
                cy={p.y}
                r={3}
                fill={c[COLORS_A[i % COLORS_A.length]]}
                opacity="0.9"
              />
              <circle cx={p.x} cy={p.y} r={1.2} fill="white" opacity="0.95" />
            </g>
          ))}

        {/* Nodos cadena B */}
        {chainB
          .filter((_, i) => i % 2 === 0)
          .map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r={7} fill={`url(#${nodeB})`} />
              <circle
                cx={p.x}
                cy={p.y}
                r={3}
                fill={c[COLORS_B[i % COLORS_B.length]]}
                opacity="0.9"
              />
              <circle cx={p.x} cy={p.y} r={1.2} fill="white" opacity="0.95" />
            </g>
          ))}
      </g>
    </CharacterFrame>
  );
}
