import { useMemo } from 'react';
import { useUniqueSvgIds } from '../../QuienTinderCards/useUniqueSvgIds';
import { cn } from '../../../../utils/cn';
import { blendHex } from '../../../../utils/colorUtils';
import type { CardComponentProps } from '../types';
import { CARD_VIEWBOX_W, CARD_VIEWBOX_H } from './constants';

const DEFAULT_LEFT = '#8b5cf6';
const DEFAULT_RIGHT = '#f59e0b';

const W = CARD_VIEWBOX_W;
const H = CARD_VIEWBOX_H;

/** Plantillas de cristales pequeños (puntos relativos, se escalan y trasladan). */
const CRYSTAL_TEMPLATES: { pts: number[]; scale: number }[] = [
  { pts: [0, 0, 4, 0, 6, 5, 3, 8, 0, 4], scale: 1 },
  { pts: [0, 0, 5, 1, 4, 6, 1, 5, 0, 0], scale: 0.9 },
  { pts: [0, 2, 3, 0, 6, 3, 4, 7, 0, 5], scale: 1.1 },
  { pts: [0, 0, 6, 2, 5, 6, 2, 7, 0, 4], scale: 0.85 },
  { pts: [1, 0, 5, 0, 7, 4, 4, 8, 0, 4], scale: 1 },
  { pts: [0, 1, 4, 0, 6, 4, 3, 7, 0, 5], scale: 0.95 },
];

/** Plantillas de micro-cristales (más pequeños, más diversos). */
const MICRO_CRYSTAL_TEMPLATES: { pts: number[]; baseScale: number }[] = [
  { pts: [0, 0, 2, 0, 3, 2, 1, 3, 0, 1], baseScale: 0.5 },
  { pts: [0, 0, 3, 1, 2, 3, 0, 2], baseScale: 0.45 },
  { pts: [0, 1, 2, 0, 4, 2, 2, 4, 0, 3], baseScale: 0.55 },
  { pts: [0, 0, 2, 0, 3, 3, 0, 2], baseScale: 0.4 },
  { pts: [1, 0, 3, 1, 2, 4, 0, 3], baseScale: 0.5 },
  { pts: [0, 0, 4, 1, 3, 4, 1, 3], baseScale: 0.48 },
  { pts: [0, 1, 3, 0, 4, 2, 1, 4], baseScale: 0.42 },
  { pts: [0, 0, 2, 1, 2, 3, 0, 2], baseScale: 0.46 },
  { pts: [0, 0, 2, 2, 1, 4], baseScale: 0.38 },
  { pts: [0, 1, 3, 0, 3, 3], baseScale: 0.52 },
];

/** Núcleos para distribución orgánica (clusters con posición y radio de influencia). */
const ORGANIC_NUCLEI: { x: number; y: number; radius: number }[] = [
  { x: 12, y: 25, radius: 35 }, { x: 55, y: 40, radius: 45 }, { x: 140, y: 30, radius: 40 },
  { x: 185, y: 55, radius: 38 }, { x: 25, y: 120, radius: 50 }, { x: 100, y: 90, radius: 55 },
  { x: 170, y: 110, radius: 48 }, { x: 45, y: 200, radius: 42 }, { x: 115, y: 185, radius: 52 },
  { x: 175, y: 210, radius: 44 }, { x: 15, y: 295, radius: 36 }, { x: 95, y: 270, radius: 46 },
  { x: 160, y: 285, radius: 40 }, { x: 100, y: 155, radius: 35 },
];

/** Paleta de colores diversa para cristales principales. */
const CRYSTAL_PALETTE = [
  '#7c3aed', '#a855f7', '#8b5cf6', '#c084fc',
  '#0ea5e9', '#38bdf8', '#7dd3fc', '#06b6d4',
  '#10b981', '#34d399', '#6ee7b7', '#14b8a6',
  '#f59e0b', '#fbbf24', '#fde68a', '#f97316',
  '#ec4899', '#f472b6', '#e879f9', '#c4b5fd',
] as const;

/** Paleta suave para micro-cristales (menor saturación, más variada). */
const MICRO_PALETTE = [
  '#a78bfa', '#93c5fd', '#86efac', '#fcd34d',
  '#f9a8d4', '#c4b5fd', '#67e8f9', '#bbf7d0',
  '#fde047', '#e9d5ff', '#bae6fd', '#d1fae5',
  '#fed7aa', '#e0e7ff', '#ddd6fe', '#bfdbfe',
  '#a7f3d0', '#fef3c7', '#fce7f3', '#e0f2fe',
] as const;

