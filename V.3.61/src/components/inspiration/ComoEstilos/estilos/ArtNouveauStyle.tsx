import { useId } from 'react';
import type { ComoEstiloProps } from '../types';
import { darken, lighten } from '../estiloColorUtils';

/* ═══════════════════════════════════════
   ESTILO: ART NOUVEAU
   Orgánico, ornamento, floral
   ═══════════════════════════════════════ */
export function ArtNouveauStyle({ color = '#818cf8', className = '' }: ComoEstiloProps) {
  const id = useId().replace(/:/g, '');

  const c1 = color;
  const c2 = darken(color, 70);
  const c4 = lighten(color, 70);
  const c5 = lighten(color, 110);

  return (
    <svg viewBox="0 0 200 300" className={className} style={{ width: '100%', height: '100%' }}>
      <defs>
        <clipPath id={`${id}clip`}>
          <rect width="200" height="300" />
        </clipPath>
        <linearGradient id={`${id}grad1`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={c1} stopOpacity="0.35" />
          <stop offset="100%" stopColor={c4} stopOpacity="0.15" />
        </linearGradient>
        <linearGradient id={`${id}grad2`} gradientUnits="userSpaceOnUse"
          x1="100" y1="290" x2="100" y2="40">
          <stop offset="0%" stopColor={c2} stopOpacity="0.6" />
          <stop offset="100%" stopColor={c1} stopOpacity="0.35" />
        </linearGradient>
      </defs>

      <g clipPath={`url(#${id}clip)`}>

        {/* ══ FONDO SUTIL — rayas orgánicas muy tenues ══ */}
        <path d="M0,60 Q50,55 100,58 Q150,55 200,60" fill="none" stroke={c1} strokeWidth="0.4" opacity="0.06" />
        <path d="M0,120 Q80,118 160,122" fill="none" stroke={c1} strokeWidth="0.35" opacity="0.05" />
        <path d="M0,200 Q60,198 120,202 Q180,198 200,200" fill="none" stroke={c1} strokeWidth="0.4" opacity="0.06" />

        {/* ══ MARCO CURVILÍNEO ══ */}
        {/* Borde exterior ondulante */}
        <path d="M10,20 
                 Q10,10 20,10 
                 L180,10 
                 Q190,10 190,20 
                 L190,280 
                 Q190,290 180,290 
                 L20,290 
                 Q10,290 10,280 Z"
          fill="none" stroke={c1} strokeWidth="2.5" opacity="0.55" />

        {/* Borde interior */}
        <path d="M16,26 
                 Q16,16 26,16 
                 L174,16 
                 Q184,16 184,26 
                 L184,274 
                 Q184,284 174,284 
                 L26,284 
                 Q16,284 16,274 Z"
          fill="none" stroke={c1} strokeWidth="1" opacity="0.3" />

        {/* ══ TALLO PRINCIPAL — whiplash line ══ */}
        <path d="M100,290 
                 Q95,260 90,240 
                 Q80,210 85,180 
                 Q90,150 80,120 
                 Q70,95 75,70 
                 Q80,50 100,40"
          fill="none" stroke={`url(#${id}grad2)`} strokeWidth="4" opacity="0.55"
          strokeLinecap="round" />

        {/* Línea de acompañamiento */}
        <path d="M100,290 
                 Q97,262 92,242 
                 Q83,213 87,182 
                 Q92,152 82,122 
                 Q73,98 77,72 
                 Q82,52 100,42"
          fill="none" stroke={c1} strokeWidth="1.2" opacity="0.25"
          strokeLinecap="round" />

        {/* ══ FLOR PRINCIPAL — arriba ══ */}
        {/* Pétalos grandes */}
        <path d="M100,40 Q85,25 75,10 Q82,22 100,30"
          fill={c1} opacity="0.3" />
        <path d="M100,40 Q85,25 75,10 Q82,22 100,30"
          fill="none" stroke={c1} strokeWidth="1.5" opacity="0.5" />

        <path d="M100,40 Q115,25 125,10 Q118,22 100,30"
          fill={c1} opacity="0.3" />
        <path d="M100,40 Q115,25 125,10 Q118,22 100,30"
          fill="none" stroke={c1} strokeWidth="1.5" opacity="0.5" />

        <path d="M100,40 Q75,35 60,25 Q78,32 100,34"
          fill={c4} opacity="0.2" />
        <path d="M100,40 Q75,35 60,25 Q78,32 100,34"
          fill="none" stroke={c1} strokeWidth="1.2" opacity="0.4" />

        <path d="M100,40 Q125,35 140,25 Q122,32 100,34"
          fill={c4} opacity="0.2" />
        <path d="M100,40 Q125,35 140,25 Q122,32 100,34"
          fill="none" stroke={c1} strokeWidth="1.2" opacity="0.4" />

        <path d="M100,40 Q95,22 100,10 Q105,22 100,40"
          fill={c4} opacity="0.25" />
        <path d="M100,40 Q95,22 100,10 Q105,22 100,40"
          fill="none" stroke={c1} strokeWidth="1.2" opacity="0.45" />

        {/* Centro de la flor */}
        <circle cx="100" cy="38" r="8" fill={`url(#${id}grad1)`} />
        <circle cx="100" cy="38" r="8" fill="none"
          stroke={c1} strokeWidth="1.5" opacity="0.55" />
        <circle cx="100" cy="38" r="5" fill={c2} opacity="0.4" />
        <circle cx="100" cy="38" r="3" fill={c1} opacity="0.5" />
        <circle cx="100" cy="38" r="2" fill={c5} opacity="0.5" />

        {/* ══ HOJAS — curvas whiplash ══ */}
        {/* Hoja izquierda 1 */}
        <path d="M85,180 Q55,165 35,170 Q55,175 80,182"
          fill={c1} opacity="0.2" />
        <path d="M85,180 Q55,165 35,170 Q55,175 80,182"
          fill="none" stroke={c1} strokeWidth="1.5" opacity="0.45" />
        <path d="M80,178 Q60,170 42,172"
          fill="none" stroke={c2} strokeWidth="0.6" opacity="0.3" />
        <path d="M62,172 Q68,175 72,173" fill="none" stroke={c1} strokeWidth="0.4" opacity="0.2" />

        {/* Hoja izquierda 2 */}
        <path d="M80,120 Q50,108 30,115 Q52,118 78,122"
          fill={c1} opacity="0.18" />
        <path d="M80,120 Q50,108 30,115 Q52,118 78,122"
          fill="none" stroke={c1} strokeWidth="1.5" opacity="0.42" />
        <path d="M76,118 Q55,112 38,116"
          fill="none" stroke={c2} strokeWidth="0.6" opacity="0.28" />

        {/* Hoja derecha 1 */}
        <path d="M88,150 Q120,135 140,140 Q118,142 90,152"
          fill={c1} opacity="0.2" />
        <path d="M88,150 Q120,135 140,140 Q118,142 90,152"
          fill="none" stroke={c1} strokeWidth="1.5" opacity="0.45" />
        <path d="M92,148 Q115,138 134,141"
          fill="none" stroke={c2} strokeWidth="0.6" opacity="0.3" />

        {/* Hoja derecha 2 */}
        <path d="M92,210 Q125,198 150,205 Q122,208 94,212"
          fill={c1} opacity="0.18" />
        <path d="M92,210 Q125,198 150,205 Q122,208 94,212"
          fill="none" stroke={c1} strokeWidth="1.5" opacity="0.42" />
        <path d="M96,208 Q120,200 142,204"
          fill="none" stroke={c2} strokeWidth="0.6" opacity="0.28" />

        {/* Hoja pequeña izquierda */}
        <path d="M78,70 Q60,60 48,65 Q62,68 76,72"
          fill={c4} opacity="0.15" />
        <path d="M78,70 Q60,60 48,65 Q62,68 76,72"
          fill="none" stroke={c1} strokeWidth="1.2" opacity="0.35" />

        {/* ══ ZARCILLOS — espirales decorativas ══ */}
        {/* Zarcillo izquierdo superior */}
        <path d="M75,95 Q60,90 50,95 Q42,102 48,110 Q55,115 62,108"
          fill="none" stroke={c1} strokeWidth="1.5" opacity="0.4"
          strokeLinecap="round" />

        {/* Zarcillo derecho medio */}
        <path d="M90,150 Q105,145 115,150 Q122,158 115,165 Q108,168 105,162"
          fill="none" stroke={c1} strokeWidth="1.5" opacity="0.38"
          strokeLinecap="round" />

        {/* Zarcillo izquierdo inferior */}
        <path d="M85,240 Q70,235 58,240 Q50,248 58,255 Q65,258 68,250"
          fill="none" stroke={c1} strokeWidth="1.5" opacity="0.35"
          strokeLinecap="round" />

        {/* Zarcillo derecho superior */}
        <path d="M105,85 Q118,82 128,88 Q135,95 128,102 Q120,105 115,98"
          fill="none" stroke={c1} strokeWidth="1.3" opacity="0.35"
          strokeLinecap="round" />

        {/* Zarcillo derecho inferior */}
        <path d="M95,265 Q108,262 120,268 Q128,275 122,282 Q112,285 108,278"
          fill="none" stroke={c1} strokeWidth="1.3" opacity="0.32"
          strokeLinecap="round" />

        {/* ══ CAPULLOS — flores secundarias ══ */}
        {/* Capullo izquierdo */}
        <path d="M48,110 Q42,100 38,90" fill="none"
          stroke={c2} strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
        <path d="M38,90 Q35,82 30,85 Q33,80 38,78 Q42,80 40,85"
          fill={c1} opacity="0.3" />
        <path d="M38,90 Q35,82 30,85 Q33,80 38,78 Q42,80 40,85"
          fill="none" stroke={c1} strokeWidth="1" opacity="0.45" />

        {/* Capullo derecho */}
        <path d="M115,165 Q122,172 128,180" fill="none"
          stroke={c2} strokeWidth="1.5" opacity="0.38" strokeLinecap="round" />
        <path d="M128,180 Q132,188 138,185 Q135,190 130,192 Q125,190 127,185"
          fill={c1} opacity="0.28" />
        <path d="M128,180 Q132,188 138,185 Q135,190 130,192 Q125,190 127,185"
          fill="none" stroke={c1} strokeWidth="1" opacity="0.42" />

        {/* Capullo central — pequeño */}
        <path d="M100,95 Q98,88 100,82" fill="none"
          stroke={c2} strokeWidth="1.2" opacity="0.35" strokeLinecap="round" />
        <path d="M100,82 Q97,78 98,74 Q102,76 100,80"
          fill={c1} opacity="0.25" />
        <path d="M100,82 Q97,78 98,74 Q102,76 100,80"
          fill="none" stroke={c1} strokeWidth="0.9" opacity="0.4" />

        {/* ══ ORNAMENTO SUPERIOR — arco decorativo ══ */}
        <path d="M30,20 Q60,30 100,15 Q140,30 170,20"
          fill="none" stroke={c1} strokeWidth="1.5" opacity="0.4" />
        {/* Flourishes en el arco */}
        <path d="M55,22 Q58,18 62,20" fill="none" stroke={c1} strokeWidth="0.8" opacity="0.3" strokeLinecap="round" />
        <path d="M145,22 Q142,18 138,20" fill="none" stroke={c1} strokeWidth="0.8" opacity="0.3" strokeLinecap="round" />

        {/* Gota colgante */}
        <path d="M100,15 L100,22" stroke={c1} strokeWidth="1" opacity="0.35" />
        <circle cx="100" cy="24" r="2" fill={c1} opacity="0.35" />

        {/* ══ ORNAMENTO INFERIOR — raíces decorativas ══ */}
        <path d="M100,290 Q85,280 70,285 Q55,292 40,285"
          fill="none" stroke={c1} strokeWidth="2" opacity="0.4"
          strokeLinecap="round" />
        <path d="M100,290 Q115,280 130,285 Q145,292 160,285"
          fill="none" stroke={c1} strokeWidth="2" opacity="0.4"
          strokeLinecap="round" />

        {/* Raicillas */}
        <path d="M40,285 Q30,282 25,288" fill="none"
          stroke={c1} strokeWidth="1.2" opacity="0.3" strokeLinecap="round" />
        <path d="M160,285 Q170,282 175,288" fill="none"
          stroke={c1} strokeWidth="1.2" opacity="0.3" strokeLinecap="round" />
        <path d="M70,288 Q65,292 62,290" fill="none"
          stroke={c1} strokeWidth="0.9" opacity="0.25" strokeLinecap="round" />
        <path d="M130,288 Q135,292 138,290" fill="none"
          stroke={c1} strokeWidth="0.9" opacity="0.25" strokeLinecap="round" />

        {/* ══ LÍNEAS DECORATIVAS LATERALES ══ */}
        {/* Izquierda — línea que acompaña el marco */}
        <path d="M20,50 
                 Q25,80 22,110 
                 Q18,140 22,170 
                 Q28,200 22,230 
                 Q18,260 22,280"
          fill="none" stroke={c1} strokeWidth="0.8" opacity="0.25" />

        {/* Derecha */}
        <path d="M180,50 
                 Q175,80 178,110 
                 Q182,140 178,170 
                 Q172,200 178,230 
                 Q182,260 178,280"
          fill="none" stroke={c1} strokeWidth="0.8" opacity="0.25" />

        {/* ══ PUNTOS DE ROCÍO — detalles ══ */}
        {[
          [35, 170, 2.5], [140, 140, 2], [48, 65, 2],
          [62, 108, 2], [105, 162, 2], [58, 240, 1.8],
          [68, 250, 1.5], [30, 115, 2], [150, 205, 2],
          [115, 98, 1.5], [108, 278, 1.4], [100, 80, 1.2],
        ].map(([x, y, r], i) => (
          <g key={`dew${i}`}>
            <circle cx={x} cy={y} r={r as number}
              fill={c4} opacity={0.3 + (i % 3) * 0.08} />
            <circle cx={(x as number) - (r as number) * 0.3}
              cy={(y as number) - (r as number) * 0.3}
              r={(r as number) * 0.35}
              fill={c5} opacity={0.25 + (i % 3) * 0.06} />
          </g>
        ))}

        {/* ══ MOTIVOS EN ESQUINAS — relleno orgánico ══ */}
        {/* Esquina superior izquierda */}
        <path d="M16,16 Q30,22 25,38 Q20,30 16,16"
          fill={c1} opacity="0.12" />
        <path d="M16,16 Q30,22 25,38"
          fill="none" stroke={c1} strokeWidth="1" opacity="0.35" />

        {/* Esquina superior derecha */}
        <path d="M184,16 Q170,22 175,38 Q180,30 184,16"
          fill={c1} opacity="0.12" />
        <path d="M184,16 Q170,22 175,38"
          fill="none" stroke={c1} strokeWidth="1" opacity="0.35" />
        <path d="M182,28 Q178,24 174,28" fill="none" stroke={c1} strokeWidth="0.6" opacity="0.25" />

        {/* Esquina inferior izquierda */}
        <path d="M16,284 Q30,278 25,262 Q20,270 16,284"
          fill={c1} opacity="0.12" />
        <path d="M16,284 Q30,278 25,262"
          fill="none" stroke={c1} strokeWidth="1" opacity="0.35" />
        <path d="M18,272 Q22,276 26,272" fill="none" stroke={c1} strokeWidth="0.6" opacity="0.25" />

        {/* Esquina inferior derecha */}
        <path d="M184,284 Q170,278 175,262 Q180,270 184,284"
          fill={c1} opacity="0.12" />
        <path d="M184,284 Q170,278 175,262"
          fill="none" stroke={c1} strokeWidth="1" opacity="0.35" />
        <path d="M182,272 Q178,276 174,272" fill="none" stroke={c1} strokeWidth="0.6" opacity="0.25" />

        {/* ══ MARIPOSA — motivo izquierdo ══ */}
        <path d="M45,75 L45,88" stroke={c2} strokeWidth="1.5"
          strokeLinecap="round" opacity="0.4" />
        <circle cx="45" cy="72" r="2.5" fill={c2} opacity="0.35" />
        <circle cx="45" cy="72" r="1.2" fill={c4} opacity="0.3" />
        <path d="M45,76 Q35,70 32,62 Q38,68 45,74"
          fill={c4} opacity="0.12" />
        <path d="M45,76 Q35,70 32,62"
          fill="none" stroke={c1} strokeWidth="0.8" opacity="0.3" />
        <path d="M45,76 Q55,70 58,62 Q52,68 45,74"
          fill={c4} opacity="0.12" />
        <path d="M45,76 Q55,70 58,62"
          fill="none" stroke={c1} strokeWidth="0.8" opacity="0.3" />
        <path d="M45,80 Q38,78 36,74" fill="none" stroke={c1} strokeWidth="0.6" opacity="0.25" />
        <path d="M45,80 Q52,78 54,74" fill="none" stroke={c1} strokeWidth="0.6" opacity="0.25" />

        {/* ══ LIBÉLULA — motivo art nouveau ══ */}
        {/* Cuerpo */}
        <path d="M155,55 L155,78" stroke={c2} strokeWidth="2"
          strokeLinecap="round" opacity="0.45" />
        {/* Cabeza */}
        <circle cx="155" cy="53" r="3" fill={c2} opacity="0.4" />
        <circle cx="155" cy="53" r="1.5" fill={c4} opacity="0.35" />
        {/* Alas superiores */}
        <path d="M155,58 Q140,50 138,40 Q145,48 155,55"
          fill={c4} opacity="0.15" />
        <path d="M155,58 Q140,50 138,40"
          fill="none" stroke={c1} strokeWidth="1" opacity="0.35" />
        <path d="M155,58 Q170,50 172,40 Q165,48 155,55"
          fill={c4} opacity="0.15" />
        <path d="M155,58 Q170,50 172,40"
          fill="none" stroke={c1} strokeWidth="1" opacity="0.35" />
        {/* Alas inferiores */}
        <path d="M155,62 Q142,58 140,50"
          fill="none" stroke={c1} strokeWidth="0.8" opacity="0.3" />
        <path d="M155,62 Q168,58 170,50"
          fill="none" stroke={c1} strokeWidth="0.8" opacity="0.3" />

        {/* ══ LÍNEA CENTRAL SUTIL ══ */}
        <path d="M100,290 L100,40" stroke={c1} strokeWidth="0.3"
          opacity="0.08" strokeDasharray="6,6" />

      </g>
    </svg>
  );
}
