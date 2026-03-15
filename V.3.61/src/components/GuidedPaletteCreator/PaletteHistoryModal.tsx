import React, { useState, useRef, useCallback, useEffect } from 'react';
import type { StateHistoryEntry } from './hooks/paletteHistoryActions';
import type { PaletteHistorySectionId } from './hooks/paletteHistoryActions';
import { COPY } from './config/copy';
import { cn } from '../../utils/cn';
import { GripVertical, Lock, Trash2, X } from 'lucide-react';

const SECTION_LABELS: Record<PaletteHistorySectionId, string> = {
  refinement: COPY.historyModal.sectionRefinement,
  application: COPY.historyModal.sectionApplication,
  analysis: COPY.historyModal.sectionAnalysis,
};

/** Tono sutil por sección para la etiqueta (sin ser llamativo). */
const SECTION_BADGE_CLASS: Record<PaletteHistorySectionId, string> = {
  refinement: 'bg-emerald-900/40 text-emerald-200',
  application: 'bg-indigo-900/40 text-indigo-200',
  analysis: 'bg-amber-900/40 text-amber-200',
};

const INITIAL_WIDTH = 420;
const INITIAL_HEIGHT = 520;
const MIN_WIDTH = 320;
const MIN_HEIGHT = 300;
const MAX_WIDTH_PCT = 90;
const MAX_HEIGHT_PCT = 85;

export interface PaletteHistoryModalProps {
  open: boolean;
  onClose: () => void;
  entries: StateHistoryEntry[];
  currentIndex: number;
  onSelectIndex: (index: number) => void;
  /** Índice mínimo seleccionable (p. ej. por candado: no se puede ir por debajo de este punto). Entradas por debajo se muestran desactivadas. */
  minSelectableIndex?: number;
  /** Elimina una entrada del historial (solo se ofrece para índice > 0). */
  onRemoveEntry?: (index: number) => void;
}

