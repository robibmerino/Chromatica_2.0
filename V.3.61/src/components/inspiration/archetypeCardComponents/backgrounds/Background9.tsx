import { useMemo } from 'react';
import { useUniqueSvgIds } from '../../QuienTinderCards/useUniqueSvgIds';
import { cn } from '../../../../utils/cn';
import { blendHex } from '../../../../utils/colorUtils';
import type { CardComponentProps } from '../types';
import { pointsToPath } from './sharedUtils';
import { CARD_VIEWBOX_W, CARD_VIEWBOX_H } from './constants';

const DEFAULT_LEFT = '#047857';
const DEFAULT_RIGHT = '#d97706';

const W = CARD_VIEWBOX_W;
const H = CARD_VIEWBOX_H;
const SCALE = 1.4;
const VIEW_W = W / SCALE;
const VIEW_H = H / SCALE;
const VIEW_X = (W - VIEW_W) / 2;
const VIEW_Y = (H - VIEW_H) / 2;
const CX = W / 2;
const CY = H / 2;

const GERMINATION_COLORS = ['#059669', '#10b981', '#34d399', '#6ee7b7', '#a78bfa', '#f59e0b'] as const;

/** Genera puntos de un tendril orgánico que crece desde el centro. */
function buildTendril(
  angleOffset: number,
  numPoints: number,
  curveAmount: number,
  spread: number
): [number, number][] {
  const pts: [number, number][] = [];
  const baseAngle = angleOffset;

  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    const r = 8 + t * (95 - 8);
    const branchAngle = baseAngle + Math.sin(t * Math.PI * 2.5) * curveAmount;
    const wobble = Math.sin(t * Math.PI * 4) * spread;
    const rFinal = Math.max(4, r + wobble);

    const x = CX + Math.cos(branchAngle) * rFinal;
    const y = CY + Math.sin(branchAngle) * rFinal;

    pts.push([x, y]);
  }
  return pts;
}

/**
 * Germinación — tendriles orgánicos que brotan del centro.
 * Eje Latencia–Despliegue. Sensible al slider.
 */
export function Background9({
  className = '',
  colorLeft = DEFAULT_LEFT,
  colorRight = DEFAULT_RIGHT,
  sliderValue = 0,
}: CardComponentProps) {
  const svgId = useUniqueSvgIds('germination');
  const t = (sliderValue ?? 0) / 100;
  const axisBlend = blendHex(colorLeft ?? DEFAULT_LEFT, colorRight ?? DEFAULT_RIGHT, t);

  const tendrils = useMemo(() => {
    const numTendrils = 12;
    const pointsPerTendril = 20;

    return Array.from({ length: numTendrils }, (_, i) => {
      const angleOffset = (i / numTendrils) * Math.PI * 2;
      const curveAmount = 0.6 + (i % 3) * 0.2;
      const spread = 4 + (i % 4) * 2;
      const pts = buildTendril(angleOffset, pointsPerTendril, curveAmount, spread);
      const baseColor = GERMINATION_COLORS[i % GERMINATION_COLORS.length];
      const color = blendHex(baseColor, axisBlend, 0.65 + (i % 3) * 0.06);
      const op = 0.06 + (i % 4) * 0.025;
      return { path: pointsToPath(pts), color, op };
    });
  }, [axisBlend]);

  const spores = useMemo(() => {
    const result: { x: number; y: number; r: number; color: string; op: number }[] = [];
    for (let i = 0; i < 48; i++) {
      const angle = (i / 48) * Math.PI * 2 + Math.sin(i * 0.5) * 0.3;
      const r = 25 + Math.sin(i * 1.7) * 40 + Math.cos(i * 1.1) * 25;
      const px = CX + Math.cos(angle) * r;
      const py = CY + Math.sin(angle) * r;
      if (px > 6 && px < W - 6 && py > 6 && py < H - 6) {
        const distNorm = r / 100;
        const baseColor = GERMINATION_COLORS[i % GERMINATION_COLORS.length];
        result.push({
          x: px,
          y: py,
          r: 0.35 + distNorm * 0.45 + Math.sin(i * 1.3) * 0.15,
          color: blendHex(baseColor, axisBlend, 0.6 + (i % 5) * 0.05),
          op: 0.18 + distNorm * 0.28 + Math.sin(i * 0.8) * 0.08,
        });
      }
    }
    return result;
  }, [axisBlend]);

  const baseId = svgId('bg');
  const blurId = svgId('blur');
  const centerFadeId = svgId('center-fade');
  const edgeLiftId = svgId('edge-lift');

  return (
    <svg
      viewBox={`${VIEW_X} ${VIEW_Y} ${VIEW_W} ${VIEW_H}`}
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      className={cn('absolute inset-0', className)}
    >
      <defs>
        <radialGradient id={baseId} cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#051510" />
          <stop offset="100%" stopColor="#071814" />
        </radialGradient>
        <filter id={blurId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.5" />
        </filter>
        <radialGradient id={centerFadeId} cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#020a06" stopOpacity="0.5" />
          <stop offset="45%" stopColor="#041008" stopOpacity="0.2" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={edgeLiftId} cx="50%" cy="50%" r="70%">
          <stop offset="55%" stopColor="transparent" stopOpacity="0" />
          <stop offset="85%" stopColor="#0a1c12" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#0d2218" stopOpacity="0.35" />
        </radialGradient>
      </defs>

      <rect width={W} height={H} fill={`url(#${baseId})`} />

      {/* Tendriles traseros (más difusos) */}
      {tendrils.slice(0, 6).map((s, i) => (
        <path
          key={`b${i}`}
          d={s.path}
          stroke={s.color}
          strokeWidth="2.5"
          fill="none"
          opacity={s.op * 0.5}
          filter={`url(#${blurId})`}
          strokeLinecap="round"
        />
      ))}

      {/* Tendriles principales */}
      {tendrils.map((s, i) => (
        <path
          key={i}
          d={s.path}
          stroke={s.color}
          strokeWidth="1.2"
          fill="none"
          opacity={s.op}
          strokeLinecap="round"
        />
      ))}

      {/* Esporas */}
      {spores.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={p.color} opacity={p.op} />
      ))}

      {/* Núcleo (semilla) */}
      <circle cx={CX} cy={CY} r="6" fill={axisBlend} opacity="0.04" filter={`url(#${blurId})`} />
      <circle cx={CX} cy={CY} r="3" fill={axisBlend} opacity="0.1" />

      {/* Suavizado radial: menos intensidad al centro, más en extremos */}
      <rect width={W} height={H} fill={`url(#${centerFadeId})`} />

      {/* Refuerzo de extremos */}
      <rect width={W} height={H} fill={`url(#${edgeLiftId})`} />
    </svg>
  );
}
