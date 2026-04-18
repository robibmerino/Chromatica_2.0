import React from 'react';
import type { ColorItem } from '../../../types/guidedPalette';
import { AnalysisPaletteAsideSection } from './AnalysisPaletteAsideSection';
import { ANALYSIS_RIGHT_ASIDE } from './analysisPhaseConvention';
import { HARMONY_REFERENCES } from './harmony/harmonyReferences';
import type { EditingColor, ReferenceItem, SupportSwatch } from './types';

type HarmonyInfoKey = 'criterion' | 'why' | 'tip' | 'references';

type AnalysisHarmonyRightAsideProps = {
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

export function AnalysisHarmonyRightAside({
  effectiveColors,
  effectiveSupportColors,
  resetSupportPalette,
  supportResetButtonRef,
  supportResetTooltipRect,
  setSupportResetTooltipRect,
  setEditingColor,
  setDraftHex,
  onOpenReference,
}: AnalysisHarmonyRightAsideProps) {
  const [openPanels, setOpenPanels] = React.useState<Record<HarmonyInfoKey, boolean>>({
    criterion: false,
    why: false,
    tip: false,
    references: false,
  });

  const toggle = React.useCallback((key: HarmonyInfoKey) => {
    setOpenPanels((current) => ({ ...current, [key]: !current[key] }));
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
                <span className="min-w-0">{ANALYSIS_RIGHT_ASIDE.firstPanelTitle.chromaticHarmony}</span>
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
                Tomamos los <span className="font-semibold text-cyan-200">matices</span> de los roles P, S, A y A2
                con saturación suficiente y calculamos el ajuste frente a los{' '}
                <span className="font-semibold text-cyan-200">ocho patrones</span> de «Armonía de color» (misma
                geometría que al generar paletas). La puntuación combina distancia angular media al patrón rotado y una
                penalización solo si faltan tonos para el mínimo del patrón.
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
                Cuando la paleta sigue una estructura tonal clara, la interfaz se percibe más coherente y memorable. Si
                los tonos están dispersos sin patrón, la percepción puede volverse ruidosa aunque cada color por separado
                sea atractivo.
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
                suaves en P/S/A/A2 y acercar la paleta a un patrón armónico sin rehacerla desde cero.
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
                  className="h-3.5 w-3.5 shrink-0 text-violet-400"
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
              <ul className="mt-2 list-none space-y-2 p-0">
                {HARMONY_REFERENCES.map((reference) => (
                  <li key={reference.id}>
                    <button
                      type="button"
                      onClick={() => onOpenReference(reference)}
                      className="w-full text-left rounded-xl border border-gray-700/70 bg-gray-900/80 px-3 py-2 hover:border-violet-400/55 hover:bg-gray-800/80 transition-colors"
                    >
                    <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-violet-200/95">
                      {reference.category}
                    </p>
                    <p className="mt-1 text-[12px] font-semibold text-gray-50">{reference.title}</p>
                    <p className="text-[11px] text-gray-400">{reference.authors}</p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </aside>
  );
}
