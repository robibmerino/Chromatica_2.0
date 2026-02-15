interface PhaseNavProps {
  onBack: () => void;
  onNext: () => void;
  /** Texto del botón volver (ej. "Volver", "Volver a Aplicación") */
  backLabel: string;
  /** Texto del botón siguiente (ej. "Siguiente: Análisis", "Guardar paleta") */
  nextLabel: string;
  /** Variante de color del botón siguiente. Por defecto indigo. */
  nextVariant?: 'indigo' | 'green';
  /** Icono opcional a la izquierda del nextLabel (ej. "💾") */
  nextIcon?: React.ReactNode;
  /** Clases extra del contenedor (ej. "pt-4") */
  className?: string;
}

const nextVariantClasses = {
  indigo: 'bg-indigo-600 hover:bg-indigo-500',
  green: 'bg-green-600 hover:bg-green-500',
};

export function PhaseNav({
  onBack,
  onNext,
  backLabel,
  nextLabel,
  nextVariant = 'indigo',
  nextIcon,
  className = '',
}: PhaseNavProps) {
  return (
    <nav
      className={`flex justify-between ${className}`.trim()}
      aria-label="Navegación entre fases"
    >
      <button
        type="button"
        onClick={onBack}
        className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-medium transition-colors"
        aria-label={backLabel}
      >
        ← {backLabel}
      </button>
      <button
        type="button"
        onClick={onNext}
        className={`px-6 py-3 text-white rounded-xl font-medium transition-colors flex items-center gap-2 ${nextVariantClasses[nextVariant]}`}
        aria-label={nextLabel}
      >
        {nextIcon != null && <span>{nextIcon}</span>}
        {nextLabel}
        <span aria-hidden>→</span>
      </button>
    </nav>
  );
}
