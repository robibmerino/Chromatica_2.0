import { memo } from 'react';
import { motion } from 'framer-motion';
import { AtmosphereContainer } from './AtmosphereContainer';
import { getAtmosphereBase, getAtmospherePhase } from './useAtmosphereBase';
import type { CardComponentProps } from '../types';

const RAIN_DROPS = [
  { left: '8%', delay: 0, dur: 4 },
  { left: '18%', delay: 0.5, dur: 5 },
  { left: '28%', delay: 0.2, dur: 4.5 },
  { left: '38%', delay: 0.8, dur: 5.5 },
  { left: '48%', delay: 0.1, dur: 4 },
  { left: '58%', delay: 0.6, dur: 5 },
  { left: '68%', delay: 0.3, dur: 4.8 },
  { left: '78%', delay: 0.9, dur: 5.2 },
  { left: '88%', delay: 0.4, dur: 4.2 },
  { left: '12%', delay: 0.7, dur: 5.3 },
  { left: '25%', delay: 0.15, dur: 4.6 },
  { left: '42%', delay: 0.55, dur: 5.1 },
  { left: '55%', delay: 0.25, dur: 4.4 },
  { left: '72%', delay: 0.85, dur: 5.4 },
  { left: '92%', delay: 0.35, dur: 4.7 },
  { left: '5%', delay: 0.65, dur: 5 },
  { left: '35%', delay: 0.45, dur: 4.3 },
  { left: '65%', delay: 0.95, dur: 5.6 },
  { left: '82%', delay: 0.2, dur: 4.5 },
  { left: '15%', delay: 0.75, dur: 5.2 },
  { left: '45%', delay: 0.1, dur: 4.9 },
  { left: '75%', delay: 0.6, dur: 4.6 },
  { left: '95%', delay: 0.4, dur: 5.1 },
];

function AtmosphereRainInner({
  blendedColor,
  colorLeft,
  colorRight,
  sliderValue = 50,
  className = '',
}: CardComponentProps) {
  const base = getAtmosphereBase({ blendedColor, colorLeft, colorRight }, '#22d3ee');
  const phase = getAtmospherePhase(sliderValue, 0.4);

  return (
    <AtmosphereContainer className={className}>
      <div
        className="absolute inset-0 opacity-35"
        style={{
          background: `linear-gradient(180deg, ${base}15 0%, transparent 30%, transparent 70%, ${base}10 100%)`,
        }}
      />

      {RAIN_DROPS.map((drop, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: drop.left,
            top: '-2%',
            width: 1,
            height: 8,
            borderRadius: 2,
            background: `linear-gradient(180deg, transparent, ${base}99 30%, ${base}cc 100%)`,
            boxShadow: `0 0 6px ${base}60`,
          }}
          animate={{
            y: ['0px', '420px'],
            opacity: [0, 0.7, 0.7, 0],
          }}
          transition={{
            duration: drop.dur + phase * 2,
            repeat: Infinity,
            ease: 'linear',
            delay: drop.delay + (i % 4) * 0.8,
          }}
        />
      ))}
    </AtmosphereContainer>
  );
}

export const AtmosphereRain = memo(AtmosphereRainInner);
