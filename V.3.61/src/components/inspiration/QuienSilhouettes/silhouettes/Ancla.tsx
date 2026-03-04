import { useUniqueSvgIds } from '../../QuienTinderCards/useUniqueSvgIds';
import { SilhouetteFrame } from '../SilhouetteFrame';
import { getSilhouetteMetadata } from '../silhouetteMetadata';
import type { QuienSilhouetteProps } from '../types';

const SILHOUETTE_ID = 2 as const;

const DEFAULT_COLOR = '#f59e0b';

const cx = 100;
const cy = 150;

const rootsLeft = [
  { dx: -8, angle: 200, len: 28, branches: [{ dx: -6, angle: 220, len: 14 }, { dx: 4, angle: 190, len: 12 }] },
  { dx: -16, angle: 215, len: 22, branches: [{ dx: -8, angle: 240, len: 10 }, { dx: 2, angle: 200, len: 9 }] },
  { dx: -22, angle: 230, len: 18, branches: [{ dx: -5, angle: 250, len: 8 }] },
];

const rootsRight = [
  { dx: 8, angle: 340, len: 28, branches: [{ dx: 6, angle: 320, len: 14 }, { dx: -4, angle: 350, len: 12 }] },
  { dx: 16, angle: 325, len: 22, branches: [{ dx: 8, angle: 300, len: 10 }, { dx: -2, angle: 340, len: 9 }] },
  { dx: 22, angle: 310, len: 18, branches: [{ dx: 5, angle: 290, len: 8 }] },
];

const chainAnchors = [
  { sx: cx - 18, sy: cy - 52, angle: 220, count: 5 },
  { sx: cx + 18, sy: cy - 52, angle: 320, count: 5 },
  { sx: cx - 14, sy: cy - 48, angle: 180, count: 4 },
  { sx: cx + 14, sy: cy - 48, angle: 0, count: 4 },
];

const toRad = (deg: number) => (deg * Math.PI) / 180;

const torsoFolds = [
  { x1: cx - 10, y1: cy - 10, x2: cx - 8, y2: cy + 20 },
  { x1: cx, y1: cy - 12, x2: cx, y2: cy + 22 },
  { x1: cx + 10, y1: cy - 10, x2: cx + 8, y2: cy + 20 },
];

const particles = [
  { x: cx - 35, y: cy - 40, r: 1.2, o: 0.6 },
  { x: cx + 38, y: cy - 35, r: 0.8, o: 0.5 },
  { x: cx - 42, y: cy + 10, r: 1.0, o: 0.4 },
  { x: cx + 40, y: cy + 15, r: 1.4, o: 0.6 },
  { x: cx - 30, y: cy + 40, r: 0.8, o: 0.5 },
  { x: cx + 32, y: cy + 38, r: 1.0, o: 0.4 },
  { x: cx - 20, y: cy - 65, r: 0.6, o: 0.4 },
  { x: cx + 22, y: cy - 68, r: 0.8, o: 0.5 },
  { x: cx - 50, y: cy - 10, r: 0.7, o: 0.3 },
  { x: cx + 48, y: cy - 5, r: 0.9, o: 0.4 },
];

/**
 * Ancla: figura con raíces y cadenas, brazos cruzados, capucha.
 * Simboliza arraigo, estabilidad y conexión a la tierra.
 */
