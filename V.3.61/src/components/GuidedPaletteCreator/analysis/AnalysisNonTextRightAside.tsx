import React from 'react';
import { ANALYSIS_RIGHT_ASIDE } from './analysisPhaseConvention';
import { PERCEPTUAL_ANALYSIS_REFERENCES } from './perceptual/perceptualReferences';
import {
  POSTER_DELTA_E00_MIN,
  POSTER_DESIGN_LUMINANCE_RATIO_MIN,
  POSTER_MIN_ABS_DELTA_L_STAR,
} from './perceptual/posterPerceptualDeltaE';
import { AnalysisPaletteAsideSection } from './AnalysisPaletteAsideSection';
import type { ColorItem } from '../../../types/guidedPalette';
import type { EditingColor, ReferenceItem, SupportSwatch } from './types';

type NonTextInfoKey = 'criterion' | 'why' | 'tip' | 'references';

type AnalysisNonTextRightAsideProps = {
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

export function AnalysisNonTextRightAside({
  effectiveColors,
  effectiveSupportColors,
  resetSupportPalette,
  supportResetButtonRef,
  supportResetTooltipRect,
  setSupportResetTooltipRect,
  setEditingColor,
  setDraftHex,
  onOpenReference,
}: AnalysisNonTextRightAsideProps) {
  const [openPanels, setOpenPanels] = React.useState<Record<NonTextInfoKey, boolean>>({
    criterion: false,
    why: false,
    tip: false,
    references: false,
  });

  const toggle = React.useCallback((key: NonTextInfoKey) => {
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
                {ANALYSIS_RIGHT_ASIDE.firstPanelTitle.posterTriAnalysis}
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
                Tres métricas estándar, cada una con su referencia:{' '}
                <span className="text-cyan-300 font-semibold">ΔE₀₀</span> (CIEDE2000, CIE),{' '}
                <span className="text-cyan-300 font-semibold">ratio de luminancia</span> entre sRGB según definición{' '}
                <span className="text-cyan-300 font-semibold">W3C</span> (misma fórmula que en WCAG 2.x, aquí solo como
                criterio de diseño, no como 1.4.11), y{' '}
                <span className="text-cyan-300 font-semibold">|ΔL*|</span> en{' '}
                <span className="text-cyan-300 font-semibold">CIELAB</span> (eje L* de la CIE). Umbrales actuales: ΔE₀₀
                ≥ {POSTER_DELTA_E00_MIN}, Y ≥ {POSTER_DESIGN_LUMINANCE_RATIO_MIN}:1, |L*| ≥ {POSTER_MIN_ABS_DELTA_L_STAR}
                . La puntuación global del modo es el <span className="font-semibold text-cyan-200">promedio</span> del % de
                aciertos en cada dimensión.
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
                Combinar diferencia de color (CIE), separación de claridad (L*) y contraste de luminancia (W3C) reduce
                el caso “ΔE alto pero todo se ve pastel”: cada dimensión cubre un fallo que la otra no detecta bien sola.
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
                  <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                {ANALYSIS_RIGHT_ASIDE.quickTip}
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
                Mira qué tick marca ✗ (ΔE, Y o L*). El auto-ajuste alterna empujes en Lab, en L* y en luminancia del rol
                de primer plano según el déficit mayor del par más flojo.
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
                {PERCEPTUAL_ANALYSIS_REFERENCES.map((reference) => (
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
