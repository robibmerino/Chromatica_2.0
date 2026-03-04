import InteriorPreview from '../InteriorPreviews';
import type { InteriorPalette } from '../InteriorPreviews';

interface Props {
  palette: InteriorPalette;
  variant: string;
}

export function ArchitectureSection({ palette, variant }: Props) {
  return (
    <div className="flex justify-center items-start w-full">
      <InteriorPreview palette={palette} variant={variant} />
    </div>
  );
}
