import { useUniqueSvgIds } from '../../QuienTinderCards/useUniqueSvgIds';
import { SilhouetteFrame } from '../SilhouetteFrame';
import { getSilhouetteMetadata } from '../silhouetteMetadata';
import type { QuienSilhouetteProps } from '../types';

const SILHOUETTE_ID = 14 as const;

const DEFAULT_COLOR = '#fbbf24';

const netNodes = [
  { x: 140, y: 68, r: 4.5 },
  { x: 105, y: 82, r: 3.5 },
  { x: 175, y: 82, r: 3.5 },
  { x: 88, y: 105, r: 2.8 },
  { x: 192, y: 105, r: 2.8 },
  { x: 110, y: 118, r: 3.2 },
  { x: 170, y: 118, r: 3.2 },
  { x: 140, y: 128, r: 4.0 },
];

const netThreads = [
  'M105,82 Q140,72 175,82',
  'M105,82 Q118,95 110,118',
  'M175,82 Q162,95 170,118',
  'M88,105 Q99,112 110,118',
  'M192,105 Q181,112 170,118',
  'M110,118 Q140,122 170,118',
  'M105,82 Q95,93 88,105',
  'M175,82 Q185,93 192,105',
  'M140,68 Q122,75 105,82',
  'M140,68 Q158,75 175,82',
  'M140,68 Q140,95 140,128',
  'M105,82 Q135,100 170,118',
  'M175,82 Q145,100 110,118',
];

const torsoFolds = [
  { d: 'M118,172 Q120,188 122,198', op: 0.3 },
  { d: 'M130,168 Q131,185 132,202', op: 0.2 },
  { d: 'M150,168 Q149,185 148,202', op: 0.2 },
  { d: 'M162,172 Q160,188 158,198', op: 0.3 },
];

const leftHandFingers = [
  { dx: 0, dy: 0 },
  { dx: -4, dy: -5 },
  { dx: -8, dy: -3 },
  { dx: 4, dy: -5 },
  { dx: 8, dy: -2 },
];

const rightHandFingers = [
  { dx: 0, dy: 0 },
  { dx: 4, dy: -5 },
  { dx: 8, dy: -3 },
  { dx: -4, dy: -5 },
  { dx: -8, dy: -2 },
];

const leftFingerThreads = [
  { fx: 78, fy: 134, tx: 105, ty: 82, cp1x: 88, cp1y: 108 },
  { fx: 74, fy: 137, tx: 88, ty: 105, cp1x: 80, cp1y: 118 },
  { fx: 70, fy: 139, tx: 88, ty: 105, cp1x: 76, cp1y: 120 },
  { fx: 82, fy: 134, tx: 140, ty: 128, cp1x: 108, cp1y: 128 },
  { fx: 86, fy: 140, tx: 110, ty: 118, cp1x: 96, cp1y: 126 },
];

const rightFingerThreads = [
  { fx: 202, fy: 134, tx: 175, ty: 82, cp1x: 192, cp1y: 108 },
  { fx: 206, fy: 137, tx: 192, ty: 105, cp1x: 200, cp1y: 118 },
  { fx: 210, fy: 139, tx: 192, ty: 105, cp1x: 204, cp1y: 120 },
  { fx: 198, fy: 134, tx: 140, ty: 128, cp1x: 172, cp1y: 128 },
  { fx: 194, fy: 140, tx: 170, ty: 118, cp1x: 184, cp1y: 126 },
];

const mantleFolds = [
  { d: 'M95,215 Q110,222 125,228', op: 0.25 },
  { d: 'M185,215 Q170,222 155,228', op: 0.25 },
  { d: 'M108,225 Q140,232 172,225', op: 0.2 },
];

const particles = [
  { x: 92, y: 72, r: 1.2, op: 0.6 },
  { x: 188, y: 68, r: 0.9, op: 0.5 },
  { x: 68, y: 115, r: 1.0, op: 0.4 },
  { x: 212, y: 118, r: 0.8, op: 0.45 },
  { x: 128, y: 55, r: 1.4, op: 0.55 },
  { x: 152, y: 52, r: 1.0, op: 0.5 },
  { x: 78, y: 88, r: 0.8, op: 0.4 },
  { x: 202, y: 92, r: 0.9, op: 0.38 },
  { x: 145, y: 45, r: 0.7, op: 0.35 },
  { x: 118, y: 48, r: 0.8, op: 0.42 },
];

/**
 * Weaver: figura sentada tejiendo una red flotante con las manos.
 * Simboliza la creación, el tejido de conexiones y la artesanía.
 */
