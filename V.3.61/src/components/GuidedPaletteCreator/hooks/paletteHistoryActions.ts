/**
 * Historial: modelo por estados (Estado inicial + cambios). Cada entrada es un estado completo.
 * Se mantienen tipos de acciones para migración desde flujos guardados antiguos.
 */
import type { ColorItem } from '../../../types/guidedPalette';

export type PaletteHistorySectionId = 'refinement' | 'application' | 'analysis';

/** Una entrada del historial por estados: estado completo de la paleta + sección y descripción opcional.
 *  Incluye, cuando existe, los sliders globales de Refinar en el momento de la acción.
 *  (Los flujos antiguos pueden no tener esta propiedad; en ese caso se asume { tone:0, sat:0, light:0 }. */
export interface StateHistoryEntry {
  colors: ColorItem[];
  sectionId: PaletteHistorySectionId | null;
  description?: string;
  refinementGeneralSliders?: { tone: number; sat: number; light: number };
}

/** Acción que puede aplicarse o invertirse sobre la paleta actual. */
export type PaletteHistoryAction =
  | {
      type: 'snapshot';
      sectionId: PaletteHistorySectionId;
      /** Estado anterior (para undo). */
      prev: ColorItem[];
      /** Estado siguiente (para redo). */
      next: ColorItem[];
    }
  // Futuro: updateColor, reorder, adjustSaturation, etc.
  ;

/**
 * Aplica una acción a la paleta actual y devuelve la nueva paleta.
 */
export function applyAction(colors: ColorItem[], action: PaletteHistoryAction): ColorItem[] {
  switch (action.type) {
    case 'snapshot':
      return action.next.map((c) => ({ ...c }));
    default:
      return colors.map((c) => ({ ...c }));
  }
}

/**
 * Devuelve la acción inversa (para undo). Aplicar la inversa deshace la acción.
 */
export function getInverseAction(action: PaletteHistoryAction): PaletteHistoryAction {
  switch (action.type) {
    case 'snapshot':
      return {
        type: 'snapshot',
        sectionId: action.sectionId,
        prev: action.next.map((c) => ({ ...c })),
        next: action.prev.map((c) => ({ ...c })),
      };
    default:
      return action;
  }
}

/**
 * Crea una acción de tipo snapshot (estado prev → next).
 */
export function createSnapshotAction(
  sectionId: PaletteHistorySectionId,
  prev: ColorItem[],
  next: ColorItem[]
): PaletteHistoryAction {
  return {
    type: 'snapshot',
    sectionId,
    prev: prev.map((c) => ({ ...c })),
    next: next.map((c) => ({ ...c })),
  };
}

/** Estado de la paleta en la posición index del historial de acciones. index -1 = antes de la primera acción. (Usado solo para migración.) */
export function getStateAtPosition(
  actionHistory: PaletteHistoryAction[],
  index: number
): ColorItem[] {
  if (actionHistory.length === 0) return [];
  if (index === -1) return actionHistory[0].prev.map((c) => ({ ...c }));
  if (index >= 0 && index < actionHistory.length && actionHistory[index].type === 'snapshot')
    return actionHistory[index].next.map((c) => ({ ...c }));
  return [];
}

/** Migra historial por acciones a historial por estados: [Estado inicial, después de acción 0, 1, ...]. */
export function migrateActionHistoryToStateHistory(
  actionHistory: PaletteHistoryAction[],
  actionHistoryIndex: number
): { stateHistory: StateHistoryEntry[]; historyPointer: number } {
  if (actionHistory.length === 0) {
    return { stateHistory: [], historyPointer: 0 };
  }
  const stateHistory: StateHistoryEntry[] = [
    {
      colors: actionHistory[0].prev.map((c) => ({ ...c })),
      sectionId: null,
      description: 'Estado inicial',
    },
  ];
  for (let i = 0; i < actionHistory.length; i++) {
    if (actionHistory[i].type === 'snapshot') {
      stateHistory.push({
        colors: actionHistory[i].next.map((c) => ({ ...c })),
        sectionId: actionHistory[i].sectionId,
      });
    }
  }
  const historyPointer = Math.max(0, Math.min(actionHistoryIndex + 1, stateHistory.length - 1));
  return { stateHistory, historyPointer };
}
