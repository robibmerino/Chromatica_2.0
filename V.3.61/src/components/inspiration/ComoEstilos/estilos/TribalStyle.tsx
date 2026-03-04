import type { ComoEstiloProps } from '../types';
import { darken, lighten } from '../estiloColorUtils';

/* ═══════════════════════════════════════
   ESTILO: TRIBAL / ÉTNICO
   Patrones ancestrales, simetría, ritmo
   ═══════════════════════════════════════ */
export function TribalStyle({ color = '#818cf8', className = '' }: ComoEstiloProps) {
  const c1 = color;
  const c2 = darken(color, 70);
  const c3 = darken(color, 130);
  const c4 = lighten(color, 80);

  return (
    <svg viewBox="0 0 200 300" className={className} style={{ width: '100%', height: '100%' }}>
      <rect x="0" y="0" width="200" height="30" fill={c3} opacity="0.25" />
      {Array.from({ length: 10 }).map((_, i) => (
        <path key={`zt${i}`} d={`M${i * 20},30 L${i * 20 + 10},10 L${i * 20 + 20},30 Z`} fill={c1} opacity="0.5" />
      ))}
      {Array.from({ length: 10 }).map((_, i) => (
        <path key={`zb${i}`} d={`M${i * 20},0 L${i * 20 + 10},20 L${i * 20 + 20},0 Z`} fill={c2} opacity="0.35" />
      ))}
      <path d="M0,30 L200,30" stroke={c1} strokeWidth="2" opacity="0.6" />

      <path d="M100,60 Q130,70 140,100 Q145,140 135,175 Q120,200 100,205 Q80,200 65,175 Q55,140 60,100 Q70,70 100,60 Z" fill={c2} opacity="0.4" />
      <path d="M100,60 Q130,70 140,100 Q145,140 135,175 Q120,200 100,205 Q80,200 65,175 Q55,140 60,100 Q70,70 100,60 Z" fill="none" stroke={c1} strokeWidth="2.5" opacity="0.65" />

      <path d="M75,75 L100,65 L125,75" fill="none" stroke={c1} strokeWidth="2" opacity="0.5" />
      <path d="M80,82 L100,73 L120,82" fill="none" stroke={c1} strokeWidth="1.5" opacity="0.4" />

      <ellipse cx="82" cy="110" rx="12" ry="8" fill={c3} opacity="0.5" />
      <ellipse cx="82" cy="110" rx="12" ry="8" fill="none" stroke={c1} strokeWidth="2" opacity="0.6" />
      <circle cx="82" cy="110" r="4" fill={c1} opacity="0.6" />
      <circle cx="82" cy="110" r="2" fill={c4} opacity="0.5" />

      <ellipse cx="118" cy="110" rx="12" ry="8" fill={c3} opacity="0.5" />
      <ellipse cx="118" cy="110" rx="12" ry="8" fill="none" stroke={c1} strokeWidth="2" opacity="0.6" />
      <circle cx="118" cy="110" r="4" fill={c1} opacity="0.6" />
      <circle cx="118" cy="110" r="2" fill={c4} opacity="0.5" />

      <path d="M72,120 L68,130 L72,128 L68,138" fill="none" stroke={c1} strokeWidth="1.5" opacity="0.45" />
      <path d="M128,120 L132,130 L128,128 L132,138" fill="none" stroke={c1} strokeWidth="1.5" opacity="0.45" />

      <path d="M100,115 L100,145" stroke={c1} strokeWidth="2" opacity="0.5" />
      <path d="M95,145 L100,150 L105,145" fill="none" stroke={c1} strokeWidth="2" opacity="0.5" />

      <path d="M85,165 Q100,175 115,165" fill="none" stroke={c1} strokeWidth="2.5" opacity="0.55" />
      <path d="M90,170 Q100,168 110,170" fill="none" stroke={c1} strokeWidth="1.5" opacity="0.4" />

      {[[68, 145], [70, 152], [72, 159], [132, 145], [130, 152], [128, 159]].map(([x, y], i) => (
        <path key={`cheek${i}`} d={`M${(x as number) - 5},${y} L${(x as number) + 5},${y}`} stroke={c1} strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      ))}

      <path d="M60,65 L100,45 L140,65" fill="none" stroke={c1} strokeWidth="2.5" opacity="0.55" />
      <path d="M70,60 L100,40 L130,60" fill="none" stroke={c2} strokeWidth="2" opacity="0.4" />
      <path d="M100,40 L100,25" stroke={c1} strokeWidth="2" opacity="0.5" />
      <path d="M100,25 L95,35 M100,25 L105,35" fill="none" stroke={c1} strokeWidth="1.5" opacity="0.4" />
      <path d="M85,48 L80,35" stroke={c1} strokeWidth="1.8" opacity="0.45" />
      <path d="M115,48 L120,35" stroke={c1} strokeWidth="1.8" opacity="0.45" />

      {Array.from({ length: 5 }).map((_, i) => (
        <g key={`ldiam${i}`}>
          <path d={`M20,${75 + i * 30} L30,${85 + i * 30} L20,${95 + i * 30} L10,${85 + i * 30} Z`} fill={i % 2 === 0 ? c1 : c2} opacity={0.4 - i * 0.03} />
          <path d={`M20,${75 + i * 30} L30,${85 + i * 30} L20,${95 + i * 30} L10,${85 + i * 30} Z`} fill="none" stroke={c1} strokeWidth="1.2" opacity="0.5" />
        </g>
      ))}

      {Array.from({ length: 5 }).map((_, i) => (
        <g key={`rdiam${i}`}>
          <path d={`M180,${75 + i * 30} L190,${85 + i * 30} L180,${95 + i * 30} L170,${85 + i * 30} Z`} fill={i % 2 === 0 ? c2 : c1} opacity={0.4 - i * 0.03} />
          <path d={`M180,${75 + i * 30} L190,${85 + i * 30} L180,${95 + i * 30} L170,${85 + i * 30} Z`} fill="none" stroke={c1} strokeWidth="1.2" opacity="0.5" />
        </g>
      ))}

      <rect x="0" y="210" width="200" height="25" fill={c3} opacity="0.2" />
      {Array.from({ length: 8 }).map((_, i) => (
        <path key={`greca${i}`} d={`M${i * 25},210 L${i * 25},218 L${i * 25 + 8},218 L${i * 25 + 8},225 L${i * 25 + 16},225 L${i * 25 + 16},235 L${i * 25 + 25},235`} fill="none" stroke={c1} strokeWidth="2" opacity="0.5" />
      ))}
      <path d="M0,210 L200,210" stroke={c1} strokeWidth="1.5" opacity="0.5" />
      <path d="M0,235 L200,235" stroke={c1} strokeWidth="1.5" opacity="0.5" />

      <g transform="translate(50, 265)">
        <circle cx="0" cy="0" r="12" fill={c2} opacity="0.4" />
        <circle cx="0" cy="0" r="12" fill="none" stroke={c1} strokeWidth="2" opacity="0.55" />
        <circle cx="0" cy="0" r="6" fill={c1} opacity="0.5" />
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          return <path key={`ray${i}`} d={`M${14 * Math.cos(angle)},${14 * Math.sin(angle)} L${20 * Math.cos(angle)},${20 * Math.sin(angle)}`} stroke={c1} strokeWidth="2" strokeLinecap="round" opacity="0.45" />;
        })}
      </g>

      <path d="M90,250 Q110,245 120,255 Q130,265 125,275 Q120,285 105,285 Q95,285 95,278" fill="none" stroke={c1} strokeWidth="3" strokeLinecap="round" opacity="0.5" />
      <circle cx="95" cy="278" r="2" fill={c1} opacity="0.5" />
      <path d="M90,250 L85,245 M90,250 L85,255" fill="none" stroke={c1} strokeWidth="2" opacity="0.45" />
      <path d="M105,252 L108,255 M115,260 L118,263 M122,270 L119,273" fill="none" stroke={c1} strokeWidth="1.5" opacity="0.35" />

      <g transform="translate(155, 265)">
        <path d="M0,-10 L10,0 L0,5 L-10,0 Z" fill={c2} opacity="0.45" />
        <path d="M0,-10 L10,0 L0,5 L-10,0 Z" fill="none" stroke={c1} strokeWidth="1.5" opacity="0.5" />
        <circle cx="0" cy="-2" r="2" fill={c1} opacity="0.5" />
        <path d="M-10,0 L-20,5 L-12,2" fill="none" stroke={c1} strokeWidth="1.5" opacity="0.4" />
        <path d="M10,0 L20,5 L12,2" fill="none" stroke={c1} strokeWidth="1.5" opacity="0.4" />
        <path d="M0,5 L-5,15 M0,5 L0,18 M0,5 L5,15" fill="none" stroke={c1} strokeWidth="1.5" opacity="0.4" />
      </g>

      <rect x="0" y="290" width="200" height="10" fill={c2} opacity="0.35" />
      {Array.from({ length: 20 }).map((_, i) => (
        <circle key={`dot${i}`} cx={5 + i * 10} cy="295" r="2" fill={c1} opacity="0.5" />
      ))}

      <path d="M0,30 L0,290" stroke={c1} strokeWidth="3" opacity="0.4" />
      <path d="M200,30 L200,290" stroke={c1} strokeWidth="3" opacity="0.4" />
      {Array.from({ length: 12 }).map((_, i) => (
        <g key={`border${i}`}>
          <path d={`M0,${50 + i * 20} L5,${55 + i * 20} L0,${60 + i * 20}`} fill="none" stroke={c1} strokeWidth="1.5" opacity="0.35" />
          <path d={`M200,${50 + i * 20} L195,${55 + i * 20} L200,${60 + i * 20}`} fill="none" stroke={c1} strokeWidth="1.5" opacity="0.35" />
        </g>
      ))}

      {[[35, 45], [165, 45], [35, 200], [165, 200]].map(([x, y], i) => (
        <g key={`cross${i}`} opacity="0.4">
          <path d={`M${(x as number) - 4},${y} L${(x as number) + 4},${y}`} stroke={c1} strokeWidth="2" />
          <path d={`M${x},${(y as number) - 4} L${x},${(y as number) + 4}`} stroke={c1} strokeWidth="2" />
        </g>
      ))}

      {[[60, 100], [140, 100], [65, 175], [135, 175]].map(([x, y], i) => (
        <circle key={`maskdot${i}`} cx={x} cy={y} r="2.5" fill={c1} opacity="0.4" />
      ))}
    </svg>
  );
}
