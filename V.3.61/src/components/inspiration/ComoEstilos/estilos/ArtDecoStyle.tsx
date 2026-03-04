import { useId } from 'react';
import type { ComoEstiloProps } from '../types';
import { darken, lighten } from '../estiloColorUtils';

/* ═══════════════════════════════════════
   ESTILO: ART DÉCO
   Simetría, lujo, abanicos, radiación
   ═══════════════════════════════════════ */
export function ArtDecoStyle({ color = '#818cf8', className = '' }: ComoEstiloProps) {
  const id = useId().replace(/:/g, '');

  const c1 = color;
  const c2 = darken(color, 70);
  const c3 = darken(color, 130);
  const c4 = lighten(color, 70);

  return (
    <svg viewBox="0 0 200 300" className={className} style={{ width: '100%', height: '100%' }}>
      <defs>
        <clipPath id={`${id}clip`}>
          <rect width="200" height="300" />
        </clipPath>
      </defs>

      <g clipPath={`url(#${id}clip)`}>
        {/* ══ FONDO ESCALONADO ══ */}
        <rect width="200" height="300" fill={c3} opacity="0.15" />

        {/* ══ ABANICO SUPERIOR — sunburst ══ */}
        {Array.from({ length: 17 }).map((_, i) => {
          const angle = -90 + (i - 8) * 11;
          const rad = (angle * Math.PI) / 180;
          const x2 = 100 + 160 * Math.cos(rad);
          const y2 = 0 + 160 * Math.sin(rad);
          return (
            <path
              key={`ray${i}`}
              d={`M100,0 L${x2},${y2}`}
              stroke={i % 2 === 0 ? c1 : c2}
              strokeWidth={i % 2 === 0 ? 2 : 1}
              opacity={i % 2 === 0 ? 0.35 : 0.2}
            />
          );
        })}

        {/* Arcos concéntricos del abanico */}
        {[40, 65, 90, 115].map((r, i) => (
          <path
            key={`arc${i}`}
            d={`M${100 - r},0 A${r},${r} 0 0,1 ${100 + r},0`}
            fill="none"
            stroke={c1}
            strokeWidth={2.5 - i * 0.4}
            opacity={0.5 - i * 0.08}
            transform="rotate(0 100 0)"
          />
        ))}

        {/* Semicírculo sólido en la base del abanico */}
        <path d="M70,0 A30,30 0 0,1 130,0" fill={c2} opacity="0.4" />
        <path d="M70,0 A30,30 0 0,1 130,0" fill="none" stroke={c1} strokeWidth="1.5" opacity="0.5" />

        {/* ══ COLUMNAS LATERALES ══ */}
        {/* Izquierda */}
        <rect x="8" y="35" width="18" height="230" fill={c2} opacity="0.4" />
        <rect x="8" y="35" width="18" height="230" fill="none" stroke={c1} strokeWidth="1.5" opacity="0.5" />
        <rect x="11" y="38" width="12" height="224" fill={c1} opacity="0.12" />

        {Array.from({ length: 6 }).map((_, i) => (
          <path key={`cl${i}`} d={`M${12 + i * 2.5},40 L${12 + i * 2.5},262`} stroke={c2} strokeWidth="0.5" opacity="0.3" />
        ))}

        <path d="M4,35 L30,35 L26,28 L8,28 Z" fill={c1} opacity="0.5" />
        <path d="M4,35 L30,35 L26,28 L8,28 Z" fill="none" stroke={c2} strokeWidth="1.2" opacity="0.55" />

        <path d="M4,265 L30,265 L26,272 L8,272 Z" fill={c1} opacity="0.5" />
        <path d="M4,265 L30,265 L26,272 L8,272 Z" fill="none" stroke={c2} strokeWidth="1.2" opacity="0.55" />

        {/* Derecha */}
        <rect x="174" y="35" width="18" height="230" fill={c2} opacity="0.4" />
        <rect x="174" y="35" width="18" height="230" fill="none" stroke={c1} strokeWidth="1.5" opacity="0.5" />
        <rect x="177" y="38" width="12" height="224" fill={c1} opacity="0.12" />

        {Array.from({ length: 6 }).map((_, i) => (
          <path key={`cr${i}`} d={`M${178 + i * 2.5},40 L${178 + i * 2.5},262`} stroke={c2} strokeWidth="0.5" opacity="0.3" />
        ))}

        <path d="M170,35 L196,35 L192,28 L174,28 Z" fill={c1} opacity="0.5" />
        <path d="M170,35 L196,35 L192,28 L174,28 Z" fill="none" stroke={c2} strokeWidth="1.2" opacity="0.55" />

        <path d="M170,265 L196,265 L192,272 L174,272 Z" fill={c1} opacity="0.5" />
        <path d="M170,265 L196,265 L192,272 L174,272 Z" fill="none" stroke={c2} strokeWidth="1.2" opacity="0.55" />

        {/* ══ MOTIVO CENTRAL — chevron escalonado ══ */}
        {[0, 1, 2, 3, 4].map((i) => {
          const w = 60 - i * 10;
          const h = 70 - i * 12;
          const y = 110 + i * 6;
          return (
            <path
              key={`chev${i}`}
              d={`M${100 - w},${y} L100,${y + h} L${100 + w},${y}`}
              fill="none"
              stroke={i % 2 === 0 ? c1 : c2}
              strokeWidth={2.5 - i * 0.3}
              strokeLinejoin="miter"
              opacity={0.55 - i * 0.07}
            />
          );
        })}

        <path d="M40,110 L100,180 L160,110 L100,125 Z" fill={c1} opacity="0.1" />

        {/* ══ DIAMANTE CENTRAL ══ */}
        <path d="M100,128 L118,150 L100,172 L82,150 Z" fill={c2} opacity="0.45" />
        <path d="M100,128 L118,150 L100,172 L82,150 Z" fill="none" stroke={c1} strokeWidth="2" opacity="0.6" />

        <path d="M100,136 L111,150 L100,164 L89,150 Z" fill={c1} opacity="0.3" />
        <path d="M100,136 L111,150 L100,164 L89,150 Z" fill="none" stroke={c4} strokeWidth="1" opacity="0.4" />

        <circle cx="100" cy="150" r="3" fill={c4} opacity="0.6" />
        <circle cx="100" cy="150" r="1.5" fill="white" opacity="0.5" />

        {/* ══ LÍNEAS ZIGZAG SIMÉTRICAS ══ */}
        <path d="M35,95 L45,105 L55,95 L65,105 L75,95 L85,105 L95,95" fill="none" stroke={c1} strokeWidth="1.5" opacity="0.35" />
        <path d="M105,95 L115,105 L125,95 L135,105 L145,95 L155,105 L165,95" fill="none" stroke={c1} strokeWidth="1.5" opacity="0.35" />

        <path d="M35,205 L45,195 L55,205 L65,195 L75,205 L85,195 L95,205" fill="none" stroke={c1} strokeWidth="1.5" opacity="0.35" />
        <path d="M105,205 L115,195 L125,205 L135,195 L145,205 L155,195 L165,205" fill="none" stroke={c1} strokeWidth="1.5" opacity="0.35" />

        {/* ══ PANELES LATERALES ESCALONADOS ══ */}
        {[0, 1, 2].map((i) => (
          <g key={`pl${i}`}>
            <rect x={30 + i * 3} y={120 + i * 15} width={10 - i * 2} height={60 - i * 15} fill={c1} opacity={0.35 - i * 0.08} />
            <rect x={30 + i * 3} y={120 + i * 15} width={10 - i * 2} height={60 - i * 15} fill="none" stroke={c2} strokeWidth="0.8" opacity={0.4 - i * 0.08} />
          </g>
        ))}

        {[0, 1, 2].map((i) => (
          <g key={`pr${i}`}>
            <rect x={160 - i * 3} y={120 + i * 15} width={10 - i * 2} height={60 - i * 15} fill={c1} opacity={0.35 - i * 0.08} />
            <rect x={160 - i * 3} y={120 + i * 15} width={10 - i * 2} height={60 - i * 15} fill="none" stroke={c2} strokeWidth="0.8" opacity={0.4 - i * 0.08} />
          </g>
        ))}

        {/* ══ ABANICO INFERIOR — espejo del superior ══ */}
        {Array.from({ length: 13 }).map((_, i) => {
          const angle = 90 + (i - 6) * 11;
          const rad = (angle * Math.PI) / 180;
          const x2 = 100 + 120 * Math.cos(rad);
          const y2 = 300 + 120 * Math.sin(rad);
          return (
            <path
              key={`rayb${i}`}
              d={`M100,300 L${x2},${y2}`}
              stroke={i % 2 === 0 ? c1 : c2}
              strokeWidth={i % 2 === 0 ? 1.5 : 0.8}
              opacity={i % 2 === 0 ? 0.3 : 0.15}
            />
          );
        })}

        {[35, 55, 75, 95].map((r, i) => (
          <path
            key={`arcb${i}`}
            d={`M${100 - r},300 A${r},${r} 0 0,0 ${100 + r},300`}
            fill="none"
            stroke={c1}
            strokeWidth={2 - i * 0.3}
            opacity={0.4 - i * 0.07}
          />
        ))}

        <path d="M75,300 A25,25 0 0,0 125,300" fill={c2} opacity="0.35" />
        <path d="M75,300 A25,25 0 0,0 125,300" fill="none" stroke={c1} strokeWidth="1.2" opacity="0.4" />

        {/* ══ BANDAS HORIZONTALES ══ */}
        <rect x="30" y="88" width="140" height="3" fill={c1} opacity="0.5" />
        <rect x="35" y="93" width="130" height="1.5" fill={c2} opacity="0.35" />

        <rect x="30" y="209" width="140" height="3" fill={c1} opacity="0.5" />
        <rect x="35" y="214" width="130" height="1.5" fill={c2} opacity="0.35" />

        {/* ══ ORNAMENTOS SIMÉTRICOS — motivos laterales ══ */}
        {[
          [30, 150, 0],
          [170, 150, 180],
        ].map(([x, y, rot], i) => (
          <g key={`fan${i}`} transform={`rotate(${rot} ${x} ${y})`}>
            {Array.from({ length: 5 }).map((_, j) => {
              const a = -40 + j * 20;
              const rad = (a * Math.PI) / 180;
              const x2 = Number(x) + 20 * Math.cos(rad);
              const y2 = Number(y) + 20 * Math.sin(rad);
              return (
                <path key={`fr${j}`} d={`M${x},${y} L${x2},${y2}`} stroke={c1} strokeWidth="1.2" opacity="0.35" />
              );
            })}
            <path
              d={`M${Number(x) - 15},${Number(y) + 12} A18,18 0 0,1 ${Number(x) - 15},${Number(y) - 12}`}
              fill="none"
              stroke={c1}
              strokeWidth="1"
              opacity="0.3"
            />
          </g>
        ))}

        {/* ══ ESQUINAS DECORATIVAS ══ */}
        {[
          [30, 30],
          [170, 30],
          [30, 270],
          [170, 270],
        ].map(([x, y], i) => {
          const dx = x === 30 ? 1 : -1;
          const dy = y <= 30 ? 1 : -1;
          return (
            <g key={`esc${i}`}>
              <path
                d={`M${x},${Number(y) + dy * 18} L${x},${y} L${Number(x) + dx * 18},${y}`}
                fill="none"
                stroke={c1}
                strokeWidth="2"
                opacity="0.5"
              />
              <path
                d={`M${x},${Number(y) + dy * 12} L${Number(x) + dx * 12},${y}`}
                fill="none"
                stroke={c1}
                strokeWidth="1"
                opacity="0.3"
              />
              <circle cx={x} cy={y} r="2" fill={c1} opacity="0.5" />
            </g>
          );
        })}
      </g>
    </svg>
  );
}
