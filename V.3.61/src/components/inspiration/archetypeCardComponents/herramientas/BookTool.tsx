import { useUniqueSvgIds } from '../../QuienTinderCards/useUniqueSvgIds';
import { blendHex } from '../../../../utils/colorUtils';
import type { CardComponentProps } from '../types';

/**
 * BookTool — Libro. Erudito / Académico.
 * Duodécima variante de herramienta. Colores personalizables según el eje.
 */
export function BookTool({
  colorLeft = '#1e40af',
  colorRight = '#0f766e',
  sliderValue = 0,
  blendedColor,
  className = '',
}: CardComponentProps) {
  const id = useUniqueSvgIds('book');
  const color = blendedColor ?? blendHex(colorLeft, colorRight, sliderValue / 100);
  const gradId = id('g');

  return (
    <svg viewBox="0 0 100 240" className={className} style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id={gradId} cx="50%" cy="45%" r="40%">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="50" cy="110" rx="50" ry="60" fill={`url(#${gradId})`} />

      {/* Tapa trasera */}
      <rect x="1" y="42" width="98" height="140" rx="2" fill={color} opacity="0.25" />

      {/* Páginas (canto) */}
      <rect x="2" y="45" width="96" height="134" rx="1" fill={color} opacity="0.15" />
      <path d="M4,48 L4,176" stroke={color} strokeWidth="0.5" opacity="0.3" />
      <path d="M6,48 L6,176" stroke={color} strokeWidth="0.5" opacity="0.2" />
      <path d="M8,48 L8,176" stroke={color} strokeWidth="0.5" opacity="0.15" />

      {/* Tapa delantera */}
      <rect x="0" y="40" width="100" height="140" rx="3" fill={color} opacity="0.45" />
      <rect x="0" y="40" width="100" height="140" rx="3" fill="none" stroke={color} strokeWidth="1.5" opacity="0.7" />
      <rect x="0" y="40" width="100" height="140" rx="3" fill="none" stroke="white" strokeWidth="0.5" opacity="0.22" />

      {/* Lomo */}
      <path d="M0,43 L0,177" stroke={color} strokeWidth="2.5" opacity="0.6" />
      <path d="M0,43 L0,177" stroke="white" strokeWidth="0.5" opacity="0.18" />

      {/* Decoración de portada */}
      <rect x="20" y="65" width="56" height="32" rx="2" fill="none" stroke={color} strokeWidth="1" opacity="0.5" />
      <rect x="20" y="65" width="56" height="32" rx="2" fill="none" stroke="white" strokeWidth="0.3" opacity="0.2" />

      {/* Símbolo en portada */}
      <circle cx="48" cy="81" r="6" fill="none" stroke={color} strokeWidth="0.8" opacity="0.5" />
      <circle cx="48" cy="81" r="2.5" fill={color} opacity="0.4" />
      <circle cx="48" cy="81" r="1.2" fill="white" opacity="0.4" />

      {/* Líneas de título */}
      <path d="M22,110 L78,110" stroke={color} strokeWidth="1" strokeLinecap="round" opacity="0.35" />
      <path d="M27,118 L73,118" stroke={color} strokeWidth="0.8" strokeLinecap="round" opacity="0.25" />

      {/* Decoración inferior */}
      <path d="M25,155 L75,155" stroke={color} strokeWidth="0.8" strokeLinecap="round" opacity="0.3" />
    </svg>
  );
}
