import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

interface AutoFitStageProps {
  baseWidth: number;
  baseHeight: number;
  children: ReactNode;
  minScale?: number;
  maxScale?: number;
  allowOverflow?: boolean;
  fitToContent?: boolean;
  syncViewportCssVar?: boolean;
  viewportPaddingX?: number;
  viewportPaddingY?: number;
  viewportPaddingBottom?: number;
  compensateBrowserZoom?: boolean;
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
  allowOverflow = false,
  fitToContent = false,
  syncViewportCssVar = true,
  viewportPaddingX = 0,
  viewportPaddingY = 0,
  viewportPaddingBottom = 0,
  compensateBrowserZoom = false,
}: AutoFitStageProps) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const initialDprRef = useRef<number>(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1);
  const [scale, setScale] = useState(1);
  const [stageSize, setStageSize] = useState({ width: baseWidth, height: baseHeight });

  useEffect(() => {
    const viewport = viewportRef.current;
    const stage = stageRef.current;
    if (!viewport || !stage || typeof ResizeObserver === 'undefined') return;

    const updateScale = () => {
      const viewportRect = viewport.getBoundingClientRect();
      if (viewportRect.width <= 0 || viewportRect.height <= 0) return;

      const measuredWidth = Math.max(baseWidth, stage.scrollWidth, stage.offsetWidth);
      const measuredHeight = Math.max(baseHeight, stage.scrollHeight, stage.offsetHeight);
      const nextWidth = fitToContent ? measuredWidth : baseWidth;
      const nextHeight = fitToContent ? measuredHeight : baseHeight;

      setStageSize((prev) =>
        prev.width === nextWidth && prev.height === nextHeight
          ? prev
          : { width: nextWidth, height: nextHeight }
      );

      const availableWidth = Math.max(0, viewportRect.width - viewportPaddingX * 2);
      const availableHeight = Math.max(
        0,
        viewportRect.height - viewportPaddingY * 2 - viewportPaddingBottom
      );
      let widthRatio = availableWidth / nextWidth;
      let heightRatio = availableHeight / nextHeight;

      if (compensateBrowserZoom && typeof window !== 'undefined') {
        const vvScale = window.visualViewport?.scale ?? 1;
        const currentDpr = window.devicePixelRatio || 1;
        const baselineDpr = initialDprRef.current || 1;
        const dprZoom = baselineDpr > 0 ? currentDpr / baselineDpr : 1;
        // Evita sobrecompensación: priorizamos visualViewport (cuando existe) y
        // usamos DPR solo como fallback si el navegador no expone scale fiable.
        const fallbackZoom = dprZoom > 1.05 ? dprZoom : 1;
        const zoomFactor = Math.max(1, vvScale > 1.01 ? vvScale : fallbackZoom);
        widthRatio /= zoomFactor;
        heightRatio /= zoomFactor;
      }

      const next = Math.max(minScale, Math.min(maxScale, widthRatio, heightRatio));
      setScale((prev) => (Math.abs(prev - next) < 0.01 ? prev : next));
    };

    updateScale();
    const viewportObserver = new ResizeObserver(updateScale);
    viewportObserver.observe(viewport);
    const stageObserver = new ResizeObserver(updateScale);
    stageObserver.observe(stage);
    const vv = typeof window !== 'undefined' ? window.visualViewport : null;
    vv?.addEventListener('resize', updateScale);
    vv?.addEventListener('scroll', updateScale);
    window.addEventListener('resize', updateScale);

    return () => {
      viewportObserver.disconnect();
      stageObserver.disconnect();
      vv?.removeEventListener('resize', updateScale);
      vv?.removeEventListener('scroll', updateScale);
      window.removeEventListener('resize', updateScale);
    };
  }, [
    baseWidth,
    baseHeight,
    minScale,
    maxScale,
    fitToContent,
    viewportPaddingX,
    viewportPaddingY,
    viewportPaddingBottom,
    compensateBrowserZoom,
  ]);

  const stageStyle: CSSProperties = {
    width: stageSize.width,
    height: stageSize.height,
    transform: `scale(${scale})`,
    transformOrigin: 'center center',
    willChange: 'transform',
  };
  if (syncViewportCssVar) {
    // Usamos el alto base del frame para evitar bucles de realimentación
    // entre medición de contenido y cálculos internos basados en --app-vh.
    stageStyle['--app-vh' as string] = `${baseHeight}px`;
  }

  return (
    <div
      ref={viewportRef}
      className={`w-full h-full flex items-center justify-center ${allowOverflow ? 'overflow-visible' : 'overflow-hidden'}`}
    >
      <div ref={stageRef} className={`shrink-0 ${allowOverflow ? 'overflow-visible' : ''}`} style={stageStyle}>
        {children}
      </div>
    </div>
  );
}
