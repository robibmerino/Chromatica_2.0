import { useId } from 'react';
import { rotateHue } from '../../../../utils/colorUtils';
import type { ComoEstiloProps } from '../types';
import { darken, lighten } from '../estiloColorUtils';

/* ═══════════════════════════════════════
   ESTILO: STAINED GLASS / VIDRIERA
   Celdas, plomo, luz, fragmentos de color
   ═══════════════════════════════════════ */
export function StainedGlassStyle({ color = '#818cf8', className = '' }: ComoEstiloProps) {
  const id = useId().replace(/:/g, '');

  const c1 = color;
  const c2 = darken(color, 50);
  const c5 = lighten(color, 50);
  const c6 = lighten(color, 90);
  const lead = darken(color, 170);

  // Variantes cromáticas — rotación de matiz para diversidad tipo vitral
  const cWarm = rotateHue(color, 45);
  const cCool = rotateHue(color, -50);
  const cAccent = rotateHue(color, 150);
  const cWarmLight = lighten(cWarm, 60);
  const cCoolLight = lighten(cCool, 50);

  // Opacidades variadas para simular luz atravesando vidrio
  const cells: { d: string; fill: string; op: number }[] = [
    // ══ ROSETA SUPERIOR ══
    // Centro
    { d: 'M100,55 L115,65 L115,85 L100,95 L85,85 L85,65 Z', fill: c6, op: 0.55 },
    // Pétalos
    { d: 'M100,55 L115,65 L118,50 L108,38 Z', fill: c1, op: 0.45 },
    { d: 'M115,65 L115,85 L132,82 L128,62 Z', fill: cWarmLight, op: 0.4 },
    { d: 'M115,85 L100,95 L108,110 L125,100 Z', fill: c2, op: 0.45 },
    { d: 'M100,95 L85,85 L75,100 L88,110 Z', fill: cCoolLight, op: 0.4 },
    { d: 'M85,85 L85,65 L68,62 L72,82 Z', fill: c5, op: 0.45 },
    { d: 'M85,65 L100,55 L92,38 L78,50 Z', fill: cAccent, op: 0.4 },
    // Anillo exterior
    { d: 'M108,38 L118,50 L135,42 L125,28 Z', fill: cWarm, op: 0.35 },
    { d: 'M128,62 L132,82 L150,78 L148,58 Z', fill: c1, op: 0.3 },
    { d: 'M125,100 L108,110 L118,125 L138,115 Z', fill: cCool, op: 0.35 },
    { d: 'M88,110 L75,100 L62,115 L78,125 Z', fill: c1, op: 0.35 },
    { d: 'M68,62 L72,82 L52,78 L50,58 Z', fill: c2, op: 0.3 },
    { d: 'M78,50 L92,38 L80,28 L65,42 Z', fill: cWarmLight, op: 0.35 },

    // ══ PANELES LATERALES IZQUIERDOS ══
    { d: 'M0,0 L35,0 L32,25 L0,20 Z', fill: c1, op: 0.35 },
    { d: 'M0,20 L32,25 L28,55 L0,48 Z', fill: cCool, op: 0.3 },
    { d: 'M0,48 L28,55 L50,58 L52,78 L28,85 L0,78 Z', fill: c2, op: 0.35 },
    { d: 'M0,78 L28,85 L25,115 L0,110 Z', fill: c6, op: 0.4 },
    { d: 'M0,110 L25,115 L62,115 L55,135 L20,138 L0,135 Z', fill: cWarm, op: 0.35 },
    { d: 'M0,135 L20,138 L18,170 L0,168 Z', fill: c5, op: 0.3 },

    // ══ PANELES LATERALES DERECHOS ══
    { d: 'M200,0 L165,0 L168,25 L200,20 Z', fill: c2, op: 0.35 },
    { d: 'M200,20 L168,25 L170,55 L200,48 Z', fill: cWarm, op: 0.3 },
    { d: 'M200,48 L170,55 L148,58 L150,78 L172,85 L200,78 Z', fill: c5, op: 0.35 },
    { d: 'M200,78 L172,85 L175,115 L200,110 Z', fill: c6, op: 0.38 },
    { d: 'M200,110 L175,115 L138,115 L145,135 L180,138 L200,135 Z', fill: cCool, op: 0.35 },
    { d: 'M200,135 L180,138 L182,170 L200,168 Z', fill: c1, op: 0.3 },

    // ══ BANDA CENTRAL — arco ══
    { d: 'M0,168 L18,170 L15,200 L0,198 Z', fill: cAccent, op: 0.35 },
    { d: 'M18,170 L55,135 L70,150 L45,175 L15,200 Z', fill: c1, op: 0.25 },
    { d: 'M55,135 L78,125 L100,138 L70,150 Z', fill: cCoolLight, op: 0.35 },
    { d: 'M100,138 L118,125 L145,135 L130,150 Z', fill: c6, op: 0.4 },
    { d: 'M145,135 L182,170 L185,200 L155,175 L130,150 Z', fill: cWarm, op: 0.25 },
    { d: 'M200,168 L182,170 L185,200 L200,198 Z', fill: c5, op: 0.35 },
    { d: 'M70,150 L100,138 L130,150 L100,165 Z', fill: c1, op: 0.45 },

    // ══ ZONA INFERIOR — paneles grandes ══
    { d: 'M0,198 L15,200 L45,175 L48,200 L20,215 L0,212 Z', fill: cWarmLight, op: 0.35 },
    { d: 'M48,200 L45,175 L70,150 L100,165 L95,200 Z', fill: c2, op: 0.3 },
    { d: 'M95,200 L100,165 L130,150 L155,175 L152,200 Z', fill: cCool, op: 0.35 },
    { d: 'M152,200 L155,175 L185,200 L180,215 L200,212 L200,198 Z', fill: c5, op: 0.3 },

    { d: 'M0,212 L20,215 L22,245 L0,242 Z', fill: c1, op: 0.4 },
    { d: 'M20,215 L48,200 L95,200 L90,230 L50,235 L22,245 Z', fill: c6, op: 0.3 },
    { d: 'M95,200 L152,200 L150,230 L110,235 L90,230 Z', fill: cAccent, op: 0.35 },
    { d: 'M152,200 L180,215 L178,245 L150,230 L200,242 L200,212 Z', fill: cWarm, op: 0.3 },

    { d: 'M0,242 L22,245 L50,235 L55,260 L25,265 L0,262 Z', fill: cCoolLight, op: 0.35 },
    { d: 'M50,235 L90,230 L100,255 L55,260 Z', fill: c1, op: 0.4 },
    { d: 'M90,230 L110,235 L100,255 Z', fill: c6, op: 0.45 },
    { d: 'M110,235 L150,230 L145,260 L100,255 Z', fill: c2, op: 0.35 },
    { d: 'M150,230 L178,245 L175,265 L145,260 L200,262 L200,242 Z', fill: cWarmLight, op: 0.3 },

    { d: 'M0,262 L25,265 L28,290 L0,288 Z', fill: c2, op: 0.35 },
    { d: 'M25,265 L55,260 L100,255 L100,285 L65,290 L28,290 Z', fill: cCool, op: 0.3 },
    { d: 'M100,255 L145,260 L140,290 L100,285 Z', fill: c5, op: 0.35 },
    { d: 'M145,260 L175,265 L172,290 L140,290 L200,288 L200,262 Z', fill: cAccent, op: 0.3 },

    { d: 'M0,288 L28,290 L30,300 L0,300 Z', fill: c1, op: 0.35 },
    { d: 'M28,290 L65,290 L68,300 L30,300 Z', fill: c6, op: 0.3 },
    { d: 'M65,290 L100,285 L100,300 L68,300 Z', fill: cWarm, op: 0.35 },
    { d: 'M100,285 L140,290 L138,300 L100,300 Z', fill: c1, op: 0.3 },
    { d: 'M140,290 L172,290 L170,300 L138,300 Z', fill: cCoolLight, op: 0.35 },
    { d: 'M172,290 L200,288 L200,300 L170,300 Z', fill: c2, op: 0.3 },

    // ══ TRIÁNGULOS SUPERIORES ══
    { d: 'M35,0 L65,42 L32,25 Z', fill: c2, op: 0.3 },
    { d: 'M35,0 L65,0 L65,42 Z', fill: c6, op: 0.35 },
    { d: 'M65,0 L100,0 L92,38 L80,28 L65,42 Z', fill: c1, op: 0.3 },
    { d: 'M100,0 L135,0 L125,28 L108,38 L92,38 Z', fill: cWarmLight, op: 0.35 },
    { d: 'M135,0 L165,0 L168,25 L135,42 Z', fill: cCool, op: 0.3 },
    { d: 'M165,0 L135,42 L148,58 L170,55 L168,25 Z', fill: cAccent, op: 0.28 },
  ];

  return (
    <svg viewBox="0 0 200 300" className={className} style={{ width: '100%', height: '100%' }}>
      <defs>
        <clipPath id={`${id}clip`}>
          <rect width="200" height="300" />
        </clipPath>
      </defs>

      <g clipPath={`url(#${id}clip)`}>

        {/* ══ CELDAS DE VIDRIO ══ */}
        {cells.map((cell, i) => (
          <path key={`cell${i}`} d={cell.d}
            fill={cell.fill} opacity={cell.op} />
        ))}

        {/* ══ EMPLOMADO — juntas entre vidrios ══ */}
        {cells.map((cell, i) => (
          <path key={`lead${i}`} d={cell.d}
            fill="none" stroke={lead} strokeWidth="2.5"
            opacity="0.55" strokeLinejoin="round" />
        ))}

        {/* ══ REFLEJOS DE LUZ — puntos brillantes ══ */}
        {[
          [100, 75, 3, c6], [92, 52, 2, cWarmLight], [118, 68, 2, cCoolLight],
          [72, 72, 2, c6], [128, 72, 2, c6], [100, 48, 1.5, cWarmLight],
          [55, 148, 2.5, cCoolLight], [145, 148, 2.5, cWarmLight],
          [100, 155, 2, c6], [35, 200, 2, cWarmLight], [165, 200, 2, cCoolLight],
          [100, 240, 2, c6], [60, 252, 1.5, cCoolLight], [140, 252, 1.5, cWarmLight],
          [30, 108, 2, c6], [170, 108, 2, c6],
        ].map(([x, y, r, fill], i) => (
          <circle key={`glow${i}`}
            cx={x} cy={y} r={r as number}
            fill={fill as string} opacity={0.35 + (i % 4) * 0.08} />
        ))}

        {/* ══ TEXTURA DE VIDRIO — imperfecciones sutiles ══ */}
        {Array.from({ length: 20 }).map((_, i) => {
          const x = ((i * 53) % 180) + 10;
          const y = ((i * 79) % 280) + 10;
          const texFill = [c6, cWarmLight, cCoolLight, c6][i % 4];
          return (
            <circle key={`tex${i}`}
              cx={x} cy={y}
              r={0.4 + (i % 3) * 0.2}
              fill={texFill} opacity={0.12 + (i % 4) * 0.03} />
          );
        })}

        {/* ══ MARCO EXTERIOR — estructura de piedra ══ */}
        <rect x="0" y="0" width="200" height="300" fill="none"
          stroke={lead} strokeWidth="6" opacity="0.6" />
        <rect x="4" y="4" width="192" height="292" fill="none"
          stroke={lead} strokeWidth="1.5" opacity="0.3" />

      </g>
    </svg>
  );
}
