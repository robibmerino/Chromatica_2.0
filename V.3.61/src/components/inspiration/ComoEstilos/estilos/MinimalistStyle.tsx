import { useId } from 'react';
import type { ComoEstiloProps } from '../types';
import { darken } from '../estiloColorUtils';

/* ═══════════════════════════════════════
   ESTILO: MINIMALISTA
   Espacio vacío, precisión, esencia
   ═══════════════════════════════════════ */
export function MinimalistStyle({ color = '#818cf8', className = '' }: ComoEstiloProps) {
  const id = useId().replace(/:/g, '');

  const c1 = color;
  const c2 = darken(color, 70);

  return (
    <svg viewBox="0 0 200 300" className={className} style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id={`${id}lg`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={c1} stopOpacity="0.03" />
          <stop offset="100%" stopColor={c1} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* ══ FONDO — casi nada ══ */}
      <rect width="200" height="300" fill={`url(#${id}lg)`} />

      {/* ══ UNA sola línea horizontal ══ */}
      <path d="M40,150 L160,150" stroke={c1} strokeWidth="1.5" opacity="0.6" />

      {/* ══ UN solo círculo ══ */}
      <circle cx="100" cy="150" r="24" fill="none" stroke={c1} strokeWidth="1.5" opacity="0.55" />

      {/* ══ UN punto ══ */}
      <circle cx="100" cy="150" r="3" fill={c2} opacity="0.7" />
    </svg>
  );
}
