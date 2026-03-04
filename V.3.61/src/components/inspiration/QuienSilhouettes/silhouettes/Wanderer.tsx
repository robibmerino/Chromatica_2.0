import { useUniqueSvgIds } from '../../QuienTinderCards/useUniqueSvgIds';
import { SilhouetteFrame } from '../SilhouetteFrame';
import { getSilhouetteMetadata } from '../silhouetteMetadata';
import type { QuienSilhouetteProps } from '../types';

const SILHOUETTE_ID = 13 as const;

const DEFAULT_COLOR = '#67e8f9';

const headPath = `
  M 118,52
  C 108,46 98,48 94,56
  C 90,64 92,76 100,82
  C 108,88 120,80 122,70
  C 124,62 124,56 118,52
  Z
`;

const hoodPath = `
  M 94,56
  C 88,50 80,52 76,58
  C 72,64 70,74 74,82
  C 78,90 88,88 96,84
  C 92,80 90,68 94,56
  Z
`;

const torsoPath = `
  M 100,84
  C 92,88 86,96 84,108
  C 82,120 82,136 84,152
  C 86,168 92,180 96,188
  L 120,188
  C 124,180 128,168 128,152
  C 128,136 126,116 122,104
  C 118,92 112,86 100,84
  Z
`;

const leftLegPath = `
  M 96,188
  C 94,200 90,218 84,238
  C 80,254 76,270 72,284
  C 70,292 68,298 72,302
  C 76,306 82,302 86,296
  C 92,280 96,260 100,240
  C 102,224 100,206 98,192
  Z
`;

const rightLegPath = `
  M 114,188
  C 118,200 124,218 132,236
  C 138,252 144,268 150,282
  C 154,290 158,296 154,300
  C 150,304 144,300 140,292
  C 134,276 128,256 122,238
  C 116,222 114,204 114,192
  Z
`;

const leftArmPath = `
  M 90,96
  C 84,100 76,108 70,118
  C 64,128 60,140 58,150
  C 56,156 56,160 60,162
  C 64,164 66,160 68,154
  C 72,142 76,128 82,116
  C 86,108 88,100 90,96
  Z
`;

const rightArmPath = `
  M 120,98
  C 126,104 134,114 142,124
  C 148,132 154,140 158,146
  C 162,150 164,154 160,156
  C 156,158 152,152 148,146
  C 142,136 134,126 128,116
  C 124,108 122,100 120,98
  Z
`;

const cloakPath = `
  M 88,84
  C 80,86 68,92 56,100
  C 44,108 34,120 28,136
  C 22,152 20,172 24,192
  C 28,212 36,228 42,240
  C 46,248 48,252 44,258
  C 40,264 36,272 38,280
  C 40,284 46,282 50,274
  C 56,262 54,248 50,238
  C 44,224 38,206 36,188
  C 34,170 36,152 42,136
  C 48,120 58,108 68,100
  C 74,96 82,90 88,86
  Z
`;

const cloakInnerPath = `
  M 90,88
  C 82,92 72,100 62,112
  C 52,124 46,140 44,158
  C 42,176 44,196 48,212
  C 52,226 56,236 54,244
  C 52,250 50,256 52,260
  C 56,262 58,258 58,252
  C 58,244 56,232 52,218
  C 48,202 46,182 48,164
  C 50,146 56,128 66,114
  C 74,102 82,94 90,90
  Z
`;

const staffOrnamentPath = `
  M 48,28
  C 44,22 38,20 34,24
  C 30,28 32,36 38,38
  C 42,40 46,36 48,32
  Z
`;

const staffTop = { x: 48, y: 28 };
const staffBottom = { x: 76, y: 306 };
const staffRingCx = 46;
const staffRingCy = 42;

const lanternCx = 166;
const lanternCy = 138;

const lanternOuterPath = `
  M ${lanternCx},${lanternCy - 14}
  L ${lanternCx + 9},${lanternCy}
  L ${lanternCx},${lanternCy + 14}
  L ${lanternCx - 9},${lanternCy}
  Z
`;

const lanternInnerPath = `
  M ${lanternCx},${lanternCy - 8}
  L ${lanternCx + 5},${lanternCy}
  L ${lanternCx},${lanternCy + 8}
  L ${lanternCx - 5},${lanternCy}
  Z
`;

