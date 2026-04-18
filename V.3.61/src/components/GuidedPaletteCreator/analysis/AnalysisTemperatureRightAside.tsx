import React from 'react';
import { ANALYSIS_RIGHT_ASIDE } from './analysisPhaseConvention';
import { AnalysisPaletteAsideSection } from './AnalysisPaletteAsideSection';
import { TEMPERATURE_HARMONY_REFERENCES } from './temperature/temperatureHarmonyReferences';
import type { ColorItem } from '../../../types/guidedPalette';
import type { EditingColor, ReferenceItem, SupportSwatch } from './types';

type TemperatureInfoKey = 'criterion' | 'why' | 'tip' | 'references';

type AnalysisTemperatureRightAsideProps = {
  effectiveColors: ColorItem[];
  effectiveSupportColors: SupportSwatch[] | null | undefined;
  resetSupportPalette: (() => void) | undefined;
  supportResetButtonRef: React.RefObject<HTMLButtonElement | null>;
  supportResetTooltipRect: DOMRect | null;
  setSupportResetTooltipRect: (rect: DOMRect | null) => void;
  setEditingColor: (v: EditingColor) => void;
  setDraftHex: (hex: string) => void;
  onOpenReference: (r: ReferenceItem) => void;
};

export function AnalysisTemperatureRightAside({
  effectiveColors,
  effectiveSupportColors,
  resetSupportPalette,
  supportResetButtonRef,
  supportResetTooltipRect,
  setSupportResetTooltipRect,
  setEditingColor,
  setDraftHex,
  onOpenReference,
}: AnalysisTemperatureRightAsideProps) {
  const [openPanels, setOpenPanels] = React.useState<Record<TemperatureInfoKey, boolean>>({
    criterion: false,
    why: false,
    tip: false,
    references: false,
  });

  const toggle = React.useCallback((key: TemperatureInfoKey) => {
    setOpenPanels((c) => ({ ...c, [key]: !c[key] }));
  }, []);

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
              onClick={() => toggle('criterion')}
              className="w-full flex items-center justify-between gap-3 text-left"
              aria-expanded={openPanels.criterion}
            >
              <h4 className="flex min-w-0 items-center gap-2 text-[12px] font-semibold text-gray-100">
                <svg
                  viewBox="0 0 24 24"
                  className="h-3.5 w-3.5 shrink-0 text-cyan-400"
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
                <span className="min-w-0">{ANALYSIS_RIGHT_ASIDE.firstPanelTitle.temperatureHarmony}</span>
              </h4>
              <svg
                viewBox="0 0 20 20"
                className={`w-4 h-4 text-gray-400 transition-transform ${openPanels.criterion ? 'rotate-180' : ''}`}
                aria-hidden
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path d="M5 7.5 10 12.5 15 7.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {openPanels.criterion && (
              <p className="mt-2 text-[12px] leading-relaxed text-gray-300">
                Cada swatch de <span className="font-semibold text-cyan-200">P, S, A, A2 y F</span> se convierte a
                CIELAB y se calcula el índice{' '}
                <span className="font-semibold text-cyan-200">WC = −0,5 + 0,02 · (C*)^1,07 · cos(h° − 50°)</span> de Ou
                et&nbsp;al. (2004). Clasificamos cálido / neutro / frío y aplicamos reglas de composición (monotermia,
                80/20, tensión 50/50, papel de neutros) para obtener una puntuación 0–100 orientativa.
              </p>
            )}
          </div>

          <div className="rounded-xl bg-gray-800/55 backdrop-blur-sm border border-gray-700/60 px-3 py-3">
            <button
              type="button"
              onClick={() => toggle('why')}
              className="w-full flex items-center justify-between gap-3 text-left"
              aria-expanded={openPanels.why}
            >
              <h4 className="flex min-w-0 items-center gap-2 text-[12px] font-semibold text-gray-100">
                <svg
                  viewBox="0 0 24 24"
                  className="h-3.5 w-3.5 shrink-0 text-cyan-400"
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
                <span className="min-w-0">{ANALYSIS_RIGHT_ASIDE.whyItMatters}</span>
              </h4>
              <svg
                viewBox="0 0 20 20"
                className={`w-4 h-4 text-gray-400 transition-transform ${openPanels.why ? 'rotate-180' : ''}`}
                aria-hidden
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path d="M5 7.5 10 12.5 15 7.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {openPanels.why && (
              <p className="mt-2 text-[12px] leading-relaxed text-gray-300">
                La temperatura percibida cohesiona marca y UI: paletas demasiado partidas entre cálido y frío pueden
                sentirse inestables; una dominante clara con acentos controlados suele leerse más intencional.
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 px-3 py-3">
            <button
              type="button"
              onClick={() => toggle('tip')}
              className="w-full flex items-center justify-between gap-3 text-left"
              aria-expanded={openPanels.tip}
            >
              <h5 className="flex min-w-0 items-center gap-2 text-[11px] font-semibold text-emerald-300">
                <svg
                  viewBox="0 0 24 24"
                  className="h-3.5 w-3.5 shrink-0"
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
                <span className="min-w-0">{ANALYSIS_RIGHT_ASIDE.quickTip}</span>
              </h5>
              <svg
                viewBox="0 0 20 20"
                className={`w-4 h-4 text-emerald-300/80 transition-transform ${openPanels.tip ? 'rotate-180' : ''}`}
                aria-hidden
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path d="M5 7.5 10 12.5 15 7.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {openPanels.tip && (
              <p className="mt-1.5 text-[11px] leading-relaxed text-emerald-50/90">
                Usa <span className="font-semibold text-emerald-200">Auto-ajustar</span> para probar rotaciones de matiz
                y saturación en P/S/A/A2/F que suban la puntuación. Si marcas tensión 50/50, suele ayudar reforzar una
                familia en roles principales y dejar la opuesta en un solo acento o en neutros.
              </p>
            )}
          </div>

          <div className="rounded-xl bg-gray-800/55 backdrop-blur-sm border border-gray-700/60 px-3 py-3 space-y-2">
            <button
              type="button"
              onClick={() => toggle('references')}
              className="w-full flex items-center justify-between gap-3 text-left"
              aria-expanded={openPanels.references}
            >
              <h4 className="flex min-w-0 items-center gap-2 text-[12px] font-semibold text-gray-100">
                <svg
                  viewBox="0 0 24 24"
                  className="h-3.5 w-3.5 shrink-0 text-indigo-400"
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
                <span className="min-w-0">{ANALYSIS_RIGHT_ASIDE.references}</span>
              </h4>
              <svg
                viewBox="0 0 20 20"
                className={`w-4 h-4 text-gray-400 transition-transform ${openPanels.references ? 'rotate-180' : ''}`}
                aria-hidden
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path d="M5 7.5 10 12.5 15 7.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {openPanels.references && (
              <div className="space-y-2 mt-2">
                {TEMPERATURE_HARMONY_REFERENCES.map((reference) => (
                  <button
                    key={reference.id}
                    type="button"
                    onClick={() => onOpenReference(reference)}
                    className="w-full text-left rounded-xl border border-gray-700/70 bg-gray-900/80 px-3 py-2 hover:border-indigo-400/60 hover:bg-gray-800/80 transition-colors"
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
