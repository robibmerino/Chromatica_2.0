import { memo } from 'react';
import { motion } from 'framer-motion';
import { AtmosphereContainer } from './AtmosphereContainer';
import { getAtmosphereBase, getAtmospherePhase } from './useAtmosphereBase';
import { EASING_SMOOTH } from './constants';
import type { CardComponentProps } from '../types';

const BRUMA_BANDS = [
  { left: '8%', width: '22%', delay: 0 },
  { left: '32%', width: '18%', delay: 0.12 },
  { left: '52%', width: '20%', delay: 0.24 },
  { left: '70%', width: '18%', delay: 0.36 },
];

const BRUMA_SPARKS = [
  { left: '18%', size: 5 },
  { left: '30%', size: 4 },
  { left: '46%', size: 6 },
  { left: '60%', size: 4 },
  { left: '76%', size: 5 },
];

function AtmosphereAuroraVeilInner({
  blendedColor,
  colorLeft,
  colorRight,
  sliderValue = 50,
  className = '',
}: CardComponentProps) {
  const base = getAtmosphereBase({ blendedColor, colorLeft, colorRight }, '#fb7185');
  const phase = getAtmospherePhase(sliderValue, 0.6);

  return (
    <AtmosphereContainer className={className}>
      <div
        className="absolute -inset-x-[20%] -top-[5%] h-[70%] opacity-30"
        style={{
          background: `radial-gradient(circle at 50% 10%, ${base}12 0%, transparent 60%)`,
        }}
      />

      {BRUMA_BANDS.map((band, i) => (
        <motion.div
          key={i}
          className="absolute top-[-15%] h-[130%]"
          style={{ left: band.left, width: band.width }}
          animate={{ y: [0, 28, -28, 0] }}
          transition={{
            duration: 5 + i * 1.2,
            repeat: Infinity,
            ease: EASING_SMOOTH,
            delay: band.delay + phase,
          }}
        >
          <div
            className="w-full h-full rounded-full"
            style={{
              background: `linear-gradient(180deg, transparent 0%, ${base}22 15%, ${base}44 38%, ${base}22 62%, transparent 100%)`,
              boxShadow: `0 0 40px ${base}25`,
            }}
          />
        </motion.div>
      ))}

      <motion.div
        className="absolute inset-x-0 top-[28%] h-[40%] opacity-55"
        animate={{ opacity: [0.25, 0.55, 0.25] }}
        transition={{ duration: 3, repeat: Infinity, ease: EASING_SMOOTH }}
      >
        {BRUMA_SPARKS.map((spark, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              left: spark.left,
              top: `${12 + i * 8}%`,
              width: spark.size,
              height: spark.size,
              background: base,
              boxShadow: `0 0 14px ${base}50`,
            }}
          />
        ))}
      </motion.div>
    </AtmosphereContainer>
  );
}

export const AtmosphereAuroraVeil = memo(AtmosphereAuroraVeilInner);
