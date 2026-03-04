import type { ComoEstiloProps } from '../types';
import { darken } from '../estiloColorUtils';

/* ═══════════════════════════════════════
   ESTILO: BLUEPRINT
   Técnico, plano, cianotipo, ingeniería
   ═══════════════════════════════════════ */
export function BlueprintStyle({ color = '#818cf8', className = '' }: ComoEstiloProps) {
  const c1 = color;
  const c2 = darken(color, 40);

  return (
    <svg viewBox="0 0 200 300" className={className} style={{ width: '100%', height: '100%' }}>

      {/* ══ CUADRÍCULA — papel técnico ══ */}
      {/* Subdivisiones finas */}
      {Array.from({ length: 41 }).map((_, i) => (
        <path key={`gvf${i}`} d={`M${i * 5},0 L${i * 5},300`}
          stroke={c1} strokeWidth="0.15" opacity="0.12" />
      ))}
      {Array.from({ length: 61 }).map((_, i) => (
        <path key={`ghf${i}`} d={`M0,${i * 5} L200,${i * 5}`}
          stroke={c1} strokeWidth="0.15" opacity="0.12" />
      ))}
      {/* Divisiones mayores */}
      {Array.from({ length: 9 }).map((_, i) => (
        <path key={`gv${i}`} d={`M${i * 25},0 L${i * 25},300`}
          stroke={c1} strokeWidth="0.4" opacity="0.2" />
      ))}
      {Array.from({ length: 13 }).map((_, i) => (
        <path key={`gh${i}`} d={`M0,${i * 25} L200,${i * 25}`}
          stroke={c1} strokeWidth="0.4" opacity="0.2" />
      ))}

      {/* ══ CAJETÍN — carátula técnica ══ */}
      <rect x="120" y="260" width="75" height="35" fill="none"
        stroke={c1} strokeWidth="1.2" opacity="0.55" />
      <path d="M120,275 L195,275" stroke={c1} strokeWidth="0.8" opacity="0.45" />
      <path d="M120,285 L195,285" stroke={c1} strokeWidth="0.8" opacity="0.45" />
      <path d="M160,260 L160,295" stroke={c1} strokeWidth="0.8" opacity="0.45" />

      {/* Textos simulados */}
      <rect x="162" y="263" width="28" height="4" fill={c1} opacity="0.3" />
      <rect x="162" y="278" width="20" height="3" fill={c1} opacity="0.2" />
      <rect x="162" y="287" width="25" height="3" fill={c1} opacity="0.2" />
      <rect x="123" y="263" width="32" height="4" fill={c1} opacity="0.25" />
      <rect x="123" y="278" width="22" height="3" fill={c1} opacity="0.2" />

      <text x="185" y="293" fontSize="5" fill={c1} opacity="0.4"
        fontFamily="monospace" textAnchor="middle">1:50</text>

      {/* ══ PLANTA — objeto principal ══ */}
      {/* Muros exteriores */}
      <rect x="30" y="40" width="120" height="90" fill="none"
        stroke={c1} strokeWidth="2" opacity="0.65" />

      {/* Muro interior horizontal */}
      <path d="M30,85 L100,85" stroke={c1} strokeWidth="2" opacity="0.6" />

      {/* Muro interior vertical */}
      <path d="M100,40 L100,130" stroke={c1} strokeWidth="2" opacity="0.6" />

      {/* Tabique fino */}
      <path d="M60,85 L60,130" stroke={c1} strokeWidth="1.2" opacity="0.5" />

      {/* ══ PUERTAS ══ */}
      {/* Puerta 1 — arco de apertura */}
      <path d="M100,70 L100,55" stroke={c2} strokeWidth="2.5" opacity="0.25" />
      <path d="M100,55 A15,15 0 0,1 115,70"
        fill="none" stroke={c1} strokeWidth="0.8" opacity="0.45"
        strokeDasharray="2,2" />
      <path d="M100,55 L115,55" stroke={c1} strokeWidth="0.6" opacity="0.35" />

      {/* Puerta 2 */}
      <path d="M70,85 L85,85" stroke={c2} strokeWidth="2.5" opacity="0.25" />
      <path d="M70,85 A15,15 0 0,0 70,100"
        fill="none" stroke={c1} strokeWidth="0.8" opacity="0.45"
        strokeDasharray="2,2" />
      <path d="M70,85 L70,100" stroke={c1} strokeWidth="0.6" opacity="0.35" />

      {/* Puerta 3 — entrada principal */}
      <path d="M60,130 L80,130" stroke={c2} strokeWidth="2.5" opacity="0.25" />
      <path d="M60,130 A20,20 0 0,1 60,110"
        fill="none" stroke={c1} strokeWidth="0.8" opacity="0.45"
        strokeDasharray="2,2" />

      {/* ══ VENTANAS ══ */}
      {/* Ventana superior */}
      <path d="M55,40 L80,40" stroke={c1} strokeWidth="1" opacity="0.45" />
      <path d="M55,38 L55,42 M80,38 L80,42"
        stroke={c1} strokeWidth="1" opacity="0.45" />
      <path d="M55,40 L67,36 M80,40 L67,36"
        fill="none" stroke={c1} strokeWidth="0.6" opacity="0.35" />

      {/* Ventana derecha */}
      <path d="M150,60 L150,80" stroke={c1} strokeWidth="1" opacity="0.45" />
      <path d="M148,60 L152,60 M148,80 L152,80"
        stroke={c1} strokeWidth="1" opacity="0.45" />
      <path d="M150,60 L154,70 M150,80 L154,70"
        fill="none" stroke={c1} strokeWidth="0.6" opacity="0.35" />

      {/* Ventana lateral izquierda */}
      <path d="M30,60 L30,75" stroke={c1} strokeWidth="1" opacity="0.45" />
      <path d="M28,60 L32,60 M28,75 L32,75"
        stroke={c1} strokeWidth="1" opacity="0.45" />

      {/* ══ COTAS / DIMENSIONES ══ */}
      {/* Cota horizontal superior */}
      <path d="M30,32 L150,32" stroke={c1} strokeWidth="0.6" opacity="0.4" />
      <path d="M30,30 L30,34" stroke={c1} strokeWidth="0.6" opacity="0.4" />
      <path d="M150,30 L150,34" stroke={c1} strokeWidth="0.6" opacity="0.4" />
      <text x="90" y="30" fontSize="5" fill={c1} opacity="0.45"
        fontFamily="monospace" textAnchor="middle">6.000</text>

      {/* Cota vertical derecha */}
      <path d="M158,40 L158,130" stroke={c1} strokeWidth="0.6" opacity="0.4" />
      <path d="M156,40 L160,40" stroke={c1} strokeWidth="0.6" opacity="0.4" />
      <path d="M156,130 L160,130" stroke={c1} strokeWidth="0.6" opacity="0.4" />
      <text x="165" y="88" fontSize="5" fill={c1} opacity="0.45"
        fontFamily="monospace" transform="rotate(90 165 88)">4.500</text>

      {/* Cota habitación izquierda */}
      <path d="M35,88 L55,88" stroke={c1} strokeWidth="0.4" opacity="0.3" />
      <text x="45" y="95" fontSize="4" fill={c1} opacity="0.35"
        fontFamily="monospace" textAnchor="middle">1.5</text>

      {/* Cota habitación derecha */}
      <path d="M105,55 L145,55" stroke={c1} strokeWidth="0.4" opacity="0.3" />
      <text x="125" y="52" fontSize="4" fill={c1} opacity="0.35"
        fontFamily="monospace" textAnchor="middle">2.5</text>

      {/* ══ SECCIÓN — alzado lateral ══ */}
      {/* Línea de corte en planta */}
      <path d="M20,85 L30,85" stroke={c1} strokeWidth="1" opacity="0.5"
        strokeDasharray="4,2" />
      <path d="M150,85 L165,85" stroke={c1} strokeWidth="1" opacity="0.5"
        strokeDasharray="4,2" />
      <text x="18" y="83" fontSize="6" fill={c1} opacity="0.45"
        fontFamily="monospace">A</text>
      <text x="167" y="83" fontSize="6" fill={c1} opacity="0.45"
        fontFamily="monospace">A</text>

      {/* Sección abajo */}
      <text x="15" y="155" fontSize="6" fill={c1} opacity="0.45"
        fontFamily="monospace">SECCIÓN A-A</text>

      {/* Suelo */}
      <path d="M25,215 L175,215" stroke={c1} strokeWidth="1.5" opacity="0.55" />
      {/* Sombreado suelo */}
      {Array.from({ length: 15 }).map((_, i) => (
        <path key={`soil${i}`}
          d={`M${30 + i * 10},215 L${25 + i * 10},220`}
          stroke={c1} strokeWidth="0.6" opacity="0.3" />
      ))}

      {/* Muro izquierdo sección */}
      <rect x="25" y="165" width="6" height="50" fill={c1} opacity="0.25" />
      <rect x="25" y="165" width="6" height="50" fill="none"
        stroke={c1} strokeWidth="1" opacity="0.5" />

      {/* Muro derecho sección */}
      <rect x="169" y="165" width="6" height="50" fill={c1} opacity="0.25" />
      <rect x="169" y="165" width="6" height="50" fill="none"
        stroke={c1} strokeWidth="1" opacity="0.5" />

      {/* Muro interior sección */}
      <rect x="95" y="165" width="5" height="50" fill={c1} opacity="0.2" />
      <rect x="95" y="165" width="5" height="50" fill="none"
        stroke={c1} strokeWidth="1" opacity="0.5" />

      {/* Techo */}
      <path d="M22,165 L100,145 L178,165" fill="none"
        stroke={c1} strokeWidth="1.5" opacity="0.55" />
      <path d="M25,165 L175,165" stroke={c1} strokeWidth="1" opacity="0.45" />

      {/* Cumbrera */}
      <circle cx="100" cy="145" r="1.5" fill={c1} opacity="0.5" />

      {/* Ventana en sección */}
      <rect x="55" y="178" width="15" height="20" fill="none"
        stroke={c1} strokeWidth="1" opacity="0.45" />
      <path d="M62,178 L62,198" stroke={c1} strokeWidth="0.5" opacity="0.35" />
      <path d="M55,188 L70,188" stroke={c1} strokeWidth="0.5" opacity="0.35" />

      {/* Puerta en sección */}
      <rect x="120" y="180" width="18" height="35" fill="none"
        stroke={c1} strokeWidth="1" opacity="0.45" />
      <circle cx="135" cy="198" r="1" fill={c1} opacity="0.4" />

      {/* Cota de altura */}
      <path d="M182,165 L182,215" stroke={c1} strokeWidth="0.6" opacity="0.4" />
      <path d="M180,165 L184,165" stroke={c1} strokeWidth="0.6" opacity="0.4" />
      <path d="M180,215 L184,215" stroke={c1} strokeWidth="0.6" opacity="0.4" />
      <text x="186" y="193" fontSize="4" fill={c1} opacity="0.4"
        fontFamily="monospace" transform="rotate(90 186 193)">2.700</text>

      {/* ══ DETALLE CONSTRUCTIVO ══ */}
      <text x="15" y="235" fontSize="5" fill={c1} opacity="0.4"
        fontFamily="monospace">DETALLE 1</text>

      {/* Círculo de detalle en planta */}
      <circle cx="45" cy="110" r="12" fill="none"
        stroke={c1} strokeWidth="0.8" opacity="0.4"
        strokeDasharray="3,2" />
      <text x="45" y="126" fontSize="5" fill={c1} opacity="0.35"
        fontFamily="monospace" textAnchor="middle">D1</text>

      {/* Ampliación */}
      <circle cx="50" cy="250" r="15" fill="none"
        stroke={c1} strokeWidth="1" opacity="0.45" />

      {/* Contenido del detalle */}
      <rect x="42" y="243" width="8" height="14" fill={c1} opacity="0.15" />
      <rect x="42" y="243" width="8" height="14" fill="none"
        stroke={c1} strokeWidth="0.8" opacity="0.5" />
      <path d="M42,250 L38,250 L38,254 L42,254"
        fill="none" stroke={c1} strokeWidth="0.8" opacity="0.45" />
      {/* Sombreado del muro */}
      {[0, 2, 4, 6, 8, 10, 12].map((y, i) => (
        <path key={`hatch${i}`}
          d={`M43,${244 + y} L49,${243 + y}`}
          stroke={c1} strokeWidth="0.4" opacity="0.3" />
      ))}

      {/* ══ LEYENDA DE MATERIALES ══ */}
      {/* Hormigón */}
      <rect x="80" y="238" width="8" height="8" fill={c1} opacity="0.15" />
      <rect x="80" y="238" width="8" height="8" fill="none"
        stroke={c1} strokeWidth="0.6" opacity="0.4" />
      <circle cx="83" cy="242" r="1" fill={c1} opacity="0.3" />
      <circle cx="86" cy="244" r="0.8" fill={c1} opacity="0.25" />
      <rect x="92" y="240" width="18" height="3" fill={c1} opacity="0.2" />

      {/* Aislante */}
      <rect x="80" y="250" width="8" height="8" fill="none"
        stroke={c1} strokeWidth="0.6" opacity="0.4" />
      <path d="M80,254 Q82,250 84,254 Q86,258 88,254"
        fill="none" stroke={c1} strokeWidth="0.5" opacity="0.35" />
      <rect x="92" y="252" width="18" height="3" fill={c1} opacity="0.2" />

      {/* ══ NORTE ══ */}
      <g transform="translate(175,40)">
        <path d="M0,10 L0,-10" stroke={c1} strokeWidth="1" opacity="0.5" />
        <path d="M-3,-6 L0,-12 L3,-6" fill={c1} opacity="0.4" />
        <text x="-2" y="-14" fontSize="5" fill={c1} opacity="0.45"
          fontFamily="monospace">N</text>
      </g>

    </svg>
  );
}