export function PaletteHistoryModal({
  open,
  onClose,
  entries,
  currentIndex,
  onSelectIndex,
  minSelectableIndex = 0,
  onRemoveEntry,
}: PaletteHistoryModalProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ w: INITIAL_WIDTH, h: INITIAL_HEIGHT });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, posX: 0, posY: 0 });
  const resizeStart = useRef({ x: 0, y: 0, w: 0, h: 0 });
  const hasInitialPositionSet = useRef(false);

  const maxW = typeof window !== 'undefined' ? (window.innerWidth * MAX_WIDTH_PCT) / 100 : 800;
  const maxH = typeof window !== 'undefined' ? (window.innerHeight * MAX_HEIGHT_PCT) / 100 : 600;

  useEffect(() => {
    if (open && !hasInitialPositionSet.current) {
      hasInitialPositionSet.current = true;
      setPosition({
        x: Math.max(0, (window.innerWidth - size.w) / 2),
        y: Math.max(0, (window.innerHeight - size.h) / 2),
      });
    }
  }, [open, size.w, size.h]);

  const handleDragStart = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest('button')) return;
      e.preventDefault();
      setIsDragging(true);
      dragStart.current = { x: e.clientX, y: e.clientY, posX: position.x, posY: position.y };
    },
    [position]
  );

  const handleResizeStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsResizing(true);
      resizeStart.current = { x: e.clientX, y: e.clientY, w: size.w, h: size.h };
    },
    [size]
  );

  useEffect(() => {
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

  useEffect(() => {
    if (!isResizing) return;
    const onMove = (e: MouseEvent) => {
      const dw = e.clientX - resizeStart.current.x;
      const dh = e.clientY - resizeStart.current.y;
      setSize({
        w: Math.min(maxW, Math.max(MIN_WIDTH, resizeStart.current.w + dw)),
        h: Math.min(maxH, Math.max(MIN_HEIGHT, resizeStart.current.h + dh)),
      });
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
      aria-labelledby="history-modal-title"
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
          <h2 id="history-modal-title" className="text-lg font-semibold text-white flex-1 truncate">
            {COPY.historyModal.title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-600/50 transition-colors shrink-0"
            aria-label={COPY.historyModal.close}
          >
            <X className="w-5 h-5" strokeWidth={2} />
          </button>
        </div>
        <p className="text-sm text-gray-400 px-4 pt-1 pb-2 shrink-0 border-b border-gray-600/40">
          {COPY.historyModal.subtitle}
        </p>
        <div className="overflow-y-auto p-4 flex flex-col gap-2 min-h-0 flex-1">
          {entries.length === 0 ? (
            <p className="text-gray-400 text-sm">No hay cambios en el historial.</p>
          ) : (
            entries.map((entry, i) => {
              const isCurrent = i === currentIndex;
              const isLocked = i < minSelectableIndex;
              const canRemove = i > 0 && onRemoveEntry != null && !isLocked;
              const mainLabel = i === 0 ? COPY.historyModal.initialLabel : COPY.historyModal.numberLabel(i);
              const descriptionText = i === 0 ? null : (entry.description ?? null);
              const sectionLabel = entry.sectionId ? SECTION_LABELS[entry.sectionId] : null;
              return (
                <div
                  key={i}
                  className={`w-full rounded-xl border px-4 py-3 transition-colors flex items-center gap-3 ${
                    isLocked
                      ? 'border-gray-700/50 bg-gray-800/60 text-gray-500 opacity-60'
                      : isCurrent
                        ? 'border-indigo-500/60 bg-indigo-950/40 text-white'
                        : 'border-gray-600/50 bg-gray-700/40 text-gray-200'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => !isLocked && onSelectIndex(i)}
                    disabled={isLocked}
                    className="flex gap-1 shrink-0 min-w-0 flex-1 text-left items-center gap-3 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <div className="flex gap-1 shrink-0">
                      {entry.colors.slice(0, 8).map((c, j) => (
                        <span
                          key={j}
                          className="w-5 h-5 rounded-full border border-gray-600/80 shrink-0"
                          style={{ backgroundColor: c.hex }}
                          aria-hidden
                        />
                      ))}
                    </div>
                    <div className="min-w-0 flex-1 flex items-center gap-2 flex-wrap">
                      <span className="font-medium">{mainLabel}</span>
                      {descriptionText != null && (
                        <span className="text-xs text-gray-400">{descriptionText}</span>
                      )}
                    </div>
                    <div className="w-20 shrink-0 flex justify-end">
                      {sectionLabel != null && entry.sectionId != null && (
                        <span
                          className={cn(
                            'inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium',
                            SECTION_BADGE_CLASS[entry.sectionId]
                          )}
                          aria-label={`Sección: ${sectionLabel}`}
                        >
                          {sectionLabel}
                        </span>
                      )}
                    </div>
                    {isLocked && (
                      <Lock className="w-4 h-4 text-amber-500/80 shrink-0" strokeWidth={2} aria-hidden title="Bloqueado por candado" />
                    )}
                  </button>
                  {canRemove && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveEntry(i);
                      }}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-gray-600/50 transition-colors shrink-0"
                      aria-label={COPY.historyModal.removeEntry}
                      title={COPY.historyModal.removeEntry}
                    >
                      <Trash2 className="w-4 h-4" strokeWidth={2} />
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
        <div className="p-3 border-t border-gray-600/50 shrink-0 flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2 rounded-xl border border-gray-600 text-gray-300 hover:bg-gray-700/50 font-medium text-sm"
          >
            {COPY.historyModal.close}
          </button>
          <div
            className="w-8 h-8 flex items-center justify-end cursor-se-resize shrink-0 rounded hover:bg-gray-700/50 transition-colors"
            onMouseDown={handleResizeStart}
            title="Redimensionar"
            aria-hidden
          >
            <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} fill="none" aria-hidden>
              <path d="M14 10v4h4M10 14h4v4" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
