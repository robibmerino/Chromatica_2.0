import type { QuienSilhouetteId } from './types';

/** Variante de color para etiquetas de silueta. */
export type SilhouetteLabelVariant =
  | 'emerald'
  | 'violet'
  | 'rose'
  | 'amber'
  | 'sky'
  | 'slate'
  | 'cyan'
  | 'fuchsia';

/**
 * Metadata de una silueta. Define nombre, características y estilo.
 * Las siluetas representan personas etéreas con distintas características.
 */
export interface SilhouetteMetadata {
  /** Nombre mostrado (tarjeta, modal) */
  name: string;
  /** Subtítulo o arquetipo (ej. "Serenidad", "Dinámico") */
  subtitle: string;
  /** Características para filtrado/futuras variantes (postura, energía, etc.) */
  characteristics?: string[];
  /** Color de la etiqueta bajo la tarjeta */
  labelVariant: SilhouetteLabelVariant;
}

/** Configuración del eje Identidad para una silueta. */
export interface SilhouetteAxisConfig {
  axisLabel: string;
  defaultColorLeft: string;
  defaultColorRight: string;
  defaultSliderValue: number;
}

/** Metadata extendida con configuración de eje (para el modal Identidad). */
export interface SilhouetteMetadataWithAxis extends SilhouetteMetadata {
  axis?: SilhouetteAxisConfig;
}

/**
 * Metadata de siluetas. Solo las que tienen componente creado tienen metadata.
 * El resto son tarjetas pendientes de contenido.
 */
