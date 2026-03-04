import { memo } from 'react';
import { motion } from 'framer-motion';
import { AtmosphereContainer } from './AtmosphereContainer';
import { getAtmosphereBase, getAtmospherePhase } from './useAtmosphereBase';
import { EASING_SMOOTH } from './constants';
import type { CardComponentProps } from '../types';

const SPARKS = [
  { left: '15%', top: '20%', size: 2, delay: 0 },
  { left: '35%', top: '12%', size: 3, delay: 0.3 },
  { left: '55%', top: '25%', size: 2, delay: 0.6 },
  { left: '75%', top: '18%', size: 3, delay: 0.2 },
  { left: '90%', top: '35%', size: 2, delay: 0.8 },
  { left: '10%', top: '45%', size: 3, delay: 0.4 },
  { left: '28%', top: '55%', size: 2, delay: 0.1 },
  { left: '48%', top: '48%', size: 4, delay: 0.5 },
  { left: '68%', top: '52%', size: 2, delay: 0.7 },
  { left: '85%', top: '62%', size: 3, delay: 0.2 },
  { left: '20%', top: '72%', size: 2, delay: 0.9 },
  { left: '42%', top: '78%', size: 3, delay: 0.3 },
  { left: '62%', top: '75%', size: 2, delay: 0.6 },
  { left: '80%', top: '82%', size: 3, delay: 0.4 },
  { left: '5%', top: '65%', size: 2, delay: 0.7 },
  { left: '95%', top: '50%', size: 2, delay: 0.1 },
  { left: '50%', top: '8%', size: 3, delay: 0.5 },
  { left: '38%', top: '35%', size: 2, delay: 0.8 },
  { left: '72%', top: '40%', size: 3, delay: 0.2 },
  { left: '15%', top: '88%', size: 2, delay: 0.4 },
  { left: '88%', top: '12%', size: 2, delay: 0.6 },
];

function AtmosphereSparksInner({
  blendedColor,
  colorLeft,
  colorRight,
  sliderValue = 50,
  className = '',
}: CardComponentProps) {
  const base = getAtmosphereBase({ blendedColor, colorLeft, colorRight }, '#fbbf24');
  const phase = getAtmospherePhase(sliderValue, 0.5);

  return (
    <AtmosphereContainer className={className}>
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background: `radial-gradient(ellipse 70% 50% at 50% 45%, ${base}15 0%, transparent 65%)`,
        }}
      />

      {SPARKS.map((spark, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: spark.left,
            top: spark.top,
            width: spark.size,
            height: spark.size,
            background: base,
            boxShadow: `0 0 10px ${base}80`,
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 2 + (i % 3) * 0.5,
            repeat: Infinity,
            ease: EASING_SMOOTH,
            delay: spark.delay + phase,
          }}
        />
      ))}
    </AtmosphereContainer>
  );
}

export const AtmosphereSparks = memo(AtmosphereSparksInner);
