import { supabase } from './supabase';
import type { SavedPalette } from '../types/guidedPalette';

function generateShareToken(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let s = '';
  const bytes = new Uint8Array(12);
  crypto.getRandomValues(bytes);
  for (let i = 0; i < 12; i++) s += chars[bytes[i] % chars.length];
  return s;
}

/**
 * Crea un enlace de compartir insertando en palette_share_tokens (RLS).
 * No usa Edge Function, así se evita el gateway que exige/valida JWT.
 */
export async function createShareLink(paletteId: string): Promise<{ url: string; error: null } | { url: null; error: string }> {
  if (!supabase) return { url: null, error: 'No configurado' };

  const { data: { session }, error: sessionError } = await supabase.auth.getSession();
  if (sessionError || !session?.user?.id) {
    return { url: null, error: 'Sesión expirada. Cierra sesión y vuelve a iniciar sesión.' };
  }

  const { data: palette } = await supabase
    .from('palettes')
    .select('id')
    .eq('id', paletteId)
    .eq('user_id', session.user.id)
    .single();
  if (!palette) {
    return { url: null, error: 'Paleta no encontrada o sin permiso' };
  }

  const shareToken = generateShareToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  const { error: insertError } = await supabase.from('palette_share_tokens').insert({
    token: shareToken,
    palette_id: paletteId,
    user_id: session.user.id,
    expires_at: expiresAt.toISOString(),
  });
  if (insertError) {
    return { url: null, error: insertError.message };
  }

  const base = typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : '';
  const url = base ? `${base}?share=${shareToken}` : `?share=${shareToken}`;
  return { url, error: null };
}

/**
 * Obtiene una paleta compartida por token (RPC get_shared_palette). No requiere sesión.
 */
export async function getSharedPalette(
  token: string
): Promise<{ palette: SavedPalette; error: null } | { palette: null; error: string }> {
  if (!supabase) return { palette: null, error: 'No configurado' };

  const { data, error } = await supabase.rpc('get_shared_palette', { share_token: token.trim() });
  if (error) return { palette: null, error: error.message };
  const p = data as { id?: string; name?: string; colors?: string[]; createdAt?: string } | null;
  if (!p || !Array.isArray(p.colors)) return { palette: null, error: 'Enlace no encontrado o expirado' };

  const palette: SavedPalette = {
    id: p.id ?? '',
    name: p.name ?? 'Paleta compartida',
    colors: p.colors,
    createdAt: p.createdAt ? new Date(p.createdAt) : new Date(),
  };
  return { palette, error: null };
}
