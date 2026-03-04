export type AtmosphereVersionId = 'stardust-orbit' | 'aurora-veil' | 'mist' | 'sparks' | 'rain' | 'ripples' | 'snow' | 'bubbles' | 'ash' | 'glow' | 'aurora' | 'rays';

export const ATMOSPHERE_IDS: readonly AtmosphereVersionId[] = [
  'stardust-orbit',
  'aurora-veil',
  'mist',
  'sparks',
  'rain',
  'ripples',
  'snow',
  'bubbles',
  'ash',
  'glow',
  'aurora',
  'rays',
] as const;

export interface AtmosphereMetadata {
  /** Nombre mostrado (modal, tarjeta) */
  name: string;
  /** Descripción breve para el modal */
  description?: string;
  /** Subtítulo/etiqueta secundaria (ej. "Presencia") */
  subtitle: string;
  /** Configuración del eje Atmósfera */
  axis: {
    /** Extremos del eje (ej. "Presencia–Susurro") */
    axisLabel: string;
    defaultColorLeft: string;
    defaultColorRight: string;
    defaultSliderValue: number;
  };
}

const ATMOSPHERE_METADATA: Record<AtmosphereVersionId, AtmosphereMetadata> = {
  'stardust-orbit': {
    name: 'Órbita',
    description:
      'Anillo de polvo estelar, entre la presencia luminosa y el susurro ausente.',
    subtitle: 'Presencia',
    axis: {
      axisLabel: 'Presencia–Susurro',
      defaultColorLeft: '#7287f3',
      defaultColorRight: '#22d3ee',
      defaultSliderValue: 0,
    },
  },
  'aurora-veil': {
    name: 'Bruma',
    description:
      'Velos que respiran, entre el pulso y la bruma que se disuelve.',
    subtitle: 'Bruma',
    axis: {
      axisLabel: 'Bruma–Pulso',
      defaultColorLeft: '#909bc4',
      defaultColorRight: '#38bdf8',
      defaultSliderValue: 0,
    },
  },
  mist: {
    name: 'Neblina',
    description:
      'Partículas que flotan en el aire, entre el misterio que envuelve y lo mágico que resplandece.',
    subtitle: 'Neblina',
    axis: {
      axisLabel: 'Misterio–Mágico',
      defaultColorLeft: '#c084fc',
      defaultColorRight: '#4c1d95',
      defaultSliderValue: 0,
    },
  },
  sparks: {
    name: 'Chispas',
    description:
      'Destellos que parpadean en el aire, entre el fulgor intenso y el brillo sutil.',
    subtitle: 'Chispas',
    axis: {
      axisLabel: 'Fulgor–Sutil',
      defaultColorLeft: '#fbbf24',
      defaultColorRight: '#f97316',
      defaultSliderValue: 0,
    },
  },
  rain: {
    name: 'Lluvia',
    description:
      'Gotas que caen suavemente, entre la intensidad del aguacero y la llovizna sutil.',
    subtitle: 'Lluvia',
    axis: {
      axisLabel: 'Intenso–Sutil',
      defaultColorLeft: '#22d3ee',
      defaultColorRight: '#0ea5e9',
      defaultSliderValue: 0,
    },
  },
  ripples: {
    name: 'Ondas',
    description:
      'Círculos que se expanden desde el centro, entre el impacto fuerte y la resonancia sutil.',
    subtitle: 'Ondas',
    axis: {
      axisLabel: 'Impacto–Resonancia',
      defaultColorLeft: '#06b6d4',
      defaultColorRight: '#f59e0b',
      defaultSliderValue: 0,
    },
  },
  snow: {
    name: 'Nieve',
    description:
      'Copos que caen suavemente con ligera deriva, entre la densa nevada y el destello ligero.',
    subtitle: 'Nieve',
    axis: {
      axisLabel: 'Densa–Ligero',
      defaultColorLeft: '#e0f2fe',
      defaultColorRight: '#7dd3fc',
      defaultSliderValue: 0,
    },
  },
  bubbles: {
    name: 'Burbujas',
    description:
      'Burbujas que ascienden suavemente con ligera deriva, entre el ascenso decidido y la suspensión flotante.',
    subtitle: 'Burbujas',
    axis: {
      axisLabel: 'Ascenso–Suspensión',
      defaultColorLeft: '#67e8f9',
      defaultColorRight: '#a78bfa',
      defaultSliderValue: 0,
    },
  },
  ash: {
    name: 'Ceniza',
    description:
      'Partículas de ceniza y ascua que flotan lentamente, entre el brillo de la brasa y el polvo que se disipa.',
    subtitle: 'Ceniza',
    axis: {
      axisLabel: 'Ascua–Ceniza',
      defaultColorLeft: '#f97316',
      defaultColorRight: '#78716c',
      defaultSliderValue: 0,
    },
  },
  glow: {
    name: 'Resplandor',
    description:
      'Un halo central que pulsa y respira, sin partículas, entre el foco luminoso y la penumbra que envuelve.',
    subtitle: 'Resplandor',
    axis: {
      axisLabel: 'Foco–Penumbra',
      defaultColorLeft: '#e0e7ff',
      defaultColorRight: '#a78bfa',
      defaultSliderValue: 0,
    },
  },
  aurora: {
    name: 'Boreal',
    description:
      'El misterio de las luces del norte: entre el fulgor que atrae y el velo que envuelve.',
    subtitle: 'Boreal',
    axis: {
      axisLabel: 'Velo–Brillo',
      defaultColorLeft: '#2042ee',
      defaultColorRight: '#34d399',
      defaultSliderValue: 0,
    },
  },
  rays: {
    name: 'Cenit',
    description:
      'Cenit, ese punto del cielo justo sobre nuestra cabeza. La luz que desciende desde ese brillo y la sombra que recibe.',
    subtitle: 'Cenit',
    axis: {
      axisLabel: 'Brillo–Sombra',
      defaultColorLeft: '#fcd34d',
      defaultColorRight: '#64748b',
      defaultSliderValue: 0,
    },
  },
};

export function getAtmosphereMetadata(versionId: string): AtmosphereMetadata | undefined {
  if (versionId === 'default') return ATMOSPHERE_METADATA['stardust-orbit'];
  const id = versionId as AtmosphereVersionId;
  return ATMOSPHERE_METADATA[id];
}

