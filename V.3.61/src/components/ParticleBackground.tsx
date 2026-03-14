import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  speed: number;
  hueOffset: number;
  type: 'circle' | 'ring' | 'dot' | 'star' | 'diamond';
  moveAngle: number;
  moveDistance: number;
  wobbleIntensity: number;
  wobbleSpeed: number;
}

interface Orb {
  id: number;
  x: number;
  y: number;
  size: number;
  hueOffset: number;
  speed: number;
}

interface ParticleBackgroundProps {
  /** Número de partículas (por defecto 120 para no sobrecargar en páginas secundarias). */
  particleCount?: number;
  /** Si se muestran los orbes de fondo (blur grande). Por defecto true. */
  showOrbs?: boolean;
  /** Escala de opacidad de partículas (0–1). Por defecto 0.85 para fondos con contenido encima. */
  opacityScale?: number;
}

export function ParticleBackground({
  particleCount = 120,
  showOrbs = true,
  opacityScale = 0.85,
}: ParticleBackgroundProps) {
  const [time, setTime] = useState(0);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [orbs, setOrbs] = useState<Orb[]>([]);

  useEffect(() => {
    let animationId: number;
    const animate = () => {
      setTime((t) => t + 0.005);
      animationId = requestAnimationFrame(animate);
    };
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  useEffect(() => {
    const types: Array<Particle['type']> = ['circle', 'ring', 'dot', 'star', 'diamond'];
    const newParticles: Particle[] = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 12 + 2,
      delay: Math.random() * 12,
      speed: Math.random() * 4 + 2,
      hueOffset: Math.random() * 360,
      type: types[Math.floor(Math.random() * types.length)],
      moveAngle: Math.random() * 360,
      moveDistance: Math.random() * 80 + 30,
      wobbleIntensity: Math.random() * 40 + 10,
      wobbleSpeed: Math.random() * 2 + 1,
    }));
    setParticles(newParticles);

    if (showOrbs) {
      const newOrbs: Orb[] = Array.from({ length: 6 }, (_, i) => ({
        id: i,
        x: 20 + Math.random() * 60,
        y: 20 + Math.random() * 60,
        size: 200 + Math.random() * 300,
        hueOffset: i * 60,
        speed: 0.5 + Math.random() * 0.5,
      }));
      setOrbs(newOrbs);
    }
  }, [particleCount, showOrbs]);

  const getOrganicHue = (offset: number = 0, speed: number = 1) => {
    const base = Math.sin(time * speed) * 180 + 180;
    const variation = Math.sin(time * speed * 0.7 + 2) * 30;
    return (base + variation + offset) % 360;
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {/* Gradiente base suave */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 120% 100% at 50% 100%, 
              hsla(${getOrganicHue(200, 0.2)}, 40%, 8%, 0.6) 0%, 
              transparent 70%
            ),
            radial-gradient(ellipse 100% 80% at 50% 0%, 
              hsla(${getOrganicHue(280, 0.2)}, 30%, 6%, 0.5) 0%, 
              transparent 60%
            )
          `,
        }}
      />

      {/* Orbes de profundidad */}
      {showOrbs &&
        orbs.map((orb) => {
          const hue = getOrganicHue(orb.hueOffset, orb.speed * 0.2);
          return (
            <motion.div
              key={orb.id}
              className="absolute rounded-full"
              style={{
                left: `${orb.x}%`,
                top: `${orb.y}%`,
                width: orb.size,
                height: orb.size,
                background: `radial-gradient(circle, hsla(${hue}, 60%, 50%, 0.12) 0%, transparent 70%)`,
                transform: 'translate(-50%, -50%)',
                filter: 'blur(40px)',
              }}
              animate={{
                x: [0, 30 * Math.sin(orb.id), -20 * Math.cos(orb.id), 0],
                y: [0, -20 * Math.cos(orb.id), 30 * Math.sin(orb.id), 0],
                scale: [1, 1.1, 0.95, 1],
              }}
              transition={{
                duration: 15 + orb.speed * 10,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          );
        })}

      {/* Partículas flotantes */}
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => {
          const hue = getOrganicHue(particle.hueOffset, 0.2);
          const baseOpacity =
            particle.type === 'dot'
              ? 0.8
              : particle.type === 'ring'
                ? 0.5
                : particle.type === 'star'
                  ? 0.7
                  : 0.6;
          const opacity = baseOpacity * opacityScale;

          const angleRad = (particle.moveAngle * Math.PI) / 180;
          const moveX = Math.cos(angleRad) * particle.moveDistance;
          const moveY = Math.sin(angleRad) * particle.moveDistance;
          const wobbleX = Math.sin(angleRad + Math.PI / 2) * particle.wobbleIntensity;
          const wobbleY = Math.cos(angleRad + Math.PI / 2) * particle.wobbleIntensity;

          const getParticleStyle = (): React.CSSProperties => {
            switch (particle.type) {
              case 'ring':
                return {
                  background: 'transparent',
                  border: `1.5px solid hsla(${hue}, 75%, 65%, ${opacity})`,
                  borderRadius: '50%',
                  boxShadow: 'none',
                };
              case 'dot':
                return {
                  background: `hsla(${hue}, 85%, 70%, ${opacity})`,
                  borderRadius: '50%',
                  border: 'none',
                  boxShadow: `0 0 ${particle.size * 2}px hsla(${hue}, 80%, 60%, ${0.6 * opacityScale})`,
                };
              case 'star':
                return {
                  background: `hsla(${hue}, 80%, 75%, ${opacity})`,
                  borderRadius: '2px',
                  border: 'none',
                  boxShadow: `0 0 ${particle.size}px hsla(${hue}, 80%, 65%, ${0.4 * opacityScale})`,
                };
              case 'diamond':
                return {
                  background: `hsla(${hue}, 70%, 65%, ${opacity})`,
                  borderRadius: '2px',
                  border: 'none',
                  boxShadow: 'none',
                };
              default:
                return {
                  background: `hsla(${hue}, 75%, 65%, ${opacity})`,
                  borderRadius: '50%',
                  border: 'none',
                  boxShadow: 'none',
                };
            }
          };

          return (
            <motion.div
              key={particle.id}
              className="absolute"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: particle.size,
                height: particle.size,
                ...getParticleStyle(),
                transform: particle.type === 'diamond' ? 'rotate(45deg)' : undefined,
              }}
              animate={{
                x: [0, moveX * 0.5 + wobbleX, moveX - wobbleX * 0.5, moveX * 0.3 + wobbleX * 0.7, 0],
                y: [0, moveY * 0.5 + wobbleY, moveY - wobbleY * 0.5, moveY * 0.3 + wobbleY * 0.7, 0],
                opacity: [opacity * 0.4, opacity, opacity * 0.7, opacity * 0.9, opacity * 0.4],
                scale: [0.7, 1.1, 0.9, 1.2, 0.7],
                rotate:
                  particle.type === 'ring'
                    ? [0, 180, 360]
                    : particle.type === 'diamond'
                      ? [45, 135, 225, 315, 405]
                      : particle.type === 'star'
                        ? [0, 90, 180, 270, 360]
                        : 0,
              }}
              transition={{
                duration: particle.speed * particle.wobbleSpeed + 4,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: particle.delay,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
