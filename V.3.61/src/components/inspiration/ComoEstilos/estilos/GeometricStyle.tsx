import { useId } from 'react';
import type { ComoEstiloProps } from '../types';
import { darken, lighten } from '../estiloColorUtils';

/* ═══════════════════════════════════════
   ESTILO: GEOMÉTRICO
   Estructura, orden, matemática
   ═══════════════════════════════════════ */
export function GeometricStyle({ color = '#818cf8', className = '' }: ComoEstiloProps) {
  const id = useId().replace(/:/g, '');

  const c1 = color;
  const c2 = darken(color, 60);
  const c3 = lighten(color, 70);
  const c4 = darken(color, 110);

  // Módulo base: 30px
  const M = 30;

  return (
    <svg viewBox="0 0 200 300" className={className} style={{ width: '100%', height: '100%' }}>
      <defs>
        <clipPath id={`${id}clip`}>
          <rect width="200" height="300" />
        </clipPath>
      </defs>

      <g clipPath={`url(#${id}clip)`}>
        {/* ══ CUADRÍCULA BASE — sistema modular ══ */}
        {Array.from({ length: 8 }).map((_, i) => (
          <path key={`gv${i}`} d={`M${i * M + 10},0 L${i * M + 10},300`} stroke={c1} strokeWidth="0.4" opacity="0.1" />
        ))}
        {Array.from({ length: 11 }).map((_, i) => (
          <path key={`gh${i}`} d={`M0,${i * M} L200,${i * M}`} stroke={c1} strokeWidth="0.4" opacity="0.1" />
        ))}

        {/* ══ COMPOSICIÓN PRINCIPAL ══ */}

        {/* Triángulo grande superior izquierdo */}
        <path d="M10,0 L130,0 L10,120 Z" fill={c1} opacity="0.35" />
        <path d="M10,0 L130,0 L10,120 Z" fill="none" stroke={c2} strokeWidth="2" opacity="0.6" />

        {/* Triángulo inverso dentro */}
        <path d="M20,10 L80,10 L20,70 Z" fill={c4} opacity="0.25" />

        {/* Rectángulo vertical derecho */}
        <rect x="140" y="0" width="60" height="180" fill={c2} opacity="0.4" />
        <rect x="140" y="0" width="60" height="180" fill="none" stroke={c1} strokeWidth="1.5" opacity="0.5" />

        {/* Subdivisiones del rectángulo */}
        <rect x="140" y="0" width="60" height="60" fill={c1} opacity="0.15" />
        <rect x="140" y="60" width="30" height="60" fill={c3} opacity="0.2" />
        <rect x="170" y="60" width="30" height="60" fill={c1} opacity="0.1" />
        <path d="M140,120 L200,120" stroke={c1} strokeWidth="1" opacity="0.35" />
        <path d="M170,60 L170,120" stroke={c1} strokeWidth="1" opacity="0.3" />

        {/* Cuadrado central — doble borde */}
        <rect x="55" y="105" width="75" height="75" fill={c1} opacity="0.2" />
        <rect x="55" y="105" width="75" height="75" fill="none" stroke={c2} strokeWidth="2.5" opacity="0.6" />
        <rect x="62" y="112" width="61" height="61" fill="none" stroke={c1} strokeWidth="1" opacity="0.35" />

        {/* Diagonal del cuadrado */}
        <path d="M55,105 L130,180" stroke={c2} strokeWidth="1.5" opacity="0.4" />
        <path d="M130,105 L55,180" stroke={c1} strokeWidth="1" opacity="0.25" />

        {/* Triángulo resultante relleno */}
        <path d="M55,105 L130,105 L130,180 Z" fill={c1} opacity="0.1" />

        {/* Círculo inscrito en cuadrado */}
        <circle cx="92" cy="142" r="30" fill="none" stroke={c1} strokeWidth="1.5" opacity="0.45" />

        {/* Centro del círculo */}
        <circle cx="92" cy="142" r="2.5" fill={c2} opacity="0.6" />

        {/* Hexágono debajo */}
        <path d="M70,210 L100,195 L130,210 L130,240 L100,255 L70,240 Z" fill={c2} opacity="0.3" />
        <path d="M70,210 L100,195 L130,210 L130,240 L100,255 L70,240 Z" fill="none" stroke={c1} strokeWidth="2" opacity="0.55" />

        {/* Triángulos dentro del hexágono */}
        <path d="M100,195 L130,240 L70,240 Z" fill={c1} opacity="0.15" />
        <path d="M100,195 L130,240 L70,240 Z" fill="none" stroke={c2} strokeWidth="0.8" opacity="0.3" />

        {/* Centro del hexágono */}
        <circle cx="100" cy="225" r="3" fill={c1} opacity="0.45" />

        {/* Bloque inferior izquierdo — proporción áurea */}
        <rect x="10" y="195" width="50" height="80" fill={c1} opacity="0.25" />
        <rect x="10" y="195" width="50" height="80" fill="none" stroke={c2} strokeWidth="1.5" opacity="0.5" />

        {/* Subdivisión áurea */}
        <rect x="10" y="195" width="50" height="50" fill={c3} opacity="0.15" />
        <rect x="10" y="195" width="50" height="50" fill="none" stroke={c1} strokeWidth="0.8" opacity="0.3" />
        <rect x="10" y="195" width="30" height="30" fill={c2} opacity="0.12" />
        <rect x="10" y="195" width="30" height="30" fill="none" stroke={c1} strokeWidth="0.6" opacity="0.25" />
        <rect x="10" y="195" width="19" height="19" fill={c1} opacity="0.1" />

        {/* Arco en la subdivisión */}
        <path d="M60,195 Q60,245 10,245" fill="none" stroke={c1} strokeWidth="0.8" opacity="0.3" />
        <path d="M40,195 Q40,225 10,225" fill="none" stroke={c1} strokeWidth="0.6" opacity="0.2" />

        {/* Banda inferior — módulos repetidos */}
        <rect x="10" y="280" width="28" height="15" fill={c1} opacity="0.35" />
        <rect x="42" y="280" width="28" height="15" fill={c2} opacity="0.25" />
        <rect x="74" y="280" width="28" height="15" fill={c1} opacity="0.35" />
        <rect x="106" y="280" width="28" height="15" fill={c2} opacity="0.25" />
        <rect x="138" y="280" width="28" height="15" fill={c1} opacity="0.35" />
        <rect x="170" y="280" width="28" height="15" fill={c2} opacity="0.25" />

        {/* ══ LÍNEAS DE CONSTRUCCIÓN ══ */}
        {/* Diagonales principales */}
        <path d="M0,0 L200,300" stroke={c1} strokeWidth="0.6" opacity="0.12" />
        <path d="M200,0 L0,300" stroke={c1} strokeWidth="0.6" opacity="0.12" />

        {/* Línea de tercios */}
        <path d="M67,0 L67,300" stroke={c1} strokeWidth="0.3" opacity="0.08" />
        <path d="M133,0 L133,300" stroke={c1} strokeWidth="0.3" opacity="0.08" />
        <path d="M0,100 L200,100" stroke={c1} strokeWidth="0.3" opacity="0.08" />
        <path d="M0,200 L200,200" stroke={c1} strokeWidth="0.3" opacity="0.08" />

        {/* ══ ELEMENTOS PUNTUALES ══ */}

        {/* Triángulo pequeño suelto */}
        <path d="M155,200 L170,200 L162,188 Z" fill={c1} opacity="0.4" />
        <path d="M155,200 L170,200 L162,188 Z" fill="none" stroke={c2} strokeWidth="1" opacity="0.5" />

        {/* Cuadrado pequeño rotado */}
        <rect x="155" y="225" width="16" height="16" fill={c2} opacity="0.3" transform="rotate(45 163 233)" />
        <rect x="155" y="225" width="16" height="16" fill="none" stroke={c1} strokeWidth="1" opacity="0.45" transform="rotate(45 163 233)" />

        {/* Círculo pequeño aislado */}
        <circle cx="30" cy="155" r="8" fill="none" stroke={c1} strokeWidth="1.5" opacity="0.4" />
        <circle cx="30" cy="155" r="2" fill={c2} opacity="0.45" />

        {/* Puntos en intersecciones clave */}
        {[
          [10, 0],
          [130, 0],
          [10, 120],
          [140, 0],
          [200, 0],
          [140, 180],
          [200, 180],
          [55, 105],
          [130, 105],
          [55, 180],
          [130, 180],
          [100, 195],
          [100, 255],
        ].map(([x, y], i) => (
          <circle key={`pt${i}`} cx={x} cy={y} r="2" fill={c2} opacity={0.35 + (i % 3) * 0.1} />
        ))}

        {/* ══ ANOTACIONES — estilo técnico ══ */}
        {/* Marcador de medida horizontal */}
        <path d="M55,98 L130,98" stroke={c1} strokeWidth="0.5" opacity="0.25" />
        <path d="M55,96 L55,100" stroke={c1} strokeWidth="0.5" opacity="0.25" />
        <path d="M130,96 L130,100" stroke={c1} strokeWidth="0.5" opacity="0.25" />

        {/* Marcador de medida vertical */}
        <path d="M48,105 L48,180" stroke={c1} strokeWidth="0.5" opacity="0.25" />
        <path d="M46,105 L50,105" stroke={c1} strokeWidth="0.5" opacity="0.25" />
        <path d="M46,180 L50,180" stroke={c1} strokeWidth="0.5" opacity="0.25" />

        {/* Ángulo recto marcado */}
        <path d="M55,172 L63,172 L63,180" fill="none" stroke={c1} strokeWidth="0.6" opacity="0.3" />
      </g>
    </svg>
  );
}
