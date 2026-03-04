import { useUniqueSvgIds } from '../../QuienTinderCards/useUniqueSvgIds';
import { SilhouetteFrame } from '../SilhouetteFrame';
import { getSilhouetteMetadata } from '../silhouetteMetadata';
import type { QuienSilhouetteProps } from '../types';

const SILHOUETTE_ID = 12 as const;

const DEFAULT_COLOR = '#22b97d';

const capeFoldX = [88, 94, 106, 112];
const beltStudDx = [-12, -7, 7, 12];
const particles = [
  { x: 62, y: 138, r: 1.2, o: 0.5 },
  { x: 140, y: 142, r: 0.8, o: 0.4 },
  { x: 58, y: 165, r: 0.7, o: 0.3 },
  { x: 143, y: 170, r: 1.0, o: 0.45 },
  { x: 68, y: 200, r: 0.6, o: 0.25 },
  { x: 138, y: 195, r: 0.9, o: 0.35 },
  { x: 72, y: 240, r: 0.7, o: 0.2 },
  { x: 130, y: 235, r: 0.6, o: 0.2 },
];

/**
 * Sentinel: figura de espalda con escudo hexagonal, espada clavada y capa.
 * Simboliza la vigilancia, la protección y la firmeza.
 */
export function Sentinel({
  className = '',
  color = DEFAULT_COLOR,
  hideLabel = false,
}: QuienSilhouetteProps) {
  const svgId = useUniqueSvgIds('sentinel');
  const ids = {
    aura1: svgId('aura1'),
    aura2: svgId('aura2'),
    body: svgId('body'),
    cape: svgId('cape'),
    sword: svgId('sword'),
    shieldGlow: svgId('shield-glow'),
    glowSoft: svgId('glow-soft'),
    auraBlur1: svgId('aura-blur1'),
    auraBlur2: svgId('aura-blur2'),
    auraBlur3: svgId('aura-blur3'),
    fade: svgId('fade'),
    fadeMask: svgId('fade-mask'),
  };

  const meta = getSilhouetteMetadata(SILHOUETTE_ID);

  return (
    <SilhouetteFrame
      title={meta?.name ?? 'Centinela'}
      subtitle={meta?.subtitle ?? 'Confianza'}
      variant={meta?.labelVariant ?? 'emerald'}
      className={className}
      hideLabel={hideLabel}
    >
      <g transform="translate(0, 0)">
        <defs>
          <radialGradient id={ids.aura1} cx="50%" cy="45%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.18" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={ids.aura2} cx="50%" cy="45%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.10" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>

          <linearGradient id={ids.body} x1="60%" y1="0%" x2="40%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.75" />
            <stop offset="40%" stopColor={color} stopOpacity="0.55" />
            <stop offset="100%" stopColor={color} stopOpacity="0.10" />
          </linearGradient>

          <linearGradient id={ids.cape} x1="50%" y1="0%" x2="50%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.60" />
            <stop offset="60%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0.05" />
          </linearGradient>

          <linearGradient id={ids.sword} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.9" />
            <stop offset="30%" stopColor={color} stopOpacity="0.8" />
            <stop offset="100%" stopColor={color} stopOpacity="0.1" />
          </linearGradient>

          <radialGradient id={ids.shieldGlow} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>

          <filter id={ids.glowSoft} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id={ids.auraBlur1} x="-40%" y="-30%" width="180%" height="160%">
            <feGaussianBlur stdDeviation="12" />
          </filter>
          <filter id={ids.auraBlur2} x="-30%" y="-20%" width="160%" height="140%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
          <filter id={ids.auraBlur3} x="-20%" y="-15%" width="140%" height="130%">
            <feGaussianBlur stdDeviation="2.5" />
          </filter>

          <linearGradient id={ids.fade} x1="0%" y1="70%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <mask id={ids.fadeMask}>
            <rect x="0" y="0" width="200" height="320" fill={`url(#${ids.fade})`} />
          </mask>
        </defs>

        <g mask={`url(#${ids.fadeMask})`}>
          {/* Aura layers */}
          <g filter={`url(#${ids.auraBlur1})`} opacity="0.5">
            <ellipse cx="100" cy="160" rx="45" ry="85" fill={color} />
          </g>
          <g filter={`url(#${ids.auraBlur2})`} opacity="0.6">
            <ellipse cx="100" cy="155" rx="32" ry="70" fill={color} />
          </g>
          <g filter={`url(#${ids.auraBlur3})`} opacity="0.4">
            <ellipse cx="100" cy="150" rx="24" ry="60" fill={color} />
          </g>

          {/* Ground shadow */}
          <ellipse cx="105" cy="295" rx="28" ry="6" fill={color} opacity="0.08" />

          {/* Shield */}
          <g opacity="0.85">
            <circle cx="100" cy="105" r="38" fill={`url(#${ids.shieldGlow})`} />
            <polygon
              points="100,70 132,88 132,122 100,140 68,122 68,88"
              fill="none"
              stroke={color}
              strokeWidth="1.2"
              opacity="0.4"
            />
            <polygon
              points="100,79 123,92 123,118 100,131 77,118 77,92"
              fill="none"
              stroke={color}
              strokeWidth="0.7"
              strokeDasharray="4 3"
              opacity="0.3"
            />
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const angle = ((i * 60 - 90) * Math.PI) / 180;
              const x = 100 + Math.cos(angle) * 35;
              const y = 105 + Math.sin(angle) * 35;
              return (
                <line
                  key={i}
                  x1="100"
                  y1="105"
                  x2={x}
                  y2={y}
                  stroke={color}
                  strokeWidth="0.6"
                  opacity="0.25"
                />
              );
            })}
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const angle = ((i * 60 - 60) * Math.PI) / 180;
              const x = 100 + Math.cos(angle) * 35;
              const y = 105 + Math.sin(angle) * 35;
              return (
                <circle key={i} cx={x} cy={y} r="2" fill={color} opacity="0.5" />
              );
            })}
            <circle cx="100" cy="105" r="8" fill="none" stroke={color} strokeWidth="1" opacity="0.5" />
            <circle cx="100" cy="105" r="3" fill={color} opacity="0.6" />
            <circle cx="100" cy="105" r="1.2" fill="white" opacity="0.8" />
            <path
              d="M 84,105 A 16,16 0 0 1 116,105"
              fill="none"
              stroke={color}
              strokeWidth="0.8"
              opacity="0.3"
            />
            <path
              d="M 84,105 A 16,16 0 0 0 116,105"
              fill="none"
              stroke={color}
              strokeWidth="0.8"
              opacity="0.15"
            />
          </g>

          {/* Sword */}
          <g filter={`url(#${ids.glowSoft})`}>
            <line
              x1="148"
              y1="145"
              x2="148"
              y2="292"
              stroke={color}
              strokeWidth="6"
              opacity="0.08"
              strokeLinecap="round"
            />
            <line
              x1="148"
              y1="145"
              x2="148"
              y2="285"
              stroke={`url(#${ids.sword})`}
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <line
              x1="149.5"
              y1="150"
              x2="149.5"
              y2="280"
              stroke="white"
              strokeWidth="0.4"
              opacity="0.35"
              strokeLinecap="round"
            />
            <line
              x1="147"
              y1="155"
              x2="147"
              y2="270"
              stroke={color}
              strokeWidth="0.5"
              opacity="0.3"
              strokeLinecap="round"
            />
            <rect
              x="138"
              y="195"
              width="20"
              height="3.5"
              rx="1.5"
              fill={color}
              opacity="0.7"
            />
            <rect
              x="136"
              y="194"
              width="24"
              height="5.5"
              rx="2"
              fill="none"
              stroke={color}
              strokeWidth="0.8"
              opacity="0.4"
            />
            <circle cx="136" cy="196.75" r="2" fill={color} opacity="0.5" />
            <circle cx="160" cy="196.75" r="2" fill={color} opacity="0.5" />
            <rect
              x="145.5"
              y="200"
              width="5"
              height="22"
              rx="2"
              fill={color}
              opacity="0.35"
            />
            {[0, 1, 2, 3, 4].map((i) => (
              <line
                key={i}
                x1="145"
                y1={203 + i * 4}
                x2="151"
                y2={203 + i * 4}
                stroke={color}
                strokeWidth="0.8"
                opacity="0.4"
              />
            ))}
            <circle cx="148" cy="225" r="4" fill={color} opacity="0.5" />
            <circle cx="148" cy="225" r="2.5" fill={color} opacity="0.4" />
            <circle cx="148" cy="225" r="1" fill="white" opacity="0.7" />
            <ellipse cx="148" cy="287" rx="3" ry="1.5" fill={color} opacity="0.3" />
            <path
              d="M 142,288 Q 135,291 130,293"
              stroke={color}
              strokeWidth="0.7"
              opacity="0.3"
              strokeLinecap="round"
            />
            <path
              d="M 154,288 Q 161,291 167,294"
              stroke={color}
              strokeWidth="0.7"
              opacity="0.3"
              strokeLinecap="round"
            />
            <path
              d="M 145,289 Q 140,295 137,298"
              stroke={color}
              strokeWidth="0.5"
              opacity="0.2"
              strokeLinecap="round"
            />
            <path
              d="M 151,289 Q 156,295 159,298"
              stroke={color}
              strokeWidth="0.5"
              opacity="0.2"
              strokeLinecap="round"
            />
          </g>

          {/* Cape */}
          <path
            d="M 80,148 C 76,180 74,220 76,260 C 78,275 88,282 100,283 C 112,282 122,275 124,260 C 126,220 124,180 120,148 Z"
            fill={`url(#${ids.cape})`}
          />
          <path
            d="M 84,150 C 81,182 80,218 82,255 C 84,268 90,275 100,276 C 110,275 116,268 118,255 C 120,218 119,182 116,150 Z"
            fill={color}
            opacity="0.12"
          />
          {capeFoldX.map((x, i) => (
            <g key={i}>
              <path
                d={`M ${x},152 C ${x - 1},190 ${x - 1},230 ${x},265`}
                stroke="black"
                strokeWidth="2"
                opacity="0.15"
                strokeLinecap="round"
              />
              <path
                d={`M ${x},152 C ${x - 0.5},190 ${x - 0.5},230 ${x},265`}
                stroke={color}
                strokeWidth="0.5"
                opacity="0.4"
                strokeLinecap="round"
              />
            </g>
          ))}
          <path
            d="M 76,260 Q 82,278 88,282 Q 94,285 100,283 Q 106,285 112,282 Q 118,278 124,260"
            fill="none"
            stroke={color}
            strokeWidth="0.8"
            opacity="0.35"
          />

          {/* Body */}
          <path
            d="M 85,148 C 82,152 80,160 80,170 C 80,185 82,195 85,200 L 115,200 C 118,195 120,185 120,170 C 120,160 118,152 115,148 Z"
            fill={`url(#${ids.body})`}
          />
          <path
            d="M 88,158 Q 94,165 100,163 Q 106,165 112,158"
            fill="none"
            stroke={color}
            strokeWidth="0.8"
            opacity="0.3"
          />

          {/* Legs */}
          <path
            d="M 85,200 C 83,215 82,235 83,265 C 83.5,272 86,276 89,277 C 92,278 94,275 94,268 L 95,200 Z"
            fill={`url(#${ids.body})`}
            opacity="0.8"
          />
          <path
            d="M 105,200 L 106,268 C 106,275 108,278 111,277 C 114,276 116.5,272 117,265 C 118,235 117,215 115,200 Z"
            fill={`url(#${ids.body})`}
            opacity="0.8"
          />
          <path
            d="M 83,268 Q 86,278 89,280 Q 92,281 94,278 Q 95,274 94.5,268"
            fill={color}
            opacity="0.35"
          />
          <path
            d="M 106,268 Q 106.5,274 108,278 Q 110,281 113,280 Q 116,278 117,268"
            fill={color}
            opacity="0.35"
          />

          {/* Shoulders & pauldrons */}
          <path
            d="M 80,150 C 74,148 70,152 70,158 C 70,164 74,168 80,168 L 83,162 Z"
            fill={`url(#${ids.body})`}
            opacity="0.9"
          />
          <path
            d="M 71,152 C 67,150 65,154 65,159 C 65,164 68,167 72,166 L 78,160 Z"
            fill={color}
            opacity="0.4"
          />
          <path
            d="M 71,152 C 67,150 65,154 65,159 C 65,164 68,167 72,166 L 78,160 Z"
            fill="none"
            stroke={color}
            strokeWidth="0.8"
            opacity="0.5"
          />
          <path
            d="M 67,153 Q 65,157 66,161"
            fill="none"
            stroke="white"
            strokeWidth="0.5"
            opacity="0.3"
          />
          <path
            d="M 120,150 L 117,162 L 120,168 C 126,168 130,164 130,158 C 130,152 126,148 120,150 Z"
            fill={`url(#${ids.body})`}
            opacity="0.9"
          />
          <path
            d="M 122,160 L 128,166 C 132,167 135,164 135,159 C 135,154 133,150 129,152 Z"
            fill={color}
            opacity="0.4"
          />
          <path
            d="M 122,160 L 128,166 C 132,167 135,164 135,159 C 135,154 133,150 129,152 Z"
            fill="none"
            stroke={color}
            strokeWidth="0.8"
            opacity="0.5"
          />
          <path
            d="M 133,153 Q 135,157 134,161"
            fill="none"
            stroke="white"
            strokeWidth="0.5"
            opacity="0.3"
          />

          {/* Belt */}
          <rect x="82" y="196" width="36" height="5" rx="1" fill={color} opacity="0.4" />
          <rect
            x="81"
            y="195.5"
            width="38"
            height="6"
            rx="1.5"
            fill="none"
            stroke={color}
            strokeWidth="0.7"
            opacity="0.3"
          />
          <polygon
            points="100,196.5 102.5,196.5 103.5,198 102.5,200.5 100,200.5 97.5,200.5 96.5,198 97.5,196.5"
            fill={color}
            opacity="0.7"
          />
          <polygon
            points="100,197.2 101.8,197.2 102.5,198 101.8,199.8 100,199.8 98.2,199.8 97.5,198 98.2,197.2"
            fill="none"
            stroke="white"
            strokeWidth="0.5"
            opacity="0.5"
          />
          {beltStudDx.map((dx, i) => (
            <circle key={i} cx={100 + dx} cy={198} r="1" fill={color} opacity="0.5" />
          ))}

          {/* Neck & head */}
          <rect
            x="95"
            y="133"
            width="10"
            height="16"
            rx="4"
            fill={`url(#${ids.body})`}
            opacity="0.8"
          />
          <ellipse cx="100" cy="125" rx="14" ry="16" fill={`url(#${ids.body})`} opacity="0.85" />
          <path
            d="M 86,122 Q 88,108 100,106 Q 112,108 114,122"
            fill={color}
            opacity="0.25"
          />
          <path
            d="M 87,120 Q 100,105 113,120"
            fill="none"
            stroke={color}
            strokeWidth="1"
            opacity="0.4"
          />
          <path
            d="M 88,121 Q 100,107 112,121"
            fill="none"
            stroke="white"
            strokeWidth="0.4"
            opacity="0.2"
          />

          {/* Edge luminescence */}
          <path
            d="M 85,148 C 82,152 80,160 80,170 C 80,185 82,195 85,200 L 115,200 C 118,195 120,185 120,170 C 120,160 118,152 115,148 Z"
            fill="none"
            stroke={color}
            strokeWidth="1.2"
            opacity="0.35"
          />
          <path
            d="M 80,148 C 76,180 74,220 76,260 Q 88,285 100,283 Q 112,285 124,260 C 126,220 124,180 120,148"
            fill="none"
            stroke={color}
            strokeWidth="0.8"
            opacity="0.25"
          />
          <path
            d="M 80,155 C 79,170 79,185 80,198"
            fill="none"
            stroke="white"
            strokeWidth="0.5"
            opacity="0.15"
          />

          {/* Particles */}
          {particles.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={color} opacity={p.o} />
          ))}
        </g>
      </g>
    </SilhouetteFrame>
  );
}
