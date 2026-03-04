import { useUniqueSvgIds } from '../useUniqueSvgIds';
import { CharacterFrame } from '../CharacterFrame';
import type { QuienCharacterProps } from '../types';
import { useCreatureAxisPalette, getCreatureMetadata } from '../../archetypeCardComponents/creatures';

/** Paleta base de Eclipse (Intersección: ámbar/dorado; Continuo: profundo al rotar). */
const ECLIPSE_PALETTE = {
  cor1: '#fef3c7',
  cor2: '#fbbf24',
  cor3: '#f59e0b',
  cor4: '#d97706',
  cor5: '#92400e',
  moon1: '#1e1b4b',
  moon2: '#0f172a',
  moon3: '#020617',
  out1: '#fef3c7',
  out2: '#f59e0b',
  out3: '#fde68a',
  prom1: '#f59e0b',
  prom2: '#fbbf24',
  prom3: '#fde68a',
  ring1: '#fbbf24',
  ring2: '#f59e0b',
  ring3: '#fde68a',
  ray: '#fde68a',
  lunar: '#1e3a5f',
  border1: '#fbbf24',
  border2: '#fff7ed',
  particle: '#fde68a',
} as const;

const CREATURE_ID = 18 as const;

const CX = 100;
const CY = 160;

const PROMINENCES: {
  startAngle: number;
  endAngle: number;
  r: number;
  colorKey: keyof typeof ECLIPSE_PALETTE;
  opacity: number;
}[] = [
  { startAngle: -80, endAngle: -40, r: 72, colorKey: 'prom1', opacity: 0.7 },
  { startAngle: -50, endAngle: -10, r: 78, colorKey: 'prom2', opacity: 0.6 },
  { startAngle: 20, endAngle: 55, r: 70, colorKey: 'prom3', opacity: 0.65 },
  { startAngle: 60, endAngle: 95, r: 75, colorKey: 'prom1', opacity: 0.55 },
  { startAngle: 130, endAngle: 165, r: 68, colorKey: 'prom2', opacity: 0.6 },
  { startAngle: 175, endAngle: 215, r: 74, colorKey: 'prom3', opacity: 0.5 },
  { startAngle: 230, endAngle: 265, r: 71, colorKey: 'prom1', opacity: 0.65 },
  { startAngle: 280, endAngle: 315, r: 76, colorKey: 'prom2', opacity: 0.55 },
];

const RINGS: { r: number; colorKey: keyof typeof ECLIPSE_PALETTE; w: number; opacity: number }[] = [
  { r: 65, colorKey: 'ring1', w: 8, opacity: 0.35 },
  { r: 58, colorKey: 'ring2', w: 5, opacity: 0.45 },
  { r: 52, colorKey: 'ring3', w: 3, opacity: 0.5 },
  { r: 47, colorKey: 'ring1', w: 2, opacity: 0.6 },
];

const LUNAR_DETAILS: { cx: number; cy: number; r: number; opacity: number }[] = [
  { cx: 88, cy: 150, r: 6, opacity: 0.15 },
  { cx: 112, cy: 165, r: 8, opacity: 0.12 },
  { cx: 95, cy: 172, r: 4, opacity: 0.1 },
  { cx: 108, cy: 148, r: 5, opacity: 0.13 },
  { cx: 82, cy: 168, r: 5, opacity: 0.1 },
];

