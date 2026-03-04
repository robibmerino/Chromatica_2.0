import { memo } from 'react';
import { motion } from 'framer-motion';
import { AtmosphereContainer } from './AtmosphereContainer';
import { getAtmosphereBase, getAtmospherePhase } from './useAtmosphereBase';
import { EASING_EASE_OUT } from './constants';
import type { CardComponentProps } from '../types';

const RIPPLE_RINGS = [
  { size: 30, delay: 0, dur: 18 },
  { size: 50, delay: 2.5, dur: 19 },
  { size: 70, delay: 5, dur: 20 },
  { size: 90, delay: 7.5, dur: 21 },
  { size: 110, delay: 10, dur: 22 },
  { size: 130, delay: 12.5, dur: 23 },
  { size: 150, delay: 15, dur: 24 },
  { size: 170, delay: 17.5, dur: 25 },
  { size: 190, delay: 20, dur: 26 },
  { size: 210, delay: 22.5, dur: 27 },
];

function AtmosphereRipplesInner({
  blendedColor,
  colorLeft,
  colorRight,
  sliderValue = 50,
  className = '',
}: CardComponentProps) {
  const base = getAtmosphereBase({ blendedColor, colorLeft, colorRight }, '#06b6d4');
  const phase = getAtmospherePhase(sliderValue, 0.5);

  return (
    <AtmosphereContainer layout="center" className={className}>
      <div
        className="absolute inset-0 opacity-25"
        style={{
          background: `radial-gradient(circle at 50% 45%, ${base}12 0%, transparent 60%)`,
        }}
      />

      {RIPPLE_RINGS.map((ring, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border"
          style={{
            width: ring.size,
            height: ring.size,
            borderColor: base,
            borderWidth: 1.5,
            boxShadow: `0 0 12px ${base}35`,
          }}
          initial={{ scale: 0.3, opacity: 0.5 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{
            duration: ring.dur + phase * 3,
            repeat: Infinity,
            ease: EASING_EASE_OUT,
            delay: ring.delay + i * 0.35,
          }}
        />
      ))}
    </AtmosphereContainer>
  );
}

export const AtmosphereRipples = memo(AtmosphereRipplesInner);
