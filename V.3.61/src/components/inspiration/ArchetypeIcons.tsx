import type { useDragControls } from 'framer-motion';

/** Icono de arrastre para reordenar ejes (6 puntos en 2 columnas). */
export function DragHandleIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <circle cx="9" cy="6" r="1.5" />
      <circle cx="9" cy="12" r="1.5" />
      <circle cx="9" cy="18" r="1.5" />
      <circle cx="15" cy="6" r="1.5" />
      <circle cx="15" cy="12" r="1.5" />
      <circle cx="15" cy="18" r="1.5" />
    </svg>
  );
}

/** Botón para arrastrar (evitar clic en el padre). */
export function DragHandleButton({
  dragControls,
  title = 'Arrastra para reordenar',
}: {
  dragControls: ReturnType<typeof useDragControls>;
  title?: string;
}) {
  return (
    <button
      type="button"
      onPointerDown={(e) => {
        e.stopPropagation();
        dragControls.start(e);
      }}
      onClick={(e) => e.stopPropagation()}
      className="shrink-0 self-center p-1 rounded text-gray-500 hover:text-gray-300 hover:bg-gray-700/50 cursor-grab active:cursor-grabbing touch-none"
      title={title}
      aria-label={title}
    >
      <DragHandleIcon />
    </button>
  );
}
