import { createClient } from '@supabase/supabase-js';
import { getSupabaseConfig } from './env';

const config = getSupabaseConfig();

/** Cliente de Supabase. Si no hay env configurado, las operaciones de cuenta/paletas en nube no estarán disponibles. */
export const supabase =
  config ? createClient(config.url, config.anonKey) : (null as ReturnType<typeof createClient> | null);

export const isSupabaseConfigured = (): boolean => !!supabase;

/** URL base del proyecto (para llamar a Edge Functions sin sesión, p. ej. get-shared-palette). */
export function getSupabaseUrl(): string {
  const c = getSupabaseConfig();
  return c?.url ?? '';
}
