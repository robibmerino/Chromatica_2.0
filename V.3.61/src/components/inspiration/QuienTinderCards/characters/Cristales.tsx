import { useUniqueSvgIds } from '../useUniqueSvgIds';
import { CharacterFrame } from '../CharacterFrame';
import type { QuienCharacterProps } from '../types';
import { useCreatureAxisPalette, getCreatureMetadata } from '../../archetypeCardComponents/creatures';

/** Paleta base de Cristales (Ritmo: estructurado; Creatividad: más vibrante al rotar). */
const CRISTALES_PALETTE = {
  thin0: '#ff6b9d',
  thin1: '#ff9a6b',
  thin2: '#ffde59',
  thin3: '#a8ff6b',
  thin4: '#59ffd8',
  thin5: '#59b8ff',
  thin6: '#9d6bff',
  thin7: '#ff6bff',
  thin8: '#ff6b6b',
  thin9: '#6bffb8',
  thick0: '#c850a0',
  thick1: '#c87850',
  thick2: '#c8a030',
  thick3: '#80c850',
  thick4: '#30c8a0',
  thick5: '#3090c8',
  thick6: '#7830c8',
  thick7: '#c830c8',
  thick8: '#c83030',
  thick9: '#30c880',
  arc: '#ffffff',
} as const;

const CREATURE_ID = 27 as const;

const CX = 100;
const CY = 150;

const THIN_KEYS: (keyof typeof CRISTALES_PALETTE)[] = ['thin0', 'thin1', 'thin2', 'thin3', 'thin4', 'thin5', 'thin6', 'thin7', 'thin8', 'thin9'];
const THICK_KEYS: (keyof typeof CRISTALES_PALETTE)[] = ['thick0', 'thick1', 'thick2', 'thick3', 'thick4', 'thick5', 'thick6', 'thick7', 'thick8', 'thick9'];

const INNER_ANGLES = { thin: 36, thick: 72 };

const degToRad = (d: number) => (d * Math.PI) / 180;

interface Rhombus {
  x: number;
  y: number;
  angle: number;
  size: number;
  type: 'thin' | 'thick';
}

function computeRhombuses(): Rhombus[] {
  const rhombuses: Rhombus[] = [];
  const baseSize = 28;

  for (let i = 0; i < 10; i++) {
    const angle = i * 36;
    const r = 90;
    rhombuses.push({
      x: CX + r * Math.cos(degToRad(angle)),
      y: CY + r * Math.sin(degToRad(angle)) * 0.9,
      angle,
      size: baseSize,
      type: i % 2 === 0 ? 'thin' : 'thick',
    });
  }
  for (let i = 0; i < 10; i++) {
    const angle = i * 36 + 18;
    const r = 58;
    rhombuses.push({
      x: CX + r * Math.cos(degToRad(angle)),
      y: CY + r * Math.sin(degToRad(angle)) * 0.9,
      angle: angle + 54,
      size: baseSize * 0.85,
      type: i % 2 === 0 ? 'thick' : 'thin',
    });
  }
  for (let i = 0; i < 5; i++) {
    const angle = i * 72;
    const r = 28;
    rhombuses.push({
      x: CX + r * Math.cos(degToRad(angle)),
      y: CY + r * Math.sin(degToRad(angle)) * 0.9,
      angle: angle + 36,
      size: baseSize * 0.7,
      type: 'thick',
    });
  }
  for (let i = 0; i < 5; i++) {
    const angle = i * 72 + 36;
    const r = 20;
    rhombuses.push({
      x: CX + r * Math.cos(degToRad(angle)),
      y: CY + r * Math.sin(degToRad(angle)) * 0.9,
      angle,
      size: baseSize * 0.65,
      type: 'thin',
    });
  }
  return rhombuses;
}

const RHOMBUSES = computeRhombuses();