const lanternChainPath = `
  M 158,150
  C 160,146 162,142 ${lanternCx},${lanternCy + 10}
`;

const compassFragments = [
  { x: lanternCx + 16, y: lanternCy - 6, r: 2.5, rot: 15, o: 0.45 },
  { x: lanternCx - 14, y: lanternCy + 8, r: 2, rot: -25, o: 0.35 },
  { x: lanternCx + 10, y: lanternCy + 16, r: 1.8, rot: 40, o: 0.25 },
  { x: lanternCx - 8, y: lanternCy - 14, r: 2.2, rot: -10, o: 0.3 },
  { x: lanternCx + 18, y: lanternCy + 8, r: 1.5, rot: 55, o: 0.2 },
];

const footsteps = [
  { cx: 56, cy: 308, rx: 6, ry: 2.5, rot: -15, o: 0.06 },
  { cx: 38, cy: 312, rx: 5, ry: 2, rot: -10, o: 0.04 },
  { cx: 22, cy: 314, rx: 4, ry: 1.5, rot: -8, o: 0.02 },
];

const folds = [
  { d: 'M 100,100 C 98,130 96,160 96,188', w: 0.6, o: 0.12 },
  { d: 'M 110,96 C 112,130 116,160 118,186', w: 0.5, o: 0.1 },
  { d: 'M 94,110 C 90,140 88,170 92,186', w: 0.4, o: 0.08 },
  { d: 'M 118,108 C 122,138 126,162 124,184', w: 0.4, o: 0.08 },
  { d: 'M 86,150 C 94,147 108,146 126,150', w: 0.35, o: 0.06 },
];

const particles = [
  { x: 30, y: 148, r: 0.8, o: 0.25 },
  { x: 22, y: 172, r: 0.6, o: 0.18 },
  { x: 18, y: 196, r: 1.0, o: 0.2 },
  { x: 26, y: 220, r: 0.5, o: 0.15 },
  { x: 14, y: 160, r: 0.4, o: 0.1 },
  { x: 34, y: 240, r: 0.7, o: 0.12 },
  { x: 20, y: 252, r: 0.3, o: 0.08 },
  { x: 42, y: 22, r: 0.5, o: 0.12 },
  { x: 36, y: 16, r: 0.4, o: 0.08 },
  { x: 50, y: 12, r: 0.6, o: 0.1 },
  { x: 176, y: 126, r: 0.5, o: 0.22 },
  { x: 180, y: 148, r: 0.4, o: 0.18 },
  { x: 172, y: 158, r: 0.6, o: 0.15 },
];

const windStreaks = [
  { d: 'M 16,130 C 20,128 28,128 36,130', o: 0.06 },
  { d: 'M 10,160 C 16,158 24,157 32,158', o: 0.05 },
  { d: 'M 12,200 C 18,198 26,197 34,198', o: 0.04 },
  { d: 'M 18,232 C 24,230 30,230 36,232', o: 0.03 },
];

const staffGripY = [146, 150, 154, 158, 162];

/**
 * Wanderer: figura en movimiento, avanzando con paso firme.
 * Postura dinámica: bastón en mano izquierda, linterna flotante cerca de la derecha.
 * Capa ondeando. Simboliza el camino, la búsqueda y el desplazamiento.
 */
