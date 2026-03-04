import { useMemo } from 'react';
import { useUniqueSvgIds } from '../../QuienTinderCards/useUniqueSvgIds';
import { cn } from '../../../../utils/cn';
import { blendHex } from '../../../../utils/colorUtils';
import type { CardComponentProps } from '../types';
import { pointsToPath } from './sharedUtils';
import { CARD_VIEWBOX_W, CARD_VIEWBOX_H } from './constants';

const DEFAULT_LEFT = '#7c3aed';
const DEFAULT_RIGHT = '#06b6d4';

const W = CARD_VIEWBOX_W;
const H = CARD_VIEWBOX_H;
const SCALE = 1.5;
const VIEW_W = W / SCALE;
const VIEW_H = H / SCALE;
const VIEW_X = (W - VIEW_W) / 2;
const VIEW_Y = (H - VIEW_H) / 2;
const CX = W / 2;
const CY = H / 2;
const R_MIN = 12;
const R_MAX = 105;
const DEPTH_BLUR_LIGHT = 1;
const DEPTH_BLUR_MID = 2.5;
const DEPTH_BLUR_HEAVY = 6;

const VORTEX_COLORS = ['#7c3aed', '#8b5cf6', '#6366f1', '#3b82f6', '#06b6d4', '#0891b2'] as const;

/** Genera puntos de un brazo espiral. depthOffset altera el ángulo para capas 3D. */
function buildSpiralArm(
  armIndex: number,
  numArms: number,
  pointsPerArm: number,
  depthOffset: number = 0
): [number, number][] {
  const pts: [number, number][] = [];
  const armOffset = (armIndex / numArms) * Math.PI * 2 + depthOffset;

  for (let i = 0; i <= pointsPerArm; i++) {
    const t = i / pointsPerArm;
    const r = R_MIN + t * (R_MAX - R_MIN);
    const baseAngle = armOffset + t * Math.PI * 3.5;

    const absorptionBend = Math.sin(t * Math.PI * 2) * 0.4 * (1 - t);
    const radialDeform = Math.sin(t * Math.PI * 3) * 3;
    const angle = baseAngle + absorptionBend;
    const rDeformed = Math.max(4, r + radialDeform);

    const x = CX + Math.cos(angle) * rDeformed;
    const y = CY + Math.sin(angle) * rDeformed;

    pts.push([x, y]);
  }
  return pts;
}

/**
 * Vórtice — espirales que emanan del centro deformadas por la absorción.
 * Eje Magnetismo–Equilibrio. Sin flechas.
 */
