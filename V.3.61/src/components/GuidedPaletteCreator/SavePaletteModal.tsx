import React, { useState, useEffect } from 'react';
import type { SavedFromSection } from '../../types/guidedPalette';
import { COPY } from './config/copy';

const SECTION_LABELS: Record<SavedFromSection, string> = {
  refinement: COPY.saveModal.sectionRefinement,
  application: COPY.saveModal.sectionApplication,
  analysis: COPY.saveModal.sectionAnalysis,
};

export interface SavePaletteModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (params: { name: string; savedFromSection: SavedFromSection; version?: number }) => void;
  section: SavedFromSection;
  suggestedName: string;
  nextVersion: number;
}

export function SavePaletteModal({
  open,
  onClose,
  onSave,
  section,
  suggestedName,
  nextVersion,
}: SavePaletteModalProps) {
  const [name, setName] = useState('');

  useEffect(() => {
    if (open) {
      setName(suggestedName);
    }
  }, [open, suggestedName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onSave({
      name: trimmed,
      savedFromSection: section,
      ...(nextVersion > 1 ? { version: nextVersion } : {}),
    });
    onClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
      role="dialog"
      aria-modal="true"
      aria-labelledby="save-palette-modal-title"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-gray-600/60 bg-gray-800/95 shadow-xl backdrop-blur-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <h2 id="save-palette-modal-title" className="text-lg font-semibold text-white mb-4">
            {COPY.saveModal.title}
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label htmlFor="save-palette-name" className="block text-sm font-medium text-gray-300 mb-1.5">
                {COPY.saveModal.nameLabel}
              </label>
              <input
                id="save-palette-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={COPY.saveModal.namePlaceholder}
                className="w-full px-4 py-3 rounded-xl bg-gray-900/80 border border-gray-600/50 text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/50 outline-none transition-all"
                autoFocus
              />
            </div>

            <p className="text-sm text-gray-400 leading-snug">
              {COPY.saveModal.profileNote}
            </p>

            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-orange-500/20 text-orange-300 border border-orange-500/30">
                {SECTION_LABELS[section]}
              </span>
              {nextVersion > 1 && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-600/50 text-gray-300 border border-gray-500/40">
                  {COPY.saveModal.versionLabel(nextVersion)}
                </span>
              )}
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-gray-600 text-gray-300 hover:bg-gray-700/50 text-sm font-medium transition-colors"
              >
                {COPY.saveModal.cancel}
              </button>
              <button
                type="submit"
                disabled={!name.trim()}
                className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-sm font-medium border border-orange-500/50 disabled:opacity-50 disabled:pointer-events-none transition-colors"
              >
                {COPY.saveModal.save}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
