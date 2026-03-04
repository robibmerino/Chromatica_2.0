import { useUniqueSvgIds } from '../useUniqueSvgIds';
import { CharacterFrame } from '../CharacterFrame';
import { getCharacterTransform } from '../characterTransform';
import type { QuienCharacterProps } from '../types';
import { useCreatureAxisPalette } from '../../archetypeCardComponents/creatures';
import { getCreatureMetadata } from '../../archetypeCardComponents/creatures';

/** Paleta base de Humo (Mística: tonos púrpura/cyan; Material: tonos tierra/dorado al rotar). */
const VOREAL_PALETTE = {
  coreLight: '#e8e0f5',
  coreMid: '#9c6ade',
  coreDark: '#6b21a8',
  coreOuter: '#2e1065',
  layer2Light: '#f3e8ff',
  layer2Mid: '#9822c3',
  layer2Dark: '#581c87',
  layer3Light: '#fef3c7',
  layer3Mid: '#c9a227',
  layer3Dark: '#78350f',
  fold1Light: '#c4b5fd',
  fold1Dark: '#5b21b6',
  fold2Light: '#fbcfe8',
  fold2Dark: '#9d174d',
  strokeCore: '#a78bfa',
  strokeFold: '#c4b5fd',
  strokePurple: '#9822c3',
  orbCore: '#a78bfa',
  orbPurple: '#9822c3',
  orbAmber: '#c9a227',
  orbPink: '#fbcfe8',
  centerGlow: '#e8e0f5',
} as const;

const CREATURE_ID = 1 as const;

