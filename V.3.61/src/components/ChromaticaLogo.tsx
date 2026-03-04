import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface ChromaticaLogoProps {
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  showSubtitle?: boolean;
}

export default function ChromaticaLogo({ size = 'md', onClick, showSubtitle = false }: ChromaticaLogoProps) {
  const [colorPhase, setColorPhase] = useState<number>(0);
  const animationRef = useRef<number | null>(null);

  // Fluid color animation using requestAnimationFrame
  useEffect(() => {
    let startTime: number | null = null;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      
      // Very slow, organic color cycling (30 seconds per full cycle)
      setColorPhase((elapsed / 30000) * Math.PI * 2);
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Generate organic, flowing colors
  const getGradientColors = () => {
    const colors = [];
    for (let i = 0; i < 5; i++) {
      const offset = i * 0.4;
      const hue = (
        (Math.sin(colorPhase + offset) * 60) + 
        (Math.sin(colorPhase * 0.7 + offset * 1.3) * 40) + 
        (Math.sin(colorPhase * 0.5 + offset * 0.8) * 30) + 
        200
      ) % 360;
      const sat = 75 + Math.sin(colorPhase * 0.3 + offset) * 15;
      const light = 60 + Math.sin(colorPhase * 0.5 + offset * 1.2) * 10;
      colors.push(`hsl(${hue}, ${sat}%, ${light}%)`);
    }
    return colors;
  };

  const gradientColors = getGradientColors();

  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl'
  };

  const subtitleSizes = {
    sm: 'text-[8px] tracking-[0.15em]',
    md: 'text-[10px] tracking-[0.2em]',
    lg: 'text-xs tracking-[0.25em]'
  };

  return (
    <motion.button
      onClick={onClick}
      whileHover={onClick ? { scale: 1.02 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      className={`flex flex-col items-start ${onClick ? 'cursor-pointer' : 'cursor-default'}`}
    >
      <div className={`${sizeClasses[size]} font-black flex items-baseline`}>
        <span className="text-white">chrom</span>
        <span
          className="bg-clip-text text-transparent transition-all duration-1000"
          style={{
            backgroundImage: `linear-gradient(90deg, ${gradientColors.join(', ')})`,
            backgroundSize: '200% 100%',
          }}
        >
          atica
        </span>
      </div>
      
      {showSubtitle && (
        <span className={`${subtitleSizes[size]} text-gray-400 uppercase font-light mt-0.5`}>
          Palette Studio
        </span>
      )}
    </motion.button>
  );
}
