import { useUniqueSvgIds } from '../useUniqueSvgIds';
import { getCharacterTransform } from '../characterTransform';
import { CharacterFrame } from '../CharacterFrame';
import type { QuienCharacterProps } from '../types';
import { useCreatureAxisPalette, getCreatureMetadata } from '../../archetypeCardComponents/creatures';

/** Paleta base de Raices (Tradicional: verdes naturales; Innovador: tonos tecnológicos al rotar). */
const RAICES_PALETTE = {
  root1Light: '#c8e6c9',
  root1Mid: '#43a047',
  root1Dark: '#66bb6a',
  root2Light: '#a5d6a7',
  root2Mid: '#2e7d32',
  root2Dark: '#4caf50',
  root3Light: '#e8f5e9',
  root3Mid: '#388e3c',
  root3Dark: '#66bb6a',
  nodeLight: '#ffffff',
  nodeMid: '#c8e6c9',
  nodeOuter: '#66bb6a',
  coreWhite: '#ffffff',
  coreLight: '#e8f5e9',
  coreMid: '#a5d6a7',
  coreOuter: '#43a047',
  terminalLight: '#e8f5e9',
  terminalMid: '#c8e6c9',
  terminalDark: '#a5d6a7',
} as const;

const CREATURE_ID = 3 as const;

