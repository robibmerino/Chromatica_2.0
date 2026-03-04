import { useUniqueSvgIds } from '../../QuienTinderCards/useUniqueSvgIds';
import { useAxisRotatedPalette } from '../useAxisRotatedPalette';
import type { CardComponentProps } from '../types';

/** Color predeterminado del extremo izquierdo (Silencio). */
const VOID_DEFAULT_LEFT = '#7c3aed';

/** Paleta: disco, anillo, singularidad. Violeta profundo que rotan según el eje Silencio–Pausa. */
const VOID_PALETTE = {
  main: '#8b5cf6',
  halo: '#a78bfa',
  diskEdge: '#7c3aed',
  ringStroke: '#a78bfa',
  ringLight: '#c4b5fd',
  pointGlow: '#e9d5ff',
  pointCore: '#ffffff',
} as const;

/**
 * Void — el vacío que contiene.
 * Colores personalizables según eje Silencio–Pausa. Rotación cromática como fondos.
 */
export function Void({
  colorLeft = VOID_DEFAULT_LEFT,
  colorRight = '#64748b',
  sliderValue = 0,
  defaultColorLeft = VOID_DEFAULT_LEFT,
  className = '',
}: CardComponentProps) {
  const svgId = useUniqueSvgIds('void');
  const s = 80;
  const cx = s / 2;
  const cy = s / 2;

  const diskR = s * 0.28;
  const ringRx = s * 0.42;
  const ringRy = s * 0.14;
  const ringRot = -20;

  const c = useAxisRotatedPalette(VOID_PALETTE, {
    colorLeft,
    colorRight,
    defaultColorLeft,
    sliderValue,
  });

  const haloId = svgId('halo');
  const diskId = svgId('disk');
  const pointId = svgId('point');
  const clipAboveId = svgId('clip-above');
  const clipBelowId = svgId('clip-below');
  const blurId = svgId('blur');
  const softId = svgId('soft');

  return (
    <svg viewBox={`0 0 ${s} ${s}`} width="100%" height="100%" className={className} fill="none">
      <defs>
        <radialGradient id={haloId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={c.main} stopOpacity="0" />
          <stop offset="50%" stopColor={c.halo} stopOpacity="0.06" />
          <stop offset="100%" stopColor={c.main} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={diskId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0f0f14" stopOpacity="0.8" />
          <stop offset="70%" stopColor="#0a0a0f" stopOpacity="0.75" />
          <stop offset="100%" stopColor={c.diskEdge} stopOpacity="0.3" />
        </radialGradient>
        <radialGradient id={pointId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={c.pointCore} stopOpacity="1" />
          <stop offset="45%" stopColor={c.pointGlow} stopOpacity="0.6" />
          <stop offset="100%" stopColor={c.main} stopOpacity="0" />
        </radialGradient>
        <clipPath id={clipAboveId}>
          <rect x="0" y="0" width={s} height={cy} />
        </clipPath>
        <clipPath id={clipBelowId}>
          <rect x="0" y={cy} width={s} height={cy} />
        </clipPath>
        <filter id={blurId}>
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id={softId}>
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>

      {/* 0. Halo de atmósfera */}
      <circle cx={cx} cy={cy} r={s * 0.48} fill={`url(#${haloId})`} filter={`url(#${softId})`} />

      {/* 1. Anillo orbital — arco trasero (más tenue) */}
      <ellipse
        cx={cx}
        cy={cy}
        rx={ringRx}
        ry={ringRy}
        fill="none"
        stroke={c.ringStroke}
        strokeWidth="0.8"
        opacity="0.18"
        transform={`rotate(${ringRot} ${cx} ${cy})`}
        clipPath={`url(#${clipAboveId})`}
      />

      {/* 2. Disco — la masa (etéreo) */}
      <circle cx={cx} cy={cy} r={diskR} fill={`url(#${diskId})`} opacity="0.85" filter={`url(#${blurId})`} />

      {/* Borde del disco (suave) */}
      <circle
        cx={cx}
        cy={cy}
        r={diskR}
        fill="none"
        stroke={c.diskEdge}
        strokeWidth="0.5"
        opacity="0.3"
      />

      {/* 3. Anillo orbital — arco delantero (más vivo) */}
      <ellipse
        cx={cx}
        cy={cy}
        rx={ringRx}
        ry={ringRy}
        fill="none"
        stroke={c.ringStroke}
        strokeWidth="1"
        opacity="0.5"
        transform={`rotate(${ringRot} ${cx} ${cy})`}
        clipPath={`url(#${clipBelowId})`}
      />

      {/* Hilo de luz sobre el arco delantero */}
      <ellipse
        cx={cx}
        cy={cy}
        rx={ringRx}
        ry={ringRy}
        fill="none"
        stroke={c.ringLight}
        strokeWidth="0.35"
        opacity="0.15"
        transform={`rotate(${ringRot} ${cx} ${cy})`}
        clipPath={`url(#${clipBelowId})`}
      />

      {/* 4. Singularidad (resplandor etéreo) */}
      <circle cx={cx} cy={cy} r={s * 0.1} fill={`url(#${pointId})`} opacity="0.4" filter={`url(#${softId})`} />
      <circle cx={cx} cy={cy} r={s * 0.06} fill={`url(#${pointId})`} opacity="0.5" filter={`url(#${blurId})`} />
      <circle cx={cx} cy={cy} r={s * 0.02} fill={c.pointCore} opacity="0.8" />
    </svg>
  );
}
