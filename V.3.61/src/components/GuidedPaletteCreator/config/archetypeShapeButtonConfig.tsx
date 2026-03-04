import type React from 'react';

export interface ArchetypeShapeButtonConfig {
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

export const ARCHETYPE_BUTTON_CONFIG: ArchetypeShapeButtonConfig = {
  bgGradient: 'from-amber-900/40 to-orange-900/30',
  borderColor: 'border-amber-500/30 hover:border-amber-400/50',
  iconBg: 'bg-amber-500/20',
  iconColor: 'text-amber-400',
  particleColor: '#fbbf24',
  glowColor: 'rgba(251, 191, 36, 0.2)',
  title: 'Arquetipos',
  description: 'Explora conceptos, emociones y significados para crear paletas con intención',
  tags: ['Emocionales', 'Estilos', 'Culturales'],
  tagBg: 'bg-amber-500/20',
  tagColor: 'text-amber-300',
  textColor: 'text-amber-200/70',
  rotate: -5,
  icon: (
    <svg className="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  ),
};

export const SHAPE_BUTTON_CONFIG: ArchetypeShapeButtonConfig = {
  bgGradient: 'from-violet-900/40 to-purple-900/30',
  borderColor: 'border-violet-500/30 hover:border-violet-400/50',
  iconBg: 'bg-violet-500/20',
  iconColor: 'text-violet-400',
  particleColor: '#a78bfa',
  glowColor: 'rgba(167, 139, 250, 0.2)',
  title: 'Formas',
  description: 'Inspírate en formas abstractas basadas en el efecto Bouba-Kiki',
  tags: ['Orgánicas', 'Angulares', 'Patrones'],
  tagBg: 'bg-violet-500/20',
  tagColor: 'text-violet-300',
  textColor: 'text-violet-200/70',
  rotate: 5,
  icon: (
    <svg className="w-8 h-8 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  ),
};