export function Weaver({
  className = '',
  color = DEFAULT_COLOR,
  hideLabel = false,
}: QuienSilhouetteProps) {
  const svgId = useUniqueSvgIds('weaver');
  const ids = {
    auraDeep: svgId('aura-deep'),
    auraMid: svgId('aura-mid'),
    body: svgId('body'),
    netGlow: svgId('net-glow'),
    fresnel: svgId('fresnel'),
    fade: svgId('fade'),
    bodyMask: svgId('body-mask'),
    node: svgId('node'),
    blurSoft: svgId('blur-soft'),
  };

  const meta = getSilhouetteMetadata(SILHOUETTE_ID);

  return (
    <SilhouetteFrame
      title={meta?.name ?? 'Tejedora'}
      subtitle={meta?.subtitle ?? 'Creación'}
      variant={meta?.labelVariant ?? 'amber'}
      className={className}
      hideLabel={hideLabel}
    >
      <g transform="translate(100, 160) scale(0.88) translate(-140, -140) translate(2, 36)">
        <defs>
          <radialGradient id={ids.auraDeep} cx="50%" cy="60%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.18" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={ids.auraMid} cx="50%" cy="58%" r="45%">
            <stop offset="0%" stopColor={color} stopOpacity="0.12" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
          <linearGradient id={ids.body} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.95" />
            <stop offset="50%" stopColor={color} stopOpacity="0.75" />
            <stop offset="100%" stopColor={color} stopOpacity="0.15" />
          </linearGradient>
          <radialGradient id={ids.netGlow} cx="50%" cy="35%" r="50%">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
          <linearGradient id={ids.fresnel} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0.6" />
            <stop offset="30%" stopColor={color} stopOpacity="0.1" />
            <stop offset="70%" stopColor={color} stopOpacity="0.1" />
            <stop offset="100%" stopColor={color} stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id={ids.fade} x1="0%" y1="60%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
          <mask id={ids.bodyMask}>
            <rect width="280" height="280" fill={`url(#${ids.fade})`} />
          </mask>
          <radialGradient id={ids.node} cx="35%" cy="30%" r="60%">
            <stop offset="0%" stopColor="white" stopOpacity="0.9" />
            <stop offset="40%" stopColor={color} stopOpacity="0.8" />
            <stop offset="100%" stopColor={color} stopOpacity="0.2" />
          </radialGradient>
          <filter id={ids.blurSoft} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>

        {/* Auras */}
        <ellipse cx="140" cy="168" rx="110" ry="100" fill={`url(#${ids.auraDeep})`} />
        <ellipse cx="140" cy="160" rx="85" ry="80" fill={`url(#${ids.auraMid})`} />
        <ellipse cx="140" cy="105" rx="75" ry="55" fill={`url(#${ids.netGlow})`} />

        {/* Net nodes */}
        {netNodes.map((n, i) => (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r={n.r * 2.8} fill={color} opacity="0.08" />
            <circle cx={n.x} cy={n.y} r={n.r * 1.6} fill={color} opacity="0.14" />
            <circle cx={n.x} cy={n.y} r={n.r} fill={`url(#${ids.node})`} />
            <circle cx={n.x} cy={n.y} r={n.r * 0.45} fill="white" opacity="0.95" />
          </g>
        ))}

        {/* Net threads */}
        {netThreads.map((d, i) => (
          <g key={i}>
            <path d={d} stroke={color} strokeWidth="2.5" opacity="0.08" fill="none" strokeLinecap="round" />
            <path d={d} stroke={color} strokeWidth="0.8" opacity="0.55" fill="none" strokeLinecap="round" />
            <path d={d} stroke="white" strokeWidth="0.3" opacity="0.35" fill="none" strokeLinecap="round" />
          </g>
        ))}

        {/* Main silhouette */}
        <g mask={`url(#${ids.bodyMask})`}>
          <g opacity="0.25" filter={`url(#${ids.blurSoft})`}>
            <ellipse cx="140" cy="175" rx="42" ry="38" fill={color} />
            <ellipse cx="140" cy="148" rx="22" ry="24" fill={color} />
            <path d="M98,168 Q72,148 62,138" stroke={color} strokeWidth="18" strokeLinecap="round" fill="none" />
            <path d="M182,168 Q208,148 218,138" stroke={color} strokeWidth="18" strokeLinecap="round" fill="none" />
            <path d="M118,205 Q95,215 82,220" stroke={color} strokeWidth="20" strokeLinecap="round" fill="none" />
            <path d="M162,205 Q185,215 198,220" stroke={color} strokeWidth="20" strokeLinecap="round" fill="none" />
          </g>

          <ellipse cx="140" cy="148" rx="18" ry="20" fill={`url(#${ids.body})`} />
          <ellipse cx="140" cy="148" rx="18" ry="20" stroke={color} strokeWidth="0.8" opacity="0.4" fill="none" />
          <ellipse cx="134" cy="143" rx="6" ry="7" fill="white" opacity="0.06" />

          <path
            d="M122,140 Q118,130 128,122 Q140,116 152,122 Q162,130 158,140 Q152,134 140,132 Q128,134 122,140 Z"
            fill={color}
            opacity="0.7"
          />
          <path
            d="M122,140 Q118,130 128,122 Q140,116 152,122 Q162,130 158,140"
            stroke={color}
            strokeWidth="0.8"
            opacity="0.5"
            fill="none"
          />

          <path
            d="M110,168 Q108,185 112,200 Q140,210 168,200 Q172,185 170,168 Q155,162 140,160 Q125,162 110,168 Z"
            fill={`url(#${ids.body})`}
          />
          <path
            d="M110,168 Q108,185 112,200 Q140,210 168,200 Q172,185 170,168 Q155,162 140,160 Q125,162 110,168 Z"
            stroke={color}
            strokeWidth="1.2"
            opacity="0.35"
            fill="none"
          />

          {torsoFolds.map((f, i) => (
            <g key={i}>
              <path d={f.d} stroke="black" strokeWidth="1.5" opacity={f.op * 0.5} fill="none" strokeLinecap="round" />
              <path d={f.d} stroke={color} strokeWidth="0.6" opacity={f.op} fill="none" strokeLinecap="round" />
              <path d={f.d} stroke="white" strokeWidth="0.25" opacity={f.op * 0.6} fill="none" strokeLinecap="round" />
            </g>
          ))}

          <path
            d="M115,170 Q95,158 78,142"
            stroke={color}
            strokeWidth="14"
            strokeLinecap="round"
            fill="none"
            opacity="0.85"
          />
          <path d="M115,170 Q95,158 78,142" stroke={color} strokeWidth="8" strokeLinecap="round" fill="none" />
          <path d="M115,170 Q95,158 78,142" stroke="white" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.15" />

          <path
            d="M165,170 Q185,158 202,142"
            stroke={color}
            strokeWidth="14"
            strokeLinecap="round"
            fill="none"
            opacity="0.85"
          />
          <path d="M165,170 Q185,158 202,142" stroke={color} strokeWidth="8" strokeLinecap="round" fill="none" />
          <path d="M165,170 Q185,158 202,142" stroke="white" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.15" />

          {leftHandFingers.map((d, i) => (
            <g key={i}>
              <line
                x1={78}
                y1={142}
                x2={78 + d.dx}
                y2={142 + d.dy - 8}
                stroke={color}
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <line
                x1={78}
                y1={142}
                x2={78 + d.dx}
                y2={142 + d.dy - 8}
                stroke="white"
                strokeWidth="0.5"
                strokeLinecap="round"
                opacity="0.4"
              />
            </g>
          ))}

          {rightHandFingers.map((d, i) => (
            <g key={i}>
              <line
                x1={202}
                y1={142}
                x2={202 + d.dx}
                y2={142 + d.dy - 8}
                stroke={color}
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <line
                x1={202}
                y1={142}
                x2={202 + d.dx}
                y2={142 + d.dy - 8}
                stroke="white"
                strokeWidth="0.5"
                strokeLinecap="round"
                opacity="0.4"
              />
            </g>
          ))}

          {leftFingerThreads.map((h, i) => (
            <path
              key={i}
              d={`M${h.fx},${h.fy} Q${h.cp1x},${h.cp1y} ${h.tx},${h.ty}`}
              stroke={color}
              strokeWidth="0.7"
              opacity="0.45"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={i % 2 === 0 ? 'none' : '3,3'}
            />
          ))}

          {rightFingerThreads.map((h, i) => (
            <path
              key={i}
              d={`M${h.fx},${h.fy} Q${h.cp1x},${h.cp1y} ${h.tx},${h.ty}`}
              stroke={color}
              strokeWidth="0.7"
              opacity="0.45"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={i % 2 === 0 ? 'none' : '3,3'}
            />
          ))}

          <path
            d="M118,202 Q100,212 85,220 Q78,224 75,228"
            stroke={color}
            strokeWidth="16"
            strokeLinecap="round"
            fill="none"
            opacity="0.8"
          />
          <path d="M118,202 Q100,212 85,220 Q78,224 75,228" stroke={color} strokeWidth="10" strokeLinecap="round" fill="none" />
          <path d="M118,202 Q100,212 85,220 Q78,224 75,228" stroke="white" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.12" />
          <ellipse cx="73" cy="230" rx="10" ry="5" fill={color} opacity="0.6" transform="rotate(-15,73,230)" />

          <path
            d="M162,202 Q180,212 195,220 Q202,224 205,228"
            stroke={color}
            strokeWidth="16"
            strokeLinecap="round"
            fill="none"
            opacity="0.8"
          />
          <path d="M162,202 Q180,212 195,220 Q202,224 205,228" stroke={color} strokeWidth="10" strokeLinecap="round" fill="none" />
          <path d="M162,202 Q180,212 195,220 Q202,224 205,228" stroke="white" strokeWidth="1" strokeLinecap="round" fill="none" opacity="0.12" />
          <ellipse cx="207" cy="230" rx="10" ry="5" fill={color} opacity="0.6" transform="rotate(15,207,230)" />

          {mantleFolds.map((f, i) => (
            <path key={i} d={f.d} stroke={color} strokeWidth="0.8" opacity={f.op} fill="none" strokeLinecap="round" />
          ))}
        </g>

        {/* Particles */}
        {particles.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={p.r * 2.5} fill={color} opacity={p.op * 0.3} />
            <circle cx={p.x} cy={p.y} r={p.r} fill={color} opacity={p.op} />
            <circle cx={p.x} cy={p.y} r={p.r * 0.4} fill="white" opacity={p.op * 0.8} />
          </g>
        ))}
      </g>
    </SilhouetteFrame>
  );
}