export function Wanderer({
  className = '',
  color = DEFAULT_COLOR,
  hideLabel = false,
}: QuienSilhouetteProps) {
  const svgId = useUniqueSvgIds('wanderer');
  const ids = {
    aura: svgId('aura'),
    glow: svgId('glow'),
    soft: svgId('soft'),
    lanternGlow: svgId('lantern-glow'),
    body: svgId('body'),
    cloak: svgId('cloak'),
    cloakIn: svgId('cloak-in'),
    edge: svgId('edge'),
    hood: svgId('hood'),
    lantern: svgId('lantern'),
    ground: svgId('ground'),
    staff: svgId('staff'),
    lightcast: svgId('lightcast'),
  };

  const meta = getSilhouetteMetadata(SILHOUETTE_ID);

  return (
    <SilhouetteFrame
      title={meta?.name ?? 'Caminante'}
      subtitle={meta?.subtitle ?? 'Camino'}
      variant={meta?.labelVariant ?? 'sky'}
      className={className}
      hideLabel={hideLabel}
    >
      <g transform="translate(100, 160) scale(0.87) translate(-100, -160)">
        <defs>
          <filter id={ids.aura}>
            <feGaussianBlur stdDeviation="12" />
          </filter>
          <filter id={ids.glow}>
            <feGaussianBlur stdDeviation="6" />
          </filter>
          <filter id={ids.soft}>
            <feGaussianBlur stdDeviation="2.5" />
          </filter>
          <filter id={ids.lanternGlow}>
            <feGaussianBlur stdDeviation="4" />
          </filter>

          <linearGradient id={ids.body} x1="0.3" y1="0" x2="0.7" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.55" />
            <stop offset="30%" stopColor={color} stopOpacity="0.4" />
            <stop offset="65%" stopColor={color} stopOpacity="0.22" />
            <stop offset="100%" stopColor={color} stopOpacity="0.06" />
          </linearGradient>

          <linearGradient id={ids.cloak} x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="40%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0.04" />
          </linearGradient>

          <linearGradient id={ids.cloakIn} x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.22" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>

          <linearGradient id={ids.edge} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0.45" />
            <stop offset="50%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0.05" />
          </linearGradient>

          <radialGradient id={ids.hood} cx="55%" cy="35%" r="55%">
            <stop offset="0%" stopColor="#000" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#000" stopOpacity="0.4" />
            <stop offset="100%" stopColor={color} stopOpacity="0.05" />
          </radialGradient>

          <radialGradient id={ids.lantern} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="0.95" />
            <stop offset="20%" stopColor="white" stopOpacity="0.6" />
            <stop offset="45%" stopColor={color} stopOpacity="0.35" />
            <stop offset="75%" stopColor={color} stopOpacity="0.08" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>

          <radialGradient id={ids.ground} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.08" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>

          <linearGradient id={ids.staff} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0.5" />
            <stop offset="30%" stopColor={color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={color} stopOpacity="0.1" />
          </linearGradient>

          <radialGradient id={ids.lightcast} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.12" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Ground shadow */}
        <ellipse cx="112" cy="304" rx="65" ry="8" fill={`url(#${ids.ground})`} />

        {footsteps.map((f, i) => (
          <ellipse
            key={i}
            cx={f.cx}
            cy={f.cy}
            rx={f.rx}
            ry={f.ry}
            fill={color}
            opacity={f.o}
            transform={`rotate(${f.rot}, ${f.cx}, ${f.cy})`}
          />
        ))}

        {/* Auras */}
        <g filter={`url(#${ids.aura})`} opacity="0.12">
          <path d={torsoPath} fill={color} />
          <path d={leftLegPath} fill={color} />
          <path d={rightLegPath} fill={color} />
          <path d={cloakPath} fill={color} />
          <path d={headPath} fill={color} />
        </g>
        <g filter={`url(#${ids.glow})`} opacity="0.18">
          <path d={torsoPath} fill={color} />
          <path d={leftLegPath} fill={color} />
          <path d={rightLegPath} fill={color} />
          <path d={cloakPath} fill={color} />
          <path d={headPath} fill={color} />
        </g>
        <g filter={`url(#${ids.soft})`} opacity="0.22">
          <path d={torsoPath} fill={color} />
          <path d={leftLegPath} fill={color} />
          <path d={rightLegPath} fill={color} />
          <path d={headPath} fill={color} />
        </g>

        {/* Cloak */}
        <path d={cloakPath} fill={`url(#${ids.cloak})`} />
        <path d={cloakPath} fill="none" stroke={color} strokeWidth="0.7" opacity="0.25" />
        <path d={cloakPath} fill="none" stroke="white" strokeWidth="0.25" opacity="0.1" />
        <path d={cloakInnerPath} fill={`url(#${ids.cloakIn})`} />
        <path d={cloakInnerPath} fill="none" stroke={color} strokeWidth="0.4" opacity="0.12" />
        <path
          d="M 78,94 C 64,110 52,132 44,156"
          fill="none"
          stroke={color}
          strokeWidth="0.4"
          opacity="0.08"
          strokeLinecap="round"
        />
        <path
          d="M 82,92 C 70,108 58,130 50,154 C 46,168 44,182 44,196"
          fill="none"
          stroke="white"
          strokeWidth="0.2"
          opacity="0.06"
          strokeLinecap="round"
        />
        <path
          d="M 74,96 C 62,116 50,142 42,168"
          fill="none"
          stroke={color}
          strokeWidth="0.3"
          opacity="0.06"
          strokeLinecap="round"
        />

        {/* Staff */}
        <line
          x1={staffTop.x}
          y1={staffTop.y}
          x2={staffBottom.x}
          y2={staffBottom.y}
          stroke={color}
          strokeWidth="4"
          opacity="0.06"
          filter={`url(#${ids.soft})`}
          strokeLinecap="round"
        />
        <line
          x1={staffTop.x}
          y1={staffTop.y}
          x2={staffBottom.x}
          y2={staffBottom.y}
          stroke={`url(#${ids.staff})`}
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <line
          x1={staffTop.x}
          y1={staffTop.y}
          x2={staffBottom.x}
          y2={staffBottom.y}
          stroke="white"
          strokeWidth="0.5"
          opacity="0.2"
          strokeLinecap="round"
        />
        <path d={staffOrnamentPath} fill={color} opacity="0.4" />
        <path d={staffOrnamentPath} fill="none" stroke="white" strokeWidth="0.4" opacity="0.3" />
        <path d={staffOrnamentPath} fill={color} opacity="0.15" filter={`url(#${ids.soft})`} />
        <circle cx={staffRingCx} cy={staffRingCy} r="4" fill="none" stroke={color} strokeWidth="0.8" opacity="0.3" />
        <circle cx={staffRingCx} cy={staffRingCy} r="4" fill="none" stroke="white" strokeWidth="0.25" opacity="0.15" />
        <circle cx={staffRingCx} cy={staffRingCy} r="1.5" fill={color} opacity="0.25" />
        <circle cx={staffRingCx} cy={staffRingCy} r="0.6" fill="white" opacity="0.4" />
        {staffGripY.map((yy, i) => {
          const xx =
            staffTop.x +
            (staffBottom.x - staffTop.x) * ((yy - staffTop.y) / (staffBottom.y - staffTop.y));
          return (
            <line
              key={i}
              x1={xx - 2}
              y1={yy - 0.5}
              x2={xx + 2}
              y2={yy + 0.5}
              stroke={color}
              strokeWidth="0.4"
              opacity={0.15 + i * 0.03}
              strokeLinecap="round"
            />
          );
        })}

        {/* Body */}
        <path d={headPath} fill={`url(#${ids.body})`} />
        <path d={torsoPath} fill={`url(#${ids.body})`} />
        <path d={leftLegPath} fill={`url(#${ids.body})`} />
        <path d={rightLegPath} fill={`url(#${ids.body})`} />
        <path d={leftArmPath} fill={`url(#${ids.body})`} />
        <path d={rightArmPath} fill={`url(#${ids.body})`} />
        <path d={hoodPath} fill={`url(#${ids.hood})`} />
        <ellipse cx="104" cy="68" rx="8" ry="10" fill="#000" opacity="0.6" />
        <ellipse cx="104" cy="68" rx="5" ry="7" fill="#000" opacity="0.8" />

        {/* Robe folds */}
        {folds.map((f, i) => (
          <g key={i}>
            <path
              d={f.d}
              fill="none"
              stroke="#000"
              strokeWidth={f.w + 0.3}
              opacity={f.o * 0.4}
              strokeLinecap="round"
              transform="translate(0.5, 0.5)"
            />
            <path d={f.d} fill="none" stroke={color} strokeWidth={f.w} opacity={f.o} strokeLinecap="round" />
            <path
              d={f.d}
              fill="none"
              stroke="white"
              strokeWidth={f.w * 0.35}
              opacity={f.o * 0.5}
              strokeLinecap="round"
            />
          </g>
        ))}

        {/* Edge luminescence */}
        <path d={torsoPath} fill="none" stroke={`url(#${ids.edge})`} strokeWidth="0.8" />
        <path d={torsoPath} fill="none" stroke="white" strokeWidth="0.2" opacity="0.12" />
        <path d={leftLegPath} fill="none" stroke={color} strokeWidth="0.5" opacity="0.2" />
        <path d={leftLegPath} fill="none" stroke="white" strokeWidth="0.15" opacity="0.08" />
        <path d={rightLegPath} fill="none" stroke={color} strokeWidth="0.5" opacity="0.2" />
        <path d={rightLegPath} fill="none" stroke="white" strokeWidth="0.15" opacity="0.08" />
        <path d={leftArmPath} fill="none" stroke={color} strokeWidth="0.5" opacity="0.2" />
        <path d={rightArmPath} fill="none" stroke={color} strokeWidth="0.5" opacity="0.2" />
        <path d={headPath} fill="none" stroke="white" strokeWidth="0.4" opacity="0.2" />

        {/* Lantern */}
        <circle cx={lanternCx} cy={lanternCy} r="40" fill={`url(#${ids.lightcast})`} />
        <path
          d={lanternChainPath}
          fill="none"
          stroke={color}
          strokeWidth="0.4"
          opacity="0.2"
          strokeDasharray="2 2"
          strokeLinecap="round"
        />
        <circle
          cx={lanternCx}
          cy={lanternCy}
          r="22"
          fill={`url(#${ids.lantern})`}
          opacity="0.15"
          filter={`url(#${ids.lanternGlow})`}
        />
        <path
          d={lanternOuterPath}
          fill="none"
          stroke={color}
          strokeWidth="1"
          opacity="0.45"
          strokeLinejoin="round"
        />
        <path
          d={lanternOuterPath}
          fill="none"
          stroke="white"
          strokeWidth="0.3"
          opacity="0.2"
          strokeLinejoin="round"
        />
        <path d={lanternInnerPath} fill={color} opacity="0.15" />
        <path
          d={lanternInnerPath}
          fill="none"
          stroke={color}
          strokeWidth="0.6"
          opacity="0.6"
          strokeLinejoin="round"
        />
        <path
          d={lanternInnerPath}
          fill="none"
          stroke="white"
          strokeWidth="0.25"
          opacity="0.35"
          strokeLinejoin="round"
        />
        <line
          x1={lanternCx}
          y1={lanternCy - 6}
          x2={lanternCx}
          y2={lanternCy + 6}
          stroke="white"
          strokeWidth="0.4"
          opacity="0.3"
        />
        <line
          x1={lanternCx - 4}
          y1={lanternCy}
          x2={lanternCx + 4}
          y2={lanternCy}
          stroke="white"
          strokeWidth="0.4"
          opacity="0.3"
        />
        <circle cx={lanternCx} cy={lanternCy} r="3" fill={color} opacity="0.5" />
        <circle cx={lanternCx} cy={lanternCy} r="1.5" fill="white" opacity="0.85" />
        <circle cx={lanternCx - 0.5} cy={lanternCy - 0.8} r="0.5" fill="white" opacity="0.7" />

        {compassFragments.map((f, i) => {
          const sz = f.r;
          const diamond = `M 0,${-sz} L ${sz * 0.6},0 L 0,${sz} L ${-sz * 0.6},0 Z`;
          return (
            <g key={i} transform={`translate(${f.x},${f.y}) rotate(${f.rot})`}>
              <path d={diamond} fill={color} opacity={f.o * 0.4} />
              <path d={diamond} fill="none" stroke="white" strokeWidth="0.25" opacity={f.o * 0.5} />
            </g>
          );
        })}

        {/* Wind streaks */}
        {windStreaks.map((w, i) => (
          <path
            key={i}
            d={w.d}
            fill="none"
            stroke={color}
            strokeWidth="0.4"
            opacity={w.o}
            strokeLinecap="round"
          />
        ))}

        {/* Particles */}
        {particles.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={p.r * 2.5} fill={color} opacity={p.o * 0.15} />
            <circle cx={p.x} cy={p.y} r={p.r} fill="white" opacity={p.o} />
          </g>
        ))}

        {/* Light interaction */}
        <ellipse
          cx="148"
          cy="130"
          rx="12"
          ry="18"
          fill={color}
          opacity="0.04"
          transform="rotate(15, 148, 130)"
        />
        <ellipse
          cx="140"
          cy="146"
          rx="8"
          ry="14"
          fill={color}
          opacity="0.03"
          transform="rotate(10, 140, 146)"
        />
      </g>
    </SilhouetteFrame>
  );
}
