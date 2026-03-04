import { cn } from '../../../utils/cn';
import { CharacterLabel } from './CharacterLabel';
import type { CharacterLabelProps } from './CharacterLabel';

const SVG_VIEWBOX = '0 0 200 320';

interface CharacterFrameProps {
  title: string;
  subtitle: string;
  variant?: CharacterLabelProps['variant'];
  className?: string;
  /** Oculta la etiqueta (p. ej. en miniaturas del modal Identidad) */
  hideLabel?: boolean;
  children: React.ReactNode;
}

/**
 * Layout compartido para todos los personajes: contenedor flex, SVG y etiqueta.
 * Evita duplicar div/svg/CharacterLabel en cada personaje.
 */
export function CharacterFrame({ title, subtitle, variant = 'slate', className = '', hideLabel = false, children }: CharacterFrameProps) {
  return (
    <div className={cn('flex flex-col items-center', className)}>
      <svg
        viewBox={SVG_VIEWBOX}
        width="100%"
        height="100%"
        className="flex-1 min-h-0 w-full"
      >
        {children}
      </svg>
      {!hideLabel && <CharacterLabel title={title} subtitle={subtitle} variant={variant} />}
    </div>
  );
}
