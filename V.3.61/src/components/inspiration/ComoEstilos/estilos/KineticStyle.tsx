import { useId } from 'react';
import type { ComoEstiloProps } from '../types';
import { darken, lighten } from '../estiloColorUtils';

/* ═══════════════════════════════════════
   ESTILO: CINÉTICO
   Movimiento, velocidad, ritmo, vibración
   ═══════════════════════════════════════ */
export function KineticStyle({ color = '#818cf8', className = '' }: ComoEstiloProps) {
  const id = useId().replace(/:/g, '');

  const c1 = color;
  const c2 = darken(color, 70);
  const c3 = lighten(color, 60);

  return (
    <svg viewBox="0 0 200 300" className={className} style={{ width: '100%', height: '100%' }}>
      <defs>
        <linearGradient id={`${id}speed`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={c1} stopOpacity="0" />
          <stop offset="50%" stopColor={c1} stopOpacity="0.6" />
          <stop offset="100%" stopColor={c1} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* ══ LÍNEAS DE VELOCIDAD — fondo ══ */}
      {Array.from({ length: 35 }).map((_, i) => {
        const y = 8 + i * 8.5;
        const offset = Math.sin(i * 0.8) * 30;
        const x1 = 20 + offset;
        const width = 60 + (i % 5) * 25;
        return (
          <path
            key={`sl${i}`}
            d={`M${x1},${y} L${x1 + width},${y}`}
            stroke={i % 3 === 0 ? c1 : i % 3 === 1 ? c2 : c3}
            strokeWidth={1 + (i % 4) * 0.5}
            strokeLinecap="round"
            opacity={0.12 + (i % 5) * 0.04}
          />
        );
      })}

      {/* ══ FORMA PRINCIPAL — descompuesta en movimiento ══ */}

      {/* Círculo fantasma 1 — posición anterior */}
      <circle cx="65" cy="150" r="35" fill="none" stroke={c1} strokeWidth="1.5" opacity="0.12" />

      {/* Círculo fantasma 2 — posición intermedia */}
      <circle cx="78" cy="150" r="35" fill="none" stroke={c1} strokeWidth="1.8" opacity="0.2" />

      {/* Círculo fantasma 3 */}
      <circle cx="90" cy="150" r="35" fill="none" stroke={c1} strokeWidth="2" opacity="0.3" />

      {/* Círculo principal — posición actual */}
      <circle cx="105" cy="150" r="35" fill={c1} opacity="0.25" />
      <circle cx="105" cy="150" r="35" fill="none" stroke={c2} strokeWidth="2.5" opacity="0.65" />

      {/* Estela detrás del círculo */}
      {[0, 8, 16, 24, 32].map((offset, i) => (
        <path
          key={`trail${i}`}
          d={`M${65 - offset},${130 + i * 2} L${65 - offset},${170 - i * 2}`}
          stroke={c1}
          strokeWidth={2 - i * 0.3}
          strokeLinecap="round"
          opacity={0.25 - i * 0.04}
        />
      ))}

      {/* ══ TRIÁNGULO EN DESPLAZAMIENTO ══ */}

      {/* Fantasma 1 */}
      <path d="M130,55 L160,95 L100,95 Z" fill="none" stroke={c1} strokeWidth="1" opacity="0.1" />

      {/* Fantasma 2 */}
      <path d="M135,50 L165,90 L105,90 Z" fill="none" stroke={c1} strokeWidth="1.5" opacity="0.18" />

      {/* Principal */}
      <path d="M140,45 L170,85 L110,85 Z" fill={c2} opacity="0.35" />
      <path d="M140,45 L170,85 L110,85 Z" fill="none" stroke={c1} strokeWidth="2" opacity="0.55" />

      {/* Estela del triángulo */}
      <path d="M128,57 L108,57" stroke={c1} strokeWidth="1.5" strokeLinecap="round" opacity="0.15" />
      <path d="M120,67 L98,67" stroke={c1} strokeWidth="1.2" strokeLinecap="round" opacity="0.12" />
      <path d="M112,77 L92,77" stroke={c1} strokeWidth="1" strokeLinecap="round" opacity="0.1" />

      {/* ══ RECTÁNGULO EN ROTACIÓN ══ */}

      {/* Fantasma 1 */}
      <rect x="30" y="210" width="45" height="30" fill="none" stroke={c1} strokeWidth="1" opacity="0.1" transform="rotate(-15 52 225)" />

      {/* Fantasma 2 */}
      <rect x="30" y="210" width="45" height="30" fill="none" stroke={c1} strokeWidth="1.2" opacity="0.18" transform="rotate(-8 52 225)" />

      {/* Principal */}
      <rect x="30" y="210" width="45" height="30" fill={c1} opacity="0.35" />
      <rect x="30" y="210" width="45" height="30" fill="none" stroke={c2} strokeWidth="2" opacity="0.55" />

      {/* Arco de rotación */}
      <path d="M18,215 Q15,228 22,238" fill="none" stroke={c1} strokeWidth="1" strokeLinecap="round" opacity="0.25" />

      {/* ══ BARRAS DE RITMO — secuencia progresiva ══ */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const x = 120 + i * 10;
        const h = 15 + i * 8;
        const y = 260 - h;
        return (
          <g key={`bar${i}`}>
            <rect x={x} y={y} width="6" height={h} fill={i % 2 === 0 ? c1 : c2} opacity={0.25 + i * 0.06} />
            <rect x={x} y={y} width="6" height={h} fill="none" stroke={c1} strokeWidth="1" opacity={0.3 + i * 0.05} />
          </g>
        );
      })}

      {/* ══ PARTÍCULAS DE INERCIA ══ */}
      {[
        [45, 135, 3, 0.4],
        [38, 145, 2.5, 0.35],
        [32, 155, 2, 0.3],
        [28, 165, 1.5, 0.25],
        [168, 60, 2.5, 0.3],
        [175, 70, 2, 0.25],
        [180, 80, 1.5, 0.2],
        [80, 220, 2, 0.25],
        [85, 230, 1.5, 0.2],
      ].map(([x, y, r, op], i) => (
        <circle key={`part${i}`} cx={x} cy={y} r={r as number} fill={i % 2 === 0 ? c1 : c3} opacity={op as number} />
      ))}

      {/* ══ ONDAS DE VIBRACIÓN ══ */}
      <path d="M0,285 Q25,275 50,285 Q75,295 100,285 Q125,275 150,285 Q175,295 200,285" fill="none" stroke={c1} strokeWidth="1.8" opacity="0.3" />
      <path d="M0,290 Q25,282 50,290 Q75,298 100,290 Q125,282 150,290 Q175,298 200,290" fill="none" stroke={c2} strokeWidth="1.2" opacity="0.2" />
      <path d="M0,295 Q25,289 50,295 Q75,301 100,295 Q125,289 150,295 Q175,301 200,295" fill="none" stroke={c3} strokeWidth="0.8" opacity="0.15" />

      {/* ══ VECTOR DE DIRECCIÓN ══ */}
      {/* Flecha principal */}
      <path d="M15,20 L175,20" stroke={c1} strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
      <path d="M165,14 L178,20 L165,26" fill={c1} opacity="0.5" />

      {/* Flecha secundaria */}
      <path d="M160,270 L25,270" stroke={c2} strokeWidth="1.8" strokeLinecap="round" opacity="0.3" />
      <path d="M35,265 L22,270 L35,275" fill={c2} opacity="0.3" />

      {/* ══ TRAZOS DE ACELERACIÓN ══ */}
      {[
        [140, 140, 185, 140, 2, 0.35],
        [140, 148, 178, 148, 1.5, 0.28],
        [140, 156, 170, 156, 1.2, 0.22],
        [140, 164, 160, 164, 0.8, 0.15],
      ].map(([x1, y1, x2, y2, w, op], i) => (
        <path key={`acc${i}`} d={`M${x1},${y1} L${x2},${y2}`} stroke={c1} strokeWidth={w as number} strokeLinecap="round" opacity={op as number} />
      ))}

      {/* ══ PUNTOS DE IMPACTO ══ */}
      <circle cx="105" cy="150" r="4" fill={c2} opacity="0.6" />
      <circle cx="105" cy="150" r="2" fill={c3} opacity="0.7" />

      <circle cx="140" cy="65" r="3" fill={c2} opacity="0.5" />
      <circle cx="140" cy="65" r="1.5" fill={c3} opacity="0.6" />

      <circle cx="52" cy="225" r="3" fill={c2} opacity="0.45" />
      <circle cx="52" cy="225" r="1.5" fill={c3} opacity="0.55" />
    </svg>
  );
}
