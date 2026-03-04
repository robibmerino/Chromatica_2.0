import { memo } from 'react';
import { motion } from 'framer-motion';
import { AtmosphereContainer } from './AtmosphereContainer';
import { getAtmosphereBase, getAtmospherePhase } from './useAtmosphereBase';
import { hexWithAlpha } from './utils';
import { EASING_SMOOTH, EASING_SOFT } from './constants';
import type { CardComponentProps } from '../types';

const CENIT_RAYS = [
  { angle: -26, swing: 2.5, width: 4, intensity: 0.4, delay: 0, dur: 22, xDrift: 2 },
  { angle: -18, swing: 3, width: 14, intensity: 0.9, delay: 2.5, dur: 18, xDrift: -3 },
  { angle: -8, swing: 2, width: 7, intensity: 0.6, delay: 1.2, dur: 24, xDrift: 1 },
  { angle: 0, swing: 3.5, width: 18, intensity: 1, delay: 0.5, dur: 16, xDrift: -2 },
  { angle: 8, swing: 2, width: 6, intensity: 0.5, delay: 3.0, dur: 26, xDrift: 2 },
  { angle: 18, swing: 2.5, width: 12, intensity: 0.75, delay: 1.8, dur: 20, xDrift: -1 },
  { angle: 26, swing: 3, width: 5, intensity: 0.45, delay: 2.2, dur: 23, xDrift: 1 },
  { angle: -24, swing: 2, width: 9, intensity: 0.65, delay: 0.8, dur: 19, xDrift: -2 },
  { angle: 24, swing: 2.5, width: 11, intensity: 0.7, delay: 1.5, dur: 21, xDrift: 2 },
  { angle: -12, swing: 3, width: 3, intensity: 0.35, delay: 2.8, dur: 28, xDrift: -1 },
  { angle: 12, swing: 2, width: 8, intensity: 0.55, delay: 0.3, dur: 17, xDrift: 1 },
];

function AtmosphereRaysInner({
  blendedColor,
  colorLeft,
  colorRight,
  sliderValue = 50,
  className = '',
}: CardComponentProps) {
  const base = getAtmosphereBase({ blendedColor, colorLeft, colorRight }, '#fcd34d');
  const phase = getAtmospherePhase(sliderValue, 0.8);

  return (
    <AtmosphereContainer layout="start" className={className}>
      {CENIT_RAYS.slice(0, 6).map((ray, i) => (
        <motion.div
          key={`soft-${i}`}
          className="absolute left-1/2 origin-top"
          style={{
            top: '-100%',
            width: ray.width * 1.8,
            height: '320%',
            transform: `translateX(-50%) rotate(${ray.angle}deg)`,
            transformOrigin: '50% 0%',
            background: `linear-gradient(180deg, transparent 0%, ${hexWithAlpha(base, ray.intensity * 25)} 15%, ${base}08 45%, transparent 85%)`,
          }}
          animate={{
            opacity: [0.15, 0.4, 0.15],
            rotate: [ray.angle - ray.swing * 0.4, ray.angle + ray.swing * 0.4, ray.angle - ray.swing * 0.4],
            x: [0, ray.xDrift, -ray.xDrift * 0.5, 0],
          }}
          transition={{
            duration: ray.dur + 6 + phase * 3,
            repeat: Infinity,
            ease: EASING_SOFT,
            delay: ray.delay + i * 0.8 + 2,
          }}
        />
      ))}

      {CENIT_RAYS.map((ray, i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 origin-top"
          style={{
            top: '-120%',
            width: ray.width,
            height: '340%',
            transform: `translateX(-50%) rotate(${ray.angle}deg)`,
            transformOrigin: '50% 0%',
            background: `linear-gradient(180deg, transparent 0%, ${hexWithAlpha(base, 55 * ray.intensity * 0.3)} 8%, ${hexWithAlpha(base, 55 * ray.intensity)} 22%, ${hexWithAlpha(base, 28 * ray.intensity)} 45%, ${hexWithAlpha(base, 12 * ray.intensity)} 70%, transparent 100%)`,
          }}
          animate={{
            opacity: [0.25 + ray.intensity * 0.2, 0.5 + ray.intensity * 0.45, 0.25 + ray.intensity * 0.2],
            rotate: [ray.angle - ray.swing, ray.angle + ray.swing, ray.angle - ray.swing],
            scaleY: [0.97, 1.03, 0.97],
            x: [0, ray.xDrift, -ray.xDrift, 0],
          }}
          transition={{
            duration: ray.dur + phase * 3,
            repeat: Infinity,
            ease: EASING_SOFT,
            delay: ray.delay + i * 0.3,
          }}
        />
      ))}

      <motion.div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, ${base}12 0%, transparent 25%, transparent 75%, ${base}06 100%)`,
        }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{
          duration: 14 + phase * 2,
          repeat: Infinity,
          ease: EASING_SMOOTH,
          delay: 1,
        }}
      />
    </AtmosphereContainer>
  );
}

export const AtmosphereRays = memo(AtmosphereRaysInner);
