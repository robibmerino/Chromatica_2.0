import type { RoomSceneProps } from '../types';

export function RoomSceneStand({ primary, secondary, accent, surface, muted, background, fillContainer }: RoomSceneProps) {
  const svgContent = (
    <>
      <defs>
        <pattern id="standFloor" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <rect width="40" height="40" fill={surface} />
          <rect x="0" y="0" width="20" height="20" fill={muted} opacity="0.15" />
          <rect x="20" y="20" width="20" height="20" fill={muted} opacity="0.15" />
        </pattern>
        <radialGradient id="screenGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.15" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
        <radialGradient id="spotlight1" cx="50%" cy="0%" r="80%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="spotlight2" cx="50%" cy="0%" r="80%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.08" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Suelo */}
      <rect x="30" y="400" width="520" height="110" rx="4" fill="url(#standFloor)" />
      <line x1="30" y1="400" x2="550" y2="400" stroke={muted} strokeWidth="1.5" opacity="0.3" />
      {/* Pared fondo */}
      <rect x="60" y="60" width="460" height="340" rx="3" fill={surface} />
      <rect x="60" y="60" width="150" height="340" fill={primary} opacity="0.08" />
      <rect x="60" y="60" width="6" height="340" fill={primary} />
      <rect x="514" y="60" width="6" height="340" fill={primary} />
      {/* Viga header */}
      <rect x="45" y="40" width="490" height="28" rx="2" fill={primary} />
      <text x="290" y="59" textAnchor="middle" fill={background} fontSize="14" fontWeight="700" letterSpacing="6" fontFamily="'Playfair Display', serif">AURA STUDIO</text>
      {/* Pilares */}
      <rect x="50" y="40" width="16" height="365" rx="2" fill={secondary} />
      <rect x="50" y="40" width="16" height="365" rx="2" fill="#000" opacity="0.1" />
      <rect x="514" y="40" width="16" height="365" rx="2" fill={secondary} />
      <rect x="514" y="40" width="16" height="365" rx="2" fill="#000" opacity="0.1" />
      {/* Pantalla grande */}
      <rect x="190" y="85" width="200" height="130" rx="4" fill={primary} />
      <rect x="195" y="90" width="190" height="120" rx="2" fill={background} />
      <rect x="195" y="90" width="190" height="120" rx="2" fill={primary} opacity="0.05" />
      <ellipse cx="290" cy="150" rx="120" ry="80" fill="url(#screenGlow)" />
      <rect x="260" y="110" width="24" height="24" rx="3" fill={primary} opacity="0.9" />
      <circle cx="292" cy="122" r="10" fill={accent} opacity="0.8" />
      <rect x="296" y="116" width="8" height="4" rx="1" fill={secondary} />
      <text x="290" y="155" textAnchor="middle" fill={primary} fontSize="11" fontWeight="700" fontFamily="'Playfair Display', serif" letterSpacing="3">AURA</text>
      <rect x="255" y="162" width="70" height="2" rx="1" fill={accent} opacity="0.6" />
      <rect x="248" y="170" width="84" height="3" rx="1" fill={muted} opacity="0.3" />
      <rect x="256" y="178" width="68" height="3" rx="1" fill={muted} opacity="0.2" />
      <rect x="283" y="215" width="14" height="12" fill={secondary} opacity="0.5" />
      {/* Banner izquierdo */}
      <rect x="82" y="100" width="75" height="200" rx="2" fill={background} stroke={muted} strokeWidth="1" />
      <rect x="82" y="100" width="75" height="45" fill={accent} rx="2" />
      <text x="119" y="127" textAnchor="middle" fill={background} fontSize="8" fontWeight="700" letterSpacing="2">INNOVATE</text>
      <circle cx="110" cy="175" r="18" fill={primary} opacity="0.12" />
      <circle cx="125" cy="185" r="12" fill={accent} opacity="0.15" />
      <rect x="95" y="210" width="50" height="2" rx="1" fill={primary} opacity="0.3" />
      <rect x="100" y="218" width="40" height="2" rx="1" fill={muted} opacity="0.25" />
      <rect x="103" y="226" width="34" height="2" rx="1" fill={muted} opacity="0.2" />
      <circle cx="119" cy="260" r="8" fill={accent} opacity="0.15" />
      <circle cx="119" cy="260" r="4" fill={accent} opacity="0.3" />
      <rect x="105" y="300" width="28" height="4" rx="1" fill={secondary} opacity="0.4" />
      <rect x="117" y="296" width="4" height="8" fill={secondary} opacity="0.3" />
      {/* Estantería derecha */}
      <rect x="420" y="100" width="85" height="200" rx="2" fill={surface} stroke={muted} strokeWidth="1" />
      <line x1="420" y1="160" x2="505" y2="160" stroke={muted} strokeWidth="1" />
      <line x1="420" y1="220" x2="505" y2="220" stroke={muted} strokeWidth="1" />
      <rect x="428" y="115" width="18" height="38" rx="2" fill={primary} opacity="0.7" />
      <rect x="450" y="120" width="18" height="33" rx="2" fill={accent} opacity="0.6" />
      <rect x="472" y="112" width="18" height="41" rx="2" fill={secondary} opacity="0.7" />
      <rect x="494" y="118" width="8" height="35" rx="1" fill={primary} opacity="0.4" />
      <rect x="428" y="170" width="22" height="16" rx="3" fill={accent} opacity="0.5" />
      <rect x="456" y="168" width="22" height="18" rx="3" fill={primary} opacity="0.5" />
      <circle cx="496" cy="180" r="9" fill={secondary} opacity="0.4" />
      <rect x="428" y="232" width="65" height="20" rx="2" fill={primary} opacity="0.1" />
      <rect x="432" y="236" width="30" height="3" rx="1" fill={primary} opacity="0.3" />
      <rect x="432" y="242" width="20" height="2" rx="1" fill={muted} opacity="0.3" />
      <rect x="475" y="230" width="22" height="28" rx="1" fill={accent} opacity="0.2" />
      <rect x="477" y="232" width="18" height="24" rx="1" fill={background} stroke={accent} strokeWidth="0.5" />
      {/* Focos */}
      <rect x="100" y="48" width="380" height="5" rx="2" fill={secondary} opacity="0.4" />
      {[160, 290, 420].map((x, i) => (
        <g key={i}>
          <rect x={x - 8} y="48" width="16" height="10" rx="2" fill={secondary} opacity="0.6" />
          <polygon points={`${x - 6},58 ${x + 6},58 ${x + 3},65 ${x - 3},65`} fill={secondary} opacity="0.5" />
          <polygon points={`${x - 4},65 ${x + 4},65 ${x + 40},400 ${x - 40},400`} fill="url(#spotlight1)" />
        </g>
      ))}
      {/* Mostrador recepción */}
      <rect x="175" y="340" width="230" height="65" rx="4" fill={primary} />
      <rect x="170" y="335" width="240" height="10" rx="3" fill={secondary} />
      <rect x="170" y="335" width="240" height="10" rx="3" fill="#fff" opacity="0.15" />
      <rect x="185" y="352" width="65" height="42" rx="2" fill={background} opacity="0.1" />
      <rect x="260" y="352" width="65" height="42" rx="2" fill={background} opacity="0.1" />
      <rect x="335" y="352" width="60" height="42" rx="2" fill={background} opacity="0.1" />
      <rect x="272" y="360" width="14" height="14" rx="2" fill={background} opacity="0.3" />
      <circle cx="293" cy="367" r="5" fill={accent} opacity="0.5" />
      <rect x="185" y="348" width="210" height="2" rx="1" fill={accent} opacity="0.5" />
      {/* Objetos sobre mostrador */}
      <rect x="195" y="318" width="35" height="22" rx="3" fill={primary} opacity="0.8" />
      <rect x="198" y="321" width="29" height="16" rx="1" fill={background} opacity="0.9" />
      <rect x="201" y="324" width="15" height="2" rx="1" fill={primary} opacity="0.3" />
      <rect x="201" y="328" width="20" height="2" rx="1" fill={accent} opacity="0.3" />
      <rect x="260" y="322" width="24" height="16" rx="1" fill={surface} stroke={muted} strokeWidth="0.5" />
      <rect x="263" y="310" width="18" height="16" rx="1" fill={accent} opacity="0.2" />
      <rect x="265" y="312" width="14" height="12" rx="1" fill={background} stroke={accent} strokeWidth="0.5" />
      <rect x="310" y="325" width="30" height="12" rx="2" fill={surface} stroke={muted} strokeWidth="0.5" />
      <rect x="314" y="320" width="22" height="8" rx="1" fill={background} stroke={primary} strokeWidth="0.5" opacity="0.7" />
      <rect x="365" y="322" width="14" height="16" rx="2" fill={secondary} opacity="0.5" />
      <circle cx="372" cy="316" r="9" fill={accent} opacity="0.3" />
      <circle cx="369" cy="313" r="7" fill={primary} opacity="0.2" />
      <line x1="372" y1="322" x2="372" y2="315" stroke={accent} strokeWidth="1.5" opacity="0.4" />
      {/* Mesa alta + taburetes */}
      <rect x="20" y="350" width="100" height="7" rx="3" fill={secondary} />
      <rect x="20" y="350" width="100" height="7" rx="3" fill="#fff" opacity="0.12" />
      <rect x="63" y="357" width="14" height="40" rx="2" fill={secondary} opacity="0.6" />
      <ellipse cx="70" cy="400" rx="28" ry="5" fill={secondary} opacity="0.3" />
      <rect x="30" y="336" width="24" height="16" rx="2" fill={background} stroke={muted} strokeWidth="0.8" />
      <rect x="34" y="340" width="16" height="3" rx="1" fill={primary} opacity="0.3" />
      <rect x="34" y="345" width="12" height="2" rx="1" fill={accent} opacity="0.3" />
      <circle cx="92" cy="343" r="8" fill={accent} opacity="0.15" />
      <circle cx="92" cy="343" r="5" fill={accent} opacity="0.3" />
      <rect x="22" y="385" width="36" height="6" rx="12" fill={primary} opacity="0.75" />
      <rect x="30" y="391" width="5" height="16" fill={secondary} opacity="0.5" />
      <rect x="45" y="391" width="5" height="16" fill={secondary} opacity="0.5" />
      <rect x="26" y="405" width="28" height="3" rx="1" fill={secondary} opacity="0.3" />
      <rect x="82" y="385" width="36" height="6" rx="12" fill={primary} opacity="0.75" />
      <rect x="90" y="391" width="5" height="16" fill={secondary} opacity="0.5" />
      <rect x="105" y="391" width="5" height="16" fill={secondary} opacity="0.5" />
      <rect x="86" y="405" width="28" height="3" rx="1" fill={secondary} opacity="0.3" />
      {/* Planta decorativa */}
      <rect x="520" y="370" width="30" height="32" rx="3" fill={secondary} opacity="0.5" />
      <rect x="518" y="367" width="34" height="6" rx="2" fill={secondary} opacity="0.6" />
      <ellipse cx="535" cy="350" rx="18" ry="22" fill={accent} opacity="0.25" />
      <ellipse cx="528" cy="345" rx="14" ry="18" fill={primary} opacity="0.15" />
      <ellipse cx="542" cy="342" rx="12" ry="20" fill={accent} opacity="0.2" />
      <line x1="535" y1="367" x2="535" y2="340" stroke={accent} strokeWidth="2" opacity="0.3" />
      <line x1="535" y1="360" x2="525" y2="342" stroke={accent} strokeWidth="1.5" opacity="0.2" />
      <line x1="535" y1="355" x2="545" y2="338" stroke={primary} strokeWidth="1.5" opacity="0.15" />
      {/* Alfombra marca */}
      <rect x="200" y="415" width="180" height="60" rx="3" fill={primary} opacity="0.08" />
      <rect x="200" y="415" width="180" height="60" rx="3" stroke={primary} strokeWidth="1" opacity="0.15" fill="none" />
      <rect x="270" y="432" width="16" height="16" rx="2" fill={primary} opacity="0.15" />
      <circle cx="293" cy="440" r="7" fill={accent} opacity="0.12" />
      <text x="290" y="462" textAnchor="middle" fill={primary} opacity="0.2" fontSize="8" fontWeight="600" letterSpacing="3">AURA</text>
      {/* Banner colgante */}
      <rect x="475" y="70" width="3" height="25" fill={muted} opacity="0.3" />
      <rect x="460" y="95" width="35" height="55" rx="2" fill={accent} opacity="0.15" />
      <rect x="460" y="95" width="35" height="55" rx="2" stroke={accent} strokeWidth="1" fill="none" opacity="0.3" />
      <text x="477" y="118" textAnchor="middle" fill={accent} fontSize="6" fontWeight="700" letterSpacing="1" opacity="0.5">NEW</text>
      <text x="477" y="130" textAnchor="middle" fill={accent} fontSize="5" letterSpacing="1" opacity="0.4">2025</text>
      {/* Cable */}
      <path d="M 170 405 Q 150 420, 120 415" stroke={muted} strokeWidth="1" fill="none" opacity="0.15" />
    </>
  );
  if (fillContainer) {
    return (
      <svg viewBox="0 40 580 450" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%', borderRadius: 12, overflow: 'hidden', display: 'block' }}>
        {svgContent}
      </svg>
    );
  }
  return (
    <svg viewBox="0 40 580 450" width="580" height="450" style={{ borderRadius: 12, overflow: 'hidden' }}>
      {svgContent}
    </svg>
  );
}