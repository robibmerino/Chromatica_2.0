import { useMemo } from 'react';
import { useUniqueSvgIds } from '../../QuienTinderCards/useUniqueSvgIds';
import { cn } from '../../../../utils/cn';
import { blendHex } from '../../../../utils/colorUtils';
import type { CardComponentProps } from '../types';
import { CARD_VIEWBOX_W, CARD_VIEWBOX_H } from './constants';

const DEFAULT_LEFT = '#0099cc';
const DEFAULT_RIGHT = '#00ccaa';

const W = CARD_VIEWBOX_W;
const H = CARD_VIEWBOX_H;
const CENTER_X = W / 2;
const CENTER_Y = H / 2;

const buildFlow = (
  startX: number,
  startY: number,
  ctrlX: number,
  ctrlY: number,
  endX: number,
  endY: number
) =>
  `M${startX},${startY} C${ctrlX},${ctrlY} ${ctrlX + (endX - startX) * 0.3},${endY * 0.8} ${endX},${endY}`;

/** Configuración de corrientes: coords para path y color base (diversidad cromática). */
const STREAM_CONFIGS = [
  { startX: -10, startY: 30, ctrlX: 40, ctrlY: 80, endX: 95, endY: 155, color: '#00d4ff', w: 8 },
  { startX: -10, startY: 80, ctrlX: 35, ctrlY: 120, endX: 92, endY: 160, color: '#0099cc', w: 5 },
  { startX: -10, startY: 150, ctrlX: 30, ctrlY: 170, endX: 90, endY: 165, color: '#00b8e6', w: 6 },
  { startX: -10, startY: 220, ctrlX: 35, ctrlY: 210, endX: 90, endY: 170, color: '#0077aa', w: 5 },
  { startX: -10, startY: 290, ctrlX: 40, ctrlY: 250, endX: 94, endY: 172, color: '#00d4ff', w: 7 },
  { startX: 210, startY: 20, ctrlX: 160, ctrlY: 75, endX: 106, endY: 155, color: '#00ffcc', w: 8 },
  { startX: 210, startY: 90, ctrlX: 165, ctrlY: 125, endX: 108, endY: 160, color: '#00e6c4', w: 5 },
  { startX: 210, startY: 160, ctrlX: 170, ctrlY: 172, endX: 110, endY: 165, color: '#00ffcc', w: 6 },
  { startX: 210, startY: 230, ctrlX: 165, ctrlY: 215, endX: 110, endY: 170, color: '#009988', w: 5 },
  { startX: 210, startY: 300, ctrlX: 160, ctrlY: 258, endX: 107, endY: 172, color: '#00ffcc', w: 7 },
  { startX: 30, startY: -10, ctrlX: 70, ctrlY: 40, endX: 100, endY: 152, color: '#4488ff', w: 6 },
  { startX: 100, startY: -10, ctrlX: 100, ctrlY: 50, endX: 100, endY: 150, color: '#5c9eff', w: 4 },
  { startX: 170, startY: -10, ctrlX: 130, ctrlY: 40, endX: 102, endY: 153, color: '#4488ff', w: 6 },
  { startX: 40, startY: 330, ctrlX: 75, ctrlY: 275, endX: 99, endY: 172, color: '#00aaff', w: 6 },
  { startX: 160, startY: 330, ctrlX: 125, ctrlY: 275, endX: 101, endY: 172, color: '#00c8e6', w: 6 },
];

const PARTICLE_COLORS = ['#00d4ff', '#00ffcc', '#4488ff', '#00aaff', '#5c9eff', '#00e6c4'] as const;

/**
 * Marea — corrientes fluidas que convergen hacia el centro.
 * Eje Flow–Calma. Menor intensidad de color hacia el centro.
 */
