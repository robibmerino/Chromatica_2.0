import { memo } from 'react';
import { motion } from 'framer-motion';
import { AtmosphereContainer } from './AtmosphereContainer';
import { getAtmosphereBase, getAtmospherePhase } from './useAtmosphereBase';
import { EASING_SMOOTH } from './constants';
import type { CardComponentProps } from '../types';

const MIST_MOTES = [
  { left: '12%', top: '15%', size: 3, dx: 8, dy: -6, dur: 12 },
  { left: '28%', top: '45%', size: 4, dx: -10, dy: 4, dur: 14 },
  { left: '55%', top: '25%', size: 2, dx: 6, dy: 8, dur: 11 },
  { left: '72%', top: '60%', size: 3, dx: -7, dy: -5, dur: 13 },
  { left: '40%', top: '75%', size: 2, dx: 5, dy: 6, dur: 15 },
  { left: '85%', top: '35%', size: 3, dx: -6, dy: 3, dur: 10 },
  { left: '18%', top: '70%', size: 2, dx: 4, dy: -4, dur: 16 },
  { left: '65%', top: '12%', size: 4, dx: -8, dy: 7, dur: 12 },
  { left: '8%', top: '50%', size: 2, dx: 5, dy: 5, dur: 13 },
  { left: '45%', top: '8%', size: 3, dx: -6, dy: 4, dur: 11 },
  { left: '78%', top: '78%', size: 2, dx: 4, dy: -6, dur: 14 },
  { left: '35%', top: '35%', size: 3, dx: -5, dy: -3, dur: 12 },
  { left: '92%', top: '55%', size: 2, dx: -4, dy: 5, dur: 15 },
  { left: '5%', top: '85%', size: 3, dx: 7, dy: -4, dur: 10 },
  { left: '58%', top: '52%', size: 2, dx: -3, dy: 6, dur: 16 },
  { left: '22%', top: '28%', size: 4, dx: 6, dy: -5, dur: 11 },
  { left: '88%', top: '18%', size: 2, dx: -7, dy: 3, dur: 13 },
  { left: '15%', top: '55%', size: 3, dx: 5, dy: 4, dur: 14 },
  { left: '70%', top: '42%', size: 2, dx: -4, dy: -4, dur: 12 },
  { left: '48%', top: '68%', size: 3, dx: 6, dy: 5, dur: 10 },
  { left: '62%', top: '82%', size: 2, dx: -5, dy: 4, dur: 13 },
  { left: '38%', top: '18%', size: 3, dx: 4, dy: -6, dur: 11 },
  { left: '95%', top: '72%', size: 2, dx: -6, dy: -3, dur: 14 },
  { left: '2%', top: '32%', size: 3, dx: 7, dy: 5, dur: 12 },
  { left: '75%', top: '8%', size: 2, dx: -4, dy: 6, dur: 15 },
  { left: '52%', top: '38%', size: 4, dx: 5, dy: -4, dur: 10 },
  { left: '25%', top: '62%', size: 2, dx: -3, dy: 7, dur: 16 },
  { left: '82%', top: '48%', size: 3, dx: 6, dy: 3, dur: 11 },
  { left: '10%', top: '22%', size: 2, dx: -5, dy: -5, dur: 13 },
  { left: '90%', top: '88%', size: 3, dx: 4, dy: 4, dur: 12 },
  { left: '30%', top: '88%', size: 2, dx: -6, dy: -4, dur: 14 },
  { left: '68%', top: '28%', size: 3, dx: 5, dy: 6, dur: 10 },
];

function AtmosphereMistInner({
  blendedColor,
  colorLeft,
  colorRight,
  sliderValue = 50,
  className = '',
}: CardComponentProps) {
  const base = getAtmosphereBase({ blendedColor, colorLeft, colorRight }, '#c084fc');
  const phase = getAtmospherePhase(sliderValue, 0.5);

  return (
    <AtmosphereContainer className={className}>
      <div
        className="absolute inset-0 opacity-50"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 40%, ${base}20 0%, transparent 70%)`,
        }}
      />

      {MIST_MOTES.map((mote, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: mote.left,
            top: mote.top,
            width: mote.size,
            height: mote.size,
            background: base,
            boxShadow: `0 0 12px ${base}60`,
          }}
          animate={{
            x: [0, mote.dx, 0],
            y: [0, mote.dy, 0],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: mote.dur + phase * 4,
            repeat: Infinity,
            ease: EASING_SMOOTH,
            delay: i * 0.15,
          }}
        />
      ))}

      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 100% 80% at 50% 50%, ${base}15 0%, transparent 60%)`,
        }}
        animate={{ opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: EASING_SMOOTH }}
      />
    </AtmosphereContainer>
  );
}

export const AtmosphereMist = memo(AtmosphereMistInner);
