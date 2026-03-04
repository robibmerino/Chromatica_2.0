import type { ComoEstiloId } from './types';

/** Variante de color para etiquetas de estilo. */
export type EstiloLabelVariant =
  | 'emerald'
  | 'violet'
  | 'rose'
  | 'amber'
  | 'sky'
  | 'slate'
  | 'cyan'
  | 'fuchsia';

/**
 * Metadata de un estilo. Define nombre y características.
 * Los estilos representan métodos, acciones o formas de expresión.
 */
export interface EstiloMetadata {
  /** Nombre mostrado (tarjeta, modal) */
  name: string;
  /** Descripción breve para el modal (qué representa el estilo) */
  description?: string;
  /** Subtítulo o arquetipo */
  subtitle: string;
  /** Color de la etiqueta bajo la tarjeta */
  labelVariant: EstiloLabelVariant;
}

/** Configuración del eje Estilo para el modal. */
export interface EstiloAxisConfig {
  axisLabel: string;
  defaultColorLeft: string;
  defaultColorRight: string;
  defaultSliderValue: number;
}

/** Metadata extendida con configuración de eje. */
export interface EstiloMetadataWithAxis extends EstiloMetadata {
  axis?: EstiloAxisConfig;
}

/**
 * Metadata de estilos. Se amplía con las variantes del usuario.
 */
