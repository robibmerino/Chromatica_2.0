import { memo } from 'react';
import { motion } from 'framer-motion';
import { AtmosphereContainer } from './AtmosphereContainer';
import { getAtmosphereBase } from './useAtmosphereBase';
import { hexWithAlpha } from './utils';
import type { CardComponentProps } from '../types';

const ORBIT_PARTICLE_INDICES = [0, 1, 2, 3] as const;

const SPARK_POSITIONS = [
  { top: '18%', left: '18%' },
  { top: '26%', right: '14%' },
  { top: '48%', left: '10%' },
  { top: '60%', right: '20%' },
  { top: '38%', left: '55%' },
  { top: '70%', left: '38%' },
];

function AtmosphereStardustOrbitInner({
  blendedColor,
  colorLeft,
  colorRight,
  sliderValue = 50,
  className = '',
}: CardComponentProps) {
  const base = getAtmosphereBase({ blendedColor, colorLeft, colorRight }, '#a855f7');
  const intensity = 0.25 + (sliderValue / 100) * 0.35;

  return (
    <AtmosphereContainer className={className}>
      <div
        className="absolute -inset-x-[15%] -top-[10%] h-1/2 opacity-60"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${hexWithAlpha(base, intensity * 255)} 0%, transparent 55%)`,
        }}
      />

      <motion.div
        className="absolute inset-0"
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ duration: 36, repeat: Infinity, ease: 'linear' }}
      >
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-current/40"
          style={{
            width: '74%',
            height: '40%',
            boxShadow: `0 0 24px ${base}40`,
            color: base,
          }}
        />
      </motion.div>

      {ORBIT_PARTICLE_INDICES.map((idx) => (
        <motion.div
          key={idx}
          className="absolute left-1/2 top-1/2"
          style={{ width: '8px', height: '8px' }}
          initial={{ rotate: idx * 90 }}
          animate={{ rotate: idx * 90 + 360 }}
          transition={{
            duration: 26 + idx * 4,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <div
            className="rounded-full"
            style={{
              width: '100%',
              height: '100%',
              transform: 'translate(-50%, -160%)',
              background: `radial-gradient(circle, ${base}ff 0%, ${base}80 40%, transparent 100%)`,
              boxShadow: `0 0 18px ${base}80`,
            }}
          />
        </motion.div>
      ))}

      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0.4 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 8, repeat: Infinity, repeatType: 'reverse' }}
      >
        {SPARK_POSITIONS.map((pos, i) => (
          <div
            key={i}
            className="absolute w-[3px] h-[3px] rounded-full"
            style={{
              ...pos,
              background: base,
              boxShadow: `0 0 12px ${base}a0`,
              opacity: 0.5 + (i % 3) * 0.15,
            }}
          />
        ))}
      </motion.div>
    </AtmosphereContainer>
  );
}

export const AtmosphereStardustOrbit = memo(AtmosphereStardustOrbitInner);
