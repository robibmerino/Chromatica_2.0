import { User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { isSupabaseConfigured } from '../../lib/supabase';
import { AvatarPreview } from '../AccountPanel/AvatarPreview';
import type { AvatarArchetypeColumn, AvatarAxisSelections } from '../AccountPanel/AvatarPersonalizationModal';

function getInitials(name: string | undefined, email: string): string {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
}

interface AuthMenuProps {
  onOpenAuth: () => void;
  /** Si está definido (usuario logueado), se muestra el botón Cuenta. */
  onOpenAccount?: () => void;
}

export function AuthMenu({ onOpenAuth, onOpenAccount }: AuthMenuProps) {
  const { user, profile, loading } = useAuth();

  if (!isSupabaseConfigured()) return null;
  if (loading) {
    return (
      <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gray-800/50">
        <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const nameToShow = user
    ? (profile?.full_name ?? (user.user_metadata?.full_name as string))?.trim() || user.email?.split('@')[0] || 'Usuario'
    : '';
  const avatarArchetype = user?.user_metadata?.avatar_archetype as
    | { column: AvatarArchetypeColumn; selections: AvatarAxisSelections }
    | undefined;
  const hasArchetypeAvatar = Boolean(
    avatarArchetype?.column && avatarArchetype?.selections && typeof avatarArchetype.selections === 'object'
  );
  const displayAvatarUrl = (user?.user_metadata?.avatar_url as string) || (user?.user_metadata?.picture as string);

  return (
    <div className="flex items-center gap-2">
      {user ? (
        <>
          {onOpenAccount && (
            <button
              type="button"
              onClick={onOpenAccount}
              className="flex items-center gap-2 min-w-0 max-w-[180px] px-2 py-1.5 rounded-lg text-gray-300 text-sm transition-colors focus:outline-none focus-visible:ring-0 border-0 shadow-none appearance-none bg-transparent hover:bg-white/5"
              title={`Cuenta: ${user.email ?? ''}`}
            >
              <div className="relative w-10 h-10 shrink-0 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center">
                {hasArchetypeAvatar ? (
                  <AvatarPreview
                    column={avatarArchetype!.column}
                    selections={avatarArchetype!.selections}
                    className="w-full h-full"
                  />
                ) : displayAvatarUrl ? (
                  <img src={displayAvatarUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xs font-semibold text-violet-400/90">
                    {getInitials(nameToShow || undefined, user.email ?? '')}
                  </span>
                )}
              </div>
              <span className="truncate">{nameToShow}</span>
            </button>
          )}
          {!onOpenAccount && (
            <span
              className="max-w-[120px] truncate text-sm text-gray-300"
              title={user.email ?? undefined}
            >
              {user.email}
            </span>
          )}
        </>
      ) : (
        <button
          type="button"
          onClick={onOpenAuth}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/40 hover:bg-indigo-600/60 text-indigo-200 text-sm transition-colors border border-indigo-500/30"
        >
          <User className="w-3.5 h-3.5" />
          Iniciar sesión
        </button>
      )}
    </div>
  );
}
