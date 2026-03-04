import { useMemo } from 'react';
import { useUniqueSvgIds } from '../useUniqueSvgIds';
import { getCharacterTransform } from '../characterTransform';
import { CharacterFrame } from '../CharacterFrame';
import type { QuienCharacterProps } from '../types';
import { useCreatureAxisPalette, getCreatureMetadata } from '../../archetypeCardComponents/creatures';

/** Paleta base de Voronoi (Orden: estructurado; Caos: vibrante al rotar). */
const VORONOI_PALETTE = {
  c0a: '#e040fb',
  c0b: '#7b1fa2',
  c1a: '#00e5ff',
  c1b: '#0097a7',
  c2a: '#ffd740',
  c2b: '#ff8f00',
  c3a: '#69f0ae',
  c3b: '#2e7d32',
  c4a: '#ff6d00',
  c4b: '#bf360c',
  c5a: '#40c4ff',
  c5b: '#0277bd',
  c6a: '#f06292',
  c6b: '#ad1457',
  c7a: '#b39ddb',
  c7b: '#4527a0',
  c8a: '#80cbc4',
  c8b: '#00695c',
  c9a: '#ffcc80',
  c9b: '#e65100',
  c10a: '#ce93d8',
  c10b: '#6a1b9a',
  c11a: '#a5d6a7',
  c11b: '#2e7d32',
  c12a: '#81d4fa',
  c12b: '#01579b',
  c13a: '#ffab91',
  c13b: '#bf360c',
  c14a: '#ffe082',
  c14b: '#ff8f00',
  c15a: '#b2dfdb',
  c15b: '#004d40',
  c16a: '#f48fb1',
  c16b: '#880e4f',
  coreLight: '#ffffff',
  coreMid: '#e0f7fa',
  coreOuter: '#00e5ff',
} as const;

const CREATURE_ID = 12 as const;

const CELLS_DATA: {
  points: string;
  cx: number;
  cy: number;
  color1Key: keyof typeof VORONOI_PALETTE;
  color2Key: keyof typeof VORONOI_PALETTE;
}[] = [
  { points: '100,80 130,72 148,95 132,118 108,115 90,105', cx: 116, cy: 95, color1Key: 'c0a', color2Key: 'c0b' },
  { points: '100,80 90,105 68,112 55,90 72,68 95,65', cx: 78, cy: 90, color1Key: 'c1a', color2Key: 'c1b' },
  { points: '100,80 95,65 72,68 78,48 100,42 115,58', cx: 95, cy: 62, color1Key: 'c2a', color2Key: 'c2b' },
  { points: '100,80 115,58 138,55 148,72 130,72', cx: 126, cy: 67, color1Key: 'c3a', color2Key: 'c3b' },
  { points: '100,80 130,72 148,72 155,95 148,95', cx: 140, cy: 83, color1Key: 'c4a', color2Key: 'c4b' },
  { points: '100,80 108,115 132,118 145,138 128,148 110,135', cx: 122, cy: 128, color1Key: 'c5a', color2Key: 'c5b' },
  { points: '100,80 110,135 90,140 75,128 68,112 90,105', cx: 85, cy: 118, color1Key: 'c6a', color2Key: 'c6b' },
  { points: '100,80 90,140 100,158 110,140', cx: 100, cy: 138, color1Key: 'c7a', color2Key: 'c7b' },
  { points: '55,90 68,112 75,128 58,138 42,118 44,96', cx: 58, cy: 112, color1Key: 'c8a', color2Key: 'c8b' },
  { points: '148,95 155,95 162,118 145,138 132,118', cx: 150, cy: 117, color1Key: 'c9a', color2Key: 'c9b' },
  { points: '44,96 42,118 58,138 52,158 35,148 30,118', cx: 42, cy: 132, color1Key: 'c10a', color2Key: 'c10b' },
  { points: '162,118 168,142 152,158 145,138', cx: 157, cy: 140, color1Key: 'c11a', color2Key: 'c11b' },
  { points: '52,158 58,138 75,128 90,140 80,165 60,170', cx: 70, cy: 152, color1Key: 'c12a', color2Key: 'c12b' },
  { points: '110,135 128,148 138,168 118,175 100,158', cx: 119, cy: 160, color1Key: 'c13a', color2Key: 'c13b' },
  { points: '100,158 118,175 108,190 92,190 82,175', cx: 100, cy: 178, color1Key: 'c14a', color2Key: 'c14b' },
  { points: '80,165 90,140 100,158 82,175 65,172', cx: 83, cy: 165, color1Key: 'c15a', color2Key: 'c15b' },
  { points: '152,158 168,142 175,165 158,178 138,168 128,148 145,138', cx: 155, cy: 160, color1Key: 'c16a', color2Key: 'c16b' },
];

