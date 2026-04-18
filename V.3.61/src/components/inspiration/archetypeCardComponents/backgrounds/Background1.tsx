import { useMemo } from 'react';
import { useUniqueSvgIds } from '../../QuienTinderCards/useUniqueSvgIds';
import { cn } from '../../../../utils/cn';
import { blendHex } from '../../../../utils/colorUtils';
import type { CardComponentProps } from '../types';

/** Pizarra fría (sin morado): lectura neutra de estudio / interfaz. */
const DEFAULT_LEFT = '#1e293b';
const DEFAULT_RIGHT = '#64748b';

/**
 * Penumbra — fondo predeterminado Fase 1: gradiente oscuro con luces difusas laterales.
 * Sin filtros SVG (evita parpadeo al transformar la tarjeta en el swipe). Eje Visión–Misión.
 */
export function Background1({
  className = '',
  colorLeft = DEFAULT_LEFT,
  colorRight = DEFAULT_RIGHT,
  sliderValue = 50,
}: CardComponentProps) {
  const svgId = useUniqueSvgIds('cb');
  const t = (sliderValue ?? 50) / 100;

  const { wash1, wash2, wash3, vignette, sheen1, sheen2 } = useMemo(() => {
    const blend = (bias: number) => {
      const factor = Math.max(0, Math.min(1, bias + (t - 0.5) * 0.8));
      return blendHex(colorLeft, colorRight, factor);
    };
    return {
      wash1: blend(0.22),
      wash2: blend(0.55),
      wash3: blend(0.78),
      vignette: blend(0.48),
      sheen1: blend(0.12),
      sheen2: blend(0.88),
    };
  }, [colorLeft, colorRight, t]);

  const baseGradId = svgId('base');
  const washAId = svgId('wash-a');
  const washBId = svgId('wash-b');
  const washCId = svgId('wash-c');
  const haze1Id = svgId('haze1');
  const haze2Id = svgId('haze2');
  const vignetteId = svgId('vignette');
  const footId = svgId('foot');

  const baseTop = blendHex('#101018', wash1, 0.35);
  const baseMid = blendHex('#0a0a12', wash2, 0.28);
  const baseBottom = blendHex('#06060c', wash3, 0.32);

  const hazeStroke1 = blendHex(wash1, wash2, 0.5);
  const hazeStroke2 = blendHex(wash2, wash3, 0.5);

  return (
    <svg
      viewBox="0 0 380 440"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      className={cn('absolute inset-0', className)}
    >
      <defs>
        <linearGradient id={baseGradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={baseTop} />
          <stop offset="48%" stopColor={baseMid} />
          <stop offset="100%" stopColor={baseBottom} />
        </linearGradient>
        <radialGradient id={washAId} cx="0%" cy="12%" r="72%">
          <stop offset="0%" stopColor={sheen1} stopOpacity="0.35" />
          <stop offset="45%" stopColor={sheen1} stopOpacity="0.1" />
          <stop offset="100%" stopColor={sheen1} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={washBId} cx="100%" cy="88%" r="68%">
          <stop offset="0%" stopColor={sheen2} stopOpacity="0.3" />
          <stop offset="42%" stopColor={sheen2} stopOpacity="0.08" />
          <stop offset="100%" stopColor={sheen2} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={washCId} cx="50%" cy="40%" r="58%">
          <stop offset="0%" stopColor={wash2} stopOpacity="0.12" />
          <stop offset="55%" stopColor={wash2} stopOpacity="0.03" />
          <stop offset="100%" stopColor={wash2} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={haze1Id} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={hazeStroke1} stopOpacity="0" />
          <stop offset="50%" stopColor={hazeStroke1} stopOpacity="0.07" />
          <stop offset="100%" stopColor={hazeStroke1} stopOpacity="0" />
        </linearGradient>
        <linearGradient id={haze2Id} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={hazeStroke2} stopOpacity="0" />
          <stop offset="50%" stopColor={hazeStroke2} stopOpacity="0.055" />
          <stop offset="100%" stopColor={hazeStroke2} stopOpacity="0" />
        </linearGradient>
        <radialGradient id={vignetteId} cx="50%" cy="50%" r="68%">
          <stop offset="55%" stopColor="#020208" stopOpacity="0" />
          <stop offset="100%" stopColor={blendHex('#020208', vignette, 0.25)} stopOpacity="0.55" />
        </radialGradient>
        <linearGradient id={footId} x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor={blendHex('#040408', wash3, 0.2)} stopOpacity="0" />
          <stop offset="100%" stopColor={blendHex('#040408', wash3, 0.2)} stopOpacity="0.5" />
        </linearGradient>
      </defs>

      <rect width="380" height="440" fill={`url(#${baseGradId})`} />

      <rect width="380" height="440" fill={`url(#${washAId})`} />
      <rect width="380" height="440" fill={`url(#${washBId})`} />
      <rect width="380" height="440" fill={`url(#${washCId})`} />

      <rect x="0" y="88" width="380" height="72" fill={`url(#${haze1Id})`} />
      <rect x="0" y="258" width="380" height="64" fill={`url(#${haze2Id})`} />

      <rect width="380" height="440" fill={`url(#${vignetteId})`} />

      <rect x="0" y="340" width="380" height="100" fill={`url(#${footId})`} />
    </svg>
  );
}
