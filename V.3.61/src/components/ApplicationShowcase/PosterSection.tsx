import React from 'react';
import type { PosterPalette, PosterVariant } from './types';
import {
  PosterConference,
  PosterExhibitionSwiss,
  PosterFestivalGig,
  PosterCollage,
  PosterCompetition,
} from './posters';

interface Props {
  posterColors: PosterPalette;
  variant: PosterVariant | string;
}

const POSTER_VARIANTS: Record<string, React.ComponentType<{ posterColors: PosterPalette }>> = {
  conference: PosterConference,
  'exhibition-swiss': PosterExhibitionSwiss,
  'festival-gig': PosterFestivalGig,
  collage: PosterCollage,
  competition: PosterCompetition,
};

export function PosterSection({ posterColors, variant }: Props) {
  const VariantComponent = POSTER_VARIANTS[variant] ?? PosterConference;
  return <VariantComponent posterColors={posterColors} />;
}
