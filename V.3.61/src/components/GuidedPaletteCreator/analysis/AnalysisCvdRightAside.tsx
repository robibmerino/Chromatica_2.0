import React from 'react';
import { ANALYSIS_RIGHT_ASIDE } from './analysisPhaseConvention';
import { AnalysisPaletteAsideSection } from './AnalysisPaletteAsideSection';
import { CVD_REFERENCES } from './cvd/cvdReferences';
import { CVD_TYPE_META, CVD_UI_TYPES, type CvdUiType } from './cvd/cvdAnalysis';
import type { ColorItem } from '../../../types/guidedPalette';
import type { EditingColor, ReferenceItem, SupportSwatch } from './types';

type CvdInfoKey = 'criterion' | 'why' | 'tip' | 'references';

type AnalysisCvdRightAsideProps = {
  effectiveColors: ColorItem[];
  effectiveSupportColors: SupportSwatch[] | null | undefined;
  resetSupportPalette: (() => void) | undefined;
  supportResetButtonRef: React.RefObject<HTMLButtonElement | null>;
  supportResetTooltipRect: DOMRect | null;
  setSupportResetTooltipRect: (rect: DOMRect | null) => void;
  setEditingColor: (v: EditingColor) => void;
  setDraftHex: (hex: string) => void;
  onOpenReference: (r: ReferenceItem) => void;
  selectedCvd: CvdUiType;
  onSelectedCvdChange: (type: CvdUiType) => void;
};

export function AnalysisCvdRightAside({
  effectiveColors,
  effectiveSupportColors,
  resetSupportPalette,
  supportResetButtonRef,
  supportResetTooltipRect,
  setSupportResetTooltipRect,
  setEditingColor,
  setDraftHex,
  onOpenReference,
  selectedCvd,
  onSelectedCvdChange,
}: AnalysisCvdRightAsideProps) {
  const [openPanels, setOpenPanels] = React.useState<Record<CvdInfoKey, boolean>>({
    criterion: false,
    why: false,
    tip: false,
    references: false,
  });

  const [typeInfoOpen, setTypeInfoOpen] = React.useState<Record<CvdUiType, boolean>>(() => ({
    protanopia: false,
    deuteranopia: false,
    tritanopia: false,
    achromatopsia: false,
  }));

  const toggle = React.useCallback((key: CvdInfoKey) => {
    setOpenPanels((c) => ({ ...c, [key]: !c[key] }));
  }, []);

  const toggleTypeInfo = React.useCallback((key: CvdUiType) => {
    setTypeInfoOpen((c) => ({ ...c, [key]: !c[key] }));
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
                <span className="min-w-0">{ANALYSIS_RIGHT_ASIDE.firstPanelTitle.cvdSimulation}</span>
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
                Simulamos cómo se ven los swatches <span className="font-semibold text-cyan-200">P, S, A, A2 y F</span>{' '}
                bajo dicromacías típicas usando las{' '}
                <span className="font-semibold text-cyan-200">matrices Viénot–Brettel–Mollon (1999)</span> en espacio
                sRGB lineal. La comparativa central muestra el mismo mini layout en original y simulado. Los conflictos
                listan pares cuyos colores <span className="font-semibold text-cyan-200">ya simulados</span> quedan
                cercanos en CIELAB (ΔE euclidiano; &lt;5 crítico, &lt;10 aviso) para el tipo seleccionado. La{' '}
                <span className="font-semibold text-cyan-200">nota global</span> resume cada par una sola vez con el
                peor ΔE entre protanopia, deuteranopia y tritanopia (umbral &lt; 10).
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
                Un porcentaje relevante de usuarios percibe el color distinto; paletas que solo distinguen estados por
                matiz (p. ej. rojo vs. verde) pueden volverse ambiguas. Comprobar bajo CVD reduce errores en dashboards,
                formularios y estados de sistema.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <p className="px-1 text-[10px] font-semibold tracking-[0.14em] uppercase text-amber-500/75">
              {ANALYSIS_RIGHT_ASIDE.cvdTypeInfoSectionCaption}
            </p>
            {CVD_UI_TYPES.map((type) => {
              const m = CVD_TYPE_META[type];
              const isSelected = selectedCvd === type;
              const expanded = typeInfoOpen[type];
              return (
                <div
                  key={type}
                  className={`rounded-2xl border px-3 py-3 transition-colors ${
                    isSelected
                      ? 'border-amber-400/55 bg-amber-500/10 ring-1 ring-amber-400/25'
                      : 'border-amber-500/30 bg-amber-500/5'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleTypeInfo(type)}
                    className="w-full flex items-center justify-between gap-3 text-left"
                    aria-expanded={expanded}
                    aria-current={isSelected ? 'true' : undefined}
                  >
                    <h5 className="flex min-w-0 items-center gap-2 text-[11px] font-semibold text-amber-300">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-3.5 w-3.5 shrink-0 text-amber-400"
                        aria-hidden
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      <span className="min-w-0">{m.label}</span>
                    </h5>
                    <svg
                      viewBox="0 0 20 20"
                      className={`w-4 h-4 shrink-0 text-amber-300/80 transition-transform ${
                        expanded ? 'rotate-180' : ''
                      }`}
                      aria-hidden
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.8}
                    >
                      <path d="M5 7.5 10 12.5 15 7.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  {expanded && (
                    <div className="mt-2 pt-2 border-t border-amber-500/25 space-y-2">
                      <p className="text-[10px] font-mono text-amber-200/85">{m.prevalence}</p>
                      <p className="text-[11px] leading-relaxed text-amber-50/90">{m.description}</p>
                      {!isSelected && (
                        <button
                          type="button"
                          onClick={() => onSelectedCvdChange(type)}
                          className="text-[11px] font-semibold text-amber-200 hover:text-amber-100 underline-offset-2 hover:underline"
                        >
                          Usar esta simulación en la vista central
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
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
                  <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
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
                Usa la paleta de arriba para probar cambios y revisa al instante la comparativa y los conflictos del tipo
                seleccionado. Si dos roles se acercan demasiado al simular, refuerza{' '}
                <span className="font-semibold text-emerald-200">luminancia</span>, <span className="font-semibold text-emerald-200">forma</span> o{' '}
                <span className="font-semibold text-emerald-200">texto</span> además del matiz.
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
                {CVD_REFERENCES.map((reference) => (
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
