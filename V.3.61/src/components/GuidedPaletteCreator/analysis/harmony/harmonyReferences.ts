import type { ReferenceItem } from '../types';

export const HARMONY_REFERENCES: ReferenceItem[] = [
  {
    id: 'cohen-or-color-harmonization-2006',
    category: 'Artículo científico',
    title: 'Color harmonization',
    authors: 'Cohen-Or, D., Sorkine, O., Gal, R., Leyvand, T., & Xu, Y. Q.',
    source: 'ACM Transactions on Graphics (SIGGRAPH 2006), 25(3), 624–630.',
    summaryParagraphs: [
      'Trabajo seminal que formaliza computacionalmente las **plantillas armónicas de Matsuda** en espacio HSV. Los autores proponen 8 plantillas (i, V, L, I, T, Y, X, N) que representan los esquemas geométricos clásicos del círculo cromático.',
      'El algoritmo busca la ^^mejor rotación^^ de cada plantilla sobre los matices de la paleta y minimiza una función de coste basada en la distancia angular de cada color al sector permitido más cercano. Esta aproximación permite tanto detectar el esquema dominante como sugerir ajustes para mejorar la armonía.',
      'Citado más de 1700 veces, es la referencia estándar en armonización cromática computacional.',
    ],
    linkLabel: '10.1145/1141911.1141933',
    href: 'https://doi.org/10.1145/1141911.1141933',
  },
  {
    id: 'ou-luo-2006',
    category: 'Artículo científico',
    title: 'A colour harmony model for two-colour combinations',
    authors: 'Ou, L. C. & Luo, M. R.',
    source: 'Color Research & Application, 31(3), 191–204. Wiley (2006).',
    summaryParagraphs: [
      'Modelo cuantitativo de armonía basado en diferencias de tono, luminosidad y croma.',
      'Refuerza que las relaciones angulares de tono son un predictor importante de armonía percibida.',
    ],
    linkLabel: '10.1002/col.20208',
    href: 'https://doi.org/10.1002/col.20208',
  },
  {
    id: 'szabo-2010',
    category: 'Artículo científico',
    title: 'Experimental modeling of colour harmony',
    authors: 'Szabo, F., Bodrogi, P., & Schanda, J.',
    source: 'Color Research & Application, 35(1), 34–49. Wiley (2010).',
    summaryParagraphs: [
      'Validación experimental de modelos de armonía con observadores humanos.',
      'Confirma picos de preferencia cerca de relaciones análogas y complementarias en la rueda cromática.',
    ],
    linkLabel: '10.1002/col.20558',
    href: 'https://doi.org/10.1002/col.20558',
  },
];
