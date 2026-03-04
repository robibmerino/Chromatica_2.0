import { useUniqueSvgIds } from '../useUniqueSvgIds';
import { getCharacterTransform } from '../characterTransform';
import { CharacterFrame } from '../CharacterFrame';
import type { QuienCharacterProps } from '../types';
import { useCreatureAxisPalette, getCreatureMetadata } from '../../archetypeCardComponents/creatures';

/** Paleta base de Vórtice (Flujo: azul fluido; Singularidad: violeta al rotar). */
const VORTICE_PALETTE = {
  vec0: '#34d399',
  vec1: '#60a5fa',
  vec2: '#a78bfa',
  vec3: '#f472b6',
  bgInner: '#1e3a5f',
  bgOuter: '#0f172a',
  coreLight: '#7dd3fc',
  coreMid: '#3b82f6',
  coreOuter: '#1d4ed8',
  ring: '#60a5fa',
} as const;

const CREATURE_ID = 20 as const;

const CX = 100;
const CY = 160;

const RING_RADII = [25, 45, 65, 85];

const QUAD_COLOR_KEYS: (keyof typeof VORTICE_PALETTE)[] = ['vec0', 'vec1', 'vec2', 'vec3'];

function getQuadrantColorKey(dx: number, dy: number): keyof typeof VORTICE_PALETTE {
  const hue = ((Math.atan2(dy, dx) * 180) / Math.PI + 360) % 360;
  const idx = hue < 90 ? 0 : hue < 180 ? 1 : hue < 270 ? 2 : 3;
  return QUAD_COLOR_KEYS[idx];
}

function computeVectorField(): {
  x: number;
  y: number;
  x2: number;
  y2: number;
  colorKey: keyof typeof VORTICE_PALETTE;
  opacity: number;
  magnitude: number;
}[] {
  const vectors: {
    x: number;
    y: number;
    x2: number;
    y2: number;
    colorKey: keyof typeof VORTICE_PALETTE;
    opacity: number;
    magnitude: number;
  }[] = [];
  const cols = 10;
  const rows = 13;
  const spacingX = 18;
  const spacingY = 16;
  const startX = 10;
  const startY = 76;

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = startX + col * spacingX;
      const y = startY + row * spacingY;
      const dx = x - CX;
      const dy = y - CY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      const angle = Math.atan2(dy, dx) + Math.PI / 2 + Math.sin(dist * 0.04) * 1.2;
      const magnitude = Math.min(8, 120 / (dist + 8));

      const x2 = x + magnitude * Math.cos(angle);
      const y2 = y + magnitude * Math.sin(angle);

      const opacity = 0.3 + (1 - Math.min(1, dist / 100)) * 0.6;
      const colorKey = getQuadrantColorKey(dx, dy);

      vectors.push({ x, y, x2, y2, colorKey, opacity, magnitude });
    }
  }
  return vectors;
}

function computeStreamlines(): { points: string; colorKey: keyof typeof VORTICE_PALETTE }[] {
  const lines: { points: string; colorKey: keyof typeof VORTICE_PALETTE }[] = [];
  for (let i = 0; i < 8; i++) {
    const startAngle = (i / 8) * Math.PI * 2;
    const startR = 55;
    let x = CX + startR * Math.cos(startAngle);
    let y = CY + startR * Math.sin(startAngle);
    const points: string[] = [`${x.toFixed(1)},${y.toFixed(1)}`];
    for (let step = 0; step < 12; step++) {
      const dx = x - CX;
      const dy = y - CY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx) + Math.PI / 2 + Math.sin(dist * 0.04) * 1.2;
      x += 5 * Math.cos(angle);
      y += 5 * Math.sin(angle);
      points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    lines.push({
      points: points.join(' '),
      colorKey: QUAD_COLOR_KEYS[i % 4],
    });
  }
  return lines;
}

const VECTORS = computeVectorField();
const STREAMLINES = computeStreamlines();

