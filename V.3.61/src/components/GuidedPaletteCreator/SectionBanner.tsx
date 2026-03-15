import type React from 'react';
import { useState } from 'react';
import { Save, History } from 'lucide-react';
import { COPY } from './config/copy';

/** Acentos reutilizables para el icono del banner según la sección u opción de inspiración. */
export const SECTION_ICON_ACCENTS = {
  emerald: 'bg-gray-700/80 border border-emerald-500/30 text-emerald-400',
  blue: 'bg-gray-700/80 border border-blue-500/30 text-blue-400',
  fuchsia: 'bg-gray-700/80 border border-fuchsia-500/30 text-fuchsia-400',
  orange: 'bg-gray-700/80 border border-orange-500/30 text-orange-400',
} as const;

export type SectionIconAccent = keyof typeof SECTION_ICON_ACCENTS;

export interface SectionBannerProps {
  onBack: () => void;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  /** Clase del contenedor del icono (ej. SECTION_ICON_ACCENTS.emerald). */
  iconBoxClassName: string;
  /** Botón principal (ej. "Mejorar paleta"). Si no se pasa, el banner solo muestra Volver + título (secciones de elección). */
  primaryLabel?: string;
  onPrimaryClick?: () => void;
  /** Undo/Redo: se muestran si se pasan onUndo/onRedo. */
  onUndo?: () => void;
  onRedo?: () => void;
  undoDisabled?: boolean;
  redoDisabled?: boolean;
  /** Reiniciar: solo texto "Reiniciar" + icono SVG. */
  restoreLabel?: string;
  onRestore?: () => void;
  /** Guardar paleta: se muestra si se pasa onSavePalette (solo si hay sesión; si no, el handler puede abrir auth). */
  savePaletteLabel?: string;
  onSavePalette?: () => void;
  /** Candado: fijar suelo de deshacer en esta sección (se desbloquea al salir). */
  lockPinned?: boolean;
  onLockToggle?: () => void;
  /** Nombre de la sección actual para el tooltip del candado (ej. "Refinar", "Aplicar", "Análisis"). */
  lockTooltipSectionName?: string;
  /** Abrir modal de historial de cambios. Si se pasa, se muestra el botón en las opciones expandidas. */
  onOpenHistory?: () => void;
}

const TOOLTIP_CLASS =
  'absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-2 text-sm text-gray-100 bg-gray-900 border border-gray-600 rounded-lg shadow-xl whitespace-normal max-w-[220px] text-center pointer-events-none z-[100] opacity-0 group-hover:opacity-100 transition-opacity duration-150';
const TOOLTIP_LOCK_CLASS =
  'absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-2 text-sm text-gray-100 bg-gray-900 border border-gray-600 rounded-lg shadow-xl whitespace-normal min-w-[300px] max-w-[360px] w-max text-center pointer-events-none z-[100] opacity-0 group-hover:opacity-100 transition-opacity duration-150';

const RESTORE_ICON = (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
);

const MORE_ICON = (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <circle cx="12" cy="6" r="1.5" />
    <circle cx="12" cy="12" r="1.5" />
    <circle cx="12" cy="18" r="1.5" />
  </svg>
);

const LOCK_OPEN_ICON = (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
  </svg>
);

