import { useUniqueSvgIds } from '../../QuienTinderCards/useUniqueSvgIds';
import { SilhouetteFrame } from '../SilhouetteFrame';
import { getSilhouetteMetadata } from '../silhouetteMetadata';
import type { QuienSilhouetteProps } from '../types';

const SILHOUETTE_ID = 5 as const;

const DEFAULT_COLOR = '#a78bfa';

const particles = [
  { cx: 58, cy: 28, r: 1.1 },
  { cx: 142, cy: 22, r: 0.8 },
  { cx: 72, cy: 15, r: 0.7 },
  { cx: 128, cy: 18, r: 1.0 },
  { cx: 52, cy: 42, r: 0.6 },
  { cx: 148, cy: 35, r: 0.9 },
  { cx: 65, cy: 8, r: 0.7 },
  { cx: 135, cy: 10, r: 0.6 },
  { cx: 80, cy: 30, r: 0.5 },
  { cx: 120, cy: 25, r: 0.8 },
  { cx: 100, cy: 5, r: 1.2 },
  { cx: 90, cy: 12, r: 0.6 },
  { cx: 110, cy: 14, r: 0.7 },
  { cx: 100, cy: 20, r: 0.5 },
];

const secondaryNodes = [
  { cx: 48, cy: 24 },
  { cx: 72, cy: 22 },
  { cx: 84, cy: 18 },
  { cx: 116, cy: 18 },
  { cx: 128, cy: 22 },
  { cx: 152, cy: 24 },
];

/**
 * Conductor: figura horizontal flotando con árbol fractal que emerge del pecho.
 * Simboliza la conexión, el canal y la transmisión.
 */
