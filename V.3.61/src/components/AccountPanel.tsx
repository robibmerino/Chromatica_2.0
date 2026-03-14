import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  User,
  Palette,
  LogOut,
  Mail,
  Lock,
  KeyRound,
  AlertTriangle,
  Settings,
  ChevronDown,
  ChevronRight,
  Eye,
  EyeOff,
  Share2,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { usePalettesQuery, usePaletteMutations } from '../hooks/usePalettesQuery';
import { createShareLink } from '../lib/supabaseShare';
import { isSupabaseConfigured } from '../lib/supabase';
import PosterExamples from './PosterExamples';
import { AvatarPersonalizationModal, type AvatarArchetypeColumn, type AvatarAxisSelections } from './AccountPanel/AvatarPersonalizationModal';
import { AvatarPreview } from './AccountPanel/AvatarPreview';
import { cn } from '../utils/cn';
import type { SavedPalette } from '../types/guidedPalette';

const inputClass =
  'w-full px-4 py-3 rounded-xl bg-gray-800/80 border border-gray-600/50 text-white placeholder-gray-500 focus:ring-2 focus:ring-violet-500/40 focus:border-violet-500/50 outline-none transition-all';

interface AccountPanelProps {
  onBack: () => void;
  /** Al pulsar "Editar paleta": ir a la app y abrir esa paleta en Refinar. */
  onEditPalette?: (palette: SavedPalette) => void;
  /** Al pulsar "Exportar Paleta": ir a la app y abrir esa paleta en la ventana Guardar. */
  onExportPalette?: (palette: SavedPalette) => void;
}

function formatMemberSince(createdAt: string | undefined): string {
  if (!createdAt) return '';
  try {
    const d = new Date(createdAt);
    return d.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  } catch {
    return '';
  }
}

function getInitials(name: string | undefined, email: string): string {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
}

