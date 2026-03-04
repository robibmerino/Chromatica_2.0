import { useUniqueSvgIds } from '../useUniqueSvgIds';
import { getCharacterTransform } from '../characterTransform';
import { CharacterFrame } from '../CharacterFrame';
import type { QuienCharacterProps } from '../types';
import { useCreatureAxisPalette, getCreatureMetadata } from '../../archetypeCardComponents/creatures';

/** Paleta base de Vacio (Magnética: púrpura vibrante; Discreta: tonos neutros al rotar). */
const VACIO_PALETTE = {
  ring1Outer: '#ede7f6',
  ring1Mid: '#7c4dff',
  ring1Inner: '#b39ddb',
  ring2Outer: '#f3e5f5',
  ring2Mid: '#9c27b0',
  ring2Inner: '#e1bee7',
  ring3Outer: '#ede7f6',
  ring3Mid: '#673ab7',
  ring3Inner: '#d1c4e9',
  ring4Outer: '#f8f0ff',
  ring4Mid: '#7b1fa2',
  ring4Inner: '#e1bee7',
  coreWhite: '#ffffff',
  coreLight: '#ede7f6',
  coreMid: '#b39ddb',
  coreOuter: '#7c4dff',
  nodeLight: '#ede7f6',
  nodeMid: '#d1c4e9',
  nodeSoft: '#e1bee7',
} as const;

const CREATURE_ID = 2 as const;

