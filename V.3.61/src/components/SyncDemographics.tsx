import { useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useResearch } from '../contexts/ResearchContext';
import { hasConsent, getStoredDemographics, syncDemographicsToSupabase } from '../lib/researchClient';

/**
 * Cuando el usuario está logueado y tiene consentimiento en localStorage,
 * sincroniza sus sociodemográficas a la tabla research_demographics en Supabase.
 * Se re-ejecuta cuando consentGiven pasa a true (p. ej. tras aceptar en el gate).
 */
export function SyncDemographics() {
  const { user } = useAuth();
  const { consentGiven } = useResearch();
  const syncedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!user?.id) {
      syncedRef.current = null;
      return;
    }
    if (!hasConsent(user.id) || !consentGiven) return;
    const demographics = getStoredDemographics(user.id);
    if (!demographics) return;
    if (syncedRef.current === user.id) return;
    syncedRef.current = user.id;
    syncDemographicsToSupabase(user.id, demographics);
  }, [user?.id, consentGiven]);

  return null;
}
