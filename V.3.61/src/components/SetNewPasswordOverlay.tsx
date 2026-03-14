import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

const inputClass =
  'w-full px-3 py-2.5 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-transparent';

/**
 * Overlay que se muestra cuando el usuario ha llegado desde el enlace de
 * "restablecer contraseña" (type=recovery). Permite establecer la nueva contraseña.
 */
export function SetNewPasswordOverlay() {
  const { user, needsPasswordUpdate, updatePassword, clearNeedsPasswordUpdate, error, clearError } = useAuth();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      clearError();
      setLocalError(null);
      if (password.length < 6) {
        setLocalError('La contraseña debe tener al menos 6 caracteres.');
        return;
      }
      if (password !== confirm) {
        setLocalError('Las contraseñas no coinciden.');
        return;
      }
      setSubmitting(true);
      const { error: err } = await updatePassword(password);
      setSubmitting(false);
      if (err) setLocalError(err);
    },
    [password, confirm, updatePassword, clearError]
  );

  const handleLater = useCallback(() => {
    clearNeedsPasswordUpdate();
    clearError();
    setLocalError(null);
  }, [clearNeedsPasswordUpdate, clearError]);

  if (!needsPasswordUpdate || !user) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm rounded-xl bg-gray-900 border border-gray-700 shadow-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-1">Nueva contraseña</h2>
        <p className="text-gray-400 text-sm mb-6">
          Has llegado desde el enlace de restablecimiento. Elige una contraseña nueva para tu cuenta.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          {(error || localError) && (
            <p className="text-sm text-red-400 bg-red-900/20 rounded-lg px-3 py-2">
              {localError ?? error}
            </p>
          )}
          <div>
            <label htmlFor="new-password" className="block text-sm font-medium text-gray-300 mb-1">
              Nueva contraseña
            </label>
            <input
              id="new-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
              className={inputClass}
              placeholder="••••••••"
            />
            <p className="text-xs text-gray-500 mt-1">Mínimo 6 caracteres</p>
          </div>
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-300 mb-1">
              Repetir contraseña
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
              className={inputClass}
              placeholder="••••••••"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? '...' : 'Guardar contraseña'}
            </button>
            <button
              type="button"
              onClick={handleLater}
              className="px-4 py-3 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 transition-colors text-sm"
            >
              Más tarde
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
