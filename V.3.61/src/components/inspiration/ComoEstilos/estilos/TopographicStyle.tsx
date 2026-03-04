import type { ComoEstiloProps } from '../types';
import { darken, lighten } from '../estiloColorUtils';

/* ═══════════════════════════════════════
   ESTILO: TOPOGRÁFICO
   Mapas de contorno, elevación, terreno
   ═══════════════════════════════════════ */
export function TopographicStyle({ color = '#818cf8', className = '' }: ComoEstiloProps) {
  const c1 = color;
  const c2 = darken(color, 60);
  const c3 = darken(color, 120);
  const c4 = lighten(color, 80);

  return (
    <svg viewBox="0 0 200 300" className={className} style={{ width: '100%', height: '100%' }}>
      <g transform="translate(12, 18) scale(0.9)">
      <path d="M-20,200 Q20,180 50,190 Q80,200 100,175 Q120,150 160,160 Q190,168 220,155" fill="none" stroke={c1} strokeWidth="1" opacity="0.2" />
      <path d="M-10,185 Q25,165 55,175 Q80,185 100,160 Q125,138 155,148 Q185,155 210,142" fill="none" stroke={c1} strokeWidth="1" opacity="0.25" />
      <path d="M0,170 Q30,150 55,158 Q78,165 100,143 Q125,122 150,132 Q178,140 200,128" fill="none" stroke={c1} strokeWidth="1" opacity="0.3" />
      <path d="M10,155 Q35,138 58,145 Q78,150 100,128 Q122,108 148,118 Q172,125 195,115" fill="none" stroke={c1} strokeWidth="1" opacity="0.35" />
      <path d="M25,142 Q45,128 62,133 Q80,138 100,115 Q118,95 142,105 Q165,112 185,102" fill="none" stroke={c1} strokeWidth="1.2" opacity="0.4" />
      <path d="M38,130 Q55,118 68,122 Q82,128 100,105 Q115,88 138,95 Q155,100 175,92" fill="none" stroke={c1} strokeWidth="1.2" opacity="0.42" />
      <path d="M48,120 Q62,110 75,113 Q85,118 100,98 Q112,82 132,88 Q148,92 165,85" fill="none" stroke={c1} strokeWidth="1.2" opacity="0.45" />
      <path d="M58,112 Q70,102 80,105 Q88,110 100,92 Q110,78 128,82 Q140,85 155,78" fill="none" stroke={c1} strokeWidth="1.3" opacity="0.48" />
      <path d="M68,104 Q78,96 85,98 Q92,102 100,86 Q108,74 122,78 Q132,80 145,74" fill="none" stroke={c1} strokeWidth="1.3" opacity="0.5" />
      <path d="M82,95 Q88,88 95,92 Q100,82 105,90 Q112,86 118,92" fill="none" stroke={c1} strokeWidth="1.5" opacity="0.55" />
      <circle cx="100" cy="82" r="2" fill={c1} opacity="0.6" />
      <path d="M96,80 L100,74 L104,80" fill="none" stroke={c1} strokeWidth="1" opacity="0.5" />

      <path d="M-20,260 Q10,248 30,255 Q55,262 70,245 Q82,232 90,240" fill="none" stroke={c1} strokeWidth="1" opacity="0.25" />
      <path d="M-10,250 Q15,238 35,245 Q52,252 65,235 Q75,225 85,230" fill="none" stroke={c1} strokeWidth="1" opacity="0.3" />
      <path d="M0,242 Q20,232 38,237 Q50,242 60,228 Q68,220 78,224" fill="none" stroke={c1} strokeWidth="1" opacity="0.35" />
      <path d="M10,235 Q25,226 40,230 Q48,234 55,222 Q62,215 70,218" fill="none" stroke={c1} strokeWidth="1.2" opacity="0.38" />
      <path d="M22,228 Q32,222 42,224 Q48,228 52,218 Q56,212 62,215" fill="none" stroke={c1} strokeWidth="1.2" opacity="0.4" />
      <circle cx="52" cy="214" r="1.5" fill={c1} opacity="0.45" />

      <path d="M140,260 Q160,250 175,258 Q195,265 220,255" fill="none" stroke={c1} strokeWidth="1" opacity="0.25" />
      <path d="M148,252 Q162,242 175,248 Q192,255 210,248" fill="none" stroke={c1} strokeWidth="1" opacity="0.3" />
      <path d="M155,245 Q165,238 175,242 Q188,248 200,242" fill="none" stroke={c1} strokeWidth="1" opacity="0.35" />
      <path d="M160,240 Q168,234 175,237 Q184,242 195,237" fill="none" stroke={c1} strokeWidth="1.2" opacity="0.38" />
      <circle cx="175" cy="234" r="1.5" fill={c1} opacity="0.4" />

      <path d="M20,50 Q50,45 70,55 Q85,62 90,50 Q95,38 85,30 Q70,25 55,32 Q35,42 20,50 Z" fill={c4} opacity="0.1" />
      <path d="M20,50 Q50,45 70,55 Q85,62 90,50 Q95,38 85,30 Q70,25 55,32 Q35,42 20,50 Z" fill="none" stroke={c1} strokeWidth="1" opacity="0.3" />
      <path d="M30,48 Q52,44 65,52 Q78,57 82,48 Q85,40 78,35 Q68,30 58,35 Q42,42 30,48 Z" fill="none" stroke={c1} strokeWidth="1" opacity="0.35" />
      <path d="M40,46 Q55,43 62,48 Q72,52 75,46 Q77,42 72,38 Q65,35 58,38 Q48,42 40,46 Z" fill="none" stroke={c1} strokeWidth="1" opacity="0.4" />
      <path d="M50,44 Q58,42 63,46 Q67,48 66,44 Q65,41 60,40 Q55,41 50,44 Z" fill={c1} opacity="0.15" />
      <path d="M50,44 Q58,42 63,46 Q67,48 66,44 Q65,41 60,40 Q55,41 50,44 Z" fill="none" stroke={c1} strokeWidth="0.8" opacity="0.45" />

      <path d="M90,50 Q105,65 108,85 Q110,100 100,115" fill="none" stroke={c1} strokeWidth="1.5" opacity="0.45" strokeLinecap="round" />
      <path d="M100,115 Q95,130 100,145 Q108,165 100,175" fill="none" stroke={c1} strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
      <path d="M100,175 Q90,190 85,210 Q80,230 75,245" fill="none" stroke={c1} strokeWidth="1.8" opacity="0.38" strokeLinecap="round" />
      <path d="M75,245 Q70,260 60,275 Q50,290 45,310" fill="none" stroke={c1} strokeWidth="2" opacity="0.35" strokeLinecap="round" />
      <path d="M160,90 Q140,100 125,110 Q112,118 108,130" fill="none" stroke={c1} strokeWidth="1" opacity="0.3" strokeLinecap="round" strokeDasharray="4,3" />

      {[[20, 80], [180, 40], [150, 180], [30, 175], [100, 270], [170, 120]].map(([x, y], i) => (
        <g key={`coord${i}`} opacity="0.3">
          <path d={`M${(x as number) - 4},${y} L${(x as number) + 4},${y}`} stroke={c2} strokeWidth="0.8" />
          <path d={`M${x},${(y as number) - 4} L${x},${(y as number) + 4}`} stroke={c2} strokeWidth="0.8" />
        </g>
      ))}

      <text x="103" y="79" fontSize="6" fill={c1} opacity="0.5" fontFamily="monospace">847</text>
      <text x="55" y="211" fontSize="5" fill={c1} opacity="0.4" fontFamily="monospace">523</text>
      <text x="178" y="231" fontSize="5" fill={c1} opacity="0.4" fontFamily="monospace">412</text>
      <text x="53" y="41" fontSize="5" fill={c1} opacity="0.4" fontFamily="monospace">215</text>

      <path d="M140,280 L190,280" stroke={c1} strokeWidth="1" opacity="0.4" />
      <path d="M140,278 L140,282" stroke={c1} strokeWidth="1" opacity="0.4" />
      <path d="M165,278 L165,282" stroke={c1} strokeWidth="1" opacity="0.4" />
      <path d="M190,278 L190,282" stroke={c1} strokeWidth="1" opacity="0.4" />
      <text x="158" y="277" fontSize="5" fill={c1} opacity="0.35" fontFamily="monospace">1km</text>

      <g transform="translate(180, 20)">
        <path d="M0,12 L0,-12" stroke={c1} strokeWidth="1.2" opacity="0.45" />
        <path d="M-4,-8 L0,-14 L4,-8" fill={c1} opacity="0.4" />
        <text x="-3" y="-16" fontSize="6" fill={c1} opacity="0.4" fontFamily="monospace">N</text>
      </g>

      {[50, 100, 150].map((x, i) => (
        <path key={`mgv${i}`} d={`M${x},0 L${x},300`} stroke={c1} strokeWidth="0.3" opacity="0.08" strokeDasharray="8,8" />
      ))}
      {[60, 120, 180, 240].map((y, i) => (
        <path key={`mgh${i}`} d={`M0,${y} L200,${y}`} stroke={c1} strokeWidth="0.3" opacity="0.08" strokeDasharray="8,8" />
      ))}

      {[[20, 130], [35, 155], [25, 145], [15, 160], [160, 175], [172, 165], [165, 155]].map(([x, y], i) => (
        <g key={`tree${i}`} opacity={0.3 + (i % 3) * 0.05}>
          <circle cx={x} cy={y} r="3" fill="none" stroke={c1} strokeWidth="0.8" />
          <path d={`M${x},${(y as number) - 3} L${x},${(y as number) - 6}`} stroke={c1} strokeWidth="0.8" />
        </g>
      ))}

      <path d="M-20,275 Q30,268 70,278 Q110,288 150,275 Q180,265 220,272" fill="none" stroke={c1} strokeWidth="1" opacity="0.2" />
      <path d="M-20,288 Q40,280 80,290 Q120,300 160,288 Q190,278 220,285" fill="none" stroke={c1} strokeWidth="1" opacity="0.18" />
      <path d="M-20,15 Q30,22 70,12 Q110,5 150,15 Q180,22 220,18" fill="none" stroke={c1} strokeWidth="1" opacity="0.15" />

      <path d="M0,220 Q15,215 25,222 Q40,230 55,225 Q70,218 80,225" fill="none" stroke={c2} strokeWidth="1.2" opacity="0.3" strokeDasharray="3,3" strokeLinecap="round" />

      <rect x="28" y="218" width="5" height="5" fill={c2} opacity="0.35" />
      <rect x="28" y="218" width="5" height="5" fill="none" stroke={c1} strokeWidth="0.6" opacity="0.4" />
      </g>

      {/* Marco — rectángulo que recoge toda la imagen */}
      <rect x="4" y="4" width="192" height="292" fill="none" stroke={c1} strokeWidth="0.7" opacity="0.25" />
      {/* Segundo rectángulo — más fino, desfasado hacia dentro, línea discontinua */}
      <rect x="10" y="10" width="180" height="284" fill="none" stroke={c1} strokeWidth="0.35" opacity="0.25" strokeDasharray="4,3" />
    </svg>
  );
}
