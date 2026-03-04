import { useState, memo } from 'react';
import { motion } from 'framer-motion';
import ButtonParticles from '../ButtonParticles';
import { COLUMN_BUTTON_CONFIG } from './config/archetypeColumnButtonConfig';
import type { ColumnKey } from './config/archetypeColumnButtonConfig';

interface ArchetypeColumnCardProps {
  columnKey: ColumnKey;
  isActive?: boolean;
  /** true cuando la paleta ya está creada: muestra indicador de edición en vez de descripción */
  hasPaletteCreated?: boolean;
  onClick: () => void;
}

/** Tarjeta compacta al estilo Arquetipos/Formas: icono, título, descripción, tags. */
export const ArchetypeColumnCard = memo(function ArchetypeColumnCard({
  columnKey,
  isActive = false,
  hasPaletteCreated = false,
  onClick,
}: ArchetypeColumnCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const config = COLUMN_BUTTON_CONFIG[columnKey];

  return (
    <motion.div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02, y: -3 }}
      whileTap={{ scale: 0.98 }}
      className={`relative overflow-hidden rounded-2xl p-6 text-left w-full bg-gradient-to-br border group transition-all cursor-pointer transition-colors duration-300 ${
        isActive || isHovered
          ? `${config.bgGradient} ${config.borderColor}`
          : 'from-gray-700/60 to-gray-600/40 border-gray-600/50 hover:border-gray-500/60'
      }`}
    >
      <ButtonParticles
        isHovered={isHovered}
        color={isActive || isHovered ? config.particleColor : '#9ca3af'}
        count={20}
        intensity="medium"
      />

      <motion.div
        animate={{ opacity: isHovered ? 1 : 0 }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 30%, ${config.glowColor} 0%, transparent 60%)`,
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.div
          className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors duration-300 ${
            isActive || isHovered ? config.iconBg : 'bg-gray-600/40'
          }`}
          animate={{ scale: isHovered ? 1.1 : 1, rotate: isHovered ? config.rotate : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          <span
            className={
              isActive || isHovered ? `${config.iconColor} [&_svg]:!text-inherit` : '[&_svg]:!text-gray-400'
            }
          >
            {config.icon}
          </span>
        </motion.div>
        <h3
          className={`text-xl font-bold mb-2 transition-colors duration-300 ${
            isActive || isHovered ? 'text-white' : 'text-gray-400'
          }`}
        >
          {config.title}
        </h3>
        <p
          className={`text-sm transition-colors duration-300 ${
            isActive || isHovered ? config.textColor : 'text-gray-500'
          }`}
        >
          {hasPaletteCreated ? 'Pulsa para ver o editar' : config.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {(hasPaletteCreated ? ['Ver / Editar'] : config.tags).map((tag) => (
            <span
              key={tag}
              className={`text-xs px-2 py-1 rounded-full transition-colors duration-300 ${
                isActive || isHovered
                  ? `${config.tagBg} ${config.tagColor}`
                  : 'bg-gray-600/40 text-gray-400'
              }`}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
});