export function Ancla({
  className = '',
  color = DEFAULT_COLOR,
  hideLabel = false,
}: QuienSilhouetteProps) {
  const svgId = useUniqueSvgIds('ancla');
  const g = (name: string) => svgId(name);

  const meta = getSilhouetteMetadata(SILHOUETTE_ID);

  return (
    <SilhouetteFrame
      title={meta?.name ?? 'Ancla'}
      subtitle={meta?.subtitle ?? 'Raíces'}
      variant={meta?.labelVariant ?? 'amber'}
      className={className}
      hideLabel={hideLabel}
    >
      <g transform="translate(100, 160) scale(1.24) translate(-100, -160) translate(0, 28)">
        <defs>
          <radialGradient id={g('aura1')} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.18" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={g('aura2')} cx="50%" cy="60%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.12" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={g('body')} cx="40%" cy="25%" r="65%">
            <stop offset="0%" stopColor={color} stopOpacity="0.75" />
            <stop offset="60%" stopColor={color} stopOpacity="0.55" />
            <stop offset="100%" stopColor={color} stopOpacity="0.15" />
          </radialGradient>
          <radialGradient id={g('ground')} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.22" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={g('blur1')} cx="50%" cy="80%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
          <linearGradient id={g('bodyGrad')} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.85" />
            <stop offset="100%" stopColor={color} stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Aura de masa */}
        <ellipse cx={cx} cy={cy} rx="68" ry="85" fill={`url(#${g('aura1')})`} />
        <ellipse cx={cx} cy={cy + 10} rx="55" ry="70" fill={`url(#${g('aura2')})`} />

        {/* Halo de tierra bajo los pies */}
        <ellipse cx={cx} cy={cy + 62} rx="42" ry="8" fill={`url(#${g('ground')})`} />
        <ellipse cx={cx} cy={cy + 62} rx="28" ry="5" fill={`url(#${g('blur1')})`} />

        {/* Raíces izquierda */}
        {rootsLeft.map((r, i) => {
          const fx = cx - 12 + r.dx;
          const fy = cy + 62;
          const ex = fx + Math.cos(toRad(r.angle)) * r.len;
          const ey = fy + Math.sin(toRad(r.angle)) * r.len;
          return (
            <g key={`rl-${i}`} opacity={0.9 - i * 0.15}>
              <path
                d={`M${fx},${fy} Q${(fx + ex) / 2 - 4},${(fy + ey) / 2 + 3} ${ex},${ey}`}
                stroke={color}
                strokeWidth={1.8 - i * 0.3}
                fill="none"
                opacity="0.6"
              />
              <path
                d={`M${fx},${fy} Q${(fx + ex) / 2 - 4},${(fy + ey) / 2 + 3} ${ex},${ey}`}
                stroke="white"
                strokeWidth={0.5}
                fill="none"
                opacity="0.4"
              />
              {r.branches.map((b, j) => {
                const bx = ex + b.dx;
                const bex = bx + Math.cos(toRad(b.angle)) * b.len;
                const bey = ey + Math.sin(toRad(b.angle)) * b.len;
                return (
                  <path
                    key={j}
                    d={`M${ex},${ey} Q${(bx + bex) / 2},${(ey + bey) / 2 + 2} ${bex},${bey}`}
                    stroke={color}
                    strokeWidth={0.8}
                    fill="none"
                    opacity="0.4"
                  />
                );
              })}
            </g>
          );
        })}

        {/* Raíces derecha */}
        {rootsRight.map((r, i) => {
          const fx = cx + 12 + r.dx;
          const fy = cy + 62;
          const ex = fx + Math.cos(toRad(r.angle)) * r.len;
          const ey = fy + Math.sin(toRad(r.angle)) * r.len;
          return (
            <g key={`rr-${i}`} opacity={0.9 - i * 0.15}>
              <path
                d={`M${fx},${fy} Q${(fx + ex) / 2 + 4},${(fy + ey) / 2 + 3} ${ex},${ey}`}
                stroke={color}
                strokeWidth={1.8 - i * 0.3}
                fill="none"
                opacity="0.6"
              />
              <path
                d={`M${fx},${fy} Q${(fx + ex) / 2 + 4},${(fy + ey) / 2 + 3} ${ex},${ey}`}
                stroke="white"
                strokeWidth={0.5}
                fill="none"
                opacity="0.4"
              />
              {r.branches.map((b, j) => {
                const bx = ex + b.dx;
                const bex = bx + Math.cos(toRad(b.angle)) * b.len;
                const bey = ey + Math.sin(toRad(b.angle)) * b.len;
                return (
                  <path
                    key={j}
                    d={`M${ex},${ey} Q${(bx + bex) / 2},${(ey + bey) / 2 + 2} ${bex},${bey}`}
                    stroke={color}
                    strokeWidth={0.8}
                    fill="none"
                    opacity="0.4"
                  />
                );
              })}
            </g>
          );
        })}

        {/* Cadenas desde hombros */}
        {chainAnchors.map((chain, ci) => {
          const links = [];
          let lx = chain.sx;
          let ly = chain.sy;
          const step = 10 + ci * 1.5;
          for (let k = 0; k < chain.count; k++) {
            const nx = lx + Math.cos(toRad(chain.angle)) * step;
            const ny = ly + Math.sin(toRad(chain.angle)) * step;
            const scale = 1 - k * 0.12;
            const w = 6 * scale;
            const h = 4 * scale;
            const mx = (lx + nx) / 2;
            const my = (ly + ny) / 2;
            links.push(
              <g key={k} opacity={0.9 - k * 0.15}>
                <ellipse
                  cx={mx}
                  cy={my}
                  rx={w}
                  ry={h}
                  stroke={color}
                  strokeWidth={0.8}
                  fill="none"
                  opacity="0.5"
                />
                <ellipse
                  cx={mx}
                  cy={my}
                  rx={w * 0.5}
                  ry={h * 0.5}
                  stroke={color}
                  strokeWidth={0.4}
                  fill="none"
                  opacity="0.3"
                />
                <circle cx={mx - w * 0.3} cy={my - h * 0.3} r={0.6} fill="white" opacity="0.6" />
              </g>
            );
            lx = nx;
            ly = ny;
          }
          return <g key={ci}>{links}</g>;
        })}

        {/* Aura exterior figura */}
        <ellipse cx={cx} cy={cy - 10} rx="22" ry="38" fill={`url(#${g('aura1')})`} opacity="0.5" />

        {/* Pierna izquierda */}
        <path
          d={`M${cx - 10},${cy + 30} L${cx - 14},${cy + 62} L${cx - 6},${cy + 62} L${cx - 4},${cy + 30}`}
          fill={`url(#${g('bodyGrad')})`}
        />
        <path
          d={`M${cx - 16},${cy + 62} L${cx - 24},${cy + 64} L${cx - 22},${cy + 67} L${cx - 4},${cy + 66} L${cx - 4},${cy + 62}`}
          fill={color}
          opacity="0.7"
        />

        {/* Pierna derecha */}
        <path
          d={`M${cx + 10},${cy + 30} L${cx + 14},${cy + 62} L${cx + 6},${cy + 62} L${cx + 4},${cy + 30}`}
          fill={`url(#${g('bodyGrad')})`}
        />
        <path
          d={`M${cx + 16},${cy + 62} L${cx + 24},${cy + 64} L${cx + 22},${cy + 67} L${cx + 4},${cy + 66} L${cx + 4},${cy + 62}`}
          fill={color}
          opacity="0.7"
        />

        {/* Torso */}
        <path
          d={`M${cx - 18},${cy - 15} Q${cx - 20},${cy + 5} ${cx - 14},${cy + 30} L${cx + 14},${cy + 30} Q${cx + 20},${cy + 5} ${cx + 18},${cy - 15} Z`}
          fill={`url(#${g('body')})`}
        />

        {/* Brazos cruzados */}
        <path
          d={`M${cx + 18},${cy - 30} Q${cx + 22},${cy - 18} ${cx - 14},${cy - 8}`}
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
          opacity="0.65"
        />
        <path
          d={`M${cx + 18},${cy - 30} Q${cx + 22},${cy - 18} ${cx - 14},${cy - 8}`}
          stroke="white"
          strokeWidth="1"
          strokeLinecap="round"
          fill="none"
          opacity="0.3"
        />
        <path
          d={`M${cx - 18},${cy - 30} Q${cx - 22},${cy - 18} ${cx + 14},${cy - 8}`}
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
          opacity="0.55"
        />
        <path
          d={`M${cx - 18},${cy - 30} Q${cx - 22},${cy - 18} ${cx + 14},${cy - 8}`}
          stroke="white"
          strokeWidth="1"
          strokeLinecap="round"
          fill="none"
          opacity="0.25"
        />

        {/* Manos */}
        <ellipse cx={cx - 14} cy={cy - 8} rx="4" ry="3" fill={color} opacity="0.7" />
        <ellipse cx={cx + 14} cy={cy - 8} rx="4" ry="3" fill={color} opacity="0.7" />

        {/* Cuello */}
        <rect x={cx - 5} y={cy - 52} width="10" height="10" rx="3" fill={`url(#${g('bodyGrad')})`} />

        {/* Cabeza y capucha */}
        <ellipse cx={cx} cy={cy - 62} rx="13" ry="14" fill={`url(#${g('body')})`} />
        <ellipse cx={cx} cy={cy - 60} rx="8" ry="9" fill="black" opacity="0.6" />
        <ellipse cx={cx} cy={cy - 58} rx="5" ry="6" fill="black" opacity="0.8" />
        <path
          d={`M${cx - 13},${cy - 62} Q${cx - 16},${cy - 78} ${cx},${cy - 82} Q${cx + 16},${cy - 78} ${cx + 13},${cy - 62}`}
          fill={`url(#${g('bodyGrad')})`}
        />

        {/* Hombros */}
        <ellipse cx={cx - 18} cy={cy - 48} rx="7" ry="5" fill={color} opacity="0.6" />
        <ellipse cx={cx + 18} cy={cy - 48} rx="7" ry="5" fill={color} opacity="0.6" />

        {/* Borde luminoso */}
        <ellipse
          cx={cx}
          cy={cy - 10}
          rx="22"
          ry="50"
          stroke={color}
          strokeWidth="1"
          fill="none"
          opacity="0.25"
        />
        <ellipse
          cx={cx}
          cy={cy - 10}
          rx="21"
          ry="49"
          stroke="white"
          strokeWidth="0.4"
          fill="none"
          opacity="0.2"
        />

        {/* Pliegues del torso */}
        {torsoFolds.map((f, i) => (
          <g key={i}>
            <line
              x1={f.x1}
              y1={f.y1}
              x2={f.x2}
              y2={f.y2}
              stroke="black"
              strokeWidth="1.2"
              opacity="0.25"
            />
            <line
              x1={f.x1 + 0.8}
              y1={f.y1}
              x2={f.x2 + 0.8}
              y2={f.y2}
              stroke="white"
              strokeWidth="0.5"
              opacity="0.2"
            />
          </g>
        ))}

        {/* Partículas */}
        {particles.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={p.r * 2.5} fill={color} opacity={p.o * 0.2} />
            <circle cx={p.x} cy={p.y} r={p.r} fill={color} opacity={p.o} />
            <circle
              cx={p.x - p.r * 0.3}
              cy={p.y - p.r * 0.3}
              r={p.r * 0.4}
              fill="white"
              opacity={0.7}
            />
          </g>
        ))}
      </g>
    </SilhouetteFrame>
  );
}
