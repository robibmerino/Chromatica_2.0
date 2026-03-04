import { useId } from 'react';
import type { ComoEstiloProps } from '../types';
import { darken, lighten } from '../estiloColorUtils';

/* ═══════════════════════════════════════
   ESTILO: ISOMÉTRICO
   Profundidad sin fuga, volumen, 3D falso
   ═══════════════════════════════════════ */
export function IsometricStyle({ color = '#818cf8', className = '' }: ComoEstiloProps) {
  const id = useId().replace(/:/g, '');

  // 3 caras del cubo = 3 tonos
  const cTop = lighten(color, 50);
  const cLeft = color;
  const cRight = darken(color, 60);
  const cDark = darken(color, 110);

  // Función para generar un cubo isométrico
  const cube = (cx: number, cy: number, w: number, h: number, opacity: number, key: string) => {
    const hw = w / 2;
    const top = `M${cx},${cy - h} L${cx + hw},${cy - h + hw * 0.58} L${cx},${cy - h + hw * 1.16} L${cx - hw},${cy - h + hw * 0.58} Z`;
    const left = `M${cx - hw},${cy - h + hw * 0.58} L${cx},${cy - h + hw * 1.16} L${cx},${cy + hw * 1.16 - h + h} L${cx - hw},${cy + hw * 0.58 - h + h} Z`;
    const right = `M${cx},${cy - h + hw * 1.16} L${cx + hw},${cy - h + hw * 0.58} L${cx + hw},${cy + hw * 0.58 - h + h} L${cx},${cy + hw * 1.16 - h + h} Z`;

    return (
      <g key={key}>
        <path d={left} fill={cLeft} opacity={opacity} />
        <path d={left} fill="none" stroke={cDark} strokeWidth="1" opacity={opacity * 0.5} />
        <path d={right} fill={cRight} opacity={opacity} />
        <path d={right} fill="none" stroke={cDark} strokeWidth="1" opacity={opacity * 0.5} />
        <path d={top} fill={cTop} opacity={opacity} />
        <path d={top} fill="none" stroke={cDark} strokeWidth="1" opacity={opacity * 0.5} />
      </g>
    );
  };

  return (
    <svg viewBox="0 0 200 300" className={className} style={{ width: '100%', height: '100%' }}>
      <defs>
        <clipPath id={`${id}clip`}>
          <rect width="200" height="300" />
        </clipPath>
      </defs>

      <g clipPath={`url(#${id}clip)`}>
        {/* ══ CUADRÍCULA ISOMÉTRICA DE FONDO ══ */}
        {Array.from({ length: 14 }).map((_, i) => (
          <g key={`grid${i}`}>
            <path
              d={`M${-20 + i * 30},300 L${-20 + i * 30 + 180},${300 - 180 * 1.73}`}
              stroke={cLeft}
              strokeWidth="0.3"
              opacity="0.08"
            />
            <path
              d={`M${220 - i * 30},300 L${220 - i * 30 - 180},${300 - 180 * 1.73}`}
              stroke={cLeft}
              strokeWidth="0.3"
              opacity="0.08"
            />
          </g>
        ))}
        {Array.from({ length: 10 }).map((_, i) => (
          <path key={`hiso${i}`} d={`M0,${300 - i * 30} L200,${300 - i * 30}`} stroke={cLeft} strokeWidth="0.2" opacity="0.06" />
        ))}

        {/* ══ PLATAFORMA BASE ══ */}
        <path d="M100,270 L190,218 L100,166 L10,218 Z" fill={cTop} opacity="0.15" />
        <path d="M100,270 L190,218 L100,166 L10,218 Z" fill="none" stroke={cLeft} strokeWidth="1" opacity="0.25" />
        <path d="M10,218 L10,228 L100,280 L190,228 L190,218" fill="none" stroke={cRight} strokeWidth="1" opacity="0.2" />
        <path d="M10,218 L10,228 L100,280 L100,270" fill={cLeft} opacity="0.12" />
        <path d="M190,218 L190,228 L100,280 L100,270" fill={cRight} opacity="0.1" />

        {/* ══ TORRE PRINCIPAL — cubos apilados ══ */}
        {cube(100, 250, 50, 30, 0.5, 'tower0')}
        {cube(100, 220, 50, 30, 0.48, 'tower1')}
        {cube(100, 190, 50, 30, 0.45, 'tower2')}
        {cube(100, 160, 50, 30, 0.42, 'tower3')}

        {/* ══ CUBO GRANDE IZQUIERDO ══ */}
        {cube(50, 245, 40, 45, 0.4, 'bigL')}
        <path d="M30,218 L30,228 L42,222 L42,212 Z" fill="black" opacity="0.2" />
        <path d="M30,218 L30,228 L42,222 L42,212 Z" fill="none" stroke={cDark} strokeWidth="0.8" opacity="0.3" />

        {/* ══ CUBO MEDIANO DERECHO ══ */}
        {cube(148, 248, 36, 35, 0.42, 'medR')}
        <path d="M166,228 L166,238 L148,248 L148,238 Z" fill={cDark} opacity="0.15" />

        {/* ══ CUBOS PEQUEÑOS DISPERSOS ══ */}
        {cube(45, 175, 22, 20, 0.35, 'sm1')}
        {cube(155, 180, 20, 18, 0.32, 'sm2')}
        {cube(70, 140, 18, 22, 0.3, 'sm3')}
        {cube(135, 135, 16, 20, 0.28, 'sm4')}

        {/* ══ ESCALERA LATERAL ══ */}
        {[0, 1, 2, 3, 4].map((i) => {
          const x = 30 + i * 8;
          const y = 195 - i * 12;
          return cube(x, y, 14, 8, 0.35 - i * 0.03, `step${i}`);
        })}

        {/* ══ COLUMNA FLOTANTE ══ */}
        {cube(100, 120, 24, 50, 0.38, 'col')}
        <path d="M88,155 L100,162 L112,155 L100,148 Z" fill={cDark} opacity="0.12" />

        {/* ══ CUBO DIMINUTO EN LA CIMA ══ */}
        {cube(100, 68, 16, 14, 0.45, 'top')}

        {/* ══ PIEZA EN L ══ */}
        <path d="M155,155 L175,143 L175,133 L155,145 Z" fill={cLeft} opacity="0.35" />
        <path d="M175,143 L195,155 L195,145 L175,133 Z" fill={cRight} opacity="0.35" />
        <path d="M155,145 L175,133 L195,145 L175,157 Z" fill={cTop} opacity="0.35" />
        <path d="M155,155 L155,180 L168,173 L168,148 Z" fill={cLeft} opacity="0.38" />
        <path d="M168,148 L168,173 L175,169 L175,145 Z" fill={cRight} opacity="0.38" />
        <path d="M155,145 L168,138 L175,142 L168,148 Z" fill={cTop} opacity="0.38" />

        {/* ══ ARCO ISOMÉTRICO ══ */}
        <path d="M15,140 Q15,100 40,85 Q55,78 70,85" fill="none" stroke={cLeft} strokeWidth="3" opacity="0.35" />
        <path d="M15,140 Q15,100 40,85 Q55,78 70,85" fill="none" stroke={cTop} strokeWidth="1" opacity="0.2" />
        <path d="M13,140 L13,165 L17,163 L17,138 Z" fill={cLeft} opacity="0.35" />
        <path d="M17,138 L17,163 L22,160 L22,135 Z" fill={cRight} opacity="0.3" />
        <path d="M68,85 L68,110 L72,108 L72,83 Z" fill={cLeft} opacity="0.35" />
        <path d="M72,83 L72,108 L76,105 L76,80 Z" fill={cRight} opacity="0.3" />

        {/* ══ SOMBRAS EN EL SUELO ══ */}
        <path d="M100,270 L145,290 L190,265 L145,245 Z" fill={cDark} opacity="0.08" />
        <path d="M50,252 L75,268 L95,255 L70,240 Z" fill={cDark} opacity="0.06" />

        {/* ══ LÍNEAS DE COTA — aspecto técnico ══ */}
        <path d="M78,160 L78,255" stroke={cLeft} strokeWidth="0.5" opacity="0.2" />
        <path d="M76,160 L80,160" stroke={cLeft} strokeWidth="0.5" opacity="0.2" />
        <path d="M76,255 L80,255" stroke={cLeft} strokeWidth="0.5" opacity="0.2" />

        {/* ══ PARTÍCULAS FLOTANTES — profundidad ══ */}
        {[
          [30, 55, 2.5],
          [170, 65, 2],
          [85, 35, 1.8],
          [120, 45, 1.5],
          [50, 95, 2],
          [160, 100, 1.5],
          [20, 190, 1.2],
          [180, 195, 1.8],
          [100, 25, 2.2],
        ].map(([x, y, r], i) => (
          <g key={`float${i}`}>
            <path
              d={`M${x},${Number(y) - (r as number)} L${Number(x) + (r as number)},${y} L${x},${Number(y) + (r as number)} L${Number(x) - (r as number)},${y} Z`}
              fill={i % 2 === 0 ? cTop : cLeft}
              opacity={0.25 + (i % 3) * 0.08}
            />
            <path
              d={`M${x},${Number(y) - (r as number)} L${Number(x) + (r as number)},${y} L${x},${Number(y) + (r as number)} L${Number(x) - (r as number)},${y} Z`}
              fill="none"
              stroke={cDark}
              strokeWidth="0.5"
              opacity={0.2 + (i % 3) * 0.06}
            />
          </g>
        ))}

        {/* ══ PUNTO FOCAL — cubo central brillante ══ */}
        <path d="M100,55 L108,59 L100,63 L92,59 Z" fill={cTop} opacity="0.7" />
        <path d="M92,59 L100,63 L100,70 L92,66 Z" fill={cLeft} opacity="0.6" />
        <path d="M108,59 L100,63 L100,70 L108,66 Z" fill={cRight} opacity="0.55" />
        <path d="M97,57 L100,55 L103,57 L100,59 Z" fill="white" opacity="0.4" />
      </g>
    </svg>
  );
}
