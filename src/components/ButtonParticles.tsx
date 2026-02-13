import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  delay: number;
  duration: number;
  angle: number;
  distance: number;
  type: 'circle' | 'ring' | 'diamond' | 'dot';
}

interface ButtonParticlesProps {
  isHovered: boolean;
  color: string;
  count?: number;
  intensity?: 'light' | 'medium' | 'strong';
}

export default function ButtonParticles({ 
  isHovered, 
  color, 
  count = 12,
  intensity = 'light' 
}: ButtonParticlesProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  const intensityConfig = useMemo(() => ({
    light: { count: count, opacity: 0.4, sizeRange: [2, 5] },
    medium: { count: count * 1.5, opacity: 0.6, sizeRange: [3, 7] },
    strong: { count: count * 2, opacity: 0.8, sizeRange: [4, 9] }
  }), [count]);

  const config = intensityConfig[intensity];

  useEffect(() => {
    if (isHovered) {
      const newParticles: Particle[] = [];
      const types: Particle['type'][] = ['circle', 'ring', 'diamond', 'dot'];
      
      for (let i = 0; i < config.count; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: config.sizeRange[0] + Math.random() * (config.sizeRange[1] - config.sizeRange[0]),
          color,
          delay: Math.random() * 0.5,
          duration: 1.5 + Math.random() * 2,
          angle: Math.random() * 360,
          distance: 10 + Math.random() * 30,
          type: types[Math.floor(Math.random() * types.length)]
        });
      }
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [isHovered, color, config]);

  const renderParticle = (particle: Particle) => {
    const baseStyle = {
      left: `${particle.x}%`,
      top: `${particle.y}%`,
      width: particle.size,
      height: particle.size,
    };

    switch (particle.type) {
      case 'ring':
        return (
          <div
            style={{
              ...baseStyle,
              border: `1px solid ${particle.color}`,
              borderRadius: '50%',
            }}
          />
        );
      case 'diamond':
        return (
          <div
            style={{
              ...baseStyle,
              backgroundColor: particle.color,
              transform: 'rotate(45deg)',
            }}
          />
        );
      case 'dot':
        return (
          <div
            style={{
              ...baseStyle,
              backgroundColor: particle.color,
              borderRadius: '50%',
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
            }}
          />
        );
      default:
        return (
          <div
            style={{
              ...baseStyle,
              backgroundColor: particle.color,
              borderRadius: '50%',
            }}
          />
        );
    }
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
      <AnimatePresence>
        {particles.map((particle) => {
          const radians = (particle.angle * Math.PI) / 180;
          const moveX = Math.cos(radians) * particle.distance;
          const moveY = Math.sin(radians) * particle.distance;

          return (
            <motion.div
              key={particle.id}
              initial={{ 
                opacity: 0, 
                scale: 0,
                x: 0,
                y: 0
              }}
              animate={{ 
                opacity: [0, config.opacity, config.opacity, 0],
                scale: [0, 1.2, 1, 0.8],
                x: [0, moveX * 0.3, moveX * 0.7, moveX],
                y: [0, moveY * 0.3, moveY * 0.7, moveY],
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{
                duration: particle.duration,
                delay: particle.delay,
                repeat: Infinity,
                ease: "easeOut"
              }}
              className="absolute"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
              }}
            >
              {renderParticle(particle)}
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Subtle glow effect on hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.15 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse at center, ${color} 0%, transparent 70%)`,
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
