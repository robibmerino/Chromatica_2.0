import React from 'react';
import { ANALYSIS_REFERENCES } from './analysisReferences';
import { ANALYSIS_RIGHT_ASIDE } from './analysisPhaseConvention';
import { AnalysisPaletteAsideSection } from './AnalysisPaletteAsideSection';
import type { ColorItem } from '../../../types/guidedPalette';
import type { EditingColor, InfoPanelKey, ReferenceItem, SupportSwatch } from './types';

type AnalysisContrastRightAsideProps = {
  effectiveColors: ColorItem[];
  effectiveSupportColors: SupportSwatch[] | null | undefined;
  resetSupportPalette: (() => void) | undefined;
  supportResetButtonRef: React.RefObject<HTMLButtonElement | null>;
  supportResetTooltipRect: DOMRect | null;
  setSupportResetTooltipRect: (rect: DOMRect | null) => void;
  setEditingColor: (v: EditingColor) => void;
  setDraftHex: (hex: string) => void;
  openInfoPanels: Record<InfoPanelKey, boolean>;
  toggleInfoPanel: (panel: InfoPanelKey) => void;
  onOpenReference: (r: ReferenceItem) => void;
};

export function AnalysisContrastRightAside({
  effectiveColors,
  effectiveSupportColors,
  resetSupportPalette,
  supportResetButtonRef,
  supportResetTooltipRect,
  setSupportResetTooltipRect,
  setEditingColor,
  setDraftHex,
  openInfoPanels,
  toggleInfoPanel,
  onOpenReference,
}: AnalysisContrastRightAsideProps) {
  return (
    <aside className="hidden md:flex flex-col rounded-2xl bg-gray-800/45 backdrop-blur-sm border border-gray-700/50 px-3.5 py-3 gap-3 overflow-hidden h-full">
      <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-1">
        <AnalysisPaletteAsideSection
          effectiveColors={effectiveColors}
          effectiveSupportColors={effectiveSupportColors}
          resetSupportPalette={resetSupportPalette}
          supportResetButtonRef={supportResetButtonRef}
          supportResetTooltipRect={supportResetTooltipRect}
          setSupportResetTooltipRect={setSupportResetTooltipRect}
          setEditingColor={setEditingColor}
          setDraftHex={setDraftHex}
        />

        <section className="mt-3 space-y-3">
          <div className="rounded-xl bg-gray-800/55 backdrop-blur-sm border border-gray-700/60 px-3 py-3">
            <button
              type="button"
              onClick={() => toggleInfoPanel('ratio')}
              className="w-full flex items-center justify-between gap-3 text-left"
              aria-expanded={openInfoPanels.ratio}
            >
              <h4 className="flex items-center gap-2 text-[12px] font-semibold text-gray-100">
                <svg
                  viewBox="0 0 24 24"
                  className="w-3.5 h-3.5 text-cyan-400"
                  aria-hidden
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
                {ANALYSIS_RIGHT_ASIDE.firstPanelTitle.textContrastRatio}
              </h4>
              <svg
                viewBox="0 0 20 20"
                className={`w-4 h-4 text-gray-400 transition-transform ${openInfoPanels.ratio ? 'rotate-180' : ''}`}
                aria-hidden
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path d="M5 7.5 10 12.5 15 7.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {openInfoPanels.ratio && (
              <>
                <p className="mt-2 text-[12px] leading-relaxed text-gray-300">
                  El <span className="text-cyan-300 font-semibold">ratio de contraste</span> mide la diferencia de
                  luminancia relativa entre dos colores superpuestos (texto / fondo). Se expresa como N:1, donde 21:1
                  es el máximo (blanco sobre negro).
                </p>
                <div className="mt-3 flex gap-1.5">
                  <div className="flex-1 rounded-md bg-gray-900/80 border border-gray-700/70 px-2.5 py-1.5 text-center">
                    <p className="text-[11px] font-semibold text-gray-100">AA</p>
                    <p className="mt-0.5 text-[10px] text-gray-400">≥ 4.5:1</p>
                  </div>
                  <div className="flex-1 rounded-md bg-gray-900/80 border border-gray-700/70 px-2.5 py-1.5 text-center">
                    <p className="text-[11px] font-semibold text-gray-100">AA grande</p>
                    <p className="mt-0.5 text-[10px] text-gray-400">≥ 3:1</p>
                  </div>
                  <div className="flex-1 rounded-md bg-gray-900/80 border border-gray-700/70 px-2.5 py-1.5 text-center">
                    <p className="text-[11px] font-semibold text-gray-100">AAA</p>
                    <p className="mt-0.5 text-[10px] text-gray-400">≥ 7:1</p>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="rounded-xl bg-gray-800/55 backdrop-blur-sm border border-gray-700/60 px-3 py-3">
            <button
              type="button"
              onClick={() => toggleInfoPanel('importance')}
              className="w-full flex items-center justify-between gap-3 text-left"
              aria-expanded={openInfoPanels.importance}
            >
              <h4 className="flex items-center gap-2 text-[12px] font-semibold text-gray-100">
                <svg
                  viewBox="0 0 24 24"
                  className="w-3.5 h-3.5 text-cyan-400"
                  aria-hidden
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                {ANALYSIS_RIGHT_ASIDE.whyItMatters}
              </h4>
              <svg
                viewBox="0 0 20 20"
                className={`w-4 h-4 text-gray-400 transition-transform ${openInfoPanels.importance ? 'rotate-180' : ''}`}
                aria-hidden
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path d="M5 7.5 10 12.5 15 7.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {openInfoPanels.importance && (
              <p className="mt-2 text-[12px] leading-relaxed text-gray-300">
                Cerca del <span className="text-cyan-300 font-semibold">15% de la población mundial</span>{' '}
                experimenta algún tipo de discapacidad, y las deficiencias visuales son las más prevalentes. Un contraste
                suficiente garantiza legibilidad en condiciones adversas: pantallas con brillo bajo, luz solar directa o
                usuarios con baja visión.
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 px-3 py-3">
            <button
              type="button"
              onClick={() => toggleInfoPanel('tip')}
              className="w-full flex items-center justify-between gap-3 text-left"
              aria-expanded={openInfoPanels.tip}
            >
              <h5 className="flex items-center gap-2 text-[11px] font-semibold text-emerald-300">
                <svg
                  viewBox="0 0 24 24"
                  className="w-3.5 h-3.5"
                  aria-hidden
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 18h6" />
                  <path d="M10 22h4" />
                  <path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z" />
                </svg>
                {ANALYSIS_RIGHT_ASIDE.quickTip}
              </h5>
              <svg
                viewBox="0 0 20 20"
                className={`w-4 h-4 text-emerald-300/80 transition-transform ${openInfoPanels.tip ? 'rotate-180' : ''}`}
                aria-hidden
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path d="M5 7.5 10 12.5 15 7.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {openInfoPanels.tip && (
              <p className="mt-1.5 text-[11px] leading-relaxed text-emerald-50/90">
                Ajustar la <span className="font-semibold">luminosidad</span> entre un 5‑15% suele ser suficiente para
                pasar WCAG AA sin alterar la identidad cromática de tu paleta.
              </p>
            )}
          </div>

          <div className="rounded-xl bg-gray-800/55 backdrop-blur-sm border border-gray-700/60 px-3 py-3 space-y-2">
            <button
              type="button"
              onClick={() => toggleInfoPanel('references')}
              className="w-full flex items-center justify-between gap-3 text-left"
              aria-expanded={openInfoPanels.references}
            >
              <h4 className="flex items-center gap-2 text-[12px] font-semibold text-gray-100">
                <svg
                  viewBox="0 0 24 24"
                  className="w-3.5 h-3.5 text-indigo-400"
                  aria-hidden
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                </svg>
                {ANALYSIS_RIGHT_ASIDE.references}
              </h4>
              <svg
                viewBox="0 0 20 20"
                className={`w-4 h-4 text-gray-400 transition-transform ${openInfoPanels.references ? 'rotate-180' : ''}`}
                aria-hidden
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path d="M5 7.5 10 12.5 15 7.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {openInfoPanels.references && (
              <div className="space-y-2 mt-2">
                {ANALYSIS_REFERENCES.map((reference) => (
                  <button
                    key={reference.id}
                    type="button"
                    onClick={() => onOpenReference(reference)}
                    className="w-full text-left rounded-xl border border-gray-700/70 bg-gray-900/80 px-3 py-2 hover:border-blue-400/60 hover:bg-gray-800/80 transition-colors"
                  >
                    <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-indigo-200">
                      {reference.category}
                    </p>
                    <p className="mt-1 text-[12px] font-semibold text-gray-50">{reference.title}</p>
                    <p className="text-[11px] text-gray-400">{reference.authors}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </aside>
  );
}
