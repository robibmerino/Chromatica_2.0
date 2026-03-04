import { motion } from 'framer-motion';

interface PhaseLayoutProps {
  /** Clave para AnimatePresence (ej. "application", "analysis", "save", "refinement") */
  phaseKey: string;
  /** Contenido principal de la fase */
  children: React.ReactNode;
  /** Navegación inferior (botones Volver / Siguiente). Opcional. */
  footer?: React.ReactNode;
  /** Clases del contenedor (ej. "space-y-6", "max-w-5xl mx-auto space-y-6") */
  className?: string;
  /** Header personalizado (ej. RefinementPhaseHeader). Si no se pasa, se usa title + onBack. */
  header?: React.ReactNode;
  /** Título de la fase cuando no se usa header personalizado */
  title?: string;
  onBack?: () => void;
  /** Texto del botón volver cuando no se usa header personalizado (por defecto "Volver") */
  backLabel?: string;
  /** Contenido opcional a la derecha del título cuando no se usa header (por defecto espaciador w-20) */
  rightSlot?: React.ReactNode;
}

export function PhaseLayout({
  phaseKey,
  children,
  footer,
  className = 'space-y-6',
  header,
  title,
  onBack,
  backLabel = 'Volver',
  rightSlot,
}: PhaseLayoutProps) {
  return (
    <motion.div
      key={phaseKey}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={className}
    >
      {header != null ? (
        header
      ) : (
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => onBack?.()}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            aria-label={backLabel}
          >
            <span aria-hidden>←</span>
            <span>{backLabel}</span>
          </button>
          <h2 className="text-xl font-semibold text-white">{title ?? ''}</h2>
          {rightSlot ?? <div className="w-20" />}
        </div>
      )}

      {children}

      {footer != null && footer}
    </motion.div>
  );
}