const LOCK_CLOSED_ICON = (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

export function SectionBanner({
  onBack,
  title,
  subtitle,
  icon,
  iconBoxClassName,
  primaryLabel,
  onPrimaryClick,
  onUndo,
  onRedo,
  undoDisabled = false,
  redoDisabled = false,
  restoreLabel,
  onRestore,
  savePaletteLabel,
  onSavePalette,
  lockPinned = false,
  onLockToggle,
  lockTooltipSectionName = 'esta sección',
  onOpenHistory,
}: SectionBannerProps) {
  const [expanded, setExpanded] = useState(false);

  const hasExtraActions =
    onSavePalette != null ||
    (onUndo != null && onRedo != null) ||
    onLockToggle != null ||
    onOpenHistory != null;

  return (
    <div className="relative z-20 bg-gray-700/60 rounded-2xl border border-gray-600/50 px-6 py-4 grid grid-cols-[1fr_auto_1fr] items-center gap-4 overflow-visible">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 py-2 px-4 rounded-xl border border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white hover:border-gray-500 transition-all shrink-0 text-sm font-medium justify-self-start"
      >
        <span>←</span>
        <span>Volver</span>
      </button>

      <div className="flex items-center gap-3 min-w-0 justify-center">
        <span
          className={`flex shrink-0 items-center justify-center w-9 h-9 rounded-lg ${iconBoxClassName}`}
          aria-hidden
        >
          {icon}
        </span>
        <div>
          <h2 className="text-lg font-semibold text-white leading-tight">{title}</h2>
          <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end overflow-visible">
        {restoreLabel && onRestore && (
          <div className="relative group">
            <span className={TOOLTIP_CLASS} role="tooltip">{COPY.banner.restoreInSection}</span>
            <button
              type="button"
              onClick={onRestore}
              className="px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-1.5 bg-amber-600/30 hover:bg-amber-600/50 text-amber-300"
              aria-label={restoreLabel}
            >
              {RESTORE_ICON}
              <span>{restoreLabel}</span>
            </button>
          </div>
        )}

        {hasExtraActions && !expanded && (
          <div className="relative group">
            <span className={TOOLTIP_CLASS} role="tooltip">{COPY.banner.moreOptions}</span>
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
              aria-label={COPY.banner.moreOptionsAria}
            >
              {MORE_ICON}
            </button>
          </div>
        )}

        {hasExtraActions && expanded && (
          <>
            {savePaletteLabel != null && onSavePalette != null && (
              <div className="relative group">
                <span className={TOOLTIP_CLASS} role="tooltip">{COPY.banner.savePalette}</span>
                <button
                  type="button"
                  onClick={onSavePalette}
                  aria-label={savePaletteLabel}
                  className="relative p-2.5 rounded-xl border border-orange-500/35 bg-orange-950/50 text-orange-400 hover:border-orange-400/50 hover:bg-orange-950/70 transition-all duration-200 hover:shadow-[0_0_20px_rgba(251,146,60,0.15)]"
                >
                  <Save className="w-5 h-5" strokeWidth={1.5} aria-hidden />
                </button>
              </div>
            )}
            {onUndo != null && onRedo != null && (
              <div className="flex gap-1" role="group" aria-label="Deshacer / Rehacer">
                <div className="relative group">
                  <span className={TOOLTIP_CLASS} role="tooltip">{COPY.banner.undo}</span>
                  <button
                    type="button"
                    onClick={onUndo}
                    disabled={undoDisabled}
                    className={`p-2 rounded-lg text-sm transition-colors ${
                      !undoDisabled ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                    }`}
                    aria-label="Deshacer"
                  >
                    <span aria-hidden>↶</span>
                  </button>
                </div>
                <div className="relative group">
                  <span className={TOOLTIP_CLASS} role="tooltip">{COPY.banner.redo}</span>
                  <button
                    type="button"
                    onClick={onRedo}
                    disabled={redoDisabled}
                    className={`p-2 rounded-lg text-sm transition-colors ${
                      !redoDisabled ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                    }`}
                    aria-label="Rehacer"
                  >
                    <span aria-hidden>↷</span>
                  </button>
                </div>
              </div>
            )}
            {onLockToggle != null && (
              <div className="relative group">
                <span className={TOOLTIP_LOCK_CLASS} role="tooltip">{lockPinned ? COPY.banner.lockOn : COPY.banner.lockOff(lockTooltipSectionName)}</span>
                <button
                  type="button"
                  onClick={onLockToggle}
                  className={`p-2 rounded-lg text-sm transition-colors ${
                    lockPinned ? 'bg-amber-600/50 hover:bg-amber-600/70 text-amber-200' : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }`}
                  aria-label={lockPinned ? COPY.banner.lockAriaOn : COPY.banner.lockAriaOff}
                >
                  {lockPinned ? LOCK_CLOSED_ICON : LOCK_OPEN_ICON}
                </button>
              </div>
            )}
            {onOpenHistory != null && (
              <div className="relative group">
                <span className={TOOLTIP_CLASS} role="tooltip">{COPY.banner.history}</span>
                <button
                  type="button"
                  onClick={onOpenHistory}
                  className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
                  aria-label={COPY.banner.historyAria}
                >
                  <History className="w-4 h-4" strokeWidth={1.5} aria-hidden />
                </button>
              </div>
            )}
            <div className="relative group">
              <span className={TOOLTIP_CLASS} role="tooltip">{COPY.banner.closeOptions}</span>
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white transition-colors"
                aria-label={COPY.banner.closeOptions}
              >
                <span aria-hidden>−</span>
              </button>
            </div>
          </>
        )}

        {primaryLabel != null && onPrimaryClick != null && (
          <button
            type="button"
            onClick={onPrimaryClick}
            className="py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white border border-indigo-500/50 font-medium transition-all text-sm whitespace-nowrap"
          >
            {primaryLabel}
          </button>
        )}
      </div>
    </div>
  );
}
