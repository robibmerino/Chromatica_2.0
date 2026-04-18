import type { ReferenceItem } from '../types';

export const TEMPERATURE_HARMONY_REFERENCES: ReferenceItem[] = [
  {
    id: 'ou-2004-warm-cool',
    category: 'Artículo científico',
    title: 'A study of colour emotion and colour preference. Part I: Colour emotions for single colours',
    authors: 'Ou, L. C., Luo, M. R., Woodcock, A., & Wright, A.',
    source: 'Color Research & Application, 29(3), 232–240. Wiley (2004).',
    summaryParagraphs: [
      'Estudio empírico que cuantifica emociones cromáticas en varias dimensiones, entre ellas el eje warm–cool en espacio CIELAB.',
      'La métrica WC = −0,5 + 0,02 · (C*)^1,07 · cos(h° − 50°) resume la temperatura percibida a partir de croma y tono; la usamos como clasificación orientativa por swatch.',
    ],
    linkLabel: 'DOI (Wiley)',
    href: 'https://doi.org/10.1002/col.20024',
  },
  {
    id: 'chevreul-1839',
    category: 'Libro fundacional',
    title: 'The Principles of Harmony and Contrast of Colors',
    authors: 'Chevreul, M. E.',
    source: 'Pitman Publishing (edición inglesa, 1854).',
    summaryParagraphs: [
      'Contraste simultáneo y armonía entre tonos cálidos y fríos; base histórica de la idea de dominante con acento opuesto.',
    ],
    linkLabel: 'Archive.org',
    href: 'https://archive.org/details/principlesofharm00chev',
  },
  {
    id: 'kobayashi-1981-color-image-scale',
    category: 'Artículo científico',
    title: 'The aim and method of the color image scale',
    authors: 'Kobayashi, S.',
    source: 'Color Research & Application, 6(2). First published: Summer 1981. Wiley.',
    summaryParagraphs: [
      'Propone el enfoque y la metodología de la “color image scale” para relacionar combinaciones cromáticas con impresiones perceptuales; complementa el análisis de temperatura y armonía en diseño de paletas.',
    ],
    linkLabel: 'DOI (Wiley)',
    href: 'https://doi.org/10.1002/col.5080060210',
  },
];