export const ESTILO_METADATA: Partial<Record<ComoEstiloId, EstiloMetadataWithAxis>> = {
  1: {
    name: 'Maximalista',
    description:
      'Abraza la abundancia visual: múltiples capas, formas geométricas entrelazadas, gradientes y partículas que crean densidad y riqueza cromática.',
    subtitle: 'Densidad, capas, saturación, riqueza',
    labelVariant: 'violet',
    axis: {
      axisLabel: 'Exuberante–Rico',
      defaultColorLeft: '#c75ff7',
      defaultColorRight: '#d97706',
      defaultSliderValue: 0,
    },
  },
  2: {
    name: 'Orgánico',
    description:
      'Formas fluidas y naturales que evocan crecimiento, curvas suaves, ramas y células en movimiento.',
    subtitle: 'Fluido, natural, curvas, crecimiento',
    labelVariant: 'emerald',
    axis: {
      axisLabel: 'Fluido–Natural',
      defaultColorLeft: '#10b981',
      defaultColorRight: '#14b8a6',
      defaultSliderValue: 0,
    },
  },
  3: {
    name: 'Minimalista',
    description:
      'Reduce al esencial: espacio vacío, precisión geométrica y un único punto focal que concentra la atención.',
    subtitle: 'Espacio vacío, precisión, esencia',
    labelVariant: 'sky',
    axis: {
      axisLabel: 'Sutil–Esencial',
      defaultColorLeft: '#0ea5e9',
      defaultColorRight: '#6366f1',
      defaultSliderValue: 0,
    },
  },
  4: {
    name: 'Geométrico',
    description:
      'Estructura visual basada en orden, módulos y matemática: cuadrículas, proporciones áureas y formas puras.',
    subtitle: 'Estructura, orden, matemática',
    labelVariant: 'cyan',
    axis: {
      axisLabel: 'Ordenado–Modular',
      defaultColorLeft: '#6366f1',
      defaultColorRight: '#06b6d4',
      defaultSliderValue: 0,
    },
  },
  5: {
    name: 'Brutalista',
    description:
      'Estética cruda y pesada: bloques macizos, hormigón visto, huecos sin adornos y un impacto visual contundente.',
    subtitle: 'Crudo, pesado, impactante',
    labelVariant: 'amber',
    axis: {
      axisLabel: 'Crudo–Macizo',
      defaultColorLeft: '#5e5e5e',
      defaultColorRight: '#f97316',
      defaultSliderValue: 0,
    },
  },
  6: {
    name: 'Cinético',
    description:
      'Formas en movimiento: estelas, fantasmas de posición, partículas de inercia y ritmos progresivos que sugieren velocidad y vibración.',
    subtitle: 'Movimiento, velocidad, ritmo, vibración',
    labelVariant: 'fuchsia',
    axis: {
      axisLabel: 'Dinámico–Veloz',
      defaultColorLeft: '#ec4899',
      defaultColorRight: '#06b6d4',
      defaultSliderValue: 0,
    },
  },
  7: {
    name: 'Art Déco',
    description:
      'Simetría, lujo y ornamentación geométrica: abanicos radiantes, chevrones escalonados y motivos que evocan los años veinte.',
    subtitle: 'Simetría, lujo, abanicos, radiación',
    labelVariant: 'amber',
    axis: {
      axisLabel: 'Suntuoso–Radiante',
      defaultColorLeft: '#d97706',
      defaultColorRight: '#c084fc',
      defaultSliderValue: 0,
    },
  },
  8: {
    name: 'Glitch',
    description:
      'Estética de error digital: canales RGB desplazados, fragmentación, scanlines y artefactos que evocan corrupción de datos.',
    subtitle: 'Error, distorsión, fragmentación digital',
    labelVariant: 'fuchsia',
    axis: {
      axisLabel: 'Corrupto–Fragmentado',
      defaultColorLeft: '#a855f7',
      defaultColorRight: '#22d3ee',
      defaultSliderValue: 0,
    },
  },
  9: {
    name: 'Isométrico',
    description:
      'Profundidad sin punto de fuga: cubos, plataformas y volúmenes en proyección isométrica que evocan planos técnicos y videojuegos.',
    subtitle: 'Profundidad sin fuga, volumen, 3D falso',
    labelVariant: 'sky',
    axis: {
      axisLabel: 'Volumétrico–Profundo',
      defaultColorLeft: '#3b82f6',
      defaultColorRight: '#06b6d4',
      defaultSliderValue: 0,
    },
  },
  10: {
    name: 'Pixel Art',
    description:
      'Estética retro de baja resolución: cuadrícula de píxeles, iconos 8-bit y motivos que evocan videojuegos clásicos.',
    subtitle: 'Retro, cuadrícula, low-res, 8-bit',
    labelVariant: 'rose',
    axis: {
      axisLabel: 'Retro–Pixeleado',
      defaultColorLeft: '#e2ad1d',
      defaultColorRight: '#22c55e',
      defaultSliderValue: 0,
    },
  },
  11: {
    name: 'Line Art',
    description:
      'Contorno puro sin relleno: rostros, manos, flores y motivos naturales trazados con líneas fluidas y trazo continuo.',
    subtitle: 'Contorno puro, sin relleno, trazo continuo',
    labelVariant: 'slate',
    axis: {
      axisLabel: 'Continuo–Delicado',
      defaultColorLeft: '#ce8d9d',
      defaultColorRight: '#0ea5e9',
      defaultSliderValue: 0,
    },
  },
  12: {
    name: 'Memphis',
    description:
      'Estética postmoderna y juguetona de los 80: patrones de puntos, líneas diagonales, squiggles, triángulos, zigzags y formas geométricas audaces.',
    subtitle: 'Postmoderno, juguetón, 80s, patrones',
    labelVariant: 'fuchsia',
    axis: {
      axisLabel: 'Juguetón–Audaz',
      defaultColorLeft: '#ec4899',
      defaultColorRight: '#f59e0b',
      defaultSliderValue: 0,
    },
  },
  13: {
    name: 'Bauhaus',
    description:
      'Estética primaria y funcional: círculo, triángulo y cuadrado como formas básicas, grid estructural, tipografía geométrica y composición modular.',
    subtitle: 'Primario, funcional, formas básicas, grid',
    labelVariant: 'amber',
    axis: {
      axisLabel: 'Primario–Funcional',
      defaultColorLeft: '#f34f4f',
      defaultColorRight: '#2563eb',
      defaultSliderValue: 0,
    },
  },
  14: {
    name: 'Op Art',
    description:
      'Ilusión óptica y vibración visual: círculos concéntricos, cuadrículas deformadas, espirales, patrones moiré y formas que generan movimiento aparente.',
    subtitle: 'Ilusión óptica, patrones, vibración visual',
    labelVariant: 'cyan',
    axis: {
      axisLabel: 'Ilusorio–Vibrante',
      defaultColorLeft: '#6366f1',
      defaultColorRight: '#06b6d4',
      defaultSliderValue: 0,
    },
  },
  15: {
    name: 'Constructivista',
    description:
      'Estética soviética y propagandística: cuñas diagonales, tipografía geométrica, rayos, círculos con cuña, triángulos punteros y símbolos industriales.',
    subtitle: 'Soviético, diagonal, tipografía',
    labelVariant: 'rose',
    axis: {
      axisLabel: 'Diagonal–Urgente',
      defaultColorLeft: '#dc2626',
      defaultColorRight: '#eab308',
      defaultSliderValue: 0,
    },
  },
  16: {
    name: 'Zen',
    description:
      'Estética japonesa y contemplativa: ensō incompleto, rama de bambú, montañas lejanas, piedras, sello hanko y pinceladas que respetan el vacío (ma).',
    subtitle: 'Asimetría, vacío, naturaleza, pincelada',
    labelVariant: 'emerald',
    axis: {
      axisLabel: 'Sereno–Asimétrico',
      defaultColorLeft: '#0fbd6c',
      defaultColorRight: '#1e3a5f',
      defaultSliderValue: 0,
    },
  },
  17: {
    name: 'Wireframe',
    description:
      'Esqueleto visual de interfaz: grid, placeholders, contornos punteados, anotaciones técnicas, medidas y flujo de secciones como en un prototipo.',
    subtitle: 'Estructura, prototipo, técnico',
    labelVariant: 'sky',
    axis: {
      axisLabel: 'Técnico–Estructural',
      defaultColorLeft: '#fafafa',
      defaultColorRight: '#1e40af',
      defaultSliderValue: 0,
    },
  },
  18: {
    name: 'Psicodélico',
    description:
      'Estética vibrante de los 60s/70s: ojo central, ondas líquidas, hongos, espirales, flores estilizadas, burbujas y bordes ondulantes.',
    subtitle: 'Vibrante, ondas, distorsión, 60s/70s',
    labelVariant: 'fuchsia',
    axis: {
      axisLabel: 'Vibrante–Ondulante',
      defaultColorLeft: '#ec4899',
      defaultColorRight: '#06b6d4',
      defaultSliderValue: 0,
    },
  },
  19: {
    name: 'Tribal',
    description:
      'Patrones ancestrales y étnicos: máscara central con tocado, zigzags, grecas, rombos, sol estilizado, serpiente y ave con simetría rítmica.',
    subtitle: 'Patrones ancestrales, simetría, ritmo',
    labelVariant: 'amber',
    axis: {
      axisLabel: 'Ancestral–Rítmico',
      defaultColorLeft: '#b45309',
      defaultColorRight: '#059669',
      defaultSliderValue: 0,
    },
  },
  20: {
    name: 'Topográfico',
    description:
      'Mapas de contorno y elevación: curvas de nivel, monte central, colinas, depresión/lago, río, coordenadas, escala, norte y símbolos de vegetación.',
    subtitle: 'Mapas de contorno, elevación, terreno',
    labelVariant: 'emerald',
    axis: {
      axisLabel: 'Contorno–Terreno',
      defaultColorLeft: '#ffae00',
      defaultColorRight: '#0d9488',
      defaultSliderValue: 0,
    },
  },
  21: {
    name: 'Art Nouveau',
    description:
      'Curvas orgánicas, ornamento floral y elegancia: líneas whiplash, flores estilizadas, hojas, zarcillos, libélula y marco curvilíneo que evocan el movimiento modernista.',
    subtitle: 'Orgánico, ornamento, floral',
    labelVariant: 'emerald',
    axis: {
      axisLabel: 'Ornamental–Orgánico',
      defaultColorLeft: '#b18d0b',
      defaultColorRight: '#059669',
      defaultSliderValue: 0,
    },
  },
  22: {
    name: 'Blueprint',
    description:
      'Estética técnica de planos y cianotipos: cuadrícula, planta arquitectónica, sección, cotas, cajetín, leyenda de materiales, detalle constructivo y rosa de los vientos.',
    subtitle: 'Técnico, plano, cianotipo, ingeniería',
    labelVariant: 'cyan',
    axis: {
      axisLabel: 'Técnico–Preciso',
      defaultColorLeft: '#0ea5e9',
      defaultColorRight: '#1e40af',
      defaultSliderValue: 0,
    },
  },
  23: {
    name: 'Collage',
    description:
      'Estética Dadá y collage: recortes superpuestos, fotos rasgadas, tiras de texto, círculos con ojo, trozos de papel, manchas de tinta, tickets, washi tape, grapas, garabatos y sellos.',
    subtitle: 'Recortes, superposición, caos, textura',
    labelVariant: 'amber',
    axis: {
      axisLabel: 'Caótico–Fragmentado',
      defaultColorLeft: '#f59e0b',
      defaultColorRight: '#dc2626',
      defaultSliderValue: 0,
    },
  },
  24: {
    name: 'Vidriera',
    description:
      'Estética de vidriera y vitral: celdas de color separadas por emplomado, roseta superior, paneles laterales, banda central en arco, reflejos de luz y textura de vidrio que simula la luz atravesando el cristal.',
    subtitle: 'Celdas, plomo, luz, fragmentos de color',
    labelVariant: 'violet',
    axis: {
      axisLabel: 'Luminoso–Fragmentado',
      defaultColorLeft: '#8b5cf6',
      defaultColorRight: '#06b6d4',
      defaultSliderValue: 0,
    },
  },
};

