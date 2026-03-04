import type { ComoEstiloProps } from '../types';
import { rotateHue } from '../../../../utils/colorUtils';
import { darken, lighten } from '../estiloColorUtils';

/* ═══════════════════════════════════════
   ESTILO: BAUHAUS
   Primario, funcional, formas básicas, grid
   Colores Bauhaus: rojo, amarillo, azul (primarios)
   ═══════════════════════════════════════ */
export function BauhausStyle({ color = '#818cf8', className = '' }: ComoEstiloProps) {
  const c1 = color;
  const c2 = darken(color, 80);
  const c3 = darken(color, 150);
  const c4 = lighten(color, 70);
  const c5 = lighten(color, 110);
  // Colores primarios Bauhaus: rojo (base), amarillo (+55°), azul (-120°)
  const cYellow = rotateHue(color, 55);
  const cBlue = rotateHue(color, -120);

  return (
    <svg viewBox="0 0 200 300" className={className} style={{ width: '100%', height: '100%' }}>
      {/* ══ GRID ESTRUCTURAL ══ */}
      {[50, 100, 150].map((x, i) => (
        <path key={`gv${i}`} d={`M${x},0 L${x},300`} stroke={c3} strokeWidth="0.5" opacity="0.15" />
      ))}
      {[75, 150, 225].map((y, i) => (
        <path key={`gh${i}`} d={`M0,${y} L200,${y}`} stroke={c3} strokeWidth="0.5" opacity="0.15" />
      ))}

      {/* ══ BLOQUE NEGRO ══ */}
      <rect x="0" y="0" width="100" height="75" fill={c3} opacity="0.85" />

      {/* ══ CÍRCULO — forma primaria 1 (rojo Bauhaus) ══ */}
      <circle cx="130" cy="95" r="55" fill={c1} opacity="0.75" />
      <circle cx="130" cy="95" r="30" fill={c5} opacity="0.9" />
      <circle cx="130" cy="95" r="8" fill={c2} opacity="0.8" />
      <circle cx="130" cy="95" r="55" fill="none" stroke={cBlue} strokeWidth="2" opacity="0.2" />

      {/* ══ TRIÁNGULO — forma primaria 2 (amarillo Bauhaus) ══ */}
      <path d="M0,150 L100,150 L50,75 Z" fill={cYellow} opacity="0.65" />
      <path d="M25,112 L75,112" stroke={c3} strokeWidth="3" opacity="0.7" />

      {/* ══ CUADRADO — forma primaria 3 (azul Bauhaus) ══ */}
      <rect x="110" y="160" width="80" height="80" fill={cBlue} opacity="0.7" />
      <rect x="110" y="160" width="40" height="40" fill={c4} opacity="0.6" />
      <rect x="150" y="200" width="40" height="40" fill={cYellow} opacity="0.5" />

      {/* ══ RECTÁNGULO HORIZONTAL ══ */}
      <rect x="0" y="245" width="200" height="55" fill={c1} opacity="0.55" />
      <rect x="0" y="245" width="65" height="55" fill={c3} opacity="0.75" />
      <rect x="65" y="245" width="35" height="55" fill={c4} opacity="0.5" />

      {/* ══ RECTÁNGULO VERTICAL DERECHO ══ */}
      <rect x="175" y="0" width="25" height="155" fill={cBlue} opacity="0.65" />

      {/* ══ LÍNEAS ESTRUCTURALES ══ */}
      <path d="M0,150 L110,150" stroke={c3} strokeWidth="4" opacity="0.8" />
      <path d="M100,75 L100,245" stroke={c3} strokeWidth="3" opacity="0.7" />
      <path d="M0,240 L110,160" stroke={cBlue} strokeWidth="2.5" opacity="0.5" />

      {/* ══ SEMICÍRCULO ══ */}
      <path d="M0,195 A50,50 0 0,1 0,95" fill={cYellow} opacity="0.5" />
      <path d="M0,195 A50,50 0 0,1 0,95" fill="none" stroke={c3} strokeWidth="2" opacity="0.6" />

      {/* ══ ARCO EN ESQUINA ══ */}
      <path d="M200,245 A40,40 0 0,0 160,285 L200,285 Z" fill={cBlue} opacity="0.45" />

      {/* ══ PEQUEÑO CUADRADO ROTADO ══ */}
      <rect x="15" y="180" width="25" height="25" fill={c1} opacity="0.6" transform="rotate(45 27.5 192.5)" />

      {/* ══ CÍRCULOS PEQUEÑOS ══ */}
      <circle cx="30" cy="35" r="12" fill={cYellow} opacity="0.8" />
      <circle cx="30" cy="35" r="5" fill={c3} opacity="0.9" />
      <circle cx="70" cy="35" r="8" fill={c1} opacity="0.7" />
      <circle cx="150" cy="270" r="10" fill={c5} opacity="0.7" />
      <circle cx="150" cy="270" r="4" fill={c2} opacity="0.8" />

      {/* ══ TIPOGRAFÍA GEOMÉTRICA — "BAU" ══ */}
      <g opacity="0.6">
        <rect x="15" y="255" width="4" height="20" fill={c5} />
        <path d="M19,255 A5,5 0 0,1 19,265" fill="none" stroke={c5} strokeWidth="4" />
        <path d="M19,265 A5,5 0 0,1 19,275" fill="none" stroke={c5} strokeWidth="4" />
      </g>
      <g opacity="0.6">
        <path d="M35,275 L40,255 L45,275" fill="none" stroke={c5} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M37,268 L43,268" stroke={c5} strokeWidth="3" />
      </g>
      <g opacity="0.6">
        <path d="M52,255 L52,268 A6,6 0 0,0 64,268 L64,255" fill="none" stroke={c5} strokeWidth="4" strokeLinecap="round" />
      </g>

      {/* ══ LÍNEAS FINAS DE CONSTRUCCIÓN ══ */}
      <path d="M100,0 L100,75" stroke={c2} strokeWidth="1" opacity="0.4" />
      <path d="M0,75 L100,75" stroke={c2} strokeWidth="1" opacity="0.4" />
      <path d="M75,95 L185,95" stroke={c3} strokeWidth="0.8" opacity="0.3" />

      {/* ══ PUNTOS DE INTERSECCIÓN ══ */}
      {[
        [100, 75],
        [100, 150],
        [50, 150],
        [110, 160],
        [190, 160],
        [110, 240],
        [190, 240],
        [0, 245],
        [100, 245],
        [200, 245],
      ].map(([x, y], i) => (
        <circle key={`pt${i}`} cx={x} cy={y} r="2.5" fill={c3} opacity={0.5 + (i % 3) * 0.15} />
      ))}

      {/* ══ BARRA VERTICAL IZQUIERDA ══ */}
      <rect x="0" y="150" width="8" height="95" fill={c2} opacity="0.6" />

      {/* ══ ELEMENTO FLOTANTE ══ */}
      <rect x="55" y="165" width="35" height="12" fill={c3} opacity="0.55" />
      <rect x="55" y="180" width="25" height="8" fill={c1} opacity="0.45" />

      {/* ══ TRIÁNGULO PEQUEÑO ══ */}
      <path d="M175,175 L190,175 L182,160 Z" fill={cYellow} opacity="0.6" />

      {/* ══ LÍNEA DIAGONAL FINA ══ */}
      <path d="M110,240 L190,160" stroke={cBlue} strokeWidth="1.5" opacity="0.4" />

      {/* ══ CUARTO DE CÍRCULO ══ */}
      <path d="M0,0 A30,30 0 0,0 30,30 L30,0 Z" fill={cBlue} opacity="0.35" />

      {/* ══ FORMA COMPUESTA CENTRAL ══ */}
      <rect x="55" y="85" width="30" height="50" fill="none" stroke={c3} strokeWidth="2.5" opacity="0.5" />
      <rect x="55" y="110" width="30" height="25" fill={cBlue} opacity="0.4" />
      <circle cx="70" cy="97" r="4" fill={c1} opacity="0.6" />

      {/* ══ ESCALA ══ */}
      <rect x="125" y="255" width="8" height="25" fill={c3} opacity="0.5" />
      <rect x="135" y="260" width="6" height="20" fill={cBlue} opacity="0.45" />
      <rect x="143" y="265" width="4" height="15" fill={c1} opacity="0.4" />

      {/* ══ ACENTO FINAL ══ */}
      <path d="M195,95 L195,150" stroke={c1} strokeWidth="4" opacity="0.7" />
    </svg>
  );
}