export const SILHOUETTE_METADATA: Partial<Record<QuienSilhouetteId, SilhouetteMetadataWithAxis>> = {
  1: {
    name: 'Contemplativo',
    subtitle: 'Serenidad',
    characteristics: ['quieto', 'meditativo', 'centrado'],
    labelVariant: 'cyan',
    axis: {
      axisLabel: 'Serenidad–Vitalidad',
      defaultColorLeft: '#14b8a6',
      defaultColorRight: '#f59e0b',
      defaultSliderValue: 0,
    },
  },
  2: {
    name: 'Ancla',
    subtitle: 'Raíces',
    characteristics: ['arraigado', 'estable', 'conectado'],
    labelVariant: 'amber',
    axis: {
      axisLabel: 'Raíces–Libertad',
      defaultColorLeft: '#f59e0b',
      defaultColorRight: '#38bdf8',
      defaultSliderValue: 0,
    },
  },
  3: {
    name: 'Archivista',
    subtitle: 'Sabiduría',
    characteristics: ['conocedor', 'preservador', 'reflexivo'],
    labelVariant: 'emerald',
    axis: {
      axisLabel: 'Sabiduría–Innovación',
      defaultColorLeft: '#34d399',
      defaultColorRight: '#a78bfa',
      defaultSliderValue: 0,
    },
  },
  4: {
    name: 'Cartógrafo',
    subtitle: 'Exploración',
    characteristics: ['explorador', 'orientado', 'descubridor'],
    labelVariant: 'amber',
    axis: {
      axisLabel: 'Exploración–Hogar',
      defaultColorLeft: '#fb923c',
      defaultColorRight: '#38bdf8',
      defaultSliderValue: 0,
    },
  },
  5: {
    name: 'Místico',
    subtitle: 'Trance',
    characteristics: ['meditativo', 'canal', 'trascendente'],
    labelVariant: 'violet',
    axis: {
      axisLabel: 'Terrenal–Etereo',
      defaultColorLeft: '#a78bfa',
      defaultColorRight: '#22d3ee',
      defaultSliderValue: 0,
    },
  },
  6: {
    name: 'Duelista',
    subtitle: 'Acción',
    characteristics: ['preciso', 'ágil', 'elegante'],
    labelVariant: 'violet',
    axis: {
      axisLabel: 'Defensa–Ataque',
      defaultColorLeft: '#818cf8',
      defaultColorRight: '#f472b6',
      defaultSliderValue: 0,
    },
  },
  7: {
    name: 'Bailarín',
    subtitle: 'Movimiento',
    characteristics: ['dinámico', 'fluido', 'cinético'],
    labelVariant: 'violet',
    axis: {
      axisLabel: 'Dinámico–Estático',
      defaultColorLeft: '#38bdf8',
      defaultColorRight: '#c084fc',
      defaultSliderValue: 0,
    },
  },
  8: {
    name: 'Eco',
    subtitle: 'Resonancia',
    characteristics: ['resonante', 'propagador', 'reflejo'],
    labelVariant: 'fuchsia',
    axis: {
      axisLabel: 'Emisión–Recepción',
      defaultColorLeft: '#e879f9',
      defaultColorRight: '#38bdf8',
      defaultSliderValue: 0,
    },
  },
  9: {
    name: 'Peregrino',
    subtitle: 'Búsqueda',
    characteristics: ['buscador', 'contemplativo', 'guiado'],
    labelVariant: 'violet',
    axis: {
      axisLabel: 'Búsqueda–Llegada',
      defaultColorLeft: '#a78bfa',
      defaultColorRight: '#38bdf8',
      defaultSliderValue: 0,
    },
  },
  10: {
    name: 'Velado',
    subtitle: 'Misterio',
    characteristics: ['oculto', 'misterioso', 'revelador'],
    labelVariant: 'violet',
    axis: {
      axisLabel: 'Oculto–Revelado',
      defaultColorLeft: '#c084fc',
      defaultColorRight: '#38bdf8',
      defaultSliderValue: 0,
    },
  },
  11: {
    name: 'Heraldo',
    subtitle: 'Proclamación',
    characteristics: ['anunciador', 'resonante', 'levitante'],
    labelVariant: 'rose',
    axis: {
      axisLabel: 'Proclamación–Silencio',
      defaultColorLeft: '#f472b6',
      defaultColorRight: '#64748b',
      defaultSliderValue: 0,
    },
  },
  12: {
    name: 'Centinela',
    subtitle: 'Confianza',
    characteristics: ['vigilante', 'protector', 'firme'],
    labelVariant: 'emerald',
    axis: {
      axisLabel: 'Confianza–Descanso',
      defaultColorLeft: '#22b97d',
      defaultColorRight: '#64748b',
      defaultSliderValue: 0,
    },
  },
  13: {
    name: 'Caminante',
    subtitle: 'Camino',
    characteristics: ['itinerante', 'en movimiento', 'buscador'],
    labelVariant: 'sky',
    axis: {
      axisLabel: 'Camino–Hogar',
      defaultColorLeft: '#67e8f9',
      defaultColorRight: '#64748b',
      defaultSliderValue: 0,
    },
  },
  14: {
    name: 'Tejedora',
    subtitle: 'Creación',
    characteristics: ['creadora', 'conectora', 'artesana'],
    labelVariant: 'amber',
    axis: {
      axisLabel: 'Creación–Recepción',
      defaultColorLeft: '#fbbf24',
      defaultColorRight: '#64748b',
      defaultSliderValue: 0,
    },
  },
  15: {
    name: 'Testigo',
    subtitle: 'Contemplación',
    characteristics: ['contemplativo', 'observador', 'trascendente'],
    labelVariant: 'violet',
    axis: {
      axisLabel: 'Observar–Actuar',
      defaultColorLeft: '#c084fc',
      defaultColorRight: '#64748b',
      defaultSliderValue: 0,
    },
  },
  16: {
    name: 'Gemelos',
    subtitle: 'Dualidad',
    characteristics: ['dual', 'conectado', 'complementario'],
    labelVariant: 'fuchsia',
    axis: {
      axisLabel: 'Único–Unión',
      defaultColorLeft: '#e879f9',
      defaultColorRight: '#67e8f9',
      defaultSliderValue: 0,
    },
  },
  17: {
    name: 'Vacío',
    subtitle: 'Contenedor',
    characteristics: ['contenedor', 'revelador', 'interior'],
    labelVariant: 'violet',
    axis: {
      axisLabel: 'Magnético–Plenitud',
      defaultColorLeft: '#6366f1',
      defaultColorRight: '#06b6d4',
      defaultSliderValue: 0,
    },
  },
  18: {
    name: 'Ideador',
    subtitle: 'Creativo',
    characteristics: ['creador', 'ideador', 'innovador'],
    labelVariant: 'fuchsia',
    axis: {
      axisLabel: 'Ideación–Materialización',
      defaultColorLeft: '#e879f9',
      defaultColorRight: '#a78bfa',
      defaultSliderValue: 0,
    },
  },
  19: {
    name: 'Soñador',
    subtitle: 'Imaginación',
    characteristics: ['onírico', 'imaginativo', 'visionario'],
    labelVariant: 'violet',
    axis: {
      axisLabel: 'Sueño–Imaginación',
      defaultColorLeft: '#818cf8',
      defaultColorRight: '#a78bfa',
      defaultSliderValue: 0,
    },
  },
};

