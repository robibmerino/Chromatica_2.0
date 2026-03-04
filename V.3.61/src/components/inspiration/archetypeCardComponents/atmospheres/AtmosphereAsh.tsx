import { memo } from 'react';
import { motion } from 'framer-motion';
import { AtmosphereContainer } from './AtmosphereContainer';
import { makeDriftPath } from './utils';
import { getAtmosphereBase, getAtmospherePhase } from './useAtmosphereBase';
import { EASING_SOFT } from './constants';
import type { CardComponentProps } from '../types';

const ASH_PARTICLES = [
    { left: '6%', delay: 0, dur: 20, size: 2.5, path: makeDriftPath(18, -10, 14) },
    { left: '18%', delay: 0.5, dur: 26, size: 3, path: makeDriftPath(-12, 16, -8) },
    { left: '32%', delay: 1.0, dur: 18, size: 2.5, path: makeDriftPath(10, -18, 12) },
    { left: '48%', delay: 1.5, dur: 30, size: 3, path: makeDriftPath(-14, 8, -12) },
    { left: '62%', delay: 2.0, dur: 22, size: 2.5, path: makeDriftPath(14, -12, 10) },
    { left: '76%', delay: 2.5, dur: 28, size: 3, path: makeDriftPath(-8, 14, -16) },
    { left: '90%', delay: 3.0, dur: 19, size: 2.5, path: makeDriftPath(12, -14, 8) },
    { left: '12%', delay: 3.5, dur: 24, size: 3, path: makeDriftPath(-16, 10, -10) },
    { left: '28%', delay: 0.25, dur: 16, size: 2.5, path: makeDriftPath(8, -20, 14) },
    { left: '44%', delay: 0.75, dur: 32, size: 3, path: makeDriftPath(-10, 12, -14) },
    { left: '58%', delay: 1.25, dur: 21, size: 2.5, path: makeDriftPath(16, -8, 12) },
    { left: '72%', delay: 1.75, dur: 27, size: 3, path: makeDriftPath(-14, 18, -6) },
    { left: '86%', delay: 2.25, dur: 17, size: 2.5, path: makeDriftPath(10, -16, 16) },
    { left: '8%', delay: 2.75, dur: 29, size: 3, path: makeDriftPath(-18, 6, -12) },
    { left: '24%', delay: 3.25, dur: 20, size: 2.5, path: makeDriftPath(14, -10, 8) },
    { left: '40%', delay: 3.75, dur: 25, size: 3, path: makeDriftPath(-8, 14, -18) },
    { left: '54%', delay: 0.1, dur: 15, size: 2.5, path: makeDriftPath(12, -14, 10) },
    { left: '68%', delay: 0.6, dur: 31, size: 3, path: makeDriftPath(-12, 16, -8) },
    { left: '82%', delay: 1.1, dur: 23, size: 2.5, path: makeDriftPath(8, -18, 14) },
    { left: '96%', delay: 1.6, dur: 19, size: 3, path: makeDriftPath(-14, 10, -10) },
    { left: '14%', delay: 2.1, dur: 28, size: 2.5, path: makeDriftPath(16, -12, 6) },
    { left: '36%', delay: 2.6, dur: 14, size: 3, path: makeDriftPath(-10, 18, -14) },
    { left: '52%', delay: 3.1, dur: 26, size: 2.5, path: makeDriftPath(10, -8, 12) },
    { left: '66%', delay: 3.6, dur: 22, size: 3, path: makeDriftPath(-16, 12, -8) },
    { left: '80%', delay: 0.15, dur: 18, size: 2.5, path: makeDriftPath(14, -16, 10) },
    { left: '94%', delay: 0.65, dur: 30, size: 3, path: makeDriftPath(-8, 14, -12) },
    { left: '10%', delay: 1.15, dur: 24, size: 2.5, path: makeDriftPath(12, -10, 16) },
    { left: '30%', delay: 1.65, dur: 17, size: 3, path: makeDriftPath(-18, 8, -10) },
    { left: '50%', delay: 2.15, dur: 29, size: 2.5, path: makeDriftPath(8, -14, 12) },
    { left: '70%', delay: 2.65, dur: 21, size: 3, path: makeDriftPath(-12, 16, -14) },
];

function AtmosphereAshInner({
  blendedColor,
  colorLeft,
  colorRight,
  sliderValue = 50,
  className = '',
}: CardComponentProps) {
  const base = getAtmosphereBase({ blendedColor, colorLeft, colorRight }, '#f97316');
  const phase = getAtmospherePhase(sliderValue, 0.5);

  return (
    <AtmosphereContainer className={className}>
      {/* Brillo difuso inferior (sin óvalo central, distinto a Órbita) */}
      <div
        className="absolute inset-0 opacity-15"
        style={{
          background: `linear-gradient(180deg, transparent 0%, ${base}20 60%, ${base}30 100%)`,
        }}
      />

      {/* Partículas de ceniza cayendo — más visibles y dispersas */}
      {ASH_PARTICLES.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: p.left,
            top: '-2%',
            width: p.size,
            height: p.size,
            background: base,
            boxShadow: `0 0 6px ${base}70`,
          }}
          animate={{
            y: ['0px', '100px', '250px', '400px', '480px'],
            x: p.path.map((px) => `${px}px`),
            opacity: [0, 0.85, 0.9, 0.7, 0],
          }}
          transition={{
            duration: p.dur + phase * 4,
            repeat: Infinity,
            ease: EASING_SOFT,
            delay: p.delay,
          }}
        />
      ))}
    </AtmosphereContainer>
  );
}

export const AtmosphereAsh = memo(AtmosphereAshInner);
