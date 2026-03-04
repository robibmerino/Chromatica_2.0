import { useMemo } from 'react';
import { useUniqueSvgIds } from '../../QuienTinderCards/useUniqueSvgIds';
import { cn } from '../../../../utils/cn';
import { blendHex } from '../../../../utils/colorUtils';
import type { CardComponentProps } from '../types';
import { deterministicHash } from './sharedUtils';

const DEFAULT_LEFT = '#128248';
const DEFAULT_RIGHT = '#6d28d9';

/** Bias por onda (0–1) para variación; el slider desplaza el conjunto. */
const WAVE_BIASES = [0.1, 0.35, 0.6, 0.2, 0.8, 0.45];
const WAVE_SPECS = [
  { opacity: 0.135, freq: 0.018, amp: 38, yBase: 60, phase: 0 },
  { opacity: 0.112, freq: 0.022, amp: 28, yBase: 90, phase: 1.2 },
  { opacity: 0.105, freq: 0.015, amp: 45, yBase: 50, phase: 2.4 },
  { opacity: 0.09, freq: 0.020, amp: 32, yBase: 75, phase: 0.8 },
  { opacity: 0.12, freq: 0.025, amp: 22, yBase: 100, phase: 1.8 },
  { opacity: 0.0975, freq: 0.017, amp: 40, yBase: 65, phase: 3.0 },
];

function buildWavePath(
  freq: number,
  amp: number,
  yBase: number,
  phase: number
): string {
  const pts: string[] = [];
  const steps = 40;
  for (let i = 0; i <= steps; i++) {
    const x = (i / steps) * 200;
    const y =
      yBase +
      Math.sin(x * freq * Math.PI + phase) * amp +
      Math.sin(x * freq * 2.3 * Math.PI + phase * 0.7) * amp * 0.4;
    pts.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`);
  }
  pts.push('L200,0 L0,0 Z');
  return pts.join(' ');
}

/**
 * Boreal — aurora boreal (código original).
 * Luminosidad reducida y más estrellas. Eje Silencio–Energía. Sensible al slider.
 */
export function Background2({
  className = '',
  colorLeft = DEFAULT_LEFT,
  colorRight = DEFAULT_RIGHT,
  sliderValue = 0,
}: CardComponentProps) {
  const svgId = useUniqueSvgIds('boreal');
  const baseId = svgId('base');
  const blur2Id = svgId('blur2');
  const t = sliderValue / 100;

  const waves = useMemo(
    () =>
      WAVE_SPECS.map((spec, i) => ({
        ...spec,
        color: blendHex(
          colorLeft,
          colorRight,
          WAVE_BIASES[i] + (t - 0.5) * 0.6
        ),
      })),
    [colorLeft, colorRight, t]
  );

  return (
    <svg
      viewBox="0 0 200 320"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      className={cn('absolute inset-0', className)}
    >
      <defs>
        <radialGradient id={baseId} cx="50%" cy="0%" r="100%">
          <stop offset="0%" stopColor="#0a0a1a" />
          <stop offset="60%" stopColor="#050510" />
          <stop offset="100%" stopColor="#020208" />
        </radialGradient>
        <filter id={blur2Id}>
          <feGaussianBlur stdDeviation="8" />
        </filter>
      </defs>

      <rect width="200" height="320" fill={`url(#${baseId})`} />

      {waves.map((w, i) => (
        <g key={i} filter={`url(#${blur2Id})`}>
          <path
            d={buildWavePath(w.freq, w.amp, w.yBase, w.phase)}
            fill={w.color}
            opacity={w.opacity}
          />
          <path
            d={buildWavePath(w.freq * 1.1, w.amp * 0.6, w.yBase + 12, w.phase + 0.5)}
            fill={w.color}
            opacity={w.opacity * 0.6}
          />
        </g>
      ))}

      {/* Estrellas tenues (distribución orgánica, 70 estrellas) */}
      {Array.from({ length: 70 }).map((_, i) => {
        const x = deterministicHash(i) * 200;
        const y = deterministicHash(i * 2 + 1) * 100;
        const r = 0.4 + deterministicHash(i * 3 + 2) * 0.5;
        const opacity = 0.15 + deterministicHash(i * 5 + 3) * 0.2;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={r}
            fill="white"
            opacity={opacity}
          />
        );
      })}

      {/* Velo oscuro central para despejar el centro */}
      <ellipse
        cx="100"
        cy="180"
        rx="70"
        ry="90"
        fill="#020208"
        opacity="0.7"
        filter={`url(#${blur2Id})`}
      />

      {/* Reflejo sutil en el suelo */}
      {waves.slice(0, 3).map((w, i) => (
        <g key={`ref-${i}`} filter={`url(#${blur2Id})`}>
          <path
            d={buildWavePath(w.freq, w.amp * 0.4, 280 - w.yBase * 0.3, w.phase + Math.PI)}
            fill={w.color}
            opacity={w.opacity * 0.5}
          />
        </g>
      ))}
    </svg>
  );
}
