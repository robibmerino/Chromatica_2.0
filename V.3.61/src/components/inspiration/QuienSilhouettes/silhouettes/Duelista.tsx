import { useUniqueSvgIds } from '../../QuienTinderCards/useUniqueSvgIds';
import { SilhouetteFrame } from '../SilhouetteFrame';
import { getSilhouetteMetadata } from '../silhouetteMetadata';
import type { QuienSilhouetteProps } from '../types';

const SILHOUETTE_ID = 6 as const;

const DEFAULT_COLOR = '#818cf8';

const particles = [
  { x: 80, y: 82, r: 1.8, o: 0.7 },
  { x: 95, y: 90, r: 1.2, o: 0.5 },
  { x: 110, y: 98, r: 1.5, o: 0.6 },
  { x: 125, y: 105, r: 1.0, o: 0.45 },
  { x: 140, y: 112, r: 1.8, o: 0.65 },
  { x: 65, y: 78, r: 1.0, o: 0.4 },
  { x: 72, y: 95, r: 1.3, o: 0.5 },
  { x: 88, y: 108, r: 0.8, o: 0.35 },
  { x: 155, y: 118, r: 1.2, o: 0.5 },
  { x: 62, y: 110, r: 1.5, o: 0.4 },
];

/**
 * Duelista: figura de esgrima con espada de plasma, postura dinámica y afterimages.
 * Simboliza la precisión, el duelo y la elegancia en combate.
 */
