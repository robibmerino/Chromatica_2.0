import { useUniqueSvgIds } from '../useUniqueSvgIds';
import { CharacterFrame } from '../CharacterFrame';
import type { QuienCharacterProps } from '../types';
import { useCreatureAxisPalette, getCreatureMetadata } from '../../archetypeCardComponents/creatures';

/** Paleta base de Voltaje (Enérgica: dorado/ámbar; Serena: esmeralda/teal al rotar). */
const VOLTAJE_PALETTE = {
  pole1Light: '#fff9c4',
  pole1Mid: '#ffeb3b',
  pole1Dark: '#f57f17',
  pole1Outer: '#1a0a00',
  pole2Light: '#e8f5e9',
  pole2Mid: '#69f0ae',
  pole2Dark: '#00695c',
  pole2Outer: '#001a14',
  arcLight: '#ffffff',
  arcMid: '#fffde7',
  arcOuter: '#fff9c4',
  midLight: '#ffffff',
  midMid: '#b9f6ca',
  midOuter: '#001a14',
  filamentLight: '#fffde7',
  filamentCool: '#b9f6ca',
  sparkCyan: '#00e5ff',
} as const;

const CREATURE_ID = 5 as const;

export function Voltaje({
  className = '',
  hideLabel,
  axisColorParams,
}: QuienCharacterProps) {
  const svgId = useUniqueSvgIds('voltaje');
  const pole1 = svgId('pole1');
  const pole2 = svgId('pole2');
  const arc = svgId('arc');
  const mid = svgId('mid');

  const c = useCreatureAxisPalette(CREATURE_ID, VOLTAJE_PALETTE, axisColorParams);
  const meta = getCreatureMetadata(CREATURE_ID);

  return (
    <CharacterFrame
      title={meta?.name ?? 'Voltaje'}
      subtitle={meta?.subtitle ?? 'Energica'}
      variant={meta?.labelVariant ?? 'amber'}
      className={className}
      hideLabel={hideLabel}
    >
      <defs>
        <radialGradient id={pole1} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={c.pole1Light} stopOpacity="0.95" />
          <stop offset="35%" stopColor={c.pole1Mid} stopOpacity="0.7" />
          <stop offset="70%" stopColor={c.pole1Dark} stopOpacity="0.35" />
          <stop offset="100%" stopColor={c.pole1Outer} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={pole2} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={c.pole2Light} stopOpacity="0.95" />
          <stop offset="35%" stopColor={c.pole2Mid} stopOpacity="0.7" />
          <stop offset="70%" stopColor={c.pole2Dark} stopOpacity="0.35" />
          <stop offset="100%" stopColor={c.pole2Outer} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={arc} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={c.arcLight} stopOpacity="0.9" />
          <stop offset="40%" stopColor={c.arcMid} stopOpacity="0.6" />
          <stop offset="100%" stopColor={c.arcOuter} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={mid} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={c.midLight} stopOpacity="0.85" />
          <stop offset="50%" stopColor={c.midMid} stopOpacity="0.4" />
          <stop offset="100%" stopColor={c.midOuter} stopOpacity="0" />
        </radialGradient>
      </defs>

        {/* Polo superior — cálido dorado */}
        <ellipse cx="100" cy="88" rx="52" ry="52" fill={`url(#${pole1})`} />
        <ellipse cx="100" cy="88" rx="36" ry="36" fill={`url(#${pole1})`} />
        <ellipse cx="100" cy="88" rx="22" ry="22" fill={c.pole1Light} opacity="0.7" />
        <ellipse cx="100" cy="88" rx="12" ry="12" fill={c.arcMid} opacity="0.85" />

        {/* Polo inferior — frío esmeralda */}
        <ellipse cx="100" cy="232" rx="52" ry="52" fill={`url(#${pole2})`} />
        <ellipse cx="100" cy="232" rx="36" ry="36" fill={`url(#${pole2})`} />
        <ellipse cx="100" cy="232" rx="22" ry="22" fill={c.pole2Light} opacity="0.7" />
        <ellipse cx="100" cy="232" rx="12" ry="12" fill={c.pole2Light} opacity="0.85" />

        {/* Arcos voltaicos entre polos */}
        <path d="M100 100 Q60 130 65 160 Q70 190 100 220" fill="none" stroke={c.filamentLight} strokeWidth="2.5" opacity="0.7" />
        <path d="M100 100 Q140 130 135 160 Q130 190 100 220" fill="none" stroke={c.filamentCool} strokeWidth="2.5" opacity="0.7" />
        <path d="M100 100 Q45 140 48 160 Q52 185 100 220" fill="none" stroke={c.pole1Light} strokeWidth="1.5" opacity="0.5" />
        <path d="M100 100 Q155 140 152 160 Q148 185 100 220" fill="none" stroke={c.pole2Mid} strokeWidth="1.5" opacity="0.5" />
        <path d="M100 100 Q30 150 35 160 Q40 175 100 220" fill="none" stroke={c.pole1Mid} strokeWidth="1" opacity="0.35" />
        <path d="M100 100 Q170 150 165 160 Q160 175 100 220" fill="none" stroke={c.sparkCyan} strokeWidth="1" opacity="0.35" />

        {/* Filamentos más delgados */}
        <path d="M100 102 Q72 118 68 140 Q64 165 85 185 Q92 200 100 218" fill="none" stroke={c.arcLight} strokeWidth="0.8" opacity="0.5" />
        <path d="M100 102 Q128 118 132 140 Q136 165 115 185 Q108 200 100 218" fill="none" stroke={c.arcLight} strokeWidth="0.8" opacity="0.5" />
        <path d="M100 105 Q85 125 80 150 Q76 175 90 200 Q95 210 100 220" fill="none" stroke={c.filamentLight} strokeWidth="0.6" opacity="0.4" />
        <path d="M100 105 Q115 125 120 150 Q124 175 110 200 Q105 210 100 220" fill="none" stroke={c.filamentCool} strokeWidth="0.6" opacity="0.4" />

        {/* Zona de colisión central */}
        <ellipse cx="100" cy="160" rx="30" ry="18" fill={`url(#${mid})`} />
        <ellipse cx="100" cy="160" rx="18" ry="10" fill={c.arcLight} opacity="0.5" />
        <ellipse cx="100" cy="160" rx="8" ry="5" fill={c.arcLight} opacity="0.7" />

        {/* Chispas laterales */}
        <ellipse cx="42" cy="140" rx="8" ry="12" fill={`url(#${pole1})`} transform="rotate(-20, 42, 140)" />
        <ellipse cx="158" cy="140" rx="8" ry="12" fill={`url(#${pole2})`} transform="rotate(20, 158, 140)" />
        <ellipse cx="38" cy="175" rx="6" ry="10" fill={`url(#${pole2})`} transform="rotate(15, 38, 175)" />
        <ellipse cx="162" cy="175" rx="6" ry="10" fill={`url(#${pole1})`} transform="rotate(-15, 162, 175)" />
        <ellipse cx="50" cy="160" rx="5" ry="8" fill={c.filamentLight} opacity="0.4" />
        <ellipse cx="150" cy="160" rx="5" ry="8" fill={c.filamentCool} opacity="0.4" />
    </CharacterFrame>
  );
}
