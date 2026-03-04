import { useUniqueSvgIds } from '../useUniqueSvgIds';
import { CharacterFrame } from '../CharacterFrame';
import { getCharacterTransform } from '../characterTransform';
import type { QuienCharacterProps } from '../types';
import { useCreatureAxisPalette, getCreatureMetadata } from '../../archetypeCardComponents/creatures';

/** Paleta base de Espejo (Empática: rosas/azules cálidos; Independiente: tonos fríos al rotar). */
const ESPEJO_PALETTE = {
  shard1Light: '#e3f2fd',
  shard1Mid: '#90caf9',
  shard1Outer: '#0d47a1',
  shard2Light: '#fce4ec',
  shard2Mid: '#f48fb1',
  shard2Outer: '#880e4f',
  shard3Light: '#f3e5f5',
  shard3Mid: '#ce93d8',
  shard3Outer: '#4a148c',
  shard4Light: '#e8f5e9',
  shard4Mid: '#a5d6a7',
  shard4Outer: '#1b5e20',
  shard5Light: '#fff9c4',
  shard5Mid: '#ffe082',
  shard5Outer: '#f57f17',
  coreLight: '#e3f2fd',
  coreOuter: '#0d47a1',
  stroke1: '#e3f2fd',
  stroke2: '#fce4ec',
  stroke3: '#f3e5f5',
  stroke4: '#e8f5e9',
  stroke5: '#fff9c4',
  strokeSmall: '#f48fb1',
  strokeSmall2: '#90caf9',
  strokeSmall3: '#ffe082',
  strokeSmall4: '#ce93d8',
  strokeSmall5: '#a5d6a7',
} as const;

const CREATURE_ID = 6 as const;

