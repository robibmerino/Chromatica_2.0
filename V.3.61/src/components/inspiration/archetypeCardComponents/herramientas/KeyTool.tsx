import { useUniqueSvgIds } from '../../QuienTinderCards/useUniqueSvgIds';
import { blendHex } from '../../../../utils/colorUtils';
import type { CardComponentProps } from '../types';

const WARD_PATH = 'M40,188 L40,212 L56,212 L56,204 L48,204 L48,196 L56,196 L56,188 Z';

/**
 * KeyTool — Llave. Guardián / Buscador.
 * Sexta variante de herramienta. Colores personalizables según el eje.
 */
export function KeyTool({
  colorLeft = '#d4af37',
  colorRight = '#1e40af',
  sliderValue = 0,
  blendedColor,
  className = '',
}: CardComponentProps) {
  const id = useUniqueSvgIds('key');
  const color = blendedColor ?? blendHex(colorLeft, colorRight, sliderValue / 100);
  const gradId = id('g');

  return (
    <svg viewBox="0 0 80 240" className={className} style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id={gradId} cx="50%" cy="18%" r="30%">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="40" cy="50" rx="28" ry="30" fill={`url(#${gradId})`} />

      {/* Ojo */}
      <circle cx="40" cy="48" r="20" fill={color} opacity="0.45" />
      <circle cx="40" cy="48" r="12" fill="black" opacity="0.6" />
      <circle cx="40" cy="48" r="20" fill="none" stroke={color} strokeWidth="1.5" opacity="0.7" />
      <circle cx="40" cy="48" r="20" fill="none" stroke="white" strokeWidth="0.5" opacity="0.3" />
      <circle cx="40" cy="48" r="12" fill="none" stroke={color} strokeWidth="0.8" opacity="0.5" />

      {/* Caña */}
      <path d="M40,68 L40,188" stroke={color} strokeWidth="6" strokeLinecap="round" opacity="0.7" />
      <path d="M40,68 L40,188" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.2" />

      {/* Paletón */}
      <path d={WARD_PATH} fill={color} opacity="0.5" />
      <path d={WARD_PATH} fill="none" stroke={color} strokeWidth="1.2" opacity="0.65" />
      <path d={WARD_PATH} fill="none" stroke="white" strokeWidth="0.4" opacity="0.25" />

      <circle cx="35" cy="42" r="2" fill="white" opacity="0.35" />
    </svg>
  );
}
