import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import { ChromaticaSymbolLogo } from './ChromaticaSymbolLogo';
import {
  CHROMATICA_BRAND_COLOR_COUNT,
  SPLASH_BRAND_STOPS_ATICA,
  SPLASH_BRAND_STOPS_COMENZAR,
  linearBrandGradient90,
} from '../lib/chromaticaBrandColors';

/** Velocidad de la rueda cromática (fase/s) compartida logo + «atica» + CTA. */
const SPLASH_BRAND_PHASE_SPEED = 0.22;

const SPLASH_LOGO_WRAP_CLASS =
  'mb-0 -mb-4 sm:-mb-5 md:-mb-7 lg:-mb-9 block drop-shadow-[0_0_28px_rgba(43,176,200,0.28)] [&_svg]:w-[9rem] [&_svg]:h-[9rem] sm:[&_svg]:w-[10.75rem] sm:[&_svg]:h-[10.75rem] md:[&_svg]:w-[12.25rem] md:[&_svg]:h-[12.25rem] lg:[&_svg]:w-[14rem] lg:[&_svg]:h-[14rem]';

interface SplashScreenProps {
  onEnter: () => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  speed: number;
  hueOffset: number;
  type: 'circle' | 'ring' | 'dot' | 'star' | 'diamond';
  // Direcciones orgánicas únicas
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

export const SplashScreen = ({ onEnter }: SplashScreenProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [orbs, setOrbs] = useState<Orb[]>([]);
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);
  
  // Smooth mouse position with springs
  const mouseX = useSpring(0.5, { stiffness: 50, damping: 20 });
  const mouseY = useSpring(0.5, { stiffness: 50, damping: 20 });
  
  /** Fase cromática compartida: logo geométrico + título (misma paleta que el símbolo). */
  const [brandPhase, setBrandPhase] = useState(0);

  const { aticaBrandGradient, comenzarBrandGradient } = useMemo(
    () => ({
      aticaBrandGradient: linearBrandGradient90(brandPhase, SPLASH_BRAND_STOPS_ATICA),
      comenzarBrandGradient: linearBrandGradient90(brandPhase, SPLASH_BRAND_STOPS_COMENZAR),
    }),
    [brandPhase],
  );

  // Organic color phase using sine waves for smooth transitions
  const [time, setTime] = useState(0);
  
