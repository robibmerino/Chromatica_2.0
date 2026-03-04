import { useId } from 'react';
import type { ComoEstiloProps } from '../types';
import { rotateHue } from '../../../../utils/colorUtils';
import { darken, lighten } from '../estiloColorUtils';

/* ═══════════════════════════════════════
   ESTILO: CONSTRUCTIVISTA
   Soviético, diagonal, tipografía
   ═══════════════════════════════════════ */
export function ConstructivistStyle({ color = '#818cf8', className = '' }: ComoEstiloProps) {
  const id = useId().replace(/:/g, '');

  const c1 = color;
  const c2 = darken(color, 90);
  const c3 = darken(color, 150);
  const c4 = lighten(color, 80);
  const c5 = lighten(color, 120);
  // Variación cromática: tonos complementarios para más riqueza visual
  const cWarm = rotateHue(color, 45);   // Amarillo/naranja
  const cCool = rotateHue(color, -60);  // Cyan/azul

  return (
    <svg viewBox="0 0 200 300" className={className} style={{ width: '100%', height: '100%' }}>
      <defs>
        <clipPath id={`${id}clip`}>
          <rect width="200" height="300" />
        </clipPath>
      </defs>

      <g clipPath={`url(#${id}clip)`}>
        <path d="M0,0 L200,0 L200,300 L0,300 Z" fill={c3} opacity="0.15" />
        <path d="M0,0 L200,100 L200,300 L0,200 Z" fill={c2} opacity="0.2" />

        <path d="M-20,180 L220,60 L220,100 L-20,220 Z" fill={c1} opacity="0.75" />
        <path d="M-20,180 L220,60 L220,100 L-20,220 Z" fill="none" stroke={c2} strokeWidth="3" opacity="0.6" />
        <path d="M-20,220 L220,100 L220,120 L-20,240 Z" fill={c2} opacity="0.55" />

        <circle cx="60" cy="80" r="45" fill="none" stroke={c1} strokeWidth="6" opacity="0.7" />
        <circle cx="60" cy="80" r="45" fill="none" stroke={cCool} strokeWidth="1" opacity="0.25" />
        <circle cx="60" cy="80" r="45" fill="none" stroke={c2} strokeWidth="2" opacity="0.4" />
        <path d="M60,80 L105,80 L60,35 Z" fill={c1} opacity="0.65" />
        <path d="M60,80 L105,80 L60,35 Z" fill="none" stroke={c3} strokeWidth="2" opacity="0.5" />
        <circle cx="60" cy="80" r="8" fill={c2} opacity="0.7" />
        <circle cx="60" cy="80" r="3" fill={c4} opacity="0.6" />

        {[[0, 50, 60, 30], [0, 70, 45, 55], [0, 90, 30, 80]].map(([x1, y1, x2, y2], i) => (
          <path key={`ray${i}`} d={`M${x1},${y1} L${x2},${y2}`} stroke={i === 1 ? cWarm : c1} strokeWidth={4 - i * 0.8} opacity={0.5 - i * 0.08} strokeLinecap="round" />
        ))}

        <rect x="140" y="0" width="20" height="180" fill={c2} opacity="0.65" />
        <rect x="140" y="0" width="20" height="180" fill="none" stroke={c3} strokeWidth="2" opacity="0.4" />
        <rect x="140" y="0" width="20" height="60" fill={cWarm} opacity="0.5" />
        <rect x="140" y="120" width="20" height="60" fill={cCool} opacity="0.4" />

        <g transform="translate(165, 30) rotate(90)">
          <rect x="0" y="0" width="5" height="25" fill={c4} opacity="0.75" />
          <path d="M5,0 A8,8 0 0,1 5,12" fill="none" stroke={c4} strokeWidth="5" opacity="0.75" />
          <path d="M5,12 L18,25" stroke={c4} strokeWidth="5" strokeLinecap="round" opacity="0.75" />
        </g>

        {Array.from({ length: 8 }).map((_, i) => (
          <rect key={`step${i}`} x={10 + i * 12} y={250 - i * 10} width={10} height={6} fill={i % 3 === 0 ? c1 : i % 3 === 1 ? c2 : cWarm} opacity={0.5 + i * 0.04} />
        ))}
        <path d="M10,256 L106,186" stroke={c3} strokeWidth="1.5" opacity="0.4" />

        <path d="M170,220 L200,240 L170,260 Z" fill={c1} opacity="0.6" />
        <path d="M170,220 L200,240 L170,260 Z" fill="none" stroke={c2} strokeWidth="2.5" opacity="0.5" />
        <path d="M120,240 L170,240" stroke={c1} strokeWidth="4" opacity="0.55" />
        <path d="M130,235 L170,235" stroke={c2} strokeWidth="2" opacity="0.35" />
        <path d="M130,245 L170,245" stroke={c2} strokeWidth="2" opacity="0.35" />

        {Array.from({ length: 5 }).map((_, i) => (
          <rect key={`txt${i}`} x="15" y={135 + i * 8} width={50 - i * 6} height="5" fill={i % 2 === 0 ? c4 : cWarm} opacity={0.6 - i * 0.08} />
        ))}

        <rect x="0" y="275" width="200" height="25" fill={c2} opacity="0.6" />
        <rect x="0" y="278" width="130" height="19" fill={c1} opacity="0.5" />
        <rect x="50" y="278" width="40" height="19" fill={cCool} opacity="0.25" />
        {Array.from({ length: 8 }).map((_, i) => (
          <rect key={`btxt${i}`} x={10 + i * 15} y="284" width="10" height="7" fill={c5} opacity="0.65" />
        ))}

        <circle cx="175" cy="287" r="8" fill="none" stroke={c4} strokeWidth="2.5" opacity="0.6" />
        <circle cx="175" cy="287" r="2.5" fill={c4} opacity="0.7" />

        <path d="M0,0 L100,150" stroke={c1} strokeWidth="1.5" opacity="0.2" />
        <path d="M200,0 L100,150" stroke={c1} strokeWidth="1.5" opacity="0.2" />
        <path d="M100,150 L100,300" stroke={c2} strokeWidth="1" opacity="0.15" />

        <rect x="80" y="200" width="50" height="20" fill={c1} opacity="0.45" transform="rotate(-25 105 210)" />
        <rect x="80" y="200" width="50" height="20" fill="none" stroke={c3} strokeWidth="2" opacity="0.4" transform="rotate(-25 105 210)" />

        <g transform="translate(50, 200)">
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            const x2 = 12 * Math.cos(angle);
            const y2 = 12 * Math.sin(angle);
            return <path key={`star${i}`} d={`M0,0 L${x2},${y2}`} stroke={i % 2 === 0 ? c1 : cWarm} strokeWidth="2.5" opacity="0.55" strokeLinecap="round" />;
          })}
          <circle cx="0" cy="0" r="5" fill={c2} opacity="0.7" />
          <circle cx="0" cy="0" r="2" fill={cWarm} opacity="0.6" />
        </g>

        <g transform="translate(160, 150)">
          <circle cx="0" cy="0" r="15" fill={c2} opacity="0.5" />
          <circle cx="0" cy="0" r="15" fill="none" stroke={c1} strokeWidth="2" opacity="0.6" />
          <circle cx="0" cy="0" r="15" fill="none" stroke={cCool} strokeWidth="1" opacity="0.3" />
          {Array.from({ length: 8 }).map((_, i) => {
            const angle = (i / 8) * Math.PI * 2;
            const x1 = 13 * Math.cos(angle);
            const y1 = 13 * Math.sin(angle);
            const x2 = 20 * Math.cos(angle);
            const y2 = 20 * Math.sin(angle);
            return <path key={`gear${i}`} d={`M${x1},${y1} L${x2},${y2}`} stroke={c1} strokeWidth="4" opacity="0.5" strokeLinecap="round" />;
          })}
          <circle cx="0" cy="0" r="6" fill={c3} opacity="0.6" />
          <circle cx="0" cy="0" r="2.5" fill={c4} opacity="0.5" />
        </g>

        <rect x="15" y="15" width="5" height="22" fill={c4} opacity="0.65" />
        <path d="M15,17 L10,22" stroke={c4} strokeWidth="4" strokeLinecap="round" opacity="0.65" />
        <g transform="translate(30, 15)">
          <circle cx="6" cy="6" r="6" fill="none" stroke={cCool} strokeWidth="4" opacity="0.6" />
          <rect x="8" y="6" width="4" height="16" fill={c4} opacity="0.6" />
        </g>
        <g transform="translate(50, 15)">
          <path d="M0,5 A8,8 0 0,1 16,5 L0,22 L16,22" fill="none" stroke={c4} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.55" />
        </g>

        <path d="M0,0 L30,0 L0,30 Z" fill={c1} opacity="0.4" />
        <path d="M200,300 L170,300 L200,270 Z" fill={c1} opacity="0.4" />

        {[[100, 90], [130, 140], [85, 170], [25, 245], [185, 195]].map(([x, y], i) => (
          <circle key={`emp${i}`} cx={x} cy={y} r="3" fill={i % 3 === 0 ? c1 : i % 3 === 1 ? cWarm : cCool} opacity={0.45 + (i % 3) * 0.1} />
        ))}
      </g>
    </svg>
  );
}
