import { useEffect, useRef, useState, type ReactNode } from 'react';

interface ResponsiveSceneFrameProps {
  baseWidth: number;
  baseHeight: number;
  minScale?: number;
  maxScale?: number;
  className?: string;
  children: ReactNode;
}

export function ResponsiveSceneFrame({
  baseWidth,
  baseHeight,
  minScale = 0.52,
  maxScale = 1,
  className,
  children,
}: ResponsiveSceneFrameProps) {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || typeof ResizeObserver === 'undefined') return;

    const updateScale = () => {
      const rect = frame.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      const fitByWidth = rect.width / baseWidth;
      const fitByHeight = rect.height / baseHeight;
      const next = Math.max(minScale, Math.min(maxScale, fitByWidth, fitByHeight));
      setScale((prev) => (Math.abs(prev - next) < 0.01 ? prev : next));
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [baseWidth, baseHeight, minScale, maxScale]);

  return (
    <div ref={frameRef} className={`relative w-full h-full flex items-center justify-center overflow-hidden ${className ?? ''}`}>
      <div
        style={{
          width: baseWidth,
          height: baseHeight,
          transform: `scale(${scale})`,
          transformOrigin: 'center center',
          flexShrink: 0,
          willChange: 'transform',
        }}
      >
        {children}
      </div>
    </div>
  );
}