export function Espejo({
  className = '',
  hideLabel,
  axisColorParams,
}: QuienCharacterProps) {
  const svgId = useUniqueSvgIds('espejo');
  const shard1 = svgId('shard1');
  const shard2 = svgId('shard2');
  const shard3 = svgId('shard3');
  const shard4 = svgId('shard4');
  const shard5 = svgId('shard5');
  const core = svgId('core');

  const c = useCreatureAxisPalette(CREATURE_ID, ESPEJO_PALETTE, axisColorParams);
  const meta = getCreatureMetadata(CREATURE_ID);

  return (
    <CharacterFrame
      title={meta?.name ?? 'Espejo'}
      subtitle={meta?.subtitle ?? 'Empática'}
      variant={meta?.labelVariant ?? 'rose'}
      className={className}
      hideLabel={hideLabel}
    >
      <defs>
        <radialGradient id={shard1} cx="30%" cy="25%" r="70%">
          <stop offset="0%" stopColor={c.shard1Light} stopOpacity="0.95" />
          <stop offset="40%" stopColor={c.shard1Mid} stopOpacity="0.6" />
          <stop offset="100%" stopColor={c.shard1Outer} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={shard2} cx="70%" cy="30%" r="65%">
          <stop offset="0%" stopColor={c.shard2Light} stopOpacity="0.9" />
          <stop offset="45%" stopColor={c.shard2Mid} stopOpacity="0.55" />
          <stop offset="100%" stopColor={c.shard2Outer} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={shard3} cx="40%" cy="60%" r="60%">
          <stop offset="0%" stopColor={c.shard3Light} stopOpacity="0.9" />
          <stop offset="45%" stopColor={c.shard3Mid} stopOpacity="0.5" />
          <stop offset="100%" stopColor={c.shard3Outer} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={shard4} cx="60%" cy="40%" r="65%">
          <stop offset="0%" stopColor={c.shard4Light} stopOpacity="0.85" />
          <stop offset="45%" stopColor={c.shard4Mid} stopOpacity="0.5" />
          <stop offset="100%" stopColor={c.shard4Outer} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={shard5} cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor={c.shard5Light} stopOpacity="0.9" />
          <stop offset="45%" stopColor={c.shard5Mid} stopOpacity="0.55" />
          <stop offset="100%" stopColor={c.shard5Outer} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={core} cx="35%" cy="35%" r="60%">
          <stop offset="0%" stopColor="white" stopOpacity="0.95" />
          <stop offset="60%" stopColor={c.coreLight} stopOpacity="0.6" />
          <stop offset="100%" stopColor={c.coreOuter} stopOpacity="0" />
        </radialGradient>
      </defs>

      <g transform={getCharacterTransform({ translateY: -20 }) ?? undefined}>
        {/* Fragmento grande central */}
        <polygon points="95,120 128,138 122,175 88,178 72,148" fill={`url(#${shard1})`} />
        <polygon points="95,120 128,138 122,175 88,178 72,148" fill="none" stroke={c.stroke1} strokeWidth="0.8" opacity="0.7" />

        {/* Fragmento grande derecha */}
        <polygon points="130,105 158,118 162,152 138,165 118,148 122,120" fill={`url(#${shard2})`} />
        <polygon points="130,105 158,118 162,152 138,165 118,148 122,120" fill="none" stroke={c.stroke2} strokeWidth="0.7" opacity="0.6" />

        {/* Fragmento izquierda */}
        <polygon points="58,130 88,118 95,145 75,162 48,155" fill={`url(#${shard3})`} />
        <polygon points="58,130 88,118 95,145 75,162 48,155" fill="none" stroke={c.stroke3} strokeWidth="0.7" opacity="0.6" />

        {/* Fragmento inferior izquierda */}
        <polygon points="72,168 100,178 105,210 80,222 58,205 60,178" fill={`url(#${shard4})`} />
        <polygon points="72,168 100,178 105,210 80,222 58,205 60,178" fill="none" stroke={c.stroke4} strokeWidth="0.7" opacity="0.55" />

        {/* Fragmento inferior derecha */}
        <polygon points="110,175 142,165 155,195 140,220 112,218 98,205" fill={`url(#${shard5})`} />
        <polygon points="110,175 142,165 155,195 140,220 112,218 98,205" fill="none" stroke={c.stroke5} strokeWidth="0.7" opacity="0.55" />

        {/* Fragmentos pequeños flotando */}
        <polygon points="44,105 58,98 62,115 50,122" fill={`url(#${shard2})`} />
        <polygon points="44,105 58,98 62,115 50,122" fill="none" stroke={c.strokeSmall} strokeWidth="0.6" opacity="0.5" />

        <polygon points="155,88 168,82 172,100 160,106" fill={`url(#${shard1})`} />
        <polygon points="155,88 168,82 172,100 160,106" fill="none" stroke={c.strokeSmall2} strokeWidth="0.6" opacity="0.5" />

        <polygon points="38,188 50,182 54,198 42,204" fill={`url(#${shard5})`} />
        <polygon points="38,188 50,182 54,198 42,204" fill="none" stroke={c.strokeSmall3} strokeWidth="0.5" opacity="0.5" />

        <polygon points="158,208 170,202 172,218 162,224" fill={`url(#${shard3})`} />
        <polygon points="158,208 170,202 172,218 162,224" fill="none" stroke={c.strokeSmall4} strokeWidth="0.5" opacity="0.5" />

        <polygon points="85,232 96,228 98,242 86,246" fill={`url(#${shard4})`} />
        <polygon points="85,232 96,228 98,242 86,246" fill="none" stroke={c.strokeSmall5} strokeWidth="0.5" opacity="0.45" />

        <polygon points="115,238 126,234 128,248 116,252" fill={`url(#${shard1})`} />
        <polygon points="115,238 126,234 128,248 116,252" fill="none" stroke={c.strokeSmall2} strokeWidth="0.5" opacity="0.45" />

        {/* Fragmentos micro */}
        <polygon points="62,250 70,246 72,256 64,260" fill={`url(#${shard2})`} />
        <polygon points="148,240 156,236 158,248 150,252" fill={`url(#${shard5})`} />
        <polygon points="30,155 38,150 40,162 32,166" fill={`url(#${shard4})`} />
        <polygon points="168,165 176,160 178,172 170,176" fill={`url(#${shard3})`} />

        {/* Destellos */}
        <ellipse cx="110" cy="122" rx="4" ry="4" fill="white" opacity="0.9" />
        <ellipse cx="158" cy="120" rx="3" ry="3" fill="white" opacity="0.8" />
        <ellipse cx="72" cy="135" rx="3" ry="3" fill="white" opacity="0.75" />
        <ellipse cx="105" cy="178" rx="3.5" ry="3.5" fill="white" opacity="0.8" />
        <ellipse cx="142" cy="167" rx="2.5" ry="2.5" fill="white" opacity="0.7" />
        <ellipse cx="62" cy="168" rx="2.5" ry="2.5" fill="white" opacity="0.7" />
        <ellipse cx="155" cy="198" rx="2" ry="2" fill="white" opacity="0.65" />
        <ellipse cx="58" cy="205" rx="2" ry="2" fill="white" opacity="0.6" />

        {/* Núcleo */}
        <ellipse cx="100" cy="152" rx="14" ry="16" fill={`url(#${core})`} />
        <ellipse cx="100" cy="152" rx="7" ry="8" fill="white" opacity="0.8" />
        <ellipse cx="97" cy="149" rx="3" ry="3.5" fill="white" opacity="0.95" />
      </g>
    </CharacterFrame>
  );
}
