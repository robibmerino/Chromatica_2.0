import type { ComoEstiloProps } from '../types';
import { darken, lighten } from '../estiloColorUtils';

/* ═══════════════════════════════════════
   ESTILO: WIREFRAME
   Estructura, prototipo, técnico
   ═══════════════════════════════════════ */
export function WireframeStyle({ color = '#818cf8', className = '' }: ComoEstiloProps) {
  const c1 = color;
  const c2 = darken(color, 60);
  const c3 = lighten(color, 100);

  return (
    <svg viewBox="0 0 200 300" className={className} style={{ width: '100%', height: '100%' }}>
      {Array.from({ length: 21 }).map((_, i) => (
        <path key={`gv${i}`} d={`M${i * 10},0 L${i * 10},300`} stroke={c1} strokeWidth={i % 5 === 0 ? '0.5' : '0.2'} opacity={i % 5 === 0 ? 0.15 : 0.08} />
      ))}
      {Array.from({ length: 31 }).map((_, i) => (
        <path key={`gh${i}`} d={`M0,${i * 10} L200,${i * 10}`} stroke={c1} strokeWidth={i % 5 === 0 ? '0.5' : '0.2'} opacity={i % 5 === 0 ? 0.15 : 0.08} />
      ))}

      <rect x="10" y="10" width="180" height="35" rx="2" fill="none" stroke={c1} strokeWidth="1.5" opacity="0.5" strokeDasharray="4,2" />
      <rect x="15" y="15" width="25" height="25" rx="2" fill={c1} opacity="0.15" />
      <path d="M20,27 L27,22 L34,27 L27,32 Z" fill="none" stroke={c1} strokeWidth="1" opacity="0.4" />
      {[50, 85, 120, 155].map((x, i) => (
        <rect key={`nav${i}`} x={x} y="22" width="25" height="8" rx="1" fill={c1} opacity={0.12 + i * 0.02} />
      ))}

      <rect x="10" y="55" width="180" height="70" rx="2" fill="none" stroke={c1} strokeWidth="1.5" opacity="0.45" strokeDasharray="4,2" />
      <path d="M10,55 L190,125" stroke={c1} strokeWidth="0.8" opacity="0.25" />
      <path d="M190,55 L10,125" stroke={c1} strokeWidth="0.8" opacity="0.25" />
      <rect x="85" y="78" width="30" height="24" rx="2" fill="none" stroke={c1} strokeWidth="1.2" opacity="0.4" />
      <circle cx="93" cy="86" r="3" fill="none" stroke={c1} strokeWidth="1" opacity="0.35" />
      <path d="M87,98 L95,92 L100,96 L108,88 L113,98" fill="none" stroke={c1} strokeWidth="1" opacity="0.35" />

      <rect x="10" y="135" width="140" height="10" rx="1" fill={c1} opacity="0.25" />
      <rect x="10" y="150" width="100" height="6" rx="1" fill={c1} opacity="0.15" />
      {[165, 175, 185, 195].map((y, i) => (
        <rect key={`p1${i}`} x="10" y={y} width={i === 3 ? 80 : 180} height="5" rx="1" fill={c1} opacity="0.12" />
      ))}

      {[0, 1].map((col) => (
        <g key={`card${col}`}>
          <rect x={10 + col * 95} y="210" width="85" height="55" rx="2" fill="none" stroke={c1} strokeWidth="1.2" opacity="0.4" strokeDasharray="3,2" />
          <rect x={15 + col * 95} y="215" width="75" height="25" rx="1" fill={c1} opacity="0.1" />
          <path d={`M${15 + col * 95},215 L${90 + col * 95},240`} stroke={c1} strokeWidth="0.5" opacity="0.2" />
          <path d={`M${90 + col * 95},215 L${15 + col * 95},240`} stroke={c1} strokeWidth="0.5" opacity="0.2" />
          <rect x={15 + col * 95} y="245" width="60" height="5" rx="1" fill={c1} opacity="0.18" />
          <rect x={15 + col * 95} y="253" width="45" height="4" rx="1" fill={c1} opacity="0.12" />
        </g>
      ))}

      <rect x="65" y="275" width="70" height="18" rx="3" fill="none" stroke={c1} strokeWidth="1.5" opacity="0.5" />
      <rect x="80" y="281" width="40" height="6" rx="1" fill={c1} opacity="0.25" />

      <path d="M195,27 L210,27" stroke={c2} strokeWidth="0.8" opacity="0.4" />
      <circle cx="195" cy="27" r="2" fill="none" stroke={c2} strokeWidth="0.8" opacity="0.4" />
      <path d="M10,52 L190,52" stroke={c1} strokeWidth="0.5" opacity="0.3" />
      <path d="M10,50 L10,54" stroke={c1} strokeWidth="0.5" opacity="0.3" />
      <path d="M190,50 L190,54" stroke={c1} strokeWidth="0.5" opacity="0.3" />
      <path d="M195,55 L195,125" stroke={c1} strokeWidth="0.5" opacity="0.3" />
      <path d="M193,55 L197,55" stroke={c1} strokeWidth="0.5" opacity="0.3" />
      <path d="M193,125 L197,125" stroke={c1} strokeWidth="0.5" opacity="0.3" />

      <rect x="155" y="135" width="35" height="25" rx="1" fill={c1} opacity="0.12" />
      <rect x="155" y="135" width="35" height="25" rx="1" fill="none" stroke={c1} strokeWidth="0.8" opacity="0.35" />
      <rect x="158" y="140" width="22" height="3" fill={c1} opacity="0.2" />
      <rect x="158" y="145" width="28" height="3" fill={c1} opacity="0.15" />
      <rect x="158" y="150" width="18" height="3" fill={c1} opacity="0.15" />
      <path d="M155,147 L145,147 L145,143" fill="none" stroke={c1} strokeWidth="0.8" opacity="0.3" />
      <circle cx="145" cy="143" r="2" fill="none" stroke={c1} strokeWidth="0.8" opacity="0.3" />

      <path d="M130,285 L130,298 L134,294 L138,300 L140,299 L136,293 L141,293 Z" fill={c1} opacity="0.4" />

      {[[10, 10], [190, 10], [10, 45], [190, 45], [10, 55], [190, 55], [10, 125], [190, 125], [10, 210], [95, 210], [105, 210], [190, 210], [10, 265], [95, 265], [105, 265], [190, 265]].map(([x, y], i) => (
        <rect key={`ctrl${i}`} x={(x as number) - 2} y={(y as number) - 2} width="4" height="4" fill="none" stroke={c1} strokeWidth="0.8" opacity="0.35" />
      ))}

      <path d="M5,10 L5,265" stroke={c2} strokeWidth="0.5" strokeDasharray="2,2" opacity="0.2" />
      <path d="M195,10 L195,265" stroke={c2} strokeWidth="0.5" strokeDasharray="2,2" opacity="0.2" />
      <path d="M100,210 L100,265" stroke={c2} strokeWidth="0.5" strokeDasharray="2,2" opacity="0.25" />

      <circle cx="5" cy="27" r="6" fill="none" stroke={c1} strokeWidth="0.8" opacity="0.35" />
      <text x="5" y="30" fontSize="7" fill={c1} opacity="0.4" textAnchor="middle" fontFamily="monospace">1</text>
      <circle cx="5" cy="90" r="6" fill="none" stroke={c1} strokeWidth="0.8" opacity="0.35" />
      <text x="5" y="93" fontSize="7" fill={c1} opacity="0.4" textAnchor="middle" fontFamily="monospace">2</text>
      <circle cx="5" cy="175" r="6" fill="none" stroke={c1} strokeWidth="0.8" opacity="0.35" />
      <text x="5" y="178" fontSize="7" fill={c1} opacity="0.4" textAnchor="middle" fontFamily="monospace">3</text>
      <circle cx="5" cy="237" r="6" fill="none" stroke={c1} strokeWidth="0.8" opacity="0.35" />
      <text x="5" y="240" fontSize="7" fill={c1} opacity="0.4" textAnchor="middle" fontFamily="monospace">4</text>

      <path d="M100,130 L100,135" stroke={c2} strokeWidth="1" opacity="0.3" />
      <path d="M97,133 L100,137 L103,133" fill="none" stroke={c2} strokeWidth="1" opacity="0.3" />
      <path d="M100,205 L100,210" stroke={c2} strokeWidth="1" opacity="0.3" />
      <path d="M97,208 L100,212 L103,208" fill="none" stroke={c2} strokeWidth="1" opacity="0.3" />
      <path d="M100,268 L100,275" stroke={c2} strokeWidth="1" opacity="0.3" />
      <path d="M97,273 L100,277 L103,273" fill="none" stroke={c2} strokeWidth="1" opacity="0.3" />

      <rect x="170" y="275" width="20" height="18" rx="1" fill="none" stroke={c1} strokeWidth="0.8" opacity="0.3" />
      <path d="M175,278 L185,278" stroke={c1} strokeWidth="0.5" opacity="0.25" />
      <rect x="173" y="281" width="14" height="9" rx="0.5" fill="none" stroke={c1} strokeWidth="0.5" opacity="0.25" />
    </svg>
  );
}