export function Background5({
  className = '',
  colorLeft = DEFAULT_LEFT,
  colorRight = DEFAULT_RIGHT,
  sliderValue = 50,
}: CardComponentProps) {
  const svgId = useUniqueSvgIds('tide');
  const t = (sliderValue ?? 50) / 100;
  const axisBlend = blendHex(colorLeft ?? DEFAULT_LEFT, colorRight ?? DEFAULT_RIGHT, t);

  const streams = useMemo(() => {
    return STREAM_CONFIGS.map((c, i) => {
      const path = buildFlow(c.startX, c.startY, c.ctrlX, c.ctrlY, c.endX, c.endY);
      const axisInfluence = 0.45 + (i % 5) * 0.05;
      const color = blendHex(c.color, axisBlend, axisInfluence);
      const baseOp = c.w >= 7 ? 0.12 : c.w >= 6 ? 0.10 : 0.08;
      return { path, color, op: baseOp, w: c.w };
    });
  }, [axisBlend]);

  const particles = useMemo(() => {
    const result: { x: number; y: number; r: number; fill: string; opacity: number }[] = [];
    for (let i = 0; i < 35; i++) {
      const angle = (i / 35) * Math.PI * 2;
      const r = 95 + (i % 5) * 8;
      const x = CENTER_X + Math.cos(angle) * r * 0.85;
      const y = CENTER_Y + Math.sin(angle) * r;
      if (x < 15 || x > 185 || y < 15 || y > 305) {
        const baseColor = PARTICLE_COLORS[i % PARTICLE_COLORS.length];
        const axisInfluence = 0.4 + (i % 4) * 0.08;
        result.push({
          x,
          y,
          r: 0.5 + (i % 3) * 0.4,
          fill: blendHex(baseColor, axisBlend, axisInfluence),
          opacity: 0.3 + (i % 4) * 0.15,
        });
      }
    }
    return result;
  }, [axisBlend]);

  const baseId = svgId('base');
  const blurId = svgId('blur');
  const fadeGradId = svgId('fade-grad');
  const fadeMaskId = svgId('fade-mask');

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
          <stop offset="0%" stopColor="#020c18" />
          <stop offset="100%" stopColor="#010608" />
        </radialGradient>
        <filter id={blurId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        {/* Gradiente para máscara: bordes visibles, centro atenuado */}
        <radialGradient id={fadeGradId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="black" stopOpacity="0.92" />
          <stop offset="40%" stopColor="black" stopOpacity="0.5" />
          <stop offset="70%" stopColor="white" stopOpacity="0.9" />
          <stop offset="100%" stopColor="white" />
        </radialGradient>
        <mask id={fadeMaskId}>
          <rect x="0" y="0" width={W} height={H} fill={`url(#${fadeGradId})`} />
        </mask>
      </defs>

      <rect width={W} height={H} fill={`url(#${baseId})`} />

      {/* Corrientes y partículas: máscara atenúa hacia el centro */}
      <g mask={`url(#${fadeMaskId})`}>
        {streams.map((s, i) => (
          <g key={i}>
            <path
              d={s.path}
              fill="none"
              stroke={s.color}
              strokeWidth={s.w * 2.5}
              opacity={s.op * 0.6}
              filter={`url(#${blurId})`}
              strokeLinecap="round"
            />
            <path
              d={s.path}
              fill="none"
              stroke={s.color}
              strokeWidth={s.w * 0.4}
              opacity={s.op * 2}
              strokeLinecap="round"
            />
          </g>
        ))}
        {particles.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={p.fill} opacity={p.opacity} />
        ))}
      </g>

      {/* Vórtice central — muy sutil, sensible al eje */}
      {Array.from({ length: 5 }, (_, i) => (
        <ellipse
          key={i}
          cx={CENTER_X}
          cy={CENTER_Y + 2}
          rx={15 + i * 10}
          ry={20 + i * 13}
          fill="none"
          stroke={axisBlend}
          strokeWidth="0.3"
          opacity={0.02 - i * 0.003}
        />
      ))}
    </svg>
  );
}
