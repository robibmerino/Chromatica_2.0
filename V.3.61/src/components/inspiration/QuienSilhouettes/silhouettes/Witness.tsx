import { useUniqueSvgIds } from '../../QuienTinderCards/useUniqueSvgIds';
import { SilhouetteFrame } from '../SilhouetteFrame';
import { getSilhouetteMetadata } from '../silhouetteMetadata';
import type { QuienSilhouetteProps } from '../types';

const SILHOUETTE_ID = 15 as const;

const DEFAULT_COLOR = '#c084fc';

const particles = [
  { x: 38, y: 22, r: 0.9, o: 0.7 },
  { x: 162, y: 18, r: 1.1, o: 0.6 },
  { x: 52, y: 35, r: 0.6, o: 0.5 },
  { x: 148, y: 30, r: 0.8, o: 0.7 },
  { x: 30, y: 48, r: 1.0, o: 0.4 },
  { x: 170, y: 44, r: 0.7, o: 0.6 },
  { x: 44, y: 62, r: 0.5, o: 0.5 },
  { x: 156, y: 58, r: 0.9, o: 0.4 },
  { x: 22, y: 75, r: 0.7, o: 0.3 },
  { x: 178, y: 70, r: 0.6, o: 0.5 },
  { x: 62, y: 80, r: 1.1, o: 0.4 },
  { x: 138, y: 76, r: 0.8, o: 0.3 },
  { x: 35, y: 95, r: 0.6, o: 0.4 },
  { x: 165, y: 90, r: 0.7, o: 0.3 },
];

const lashes = Array.from({ length: 12 }, (_, i) => {
  const angle = (i / 12) * Math.PI * 2;
  const r1 = 28;
  const r2 = 34 + (i % 3) * 4;
  return {
    x1: 100 + Math.cos(angle) * r1,
    y1: 32 + Math.sin(angle) * r1 * 0.55,
    x2: 100 + Math.cos(angle) * r2,
    y2: 32 + Math.sin(angle) * r2 * 0.55,
  };
});

const facets = Array.from({ length: 8 }, (_, i) => {
  const a1 = (i / 8) * Math.PI * 2;
  const a2 = ((i + 1) / 8) * Math.PI * 2;
  const r = 11;
  const ox = 100;
  const oy = 32;
  return `M${ox},${oy} L${(ox + Math.cos(a1) * r).toFixed(1)},${(oy + Math.sin(a1) * r * 0.55).toFixed(1)} L${(ox + Math.cos(a2) * r).toFixed(1)},${(oy + Math.sin(a2) * r * 0.55).toFixed(1)} Z`;
});

/**
 * Witness: figura arrodillada con cabeza hacia atrás, ojo simbólico arriba y rayo de visión.
 * Simboliza la contemplación, el testimonio y la mirada trascendente.
 */
