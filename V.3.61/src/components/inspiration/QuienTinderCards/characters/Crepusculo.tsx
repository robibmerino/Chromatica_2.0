import { useUniqueSvgIds } from '../useUniqueSvgIds';
import { getCharacterTransform } from '../characterTransform';
import { CharacterFrame } from '../CharacterFrame';
import type { QuienCharacterProps } from '../types';
import { useCreatureAxisPalette, getCreatureMetadata } from '../../archetypeCardComponents/creatures';

/** Paleta base de Crepusculo (Nocturno: azules crepusculares; Diurno: tonos cálidos al rotar). */
const CREPUSCULO_PALETTE = {
  coreWhite: '#ffffff',
  coreLight: '#bae6fd',
  coreMid: '#0369a1',
  coreOuter: '#0c1a2e',
  midLight: '#e0f2fe',
  midMid: '#38bdf8',
  midDark: '#075985',
  midOuter: '#0c1a2e',
  outerLight: '#f0f9ff',
  outerMid: '#7dd3fc',
  outerDark: '#0c4a6e',
  arcLight: '#bae6fd',
  arcMid: '#0284c7',
  arcOuter: '#0c1a2e',
  orbLight: '#f0f9ff',
  orbMid: '#7dd3fc',
  orbOuter: '#0369a1',
} as const;

const CREATURE_ID = 4 as const;

