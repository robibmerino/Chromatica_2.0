import { useMemo } from 'react';
import { useUniqueSvgIds } from '../../QuienTinderCards/useUniqueSvgIds';
import { cn } from '../../../../utils/cn';
import { blendHex } from '../../../../utils/colorUtils';
import type { CardComponentProps } from '../types';
import { scatter } from './sharedUtils';
import { CARD_VIEWBOX_W, CARD_VIEWBOX_H } from './constants';

const DEFAULT_LEFT = '#ff4500';
const DEFAULT_RIGHT = '#ffd700';

const W = CARD_VIEWBOX_W;
const H = CARD_VIEWBOX_H;

const buildRise = (x: number, baseY: number, ctrlDx: number, height: number) =>
  `M${x},${baseY} C${x + ctrlDx},${baseY - height * 0.4} ${x - ctrlDx * 0.5},${baseY - height * 0.8} ${x + ctrlDx * 0.3},${baseY - height}`;

/** Paleta rica rojo–naranja–amarillo para la forja. */
const FORGE_COLORS = [
  '#dc2626', '#ea580c', '#f97316', '#fb923c', '#fdba74',
  '#ff4500', '#ff6b35', '#ff8c00', '#ff9500', '#ffa500',
  '#ffb347', '#ffc107', '#ffcc00', '#ffd700', '#ffeb3b',
  '#e63900', '#ef4444', '#f59e0b', '#fbbf24', '#fde047',
] as const;

/**
 * Forja — filamentos de calor ascendentes, brasas y partículas de fuego.
 * Eje Fortaleza–Metamorfosis. Más riqueza de componentes, elementos más pequeños.
 */
