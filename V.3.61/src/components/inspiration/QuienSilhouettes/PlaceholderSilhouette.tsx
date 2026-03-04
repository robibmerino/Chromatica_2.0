import { cn } from '../../../utils/cn';
import type { QuienSilhouetteId, QuienSilhouetteProps } from './types';
import {
  SILHOUETTE_LABELS,
  SILHOUETTE_SUBTITLES,
  SILHOUETTE_LABEL_VARIANTS,
} from './silhouetteMetadata';
import { CharacterLabel } from '../QuienTinderCards/CharacterLabel';
import type { CharacterLabelProps } from '../QuienTinderCards/CharacterLabel';

const SVG_VIEWBOX = '0 0 200 320';

/** Variantes de postura para el placeholder (diferenciar siluetas hasta tener SVGs reales). */
const POSE_VARIANTS: Record<number, { scaleY: number; offsetY: number; opacity: number }> = {
  1: { scaleY: 1, offsetY: 0, opacity: 0.9 },
  2: { scaleY: 1.05, offsetY: -5, opacity: 0.85 },
  3: { scaleY: 0.95, offsetY: 5, opacity: 0.9 },
  4: { scaleY: 1.02, offsetY: -2, opacity: 0.88 },
  5: { scaleY: 0.98, offsetY: 3, opacity: 0.87 },
  6: { scaleY: 1.03, offsetY: -4, opacity: 0.86 },
  7: { scaleY: 0.95, offsetY: 8, opacity: 0.9 },
  8: { scaleY: 1.05, offsetY: -6, opacity: 0.84 },
  9: { scaleY: 0.97, offsetY: 2, opacity: 0.88 },
  10: { scaleY: 1.01, offsetY: -1, opacity: 0.89 },
};

/** Silueta humana etérea: cabeza (elipse) + torso + piernas. */
const BODY_PATH =
  'M 100 38 a 16 20 0 1 1 0 40 a 16 20 0 1 1 0 -40 Z' + // cabeza
  ' M 76 80 h 48 v 72 h -48 Z' + // torso
  ' M 76 152 L 70 308 L 98 308 L 100 220 L 102 308 L 130 308 L 124 152 Z'; // piernas

interface PlaceholderSilhouetteProps extends QuienSilhouetteProps {
  silhouetteId: QuienSilhouetteId;
}

/**
 * Silueta placeholder. Sustituir por SVGs de alta calidad de personas con distintas características.
 * Mantiene estilo etéreo (opacidad suave, contornos suaves).
 */
export function PlaceholderSilhouette({
  silhouetteId,
  className = '',
  color = 'rgba(255,255,255,0.85)',
  hideLabel = false,
}: PlaceholderSilhouetteProps) {
  const pose = POSE_VARIANTS[(silhouetteId % 10) || 10] ?? POSE_VARIANTS[1];
  const label = SILHOUETTE_LABELS[silhouetteId];
  const subtitle = SILHOUETTE_SUBTITLES[silhouetteId];
  const variant = SILHOUETTE_LABEL_VARIANTS[silhouetteId] as CharacterLabelProps['variant'];

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <svg
        viewBox={SVG_VIEWBOX}
        width="100%"
        height="100%"
        className="flex-1 min-h-0 w-full"
      >
        <g
          transform={`translate(100, 160) scale(${1 / pose.scaleY}, ${pose.scaleY}) translate(-100, ${-160 + pose.offsetY})`}
        >
          <path
            d={BODY_PATH}
            fill={color}
            fillOpacity={pose.opacity}
            className="transition-colors duration-200"
          />
        </g>
      </svg>
      {!hideLabel && (
        <CharacterLabel title={label} subtitle={subtitle} variant={variant} />
      )}
    </div>
  );
}