type Crystal = { pts: string; color: string; op: number; strokeOp: number };

function generateCrystals(colorLeft: string, colorRight: string, t: number): Crystal[] {
  const axisBlend = blendHex(colorLeft, colorRight, t);
  const crystals: Crystal[] = [];

  /** Cristales principales en esquinas */
  const corners: [number, number, number, number][] = [
    [0, 0, 1, 1],
    [W, 0, -1, 1],
    [0, H, 1, -1],
    [W, H, -1, -1],
  ];

  corners.forEach(([cx, cy, dx, dy], cornerIdx) => {
    const cornerColors = [
      CRYSTAL_PALETTE.slice(0, 5),
      CRYSTAL_PALETTE.slice(5, 10),
      CRYSTAL_PALETTE.slice(10, 15),
      CRYSTAL_PALETTE.slice(15, 20),
    ][cornerIdx];

    for (let i = 0; i < 18; i++) {
      const tmpl = CRYSTAL_TEMPLATES[i % CRYSTAL_TEMPLATES.length];
      const s = tmpl.scale * (2.2 + (i % 5) * 0.5);
      const ox = cx + dx * (8 + (i * 7) % 55 + (i * 3) % 12);
      const oy = cy + dy * (8 + (i * 11) % 70 + (i * 5) % 15);

      const pts: number[] = [];
      for (let j = 0; j < tmpl.pts.length; j += 2) {
        pts.push(ox + tmpl.pts[j] * s, oy + tmpl.pts[j + 1] * s);
      }

      const baseColor = cornerColors[i % cornerColors.length];
      const color = blendHex(baseColor, axisBlend, 0.25);
      const op = 0.06 + (i % 4) * 0.035;
      const strokeOp = op * 2.5 + 0.15;
      crystals.push({ pts: pts.join(','), color, op, strokeOp });
    }
  });

  /** Micro-cristales: muchos más, distribución orgánica, mayor variedad de tamaño, más color cerca de bordes */
  const MICRO_COUNT = 500;
  const maxDistFromEdge = Math.min(W, H) * 0.4;

  const MICRO_SCALE = 3.0;
  for (let i = 0; i < MICRO_COUNT; i++) {
    const tmpl = MICRO_CRYSTAL_TEMPLATES[i % MICRO_CRYSTAL_TEMPLATES.length];
    const s = MICRO_SCALE;

    const nuc = ORGANIC_NUCLEI[i % ORGANIC_NUCLEI.length];
    const jitterX = ((i * 41 + 7) % 101) - 50;
    const jitterY = ((i * 59 + 11) % 97) - 48;
    const r = nuc.radius * (0.15 + ((i * 13) % 17) / 17 * 0.85);
    const angle = (i * 73) % 360 * (Math.PI / 180);
    const ox = nuc.x + Math.cos(angle) * r + jitterX * 0.4;
    const oy = nuc.y + Math.sin(angle) * r + jitterY * 0.4;

    const pts: number[] = [];
    for (let j = 0; j < tmpl.pts.length; j += 2) {
      pts.push(ox + tmpl.pts[j] * s, oy + tmpl.pts[j + 1] * s);
    }

    const distToEdge = Math.min(ox, W - ox, oy, H - oy);
    const edgeFactor = Math.max(0, 1 - distToEdge / maxDistFromEdge);

    const baseColor = MICRO_PALETTE[i % MICRO_PALETTE.length];
    const axisBlendAmount = 0.6 - edgeFactor * 0.45;
    const color = blendHex(baseColor, axisBlend, axisBlendAmount);

    const baseOp = 0.008 + (i % 7) * 0.01;
    const op = baseOp * (0.5 + 1.5 * edgeFactor);
    const strokeOp = (op * 1.6 + 0.03) * (0.6 + 0.8 * edgeFactor);
    crystals.push({ pts: pts.join(','), color, op, strokeOp });
  }

  return crystals;
}

/** Destellos en aristas (coords absolutas). */
const SPARK_COORDS: { x: number; y: number; colorIdx: number }[] = [
  { x: 25, y: 35, colorIdx: 0 }, { x: 45, y: 55, colorIdx: 0 }, { x: 15, y: 65, colorIdx: 0 },
  { x: 155, y: 35, colorIdx: 1 }, { x: 165, y: 55, colorIdx: 1 }, { x: 185, y: 65, colorIdx: 1 },
  { x: 25, y: 285, colorIdx: 2 }, { x: 45, y: 265, colorIdx: 2 }, { x: 15, y: 255, colorIdx: 2 },
  { x: 155, y: 285, colorIdx: 3 }, { x: 165, y: 265, colorIdx: 3 }, { x: 185, y: 255, colorIdx: 3 },
];

