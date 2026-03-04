import { useUniqueSvgIds } from '../useUniqueSvgIds';
import { getCharacterTransform } from '../characterTransform';
import { CharacterFrame } from '../CharacterFrame';
import type { QuienCharacterProps } from '../types';
import { useCreatureAxisPalette, getCreatureMetadata } from '../../archetypeCardComponents/creatures';

/** Paleta base de Orbitas (Equilibrado: tonos armónicos; Dinamismo: ámbar/naranja al rotar). */
const ORBITAS_PALETTE = {
  coreLight: '#fff9c4',
  coreMid: '#ffe082',
  coreDark: '#ffb300',
  coreOuter: '#ff6f00',
  coronaLight: '#fff9c4',
  coronaMid: '#ffcc02',
  coronaOuter: '#ff6f00',
  p1Light: '#80deea',
  p1Mid: '#00bcd4',
  p1Outer: '#006064',
  p2Light: '#ce93d8',
  p2Mid: '#9c27b0',
  p2Outer: '#4a148c',
  p3Light: '#a5d6a7',
  p3Mid: '#43a047',
  p3Outer: '#1b5e20',
  p4Light: '#ffab91',
  p4Mid: '#ef5350',
  p4Outer: '#7f0000',
  p5Light: '#fff9c4',
  p5Mid: '#f9a825',
  p5Outer: '#e65100',
  nebulaLight: '#fff9c4',
  nebulaMid: '#ffb300',
  nebulaOuter: '#ff6f00',
  orbit1: '#00bcd4',
  orbit1Soft: '#80deea',
  orbit2: '#9c27b0',
  orbit2Soft: '#ce93d8',
  orbit3: '#43a047',
  orbit3Soft: '#a5d6a7',
  orbit4: '#ef5350',
  orbit4Soft: '#ffab91',
  orbit5: '#f9a825',
  orbit5Soft: '#fff9c4',
  ray: '#ffe082',
  moon1: '#b2ebf2',
  moon3: '#c8e6c9',
  dust: '#ffcc02',
  asteroid: '#ffe082',
} as const;

const CREATURE_ID = 7 as const;

const ASTEROIDS: [number, number, number][] = [
  [145, 62, 1.2], [158, 130, 1.0], [52, 78, 1.4], [42, 125, 1.0],
  [168, 82, 0.8], [35, 100, 1.2], [162, 155, 0.9], [80, 175, 1.1],
  [125, 170, 0.8], [170, 115, 1.0],
];

const DUST_ANGLES = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
const RAY_ANGLES_MAIN = [0, 45, 90, 135, 180, 225, 270, 315];
const RAY_ANGLES_SEC = [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5];

