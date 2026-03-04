import { memo } from 'react';
import { motion } from 'framer-motion';
import { AtmosphereContainer } from './AtmosphereContainer';
import { makeDriftPath } from './utils';
import { getAtmosphereBase, getAtmospherePhase } from './useAtmosphereBase';
import { EASING_SOFT } from './constants';
import type { CardComponentProps } from '../types';

const BUBBLES = [
    { left: '8%', delay: 0, dur: 22, size: 4, path: makeDriftPath(12, -8, 10) },
    { left: '22%', delay: 0.4, dur: 28, size: 6, path: makeDriftPath(-10, 14, -6) },
    { left: '38%', delay: 0.8, dur: 19, size: 3, path: makeDriftPath(8, -12, 6) },
    { left: '52%', delay: 1.2, dur: 32, size: 5, path: makeDriftPath(-14, 10, -8) },
    { left: '68%', delay: 1.6, dur: 25, size: 4, path: makeDriftPath(10, -6, 12) },
    { left: '82%', delay: 2.0, dur: 34, size: 3, path: makeDriftPath(-8, 12, -10) },
    { left: '15%', delay: 2.4, dur: 20, size: 5, path: makeDriftPath(14, -10, 8) },
    { left: '45%', delay: 2.8, dur: 30, size: 4, path: makeDriftPath(-12, 8, -14) },
    { left: '75%', delay: 3.2, dur: 24, size: 3, path: makeDriftPath(6, -14, 4) },
    { left: '5%', delay: 3.6, dur: 27, size: 4, path: makeDriftPath(-10, 6, -8) },
    { left: '30%', delay: 0.2, dur: 33, size: 5, path: makeDriftPath(8, -12, 10) },
    { left: '58%', delay: 0.6, dur: 18, size: 3, path: makeDriftPath(-14, 10, -12) },
    { left: '88%', delay: 1.0, dur: 36, size: 6, path: makeDriftPath(12, -8, 14) },
    { left: '12%', delay: 1.4, dur: 25, size: 4, path: makeDriftPath(-6, 14, -4) },
    { left: '42%', delay: 1.8, dur: 22, size: 3, path: makeDriftPath(10, -10, 8) },
    { left: '72%', delay: 2.2, dur: 30, size: 5, path: makeDriftPath(-8, 12, -10) },
    { left: '95%', delay: 2.6, dur: 20, size: 4, path: makeDriftPath(14, -6, 12) },
    { left: '25%', delay: 3.0, dur: 28, size: 3, path: makeDriftPath(-12, 8, -14) },
    { left: '55%', delay: 3.4, dur: 24, size: 5, path: makeDriftPath(6, -14, 4) },
    { left: '85%', delay: 3.8, dur: 19, size: 4, path: makeDriftPath(-10, 10, -8) },
    { left: '18%', delay: 0.3, dur: 31, size: 4, path: makeDriftPath(8, -12, 6) },
    { left: '48%', delay: 0.7, dur: 27, size: 3, path: makeDriftPath(-14, 6, -12) },
    { left: '78%', delay: 1.1, dur: 22, size: 5, path: makeDriftPath(10, -8, 12) },
    { left: '10%', delay: 1.5, dur: 34, size: 4, path: makeDriftPath(-8, 14, -6) },
    { left: '35%', delay: 1.9, dur: 18, size: 3, path: makeDriftPath(12, -10, 8) },
    { left: '62%', delay: 2.3, dur: 30, size: 5, path: makeDriftPath(-6, 8, -10) },
    { left: '92%', delay: 2.7, dur: 25, size: 4, path: makeDriftPath(14, -12, 10) },
    { left: '20%', delay: 3.1, dur: 20, size: 3, path: makeDriftPath(-10, 10, -8) },
    { left: '50%', delay: 3.5, dur: 33, size: 6, path: makeDriftPath(8, -14, 6) },
    { left: '80%', delay: 3.9, dur: 24, size: 4, path: makeDriftPath(-12, 6, -10) },
];

function AtmosphereBubblesInner({
  blendedColor,
  colorLeft,
  colorRight,
  sliderValue = 50,
  className = '',
}: CardComponentProps) {
  const base = getAtmosphereBase({ blendedColor, colorLeft, colorRight }, '#67e8f9');
  const phase = getAtmospherePhase(sliderValue, 0.5);

  return (
    <AtmosphereContainer className={className}>
      {/* Capa de fondo suave */}
      <div
        className="absolute inset-0 opacity-25"
        style={{
          background: `linear-gradient(180deg, transparent 0%, ${base}12 40%, ${base}15 60%, transparent 100%)`,
        }}
      />

      {/* Burbujas ascendiendo */}
      {BUBBLES.map((bubble, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border"
          style={{
            left: bubble.left,
            bottom: '-4%',
            width: bubble.size,
            height: bubble.size,
            borderColor: base,
            borderWidth: 1,
            background: `radial-gradient(circle at 30% 30%, ${base}60, ${base}15)`,
            boxShadow: `0 0 10px ${base}50, inset 0 0 6px ${base}30`,
          }}
          animate={{
            y: ['0px', '-120px', '-250px', '-380px', '-480px'],
            x: bubble.path.map((px) => `${px}px`),
            opacity: [0, 0.8, 0.9, 0.8, 0],
            scale: [0.8, 1, 1, 1, 0.9],
          }}
          transition={{
            duration: bubble.dur + phase * 3,
            repeat: Infinity,
            ease: EASING_SOFT,
            delay: bubble.delay,
          }}
        />
      ))}
    </AtmosphereContainer>
  );
}

export const AtmosphereBubbles = memo(AtmosphereBubblesInner);