export function Vortice({
  className = '',
  hideLabel,
  axisColorParams,
}: QuienCharacterProps) {
  const svgId = useUniqueSvgIds('vortice');
  const bg = svgId('bg');
  const core = svgId('core');

  const c = useCreatureAxisPalette(CREATURE_ID, VORTICE_PALETTE, axisColorParams);
  const meta = getCreatureMetadata(CREATURE_ID);

  return (
    <CharacterFrame
      title={meta?.name ?? 'Vórtice'}
      subtitle={meta?.subtitle ?? 'Flujo'}
      variant={meta?.labelVariant ?? 'cyan'}
      className={className}
      hideLabel={hideLabel}
    >
      <defs>
        <radialGradient id={bg} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={c.bgInner} stopOpacity="0.3" />
          <stop offset="100%" stopColor={c.bgOuter} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={core} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="35%" stopColor={c.coreLight} stopOpacity="0.9" />
          <stop offset="70%" stopColor={c.coreMid} stopOpacity="0.5" />
          <stop offset="100%" stopColor={c.coreOuter} stopOpacity="0" />
        </radialGradient>
      </defs>

      <g transform={getCharacterTransform({ scale: 1.3, centerX: CX, centerY: CY }) ?? undefined}>
      <ellipse cx={CX} cy={CY} rx="100" ry="130" fill={`url(#${bg})`} />

      {/* Campo de vectores */}
      {VECTORS.map((v, i) => {
        const arrowLen = v.magnitude * 0.4;
        const arrowAngle = Math.atan2(v.y2 - v.y, v.x2 - v.x);
        const ax1 = v.x2 - arrowLen * Math.cos(arrowAngle - 0.5);
        const ay1 = v.y2 - arrowLen * Math.sin(arrowAngle - 0.5);
        const ax2 = v.x2 - arrowLen * Math.cos(arrowAngle + 0.5);
        const ay2 = v.y2 - arrowLen * Math.sin(arrowAngle + 0.5);
        const color = c[v.colorKey];
        return (
          <g key={i} opacity={v.opacity}>
            <line
              x1={v.x}
              y1={v.y}
              x2={v.x2}
              y2={v.y2}
              stroke={color}
              strokeWidth={0.6 + v.magnitude * 0.08}
              strokeLinecap="round"
            />
            <polyline
              points={`${ax1},${ay1} ${v.x2},${v.y2} ${ax2},${ay2}`}
              fill="none"
              stroke={color}
              strokeWidth={0.5}
              strokeLinejoin="round"
            />
          </g>
        );
      })}

      {/* Líneas de flujo — streamlines */}
      {STREAMLINES.map((sl, i) => (
        <polyline
          key={i}
          points={sl.points}
          fill="none"
          stroke={c[sl.colorKey]}
          strokeWidth={0.8}
          opacity={0.35}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}

      {/* Anillos de referencia */}
      {RING_RADII.map((r, i) => (
        <circle
          key={i}
          cx={CX}
          cy={CY}
          r={r}
          fill="none"
          stroke={c.ring}
          strokeWidth={0.4}
          opacity={0.12 - i * 0.02}
          strokeDasharray="3 6"
        />
      ))}

      {/* Núcleo central */}
      <circle cx={CX} cy={CY} r={18} fill={`url(#${core})`} />
      <circle cx={CX} cy={CY} r={9} fill="white" opacity="0.7" />
      <circle cx={CX} cy={CY} r={4.5} fill="white" opacity="0.95" />
      <circle cx={CX - 2} cy={CY - 2} r={1.8} fill="white" opacity="1" />

      {/* Nodos en los extremos del campo */}
      {Array.from({ length: 12 }).map((_, i) => {
        const colorKey = QUAD_COLOR_KEYS[i % 4];
        const angle = (i / 12) * Math.PI * 2;
        const r = 88;
        return (
          <circle
            key={i}
            cx={CX + r * Math.cos(angle)}
            cy={CY + r * Math.sin(angle)}
            r={1.2}
            fill={c[colorKey]}
            opacity={0.5}
          />
        );
      })}
      </g>
    </CharacterFrame>
  );
}
