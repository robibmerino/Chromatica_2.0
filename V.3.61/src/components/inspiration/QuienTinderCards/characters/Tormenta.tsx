import { useUniqueSvgIds } from '../useUniqueSvgIds';
import { getCharacterTransform } from '../characterTransform';
import { CharacterFrame } from '../CharacterFrame';
import type { QuienCharacterProps } from '../types';
import { useCreatureAxisPalette, getCreatureMetadata } from '../../archetypeCardComponents/creatures';

/** Paleta base de Tormenta (Refugio: verde protector; Explosivo: naranja al rotar). */
const TORMENTA_PALETTE = {
  line1: '#ff6d00',
  line2: '#ffa040',
  line3: '#ffcc80',
  line4: '#ff3d00',
  line5: '#bf360c',
  line6: '#69f0ae',
  line7: '#00e676',
  line8: '#1de9b6',
  particle1: '#ff6d00',
  particle2: '#69f0ae',
  particle3: '#ffd740',
  particle4: '#1de9b6',
  poleNLight: '#ff6d00',
  poleNOuter: '#bf360c',
  poleSLight: '#69f0ae',
  poleSOuter: '#1b5e20',
  poleNCore: '#ff3d00',
  poleSCore: '#00e676',
  fieldLeft: '#ff6d00',
  fieldRight: '#69f0ae',
} as const;

const CREATURE_ID = 14 as const;

const FIELD_LINES: { d: string; colorKey: keyof typeof TORMENTA_PALETTE }[] = [
  { d: 'M100 80 Q160 140 100 200', colorKey: 'line1' },
  { d: 'M100 80 Q40 140 100 200', colorKey: 'line1' },
  { d: 'M100 80 Q175 130 100 200', colorKey: 'line2' },
  { d: 'M100 80 Q25 130 100 200', colorKey: 'line2' },
  { d: 'M100 80 Q185 110 100 200', colorKey: 'line3' },
  { d: 'M100 80 Q15 110 100 200', colorKey: 'line3' },
  { d: 'M100 80 Q130 140 100 200', colorKey: 'line4' },
  { d: 'M100 80 Q70 140 100 200', colorKey: 'line4' },
  { d: 'M100 80 Q118 140 100 200', colorKey: 'line5' },
  { d: 'M100 80 Q82 140 100 200', colorKey: 'line5' },
  { d: 'M30 140 Q60 110 100 140 Q140 170 170 140', colorKey: 'line6' },
  { d: 'M20 140 Q60 95 100 140 Q140 185 180 140', colorKey: 'line7' },
  { d: 'M25 140 Q60 102 100 140 Q140 178 175 140', colorKey: 'line8' },
];

const PARTICLES: { x: number; y: number; r: number; colorKey: keyof typeof TORMENTA_PALETTE }[] = [
  { x: 55, y: 105, r: 2.5, colorKey: 'particle1' },
  { x: 145, y: 108, r: 2, colorKey: 'particle1' },
  { x: 38, y: 140, r: 3, colorKey: 'particle2' },
  { x: 162, y: 140, r: 3, colorKey: 'particle2' },
  { x: 52, y: 175, r: 2, colorKey: 'particle1' },
  { x: 148, y: 172, r: 2.5, colorKey: 'particle1' },
  { x: 75, y: 95, r: 1.8, colorKey: 'particle3' },
  { x: 125, y: 95, r: 1.8, colorKey: 'particle3' },
  { x: 72, y: 192, r: 1.8, colorKey: 'particle3' },
  { x: 128, y: 190, r: 1.8, colorKey: 'particle3' },
  { x: 30, y: 125, r: 1.5, colorKey: 'particle2' },
  { x: 170, y: 125, r: 1.5, colorKey: 'particle2' },
  { x: 32, y: 155, r: 1.5, colorKey: 'particle4' },
  { x: 168, y: 155, r: 1.5, colorKey: 'particle4' },
];

const CORONA_COUNT = 8;

