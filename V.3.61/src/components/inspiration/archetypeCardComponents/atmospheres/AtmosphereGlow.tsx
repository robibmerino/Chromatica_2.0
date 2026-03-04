import { memo } from 'react';
import { motion } from 'framer-motion';
import { AtmosphereContainer } from './AtmosphereContainer';
import { getAtmosphereBase, getAtmospherePhase } from './useAtmosphereBase';
import { EASING_SMOOTH, EASING_SOFT } from './constants';
import type { CardComponentProps } from '../types';

function AtmosphereGlowInner({
  blendedColor,
  colorLeft,
  colorRight,
  sliderValue = 50,
  className = '',
}: CardComponentProps) {
  const base = getAtmosphereBase({ blendedColor, colorLeft, colorRight }, '#a78bfa');
  const phase = getAtmospherePhase(sliderValue, 0.4);

  return (
    <AtmosphereContainer layout="center" className={className}>
      <motion.div
        className="absolute rounded-full"
        style={{
          width: '120%',
          height: '120%',
          background: `radial-gradient(circle, ${base}18 0%, ${base}08 35%, transparent 65%)`,
          boxShadow: `0 0 80px ${base}15`,
        }}
        animate={{ scale: [0.85, 1.15, 0.85], opacity: [0.6, 1, 0.6] }}
        transition={{
          duration: 6 + phase * 2,
          repeat: Infinity,
          ease: EASING_SMOOTH,
        }}
      />

      <motion.div
        className="absolute rounded-full"
        style={{
          width: '70%',
          height: '70%',
          background: `radial-gradient(circle, ${base}25 0%, ${base}10 40%, transparent 70%)`,
          boxShadow: `0 0 60px ${base}20`,
        }}
        animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.5, 0.9, 0.5] }}
        transition={{
          duration: 5 + phase * 1.5,
          repeat: Infinity,
          ease: EASING_SMOOTH,
          delay: 0.5,
        }}
      />

      <motion.div
        className="absolute rounded-full border"
        style={{
          width: '50%',
          height: '50%',
          borderColor: base,
          borderWidth: 1,
          opacity: 0.3,
          boxShadow: `0 0 30px ${base}30`,
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{
          duration: 7 + phase * 2,
          repeat: Infinity,
          ease: EASING_SOFT,
          delay: 1,
        }}
      />
    </AtmosphereContainer>
  );
}

export const AtmosphereGlow = memo(AtmosphereGlowInner);
