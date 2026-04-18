import type { ReferenceItem } from '../types';

export const CVD_REFERENCES: ReferenceItem[] = [
  {
    id: 'vienot-brettel-mollon-1999',
    category: 'Artículo científico',
    title: 'Digital video colourmaps for checking the legibility of displays by dichromats',
    authors: 'Viénot, F., Brettel, H., & Mollon, J. D.',
    source: 'Color Research & Application, 24(4), 243–252. Wiley (1999).',
    summaryParagraphs: [
      'Matrices 3×3 en sRGB lineal para simular dicromacias en tiempo real; base de muchas herramientas de simulación CVD.',
      'La simulación de esta fase sigue ese enfoque matricial sobre los swatches P, S, A, A2 y F.',
    ],
    linkLabel: 'DOI (Wiley)',
    href: 'https://doi.org/10.1002/(SICI)1520-6378(199908)24:4%3C243::AID-COL5%3E3.0.CO;2-3',
  },
  {
    id: 'brettel-vienot-mollon-1997',
    category: 'Paper fundacional',
    title: 'Computerized simulation of color appearance for dichromats',
    authors: 'Brettel, H., Viénot, F., & Mollon, J. D.',
    source: 'Journal of the Optical Society of America A, 14(10), 2647–2655 (1997).',
    summaryParagraphs: [
      'Modelo en LMS con planos de confusión por tipo de dicromacia; referencia para implementaciones fisiológicamente motivadas.',
    ],
    linkLabel: 'DOI (Optica)',
    href: 'https://doi.org/10.1364/JOSAA.14.002647',
  },
  {
    id: 'machado-oliveira-fernandes-2009',
    category: 'Artículo científico',
    title: 'A Physiologically-based Model for Simulation of Color Vision Deficiency',
    authors: 'Machado, G. M., Oliveira, M. M., & Fernandes, L. A. F.',
    source: 'IEEE Transactions on Visualization and Computer Graphics, 15(6), 1291–1298 (2009).',
    summaryParagraphs: [
      'Extensión a anomalías con grado de severidad; útil como marco de referencia moderno frente al modelo dicromático fijo.',
    ],
    linkLabel: 'DOI (IEEE)',
    href: 'https://doi.org/10.1109/TVCG.2009.113',
  },
];
