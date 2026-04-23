import { useState } from 'react';
import { motion } from 'framer-motion';
import ButtonParticles from '../ButtonParticles';
import {
  ARCHETYPE_BUTTON_CONFIG,
  SHAPE_BUTTON_CONFIG,
  AQUARIUM_BUTTON_CONFIG,
  DESIGN_BUTTON_CONFIG,
} from './config/archetypeShapeButtonConfig';

interface ArchetypeOrShapeButtonProps {
  type: 'archetypes' | 'shapes' | 'aquarium' | 'design';
  onClick: () => void;
}

export function ArchetypeOrShapeButton({ type, onClick }: ArchetypeOrShapeButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const config = {
    archetypes: ARCHETYPE_BUTTON_CONFIG,
    shapes: SHAPE_BUTTON_CONFIG,
    aquarium: AQUARIUM_BUTTON_CONFIG,
    design: DESIGN_BUTTON_CONFIG,
  }[type];

  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02, y: -3 }}
      whileTap={{ scale: 0.98 }}
      className={`relative overflow-hidden rounded-2xl p-6 md:p-5 lg:p-6 text-left text-white bg-gradient-to-br ${config.bgGradient} border ${config.borderColor} group transition-all min-h-[260px] md:min-h-[280px] lg:min-h-[300px]`}
    >
      <ButtonParticles isHovered={isHovered} color={config.particleColor} count={20} intensity="medium" />

      <motion.div
        animate={{ opacity: isHovered ? 1 : 0 }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 50% 30%, ${config.glowColor} 0%, transparent 60%)`,
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.div
          className={`w-16 h-16 rounded-2xl ${config.iconBg} flex items-center justify-center mb-4`}
          animate={{ scale: isHovered ? 1.1 : 1, rotate: isHovered ? config.rotate : 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          {config.icon}
        </motion.div>
        <h3 className="text-xl font-bold text-white mb-2">{config.title}</h3>
        <p className={`${config.textColor} text-sm`}>{config.description}</p>
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {config.tags.map((tag) => (
            <span key={tag} className={`text-xs px-2 py-1 ${config.tagBg} ${config.tagColor} rounded-full`}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.button>
  );
}
