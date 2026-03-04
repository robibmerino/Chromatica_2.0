import { memo } from 'react';
import { motion } from 'framer-motion';
import { AtmosphereContainer } from './AtmosphereContainer';
import { getAtmosphereBase } from './useAtmosphereBase';
import type { CardComponentProps } from '../types';

function AtmospherePlaceholderInner({
  blendedColor,
  colorLeft,
  colorRight,
  className = '',
}: CardComponentProps) {
  const base = getAtmosphereBase({ blendedColor, colorLeft, colorRight }, '#a855f7');

  return (
    <AtmosphereContainer className={className}>
      {/* Halo suave central para dar sensación de atmósfera */}
      <div
        className="absolute inset-[-20%] opacity-40"
        style={{
          background: `radial-gradient(circle at 50% 30%, ${base}33 0%, transparent 55%)`,
        }}
      />

      {/* Partículas flotando lentamente */}
      {[0, 1, 2].map((row) => (
        <motion.div
          key={row}
          className="absolute inset-0"
          initial={{ y: row === 0 ? 0 : row === 1 ? 10 : -10 }}
          animate={{ y: row === 0 ? -8 : row === 1 ? 6 : 10 }}
          transition={{
            duration: 14 + row * 2,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div
            className="absolute w-40 h-40 rounded-full blur-2xl opacity-35"
            style={{
              top: '8%',
              left: '-6%',
              background: `radial-gradient(circle, ${base}55 0%, transparent 70%)`,
            }}
          />
          <div
            className="absolute w-36 h-36 rounded-full blur-2xl opacity-40"
            style={{
              top: '45%',
              right: '-10%',
              background: `radial-gradient(circle, ${base}4d 0%, transparent 70%)`,
            }}
          />
          <div
            className="absolute w-32 h-32 rounded-full blur-2xl opacity-35"
            style={{
              bottom: '-4%',
              left: '35%',
              background: `radial-gradient(circle, ${base}40 0%, transparent 70%)`,
            }}
          />
        </motion.div>
      ))}
    </AtmosphereContainer>
  );
}

export const AtmospherePlaceholder = memo(AtmospherePlaceholderInner);

