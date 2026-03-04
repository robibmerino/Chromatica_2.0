import type { RoomSceneProps } from '../types';

/** Constantes de layout de la escena Cafetería (viewBox 556×380, suelo en y=260) */
const CAFE = {
  floorY: 260,
  chairLegOpacity: 0.14,
  stoolCenters: [402, 452, 502] as const,
  stoolSeatW: 38,
  stoolSeatH: 11,
  stoolSeatY: 245,
  stoolLegW: 6,
  stoolLegH: 67,
  stoolLegY: 256,
  stoolBaseY: 316,
  stoolBaseH: 7,
  stoolFootY: 309,
  stoolFootH: 5,
  tableCx: 200,
  chairs: [
    { seatX: 121, backX: 124, seatY: 275, backY: 244, seatW: 48, seatH: 11, backW: 41, backH: 32, legY: 286, legH: 32, legW: 5, leftLegX: 134, rightLegX: 151 },
    { seatX: 231, backX: 234, seatY: 275, backY: 244, seatW: 48, seatH: 11, backW: 41, backH: 32, legY: 286, legH: 32, legW: 5, leftLegX: 244, rightLegX: 261 },
  ] as const,
};

export function RoomSceneCafeteria({ primary, secondary, accent, surface, muted, background, fillContainer }: RoomSceneProps) {
  const { floorY, chairLegOpacity, stoolCenters, stoolSeatW, stoolSeatH, stoolSeatY, stoolLegW, stoolLegH, stoolLegY, stoolBaseY, stoolBaseH, stoolFootY, stoolFootH, tableCx, chairs } = CAFE;
  const halfSeatW = stoolSeatW / 2;
  const halfLegW = stoolLegW / 2;
  const stoolBaseHalfW = 14.5;
  const stoolFootW = 23;

  const svgContent = (
    <>
      <rect x="0" y="0" width="556" height={floorY} fill={surface} />
      <rect x="0" y="155" width="556" height="105" fill={muted} opacity="0.2" />
      {Array.from({ length: 12 }).map((_, i) => (
        <line key={`wl${i}`} x1={i * 48 + 24} y1="155" x2={i * 48 + 24} y2={floorY} stroke={muted} strokeWidth="1" opacity="0.15" />
      ))}
      <rect x="0" y="152" width="556" height="4" fill={secondary} opacity="0.25" />
      <rect x="0" y={floorY} width="556" height="120" fill={muted} opacity="0.2" />
      {Array.from({ length: 14 }).map((_, i) =>
        Array.from({ length: 4 }).map((_, j) => (
          <rect key={`ft${i}-${j}`} x={i * 42} y={floorY + j * 30} width="40" height="28" fill={(i + j) % 2 === 0 ? muted : surface} opacity={(i + j) % 2 === 0 ? 0.12 : 0.15} rx="1" />
        ))
      )}
      <rect x="20" y="20" width="120" height="130" rx="4" fill={background} opacity="0.6" />
      <line x1="80" y1="20" x2="80" y2="150" stroke={muted} strokeWidth="2" opacity="0.3" />
      <line x1="20" y1="85" x2="140" y2="85" stroke={muted} strokeWidth="2" opacity="0.3" />
      <rect x="20" y="20" width="120" height="130" rx="4" fill="none" stroke={secondary} strokeWidth="2.5" opacity="0.4" />
      <polygon points="140,150 200,260 20,260 20,150" fill={accent} opacity="0.03" />
      <rect x="200" y="18" width="155" height="100" rx="5" fill={primary} opacity="0.9" />
      <rect x="206" y="24" width="143" height="88" rx="3" fill="none" stroke={background} strokeWidth="1" opacity="0.2" />
      <rect x="220" y="36" width="60" height="5" rx="2" fill={accent} opacity="0.8" />
      <rect x="220" y="50" width="110" height="3" rx="1" fill={background} opacity="0.3" />
      <rect x="220" y="58" width="95" height="3" rx="1" fill={background} opacity="0.25" />
      <rect x="220" y="66" width="105" height="3" rx="1" fill={background} opacity="0.3" />
      <rect x="220" y="74" width="85" height="3" rx="1" fill={background} opacity="0.2" />
      <rect x="220" y="86" width="50" height="5" rx="2" fill={accent} opacity="0.6" />
      <rect x="220" y="96" width="100" height="3" rx="1" fill={background} opacity="0.25" />
      <polygon points="340,22 355,30 340,38" fill={accent} opacity="0.7" />
      <rect x="380" y="50" width="155" height="6" rx="2" fill={secondary} opacity="0.7" />
      <rect x="380" y="100" width="155" height="6" rx="2" fill={secondary} opacity="0.7" />
      <rect x="390" y="20" width="12" height="30" rx="3" fill={primary} opacity="0.6" />
      <rect x="406" y="15" width="10" height="35" rx="3" fill={accent} opacity="0.5" />
      <rect x="420" y="22" width="11" height="28" rx="3" fill={secondary} opacity="0.5" />
      <rect x="435" y="18" width="9" height="32" rx="3" fill={muted} opacity="0.4" />
      <rect x="460" y="38" width="10" height="12" rx="2" fill={background} opacity="0.7" />
      <rect x="474" y="38" width="10" height="12" rx="2" fill={background} opacity="0.7" />
      <rect x="488" y="38" width="10" height="12" rx="2" fill={background} opacity="0.7" />
      <rect x="388" y="72" width="14" height="28" rx="3" fill={accent} opacity="0.4" />
      <rect x="406" y="75" width="12" height="25" rx="3" fill={primary} opacity="0.5" />
      <rect x="422" y="70" width="10" height="30" rx="3" fill={secondary} opacity="0.4" />
      <rect x="470" y="85" width="12" height="15" rx="3" fill={muted} opacity="0.5" />
      <circle cx="476" cy="80" r="10" fill={accent} opacity="0.5" />
      <circle cx="480" cy="76" r="7" fill={secondary} opacity="0.35" />
      <rect x="360" y="155" width="196" height="10" rx="3" fill={secondary} opacity="0.85" />
      <rect x="365" y="165" width="186" height="95" rx="0" fill={secondary} opacity="0.35" />
      <rect x="370" y="175" width="50" height="75" rx="3" fill={secondary} opacity="0.15" />
      <rect x="425" y="175" width="50" height="75" rx="3" fill={secondary} opacity="0.15" />
      <rect x="480" y="175" width="50" height="75" rx="3" fill={secondary} opacity="0.15" />
      <rect x="410" y="115" width="55" height="40" rx="4" fill={primary} opacity="0.8" />
      <rect x="415" y="120" width="20" height="20" rx="2" fill={muted} opacity="0.3" />
      <rect x="440" y="122" width="18" height="12" rx="2" fill={accent} opacity="0.5" />
      <rect x="418" y="142" width="6" height="13" rx="1" fill={muted} opacity="0.4" />
      <rect x="428" y="142" width="6" height="13" rx="1" fill={muted} opacity="0.4" />
      <path d="M 421 115 Q 424 108 421 102" stroke={muted} strokeWidth="1" fill="none" opacity="0.2" />
      <path d="M 431 115 Q 434 106 431 100" stroke={muted} strokeWidth="1" fill="none" opacity="0.15" />
      <rect x="480" y="130" width="18" height="25" rx="4" fill={background} opacity="0.5" />
      <rect x="480" y="130" width="18" height="25" rx="4" fill="none" stroke={muted} strokeWidth="1" opacity="0.3" />
      <ellipse cx="489" cy="143" rx="6" ry="5" fill={accent} opacity="0.3" />
      <rect x="505" y="133" width="16" height="22" rx="4" fill={background} opacity="0.5" />
      <rect x="505" y="133" width="16" height="22" rx="4" fill="none" stroke={muted} strokeWidth="1" opacity="0.3" />
      <ellipse cx="513" cy="145" rx="5" ry="4" fill={secondary} opacity="0.3" />
      <rect x="375" y="125" width="28" height="30" rx="3" fill={primary} opacity="0.6" />
      <rect x="379" y="129" width="20" height="12" rx="2" fill={accent} opacity="0.3" />
      <rect x="379" y="145" width="20" height="6" rx="1" fill={muted} opacity="0.3" />
      {stoolCenters.map((cx, i) => (
        <g key={`stool${i}`}>
          <rect x={cx - halfSeatW} y={stoolSeatY} width={stoolSeatW} height={stoolSeatH} rx="10" fill={primary} opacity="0.85" />
          <rect x={cx - halfLegW} y={stoolLegY} width={stoolLegW} height={stoolLegH} rx="1" fill={muted} opacity="0.5" />
          <rect x={cx - stoolBaseHalfW} y={stoolBaseY} width={29} height={stoolBaseH} rx="1.5" fill={muted} opacity="0.4" />
          <rect x={cx - stoolFootW / 2} y={stoolFootY} width={stoolFootW} height={stoolFootH} rx="1" fill={muted} opacity="0.25" />
        </g>
      ))}
      <ellipse cx={tableCx} cy="305" rx="86" ry="23" fill={secondary} opacity="0.7" />
      <rect x={tableCx - 5} y="286" width="10" height="67" rx="2" fill={secondary} opacity="0.5" />
      <ellipse cx={tableCx} cy="349" rx="29" ry="9" fill={secondary} opacity="0.3" />
      <circle cx="185" cy="308" r="13" fill={background} opacity="0.6" />
      <circle cx="185" cy="308" r="8" fill={accent} opacity="0.3" />
      <rect x="198" y="300" width="35" height="18" rx="2" fill={muted} opacity="0.4" />
      {chairs.map((c, i) => (
        <g key={`chair${i}`}>
          <rect x={c.seatX} y={c.seatY} width={c.seatW} height={c.seatH} rx="8" fill={primary} opacity="0.7" />
          <rect x={c.backX} y={c.backY} width={c.backW} height={c.backH} rx="4" fill={primary} opacity="0.5" />
          <rect x={c.leftLegX} y={c.legY} width={c.legW} height={c.legH} rx="1" fill={muted} opacity={chairLegOpacity} />
          <rect x={c.rightLegX} y={c.legY} width={c.legW} height={c.legH} rx="1" fill={muted} opacity={chairLegOpacity} />
        </g>
      ))}
      {[180, 320].map((x, i) => (
        <g key={`lamp${i}`}>
          <line x1={x} y1="0" x2={x} y2="35" stroke={muted} strokeWidth="1.2" />
          <path d={`M ${x - 16} 35 Q ${x - 8} 32 ${x} 35 Q ${x + 8} 32 ${x + 16} 35 L ${x + 14} 55 Q ${x} 60 ${x - 14} 55 Z`} fill={accent} opacity="0.75" />
          <ellipse cx={x} cy="75" rx="30" ry="18" fill={accent} opacity="0.05" />
          <ellipse cx={x} cy="68" rx="18" ry="10" fill={accent} opacity="0.07" />
        </g>
      ))}
      <rect x="32" y="215" width="16" height="55" rx="5" fill={muted} opacity="0.5" />
      <circle cx="40" cy="207" r="18" fill={accent} opacity="0.45" />
      <circle cx="48" cy="200" r="14" fill={secondary} opacity="0.35" />
      <circle cx="34" cy="203" r="10" fill={accent} opacity="0.3" />
      <circle cx="44" cy="193" r="8" fill={accent} opacity="0.25" />
    </>
  );
  if (fillContainer) {
    return (
      <svg viewBox="0 0 556 380" preserveAspectRatio="xMidYMid meet" style={{ width: '100%', height: '100%', borderRadius: 12, overflow: 'hidden', display: 'block' }}>
        {svgContent}
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 556 380" width="556" height="380" style={{ borderRadius: 12, overflow: 'hidden' }}>
      {svgContent}
    </svg>
  );
}
