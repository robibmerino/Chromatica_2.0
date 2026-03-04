/** Póster: dimensiones y escala compartidas (proporción A3/A2). */
export const POSTER_BASE_WIDTH = 620;
export const POSTER_HEIGHT = Math.round(POSTER_BASE_WIDTH * Math.SQRT2);
export const POSTER_SCALE = 0.78;
/** Altura de referencia 620×826 para pósters Swiss y Festival Gig (escalado a POSTER_HEIGHT). */
export const POSTER_REF_HEIGHT = 826;
/** Índices de la rejilla decorativa tipo QR en el pie del póster Conference (celdas rellenas). */
export const CONFERENCE_QR_FILL_INDICES = [0, 1, 3, 4, 5, 7, 8, 10, 12, 13, 15];

/** Póster Collage: clip-path de los bloques y URLs de grano (feTurbulence). */
export const COLLAGE_CLIP_1 = 'polygon(0% 0%, 100% 0%, 100% 2%, 98% 3%, 100% 5%, 99% 8%, 100% 12%, 98% 18%, 100% 25%, 99% 35%, 100% 45%, 98% 55%, 100% 65%, 99% 72%, 100% 80%, 97% 88%, 100% 92%, 99% 96%, 100% 100%, 0% 100%, 1% 95%, 0% 90%, 2% 85%, 0% 78%, 1% 70%, 0% 60%, 2% 50%, 0% 40%, 1% 30%, 0% 20%, 2% 10%)';
export const COLLAGE_CLIP_2 = 'polygon(2% 0%, 5% 2%, 10% 0%, 18% 1%, 25% 0%, 35% 2%, 45% 0%, 55% 1%, 65% 0%, 75% 2%, 85% 0%, 92% 1%, 100% 0%, 100% 100%, 95% 98%, 88% 100%, 80% 99%, 70% 100%, 60% 98%, 50% 100%, 40% 99%, 30% 100%, 20% 98%, 10% 100%, 3% 99%, 0% 100%, 0% 0%)';
export const COLLAGE_CLIP_3 = 'polygon(3% 2%, 8% 0%, 15% 3%, 25% 0%, 40% 2%, 55% 0%, 70% 3%, 85% 1%, 95% 3%, 100% 0%, 100% 100%, 97% 97%, 90% 100%, 80% 98%, 65% 100%, 50% 97%, 35% 100%, 20% 98%, 8% 100%, 0% 97%, 0% 3%)';
export const COLLAGE_CLIP_5 = 'polygon(0% 5%, 5% 0%, 20% 3%, 40% 0%, 60% 4%, 80% 0%, 95% 2%, 100% 0%, 100% 95%, 95% 100%, 75% 97%, 55% 100%, 35% 98%, 15% 100%, 0% 96%)';
export const COLLAGE_GRAIN_URL = "data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='np'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23np)'/%3E%3C/svg%3E";
export const COLLAGE_GRAIN2_URL = "data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='nq'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23nq)'/%3E%3C/svg%3E";

/** Póster Competition: URLs de texturas (grano + papel). */
export const COMPETITION_GRAIN_URL = "data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='nc'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23nc)'/%3E%3C/svg%3E";
export const COMPETITION_PAPER_URL = "data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='pc'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23pc)'/%3E%3C/svg%3E";

/** Branding Territorio visual: grano y kraft (ids únicos nb, bk). */
export const BRANDING_GRAIN_URL = "data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='nb'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23nb)'/%3E%3C/svg%3E";
export const BRANDING_KRAFT_URL = "data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='bk'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.5' numOctaves='6' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23bk)'/%3E%3C/svg%3E";

/** Inicial y nombre por posición en la paleta principal (igual que en Refinar). */
export const PALETTE_ROLE_LABELS: { initial: string; label: string }[] = [
  { initial: 'P', label: 'Principal' },
  { initial: 'S', label: 'Secundario' },
  { initial: 'A', label: 'Acento' },
  { initial: 'A2', label: 'Acento 2' },
  { initial: 'P2', label: 'Principal 2' },
  { initial: 'S2', label: 'Secundario 2' },
  { initial: 'A3', label: 'Acento 3' },
  { initial: 'A4', label: 'Acento 4' },
];

export function getMainPaletteRole(index: number): { initial: string; label: string } {
  return PALETTE_ROLE_LABELS[index] ?? { initial: String(index + 1), label: `Color ${index + 1}` };
}