export function Tormenta({
  className = '',
  hideLabel,
  axisColorParams,
}: QuienCharacterProps) {
  const svgId = useUniqueSvgIds('tormenta');
  const poleN = svgId('pole-n');
  const poleS = svgId('pole-s');
  const field = svgId('field');

  const c = useCreatureAxisPalette(CREATURE_ID, TORMENTA_PALETTE, axisColorParams);
  const meta = getCreatureMetadata(CREATURE_ID);

  return (
    <CharacterFrame
      title={meta?.name ?? 'Tormenta'}
      subtitle={meta?.subtitle ?? 'Refugio'}
      variant={meta?.labelVariant ?? 'amber'}
      className={className}
      hideLabel={hideLabel}
    >
      <defs>
        <radialGradient id={poleN} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="30%" stopColor={c.poleNLight} stopOpacity="0.9" />
          <stop offset="100%" stopColor={c.poleNOuter} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={poleS} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="30%" stopColor={c.poleSLight} stopOpacity="0.9" />
          <stop offset="100%" stopColor={c.poleSOuter} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={field} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={c.fieldLeft} stopOpacity="0.12" />
          <stop offset="50%" stopColor={c.fieldRight} stopOpacity="0.06" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g transform={getCharacterTransform({ translateY: 20 }) ?? undefined}>
        {/* Campo de fondo */}
        <ellipse cx="100" cy="140" rx="90" ry="110" fill={`url(#${field})`} />

        {/* Líneas de campo */}
        {FIELD_LINES.map((l, i) => (
          <g key={i}>
            <path
              d={l.d}
              fill="none"
              stroke={c[l.colorKey]}
              strokeWidth="1.8"
              opacity="0.25"
            />
            <path
              d={l.d}
              fill="none"
              stroke={c[l.colorKey]}
              strokeWidth="0.7"
              opacity="0.7"
            />
          </g>
        ))}

        {/* Partículas */}
        {PARTICLES.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={p.r * 2.5} fill={c[p.colorKey]} opacity="0.12" />
            <circle cx={p.x} cy={p.y} r={p.r} fill={c[p.colorKey]} opacity="0.9" />
            <circle cx={p.x} cy={p.y} r={p.r * 0.4} fill="white" opacity="0.9" />
          </g>
        ))}

        {/* Polo Norte */}
        <ellipse cx="100" cy="80" rx="28" ry="28" fill={`url(#${poleN})`} />
        <ellipse cx="100" cy="80" rx="14" ry="14" fill={c.poleNLight} opacity="0.6" />
        <ellipse cx="100" cy="80" rx="7" ry="7" fill={c.poleNCore} opacity="0.9" />
        <circle cx="100" cy="80" r="3.5" fill="white" opacity="0.95" />
        {Array.from({ length: CORONA_COUNT }, (_, i) => {
          const angle = (i / CORONA_COUNT) * Math.PI * 2;
          const x = 100 + Math.cos(angle) * 20;
          const y = 80 + Math.sin(angle) * 20;
          return <circle key={i} cx={x} cy={y} r="1.5" fill={c.poleNLight} opacity="0.7" />;
        })}

        {/* Polo Sur */}
        <ellipse cx="100" cy="200" rx="28" ry="28" fill={`url(#${poleS})`} />
        <ellipse cx="100" cy="200" rx="14" ry="14" fill={c.poleSLight} opacity="0.6" />
        <ellipse cx="100" cy="200" rx="7" ry="7" fill={c.poleSCore} opacity="0.9" />
        <circle cx="100" cy="200" r="3.5" fill="white" opacity="0.95" />
        {Array.from({ length: CORONA_COUNT }, (_, i) => {
          const angle = (i / CORONA_COUNT) * Math.PI * 2;
          const x = 100 + Math.cos(angle) * 20;
          const y = 200 + Math.sin(angle) * 20;
          return <circle key={i} cx={x} cy={y} r="1.5" fill={c.poleSLight} opacity="0.7" />;
        })}

        {/* Eje central */}
        <line
          x1="100"
          y1="87"
          x2="100"
          y2="193"
          stroke="white"
          strokeWidth="0.5"
          opacity="0.15"
          strokeDasharray="3,4"
        />
      </g>
    </CharacterFrame>
  );
}
