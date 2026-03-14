/**
 * Construye el payload de una creación (paleta confirmada) a partir del estado actual.
 * Actualmente no se usa en el flujo; se mantiene por si se reutiliza en futuros informes de investigación.
 */

import type { ResearchCreationPayload } from './researchClient';

type InspirationMode = string;

interface HarmonySavedState {
  harmonyType?: string;
  colorCount?: number;
  baseColor?: string;
}

interface ArchetypeSavedState {
  quienPalette?: string[];
  quePalette?: string[];
  comoPalette?: string[];
  quienPaletteLabels?: string[];
  quePaletteLabels?: string[];
  comoPaletteLabels?: string[];
  combineMode?: string;
  activatedColumns?: Record<string, boolean>;
  columnFlowState?: Record<string, { matchedCards?: Array<{ card: { id: string } }>; selectedCard?: { card: { id: string } } }>;
}

export function buildResearchPayload(
  inspirationModeUsed: InspirationMode,
  colors: string[],
  savedState: unknown,
  inspirationModesVisited: string[]
): ResearchCreationPayload {
  const payload: ResearchCreationPayload = {
    inspiration_mode_used: inspirationModeUsed,
    inspiration_modes_visited: inspirationModesVisited.filter((m) => m && m !== 'archetypes-menu'),
    inspiration_multi_origin: inspirationModeUsed === 'multi-origin',
    color_count: colors.length,
  };

  const state = savedState as Record<string, unknown> | undefined;
  if (!state) return payload;

  // Armonía
  const harmony = state as HarmonySavedState;
  if (harmony.harmonyType) {
    payload.harmony_type = harmony.harmonyType;
    payload.harmony_color_count = harmony.colorCount ?? colors.length;
    if (harmony.baseColor) payload.harmony_base_color_hex = harmony.baseColor;
  }

  // Imagen
  if (inspirationModeUsed === 'image') {
    payload.image_used = true;
    payload.image_color_count = colors.length;
  }

  // Tendencias (savedState puede tener paletteId/name si se pasa desde TrendingPalettes)
  const trending = state as { trending_palette_id?: string; trending_palette_name?: string; trending_palette_category?: string };
  if (trending.trending_palette_id) payload.trending_palette_id = trending.trending_palette_id;
  if (trending.trending_palette_name) payload.trending_palette_name = trending.trending_palette_name;
  if (trending.trending_palette_category) payload.trending_palette_category = trending.trending_palette_category;
  if (inspirationModeUsed === 'trending') payload.trending_color_count = colors.length;

  // Arquetipos
  const arch = state as ArchetypeSavedState;
  if (arch.combineMode != null) {
    payload.archetype_combine_mode = arch.combineMode;
    payload.archetype_final_color_count = colors.length;
    const activated = arch.activatedColumns ?? {};
    payload.archetype_column_quien_activated = !!activated.quien;
    payload.archetype_column_que_activated = !!activated.que;
    payload.archetype_column_como_activated = !!activated.como;
    if (arch.quienPaletteLabels?.length) payload.archetype_quien_labels_per_color = arch.quienPaletteLabels.join('|');
    if (arch.quePaletteLabels?.length) payload.archetype_que_labels_per_color = arch.quePaletteLabels.join('|');
    if (arch.comoPaletteLabels?.length) payload.archetype_como_labels_per_color = arch.comoPaletteLabels.join('|');
    const flow = arch.columnFlowState ?? {};
    const contentKeys = { quien: 'que', que: 'quien', como: 'como' } as const;
    const quienFlow = flow[contentKeys.quien];
    if (quienFlow?.matchedCards?.length) {
      payload.archetype_quien_silhouette_ids = quienFlow.matchedCards
        .map((m) => m.card?.id?.replace?.('que-silh-', '') ?? m.card?.id)
        .filter(Boolean);
      const sel = quienFlow.selectedCard?.card?.id;
      if (sel) payload.archetype_quien_silhouette_selected_id = sel.replace?.('que-silh-', '') ?? sel;
    }
    const queFlow = flow[contentKeys.que];
    if (queFlow?.matchedCards?.length) {
      payload.archetype_que_character_ids = queFlow.matchedCards
        .map((m) => m.card?.id?.replace?.('quien-char-', '') ?? m.card?.id)
        .filter(Boolean);
      const sel = queFlow.selectedCard?.card?.id;
      if (sel) payload.archetype_que_character_selected_id = sel.replace?.('quien-char-', '') ?? sel;
    }
    const comoFlow = flow[contentKeys.como];
    if (comoFlow?.matchedCards?.length) {
      payload.archetype_como_estilo_ids = comoFlow.matchedCards
        .map((m) => m.card?.id?.replace?.('como-estilo-', '') ?? m.card?.id)
        .filter(Boolean);
      const sel = comoFlow.selectedCard?.card?.id;
      if (sel) payload.archetype_como_estilo_selected_id = sel.replace?.('como-estilo-', '') ?? sel;
    }
  }

  return payload;
}
