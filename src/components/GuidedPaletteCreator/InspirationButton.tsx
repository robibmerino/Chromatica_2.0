import { useState } from 'react';
import { motion } from 'framer-motion';
import ButtonParticles from '../ButtonParticles';

/** Card horizontal (icon + texto en fila). Alternativa al layout en grid de InspirationMenuPhase. */
export interface InspirationButtonProps {
  id: string;
  title: string;
  description: string;
  bgColor: string;
  borderColor: string;
  hoverBorder: string;
  iconBg: string;
  iconColor: string;
  particleColor: string;
  glowColor: string;
  icon: React.ReactNode;
  onClick: () => void;
}

export function InspirationButton({
  title,
  description,
  bgColor,
  borderColor,
  hoverBorder,
  iconBg,
  iconColor,
  particleColor,
  glowColor,
  icon,
  onClick,
}: InspirationButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.01, x: 5 }}
      whileTap={{ scale: 0.99 }}
      className={`relative overflow-hidden rounded-2xl p-5 text-left ${bgColor} border ${borderColor} ${hoverBorder} backdrop-blur-sm group transition-all duration-300`}
      aria-label={`${title}. ${description}`}
    >
      <ButtonParticles isHovered={isHovered} color={particleColor} count={15} intensity="light" />

      <motion.div
        initial={false}
        animate={{ opacity: isHovered ? 1 : 0 }}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 30% 50%, ${glowColor} 0%, transparent 60%)`,
        }}
      />

      <div className="relative z-10 flex items-center gap-4">
        <motion.div
          className={`w-12 h-12 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center flex-shrink-0`}
          animate={{
            scale: isHovered ? 1.1 : 1,
            rotate: isHovered ? 5 : 0,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          {icon}
        </motion.div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-0.5">{title}</h3>
          <p className="text-gray-400 text-sm">{description}</p>
        </div>
        <motion.svg
          className="w-5 h-5 text-gray-500 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          animate={{
            x: isHovered ? 4 : 0,
            color: isHovered ? '#ffffff' : '#6b7280',
          }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </motion.svg>
      </div>
    </motion.button>
  );
}
