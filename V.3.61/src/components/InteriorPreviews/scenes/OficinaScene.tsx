import type { RoomSceneProps } from '../types';

const OFFICE = {
  floorY: 290,
  frameStrokeOpacity: 0.4,
  meetingTableCx: 460,
  meetingChairs: [
    { seatX: 388, backX: 390, seatY: 258, backY: 232, seatW: 38, seatH: 10, backW: 34, backH: 26, legY: 268, legH: 22, legW: 5, leftLegX: 398, rightLegX: 411 },
    { seatX: 493, backX: 495, seatY: 258, backY: 232, seatW: 38, seatH: 10, backW: 34, backH: 26, legY: 268, legH: 22, legW: 5, leftLegX: 503, rightLegX: 516 },
  ] as const,
  chairLegOpacity: 0.14,
};

export function RoomSceneOficina({ primary, secondary, accent, surface, muted, background, fillContainer }: RoomSceneProps) {
  const { floorY, frameStrokeOpacity, meetingTableCx, meetingChairs, chairLegOpacity } = OFFICE;
  const svgContent = (
    <>
      <rect width="572" height="400" fill={surface} />
      <rect x="0" y="0" width="572" height="8" fill={primary} opacity={0.15} />
      <rect x="0" y={floorY} width="572" height="110" fill={muted} opacity={0.35} />
      {[0, 80, 160, 240, 320, 400, 480].map((x, i) => (
        <rect key={i} x={x} y={floorY} width="1" height="110" fill={primary} opacity={0.06} />
      ))}
      <rect x="0" y={floorY} width="572" height="1.5" fill={primary} opacity={0.1} />
      <rect x="30" y="30" width="160" height="180" rx="3" fill={background} />
      <rect x="30" y="30" width="160" height="180" rx="3" stroke={primary} strokeWidth="3" fill="none" />
      <line x1="110" y1="30" x2="110" y2="210" stroke={primary} strokeWidth="2" />
      <line x1="30" y1="120" x2="190" y2="120" stroke={primary} strokeWidth="2" />
      <rect x="32" y="32" width="77" height="87" fill={accent} opacity={0.08} />
      <rect x="112" y="32" width="77" height="87" fill={accent} opacity={0.05} />
      {[40, 52, 64, 76].map((y, i) => (
        <line key={i} x1="34" y1={y} x2="108" y2={y} stroke={muted} strokeWidth="1" opacity={0.3} />
      ))}
      <rect x="25" y="208" width="170" height="6" rx="1" fill={primary} opacity={0.2} />
      <rect x="230" y="35" width="150" height="100" rx="3" fill={background} />
      <rect x="230" y="35" width="150" height="100" rx="3" stroke={muted} strokeWidth="2" strokeOpacity={frameStrokeOpacity} fill="none" />
      <rect x="242" y="48" width="28" height="28" rx="2" fill={accent} opacity={0.7} />
      <rect x="275" y="48" width="28" height="28" rx="2" fill={primary} opacity={0.3} />
      <rect x="308" y="48" width="28" height="28" rx="2" fill={secondary} opacity={0.5} />
      <rect x="341" y="48" width="28" height="28" rx="2" fill={accent} opacity={0.4} />
      {[85, 93, 101, 109, 117].map((y, i) => (
        <line key={i} x1="242" y1={y} x2={320 - i * 8} y2={y} stroke={muted} strokeWidth="1.5" opacity={0.4} />
      ))}
      <rect x="250" y="135" width="110" height="4" rx="1" fill={primary} opacity={0.15} />
      <rect x="260" y="133" width="3" height="8" rx="1" fill={accent} />
      <rect x="268" y="133" width="3" height="8" rx="1" fill={primary} />
      <rect x="276" y="133" width="3" height="8" rx="1" fill={secondary} />
      <circle cx="440" cy="65" r="25" fill={background} stroke={primary} strokeWidth="2" />
      <circle cx="440" cy="65" r="2" fill={primary} />
      <line x1="440" y1="65" x2="440" y2="48" stroke={primary} strokeWidth="2" strokeLinecap="round" />
      <line x1="440" y1="65" x2="453" y2="60" stroke={primary} strokeWidth="1.5" strokeLinecap="round" />
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 440 + Math.sin(rad) * 21;
        const y1 = 65 - Math.cos(rad) * 21;
        const x2 = 440 + Math.sin(rad) * 23;
        const y2 = 65 - Math.cos(rad) * 23;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={primary} strokeWidth="1.5" />;
      })}
      <rect x="410" y="120" width="130" height="5" rx="1" fill={secondary} />
      <rect x="415" y="97" width="10" height="23" rx="1" fill={primary} />
      <rect x="427" y="101" width="8" height="19" rx="1" fill={accent} />
      <rect x="437" y="99" width="10" height="21" rx="1" fill={secondary} />
      <rect x="449" y="103" width="7" height="17" rx="1" fill={primary} opacity={0.5} />
      <rect x="458" y="100" width="9" height="20" rx="1" fill={accent} opacity={0.6} />
      <rect x="500" y="110" width="12" height="10" rx="2" fill={secondary} opacity={0.7} />
      <circle cx="506" cy="105" r="8" fill={accent} opacity={0.5} />
      <circle cx="502" cy="102" r="5" fill={primary} opacity={0.25} />
      <rect x="410" y="170" width="130" height="5" rx="1" fill={secondary} />
      <rect x="420" y="152" width="14" height="18" rx="2" fill={primary} opacity={0.15} />
      <rect x="438" y="148" width="12" height="22" rx="1" fill={accent} opacity={0.4} />
      <circle cx="470" cy="160" r="8" fill={secondary} opacity={0.4} />
      <rect x="490" y="155" width="20" height="15" rx="2" fill={primary} opacity={0.2} />
      <rect x="40" y="240" width="280" height="12" rx="2" fill={secondary} />
      <rect x="45" y="252" width="270" height="50" rx="2" fill={secondary} opacity={0.7} />
      <rect x="50" y="252" width="6" height="48" fill={secondary} opacity={0.9} />
      <rect x="308" y="252" width="6" height="48" fill={secondary} opacity={0.9} />
      <rect x="120" y="285" width="100" height="4" rx="1" fill={primary} opacity={0.1} />
      <rect x="100" y="180" width="120" height="58" rx="4" fill={primary} />
      <rect x="104" y="184" width="112" height="46" rx="2" fill={background} />
      <rect x="110" y="190" width="40" height="4" rx="1" fill={primary} opacity={0.3} />
      <rect x="110" y="198" width="60" height="3" rx="1" fill={muted} opacity={0.4} />
      <rect x="110" y="205" width="50" height="3" rx="1" fill={muted} opacity={0.3} />
      <rect x="110" y="215" width="30" height="8" rx="2" fill={accent} opacity={0.5} />
      <rect x="175" y="190" width="35" height="30" rx="2" fill={primary} opacity={0.1} />
      <rect x="148" y="238" width="24" height="4" rx="1" fill={primary} opacity={0.8} />
      <rect x="155" y="234" width="10" height="6" fill={primary} opacity={0.6} />
      <rect x="120" y="245" width="70" height="8" rx="2" fill={primary} opacity={0.2} />
      <ellipse cx="210" cy="248" rx="10" ry="6" fill={primary} opacity={0.2} />
      <rect x="245" y="232" width="14" height="12" rx="2" fill={accent} />
      <path d="M259 235 Q265 235 265 241 Q265 247 259 247" stroke={accent} strokeWidth="2" fill="none" />
      <path d="M249 230 Q251 225 249 220" stroke={accent} strokeWidth="1" opacity={0.3} fill="none" />
      <path d="M254 229 Q256 224 254 219" stroke={accent} strokeWidth="1" opacity={0.3} fill="none" />
      <rect x="60" y="242" width="40" height="6" rx="1" fill={accent} opacity={0.4} transform="rotate(-5 80 245)" />
      <rect x="75" y="240" width="2" height="14" rx="1" fill={primary} opacity={0.3} transform="rotate(15 76 247)" />
      <ellipse cx="180" cy="310" rx="35" ry="8" fill={primary} />
      <rect x="156" y="270" width="48" height="40" rx="8" fill={primary} />
      <rect x="160" y="274" width="40" height="32" rx="6" fill={primary} opacity={0.7} />
      <rect x="163" y="260" width="34" height="14" rx="6" fill={primary} />
      <rect x="177" y="316" width="6" height="20" fill={primary} opacity={0.5} />
      <ellipse cx="180" cy="340" rx="28" ry="5" fill={primary} opacity={0.3} />
      <circle cx="155" cy="342" r="4" fill={primary} opacity={0.4} />
      <circle cx="205" cy="342" r="4" fill={primary} opacity={0.4} />
      <circle cx="180" cy="345" r="4" fill={primary} opacity={0.4} />
      <ellipse cx={meetingTableCx} cy="280" rx="55" ry="14" fill={secondary} />
      <rect x={meetingTableCx - 4} y={floorY} width="8" height="45" fill={secondary} opacity={0.7} />
      <ellipse cx={meetingTableCx} cy="338" rx="20" ry="5" fill={secondary} opacity={0.4} />
      {meetingChairs.map((c, i) => (
        <g key={`meetingChair${i}`}>
          <rect x={c.seatX} y={c.seatY} width={c.seatW} height={c.seatH} rx="8" fill={primary} opacity={0.7} />
          <rect x={c.backX} y={c.backY} width={c.backW} height={c.backH} rx="4" fill={primary} opacity={0.5} />
          <rect x={c.leftLegX} y={c.legY} width={c.legW} height={c.legH} rx="1" fill={muted} opacity={chairLegOpacity} />
          <rect x={c.rightLegX} y={c.legY} width={c.legW} height={c.legH} rx="1" fill={muted} opacity={chairLegOpacity} />
        </g>
      ))}
      <rect x="440" y="272" width="18" height="12" rx="2" fill={background} stroke={muted} strokeWidth="1" strokeOpacity={frameStrokeOpacity} />
      <rect x="462" y="274" width="12" height="8" rx="1" fill={accent} opacity={0.6} />
      <circle cx="485" cy="278" r="4" fill={primary} opacity={0.3} />
      <path d="M20 360 L14 395 L46 395 L40 360 Z" fill={secondary} opacity={0.8} />
      <ellipse cx="30" cy="395" rx="20" ry="4" fill={secondary} opacity={0.5} />
      <ellipse cx="30" cy="340" rx="18" ry="22" fill={accent} opacity={0.5} />
      <ellipse cx="22" cy="335" rx="12" ry="18" fill={primary} opacity={0.2} />
      <ellipse cx="38" cy="332" rx="10" ry="16" fill={accent} opacity={0.35} />
      <line x1="30" y1="360" x2="30" y2="342" stroke={accent} strokeWidth="2" opacity={0.4} />
      <line x1="150" y1="0" x2="150" y2="25" stroke={primary} strokeWidth="1.5" opacity={0.3} />
      <path d="M135 25 Q135 40 150 40 Q165 40 165 25 Z" fill={accent} opacity={0.6} />
      <circle cx="150" cy="35" r="20" fill={accent} opacity={0.06} />
      <line x1="460" y1="0" x2="460" y2="30" stroke={primary} strokeWidth="1.5" opacity={0.3} />
      <path d="M445 30 Q445 45 460 45 Q475 45 475 30 Z" fill={accent} opacity={0.6} />
      <circle cx="460" cy="40" r="20" fill={accent} opacity={0.06} />
      <ellipse cx="460" cy="350" rx="70" ry="20" fill={accent} opacity={0.1} />
      <ellipse cx="460" cy="350" rx="60" ry="16" fill={accent} opacity={0.08} />
      <rect x="250" y="150" width="40" height="50" rx="2" fill={background} stroke={muted} strokeWidth="1.5" strokeOpacity={frameStrokeOpacity} />
      <rect x="255" y="155" width="30" height="24" rx="1" fill={primary} opacity={0.15} />
      <circle cx="270" cy="167" r="8" fill={accent} opacity={0.3} />
      <rect x="255" y="183" width="30" height="3" rx="1" fill={muted} opacity={0.3} />
      <rect x="260" y="189" width="20" height="2" rx="1" fill={muted} opacity={0.2} />
    </>
  );
  if (fillContainer) {
    return (
      <svg viewBox="0 0 572 400" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%', borderRadius: 12, overflow: 'hidden', display: 'block' }}>
        {svgContent}
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 572 400" width="572" height="400" style={{ borderRadius: 12, overflow: 'hidden' }}>
      {svgContent}
    </svg>
  );
}