export function AccountPanel({ onBack, onEditPalette, onExportPalette }: AccountPanelProps) {
  const { user, updateProfile, updatePassword, signOut } = useAuth();
  const [avatarSaving, setAvatarSaving] = useState(false);
  const [avatarMessage, setAvatarMessage] = useState<'ok' | 'error' | null>(null);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState<'ok' | 'error' | null>(null);

  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  /** Mensaje al cambiar contraseña: null, 'ok', o mensaje de error de Supabase */
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewPasswordConfirm, setShowNewPasswordConfirm] = useState(false);

  const { data: palettes = [], isLoading: palettesLoading, refetch: loadPalettes } = usePalettesQuery(user?.id);
  const { updateName: updatePaletteNameMutation, remove: deletePaletteMutation } = usePaletteMutations(user?.id);
  const [selectedPalette, setSelectedPalette] = useState<SavedPalette | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [paletteMessage, setPaletteMessage] = useState<string | null>(null);
  const [shareMessage, setShareMessage] = useState<'ok' | 'error' | null>(null);
  const [shareLoading, setShareLoading] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showExamplesMobile, setShowExamplesMobile] = useState(false);
  const [isLg, setIsLg] = useState(true);
  /** Columna derecha: qué opción está expandida ('perfil' | 'ajustes' | null) */
  const [rightPanelOpen, setRightPanelOpen] = useState<'perfil' | 'ajustes' | null>(null);
  /** Modal de personalización del avatar (Quién / Qué / Cómo + 4 ejes) */
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [avatarColumn, setAvatarColumn] = useState<AvatarArchetypeColumn | null>(null);
  const [avatarAxisSelections, setAvatarAxisSelections] = useState<AvatarAxisSelections>({});

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    setIsLg(mq.matches);
    const fn = () => setIsLg(mq.matches);
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, []);

  useEffect(() => {
    if (user) {
      setFullName((user.user_metadata?.full_name as string) || '');
      setEmail(user.email ?? '');
      const saved = user.user_metadata?.avatar_archetype as
        | { column: AvatarArchetypeColumn; selections: AvatarAxisSelections }
        | undefined;
      if (saved?.column && typeof saved.column === 'string' && saved.selections && typeof saved.selections === 'object') {
        setAvatarColumn(saved.column as AvatarArchetypeColumn);
        setAvatarAxisSelections({ ...(saved.selections as AvatarAxisSelections) });
      }
    }
  }, [user?.id, user?.email, user?.user_metadata]);

  useEffect(() => {
    if (palettes.length > 0 && !selectedPalette) setSelectedPalette(palettes[0]);
  }, [palettes, selectedPalette]);

  useEffect(() => {
    if (avatarMessage !== 'ok') return;
    const t = setTimeout(() => setAvatarMessage(null), 4000);
    return () => clearTimeout(t);
  }, [avatarMessage]);

  const handleSaveProfile = useCallback(async () => {
    setProfileMessage(null);
    setProfileSaving(true);
    const emailTrimmed = email.trim();
    const { error } = await updateProfile({
      full_name: fullName.trim() || undefined,
      email: emailTrimmed || undefined,
    });
    setProfileSaving(false);
    setProfileMessage(error ? 'error' : 'ok');
  }, [fullName, email, updateProfile]);

  const handleChangePassword = useCallback(async () => {
    setPasswordMessage(null);
    if (newPassword.length < 6 || newPassword !== newPasswordConfirm) {
      setPasswordMessage('Mínimo 6 caracteres y que ambas coincidan.');
      return;
    }
    setPasswordSaving(true);
    const { error } = await updatePassword(newPassword);
    setPasswordSaving(false);
    setPasswordMessage(error ?? (null as string | null));
    if (!error) {
      setNewPassword('');
      setNewPasswordConfirm('');
      setPasswordMessage('ok');
    }
  }, [newPassword, newPasswordConfirm, updatePassword]);

  const startEditPalette = useCallback((p: SavedPalette) => {
    setEditingId(p.id);
    setEditingName(p.name);
  }, []);

  const savePaletteName = useCallback(
    async (id: string) => {
      if (!editingName.trim()) {
        setEditingId(null);
        return;
      }
      setEditingId(null);
      const result = await updatePaletteNameMutation.mutateAsync({ id, name: editingName.trim() });
      const error = result?.error ?? null;
      setPaletteMessage(error ?? null);
      if (!error && selectedPalette?.id === id)
        setSelectedPalette((p) => (p ? { ...p, name: editingName.trim() } : null));
    },
    [editingName, updatePaletteNameMutation, selectedPalette?.id]
  );

  const handleDeletePalette = useCallback(
    async (id: string) => {
      const result = await deletePaletteMutation.mutateAsync(id);
      if (result?.error) setPaletteMessage(result.error);
      else if (selectedPalette?.id === id) setSelectedPalette(null);
    },
    [deletePaletteMutation, selectedPalette?.id]
  );

  const handleSignOut = useCallback(() => {
    signOut();
    onBack();
  }, [signOut, onBack]);

  if (!user) return null;

  const displayAvatar = (user.user_metadata?.avatar_url as string) || (user.user_metadata?.picture as string);
  const memberSince = formatMemberSince(user.created_at);
  const previewColors = selectedPalette?.colors ?? [];

  return (
    <div className="flex flex-col h-screen text-gray-100 overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Barra superior: mismo estilo que header del flujo principal (Inspiración, etc.) */}
      <div className="border-b border-gray-700/50 bg-gray-900/80 backdrop-blur-md shrink-0">
        <div className="max-w-7xl mx-auto w-full px-4 lg:px-6">
          <div className="flex items-center justify-between gap-4 py-4">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-2 py-2 px-4 rounded-xl border border-gray-600 text-gray-300 hover:bg-gray-700/50 hover:text-white transition-all shrink-0 text-sm font-medium"
              aria-label="Volver"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver
            </button>
            <div className="flex items-center gap-3 min-w-0 flex-1 justify-center">
              <span className="flex shrink-0 items-center justify-center w-9 h-9 rounded-lg bg-gray-700/80 border border-violet-500/30 text-violet-400" aria-hidden>
                <User className="w-4 h-4" />
              </span>
              <div>
                <h1 className="text-lg font-semibold text-white leading-tight">Cuenta</h1>
                <p className="text-xs text-gray-400 mt-0.5">Mis paletas, ejemplos y perfil</p>
              </div>
            </div>
            <div className="w-[88px] shrink-0" aria-hidden />
          </div>
        </div>
      </div>

      {/* Contenedor centrado: bloque de columnas con altura limitada, sin scroll de página */}
      <div className="max-w-7xl mx-auto w-full flex-1 min-h-0 overflow-hidden flex flex-col items-center justify-center px-4 lg:px-6 py-4 lg:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6 w-full max-h-[calc(100vh-11rem)] min-h-0 overflow-hidden">
        {/* Columna izquierda: Mis paletas */}
        <div className="bg-gray-800/70 rounded-2xl p-5 flex flex-col min-h-0 overflow-hidden flex-1 lg:flex-initial max-h-full border border-gray-700/40">
          <div className="flex items-center gap-2 mb-4 shrink-0">
            <Palette className="w-5 h-5 text-violet-400" />
            <h2 className="text-sm font-semibold text-white">Mis paletas</h2>
          </div>
          {paletteMessage && (
            <p className="text-xs text-red-400 bg-red-900/20 rounded-lg px-3 py-2 mb-3 shrink-0">{paletteMessage}</p>
          )}
          <div className="flex-1 min-h-0 overflow-y-auto inspiration-scroll-area">
          {palettesLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : palettes.length === 0 ? (
            <div className="rounded-xl border border-gray-700/50 bg-gray-800/30 p-6 text-center">
              <Palette className="w-10 h-10 text-gray-600 mx-auto mb-2" />
              <p className="text-gray-400 text-sm">Aún no tienes paletas guardadas.</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {palettes.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedPalette(p)}
                    className={cn(
                      'w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all',
                      selectedPalette?.id === p.id
                        ? 'bg-violet-500/20 border-violet-500/40 ring-1 ring-violet-500/30'
                        : 'bg-gray-800/60 border-gray-700/50 hover:border-gray-600/50'
                    )}
                  >
                    <div className="flex shrink-0 w-14 h-8 rounded-lg overflow-hidden ring-1 ring-white/10">
                      {p.colors.slice(0, 5).map((hex, i) => (
                        <div key={i} className="flex-1 h-full" style={{ backgroundColor: hex }} />
                      ))}
                    </div>
                    <div className="flex-1 min-w-0">
                      {editingId === p.id ? (
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          onBlur={() => savePaletteName(p.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') savePaletteName(p.id);
                            if (e.key === 'Escape') setEditingId(null);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className={cn(inputClass, 'py-2 text-sm')}
                          autoFocus
                        />
                      ) : (
                        <span className="text-white font-medium truncate block text-sm">
                          {p.name || 'Sin nombre'}
                        </span>
                      )}
                    </div>
                    {editingId !== p.id && (
                      <div className="flex items-center gap-0.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                        {onEditPalette && (
                          <button
                            type="button"
                            onClick={() => onEditPalette(p)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-violet-400 hover:bg-violet-900/20"
                            title="Editar paleta"
                          >
                            <span className="sr-only">Editar paleta</span>
                            <Palette className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => startEditPalette(p)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700/50"
                          title="Editar nombre"
                        >
                          <span className="sr-only">Editar nombre</span>
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePalette(p.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-900/20"
                          title="Eliminar"
                        >
                          <span className="sr-only">Eliminar</span>
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
          </div>
          {palettes.length > 0 && (
            <div className="mt-3 flex flex-col gap-2">
              {isSupabaseConfigured() && (
                <button
                  type="button"
                  onClick={async () => {
                    if (!selectedPalette) return;
                    setShareLoading(true);
                    setShareMessage(null);
                    setPaletteMessage(null);
                    try {
                      const { url, error } = await createShareLink(selectedPalette.id);
                      if (error) {
                        setShareMessage('error');
                        setPaletteMessage(error);
                        return;
                      }
                      await navigator.clipboard.writeText(url);
                      setShareMessage('ok');
                      setPaletteMessage(null);
                      setTimeout(() => setShareMessage(null), 3000);
                    } catch (err) {
                      setShareMessage('error');
                      setPaletteMessage(err instanceof Error ? err.message : 'Error al crear el enlace');
                    } finally {
                      setShareLoading(false);
                    }
                  }}
                  disabled={!selectedPalette || shareLoading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-gray-600 bg-gray-700/50 text-gray-200 hover:bg-gray-600/50 disabled:opacity-50 disabled:pointer-events-none transition-all text-sm font-medium shrink-0"
                  title={selectedPalette ? 'Copiar enlace para compartir la paleta' : 'Selecciona una paleta'}
                >
                  <Share2 className="w-4 h-4" />
                  {shareLoading ? '...' : shareMessage === 'ok' ? 'Enlace copiado' : 'Compartir enlace'}
                </button>
              )}
              {onExportPalette && (
                <button
                  type="button"
                  onClick={() => selectedPalette && onExportPalette(selectedPalette)}
                  disabled={!selectedPalette}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-violet-500/40 bg-violet-500/10 text-violet-300 hover:bg-violet-500/20 hover:text-violet-200 disabled:opacity-50 disabled:pointer-events-none transition-all text-sm font-medium shrink-0"
                  title={selectedPalette ? 'Abrir en Guardar para exportar' : 'Selecciona una paleta'}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Exportar Paleta
                </button>
              )}
            </div>
          )}
        </div>

        {/* Columna central: Ejemplos de aplicación de la paleta */}
        <div className="bg-gray-800/70 rounded-2xl p-5 flex flex-col min-h-0 overflow-hidden max-h-full border border-gray-700/40">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <h2 className="text-sm font-semibold text-gray-300">Ejemplos de aplicación</h2>
            {!isLg && (
              <button
                type="button"
                onClick={() => setShowExamplesMobile((v) => !v)}
                className="text-xs text-violet-400 hover:text-violet-300 font-medium"
              >
                {showExamplesMobile ? 'Ocultar' : 'Ver ejemplos'}
              </button>
            )}
          </div>
          {(isLg || showExamplesMobile) && (
            <div className="flex-1 min-h-0 overflow-y-auto inspiration-scroll-area max-h-full">
              {previewColors.length > 0 ? (
                <PosterExamples colors={previewColors} compact layout="preview-first" />
              ) : (
                <div className="h-full min-h-[200px] flex items-center justify-center rounded-xl border border-dashed border-gray-600/50 bg-gray-800/30">
                  <p className="text-gray-500 text-sm text-center px-4">
                    Selecciona una paleta a la izquierda para ver ejemplos de aplicación.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Columna derecha: avatar + opciones Mi perfil, Ajustes, Cerrar sesión — más visible y algo blanquecino */}
        <div className="rounded-2xl p-5 flex flex-col min-h-0 overflow-y-auto inspiration-scroll-area max-h-full border border-gray-500/50 bg-gray-500/40 shadow-lg shadow-black/20">
          {/* Círculo con imagen — más grande; hover "Personalizar" abre modal de arquetipos */}
          <div className="flex flex-col items-center mb-6">
            <button
              type="button"
              onClick={() => setShowAvatarModal(true)}
              className="relative group rounded-full ring-2 ring-gray-600/50 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
              aria-label="Personalizar avatar"
            >
              <div className="w-40 h-40 sm:w-44 sm:h-44 rounded-full overflow-hidden bg-gray-800 flex items-center justify-center relative">
                {avatarColumn ? (
                  <AvatarPreview column={avatarColumn} selections={avatarAxisSelections} />
                ) : displayAvatar ? (
                  <img src={displayAvatar} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-5xl sm:text-6xl font-bold text-violet-400/90">
                    {getInitials(fullName || undefined, email)}
                  </span>
                )}
              </div>
              <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-sm font-medium text-white drop-shadow">Personalizar</span>
              </div>
            </button>
            {avatarMessage === 'ok' && (
              <p className="text-xs text-emerald-400 mt-2 text-center">Avatar guardado en tu cuenta</p>
            )}
            {avatarMessage === 'error' && (
              <p className="text-xs text-red-400 mt-2 text-center">No se pudo guardar. Inténtalo de nuevo.</p>
            )}
          </div>

          <AvatarPersonalizationModal
            open={showAvatarModal}
            onClose={() => {
              setShowAvatarModal(false);
              setAvatarMessage(null);
            }}
            initialColumn={avatarColumn}
            initialSelections={avatarAxisSelections}
            onSave={async (col, sel) => {
              setAvatarMessage(null);
              setAvatarSaving(true);
              const { error } = await updateProfile({ avatar_archetype: { column: col, selections: sel } });
              setAvatarSaving(false);
              if (error) {
                setAvatarMessage('error');
                return;
              }
              setAvatarColumn(col);
              setAvatarAxisSelections(sel);
              setShowAvatarModal(false);
              setAvatarMessage('ok');
            }}
            saving={avatarSaving}
          />

          {/* Opciones: Mi perfil, Ajustes, Cerrar sesión — más distinguibles */}
          <div className="space-y-2.5">
            {/* Mi perfil (expandible) */}
            <div className="rounded-xl border border-gray-500/50 overflow-hidden bg-gray-600/40 shadow-md">
              <button
                type="button"
                onClick={() => setRightPanelOpen((o) => (o === 'perfil' ? null : 'perfil'))}
                className={cn(
                  'w-full flex items-center justify-between gap-2 py-4 px-4 text-left text-sm font-medium transition-colors',
                  rightPanelOpen === 'perfil'
                    ? 'bg-violet-500/30 text-white border-violet-500/50'
                    : 'text-white bg-gray-600/50 hover:bg-gray-500/60'
                )}
              >
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4 text-violet-400" />
                  Mi perfil
                </span>
                {rightPanelOpen === 'perfil' ? (
                  <ChevronDown className="w-4 h-4 shrink-0 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 shrink-0 text-gray-400" />
                )}
              </button>
              {rightPanelOpen === 'perfil' && (
                <div className="border-t border-gray-700/50 bg-gray-800/60 p-4 space-y-3">
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={cn(inputClass, 'text-sm py-2')}
                    placeholder="Nombre para mostrar"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={cn(inputClass, 'text-sm py-2')}
                    placeholder="Correo electrónico"
                  />
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    disabled={profileSaving}
                    className="w-full py-2 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-medium"
                  >
                    {profileSaving ? 'Guardando…' : 'Guardar cambios'}
                  </button>
                  {profileMessage === 'ok' && (
                    <p className="text-xs text-emerald-400">
                      Perfil actualizado.
                      {email.trim() !== (user?.email ?? '') && (
                        <> Revisa la nueva dirección de correo y haz clic en el enlace que te hemos enviado para confirmar el cambio.</>
                      )}
                    </p>
                  )}
                  {profileMessage === 'error' && <p className="text-xs text-red-400">No se pudo actualizar. Si has cambiado el correo, comprueba que no esté ya en uso.</p>}
                </div>
              )}
            </div>

            {/* Ajustes (expandible: contraseña + olvidaste + eliminar cuenta) */}
            <div className="rounded-xl border border-gray-500/50 overflow-hidden bg-gray-600/40 shadow-md">
              <button
                type="button"
                onClick={() => setRightPanelOpen((o) => (o === 'ajustes' ? null : 'ajustes'))}
                className={cn(
                  'w-full flex items-center justify-between gap-2 py-4 px-4 text-left text-sm font-medium transition-colors',
                  rightPanelOpen === 'ajustes'
                    ? 'bg-violet-500/30 text-white border-violet-500/50'
                    : 'text-white bg-gray-600/50 hover:bg-gray-500/60'
                )}
              >
                <span className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-violet-400" />
                  Ajustes
                </span>
                {rightPanelOpen === 'ajustes' ? (
                  <ChevronDown className="w-4 h-4 shrink-0 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 shrink-0 text-gray-400" />
                )}
              </button>
              {rightPanelOpen === 'ajustes' && (
                <div className="border-t border-gray-700/50 bg-gray-800/60 p-4 space-y-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-2">Cambiar contraseña</p>
                    <div className="relative mb-2">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className={cn(inputClass, 'text-sm py-2 pr-10')}
                        placeholder="Nueva contraseña"
                        minLength={6}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword((v) => !v)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors"
                        aria-label={showNewPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                        tabIndex={-1}
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <div className="relative mb-2">
                      <input
                        type={showNewPasswordConfirm ? 'text' : 'password'}
                        value={newPasswordConfirm}
                        onChange={(e) => setNewPasswordConfirm(e.target.value)}
                        className={cn(inputClass, 'text-sm py-2 pr-10')}
                        placeholder="Repetir contraseña"
                        minLength={6}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPasswordConfirm((v) => !v)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors"
                        aria-label={showNewPasswordConfirm ? 'Ocultar contraseña' : 'Ver contraseña'}
                        tabIndex={-1}
                      >
                        {showNewPasswordConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={handleChangePassword}
                      disabled={passwordSaving}
                      className="w-full py-2 rounded-xl bg-violet-600/65 hover:bg-violet-500/70 disabled:opacity-50 text-white text-sm font-medium flex items-center justify-center gap-1.5"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      {passwordSaving ? 'Guardando…' : 'Actualizar contraseña'}
                    </button>
                    {passwordMessage === 'ok' && <p className="text-xs text-emerald-400 mt-1">Contraseña actualizada correctamente en tu cuenta.</p>}
                    {passwordMessage && passwordMessage !== 'ok' && <p className="text-xs text-red-400 mt-1">{passwordMessage}</p>}
                  </div>
                  <div className="pt-2 border-t border-gray-700/50">
                    <button
                      type="button"
                      onClick={() => setShowDeleteModal(true)}
                      className="w-full py-2 rounded-xl border border-red-500/40 text-red-400 hover:bg-red-900/20 text-xs font-medium flex items-center justify-center gap-1.5"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Eliminar cuenta
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Cerrar sesión (siempre visible, no expandible) */}
            <button
              type="button"
              onClick={handleSignOut}
              className="w-full flex items-center justify-between gap-2 py-4 px-4 rounded-xl border border-gray-500/50 text-white bg-gray-600/50 hover:bg-gray-500/60 text-sm font-medium transition-colors shadow-md"
            >
              <span className="flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                Cerrar sesión
              </span>
              <ChevronRight className="w-4 h-4 shrink-0 text-gray-400" />
            </button>
          </div>
        </div>
        </div>
      </div>

      {/* Modal eliminar cuenta */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="rounded-2xl border border-red-900/50 bg-gray-900 p-6 max-w-md w-full shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">Eliminar cuenta</h3>
              </div>
              <p className="text-gray-300 text-sm mb-6">
                La eliminación debe realizarse desde el panel de administración. Envía un correo desde{' '}
                <strong className="text-white">{email}</strong> a soporte indicando que deseas eliminar tu cuenta.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-gray-700 hover:bg-gray-600 text-white font-medium transition-colors"
                >
                  Entendido
                </button>
                <a
                  href={`mailto:soporte@chromatica.app?subject=Eliminación de cuenta&body=Hola, solicito la eliminación de mi cuenta asociada a ${encodeURIComponent(email)}.`}
                  className="flex-1 py-2.5 rounded-xl bg-red-600/80 hover:bg-red-500/80 text-white font-medium transition-colors text-center"
                >
                  Enviar correo
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
