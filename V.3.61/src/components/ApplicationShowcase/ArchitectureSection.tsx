import InteriorPreview from '../InteriorPreviews';
import type { InteriorPalette } from '../InteriorPreviews';

interface Props {
  palette: InteriorPalette;
  variant: string;
  sceneOnly?: boolean;
  centerInContainer?: boolean;
}

export function ArchitectureSection({ palette, variant, sceneOnly, centerInContainer = false }: Props) {
  return (
    <div className={centerInContainer ? 'flex h-full w-full items-center justify-center' : 'flex w-full items-start justify-center'}>
      <InteriorPreview palette={palette} variant={variant} sceneOnly={sceneOnly} />
    </div>
  );
}