/**
 * Cristales — geometría facetada con estética Kintsugi.
 * Eje Kintsugi–Pureza. Cristales pequeños, numerosos y variados.
 */
export function Background4({
  className = '',
  colorLeft = DEFAULT_LEFT,
  colorRight = DEFAULT_RIGHT,
  sliderValue = 50,
}: CardComponentProps) {
  const svgId = useUniqueSvgIds('crystal');
  const t = (sliderValue ?? 50) / 100;

  const crystals = useMemo(
    () => generateCrystals(colorLeft ?? DEFAULT_LEFT, colorRight ?? DEFAULT_RIGHT, t),
    [colorLeft, colorRight, t]
  );

  const sparks = useMemo(() => {
    const colors = [CRYSTAL_PALETTE[1], CRYSTAL_PALETTE[6], CRYSTAL_PALETTE[11], CRYSTAL_PALETTE[16]];
    return SPARK_COORDS.map((sp) => ({ x: sp.x, y: sp.y, color: colors[sp.colorIdx] }));
  }, []);

  const particles = useMemo(() => {
    const nuclei = ORGANIC_NUCLEI.slice(0, 10);
    const maxDistFromEdge = Math.min(W, H) * 0.4;
    return Array.from({ length: 160 }, (_, i) => {
      const nuc = nuclei[i % nuclei.length];
      const angle = (i * 47) % 360 * (Math.PI / 180);
      const r = 8 + (i * 19) % 45 + (i * 7) % 12;
      const x = Math.max(2, Math.min(W - 2, nuc.x + Math.cos(angle) * r + ((i * 11) % 15 - 7)));
      const y = Math.max(2, Math.min(H - 2, nuc.y + Math.sin(angle) * r + ((i * 13) % 19 - 9)));

      const distToEdge = Math.min(x, W - x, y, H - y);
      const edgeFactor = Math.max(0, 1 - distToEdge / maxDistFromEdge);
      const rParticle = 0.15 + ((i * 31) % 13) / 13 * 0.5;
      const baseOp = 0.04 + (i % 8) * 0.03;
      const opacity = baseOp * (0.4 + 1.2 * edgeFactor);

      return { x, y, r: rParticle, fill: MICRO_PALETTE[i % MICRO_PALETTE.length], opacity };
    });
  }, []);

  const baseId = svgId('base');
  const centerId = svgId('center');
  const glowId = svgId('glow');
  const blurId = svgId('blur');

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      className={cn('absolute inset-0', className)}
    >
      <defs>
        <radialGradient id={baseId} cx="50%" cy="50%" r="70%">
          <stop offset="0%" stopColor="#06040e" />
          <stop offset="100%" stopColor="#030208" />
        </radialGradient>
        <radialGradient id={centerId} cx="50%" cy="50%" r="40%">
          <stop offset="0%" stopColor="#06040e" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#06040e" stopOpacity="0" />
        </radialGradient>
        <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id={blurId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      <rect width={W} height={H} fill={`url(#${baseId})`} />

      {/* Halos en esquinas */}
      <circle cx="0" cy="0" r="70" fill="#7c3aed" opacity="0.05" filter={`url(#${blurId})`} />
      <circle cx={W} cy="0" r="70" fill="#0ea5e9" opacity="0.05" filter={`url(#${blurId})`} />
      <circle cx="0" cy={H} r="70" fill="#10b981" opacity="0.05" filter={`url(#${blurId})`} />
      <circle cx={W} cy={H} r="70" fill="#f59e0b" opacity="0.05" filter={`url(#${blurId})`} />

      {/* Cristales */}
      {crystals.map((c, i) => (
        <g key={i}>
          <polygon points={c.pts} fill={c.color} opacity={c.op} />
          <polygon points={c.pts} fill="none" stroke={c.color} strokeWidth="0.4" opacity={c.strokeOp} />
        </g>
      ))}

      {/* Destellos */}
      {sparks.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r="1.2" fill={s.color} opacity="0.75" filter={`url(#${glowId})`} />
      ))}

      {/* Partículas dispersas */}
      {particles.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={p.fill} opacity={p.opacity} />
      ))}

      {/* Velo oscuro central */}
      <ellipse cx={W / 2} cy={H / 2} rx="68" ry="88" fill={`url(#${centerId})`} />
    </svg>
  );
}