export function Orbitas({
  className = '',
  hideLabel,
  axisColorParams,
}: QuienCharacterProps) {
  const svgId = useUniqueSvgIds('orbitas');
  const core = svgId('core');
  const corona = svgId('corona');
  const p1 = svgId('p1');
  const p2 = svgId('p2');
  const p3 = svgId('p3');
  const p4 = svgId('p4');
  const p5 = svgId('p5');
  const nebula = svgId('nebula');

  const c = useCreatureAxisPalette(CREATURE_ID, ORBITAS_PALETTE, axisColorParams);
  const meta = getCreatureMetadata(CREATURE_ID);

  return (
    <CharacterFrame
      title={meta?.name ?? 'Orbitas'}
      subtitle={meta?.subtitle ?? 'Equilibrio'}
      variant={meta?.labelVariant ?? 'amber'}
      className={className}
      hideLabel={hideLabel}
    >
      <defs>
        <radialGradient id={core} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={c.coreLight} stopOpacity="1" />
          <stop offset="30%" stopColor={c.coreMid} stopOpacity="0.9" />
          <stop offset="60%" stopColor={c.coreDark} stopOpacity="0.6" />
          <stop offset="100%" stopColor={c.coreOuter} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={corona} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={c.coronaLight} stopOpacity="0.3" />
          <stop offset="60%" stopColor={c.coronaMid} stopOpacity="0.15" />
          <stop offset="100%" stopColor={c.coronaOuter} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={p1} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={c.p1Light} stopOpacity="1" />
          <stop offset="60%" stopColor={c.p1Mid} stopOpacity="0.6" />
          <stop offset="100%" stopColor={c.p1Outer} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={p2} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={c.p2Light} stopOpacity="1" />
          <stop offset="60%" stopColor={c.p2Mid} stopOpacity="0.6" />
          <stop offset="100%" stopColor={c.p2Outer} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={p3} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={c.p3Light} stopOpacity="1" />
          <stop offset="60%" stopColor={c.p3Mid} stopOpacity="0.6" />
          <stop offset="100%" stopColor={c.p3Outer} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={p4} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={c.p4Light} stopOpacity="1" />
          <stop offset="60%" stopColor={c.p4Mid} stopOpacity="0.6" />
          <stop offset="100%" stopColor={c.p4Outer} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={p5} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={c.p5Light} stopOpacity="1" />
          <stop offset="60%" stopColor={c.p5Mid} stopOpacity="0.6" />
          <stop offset="100%" stopColor={c.p5Outer} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={nebula} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={c.nebulaLight} stopOpacity="0.08" />
          <stop offset="50%" stopColor={c.nebulaMid} stopOpacity="0.04" />
          <stop offset="100%" stopColor={c.nebulaOuter} stopOpacity="0" />
        </radialGradient>
      </defs>

      <g transform={getCharacterTransform({ translateY: 60 }) ?? undefined}>
        {/* Nebulosa de fondo */}
        <ellipse cx="100" cy="100" rx="95" ry="90" fill={`url(#${nebula})`} />
        <ellipse cx="100" cy="100" rx="70" ry="65" fill={`url(#${nebula})`} />

        {/* Órbita 1 — cian */}
        <ellipse cx="100" cy="100" rx="88" ry="28" fill="none" stroke={c.orbit1} strokeWidth="0.4" opacity="0.25" transform="rotate(15,100,100)" />
        <ellipse cx="100" cy="100" rx="88" ry="28" fill="none" stroke={c.orbit1Soft} strokeWidth="0.8" opacity="0.15" transform="rotate(15,100,100)" strokeDasharray="4,8" />
        <ellipse cx="188" cy="100" rx="7" ry="7" fill={`url(#${p1})`} transform="rotate(15,100,100)" />
        <ellipse cx="188" cy="100" rx="12" ry="4" fill="none" stroke={c.orbit1Soft} strokeWidth="0.8" opacity="0.5" transform="rotate(15,100,100) rotate(-20,188,100)" />
        <ellipse cx="188" cy="100" rx="9" ry="3" fill="none" stroke={c.orbit1Soft} strokeWidth="0.5" opacity="0.35" transform="rotate(15,100,100) rotate(-20,188,100)" />
        <ellipse cx="178" cy="96" rx="2.5" ry="2.5" fill={c.moon1} opacity="0.8" transform="rotate(15,100,100)" />

        {/* Órbita 2 — violeta */}
        <ellipse cx="100" cy="100" rx="72" ry="22" fill="none" stroke={c.orbit2} strokeWidth="0.4" opacity="0.25" transform="rotate(-25,100,100)" />
        <ellipse cx="100" cy="100" rx="72" ry="22" fill="none" stroke={c.orbit2Soft} strokeWidth="0.8" opacity="0.15" transform="rotate(-25,100,100)" strokeDasharray="3,6" />
        <ellipse cx="172" cy="100" rx="6" ry="6" fill={`url(#${p2})`} transform="rotate(-25,100,100)" />
        <ellipse cx="172" cy="100" rx="10" ry="3" fill="none" stroke={c.orbit2Soft} strokeWidth="0.8" opacity="0.5" transform="rotate(-25,100,100) rotate(10,172,100)" />

        {/* Órbita 3 — verde */}
        <ellipse cx="100" cy="100" rx="58" ry="18" fill="none" stroke={c.orbit3} strokeWidth="0.4" opacity="0.3" transform="rotate(45,100,100)" />
        <ellipse cx="100" cy="100" rx="58" ry="18" fill="none" stroke={c.orbit3Soft} strokeWidth="0.8" opacity="0.2" transform="rotate(45,100,100)" strokeDasharray="2,5" />
        <ellipse cx="158" cy="100" rx="8" ry="8" fill={`url(#${p3})`} transform="rotate(45,100,100)" />
        <ellipse cx="158" cy="100" rx="13" ry="4" fill="none" stroke={c.orbit3Soft} strokeWidth="0.8" opacity="0.5" transform="rotate(45,100,100) rotate(5,158,100)" />
        <ellipse cx="158" cy="100" rx="10" ry="3" fill="none" stroke={c.orbit3Soft} strokeWidth="0.4" opacity="0.3" transform="rotate(45,100,100) rotate(5,158,100)" />
        <ellipse cx="148" cy="97" rx="2" ry="2" fill={c.moon3} opacity="0.8" transform="rotate(45,100,100)" />
        <ellipse cx="150" cy="104" rx="1.5" ry="1.5" fill={c.moon3} opacity="0.6" transform="rotate(45,100,100)" />

        {/* Órbita 4 — roja */}
        <ellipse cx="100" cy="100" rx="44" ry="14" fill="none" stroke={c.orbit4} strokeWidth="0.4" opacity="0.3" transform="rotate(-60,100,100)" />
        <ellipse cx="100" cy="100" rx="44" ry="14" fill="none" stroke={c.orbit4Soft} strokeWidth="0.8" opacity="0.2" transform="rotate(-60,100,100)" strokeDasharray="2,4" />
        <ellipse cx="144" cy="100" rx="5" ry="5" fill={`url(#${p4})`} transform="rotate(-60,100,100)" />

        {/* Órbita 5 — dorada */}
        <ellipse cx="100" cy="100" rx="30" ry="10" fill="none" stroke={c.orbit5} strokeWidth="0.4" opacity="0.35" transform="rotate(75,100,100)" />
        <ellipse cx="100" cy="100" rx="30" ry="10" fill="none" stroke={c.orbit5Soft} strokeWidth="0.8" opacity="0.25" transform="rotate(75,100,100)" strokeDasharray="2,3" />
        <ellipse cx="130" cy="100" rx="4" ry="4" fill={`url(#${p5})`} transform="rotate(75,100,100)" />

        {/* Asteroides */}
        {ASTEROIDS.map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} fill={c.asteroid} opacity={0.4 + i * 0.04} />
        ))}

        {/* Polvo orbital */}
        {DUST_ANGLES.map((angle, i) => (
          <ellipse
            key={i}
            cx="100"
            cy="100"
            rx="82"
            ry="3"
            fill="none"
            stroke={c.dust}
            strokeWidth="0.3"
            opacity="0.06"
            transform={`rotate(${angle},100,100)`}
          />
        ))}

        {/* Corona solar */}
        <ellipse cx="100" cy="100" rx="22" ry="22" fill={`url(#${corona})`} />
        <ellipse cx="100" cy="100" rx="16" ry="16" fill={`url(#${corona})`} />

        {/* Radios solares */}
        {RAY_ANGLES_MAIN.map((angle, i) => (
          <line
            key={`main-${i}`}
            x1={100 + Math.cos((angle * Math.PI) / 180) * 16}
            y1={100 + Math.sin((angle * Math.PI) / 180) * 16}
            x2={100 + Math.cos((angle * Math.PI) / 180) * 26}
            y2={100 + Math.sin((angle * Math.PI) / 180) * 26}
            stroke={c.ray}
            strokeWidth="0.8"
            opacity="0.4"
            strokeLinecap="round"
          />
        ))}
        {RAY_ANGLES_SEC.map((angle, i) => (
          <line
            key={`sec-${i}`}
            x1={100 + Math.cos((angle * Math.PI) / 180) * 16}
            y1={100 + Math.sin((angle * Math.PI) / 180) * 16}
            x2={100 + Math.cos((angle * Math.PI) / 180) * 21}
            y2={100 + Math.sin((angle * Math.PI) / 180) * 21}
            stroke={c.ray}
            strokeWidth="0.5"
            opacity="0.3"
            strokeLinecap="round"
          />
        ))}

        {/* Núcleo solar */}
        <ellipse cx="100" cy="100" rx="12" ry="12" fill={`url(#${core})`} />
        <ellipse cx="100" cy="100" rx="7" ry="7" fill={c.coreLight} opacity="0.95" />
        <ellipse cx="100" cy="100" rx="4" ry="4" fill="white" opacity="1" />
        <ellipse cx="97" cy="97" rx="2" ry="2" fill="white" opacity="0.7" />
      </g>
    </CharacterFrame>
  );
}
