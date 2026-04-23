import { useEffect, useRef, useState, type ReactNode } from 'react';

interface AutoFitStageProps {
  baseWidth: number;
  baseHeight: number;
  children: ReactNode;
  minScale?: number;
  maxScale?: number;
}

/**
 * Escala el contenido completo para que entre en el viewport disponible
 * manteniendo proporción (sin distorsión), útil para preservar arquitectura.
 */
export function AutoFitStage({
  baseWidth,
  baseHeight,
  children,
  minScale = 0.3,
  maxScale = 1,
}: AutoFitStageProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport || typeof ResizeObserver === 'undefined') return;

    const updateScale = () => {
      const viewportRect = viewport.getBoundingClientRect();
      if (viewportRect.width <= 0 || viewportRect.height <= 0) return;

      const widthRatio = viewportRect.width / baseWidth;
      const heightRatio = viewportRect.height / baseHeight;
      const next = Math.max(minScale, Math.min(maxScale, widthRatio, heightRatio));
      setScale((prev) => (Math.abs(prev - next) < 0.01 ? prev : next));
    };

    updateScale();
    const viewportObserver = new ResizeObserver(updateScale);
    viewportObserver.observe(viewport);

    return () => {
      viewportObserver.disconnect();
    };
  }, [baseWidth, baseHeight, minScale, maxScale]);

  return (
    <div ref={viewportRef} className="w-full h-full overflow-hidden flex items-center justify-center">
      <div
        className="shrink-0"
        style={{
          width: baseWidth,
          height: baseHeight,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          willChange: 'transform',
        }}
      >
        {children}
      </div>
    </div>
  );
}