export function Duelista({
  className = '',
  color = DEFAULT_COLOR,
  hideLabel = false,
}: QuienSilhouetteProps) {
  const svgId = useUniqueSvgIds('duelista');
  const ids = {
    aura1: svgId('aura1'),
    aura2: svgId('aura2'),
    aura3: svgId('aura3'),
    body: svgId('body'),
    blade: svgId('blade'),
    mask: svgId('mask'),
    maskGrad: svgId('maskGrad'),
  };

  const meta = getSilhouetteMetadata(SILHOUETTE_ID);

  return (
    <SilhouetteFrame
      title={meta?.name ?? 'Duelista'}
      subtitle={meta?.subtitle ?? 'Acción'}
      variant={meta?.labelVariant ?? 'violet'}
      className={className}
      hideLabel={hideLabel}
    >
      <g transform="translate(100, 160) scale(1.1) translate(-100, -160) translate(-14, -26)">
        <defs>
          <radialGradient id={ids.aura1} cx="52%" cy="48%" r="48%">
            <stop offset="0%" stopColor={color} stopOpacity="0.18" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={ids.aura2} cx="52%" cy="48%" r="36%">
            <stop offset="0%" stopColor={color} stopOpacity="0.22" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
          <radialGradient id={ids.aura3} cx="52%" cy="48%" r="22%">
            <stop offset="0%" stopColor="white" stopOpacity="0.10" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
          <linearGradient id={ids.body} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="white" stopOpacity="0.55" />
            <stop offset="40%" stopColor={color} stopOpacity="0.80" />
            <stop offset="100%" stopColor={color} stopOpacity="0.10" />
          </linearGradient>
          <linearGradient id={ids.blade} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="white" stopOpacity="0.9" />
            <stop offset="30%" stopColor={color} stopOpacity="0.95" />
            <stop offset="100%" stopColor={color} stopOpacity="0.2" />
          </linearGradient>
          <mask id={ids.mask}>
            <radialGradient id={ids.maskGrad} cx="50%" cy="45%" r="50%">
              <stop offset="55%" stopColor="white" />
              <stop offset="100%" stopColor="black" />
            </radialGradient>
            <rect width="200" height="320" fill={`url(#${ids.maskGrad})`} />
          </mask>
        </defs>

        {/* Auras */}
        <ellipse cx="105" cy="155" rx="85" ry="130" fill={`url(#${ids.aura1})`} />
        <ellipse cx="105" cy="155" rx="60" ry="95" fill={`url(#${ids.aura2})`} />
        <ellipse cx="105" cy="155" rx="35" ry="60" fill={`url(#${ids.aura3})`} />

        <g mask={`url(#${ids.mask})`}>
          {/* Afterimages */}
          <g opacity="0.08">
            <path d="M108,145 Q125,130 148,118" stroke={color} strokeWidth="6" strokeLinecap="round" />
            <line x1="148" y1="118" x2="175" y2="95" stroke={color} strokeWidth="2" strokeLinecap="round" />
          </g>
          <g opacity="0.15">
            <path d="M108,148 Q128,135 150,125" stroke={color} strokeWidth="7" strokeLinecap="round" />
            <line x1="150" y1="125" x2="172" y2="105" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
          </g>
          <g opacity="0.25">
            <path d="M108,150 Q130,138 152,130" stroke={color} strokeWidth="8" strokeLinecap="round" />
            <line x1="152" y1="130" x2="170" y2="112" stroke={color} strokeWidth="3" strokeLinecap="round" />
          </g>

          {/* Piernas */}
          <path d="M100,230 Q95,255 90,278" stroke={`url(#${ids.body})`} strokeWidth="14" strokeLinecap="round" />
          <path d="M100,230 Q95,255 90,278" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.25" />
          <path d="M90,278 Q86,292 84,305" stroke={`url(#${ids.body})`} strokeWidth="10" strokeLinecap="round" />
          <path d="M84,305 Q80,308 72,308" stroke={color} strokeWidth="8" strokeLinecap="round" opacity="0.7" />

          <path d="M108,228 Q118,245 124,262" stroke={`url(#${ids.body})`} strokeWidth="16" strokeLinecap="round" />
          <path d="M108,228 Q118,245 124,262" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.3" />
          <ellipse cx="124" cy="263" rx="9" ry="8" fill={color} opacity="0.5" />
          <ellipse cx="124" cy="263" rx="5" ry="4.5" fill="white" opacity="0.2" />
          <path d="M124,263 Q128,278 130,295" stroke={`url(#${ids.body})`} strokeWidth="12" strokeLinecap="round" />
          <path d="M130,295 Q135,302 145,304" stroke={color} strokeWidth="9" strokeLinecap="round" opacity="0.7" />
          <path d="M130,295 Q135,302 145,304" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.3" />

          {/* Torso */}
          <path
            d="M95,175 Q88,195 90,215 Q95,228 108,230 Q118,228 122,215 Q126,200 120,178 Q112,165 95,175Z"
            fill={`url(#${ids.body})`}
            opacity="0.9"
          />
          <path d="M97,178 Q91,195 93,212 Q97,222 106,224" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.35" />
          <path d="M100,188 Q108,192 116,190" stroke="white" strokeWidth="0.8" opacity="0.2" />
          <path d="M98,200 Q107,204 118,202" stroke="white" strokeWidth="0.8" opacity="0.2" />
          <path d="M99,212 Q108,215 119,213" stroke="white" strokeWidth="0.8" opacity="0.2" />

          {/* Cinturón */}
          <path d="M92,218 Q108,222 124,218" stroke={color} strokeWidth="5" strokeLinecap="round" opacity="0.8" />
          <path d="M92,218 Q108,222 124,218" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
          <rect x="104" y="215" width="8" height="7" rx="1.5" fill={color} opacity="0.9" />
          <rect x="106" y="217" width="4" height="3" rx="0.5" fill="white" opacity="0.5" />

          {/* Hombros */}
          <ellipse cx="94" cy="175" rx="10" ry="7" fill={color} opacity="0.6" transform="rotate(-15 94 175)" />
          <ellipse cx="94" cy="175" rx="6" ry="3.5" fill="white" opacity="0.2" transform="rotate(-15 94 175)" />
          <ellipse cx="120" cy="174" rx="11" ry="7.5" fill={color} opacity="0.7" transform="rotate(10 120 174)" />
          <ellipse cx="120" cy="174" rx="7" ry="4" fill="white" opacity="0.25" transform="rotate(10 120 174)" />

          {/* Brazo trasero */}
          <path d="M94,175 Q78,160 72,145" stroke={`url(#${ids.body})`} strokeWidth="11" strokeLinecap="round" />
          <path d="M94,175 Q78,160 72,145" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
          <path d="M72,145 Q68,132 70,118" stroke={`url(#${ids.body})`} strokeWidth="9" strokeLinecap="round" />
          <path d="M70,118 Q65,108 63,100" stroke={color} strokeWidth="3.5" strokeLinecap="round" opacity="0.8" />
          <path d="M70,118 Q67,107 67,98" stroke={color} strokeWidth="3" strokeLinecap="round" opacity="0.7" />
          <path d="M70,118 Q70,107 72,99" stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
          <path d="M70,118 Q74,108 77,101" stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity="0.5" />
          <path d="M70,118 Q76,110 80,104" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.4" />
          <path d="M65,108 Q64,104 63,100" stroke="white" strokeWidth="0.5" strokeLinecap="round" opacity="0.5" />
          <path d="M67,107 Q67,102 67,98" stroke="white" strokeWidth="0.5" strokeLinecap="round" opacity="0.5" />

          {/* Brazo delantero */}
          <path d="M120,174 Q138,162 152,155" stroke={`url(#${ids.body})`} strokeWidth="12" strokeLinecap="round" />
          <path d="M120,174 Q138,162 152,155" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.3" />
          <path d="M152,155 Q162,150 168,145" stroke={`url(#${ids.body})`} strokeWidth="10" strokeLinecap="round" />
          <ellipse cx="170" cy="143" rx="7" ry="5.5" fill={color} opacity="0.75" transform="rotate(-20 170 143)" />
          <ellipse cx="170" cy="143" rx="4" ry="3" fill="white" opacity="0.25" transform="rotate(-20 170 143)" />

          {/* Espada */}
          <line x1="172" y1="140" x2="58" y2="70" stroke={color} strokeWidth="12" strokeLinecap="round" opacity="0.08" />
          <line x1="172" y1="140" x2="58" y2="70" stroke={color} strokeWidth="6" strokeLinecap="round" opacity="0.15" />
          <line x1="172" y1="140" x2="58" y2="70" stroke={`url(#${ids.blade})`} strokeWidth="2.5" strokeLinecap="round" />
          <line x1="172" y1="139" x2="60" y2="70" stroke="white" strokeWidth="0.8" strokeLinecap="round" opacity="0.85" />
          <line x1="172" y1="142" x2="60" y2="72" stroke={color} strokeWidth="0.6" strokeLinecap="round" opacity="0.5" />
          <ellipse cx="57" cy="69" rx="3" ry="2" fill="white" opacity="0.9" transform="rotate(-30 57 69)" />
          <ellipse cx="57" cy="69" rx="1.5" ry="1" fill="white" opacity="1" transform="rotate(-30 57 69)" />
          <line x1="53" y1="65" x2="61" y2="73" stroke="white" strokeWidth="0.8" opacity="0.6" strokeLinecap="round" />
          <line x1="53" y1="73" x2="61" y2="65" stroke="white" strokeWidth="0.8" opacity="0.6" strokeLinecap="round" />

          <path d="M167,148 Q172,140 177,133" stroke={color} strokeWidth="5" strokeLinecap="round" opacity="0.9" />
          <path d="M167,148 Q172,140 177,133" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
          <circle cx="172" cy="140" r="3.5" fill={color} opacity="0.8" />
          <circle cx="172" cy="140" r="2" fill="white" opacity="0.5" />
          <circle cx="172" cy="140" r="0.8" fill="white" opacity="0.9" />

          <path d="M172,140 Q175,136 178,132" stroke={color} strokeWidth="8" strokeLinecap="round" opacity="0.7" />
          <path d="M172,140 Q175,136 178,132" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.3" />
          <path d="M173,138 L176,134" stroke="white" strokeWidth="1" opacity="0.4" />
          <path d="M174,136 L177,132" stroke="white" strokeWidth="1" opacity="0.35" />
          <ellipse cx="179" cy="130" rx="5" ry="4" fill={color} opacity="0.9" transform="rotate(-30 179 130)" />
          <ellipse cx="179" cy="130" rx="3" ry="2" fill="white" opacity="0.4" transform="rotate(-30 179 130)" />
          <circle cx="179" cy="130" r="1.2" fill="white" opacity="0.8" />

          {/* Cuello y cabeza */}
          <path d="M104,165 Q108,160 110,155" stroke={`url(#${ids.body})`} strokeWidth="9" strokeLinecap="round" />
          <ellipse cx="108" cy="148" rx="16" ry="18" fill={`url(#${ids.body})`} opacity="0.85" />
          <ellipse cx="108" cy="148" rx="16" ry="18" stroke={color} strokeWidth="0.8" opacity="0.4" />

          {/* Máscara */}
          <path
            d="M96,138 Q96,128 108,126 Q120,126 120,136 Q120,148 112,152 Q105,154 98,150 Q96,146 96,138Z"
            fill={color}
            opacity="0.35"
          />
          <path
            d="M96,138 Q96,128 108,126 Q120,126 120,136 Q120,148 112,152 Q105,154 98,150 Q96,146 96,138Z"
            stroke={color}
            strokeWidth="1.5"
            opacity="0.7"
          />
          <line x1="97" y1="133" x2="119" y2="133" stroke={color} strokeWidth="1" opacity="0.5" />
          <line x1="97" y1="138" x2="119" y2="138" stroke={color} strokeWidth="1" opacity="0.5" />
          <line x1="97" y1="143" x2="118" y2="143" stroke={color} strokeWidth="1" opacity="0.5" />
          <line x1="98" y1="148" x2="115" y2="148" stroke={color} strokeWidth="1" opacity="0.4" />
          <line x1="102" y1="128" x2="100" y2="152" stroke={color} strokeWidth="0.8" opacity="0.4" />
          <line x1="108" y1="126" x2="108" y2="153" stroke={color} strokeWidth="0.8" opacity="0.4" />
          <line x1="114" y1="127" x2="113" y2="152" stroke={color} strokeWidth="0.8" opacity="0.4" />
          <path d="M98,132 Q108,128 118,132" stroke="white" strokeWidth="1" opacity="0.3" strokeLinecap="round" />

          <path d="M108,126 Q105,115 100,105 Q97,98 99,92" stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
          <path d="M108,126 Q106,115 102,105 Q100,98 103,92" stroke={color} strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
          <path d="M108,126 Q107,115 104,106 Q103,99 106,93" stroke="white" strokeWidth="0.8" strokeLinecap="round" opacity="0.3" />

          {/* Manto */}
          <path
            d="M94,178 Q80,200 75,225 Q72,248 76,270 Q80,285 85,295"
            stroke={`url(#${ids.body})`}
            strokeWidth="18"
            strokeLinecap="round"
            opacity="0.5"
          />
          <path
            d="M94,178 Q80,200 75,225 Q72,248 76,270 Q80,285 85,295"
            stroke={color}
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.4"
          />
          <path d="M88,195 Q76,210 73,228" stroke="white" strokeWidth="0.8" strokeLinecap="round" opacity="0.2" />
          <path d="M85,215 Q74,230 72,248" stroke="white" strokeWidth="0.8" strokeLinecap="round" opacity="0.18" />
          <path d="M82,238 Q74,252 75,268" stroke="white" strokeWidth="0.8" strokeLinecap="round" opacity="0.15" />

          {/* Partículas */}
          {particles.map((p, i) => (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r={p.r * 2.5} fill={color} opacity={p.o * 0.3} />
              <circle cx={p.x} cy={p.y} r={p.r} fill="white" opacity={p.o} />
            </g>
          ))}
        </g>
      </g>
    </SilhouetteFrame>
  );
}
