import type { QuienCharacterId } from '../../QuienTinderCards/types';

/** Variante de color para etiquetas de criatura. */
export type CreatureLabelVariant =
  | 'emerald'
  | 'violet'
  | 'rose'
  | 'amber'
  | 'sky'
  | 'slate'
  | 'cyan'
  | 'fuchsia';

/**
 * Configuración completa de una criatura. Fuente única de verdad.
 * Para añadir una criatura: 1) Crear componente en characters/
 * 2) Registrar aquí 3) Registrar en characterRegistry
 */
export interface CreatureMetadata {
  /** Nombre mostrado (tarjeta, modal) */
  name: string;
  /** Descripción breve para el modal de personalización */
  description?: string;
  /** Subtítulo/arquetipo (ej. "Mística") */
  subtitle: string;
  /** Color de la etiqueta bajo la tarjeta */
  labelVariant: CreatureLabelVariant;
  /** Configuración del eje Identidad */
  axis: {
    /** Extremos del eje (ej. "Mística–Material") */
    axisLabel: string;
    defaultColorLeft: string;
    defaultColorRight: string;
    /** 0 = anclado a izquierda, 100 = derecha */
    defaultSliderValue: number;
  };
}

/** Metadata de criaturas configuradas. Las no listadas usan valores por defecto. */
export const CREATURE_METADATA: Partial<Record<QuienCharacterId, CreatureMetadata>> = {
  1: {
    name: 'Humo',
    description: 'Presencia etérea que oscila entre lo místico y lo tangible.',
    subtitle: 'Mística',
    labelVariant: 'cyan',
    axis: {
      axisLabel: 'Mística–Material',
      defaultColorLeft: '#9822c3',
      defaultColorRight: '#926e2f',
      defaultSliderValue: 0,
    },
  },
  2: {
    name: 'Vacio',
    description: 'Vórtice de ondas que fluctúa entre el magnetismo y la discreción.',
    subtitle: 'Magnetismo',
    labelVariant: 'violet',
    axis: {
      axisLabel: 'Magnética–Discreta',
      defaultColorLeft: '#7c4dff',
      defaultColorRight: '#94a3b8',
      defaultSliderValue: 0,
    },
  },
  3: {
    name: 'Raices',
    description: 'Red de raíces y ramas que conecta lo tradicional con lo innovador.',
    subtitle: 'Tradición',
    labelVariant: 'emerald',
    axis: {
      axisLabel: 'Tradicional–Innovador',
      defaultColorLeft: '#2e7d32',
      defaultColorRight: '#e78d0d',
      defaultSliderValue: 0,
    },
  },
  4: {
    name: 'Crepusculo',
    description: 'Presencia que habita el umbral entre la noche y el día.',
    subtitle: 'Nocturna',
    labelVariant: 'sky',
    axis: {
      axisLabel: 'Nocturno–Diurno',
      defaultColorLeft: '#0c4a6e',
      defaultColorRight: '#f59e0b',
      defaultSliderValue: 0,
    },
  },
  5: {
    name: 'Voltaje',
    description: 'Descarga de energía que fluctúa entre lo enérgico y lo sereno.',
    subtitle: 'Energica',
    labelVariant: 'amber',
    axis: {
      axisLabel: 'Enérgica–Serena',
      defaultColorLeft: '#f57f17',
      defaultColorRight: '#00695c',
      defaultSliderValue: 0,
    },
  },
  6: {
    name: 'Espejo',
    description: 'Fragmentos que reflejan la empatía y la independencia.',
    subtitle: 'Empática',
    labelVariant: 'rose',
    axis: {
      axisLabel: 'Empática–Independiente',
      defaultColorLeft: '#e91e63',
      defaultColorRight: '#0d47a1',
      defaultSliderValue: 0,
    },
  },
  7: {
    name: 'Orbitas',
    description: 'Sistema de órbitas que oscila entre el equilibrio y el dinamismo.',
    subtitle: 'Equilibrio',
    labelVariant: 'amber',
    axis: {
      axisLabel: 'Equilibrado–Dinamismo',
      defaultColorLeft: '#00bcd4',
      defaultColorRight: '#ff6f00',
      defaultSliderValue: 0,
    },
  },
  8: {
    name: 'Ondas',
    description: 'Patrón de ondas que fluctúa entre la fluidez y la precisión.',
    subtitle: 'Fluidez',
    labelVariant: 'cyan',
    axis: {
      axisLabel: 'Fluidez–Precisión',
      defaultColorLeft: '#00e5ff',
      defaultColorRight: '#7c4dff',
      defaultSliderValue: 0,
    },
  },
  9: {
    name: 'Cuerdas',
    description: 'Curvas de Lissajous que entrelazan unión y singularidad.',
    subtitle: 'Unión',
    labelVariant: 'cyan',
    axis: {
      axisLabel: 'Unión–Singularidad',
      defaultColorLeft: '#00e5ff',
      defaultColorRight: '#651fff',
      defaultSliderValue: 0,
    },
  },
  10: {
    name: 'Pangea',
    description: 'Continente multicultural que equilibra inclusión y singularidad.',
    subtitle: 'Culturas',
    labelVariant: 'rose',
    axis: {
      axisLabel: 'Inclusivo–Único',
      defaultColorLeft: '#ff1744',
      defaultColorRight: '#651fff',
      defaultSliderValue: 0,
    },
  },
  11: {
    name: 'ADN',
    description: 'Hélice de vida que conecta evolución y legado.',
    subtitle: 'Evolución',
    labelVariant: 'fuchsia',
    axis: {
      axisLabel: 'Evolución–Legado',
      defaultColorLeft: '#e040fb',
      defaultColorRight: '#006064',
      defaultSliderValue: 0,
    },
  },
  12: {
    name: 'Voronoi',
    description: 'Teselación orgánica que fluctúa entre orden y caos.',
    subtitle: 'Orgánico',
    labelVariant: 'emerald',
    axis: {
      axisLabel: 'Orden–Caos',
      defaultColorLeft: '#00e5ff',
      defaultColorRight: '#e040fb',
      defaultSliderValue: 0,
    },
  },
  13: {
    name: 'Eco',
    description: 'Ondas de interferencia que oscilan entre resonancia y nitidez.',
    subtitle: 'Resonancia',
    labelVariant: 'cyan',
    axis: {
      axisLabel: 'Resonancia–Nitidez',
      defaultColorLeft: '#00e5ff',
      defaultColorRight: '#0d47a1',
      defaultSliderValue: 0,
    },
  },
  14: {
    name: 'Tormenta',
    description: 'Campo magnético que oscila entre el refugio protector y la explosión de energía.',
    subtitle: 'Refugio',
    labelVariant: 'amber',
    axis: {
      axisLabel: 'Refugio–Explosivo',
      defaultColorLeft: '#69f0ae',
      defaultColorRight: '#ff6d00',
      defaultSliderValue: 0,
    },
  },
  15: {
    name: 'Mandala',
    description: 'Mandala fractal que oscila entre la contemplación serena y la acción creativa.',
    subtitle: 'Contemplación',
    labelVariant: 'fuchsia',
    axis: {
      axisLabel: 'Ser–Hacer',
      defaultColorLeft: '#e040fb',
      defaultColorRight: '#00e5ff',
      defaultSliderValue: 0,
    },
  },
  16: {
    name: 'Infinito',
    description: 'Lemniscatas anidadas que fluctúan entre el cambio perpetuo y la eternidad.',
    subtitle: 'Cambio',
    labelVariant: 'violet',
    axis: {
      axisLabel: 'Cambio–Eterno',
      defaultColorLeft: '#a78bfa',
      defaultColorRight: '#4c1d95',
      defaultSliderValue: 0,
    },
  },
  17: {
    name: 'Relámpago',
    description: 'Ramas fractales que fluctúan entre el impacto fulgurante y la armonía serena.',
    subtitle: 'Impacto',
    labelVariant: 'amber',
    axis: {
      axisLabel: 'Impacto–Armonía',
      defaultColorLeft: '#f59e0b',
      defaultColorRight: '#10b981',
      defaultSliderValue: 0,
    },
  },
  18: {
    name: 'Eclipse',
    description: 'Corona solar y disco lunar que oscilan entre la intersección mágica y el ciclo continuo.',
    subtitle: 'Intersección',
    labelVariant: 'amber',
    axis: {
      axisLabel: 'Intersección–Continuo',
      defaultColorLeft: '#fbbf24',
      defaultColorRight: '#92400e',
      defaultSliderValue: 0,
    },
  },
  19: {
    name: 'Rosa',
    description: 'Curvas de rosa paramétricas que fluctúan entre el minimalismo esencial y la sofisticación.',
    subtitle: 'Minimalista',
    labelVariant: 'fuchsia',
    axis: {
      axisLabel: 'Minimalista–Sofisticada',
      defaultColorLeft: '#e879f9',
      defaultColorRight: '#581c87',
      defaultSliderValue: 0,
    },
  },
  20: {
    name: 'Vórtice',
    description: 'Campo de vectores que fluctúa entre el flujo continuo y la singularidad del centro.',
    subtitle: 'Flujo',
    labelVariant: 'cyan',
    axis: {
      axisLabel: 'Flujo–Singularidad',
      defaultColorLeft: '#60a5fa',
      defaultColorRight: '#a78bfa',
      defaultSliderValue: 0,
    },
  },
  21: {
    name: 'Aurea',
    description: 'Semillas en espiral áurea que fluctúan entre la armonía dorada y la libertad vibrante.',
    subtitle: 'Armonía',
    labelVariant: 'amber',
    axis: {
      axisLabel: 'Armonía–Libertad',
      defaultColorLeft: '#ffd93d',
      defaultColorRight: '#6bceff',
      defaultSliderValue: 0,
    },
  },
  22: {
    name: 'Fractal',
    description: 'Triángulo de Sierpinski que fluctúa entre la simetría perfecta y la originalidad.',
    subtitle: 'Simetría',
    labelVariant: 'violet',
    axis: {
      axisLabel: 'Simetría–Originalidad',
      defaultColorLeft: '#a78bfa',
      defaultColorRight: '#34d399',
      defaultSliderValue: 0,
    },
  },
  23: {
    name: 'Ciclos',
    description: 'Epicicloides e hipotrocoides que fluctúan entre lo imprevisible y el compromiso.',
    subtitle: 'Descubrimiento',
    labelVariant: 'sky',
    axis: {
      axisLabel: 'Imprevisible–Compromiso',
      defaultColorLeft: '#f472b6',
      defaultColorRight: '#0369a1',
      defaultSliderValue: 0,
    },
  },
  24: {
    name: 'Burbujas',
    description: 'Burbujas conectadas que fluctúan entre la libertad fluida y la resistencia.',
    subtitle: 'Libertad',
    labelVariant: 'sky',
    axis: {
      axisLabel: 'Libertad–Resistencia',
      defaultColorLeft: '#0ea5e9',
      defaultColorRight: '#0c4a6e',
      defaultSliderValue: 0,
    },
  },
  25: {
    name: 'Escarcha',
    description: 'Copos de nieve ramificados que fluctúan entre el núcleo concentrado y el horizonte expandido.',
    subtitle: 'Ramificación',
    labelVariant: 'sky',
    axis: {
      axisLabel: 'Núcleo–Horizonte',
      defaultColorLeft: '#bae6fd',
      defaultColorRight: '#0369a1',
      defaultSliderValue: 0,
    },
  },
  26: {
    name: 'Prisma',
    description: 'Estrellas prismáticas que fluctúan entre la influencia expansiva y la introspección.',
    subtitle: 'Influencia',
    labelVariant: 'fuchsia',
    axis: {
      axisLabel: 'Influencia–Introspección',
      defaultColorLeft: '#ff6b9d',
      defaultColorRight: '#9d6bff',
      defaultSliderValue: 0,
    },
  },
  27: {
    name: 'Cristales',
    description: 'Teselado de Penrose que fluctúa entre el ritmo estructurado y la creatividad.',
    subtitle: 'Ritmo',
    labelVariant: 'amber',
    axis: {
      axisLabel: 'Ritmo–Creatividad',
      defaultColorLeft: '#ff6b9d',
      defaultColorRight: '#9d6bff',
      defaultSliderValue: 0,
    },
  },
  28: {
    name: 'Rueda',
    description: 'Cicloides paramétricas que fluctúan entre el movimiento rotativo y la estabilidad fija.',
    subtitle: 'Rotativo',
    labelVariant: 'rose',
    axis: {
      axisLabel: 'Rotativo–Fijo',
      defaultColorLeft: '#ff6b9d',
      defaultColorRight: '#6b9dff',
      defaultSliderValue: 0,
    },
  },
  29: {
    name: 'Complejidad',
    description: 'Atractor de Lorenz que fluctúa entre la complejidad caótica y la sencillez.',
    subtitle: 'Complejidad',
    labelVariant: 'fuchsia',
    axis: {
      axisLabel: 'Complejidad–Sencillez',
      defaultColorLeft: '#ff0080',
      defaultColorRight: '#0080ff',
      defaultSliderValue: 0,
    },
  },
  30: {
    name: 'Topografía',
    description: 'Curvas de nivel topográficas que fluctúan entre la jerarquía estructurada y la equidad.',
    subtitle: 'Jerarquía',
    labelVariant: 'violet',
    axis: {
      axisLabel: 'Jerarquía–Equidad',
      defaultColorLeft: '#3d0a6e',
      defaultColorRight: '#34d399',
      defaultSliderValue: 0,
    },
  },
};

/** Obtiene la metadata de una criatura o undefined. */
export function getCreatureMetadata(id: QuienCharacterId): CreatureMetadata | undefined {
  return CREATURE_METADATA[id];
}

/** Parámetros por defecto del eje para una criatura (para useCreatureAxisPalette cuando no hay axisColorParams). */
export function getCreatureAxisDefaults(id: QuienCharacterId): {
  colorLeft: string;
  colorRight: string;
  defaultColorLeft: string;
  sliderValue: number;
} | null {
  const meta = CREATURE_METADATA[id];
  if (!meta?.axis) return null;
  const { defaultColorLeft, defaultColorRight, defaultSliderValue } = meta.axis;
  return {
    colorLeft: defaultColorLeft,
    colorRight: defaultColorRight,
    defaultColorLeft,
    sliderValue: defaultSliderValue,
  };
}