export function Conductor({
  className = '',
  color = DEFAULT_COLOR,
  hideLabel = false,
}: QuienSilhouetteProps) {
  const svgId = useUniqueSvgIds('conductor');
  const ids = {
    aura1: svgId('aura1'),
    aura2: svgId('aura2'),
    aura3: svgId('aura3'),
    body: svgId('body'),
    column: svgId('col'),
    trance: svgId('trance'),
    mantle: svgId('mantle'),
  };

  const meta = getSilhouetteMetadata(SILHOUETTE_ID);

  return (
    <SilhouetteFrame
      title={meta?.name ?? 'Místico'}
      subtitle={meta?.subtitle ?? 'Trance'}
      variant={meta?.labelVariant ?? 'violet'}
      className={className}
      hideLabel={hideLabel}
    >
      <g transform="translate(100, 160) scale(1.15) translate(-100, -160) translate(0, 12)">
        <defs>
          <radialGradient id={ids.aura1} cx="50%" cy="60%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.18" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={ids.aura2} cx="50%" cy="60%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.10" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={ids.aura3} cx="50%" cy="60%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="0.06" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <linearGradient id={ids.body} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="30%" stopColor={color} stopOpacity="0.70" />
            <stop offset="70%" stopColor={color} stopOpacity="0.70" />
            <stop offset="100%" stopColor={color} stopOpacity="0.25" />
          </linearGradient>
          <linearGradient id={ids.column} x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0.9" />
            <stop offset="60%" stopColor={color} stopOpacity="0.5" />
            <stop offset="100%" stopColor="white" stopOpacity="0.1" />
          </linearGradient>
          <radialGradient id={ids.trance} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.12" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
          <linearGradient id={ids.mantle} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.5" />
            <stop offset="100%" stopColor={color} stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {/* Auras */}
        <ellipse cx="100" cy="185" rx="88" ry="55" fill={`url(#${ids.trance})`} />
        <ellipse cx="100" cy="185" rx="70" ry="42" fill={`url(#${ids.aura1})`} />
        <ellipse cx="100" cy="185" rx="50" ry="30" fill={`url(#${ids.aura2})`} />
        <ellipse cx="100" cy="185" rx="35" ry="20" fill={`url(#${ids.aura3})`} />

        {/* Fractal tree base */}
        <line x1="100" y1="155" x2="100" y2="80" stroke={color} strokeWidth="5" opacity="0.08" strokeLinecap="round" />
        <line x1="100" y1="155" x2="100" y2="80" stroke={color} strokeWidth="2" opacity="0.5" strokeLinecap="round" />
        <line x1="100" y1="155" x2="100" y2="80" stroke="white" strokeWidth="0.7" opacity="0.7" strokeLinecap="round" />

        {/* Primary branches */}
        <path d="M100,80 Q82,65 68,48" stroke={color} strokeWidth="3.5" opacity="0.08" strokeLinecap="round" fill="none" />
        <path d="M100,80 Q82,65 68,48" stroke={color} strokeWidth="1.5" opacity="0.55" strokeLinecap="round" fill="none" />
        <path d="M100,80 Q82,65 68,48" stroke="white" strokeWidth="0.5" opacity="0.65" strokeLinecap="round" fill="none" />
        <path d="M100,80 Q118,65 132,48" stroke={color} strokeWidth="3.5" opacity="0.08" strokeLinecap="round" fill="none" />
        <path d="M100,80 Q118,65 132,48" stroke={color} strokeWidth="1.5" opacity="0.55" strokeLinecap="round" fill="none" />
        <path d="M100,80 Q118,65 132,48" stroke="white" strokeWidth="0.5" opacity="0.65" strokeLinecap="round" fill="none" />
        <path d="M100,80 Q100,62 100,45" stroke={color} strokeWidth="3" opacity="0.08" strokeLinecap="round" fill="none" />
        <path d="M100,80 Q100,62 100,45" stroke={color} strokeWidth="1.3" opacity="0.5" strokeLinecap="round" fill="none" />
        <path d="M100,80 Q100,62 100,45" stroke="white" strokeWidth="0.5" opacity="0.6" strokeLinecap="round" fill="none" />

        {/* Secondary branches */}
        <path d="M68,48 Q56,36 48,24" stroke={color} strokeWidth="2.2" opacity="0.07" strokeLinecap="round" fill="none" />
        <path d="M68,48 Q56,36 48,24" stroke={color} strokeWidth="1" opacity="0.45" strokeLinecap="round" fill="none" />
        <path d="M68,48 Q56,36 48,24" stroke="white" strokeWidth="0.4" opacity="0.55" strokeLinecap="round" fill="none" />
        <path d="M68,48 Q66,34 72,22" stroke={color} strokeWidth="2.2" opacity="0.07" strokeLinecap="round" fill="none" />
        <path d="M68,48 Q66,34 72,22" stroke={color} strokeWidth="1" opacity="0.45" strokeLinecap="round" fill="none" />
        <path d="M68,48 Q66,34 72,22" stroke="white" strokeWidth="0.4" opacity="0.55" strokeLinecap="round" fill="none" />
        <path d="M132,48 Q144,36 152,24" stroke={color} strokeWidth="2.2" opacity="0.07" strokeLinecap="round" fill="none" />
        <path d="M132,48 Q144,36 152,24" stroke={color} strokeWidth="1" opacity="0.45" strokeLinecap="round" fill="none" />
        <path d="M132,48 Q144,36 152,24" stroke="white" strokeWidth="0.4" opacity="0.55" strokeLinecap="round" fill="none" />
        <path d="M132,48 Q134,34 128,22" stroke={color} strokeWidth="2.2" opacity="0.07" strokeLinecap="round" fill="none" />
        <path d="M132,48 Q134,34 128,22" stroke={color} strokeWidth="1" opacity="0.45" strokeLinecap="round" fill="none" />
        <path d="M132,48 Q134,34 128,22" stroke="white" strokeWidth="0.4" opacity="0.55" strokeLinecap="round" fill="none" />
        <path d="M100,45 Q90,32 84,18" stroke={color} strokeWidth="2" opacity="0.07" strokeLinecap="round" fill="none" />
        <path d="M100,45 Q90,32 84,18" stroke={color} strokeWidth="0.9" opacity="0.4" strokeLinecap="round" fill="none" />
        <path d="M100,45 Q90,32 84,18" stroke="white" strokeWidth="0.35" opacity="0.5" strokeLinecap="round" fill="none" />
        <path d="M100,45 Q110,32 116,18" stroke={color} strokeWidth="2" opacity="0.07" strokeLinecap="round" fill="none" />
        <path d="M100,45 Q110,32 116,18" stroke={color} strokeWidth="0.9" opacity="0.4" strokeLinecap="round" fill="none" />
        <path d="M100,45 Q110,32 116,18" stroke="white" strokeWidth="0.35" opacity="0.5" strokeLinecap="round" fill="none" />

        {/* Tertiary branches */}
        <path d="M48,24 Q42,16 38,8" stroke={color} strokeWidth="1.2" opacity="0.35" strokeLinecap="round" fill="none" />
        <path d="M48,24 Q50,14 56,8" stroke={color} strokeWidth="1.2" opacity="0.35" strokeLinecap="round" fill="none" />
        <path d="M72,22 Q68,12 65,5" stroke={color} strokeWidth="1.2" opacity="0.35" strokeLinecap="round" fill="none" />
        <path d="M72,22 Q76,12 80,6" stroke={color} strokeWidth="1.2" opacity="0.35" strokeLinecap="round" fill="none" />
        <path d="M84,18 Q82,10 80,3" stroke={color} strokeWidth="1" opacity="0.30" strokeLinecap="round" fill="none" />
        <path d="M116,18 Q118,10 120,3" stroke={color} strokeWidth="1" opacity="0.30" strokeLinecap="round" fill="none" />
        <path d="M128,22 Q124,12 120,6" stroke={color} strokeWidth="1.2" opacity="0.35" strokeLinecap="round" fill="none" />
        <path d="M128,22 Q132,12 135,5" stroke={color} strokeWidth="1.2" opacity="0.35" strokeLinecap="round" fill="none" />
        <path d="M152,24 Q150,14 144,8" stroke={color} strokeWidth="1.2" opacity="0.35" strokeLinecap="round" fill="none" />
        <path d="M152,24 Q158,16 162,8" stroke={color} strokeWidth="1.2" opacity="0.35" strokeLinecap="round" fill="none" />

        {/* Branch nodes */}
        <circle cx="100" cy="80" r="4.5" fill={color} opacity="0.12" />
        <circle cx="100" cy="80" r="2.5" fill={color} opacity="0.7" />
        <circle cx="100" cy="80" r="1" fill="white" opacity="0.95" />
        <circle cx="68" cy="48" r="3.5" fill={color} opacity="0.10" />
        <circle cx="68" cy="48" r="2" fill={color} opacity="0.65" />
        <circle cx="68" cy="48" r="0.8" fill="white" opacity="0.9" />
        <circle cx="132" cy="48" r="3.5" fill={color} opacity="0.10" />
        <circle cx="132" cy="48" r="2" fill={color} opacity="0.65" />
        <circle cx="132" cy="48" r="0.8" fill="white" opacity="0.9" />
        <circle cx="100" cy="45" r="3" fill={color} opacity="0.10" />
        <circle cx="100" cy="45" r="1.7" fill={color} opacity="0.6" />
        <circle cx="100" cy="45" r="0.7" fill="white" opacity="0.85" />
        {secondaryNodes.map((n, i) => (
          <g key={i}>
            <circle cx={n.cx} cy={n.cy} r="2" fill={color} opacity="0.55" />
            <circle cx={n.cx} cy={n.cy} r="0.7" fill="white" opacity="0.8" />
          </g>
        ))}

        {/* Figure */}
        <ellipse cx="100" cy="185" rx="82" ry="30" fill={`url(#${ids.aura1})`} />
        <path
          d="M62,175 Q58,200 55,220 Q65,215 72,210 Q80,222 88,218 Q96,225 100,222 Q104,225 112,218 Q120,222 128,210 Q135,215 145,220 Q142,200 138,175"
          fill={`url(#${ids.mantle})`}
          opacity="0.5"
        />
        <path d="M72,178 Q70,198 68,215" stroke={color} strokeWidth="0.5" opacity="0.35" strokeLinecap="round" fill="none" />
        <path d="M84,179 Q83,200 82,218" stroke={color} strokeWidth="0.5" opacity="0.35" strokeLinecap="round" fill="none" />
        <path d="M116,179 Q117,200 118,218" stroke={color} strokeWidth="0.5" opacity="0.35" strokeLinecap="round" fill="none" />
        <path d="M128,178 Q130,198 132,215" stroke={color} strokeWidth="0.5" opacity="0.35" strokeLinecap="round" fill="none" />

        <ellipse cx="100" cy="182" rx="52" ry="18" fill={color} opacity="0.06" />
        <ellipse cx="100" cy="182" rx="44" ry="14" fill={color} opacity="0.10" />
        <path
          d="M48,178 Q52,168 62,168 L138,168 Q148,168 152,178 Q148,196 138,198 L62,198 Q52,196 48,178Z"
          fill={`url(#${ids.body})`}
        />
        <path d="M62,170 Q80,166 100,166 Q120,166 138,170" stroke="white" strokeWidth="0.7" opacity="0.25" strokeLinecap="round" fill="none" />
        <circle cx="100" cy="178" r="8" fill={color} opacity="0.08" />
        <circle cx="100" cy="178" r="4" fill={color} opacity="0.18" />
        <circle cx="100" cy="178" r="2" fill="white" opacity="0.35" />

        {/* Arms */}
        <path d="M62,172 Q45,175 35,185 Q30,195 33,205" stroke={color} strokeWidth="7" opacity="0.08" strokeLinecap="round" fill="none" />
        <path d="M62,172 Q45,175 35,185 Q30,195 33,205" stroke={`url(#${ids.body})`} strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M62,172 Q45,175 35,185 Q30,195 33,205" stroke="white" strokeWidth="0.5" opacity="0.2" strokeLinecap="round" fill="none" />
        <ellipse cx="33" cy="207" rx="4" ry="3" fill={color} opacity="0.5" transform="rotate(-20,33,207)" />
        <path d="M138,172 Q155,175 165,185 Q170,195 167,205" stroke={color} strokeWidth="7" opacity="0.08" strokeLinecap="round" fill="none" />
        <path d="M138,172 Q155,175 165,185 Q170,195 167,205" stroke={`url(#${ids.body})`} strokeWidth="4" strokeLinecap="round" fill="none" />
        <path d="M138,172 Q155,175 165,185 Q170,195 167,205" stroke="white" strokeWidth="0.5" opacity="0.2" strokeLinecap="round" fill="none" />
        <ellipse cx="167" cy="207" rx="4" ry="3" fill={color} opacity="0.5" transform="rotate(20,167,207)" />

        {/* Legs */}
        <path d="M72,196 Q65,210 60,230 Q58,240 62,248" stroke={color} strokeWidth="9" opacity="0.07" strokeLinecap="round" fill="none" />
        <path d="M72,196 Q65,210 60,230 Q58,240 62,248" stroke={`url(#${ids.body})`} strokeWidth="5.5" strokeLinecap="round" fill="none" />
        <path d="M128,196 Q135,210 140,230 Q142,240 138,248" stroke={color} strokeWidth="9" opacity="0.07" strokeLinecap="round" fill="none" />
        <path d="M128,196 Q135,210 140,230 Q142,240 138,248" stroke={`url(#${ids.body})`} strokeWidth="5.5" strokeLinecap="round" fill="none" />
        <ellipse cx="62" cy="250" rx="6" ry="3.5" fill={color} opacity="0.45" />
        <ellipse cx="138" cy="250" rx="6" ry="3.5" fill={color} opacity="0.45" />

        {/* Head */}
        <ellipse cx="100" cy="162" rx="14" ry="13" fill={color} opacity="0.07" />
        <ellipse cx="100" cy="162" rx="11" ry="10" fill={`url(#${ids.body})`} />
        <ellipse cx="100" cy="162" rx="11" ry="10" stroke={color} strokeWidth="0.5" opacity="0.4" fill="none" />
        <path d="M89,152 Q88,142 90,136 Q95,130 100,130 Q105,130 110,136 Q112,142 111,152" fill={color} opacity="0.45" />
        <path d="M89,155 Q85,148 86,140 Q90,130 100,128 Q110,130 114,140 Q115,148 111,155" stroke={color} strokeWidth="0.6" opacity="0.4" fill="none" />
        <ellipse cx="100" cy="160" rx="7" ry="6" fill="black" opacity="0.5" />

        {/* Column */}
        <line x1="100" y1="155" x2="100" y2="80" stroke={color} strokeWidth="6" opacity="0.06" strokeLinecap="round" />
        <line x1="100" y1="155" x2="100" y2="80" stroke={`url(#${ids.column})`} strokeWidth="2" strokeLinecap="round" />
        <line x1="100" y1="155" x2="100" y2="80" stroke="white" strokeWidth="0.6" opacity="0.55" strokeLinecap="round" />

        {/* Particles */}
        {particles.map((p, i) => (
          <g key={i}>
            <circle cx={p.cx} cy={p.cy} r={p.r * 2.5} fill={color} opacity="0.08" />
            <circle cx={p.cx} cy={p.cy} r={p.r} fill={color} opacity={0.4 + (i % 4) * 0.1} />
            {p.r > 0.9 && <circle cx={p.cx} cy={p.cy} r={p.r * 0.4} fill="white" opacity="0.8" />}
          </g>
        ))}
      </g>
    </SilhouetteFrame>
  );
}
