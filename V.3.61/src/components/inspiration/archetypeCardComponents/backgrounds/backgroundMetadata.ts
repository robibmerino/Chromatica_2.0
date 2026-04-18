import type { BackgroundId } from './constants';

export interface BackgroundMetadata {
  /** Nombre mostrado (modal, tarjeta) */
  name: string;
  /** Descripción breve para el modal */
  description?: string;
  /** Subtítulo/etiqueta (ej. "Exploración") */
  subtitle: string;
  /** Configuración del eje (Visión–Misión, etc.) */
  axis: {
    axisLabel: string;
    defaultColorLeft: string;
    defaultColorRight: string;
    defaultSliderValue: number;
  };
}

/** Metadata de fondos configurados. Las no listadas usan valores por defecto. */
export const BACKGROUND_METADATA: Partial<Record<BackgroundId, BackgroundMetadata>> = {
  'background-1': {
    name: 'Penumbra',
    description:
      'Superficie oscura con luces suaves y sin motivo figurativo: deja que el arquetipo y el color del eje lleven el peso visual.',
    subtitle: 'Exploración',
    axis: {
      axisLabel: 'Visión–Misión',
      defaultColorLeft: '#1e293b',
      defaultColorRight: '#64748b',
      defaultSliderValue: 0,
    },
  },
  'background-2': {
    name: 'Boreal',
    description: 'Aurora boreal: el silencio del norte donde la energía se transforma en luz.',
    subtitle: 'Silencio',
    axis: {
      axisLabel: 'Silencio–Energía',
      defaultColorLeft: '#128248',
      defaultColorRight: '#6d28d9',
      defaultSliderValue: 0,
    },
  },
  'background-3': {
    name: 'Coalescencia',
    description: 'Ondas de gotas al caer: lo íntimo que se expande hacia lo compartido.',
    subtitle: 'Intimidad',
    axis: {
      axisLabel: 'Intimidad–Comunidad',
      defaultColorLeft: '#5c1d6b',
      defaultColorRight: '#0e7490',
      defaultSliderValue: 0,
    },
  },
  'background-4': {
    name: 'Cristales',
    description: 'Fragmentos de cristal: la pureza en la imperfección reparada con oro mediante kintsugi.',
    subtitle: 'Kintsugi',
    axis: {
      axisLabel: 'Kintsugi–Pureza',
      defaultColorLeft: '#8b5cf6',
      defaultColorRight: '#f59e0b',
      defaultSliderValue: 0,
    },
  },
  'background-5': {
    name: 'Marea',
    description: 'Corrientes de flujo hacia un foco central: el flujo que encuentra calma en el horizonte.',
    subtitle: 'Flow',
    axis: {
      axisLabel: 'Flow–Calma',
      defaultColorLeft: '#0099cc',
      defaultColorRight: '#00ccaa',
      defaultSliderValue: 0,
    },
  },
  'background-6': {
    name: 'Forja',
    description: 'Brasas de forja: la resistencia y la transformación bajo el martillo.',
    subtitle: 'Fortaleza',
    axis: {
      axisLabel: 'Fortaleza–Metamorfosis',
      defaultColorLeft: '#ff4500',
      defaultColorRight: '#ffd700',
      defaultSliderValue: 0,
    },
  },
  'background-7': {
    name: 'Tejido Universal',
    description: 'Red tridimensional de filamentos de materia oscura y gas que conectan galaxias y vacíos: el orden del cosmo en exploración infinita.',
    subtitle: 'Orden',
    axis: {
      axisLabel: 'Orden–Exploración',
      defaultColorLeft: '#3b82f6',
      defaultColorRight: '#06b6d4',
      defaultSliderValue: 0,
    },
  },
  'background-8': {
    name: 'Vórtice',
    description: 'Espiral de corrientes deformadas por su magnetismo absorvente: un flujo estable en equilibrio.',
    subtitle: 'Magnetismo',
    axis: {
      axisLabel: 'Magnetismo–Equilibrio',
      defaultColorLeft: '#7c3aed',
      defaultColorRight: '#06b6d4',
      defaultSliderValue: 0,
    },
  },
  'background-9': {
    name: 'Germinación',
    description: 'Tendriles que brotan del centro: lo latente que se despliega en crecimiento orgánico.',
    subtitle: 'Latencia',
    axis: {
      axisLabel: 'Latencia–Despliegue',
      defaultColorLeft: '#047857',
      defaultColorRight: '#d97706',
      defaultSliderValue: 0,
    },
  },
};

export function getBackgroundMetadata(id: string): BackgroundMetadata | undefined {
  return id in BACKGROUND_METADATA
    ? BACKGROUND_METADATA[id as BackgroundId]
    : undefined;
}
