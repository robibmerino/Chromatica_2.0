/** VersionId de cada variante de familiar en FAMILIAR_VARIANTS. */
export type FamiliarVersionId =
  | 'cactin'
  | 'wise-frog'
  | 'mouse-inventor'
  | 'ghost-cat'
  | 'cosmic-butterfly'
  | 'ember'
  | 'void'
  | 'ondulation'
  | 'surge';

/** IDs de esencias disponibles. */
export const FAMILIAR_IDS: readonly FamiliarVersionId[] = [
  'cactin',
  'wise-frog',
  'mouse-inventor',
  'ghost-cat',
  'cosmic-butterfly',
  'ember',
  'void',
  'ondulation',
  'surge',
] as const;

export interface FamiliarMetadata {
  /** Nombre mostrado (ej. "Átomo", "Semilla") */
  name: string;
  /** Descripción breve para el modal */
  description?: string;
  /** Subtítulo/etiqueta secundaria (ej. "Naturaleza") */
  subtitle: string;
  /** Configuración del eje */
  axis: {
    axisLabel: string;
    defaultColorLeft: string;
    defaultColorRight: string;
    defaultSliderValue: number;
  };
}

/** Valores por defecto cuando no hay metadata. */
const FALLBACK_METADATA: Record<FamiliarVersionId, FamiliarMetadata> = {
  cactin: {
    name: 'Átomo',
    description:
      'Lo mínimo que contiene lo máximo: el núcleo desde el cual todo emerge hacia su evolución.',
    subtitle: 'Núcleo',
    axis: {
      axisLabel: 'Núcleo–Evolución',
      defaultColorLeft: '#3b82f6',
      defaultColorRight: '#f97316',
      defaultSliderValue: 0,
    },
  },
  'wise-frog': {
    name: 'Gema',
    description:
      'Brillo facetado que oscila entre el lujo ostentoso y el misterio que oculta su verdadero valor.',
    subtitle: 'Lujo',
    axis: {
      axisLabel: 'Lujo–Misterio',
      defaultColorLeft: '#d4af37',
      defaultColorRight: '#6d28d9',
      defaultSliderValue: 0,
    },
  },
  'ghost-cat': {
    name: 'Metatrón',
    description:
      'Geometría sagrada que canaliza la energía eléctrica hacia la armonía del equilibrio.',
    subtitle: 'Energía',
    axis: {
      axisLabel: 'Energía–Armonía',
      defaultColorLeft: '#eab308',
      defaultColorRight: '#06b6d4',
      defaultSliderValue: 0,
    },
  },
  'mouse-inventor': {
    name: 'Semilla',
    description:
      'El germen que guarda la vida en potencia: entre lo latente y el origen que brota.',
    subtitle: 'Naturaleza',
    axis: {
      axisLabel: 'Vida–Origen',
      defaultColorLeft: '#059669',
      defaultColorRight: '#d97706',
      defaultSliderValue: 0,
    },
  },
  'cosmic-butterfly': {
    name: 'Crisálida',
    description:
      'El capullo donde la metamorfosis ocurre, entre la transformación activa y el refugio protector.',
    subtitle: 'Metamorfosis',
    axis: {
      axisLabel: 'Metamorfosis–Refugio',
      defaultColorLeft: '#a855f7',
      defaultColorRight: '#0d9488',
      defaultSliderValue: 0,
    },
  },
  ember: {
    name: 'Luz',
    description:
      'La brasa que persiste: el calor que late en el centro hasta convertirse en poder.',
    subtitle: 'Calor',
    axis: {
      axisLabel: 'Calor–Poder',
      defaultColorLeft: '#f97316',
      defaultColorRight: '#dc2626',
      defaultSliderValue: 0,
    },
  },
  void: {
    name: 'Vacío',
    description:
      'El silencio que contiene todo: el horizonte donde la pausa se vuelve presencia.',
    subtitle: 'Silencio',
    axis: {
      axisLabel: 'Silencio–Pausa',
      defaultColorLeft: '#7c3aed',
      defaultColorRight: '#64748b',
      defaultSliderValue: 0,
    },
  },
  ondulation: {
    name: 'Onda',
    description:
      'Las ondas que fluyen y resuenan: entre la suavidad del movimiento y el eco que perdura.',
    subtitle: 'Fluidez',
    axis: {
      axisLabel: 'Fluidez–Resonancia',
      defaultColorLeft: '#1a6dc7',
      defaultColorRight: '#8b5cf6',
      defaultSliderValue: 0,
    },
  },
  surge: {
    name: 'Energía',
    description:
      'Osciloscopio de tensión: canales de señal que emanan del centro entre el movimiento y la alegría.',
    subtitle: 'Movimiento',
    axis: {
      axisLabel: 'Movimiento–Alegría',
      defaultColorLeft: '#facc15',
      defaultColorRight: '#f97316',
      defaultSliderValue: 0,
    },
  },
};

/** Metadata de esencias (familiares). Derivado de FAMILIAR_IDS para evitar desincronización. */
export const FAMILIAR_METADATA: Partial<Record<FamiliarVersionId, FamiliarMetadata>> =
  Object.fromEntries(FAMILIAR_IDS.map((id) => [id, FALLBACK_METADATA[id]]));

export function getFamiliarMetadata(versionId: string): FamiliarMetadata | undefined {
  const id = versionId as FamiliarVersionId;
  if (!(id in FALLBACK_METADATA)) return undefined;
  const custom = FAMILIAR_METADATA[id];
  return custom ?? FALLBACK_METADATA[id];
}
