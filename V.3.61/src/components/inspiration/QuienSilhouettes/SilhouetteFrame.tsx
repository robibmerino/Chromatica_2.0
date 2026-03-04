import { cn } from '../../../utils/cn';
import { CharacterLabel } from '../QuienTinderCards/CharacterLabel';
import type { CharacterLabelProps } from '../QuienTinderCards/CharacterLabel';

const SVG_VIEWBOX = '0 0 200 320';

interface SilhouetteFrameProps {
  title: string;
  subtitle: string;
  variant?: CharacterLabelProps['variant'];
  className?: string;
  hideLabel?: boolean;
  children: React.ReactNode;
}

/**
 * Layout compartido para siluetas: contenedor flex, SVG y etiqueta.
 */
export function SilhouetteFrame({
  title,
  subtitle,
  variant = 'slate',
  className = '',
  hideLabel = false,
  children,
}: SilhouetteFrameProps) {
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
