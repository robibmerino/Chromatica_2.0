import { useUniqueSvgIds } from '../useUniqueSvgIds';
import { getCharacterTransform } from '../characterTransform';
import { CharacterFrame } from '../CharacterFrame';
import type { QuienCharacterProps } from '../types';
import { useCreatureAxisPalette, getCreatureMetadata } from '../../archetypeCardComponents/creatures';

/** Paleta base de Mandala (Ser/Contemplación: fucsia–ciano; Hacer: más activo al rotar). */
const MANDALA_PALETTE = {
  layer0: '#e040fb',
  layer1: '#00e5ff',
  layer2: '#ffd740',
  layer3: '#69f0ae',
  layer4: '#ff6d00',
  layer5: '#f06292',
  layer6: '#b39ddb',
  layer7: '#80deea',
  bgLeft: '#e040fb',
  bgRight: '#00e5ff',
  coreMid: '#e040fb',
  coreOuter: '#00e5ff',
  coreFill: '#e040fb',
} as const;

const CREATURE_ID = 15 as const;

const CX = 100;
const CY = 150;

const LAYERS: {
  n: number;
  r: number;
  rot: number;
  size: number;
  colorKey: keyof typeof MANDALA_PALETTE;
  sw: number;
}[] = [
  { n: 3, r: 18, rot: 0, size: 14, colorKey: 'layer0', sw: 1.5 },
  { n: 4, r: 32, rot: 22, size: 10, colorKey: 'layer1', sw: 1.2 },
  { n: 5, r: 48, rot: 8, size: 8, colorKey: 'layer2', sw: 1.0 },
  { n: 6, r: 62, rot: 35, size: 6, colorKey: 'layer3', sw: 0.9 },
  { n: 7, r: 76, rot: 14, size: 5, colorKey: 'layer4', sw: 0.8 },
  { n: 8, r: 88, rot: 50, size: 4, colorKey: 'layer5', sw: 0.7 },
  { n: 11, r: 100, rot: 7, size: 3, colorKey: 'layer6', sw: 0.6 },
  { n: 13, r: 110, rot: 28, size: 2.5, colorKey: 'layer7', sw: 0.5 },
];

const CONNECTORS: {
  from: { r: number; angle: number };
  to: { r: number; angle: number };
  colorKey: keyof typeof MANDALA_PALETTE;
}[] = [
  { from: { r: 18, angle: 0 }, to: { r: 48, angle: 15 }, colorKey: 'layer0' },
  { from: { r: 18, angle: 120 }, to: { r: 62, angle: 100 }, colorKey: 'layer1' },
  { from: { r: 32, angle: 45 }, to: { r: 76, angle: 30 }, colorKey: 'layer2' },
  { from: { r: 32, angle: 200 }, to: { r: 88, angle: 185 }, colorKey: 'layer3' },
  { from: { r: 48, angle: 72 }, to: { r: 100, angle: 88 }, colorKey: 'layer4' },
  { from: { r: 62, angle: 150 }, to: { r: 110, angle: 140 }, colorKey: 'layer5' },
  { from: { r: 76, angle: 260 }, to: { r: 88, angle: 245 }, colorKey: 'layer6' },
  { from: { r: 18, angle: 240 }, to: { r: 32, angle: 225 }, colorKey: 'layer7' },
];

function getPoint(r: number, angleDeg: number) {
  return {
    x: CX + r * Math.cos((angleDeg * Math.PI) / 180),
    y: CY + r * Math.sin((angleDeg * Math.PI) / 180),
  };
}

export function Mandala({
  className = '',
  hideLabel,
  axisColorParams,
}: QuienCharacterProps) {
  const svgId = useUniqueSvgIds('mandala');
  const bg = svgId('bg');
  const core = svgId('core');

  const c = useCreatureAxisPalette(CREATURE_ID, MANDALA_PALETTE, axisColorParams);
  const meta = getCreatureMetadata(CREATURE_ID);

  return (
    <CharacterFrame
      title={meta?.name ?? 'Mandala'}
      subtitle={meta?.subtitle ?? 'Contemplación'}
      variant={meta?.labelVariant ?? 'fuchsia'}
      className={className}
      hideLabel={hideLabel}
    >
      <defs>
        <radialGradient id={bg} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={c.bgLeft} stopOpacity="0.12" />
          <stop offset="40%" stopColor={c.bgRight} stopOpacity="0.06" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={core} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="35%" stopColor={c.coreMid} stopOpacity="0.8" />
          <stop offset="70%" stopColor={c.coreOuter} stopOpacity="0.3" />
          <stop offset="100%" stopColor="#000" stopOpacity="0" />
        </radialGradient>
      </defs>

      <g transform={getCharacterTransform({ translateY: 15 }) ?? undefined}>
        {/* Halo de fondo */}
        <ellipse cx={CX} cy={CY} rx="115" ry="115" fill={`url(#${bg})`} />

        {/* Conectores entre capas */}
        {CONNECTORS.map((con, i) => {
          const from = getPoint(con.from.r, con.from.angle);
          const to = getPoint(con.to.r, con.to.angle);
          const color = c[con.colorKey];
          return (
            <g key={i}>
              <line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={color}
                strokeWidth="1.5"
                opacity="0.15"
              />
              <line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke={color}
                strokeWidth="0.5"
                opacity="0.6"
              />
            </g>
          );
        })}

        {/* Anillos base de cada capa */}
        {LAYERS.map((l, i) => (
          <circle
            key={`ring-${i}`}
            cx={CX}
            cy={CY}
            r={l.r}
            fill="none"
            stroke={c[l.colorKey]}
            strokeWidth={l.sw * 0.5}
            opacity="0.2"
          />
        ))}

        {/* Nodos de cada capa */}
        {LAYERS.map((l, li) =>
          Array.from({ length: l.n }, (_, ni) => {
            const angle = (ni / l.n) * Math.PI * 2 + (l.rot * Math.PI) / 180;
            const x = CX + l.r * Math.cos(angle);
            const y = CY + l.r * Math.sin(angle);
            const color = c[l.colorKey];
            return (
              <g key={`${li}-${ni}`}>
                <circle cx={x} cy={y} r={l.size * 1.8} fill={color} opacity="0.08" />
                <circle cx={x} cy={y} r={l.size * 0.55} fill={color} opacity="0.85" />
                <circle cx={x} cy={y} r={l.size * 0.22} fill="white" opacity="0.9" />
              </g>
            );
          })
        )}

        {/* Polígonos conectando nodos de cada capa */}
        {LAYERS.map((l, li) => {
          const points = Array.from({ length: l.n }, (_, ni) => {
            const angle = (ni / l.n) * Math.PI * 2 + (l.rot * Math.PI) / 180;
            return `${(CX + l.r * Math.cos(angle)).toFixed(1)},${(CY + l.r * Math.sin(angle)).toFixed(1)}`;
          }).join(' ');
          return (
            <polygon
              key={`poly-${li}`}
              points={points}
              fill="none"
              stroke={c[l.colorKey]}
              strokeWidth={l.sw}
              opacity="0.5"
            />
          );
        })}

        {/* Núcleo central */}
        <circle cx={CX} cy={CY} r={22} fill={`url(#${core})`} />
        <circle cx={CX} cy={CY} r={8} fill={c.coreFill} opacity="0.7" />
        <circle cx={CX} cy={CY} r={4} fill="white" opacity="0.95" />
      </g>
    </CharacterFrame>
  );
}
