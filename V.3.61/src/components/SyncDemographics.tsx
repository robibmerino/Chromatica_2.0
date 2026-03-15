import { useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { hasConsent, getStoredDemographics, syncDemographicsToSupabase } from '../lib/researchClient';

/**
 * Cuando el usuario está logueado y tiene consentimiento en localStorage,
 * sincroniza sus sociodemográficas a la tabla research_demographics en Supabase.
 * (El gate hace sync inmediato al aceptar; aquí se cubre carga con usuario ya consentido.)
 */
export function SyncDemographics() {
  const { user } = useAuth();
  const syncedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!user?.id) {
      syncedRef.current = null;
      return;
    }
    if (!hasConsent(user.id)) return;
    const demographics = getStoredDemographics(user.id);
    if (!demographics) return;
    if (syncedRef.current === user.id) return;
    syncedRef.current = user.id;
    syncDemographicsToSupabase(user.id, demographics);
  }, [user?.id]);

  return null;
}
