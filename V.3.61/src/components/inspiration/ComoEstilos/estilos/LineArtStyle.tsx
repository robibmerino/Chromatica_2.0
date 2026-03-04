import type { ComoEstiloProps } from '../types';
import { darken } from '../estiloColorUtils';

/* ═══════════════════════════════════════
   ESTILO: LINE ART
   Contorno puro, sin relleno, trazo continuo
   ═══════════════════════════════════════ */
export function LineArtStyle({ color = '#818cf8', className = '' }: ComoEstiloProps) {
  const c1 = color;
  const c2 = darken(color, 50);

  return (
    <svg viewBox="0 0 200 300" className={className} style={{ width: '100%', height: '100%' }}>
      {/* ══ ROSTRO — trazo continuo ══ */}
      <path
        d="M70,85 
               Q65,95 65,115 
               Q65,140 75,160 
               Q85,178 100,185 
               Q115,178 125,160 
               Q135,140 135,115 
               Q135,95 130,85
               Q120,70 100,68
               Q80,70 70,85"
        fill="none"
        stroke={c1}
        strokeWidth="2"
        opacity="0.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Ojo izquierdo */}
      <path d="M78,110 Q85,105 92,110 Q85,116 78,110" fill="none" stroke={c1} strokeWidth="1.5" opacity="0.6" strokeLinecap="round" />
      <circle cx="85" cy="110" r="2" fill="none" stroke={c1} strokeWidth="1.2" opacity="0.55" />

      {/* Ojo derecho */}
      <path d="M108,110 Q115,105 122,110 Q115,116 108,110" fill="none" stroke={c1} strokeWidth="1.5" opacity="0.6" strokeLinecap="round" />
      <circle cx="115" cy="110" r="2" fill="none" stroke={c1} strokeWidth="1.2" opacity="0.55" />

      {/* Cejas */}
      <path d="M76,102 Q85,98 94,102" fill="none" stroke={c1} strokeWidth="1.2" opacity="0.5" strokeLinecap="round" />
      <path d="M106,102 Q115,98 124,102" fill="none" stroke={c1} strokeWidth="1.2" opacity="0.5" strokeLinecap="round" />

      {/* Nariz */}
      <path d="M100,115 L100,135 Q95,140 100,142 Q105,140 100,135" fill="none" stroke={c1} strokeWidth="1.2" opacity="0.5" strokeLinecap="round" />

      {/* Boca */}
      <path d="M88,155 Q100,162 112,155" fill="none" stroke={c1} strokeWidth="1.5" opacity="0.55" strokeLinecap="round" />

      {/* Cabello — líneas fluidas */}
      <path d="M70,85 Q60,70 65,50 Q70,35 85,30 Q100,28 115,30 Q130,35 135,50 Q140,70 130,85" fill="none" stroke={c1} strokeWidth="1.8" opacity="0.6" strokeLinecap="round" />
      <path d="M75,50 Q72,65 70,85" fill="none" stroke={c1} strokeWidth="1" opacity="0.4" strokeLinecap="round" />
      <path d="M90,35 Q85,55 82,75" fill="none" stroke={c1} strokeWidth="1" opacity="0.35" strokeLinecap="round" />
      <path d="M110,35 Q115,55 118,75" fill="none" stroke={c1} strokeWidth="1" opacity="0.35" strokeLinecap="round" />
      <path d="M125,50 Q128,65 130,85" fill="none" stroke={c1} strokeWidth="1" opacity="0.4" strokeLinecap="round" />

      {/* ══ MANO — trazo delicado ══ */}
      <path d="M25,220 Q20,240 25,260 Q30,275 45,275 Q55,275 60,265 Q65,255 60,235" fill="none" stroke={c1} strokeWidth="1.8" opacity="0.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M30,220 Q28,205 32,195" fill="none" stroke={c1} strokeWidth="1.5" opacity="0.55" strokeLinecap="round" />
      <path d="M38,218 Q38,198 42,185" fill="none" stroke={c1} strokeWidth="1.5" opacity="0.55" strokeLinecap="round" />
      <path d="M48,220 Q50,200 52,188" fill="none" stroke={c1} strokeWidth="1.5" opacity="0.55" strokeLinecap="round" />
      <path d="M56,225 Q60,210 60,198" fill="none" stroke={c1} strokeWidth="1.5" opacity="0.5" strokeLinecap="round" />
      <path d="M25,245 Q15,242 12,232 Q10,222 18,218" fill="none" stroke={c1} strokeWidth="1.5" opacity="0.5" strokeLinecap="round" />
      <path d="M28,248 Q40,240 55,250" fill="none" stroke={c1} strokeWidth="0.8" opacity="0.3" strokeLinecap="round" />
      <path d="M30,258 Q42,252 52,258" fill="none" stroke={c1} strokeWidth="0.8" opacity="0.25" strokeLinecap="round" />

      {/* ══ FLOR — líneas botánicas ══ */}
      <path d="M160,280 Q155,250 160,220 Q165,195 155,175" fill="none" stroke={c1} strokeWidth="1.5" opacity="0.55" strokeLinecap="round" />
      <path d="M160,250 Q175,245 180,235 Q175,240 160,242" fill="none" stroke={c1} strokeWidth="1.2" opacity="0.45" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M158,230 Q140,228 135,218 Q142,223 158,222" fill="none" stroke={c1} strokeWidth="1.2" opacity="0.45" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M155,175 Q145,165 140,150 Q145,160 155,165" fill="none" stroke={c1} strokeWidth="1.3" opacity="0.5" strokeLinecap="round" />
      <path d="M155,175 Q165,160 175,150 Q168,162 158,170" fill="none" stroke={c1} strokeWidth="1.3" opacity="0.5" strokeLinecap="round" />
      <path d="M155,175 Q150,158 155,145 Q158,158 155,170" fill="none" stroke={c1} strokeWidth="1.3" opacity="0.5" strokeLinecap="round" />
      <path d="M155,175 Q140,172 130,165 Q142,170 152,173" fill="none" stroke={c1} strokeWidth="1.2" opacity="0.45" strokeLinecap="round" />
      <path d="M155,175 Q170,170 180,162 Q168,170 158,173" fill="none" stroke={c1} strokeWidth="1.2" opacity="0.45" strokeLinecap="round" />
      <circle cx="155" cy="170" r="5" fill="none" stroke={c1} strokeWidth="1.2" opacity="0.5" />
      <circle cx="155" cy="170" r="2" fill="none" stroke={c1} strokeWidth="1" opacity="0.4" />

      {/* ══ PÁJARO — trazo único ══ */}
      <path
        d="M20,50 
               Q25,45 35,48 
               Q45,50 50,55 
               Q52,52 55,52
               Q52,55 50,58
               Q45,62 35,60
               Q28,58 25,55
               Q22,52 20,50"
        fill="none"
        stroke={c1}
        strokeWidth="1.5"
        opacity="0.55"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="48" cy="53" r="1" fill="none" stroke={c1} strokeWidth="1" opacity="0.5" />
      <path d="M32,55 Q38,62 30,68 Q35,62 32,55" fill="none" stroke={c1} strokeWidth="1" opacity="0.4" strokeLinecap="round" />

      {/* ══ MARIPOSA — simetría en línea ══ */}
      <path d="M100,235 Q85,225 80,210 Q85,218 100,228" fill="none" stroke={c1} strokeWidth="1.3" opacity="0.5" strokeLinecap="round" />
      <path d="M100,235 Q88,242 82,255 Q90,248 100,242" fill="none" stroke={c1} strokeWidth="1.3" opacity="0.5" strokeLinecap="round" />
      <path d="M100,235 Q115,225 120,210 Q115,218 100,228" fill="none" stroke={c1} strokeWidth="1.3" opacity="0.5" strokeLinecap="round" />
      <path d="M100,235 Q112,242 118,255 Q110,248 100,242" fill="none" stroke={c1} strokeWidth="1.3" opacity="0.5" strokeLinecap="round" />
      <path d="M100,225 L100,250" fill="none" stroke={c1} strokeWidth="1.5" opacity="0.55" strokeLinecap="round" />
      <path d="M100,225 Q95,218 92,212" fill="none" stroke={c1} strokeWidth="1" opacity="0.4" strokeLinecap="round" />
      <path d="M100,225 Q105,218 108,212" fill="none" stroke={c1} strokeWidth="1" opacity="0.4" strokeLinecap="round" />

      {/* ══ HOJA SUELTA ══ */}
      <path d="M175,85 Q190,70 180,55 Q170,65 175,85" fill="none" stroke={c1} strokeWidth="1.3" opacity="0.45" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M177,80 Q180,70 178,60" fill="none" stroke={c1} strokeWidth="0.8" opacity="0.3" strokeLinecap="round" />

      {/* ══ PLUMA ══ */}
      <path d="M15,120 Q25,110 20,95 Q18,105 15,120" fill="none" stroke={c1} strokeWidth="1.2" opacity="0.45" strokeLinecap="round" />
      <path d="M15,120 Q8,108 12,95 Q12,108 15,120" fill="none" stroke={c1} strokeWidth="1.2" opacity="0.45" strokeLinecap="round" />
      <path d="M15,95 L16,130" fill="none" stroke={c1} strokeWidth="1" opacity="0.4" strokeLinecap="round" />
      <path d="M15,100 L20,98 M15,105 L21,102 M15,110 L19,108 M15,115 L18,114" fill="none" stroke={c1} strokeWidth="0.6" opacity="0.3" strokeLinecap="round" />
      <path d="M16,100 L10,99 M16,105 L9,103 M16,110 L11,109 M16,115 L12,115" fill="none" stroke={c1} strokeWidth="0.6" opacity="0.3" strokeLinecap="round" />

      {/* ══ FORMAS ABSTRACTAS — curvas sueltas ══ */}
      <path d="M5,170 Q15,165 25,175 Q35,185 25,195" fill="none" stroke={c2} strokeWidth="1" opacity="0.3" strokeLinecap="round" />
      <path d="M180,120 Q190,130 185,145" fill="none" stroke={c2} strokeWidth="1" opacity="0.3" strokeLinecap="round" />
      <path d="M70,280 Q80,275 90,282" fill="none" stroke={c2} strokeWidth="0.8" opacity="0.25" strokeLinecap="round" />

      {/* ══ CÍRCULOS DECORATIVOS — solo contorno ══ */}
      <circle cx="180" cy="25" r="8" fill="none" stroke={c1} strokeWidth="1.2" opacity="0.4" />
      <circle cx="180" cy="25" r="4" fill="none" stroke={c1} strokeWidth="0.8" opacity="0.3" />
      <circle cx="25" cy="155" r="6" fill="none" stroke={c1} strokeWidth="1" opacity="0.35" />
      <circle cx="185" cy="260" r="10" fill="none" stroke={c1} strokeWidth="1" opacity="0.35" />
      <circle cx="185" cy="260" r="5" fill="none" stroke={c1} strokeWidth="0.8" opacity="0.25" />

      {/* ══ PUNTOS DE ÉNFASIS — los únicos "rellenos" ══ */}
      <circle cx="85" cy="110" r="1" fill={c1} opacity="0.5" />
      <circle cx="115" cy="110" r="1" fill={c1} opacity="0.5" />
      <circle cx="155" cy="170" r="1.5" fill={c1} opacity="0.4" />
      <circle cx="48" cy="53" r="0.5" fill={c1} opacity="0.4" />
    </svg>
  );
}
