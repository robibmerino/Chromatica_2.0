import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { invalidatePalettes } from './usePalettesQuery';

/**
 * Suscripción a cambios en tiempo real en la tabla palettes del usuario.
 * Al insertar/actualizar/eliminar, invalida la query de React Query para que la lista se actualice
 * (útil cuando se edita desde otra pestaña o dispositivo).
 */
export function usePalettesRealtime(userId: string | undefined) {
  useEffect(() => {
    const client = supabase;
    if (!client || !userId) return;

    const channel = client
      .channel(`palettes:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'palettes',
          filter: `user_id=eq.${userId}`,
        },
        () => {
          invalidatePalettes(userId);
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, [userId]);
}