export function Threnn({
  className = '',
  hideLabel,
  axisColorParams,
}: QuienCharacterProps) {
  const svgId = useUniqueSvgIds('threnn');
  const core = svgId('core');
  const layer2 = svgId('layer2');
  const layer3 = svgId('layer3');
  const fold1 = svgId('fold1');
  const fold2 = svgId('fold2');

  const c = useCreatureAxisPalette(CREATURE_ID, VOREAL_PALETTE, axisColorParams);
  const meta = getCreatureMetadata(CREATURE_ID);

  return (
    <CharacterFrame
      title={meta?.name ?? 'Humo'}
      subtitle={meta?.subtitle ?? 'Mística'}
      variant={meta?.labelVariant ?? 'cyan'}
      className={className}
      hideLabel={hideLabel}
    >
      <defs>
        <radialGradient id={core} cx="45%" cy="48%" r="55%">
          <stop offset="0%" stopColor={c.coreLight} stopOpacity="1" />
          <stop offset="30%" stopColor={c.coreMid} stopOpacity="0.9" />
          <stop offset="70%" stopColor={c.coreDark} stopOpacity="0.6" />
          <stop offset="100%" stopColor={c.coreOuter} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={layer2} cx="55%" cy="42%" r="60%">
          <stop offset="0%" stopColor={c.layer2Light} stopOpacity="0.8" />
          <stop offset="40%" stopColor={c.layer2Mid} stopOpacity="0.5" />
          <stop offset="100%" stopColor={c.layer2Dark} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={layer3} cx="38%" cy="55%" r="50%">
          <stop offset="0%" stopColor={c.layer3Light} stopOpacity="0.7" />
          <stop offset="40%" stopColor={c.layer3Mid} stopOpacity="0.4" />
          <stop offset="100%" stopColor={c.layer3Dark} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={fold1} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={c.fold1Light} stopOpacity="0.6" />
          <stop offset="100%" stopColor={c.fold1Dark} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={fold2} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={c.fold2Light} stopOpacity="0.5" />
          <stop offset="100%" stopColor={c.fold2Dark} stopOpacity="0" />
        </radialGradient>
      </defs>
      <g transform={getCharacterTransform({ scale: 0.82, translateY: 24, centerX: 100, centerY: 170 }) ?? undefined}>
      {/* Capa base — velo más amplio y bajo */}
      <ellipse cx="108" cy="185" rx="82" ry="58" fill={`url(#${layer2})`} transform="rotate(-12, 108, 185)" />
      <ellipse cx="92" cy="195" rx="70" ry="45" fill={`url(#${layer3})`} transform="rotate(18, 92, 195)" />

      {/* Pliegues inferiores */}
      <path d="M40 210 Q60 190 85 205 Q110 220 130 198 Q155 176 175 195 Q160 215 140 222 Q115 230 90 218 Q65 228 40 210Z" fill={`url(#${fold1})`} />
      <path d="M55 225 Q80 208 105 220 Q130 232 155 215 Q145 235 120 240 Q95 245 70 235 Q55 232 55 225Z" fill={`url(#${fold2})`} />
      <path d="M68 238 Q90 228 115 236 Q138 244 152 232 Q142 248 118 252 Q94 256 72 248 Q62 244 68 238Z" fill={`url(#${fold1})`} opacity="0.6" />

      {/* Cuerpo central */}
      <ellipse cx="100" cy="170" rx="58" ry="72" fill={`url(#${core})`} />

      {/* Pliegues superiores */}
      <path d="M52 140 Q42 110 55 85 Q65 62 88 58 Q72 80 70 105 Q68 128 75 148Z" fill={`url(#${fold1})`} />
      <path d="M148 135 Q162 105 150 78 Q140 55 118 50 Q136 72 138 98 Q140 122 132 144Z" fill={`url(#${fold2})`} />

      {/* Velo lateral izquierdo */}
      <path d="M48 155 Q22 140 14 118 Q8 98 18 80 Q28 60 22 45 Q32 58 30 78 Q28 98 38 112 Q50 128 54 148Z" fill={`url(#${layer2})`} />
      <path d="M18 80 Q10 65 16 50 Q22 36 14 24 Q24 34 22 50 Q20 64 26 76Z" fill={`url(#${fold1})`} opacity="0.7" />

      {/* Velo lateral derecho */}
      <path d="M152 148 Q178 128 184 105 Q190 82 178 65 Q166 48 172 32 Q164 45 166 64 Q168 82 160 98 Q150 118 148 140Z" fill={`url(#${layer3})`} />
      <path d="M178 65 Q186 48 180 34 Q174 20 182 8 Q172 20 174 36 Q176 52 170 64Z" fill={`url(#${fold2})`} opacity="0.6" />

      {/* Extensión superior */}
      <path d="M88 58 Q82 38 88 20 Q94 6 100 2 Q106 6 112 20 Q118 38 112 58 Q106 42 100 38 Q94 42 88 58Z" fill={`url(#${core})`} />
      <path d="M92 40 Q96 28 100 22 Q104 28 108 40 Q104 34 100 32 Q96 34 92 40Z" fill={c.centerGlow} opacity="0.8" />

      {/* Núcleo interior brillante */}
      <ellipse cx="100" cy="158" rx="28" ry="34" fill={`url(#${core})`} opacity="0.9" />
      <ellipse cx="98" cy="152" rx="14" ry="18" fill={c.centerGlow} opacity="0.7" />
      <ellipse cx="97" cy="148" rx="6" ry="8" fill="white" opacity="0.9" />

      {/* Detalles de textura */}
      <path d="M88 120 Q94 138 90 158 Q96 142 100 158 Q104 142 110 158 Q106 138 112 120" fill="none" stroke={c.strokeCore} strokeWidth="0.8" opacity="0.4" />
      <path d="M80 145 Q90 155 100 150 Q110 155 120 145" fill="none" stroke={c.strokeFold} strokeWidth="0.8" opacity="0.5" />
      <path d="M78 165 Q89 172 100 168 Q111 172 122 165" fill="none" stroke={c.strokePurple} strokeWidth="0.6" opacity="0.3" />

      {/* Orbes flotantes */}
      <circle cx="32" cy="105" r="5" fill={c.orbCore} opacity="0.6" />
      <circle cx="32" cy="105" r="2.5" fill="white" opacity="0.8" />
      <circle cx="22" cy="78" r="3.5" fill={c.orbPurple} opacity="0.5" />
      <circle cx="14" cy="52" r="2.5" fill={c.orbCore} opacity="0.6" />
      <circle cx="172" cy="98" r="4" fill={c.orbAmber} opacity="0.5" />
      <circle cx="180" cy="68" r="3" fill={c.orbPink} opacity="0.6" />
      <circle cx="174" cy="40" r="2" fill={c.orbAmber} opacity="0.5" />
      <circle cx="100" cy="4" r="3" fill="white" opacity="0.7" />
      <circle cx="88" cy="14" r="2" fill={c.strokeFold} opacity="0.6" />
      <circle cx="112" cy="14" r="2" fill={c.strokeFold} opacity="0.6" />
      </g>
    </CharacterFrame>
  );
}