export function Voronoi({
  className = '',
  hideLabel,
  axisColorParams,
}: QuienCharacterProps) {
  const svgId = useUniqueSvgIds('voronoi');
  const core = svgId('core');

  const c = useCreatureAxisPalette(CREATURE_ID, VORONOI_PALETTE, axisColorParams);
  const meta = getCreatureMetadata(CREATURE_ID);

  const cells = useMemo(
    () =>
      CELLS_DATA.map((cell) => ({
        ...cell,
        color1: c[cell.color1Key],
        color2: c[cell.color2Key],
      })),
    [c]
  );

  const gradientIds = CELLS_DATA.map((_, i) => svgId(`g${i}`));

  return (
    <CharacterFrame
      title={meta?.name ?? 'Voronoi'}
      subtitle={meta?.subtitle ?? 'Orgánico'}
      variant={meta?.labelVariant ?? 'emerald'}
      className={className}
      hideLabel={hideLabel}
    >
      <defs>
        {cells.map((cell, i) => (
          <radialGradient
            key={i}
            id={gradientIds[i]}
            cx="50%"
            cy="50%"
            r="70%"
          >
            <stop offset="0%" stopColor={cell.color1} stopOpacity="0.9" />
            <stop offset="70%" stopColor={cell.color2} stopOpacity="0.6" />
            <stop offset="100%" stopColor={cell.color2} stopOpacity="0.2" />
          </radialGradient>
        ))}
        <radialGradient id={core} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={c.coreLight} stopOpacity="0.95" />
          <stop offset="40%" stopColor={c.coreMid} stopOpacity="0.5" />
          <stop offset="100%" stopColor={c.coreOuter} stopOpacity="0" />
        </radialGradient>
      </defs>

      <g transform={getCharacterTransform({ scale: 1.1, translateY: 28, centerX: 100, centerY: 80 }) ?? undefined}>
        {/* Celdas rellenas */}
        {cells.map((cell, i) => (
          <polygon
            key={`fill-${i}`}
            points={cell.points}
            fill={`url(#${gradientIds[i]})`}
            opacity="0.85"
          />
        ))}

        {/* Bordes luminosos */}
        {cells.map((cell, i) => (
          <polygon
            key={`border-${i}`}
            points={cell.points}
            fill="none"
            stroke={cell.color1}
            strokeWidth="1.2"
            opacity="0.8"
          />
        ))}

        {/* Capa exterior de bordes */}
        {cells.map((cell, i) => (
          <polygon
            key={`glow-${i}`}
            points={cell.points}
            fill="none"
            stroke="white"
            strokeWidth="0.4"
            opacity="0.25"
          />
        ))}

        {/* Núcleos de cada celda */}
        {cells.map((cell, i) => (
          <g key={`nucleus-${i}`}>
            <circle cx={cell.cx} cy={cell.cy} r={4} fill={cell.color1} opacity="0.5" />
            <circle cx={cell.cx} cy={cell.cy} r={2} fill={cell.color1} opacity="0.9" />
            <circle cx={cell.cx} cy={cell.cy} r={0.8} fill="white" opacity="0.9" />
          </g>
        ))}

        {/* Núcleo central */}
        <circle cx="100" cy="80" r="12" fill={`url(#${core})`} />
        <circle cx="100" cy="80" r="5" fill="white" opacity="0.9" />
      </g>
    </CharacterFrame>
  );
}
