import { useId } from 'react';
import type { ComoEstiloProps } from '../types';
import { rotateHue } from '../../../../utils/colorUtils';
import { darken, lighten } from '../estiloColorUtils';

/* ═══════════════════════════════════════
   ESTILO: JAPONÉS / ZEN
   Asimetría, vacío, naturaleza, pincelada
   ═══════════════════════════════════════ */
export function ZenStyle({ color = '#818cf8', className = '' }: ComoEstiloProps) {
  const id = useId().replace(/:/g, '');

  const c1 = color;
  const c2 = darken(color, 80);
  const c3 = darken(color, 130);
  const c4 = lighten(color, 90);
  const cBlossom = rotateHue(color, 25); // Tono sutil para pétalos de cerezo

  return (
    <svg viewBox="0 0 200 300" className={className} style={{ width: '100%', height: '100%' }}>
      <defs>
        <pattern id={`${id}zen-stripes`} width="200" height="4" patternUnits="userSpaceOnUse">
          <path d="M0,2 L200,2" stroke={c2} strokeWidth="1" opacity="0.08" />
        </pattern>
        <radialGradient id={`${id}zen-bg`} cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor={c4} stopOpacity="0.06" />
          <stop offset="100%" stopColor={c1} stopOpacity="0.01" />
        </radialGradient>
        <linearGradient id={`${id}zen-mist`} x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor={c4} stopOpacity="0" />
          <stop offset="50%" stopColor={c4} stopOpacity="0.04" />
          <stop offset="100%" stopColor={c4} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* ══ RECTÁNGULO DE FONDO — entramado de rayas horizontales ══ */}
      <rect width="200" height="300" fill={`url(#${id}zen-stripes)`} />

      {/* ══ ATMÓSFERA SUTIL ══ */}
      <rect width="200" height="300" fill={`url(#${id}zen-bg)`} />
      <rect width="200" height="150" y="150" fill={`url(#${id}zen-mist)`} opacity="0.8" />
      {/* ══ ENSŌ — círculo zen incompleto ══ */}
      {/* Trazo de fondo (sombra de tinta) */}
      <path
        d="M60,90 Q30,90 30,130 Q30,170 60,175 Q90,180 110,160 Q130,140 125,110 Q120,85 95,80"
        fill="none"
        stroke={c2}
        strokeWidth="10"
        strokeLinecap="round"
        opacity="0.2"
      />
      <path
        d="M60,90 
               Q30,90 30,130 
               Q30,170 60,175 
               Q90,180 110,160 
               Q130,140 125,110
               Q120,85 95,80"
        fill="none"
        stroke={c1}
        strokeWidth="8"
        strokeLinecap="round"
        opacity="0.65"
      />
      <path d="M95,80 Q85,78 80,82" fill="none" stroke={c1} strokeWidth="5" strokeLinecap="round" opacity="0.35" />

      {/* ══ RAMA DE BAMBÚ ══ */}
      <path d="M160,280 Q158,220 162,160 Q165,100 155,40" fill="none" stroke={c2} strokeWidth="3" strokeLinecap="round" opacity="0.6" />
      <path d="M157,240 L165,238" stroke={c2} strokeWidth="2.5" opacity="0.5" />
      <path d="M159,180 L167,178" stroke={c2} strokeWidth="2.5" opacity="0.5" />
      <path d="M161,120 L168,117" stroke={c2} strokeWidth="2" opacity="0.45" />
      <path d="M158,70 L165,67" stroke={c2} strokeWidth="2" opacity="0.4" />
      <path d="M162,160 Q175,150 185,155" fill="none" stroke={c1} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      <path d="M162,160 Q178,158 190,148" fill="none" stroke={c1} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <path d="M165,100 Q180,95 188,100" fill="none" stroke={c1} strokeWidth="2" strokeLinecap="round" opacity="0.45" />
      <path d="M165,100 Q175,90 180,82" fill="none" stroke={c1} strokeWidth="1.5" strokeLinecap="round" opacity="0.35" />
      <path d="M155,55 Q140,48 130,52" fill="none" stroke={c1} strokeWidth="1.8" strokeLinecap="round" opacity="0.4" />
      <path d="M155,55 Q145,42 150,30" fill="none" stroke={c1} strokeWidth="1.5" strokeLinecap="round" opacity="0.35" />
      {/* Hojas lado izquierdo del bambú */}
      <path d="M158,220 Q145,215 138,220" fill="none" stroke={c1} strokeWidth="1.8" strokeLinecap="round" opacity="0.4" />
      <path d="M158,220 Q142,222 135,218" fill="none" stroke={c1} strokeWidth="1.5" strokeLinecap="round" opacity="0.35" />
      <path d="M160,140 Q148,138 142,143" fill="none" stroke={c1} strokeWidth="1.6" strokeLinecap="round" opacity="0.38" />
      <path d="M160,140 Q150,135 145,128" fill="none" stroke={c1} strokeWidth="1.4" strokeLinecap="round" opacity="0.3" />
      <path d="M156,85 Q142,82 135,88" fill="none" stroke={c1} strokeWidth="1.5" strokeLinecap="round" opacity="0.35" />

      {/* ══ MONTAÑA DISTANTE ══ */}
      <path d="M0,250 Q40,220 70,235 Q90,242 100,238" fill="none" stroke={c2} strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
      <path d="M5,260 Q50,235 85,248" fill="none" stroke={c2} strokeWidth="1" strokeLinecap="round" opacity="0.2" />
      <path d="M10,268 Q55,248 95,258" fill="none" stroke={c3} strokeWidth="0.8" strokeLinecap="round" opacity="0.15" />

      {/* ══ ONDAS DE AGUA ══ */}
      <path d="M0,285 Q25,280 50,285 Q75,290 100,285 Q125,280 140,285" fill="none" stroke={c1} strokeWidth="1.2" strokeLinecap="round" opacity="0.35" />
      <path d="M0,278 Q30,273 60,278 Q90,283 120,278 Q145,273 165,278" fill="none" stroke={c2} strokeWidth="0.9" strokeLinecap="round" opacity="0.22" />
      <path d="M0,292 Q20,290 45,292 Q70,294 95,292 Q120,290 150,292" fill="none" stroke={c1} strokeWidth="0.7" strokeLinecap="round" opacity="0.18" />

      {/* ══ PIEDRAS ══ */}
      <path d="M25,270 Q20,265 22,258 Q28,252 35,255 Q40,260 38,268 Q32,274 25,270" fill={c2} opacity="0.35" />
      <path d="M50,275 Q48,270 52,267 Q58,268 60,273 Q57,278 50,275" fill={c2} opacity="0.25" />
      <path d="M70,278 Q72,275 76,277 Q75,280 70,278" fill={c2} opacity="0.2" />
      <path d="M90,272 Q88,268 92,266 Q96,268 94,272 Q92,275 90,272" fill={c2} opacity="0.18" />
      <path d="M110,276 Q112,273 116,275 Q114,278 110,276" fill={c3} opacity="0.15" />

      {/* ══ SELLO HANKO ══ */}
      <rect x="15" y="20" width="24" height="28" rx="2" fill={c1} opacity="0.55" />
      <path d="M22,30 L32,30 M27,28 L27,42 M22,38 L32,38" stroke={c4} strokeWidth="2" strokeLinecap="round" opacity="0.75" />

      {/* ══ GOTAS DE TINTA ══ */}
      <circle cx="45" cy="195" r="2" fill={c1} opacity="0.3" />
      <circle cx="52" cy="200" r="1.2" fill={c1} opacity="0.25" />
      <circle cx="48" cy="205" r="0.8" fill={c1} opacity="0.2" />
      <circle cx="130" cy="190" r="1.5" fill={c2} opacity="0.25" />
      <circle cx="125" cy="195" r="1" fill={c2} opacity="0.2" />
      <circle cx="38" cy="175" r="1.2" fill={c1} opacity="0.22" />
      <circle cx="115" cy="210" r="0.9" fill={c2} opacity="0.2" />
      <circle cx="95" cy="175" r="1.5" fill={c1} opacity="0.28" />
      <circle cx="60" cy="165" r="0.7" fill={c2} opacity="0.18" />

      {/* ══ FLOR DE CEREZO ══ */}
      <path d="M100,200 Q105,195 102,190 Q100,192 98,188 Q95,195 100,200" fill={cBlossom} opacity="0.35" />
      <path d="M85,230 Q88,227 86,224 Q84,226 82,223 Q80,227 85,230" fill={cBlossom} opacity="0.25" transform="rotate(25 85 227)" />
      <path d="M75,195 Q78,192 76,189 Q74,191 72,187 Q70,192 75,195" fill={cBlossom} opacity="0.22" transform="rotate(-15 75 192)" />
      <path d="M110,225 Q113,222 111,219 Q109,221 107,217 Q105,222 110,225" fill={cBlossom} opacity="0.2" transform="rotate(40 110 222)" />
      <path d="M92,245 Q94,243 93,241 Q91,242 90,240 Q89,243 92,245" fill={cBlossom} opacity="0.18" transform="rotate(-5 92 243)" />
      <path d="M65,210 Q67,208 66,206 Q64,207 63,205 Q62,208 65,210" fill={cBlossom} opacity="0.15" transform="rotate(20 65 208)" />

      {/* ══ CALIGRAFÍA ══ */}
      <path d="M30,140 Q35,135 50,138" fill="none" stroke={c2} strokeWidth="4" strokeLinecap="round" opacity="0.5" />
      <path d="M40,135 L40,165" fill="none" stroke={c2} strokeWidth="3" strokeLinecap="round" opacity="0.45" />
      <path d="M32,155 Q40,150 50,155" fill="none" stroke={c2} strokeWidth="3" strokeLinecap="round" opacity="0.4" />
      <path d="M38,162 Q42,175 52,180" fill="none" stroke={c2} strokeWidth="2.5" strokeLinecap="round" opacity="0.35" />
      <path d="M48,142 Q52,138 58,142" fill="none" stroke={c2} strokeWidth="2" strokeLinecap="round" opacity="0.3" />
      <path d="M35,168 L38,178" fill="none" stroke={c3} strokeWidth="1.5" strokeLinecap="round" opacity="0.25" />

      {/* ══ LUNA ══ */}
      <path d="M175,25 A15,15 0 1,1 175,55" fill={c4} opacity="0.25" />
      <path d="M175,25 A15,15 0 1,1 175,55" fill="none" stroke={c1} strokeWidth="0.8" opacity="0.3" />
      <path d="M172,38 A8,8 0 1,1 172,52" fill={c4} opacity="0.12" />

      {/* ══ PÁJAROS DISTANTES ══ */}
      <path d="M40,60 Q45,55 52,58" fill="none" stroke={c2} strokeWidth="1.2" strokeLinecap="round" opacity="0.35" />
      <path d="M52,58 Q58,55 65,60" fill="none" stroke={c2} strokeWidth="1.2" strokeLinecap="round" opacity="0.35" />
      <path d="M55,72 Q58,70 62,71" fill="none" stroke={c2} strokeWidth="0.8" strokeLinecap="round" opacity="0.25" />
      <path d="M62,71 Q66,69 70,72" fill="none" stroke={c2} strokeWidth="0.8" strokeLinecap="round" opacity="0.25" />
      <path d="M75,85 Q78,83 82,85" fill="none" stroke={c2} strokeWidth="0.7" strokeLinecap="round" opacity="0.2" />
      <path d="M82,85 Q85,83 89,85" fill="none" stroke={c2} strokeWidth="0.7" strokeLinecap="round" opacity="0.2" />

      {/* ══ NIEBLA ══ */}
      <path d="M0,220 Q30,215 60,220 Q90,225 120,218" fill="none" stroke={c4} strokeWidth="0.6" opacity="0.15" />
      <path d="M0,225 Q40,222 80,226" fill="none" stroke={c4} strokeWidth="0.5" opacity="0.1" />
      <path d="M0,232 Q50,228 100,232" fill="none" stroke={c4} strokeWidth="0.4" opacity="0.08" />
      <path d="M0,238 Q60,235 120,238" fill="none" stroke={c4} strokeWidth="0.35" opacity="0.06" />

      {/* ══ RAMA DE SAUCE — trazo delicado ══ */}
      <path d="M25,95 Q22,120 28,145 Q24,170 30,195" fill="none" stroke={c2} strokeWidth="1.2" strokeLinecap="round" opacity="0.25" />
      <path d="M28,120 Q35,118 38,122" fill="none" stroke={c1} strokeWidth="1" strokeLinecap="round" opacity="0.2" />
      <path d="M26,155 Q32,153 35,157" fill="none" stroke={c1} strokeWidth="0.9" strokeLinecap="round" opacity="0.18" />
      <path d="M30,185 Q36,183 39,187" fill="none" stroke={c1} strokeWidth="0.8" strokeLinecap="round" opacity="0.15" />

      {/* ══ RIZOS EN EL AGUA — ondulaciones sutiles ══ */}
      <path d="M35,282 Q38,280 42,282" fill="none" stroke={c2} strokeWidth="0.5" opacity="0.15" />
      <path d="M85,286 Q88,284 92,286" fill="none" stroke={c2} strokeWidth="0.5" opacity="0.12" />
      <path d="M130,284 Q133,282 137,284" fill="none" stroke={c2} strokeWidth="0.5" opacity="0.1" />

      {/* ══ PUNTO DE EQUILIBRIO ══ */}
      <circle cx="70" cy="130" r="2.5" fill={c2} opacity="0.4" />

      {/* ══ MARCO — rectángulo de perímetro con grosor ══ */}
      <rect x="4" y="4" width="192" height="292" fill="none" stroke={c2} strokeWidth="4" opacity="0.5" />
    </svg>
  );
}
