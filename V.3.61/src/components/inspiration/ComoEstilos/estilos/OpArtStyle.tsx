import { useId } from 'react';
import type { ComoEstiloProps } from '../types';
import { darken, lighten } from '../estiloColorUtils';

/* ═══════════════════════════════════════
   ESTILO: OP ART
   Ilusión óptica, patrones, vibración visual
   ═══════════════════════════════════════ */
export function OpArtStyle({ color = '#818cf8', className = '' }: ComoEstiloProps) {
  const id = useId().replace(/:/g, '');

  const c1 = color;
  const c2 = darken(color, 100);
  const c3 = lighten(color, 90);

  return (
    <svg viewBox="0 0 200 300" className={className} style={{ width: '100%', height: '100%' }}>
      <defs>
        <clipPath id={`${id}clip`}>
          <rect width="200" height="300" />
        </clipPath>
      </defs>

      <g clipPath={`url(#${id}clip)`}>
        {/* ══ PATRÓN DE LÍNEAS ONDULADAS ══ */}
        {Array.from({ length: 40 }).map((_, i) => {
          const y = i * 7.5;
          const amp = 3 + Math.sin(i * 0.3) * 2;
          return (
            <path
              key={`wave${i}`}
              d={`M0,${y} Q50,${y + amp} 100,${y} Q150,${y - amp} 200,${y}`}
              fill="none"
              stroke={i % 2 === 0 ? c1 : c2}
              strokeWidth={i % 2 === 0 ? 2 : 1.5}
              opacity={i % 2 === 0 ? 0.15 : 0.1}
            />
          );
        })}

        {/* ══ CÍRCULOS CONCÉNTRICOS — efecto túnel ══ */}
        {Array.from({ length: 20 }).map((_, i) => {
          const r = 10 + i * 8;
          return (
            <circle
              key={`conc${i}`}
              cx="100"
              cy="100"
              r={r}
              fill="none"
              stroke={i % 2 === 0 ? c1 : c2}
              strokeWidth={2.5 - i * 0.08}
              opacity={0.6 - i * 0.02}
            />
          );
        })}
        <circle cx="100" cy="100" r="8" fill={c1} opacity="0.7" />
        <circle cx="100" cy="100" r="4" fill={c3} opacity="0.8" />

        {/* ══ CUADRÍCULA DEFORMADA ══ */}
        {Array.from({ length: 11 }).map((_, i) => {
          const x = 25 + i * 15;
          const curve = Math.sin((i / 10) * Math.PI) * 25;
          return (
            <path
              key={`gv${i}`}
              d={`M${x},195 Q${x + curve},240 ${x},285`}
              fill="none"
              stroke={c1}
              strokeWidth={1.5 + Math.sin((i / 10) * Math.PI) * 0.8}
              opacity={0.5 - Math.abs(5 - i) * 0.04}
            />
          );
        })}
        {Array.from({ length: 7 }).map((_, i) => {
          const y = 200 + i * 14;
          const curve = Math.sin((i / 6) * Math.PI) * 15;
          return (
            <path
              key={`gh${i}`}
              d={`M25,${y} Q100,${y - curve} 175,${y}`}
              fill="none"
              stroke={c2}
              strokeWidth={1.2 + Math.sin((i / 6) * Math.PI) * 0.6}
              opacity={0.45 - Math.abs(3 - i) * 0.05}
            />
          );
        })}

        {/* ══ DAMERO DISTORSIONADO ══ */}
        {Array.from({ length: 5 }).map((_, row) =>
          Array.from({ length: 5 }).map((_, col) => {
            const baseX = 10 + col * 18;
            const baseY = 10 + row * 14;
            const distort = Math.sin((row + col) * 0.8) * 3;
            const size = 8 + Math.cos((row - col) * 0.5) * 2;

            if ((row + col) % 2 === 0) {
              return (
                <rect
                  key={`dam${row}-${col}`}
                  x={baseX + distort}
                  y={baseY + distort}
                  width={size}
                  height={size * 0.9}
                  fill={c1}
                  opacity={0.5 + Math.sin((row + col) * 0.5) * 0.15}
                  transform={`rotate(${distort} ${baseX + size / 2} ${baseY + size / 2})`}
                />
              );
            }
            return null;
          })
        )}

        {/* ══ ESPIRAL HIPNÓTICA ══ */}
        {Array.from({ length: 8 }).map((_, i) => {
          const startAngle = i * 45;
          const r1 = 15;
          const r2 = 40;
          const rad1 = (startAngle * Math.PI) / 180;
          const rad2 = ((startAngle + 180) * Math.PI) / 180;
          const x1 = 160 + r1 * Math.cos(rad1);
          const y1 = 55 + r1 * Math.sin(rad1);
          const x2 = 160 + r2 * Math.cos(rad2);
          const y2 = 55 + r2 * Math.sin(rad2);

          return (
            <path
              key={`spiral${i}`}
              d={`M${x1},${y1} Q${160 + 30 * Math.cos(rad1 + 0.5)},${55 + 30 * Math.sin(rad1 + 0.5)} ${x2},${y2}`}
              fill="none"
              stroke={i % 2 === 0 ? c1 : c2}
              strokeWidth={2 - i * 0.1}
              opacity={0.55 - i * 0.03}
            />
          );
        })}
        <circle cx="160" cy="55" r="12" fill={c2} opacity="0.5" />
        <circle cx="160" cy="55" r="7" fill={c1} opacity="0.55" />
        <circle cx="160" cy="55" r="3" fill={c3} opacity="0.7" />

        {/* ══ LÍNEAS RADIANTES ══ */}
        {Array.from({ length: 24 }).map((_, i) => {
          const angle = (i / 24) * Math.PI * 2;
          const x1 = 40 + 12 * Math.cos(angle);
          const y1 = 240 + 12 * Math.sin(angle);
          const x2 = 40 + 35 * Math.cos(angle);
          const y2 = 240 + 35 * Math.sin(angle);

          return (
            <path
              key={`rad${i}`}
              d={`M${x1},${y1} L${x2},${y2}`}
              stroke={i % 2 === 0 ? c1 : c2}
              strokeWidth={i % 3 === 0 ? 2 : 1.2}
              opacity={0.5 + (i % 3) * 0.1}
            />
          );
        })}
        <circle cx="40" cy="240" r="10" fill={c1} opacity="0.5" />
        <circle cx="40" cy="240" r="5" fill={c3} opacity="0.6" />

        {/* ══ PATRÓN MOIRÉ ══ */}
        {Array.from({ length: 15 }).map((_, i) => (
          <path
            key={`moire1-${i}`}
            d={`M${130 + i * 5},175 L${130 + i * 5},195`}
            stroke={c1}
            strokeWidth="1.5"
            opacity="0.4"
          />
        ))}
        {Array.from({ length: 15 }).map((_, i) => (
          <path
            key={`moire2-${i}`}
            d={`M${132 + i * 5},175 L${128 + i * 5},195`}
            stroke={c2}
            strokeWidth="1.5"
            opacity="0.35"
          />
        ))}

        {/* ══ CUADRADOS ROTATIVOS ══ */}
        {Array.from({ length: 8 }).map((_, i) => {
          const size = 50 - i * 5;
          const rotation = i * 5.5;
          return (
            <rect
              key={`rot${i}`}
              x={100 - size / 2}
              y={150 - size / 2}
              width={size}
              height={size}
              fill="none"
              stroke={i % 2 === 0 ? c1 : c2}
              strokeWidth={2 - i * 0.15}
              opacity={0.55 - i * 0.04}
              transform={`rotate(${rotation} 100 150)`}
            />
          );
        })}
        <circle cx="100" cy="150" r="4" fill={c1} opacity="0.6" />
        <circle cx="100" cy="150" r="2" fill={c3} opacity="0.7" />

        {/* ══ ZIGZAG PROGRESIVO ══ */}
        {Array.from({ length: 6 }).map((_, i) => {
          const y = 205 + i * 5;
          const amp = 3 + i * 1.5;
          const freq = 8 - i * 0.5;
          let path = `M185,${y}`;
          for (let x = 185; x <= 200; x += freq) {
            const yOffset = ((x - 185) / freq) % 2 === 0 ? -amp : amp;
            path += ` L${x},${y + yOffset}`;
          }
          return (
            <path
              key={`zig${i}`}
              d={path}
              fill="none"
              stroke={c1}
              strokeWidth={1.5 - i * 0.1}
              opacity={0.5 - i * 0.05}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          );
        })}

        {/* ══ EFECTO BULGE ══ */}
        {Array.from({ length: 9 }).map((_, i) => {
          const y = 55 + i * 8;
          const bulge = Math.sin((i / 8) * Math.PI) * 12;
          return (
            <path
              key={`bulge${i}`}
              d={`M5,${y} Q45,${y - bulge} 85,${y}`}
              fill="none"
              stroke={i % 2 === 0 ? c1 : c2}
              strokeWidth={1.8}
              opacity={0.45 + Math.sin((i / 8) * Math.PI) * 0.15}
            />
          );
        })}

        {/* ══ PUNTOS EN GRADIENTE ══ */}
        {Array.from({ length: 7 }).map((_, i) => (
          <circle key={`dot${i}`} cx={115 + i * 12} cy={290} r={1 + i * 0.6} fill={c1} opacity={0.35 + i * 0.08} />
        ))}
        {Array.from({ length: 7 }).map((_, i) => (
          <circle key={`dot2${i}`} cx={10 + i * 10} cy={290} r={4 - i * 0.4} fill={c2} opacity={0.5 - i * 0.05} />
        ))}

        {/* ══ ONDAS SINUSOIDALES ══ */}
        {[0, 1, 2].map((wave) => (
          <path
            key={`sin${wave}`}
            d={`M0,${265 + wave * 8} ${Array.from({ length: 21 })
              .map((_, i) => {
                const x = i * 10;
                const y = 265 + wave * 8 + Math.sin((i + wave * 2) * 0.6) * 5;
                return `L${x},${y}`;
              })
              .join(' ')}`}
            fill="none"
            stroke={wave % 2 === 0 ? c1 : c2}
            strokeWidth={1.5 - wave * 0.2}
            opacity={0.4 - wave * 0.08}
          />
        ))}

        {/* ══ TRIÁNGULOS ANIDADOS ══ */}
        {Array.from({ length: 5 }).map((_, i) => {
          const size = 30 - i * 5;
          const yOffset = i * 3;
          return (
            <path
              key={`tri${i}`}
              d={`M160,${230 + yOffset} L${160 + size},${230 + size * 1.2 + yOffset} L${160 - size},${230 + size * 1.2 + yOffset} Z`}
              fill="none"
              stroke={i % 2 === 0 ? c1 : c2}
              strokeWidth={2 - i * 0.2}
              opacity={0.5 - i * 0.06}
            />
          );
        })}

        {/* ══ VIBRACIONES ══ */}
        {Array.from({ length: 12 }).map((_, i) => (
          <g key={`vib${i}`}>
            <path
              d={`M${88 + (i % 3) * 8},${128 + Math.floor(i / 3) * 6} L${92 + (i % 3) * 8},${128 + Math.floor(i / 3) * 6}`}
              stroke={c1}
              strokeWidth="2"
              opacity={0.4 + (i % 4) * 0.1}
            />
          </g>
        ))}
      </g>
    </svg>
  );
}
