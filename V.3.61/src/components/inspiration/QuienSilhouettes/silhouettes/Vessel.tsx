import { useUniqueSvgIds } from '../../QuienTinderCards/useUniqueSvgIds';
import { SilhouetteFrame } from '../SilhouetteFrame';
import { getSilhouetteMetadata } from '../silhouetteMetadata';
import type { QuienSilhouetteProps } from '../types';

const SILHOUETTE_ID = 17 as const;

const DEFAULT_COLOR = '#6366f1';

const innerStars = [
  [96, 143],
  [104, 152],
  [108, 145],
  [92, 151],
  [100, 140],
  [112, 150],
  [88, 146],
  [103, 158],
  [97, 156],
  [106, 141],
  [94, 160],
  [110, 155],
];

const escapingParticles = [
  [72, 128, 0.7],
  [68, 148, 0.5],
  [72, 168, 0.6],
  [128, 128, 0.7],
  [132, 148, 0.5],
  [128, 168, 0.6],
  [88, 108, 0.4],
  [100, 105, 0.5],
  [112, 108, 0.4],
  [85, 188, 0.4],
  [100, 192, 0.3],
  [115, 188, 0.4],
];

/**
 * Vessel: figura con apertura en el torso que revela un universo interior.
 * Simboliza el receptáculo, el contenedor y la revelación interior.
 */
