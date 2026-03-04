/** VersionId de cada variante de herramienta en HERRAMIENTAS_VARIANTS. */
export type HerramientaVersionId =
  | 'herramienta-1'
  | 'herramienta-2'
  | 'herramienta-3'
  | 'herramienta-4'
  | 'herramienta-5'
  | 'herramienta-6'
  | 'herramienta-7'
  | 'herramienta-8'
  | 'herramienta-9'
  | 'herramienta-10'
  | 'herramienta-11'
  | 'herramienta-12'
  | 'herramienta-13'
  | 'herramienta-14'
  | 'herramienta-15'
  | 'herramienta-16'
  | 'herramienta-17'
  | 'herramienta-18'
  | 'herramienta-19'
  | 'herramienta-20'
  | 'herramienta-21'
  | 'herramienta-22'
  | 'herramienta-23'
  | 'herramienta-24';

/** IDs de herramientas disponibles (24 variantes, misma arquitectura que Esencia). */
export const HERRAMIENTAS_IDS: readonly HerramientaVersionId[] = [
  'herramienta-1',
  'herramienta-2',
  'herramienta-3',
  'herramienta-4',
  'herramienta-5',
  'herramienta-6',
  'herramienta-7',
  'herramienta-8',
  'herramienta-9',
  'herramienta-10',
  'herramienta-11',
  'herramienta-12',
  'herramienta-13',
  'herramienta-14',
  'herramienta-15',
  'herramienta-16',
  'herramienta-17',
  'herramienta-18',
  'herramienta-19',
  'herramienta-20',
  'herramienta-21',
  'herramienta-22',
  'herramienta-23',
  'herramienta-24',
] as const;

