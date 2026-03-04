import { useUniqueSvgIds } from '../../QuienTinderCards/useUniqueSvgIds';
import { SilhouetteFrame } from '../SilhouetteFrame';
import { getSilhouetteMetadata } from '../silhouetteMetadata';
import type { QuienSilhouetteProps } from '../types';

const SILHOUETTE_ID = 18 as const;

const DEFAULT_COLOR = '#e879f9';

const cx = 100;

const vertices = [
  { x: 100, y: 28 },
  { x: 128, y: 42 },
  { x: 72, y: 42 },
  { x: 138, y: 68 },
  { x: 62, y: 68 },
  { x: 130, y: 92 },
  { x: 70, y: 92 },
  { x: 100, y: 108 },
];

const edges: [number, number, number][] = [
  [0, 1, 1.0],
  [0, 2, 1.0],
  [1, 2, 0.8],
  [1, 3, 1.0],
  [2, 4, 0.9],
  [3, 4, 0.6],
  [3, 5, 0.8],
  [4, 6, 0.7],
  [5, 6, 0.4],
  [5, 7, 0.3],
  [6, 7, 0.2],
  [0, 3, 0.5],
  [0, 4, 0.5],
];

const leftHandEnergyX = [62, 65, 68, 72, 75];
const rightHandEnergyX = [138, 136, 133, 129, 126];

const particles = [
  { x: 52, y: 55, r: 1.5, o: 0.6 },
  { x: 148, y: 48, r: 1.2, o: 0.5 },
  { x: 40, y: 80, r: 1.0, o: 0.4 },
  { x: 158, y: 75, r: 1.3, o: 0.5 },
  { x: 45, y: 110, r: 0.8, o: 0.3 },
  { x: 155, y: 105, r: 1.0, o: 0.4 },
  { x: 58, y: 35, r: 1.2, o: 0.5 },
  { x: 142, y: 32, r: 0.9, o: 0.4 },
  { x: 80, y: 22, r: 1.0, o: 0.5 },
  { x: 120, y: 20, r: 1.1, o: 0.4 },
];

/**
 * Sculptor: figura que moldea un poliedro irregular con las manos.
 * Simboliza la creación, la forma y la construcción.
 */