  // Animate time continuously
  useEffect(() => {
    let animationId: number;
    const animate = () => {
      setTime(t => t + 0.005); // Very slow increment for organic feel
      animationId = requestAnimationFrame(animate);
    };
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Rueda de marca (logo + “atica”) en sincronía
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const tick = (ts: number) => {
      const dt = (ts - last) / 1000;
      last = ts;
      setBrandPhase((p) => (p + SPLASH_BRAND_PHASE_SPEED * dt) % CHROMATICA_BRAND_COLOR_COUNT);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Generate particles on mount - más cantidad, variedad y movimientos orgánicos
  useEffect(() => {
    const types: Array<'circle' | 'ring' | 'dot' | 'star' | 'diamond'> = ['circle', 'ring', 'dot', 'star', 'diamond'];
    const newParticles: Particle[] = Array.from({ length: 180 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 14 + 2, // Más variedad: 2-16px
      delay: Math.random() * 12,
      speed: Math.random() * 4 + 2,
      hueOffset: Math.random() * 360,
      type: types[Math.floor(Math.random() * types.length)],
      // Cada partícula tiene su propia dirección y comportamiento
      moveAngle: Math.random() * 360, // Ángulo de movimiento único
      moveDistance: Math.random() * 80 + 30, // Distancia de movimiento: 30-110px
      wobbleIntensity: Math.random() * 40 + 10, // Intensidad del zigzag: 10-50
      wobbleSpeed: Math.random() * 2 + 1, // Velocidad del zigzag
    }));
    setParticles(newParticles);

    // Generate larger orbs for depth
    const newOrbs: Orb[] = Array.from({ length: 6 }, (_, i) => ({
      id: i,
      x: 20 + Math.random() * 60,
      y: 20 + Math.random() * 60,
      size: 200 + Math.random() * 300,
      hueOffset: i * 60,
      speed: 0.5 + Math.random() * 0.5
    }));
    setOrbs(newOrbs);
  }, []);

  // Handle mouse move with smooth spring animation
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width);
    mouseY.set((e.clientY - rect.top) / rect.height);
  }, [mouseX, mouseY]);

  // Create ripple on click
  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const newRipple = { id: Date.now(), x, y };
    setRipples(prev => [...prev, newRipple]);
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== newRipple.id));
    }, 2000);
  };

  // Organic color generation using multiple sine waves
  const getOrganicHue = (offset: number = 0, speed: number = 1) => {
    const base = Math.sin(time * speed) * 180 + 180;
    const variation = Math.sin(time * speed * 0.7 + 2) * 30;
    return (base + variation + offset) % 360;
  };

  // Transform mouse position to background effect
  const bgX = useTransform(mouseX, [0, 1], [0, 100]);
  const bgY = useTransform(mouseY, [0, 1], [0, 100]);

  return (
    <AnimatePresence>
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden cursor-crosshair"
        style={{ background: '#08080c' }}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
      >
        {/* Base gradient - darker warm tones */}
        <div 
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(ellipse 120% 100% at 50% 100%, 
                hsla(${getOrganicHue(200, 0.2)}, 40%, 8%, 1) 0%, 
                transparent 70%
              ),
              radial-gradient(ellipse 100% 80% at 50% 0%, 
                hsla(${getOrganicHue(280, 0.2)}, 30%, 6%, 1) 0%, 
                transparent 60%
              )
            `
          }}
        />

        {/* Large floating orbs for depth and color */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {orbs.map((orb) => {
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
                  background: `radial-gradient(circle, hsla(${hue}, 60%, 50%, 0.15) 0%, transparent 70%)`,
                  transform: 'translate(-50%, -50%)',
                  filter: 'blur(40px)'
                }}
                animate={{
                  x: [0, 30 * Math.sin(orb.id), -20 * Math.cos(orb.id), 0],
                  y: [0, -20 * Math.cos(orb.id), 30 * Math.sin(orb.id), 0],
                  scale: [1, 1.1, 0.95, 1]
                }}
                transition={{
                  duration: 15 + orb.speed * 10,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            );
          })}
        </div>

        {/* Interactive glow following cursor - more intense */}
        <motion.div
          className="absolute pointer-events-none"
          style={{
            width: 600,
            height: 600,
            x: useTransform(bgX, v => `calc(${v}% - 300px)`),
            y: useTransform(bgY, v => `calc(${v}% - 300px)`),
            background: `
              radial-gradient(circle, 
                hsla(${getOrganicHue(0, 0.3)}, 70%, 55%, 0.2) 0%, 
                hsla(${getOrganicHue(60, 0.3)}, 60%, 50%, 0.1) 30%,
                transparent 70%
              )
            `,
            filter: 'blur(60px)'
          }}
        />

        {/* Secondary cursor glow */}
        <motion.div
          className="absolute pointer-events-none"
          style={{
            width: 300,
            height: 300,
            x: useTransform(bgX, v => `calc(${v}% - 150px)`),
            y: useTransform(bgY, v => `calc(${v}% - 150px)`),
            background: `radial-gradient(circle, hsla(${getOrganicHue(120, 0.4)}, 80%, 60%, 0.25) 0%, transparent 60%)`,
            filter: 'blur(30px)'
          }}
        />

        {/* Click ripples */}
        {ripples.map(ripple => (
          <motion.div
            key={ripple.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: `${ripple.x}%`,
              top: `${ripple.y}%`,
              transform: 'translate(-50%, -50%)',
              border: `2px solid hsla(${getOrganicHue(0, 0.3)}, 70%, 60%, 0.5)`
            }}
            initial={{ width: 0, height: 0, opacity: 1 }}
            animate={{ width: 400, height: 400, opacity: 0 }}
            transition={{ duration: 2, ease: "easeOut" }}
          />
        ))}

        {/* Floating particles - más cantidad, variedad y movimientos orgánicos */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((particle) => {
            const hue = getOrganicHue(particle.hueOffset, 0.2);
            const opacity = particle.type === 'dot' ? 0.8 : particle.type === 'ring' ? 0.5 : particle.type === 'star' ? 0.7 : 0.6;
            
            // Calcular movimientos basados en el ángulo único de cada partícula
            const angleRad = (particle.moveAngle * Math.PI) / 180;
            const moveX = Math.cos(angleRad) * particle.moveDistance;
            const moveY = Math.sin(angleRad) * particle.moveDistance;
            const wobbleX = Math.sin(angleRad + Math.PI/2) * particle.wobbleIntensity;
            const wobbleY = Math.cos(angleRad + Math.PI/2) * particle.wobbleIntensity;
            
            // Estilos según el tipo
            const getParticleStyle = () => {
              switch(particle.type) {
                case 'ring':
                  return {
                    background: 'transparent',
                    border: `1.5px solid hsla(${hue}, 75%, 65%, ${opacity})`,
                    borderRadius: '50%',
                    boxShadow: 'none'
                  };
                case 'dot':
                  return {
                    background: `hsla(${hue}, 85%, 70%, ${opacity})`,
                    borderRadius: '50%',
                    border: 'none',
                    boxShadow: `0 0 ${particle.size * 2}px hsla(${hue}, 80%, 60%, 0.6)`
                  };
                case 'star':
                  return {
                    background: `hsla(${hue}, 80%, 75%, ${opacity})`,
                    borderRadius: '2px',
                    border: 'none',
                    boxShadow: `0 0 ${particle.size}px hsla(${hue}, 80%, 65%, 0.4)`
                  };
                case 'diamond':
                  return {
                    background: `hsla(${hue}, 70%, 65%, ${opacity})`,
                    borderRadius: '2px',
                    border: 'none',
                    boxShadow: 'none'
                  };
                default:
                  return {
                    background: `hsla(${hue}, 75%, 65%, ${opacity})`,
                    borderRadius: '50%',
                    border: 'none',
                    boxShadow: 'none'
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
                  transform: particle.type === 'diamond' ? 'rotate(45deg)' : undefined
                }}
                animate={{
                  // Movimiento principal en dirección única + zigzag perpendicular
                  x: [0, moveX * 0.5 + wobbleX, moveX - wobbleX * 0.5, moveX * 0.3 + wobbleX * 0.7, 0],
                  y: [0, moveY * 0.5 + wobbleY, moveY - wobbleY * 0.5, moveY * 0.3 + wobbleY * 0.7, 0],
                  opacity: [opacity * 0.4, opacity, opacity * 0.7, opacity * 0.9, opacity * 0.4],
                  scale: [0.7, 1.1, 0.9, 1.2, 0.7],
                  rotate: particle.type === 'ring' 
                    ? [0, 180, 360] 
                    : particle.type === 'diamond' 
                      ? [45, 135, 225, 315, 405] 
                      : particle.type === 'star'
                        ? [0, 90, 180, 270, 360]
                        : 0
                }}
                transition={{
                  duration: particle.speed * particle.wobbleSpeed + 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: particle.delay
                }}
              />
            );
          })}
        </div>

        {/* Shooting particles - occasional streaks */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[0, 1, 2, 3, 4].map(i => (
            <motion.div
              key={`streak-${i}`}
              className="absolute h-px"
              style={{
                width: 100 + Math.random() * 100,
                background: `linear-gradient(90deg, transparent, hsla(${getOrganicHue(i * 72, 0.3)}, 80%, 70%, 0.6), transparent)`,
                top: `${10 + i * 20}%`,
                left: '-200px'
              }}
              animate={{
                x: ['0vw', '120vw'],
                opacity: [0, 1, 1, 0]
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                repeatDelay: 5 + i * 3,
                ease: "easeInOut",
                delay: i * 2
              }}
            />
          ))}
        </div>

        {/* Main content */}
        <div className="relative z-10 flex flex-col items-center">
          {/* Marca + título + subtítulo: translateY sube el grupo sin desplazar el botón (el hueco en flujo se conserva) */}
          <div className="flex flex-col items-center -translate-y-10 sm:-translate-y-12 md:-translate-y-16 lg:-translate-y-20">
            {/* Marca + título */}
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
              className="flex flex-col items-center"
            >
              <div className={SPLASH_LOGO_WRAP_CLASS}>
                <ChromaticaSymbolLogo phase={brandPhase} size={224} className="block" />
              </div>
              <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tight leading-none select-none">
                <span className="text-white drop-shadow-lg">chrom</span>
                <motion.span
                  className="bg-clip-text text-transparent inline"
                  style={{
                    backgroundImage: aticaBrandGradient,
                    backgroundSize: '200% 100%',
                  }}
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                >
                  atica
                </motion.span>
              </h1>
            </motion.div>

            {/* Línea fina entre el título y el subtítulo */}
            <motion.div
              initial={{ scaleX: 0.3, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.85, delay: 0.42, ease: 'easeOut' }}
              className="mt-3 mb-2 h-px w-36 max-w-[min(18rem,85vw)] origin-center rounded-full opacity-90 sm:mt-4 sm:mb-3 sm:w-44 md:w-52"
              style={{ background: aticaBrandGradient }}
              aria-hidden={true}
            />

            {/* Subtitle */}
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-gray-400 text-base sm:text-lg md:text-xl tracking-[0.35em] uppercase mb-10 font-light"
            >
              Palette Studio
            </motion.p>
          </div>

          {/* Enter button — cristal + borde con degradado de marca */}
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            type="button"
            onClick={onEnter}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => { setIsHovering(false); setIsButtonPressed(false); }}
            onMouseDown={() => setIsButtonPressed(true)}
            onMouseUp={() => setIsButtonPressed(false)}
            className="group relative inline-flex cursor-pointer rounded-full border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#08080c]"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Halo suave al hover (acotado; antes invadía demasiado el lienzo) */}
            <motion.div
              className="pointer-events-none absolute -inset-2 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-35"
              style={{
                background: comenzarBrandGradient,
                filter: 'blur(12px)',
              }}
              animate={isHovering ? { scale: [1, 1.06, 1] } : {}}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {/*
              Cuerpo: solo vidrio (sin degradado). Borde: capa aparte con mask-composite para que
              backgroundPosition de Framer no mueva dos fondos a la vez (eso reintroducía el arcoíris dentro).
            */}
            <span className="relative inline-flex rounded-full shadow-[0_4px_18px_rgba(0,0,0,0.28)]">
              <span
                className="relative z-0 flex items-center justify-center overflow-hidden rounded-full px-10 py-4 sm:px-14 sm:py-5"
                style={{
                  backgroundColor: 'rgba(8, 8, 12, 0.22)',
                  backdropFilter: 'blur(22px)',
                  WebkitBackdropFilter: 'blur(22px)',
                }}
              >
                <span
                  className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-b from-white/[0.1] via-transparent to-transparent shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
                  aria-hidden={true}
                />

                <motion.span
                  className="pointer-events-none absolute inset-0 rounded-full bg-black"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isButtonPressed ? 0.22 : 0 }}
                  transition={{ duration: 0.1 }}
                />

                <span className="relative z-10 flex items-center gap-3 text-base font-semibold tracking-wide text-white sm:text-lg">
                  <motion.span
                    animate={isHovering ? { x: -3 } : { x: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    Comenzar
                  </motion.span>
                  <motion.span
                    className="flex items-center"
                    animate={
                      isHovering
                        ? {
                            x: [0, 8, 0],
                            opacity: [1, 0.5, 1],
                          }
                        : { x: 0 }
                    }
                    transition={
                      isHovering
                        ? {
                            duration: 1,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }
                        : { duration: 0.2 }
                    }
                  >
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden={true}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </motion.span>
                </span>

                {isHovering && (
                  <span className="pointer-events-none absolute inset-0 z-10">
                    {[...Array(6)].map((_, i) => (
                      <motion.span
                        key={i}
                        className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full bg-white"
                        initial={{ x: 0, y: 0, opacity: 0 }}
                        animate={{
                          x: Math.cos((i * 60 * Math.PI) / 180) * 60,
                          y: Math.sin((i * 60 * Math.PI) / 180) * 30,
                          opacity: [0, 1, 0],
                          scale: [0, 1, 0.5],
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          delay: i * 0.1,
                          ease: 'easeOut',
                        }}
                      />
                    ))}
                  </span>
                )}
              </span>

              <motion.span
                aria-hidden
                className="pointer-events-none absolute inset-0 z-[1] rounded-full"
                style={{
                  padding: 2,
                  backgroundImage: comenzarBrandGradient,
                  backgroundSize: '200% 100%',
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  maskComposite: 'exclude',
                }}
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            </span>
          </motion.button>
        </div>

        {/* Ambient moving shapes in corners */}
        <motion.div
          className="absolute top-0 left-0 w-64 h-64 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 0% 0%, hsla(${getOrganicHue(240, 0.2)}, 50%, 40%, 0.2) 0%, transparent 60%)`,
            filter: 'blur(40px)'
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div
          className="absolute bottom-0 right-0 w-80 h-80 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 100% 100%, hsla(${getOrganicHue(320, 0.2)}, 50%, 40%, 0.2) 0%, transparent 60%)`,
            filter: 'blur(50px)'
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />

        {/* Logo colaborador — Neuroarquitectura (horizontal, PNG) */}
        <motion.a
          href="https://www.linkedin.com/company/laboratorio-de-neuroarquitectura-de-la-upv/posts/?feedView=all"
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.05 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="group absolute left-4 sm:left-6 bottom-10 sm:bottom-12 z-20 block cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-white/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[#08080c] rounded-sm"
          aria-label="Laboratorio de Neuroarquitectura de la UPV en LinkedIn"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src="/neuroarquitectura-logo-horizontal.png"
            alt=""
            className="w-auto max-w-[min(52vw,28rem)] sm:max-w-[34rem] h-[4.7rem] sm:h-[5.3rem] object-contain object-left object-bottom opacity-[0.78] transition-all duration-300 ease-out group-hover:opacity-100 group-hover:brightness-110 group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.18)]"
            draggable={false}
          />
        </motion.a>

        {/* Footer */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 text-gray-500 text-xs sm:text-sm"
        >
          <span className="opacity-50 font-mono">Beta V.1.06</span>
          <span className="opacity-20">|</span>
          <a
            href="https://www.linkedin.com/in/robi-b-merino"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-white transition-all duration-300 group"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="group-hover:tracking-wider transition-all duration-300">Feedback</span>
            <motion.svg 
              className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-all duration-300"
              viewBox="0 0 24 24" 
              fill="currentColor"
              whileHover={{ scale: 1.2, rotate: 5 }}
            >
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </motion.svg>
          </a>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
