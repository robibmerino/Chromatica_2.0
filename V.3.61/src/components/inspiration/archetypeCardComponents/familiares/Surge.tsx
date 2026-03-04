import { useUniqueSvgIds } from '../../QuienTinderCards/useUniqueSvgIds';
import { useAxisRotatedPalette } from '../useAxisRotatedPalette';
import type { CardComponentProps } from '../types';

/** Color predeterminado del extremo izquierdo (Movimiento). */
const SURGE_DEFAULT_LEFT = '#facc15';

/** Paleta: osciloscopio. Amarillo/ámbar que rotan según Movimiento–Alegría. */
const SURGE_PALETTE = {
  main: '#facc15',
  glow: '#fef08a',
  core: '#ffffff',
} as const;

/** Genera path de señal Bézier para un canal del osciloscopio */
function signalPath(
  y: number,
  amplitude: number,
  peaks: { x: number; dy: number; tension: number }[]
): string {
  const points: { x: number; y: number }[] = [{ x: 18, y }];

  peaks.forEach((p) => {
    points.push({ x: p.x, y: y + p.dy * amplitude });
  });

  points.push({ x: 182, y });

  let d = `M ${points[0].x},${points[0].y.toFixed(2)}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const tension = peaks[i - 1]?.tension ?? 0.4;
    const cpx = prev.x + (curr.x - prev.x) * tension;
    d += ` C ${cpx.toFixed(2)},${prev.y.toFixed(2)} ${cpx.toFixed(2)},${curr.y.toFixed(2)} ${curr.x.toFixed(2)},${curr.y.toFixed(2)}`;
  }
  return d;
}

const CHANNELS = [
  {
    y: 100,
    amplitude: 3.5,
    opacity: 0.18,
    strokeWidth: 0.6,
    dash: '3 4',
    glow: false,
    peaks: [
      { x: 45, dy: -0.4, tension: 0.5 },
      { x: 80, dy: 0.6, tension: 0.4 },
      { x: 120, dy: -0.3, tension: 0.5 },
      { x: 155, dy: 0.5, tension: 0.4 },
    ],
  },
  {
    y: 100,
    amplitude: 7,
    opacity: 0.38,
    strokeWidth: 0.8,
    dash: '',
    glow: false,
    peaks: [
      { x: 38, dy: -0.5, tension: 0.45 },
      { x: 68, dy: 0.8, tension: 0.38 },
      { x: 95, dy: -0.6, tension: 0.42 },
      { x: 128, dy: 0.7, tension: 0.4 },
      { x: 162, dy: -0.4, tension: 0.45 },
    ],
  },
  {
    y: 100,
    amplitude: 13,
    opacity: 0.62,
    strokeWidth: 1.0,
    dash: '',
    glow: false,
    peaks: [
      { x: 32, dy: -0.7, tension: 0.38 },
      { x: 58, dy: 0.9, tension: 0.32 },
      { x: 82, dy: -0.8, tension: 0.36 },
      { x: 108, dy: 1.0, tension: 0.3 },
      { x: 138, dy: -0.7, tension: 0.38 },
      { x: 164, dy: 0.6, tension: 0.42 },
    ],
  },
  {
    y: 100,
    amplitude: 20,
    opacity: 0.8,
    strokeWidth: 1.2,
    dash: '',
    glow: true,
    peaks: [
      { x: 28, dy: -0.6, tension: 0.35 },
      { x: 52, dy: 1.0, tension: 0.28 },
      { x: 74, dy: -0.9, tension: 0.32 },
      { x: 96, dy: 1.1, tension: 0.26 },
      { x: 120, dy: -1.0, tension: 0.3 },
      { x: 148, dy: 0.8, tension: 0.35 },
      { x: 170, dy: -0.5, tension: 0.4 },
    ],
  },
  {
    y: 100,
    amplitude: 29,
    opacity: 0.95,
    strokeWidth: 1.5,
    dash: '',
    glow: true,
    peaks: [
      { x: 26, dy: -0.5, tension: 0.3 },
      { x: 46, dy: 0.9, tension: 0.24 },
      { x: 64, dy: -1.1, tension: 0.28 },
      { x: 82, dy: 1.3, tension: 0.22 },
      { x: 100, dy: -1.2, tension: 0.26 },
      { x: 118, dy: 1.1, tension: 0.28 },
      { x: 140, dy: -0.8, tension: 0.32 },
      { x: 162, dy: 0.6, tension: 0.36 },
      { x: 178, dy: -0.3, tension: 0.4 },
    ],
  },
];

const RUPTURE = { x: 82, y: 100 - 29 * 1.3 };

/** Marco circular — reemplaza el rectángulo original (más grande) */
const FRAME_CX = 100;
const FRAME_CY = 100;
const FRAME_R = 65;

/**
 * Surge — osciloscopio de tensión.
 * Arquitectura horizontal: canales de lectura superpuestos. Marco circular.
 * Eje Movimiento–Alegría.
 */
export function Surge({
  colorLeft = SURGE_DEFAULT_LEFT,
  colorRight = '#f97316',
  sliderValue = 0,
  defaultColorLeft = SURGE_DEFAULT_LEFT,
  className = '',
}: CardComponentProps) {
  const svgId = useUniqueSvgIds('surge');
  const { main: color } = useAxisRotatedPalette(SURGE_PALETTE, {
    colorLeft,
    colorRight,
    defaultColorLeft,
    sliderValue,
  });

  const clipId = svgId('clip');
  const atmosId = svgId('atmos');
  const auraId = svgId('aura');
  const glowId = svgId('glow');
  const frameGlowId = svgId('frame-glow');
  const ruptureGlowId = svgId('rupture-glow');

  return (
    <svg viewBox="0 0 200 200" width="100%" height="100%" className={className} fill="none">
      <defs>
        <clipPath id={clipId}>
          <circle cx={FRAME_CX} cy={FRAME_CY} r={FRAME_R} />
        </clipPath>

        <radialGradient id={atmosId} cx="42%" cy="50%" r="55%">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="50%" stopColor={color} stopOpacity="0.08" />
          <stop offset="85%" stopColor={color} stopOpacity="0.03" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>

        <radialGradient id={auraId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.12" />
          <stop offset="70%" stopColor={color} stopOpacity="0.04" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>

        <filter id={glowId} x="-30%" y="-100%" width="160%" height="300%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id={frameGlowId} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" />
        </filter>

        <filter id={ruptureGlowId} x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Aura exterior etérea — resplandor difuso */}
      <circle
        cx={FRAME_CX}
        cy={FRAME_CY}
        r={FRAME_R * 1.35}
        fill={`url(#${auraId})`}
        filter={`url(#${frameGlowId})`}
      />

      {/* Marco exterior circular — halo ampliado */}
      <circle
        cx={FRAME_CX}
        cy={FRAME_CY}
        r={FRAME_R}
        fill="none"
        stroke={color}
        strokeWidth="4"
        opacity="0.12"
        filter={`url(#${frameGlowId})`}
      />
      {/* Marco exterior — trazo con resplandor */}
      <circle
        cx={FRAME_CX}
        cy={FRAME_CY}
        r={FRAME_R}
        fill="none"
        stroke={color}
        strokeWidth="1"
        opacity="0.5"
      />
      {/* Marco interior — relleno de atmósfera más intenso */}
      <circle cx={FRAME_CX} cy={FRAME_CY} r={FRAME_R} fill={`url(#${atmosId})`} />

      {/* Retícula de referencia interna */}
      <g clipPath={`url(#${clipId})`} opacity="0.1">
        {[-28, -14, 0, 14, 28].map((dy, i) => (
          <line
            key={`h${i}`}
            x1={13}
            y1={100 + dy}
            x2={187}
            y2={100 + dy}
            stroke={color}
            strokeWidth="0.5"
            strokeDasharray="2 5"
          />
        ))}
        {[0, 1, 2, 3, 4, 5, 6].map((i) => {
          const x = 13 + (i / 6) * 174;
          return (
            <line
              key={`v${i}`}
              x1={x}
              y1={49}
              x2={x}
              y2={151}
              stroke={color}
              strokeWidth="0.5"
              strokeDasharray="2 5"
            />
          );
        })}
      </g>

      {/* Líneas de umbral */}
      <g clipPath={`url(#${clipId})`}>
        <line
          x1={13}
          y1={100 - 22}
          x2={187}
          y2={100 - 22}
          stroke={color}
          strokeWidth="0.7"
          strokeDasharray="4 3"
          opacity="0.35"
        />
        <line
          x1={13}
          y1={100 + 22}
          x2={187}
          y2={100 + 22}
          stroke={color}
          strokeWidth="0.7"
          strokeDasharray="4 3"
          opacity="0.35"
        />
      </g>

      {/* Señales de los canales — todas con resplandor etéreo */}
      <g clipPath={`url(#${clipId})`}>
        {CHANNELS.map((ch, i) => {
          const d = signalPath(ch.y, ch.amplitude, ch.peaks);
          const hasGlow = ch.glow || i >= 2;
          return (
            <g key={i} filter={hasGlow ? `url(#${glowId})` : undefined}>
              {(ch.glow || i >= 3) && (
                <path
                  d={d}
                  fill="none"
                  stroke={color}
                  strokeWidth={ch.strokeWidth * 5}
                  opacity={ch.opacity * 0.18}
                  strokeLinecap="round"
                />
              )}
              <path
                d={d}
                fill="none"
                stroke={i === 4 ? 'white' : color}
                strokeWidth={ch.strokeWidth}
                opacity={ch.opacity}
                strokeDasharray={ch.dash}
                strokeLinecap="round"
              />
            </g>
          );
        })}
      </g>

      {/* Punto de ruptura — resplandor etéreo */}
      <g filter={`url(#${ruptureGlowId})`}>
        <circle cx={RUPTURE.x} cy={RUPTURE.y} r="8" fill={color} opacity="0.2" />
        <circle cx={RUPTURE.x} cy={RUPTURE.y} r="5" fill={color} opacity="0.25" />
        <circle cx={RUPTURE.x} cy={RUPTURE.y} r="2.5" fill={color} opacity="0.65" />
        <circle cx={RUPTURE.x} cy={RUPTURE.y} r="1" fill="white" opacity="0.95" />
      </g>

      {/* Destellos en el marco circular (N, E, S, O) — más brillantes */}
      {[
        { x: FRAME_CX, y: FRAME_CY - FRAME_R },
        { x: FRAME_CX + FRAME_R, y: FRAME_CY },
        { x: FRAME_CX, y: FRAME_CY + FRAME_R },
        { x: FRAME_CX - FRAME_R, y: FRAME_CY },
      ].map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="1.2" fill={color} opacity="0.75" />
      ))}

      {/* Marcas de tiempo en la base */}
      {[0, 1, 2, 3, 4, 5, 6].map((i) => {
        const x = 13 + (i / 6) * 174;
        return (
          <line
            key={i}
            x1={x}
            y1={151}
            x2={x}
            y2={155}
            stroke={color}
            strokeWidth="0.6"
            opacity="0.4"
          />
        );
      })}
    </svg>
  );
}