export interface HerramientaMetadata {
  /** Nombre mostrado (ej. "Herramienta 1") */
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

/** Metadata de cada variante de herramienta. */
const HERRAMIENTAS_METADATA_MAP: Record<HerramientaVersionId, HerramientaMetadata> = {
  'herramienta-1': {
    name: 'Martillo',
    description: 'Herramienta de creación y transformación material.',
    subtitle: 'Artesano',
    axis: {
      axisLabel: 'Artesano–Constructor',
      defaultColorLeft: '#d97706',
      defaultColorRight: '#b45309',
      defaultSliderValue: 0,
    },
  },
  'herramienta-2': {
    name: 'Pincel',
    description: 'Herramienta de expresión visual y creación artística.',
    subtitle: 'Artista',
    axis: {
      axisLabel: 'Artista–Pintor',
      defaultColorLeft: '#ec4899',
      defaultColorRight: '#8b5cf6',
      defaultSliderValue: 0,
    },
  },
  'herramienta-3': {
    name: 'Violín',
    description: 'Herramienta de expresión sonora y creación musical.',
    subtitle: 'Músico',
    axis: {
      axisLabel: 'Músico–Cantante',
      defaultColorLeft: '#7c3aed',
      defaultColorRight: '#6366f1',
      defaultSliderValue: 0,
    },
  },
  'herramienta-4': {
    name: 'Pluma',
    description: 'Herramienta de escritura y conocimiento.',
    subtitle: 'Escritor',
    axis: {
      axisLabel: 'Escritor–Erudito',
      defaultColorLeft: '#1e40af',
      defaultColorRight: '#0f766e',
      defaultSliderValue: 0,
    },
  },
  'herramienta-5': {
    name: 'Espada',
    description: 'Herramienta de defensa y protección.',
    subtitle: 'Guerrero',
    axis: {
      axisLabel: 'Guerrero–Protector',
      defaultColorLeft: '#dc2626',
      defaultColorRight: '#16a34a',
      defaultSliderValue: 0,
    },
  },
  'herramienta-6': {
    name: 'Llave',
    description: 'Herramienta de custodia y búsqueda.',
    subtitle: 'Guardián',
    axis: {
      axisLabel: 'Guardián–Buscador',
      defaultColorLeft: '#d4af37',
      defaultColorRight: '#1e40af',
      defaultSliderValue: 0,
    },
  },
  'herramienta-7': {
    name: 'Farol',
    description: 'Herramienta de orientación y exploración.',
    subtitle: 'Guía',
    axis: {
      axisLabel: 'Guía–Explorador',
      defaultColorLeft: '#fbbf24',
      defaultColorRight: '#f97316',
      defaultSliderValue: 0,
    },
  },
  'herramienta-8': {
    name: 'Cáliz',
    description: 'Herramienta de sanación y ritual.',
    subtitle: 'Sanador',
    axis: {
      axisLabel: 'Sanador–Ceremonial',
      defaultColorLeft: '#22d3ee',
      defaultColorRight: '#a78bfa',
      defaultSliderValue: 0,
    },
  },
  'herramienta-9': {
    name: 'Telescopio',
    description: 'Herramienta de observación y visión lejana.',
    subtitle: 'Astrónomo',
    axis: {
      axisLabel: 'Astrónomo–Visionario',
      defaultColorLeft: '#6366f1',
      defaultColorRight: '#0ea5e9',
      defaultSliderValue: 0,
    },
  },
  'herramienta-10': {
    name: 'Reloj de arena',
    description: 'Herramienta de medida del tiempo y sabiduría.',
    subtitle: 'Sabio',
    axis: {
      axisLabel: 'Sabio–Temporal',
      defaultColorLeft: '#a78bfa',
      defaultColorRight: '#64748b',
      defaultSliderValue: 0,
    },
  },
  'herramienta-11': {
    name: 'Escudo',
    description: 'Herramienta de defensa y protección.',
    subtitle: 'Defensor',
    axis: {
      axisLabel: 'Defensor–Protector',
      defaultColorLeft: '#16a34a',
      defaultColorRight: '#1e40af',
      defaultSliderValue: 0,
    },
  },
  'herramienta-12': {
    name: 'Libro',
    description: 'Herramienta de conocimiento y estudio.',
    subtitle: 'Erudito',
    axis: {
      axisLabel: 'Erudito–Académico',
      defaultColorLeft: '#1e40af',
      defaultColorRight: '#0f766e',
      defaultSliderValue: 0,
    },
  },
  'herramienta-13': {
    name: 'Compás de dibujo',
    description: 'Herramienta de trazado y geometría.',
    subtitle: 'Arquitecto',
    axis: {
      axisLabel: 'Arquitecto–Ingeniero',
      defaultColorLeft: '#0f766e',
      defaultColorRight: '#1e40af',
      defaultSliderValue: 0,
    },
  },
  'herramienta-14': {
    name: 'Balanza',
    description: 'Herramienta de medida y justicia.',
    subtitle: 'Juez',
    axis: {
      axisLabel: 'Juez–Equilibrio',
      defaultColorLeft: '#64748b',
      defaultColorRight: '#1e40af',
      defaultSliderValue: 0,
    },
  },
  'herramienta-15': {
    name: 'Ancla',
    description: 'Herramienta de sujeción y estabilidad.',
    subtitle: 'Marinero',
    axis: {
      axisLabel: 'Marinero–Firmeza',
      defaultColorLeft: '#0ea5e9',
      defaultColorRight: '#1e40af',
      defaultSliderValue: 0,
    },
  },
  'herramienta-16': {
    name: 'Corona',
    description: 'Herramienta de liderazgo y soberanía.',
    subtitle: 'Líder',
    axis: {
      axisLabel: 'Líder–Soberano',
      defaultColorLeft: '#d4af37',
      defaultColorRight: '#b45309',
      defaultSliderValue: 0,
    },
  },
  'herramienta-17': {
    name: 'Tijeras',
    description: 'Herramienta de corte y confección.',
    subtitle: 'Sastre',
    axis: {
      axisLabel: 'Sastre–Diseñador',
      defaultColorLeft: '#ec4899',
      defaultColorRight: '#8b5cf6',
      defaultSliderValue: 0,
    },
  },
  'herramienta-18': {
    name: 'Hoz',
    description: 'Herramienta de cosecha y cultivo.',
    subtitle: 'Cosechador',
    axis: {
      axisLabel: 'Cosechador–Cultivador',
      defaultColorLeft: '#16a34a',
      defaultColorRight: '#15803d',
      defaultSliderValue: 0,
    },
  },
  'herramienta-19': {
    name: 'Mortero',
    description: 'Herramienta de mezcla y preparación.',
    subtitle: 'Alquimista',
    axis: {
      axisLabel: 'Alquimista–Boticario',
      defaultColorLeft: '#7c3aed',
      defaultColorRight: '#0f766e',
      defaultSliderValue: 0,
    },
  },
  'herramienta-20': {
    name: 'Cristal',
    description: 'Herramienta de visión y claridad.',
    subtitle: 'Científico',
    axis: {
      axisLabel: 'Científico–Místico',
      defaultColorLeft: '#22d3ee',
      defaultColorRight: '#a78bfa',
      defaultSliderValue: 0,
    },
  },
  'herramienta-21': {
    name: 'Antorcha',
    description: 'Herramienta de luz y exploración.',
    subtitle: 'Pionero',
    axis: {
      axisLabel: 'Pionero–Aventurero',
      defaultColorLeft: '#f97316',
      defaultColorRight: '#eab308',
      defaultSliderValue: 0,
    },
  },
  'herramienta-22': {
    name: 'Flecha',
    description: 'Herramienta de precisión y puntería.',
    subtitle: 'Cazador',
    axis: {
      axisLabel: 'Cazador–Arquero',
      defaultColorLeft: '#dc2626',
      defaultColorRight: '#16a34a',
      defaultSliderValue: 0,
    },
  },
  'herramienta-23': {
    name: 'Engranaje',
    description: 'Herramienta de transmisión y precisión.',
    subtitle: 'Ingeniero',
    axis: {
      axisLabel: 'Ingeniero–Mecánico',
      defaultColorLeft: '#64748b',
      defaultColorRight: '#1e40af',
      defaultSliderValue: 0,
    },
  },
  'herramienta-24': {
    name: 'Lupa',
    description: 'Herramienta de observación y análisis.',
    subtitle: 'Investigador',
    axis: {
      axisLabel: 'Investigador–Descubridor',
      defaultColorLeft: '#6366f1',
      defaultColorRight: '#0ea5e9',
      defaultSliderValue: 0,
    },
  },
};

/** Metadata exportada (alias para compatibilidad). */
export const HERRAMIENTAS_METADATA: Partial<Record<HerramientaVersionId, HerramientaMetadata>> =
  HERRAMIENTAS_METADATA_MAP;

export function getHerramientaMetadata(versionId: string): HerramientaMetadata | undefined {
  const id = versionId as HerramientaVersionId;
  return id in HERRAMIENTAS_METADATA_MAP ? HERRAMIENTAS_METADATA_MAP[id] : undefined;
}
