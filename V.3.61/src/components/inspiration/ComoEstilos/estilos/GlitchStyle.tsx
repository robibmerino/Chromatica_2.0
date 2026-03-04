import { useId } from 'react';
import type { ComoEstiloProps } from '../types';
import { rotateHue } from '../../../../utils/colorUtils';
import { darken } from '../estiloColorUtils';

/* ═══════════════════════════════════════
   ESTILO: GLITCH
   Error, distorsión, fragmentación digital
   ═══════════════════════════════════════ */
export function GlitchStyle({ color = '#818cf8', className = '' }: ComoEstiloProps) {
  const id = useId().replace(/:/g, '');

  // Canal principal + canales con variación cromática (RGB shift / aberración cromática)
  const c1 = color;
  const c2 = darken(color, 80);
  const cR = rotateHue(color, 50); // Canal magenta/rojo desplazado
  const cB = rotateHue(color, -90); // Canal cyan/azul desplazado

  return (
    <svg viewBox="0 0 200 300" className={className} style={{ width: '100%', height: '100%' }}>
      <defs>
        <clipPath id={`${id}clip`}>
          <rect width="200" height="300" />
        </clipPath>
        <pattern id={`${id}scan`} width="200" height="4" patternUnits="userSpaceOnUse">
          <rect width="200" height="2" fill={c1} opacity="0.04" />
          <rect y="2" width="200" height="2" fill="black" opacity="0.03" />
        </pattern>
      </defs>

      <g clipPath={`url(#${id}clip)`}>
        {/* ══ SCANLINES — textura CRT ══ */}
        <rect width="200" height="300" fill={`url(#${id}scan)`} />

        {/* ══ BLOQUES DE DATOS CORRUPTOS ══ */}

        {/* Banda glitcheada 1 — desplazamiento horizontal */}
        <rect x="0" y="42" width="200" height="18" fill={c2} opacity="0.3" />
        <rect x="35" y="42" width="120" height="18" fill={c1} opacity="0.2" />
        <rect x="140" y="42" width="60" height="18" fill={cR} opacity="0.15" />
        <rect x="8" y="42" width="55" height="18" fill={c1} opacity="0.35" />
        <rect x="155" y="45" width="40" height="12" fill={cB} opacity="0.25" />

        {/* Banda glitcheada 2 */}
        <rect x="0" y="108" width="200" height="8" fill={c1} opacity="0.25" />
        <rect x="60" y="106" width="85" height="12" fill={cR} opacity="0.18" />

        {/* Banda glitcheada 3 — gruesa */}
        <rect x="0" y="155" width="200" height="25" fill={c2} opacity="0.22" />
        <rect x="0" y="158" width="90" height="19" fill={c1} opacity="0.3" />
        <rect x="110" y="155" width="90" height="25" fill={cB} opacity="0.2" />

        {/* Banda glitcheada 4 */}
        <rect x="0" y="220" width="200" height="10" fill={c1} opacity="0.2" />
        <rect x="25" y="218" width="65" height="14" fill={cR} opacity="0.15" />
        <rect x="130" y="220" width="70" height="10" fill={c2} opacity="0.25" />

        {/* ══ FORMA PRINCIPAL — círculo fragmentado ══ */}

        <circle cx="95" cy="148" r="42" fill="none" stroke={cR} strokeWidth="2.5" opacity="0.3" />
        <circle cx="108" cy="150" r="42" fill="none" stroke={cB} strokeWidth="2.5" opacity="0.3" />
        <circle cx="100" cy="150" r="42" fill="none" stroke={c1} strokeWidth="3" opacity="0.55" />

        <path d="M100,108 A42,42 0 0,1 138,130" fill="none" stroke={c1} strokeWidth="3.5" opacity="0.6" />
        <path d="M142,150 A42,42 0 0,1 125,186" fill="none" stroke={c1} strokeWidth="3.5" opacity="0.55" transform="translate(4, -2)" />
        <path d="M115,190 A42,42 0 0,1 62,165" fill="none" stroke={c1} strokeWidth="3.5" opacity="0.5" transform="translate(-3, 3)" />
        <path d="M60,155 A42,42 0 0,1 80,115" fill="none" stroke={c1} strokeWidth="3.5" opacity="0.55" transform="translate(2, -4)" />

        {/* ══ RECTÁNGULO — triplicado con offset ══ */}

        <rect x="42" y="68" width="50" height="35" fill="none" stroke={cR} strokeWidth="2" opacity="0.25" />
        <rect x="52" y="72" width="50" height="35" fill="none" stroke={cB} strokeWidth="2" opacity="0.25" />
        <rect x="47" y="70" width="50" height="35" fill={c1} opacity="0.2" />
        <rect x="47" y="70" width="50" height="35" fill="none" stroke={c1} strokeWidth="2.5" opacity="0.55" />
        <rect x="40" y="82" width="70" height="6" fill={c2} opacity="0.5" />
        <rect x="48" y="83" width="55" height="4" fill={cR} opacity="0.2" />

        {/* ══ TRIÁNGULO — descompuesto ══ */}

        <path d="M138,210 L168,260 L108,260 Z" fill="none" stroke={cR} strokeWidth="1.8" opacity="0.2" />
        <path d="M145,212 L175,262 L115,262 Z" fill="none" stroke={cB} strokeWidth="1.8" opacity="0.2" />
        <path d="M142,208 L172,258 L112,258 Z" fill={c1} opacity="0.25" />
        <path d="M142,208 L172,258 L112,258 Z" fill="none" stroke={c1} strokeWidth="2.5" opacity="0.5" />
        <rect x="105" y="238" width="75" height="5" fill={c2} opacity="0.45" />
        <rect x="110" y="239" width="40" height="3" fill={cR} opacity="0.2" />

        {/* ══ TEXTO CORRUPTO — bloques de datos ══ */}
        {[
          [15, 200, 45, 4],
          [15, 207, 35, 3],
          [15, 213, 50, 3],
          [15, 219, 28, 3],
          [15, 225, 42, 4],
          [15, 232, 20, 3],
        ].map(([x, y, w, h], i) => (
          <g key={`txt${i}`}>
            <rect x={x} y={y} width={w as number} height={h as number} fill={c1} opacity={0.35 + (i % 3) * 0.08} />
            {i % 2 === 0 && (
              <rect x={Number(x) + (w as number) * 0.3} y={y} width={(w as number) * 0.4} height={h as number} fill={cR} opacity="0.2" />
            )}
          </g>
        ))}

        {[
          [120, 72, 30],
          [125, 78, 22],
          [120, 84, 35],
          [128, 90, 18],
          [122, 96, 28],
        ].map(([x, y, w], i) => (
          <rect key={`code${i}`} x={x} y={y} width={w as number} height="3" fill={c1} opacity={0.2 + (i % 3) * 0.08} />
        ))}

        {/* ══ PÍXELES SUELTOS — artefactos ══ */}
        {[
          [5, 38, 8, 4],
          [180, 62, 12, 3],
          [90, 105, 6, 5],
          [45, 152, 10, 3],
          [160, 148, 8, 4],
          [70, 180, 5, 6],
          [25, 248, 15, 3],
          [170, 215, 7, 4],
          [95, 270, 12, 3],
          [15, 130, 6, 4],
          [175, 178, 10, 3],
          [55, 268, 8, 5],
          [140, 108, 9, 3],
          [30, 175, 7, 4],
          [160, 270, 11, 3],
        ].map(([x, y, w, h], i) => (
          <rect
            key={`px${i}`}
            x={x}
            y={y}
            width={w as number}
            height={h as number}
            fill={i % 3 === 0 ? c1 : i % 3 === 1 ? cR : cB}
            opacity={0.3 + (i % 4) * 0.1}
          />
        ))}

        {/* ══ LÍNEAS DE INTERFERENCIA ══ */}
        {[
          [0, 38, 200, 1.5, 0.2],
          [0, 60, 200, 0.8, 0.15],
          [0, 118, 200, 1, 0.18],
          [0, 182, 200, 1.5, 0.2],
          [0, 245, 200, 0.8, 0.12],
          [0, 265, 200, 1.2, 0.15],
        ].map(([x, y, w, sw, op], i) => (
          <path key={`int${i}`} d={`M${x},${y} L${Number(x) + (w as number)},${y}`} stroke={i % 2 === 0 ? c1 : cR} strokeWidth={sw as number} opacity={op as number} />
        ))}

        {/* ══ DESPLAZAMIENTO DE BLOQUE — efecto corte ══ */}
        <rect x="0" y="130" width="200" height="3" fill={c1} opacity="0.45" />
        <rect x="0" y="133" width="200" height="2" fill={cR} opacity="0.2" />
        <rect x="0" y="192" width="200" height="2" fill={c1} opacity="0.35" />
        <rect x="0" y="194" width="200" height="3" fill={cB} opacity="0.15" />

        {/* ══ NÚMEROS / DATOS CORRUPTOS ══ */}
        <g opacity="0.3">
          <rect x="60" y="280" width="2" height="10" fill={c1} />
          <rect x="60" y="280" width="8" height="2" fill={c1} />
          <rect x="66" y="276" width="2" height="14" fill={c1} />
          <rect x="72" y="278" width="8" height="2" fill={c1} />
          <rect x="72" y="288" width="8" height="2" fill={c1} />
          <rect x="72" y="278" width="2" height="12" fill={c1} />
          <rect x="78" y="278" width="2" height="12" fill={c1} />
          <rect x="63" y="281" width="2" height="10" fill={cR} opacity="0.5" />
          <rect x="63" y="281" width="8" height="2" fill={cR} opacity="0.5" />
          <rect x="69" y="277" width="2" height="14" fill={cR} opacity="0.5" />
        </g>

        {/* ══ CENTRO FOCAL — punto de error ══ */}
        <circle cx="100" cy="150" r="6" fill={c1} opacity="0.6" />
        <circle cx="97" cy="148" r="6" fill={cR} opacity="0.2" />
        <circle cx="103" cy="152" r="6" fill={cB} opacity="0.2" />
        <circle cx="100" cy="150" r="2.5" fill="white" opacity="0.6" />
        <rect x="98" y="160" width="4" height="1.5" fill={c1} opacity="0.5" />
        <rect x="96" y="163" width="8" height="1" fill={c1} opacity="0.3" />
      </g>
    </svg>
  );
}
