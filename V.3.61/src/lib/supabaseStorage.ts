import { supabase } from './supabase';

const BUCKET = 'user-assets';

/**
 * Ruta en el bucket para un usuario: user_id/nombre-archivo
 * Así RLS puede restringir por (storage.foldername(name))[1] = auth.uid()::text
 */
function userPath(userId: string, filename: string): string {
  return `${userId}/${filename}`;
}

/**
 * Sube un archivo al bucket user-assets en la carpeta del usuario.
 * Tipos permitidos: image/jpeg, image/png, image/webp, image/gif (según RLS del bucket).
 * @returns URL pública del archivo o error
 */
export async function uploadUserAsset(
  userId: string,
  file: File,
  options?: { name?: string }
): Promise<{ url: string; error: null } | { url: null; error: string }> {
  if (!supabase) return { url: null, error: 'Storage no disponible' };
  const name = options?.name ?? file.name;
  const path = userPath(userId, name);
  const { data, error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: true,
  });
  if (error) return { url: null, error: error.message };
  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(data.path);
  return { url: urlData.publicUrl, error: null };
}

/**
 * Devuelve la URL pública de un archivo ya subido (path relativo al bucket: userId/filename).
 */
export function getPublicUrl(userId: string, filename: string): string {
  if (!supabase) return '';
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(userPath(userId, filename));
  return data.publicUrl;
}
