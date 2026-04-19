import InteriorPreview from '../InteriorPreviews';
import type { InteriorPalette } from '../InteriorPreviews';

interface Props {
  palette: InteriorPalette;
  variant: string;
  sceneOnly?: boolean;
}

export function ArchitectureSection({ palette, variant, sceneOnly }: Props) {
  return (
    <div className="flex justify-center items-start w-full">
      <InteriorPreview palette={palette} variant={variant} sceneOnly={sceneOnly} />
    </div>
  );
}
