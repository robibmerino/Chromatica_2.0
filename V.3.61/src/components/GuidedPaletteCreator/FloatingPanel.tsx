import React from 'react';
import { GripVertical, X } from 'lucide-react';

interface FloatingPanelProps {
  title: string;
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  initialWidth?: number;
  initialHeight?: number;
}

const MIN_WIDTH = 320;
const MIN_HEIGHT = 260;
const MAX_WIDTH_PCT = 90;
const MAX_HEIGHT_PCT = 85;

export function FloatingPanel({
  title,
  open,
  onClose,
  children,
  initialWidth = 420,
  initialHeight = 380,
}: FloatingPanelProps) {
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [size, setSize] = React.useState({ w: initialWidth, h: initialHeight });
  const [isDragging, setIsDragging] = React.useState(false);
  const [isResizing, setIsResizing] = React.useState(false);

  const dragStart = React.useRef({ x: 0, y: 0, posX: 0, posY: 0 });
  const resizeStart = React.useRef({ x: 0, y: 0, w: 0, h: 0 });
  const hasInitialPosition = React.useRef(false);

  const maxW =
    typeof window !== 'undefined' ? (window.innerWidth * MAX_WIDTH_PCT) / 100 : initialWidth;
  const maxH =
    typeof window !== 'undefined' ? (window.innerHeight * MAX_HEIGHT_PCT) / 100 : initialHeight;

  React.useEffect(() => {
    if (open && !hasInitialPosition.current && typeof window !== 'undefined') {
      hasInitialPosition.current = true;
      setPosition({
        x: Math.max(0, (window.innerWidth - size.w) / 2),
        y: Math.max(0, (window.innerHeight - size.h) / 2),
      });
    }
  }, [open, size.w, size.h]);

  const handleDragStart = React.useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest('button')) return;
      e.preventDefault();
      setIsDragging(true);
      dragStart.current = { x: e.clientX, y: e.clientY, posX: position.x, posY: position.y };
    },
    [position]
  );

  const handleResizeStart = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsResizing(true);
      resizeStart.current = { x: e.clientX, y: e.clientY, w: size.w, h: size.h };
    },
    [size]
  );

  React.useEffect(() => {
    if (!isDragging) return;
    const onMove = (e: MouseEvent) => {
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      setPosition({
        x: Math.max(0, dragStart.current.posX + dx),
        y: Math.max(0, dragStart.current.posY + dy),
      });
    };
    const onUp = () => setIsDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [isDragging]);

  React.useEffect(() => {
    if (!isResizing) return;
    const onMove = (e: MouseEvent) => {
      const dw = e.clientX - resizeStart.current.x;
      const dh = e.clientY - resizeStart.current.y;
      const nextW = Math.min(
        maxW,
        Math.max(MIN_WIDTH, resizeStart.current.w + dw)
      );
      const nextH = Math.min(
        maxH,
        Math.max(MIN_HEIGHT, resizeStart.current.h + dh)
      );
      setSize({ w: nextW, h: nextH });
    };
    const onUp = () => setIsResizing(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [isResizing, maxW, maxH]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-transparent pointer-events-none"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="flex flex-col rounded-2xl border border-gray-600/60 bg-gray-800/98 shadow-xl backdrop-blur-sm flex-shrink-0 pointer-events-auto"
        style={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          width: size.w,
          height: size.h,
          maxWidth: '90vw',
          maxHeight: '85vh',
        }}
      >
        <div
          className="flex items-center gap-2 p-3 border-b border-gray-600/50 shrink-0 cursor-grab active:cursor-grabbing select-none rounded-t-2xl hover:bg-gray-700/30"
          onMouseDown={handleDragStart}
          aria-hidden
        >
          <GripVertical className="w-4 h-4 text-gray-500 shrink-0" aria-hidden />
          <h2 className="text-lg font-semibold text-white flex-1 truncate">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-600/50 transition-colors shrink-0"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>
        <div className="overflow-y-auto p-4 flex-1 min-h-0">
          {children}
        </div>
        <div className="p-3 border-t border-gray-600/50 shrink-0 flex items-end justify-end gap-2">
          <div
            className="w-8 h-8 flex items-center justify-end cursor-se-resize shrink-0 rounded hover:bg-gray-700/50 transition-colors"
            onMouseDown={handleResizeStart}
            title="Redimensionar"
            aria-hidden
          >
            <svg
              className="w-4 h-4 text-gray-500"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              fill="none"
              aria-hidden
            >
              <path d="M14 10v4h4M10 14h4v4" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

