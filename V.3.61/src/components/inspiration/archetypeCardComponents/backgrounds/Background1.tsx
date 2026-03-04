import { useMemo } from 'react';
import { useUniqueSvgIds } from '../../QuienTinderCards/useUniqueSvgIds';
import { cn } from '../../../../utils/cn';
import { blendHex } from '../../../../utils/colorUtils';
import type { CardComponentProps } from '../types';

const DEFAULT_LEFT = '#48106a';
const DEFAULT_RIGHT = '#1565c0';

/** Coordenadas de estrellas pequeñas (deterministas, sin Math.random). */
const TINY_STARS: [number, number][] = [
  [18, 22], [45, 8], [72, 35], [12, 60], [90, 18], [140, 12], [30, 90], [8, 120],
  [355, 18], [340, 45], [310, 28], [368, 70], [350, 95], [320, 12], [280, 8],
  [15, 200], [10, 250], [22, 310], [8, 350], [30, 380], [18, 420],
  [362, 180], [370, 240], [355, 300], [365, 360], [348, 410],
  [100, 8], [160, 5], [220, 10], [280, 6], [340, 9],
  [50, 430], [120, 438], [200, 435], [280, 432], [340, 428],
  [62, 45], [185, 15], [298, 38], [125, 75], [255, 65], [42, 105],
  [335, 125], [175, 140], [205, 95], [95, 175], [285, 165],
  [25, 275], [155, 235], [245, 255], [365, 265], [75, 295],
  [310, 355], [195, 390], [140, 405], [250, 418],
];

/** Estrellas medianas con brillo suave: [x, y, color]. */
const MEDIUM_STARS: [number, number, string][] = [
  [28, 40, '#e8d5ff'],
  [360, 55, '#d5eeff'],
  [15, 160, '#ffe8d5'],
  [368, 200, '#d5ffee'],
  [35, 340, '#ffd5e8'],
  [355, 320, '#e8d5ff'],
  [105, 6, '#d5eeff'],
  [275, 7, '#ffe8d5'],
  [68, 110, '#d5eeff'],
  [312, 85, '#e8d5ff'],
  [185, 180, '#ffe8d5'],
  [195, 260, '#d5ffee'],
  [120, 320, '#e8d5ff'],
  [265, 310, '#ffd5e8'],
  [42, 380, '#d5eeff'],
  [338, 400, '#ffe8d5'],
];

/**
 * Firmamento — cielo cósmico con nebulosas, estrellas y resplandor central.
 * Fondo predeterminado en Fase 1. Eje Visión–Misión. Sensible al slider del eje.
 */
export function Background1({
  className = '',
  colorLeft = DEFAULT_LEFT,
  colorRight = DEFAULT_RIGHT,
  sliderValue = 50,
}: CardComponentProps) {
  const svgId = useUniqueSvgIds('cb');
  const t = (sliderValue ?? 50) / 100;

  const { skyMid, nebula1, nebula2, nebula3, center, path1, path2 } = useMemo(
    () => {
      const blend = (bias: number) => {
        const factor = Math.max(0, Math.min(1, bias + (t - 0.5) * 0.8));
        return blendHex(colorLeft, colorRight, factor);
      };
      return {
        skyMid: blend(0.5),
        nebula1: blend(0.1),
        nebula2: blend(0.6),
        nebula3: blend(0.35),
        center: blend(t),
        path1: blend(0.15),
        path2: blend(0.7),
      };
    },
    [colorLeft, colorRight, t]
  );
  const skyId = svgId('sky');
  const nebula1Id = svgId('nebula1');
  const nebula2Id = svgId('nebula2');
  const nebula3Id = svgId('nebula3');
  const groundId = svgId('ground');
  const centerId = svgId('center');
  const softId = svgId('soft');
  const softerId = svgId('softer');
  const starGlowId = svgId('star-glow');

  return (
    <svg
      viewBox="0 0 380 440"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      className={cn('absolute inset-0', className)}
    >
      <defs>
        <radialGradient id={skyId} cx="50%" cy="45%" r="70%">
          <stop offset="0%" stopColor={blendHex('#080410', colorLeft, 0.45)} />
          <stop offset="40%" stopColor={blendHex('#050208', skyMid, 0.5)} />
          <stop offset="100%" stopColor="#04020a" />
        </radialGradient>
        <radialGradient id={nebula1Id} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={nebula1} stopOpacity="0.24" />
          <stop offset="100%" stopColor={nebula1} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={nebula2Id} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={nebula2} stopOpacity="0.2" />
          <stop offset="100%" stopColor={nebula2} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={nebula3Id} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={nebula3} stopOpacity="0.16" />
          <stop offset="100%" stopColor={nebula3} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={groundId} cx="50%" cy="0%" r="100%">
          <stop offset="0%" stopColor={blendHex('#1a0a28', colorLeft, 0.55)} stopOpacity="0.6" />
          <stop offset="100%" stopColor="#04020a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={centerId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={center} stopOpacity="0.12" />
          <stop offset="100%" stopColor={center} stopOpacity="0" />
        </radialGradient>
        <filter id={softId}>
          <feGaussianBlur stdDeviation="8" />
        </filter>
        <filter id={softerId}>
          <feGaussianBlur stdDeviation="18" />
        </filter>
        <filter id={starGlowId}>
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect width="380" height="440" fill={`url(#${skyId})`} />

      <ellipse cx="60" cy="80" rx="120" ry="90" fill={`url(#${nebula1Id})`} filter={`url(#${softerId})`} />
      <ellipse cx="320" cy="100" rx="110" ry="80" fill={`url(#${nebula2Id})`} filter={`url(#${softerId})`} />
      <ellipse cx="80" cy="360" rx="100" ry="70" fill={`url(#${nebula3Id})`} filter={`url(#${softerId})`} />
      <ellipse cx="340" cy="380" rx="90" ry="60" fill={`url(#${nebula1Id})`} filter={`url(#${softerId})`} />

      <ellipse cx="190" cy="220" rx="160" ry="140" fill={`url(#${centerId})`} filter={`url(#${softerId})`} />

      {TINY_STARS.map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={i % 5 === 0 ? 1.2 : 0.7}
          fill="white"
          opacity={0.4 + (i % 5) * 0.1}
        />
      ))}

      {MEDIUM_STARS.map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={1.8}
          fill={blendHex(colorLeft, colorRight, 0.2 + (i / MEDIUM_STARS.length) * 0.6 + t * 0.2)}
          opacity={0.7}
          filter={`url(#${starGlowId})`}
        />
      ))}

      <path
        d="M0 150 Q95 130 190 145 Q285 160 380 140"
        fill="none"
        stroke={path1}
        strokeWidth="30"
        opacity="0.055"
        filter={`url(#${softerId})`}
      />
      <path
        d="M0 280 Q95 300 190 285 Q285 270 380 290"
        fill="none"
        stroke={path2}
        strokeWidth="20"
        opacity="0.06"
        filter={`url(#${softerId})`}
      />

      <rect x="0" y="360" width="380" height="80" fill={`url(#${groundId})`} />
    </svg>
  );
}
