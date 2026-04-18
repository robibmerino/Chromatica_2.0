import type { ReferenceItem } from './types';

export const ANALYSIS_REFERENCES: ReferenceItem[] = [
  {
    id: 'wcag-21',
    category: 'Estándar internacional',
    title: 'Web Content Accessibility Guidelines (WCAG) 2.1',
    authors: `Kirkpatrick, A., O'Connor, J., Campbell, A., & Cooper, M. (2018).`,
    source: 'W3C Recommendation',
    summaryParagraphs: [
      'WCAG 2.1 es la recomendación del W3C para hacer el contenido web más accesible a personas con diversidad funcional. Organiza los requisitos en principios (perceptible, operable, comprensible y robusto) y criterios de conformidad comprobables.',
      'En la práctica de diseño de interfaces, el contraste de color es uno de los criterios más citados: por ejemplo, el texto normal suele exigir al menos 4.5:1 frente a su fondo en nivel AA, y 7:1 en AAA; el texto grande admite umbrales algo más bajos. Estos valores se basan en modelos de contraste perceptivo y en evidencia de legibilidad.',
      'Usar WCAG como referencia no sustituye pruebas con usuarios reales, pero sí ofrece un marco internacional compartido entre equipos de producto, legal y diseño.',
    ],
    linkLabel: 'Abrir WCAG 2.1 (W3C)',
    href: 'https://www.w3.org/TR/WCAG21/',
  },
  {
    id: 'arditi-2004',
    category: 'Artículo científico',
    title: 'Adjustable typography: an approach to enhancing low vision text accessibility',
    authors: 'Arditi, A. (2004)',
    source: 'Ergonomics, 47(5), 469-482',
    summaryParagraphs: [
      'Este trabajo argumenta que, además del tamaño y el zoom, ajustar parámetros tipográficos (interlineado, espaciado, peso del trazo, contraste local, etc.) puede mejorar la lectura en personas con baja visión sin forzar aumentos extremos de magnificación.',
      'La magnificación muy alta reduce el campo útil de texto visible y aumenta el esfuerzo de exploración ocular; por eso conviene combinar contraste adecuado con decisiones tipográficas sensatas. El estudio encaja con la idea de que el contraste no es un “número decorativo”, sino un parámetro que condiciona el rendimiento lector.',
    ],
    linkLabel: '10.1080/0014013031000085680',
    href: 'https://doi.org/10.1080/0014013031000085680',
  },
  {
    id: 'legge-1990',
    category: 'Artículo científico',
    title: 'Psychophysics of reading-V. The role of contrast in normal vision',
    authors: 'Legge, G. E., Rubin, G. S., & Luebker, A. (1990)',
    source: 'Vision Research, 30(7), 1063-1071',
    summaryParagraphs: [
      'En esta parte de la serie “Psychophysics of reading”, los autores miden cómo el contraste entre letras y fondo afecta la velocidad de lectura en visión normal, para distintos tamaños angulares de letra.',
      'Entre los hallazgos clásicos destaca que, dentro de un rango de tamaños cómodos, la lectura es sorprendentemente tolerante a reducciones de contraste: el rendimiento cae de forma gradual hasta que el contraste se acerca a un umbral inferior en el que la lectura deja de ser fiable. Esa idea conecta directamente con por qué los umbrales WCAG fijan mínimos prácticos.',
    ],
    linkLabel: '10.1016/0042-6989(87)90028-9',
    href: 'https://doi.org/10.1016/0042-6989(87)90028-9',
  },
];
