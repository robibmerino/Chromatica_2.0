import type { RoomSceneProps } from '../types';

export function RoomSceneFachada({ primary, secondary, accent, surface, muted, background, fillContainer }: RoomSceneProps) {
  const svgContent = (
    <>
      <defs>
        <linearGradient id="facade-sky-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={secondary} stopOpacity="0.15" />
          <stop offset="100%" stopColor={surface} stopOpacity="0.3" />
        </linearGradient>
        <linearGradient id="facade-glass-ref" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.03" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.1" />
        </linearGradient>
        <pattern id="facade-awning-stripe" width="12" height="12" patternUnits="userSpaceOnUse">
          <rect width="6" height="12" fill={primary} />
          <rect x="6" width="6" height="12" fill={accent} />
        </pattern>
        <clipPath id="facade-lower-clip">
          <rect x="80" y="270" width="400" height="230" />
        </clipPath>
      </defs>
      <rect x="0" y="0" width="560" height="580" fill="url(#facade-sky-grad)" rx="8" />
      <rect x="0" y="80" width="60" height="420" fill={muted} opacity="0.3" />
      <rect x="60" y="120" width="40" height="380" fill={muted} opacity="0.2" />
      <rect x="460" y="60" width="50" height="440" fill={muted} opacity="0.25" />
      <rect x="510" y="100" width="50" height="400" fill={muted} opacity="0.2" />
      <rect x="80" y="80" width="400" height="420" fill={surface} stroke={muted} strokeWidth="1" />
      <rect x="80" y="80" width="400" height="12" fill={primary} />
      <rect x="76" y="74" width="408" height="10" fill={secondary} rx="2" />
      <rect x="80" y="84" width="400" height="3" fill={secondary} opacity="0.4" />
      {[0, 1, 2].map((i) => {
        const wx = 120 + i * 130;
        return (
          <g key={`win-${i}`}>
            <rect x={wx} y="110" width="80" height="110" fill={primary} opacity="0.85" rx="2" />
            <rect x={wx + 4} y="114" width="72" height="102" fill={background} opacity="0.6" rx="1" />
            <rect x={wx + 4} y="114" width="72" height="102" fill="url(#facade-glass-ref)" rx="1" />
            <rect x={wx + 38} y="114" width="2" height="102" fill={primary} opacity="0.6" />
            <rect x={wx + 4} y="160" width="72" height="2" fill={primary} opacity="0.6" />
            <rect x={wx - 4} y="220" width="88" height="6" fill={secondary} rx="1" />
            <rect x={wx + 6} y="116" width="14" height="96" fill={accent} opacity="0.12" rx="1" />
            <rect x={wx + 58} y="116" width="12" height="96" fill={accent} opacity="0.1" rx="1" />
          </g>
        );
      })}
      <rect x="80" y="240" width="400" height="30" fill={primary} />
      <rect x="80" y="245" width="400" height="20" fill={secondary} opacity="0.3" />
      {Array.from({ length: 16 }).map((_, i) => (
        <circle key={`frieze-dot-${i}`} cx={105 + i * 24} cy="255" r="3" fill={accent} opacity="0.5" />
      ))}
      <rect x="80" y="270" width="400" height="230" fill={background} />
      <g clipPath="url(#facade-lower-clip)">
        {Array.from({ length: 7 }).map((_, row) =>
          Array.from({ length: 10 }).map((_, col) => (
            <rect key={`stone-${row}-${col}`} x={82 + col * 40 + (row % 2 === 0 ? 0 : 20)} y={272 + row * 32} width="38" height="30" fill="none" stroke={muted} strokeWidth="0.5" opacity="0.3" rx="1" />
          ))
        )}
      </g>
      <rect x="190" y="278" width="180" height="44" fill={primary} rx="4" />
      <rect x="186" y="274" width="188" height="52" fill="none" stroke={accent} strokeWidth="1.5" rx="6" opacity="0.4" />
      <rect x="205" y="288" width="16" height="16" rx="2" fill={accent} />
      <circle cx="227" cy="296" r="6" fill={secondary} opacity="0.8" />
      <text x="240" y="306" fontSize="20" fontWeight="700" fontFamily="'Playfair Display', serif" fill={background}>AURA</text>
      <text x="308" y="306" fontSize="20" fontWeight="300" fontFamily="'Space Grotesk', sans-serif" fill={accent}>.</text>
      <rect x="220" y="270" width="4" height="10" fill={secondary} rx="1" />
      <rect x="336" y="270" width="4" height="10" fill={secondary} rx="1" />
      <g>
        <rect x="95" y="338" width="195" height="145" fill={primary} rx="3" />
        <rect x="100" y="343" width="185" height="135" fill={surface} opacity="0.4" rx="2" />
        <rect x="100" y="343" width="185" height="135" fill="url(#facade-glass-ref)" rx="2" />
        <rect x="102" y="345" width="181" height="60" fill={primary} opacity="0.15" />
        <rect x="140" y="410" width="60" height="8" fill={secondary} rx="2" />
        <rect x="152" y="380" width="36" height="30" fill={accent} rx="4" opacity="0.9" />
        <rect x="155" y="395" width="30" height="3" fill={background} rx="1" opacity="0.6" />
        <rect x="220" y="355" width="50" height="65" fill={primary} rx="2" opacity="0.7" />
        <circle cx="245" cy="378" r="12" fill={accent} opacity="0.5" />
        <rect x="230" y="398" width="30" height="3" fill={surface} rx="1" opacity="0.5" />
        <rect x="233" y="405" width="24" height="2" fill={surface} rx="1" opacity="0.3" />
        <rect x="110" y="420" width="80" height="3" fill={secondary} opacity="0.6" />
        <rect x="115" y="408" width="12" height="12" fill={primary} rx="1" opacity="0.5" />
        <rect x="132" y="410" width="10" height="10" fill={accent} rx="5" opacity="0.4" />
        <rect x="148" y="406" width="8" height="14" fill={secondary} rx="1" opacity="0.5" />
        <rect x="162" y="409" width="12" height="11" fill={primary} rx="2" opacity="0.4" />
        <ellipse cx="170" cy="348" rx="40" ry="5" fill={accent} opacity="0.08" />
        <text x="115" y="472" fontSize="7" fontFamily="'Space Grotesk', sans-serif" fill={primary} opacity="0.4" letterSpacing="2">FLAGSHIP STORE</text>
      </g>
      <g>
        <rect x="308" y="338" width="80" height="145" fill={primary} rx="3" />
        <rect x="313" y="343" width="34" height="135" fill={secondary} rx="2" />
        <rect x="349" y="343" width="34" height="135" fill={secondary} rx="2" />
        <rect x="316" y="348" width="28" height="90" fill={surface} opacity="0.35" rx="1" />
        <rect x="352" y="348" width="28" height="90" fill={surface} opacity="0.35" rx="1" />
        <rect x="316" y="348" width="28" height="90" fill="url(#facade-glass-ref)" rx="1" />
        <rect x="352" y="348" width="28" height="90" fill="url(#facade-glass-ref)" rx="1" />
        <rect x="340" y="405" width="3" height="24" fill={accent} rx="1.5" />
        <rect x="353" y="405" width="3" height="24" fill={accent} rx="1.5" />
        <rect x="313" y="338" width="70" height="2" fill={accent} opacity="0.6" />
        <text x="348" y="365" fontSize="10" fontWeight="700" fontFamily="'Playfair Display', serif" fill={accent} textAnchor="middle" opacity="0.7">42</text>
      </g>
      <g>
        <rect x="405" y="338" width="60" height="100" fill={primary} rx="3" />
        <rect x="410" y="343" width="50" height="90" fill={surface} opacity="0.35" rx="2" />
        <rect x="410" y="343" width="50" height="90" fill="url(#facade-glass-ref)" rx="2" />
        <rect x="434" y="343" width="2" height="90" fill={primary} opacity="0.5" />
        <rect x="415" y="380" width="16" height="20" fill={accent} opacity="0.15" rx="2" />
        <rect x="440" y="370" width="14" height="30" fill={primary} opacity="0.12" rx="2" />
        <rect x="402" y="438" width="66" height="5" fill={secondary} rx="1" />
        <rect x="408" y="430" width="54" height="10" fill={primary} opacity="0.7" rx="2" />
        {[0, 1, 2, 3].map((i) => (
          <circle key={`flower-r-${i}`} cx={418 + i * 13} cy="425" r="5" fill={accent} opacity={0.5 + i * 0.1} />
        ))}
        {[0, 1, 2].map((i) => (
          <rect key={`stem-r-${i}`} x={423 + i * 13} y="425" width="1.5" height="7" fill={secondary} opacity="0.5" />
        ))}
      </g>
      <g>
        <polygon points="298,330 398,330 404,354 292,354" fill="url(#facade-awning-stripe)" opacity="0.85" />
        <rect x="292" y="328" width="112" height="4" fill={primary} rx="1" />
        <polygon points="298,354 398,354 395,360 301,360" fill={primary} opacity="0.08" />
        {Array.from({ length: 7 }).map((_, i) => (
          <circle key={`scallop-${i}`} cx={300 + i * 15} cy="354" r="4" fill="url(#facade-awning-stripe)" opacity="0.85" />
        ))}
      </g>
      {[145, 420].map((lx, i) => (
        <g key={`sconce-${i}`}>
          <rect x={lx - 2} y="325" width="4" height="8" fill={secondary} rx="1" />
          <polygon points={`${lx - 8},333 ${lx + 8},333 ${lx + 6},345 ${lx - 6},345`} fill={accent} opacity="0.85" />
          <ellipse cx={lx} cy="360" rx="25" ry="30" fill={accent} opacity="0.05" />
          <circle cx={lx} cy="340" r="2" fill={background} opacity="0.9" />
        </g>
      ))}
      <rect x="0" y="488" width="560" height="92" fill={muted} opacity="0.4" />
      {Array.from({ length: 10 }).map((_, i) => (
        <rect key={`tile-${i}`} x={i * 56} y="488" width="55" height="91" fill="none" stroke={surface} strokeWidth="0.5" opacity="0.3" />
      ))}
      <rect x="0" y="486" width="560" height="4" fill={secondary} opacity="0.5" />
      <rect x="296" y="478" width="104" height="12" fill={secondary} rx="2" />
      <rect x="300" y="483" width="96" height="6" fill={surface} opacity="0.3" rx="1" />
      <g>
        <rect x="95" y="468" width="40" height="22" fill={secondary} rx="3" />
        <rect x="97" y="465" width="36" height="5" fill={secondary} rx="2" />
        <ellipse cx="108" cy="458" rx="14" ry="10" fill={accent} opacity="0.6" />
        <ellipse cx="120" cy="455" rx="10" ry="8" fill={accent} opacity="0.45" />
        <ellipse cx="114" cy="450" rx="8" ry="6" fill={primary} opacity="0.3" />
        <rect x="112" y="458" width="2" height="8" fill={secondary} opacity="0.5" />
      </g>
      <g>
        <rect x="410" y="468" width="40" height="22" fill={secondary} rx="3" />
        <rect x="412" y="465" width="36" height="5" fill={secondary} rx="2" />
        <ellipse cx="423" cy="458" rx="12" ry="9" fill={accent} opacity="0.55" />
        <ellipse cx="435" cy="455" rx="10" ry="8" fill={accent} opacity="0.5" />
        <ellipse cx="430" cy="450" rx="8" ry="7" fill={primary} opacity="0.3" />
        <rect x="428" y="458" width="2" height="8" fill={secondary} opacity="0.5" />
      </g>
      <g>
        <polygon points="492,490 510,490 514,540 488,540" fill={primary} opacity="0.8" />
        <rect x="493" y="498" width="16" height="30" fill={surface} rx="1" opacity="0.6" />
        <text x="501" y="511" fontSize="5" fontWeight="700" fontFamily="'Space Grotesk', sans-serif" fill={primary} textAnchor="middle">OPEN</text>
        <rect x="496" y="518" width="10" height="1.5" fill={accent} rx="0.5" opacity="0.6" />
        <rect x="497" y="522" width="8" height="1" fill={primary} rx="0.5" opacity="0.3" />
      </g>
      <g>
        <rect x="86" y="270" width="3" height="200" fill={secondary} rx="1" />
        <rect x="84" y="275" width="14" height="4" fill={secondary} rx="1" />
        <rect x="90" y="280" width="28" height="50" fill={accent} rx="2" />
        <rect x="97" y="288" width="14" height="14" fill={background} opacity="0.3" rx="7" />
        <rect x="100" y="310" width="8" height="1.5" fill={background} rx="0.5" opacity="0.4" />
        <rect x="98" y="315" width="12" height="1.5" fill={background} rx="0.5" opacity="0.3" />
        <path d="M118,280 Q122,295 118,310 Q114,320 118,330" fill="none" stroke={accent} strokeWidth="0.5" opacity="0.3" />
      </g>
      <rect x="458" y="290" width="18" height="24" fill={primary} rx="2" />
      <text x="467" y="307" fontSize="12" fontWeight="700" fontFamily="'Playfair Display', serif" fill={background} textAnchor="middle">42</text>
      <g>
        <rect x="392" y="440" width="42" height="20" fill={background} stroke={muted} strokeWidth="0.5" rx="2" />
        <circle cx="400" cy="450" r="3" fill={accent} opacity="0.8" />
        <text x="408" y="453" fontSize="6" fontWeight="600" fontFamily="'Space Grotesk', sans-serif" fill={primary}>OPEN</text>
      </g>
      <rect x="476" y="88" width="4" height="398" fill={muted} opacity="0.4" rx="2" />
      <rect x="474" y="230" width="8" height="6" fill={muted} opacity="0.3" rx="1" />
      <rect x="474" y="400" width="8" height="6" fill={muted} opacity="0.3" rx="1" />
      <rect x="460" y="350" width="12" height="16" fill={muted} opacity="0.3" rx="1" />
      <g opacity="0.35">
        <circle cx="160" cy="530" r="14" fill="none" stroke={primary} strokeWidth="2" />
        <circle cx="194" cy="530" r="14" fill="none" stroke={primary} strokeWidth="2" />
        <line x1="160" y1="530" x2="175" y2="514" stroke={primary} strokeWidth="2" />
        <line x1="175" y1="514" x2="194" y2="530" stroke={primary} strokeWidth="2" />
        <line x1="175" y1="514" x2="185" y2="510" stroke={primary} strokeWidth="2" />
        <line x1="185" y1="510" x2="194" y2="530" stroke={primary} strokeWidth="1.5" />
        <line x1="185" y1="510" x2="190" y2="505" stroke={primary} strokeWidth="2" />
        <line x1="186" y1="506" x2="194" y2="508" stroke={primary} strokeWidth="1.5" />
        <rect x="172" y="511" width="8" height="3" fill={primary} rx="1.5" />
      </g>
    </>
  );
  const viewBox = '0 50 560 420';
  const commonProps = { viewBox, style: { borderRadius: 12, overflow: 'hidden' as const } };
  if (fillContainer) {
    return (
      <svg {...commonProps} preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%', borderRadius: 12, overflow: 'hidden', display: 'block' }}>
        {svgContent}
      </svg>
    );
  }
  return (
    <svg {...commonProps} width="560" height="420">
      {svgContent}
    </svg>
  );
}