import { memo } from 'react';
import { motion } from 'framer-motion';
import { AtmosphereContainer } from './AtmosphereContainer';
import { makeDriftPath } from './utils';
import { getAtmosphereBase, getAtmospherePhase } from './useAtmosphereBase';
import { EASING_SOFT } from './constants';
import type { CardComponentProps } from '../types';

const FLAKES = [
    { left: '3%', delay: 0, dur: 18, size: 2, path: makeDriftPath(22, -14, 18) },
    { left: '12%', delay: 0.35, dur: 11, size: 3, path: makeDriftPath(-18, 12, -8) },
    { left: '22%', delay: 0.7, dur: 24, size: 2, path: makeDriftPath(8, -20, 15) },
    { left: '32%', delay: 1.05, dur: 14, size: 2, path: makeDriftPath(-12, 16, -10) },
    { left: '42%', delay: 1.4, dur: 20, size: 3, path: makeDriftPath(15, -9, 22) },
    { left: '52%', delay: 1.75, dur: 13, size: 2, path: makeDriftPath(-10, 20, -14) },
    { left: '62%', delay: 2.1, dur: 22, size: 2, path: makeDriftPath(18, -16, 6) },
    { left: '72%', delay: 2.45, dur: 16, size: 3, path: makeDriftPath(-14, 10, -18) },
    { left: '82%', delay: 2.8, dur: 19, size: 2, path: makeDriftPath(10, -22, 12) },
    { left: '92%', delay: 3.15, dur: 12, size: 2, path: makeDriftPath(-20, 14, -6) },
    { left: '7%', delay: 3.5, dur: 21, size: 2, path: makeDriftPath(14, -8, 20) },
    { left: '18%', delay: 3.85, dur: 15, size: 3, path: makeDriftPath(-16, 18, -12) },
    { left: '28%', delay: 0.2, dur: 10, size: 2, path: makeDriftPath(6, -12, 16) },
    { left: '38%', delay: 0.55, dur: 23, size: 2, path: makeDriftPath(-22, 8, -16) },
    { left: '48%', delay: 0.9, dur: 17, size: 3, path: makeDriftPath(20, -18, 10) },
    { left: '58%', delay: 1.25, dur: 12, size: 2, path: makeDriftPath(-8, 22, -20) },
    { left: '68%', delay: 1.6, dur: 25, size: 2, path: makeDriftPath(16, -10, 14) },
    { left: '78%', delay: 1.95, dur: 14, size: 2, path: makeDriftPath(-18, 6, -22) },
    { left: '88%', delay: 2.3, dur: 20, size: 3, path: makeDriftPath(12, -14, 8) },
    { left: '98%', delay: 2.65, dur: 11, size: 2, path: makeDriftPath(-12, 16, -10) },
    { left: '5%', delay: 3.0, dur: 19, size: 2, path: makeDriftPath(10, -20, 18) },
    { left: '15%', delay: 3.35, dur: 13, size: 2, path: makeDriftPath(-14, 12, -8) },
    { left: '25%', delay: 3.7, dur: 22, size: 3, path: makeDriftPath(18, -16, 6) },
    { left: '35%', delay: 0.1, dur: 16, size: 2, path: makeDriftPath(-6, 20, -14) },
    { left: '45%', delay: 0.45, dur: 9, size: 2, path: makeDriftPath(22, -8, 12) },
    { left: '55%', delay: 0.8, dur: 21, size: 2, path: makeDriftPath(-20, 14, -18) },
    { left: '65%', delay: 1.15, dur: 15, size: 3, path: makeDriftPath(8, -22, 10) },
    { left: '75%', delay: 1.5, dur: 11, size: 2, path: makeDriftPath(-10, 18, -12) },
    { left: '85%', delay: 1.85, dur: 24, size: 2, path: makeDriftPath(14, -12, 20) },
    { left: '95%', delay: 2.2, dur: 17, size: 2, path: makeDriftPath(-16, 10, -6) },
    { left: '8%', delay: 2.55, dur: 10, size: 2, path: makeDriftPath(6, -18, 16) },
    { left: '20%', delay: 2.9, dur: 23, size: 3, path: makeDriftPath(-22, 8, -16) },
    { left: '30%', delay: 3.25, dur: 14, size: 2, path: makeDriftPath(20, -14, 8) },
    { left: '40%', delay: 3.6, dur: 18, size: 2, path: makeDriftPath(-8, 22, -20) },
    { left: '50%', delay: 3.95, dur: 12, size: 2, path: makeDriftPath(16, -10, 14) },
    { left: '60%', delay: 0.25, dur: 26, size: 2, path: makeDriftPath(-12, 16, -8) },
    { left: '70%', delay: 0.6, dur: 15, size: 3, path: makeDriftPath(10, -20, 18) },
    { left: '80%', delay: 0.95, dur: 20, size: 2, path: makeDriftPath(-18, 6, -14) },
    { left: '90%', delay: 1.3, dur: 13, size: 2, path: makeDriftPath(22, -16, 12) },
];

function AtmosphereSnowInner({
  blendedColor,
  colorLeft,
  colorRight,
  sliderValue = 50,
  className = '',
}: CardComponentProps) {
  const base = getAtmosphereBase({ blendedColor, colorLeft, colorRight }, '#e0f2fe');
  const phase = getAtmospherePhase(sliderValue, 0.5);

  return (
    <AtmosphereContainer className={className}>
      {/* Capa de niebla suave de nieve */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `linear-gradient(180deg, ${base}18 0%, transparent 25%, transparent 75%, ${base}12 100%)`,
        }}
      />

      {/* Copos cayendo con trayectoria ondulante y velocidades variadas */}
      {FLAKES.map((flake, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: flake.left,
            top: '-3%',
            width: flake.size,
            height: flake.size,
            background: base,
            boxShadow: `0 0 8px ${base}90`,
          }}
          animate={{
            y: ['0px', '120px', '250px', '380px', '450px'],
            x: flake.path.map((px) => `${px}px`),
            opacity: [0, 0.85, 0.9, 0.85, 0],
          }}
          transition={{
            duration: flake.dur + phase * 3,
            repeat: Infinity,
            ease: EASING_SOFT,
            delay: flake.delay,
          }}
        />
      ))}
    </AtmosphereContainer>
  );
}

export const AtmosphereSnow = memo(AtmosphereSnowInner);
