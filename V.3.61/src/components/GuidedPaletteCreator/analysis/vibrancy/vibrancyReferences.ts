import type { ReferenceItem } from '../types';

export const VIBRANCY_REFERENCES: ReferenceItem[] = [
  {
    id: 'hasler-susstrunk-2003',
    category: 'Artículo científico',
    title: 'Measuring colorfulness in natural images',
    authors: 'Hasler, D. & Süsstrunk, S.',
    source: 'Proceedings of SPIE — Human Vision and Electronic Imaging VIII, Vol. 5007, 87–95 (2003).',
    summaryParagraphs: [
      'Métrica de colorfulness correlacionada con juicios humanos; la adaptamos a la paleta como M sobre canales rg/yb en RGB.',
      'La escala orientativa (<15 … >82) guía el diagnóstico de energía cromática global.',
    ],
    linkLabel: 'DOI (SPIE Digital Library)',
    href: 'https://doi.org/10.1117/12.477378',
  },
  {
    id: 'fairchild-cam-2013',
    category: 'Libro técnico',
    title: 'Color Appearance Models, 3rd Edition',
    authors: 'Fairchild, M. D.',
    source: 'John Wiley & Sons — The Wiley-IS&T Series in Imaging Science and Technology (2013).',
    summaryParagraphs: [
      'Marco de apariencia del color: brillo, croma y dimensiones relacionadas; el croma C* en CIELAB sustenta la clasificación por saturación por swatch.',
    ],
    linkLabel: 'DOI (Wiley)',
    href: 'https://doi.org/10.1002/9781118653128',
  },
  {
    id: 'berlyne-aesthetics-1971',
    category: 'Libro fundacional',
    title: 'Aesthetics and Psychobiology',
    authors: 'Berlyne, D. E.',
    source: 'Appleton-Century-Crofts (1971).',
    summaryParagraphs: [
      'Complejidad moderada y curva en U invertida: ni todo apagado ni todo saturado maximiza el interés; apoya la idea de jerarquía con focos vibrantes.',
    ],
    linkLabel: 'Internet Archive',
    href: 'https://archive.org/details/aestheticspsycho0000berl',
  },
];