export function Background6({
  className = '',
  colorLeft = DEFAULT_LEFT,
  colorRight = DEFAULT_RIGHT,
  sliderValue = 50,
}: CardComponentProps) {
  const svgId = useUniqueSvgIds('forge');
  const t = (sliderValue ?? 50) / 100;
  const axisBlend = blendHex(colorLeft ?? DEFAULT_LEFT, colorRight ?? DEFAULT_RIGHT, t);

  const filaments = useMemo(() => {
    return Array.from({ length: 36 }, (_, i) => {
      const baseColor = FORGE_COLORS[i % FORGE_COLORS.length];
      const axisInfluence = 0.38 + (i % 6) * 0.06;
      const color = blendHex(baseColor, axisBlend, axisInfluence);
      const height = 42 + (i % 6) * 18;
      const w = 0.5 + (i % 4) * 0.35;
      return {
        x: 8 + (i * 5.3) % 184,
        baseY: 308 + (i % 5) * 3,
        ctrlDx: -10 + (i % 9) * 3,
        height,
        color,
        op: 0.05 + (i % 5) * 0.025,
        w,
      };
    });
  }, [axisBlend]);

  const embers = useMemo(() => {
    return Array.from({ length: 65 }, (_, i) => {
      const baseColor = FORGE_COLORS[i % FORGE_COLORS.length];
      const axisInfluence = 0.35 + (i % 7) * 0.06;
      const color = blendHex(baseColor, axisBlend, axisInfluence);
      return {
        x: scatter(i * 3 + 1, 4, W - 4),
        y: scatter(i * 7 + 2, 180, H - 15),
        r: 0.25 + scatter(i * 11, 0, 0.9),
        color,
        op: 0.07 + scatter(i * 13, 0, 0.3),
      };
    });
  }, [axisBlend]);

  const fireParticles = useMemo(() => {
    return Array.from({ length: 85 }, (_, i) => {
      const baseColor = FORGE_COLORS[(i * 2) % FORGE_COLORS.length];
      const axisInfluence = 0.4 + (i % 5) * 0.07;
      const color = blendHex(baseColor, axisBlend, axisInfluence);
      return {
        x: scatter(i * 5 + 3, 6, W - 6),
        y: scatter(i * 17 + 7, 150, H - 25),
        r: 0.2 + scatter(i * 19, 0, 0.45),
        color,
        op: 0.04 + scatter(i * 23, 0, 0.25),
      };
    });
  }, [axisBlend]);

  const visibleFireParticles = useMemo(() => {
    return Array.from({ length: 70 }, (_, i) => {
      const baseColor = FORGE_COLORS[i % FORGE_COLORS.length];
      const axisInfluence = 0.42 + (i % 6) * 0.06;
      const color = blendHex(baseColor, axisBlend, axisInfluence);
      return {
        x: scatter(i * 41 + 19, 6, W - 6),
        y: scatter(i * 67 + 31, 120, H - 20),
        r: 0.2 + scatter(i * 73, 0, 0.35),
        color,
        op: 0.25 + scatter(i * 83, 0, 0.5),
      };
    });
  }, [axisBlend]);

  const scatteredParticles = useMemo(() => {
    return Array.from({ length: 120 }, (_, i) => {
      const baseColor = FORGE_COLORS[i % FORGE_COLORS.length];
      const axisInfluence = 0.36 + (i % 8) * 0.06;
      const color = blendHex(baseColor, axisBlend, axisInfluence);
      return {
        x: scatter(i * 97 + 59, 3, W - 3),
        y: scatter(i * 101 + 61, 10, H - 10),
        r: 0.15 + scatter(i * 103, 0, 0.6),
        color,
        op: 0.03 + scatter(i * 107, 0, 0.3),
      };
    });
  }, [axisBlend]);

  const baseId = svgId('base');
  const heatId = svgId('heat');
  const topId = svgId('top');
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
        <linearGradient id={baseId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#030305" />
          <stop offset="55%" stopColor="#080400" />
          <stop offset="85%" stopColor="#120600" />
          <stop offset="100%" stopColor="#2a0c00" />
        </linearGradient>
        <radialGradient id={heatId} cx="50%" cy="100%" r="55%">
          <stop offset="0%" stopColor={axisBlend} stopOpacity="0.35" />
          <stop offset="35%" stopColor={blendHex(axisBlend, '#ff8c00', 0.5)} stopOpacity="0.2" />
          <stop offset="70%" stopColor={axisBlend} stopOpacity="0.08" />
          <stop offset="100%" stopColor={axisBlend} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={topId} cx="50%" cy="0%" r="50%">
          <stop offset="0%" stopColor="#1a0020" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#030305" stopOpacity="0" />
        </radialGradient>
        <filter id={blurId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>

      <rect width={W} height={H} fill={`url(#${baseId})`} />
      <rect width={W} height={H} fill={`url(#${heatId})`} />
      <rect width={W} height={H} fill={`url(#${topId})`} />

      {/* Filamentos de calor — más numerosos y finos */}
      {filaments.map((f, i) => (
        <g key={i}>
          <path
            d={buildRise(f.x, f.baseY, f.ctrlDx, f.height)}
            fill="none"
            stroke={f.color}
            strokeWidth={f.w * 2}
            opacity={f.op * 0.5}
            filter={`url(#${blurId})`}
            strokeLinecap="round"
          />
          <path
            d={buildRise(f.x, f.baseY, f.ctrlDx, f.height)}
            fill="none"
            stroke={f.color}
            strokeWidth={f.w * 0.4}
            opacity={f.op * 2}
            strokeLinecap="round"
          />
        </g>
      ))}

      {/* Partículas de fuego — chispas ascendentes */}
      {fireParticles.map((p, i) => (
        <circle
          key={`fire-${i}`}
          cx={p.x}
          cy={p.y}
          r={p.r}
          fill={p.color}
          opacity={p.op}
          filter={`url(#${blurId})`}
        />
      ))}

      {/* Partículas de fuego visibles — más grandes y brillantes */}
      {visibleFireParticles.map((p, i) => (
        <circle
          key={`visible-fire-${i}`}
          cx={p.x}
          cy={p.y}
          r={p.r}
          fill={p.color}
          opacity={p.op}
        />
      ))}

      {/* Brasas flotantes — mitad inferior */}
      {embers.map((e, i) => (
        <circle key={`ember-${i}`} cx={e.x} cy={e.y} r={e.r} fill={e.color} opacity={e.op} />
      ))}

      {/* Partículas dispersas por toda la tarjeta */}
      {scatteredParticles.map((p, i) => (
        <circle
          key={`scatter-${i}`}
          cx={p.x}
          cy={p.y}
          r={p.r}
          fill={p.color}
          opacity={p.op}
        />
      ))}

      {/* Franja de forja — forma orgánica, sensible al eje */}
      <path
        d="M0,320 L0,278 Q20,292 45,272 Q70,288 95,265 Q118,282 145,268 Q168,286 195,274 L200,320 Z"
        fill={blendHex('#ff4500', axisBlend, 0.6)}
        opacity="0.14"
        filter={`url(#${blurId})`}
      />
      <path
        d="M0,320 L0,288 Q35,298 70,282 Q100,296 130,276 Q162,290 185,280 L200,320 Z"
        fill={blendHex('#ff8c00', axisBlend, 0.55)}
        opacity="0.2"
        filter={`url(#${blurId})`}
      />
      <path
        d="M0,320 L0,298 Q50,308 95,294 Q135,305 175,292 L200,320 Z"
        fill={blendHex('#ffd700', axisBlend, 0.5)}
        opacity="0.1"
        filter={`url(#${blurId})`}
      />

      {/* Líneas de calor en el suelo — sensibles al eje */}
      <path
        d="M0,296 Q50,292 100,294 Q150,296 200,292"
        fill="none"
        stroke={blendHex('#ff8c00', axisBlend, 0.55)}
        strokeWidth="0.7"
        opacity="0.35"
      />
      <path
        d="M0,300 Q60,297 100,298 Q140,299 200,296"
        fill="none"
        stroke={blendHex('#ffd700', axisBlend, 0.5)}
        strokeWidth="0.5"
        opacity="0.22"
      />
      <path
        d="M0,304 Q40,302 100,303 Q160,304 200,301"
        fill="none"
        stroke={blendHex('#ff4500', axisBlend, 0.5)}
        strokeWidth="0.6"
        opacity="0.2"
      />

      {/* Velo oscuro central */}
      <ellipse cx={W / 2} cy="148" rx="60" ry="78" fill="#030305" opacity="0.5" filter={`url(#${blurId})`} />
    </svg>
  );
}
