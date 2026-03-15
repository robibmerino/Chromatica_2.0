import { useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { hasConsent, getStoredDemographics, syncDemographicsToSupabase } from '../lib/researchClient';

/**
 * Cuando el usuario está logueado y tiene consentimiento en localStorage,
 * sincroniza sus sociodemográficas a la tabla research_demographics en Supabase.
 */
export function SyncDemographics() {
  const { user } = useAuth();
  const syncedRef = useRef(false);

  useEffect(() => {
    if (!user?.id) {
      syncedRef.current = false;
      return;
    }
    if (syncedRef.current) return;
    if (!hasConsent(user.id)) return;
    const demographics = getStoredDemographics();
    if (!demographics) return;
    syncedRef.current = true;
    syncDemographicsToSupabase(user.id, demographics);
  }, [user?.id]);

  return null;
}
