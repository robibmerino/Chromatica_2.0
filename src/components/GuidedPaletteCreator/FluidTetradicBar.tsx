import { motion } from 'framer-motion';

/**
 * Barra tetrádica fluida para el hero de Inspiración:
 * gradiente continuo (verde → azul → violeta → naranja), luminosidad contenida y shimmer animado.
 */
export function FluidTetradicBar() {
  return (
    <div
      className="relative h-1.5 md:h-2 max-w-2xl mx-auto rounded-full overflow-hidden"
      aria-hidden
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            'linear-gradient(90deg, rgb(5 150 105) 0%, rgb(34 197 94) 18%, rgb(59 130 246) 38%, rgb(139 92 246) 58%, rgb(192 132 252) 72%, rgb(234 88 12) 88%, rgb(194 65 12) 100%)',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
      />
      <div className="absolute inset-0 rounded-full bg-black/25 pointer-events-none" aria-hidden />
      <motion.div
        className="absolute inset-y-0 w-[60%] rounded-full"
        style={{
          background:
            'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 30%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.08) 70%, transparent 100%)',
        }}
        animate={{ x: ['-80%', '180%'] }}
        transition={{
          duration: 2.8,
          repeat: Infinity,
          repeatDelay: 2,
          ease: [0.4, 0, 0.2, 1],
        }}
      />
      <div
        className="absolute inset-0 rounded-full border border-white/10 pointer-events-none"
        aria-hidden
      />
    </div>
  );
}
