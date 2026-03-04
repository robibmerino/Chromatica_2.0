import type React from 'react';

export type ColumnKey = 'quien' | 'que' | 'como';

export interface ArchetypeColumnButtonConfig {
  bgGradient: string;
  borderColor: string;
  iconBg: string;
  iconColor: string;
  particleColor: string;
  glowColor: string;
  title: string;
  description: string;
  tags: string[];
  tagBg: string;
  tagColor: string;
  textColor: string;
  rotate: number;
  icon: React.ReactNode;
}

export const COLUMN_BUTTON_CONFIG: Record<ColumnKey, ArchetypeColumnButtonConfig> = {
  quien: {
    bgGradient: 'from-amber-900/40 to-orange-900/30',
    borderColor: 'border-amber-500/30 hover:border-amber-400/50',
    iconBg: 'bg-amber-500/20',
    iconColor: 'text-amber-400',
    particleColor: '#fbbf24',
    glowColor: 'rgba(251, 191, 36, 0.2)',
    title: 'Quién',
    description: 'Define la identidad y el público objetivo de tu paleta',
    tags: ['Persona', 'Identidad', 'Rol'],
    tagBg: 'bg-amber-500/20',
    tagColor: 'text-amber-300',
    textColor: 'text-amber-200/70',
    rotate: -3,
    icon: (
      <svg className="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
      </svg>
    ),
  },
  que: {
    bgGradient: 'from-blue-900/40 to-cyan-900/30',
    borderColor: 'border-blue-500/30 hover:border-blue-400/50',
    iconBg: 'bg-blue-500/20',
    iconColor: 'text-blue-400',
    particleColor: '#60a5fa',
    glowColor: 'rgba(96, 165, 250, 0.2)',
    title: 'Qué',
    description: 'El objeto, producto o concepto que representa tu paleta',
    tags: ['Objeto', 'Producto', 'Concepto'],
    tagBg: 'bg-blue-500/20',
    tagColor: 'text-blue-300',
    textColor: 'text-blue-200/70',
    rotate: 5,
    icon: (
      <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    ),
  },
  como: {
    bgGradient: 'from-violet-900/40 to-purple-900/30',
    borderColor: 'border-violet-500/30 hover:border-violet-400/50',
    iconBg: 'bg-violet-500/20',
    iconColor: 'text-violet-400',
    particleColor: '#a78bfa',
    glowColor: 'rgba(167, 139, 250, 0.2)',
    title: 'Cómo',
    description: 'El estilo, método o acción que define tu paleta',
    tags: ['Acción', 'Método', 'Estilo'],
    tagBg: 'bg-violet-500/20',
    tagColor: 'text-violet-300',
    textColor: 'text-violet-200/70',
    rotate: 3,
    icon: (
      <svg className="w-8 h-8 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
      </svg>
    ),
  },
};
