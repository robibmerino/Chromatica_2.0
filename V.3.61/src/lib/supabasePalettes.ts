import { supabase } from './supabase';
import type { SavedPalette } from '../types/guidedPalette';

const TABLE = 'palettes';

/** Convierte una fila de Supabase a SavedPalette (createdAt como Date). */
function rowToSavedPalette(row: { id: string; name: string; colors: string[]; created_at: string }): SavedPalette {
  return {
    id: row.id,
    name: row.name,
    colors: Array.isArray(row.colors) ? row.colors : [],
    createdAt: new Date(row.created_at),
  };
}

/** Obtiene todas las paletas del usuario. Si no hay Supabase o usuario, devuelve []. */
export async function fetchPalettes(userId: string): Promise<SavedPalette[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from(TABLE)
    .select('id, name, colors, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) return [];
  return (data ?? []).map(rowToSavedPalette);
}

/** Rellena color_1..color_8 desde el array de colores (para ver cada color en su celda en Supabase). */
function colorColumns(colors: string[]): Record<string, string | null> {
  const out: Record<string, string | null> = {};
  for (let i = 1; i <= 8; i++) {
    out[`color_${i}`] = colors[i - 1] ?? null;
  }
  return out;
}

/** Inserta una paleta. Si no hay Supabase o userId, no hace nada. */
export async function insertPalette(userId: string, palette: SavedPalette): Promise<{ error: string | null }> {
  if (!supabase) return { error: null };
  const { error } = await supabase.from(TABLE).insert({
    id: palette.id,
    user_id: userId,
    name: palette.name,
    colors: palette.colors,
    created_at: palette.createdAt.toISOString(),
    ...colorColumns(palette.colors),
  });
  return { error: error?.message ?? null };
}

/** Actualiza el nombre de una paleta. */
export async function updatePaletteName(
  userId: string,
  id: string,
  name: string
): Promise<{ error: string | null }> {
  if (!supabase) return { error: null };
  const { error } = await supabase
    .from(TABLE)
    .update({ name: name.trim() })
    .eq('user_id', userId)
    .eq('id', id);
  return { error: error?.message ?? null };
}

/** Elimina una paleta por id y user_id. */
export async function deletePalette(userId: string, id: string): Promise<{ error: string | null }> {
  if (!supabase) return { error: null };
  const { error } = await supabase.from(TABLE).delete().eq('user_id', userId).eq('id', id);
  return { error: error?.message ?? null };
}
