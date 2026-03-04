/**
 * Metadata de variantes del eje Inspiración (solo columna Cómo).
 */

export type InspiracionVersionId = 'inspiracion-maximalista' | 'inspiracion-organico' | 'inspiracion-minimalista' | 'inspiracion-geometrico' | 'inspiracion-brutalista' | 'inspiracion-cinetico' | 'inspiracion-art-deco' | 'inspiracion-glitch' | 'inspiracion-isometrico' | 'inspiracion-pixel-art' | 'inspiracion-line-art' | 'inspiracion-memphis' | 'inspiracion-bauhaus' | 'inspiracion-op-art' | 'inspiracion-constructivista' | 'inspiracion-zen' | 'inspiracion-tribal' | 'inspiracion-collage' | string;

export interface InspiracionMetadata {
  /** Nombre mostrado */
  name: string;
  /** Descripción breve para el modal */
  description?: string;
  /** Subtítulo/etiqueta secundaria */
  subtitle: string;
  /** Configuración del eje */
  axis: {
    axisLabel: string;
    defaultColorLeft: string;
    defaultColorRight: string;
    defaultSliderValue: number;
  };
}

/** IDs de variantes de inspiración. */
export const INSPIRACION_IDS: readonly InspiracionVersionId[] = ['inspiracion-maximalista', 'inspiracion-organico', 'inspiracion-minimalista', 'inspiracion-geometrico', 'inspiracion-brutalista', 'inspiracion-cinetico', 'inspiracion-art-deco', 'inspiracion-glitch', 'inspiracion-isometrico', 'inspiracion-pixel-art', 'inspiracion-line-art', 'inspiracion-memphis', 'inspiracion-bauhaus', 'inspiracion-op-art', 'inspiracion-constructivista', 'inspiracion-zen', 'inspiracion-tribal', 'inspiracion-collage'] as const;