export function Sculptor({
  className = '',
  color = DEFAULT_COLOR,
  hideLabel = false,
}: QuienSilhouetteProps) {
  const svgId = useUniqueSvgIds('sculptor');
  const ids = {
    aura1: svgId('aura1'),
    aura2: svgId('aura2'),
    aura3: svgId('aura3'),
    bodyGrad: svgId('bodyGrad'),
    creationHalo: svgId('creationHalo'),
    mask: svgId('mask'),
  };

  const meta = getSilhouetteMetadata(SILHOUETTE_ID);

  return (
    <SilhouetteFrame
      title={meta?.name ?? 'Ideador'}
      subtitle={meta?.subtitle ?? 'Creativo'}
      variant={meta?.labelVariant ?? 'fuchsia'}
      className={className}
      hideLabel={hideLabel}
    >
      <g transform="translate(100, 160) scale(1.15) translate(-100, -160) translate(0, 20)">
        <defs>
          <radialGradient id={ids.aura1} cx="50%" cy="45%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.18" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={ids.aura2} cx="50%" cy="45%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.10" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={ids.aura3} cx="50%" cy="45%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="0.05" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={ids.bodyGrad} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.9" />
            <stop offset="50%" stopColor={color} stopOpacity="0.7" />
            <stop offset="100%" stopColor={color} stopOpacity="0.2" />
          </linearGradient>
          <radialGradient id={ids.creationHalo} cx="50%" cy="35%" r="40%">
            <stop offset="0%" stopColor={color} stopOpacity="0.22" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
          <mask id={ids.mask}>
            <rect width="200" height="280" fill="white" />
          </mask>
        </defs>

        <g mask={`url(#${ids.mask})`}>
          <ellipse cx={cx} cy={140} rx={90} ry={110} fill={`url(#${ids.aura1})`} />
          <ellipse cx={cx} cy={140} rx={70} ry={85} fill={`url(#${ids.aura2})`} />
          <ellipse cx={cx} cy={140} rx={50} ry={65} fill={`url(#${ids.aura3})`} />

          <ellipse cx={cx} cy={68} rx={55} ry={52} fill={`url(#${ids.creationHalo})`} />

          {edges.map(([a, b, completion], i) => {
            const va = vertices[a];
            const vb = vertices[b];
            const dashLen = completion * 20;
            const gapLen = (1 - completion) * 12;
            return (
              <g key={i}>
                <line
                  x1={va.x}
                  y1={va.y}
                  x2={vb.x}
                  y2={vb.y}
                  stroke={color}
                  strokeWidth={4}
                  opacity={completion * 0.15}
                  strokeDasharray={completion < 0.8 ? `${dashLen} ${gapLen}` : 'none'}
                />
                <line
                  x1={va.x}
                  y1={va.y}
                  x2={vb.x}
                  y2={vb.y}
                  stroke={color}
                  strokeWidth={completion > 0.7 ? 1.2 : 0.7}
                  opacity={completion * 0.85}
                  strokeDasharray={completion < 0.8 ? `${dashLen} ${gapLen}` : 'none'}
                />
                {completion > 0.7 && (
                  <line
                    x1={va.x}
                    y1={va.y}
                    x2={vb.x}
                    y2={vb.y}
                    stroke="white"
                    strokeWidth={0.4}
                    opacity={completion * 0.6}
                  />
                )}
              </g>
            );
          })}

          {vertices.map((v, i) => {
            const brightness = 1 - i * 0.1;
            return (
              <g key={i}>
                <circle cx={v.x} cy={v.y} r={5} fill={color} opacity={brightness * 0.15} />
                <circle cx={v.x} cy={v.y} r={2.5} fill={color} opacity={brightness * 0.7} />
                <circle cx={v.x} cy={v.y} r={1} fill="white" opacity={brightness * 0.9} />
              </g>
            );
          })}

          <ellipse cx={cx} cy={128} rx={9} ry={10} fill={`url(#${ids.bodyGrad})`} opacity={0.85} />
          <ellipse cx={cx} cy={125} rx={5} ry={4} fill="black" opacity={0.6} />
          <ellipse cx={cx} cy={124} rx={3} ry={2.5} fill={color} opacity={0.15} />

          <rect x={97} y={136} width={6} height={8} rx={2} fill={`url(#${ids.bodyGrad})`} opacity={0.7} />

          <path
            d="M 88,144 Q 84,162 86,182 Q 100,186 114,182 Q 116,162 112,144 Z"
            fill={`url(#${ids.bodyGrad})`}
            opacity={0.75}
          />
          <path d="M 95,148 Q 93,165 94,178" stroke="white" strokeWidth={0.5} opacity={0.3} fill="none" />
          <path d="M 105,148 Q 107,165 106,178" stroke="white" strokeWidth={0.5} opacity={0.3} fill="none" />

          <path
            d="M 88,148 Q 78,138 70,122 Q 66,114 68,108"
            stroke={`url(#${ids.bodyGrad})`}
            strokeWidth={5}
            fill="none"
            opacity={0.8}
            strokeLinecap="round"
          />
          <path
            d="M 88,148 Q 78,138 70,122 Q 66,114 68,108"
            stroke="white"
            strokeWidth={0.6}
            fill="none"
            opacity={0.3}
            strokeLinecap="round"
          />
          <path d="M 68,108 Q 64,104 62,100" stroke={color} strokeWidth={1.5} fill="none" opacity={0.8} strokeLinecap="round" />
          <path d="M 68,108 Q 65,103 65,98" stroke={color} strokeWidth={1.2} fill="none" opacity={0.7} strokeLinecap="round" />
          <path d="M 68,108 Q 67,102 68,97" stroke={color} strokeWidth={1.0} fill="none" opacity={0.6} strokeLinecap="round" />
          <path d="M 68,108 Q 70,103 72,99" stroke={color} strokeWidth={0.9} fill="none" opacity={0.5} strokeLinecap="round" />
          <path d="M 68,108 Q 72,104 75,101" stroke={color} strokeWidth={0.8} fill="none" opacity={0.4} strokeLinecap="round" />

          <path
            d="M 112,148 Q 122,140 130,126 Q 134,118 132,112"
            stroke={`url(#${ids.bodyGrad})`}
            strokeWidth={5}
            fill="none"
            opacity={0.8}
            strokeLinecap="round"
          />
          <path
            d="M 112,148 Q 122,140 130,126 Q 134,118 132,112"
            stroke="white"
            strokeWidth={0.6}
            fill="none"
            opacity={0.3}
            strokeLinecap="round"
          />
          <path d="M 132,112 Q 136,108 138,104" stroke={color} strokeWidth={1.5} fill="none" opacity={0.8} strokeLinecap="round" />
          <path d="M 132,112 Q 135,107 136,102" stroke={color} strokeWidth={1.2} fill="none" opacity={0.7} strokeLinecap="round" />
          <path d="M 132,112 Q 133,106 133,101" stroke={color} strokeWidth={1.0} fill="none" opacity={0.6} strokeLinecap="round" />
          <path d="M 132,112 Q 130,107 129,102" stroke={color} strokeWidth={0.9} fill="none" opacity={0.5} strokeLinecap="round" />
          <path d="M 132,112 Q 128,108 126,104" stroke={color} strokeWidth={0.8} fill="none" opacity={0.4} strokeLinecap="round" />

          {leftHandEnergyX.map((x, i) => (
            <circle key={i} cx={x} cy={100 - i} r={1.2} fill={color} opacity={0.7} />
          ))}
          {rightHandEnergyX.map((x, i) => (
            <circle key={i} cx={x} cy={104 - i * 2} r={1.2} fill={color} opacity={0.7} />
          ))}

          <path
            d="M 92,182 Q 90,200 88,218 Q 86,228 87,238"
            stroke={`url(#${ids.bodyGrad})`}
            strokeWidth={7}
            fill="none"
            opacity={0.75}
            strokeLinecap="round"
          />
          <path d="M 92,182 Q 90,200 88,218 Q 86,228 87,238" stroke="white" strokeWidth={0.8} fill="none" opacity={0.2} strokeLinecap="round" />
          <ellipse cx={85} cy={240} rx={8} ry={3} fill={color} opacity={0.5} />

          <path
            d="M 108,182 Q 110,200 112,218 Q 114,228 113,238"
            stroke={`url(#${ids.bodyGrad})`}
            strokeWidth={7}
            fill="none"
            opacity={0.75}
            strokeLinecap="round"
          />
          <path d="M 108,182 Q 110,200 112,218 Q 114,228 113,238" stroke="white" strokeWidth={0.8} fill="none" opacity={0.2} strokeLinecap="round" />
          <ellipse cx={115} cy={240} rx={8} ry={3} fill={color} opacity={0.5} />

          <ellipse cx={cx} cy={248} rx={28} ry={4} fill={color} opacity={0.08} />

          {vertices.slice(5).map((v, i) => (
            <g key={i}>
              <circle cx={v.x} cy={v.y} r={6} fill={color} opacity={0.08} />
              <circle cx={v.x + 4} cy={v.y - 4} r={1.5} fill={color} opacity={0.6} />
              <circle cx={v.x - 5} cy={v.y - 2} r={1} fill="white" opacity={0.7} />
              <circle cx={v.x + 2} cy={v.y + 5} r={0.8} fill={color} opacity={0.5} />
            </g>
          ))}

          {particles.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={color} opacity={p.o} />
          ))}
        </g>
      </g>
    </SilhouetteFrame>
  );
}