export function Vacio({
  className = '',
  hideLabel,
  axisColorParams,
}: QuienCharacterProps) {
  const svgId = useUniqueSvgIds('vacio');
  const ring1 = svgId('ring1');
  const ring2 = svgId('ring2');
  const ring3 = svgId('ring3');
  const ring4 = svgId('ring4');
  const core = svgId('core');

  const c = useCreatureAxisPalette(CREATURE_ID, VACIO_PALETTE, axisColorParams);
  const meta = getCreatureMetadata(CREATURE_ID);

  return (
    <CharacterFrame
      title={meta?.name ?? 'Vacio'}
      subtitle={meta?.subtitle ?? 'Magnetismo'}
      variant={meta?.labelVariant ?? 'violet'}
      className={className}
      hideLabel={hideLabel}
    >
      <defs>
        <radialGradient id={ring1} cx="50%" cy="50%" r="50%">
          <stop offset="60%" stopColor={c.ring1Inner} stopOpacity="0" />
          <stop offset="80%" stopColor={c.ring1Mid} stopOpacity="0.6" />
          <stop offset="90%" stopColor={c.ring1Inner} stopOpacity="0.8" />
          <stop offset="100%" stopColor={c.ring1Outer} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={ring2} cx="50%" cy="50%" r="50%">
          <stop offset="55%" stopColor={c.ring2Inner} stopOpacity="0" />
          <stop offset="72%" stopColor={c.ring2Mid} stopOpacity="0.55" />
          <stop offset="84%" stopColor={c.ring2Inner} stopOpacity="0.75" />
          <stop offset="100%" stopColor={c.ring2Outer} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={ring3} cx="50%" cy="50%" r="50%">
          <stop offset="50%" stopColor={c.ring3Inner} stopOpacity="0" />
          <stop offset="68%" stopColor={c.ring3Mid} stopOpacity="0.5" />
          <stop offset="80%" stopColor={c.ring3Inner} stopOpacity="0.7" />
          <stop offset="100%" stopColor={c.ring3Outer} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={ring4} cx="50%" cy="50%" r="50%">
          <stop offset="45%" stopColor={c.ring4Inner} stopOpacity="0" />
          <stop offset="62%" stopColor={c.ring4Mid} stopOpacity="0.45" />
          <stop offset="76%" stopColor={c.ring4Inner} stopOpacity="0.65" />
          <stop offset="100%" stopColor={c.ring4Outer} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={core} cx="40%" cy="38%" r="58%">
          <stop offset="0%" stopColor={c.coreWhite} stopOpacity="1" />
          <stop offset="40%" stopColor={c.coreLight} stopOpacity="0.95" />
          <stop offset="80%" stopColor={c.coreMid} stopOpacity="0.5" />
          <stop offset="100%" stopColor={c.coreOuter} stopOpacity="0" />
        </radialGradient>
      </defs>

      <g transform={getCharacterTransform({ translateY: 4 }) ?? undefined}>
        {/* Anillo 1 — más externo */}
        <ellipse cx="90" cy="145" rx="75" ry="72" fill={`url(#${ring1})`} opacity="0.9" />

        {/* Anillo 2 */}
        <ellipse cx="108" cy="162" rx="62" ry="59" fill={`url(#${ring2})`} opacity="0.85" />

        {/* Anillo 3 */}
        <ellipse cx="112" cy="148" rx="50" ry="47" fill={`url(#${ring3})`} opacity="0.8" />

        {/* Anillo 4 */}
        <ellipse cx="92" cy="165" rx="40" ry="37" fill={`url(#${ring4})`} opacity="0.8" />

        {/* Anillo 5 */}
        <ellipse cx="100" cy="155" rx="30" ry="28" fill={`url(#${ring1})`} opacity="0.75" />

        {/* Anillo 6 */}
        <ellipse cx="100" cy="155" rx="20" ry="19" fill={`url(#${ring2})`} opacity="0.7" />

        {/* Arcos sueltos — fragmentos de onda */}
        <ellipse cx="75" cy="105" rx="45" ry="20" fill={`url(#${ring3})`} opacity="0.5" transform="rotate(-30 75 105)" />
        <ellipse cx="130" cy="210" rx="38" ry="16" fill={`url(#${ring2})`} opacity="0.45" transform="rotate(20 130 210)" />
        <ellipse cx="148" cy="120" rx="30" ry="12" fill={`url(#${ring4})`} opacity="0.4" transform="rotate(50 148 120)" />
        <ellipse cx="55" cy="200" rx="28" ry="11" fill={`url(#${ring1})`} opacity="0.4" transform="rotate(-40 55 200)" />

        {/* Micro-ondas flotantes */}
        <ellipse cx="100" cy="70" rx="22" ry="8" fill={`url(#${ring2})`} opacity="0.5" transform="rotate(-10 100 70)" />
        <ellipse cx="155" cy="175" rx="18" ry="7" fill={`url(#${ring3})`} opacity="0.45" transform="rotate(35 155 175)" />
        <ellipse cx="45" cy="150" rx="16" ry="6" fill={`url(#${ring4})`} opacity="0.4" transform="rotate(-25 45 150)" />
        <ellipse cx="100" cy="248" rx="20" ry="7" fill={`url(#${ring1})`} opacity="0.4" transform="rotate(5 100 248)" />

        {/* Núcleo */}
        <ellipse cx="100" cy="155" rx="12" ry="12" fill={`url(#${core})`} opacity="1" />
        <ellipse cx="100" cy="155" rx="7" ry="7" fill={c.coreLight} opacity="0.98" />
        <ellipse cx="100" cy="155" rx="4" ry="4" fill={c.coreWhite} opacity="1" />
        <ellipse cx="98.5" cy="153.5" rx="1.8" ry="1.8" fill={c.coreWhite} opacity="1" />

        {/* Nodos luminosos en los anillos */}
        <circle cx="165" cy="145" r="2.5" fill={c.nodeLight} opacity="0.9" />
        <circle cx="35" cy="145" r="2" fill={c.nodeMid} opacity="0.85" />
        <circle cx="100" cy="82" r="2.5" fill={c.nodeSoft} opacity="0.9" />
        <circle cx="100" cy="228" r="2.5" fill={c.nodeMid} opacity="0.85" />
        <circle cx="155" cy="105" r="2" fill={c.nodeLight} opacity="0.8" />
        <circle cx="45" cy="205" r="2" fill={c.nodeSoft} opacity="0.8" />
        <circle cx="158" cy="198" r="1.8" fill={c.nodeMid} opacity="0.75" />
        <circle cx="42" cy="108" r="1.8" fill={c.nodeLight} opacity="0.75" />
      </g>
    </CharacterFrame>
  );
}
