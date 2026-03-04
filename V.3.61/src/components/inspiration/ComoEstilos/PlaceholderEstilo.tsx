import { cn } from '../../../utils/cn';
import type { ComoEstiloId, ComoEstiloProps } from './types';
import {
  ESTILO_LABELS,
  ESTILO_SUBTITLES,
  ESTILO_LABEL_VARIANTS,
} from './estiloMetadata';
import { CharacterLabel } from '../QuienTinderCards/CharacterLabel';
import type { CharacterLabelProps } from '../QuienTinderCards/CharacterLabel';

const SVG_VIEWBOX = '0 0 200 320';

interface PlaceholderEstiloProps extends ComoEstiloProps {
  estiloId: ComoEstiloId;
}

/**
 * Estilo placeholder. Sustituir por componentes reales cuando se añadan las variantes.
 * Muestra un icono geométrico genérico hasta que existan los estilos definitivos.
 */
export function PlaceholderEstilo({
  estiloId,
  className = '',
  color = 'rgba(255,255,255,0.85)',
  hideLabel = false,
}: PlaceholderEstiloProps) {
  const label = ESTILO_LABELS[estiloId];
  const subtitle = ESTILO_SUBTITLES[estiloId];
  const variant = ESTILO_LABEL_VARIANTS[estiloId] as CharacterLabelProps['variant'];

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <svg
        viewBox={SVG_VIEWBOX}
        width="100%"
        height="100%"
        className="flex-1 min-h-0 w-full"
      >
        {/* Icono placeholder: forma abstracta para "Estilo" */}
        <g transform="translate(100, 160)">
          <circle
            cx="0"
            cy="-30"
            r="25"
            fill={color}
            fillOpacity={0.9}
            className="transition-colors duration-200"
          />
          <rect
            x="-40"
            y="0"
            width="80"
            height="100"
            rx="8"
            fill={color}
            fillOpacity={0.7}
            className="transition-colors duration-200"
          />
          <path
            d="M -20 120 L 0 180 L 20 120"
            fill="none"
            stroke={color}
            strokeWidth="4"
            strokeOpacity={0.9}
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
