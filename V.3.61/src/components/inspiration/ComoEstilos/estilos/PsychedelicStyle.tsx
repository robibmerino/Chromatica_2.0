import { useId } from 'react';
import type { ComoEstiloProps } from '../types';
import { darken, lighten } from '../estiloColorUtils';

/* ═══════════════════════════════════════
   ESTILO: PSICODÉLICO
   Vibrante, ondas, distorsión, 60s/70s
   ═══════════════════════════════════════ */
export function PsychedelicStyle({ color = '#818cf8', className = '' }: ComoEstiloProps) {
  const id = useId().replace(/:/g, '');

  const c1 = color;
  const c2 = darken(color, 50);
  const c3 = darken(color, 100);
  const c4 = lighten(color, 50);
  const c5 = lighten(color, 90);

  return (
    <svg viewBox="0 0 200 300" className={className} style={{ width: '100%', height: '100%' }}>
      <defs>
        <clipPath id={`${id}clip`}>
          <rect width="200" height="300" />
        </clipPath>
      </defs>

      <g clipPath={`url(#${id}clip)`}>
        {Array.from({ length: 25 }).map((_, i) => {
          const y = i * 12;
          const amp1 = 15 + Math.sin(i * 0.5) * 10;
          const amp2 = 12 + Math.cos(i * 0.4) * 8;
          return (
            <path
              key={`wave${i}`}
              d={`M-20,${y} Q${25},${y - amp1} ${50},${y} Q${75},${y + amp2} ${100},${y} Q${125},${y - amp1} ${150},${y} Q${175},${y + amp2} ${220},${y}`}
              fill="none"
              stroke={i % 3 === 0 ? c1 : i % 3 === 1 ? c2 : c4}
              strokeWidth={2.5 + Math.sin(i * 0.3) * 1}
              opacity={0.25 + (i % 5) * 0.05}
            />
          );
        })}

        {Array.from({ length: 6 }).map((_, i) => (
          <ellipse key={`aura${i}`} cx="100" cy="130" rx={70 - i * 8} ry={45 - i * 5} fill="none" stroke={i % 2 === 0 ? c1 : c4} strokeWidth={3 - i * 0.3} opacity={0.4 - i * 0.04} />
        ))}

        <path d="M30,130 Q65,80 100,80 Q135,80 170,130 Q135,180 100,180 Q65,180 30,130 Z" fill={c3} opacity="0.35" />
        <path d="M30,130 Q65,80 100,80 Q135,80 170,130 Q135,180 100,180 Q65,180 30,130 Z" fill="none" stroke={c1} strokeWidth="3" opacity="0.6" />

        <circle cx="100" cy="130" r="35" fill={c2} opacity="0.5" />
        <circle cx="100" cy="130" r="35" fill="none" stroke={c1} strokeWidth="2.5" opacity="0.55" />
        {[28, 22, 16].map((r, i) => (
          <circle key={`iris${i}`} cx="100" cy="130" r={r} fill="none" stroke={i % 2 === 0 ? c4 : c1} strokeWidth="1.5" opacity={0.4 - i * 0.08} />
        ))}

        <circle cx="100" cy="130" r="12" fill={c3} opacity="0.75" />
        <circle cx="100" cy="130" r="8" fill={c3} opacity="0.9" />
        <circle cx="95" cy="123" r="4" fill={c5} opacity="0.6" />
        <circle cx="105" cy="135" r="2" fill={c5} opacity="0.4" />

        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i / 16) * Math.PI * 2;
          const startR = 50;
          const endR = 95;
          const wobble1 = Math.sin(i * 2) * 8;
          const wobble2 = Math.cos(i * 3) * 6;
          const x1 = 100 + startR * Math.cos(angle);
          const y1 = 130 + startR * Math.sin(angle) * 0.65;
          const x2 = 100 + endR * Math.cos(angle);
          const y2 = 130 + endR * Math.sin(angle) * 0.65;
          const cx1 = 100 + (startR + 20) * Math.cos(angle) + wobble1;
          const cy1 = 130 + (startR + 20) * Math.sin(angle) * 0.65 + wobble2;
          return (
            <path key={`ray${i}`} d={`M${x1},${y1} Q${cx1},${cy1} ${x2},${y2}`} fill="none" stroke={i % 3 === 0 ? c1 : i % 3 === 1 ? c4 : c2} strokeWidth={2 + (i % 3) * 0.5} strokeLinecap="round" opacity={0.4 + (i % 4) * 0.08} />
          );
        })}

        <path d="M25,280 Q25,255 35,250 Q50,245 60,255 Q65,265 55,275 Q45,280 35,280 Z" fill={c1} opacity="0.5" />
        <path d="M25,280 Q25,255 35,250 Q50,245 60,255 Q65,265 55,275 Q45,280 35,280 Z" fill="none" stroke={c2} strokeWidth="2" opacity="0.55" />
        <path d="M40,280 Q42,290 40,300" stroke={c2} strokeWidth="6" strokeLinecap="round" opacity="0.45" />
        <circle cx="35" cy="260" r="3" fill={c5} opacity="0.5" />
        <circle cx="45" cy="255" r="2.5" fill={c5} opacity="0.45" />
        <circle cx="50" cy="263" r="2" fill={c5} opacity="0.4" />
        <circle cx="38" cy="270" r="2" fill={c5} opacity="0.4" />

        <path d="M160,290 Q162,275 170,272 Q180,270 185,278 Q187,285 180,290 Z" fill={c4} opacity="0.45" />
        <path d="M160,290 Q162,275 170,272 Q180,270 185,278 Q187,285 180,290 Z" fill="none" stroke={c2} strokeWidth="1.5" opacity="0.5" />
        <path d="M172,290 Q173,296 172,305" stroke={c2} strokeWidth="4" strokeLinecap="round" opacity="0.4" />
        <circle cx="170" cy="278" r="2" fill={c5} opacity="0.45" />
        <circle cx="177" cy="280" r="1.5" fill={c5} opacity="0.4" />

        <g transform="translate(35, 45)">
          {Array.from({ length: 4 }).map((_, i) => {
            const r = 8 + i * 6;
            const startAngle = i * 90;
            return (
              <path
                key={`spiral1-${i}`}
                d={`M${r * Math.cos(startAngle * Math.PI / 180)},${r * Math.sin(startAngle * Math.PI / 180)} A${r},${r} 0 0,1 ${r * Math.cos((startAngle + 270) * Math.PI / 180)},${r * Math.sin((startAngle + 270) * Math.PI / 180)}`}
                fill="none"
                stroke={i % 2 === 0 ? c1 : c4}
                strokeWidth="2"
                opacity={0.45 - i * 0.06}
              />
            );
          })}
        </g>

        <g transform="translate(170, 40)">
          {Array.from({ length: 4 }).map((_, i) => {
            const r = 6 + i * 5;
            const startAngle = i * 90 + 45;
            return (
              <path
                key={`spiral2-${i}`}
                d={`M${r * Math.cos(startAngle * Math.PI / 180)},${r * Math.sin(startAngle * Math.PI / 180)} A${r},${r} 0 0,0 ${r * Math.cos((startAngle + 270) * Math.PI / 180)},${r * Math.sin((startAngle + 270) * Math.PI / 180)}`}
                fill="none"
                stroke={i % 2 === 0 ? c2 : c1}
                strokeWidth="1.8"
                opacity={0.4 - i * 0.05}
              />
            );
          })}
        </g>

        <g transform="translate(25, 200)">
          {Array.from({ length: 6 }).map((_, i) => {
            const angle = (i / 6) * Math.PI * 2;
            const px = 12 * Math.cos(angle);
            const py = 12 * Math.sin(angle);
            return <ellipse key={`petal1-${i}`} cx={px} cy={py} rx="8" ry="5" fill={c4} opacity="0.45" transform={`rotate(${i * 60} ${px} ${py})`} />;
          })}
          <circle cx="0" cy="0" r="6" fill={c1} opacity="0.55" />
          <circle cx="0" cy="0" r="3" fill={c5} opacity="0.5" />
        </g>

        <g transform="translate(175, 215)">
          {Array.from({ length: 5 }).map((_, i) => {
            const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
            const px = 10 * Math.cos(angle);
            const py = 10 * Math.sin(angle);
            return <ellipse key={`petal2-${i}`} cx={px} cy={py} rx="7" ry="4" fill={c1} opacity="0.4" transform={`rotate(${i * 72} ${px} ${py})`} />;
          })}
          <circle cx="0" cy="0" r="5" fill={c2} opacity="0.5" />
          <circle cx="0" cy="0" r="2.5" fill={c5} opacity="0.45" />
        </g>

        {[[55, 25, 8], [150, 70, 6], [20, 120, 5], [180, 180, 7], [85, 230, 5], [145, 250, 6]].map(([x, y, size], i) => (
          <g key={`star${i}`} transform={`translate(${x}, ${y})`}>
            {Array.from({ length: 4 }).map((_, j) => {
              const angle = (j / 4) * Math.PI * 2 + (i % 2 === 0 ? 0 : Math.PI / 4);
              const len = size as number;
              return <path key={`sp${j}`} d={`M0,0 L${len * Math.cos(angle)},${len * Math.sin(angle)}`} stroke={i % 2 === 0 ? c1 : c4} strokeWidth="2" strokeLinecap="round" opacity={0.45 + (i % 3) * 0.1} />;
            })}
            <circle cx="0" cy="0" r="2" fill={c5} opacity="0.5" />
          </g>
        ))}

        {[[70, 55, 6], [130, 40, 4], [90, 200, 5], [45, 160, 4], [160, 145, 5], [115, 220, 4], [30, 240, 3], [175, 260, 4], [95, 260, 3]].map(([x, y, r], i) => (
          <g key={`bubble${i}`}>
            <circle cx={x} cy={y} r={r as number} fill={i % 3 === 0 ? c1 : i % 3 === 1 ? c4 : c2} opacity={0.35 + (i % 4) * 0.08} />
            <circle cx={(x as number) - (r as number) * 0.3} cy={(y as number) - (r as number) * 0.3} r={(r as number) * 0.3} fill={c5} opacity="0.4" />
          </g>
        ))}

        <g transform="translate(100, 10)">
          {Array.from({ length: 4 }).map((_, i) => (
            <path key={`sound${i}`} d={`M${-15 - i * 8},0 Q${-10 - i * 6},${-8 - i * 3} ${-15 - i * 8},${-16 - i * 6}`} fill="none" stroke={c1} strokeWidth={1.5 - i * 0.2} strokeLinecap="round" opacity={0.4 - i * 0.07} transform={`scale(-1, 1) translate(${-30 - i * 16}, 0)`} />
          ))}
          {Array.from({ length: 4 }).map((_, i) => (
            <path key={`sound2${i}`} d={`M${15 + i * 8},0 Q${10 + i * 6},${-8 - i * 3} ${15 + i * 8},${-16 - i * 6}`} fill="none" stroke={c1} strokeWidth={1.5 - i * 0.2} strokeLinecap="round" opacity={0.4 - i * 0.07} />
          ))}
        </g>

        <path d="M0,5 Q10,0 20,5 Q30,10 40,5 Q50,0 60,5 Q70,10 80,5 Q90,0 100,5 Q110,10 120,5 Q130,0 140,5 Q150,10 160,5 Q170,0 180,5 Q190,10 200,5" fill="none" stroke={c1} strokeWidth="2.5" opacity="0.4" />
        <path d="M0,295 Q10,300 20,295 Q30,290 40,295 Q50,300 60,295 Q70,290 80,295 Q90,300 100,295 Q110,290 120,295 Q130,300 140,295 Q150,290 160,295 Q170,300 180,295 Q190,290 200,295" fill="none" stroke={c1} strokeWidth="2.5" opacity="0.4" />
      </g>
    </svg>
  );
}
