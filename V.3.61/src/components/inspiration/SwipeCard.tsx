import { motion, useMotionValue, useTransform, type PanInfo } from 'framer-motion';
import { useState } from 'react';

export interface SwipeDirection {
  direction: 'left' | 'right' | 'up';
}

interface SwipeCardProps {
  children: React.ReactNode;
  onSwipe: (direction: SwipeDirection['direction']) => void;
  isTop: boolean;
  index: number;
}

const SWIPE_THRESHOLD = 120;
const SWIPE_UP_THRESHOLD = 100;
const EXIT_DISTANCE = 1000;

export function SwipeCard({ children, onSwipe, isTop, index }: SwipeCardProps) {
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | 'up' | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotate = useTransform(x, [-300, 0, 300], [-25, 0, 25]);
  const matchOpacity = useTransform(x, [0, 80, 160], [0, 0.5, 1]);
  const descartarOpacity = useTransform(x, [-160, -80, 0], [1, 0.5, 0]);
  const favoritoOpacity = useTransform(y, [-160, -80, 0], [1, 0.5, 0]);

  const scale = Math.max(1 - index * 0.05, 0.85);
  const yOffset = index * 8;

  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { offset, velocity } = info;

    if (offset.y < -SWIPE_UP_THRESHOLD && Math.abs(offset.y) > Math.abs(offset.x)) {
      setExitDirection('up');
      onSwipe('up');
      return;
    }

    if (offset.x > SWIPE_THRESHOLD || (velocity.x > 500 && offset.x > 40)) {
      setExitDirection('right');
      onSwipe('right');
      return;
    }

    if (offset.x < -SWIPE_THRESHOLD || (velocity.x < -500 && offset.x < -40)) {
      setExitDirection('left');
      onSwipe('left');
      return;
    }
  };

  const getExitAnimation = () => {
    if (!exitDirection) return {};
    switch (exitDirection) {
      case 'left':
        return { x: -EXIT_DISTANCE, rotate: -30, opacity: 0 };
      case 'right':
        return { x: EXIT_DISTANCE, rotate: 30, opacity: 0 };
      case 'up':
        return { y: -EXIT_DISTANCE, opacity: 0 };
    }
  };

  return (
    <motion.div
      className="absolute w-full h-full cursor-grab active:cursor-grabbing"
      style={{
        x: isTop ? x : 0,
        y: isTop ? y : yOffset,
        rotate: isTop ? rotate : 0,
        scale,
        zIndex: 50 - index,
      }}
      drag={isTop}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      dragElastic={0.9}
      onDragEnd={isTop ? handleDragEnd : undefined}
      animate={exitDirection ? getExitAnimation() : { scale, y: yOffset }}
      transition={
        exitDirection
          ? { duration: 0.4, ease: 'easeOut' }
          : { type: 'spring', stiffness: 300, damping: 25 }
      }
      whileDrag={{ scale: 1.02 }}
    >
      <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-600/50 select-none">
        {children}

        {isTop && (
                <motion.div
                  className="absolute top-6 left-6 z-20 pointer-events-none"
                  style={{ opacity: matchOpacity }}
                >
                  <div className="border-2 border-emerald-500/80 text-emerald-400 font-bold text-2xl px-4 py-2 rounded-xl -rotate-12 tracking-wider bg-emerald-500/10">
                    Match
                  </div>
                </motion.div>
              )}

              {isTop && (
                <motion.div
                  className="absolute top-6 right-6 z-20 pointer-events-none"
                  style={{ opacity: descartarOpacity }}
                >
                  <div className="border-2 border-red-500/80 text-red-400 font-bold text-2xl px-4 py-2 rounded-xl rotate-12 tracking-wider bg-red-500/10">
                    Descartar
                  </div>
                </motion.div>
              )}

              {isTop && (
                <motion.div
                  className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
                  style={{ opacity: favoritoOpacity }}
                >
                  <div className="border-2 border-amber-500/80 text-amber-400 font-bold text-xl px-4 py-2 rounded-xl tracking-wider whitespace-nowrap bg-amber-500/10">
                    SuperMatch
                  </div>
                </motion.div>
              )}
      </div>
    </motion.div>
  );
}