export function Eclipse({
  className = '',
  hideLabel,
  axisColorParams,
}: QuienCharacterProps) {
  const svgId = useUniqueSvgIds('eclipse');
  const corona = svgId('corona');
  const moon = svgId('moon');
  const outer = svgId('outer');

  const c = useCreatureAxisPalette(CREATURE_ID, ECLIPSE_PALETTE, axisColorParams);
  const meta = getCreatureMetadata(CREATURE_ID);

  return (
    <CharacterFrame
      title={meta?.name ?? 'Eclipse'}
      subtitle={meta?.subtitle ?? 'Intersección'}
      variant={meta?.labelVariant ?? 'amber'}
      className={className}
      hideLabel={hideLabel}
    >
      <defs>
        <radialGradient id={corona} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={c.cor1} stopOpacity="0" />
          <stop offset="60%" stopColor={c.cor2} stopOpacity="0.25" />
          <stop offset="80%" stopColor={c.cor3} stopOpacity="0.4" />
          <stop offset="90%" stopColor={c.cor4} stopOpacity="0.6" />
          <stop offset="100%" stopColor={c.cor5} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={moon} cx="42%" cy="38%" r="55%">
          <stop offset="0%" stopColor={c.moon1} stopOpacity="1" />
          <stop offset="70%" stopColor={c.moon2} stopOpacity="1" />
          <stop offset="100%" stopColor={c.moon3} stopOpacity="1" />
        </radialGradient>
        <radialGradient id={outer} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={c.out1} stopOpacity="0" />
          <stop offset="85%" stopColor={c.out2} stopOpacity="0.1" />
          <stop offset="100%" stopColor={c.out3} stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Halo exterior difuso */}
      <ellipse cx={CX} cy={CY} rx="100" ry="120" fill={`url(#${outer})`} />

      {/* Prominencias solares */}
      {PROMINENCES.map((p, i) => {
        const s = (p.startAngle * Math.PI) / 180;
        const e = (p.endAngle * Math.PI) / 180;
        const mid = (s + e) / 2;
        const bulge = p.r + 20 + (i % 3) * 8;
        const x1 = CX + p.r * Math.cos(s);
        const y1 = CY + p.r * Math.sin(s);
        const x2 = CX + p.r * Math.cos(e);
        const y2 = CY + p.r * Math.sin(e);
        const ctrlX = CX + bulge * Math.cos(mid);
        const ctrlY = CY + bulge * Math.sin(mid);
        return (
          <path
            key={i}
            d={`M ${x1} ${y1} Q ${ctrlX} ${ctrlY} ${x2} ${y2}`}
            fill="none"
            stroke={c[p.colorKey]}
            strokeWidth={2.5 + (i % 3) * 0.8}
            opacity={p.opacity}
            strokeLinecap="round"
          />
        );
      })}

      {/* Anillos de corona */}
      {RINGS.map((ring, i) => (
        <circle
          key={i}
          cx={CX}
          cy={CY}
          r={ring.r}
          fill="none"
          stroke={c[ring.colorKey]}
          strokeWidth={ring.w}
          opacity={ring.opacity}
        />
      ))}

      {/* Rayos solares radiales */}
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i / 24) * Math.PI * 2;
        const r1 = 66 + (i % 4) * 3;
        const r2 = 85 + (i % 5) * 6;
        return (
          <line
            key={i}
            x1={CX + r1 * Math.cos(angle)}
            y1={CY + r1 * Math.sin(angle)}
            x2={CX + r2 * Math.cos(angle)}
            y2={CY + r2 * Math.sin(angle)}
            stroke={c.ray}
            strokeWidth={0.8 + (i % 3) * 0.4}
            opacity={0.3 + (i % 4) * 0.1}
          />
        );
      })}

      {/* Corona principal */}
      <circle cx={CX} cy={CY} r={65} fill={`url(#${corona})`} />

      {/* Disco lunar oscuro */}
      <circle cx={CX} cy={CY} r={44} fill={`url(#${moon})`} />

      {/* Detalles superficie lunar */}
      {LUNAR_DETAILS.map((d, i) => (
        <circle
          key={i}
          cx={d.cx}
          cy={d.cy}
          r={d.r}
          fill={c.lunar}
          opacity={d.opacity}
        />
      ))}

      {/* Borde iluminado del eclipse */}
      <circle
        cx={CX}
        cy={CY}
        r={44}
        fill="none"
        stroke={c.border1}
        strokeWidth="2.5"
        opacity="0.8"
      />
      <circle
        cx={CX}
        cy={CY}
        r={44}
        fill="none"
        stroke={c.border2}
        strokeWidth="1"
        opacity="0.5"
      />

      {/* Partículas de la corona */}
      {Array.from({ length: 20 }).map((_, i) => {
        const angle = (i / 20) * Math.PI * 2;
        const r = 72 + (i % 4) * 10;
        return (
          <circle
            key={i}
            cx={CX + r * Math.cos(angle)}
            cy={CY + r * Math.sin(angle)}
            r={1 + (i % 3) * 0.5}
            fill={c.particle}
            opacity={0.3 + (i % 4) * 0.15}
          />
        );
      })}
    </CharacterFrame>
  );
}
