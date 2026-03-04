import { useId } from 'react';
import type { ComoEstiloProps } from '../types';
import { darken, lighten } from '../estiloColorUtils';

/* ═══════════════════════════════════════
   ESTILO: COLLAGE / DADÁ
   Recortes, superposición, caos, textura
   ═══════════════════════════════════════ */
export function CollageStyle({ color = '#818cf8', className = '' }: ComoEstiloProps) {
  const id = useId().replace(/:/g, '');

  const c1 = color;
  const c2 = darken(color, 60);
  const c3 = darken(color, 120);
  const c4 = lighten(color, 60);
  const c5 = lighten(color, 100);

  return (
    <svg viewBox="0 0 200 300" className={className} style={{ width: '100%', height: '100%' }}>
      <defs>
        <clipPath id={`${id}clip`}>
          <rect width="200" height="300" />
        </clipPath>
        {/* Patrón papel de periódico */}
        <pattern id={`${id}news`} width="30" height="4" patternUnits="userSpaceOnUse">
          <rect width="30" height="2" fill={c2} opacity="0.2" />
          <rect y="2" width="20" height="2" fill={c2} opacity="0.15" />
        </pattern>
        {/* Patrón rasgado */}
        <filter id={`${id}rough`}>
          <feTurbulence baseFrequency="0.04" numOctaves="3" seed="2" />
          <feDisplacementMap in="SourceGraphic" scale="2" />
        </filter>
      </defs>

      <g clipPath={`url(#${id}clip)`}>

        {/* ══ RECORTE 1 — foto grande, rotada ══ */}
        <g transform="rotate(-5 80 60)">
          {/* Borde de foto rasgada */}
          <rect x="15" y="15" width="110" height="80" fill={c3} opacity="0.2" />
          <rect x="15" y="15" width="110" height="80" fill={`url(#${id}news)`} />
          <rect x="15" y="15" width="110" height="80" fill="none"
            stroke={c2} strokeWidth="1" opacity="0.35" />

          {/* Contenido — silueta de montaña */}
          <path d="M20,85 L45,45 L65,65 L90,30 L120,85 Z"
            fill={c1} opacity="0.35" />
          <circle cx="45" cy="35" r="8" fill={c4} opacity="0.4" />

          {/* Sombra de recorte */}
          <rect x="18" y="18" width="110" height="80" fill="none"
            stroke={c3} strokeWidth="3" opacity="0.08" />
        </g>

        {/* ══ RECORTE 2 — tira de texto, superpuesta ══ */}
        <g transform="rotate(8 160 50)">
          <rect x="100" y="40" width="95" height="22" fill={c5} opacity="0.5" />
          <rect x="100" y="40" width="95" height="22" fill="none"
            stroke={c2} strokeWidth="0.8" opacity="0.3" />

          {/* Líneas de texto */}
          <rect x="105" y="45" width="55" height="4" fill={c2} opacity="0.45" />
          <rect x="105" y="52" width="80" height="4" fill={c2} opacity="0.35" />

          {/* Borde rasgado derecho */}
          <path d="M195,40 L193,44 L196,48 L192,52 L195,56 L193,60 L195,62"
            fill={c5} fillOpacity="0.5" stroke={c2} strokeWidth="0.5" strokeOpacity="0.2" />
        </g>

        {/* ══ RECORTE 3 — círculo recortado ══ */}
        <g transform="rotate(-3 45 170)">
          <circle cx="45" cy="170" r="40" fill={c2} opacity="0.3" />
          <circle cx="45" cy="170" r="40" fill="none"
            stroke={c1} strokeWidth="1.5" opacity="0.45" />

          {/* Ojo recortado dentro */}
          <ellipse cx="45" cy="165" rx="22" ry="12" fill={c3} opacity="0.4" />
          <circle cx="45" cy="165" r="8" fill={c1} opacity="0.5" />
          <circle cx="45" cy="165" r="4" fill={c5} opacity="0.5" />

          {/* Borde desigual */}
          <circle cx="45" cy="170" r="38" fill="none"
            stroke={c1} strokeWidth="0.5" opacity="0.2"
            strokeDasharray="5,3,2,3" />
        </g>

        {/* ══ RECORTE 4 — trozo de papel grande ══ */}
        <g transform="rotate(4 140 150)">
          <path d="M95,110 L185,105 L188,118 L183,122 L186,135 
                   L182,140 L185,180 L92,185 L95,170 L90,160 
                   L93,145 L90,130 Z"
            fill={c4} opacity="0.3" />
          <path d="M95,110 L185,105 L188,118 L183,122 L186,135 
                   L182,140 L185,180 L92,185 L95,170 L90,160 
                   L93,145 L90,130 Z"
            fill="none" stroke={c2} strokeWidth="1" opacity="0.35" />

          {/* Contenido — diagrama */}
          <circle cx="140" cy="140" r="25" fill="none"
            stroke={c1} strokeWidth="2" opacity="0.45" />
          <path d="M140,115 L140,165 M115,140 L165,140"
            stroke={c1} strokeWidth="1" opacity="0.3" />
          <circle cx="140" cy="140" r="8" fill={c1} opacity="0.25" />
        </g>

        {/* ══ RECORTE 5 — tira diagonal ══ */}
        <g transform="rotate(-15 100 200)">
          <rect x="20" y="195" width="170" height="18" fill={c1} opacity="0.4" />
          <rect x="20" y="195" width="170" height="18" fill="none"
            stroke={c3} strokeWidth="1" opacity="0.3" />

          {/* Texto grande */}
          <rect x="30" y="200" width="60" height="8" fill={c5} opacity="0.5" />
          <rect x="100" y="200" width="40" height="8" fill={c5} opacity="0.4" />
          <rect x="150" y="200" width="30" height="8" fill={c5} opacity="0.35" />
        </g>

        {/* ══ RECORTE 6 — triángulo recortado ══ */}
        <g transform="rotate(12 160 220)">
          <path d="M130,195 L190,260 L100,260 Z" fill={c2} opacity="0.35" />
          <path d="M130,195 L190,260 L100,260 Z" fill="none"
            stroke={c1} strokeWidth="1.5" opacity="0.45" />

          {/* Textura interior */}
          {Array.from({ length: 6 }).map((_, i) => (
            <path key={`th${i}`}
              d={`M${110 + i * 12},260 L${130},${200 + i * 8}`}
              stroke={c1} strokeWidth="0.5" opacity="0.2" />
          ))}
        </g>

        {/* ══ RECORTE 7 — foto pequeña con cinta ══ */}
        <g transform="rotate(-8 160 35)">
          <rect x="140" y="10" width="45" height="45" fill={c3} opacity="0.25" />
          <rect x="140" y="10" width="45" height="45" fill="none"
            stroke={c1} strokeWidth="1" opacity="0.35" />

          {/* Contenido — retrato abstracto */}
          <circle cx="162" cy="28" r="10" fill={c1} opacity="0.35" />
          <rect x="155" y="38" width="14" height="12" rx="2"
            fill={c1} opacity="0.25" />

          {/* Cinta adhesiva */}
          <rect x="150" y="5" width="25" height="10" rx="1"
            fill={c4} opacity="0.3" />
          <rect x="150" y="5" width="25" height="10" rx="1"
            fill="none" stroke={c2} strokeWidth="0.5" opacity="0.25" />
        </g>

        {/* ══ RECORTE 8 — mancha de tinta ══ */}
        <path d="M75,240 Q85,230 95,238 Q105,245 100,258 
                 Q95,270 82,268 Q70,265 68,255 Q65,245 75,240 Z"
          fill={c3} opacity="0.45" />
        <path d="M82,248 Q88,244 92,250 Q95,256 90,260 
                 Q85,262 80,258 Q78,253 82,248 Z"
          fill={c1} opacity="0.35" />

        {/* Salpicaduras */}
        <circle cx="68" cy="242" r="2.5" fill={c3} opacity="0.35" />
        <circle cx="102" cy="262" r="2" fill={c3} opacity="0.3" />
        <circle cx="72" cy="268" r="1.5" fill={c3} opacity="0.28" />
        <circle cx="98" cy="240" r="1.8" fill={c3} opacity="0.25" />

        {/* ══ RECORTE 9 — ticket / billete ══ */}
        <g transform="rotate(3 50 270)">
          <rect x="20" y="255" width="60" height="30" rx="2"
            fill={c5} opacity="0.4" />
          <rect x="20" y="255" width="60" height="30" rx="2"
            fill="none" stroke={c2} strokeWidth="0.8" opacity="0.35" />

          {/* Perforado */}
          <path d="M50,255 L50,285" stroke={c2} strokeWidth="0.5"
            strokeDasharray="2,2" opacity="0.3" />

          {/* Texto del ticket */}
          <rect x="24" y="260" width="22" height="3" fill={c2} opacity="0.3" />
          <rect x="24" y="266" width="18" height="2.5" fill={c2} opacity="0.25" />
          <rect x="24" y="272" width="20" height="2.5" fill={c2} opacity="0.2" />

          {/* Número */}
          <text x="65" y="275" fontSize="8" fill={c2} opacity="0.35"
            fontFamily="monospace" textAnchor="middle">No.47</text>
        </g>

        {/* ══ TROZOS DE WASHI TAPE ══ */}
        {/* Tape 1 */}
        <rect x="5" y="100" width="30" height="8" fill={c1} opacity="0.25"
          transform="rotate(-20 20 104)" />

        {/* Tape 2 */}
        <rect x="130" y="90" width="35" height="8" fill={c4} opacity="0.22"
          transform="rotate(15 147 94)" />

        {/* Tape 3 */}
        <rect x="60" y="220" width="28" height="8" fill={c1} opacity="0.2"
          transform="rotate(-10 74 224)" />

        {/* ══ GARABATO / ANOTACIÓN A MANO ══ */}
        <path d="M120,270 Q130,265 140,270 Q150,278 145,285"
          fill="none" stroke={c2} strokeWidth="1.5" opacity="0.35"
          strokeLinecap="round" />

        {/* Flecha dibujada */}
        <path d="M150,280 L165,270" stroke={c2} strokeWidth="1.2" opacity="0.35"
          strokeLinecap="round" />
        <path d="M160,268 L165,270 L162,275" fill="none"
          stroke={c2} strokeWidth="1.2" opacity="0.35" strokeLinecap="round" />

        {/* Tachón */}
        <path d="M30,135 L60,130 M30,130 L60,135" stroke={c2}
          strokeWidth="1.5" opacity="0.3" strokeLinecap="round" />

        {/* Subrayado */}
        <path d="M105,52 Q120,55 160,50" fill="none"
          stroke={c1} strokeWidth="1.5" opacity="0.35" strokeLinecap="round" />

        {/* ══ GRAPA / CLIP ══ */}
        <g transform="translate(85, 105) rotate(-10)">
          <path d="M0,0 L0,15 Q0,20 5,20 Q10,20 10,15 L10,-5 Q10,-10 5,-10 Q0,-10 0,-5"
            fill="none" stroke={c2} strokeWidth="1.5" opacity="0.4" />
        </g>

        {/* ══ TEXTURA DE FONDO — papel viejo ══ */}
        {Array.from({ length: 15 }).map((_, i) => {
          const x = ((i * 47) % 180) + 10;
          const y = ((i * 73) % 270) + 15;
          return (
            <circle key={`grain${i}`}
              cx={x} cy={y} r={0.5 + (i % 3) * 0.3}
              fill={c2} opacity={0.06 + (i % 4) * 0.02} />
          );
        })}

        {/* ══ SELLO / STAMP ══ */}
        <g transform="rotate(18 170 290)">
          <circle cx="170" cy="290" r="18" fill="none"
            stroke={c1} strokeWidth="2" opacity="0.35" />
          <circle cx="170" cy="290" r="14" fill="none"
            stroke={c1} strokeWidth="0.8" opacity="0.25" />
          <rect x="160" y="287" width="20" height="5" fill={c1} opacity="0.3" />
        </g>

      </g>
    </svg>
  );
}
