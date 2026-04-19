import type { ReferenceItem } from '../types';

export const LIGHTNESS_REFERENCES: ReferenceItem[] = [
  {
    id: 'cie-15-2004',
    category: 'Estándar internacional',
    title: 'Colorimetry, 3rd edition (CIE 15:2004)',
    authors: 'Commission Internationale de l\'Éclairage (CIE)',
    source: 'CIE Technical Report. ISBN: 3-901-906-33-9 (2004).',
    summaryParagraphs: [
      'Define el espacio de color **CIELAB** y su componente **L*** (claridad), escala perceptualmente uniforme de 0 (negro) a 100 (blanco de referencia). L* se obtiene a partir de las coordenadas tristímulus XYZ mediante una función no lineal que modela la respuesta del sistema visual a la luminancia.',
    ],
    linkLabel: 'CIE 15:2004',
    href: 'https://cie.co.at/publications/colorimetry-3rd-edition',
  },
  {
    id: 'fairchild-2013-cam',
    category: 'Libro científico',
    title: 'Color Appearance Models (3rd edition)',
    authors: 'Fairchild, M. D.',
    source: 'John Wiley & Sons, Ltd. (2013).',
    summaryParagraphs: [
      'Referencia sobre modelos de apariencia cromática. La **distribución de luminosidad (L*)** en una paleta condiciona legibilidad y jerarquía visual; L* predice el “peso” percibido de un color y por qué un rango tonal amplio (p. ej. ΔL* alto entre extremos) suele ser más versátil que agrupar todo en una zona estrecha de claridad.',
    ],
    linkLabel: '10.1002/9781118653128',
    href: 'https://doi.org/10.1002/9781118653128',
  },
  {
    id: 'lin-2013-semantic-resonant-colors',
    category: 'Artículo científico',
    title: 'Selecting Semantically-Resonant Colors for Data Visualization',
    authors: 'Lin, S., Fortuna, J., Kulkarni, C., Stone, M., & Heer, J.',
    source: 'Computer Graphics Forum (Proc. EuroVis 2013), 32(3), 401–410.',
    summaryParagraphs: [
      'Estudio empírico que muestra cómo el **balance tonal y la distribución de luminosidad** de una paleta influyen en su efectividad para visualización de datos. Las paletas con buena cobertura del **rango L* (CIE Lab)** y una distribución equilibrada entre “buckets” tonales superan con claridad a las concentradas en una sola zona de claridad.',
      'Subraya la conveniencia de incluir **extremos** (oscuros con **L* < 25** y claros con **L* > 80**) además de **medios tonos** (en torno a **L* ≈ 50**) para soportar jerarquías visuales complejas. Esta línea de trabajo ha influido en sistemas posteriores como **Material Design Tonal Palette** y en el enfoque de **Tableau** para paletas de color.',
    ],
    linkLabel: '10.1111/cgf.12127',
    href: 'https://doi.org/10.1111/cgf.12127',
  },
  {
    id: 'bartram-chi-2017',
    category: 'Artículo científico',
    title: 'Affective color in visualization',
    authors: 'Bartram, L., Patra, A., & Stone, M.',
    source: 'Proceedings of CHI 2017. ACM.',
    summaryParagraphs: [
      'Estudia cómo las propiedades de color (incluida la claridad) influyen en la respuesta afectiva y la efectividad comunicativa. Paletas con **distribución tonal equilibrada** (presencia en zonas oscura, media y clara) obtienen mejores valoraciones de claridad comunicativa y profesionalismo percibido frente a paletas muy agrupadas en un solo registro de L*.',
    ],
    linkLabel: '10.1145/3025453.3026041',
    href: 'https://doi.org/10.1145/3025453.3026041',
  },
];