/** IDs de siluetas disponibles (1–19). Soñador es la última variante. */
export const QUIEN_SILHOUETTE_IDS: readonly QuienSilhouetteId[] = (
  Array.from({ length: 19 }, (_, i) => (i + 1) as QuienSilhouetteId)
);

/** Etiquetas: solo las creadas tienen nombre; el resto "Pendiente". */
export const SILHOUETTE_LABELS: Record<QuienSilhouetteId, string> = Object.fromEntries(
  QUIEN_SILHOUETTE_IDS.map((id) => [
    id,
    SILHOUETTE_METADATA[id]?.name ?? 'Pendiente',
  ])
) as Record<QuienSilhouetteId, string>;

/** Subtítulos: solo las creadas; el resto "—". */
export const SILHOUETTE_SUBTITLES: Record<QuienSilhouetteId, string> = Object.fromEntries(
  QUIEN_SILHOUETTE_IDS.map((id) => [
    id,
    SILHOUETTE_METADATA[id]?.subtitle ?? '—',
  ])
) as Record<QuienSilhouetteId, string>;

export const SILHOUETTE_LABEL_VARIANTS: Record<QuienSilhouetteId, SilhouetteLabelVariant> =
  Object.fromEntries(
    QUIEN_SILHOUETTE_IDS.map((id) => [
      id,
      SILHOUETTE_METADATA[id]?.labelVariant ?? 'slate',
    ])
  ) as Record<QuienSilhouetteId, SilhouetteLabelVariant>;

export function getSilhouetteMetadata(id: QuienSilhouetteId): SilhouetteMetadataWithAxis | undefined {
  return SILHOUETTE_METADATA[id];
}

/** Configuración del eje por silueta. Las pendientes usan "Pendiente" como etiqueta. */
export const SILHOUETTE_AXIS_CONFIG: Partial<Record<QuienSilhouetteId, SilhouetteAxisConfig>> =
  Object.fromEntries(
    QUIEN_SILHOUETTE_IDS.map((id) => {
      const meta = SILHOUETTE_METADATA[id];
      return [
        id,
        meta?.axis ?? {
          axisLabel: 'Pendiente',
          defaultColorLeft: '#64748b',
          defaultColorRight: '#a78bfa',
          defaultSliderValue: 50,
        },
      ];
    })
  ) as Partial<Record<QuienSilhouetteId, SilhouetteAxisConfig>>;

/** Colores por defecto para cada silueta (eje Identidad). */
export const SILHOUETTE_DEFAULT_COLORS: Record<QuienSilhouetteId, { left: string; right: string }> =
  Object.fromEntries(
    QUIEN_SILHOUETTE_IDS.map((id) => {
      const axis = SILHOUETTE_METADATA[id]?.axis ?? SILHOUETTE_AXIS_CONFIG[id];
      return [id, { left: axis?.defaultColorLeft ?? '#64748b', right: axis?.defaultColorRight ?? '#a78bfa' }];
    })
  ) as Record<QuienSilhouetteId, { left: string; right: string }>;
