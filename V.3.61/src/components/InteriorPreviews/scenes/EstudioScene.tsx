import type { RoomSceneProps } from '../types';

export function RoomSceneEstudio({ primary, secondary, accent, surface, muted, background, fillContainer }: RoomSceneProps) {
  const svgContent = (
    <>
      <rect x="0" y="0" width="556" height="260" fill={surface} />
      <rect x="0" y="252" width="556" height="8" fill={muted} opacity="0.5" />
      <rect x="0" y="260" width="556" height="120" fill={muted} opacity="0.3" />
      {Array.from({ length: 20 }).map((_, i) =>
        Array.from({ length: 5 }).map((_, j) => (
          <rect key={`f${i}-${j}`} x={i * 30} y={260 + j * 24} width="28" height="11" fill={j % 2 === 0 ? muted : surface} opacity={j % 2 === 0 ? 0.15 : 0.2} />
        ))
      )}
      <ellipse cx="278" cy="340" rx="200" ry="18" fill={primary} opacity="0.06" />
      <rect x="40" y="40" width="90" height="120" rx="4" fill={background} stroke={muted} strokeWidth="2" opacity="0.8" />
      <circle cx="85" cy="85" r="28" fill={accent} opacity="0.7" />
      <rect x="55" y="95" width="40" height="40" rx="2" fill={primary} opacity="0.5" />
      <line x1="60" y1="70" x2="110" y2="130" stroke={secondary} strokeWidth="3" opacity="0.6" />
      <circle cx="100" cy="110" r="15" fill={secondary} opacity="0.4" />
      <rect x="430" y="50" width="80" height="80" rx="4" fill={background} stroke={muted} strokeWidth="2" opacity="0.8" />
      <circle cx="470" cy="90" r="25" fill={primary} opacity="0.5" />
      <rect x="455" y="75" width="30" height="30" fill={accent} opacity="0.4" transform="rotate(15, 470, 90)" />
      <line x1="340" y1="0" x2="340" y2="50" stroke={muted} strokeWidth="1.5" />
      <path d="M 320 50 Q 330 45 340 50 Q 350 45 360 50 L 355 75 Q 340 80 325 75 Z" fill={accent} opacity="0.85" />
      <ellipse cx="340" cy="100" rx="50" ry="30" fill={accent} opacity="0.06" />
      <ellipse cx="340" cy="90" rx="30" ry="18" fill={accent} opacity="0.08" />
      <rect x="180" y="60" width="130" height="6" rx="2" fill={secondary} opacity="0.7" />
      <rect x="185" y="28" width="12" height="32" rx="1" fill={primary} opacity="0.8" />
      <rect x="199" y="34" width="10" height="26" rx="1" fill={accent} opacity="0.7" />
      <rect x="211" y="30" width="14" height="30" rx="1" fill={secondary} opacity="0.6" />
      <rect x="227" y="36" width="9" height="24" rx="1" fill={muted} opacity="0.5" />
      <rect x="238" y="32" width="11" height="28" rx="1" fill={primary} opacity="0.5" />
      <rect x="270" y="48" width="10" height="12" rx="2" fill={muted} opacity="0.6" />
      <circle cx="275" cy="44" r="10" fill={accent} opacity="0.5" />
      <circle cx="280" cy="40" r="7" fill={secondary} opacity="0.4" />
      <rect x="58" y="180" width="4" height="80" rx="2" fill={muted} opacity="0.6" />
      <rect x="48" y="254" width="24" height="6" rx="3" fill={muted} opacity="0.5" />
      <ellipse cx="60" cy="175" rx="18" ry="22" fill={surface} stroke={secondary} strokeWidth="1.5" opacity="0.8" />
      <ellipse cx="60" cy="200" rx="30" ry="20" fill={accent} opacity="0.04" />
      <rect x="140" y="215" width="260" height="50" rx="10" fill={primary} />
      <rect x="145" y="185" width="250" height="38" rx="10" fill={primary} opacity="0.85" />
      <rect x="155" y="220" width="230" height="15" rx="6" fill={background} opacity="0.15" />
      <rect x="138" y="195" width="22" height="70" rx="10" fill={primary} opacity="0.9" />
      <rect x="380" y="195" width="22" height="70" rx="10" fill={primary} opacity="0.9" />
      <rect x="160" y="265" width="6" height="12" rx="2" fill={secondary} opacity="0.7" />
      <rect x="374" y="265" width="6" height="12" rx="2" fill={secondary} opacity="0.7" />
      <rect x="170" y="195" width="60" height="28" rx="8" fill={accent} opacity="0.75" />
      <rect x="310" y="195" width="55" height="28" rx="8" fill={secondary} opacity="0.6" />
      <rect x="245" y="198" width="50" height="24" rx="7" fill={accent} opacity="0.4" />
      <rect x="210" y="295" width="140" height="8" rx="4" fill={secondary} opacity="0.8" />
      <rect x="225" y="303" width="4" height="18" rx="1" fill={secondary} opacity="0.6" />
      <rect x="331" y="303" width="4" height="18" rx="1" fill={secondary} opacity="0.6" />
      <rect x="230" y="284" width="35" height="11" rx="2" fill={muted} opacity="0.5" />
      <circle cx="300" cy="289" r="8" fill={accent} opacity="0.5" />
      <rect x="295" y="281" width="10" height="3" rx="1" fill={accent} opacity="0.3" />
      <rect x="440" y="245" width="50" height="6" rx="3" fill={secondary} opacity="0.7" />
      <rect x="462" y="251" width="6" height="25" rx="2" fill={secondary} opacity="0.5" />
      <rect x="452" y="228" width="14" height="17" rx="4" fill={muted} opacity="0.6" />
      <circle cx="459" cy="220" r="14" fill={accent} opacity="0.5" />
      <circle cx="465" cy="215" r="10" fill={secondary} opacity="0.35" />
      <circle cx="453" cy="218" r="8" fill={accent} opacity="0.3" />
      <rect x="160" y="318" width="230" height="45" rx="6" fill={primary} opacity="0.12" />
      <rect x="170" y="323" width="210" height="35" rx="4" fill="none" stroke={primary} strokeWidth="1" opacity="0.15" />
      {Array.from({ length: 7 }).map((_, i) => (
        <circle key={`rug${i}`} cx={195 + i * 28} cy={340} r="3" fill={accent} opacity="0.15" />
      ))}
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