export function Vessel({
  className = '',
  color = DEFAULT_COLOR,
  hideLabel = false,
}: QuienSilhouetteProps) {
  const svgId = useUniqueSvgIds('vessel');
  const ids = {
    aura1: svgId('a1'),
    aura2: svgId('a2'),
    aura3: svgId('a3'),
    innerLight: svgId('il'),
    eman: svgId('eman'),
  };

  const meta = getSilhouetteMetadata(SILHOUETTE_ID);

  return (
    <SilhouetteFrame
      title={meta?.name ?? 'Vacío'}
      subtitle={meta?.subtitle ?? 'Contenedor'}
      variant={meta?.labelVariant ?? 'violet'}
      className={className}
      hideLabel={hideLabel}
    >
      <g transform="translate(0, 10)">
        <defs>
          <radialGradient id={ids.aura1} cx="50%" cy="45%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.18" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={ids.aura2} cx="50%" cy="45%" r="40%">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={ids.aura3} cx="50%" cy="45%" r="30%">
            <stop offset="0%" stopColor="white" stopOpacity="0.08" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={ids.innerLight} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="0.95" />
            <stop offset="30%" stopColor={color} stopOpacity="0.8" />
            <stop offset="70%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor="black" stopOpacity="0.9" />
          </radialGradient>
          <radialGradient id={ids.eman} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
        </defs>

        <ellipse cx="100" cy="155" rx="90" ry="110" fill={`url(#${ids.aura1})`} />
        <ellipse cx="100" cy="150" rx="65" ry="80" fill={`url(#${ids.aura2})`} />
        <ellipse cx="100" cy="145" rx="45" ry="55" fill={`url(#${ids.aura3})`} />

        <path d="M85,230 Q82,255 80,278" fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" opacity="0.7" />
        <path d="M115,230 Q118,255 120,278" fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" opacity="0.7" />
        <path d="M85,230 Q82,255 80,278" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.25" />
        <path d="M115,230 Q118,255 120,278" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.25" />

        <path d="M78,222 Q100,235 122,222" fill="none" stroke={color} strokeWidth="9" strokeLinecap="round" opacity="0.7" />
        <path d="M78,222 Q100,235 122,222" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.2" />

        <path d="M80,222 Q74,195 76,165 Q78,148 85,135" fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" opacity="0.75" />
        <path d="M80,222 Q74,195 76,165 Q78,148 85,135" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.22" />

        <path d="M120,222 Q126,195 124,165 Q122,148 115,135" fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" opacity="0.75" />
        <path d="M120,222 Q126,195 124,165 Q122,148 115,135" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.22" />

        <path d="M82,155 Q58,148 38,155" fill="none" stroke={color} strokeWidth="9" strokeLinecap="round" opacity="0.7" />
        <path d="M82,155 Q58,148 38,155" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.22" />
        <circle cx="35" cy="155" r="5" fill={color} opacity="0.7" />
        <path d="M30,152 L35,148 M35,148 L40,152 M33,157 L35,163 M37,157 L35,163" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />
        <path d="M30,152 L35,148 M35,148 L40,152 M33,157 L35,163 M37,157 L35,163" fill="none" stroke="white" strokeWidth="0.6" strokeLinecap="round" opacity="0.4" />

        <path d="M118,155 Q142,148 162,155" fill="none" stroke={color} strokeWidth="9" strokeLinecap="round" opacity="0.7" />
        <path d="M118,155 Q142,148 162,155" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.22" />
        <circle cx="165" cy="155" r="5" fill={color} opacity="0.7" />
        <path d="M160,152 L165,148 M165,148 L170,152 M163,157 L165,163 M167,157 L165,163" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />
        <path d="M160,152 L165,148 M165,148 L170,152 M163,157 L165,163 M167,157 L165,163" fill="none" stroke="white" strokeWidth="0.6" strokeLinecap="round" opacity="0.4" />

        <path d="M82,140 Q100,132 118,140" fill="none" stroke={color} strokeWidth="10" strokeLinecap="round" opacity="0.75" />
        <path d="M82,140 Q100,132 118,140" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.22" />

        <path d="M94,135 Q100,125 106,135" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" opacity="0.75" />
        <path d="M94,135 Q100,125 106,135" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.22" />

        <ellipse cx="100" cy="112" rx="22" ry="26" fill={color} opacity="0.08" />
        <ellipse cx="100" cy="112" rx="20" ry="24" fill={color} opacity="0.55" />
        <ellipse cx="100" cy="112" rx="20" ry="24" fill="none" stroke={color} strokeWidth="1.5" opacity="0.8" />
        <ellipse cx="100" cy="112" rx="20" ry="24" fill="none" stroke="white" strokeWidth="0.6" opacity="0.3" />
        <ellipse cx="100" cy="113" rx="14" ry="17" fill="black" opacity="0.7" />
        <ellipse cx="100" cy="113" rx="10" ry="13" fill="black" opacity="0.8" />

        <ellipse cx="100" cy="148" rx="45" ry="55" fill={`url(#${ids.eman})`} />

        <ellipse cx="100" cy="148" rx="28" ry="36" fill="black" opacity="0.95" />
        <ellipse cx="100" cy="148" rx="24" ry="30" fill={`url(#${ids.innerLight})`} opacity="0.9" />

        <ellipse
          cx="100"
          cy="148"
          rx="20"
          ry="10"
          fill="none"
          stroke={color}
          strokeWidth="0.8"
          opacity="0.5"
          strokeDasharray="3,2"
          transform="rotate(-30 100 148)"
        />
        <ellipse
          cx="100"
          cy="148"
          rx="15"
          ry="7"
          fill="none"
          stroke="white"
          strokeWidth="0.6"
          opacity="0.4"
          strokeDasharray="2,3"
          transform="rotate(20 100 148)"
        />
        <ellipse
          cx="100"
          cy="148"
          rx="9"
          ry="4"
          fill="none"
          stroke={color}
          strokeWidth="0.5"
          opacity="0.6"
          transform="rotate(60 100 148)"
        />

        <circle cx="120" cy="148" r="2.5" fill="white" opacity="0.9" />
        <circle cx="80" cy="148" r="2" fill={color} opacity="0.9" />
        <circle cx="100" cy="138" r="1.8" fill="white" opacity="0.7" />
        <circle cx="107" cy="158" r="1.5" fill={color} opacity="0.8" />
        <circle cx="93" cy="155" r="1.2" fill="white" opacity="0.6" />
        <circle cx="115" cy="142" r="1" fill="white" opacity="0.5" />

        {innerStars.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={0.6 + (i % 3) * 0.3} fill="white" opacity={0.3 + (i % 4) * 0.15} />
        ))}

        <circle cx="100" cy="148" r="4" fill="white" opacity="0.9" />
        <circle cx="100" cy="148" r="2" fill="white" opacity="1" />

        <ellipse cx="100" cy="148" rx="28" ry="36" fill="none" stroke={color} strokeWidth="4" opacity="0.15" />
        <ellipse cx="100" cy="148" rx="28" ry="36" fill="none" stroke={color} strokeWidth="2" opacity="0.6" />
        <ellipse cx="100" cy="148" rx="28" ry="36" fill="none" stroke="white" strokeWidth="0.8" opacity="0.7" />

        {escapingParticles.map(([x, y, o], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={2.5} fill={color} opacity={o} />
            <circle cx={x} cy={y} r={1} fill="white" opacity={o * 0.8} />
          </g>
        ))}

        <path
          d="M80,278 Q78,255 80,230 Q74,195 76,165 Q78,148 82,140 Q100,132 118,140 Q122,148 124,165 Q126,195 120,230 Q122,255 120,278"
          fill="none"
          stroke={color}
          strokeWidth="2"
          opacity="0.3"
        />
        <path
          d="M80,278 Q78,255 80,230 Q74,195 76,165 Q78,148 82,140 Q100,132 118,140 Q122,148 124,165 Q126,195 120,230 Q122,255 120,278"
          fill="none"
          stroke="white"
          strokeWidth="0.6"
          opacity="0.15"
        />
      </g>
    </SilhouetteFrame>
  );
}