/** Metadata por versionId. */
const INSPIRACION_METADATA_MAP: Partial<Record<string, InspiracionMetadata>> = {
  'inspiracion-maximalista': {
    name: 'Maximalista',
    description: 'Inspiración maximalista: más es más.',
    subtitle: 'Abundancia',
    axis: {
      axisLabel: 'Maximalista–Abundante',
      defaultColorLeft: '#c4b5fd',
      defaultColorRight: '#7c3aed',
      defaultSliderValue: 0,
    },
  },
  'inspiracion-organico': {
    name: 'Orgánico',
    description: 'Inspiración orgánica: formas curvas y fluidas.',
    subtitle: 'Natural',
    axis: {
      axisLabel: 'Orgánico–Natural',
      defaultColorLeft: '#3eea7d',
      defaultColorRight: '#3eea7d',
      defaultSliderValue: 0,
    },
  },
  'inspiracion-minimalista': {
    name: 'Minimalista',
    description: 'Inspiración minimalista: menos es más.',
    subtitle: 'Esencial',
    axis: {
      axisLabel: 'Minimalista–Esencial',
      defaultColorLeft: '#93c5fd',
      defaultColorRight: '#2563eb',
      defaultSliderValue: 0,
    },
  },
  'inspiracion-geometrico': {
    name: 'Geométrico',
    description: 'Inspiración geométrica: formas puras y estructuradas.',
    subtitle: 'Estructura',
    axis: {
      axisLabel: 'Geométrico–Estructurado',
      defaultColorLeft: '#f0abfc',
      defaultColorRight: '#c026d3',
      defaultSliderValue: 0,
    },
  },
  'inspiracion-brutalista': {
    name: 'Brutalista',
    description: 'Inspiración brutalista: formas crudas y honestas.',
    subtitle: 'Crudo',
    axis: {
      axisLabel: 'Brutalista–Crudo',
      defaultColorLeft: '#bfbfbf',
      defaultColorRight: '#bfbfbf',
      defaultSliderValue: 0,
    },
  },
  'inspiracion-cinetico': {
    name: 'Cinético',
    description: 'Inspiración cinética: movimiento y dinamismo.',
    subtitle: 'Dinámico',
    axis: {
      axisLabel: 'Cinético–Dinámico',
      defaultColorLeft: '#67e8f9',
      defaultColorRight: '#0891b2',
      defaultSliderValue: 0,
    },
  },
  'inspiracion-art-deco': {
    name: 'Art Déco',
    description: 'Inspiración Art Déco: elegancia geométrica y glamour.',
    subtitle: 'Glamour',
    axis: {
      axisLabel: 'Art Déco–Glamour',
      defaultColorLeft: '#fcd34d',
      defaultColorRight: '#b45309',
      defaultSliderValue: 0,
    },
  },
  'inspiracion-glitch': {
    name: 'Glitch',
    description: 'Inspiración glitch: distorsión digital y fragmentación.',
    subtitle: 'Digital',
    axis: {
      axisLabel: 'Glitch–Digital',
      defaultColorLeft: '#ec4899',
      defaultColorRight: '#06b6d4',
      defaultSliderValue: 0,
    },
  },
  'inspiracion-isometrico': {
    name: 'Isométrico',
    description: 'Inspiración isométrica: perspectiva 3D y cubos.',
    subtitle: '3D',
    axis: {
      axisLabel: 'Isométrico–3D',
      defaultColorLeft: '#38bdf8',
      defaultColorRight: '#0ea5e9',
      defaultSliderValue: 0,
    },
  },
  'inspiracion-pixel-art': {
    name: 'Pixel Art',
    description: 'Inspiración pixel art: estética retro y videojuegos.',
    subtitle: 'Retro',
    axis: {
      axisLabel: 'Pixel Art–Retro',
      defaultColorLeft: '#4ade80',
      defaultColorRight: '#16a34a',
      defaultSliderValue: 0,
    },
  },
  'inspiracion-line-art': {
    name: 'Line Art',
    description: 'Inspiración line art: dibujo a línea y trazos elegantes.',
    subtitle: 'Línea',
    axis: {
      axisLabel: 'Line Art–Línea',
      defaultColorLeft: '#a5b4fc',
      defaultColorRight: '#6366f1',
      defaultSliderValue: 0,
    },
  },
  'inspiracion-memphis': {
    name: 'Memphis',
    description: 'Inspiración Memphis: estilo geométrico y juguetón de los 80.',
    subtitle: '80s',
    axis: {
      axisLabel: 'Memphis–80s',
      defaultColorLeft: '#fb7185',
      defaultColorRight: '#e11d48',
      defaultSliderValue: 0,
    },
  },
  'inspiracion-bauhaus': {
    name: 'Bauhaus',
    description: 'Inspiración Bauhaus: formas geométricas puras y composición funcional.',
    subtitle: 'Mini',
    axis: {
      axisLabel: 'Bauhaus–Mini',
      defaultColorLeft: '#a5b4fc',
      defaultColorRight: '#4f46e5',
      defaultSliderValue: 0,
    },
  },
  'inspiracion-op-art': {
    name: 'Op Art',
    description: 'Inspiración Op Art: ilusiones ópticas y patrones geométricos.',
    subtitle: 'Mini',
    axis: {
      axisLabel: 'Op Art–Mini',
      defaultColorLeft: '#67e8f9',
      defaultColorRight: '#0891b2',
      defaultSliderValue: 0,
    },
  },
  'inspiracion-constructivista': {
    name: 'Constructivista',
    description: 'Inspiración constructivista: composición geométrica y tipografía rusa.',
    subtitle: 'Mini',
    axis: {
      axisLabel: 'Constructivista–Mini',
      defaultColorLeft: '#fbbf24',
      defaultColorRight: '#d97706',
      defaultSliderValue: 0,
    },
  },
  'inspiracion-zen': {
    name: 'Zen',
    description: 'Inspiración zen: minimalismo, calma y trazos orgánicos.',
    subtitle: 'Mini',
    axis: {
      axisLabel: 'Zen–Mini',
      defaultColorLeft: '#86efac',
      defaultColorRight: '#22c55e',
      defaultSliderValue: 0,
    },
  },
  'inspiracion-tribal': {
    name: 'Tribal',
    description: 'Inspiración tribal: patrones étnicos, máscaras y símbolos ancestrales.',
    subtitle: 'Mini',
    axis: {
      axisLabel: 'Tribal–Mini',
      defaultColorLeft: '#ff8229',
      defaultColorRight: '#c2410c',
      defaultSliderValue: 0,
    },
  },
  'inspiracion-collage': {
    name: 'Collage',
    description: 'Inspiración collage: recortes, superposiciones y composición libre.',
    subtitle: 'Mini',
    axis: {
      axisLabel: 'Collage–Mini',
      defaultColorLeft: '#ec4899',
      defaultColorRight: '#be185d',
      defaultSliderValue: 0,
    },
  },
};

export function getInspiracionMetadata(versionId: string): InspiracionMetadata | undefined {
  return INSPIRACION_METADATA_MAP[versionId];
}
