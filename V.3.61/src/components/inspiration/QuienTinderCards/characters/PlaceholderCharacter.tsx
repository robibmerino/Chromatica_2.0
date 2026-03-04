import { useUniqueSvgIds } from '../useUniqueSvgIds';
import { CharacterFrame } from '../CharacterFrame';
import type { QuienCharacterProps } from '../types';

/** Placeholder mientras se añaden las nuevas criaturas. */
export function PlaceholderCharacter({ className = '', hideLabel }: QuienCharacterProps) {
  const svgId = useUniqueSvgIds('placeholder-char');
  const bgId = svgId('bg');
  return (
    <CharacterFrame
      title="Pendiente"
      subtitle="Nueva criatura en camino"
      variant="slate"
      className={className}
      hideLabel={hideLabel}
    >
      <defs>
        <linearGradient id={bgId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#374151" />
          <stop offset="100%" stopColor="#1f2937" />
        </linearGradient>
      </defs>
      <rect width="200" height="320" fill={`url(#${bgId})`} />
      <ellipse cx="100" cy="160" rx="40" ry="50" fill="#4b5563" opacity="0.6" />
      <text x="100" y="280" textAnchor="middle" fill="#9ca3af" fontSize="12" fontFamily="system-ui, sans-serif">
        Pendiente
      </text>
    </CharacterFrame>
  );
}
