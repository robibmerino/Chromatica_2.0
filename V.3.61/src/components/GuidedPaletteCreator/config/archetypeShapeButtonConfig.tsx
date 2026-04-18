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

export const AQUARIUM_BUTTON_CONFIG: ArchetypeShapeButtonConfig = {
  bgGradient: 'from-cyan-900/40 to-sky-900/30',
  borderColor: 'border-cyan-500/30 hover:border-cyan-400/50',
  iconBg: 'bg-cyan-500/20',
  iconColor: 'text-cyan-300',
  particleColor: '#22d3ee',
  glowColor: 'rgba(34, 211, 238, 0.2)',
  title: 'Pecera',
  description: 'Crea peces que naden en una pecera y genera una nube de palabras con su personalidad',
  tags: ['Peces', 'Movimiento', 'Nube de palabras'],
  tagBg: 'bg-cyan-500/20',
  tagColor: 'text-cyan-200',
  textColor: 'text-cyan-100/70',
  rotate: -4,
  icon: (
    <svg className="w-8 h-8 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path d="M4 12c2-4 6-6 10-6 2.5 0 4.5.8 6 2-1.4 1.6-1.4 4.4 0 6-1.5 1.2-3.5 2-6 2-4 0-8-2-10-6z" />
      <circle cx="12.2" cy="10.5" r="0.7" fill="currentColor" stroke="none" />
      <path d="M3 9.5c-.8.8-1.2 1.6-1.2 2.5S2.2 13.7 3 14.5" />
    </svg>
  ),
};

export const DESIGN_BUTTON_CONFIG: ArchetypeShapeButtonConfig = {
  bgGradient: 'from-teal-900/40 to-emerald-900/30',
  borderColor: 'border-teal-500/30 hover:border-teal-400/50',
  iconBg: 'bg-teal-500/20',
  iconColor: 'text-teal-300',
  particleColor: '#2dd4bf',
  glowColor: 'rgba(45, 212, 191, 0.2)',
  title: 'Diseño',
  description: 'Diseña y amuebla un espacio interactivo para definir la personalidad del ambiente',
  tags: ['Espacio', 'Mobiliario', 'Personalidad'],
  tagBg: 'bg-teal-500/20',
  tagColor: 'text-teal-200',
  textColor: 'text-teal-100/70',
  rotate: 4,
  icon: (
    <svg className="w-8 h-8 text-teal-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path d="M4 20v-8a2 2 0 012-2h12a2 2 0 012 2v8" />
      <path d="M8 20v-6h8v6" />
      <path d="M9 7h6" />
      <path d="M11 7V4h2v3" />
    </svg>
  ),
};
