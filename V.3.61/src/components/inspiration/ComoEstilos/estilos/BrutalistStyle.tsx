import { useId } from 'react';
import type { ComoEstiloProps } from '../types';
import { darken } from '../estiloColorUtils';

/* ═══════════════════════════════════════
   ESTILO: BRUTALISTA
   Crudo, pesado, impactante
   ═══════════════════════════════════════ */
export function BrutalistStyle({ color = '#818cf8', className = '' }: ComoEstiloProps) {
  const id = useId().replace(/:/g, '');

  const c1 = color;
  const c2 = darken(color, 80);
  const c3 = darken(color, 140);

  return (
    <svg viewBox="0 0 200 300" className={className} style={{ width: '100%', height: '100%' }}>
      {/* ══ BLOQUE MACIZO SUPERIOR ══ */}
      <rect x="0" y="0" width="200" height="90" fill={c3} opacity="0.85" />
      <rect x="0" y="0" width="200" height="90" fill="none" stroke={c1} strokeWidth="4" opacity="0.5" />

      {/* Corte brutal en el bloque */}
      <rect x="130" y="0" width="70" height="90" fill={c1} opacity="0.7" />
      <path d="M130,0 L130,90" stroke={c2} strokeWidth="5" opacity="0.8" />

      {/* Ventana — hueco crudo */}
      <rect x="20" y="20" width="40" height="50" fill="black" opacity="0.4" />
      <rect x="20" y="20" width="40" height="50" fill="none" stroke={c1} strokeWidth="3" opacity="0.6" />

      {/* División de ventana */}
      <path d="M40,20 L40,70" stroke={c1} strokeWidth="2.5" opacity="0.5" />
      <path d="M20,45 L60,45" stroke={c1} strokeWidth="2.5" opacity="0.5" />

      {/* Ventana derecha */}
      <rect x="150" y="25" width="30" height="40" fill="black" opacity="0.35" />
      <rect x="150" y="25" width="30" height="40" fill="none" stroke={c2} strokeWidth="2.5" opacity="0.55" />

      {/* ══ FRANJA DE PESO ══ */}
      <rect x="0" y="90" width="200" height="12" fill={c2} opacity="0.75" />

      {/* ══ ZONA MEDIA — torre offset ══ */}
      <rect x="10" y="102" width="80" height="140" fill={c1} opacity="0.55" />
      <rect x="10" y="102" width="80" height="140" fill="none" stroke={c2} strokeWidth="3.5" opacity="0.65" />

      {/* Columnas interiores */}
      <rect x="18" y="110" width="16" height="124" fill={c2} opacity="0.4" />
      <rect x="42" y="110" width="16" height="124" fill={c2} opacity="0.35" />
      <rect x="66" y="110" width="16" height="124" fill={c2} opacity="0.3" />

      {/* Huecos entre columnas */}
      <rect x="34" y="115" width="8" height="30" fill="black" opacity="0.3" />
      <rect x="58" y="115" width="8" height="30" fill="black" opacity="0.25" />
      <rect x="34" y="155" width="8" height="30" fill="black" opacity="0.25" />
      <rect x="58" y="155" width="8" height="30" fill="black" opacity="0.2" />
      <rect x="34" y="195" width="8" height="30" fill="black" opacity="0.2" />
      <rect x="58" y="195" width="8" height="30" fill="black" opacity="0.18" />

      {/* ══ BLOQUE DERECHO — masa desplazada ══ */}
      <rect x="105" y="120" width="90" height="100" fill={c3} opacity="0.65" />
      <rect x="105" y="120" width="90" height="100" fill="none" stroke={c1} strokeWidth="3" opacity="0.55" />

      {/* Ranura horizontal */}
      <rect x="110" y="155" width="80" height="8" fill="black" opacity="0.35" />
      <rect x="110" y="178" width="80" height="8" fill="black" opacity="0.3" />

      {/* Bloque flotante superpuesto */}
      <rect x="130" y="100" width="55" height="40" fill={c1} opacity="0.7" />
      <rect x="130" y="100" width="55" height="40" fill="none" stroke={c2} strokeWidth="3" opacity="0.6" />

      {/* ══ LOSA HORIZONTAL ══ */}
      <rect x="0" y="242" width="200" height="10" fill={c2} opacity="0.7" />

      {/* ══ BASE — cimientos ══ */}
      <rect x="15" y="252" width="50" height="48" fill={c1} opacity="0.5" />
      <rect x="15" y="252" width="50" height="48" fill="none" stroke={c2} strokeWidth="3" opacity="0.55" />

      <rect x="80" y="252" width="50" height="48" fill={c3} opacity="0.55" />
      <rect x="80" y="252" width="50" height="48" fill="none" stroke={c1} strokeWidth="3" opacity="0.5" />

      <rect x="145" y="252" width="45" height="48" fill={c2} opacity="0.6" />
      <rect x="145" y="252" width="45" height="48" fill="none" stroke={c1} strokeWidth="2.5" opacity="0.45" />

      {/* Huecos en base */}
      <rect x="25" y="265" width="30" height="25" fill="black" opacity="0.3" />
      <rect x="90" y="268" width="30" height="18" fill="black" opacity="0.25" />

      {/* ══ MARCAS BRUTAS — textura de hormigón ══ */}
      {/* Líneas de encofrado */}
      {[22, 42, 62, 82].map((y, i) => (
        <path key={`enc${i}`} d={`M2,${y} L198,${y}`} stroke={c1} strokeWidth="0.6" opacity="0.12" />
      ))}

      {/* Juntas verticales */}
      <path d="M100,102 L100,242" stroke={c2} strokeWidth="0.8" opacity="0.15" />
      <path d="M75,252 L75,300" stroke={c1} strokeWidth="0.6" opacity="0.12" />
      <path d="M140,252 L140,300" stroke={c1} strokeWidth="0.6" opacity="0.12" />

      {/* Imperfecciones — marcas crudas */}
      <path d="M85,45 L95,40" stroke={c1} strokeWidth="2" strokeLinecap="round" opacity="0.2" />
      <path d="M110,160 L118,158" stroke={c1} strokeWidth="1.5" strokeLinecap="round" opacity="0.15" />
      <path d="M155,260 L162,262" stroke={c1} strokeWidth="1.5" strokeLinecap="round" opacity="0.15" />

      {/* Perno / anclaje */}
      <circle cx="100" cy="96" r="4" fill={c2} opacity="0.6" />
      <circle cx="100" cy="96" r="4" fill="none" stroke={c1} strokeWidth="1.5" opacity="0.4" />
      <circle cx="100" cy="96" r="1.5" fill={c1} opacity="0.5" />

      {/* Pernos en esquinas */}
      <circle cx="15" cy="102" r="3" fill={c2} opacity="0.5" />
      <circle cx="90" cy="102" r="3" fill={c2} opacity="0.5" />
      <circle cx="105" cy="120" r="3" fill={c2} opacity="0.45" />
      <circle cx="195" cy="120" r="3" fill={c2} opacity="0.45" />

      {/* ══ SOMBRA PROYECTADA — peso visual ══ */}
      <path d="M90,242 L95,252" stroke={c3} strokeWidth="2" opacity="0.3" />
      <path d="M10,242 L15,252" stroke={c3} strokeWidth="2" opacity="0.3" />
      <rect x="90" y="220" width="110" height="5" fill={c3} opacity="0.2" />
    </svg>
  );
}
