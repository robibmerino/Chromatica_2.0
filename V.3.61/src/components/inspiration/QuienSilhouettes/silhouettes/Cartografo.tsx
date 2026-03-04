import { useUniqueSvgIds } from '../../QuienTinderCards/useUniqueSvgIds';
import { SilhouetteFrame } from '../SilhouetteFrame';
import { getSilhouetteMetadata } from '../silhouetteMetadata';
import type { QuienSilhouetteProps } from '../types';

const SILHOUETTE_ID = 4 as const;

const DEFAULT_COLOR = '#fb923c';

const gridLongitudinal = [-40, -22, -6, 10, 26, 42, 58];
const gridTransverse = [222, 230, 238, 246, 254];

const constellations = [
  { points: [[68, 230], [75, 225], [82, 228]], lines: [[0, 1], [1, 2]] },
  { points: [[95, 222], [100, 226], [108, 223], [114, 228]], lines: [[0, 1], [1, 2], [2, 3]] },
  { points: [[120, 235], [128, 230], [135, 234], [130, 240]], lines: [[0, 1], [1, 2], [2, 3]] },
  { points: [[78, 245], [85, 242], [90, 248]], lines: [[0, 1], [1, 2]] },
  { points: [[112, 248], [118, 244], [125, 250]], lines: [[0, 1], [1, 2]] },
];

const mantleFolds = [[83, 232, 74, 244], [86, 233, 78, 246], [90, 234, 85, 247]];

const torsoFolds = [
  'M 96,195 Q 93,185 94,175',
  'M 100,197 Q 97,187 98,177',
  'M 104,196 Q 102,186 103,176',
  'M 108,194 Q 107,184 107,175',
];

const leftFingers = [[-3, -1], [-2, 3], [1, 4], [4, 3], [5, -1]];
const rightFingers = [[1, 2], [3, 1], [5, -1], [6, -3]];

const particles = [
  { cx: 72, cy: 185, r: 0.8, o: 0.6 },
  { cx: 65, cy: 200, r: 1.2, o: 0.5 },
  { cx: 130, cy: 178, r: 0.9, o: 0.55 },
  { cx: 135, cy: 195, r: 0.7, o: 0.45 },
  { cx: 80, cy: 155, r: 1.0, o: 0.5 },
  { cx: 120, cy: 150, r: 0.8, o: 0.45 },
  { cx: 60, cy: 215, r: 1.1, o: 0.4 },
  { cx: 140, cy: 210, r: 0.9, o: 0.4 },
  { cx: 95, cy: 148, r: 0.7, o: 0.35 },
  { cx: 112, cy: 145, r: 1.0, o: 0.4 },
  { cx: 68, cy: 168, r: 0.6, o: 0.35 },
  { cx: 132, cy: 165, r: 0.8, o: 0.35 },
];

/**
 * Cartógrafo: figura arrodillada sobre mapa estelar, con compás y mano señalando destino.
 * Simboliza la exploración, la orientación y el descubrimiento.
 */
