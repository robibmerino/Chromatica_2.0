import { useId } from 'react';
import type { ComoEstiloProps } from '../types';
import { darken, lighten } from '../estiloColorUtils';

/* ═══════════════════════════════════════
   ESTILO: MEMPHIS
   Postmoderno, juguetón, 80s, patrones
   ═══════════════════════════════════════ */
export function MemphisStyle({ color = '#818cf8', className = '' }: ComoEstiloProps) {
  const id = useId().replace(/:/g, '');

  const c1 = color;
  const c2 = darken(color, 70);
  const c3 = darken(color, 120);
  const c4 = lighten(color, 60);
  const c5 = lighten(color, 100);

  return (
    <svg viewBox="0 0 200 300" className={className} style={{ width: '100%', height: '100%' }}>
      <defs>
        <pattern id={`${id}dots`} width="12" height="12" patternUnits="userSpaceOnUse">
          <circle cx="3" cy="3" r="2" fill={c1} opacity="0.5" />
          <circle cx="9" cy="9" r="2" fill={c2} opacity="0.4" />
        </pattern>

        <pattern
          id={`${id}lines`}
          width="8"
          height="8"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <path d="M0,0 L8,0" stroke={c1} strokeWidth="2" opacity="0.35" />
        </pattern>

        <pattern id={`${id}squig`} width="20" height="10" patternUnits="userSpaceOnUse">
          <path d="M0,5 Q5,0 10,5 Q15,10 20,5" fill="none" stroke={c2} strokeWidth="1.5" opacity="0.4" />
        </pattern>
      </defs>

      {/* ══ FONDO CON CONFETTI ══ */}
      {[
        [15, 25, 8, 0],
        [170, 40, 6, 45],
        [50, 280, 7, 30],
        [180, 270, 5, -20],
        [30, 180, 6, 60],
        [160, 190, 5, -40],
        [90, 15, 5, 15],
        [120, 290, 6, -30],
        [10, 120, 5, 50],
      ].map(([x, y, s, r], i) => (
        <path
          key={`conf-t${i}`}
          d={`M${x},${(y as number) - (s as number)} L${(x as number) + (s as number)},${(y as number) + (s as number)} L${(x as number) - (s as number)},${(y as number) + (s as number)} Z`}
          fill={i % 3 === 0 ? c1 : i % 3 === 1 ? c2 : c4}
          opacity={0.35 + (i % 3) * 0.1}
          transform={`rotate(${r} ${x} ${y})`}
        />
      ))}

      {[
        [185, 15, 4],
        [25, 60, 5],
        [175, 130, 4],
        [15, 250, 5],
        [100, 5, 3],
        [185, 220, 4],
        [40, 140, 3],
        [150, 280, 4],
        [70, 60, 3],
      ].map(([x, y, r], i) => (
        <circle
          key={`conf-c${i}`}
          cx={x}
          cy={y}
          r={r as number}
          fill={i % 2 === 0 ? c4 : c1}
          opacity={0.4 + (i % 3) * 0.1}
        />
      ))}

      {[
        [60, 30],
        [140, 65],
        [20, 210],
        [175, 165],
        [95, 275],
        [45, 95],
        [160, 240],
      ].map(([x, y], i) => (
        <g key={`conf-x${i}`} opacity={0.35 + (i % 3) * 0.08}>
          <path
            d={`M${(x as number) - 4},${y} L${(x as number) + 4},${y}`}
            stroke={i % 2 === 0 ? c2 : c1}
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d={`M${x},${(y as number) - 4} L${x},${(y as number) + 4}`}
            stroke={i % 2 === 0 ? c2 : c1}
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>
      ))}

      {/* ══ FORMAS PRINCIPALES ══ */}
      <circle cx="55" cy="90" r="40" fill={`url(#${id}dots)`} />
      <circle cx="55" cy="90" r="40" fill={c4} opacity="0.25" />
      <circle cx="55" cy="90" r="40" fill="none" stroke={c2} strokeWidth="4" opacity="0.7" />

      <circle cx="60" cy="85" r="20" fill={c1} opacity="0.5" />
      <circle cx="60" cy="85" r="20" fill="none" stroke={c3} strokeWidth="2.5" opacity="0.6" />

      <path d="M130,45 L175,130 L85,130 Z" fill={`url(#${id}lines)`} />
      <path d="M130,45 L175,130 L85,130 Z" fill={c1} opacity="0.2" />
      <path d="M130,45 L175,130 L85,130 Z" fill="none" stroke={c2} strokeWidth="4" opacity="0.7" />

      <path d="M130,70 L155,115 L105,115 Z" fill={c2} opacity="0.45" />
      <path d="M130,70 L155,115 L105,115 Z" fill="none" stroke={c3} strokeWidth="2" opacity="0.5" />

      {/* ══ SQUIGGLES ══ */}
      <path
        d="M10,150 Q25,140 40,150 Q55,160 70,150 Q85,140 100,150"
        fill="none"
        stroke={c1}
        strokeWidth="3.5"
        strokeLinecap="round"
        opacity="0.6"
      />
      <path
        d="M100,150 Q115,160 130,150 Q145,140 160,150 Q175,160 190,150"
        fill="none"
        stroke={c2}
        strokeWidth="3.5"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M175,160 Q185,175 175,190 Q165,205 175,220 Q185,235 175,250"
        fill="none"
        stroke={c1}
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.5"
      />

      {/* ══ RECTÁNGULO CON PATRÓN ══ */}
      <rect x="25" y="175" width="70" height="55" fill={`url(#${id}squig)`} />
      <rect x="25" y="175" width="70" height="55" fill={c5} opacity="0.2" />
      <rect x="25" y="175" width="70" height="55" fill="none" stroke={c2} strokeWidth="4" opacity="0.65" />

      <rect x="45" y="188" width="30" height="30" fill={c1} opacity="0.5" transform="rotate(15 60 203)" />
      <rect
        x="45"
        y="188"
        width="30"
        height="30"
        fill="none"
        stroke={c3}
        strokeWidth="2.5"
        opacity="0.55"
        transform="rotate(15 60 203)"
      />

      {/* ══ SEMICÍRCULO ══ */}
      <path d="M105,230 A40,40 0 0,1 185,230" fill={c1} opacity="0.35" />
      <path d="M105,230 A40,40 0 0,1 185,230" fill={`url(#${id}dots)`} opacity="0.6" />
      <path d="M105,230 A40,40 0 0,1 185,230" fill="none" stroke={c2} strokeWidth="4" opacity="0.65" />
      <path d="M105,230 L185,230" stroke={c2} strokeWidth="4" opacity="0.65" />

      <circle cx="145" cy="220" r="15" fill={c4} opacity="0.55" />
      <circle cx="145" cy="220" r="15" fill="none" stroke={c3} strokeWidth="2.5" opacity="0.5" />

      {/* ══ COLUMNA DE FORMAS APILADAS ══ */}
      <rect x="110" y="260" width="50" height="25" fill={c2} opacity="0.5" />
      <rect x="110" y="260" width="50" height="25" fill="none" stroke={c3} strokeWidth="2.5" opacity="0.55" />

      <path d="M115,260 A20,8 0 0,1 155,260" fill={c1} opacity="0.45" />
      <path d="M115,260 A20,8 0 0,1 155,260" fill="none" stroke={c3} strokeWidth="2" opacity="0.5" />

      {/* ══ ZIGZAG GRUESO ══ */}
      <path
        d="M15,260 L30,245 L45,260 L60,245 L75,260"
        fill="none"
        stroke={c1}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.55"
      />
      <path
        d="M20,275 L35,260 L50,275 L65,260 L80,275"
        fill="none"
        stroke={c2}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.45"
      />

      {/* ══ ARCO CON PATRÓN ══ */}
      <path d="M5,40 A50,50 0 0,1 55,0" fill="none" stroke={c1} strokeWidth="10" opacity="0.25" />
      <path d="M5,40 A50,50 0 0,1 55,0" fill="none" stroke={c2} strokeWidth="4" opacity="0.5" />

      {/* ══ LÍNEAS PARALELAS DECORATIVAS ══ */}
      {[0, 6, 12].map((offset, i) => (
        <path
          key={`par${i}`}
          d={`M170,45 L195,${70 + offset}`}
          stroke={c1}
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity={0.5 - i * 0.1}
        />
      ))}
      {[0, 6, 12].map((offset, i) => (
        <path
          key={`par2${i}`}
          d={`M5,175 L25,${195 + offset}`}
          stroke={c2}
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity={0.45 - i * 0.1}
        />
      ))}

      {/* ══ PUNTOS GRANDES ══ */}
      <circle cx="100" cy="200" r="8" fill={c1} opacity="0.55" />
      <circle cx="100" cy="200" r="8" fill="none" stroke={c3} strokeWidth="2" opacity="0.45" />
      <circle cx="85" cy="145" r="6" fill={c2} opacity="0.5" />
      <circle cx="170" cy="95" r="5" fill={c4} opacity="0.5" />
      <circle cx="25" cy="155" r="5" fill={c1} opacity="0.45" />

      {/* ══ TERRAZZO ══ */}
      {[
        [90, 50, 5, 3, 20],
        [110, 175, 4, 2.5, -15],
        [155, 150, 3, 4, 40],
        [40, 250, 4, 3, -25],
        [180, 290, 5, 2.5, 10],
        [10, 295, 4, 3, 35],
        [65, 140, 3, 2, -10],
        [130, 195, 3.5, 2.5, 25],
      ].map(([x, y, w, h, r], i) => (
        <ellipse
          key={`ter${i}`}
          cx={x}
          cy={y}
          rx={w as number}
          ry={h as number}
          fill={i % 3 === 0 ? c1 : i % 3 === 1 ? c2 : c4}
          opacity={0.35 + (i % 3) * 0.1}
          transform={`rotate(${r} ${x} ${y})`}
        />
      ))}

      {/* ══ LÍNEA GRUESA DIAGONAL ══ */}
      <path d="M5,135 L95,175" stroke={c2} strokeWidth="5" strokeLinecap="round" opacity="0.45" />
      <path d="M145,265 L195,295" stroke={c1} strokeWidth="4" strokeLinecap="round" opacity="0.4" />

      {/* ══ CUARTO DE CÍRCULO EN ESQUINA ══ */}
      <path d="M0,300 A50,50 0 0,0 50,250 L0,250 Z" fill={c1} opacity="0.25" />
      <path d="M0,300 A50,50 0 0,0 50,250" fill="none" stroke={c2} strokeWidth="3" opacity="0.5" />
      <path d="M200,0 A45,45 0 0,0 155,45 L200,45 Z" fill={c2} opacity="0.2" />
      <path d="M200,0 A45,45 0 0,0 155,45" fill="none" stroke={c1} strokeWidth="3" opacity="0.45" />

      {/* ══ PUNTO FOCAL ══ */}
      <circle cx="130" cy="165" r="12" fill={c5} opacity="0.6" />
      <circle cx="130" cy="165" r="12" fill="none" stroke={c3} strokeWidth="3" opacity="0.6" />
      <circle cx="130" cy="165" r="4" fill={c2} opacity="0.7" />
    </svg>
  );
}