export function Background8({
  className = '',
  colorLeft = DEFAULT_LEFT,
  colorRight = DEFAULT_RIGHT,
  sliderValue = 0,
}: CardComponentProps) {
  const svgId = useUniqueSvgIds('vortex');
  const t = (sliderValue ?? 0) / 100;
  const axisBlend = blendHex(colorLeft ?? DEFAULT_LEFT, colorRight ?? DEFAULT_RIGHT, t);

  const spiralLayers = useMemo(() => {
    const numArms = 8;
    const pointsPerArm = 24;

    const backLayer = Array.from({ length: numArms }, (_, i) => {
      const pts = buildSpiralArm(i, numArms, pointsPerArm, -0.35);
      const baseColor = VORTEX_COLORS[i % VORTEX_COLORS.length];
      const color = blendHex(baseColor, axisBlend, 0.55);
      return { path: pointsToPath(pts), color, op: 0.045 + (i % 3) * 0.02, strokeW: 5 };
    });

    const midLayer = Array.from({ length: numArms }, (_, i) => {
      const pts = buildSpiralArm(i, numArms, pointsPerArm, 0);
      const baseColor = VORTEX_COLORS[i % VORTEX_COLORS.length];
      const color = blendHex(baseColor, axisBlend, 0.45);
      return { path: pointsToPath(pts), color, op: 0.08 + (i % 4) * 0.03, strokeW: 3 };
    });

    const frontLayer = Array.from({ length: numArms }, (_, i) => {
      const pts = buildSpiralArm(i, numArms, pointsPerArm, 0.28);
      const baseColor = VORTEX_COLORS[(i + 2) % VORTEX_COLORS.length];
      const color = blendHex(baseColor, axisBlend, 0.4);
      return { path: pointsToPath(pts), color, op: 0.12 + (i % 4) * 0.04, strokeW: 2 };
    });

    return { back: backLayer, mid: midLayer, front: frontLayer };
  }, [axisBlend]);

  const particles = useMemo(() => {
    const result: { x: number; y: number; r: number; color: string; op: number }[] = [];
    for (let i = 0; i < 55; i++) {
      const angle = (i / 55) * Math.PI * 2;
      const r = 70 + Math.sin(i * 2.1) * 35 + Math.cos(i * 1.5) * 20;
      const px = CX + Math.cos(angle) * r;
      const py = CY + Math.sin(angle) * r;
      if (px > 4 && px < W - 4 && py > 4 && py < H - 4) {
        const distNorm = r / 105;
        const baseColor = VORTEX_COLORS[i % VORTEX_COLORS.length];
        result.push({
          x: px,
          y: py,
          r: 0.45 + distNorm * 0.6 + Math.sin(i * 1.2) * 0.2,
          color: blendHex(baseColor, axisBlend, 0.45),
          op: 0.25 + distNorm * 0.4 + Math.sin(i * 0.7) * 0.12,
        });
      }
    }
    return result;
  }, [axisBlend]);

  const baseId = svgId('bg');
  const blurLightId = svgId('blur-light');
  const blurMidId = svgId('blur-mid');
  const blurHeavyId = svgId('blur-heavy');
  const depthFogId = svgId('depth-fog');
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
          <stop offset="0%" stopColor="#080b14" />
          <stop offset="100%" stopColor="#060c18" />
        </radialGradient>
        <radialGradient id={depthFogId} cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor="#010306" stopOpacity="0.85" />
          <stop offset="35%" stopColor="#03060c" stopOpacity="0.5" />
          <stop offset="65%" stopColor="#050a12" stopOpacity="0.15" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={centerFadeId} cx="50%" cy="50%" r="65%">
          <stop offset="0%" stopColor="#010306" stopOpacity="0.6" />
          <stop offset="45%" stopColor="#03060c" stopOpacity="0.28" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={edgeLiftId} cx="50%" cy="50%" r="70%">
          <stop offset="60%" stopColor="transparent" stopOpacity="0" />
          <stop offset="85%" stopColor="#0a1428" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#0d1830" stopOpacity="0.4" />
        </radialGradient>
        <filter id={blurLightId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={DEPTH_BLUR_LIGHT} />
        </filter>
        <filter id={blurMidId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={DEPTH_BLUR_MID} />
        </filter>
        <filter id={blurHeavyId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={DEPTH_BLUR_HEAVY} />
        </filter>
      </defs>

      <rect width={W} height={H} fill={`url(#${baseId})`} />

      {/* Capa trasera (lejos, muy difusa para profundidad) */}
      {spiralLayers.back.map((s, i) => (
        <g key={`b${i}`}>
          <path
            d={s.path}
            stroke={s.color}
            strokeWidth={s.strokeW}
            fill="none"
            opacity={s.op * 0.35}
            filter={`url(#${blurHeavyId})`}
          />
          <path
            d={s.path}
            stroke={s.color}
            strokeWidth="0.7"
            fill="none"
            opacity={s.op * 0.55}
            strokeLinecap="round"
            filter={`url(#${blurHeavyId})`}
          />
        </g>
      ))}

      {/* Niebla de profundidad (entre capas: el centro queda "sumergido") */}
      <rect width={W} height={H} fill={`url(#${depthFogId})`} />

      {/* Capa media */}
      {spiralLayers.mid.map((s, i) => (
        <g key={`m${i}`}>
          <path
            d={s.path}
            stroke={s.color}
            strokeWidth={s.strokeW}
            fill="none"
            opacity={s.op * 0.35}
            filter={`url(#${blurMidId})`}
          />
          <path
            d={s.path}
            stroke={s.color}
            strokeWidth="0.9"
            fill="none"
            opacity={s.op * 0.7}
            strokeLinecap="round"
          />
          <path
            d={s.path}
            stroke={s.color}
            strokeWidth="0.35"
            fill="none"
            opacity={s.op * 1}
            strokeLinecap="round"
          />
        </g>
      ))}

      {/* Capa frontal (más cercana) */}
      {spiralLayers.front.map((s, i) => (
        <g key={`f${i}`}>
          <path
            d={s.path}
            stroke={s.color}
            strokeWidth={s.strokeW * 0.5}
            fill="none"
            opacity={s.op * 0.3}
            filter={`url(#${blurLightId})`}
          />
          <path
            d={s.path}
            stroke={s.color}
            strokeWidth="0.5"
            fill="none"
            opacity={s.op * 1.2}
            strokeLinecap="round"
          />
        </g>
      ))}

      {particles.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={p.color} opacity={p.op} />
      ))}

      {/* Núcleo central (pozo de profundidad 3D) */}
      <circle cx={CX} cy={CY} r="14" fill={axisBlend} opacity="0.03" filter={`url(#${blurHeavyId})`} />
      <circle cx={CX} cy={CY} r="10" fill={axisBlend} opacity="0.05" filter={`url(#${blurHeavyId})`} />
      <circle cx={CX} cy={CY} r="6" fill={axisBlend} opacity="0.08" filter={`url(#${blurMidId})`} />
      <circle cx={CX} cy={CY} r="2.5" fill={axisBlend} opacity="0.18" />

      {/* Suavizado radial: menos intensidad hacia el centro, full en los extremos */}
      <rect width={W} height={H} fill={`url(#${centerFadeId})`} />

      {/* Refuerzo de extremos: un poco más visibles en los bordes */}
      <rect width={W} height={H} fill={`url(#${edgeLiftId})`} />
    </svg>
  );
}