export function Cartografo({
  className = '',
  color = DEFAULT_COLOR,
  hideLabel = false,
}: QuienSilhouetteProps) {
  const svgId = useUniqueSvgIds('cartografo');
  const ids = {
    aura1: svgId('aura1'),
    aura2: svgId('aura2'),
    body: svgId('body'),
    map: svgId('map'),
    dest: svgId('dest'),
    blur1: svgId('blur1'),
    blur2: svgId('blur2'),
    blur3: svgId('blur3'),
  };

  const meta = getSilhouetteMetadata(SILHOUETTE_ID);

  return (
    <SilhouetteFrame
      title={meta?.name ?? 'Cartógrafo'}
      subtitle={meta?.subtitle ?? 'Exploración'}
      variant={meta?.labelVariant ?? 'amber'}
      className={className}
      hideLabel={hideLabel}
    >
      <g transform="translate(100, 160) scale(1.45) translate(-100, -160) translate(-4, -24)">
        <defs>
          <radialGradient id={ids.aura1} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.18" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={ids.aura2} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.28" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={ids.body} cx="40%" cy="25%" r="70%">
            <stop offset="0%" stopColor="white" stopOpacity="0.55" />
            <stop offset="45%" stopColor={color} stopOpacity="0.85" />
            <stop offset="100%" stopColor={color} stopOpacity="0.15" />
          </radialGradient>
          <radialGradient id={ids.map} cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor={color} stopOpacity="0.22" />
            <stop offset="100%" stopColor={color} stopOpacity="0.04" />
          </radialGradient>
          <radialGradient id={ids.dest} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="40%" stopColor={color} stopOpacity="0.9" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
          <filter id={ids.blur1}>
            <feGaussianBlur stdDeviation="10" />
          </filter>
          <filter id={ids.blur2}>
            <feGaussianBlur stdDeviation="5" />
          </filter>
          <filter id={ids.blur3}>
            <feGaussianBlur stdDeviation="2" />
          </filter>
        </defs>

        {/* Aura profunda */}
        <ellipse cx="100" cy="200" rx="70" ry="55" fill={`url(#${ids.aura1})`} filter={`url(#${ids.blur1})`} />
        <ellipse cx="100" cy="195" rx="50" ry="40" fill={`url(#${ids.aura2})`} filter={`url(#${ids.blur2})`} />

        {/* === MAPA ESTELAR EN EL SUELO === */}
        <ellipse cx="105" cy="240" rx="62" ry="22" fill={`url(#${ids.map})`} opacity="0.7" />
        <ellipse cx="105" cy="240" rx="62" ry="22" fill="none" stroke={color} strokeWidth="0.5" opacity="0.3" />

        {/* Grid en perspectiva - líneas longitudinales */}
        {gridLongitudinal.map((dx, i) => (
          <line
            key={`gl${i}`}
            x1={105 + dx * 0.95}
            y1={220}
            x2={105 + dx}
            y2={260}
            stroke={color}
            strokeWidth="0.4"
            opacity="0.25"
          />
        ))}
        {/* Grid en perspectiva - líneas transversales */}
        {gridTransverse.map((y, i) => {
          const t = (y - 220) / 40;
          const rx = 62 * (0.3 + t * 0.7);
          return (
            <ellipse
              key={`gt${i}`}
              cx="105"
              cy={y}
              rx={rx}
              ry={rx * 0.35}
              fill="none"
              stroke={color}
              strokeWidth="0.4"
              opacity="0.2"
            />
          );
        })}

        {/* Constelaciones en el mapa */}
        {constellations.map((c, ci) => (
          <g key={`con${ci}`}>
            {c.lines.map(([a, b], li) => (
              <line
                key={`cl${li}`}
                x1={c.points[a][0]}
                y1={c.points[a][1]}
                x2={c.points[b][0]}
                y2={c.points[b][1]}
                stroke={color}
                strokeWidth="0.5"
                opacity="0.4"
              />
            ))}
            {c.points.map(([px, py], pi) => (
              <circle
                key={`cp${pi}`}
                cx={px}
                cy={py}
                r={pi === 0 ? 1.5 : 1}
                fill={color}
                opacity={pi === 0 ? 0.8 : 0.5}
              />
            ))}
          </g>
        ))}

        {/* Anillo de coordenadas */}
        <ellipse
          cx="105"
          cy="240"
          rx="58"
          ry="20"
          fill="none"
          stroke={color}
          strokeWidth="0.6"
          strokeDasharray="3 4"
          opacity="0.35"
        />
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i / 12) * Math.PI * 2;
          const x = 105 + Math.cos(a) * 58;
          const y = 240 + Math.sin(a) * 20;
          return <circle key={`cm${i}`} cx={x} cy={y} r="0.8" fill={color} opacity="0.5" />;
        })}

        {/* Punto de destino */}
        <circle cx="108" cy="233" r="5" fill={`url(#${ids.dest})`} opacity="0.7" />
        <circle cx="108" cy="233" r="2" fill={color} opacity="0.9" />
        <circle cx="108" cy="233" r="0.8" fill="white" opacity="1" />
        <line x1="105" y1="233" x2="111" y2="233" stroke={color} strokeWidth="0.5" opacity="0.6" />
        <line x1="108" y1="230" x2="108" y2="236" stroke={color} strokeWidth="0.5" opacity="0.6" />

        {/* === SILUETA DE LA FIGURA === */}
        <ellipse cx="88" cy="235" rx="6" ry="3.5" fill={`url(#${ids.body})`} opacity="0.5" />

        {/* Pierna trasera (arrodillada) */}
        <path
          d="M 88,235 Q 84,220 86,205 Q 88,198 92,200"
          fill="none"
          stroke={`url(#${ids.body})`}
          strokeWidth="8"
          strokeLinecap="round"
          opacity="0.7"
        />
        <path
          d="M 88,235 Q 84,220 86,205 Q 88,198 92,200"
          fill="none"
          stroke="white"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.2"
        />

        {/* Pierna delantera (elevada) */}
        <path
          d="M 115,230 Q 118,215 114,205 Q 111,198 108,200"
          fill="none"
          stroke={`url(#${ids.body})`}
          strokeWidth="9"
          strokeLinecap="round"
          opacity="0.75"
        />
        <path
          d="M 115,230 Q 118,215 114,205 Q 111,198 108,200"
          fill="none"
          stroke="white"
          strokeWidth="1"
          strokeLinecap="round"
          opacity="0.2"
        />

        {/* Pie delantero */}
        <path
          d="M 115,230 Q 120,232 124,230 Q 126,228 124,226"
          fill="none"
          stroke={`url(#${ids.body})`}
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.6"
        />

        {/* Manto acumulado en el suelo */}
        <path d="M 82,230 Q 70,238 72,248 Q 80,252 95,248 Q 88,240 88,235" fill={color} opacity="0.12" />
        <path
          d="M 82,230 Q 70,238 72,248 Q 80,252 95,248 Q 88,240 88,235"
          fill="none"
          stroke={color}
          strokeWidth="0.6"
          opacity="0.35"
        />
        {mantleFolds.map(([x1, y1, x2, y2], i) => (
          <line key={`mf${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="0.5" opacity="0.3" />
        ))}

        {/* Torso inclinado hacia el mapa */}
        <path
          d="M 92,200 Q 88,185 90,170 Q 92,160 98,158 Q 106,156 110,162 Q 114,168 112,180 Q 110,192 108,200"
          fill={`url(#${ids.body})`}
          opacity="0.82"
        />
        <path
          d="M 94,195 Q 91,182 93,170 Q 95,163 100,161"
          fill="none"
          stroke="white"
          strokeWidth="0.8"
          opacity="0.25"
        />
        {torsoFolds.map((d, i) => (
          <path key={`tf${i}`} d={d} fill="none" stroke={color} strokeWidth="0.4" opacity="0.3" />
        ))}

        {/* Capucha inclinada hacia el mapa */}
        <path
          d="M 94,162 Q 90,148 92,138 Q 96,128 104,126 Q 112,124 116,132 Q 120,140 118,152 Q 116,160 110,162"
          fill={`url(#${ids.body})`}
          opacity="0.88"
        />
        <path
          d="M 97,158 Q 94,148 96,140 Q 99,133 105,131 Q 111,129 114,135 Q 117,141 115,150 Q 113,157 110,159"
          fill="black"
          opacity="0.55"
        />
        <path d="M 99,156 Q 96,148 98,141 Q 101,135 106,133" fill="none" stroke={color} strokeWidth="0.5" opacity="0.2" />

        {/* Hombros */}
        <path
          d="M 90,170 Q 80,168 76,172 Q 74,177 78,180 Q 83,182 90,180"
          fill={`url(#${ids.body})`}
          opacity="0.65"
        />
        <path
          d="M 112,168 Q 122,166 126,170 Q 128,175 124,178 Q 119,180 113,178"
          fill={`url(#${ids.body})`}
          opacity="0.65"
        />

        {/* Brazo izquierdo — sostiene compás */}
        <path
          d="M 90,175 Q 80,185 76,195 Q 74,202 78,206"
          fill="none"
          stroke={`url(#${ids.body})`}
          strokeWidth="7"
          strokeLinecap="round"
          opacity="0.75"
        />
        <path
          d="M 90,175 Q 80,185 76,195 Q 74,202 78,206"
          fill="none"
          stroke="white"
          strokeWidth="0.8"
          strokeLinecap="round"
          opacity="0.2"
        />
        <circle cx="78" cy="207" r="4" fill={`url(#${ids.body})`} opacity="0.7" />
        {leftFingers.map(([dx, dy], i) => (
          <circle key={`lf${i}`} cx={78 + dx} cy={207 + dy} r="1.2" fill={color} opacity="0.5" />
        ))}

        {/* Compás de navegación */}
        <circle cx="78" cy="207" r="2.5" fill={color} opacity="0.8" />
        <circle cx="78" cy="207" r="1" fill="white" opacity="0.9" />
        <line x1="78" y1="207" x2="68" y2="195" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
        <line x1="78" y1="207" x2="68" y2="195" stroke="white" strokeWidth="0.5" strokeLinecap="round" opacity="0.5" />
        <circle cx="68" cy="195" r="1.5" fill={color} opacity="0.9" />
        <circle cx="68" cy="195" r="0.6" fill="white" opacity="1" />
        <line x1="78" y1="207" x2="70" y2="218" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
        <line x1="78" y1="207" x2="70" y2="218" stroke="white" strokeWidth="0.5" strokeLinecap="round" opacity="0.5" />
        <circle cx="70" cy="218" r="1.5" fill={color} opacity="0.9" />
        <circle cx="70" cy="218" r="0.6" fill="white" opacity="1" />
        <path d="M 69,197 Q 64,207 71,216" fill="none" stroke={color} strokeWidth="0.8" strokeDasharray="2 1.5" opacity="0.7" />
        <circle cx="78" cy="207" r="3.5" fill="none" stroke={color} strokeWidth="0.5" opacity="0.5" />

        {/* Brazo derecho — señala el mapa */}
        <path
          d="M 113,175 Q 118,188 120,200 Q 121,208 118,213"
          fill="none"
          stroke={`url(#${ids.body})`}
          strokeWidth="7"
          strokeLinecap="round"
          opacity="0.75"
        />
        <path
          d="M 113,175 Q 118,188 120,200 Q 121,208 118,213"
          fill="none"
          stroke="white"
          strokeWidth="0.8"
          strokeLinecap="round"
          opacity="0.2"
        />
        <circle cx="117" cy="214" r="3.5" fill={`url(#${ids.body})`} opacity="0.7" />
        <path
          d="M 117,214 Q 114,220 112,225 Q 111,228 112,230"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.7"
        />
        <path
          d="M 117,214 Q 114,220 112,225 Q 111,228 112,230"
          fill="none"
          stroke="white"
          strokeWidth="0.5"
          strokeLinecap="round"
          opacity="0.4"
        />
        {rightFingers.map(([dx, dy], i) => (
          <path
            key={`rf${i}`}
            d={`M ${117 + dx},${214 + dy} Q ${117 + dx + 2},${218 + dy} ${117 + dx + 1},${220 + dy}`}
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.4"
          />
        ))}

        {/* Partículas flotantes */}
        {particles.map((p, i) => (
          <g key={`p${i}`}>
            <circle cx={p.cx} cy={p.cy} r={p.r * 2.5} fill={color} opacity={p.o * 0.3} />
            <circle cx={p.cx} cy={p.cy} r={p.r} fill={color} opacity={p.o} />
          </g>
        ))}

        {/* Luminiscencia de borde */}
        <path
          d="M 92,200 Q 88,185 90,170 Q 92,160 98,158 Q 106,156 110,162 Q 114,168 112,180 Q 110,192 108,200"
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          opacity="0.3"
          filter={`url(#${ids.blur3})`}
        />
      </g>
    </SilhouetteFrame>
  );
}