export function Witness({
  className = '',
  color = DEFAULT_COLOR,
  hideLabel = false,
}: QuienSilhouetteProps) {
  const svgId = useUniqueSvgIds('witness');
  const ids = {
    aura1: svgId('aura1'),
    aura2: svgId('aura2'),
    aura3: svgId('aura3'),
    eyeGlow: svgId('eye-glow'),
    rayGrad: svgId('ray-grad'),
    bodyGrad: svgId('body-grad'),
    irisGrad: svgId('iris-grad'),
    haloGrad: svgId('halo-grad'),
  };

  const meta = getSilhouetteMetadata(SILHOUETTE_ID);

  return (
    <SilhouetteFrame
      title={meta?.name ?? 'Testigo'}
      subtitle={meta?.subtitle ?? 'Contemplación'}
      variant={meta?.labelVariant ?? 'violet'}
      className={className}
      hideLabel={hideLabel}
    >
      <g transform="translate(0, 20)">
        <defs>
          <radialGradient id={ids.aura1} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.18" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={ids.aura2} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.28" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={ids.aura3} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="0.12" />
            <stop offset="60%" stopColor={color} stopOpacity="0.15" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={ids.eyeGlow} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.5" />
            <stop offset="60%" stopColor={color} stopOpacity="0.15" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={ids.irisGrad} cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor="white" stopOpacity="0.9" />
            <stop offset="40%" stopColor={color} stopOpacity="0.8" />
            <stop offset="100%" stopColor={color} stopOpacity="0.2" />
          </radialGradient>
          <linearGradient id={ids.rayGrad} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.6" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
          <linearGradient id={ids.bodyGrad} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.95" />
            <stop offset="40%" stopColor={color} stopOpacity="0.85" />
            <stop offset="100%" stopColor={color} stopOpacity="0.3" />
          </linearGradient>
          <radialGradient id={ids.haloGrad} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
        </defs>

        <ellipse cx="100" cy="150" rx="90" ry="130" fill={`url(#${ids.aura1})`} />

        {particles.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={color} opacity={p.o} />
        ))}

        {/* Eye */}
        <ellipse cx="100" cy="32" rx="48" ry="26" fill={`url(#${ids.eyeGlow})`} />
        {lashes.map((l, i) => (
          <line
            key={i}
            x1={l.x1}
            y1={l.y1}
            x2={l.x2}
            y2={l.y2}
            stroke={color}
            strokeWidth={i % 3 === 0 ? 0.8 : 0.4}
            opacity={i % 3 === 0 ? 0.7 : 0.35}
          />
        ))}
        <ellipse cx="100" cy="32" rx="26" ry="14" fill="none" stroke={color} strokeWidth="0.4" opacity="0.25" strokeDasharray="3 5" />
        <ellipse cx="100" cy="32" rx="20" ry="11" fill="none" stroke={color} strokeWidth="0.6" opacity="0.4" strokeDasharray="4 3" />
        <ellipse cx="100" cy="32" rx="15" ry="8" fill="none" stroke={color} strokeWidth="0.8" opacity="0.6" strokeDasharray="2 2" />
        <ellipse cx="100" cy="32" rx="11" ry="6" fill="none" stroke="white" strokeWidth="0.5" opacity="0.5" />
        {facets.map((d, i) => (
          <path key={i} d={d} fill={color} opacity={i % 2 === 0 ? 0.45 : 0.2} stroke={color} strokeWidth="0.3" />
        ))}
        <ellipse cx="100" cy="32" rx="11" ry="6" fill={`url(#${ids.irisGrad})`} opacity="0.6" />
        <ellipse cx="100" cy="32" rx="5" ry="2.8" fill="black" opacity="0.9" />
        <ellipse cx="100" cy="32" rx="3.5" ry="2" fill={color} opacity="0.6" />
        <ellipse cx="100" cy="32" rx="1.8" ry="1" fill="white" opacity="0.95" />
        <path d="M74,32 Q100,20 126,32" fill="none" stroke={color} strokeWidth="1.2" opacity="0.5" />
        <path d="M74,32 Q100,44 126,32" fill="none" stroke={color} strokeWidth="0.8" opacity="0.3" />
        <circle cx="74" cy="32" r="1.5" fill={color} opacity="0.6" />
        <circle cx="126" cy="32" r="1.5" fill={color} opacity="0.6" />

        {/* Ray */}
        <path
          d="M88,46 Q95,90 92,108 Q96,118 100,120 Q104,118 108,108 Q105,90 112,46"
          fill={`url(#${ids.rayGrad})`}
          opacity="0.18"
        />
        <line x1="100" y1="46" x2="100" y2="112" stroke={color} strokeWidth="4" opacity="0.08" />
        <line x1="100" y1="46" x2="100" y2="112" stroke={color} strokeWidth="1.5" opacity="0.4" />
        <line x1="100" y1="46" x2="100" y2="112" stroke="white" strokeWidth="0.5" opacity="0.6" />

        {/* Figure */}
        <ellipse cx="100" cy="118" rx="18" ry="10" fill={`url(#${ids.haloGrad})`} />
        <ellipse cx="100" cy="190" rx="55" ry="75" fill="none" stroke={color} strokeWidth="12" opacity="0.06" />
        <ellipse cx="100" cy="190" rx="50" ry="70" fill="none" stroke={color} strokeWidth="6" opacity="0.12" />

        <path
          d="M72,148 Q58,180 55,230 Q70,238 100,240 Q130,238 145,230 Q142,180 128,148"
          fill={`url(#${ids.bodyGrad})`}
          opacity="0.12"
        />
        <path
          d="M76,148 Q62,182 60,228 Q72,235 100,237 Q128,235 140,228 Q138,182 124,148"
          fill={`url(#${ids.bodyGrad})`}
          opacity="0.55"
        />
        <path d="M76,148 Q70,182 68,228" fill="none" stroke="white" strokeWidth="0.8" opacity="0.3" />
        <path d="M85,155 Q82,190 80,225" fill="none" stroke={color} strokeWidth="0.6" opacity="0.4" />
        <path d="M100,155 Q100,195 100,228" fill="none" stroke="white" strokeWidth="0.5" opacity="0.25" />
        <path d="M115,155 Q118,190 120,225" fill="none" stroke={color} strokeWidth="0.6" opacity="0.4" />
        <path d="M90,155 Q87,190 86,225" fill="none" stroke={color} strokeWidth="0.4" opacity="0.25" />
        <path d="M110,155 Q113,190 114,225" fill="none" stroke={color} strokeWidth="0.4" opacity="0.25" />
        <path
          d="M60,228 Q72,235 100,237 Q128,235 140,228"
          fill="none"
          stroke={color}
          strokeWidth="1"
          opacity="0.5"
        />
        <path
          d="M60,228 Q72,235 100,237 Q128,235 140,228"
          fill="none"
          stroke="white"
          strokeWidth="0.4"
          opacity="0.3"
        />

        <path
          d="M82,148 Q80,162 82,175 Q91,180 100,180 Q109,180 118,175 Q120,162 118,148 Q109,143 100,142 Q91,143 82,148 Z"
          fill={`url(#${ids.bodyGrad})`}
          opacity="0.8"
        />
        <line x1="100" y1="148" x2="100" y2="178" stroke="white" strokeWidth="0.5" opacity="0.2" />
        <path d="M82,148 Q74,145 70,150 Q72,158 78,160 Q82,158 84,153 Z" fill={`url(#${ids.bodyGrad})`} opacity="0.7" />
        <path d="M118,148 Q126,145 130,150 Q128,158 122,160 Q118,158 116,153 Z" fill={`url(#${ids.bodyGrad})`} opacity="0.7" />

        <path
          d="M78,155 Q66,165 62,178 Q60,188 64,195"
          fill="none"
          stroke={`url(#${ids.bodyGrad})`}
          strokeWidth="7"
          strokeLinecap="round"
          opacity="0.7"
        />
        <path d="M78,155 Q66,165 62,178 Q60,188 64,195" fill="none" stroke="white" strokeWidth="0.6" strokeLinecap="round" opacity="0.25" />
        <path d="M64,195 Q58,198 56,202" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" opacity="0.7" />
        <line x1="56" y1="202" x2="52" y2="208" stroke={color} strokeWidth="1.2" opacity="0.6" strokeLinecap="round" />
        <line x1="58" y1="203" x2="55" y2="210" stroke={color} strokeWidth="1.2" opacity="0.6" strokeLinecap="round" />
        <line x1="61" y1="203" x2="59" y2="211" stroke={color} strokeWidth="1.2" opacity="0.5" strokeLinecap="round" />
        <line x1="64" y1="202" x2="63" y2="210" stroke={color} strokeWidth="1.0" opacity="0.5" strokeLinecap="round" />
        <line x1="67" y1="200" x2="67" y2="208" stroke={color} strokeWidth="0.9" opacity="0.4" strokeLinecap="round" />

        <path
          d="M122,155 Q134,165 138,178 Q140,188 136,195"
          fill="none"
          stroke={`url(#${ids.bodyGrad})`}
          strokeWidth="7"
          strokeLinecap="round"
          opacity="0.7"
        />
        <path d="M122,155 Q134,165 138,178 Q140,188 136,195" fill="none" stroke="white" strokeWidth="0.6" strokeLinecap="round" opacity="0.25" />
        <path d="M136,195 Q142,198 144,202" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" opacity="0.7" />
        <line x1="144" y1="202" x2="148" y2="208" stroke={color} strokeWidth="1.2" opacity="0.6" strokeLinecap="round" />
        <line x1="142" y1="203" x2="145" y2="210" stroke={color} strokeWidth="1.2" opacity="0.6" strokeLinecap="round" />
        <line x1="139" y1="203" x2="141" y2="211" stroke={color} strokeWidth="1.2" opacity="0.5" strokeLinecap="round" />
        <line x1="136" y1="202" x2="137" y2="210" stroke={color} strokeWidth="1.0" opacity="0.5" strokeLinecap="round" />
        <line x1="133" y1="200" x2="133" y2="208" stroke={color} strokeWidth="0.9" opacity="0.4" strokeLinecap="round" />

        <path
          d="M95,142 Q94,132 96,122 Q98,116 100,114"
          fill="none"
          stroke={`url(#${ids.bodyGrad})`}
          strokeWidth="8"
          strokeLinecap="round"
          opacity="0.75"
        />
        <path
          d="M105,142 Q106,132 104,122 Q102,116 100,114"
          fill="none"
          stroke={`url(#${ids.bodyGrad})`}
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.5"
        />
        <path d="M97,140 Q96,130 98,120" fill="none" stroke="white" strokeWidth="0.5" opacity="0.3" />

        <ellipse cx="100" cy="112" rx="16" ry="14" fill={color} opacity="0.08" />
        <ellipse cx="100" cy="112" rx="12" ry="13" fill={`url(#${ids.bodyGrad})`} opacity="0.85" transform="rotate(-15, 100, 112)" />
        <path d="M90,108 Q100,102 110,108" fill="none" stroke="white" strokeWidth="0.5" opacity="0.3" />
        <path d="M94,114 Q100,112 106,114" fill="none" stroke={color} strokeWidth="0.6" opacity="0.4" />
        <ellipse cx="97" cy="108" rx="5" ry="4" fill="white" opacity="0.12" transform="rotate(-15, 97, 108)" />

        <path d="M88,118 Q80,112 78,105 Q80,98 88,96 Q96,94 100,96" fill={`url(#${ids.bodyGrad})`} opacity="0.5" />
        <path d="M112,118 Q120,112 122,105 Q120,98 112,96 Q104,94 100,96" fill={`url(#${ids.bodyGrad})`} opacity="0.4" />

        <ellipse cx="80" cy="232" rx="14" ry="8" fill={`url(#${ids.bodyGrad})`} opacity="0.6" />
        <ellipse cx="80" cy="232" rx="10" ry="5" fill="none" stroke={color} strokeWidth="0.6" opacity="0.4" />
        <ellipse cx="120" cy="232" rx="14" ry="8" fill={`url(#${ids.bodyGrad})`} opacity="0.6" />
        <ellipse cx="120" cy="232" rx="10" ry="5" fill="none" stroke={color} strokeWidth="0.6" opacity="0.4" />

        <ellipse cx="100" cy="240" rx="40" ry="6" fill={color} opacity="0.12" />
        <ellipse cx="100" cy="240" rx="28" ry="3" fill={color} opacity="0.08" />

        <ellipse cx="100" cy="185" rx="45" ry="65" fill={`url(#${ids.aura3})`} opacity="0.4" />
      </g>
    </SilhouetteFrame>
  );
}
