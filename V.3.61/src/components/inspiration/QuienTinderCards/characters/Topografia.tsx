import { useUniqueSvgIds } from '../useUniqueSvgIds';
import { CharacterFrame } from '../CharacterFrame';
import type { QuienCharacterProps } from '../types';
import { useCreatureAxisPalette, getCreatureMetadata } from '../../archetypeCardComponents/creatures';

/** Paleta base de Topografía (Jerarquía: estructurada; Equidad: más balanceada al rotar). */
const TOPOGRAFIA_PALETTE = {
  fill0: '#0a0018',
  stroke0: '#3d0a6e',
  fill1: '#0e0022',
  stroke1: '#5a1a9e',
  fill2: '#120830',
  stroke2: '#7c2fd4',
  fill3: '#160a3a',
  stroke3: '#9b4bf7',
  fill4: '#101050',
  stroke4: '#7b8cf8',
  fill5: '#0c1460',
  stroke5: '#60a5fa',
  fill6: '#081860',
  stroke6: '#38bdf8',
  fill7: '#042060',
  stroke7: '#22d3ee',
  fill8: '#022840',
  stroke8: '#34d399',
  fill9: '#023020',
  stroke9: '#86efac',
  fill10: '#043810',
  stroke10: '#d9f99d',
  fill11: '#203808',
  stroke11: '#fde68a',
  fill12: '#503008',
  stroke12: '#fcd34d',
  fill13: '#802008',
  stroke13: '#fb923c',
  halo: '#3d0a6e',
  coreOuter: '#fb923c',
  coreMid: '#fde68a',
} as const;

const CREATURE_ID = 30 as const;

const CX = 100;
const CY = 160;

function noise(angle: number, freq: number, amp: number): number {
  return (
    amp * Math.sin(freq * angle + 0.5) +
    amp * 0.6 * Math.cos(freq * 1.7 * angle + 1.3) +
    amp * 0.3 * Math.sin(freq * 2.9 * angle + 2.1) +
    amp * 0.15 * Math.cos(freq * 4.3 * angle + 0.8)
  );
}

function contourPath(
  baseR: number,
  level: number,
  cx: number,
  cy: number
): string {
  const pts: string[] = [];
  const steps = 180;
  const noiseAmp = baseR * 0.22;
  const freq = 2 + (level % 4);
  for (let i = 0; i <= steps; i++) {
    const angle = (i / steps) * Math.PI * 2;
    const r =
      baseR +
      noise(angle, freq, noiseAmp) +
      noise(angle + level * 0.5, freq + 2, noiseAmp * 0.4);
    const px = cx + r * Math.cos(angle);
    const py = cy + r * Math.sin(angle);
    pts.push(`${i === 0 ? 'M' : 'L'}${px.toFixed(2)},${py.toFixed(2)}`);
  }
  return pts.join(' ') + 'Z';
}

interface LevelSpec {
  r: number;
  fillKey: keyof typeof TOPOGRAFIA_PALETTE;
  strokeKey: keyof typeof TOPOGRAFIA_PALETTE;
  strokeW: number;
  opacity: number;
}

const LEVELS: LevelSpec[] = [
  { r: 82, fillKey: 'fill0', strokeKey: 'stroke0', strokeW: 0.5, opacity: 0.95 },
  { r: 74, fillKey: 'fill1', strokeKey: 'stroke1', strokeW: 0.6, opacity: 0.9 },
  { r: 66, fillKey: 'fill2', strokeKey: 'stroke2', strokeW: 0.7, opacity: 0.85 },
  { r: 58, fillKey: 'fill3', strokeKey: 'stroke3', strokeW: 0.7, opacity: 0.8 },
  { r: 51, fillKey: 'fill4', strokeKey: 'stroke4', strokeW: 0.8, opacity: 0.75 },
  { r: 44, fillKey: 'fill5', strokeKey: 'stroke5', strokeW: 0.8, opacity: 0.7 },
  { r: 37, fillKey: 'fill6', strokeKey: 'stroke6', strokeW: 0.9, opacity: 0.65 },
  { r: 31, fillKey: 'fill7', strokeKey: 'stroke7', strokeW: 0.9, opacity: 0.6 },
  { r: 25, fillKey: 'fill8', strokeKey: 'stroke8', strokeW: 1.0, opacity: 0.55 },
  { r: 20, fillKey: 'fill9', strokeKey: 'stroke9', strokeW: 1.1, opacity: 0.55 },
  { r: 15, fillKey: 'fill10', strokeKey: 'stroke10', strokeW: 1.2, opacity: 0.6 },
  { r: 10, fillKey: 'fill11', strokeKey: 'stroke11', strokeW: 1.4, opacity: 0.65 },
  { r: 6, fillKey: 'fill12', strokeKey: 'stroke12', strokeW: 1.6, opacity: 0.75 },
  { r: 3, fillKey: 'fill13', strokeKey: 'stroke13', strokeW: 2.0, opacity: 0.9 },
];

export function Topografia({
  className = '',
  hideLabel,
  axisColorParams,
}: QuienCharacterProps) {
  const svgId = useUniqueSvgIds('topografia');
  const glow = svgId('glow');
  const soft = svgId('soft');

  const c = useCreatureAxisPalette(CREATURE_ID, TOPOGRAFIA_PALETTE, axisColorParams);
  const meta = getCreatureMetadata(CREATURE_ID);

  return (
    <CharacterFrame
      title={meta?.name ?? 'Topografía'}
      subtitle={meta?.subtitle ?? 'Jerarquía'}
      variant={meta?.labelVariant ?? 'violet'}
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
        <filter id={soft} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>

      <circle
        cx={CX}
        cy={CY}
        r={88}
        fill={c.halo}
        fillOpacity="0.06"
        filter={`url(#${soft})`}
      />

      {LEVELS.map((l, i) => (
        <path
          key={i}
          d={contourPath(l.r, i, CX, CY)}
          fill={c[l.fillKey]}
          fillOpacity={l.opacity}
          stroke={c[l.strokeKey]}
          strokeWidth={l.strokeW}
          strokeOpacity={0.85}
        />
      ))}

      {LEVELS.slice(9).map((l, i) => (
        <path
          key={`glow-${i}`}
          d={contourPath(l.r, i + 9, CX, CY)}
          fill="none"
          stroke={c[l.strokeKey]}
          strokeWidth={l.strokeW * 1.8}
          strokeOpacity={0.4}
          filter={`url(#${glow})`}
        />
      ))}

      <circle
        cx={CX}
        cy={CY}
        r={14}
        fill={c.coreOuter}
        fillOpacity="0.2"
        filter={`url(#${soft})`}
      />
      <circle
        cx={CX}
        cy={CY}
        r={7}
        fill={c.coreMid}
        fillOpacity="0.5"
        filter={`url(#${glow})`}
      />
      <circle cx={CX} cy={CY} r={3.5} fill="white" fillOpacity="0.85" filter={`url(#${glow})`} />
      <circle cx={CX} cy={CY} r={1.5} fill="white" fillOpacity="1" />

      {LEVELS.filter((_, i) => i % 2 === 0).map((l, i) => {
        const angle = i * 1.4 + 0.3;
        const px = CX + l.r * 0.88 * Math.cos(angle);
        const py = CY + l.r * 0.88 * Math.sin(angle);
        return (
          <circle
            key={i}
            cx={px}
            cy={py}
            r={1.5}
            fill={c[l.strokeKey]}
            fillOpacity="0.9"
            filter={`url(#${glow})`}
          />
        );
      })}
    </CharacterFrame>
  );
}
