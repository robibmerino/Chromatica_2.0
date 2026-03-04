import { useUniqueSvgIds } from '../../QuienTinderCards/useUniqueSvgIds';
import { SilhouetteFrame } from '../SilhouetteFrame';
import { getSilhouetteMetadata } from '../silhouetteMetadata';
import type { QuienSilhouetteProps } from '../types';

const SILHOUETTE_ID = 1 as const;

const DEFAULT_COLOR = '#14b8a6';

/**
 * Contemplativo: figura de alquimista con esfera de cristal.
 * Postura 3/4, brazos levantados hacia la esfera, manto con pliegues, partículas etéreas.
 */
export function Contemplativo({
  className = '',
  color = DEFAULT_COLOR,
  hideLabel = false,
}: QuienSilhouetteProps) {
  const svgId = useUniqueSvgIds('contemplativo');
  const aura1 = svgId('aura1');
  const aura2 = svgId('aura2');
  const aura3 = svgId('aura3');
  const sphereGrad = svgId('sphere');
  const sphereInner = svgId('sphereInner');
  const sphereRefl = svgId('sphereRefl');
  const glowGrad = svgId('glow');
  const maskId = svgId('mask');
  const maskGrad = svgId('maskGrad');
  const hoodGrad = svgId('hood');

  const meta = getSilhouetteMetadata(SILHOUETTE_ID);

  return (
    <SilhouetteFrame
      title={meta?.name ?? 'Contemplativo'}
      subtitle={meta?.subtitle ?? 'Serenidad'}
      variant={meta?.labelVariant ?? 'slate'}
      className={className}
      hideLabel={hideLabel}
    >
      <defs>
        {/* Auras de eterealidad */}
        <radialGradient id={aura1} cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={aura2} cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={aura3} cx="50%" cy="45%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="70%" stopColor={color} stopOpacity="0.1" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>

        {/* Esfera de cristal */}
        <radialGradient id={sphereGrad} cx="38%" cy="32%" r="60%">
          <stop offset="0%" stopColor="white" stopOpacity="0.9" />
          <stop offset="30%" stopColor={color} stopOpacity="0.6" />
          <stop offset="70%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.5" />
        </radialGradient>
        <radialGradient id={sphereInner} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.9" />
          <stop offset="50%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={sphereRefl} cx="35%" cy="28%" r="40%">
          <stop offset="0%" stopColor="white" stopOpacity="0.95" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>

        {/* Glow de la esfera sobre la figura */}
        <radialGradient id={glowGrad} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>

        {/* Máscara de desvanecimiento */}
        <radialGradient id={maskGrad} cx="50%" cy="45%" r="48%">
          <stop offset="40%" stopColor="white" stopOpacity="1" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <mask id={maskId}>
          <rect width="200" height="320" fill={`url(#${maskGrad})`} />
        </mask>

        {/* Interior capucha */}
        <radialGradient id={hoodGrad} cx="50%" cy="60%" r="50%">
          <stop offset="0%" stopColor="#000" stopOpacity="0.85" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
      </defs>

      <g transform="translate(100, 160) scale(1.15) translate(-100, -160) translate(0, -28)" mask={`url(#${maskId})`}>
        {/* Auras de eterealidad */}
        <ellipse cx="100" cy="155" rx="88" ry="130" fill={`url(#${aura1})`} />
        <ellipse cx="100" cy="155" rx="68" ry="105" fill={`url(#${aura2})`} />
        <ellipse cx="100" cy="155" rx="50" ry="82" fill={`url(#${aura3})`} />

        {/* Glow de la esfera iluminando la figura */}
        <ellipse cx="105" cy="148" rx="38" ry="38" fill={`url(#${glowGrad})`} opacity="0.7" />

        {/* ── FIGURA ── */}

        {/* Piernas — ligeramente asimétricas, postura 3/4 */}
        <path
          d="M88 240 Q85 270 82 300 Q84 302 90 302 Q94 290 97 265 Q100 280 103 302 Q109 302 111 300 Q108 270 107 240 Z"
          fill={color}
          opacity="0.55"
        />
        <line x1="95" y1="248" x2="93" y2="285" stroke="white" strokeWidth="0.5" opacity="0.3" />
        <line x1="103" y1="248" x2="105" y2="278" stroke="white" strokeWidth="0.5" opacity="0.25" />

        {/* Manto inferior — pliegues */}
        <path
          d="M78 200 Q70 220 68 250 Q72 255 80 252 Q84 235 88 240 L107 240 Q110 235 118 252 Q126 255 130 250 Q128 220 122 200 Z"
          fill={color}
          opacity="0.45"
        />
        <path d="M82 205 Q78 228 76 248" fill="none" stroke="white" strokeWidth="0.6" opacity="0.25" />
        <path d="M90 202 Q88 225 88 240" fill="none" stroke="white" strokeWidth="0.5" opacity="0.2" />
        <path d="M110 202 Q112 225 112 240" fill="none" stroke="white" strokeWidth="0.5" opacity="0.2" />
        <path d="M118 205 Q121 228 122 248" fill="none" stroke="white" strokeWidth="0.6" opacity="0.25" />

        {/* Torso — girado 3/4, brazos levantados */}
        <path d="M82 160 Q80 165 78 200 L122 200 Q120 165 118 160 Z" fill={color} opacity="0.6" />
        <path d="M86 163 Q84 180 83 198" fill="none" stroke="white" strokeWidth="0.7" opacity="0.3" />
        <path d="M96 162 Q95 180 95 198" fill="none" stroke="white" strokeWidth="0.5" opacity="0.22" />
        <path d="M114 163 Q115 180 117 198" fill="none" stroke="white" strokeWidth="0.7" opacity="0.3" />
        <path d="M88 162 Q86 178 85 196" fill="none" stroke="white" strokeWidth="0.4" opacity="0.5" />

        {/* Hombros */}
        <path d="M82 160 Q72 155 65 158 Q63 162 65 166 Q72 164 82 165 Z" fill={color} opacity="0.65" />
        <path d="M118 160 Q128 155 136 157 Q138 161 136 165 Q129 163 118 165 Z" fill={color} opacity="0.65" />

        {/* Brazo izquierdo */}
        <path
          d="M65 158 Q58 162 55 168 Q52 175 56 180 Q62 175 68 170 Q72 165 75 162 Z"
          fill={color}
          opacity="0.58"
        />
        <path d="M56 178 Q50 183 50 190 Q51 196 56 198 Q58 192 60 186 Z" fill={color} opacity="0.55" />
        <path d="M50 190 Q47 188 45 184" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
        <path d="M51 193 Q47 192 44 189" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
        <path d="M52 196 Q48 196 46 194" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity="0.55" />
        <path d="M54 198 Q51 199 49 198" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
        <path d="M50 190 Q47 188 45 184" fill="none" stroke="white" strokeWidth="0.5" strokeLinecap="round" opacity="0.4" />
        <path d="M51 193 Q47 192 44 189" fill="none" stroke="white" strokeWidth="0.5" strokeLinecap="round" opacity="0.35" />

        {/* Brazo derecho */}
        <path
          d="M136 157 Q143 161 146 167 Q149 174 145 179 Q138 174 133 169 Q129 163 127 160 Z"
          fill={color}
          opacity="0.58"
        />
        <path d="M145 177 Q151 182 151 189 Q150 195 145 197 Q143 191 141 185 Z" fill={color} opacity="0.55" />
        <path d="M151 188 Q155 186 157 182" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
        <path d="M150 192 Q154 191 157 188" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity="0.6" />
        <path d="M149 195 Q153 195 155 193" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" opacity="0.55" />
        <path d="M147 197 Q150 198 152 197" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.5" />
        <path d="M151 188 Q155 186 157 182" fill="none" stroke="white" strokeWidth="0.5" strokeLinecap="round" opacity="0.4" />
        <path d="M150 192 Q154 191 157 188" fill="none" stroke="white" strokeWidth="0.5" strokeLinecap="round" opacity="0.35" />

        {/* Cuello */}
        <rect x="93" y="148" width="14" height="14" rx="3" fill={color} opacity="0.65" />

        {/* Cabeza */}
        <ellipse cx="102" cy="133" rx="16" ry="18" fill={color} opacity="0.62" />
        {/* Capucha */}
        <path
          d="M86 133 Q86 110 102 108 Q118 110 118 133 Q115 140 102 142 Q89 140 86 133 Z"
          fill={color}
          opacity="0.55"
        />
        <ellipse cx="102" cy="130" rx="10" ry="12" fill={`url(#${hoodGrad})`} />
        <path d="M88 125 Q90 112 102 110" fill="none" stroke="white" strokeWidth="0.7" opacity="0.35" />

        {/* ── ESFERA DE CRISTAL ── */}
        <circle cx="100" cy="170" r="32" fill={color} opacity="0.08" />
        <circle cx="100" cy="170" r="26" fill={color} opacity="0.12" />
        <circle cx="100" cy="170" r="22" fill={`url(#${sphereGrad})`} opacity="0.85" />
        <circle cx="100" cy="170" r="22" fill="none" stroke={color} strokeWidth="0.8" opacity="0.6" />
        <circle cx="100" cy="170" r="22" fill="none" stroke="white" strokeWidth="0.3" opacity="0.4" />
        <circle cx="100" cy="170" r="15" fill={`url(#${sphereInner})`} opacity="0.7" />

        {/* Espirales de vapor */}
        <path
          d="M96 164 Q102 160 106 165 Q110 170 106 175 Q102 178 97 175"
          fill="none"
          stroke={color}
          strokeWidth="1"
          opacity="0.8"
          strokeLinecap="round"
        />
        <path
          d="M98 166 Q103 162 107 166 Q110 171 107 175"
          fill="none"
          stroke="white"
          strokeWidth="0.4"
          opacity="0.6"
          strokeLinecap="round"
        />
        <path
          d="M94 170 Q97 165 101 168 Q104 172 101 176 Q98 178 95 175"
          fill="none"
          stroke={color}
          strokeWidth="0.8"
          opacity="0.7"
          strokeLinecap="round"
        />
        <path
          d="M103 162 Q108 158 111 163 Q113 168 110 172"
          fill="none"
          stroke={color}
          strokeWidth="0.7"
          opacity="0.65"
          strokeLinecap="round"
        />

        {/* Burbujas geométricas */}
        <circle cx="95" cy="163" r="2.5" fill="none" stroke={color} strokeWidth="0.8" opacity="0.85" />
        <circle cx="95" cy="163" r="1" fill="white" opacity="0.7" />
        <circle cx="107" cy="160" r="3" fill="none" stroke={color} strokeWidth="0.8" opacity="0.8" />
        <circle cx="107" cy="160" r="1.2" fill="white" opacity="0.65" />
        <circle cx="110" cy="172" r="2" fill="none" stroke={color} strokeWidth="0.7" opacity="0.75" />
        <circle cx="110" cy="172" r="0.8" fill="white" opacity="0.6" />
        <circle cx="93" cy="174" r="1.8" fill="none" stroke={color} strokeWidth="0.7" opacity="0.7" />
        <circle cx="93" cy="174" r="0.7" fill="white" opacity="0.55" />
        <circle cx="102" cy="180" r="2.2" fill="none" stroke={color} strokeWidth="0.8" opacity="0.75" />
        <circle cx="102" cy="180" r="0.9" fill="white" opacity="0.6" />
        <circle cx="97" cy="178" r="1.5" fill="none" stroke={color} strokeWidth="0.6" opacity="0.65" />
        <circle cx="97" cy="178" r="0.6" fill="white" opacity="0.5" />

        {/* Cristales en formación */}
        <path d="M104 166 L107 162 L108 166 L105 169 Z" fill={color} opacity="0.7" />
        <path d="M104 166 L107 162 L108 166" fill="none" stroke="white" strokeWidth="0.4" opacity="0.6" />
        <path d="M94 168 L91 165 L90 169 L93 171 Z" fill={color} opacity="0.65" />
        <path d="M94 168 L91 165 L90 169" fill="none" stroke="white" strokeWidth="0.4" opacity="0.55" />
        <path d="M100 175 L98 172 L102 172 Z" fill={color} opacity="0.7" />
        <path d="M100 175 L98 172 L102 172 Z" fill="none" stroke="white" strokeWidth="0.4" opacity="0.5" />

        {/* Reflejos esfera */}
        <ellipse cx="94" cy="161" rx="7" ry="4" fill={`url(#${sphereRefl})`} opacity="0.8" transform="rotate(-20 94 161)" />
        <ellipse cx="106" cy="180" rx="4" ry="2" fill="white" opacity="0.12" transform="rotate(15 106 180)" />
        <circle cx="100" cy="170" r="22" fill="none" stroke="white" strokeWidth="0.4" opacity="0.5" />

        {/* Partículas escapando */}
        {[
          { x: 78, y: 155, r: 1.4, o: 0.7 },
          { x: 72, y: 162, r: 1.0, o: 0.55 },
          { x: 75, y: 148, r: 0.8, o: 0.5 },
          { x: 122, y: 153, r: 1.3, o: 0.65 },
          { x: 128, y: 161, r: 0.9, o: 0.5 },
          { x: 125, y: 145, r: 1.1, o: 0.6 },
          { x: 100, y: 143, r: 1.5, o: 0.7 },
          { x: 95, y: 137, r: 0.9, o: 0.5 },
          { x: 106, y: 140, r: 1.0, o: 0.55 },
          { x: 100, y: 197, r: 1.2, o: 0.55 },
          { x: 92, y: 194, r: 0.8, o: 0.45 },
          { x: 108, y: 195, r: 1.0, o: 0.5 },
          { x: 83, y: 170, r: 0.7, o: 0.4 },
          { x: 117, y: 168, r: 0.7, o: 0.4 },
        ].map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={p.r * 2.5} fill={color} opacity={p.o * 0.25} />
            <circle cx={p.x} cy={p.y} r={p.r} fill={color} opacity={p.o} />
            <circle cx={p.x} cy={p.y} r={p.r * 0.4} fill="white" opacity={p.o * 0.9} />
          </g>
        ))}
      </g>
    </SilhouetteFrame>
  );
}