export function Crepusculo({
  className = '',
  hideLabel,
  axisColorParams,
}: QuienCharacterProps) {
  const svgId = useUniqueSvgIds('crepusculo');
  const core = svgId('core');
  const mid = svgId('mid');
  const outer = svgId('outer');
  const arc = svgId('arc');
  const orb = svgId('orb');

  const c = useCreatureAxisPalette(CREATURE_ID, CREPUSCULO_PALETTE, axisColorParams);
  const meta = getCreatureMetadata(CREATURE_ID);

  return (
    <CharacterFrame
      title={meta?.name ?? 'Crepusculo'}
      subtitle={meta?.subtitle ?? 'Nocturna'}
      variant={meta?.labelVariant ?? 'sky'}
      className={className}
      hideLabel={hideLabel}
    >
      <defs>
        <radialGradient id={core} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={c.coreWhite} stopOpacity="0.95" />
          <stop offset="28%" stopColor={c.coreLight} stopOpacity="0.88" />
          <stop offset="60%" stopColor={c.coreMid} stopOpacity="0.45" />
          <stop offset="100%" stopColor={c.coreOuter} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={mid} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={c.midLight} stopOpacity="0" />
          <stop offset="38%" stopColor={c.midMid} stopOpacity="0.42" />
          <stop offset="65%" stopColor={c.midDark} stopOpacity="0.25" />
          <stop offset="100%" stopColor={c.midOuter} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={outer} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={c.outerLight} stopOpacity="0" />
          <stop offset="40%" stopColor={c.outerMid} stopOpacity="0.18" />
          <stop offset="70%" stopColor={c.outerDark} stopOpacity="0.1" />
          <stop offset="100%" stopColor={c.coreOuter} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={arc} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={c.arcLight} stopOpacity="0.55" />
          <stop offset="55%" stopColor={c.arcMid} stopOpacity="0.22" />
          <stop offset="100%" stopColor={c.arcOuter} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={orb} cx="30%" cy="30%" r="65%">
          <stop offset="0%" stopColor={c.orbLight} stopOpacity="0.98" />
          <stop offset="50%" stopColor={c.orbMid} stopOpacity="0.8" />
          <stop offset="100%" stopColor={c.orbOuter} stopOpacity="0" />
        </radialGradient>
      </defs>

      <g transform={getCharacterTransform({ translateY: 4 }) ?? undefined}>
        {/* Halo exterior */}
        <ellipse cx="100" cy="158" rx="85" ry="90" fill={`url(#${outer})`} />

        {/* Arcos concéntricos — efecto de onda */}
        <ellipse cx="100" cy="158" rx="78" ry="20" fill={`url(#${arc})`} opacity="0.5" />
        <ellipse cx="100" cy="158" rx="72" ry="16" fill={`url(#${arc})`} opacity="0.45" transform="rotate(30,100,158)" />
        <ellipse cx="100" cy="158" rx="72" ry="16" fill={`url(#${arc})`} opacity="0.45" transform="rotate(-30,100,158)" />
        <ellipse cx="100" cy="158" rx="68" ry="13" fill={`url(#${arc})`} opacity="0.4" transform="rotate(60,100,158)" />
        <ellipse cx="100" cy="158" rx="68" ry="13" fill={`url(#${arc})`} opacity="0.4" transform="rotate(-60,100,158)" />
        <ellipse cx="100" cy="158" rx="64" ry="11" fill={`url(#${arc})`} opacity="0.35" transform="rotate(90,100,158)" />
        <ellipse cx="100" cy="158" rx="60" ry="10" fill={`url(#${arc})`} opacity="0.3" transform="rotate(45,100,158)" />
        <ellipse cx="100" cy="158" rx="60" ry="10" fill={`url(#${arc})`} opacity="0.3" transform="rotate(-45,100,158)" />

        {/* Forma vertical */}
        <ellipse cx="100" cy="130" rx="30" ry="62" fill={`url(#${mid})`} opacity="0.6" />
        <ellipse cx="100" cy="186" rx="28" ry="55" fill={`url(#${mid})`} opacity="0.5" />

        {/* Capas centrales */}
        <ellipse cx="100" cy="158" rx="50" ry="55" fill={`url(#${mid})`} />
        <ellipse cx="100" cy="158" rx="36" ry="40" fill={`url(#${mid})`} opacity="0.8" />

        {/* Núcleo */}
        <ellipse cx="100" cy="158" rx="20" ry="24" fill={`url(#${core})`} />

        {/* Orbes — formando arco superior */}
        <ellipse cx="100" cy="62" rx="12" ry="12" fill={`url(#${orb})`} />
        <ellipse cx="100" cy="62" rx="6" ry="6" fill={c.coreWhite} opacity="0.9" />
        <ellipse cx="58" cy="82" rx="9" ry="9" fill={`url(#${orb})`} opacity="0.85" />
        <ellipse cx="58" cy="82" rx="5" ry="5" fill={c.coreWhite} opacity="0.85" />
        <ellipse cx="142" cy="82" rx="9" ry="9" fill={`url(#${orb})`} opacity="0.85" />
        <ellipse cx="142" cy="82" rx="5" ry="5" fill={c.coreWhite} opacity="0.85" />
        <ellipse cx="32" cy="122" rx="8" ry="8" fill={`url(#${orb})`} opacity="0.75" />
        <ellipse cx="168" cy="122" rx="8" ry="8" fill={`url(#${orb})`} opacity="0.75" />
        <ellipse cx="28" cy="170" rx="7" ry="7" fill={`url(#${orb})`} opacity="0.65" />
        <ellipse cx="172" cy="170" rx="7" ry="7" fill={`url(#${orb})`} opacity="0.65" />
        <ellipse cx="50" cy="215" rx="8" ry="8" fill={`url(#${orb})`} opacity="0.7" />
        <ellipse cx="150" cy="215" rx="8" ry="8" fill={`url(#${orb})`} opacity="0.7" />
        <ellipse cx="100" cy="252" rx="10" ry="10" fill={`url(#${orb})`} opacity="0.75" />
        <ellipse cx="100" cy="252" rx="5" ry="5" fill={c.coreWhite} opacity="0.8" />

        {/* Destellos */}
        <ellipse cx="97" cy="150" rx="3.5" ry="3.5" fill={c.coreWhite} opacity="0.95" />
        <ellipse cx="105" cy="164" rx="2.5" ry="2.5" fill={c.coreWhite} opacity="0.85" />
        <ellipse cx="93" cy="166" rx="2" ry="2" fill={c.coreWhite} opacity="0.75" />
        <ellipse cx="108" cy="151" rx="1.5" ry="1.5" fill={c.coreWhite} opacity="0.7" />
        <ellipse cx="100" cy="142" rx="2" ry="2" fill={c.coreWhite} opacity="0.8" />
      </g>
    </CharacterFrame>
  );
}