/** IDs de estilos disponibles. Se ampliará al añadir variantes. */
export const QUIEN_ESTILO_IDS: readonly ComoEstiloId[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];

/** Etiquetas: nombre de cada estilo. */
export const ESTILO_LABELS: Record<ComoEstiloId, string> = Object.fromEntries(
  QUIEN_ESTILO_IDS.map((id) => [id, ESTILO_METADATA[id]?.name ?? 'Pendiente'])
) as Record<ComoEstiloId, string>;

/** Subtítulos: solo los creados; el resto "—". */
export const ESTILO_SUBTITLES: Record<ComoEstiloId, string> = Object.fromEntries(
  QUIEN_ESTILO_IDS.map((id) => [id, ESTILO_METADATA[id]?.subtitle ?? '—'])
) as Record<ComoEstiloId, string>;

export const ESTILO_LABEL_VARIANTS: Record<ComoEstiloId, EstiloLabelVariant> = Object.fromEntries(
  QUIEN_ESTILO_IDS.map((id) => [id, ESTILO_METADATA[id]?.labelVariant ?? 'slate'])
) as Record<ComoEstiloId, EstiloLabelVariant>;

/** Configuración del eje por estilo. */
export const ESTILO_AXIS_CONFIG: Partial<Record<ComoEstiloId, EstiloAxisConfig>> =
  Object.fromEntries(
    QUIEN_ESTILO_IDS.map((id) => [
      id,
      ESTILO_METADATA[id]?.axis ?? {
        axisLabel: 'Estilo',
        defaultColorLeft: '#64748b',
        defaultColorRight: '#a78bfa',
        defaultSliderValue: 50,
      },
    ])
  ) as Partial<Record<ComoEstiloId, EstiloAxisConfig>>;

/** Colores por defecto para cada estilo (eje Estilo). */
export const ESTILO_DEFAULT_COLORS: Record<ComoEstiloId, { left: string; right: string }> =
  Object.fromEntries(
    QUIEN_ESTILO_IDS.map((id) => {
      const axis = ESTILO_METADATA[id]?.axis ?? ESTILO_AXIS_CONFIG[id];
      return [
        id,
        {
          left: axis?.defaultColorLeft ?? '#64748b',
          right: axis?.defaultColorRight ?? '#a78bfa',
        },
      ];
    })
  ) as Record<ComoEstiloId, { left: string; right: string }>;

export function getEstiloMetadata(id: ComoEstiloId | string): EstiloMetadataWithAxis | undefined {
  const num = typeof id === 'string' ? parseInt(id, 10) : id;
  if (!Number.isFinite(num) || !(num in ESTILO_METADATA)) return undefined;
  return ESTILO_METADATA[num as ComoEstiloId];
}
