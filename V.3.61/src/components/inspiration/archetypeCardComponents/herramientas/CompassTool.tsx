import { useUniqueSvgIds } from '../../QuienTinderCards/useUniqueSvgIds';
import { blendHex } from '../../../../utils/colorUtils';
import type { CardComponentProps } from '../types';

/**
 * CompassTool — Compás de dibujo. Arquitecto / Ingeniero.
 * Decimotercera variante de herramienta. Colores personalizables según el eje.
 */
export function CompassTool({
  colorLeft = '#0f766e',
  colorRight = '#1e40af',
  sliderValue = 0,
  blendedColor,
  className = '',
}: CardComponentProps) {
  const id = useUniqueSvgIds('compass');
  const color = blendedColor ?? blendHex(colorLeft, colorRight, sliderValue / 100);
  const gradId = id('g');

  return (
    <svg viewBox="0 0 80 240" className={className} style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id={gradId} cx="50%" cy="15%" r="25%">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>

      <ellipse cx="40" cy="38" rx="18" ry="18" fill={`url(#${gradId})`} />

      {/* Cabezal / pivote */}
      <circle cx="40" cy="35" r="6" fill={color} opacity="0.5" />
      <circle cx="40" cy="35" r="6" fill="none" stroke={color} strokeWidth="1.2" opacity="0.65" />
      <circle cx="40" cy="35" r="6" fill="none" stroke="white" strokeWidth="0.4" opacity="0.25" />
      <circle cx="40" cy="35" r="2.5" fill="white" opacity="0.35" />

      {/* Pata izquierda (con punta) */}
      <path d="M38,40 L18,195" stroke={color} strokeWidth="4.5" strokeLinecap="round" opacity="0.65" />
      <path d="M38,40 L18,195" stroke="white" strokeWidth="0.8" strokeLinecap="round" opacity="0.18" />

      {/* Punta izquierda */}
      <path d="M16,190 L18,205 L20,190" fill={color} opacity="0.55" />
      <path d="M16,190 L18,205 L20,190" fill="none" stroke="white" strokeWidth="0.4" opacity="0.2" />

      {/* Pata derecha (con lápiz) */}
      <path d="M42,40 L62,195" stroke={color} strokeWidth="4.5" strokeLinecap="round" opacity="0.65" />
      <path d="M42,40 L62,195" stroke="white" strokeWidth="0.8" strokeLinecap="round" opacity="0.18" />

      {/* Punta lápiz derecho */}
      <path d="M60,188 L62,205 L64,188" fill={color} opacity="0.6" />
      <path d="M60,188 L62,205 L64,188" fill="none" stroke="white" strokeWidth="0.4" opacity="0.2" />
      <circle cx="62" cy="205" r="1" fill="white" opacity="0.35" />

      {/* Arco trazado */}
      <path d="M18,200 Q40,165 62,200" fill="none" stroke={color} strokeWidth="0.8" strokeDasharray="3,3" opacity="0.35" />

      {/* Tornillo de ajuste */}
      <path d="M32,70 L48,70" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.45" />
      <path d="M32,70 L48,70" stroke="white" strokeWidth="0.5" strokeLinecap="round" opacity="0.18" />
    </svg>
  );
}
