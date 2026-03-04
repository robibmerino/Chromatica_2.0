import { useId } from 'react';
import type { ComoEstiloProps } from '../types';
import { darken, lighten } from '../estiloColorUtils';

/* ═══════════════════════════════════════
   ESTILO: ORGÁNICO
   Fluido, natural, curvas, crecimiento
   ═══════════════════════════════════════ */
export function OrganicStyle({ color = '#818cf8', className = '' }: ComoEstiloProps) {
  const id = useId().replace(/:/g, '');

  const c1 = color;
  const c2 = darken(color, 50);
  const c3 = lighten(color, 60);
  const c4 = lighten(color, 100);

  return (
    <svg viewBox="0 0 200 300" className={className} style={{ width: '100%', height: '100%' }}>
      <defs>
        <radialGradient id={`${id}bg`} cx="40%" cy="45%" r="60%">
          <stop offset="0%" stopColor={c3} stopOpacity="0.12" />
          <stop offset="100%" stopColor={c1} stopOpacity="0.03" />
        </radialGradient>
      </defs>

      {/* ══ FONDO SUTIL ══ */}
      <rect width="200" height="300" fill={`url(#${id}bg)`} />

      {/* ══ CAPA 1: Blobs grandes de fondo ══ */}
      {/* Blob principal superior */}
      <path
        d="M-10,60 Q30,-10 90,20 Q140,45 160,10 Q200,-15 220,50
               Q210,100 170,90 Q130,80 100,110 Q60,140 20,110 Q-20,90 -10,60 Z"
        fill={c1}
        opacity="0.12"
      />

      {/* Blob principal inferior */}
      <path
        d="M-15,230 Q20,190 70,210 Q120,230 150,200 Q180,175 215,200
               Q230,250 190,280 Q140,320 80,310 Q20,300 -15,270 Z"
        fill={c2}
        opacity="0.15"
      />

      {/* Blob lateral derecho */}
      <path
        d="M160,100 Q200,120 195,170 Q190,220 165,230
               Q140,215 145,175 Q148,130 160,100 Z"
        fill={c1}
        opacity="0.1"
      />

      {/* ══ CAPA 2: Forma orgánica central grande ══ */}
      <path
        d="M55,100 Q40,80 60,60 Q85,40 115,50 Q145,60 155,90
               Q165,120 150,150 Q140,175 155,200 Q165,225 145,245
               Q120,260 90,250 Q60,240 50,215 Q38,190 45,165
               Q50,140 40,120 Q35,110 55,100 Z"
        fill={c1}
        opacity="0.2"
      />
      <path
        d="M55,100 Q40,80 60,60 Q85,40 115,50 Q145,60 155,90
               Q165,120 150,150 Q140,175 155,200 Q165,225 145,245
               Q120,260 90,250 Q60,240 50,215 Q38,190 45,165
               Q50,140 40,120 Q35,110 55,100 Z"
        fill="none"
        stroke={c1}
        strokeWidth="2"
        opacity="0.4"
      />

      {/* Forma interior — segunda capa */}
      <path
        d="M75,110 Q65,90 80,78 Q100,65 120,75 Q140,85 142,110
               Q144,135 130,150 Q120,165 132,185 Q142,205 128,225
               Q110,238 92,230 Q74,220 70,200 Q65,180 72,165
               Q78,150 68,130 Q62,118 75,110 Z"
        fill={c3}
        opacity="0.2"
      />
      <path
        d="M75,110 Q65,90 80,78 Q100,65 120,75 Q140,85 142,110
               Q144,135 130,150 Q120,165 132,185 Q142,205 128,225
               Q110,238 92,230 Q74,220 70,200 Q65,180 72,165
               Q78,150 68,130 Q62,118 75,110 Z"
        fill="none"
        stroke={c1}
        strokeWidth="1.5"
        opacity="0.3"
      />

      {/* ══ CAPA 3: Ramas / venas ══ */}
      {/* Rama principal */}
      <path
        d="M35,280 Q45,240 55,210 Q65,180 60,150 Q55,120 70,90 Q85,60 100,40"
        fill="none"
        stroke={c2}
        strokeWidth="3.5"
        strokeLinecap="round"
        opacity="0.35"
      />

      {/* Sub-ramas izquierda */}
      <path d="M55,210 Q35,200 25,180" fill="none" stroke={c2} strokeWidth="2" strokeLinecap="round" opacity="0.3" />
      <path d="M60,150 Q40,145 28,130" fill="none" stroke={c2} strokeWidth="2" strokeLinecap="round" opacity="0.25" />
      <path d="M70,90 Q55,80 45,65" fill="none" stroke={c2} strokeWidth="1.5" strokeLinecap="round" opacity="0.22" />

      {/* Sub-ramas derecha */}
      <path d="M55,210 Q80,200 95,185" fill="none" stroke={c1} strokeWidth="2" strokeLinecap="round" opacity="0.28" />
      <path d="M60,150 Q85,140 105,130" fill="none" stroke={c1} strokeWidth="1.8" strokeLinecap="round" opacity="0.25" />
      <path d="M70,90 Q90,78 110,75" fill="none" stroke={c1} strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />

      {/* Rama secundaria */}
      <path
        d="M170,270 Q155,230 145,200 Q135,170 140,140 Q145,110 135,80"
        fill="none"
        stroke={c1}
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.25"
      />

      <path d="M145,200 Q165,192 178,175" fill="none" stroke={c1} strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />
      <path d="M140,140 Q160,132 170,115" fill="none" stroke={c1} strokeWidth="1.5" strokeLinecap="round" opacity="0.18" />

      {/* ══ CAPA 4: Células / burbujas ══ */}
      {[
        [100, 45, 18, 0.3],
        [45, 65, 12, 0.25],
        [25, 178, 14, 0.22],
        [95, 185, 16, 0.28],
        [170, 115, 11, 0.2],
        [178, 175, 13, 0.22],
        [110, 75, 8, 0.2],
        [128, 225, 15, 0.25],
        [55, 130, 10, 0.18],
        [105, 130, 9, 0.2],
      ].map(([cx, cy, r, op], i) => (
        <g key={`cell${i}`}>
          <ellipse
            cx={cx}
            cy={cy}
            rx={r as number}
            ry={(r as number) * (0.85 + (i % 3) * 0.1)}
            fill={i % 3 === 0 ? c1 : i % 3 === 1 ? c3 : c4}
            opacity={(op as number) * 0.6}
            transform={`rotate(${i * 17} ${cx} ${cy})`}
          />
          <ellipse
            cx={cx}
            cy={cy}
            rx={r as number}
            ry={(r as number) * (0.85 + (i % 3) * 0.1)}
            fill="none"
            stroke={c1}
            strokeWidth={Math.max(0.3, 1.2 - i * 0.05)}
            opacity={op as number}
            transform={`rotate(${i * 17} ${cx} ${cy})`}
          />
          {/* Núcleo celular */}
          <circle
            cx={Number(cx) - (r as number) * 0.15}
            cy={Number(cy) - (r as number) * 0.15}
            r={(r as number) * 0.3}
            fill={c2}
            opacity={(op as number) * 0.8}
          />
        </g>
      ))}

      {/* ══ CAPA 5: Curvas de flujo ══ */}
      <path d="M0,40 Q50,30 80,50 Q120,75 160,55 Q190,40 200,55" fill="none" stroke={c1} strokeWidth="1" opacity="0.2" />
      <path d="M0,50 Q50,42 80,60 Q120,82 160,65 Q190,50 200,65" fill="none" stroke={c3} strokeWidth="0.8" opacity="0.15" />

      <path d="M0,250 Q40,235 80,255 Q120,275 160,255 Q190,240 200,250" fill="none" stroke={c1} strokeWidth="1" opacity="0.2" />
      <path d="M0,260 Q40,248 80,265 Q120,282 160,265 Q190,250 200,260" fill="none" stroke={c3} strokeWidth="0.8" opacity="0.15" />

      {/* Flujo central ondulante */}
      <path d="M10,155 Q50,135 100,155 Q150,175 190,155" fill="none" stroke={c1} strokeWidth="1.5" opacity="0.2" />
      <path d="M10,160 Q50,140 100,160 Q150,180 190,160" fill="none" stroke={c1} strokeWidth="0.8" opacity="0.12" />

      {/* ══ CAPA 6: Esporas / semillas ══ */}
      {[
        [15, 95, 4.5],
        [30, 150, 5],
        [175, 145, 4],
        [155, 250, 5.5],
        [85, 270, 4],
        [120, 25, 3.5],
        [48, 28, 3],
        [160, 55, 3.5],
        [30, 245, 4],
        [185, 210, 3.5],
        [110, 280, 3],
        [75, 160, 3],
      ].map(([x, y, r], i) => (
        <g key={`sp${i}`}>
          <circle
            cx={x}
            cy={y}
            r={r as number}
            fill={i % 2 === 0 ? c1 : c3}
            opacity={0.25 + (i % 4) * 0.08}
          />
          {/* Cola de la espora */}
          <path
            d={`M${x},${Number(y) + (r as number)} Q${Number(x) + (i % 2 === 0 ? 5 : -5)},${Number(y) + (r as number) + 8} ${Number(x) + (i % 2 === 0 ? 2 : -2)},${Number(y) + (r as number) + 14}`}
            fill="none"
            stroke={i % 2 === 0 ? c1 : c2}
            strokeWidth="1"
            strokeLinecap="round"
            opacity={0.2 + (i % 3) * 0.06}
          />
        </g>
      ))}

      {/* ══ CAPA 7: Gotas grandes — puntos focales ══ */}
      {/* Gota 1 */}
      <path d="M100,38 Q92,48 92,56 Q92,66 100,66 Q108,66 108,56 Q108,48 100,38 Z" fill={c1} opacity="0.5" />
      <path d="M100,38 Q92,48 92,56 Q92,66 100,66 Q108,66 108,56 Q108,48 100,38 Z" fill="none" stroke={c2} strokeWidth="1.5" opacity="0.5" />
      <circle cx="98" cy="52" r="2.5" fill={c4} opacity="0.5" />

      {/* Gota 2 */}
      <path d="M130,218 Q120,230 120,240 Q120,252 130,252 Q140,252 140,240 Q140,230 130,218 Z" fill={c2} opacity="0.45" />
      <path d="M130,218 Q120,230 120,240 Q120,252 130,252 Q140,252 140,240 Q140,230 130,218 Z" fill="none" stroke={c1} strokeWidth="1.5" opacity="0.45" />
      <circle cx="128" cy="238" r="3" fill={c4} opacity="0.4" />

      {/* Gota 3 */}
      <path d="M28,170 Q20,180 20,188 Q20,198 28,198 Q36,198 36,188 Q36,180 28,170 Z" fill={c1} opacity="0.4" />
      <circle cx="26" cy="186" r="2" fill={c4} opacity="0.35" />

      {/* ══ CAPA 8: Textura punteada orgánica ══ */}
      {Array.from({ length: 25 }).map((_, i) => {
        const x = 15 + ((i * 47) % 170);
        const y = 20 + ((i * 73) % 260);
        return (
          <circle
            key={`dot${i}`}
            cx={x}
            cy={y}
            r={0.8 + (i % 3) * 0.4}
            fill={i % 2 === 0 ? c1 : c2}
            opacity={0.15 + (i % 5) * 0.04}
          />
        );
      })}
    </svg>
  );
}
