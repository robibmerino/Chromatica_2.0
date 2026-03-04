import { useUniqueSvgIds } from '../../QuienTinderCards/useUniqueSvgIds';
import { useAxisRotatedPalette } from '../useAxisRotatedPalette';
import { polar } from '../utils';
import type { CardComponentProps } from '../types';

/** Color predeterminado del extremo izquierdo (Calor). */
const EMBER_DEFAULT_LEFT = '#f97316';

/** Paleta original: brasa, halo, disco. Colores naranja/ámbar que rotan según el eje Calor–Poder. */
const EMBER_PALETTE = {
  main: '#fb923c',
  haloLight: '#fdba74',
  haloOuter: '#ea580c',
  discLight: '#fff7ed',
  discMid: '#fb923c',
  discDark: '#9a3412',
  carbon: '#431407',
  fissure: '#fdba74',
  spark: '#fed7aa',
  nucleus: '#ffffff',
} as const;

/** Fisuras: [ángulo°, longitud 0-1, grosor] */
const FISSURES: [number, number, number][] = [
  [0, 1.0, 1.0],
  [33, 0.62, 0.7],
  [68, 0.48, 0.5],
  [105, 0.78, 0.8],
  [142, 0.38, 0.4],
  [178, 0.85, 0.9],
  [215, 0.44, 0.5],
  [248, 0.7, 0.7],
  [290, 0.52, 0.5],
  [325, 0.6, 0.6],
];

/** Chispas: [ángulo°, radio relativo, tamaño] */
const SPARKS: [number, number, number][] = [
  [15, 1.3, 1.2],
  [80, 1.45, 0.8],
  [130, 1.25, 1.0],
  [200, 1.38, 0.7],
  [260, 1.5, 1.1],
  [310, 1.22, 0.9],
  [355, 1.4, 0.6],
];

/**
 * Ember — la brasa que persiste.
 * Colores personalizables según eje Calor–Poder. Rotación cromática como fondos.
 */
export function Ember({
  colorLeft = EMBER_DEFAULT_LEFT,
  colorRight = '#dc2626',
  sliderValue = 0,
  defaultColorLeft = EMBER_DEFAULT_LEFT,
  className = '',
}: CardComponentProps) {
  const svgId = useUniqueSvgIds('ember');
  const s = 80;
  const cx = s / 2;
  const cy = s / 2;

  const discR = s * 0.28;
  const carbonR = s * 0.34;
  const fissureMax = s * 0.2;
  const haloR = s * 0.46;

  const c = useAxisRotatedPalette(EMBER_PALETTE, {
    colorLeft,
    colorRight,
    defaultColorLeft,
    sliderValue,
  });

  const haloId = svgId('halo');
  const discId = svgId('disc');
  const glowId = svgId('glow');
  const blurId = svgId('blur');
  const softId = svgId('soft');

  return (
    <svg viewBox={`0 0 ${s} ${s}`} width="100%" height="100%" className={className} fill="none">
      <defs>
        <radialGradient id={glowId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={c.haloLight} stopOpacity="0.18" />
          <stop offset="40%" stopColor={c.main} stopOpacity="0.06" />
          <stop offset="80%" stopColor={c.haloOuter} stopOpacity="0.02" />
          <stop offset="100%" stopColor={c.haloOuter} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={haloId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={c.main} stopOpacity="0.08" />
          <stop offset="50%" stopColor={c.haloLight} stopOpacity="0.03" />
          <stop offset="100%" stopColor={c.haloOuter} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={discId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={c.nucleus} stopOpacity="0.6" />
          <stop offset="25%" stopColor={c.discLight} stopOpacity="0.5" />
          <stop offset="55%" stopColor={c.main} stopOpacity="0.4" />
          <stop offset="85%" stopColor={c.discDark} stopOpacity="0.3" />
          <stop offset="100%" stopColor={c.carbon} stopOpacity="0.35" />
        </radialGradient>
        <filter id={blurId}>
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id={softId}>
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      {/* 0. Aura exterior (muy difusa, gran radio) */}
      <ellipse cx={cx} cy={cy} rx={haloR * 1.4} ry={haloR * 1.3} fill={`url(#${glowId})`} filter={`url(#${softId})`} />

      {/* 1. Halo de calor (sutil, muy difuminado) */}
      <circle cx={cx} cy={cy} r={haloR} fill={`url(#${haloId})`} filter={`url(#${softId})`} />

      {/* 2. Fisuras (trazo muy fino, casi evanescente) */}
      {FISSURES.map(([angle, lenRatio, weight], i) => {
        const inner = polar(cx, cy, angle, discR * 0.85);
        const outer = polar(cx, cy, angle, discR + fissureMax * lenRatio);
        return (
          <line
            key={i}
            x1={inner.x}
            y1={inner.y}
            x2={outer.x}
            y2={outer.y}
            stroke={c.fissure}
            strokeWidth={weight * 0.35}
            strokeLinecap="round"
            opacity={0.1 + lenRatio * 0.18}
          />
        );
      })}

      {/* 3. Chispas (puro glow, sin centro duro) */}
      {SPARKS.map(([angle, radiusRatio, sz], i) => {
        const p = polar(cx, cy, angle, discR * radiusRatio);
        return (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={sz * 1.2}
            fill={c.spark}
            opacity={0.15 + (i % 3) * 0.06}
            filter={`url(#${softId})`}
          />
        );
      })}

      {/* 4. Anillo de carbón (casi invisible) */}
      <circle cx={cx} cy={cy} r={carbonR} stroke={c.main} strokeWidth="0.4" fill="none" opacity="0.06" />

      {/* 5. Disco de brasa (semi-transparente, difuminado) */}
      <circle cx={cx} cy={cy} r={discR} fill={`url(#${discId})`} filter={`url(#${blurId})`} />

      {/* 6. Borde del disco (evanescente) */}
      <circle cx={cx} cy={cy} r={discR} stroke={c.main} strokeWidth="0.45" fill="none" opacity="0.2" />

      {/* 7. Núcleo (suave resplandor en capas) */}
      <circle cx={cx} cy={cy} r={s * 0.045} fill={c.nucleus} opacity="0.35" filter={`url(#${softId})`} />
      <circle cx={cx} cy={cy} r={s * 0.025} fill={c.nucleus} opacity="0.6" filter={`url(#${blurId})`} />
      <circle cx={cx} cy={cy} r={s * 0.01} fill={c.nucleus} opacity="0.9" />
    </svg>
  );
}
