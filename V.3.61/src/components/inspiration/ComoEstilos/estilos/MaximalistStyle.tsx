import { useId } from 'react';
import type { ComoEstiloProps } from '../types';
import { darken } from '../estiloColorUtils';

/* ═══════════════════════════════════════
   ESTILO: MAXIMALISTA
   Densidad, saturación, horror vacui
   ═══════════════════════════════════════ */
export function MaximalistStyle({ color = '#818cf8', className = '' }: ComoEstiloProps) {
  const id = useId().replace(/:/g, '');

  const c1 = color;
  const c2 = darken(color, 60);
  const c3 = darken(color, 120);

  return (
    <svg viewBox="0 0 200 300" className={className} style={{ width: '100%', height: '100%' }}>
      <defs>
        {/* Patrón rayas diagonales gruesas */}
        <pattern id={`${id}stripes`} width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="6" height="10" fill={c1} opacity="0.7" />
          <rect x="6" width="4" height="10" fill={c2} opacity="0.5" />
        </pattern>

        {/* Patrón puntos densos */}
        <pattern id={`${id}dots`} width="8" height="8" patternUnits="userSpaceOnUse">
          <circle cx="4" cy="4" r="2.5" fill={c1} opacity="0.6" />
          <circle cx="0" cy="0" r="1.5" fill={c3} opacity="0.4" />
          <circle cx="8" cy="0" r="1.5" fill={c3} opacity="0.4" />
          <circle cx="0" cy="8" r="1.5" fill={c3} opacity="0.4" />
          <circle cx="8" cy="8" r="1.5" fill={c3} opacity="0.4" />
        </pattern>

        {/* Patrón chevron */}
        <pattern id={`${id}chev`} width="16" height="12" patternUnits="userSpaceOnUse">
          <path d="M0,12 L8,4 L16,12" fill="none" stroke={c1} strokeWidth="2.5" opacity="0.55" />
          <path d="M0,8 L8,0 L16,8" fill="none" stroke={c2} strokeWidth="1.5" opacity="0.35" />
        </pattern>

        {/* Patrón cuadrícula */}
        <pattern id={`${id}grid`} width="14" height="14" patternUnits="userSpaceOnUse">
          <rect width="14" height="14" fill="none" stroke={c1} strokeWidth="1.5" opacity="0.4" />
          <rect x="3" y="3" width="8" height="8" fill={c2} opacity="0.15" />
        </pattern>

        {/* Patrón zigzag */}
        <pattern id={`${id}zig`} width="20" height="8" patternUnits="userSpaceOnUse">
          <path d="M0,8 L5,0 L10,8 L15,0 L20,8" fill="none" stroke={c1} strokeWidth="2" opacity="0.5" />
        </pattern>
      </defs>

      {/* ══ FONDO — cuadrícula base ══ */}
      <rect width="200" height="300" fill={`url(#${id}grid)`} />

      {/* ══ BLOQUES GRANDES DE FONDO ══ */}
      {/* Bloque superior izquierdo — rayas */}
      <rect x="0" y="0" width="95" height="110" fill={`url(#${id}stripes)`} opacity="0.4" />

      {/* Bloque inferior derecho — puntos */}
      <rect x="90" y="170" width="110" height="130" fill={`url(#${id}dots)`} opacity="0.45" />

      {/* Banda diagonal ancha */}
      <path d="M0,180 L120,0 L160,0 L0,220 Z" fill={c1} opacity="0.18" />
      <path d="M40,300 L200,80 L200,130 L80,300 Z" fill={c2} opacity="0.15" />

      {/* ══ FORMAS GEOMÉTRICAS BOLD — capa media ══ */}

      {/* Círculo grande cortado */}
      <circle cx="155" cy="65" r="55" fill={c1} opacity="0.35" />
      <circle cx="155" cy="65" r="55" fill={`url(#${id}chev)`} opacity="0.5" />
      <circle cx="155" cy="65" r="55" fill="none" stroke={c2} strokeWidth="3" opacity="0.6" />

      {/* Rectángulo vertical fuerte */}
      <rect x="15" y="80" width="45" height="140" rx="4" fill={c2} opacity="0.5" />
      <rect x="15" y="80" width="45" height="140" rx="4" fill={`url(#${id}zig)`} opacity="0.6" />
      <rect x="15" y="80" width="45" height="140" rx="4" fill="none" stroke={c1} strokeWidth="2.5" opacity="0.7" />

      {/* Triángulo grande */}
      <path d="M100,95 L170,230 L30,230 Z" fill={c1} opacity="0.25" />
      <path d="M100,95 L170,230 L30,230 Z" fill={`url(#${id}dots)`} opacity="0.35" />
      <path d="M100,95 L170,230 L30,230 Z" fill="none" stroke={c3} strokeWidth="2.5" opacity="0.6" />

      {/* Semicírculo inferior */}
      <path d="M30,300 A70,70 0 0,1 170,300 Z" fill={c2} opacity="0.4" />
      <path d="M30,300 A70,70 0 0,1 170,300 Z" fill={`url(#${id}stripes)`} opacity="0.3" />
      <path d="M30,300 A70,70 0 0,1 170,300 Z" fill="none" stroke={c1} strokeWidth="2" opacity="0.55" />

      {/* Rombo central */}
      <path d="M100,110 L145,165 L100,220 L55,165 Z" fill={c1} opacity="0.3" />
      <path d="M100,110 L145,165 L100,220 L55,165 Z" fill="none" stroke="white" strokeWidth="2" opacity="0.35" />

      {/* ══ FORMAS SUPERPUESTAS BOLD — capa alta ══ */}

      {/* Círculos intermedios */}
      <circle cx="60" cy="55" r="30" fill={c3} opacity="0.45" />
      <circle cx="60" cy="55" r="30" fill="none" stroke={c1} strokeWidth="3" opacity="0.6" />
      <circle cx="60" cy="55" r="22" fill="none" stroke="white" strokeWidth="1.5" opacity="0.25" />

      <circle cx="150" cy="200" r="35" fill={c1} opacity="0.3" />
      <circle cx="150" cy="200" r="35" fill={`url(#${id}grid)`} opacity="0.5" />
      <circle cx="150" cy="200" r="35" fill="none" stroke={c2} strokeWidth="3" opacity="0.55" />

      {/* Barras horizontales gruesas */}
      <rect x="65" y="130" width="130" height="10" rx="5" fill={c1} opacity="0.6" />
      <rect x="5" y="148" width="140" height="8" rx="4" fill={c2} opacity="0.5" />
      <rect x="50" y="162" width="145" height="7" rx="3.5" fill={c3} opacity="0.45" />

      {/* Cuadrado rotado */}
      <rect x="75" y="40" width="35" height="35" rx="2" fill={c1} opacity="0.45" transform="rotate(25 92 57)" />
      <rect x="75" y="40" width="35" height="35" rx="2" fill={`url(#${id}dots)`} opacity="0.4" transform="rotate(25 92 57)" />
      <rect x="75" y="40" width="35" height="35" rx="2" fill="none" stroke="white" strokeWidth="1.5" opacity="0.3" transform="rotate(25 92 57)" />

      {/* Arco grueso */}
      <path d="M20,240 Q100,180 180,240" fill="none" stroke={c1} strokeWidth="8" strokeLinecap="round" opacity="0.45" />
      <path d="M25,245 Q100,190 175,245" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />

      {/* ══ ELEMENTOS DECORATIVOS DENSOS ══ */}

      {/* Puntos grandes sueltos */}
      {[
        [30, 30, 8],
        [170, 28, 6],
        [25, 260, 7],
        [175, 270, 9],
        [100, 15, 5],
        [100, 285, 6],
        [15, 150, 5],
        [185, 150, 5],
      ].map(([x, y, r], i) => (
        <g key={`bd${i}`}>
          <circle
            cx={x}
            cy={y}
            r={r as number}
            fill={i % 2 === 0 ? c1 : c2}
            opacity={0.5 + (i % 3) * 0.1}
          />
          <circle cx={x} cy={y} r={r as number} fill="none" stroke="white" strokeWidth="1" opacity="0.2" />
        </g>
      ))}

      {/* Cruces gruesas */}
      {[
        [40, 180],
        [160, 120],
        [85, 255],
        [140, 45],
      ].map(([x, y], i) => (
        <g key={`cr${i}`} opacity={0.45 + (i % 2) * 0.1}>
          <path d={`M${Number(x) - 6},${y} L${Number(x) + 6},${y}`} stroke={c1} strokeWidth="3" strokeLinecap="round" />
          <path d={`M${x},${Number(y) - 6} L${x},${Number(y) + 6}`} stroke={c1} strokeWidth="3" strokeLinecap="round" />
        </g>
      ))}

      {/* Líneas cortas sueltas */}
      {[
        [12, 42, 28, 38],
        [172, 260, 190, 252],
        [70, 270, 90, 268],
        [120, 30, 135, 22],
        [5, 200, 18, 195],
        [182, 190, 195, 200],
      ].map(([x1, y1, x2, y2], i) => (
        <path
          key={`sl${i}`}
          d={`M${x1},${y1} L${x2},${y2}`}
          stroke={i % 2 === 0 ? c1 : 'white'}
          strokeWidth="2"
          strokeLinecap="round"
          opacity={0.3 + (i % 3) * 0.1}
        />
      ))}

      {/* Triángulos pequeños dispersos */}
      {[
        [120, 255],
        [75, 22],
        [170, 165],
        [30, 120],
        [155, 285],
      ].map(([x, y], i) => (
        <path
          key={`st${i}`}
          d={`M${x},${Number(y) - 6} L${Number(x) + 5},${Number(y) + 4} L${Number(x) - 5},${Number(y) + 4} Z`}
          fill={i % 2 === 0 ? c1 : c2}
          opacity={0.4 + (i % 3) * 0.1}
          stroke={i % 2 === 0 ? 'white' : c1}
          strokeWidth="0.8"
        />
      ))}

      {/* ══ CENTRO FOCAL — forma compuesta ══ */}
      <circle cx="100" cy="165" r="20" fill={c3} opacity="0.6" />
      <circle cx="100" cy="165" r="20" fill="none" stroke={c1} strokeWidth="3" opacity="0.7" />
      <circle cx="100" cy="165" r="14" fill={c1} opacity="0.5" />
      <circle cx="100" cy="165" r="14" fill="none" stroke="white" strokeWidth="1.5" opacity="0.35" />
      <circle cx="100" cy="165" r="8" fill={c2} opacity="0.7" />
      <circle cx="100" cy="165" r="8" fill="none" stroke="white" strokeWidth="1" opacity="0.4" />
      <circle cx="100" cy="165" r="3.5" fill="white" opacity="0.8" />
    </svg>
  );
}