function rhombusPath(r: Rhombus): string {
  const halfAngle = degToRad(r.type === 'thin' ? INNER_ANGLES.thin : INNER_ANGLES.thick) / 2;
  const rad = degToRad(r.angle);
  const len = r.size;
  const shortDiag = len * Math.sin(halfAngle);
  const longDiag = len * Math.cos(halfAngle);
  const points = [
    [r.x + longDiag * Math.cos(rad), r.y + longDiag * Math.sin(rad) * 0.9],
    [r.x + shortDiag * Math.cos(rad + Math.PI / 2), r.y + shortDiag * Math.sin(rad + Math.PI / 2) * 0.9],
    [r.x - longDiag * Math.cos(rad), r.y - longDiag * Math.sin(rad) * 0.9],
    [r.x - shortDiag * Math.cos(rad + Math.PI / 2), r.y - shortDiag * Math.sin(rad + Math.PI / 2) * 0.9],
  ];
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(' ') + 'Z';
}

const GOLDEN_RATIO = (1 + Math.sqrt(5)) / 2;

export function Cristales({
  className = '',
  hideLabel,
  axisColorParams,
}: QuienCharacterProps) {
  const svgId = useUniqueSvgIds('cristales');
  const glow = svgId('glow');
  const glowSoft = svgId('glow-soft');

  const c = useCreatureAxisPalette(CREATURE_ID, CRISTALES_PALETTE, axisColorParams);
  const meta = getCreatureMetadata(CREATURE_ID);

  return (
    <CharacterFrame
      title={meta?.name ?? 'Cristales'}
      subtitle={meta?.subtitle ?? 'Ritmo'}
      variant={meta?.labelVariant ?? 'amber'}
      className={className}
      hideLabel={hideLabel}
    >
      <defs>
        <filter id={glow} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id={glowSoft} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Teselado de Penrose — sin elipse limitante */}
      {RHOMBUSES.map((r, i) => {
        const colorKey = r.type === 'thin' ? THIN_KEYS[i % 10] : THICK_KEYS[i % 10];
        const color = c[colorKey];
        const distFromCenter = Math.sqrt((r.x - CX) ** 2 + (r.y - CY) ** 2);
        const brightness = 1 - distFromCenter / 130;
        return (
          <g key={i}>
            <path
              d={rhombusPath(r)}
              fill={color}
              fillOpacity={0.12 + brightness * 0.15}
              stroke={color}
              strokeWidth="0.6"
              strokeOpacity={0.5 + brightness * 0.3}
            />
            <path
              d={`M${r.x.toFixed(1)},${(r.y - 2).toFixed(1)} L${r.x.toFixed(1)},${(r.y + 2).toFixed(1)}`}
              stroke={color}
              strokeWidth="0.3"
              strokeOpacity="0.3"
            />
          </g>
        );
      })}

      {RHOMBUSES.slice(0, 15).map((r, i) => {
        const colorKey = r.type === 'thin' ? THIN_KEYS[i % 10] : THICK_KEYS[i % 10];
        return (
          <circle
            key={i}
            cx={r.x}
            cy={r.y}
            r={1}
            fill={c[colorKey]}
            opacity="0.6"
            filter={`url(#${glow})`}
          />
        );
      })}

      <circle
        cx={CX}
        cy={CY}
        r={15}
        fill="none"
        stroke="white"
        strokeWidth="0.4"
        strokeOpacity="0.2"
        strokeDasharray="2 3"
      />
      <circle cx={CX} cy={CY} r={8} fill="white" opacity="0.1" filter={`url(#${glowSoft})`} />
      <circle cx={CX} cy={CY} r={3} fill="white" opacity="0.7" filter={`url(#${glow})`} />
      <circle cx={CX} cy={CY} r={1.5} fill="white" opacity="1" />

      <path
        d={`M${CX + 110 * Math.cos(GOLDEN_RATIO)},${CY + 110 * Math.sin(GOLDEN_RATIO) * 0.9} A110,99 0 0,1 ${CX + 110 * Math.cos(GOLDEN_RATIO + 0.5)},${CY + 110 * Math.sin(GOLDEN_RATIO + 0.5) * 0.9}`}
        fill="none"
        stroke={c.arc}
        strokeWidth="0.4"
        strokeOpacity="0.15"
      />
    </CharacterFrame>
  );
}
