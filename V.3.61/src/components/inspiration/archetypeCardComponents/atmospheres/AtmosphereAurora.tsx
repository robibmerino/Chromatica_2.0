import { memo, useId } from 'react';
import { motion } from 'framer-motion';
import { AtmosphereContainer } from './AtmosphereContainer';
import { getAtmosphereBase, getAtmospherePhase } from './useAtmosphereBase';
import { EASING_SOFT } from './constants';
import type { CardComponentProps } from '../types';

function AtmosphereAuroraInner({
  blendedColor,
  colorLeft,
  colorRight,
  sliderValue = 50,
  className = '',
}: CardComponentProps) {
  const base = getAtmosphereBase({ blendedColor, colorLeft, colorRight }, '#34d399');
  const gradId = `aurora-${useId().replace(/:/g, '-')}`;
  const phase = getAtmospherePhase(sliderValue, 0.5);

  return (
    <AtmosphereContainer layout="start" className={className}>
      <motion.svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute w-[140%] h-[95%] -left-[20%] -top-[5%]"
        animate={{ x: [0, 6, -4, 0], opacity: [0.75, 1, 0.75] }}
        transition={{
          duration: 10 + phase * 2,
          repeat: Infinity,
          ease: EASING_SOFT,
        }}
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={base} stopOpacity="0" />
            <stop offset="20%" stopColor={base} stopOpacity="0.35" />
            <stop offset="45%" stopColor={base} stopOpacity="0.7" />
            <stop offset="70%" stopColor={base} stopOpacity="0.5" />
            <stop offset="100%" stopColor={base} stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          d="M 0 0 L 35 0 L 35 100 Q 25 88, 15 98 Q 5 88, 0 100 Z"
          fill={`url(#${gradId})`}
          animate={{ opacity: [0.5, 0.95, 0.5], scaleY: [0.98, 1.02, 0.98], x: [0, 2, -1, 0] }}
          transition={{ duration: 6 + phase, repeat: Infinity, ease: EASING_SOFT, delay: 0 }}
          style={{ transformOrigin: '50% 0%' }}
        />
        <motion.path
          d="M 30 0 L 70 0 L 70 100 Q 55 85, 50 98 Q 45 85, 30 100 Z"
          fill={`url(#${gradId})`}
          animate={{ opacity: [0.6, 1, 0.6], scaleY: [0.97, 1.03, 0.97], x: [0, -2, 1, 0] }}
          transition={{ duration: 7 + phase * 1.2, repeat: Infinity, ease: EASING_SOFT, delay: 0.6 }}
          style={{ transformOrigin: '50% 0%' }}
        />
        <motion.path
          d="M 65 0 L 100 0 L 100 100 Q 85 88, 75 98 Q 65 88, 65 100 Z"
          fill={`url(#${gradId})`}
          animate={{ opacity: [0.5, 0.95, 0.5], scaleY: [0.98, 1.02, 0.98], x: [0, 1, -2, 0] }}
          transition={{ duration: 6.5 + phase, repeat: Infinity, ease: EASING_SOFT, delay: 1.2 }}
          style={{ transformOrigin: '50% 0%' }}
        />
      </motion.svg>

      <motion.div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(105deg, transparent 0%, ${base}08 30%, ${base}15 50%, ${base}08 70%, transparent 100%)`,
        }}
        animate={{ opacity: [0.3, 0.7, 0.3], x: ['-10%', '10%', '-10%'] }}
        transition={{
          duration: 12 + phase * 2,
          repeat: Infinity,
          ease: EASING_SOFT,
          delay: 2,
        }}
      />
    </AtmosphereContainer>
  );
}

export const AtmosphereAurora = memo(AtmosphereAuroraInner);
