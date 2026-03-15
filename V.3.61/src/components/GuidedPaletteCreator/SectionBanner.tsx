import type React from 'react';
import { useState } from 'react';
import { Palette } from 'lucide-react';

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
  /** Candado: anclar/desanclar sección (las acciones de esta sección no se deshacen desde otras). */
  lockPinned?: boolean;
  onLockToggle?: () => void;
}

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
}: SectionBannerProps) {
  const [expanded, setExpanded] = useState(false);

  const hasExtraActions =
    onSavePalette != null ||
    (onUndo != null && onRedo != null) ||
    onLockToggle != null;

  return (
    <div className="bg-gray-700/60 rounded-2xl border border-gray-600/50 px-6 py-4 grid grid-cols-[1fr_auto_1fr] items-center gap-4">
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

      <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
        {restoreLabel && onRestore && (
          <button
            type="button"
            onClick={onRestore}
            className="px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-1.5 bg-amber-600/30 hover:bg-amber-600/50 text-amber-300"
            title="Restaurar la paleta al estado al entrar en Refinar"
            aria-label={restoreLabel}
          >
            {RESTORE_ICON}
            <span>{restoreLabel}</span>
          </button>
        )}

        {hasExtraActions && !expanded && (
          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white transition-colors"
            title="Más opciones"
            aria-label="Más opciones (Guardar, Deshacer, Rehacer, Anclar)"
          >
            {MORE_ICON}
          </button>
        )}

        {hasExtraActions && expanded && (
          <>
            {savePaletteLabel != null && onSavePalette != null && (
              <button
                type="button"
                onClick={onSavePalette}
                title={savePaletteLabel}
                aria-label={savePaletteLabel}
                className="relative p-2.5 rounded-xl border border-orange-500/35 bg-orange-950/50 text-orange-400 hover:border-orange-400/50 hover:bg-orange-950/70 transition-all duration-200 hover:shadow-[0_0_20px_rgba(251,146,60,0.15)]"
              >
                <Palette className="w-5 h-5" strokeWidth={1.5} aria-hidden />
              </button>
            )}
            {onUndo != null && onRedo != null && (
              <div className="flex gap-1" role="group" aria-label="Deshacer / Rehacer">
                <button
                  type="button"
                  onClick={onUndo}
                  disabled={undoDisabled}
                  className={`p-2 rounded-lg text-sm transition-colors ${
                    !undoDisabled ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                  }`}
                  title="Deshacer"
                  aria-label="Deshacer"
                >
                  <span aria-hidden>↶</span>
                </button>
                <button
                  type="button"
                  onClick={onRedo}
                  disabled={redoDisabled}
                  className={`p-2 rounded-lg text-sm transition-colors ${
                    !redoDisabled ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-800 text-gray-600 cursor-not-allowed'
                  }`}
                  title="Rehacer"
                  aria-label="Rehacer"
                >
                  <span aria-hidden>↷</span>
                </button>
              </div>
            )}
            {onLockToggle != null && (
              <button
                type="button"
                onClick={onLockToggle}
                className={`p-2 rounded-lg text-sm transition-colors ${
                  lockPinned ? 'bg-amber-600/50 hover:bg-amber-600/70 text-amber-200' : 'bg-gray-700 hover:bg-gray-600 text-white'
                }`}
                title={lockPinned ? 'Desanclar sección (las acciones podrán deshacerse desde otras secciones)' : 'Anclar sección (las acciones no se desharán desde otras secciones)'}
                aria-label={lockPinned ? 'Desanclar sección' : 'Anclar sección'}
              >
                {lockPinned ? LOCK_CLOSED_ICON : LOCK_OPEN_ICON}
              </button>
            )}
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white transition-colors"
              title="Cerrar opciones"
              aria-label="Cerrar opciones"
            >
              <span aria-hidden>−</span>
            </button>
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
