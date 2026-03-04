import { useUniqueSvgIds } from '../../QuienTinderCards/useUniqueSvgIds';
import { useAxisRotatedPalette } from '../useAxisRotatedPalette';
import { polar } from '../utils';
import type { CardComponentProps } from '../types';

/** Color predeterminado del extremo izquierdo (Fluidez). */
const ONDULATION_DEFAULT_LEFT = '#1a6dc7';

/** Paleta ampliada: ondas, bandas, gotas, centro. Colores azul que rotan según Fluidez–Resonancia. */
const ONDULATION_PALETTE = {
  wave1: '#60a5fa',
  wave2: '#3b82f6',
  wave3: '#1a6dc7',
  wave4: '#1d4ed8',
  wave5: '#1e3a8a',
  core: '#2563eb',
  glow: '#93c5fd',
  node: '#bfdbfe',
  droplet: '#f0fdfa',
  highlight: '#f0fdfa',
  bandLight: '#5eead4',
  bandDark: '#0d9488',
  shadow: '#042f2e',
  center: '#ffffff',
  deep: '#0c2340',
} as const;

/** Genera path de onda suave cerrada. */
function wavePath(
  cx: number,
  cy: number,
  radius: number,
  waveAmp: number,
  waveFreq: number,
  phase: number
): string {
  const pts: string[] = [];
  const steps = 32;
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const r = radius + Math.sin(t * waveFreq + phase) * waveAmp;
    const x = cx + Math.cos(t - Math.PI / 2) * r;
    const y = cy + Math.sin(t - Math.PI / 2) * r;
    pts.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`);
  }
  pts.push('Z');
  return pts.join(' ');
}

/** Gotas: [ángulo°, radio], sobre/anillo de ondas para reflejos integrados (escala 1.14) */
const DROPLETS: [number, number][] = [
  [330, 16],
  [15, 21],
  [45, 18],
  [60, 23],
  [105, 17],
  [150, 22],
  [195, 19],
  [255, 18],
  [285, 21],
];

/** Nodos de resonancia: [ángulo°, radio], alineados con anillos de onda */
const RESONANCE_NODES: [number, number][] = [
  [0, 18],
  [45, 23],
  [90, 17],
  [135, 25],
  [180, 19],
  [225, 24],
  [270, 21],
  [315, 22],
];

/**
 * Ondulación — las ondas que fluyen y resuenan.
 * Colores personalizables según eje Fluidez–Resonancia. Rotación cromática como fondos.
 */
export function Ondulation({
  colorLeft = ONDULATION_DEFAULT_LEFT,
  colorRight = '#8b5cf6',
  sliderValue = 0,
  defaultColorLeft = ONDULATION_DEFAULT_LEFT,
  className = '',
}: CardComponentProps) {
  const svgId = useUniqueSvgIds('ondul');
  const s = 80;
  const cx = s / 2;
  const cy = s / 2;
  const maxR = s * 0.48;

  const c = useAxisRotatedPalette(ONDULATION_PALETTE, {
    colorLeft,
    colorRight,
    defaultColorLeft,
    sliderValue,
  });

  const glowId = svgId('glow');
  const haloId = svgId('halo');
  const bandId = svgId('band');
  const bandShadowId = svgId('band-shadow');
  const poolId = svgId('pool');
  const poolLitId = svgId('pool-lit');
  const blurId = svgId('blur');
  const softId = svgId('soft');
  const dropShadowId = svgId('drop-shadow');
  const nucleusShadowId = svgId('nucleus-shadow');

  /* Luz sutil arriba-izq para bandas; aura/halo centrados para evitar destello desplazado */
  const lightX = 0.3;
  const lightY = 0.3;

  return (
    <svg viewBox={`0 0 ${s} ${s}`} width="100%" height="100%" className={className} fill="none">
      <defs>
        {/* Aura centrada — evita destello desplazado y recorte en bordes */}
        <radialGradient id={glowId} cx="50%" cy="50%" r="55%">
          <stop offset="0%" stopColor={c.glow} stopOpacity="0.2" />
          <stop offset="45%" stopColor={c.core} stopOpacity="0.08" />
          <stop offset="85%" stopColor={c.wave3} stopOpacity="0.02" />
          <stop offset="100%" stopColor={c.wave5} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={haloId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={c.core} stopOpacity="0.06" />
          <stop offset="100%" stopColor={c.wave3} stopOpacity="0" />
        </radialGradient>
        {/* Banda con gradiente direccional (luz arriba-izq → sombra abajo-der) */}
        <linearGradient id={bandId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={c.bandLight} stopOpacity="0.22" />
          <stop offset="50%" stopColor={c.core} stopOpacity="0.1" />
          <stop offset="100%" stopColor={c.bandDark} stopOpacity="0.04" />
        </linearGradient>
        <linearGradient id={bandShadowId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={c.shadow} stopOpacity="0.06" />
          <stop offset="100%" stopColor={c.deep} stopOpacity="0.12" />
        </linearGradient>
        {/* Piscina: luz arriba-izq, profundidad abajo-der */}
        <radialGradient id={poolId} cx={`${lightX * 100}%`} cy={`${lightY * 100}%`} r="70%">
          <stop offset="0%" stopColor={c.glow} stopOpacity="0.25" />
          <stop offset="45%" stopColor={c.core} stopOpacity="0.12" />
          <stop offset="100%" stopColor={c.deep} stopOpacity="0.2" />
        </radialGradient>
        <radialGradient id={poolLitId} cx="35%" cy="35%" r="50%">
          <stop offset="0%" stopColor={c.highlight} stopOpacity="0.15" />
          <stop offset="100%" stopColor="transparent" stopOpacity="0" />
        </radialGradient>
        <filter id={blurId}>
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id={softId} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
        <filter id={dropShadowId} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0.4" dy="0.5" stdDeviation="1" floodColor={c.shadow} floodOpacity="0.25" />
        </filter>
        <filter id={nucleusShadowId} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1" dy="1.5" stdDeviation="2" floodColor={c.deep} floodOpacity="0.4" />
        </filter>
      </defs>

      {/* 0. Aura exterior — centrada, cabe en viewBox para no recortarse */}
      <ellipse
        cx={cx}
        cy={cy}
        rx={maxR * 0.82}
        ry={maxR * 0.74}
        fill={`url(#${glowId})`}
        filter={`url(#${softId})`}
      />

      {/* 1. Halo intermedio */}
      <ellipse cx={cx} cy={cy} rx={maxR * 0.75} ry={maxR * 0.68} fill={`url(#${haloId})`} filter={`url(#${softId})`} />

      {/* 2. Bandas de onda — sombra direccional (abajo-derecha) para relieve */}
      {[
        { outer: 30, inner: 27 },
        { outer: 26, inner: 23 },
        { outer: 22, inner: 19 },
        { outer: 18, inner: 15 },
        { outer: 14, inner: 11 },
      ].map(({ outer, inner }, i) => {
        const outerPath = wavePath(cx, cy, outer, 2.5, 3 + i * 0.5, i * 0.3);
        const innerPath = wavePath(cx, cy, inner, 2, 3 + i * 0.5, i * 0.3);
        return (
          <path
            key={`band-shadow-${i}`}
            d={`${outerPath} ${innerPath}`}
            fillRule="evenodd"
            fill={`url(#${bandShadowId})`}
            opacity={0.08 + (5 - i) * 0.02}
            filter={`url(#${softId})`}
          />
        );
      })}

      {/* 2b. Bandas de onda rellenas (gradiente luz arriba-izq → sombra abajo-der) */}
      {[
        { outer: 34, inner: 31 },
        { outer: 30, inner: 26 },
        { outer: 25, inner: 22 },
        { outer: 21, inner: 17 },
        { outer: 16, inner: 13 },
      ].map(({ outer, inner }, i) => {
        const outerPath = wavePath(cx, cy, outer, 2.5, 3 + i * 0.5, i * 0.3);
        const innerPath = wavePath(cx, cy, inner, 2, 3 + i * 0.5, i * 0.3);
        return (
          <path
            key={`band-${i}`}
            d={`${outerPath} ${innerPath}`}
            fillRule="evenodd"
            fill={`url(#${bandId})`}
            opacity={0.12 + (5 - i) * 0.04}
            filter={`url(#${softId})`}
          />
        );
      })}

      {/* 3. Ondas de trazo (fondo — más difuminadas, ligeramente escaladas para perspectiva) */}
      <g transform={`translate(${cx} ${cy}) scale(0.96) translate(${-cx} ${-cy})`}>
        {[
          { r: 32, amp: 3.4, freq: 3, phase: 0, opacity: 0.22 },
          { r: 27, amp: 2.8, freq: 4, phase: 0.5, opacity: 0.26 },
        ].map(({ r, amp, freq, phase, opacity }, i) => (
          <path
            key={`wave-bg-${i}`}
            d={wavePath(cx, cy, r, amp, freq, phase)}
            fill="none"
            stroke={c.wave1}
            strokeWidth="0.7"
            opacity={opacity}
            filter={`url(#${softId})`}
          />
        ))}
      </g>

      {/* 4. Ondas de trazo (medio) */}
      {[
        { r: 23, amp: 2.5, freq: 5, phase: 1, stroke: c.wave2, w: 0.65, opacity: 0.38 },
        { r: 18, amp: 2, freq: 6, phase: 1.5, stroke: c.wave3, w: 0.6, opacity: 0.42 },
      ].map(({ r, amp, freq, phase, stroke, w, opacity }, i) => (
        <path
          key={`wave-mid-${i}`}
          d={wavePath(cx, cy, r, amp, freq, phase)}
          fill="none"
          stroke={stroke}
          strokeWidth={w}
          opacity={opacity}
        />
      ))}

      {/* 5. Ondas de trazo (primer plano — más definidas) */}
      {[
        { r: 14, amp: 1.6, freq: 7, phase: 2, stroke: c.core, w: 0.55, opacity: 0.5 },
        { r: 9, amp: 1.2, freq: 5, phase: 0.5, stroke: c.glow, w: 0.5, opacity: 0.45 },
      ].map(({ r, amp, freq, phase, stroke, w, opacity }, i) => (
        <path
          key={`wave-fg-${i}`}
          d={wavePath(cx, cy, r, amp, freq, phase)}
          fill="none"
          stroke={stroke}
          strokeWidth={w}
          opacity={opacity}
          filter={`url(#${blurId})`}
        />
      ))}

      {/* 6. Piscina interior (gradiente de profundidad, luz arriba-izq) */}
      <path
        d={wavePath(cx, cy, 11, 1.4, 4, 0)}
        fill={`url(#${poolId})`}
        opacity="0.4"
        filter={`url(#${softId})`}
      />
      {/* Reflejo de luz en la superficie del agua */}
      <path
        d={wavePath(cx, cy, 10, 1.2, 4, 0)}
        fill={`url(#${poolLitId})`}
        opacity="0.45"
        filter={`url(#${softId})`}
      />

      {/* 7. Gotas sobre anillos de onda (reflejos integrados, sombra sutil) */}
      {DROPLETS.map(([angle, r], i) => {
        const p = polar(cx, cy, angle, r);
        const size = 0.9 + (i % 3) * 0.2;
        const op = 0.35 - (i % 4) * 0.04;
        return (
          <circle
            key={`drop-${i}`}
            cx={p.x}
            cy={p.y}
            r={size}
            fill={c.droplet}
            opacity={op}
            filter={`url(#${dropShadowId}) url(#${blurId})`}
          />
        );
      })}

      {/* 8. Nodos de resonancia (halos compactos, sobre ondas) */}
      {RESONANCE_NODES.map(([angle, r], i) => {
        const p = polar(cx, cy, angle, r);
        const size = 1.8 - (i % 3) * 0.2;
        return (
          <g key={`node-${i}`}>
            <circle
              cx={p.x}
              cy={p.y}
              r={size * 1.3}
              fill={c.node}
              opacity={0.2}
              filter={`url(#${softId})`}
            />
            <circle
              cx={p.x}
              cy={p.y}
              r={size}
              fill={c.node}
              opacity={0.5 - i * 0.02}
              filter={`url(#${blurId})`}
            />
          </g>
        );
      })}

      {/* 9. Núcleo central (capas + sombra sutil → volumen 3D) */}
      <circle cx={cx} cy={cy} r={10} fill={c.core} opacity="0.25" filter={`url(#${nucleusShadowId})`} />
      <circle cx={cx} cy={cy} r={10} fill={c.core} opacity="0.2" filter={`url(#${softId})`} />
      <circle cx={cx} cy={cy} r={8} fill={c.glow} opacity="0.3" filter={`url(#${blurId})`} />
      <circle cx={cx} cy={cy} r={5.5} fill={c.node} opacity="0.5" filter={`url(#${blurId})`} />
      <circle cx={cx} cy={cy} r={2.8} fill={c.center} opacity="0.9" />

      {/* 10. Destellos en crestas (pegados a ondas, zona iluminada arriba-izq) */}
      {[
        { angle: 315, r: 18, op: 0.6 },
        { angle: 0, r: 21, op: 0.55 },
        { angle: 45, r: 17, op: 0.5 },
        { angle: 90, r: 22, op: 0.4 },
        { angle: 180, r: 19, op: 0.35 },
        { angle: 270, r: 18, op: 0.45 },
      ].map(({ angle, r, op }, i) => {
        const p = polar(cx, cy, angle, r);
        return (
          <circle
            key={`spark-${i}`}
            cx={p.x}
            cy={p.y}
            r={1}
            fill={c.highlight}
            opacity={op}
            filter={`url(#${blurId})`}
          />
        );
      })}
    </svg>
  );
}
