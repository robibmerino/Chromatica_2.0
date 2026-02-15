import type React from 'react';
import { Palette } from 'lucide-react';
import type { InspirationMode } from '../../../types/guidedPalette';

/** Paleta tetrádica para los 4 botones: verde, azul, magenta, naranja */
const TETRADIC = {
  green: {
    bgColor: 'bg-emerald-950/50',
    borderColor: 'border-emerald-500/35',
    hoverBorder: 'hover:border-emerald-400/50',
    iconBg: 'bg-emerald-500/25',
    iconColor: 'text-emerald-400',
    descriptionColor: 'text-emerald-300/85',
    particleColor: '#34d399',
    glowColor: 'rgba(52, 211, 153, 0.18)',
  },
  blue: {
    bgColor: 'bg-blue-950/50',
    borderColor: 'border-blue-500/35',
    hoverBorder: 'hover:border-blue-400/50',
    iconBg: 'bg-blue-500/25',
    iconColor: 'text-blue-400',
    descriptionColor: 'text-blue-300/85',
    particleColor: '#60a5fa',
    glowColor: 'rgba(96, 165, 250, 0.18)',
  },
  magenta: {
    bgColor: 'bg-fuchsia-950/50',
    borderColor: 'border-fuchsia-500/35',
    hoverBorder: 'hover:border-fuchsia-400/50',
    iconBg: 'bg-fuchsia-500/25',
    iconColor: 'text-fuchsia-400',
    descriptionColor: 'text-fuchsia-300/85',
    particleColor: '#d946ef',
    glowColor: 'rgba(217, 70, 239, 0.18)',
  },
  orange: {
    bgColor: 'bg-orange-950/50',
    borderColor: 'border-orange-500/35',
    hoverBorder: 'hover:border-orange-400/50',
    iconBg: 'bg-orange-500/25',
    iconColor: 'text-orange-400',
    descriptionColor: 'text-orange-300/85',
    particleColor: '#fb923c',
    glowColor: 'rgba(251, 146, 60, 0.18)',
  },
} as const;

export interface InspirationMenuOption {
  id: InspirationMode;
  title: string;
  description: string;
  bgColor: string;
  borderColor: string;
  hoverBorder: string;
  iconBg: string;
  iconColor: string;
  descriptionColor: string;
  particleColor: string;
  glowColor: string;
  icon: React.ReactNode;
}

export const INSPIRATION_MENU_OPTIONS: InspirationMenuOption[] = [
  {
    id: 'harmony',
    title: 'Armonía de color',
    description: 'Basada en teoría del color: complementarios, análogos, triádicos...',
    ...TETRADIC.green,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3v9l6.5 3.75" />
        <path d="M12 12L5.5 15.75" />
        <path d="M12 12V21" />
      </svg>
    ),
  },
  {
    id: 'image',
    title: 'Desde imagen',
    description: 'Extrae colores de una foto o imagen que te inspire',
    ...TETRADIC.blue,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5L5 21" />
      </svg>
    ),
  },
  {
    id: 'archetypes-menu',
    title: 'Arquetipos o Formas',
    description: 'Empieza desde conceptos, emociones o formas abstractas',
    ...TETRADIC.magenta,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    id: 'trending',
    title: 'Paletas en tendencia',
    description: 'Más de 60 paletas curadas según las tendencias actuales del diseño',
    ...TETRADIC.orange,
    icon: <Palette className="w-6 h-6" strokeWidth={1.5} />,
  },
];
