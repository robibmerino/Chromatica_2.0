import type { ReferenceItem } from '../types';

export const PERCEPTUAL_ANALYSIS_REFERENCES: ReferenceItem[] = [
  {
    id: 'ciede2000-luo',
    category: 'CIE / colorimetría',
    title: 'The development of the CIE 2000 colour-difference formula: CIEDE2000',
    authors: 'Luo, M. R., Cui, G., & Rigg, B.',
    source: 'Color Research & Application (2001). Wiley.',
    summaryParagraphs: [
      'Fórmula estándar ΔE₀₀ para cuantificar diferencias de color entre dos muestras en condiciones habituales de evaluación industrial y gráfica.',
    ],
    linkLabel: 'DOI (Wiley)',
    href: 'https://doi.org/10.1002/col.1049',
  },
  {
    id: 'ciede2000-sharma',
    category: 'CIE / implementación',
    title: 'The CIEDE2000 Color-Difference Formula: Implementation Notes',
    authors: 'Sharma, G., Wu, W., & Dalal, E. N.',
    source: 'Color Research & Application (2005).',
    summaryParagraphs: [
      'Casos de prueba y detalles numéricos para implementaciones coherentes con la especificación CIEDE2000.',
    ],
    linkLabel: 'DOI (Wiley)',
    href: 'https://doi.org/10.1002/col.20070',
  },
  {
    id: 'w3c-relative-luminance',
    category: 'W3C (definición técnica)',
    title: 'Web Content Accessibility Guidelines (WCAG) 2.2 — relative luminance',
    authors: 'W3C Accessibility Guidelines Working Group',
    source: 'W3C Recommendation (definición de luminancia relativa y ratio sobre sRGB).',
    summaryParagraphs: [
      'La luminancia relativa y el ratio de contraste que usamos son los definidos en WCAG 2.x para sRGB. En este modo aplicamos solo la **fórmula** como métrica de diseño para el mockup, sin afirmar cumplimiento del criterio 1.4.11 ni de texto.',
    ],
    linkLabel: 'Definición (W3C TR)',
    href: 'https://www.w3.org/TR/WCAG22/#dfn-relative-luminance',
  },
  {
    id: 'cie-lab-space',
    category: 'CIE / espacio de color',
    title: 'CIE 1976 L*a*b* colour space and CIELAB coordinates',
    authors: 'Commission Internationale de l’Éclairage (CIE)',
    source: 'Publicaciones de colorimetría (CIE 015 / series de colorimetría).',
    summaryParagraphs: [
      'L* es el eje de claridad perceptual del espacio CIELAB estandarizado por la CIE; las diferencias |ΔL*| se interpretan en ese mismo marco teórico que subyace a ΔE₀₀.',
    ],
    linkLabel: 'CIE — Colorimetry (4th ed., resumen editorial)',
    href: 'https://cie.co.at/publications/colorimetry-4th-edition',
  },
];
