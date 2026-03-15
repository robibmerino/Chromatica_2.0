import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export interface ProfileRow {
  full_name: string | null;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  /** Nombre guardado en tabla profiles; no lo pisa OAuth al volver a iniciar sesión. */
  profile: ProfileRow | null;
  loading: boolean;
  error: string | null;
  needsPasswordUpdate: boolean;
}

export type OAuthProvider = 'google' | 'github';

interface AuthContextValue extends AuthState {
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signInWithOAuth: (provider: OAuthProvider) => Promise<{ error: string | null }>;
  resetPasswordForEmail: (email: string) => Promise<{ error: string | null }>;
  updatePassword: (newPassword: string) => Promise<{ error: string | null }>;
  updateProfile: (updates: {
    full_name?: string;
    email?: string;
    avatar_url?: string;
    /** Avatar de arquetipos: columna y selecciones por eje. Se guarda en user_metadata. */
    avatar_archetype?: { column: 'quien' | 'que' | 'como'; selections: Record<string, number> } | null;
  }) => Promise<{ error: string | null }>;
  clearNeedsPasswordUpdate: () => void;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function getInitialNeedsPasswordUpdate(): boolean {
  if (typeof window === 'undefined') return false;
  return window.location.hash.includes('type=recovery');
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    profile: null,
    loading: true,
    error: null,
    needsPasswordUpdate: getInitialNeedsPasswordUpdate(),
  });

  const fetchProfile = useCallback(async (userId: string) => {
    if (!supabase) return null;
    const { data } = await supabase.from('profiles').select('full_name').eq('id', userId).single();
    return data as ProfileRow | null;
  }, []);

  useEffect(() => {
    if (!supabase) {
      setState((s) => ({ ...s, loading: false }));
      return;
    }
    const {
      data: { subscription },
    } =     supabase.auth.onAuthStateChange((event, session) => {
      const isRecovery =
        event === 'PASSWORD_RECOVERY' ||
        (typeof window !== 'undefined' && session != null && window.location.hash.includes('type=recovery'));
      setState((s) => {
        const newUserId = session?.user?.id ?? null;
        const sameUser = newUserId !== null && newUserId === s.user?.id;
        return {
          ...s,
          user: session?.user ?? null,
          session,
          profile: sameUser ? s.profile : null,
          loading: false,
          needsPasswordUpdate: isRecovery ? true : s.needsPasswordUpdate,
        };
      });
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      const hashHasRecovery =
        typeof window !== 'undefined' && window.location.hash.includes('type=recovery');
      setState((s) => {
        const newUserId = session?.user?.id ?? null;
        const sameUser = newUserId !== null && newUserId === s.user?.id;
        return {
          ...s,
          user: session?.user ?? null,
          session,
          profile: sameUser ? s.profile : null,
          loading: false,
          needsPasswordUpdate: hashHasRecovery ? true : s.needsPasswordUpdate,
        };
      });
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const userId = state.user?.id;
    if (!userId || !supabase) return;
    let cancelled = false;
    fetchProfile(userId).then((profile) => {
      if (!cancelled)
        setState((s) => (s.user?.id === userId ? { ...s, profile } : s));
    });
    return () => { cancelled = true; };
  }, [state.user?.id, fetchProfile]);

  const signUp = useCallback(async (email: string, password: string) => {
    if (!supabase) return { error: 'Cuenta no disponible' };
    setState((s) => ({ ...s, error: null }));
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      setState((s) => ({ ...s, error: error.message }));
      return { error: error.message };
    }
    // Supabase no devuelve error si el email ya existe (privacidad). Si identities está vacío, ya estaba registrado.
    if (data?.user && (!data.user.identities || data.user.identities.length === 0)) {
      const msg = 'Este correo ya está registrado. Usa "Iniciar sesión"';
      setState((s) => ({ ...s, error: msg }));
      return { error: msg };
    }
    setState((s) => ({ ...s, error: null }));
    return { error: null };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!supabase) return { error: 'Cuenta no disponible' };
    setState((s) => ({ ...s, error: null }));
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setState((s) => ({ ...s, error: error?.message ?? null }));
    return { error: error?.message ?? null };
  }, []);

  const signInWithOAuth = useCallback(async (provider: OAuthProvider) => {
    if (!supabase) return { error: 'Cuenta no disponible' };
    setState((s) => ({ ...s, error: null }));
    const redirectTo =
      typeof window !== 'undefined'
        ? `${window.location.origin}${window.location.pathname}`
        : undefined;
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo },
    });
    if (error) {
      setState((s) => ({ ...s, error: error.message }));
      return { error: error.message };
    }
    return { error: null };
  }, []);

  const resetPasswordForEmail = useCallback(async (email: string) => {
    if (!supabase) return { error: 'Cuenta no disponible' };
    setState((s) => ({ ...s, error: null }));
    const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : undefined;
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo });
    if (error) {
      setState((s) => ({ ...s, error: error.message }));
      return { error: error.message };
    }
    setState((s) => ({ ...s, error: null }));
    return { error: null };
  }, []);

  const updatePassword = useCallback(async (newPassword: string) => {
    if (!supabase) return { error: 'Cuenta no disponible' };
    setState((s) => ({ ...s, error: null }));
    const { data, error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setState((s) => ({ ...s, error: error.message }));
      return { error: error.message };
    }
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    setState((s) => ({ ...s, error: null, needsPasswordUpdate: false, user: data?.user ?? s.user }));
    return { error: null };
  }, []);

  const updateProfile = useCallback(
    async (updates: {
      full_name?: string;
      email?: string;
      avatar_url?: string;
      avatar_archetype?: { column: 'quien' | 'que' | 'como'; selections: Record<string, number> } | null;
    }) => {
      if (!supabase) return { error: 'Cuenta no disponible' };
      setState((s) => ({ ...s, error: null }));
      const payload: {
        data?: { full_name?: string; avatar_url?: string; avatar_archetype?: unknown };
        email?: string;
      } = {};
      if (
        updates.full_name !== undefined ||
        updates.avatar_url !== undefined ||
        updates.avatar_archetype !== undefined
      ) {
        payload.data = {};
        if (updates.full_name !== undefined)
          payload.data.full_name = updates.full_name.trim() || undefined;
        if (updates.avatar_url !== undefined)
          payload.data.avatar_url = updates.avatar_url.trim() || undefined;
        if (updates.avatar_archetype !== undefined)
          payload.data.avatar_archetype = updates.avatar_archetype;
      }
      if (updates.email !== undefined) payload.email = updates.email.trim() || undefined;
      if (!payload.data && !payload.email) return { error: null };
      const { data, error } = await supabase.auth.updateUser(payload);
      if (error) {
        setState((s) => ({ ...s, error: error.message }));
        return { error: error.message };
      }
      const userId = data?.user?.id;
      if (updates.full_name !== undefined && userId) {
        const { error: profileError } = await supabase.from('profiles').upsert(
          { id: userId, full_name: updates.full_name.trim() || null, updated_at: new Date().toISOString() },
          { onConflict: 'id' }
        );
        if (profileError) {
          const msg =
            profileError.code === '42P01'
              ? 'Falta la tabla "profiles" en Supabase. Ejecuta docs/supabase-profiles.sql en el SQL Editor.'
              : profileError.message;
          setState((s) => ({ ...s, error: msg }));
          return { error: msg };
        }
        const profile = await fetchProfile(userId);
        setState((s) => ({ ...s, error: null, user: data?.user ?? s.user, profile }));
      } else {
        setState((s) => ({ ...s, error: null, user: data?.user ?? s.user }));
      }
      return { error: null };
    },
    [fetchProfile]
  );

  const clearNeedsPasswordUpdate = useCallback(() => {
    setState((s) => ({ ...s, needsPasswordUpdate: false }));
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, []);

  const signOut = useCallback(async () => {
    if (supabase) await supabase.auth.signOut();
    setState((s) => ({ ...s, error: null }));
  }, []);

  const clearError = useCallback(() => {
    setState((s) => ({ ...s, error: null }));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      signUp,
      signIn,
      signInWithOAuth,
      resetPasswordForEmail,
      updatePassword,
      updateProfile,
      clearNeedsPasswordUpdate,
      signOut,
      clearError,
    }),
    [
      state,
      signUp,
      signIn,
      signInWithOAuth,
      resetPasswordForEmail,
      updatePassword,
      updateProfile,
      clearNeedsPasswordUpdate,
      signOut,
      clearError,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}