export function Raices({
  className = '',
  hideLabel,
  axisColorParams,
}: QuienCharacterProps) {
  const svgId = useUniqueSvgIds('raices');
  const root1 = svgId('root1');
  const root2 = svgId('root2');
  const root3 = svgId('root3');
  const node = svgId('node');
  const core = svgId('core');

  const c = useCreatureAxisPalette(CREATURE_ID, RAICES_PALETTE, axisColorParams);
  const meta = getCreatureMetadata(CREATURE_ID);

  return (
    <CharacterFrame
      title={meta?.name ?? 'Raices'}
      subtitle={meta?.subtitle ?? 'Tradición'}
      variant={meta?.labelVariant ?? 'emerald'}
      className={className}
      hideLabel={hideLabel}
    >
      <defs>
        <linearGradient id={root1} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={c.root1Light} stopOpacity="0" />
          <stop offset="40%" stopColor={c.root1Mid} stopOpacity="0.7" />
          <stop offset="70%" stopColor={c.root1Dark} stopOpacity="0.9" />
          <stop offset="100%" stopColor={c.root1Light} stopOpacity="0.5" />
        </linearGradient>
        <linearGradient id={root2} x1="100%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor={c.root2Light} stopOpacity="0" />
          <stop offset="45%" stopColor={c.root2Mid} stopOpacity="0.65" />
          <stop offset="75%" stopColor={c.root2Dark} stopOpacity="0.85" />
          <stop offset="100%" stopColor={c.root2Light} stopOpacity="0.45" />
        </linearGradient>
        <linearGradient id={root3} x1="50%" y1="100%" x2="50%" y2="0%">
          <stop offset="0%" stopColor={c.root3Light} stopOpacity="0" />
          <stop offset="35%" stopColor={c.root3Mid} stopOpacity="0.6" />
          <stop offset="65%" stopColor={c.root3Dark} stopOpacity="0.88" />
          <stop offset="100%" stopColor={c.root3Light} stopOpacity="0.4" />
        </linearGradient>
        <radialGradient id={node} cx="38%" cy="35%" r="58%">
          <stop offset="0%" stopColor={c.nodeLight} stopOpacity="1" />
          <stop offset="35%" stopColor={c.nodeMid} stopOpacity="0.95" />
          <stop offset="70%" stopColor={c.nodeOuter} stopOpacity="0.6" />
          <stop offset="100%" stopColor={c.root2Mid} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={core} cx="38%" cy="35%" r="58%">
          <stop offset="0%" stopColor={c.coreWhite} stopOpacity="1" />
          <stop offset="30%" stopColor={c.coreLight} stopOpacity="0.98" />
          <stop offset="65%" stopColor={c.coreMid} stopOpacity="0.7" />
          <stop offset="100%" stopColor={c.coreOuter} stopOpacity="0" />
        </radialGradient>
      </defs>

      <g transform={getCharacterTransform({ scale: 0.9, translateY: 8, centerX: 100, centerY: 155 }) ?? undefined}>
        {/* Raíces inferiores */}
        <path d="M100,185 Q88,210 70,230 Q58,245 48,262" fill="none" stroke={`url(#${root1})`} strokeWidth="5" strokeLinecap="round" opacity="0.8" />
        <path d="M100,185 Q92,215 85,238 Q80,252 78,272" fill="none" stroke={`url(#${root3})`} strokeWidth="4" strokeLinecap="round" opacity="0.7" />
        <path d="M100,185 Q100,215 100,242 Q100,258 100,278" fill="none" stroke={`url(#${root2})`} strokeWidth="5" strokeLinecap="round" opacity="0.8" />
        <path d="M100,185 Q108,215 115,238 Q120,252 122,272" fill="none" stroke={`url(#${root3})`} strokeWidth="4" strokeLinecap="round" opacity="0.7" />
        <path d="M100,185 Q112,210 130,230 Q142,245 152,262" fill="none" stroke={`url(#${root1})`} strokeWidth="5" strokeLinecap="round" opacity="0.8" />

        {/* Ramificaciones secundarias inferiores */}
        <path d="M70,230 Q58,238 45,242" fill="none" stroke={`url(#${root2})`} strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
        <path d="M70,230 Q62,242 55,255" fill="none" stroke={`url(#${root1})`} strokeWidth="2.5" strokeLinecap="round" opacity="0.55" />
        <path d="M130,230 Q142,238 155,242" fill="none" stroke={`url(#${root2})`} strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
        <path d="M130,230 Q138,242 145,255" fill="none" stroke={`url(#${root1})`} strokeWidth="2.5" strokeLinecap="round" opacity="0.55" />

        {/* Ramas superiores */}
        <path d="M100,125 Q85,105 65,88 Q50,74 35,60" fill="none" stroke={`url(#${root2})`} strokeWidth="5" strokeLinecap="round" opacity="0.85" />
        <path d="M100,125 Q90,102 80,80 Q72,62 68,42" fill="none" stroke={`url(#${root3})`} strokeWidth="4" strokeLinecap="round" opacity="0.75" />
        <path d="M100,125 Q100,100 100,75 Q100,55 100,35" fill="none" stroke={`url(#${root1})`} strokeWidth="5" strokeLinecap="round" opacity="0.85" />
        <path d="M100,125 Q110,102 120,80 Q128,62 132,42" fill="none" stroke={`url(#${root3})`} strokeWidth="4" strokeLinecap="round" opacity="0.75" />
        <path d="M100,125 Q115,105 135,88 Q150,74 165,60" fill="none" stroke={`url(#${root2})`} strokeWidth="5" strokeLinecap="round" opacity="0.85" />

        {/* Ramas laterales — izquierda */}
        <path d="M100,155 Q75,148 52,142 Q34,137 18,130" fill="none" stroke={`url(#${root1})`} strokeWidth="4.5" strokeLinecap="round" opacity="0.8" />
        <path d="M100,155 Q78,162 55,168 Q38,172 22,175" fill="none" stroke={`url(#${root3})`} strokeWidth="3.5" strokeLinecap="round" opacity="0.7" />

        {/* Ramas laterales — derecha */}
        <path d="M100,155 Q125,148 148,142 Q166,137 182,130" fill="none" stroke={`url(#${root2})`} strokeWidth="4.5" strokeLinecap="round" opacity="0.8" />
        <path d="M100,155 Q122,162 145,168 Q162,172 178,175" fill="none" stroke={`url(#${root3})`} strokeWidth="3.5" strokeLinecap="round" opacity="0.7" />

        {/* Ramificaciones terciarias superiores */}
        <path d="M65,88 Q52,80 40,72" fill="none" stroke={`url(#${root1})`} strokeWidth="2.5" strokeLinecap="round" opacity="0.65" />
        <path d="M65,88 Q55,78 48,65" fill="none" stroke={`url(#${root2})`} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        <path d="M135,88 Q148,80 160,72" fill="none" stroke={`url(#${root1})`} strokeWidth="2.5" strokeLinecap="round" opacity="0.65" />
        <path d="M135,88 Q145,78 152,65" fill="none" stroke={`url(#${root2})`} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        <path d="M68,42 Q60,32 55,20" fill="none" stroke={`url(#${root3})`} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        <path d="M68,42 Q72,30 78,20" fill="none" stroke={`url(#${root1})`} strokeWidth="2" strokeLinecap="round" opacity="0.55" />
        <path d="M132,42 Q140,32 145,20" fill="none" stroke={`url(#${root3})`} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        <path d="M132,42 Q128,30 122,20" fill="none" stroke={`url(#${root1})`} strokeWidth="2" strokeLinecap="round" opacity="0.55" />

        {/* Nodos en intersecciones */}
        <ellipse cx="65" cy="88" rx="6" ry="6" fill={`url(#${node})`} opacity="0.9" />
        <ellipse cx="135" cy="88" rx="6" ry="6" fill={`url(#${node})`} opacity="0.9" />
        <ellipse cx="68" cy="42" rx="5" ry="5" fill={`url(#${node})`} opacity="0.85" />
        <ellipse cx="132" cy="42" rx="5" ry="5" fill={`url(#${node})`} opacity="0.85" />
        <ellipse cx="35" cy="60" rx="4.5" ry="4.5" fill={`url(#${node})`} opacity="0.8" />
        <ellipse cx="165" cy="60" rx="4.5" ry="4.5" fill={`url(#${node})`} opacity="0.8" />
        <ellipse cx="18" cy="130" rx="4" ry="4" fill={`url(#${node})`} opacity="0.75" />
        <ellipse cx="182" cy="130" rx="4" ry="4" fill={`url(#${node})`} opacity="0.75" />
        <ellipse cx="70" cy="230" rx="5" ry="5" fill={`url(#${node})`} opacity="0.8" />
        <ellipse cx="130" cy="230" rx="5" ry="5" fill={`url(#${node})`} opacity="0.8" />
        <ellipse cx="100" cy="35" rx="5" ry="5" fill={`url(#${node})`} opacity="0.85" />
        <ellipse cx="100" cy="278" rx="5" ry="5" fill={`url(#${node})`} opacity="0.8" />

        {/* Nodos pequeños terminales */}
        <circle cx="40" cy="72" r="2.5" fill={c.terminalMid} opacity="0.9" />
        <circle cx="48" cy="65" r="2" fill={c.terminalDark} opacity="0.85" />
        <circle cx="160" cy="72" r="2.5" fill={c.terminalMid} opacity="0.9" />
        <circle cx="152" cy="65" r="2" fill={c.terminalDark} opacity="0.85" />
        <circle cx="55" cy="20" r="2" fill={c.terminalLight} opacity="0.85" />
        <circle cx="78" cy="20" r="2" fill={c.terminalMid} opacity="0.8" />
        <circle cx="145" cy="20" r="2" fill={c.terminalLight} opacity="0.85" />
        <circle cx="122" cy="20" r="2" fill={c.terminalMid} opacity="0.8" />
        <circle cx="22" cy="175" r="2" fill={c.terminalDark} opacity="0.75" />
        <circle cx="178" cy="175" r="2" fill={c.terminalDark} opacity="0.75" />

        {/* Núcleo central */}
        <ellipse cx="100" cy="155" rx="16" ry="16" fill={`url(#${core})`} opacity="0.98" />
        <ellipse cx="100" cy="155" rx="10" ry="10" fill={c.coreLight} opacity="0.95" />
        <ellipse cx="100" cy="155" rx="5.5" ry="5.5" fill={c.coreWhite} opacity="1" />
        <ellipse cx="98.5" cy="153.5" rx="2.2" ry="2.2" fill={c.coreWhite} opacity="1" />
      </g>
    </CharacterFrame>
  );
}
