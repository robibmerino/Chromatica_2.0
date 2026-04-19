import React from 'react';
import { ANALYSIS_CENTRAL_HEADER, ANALYSIS_CENTRAL_SECTION } from './analysisPhaseConvention';
import {
  type PosterPerceptualEvaluatedRow,
  posterPerceptualDimensionScores,
} from './perceptual/posterPerceptualDeltaE';
import { AnalysisScoreCard } from './AnalysisScoreCard';
import { AnalysisAspectIconProximity } from './analysisAspectHeaderIcons';
import { ANALYSIS_ASPECT_UI } from './analysisAspectUiTokens';
import { AnalysisMainHeader } from './AnalysisMainHeader';
import { AnalysisSectionBlock } from './AnalysisSectionBlock';

/** Colores del póster: roles de paleta principal y apoyo usados en el mockup. */
export type PosterUiColors = {
  P: string;
  S: string;
  A: string;
  A2: string;
  F: string;
  Sf: string;
  I: string;
};

type AnalysisNonTextMainColumnProps = {
  posterColors: PosterUiColors;
  evaluatedRows: PosterPerceptualEvaluatedRow[];
  badgeLabel: string;
  badgeClassName: string;
  onAutoAdjust?: () => void;
};

export function AnalysisNonTextMainColumn({
  posterColors,
  evaluatedRows,
  badgeLabel,
  badgeClassName,
  onAutoAdjust,
}: AnalysisNonTextMainColumnProps) {
  const aspectUi = ANALYSIS_ASPECT_UI.perceptualDeltaE;
  const { P, S, A, A2 } = posterColors;
  const dim = React.useMemo(() => posterPerceptualDimensionScores(evaluatedRows), [evaluatedRows]);
  const scoreDesc = React.useMemo(() => {
    const s = dim.overallPercent;
    if (s >= 95) return 'Póster excelente';
    if (s >= 80) return 'Buen rendimiento';
    if (s >= 65) return 'Aceptable';
    if (s >= 50) return 'Mejorable';
    return 'Con conflictos';
  }, [dim.overallPercent]);

  const dimPill = (label: string, pct: number) => (
    <div
      key={label}
      className="flex flex-col gap-0.5 rounded-lg border border-slate-700/90 bg-slate-950/50 px-2.5 py-1.5 min-w-[4.5rem]"
    >
      <span className="text-[9px] uppercase tracking-wide text-slate-500">{label}</span>
      <span className={`text-sm font-bold font-mono ${pct >= 85 ? 'text-emerald-400' : pct >= 50 ? 'text-amber-300' : 'text-rose-400'}`}>
        {pct}%
      </span>
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
      <AnalysisMainHeader
        title={ANALYSIS_CENTRAL_HEADER.titlePosterTriAnalysis}
        badgeLabel={badgeLabel}
        badgeClassName={badgeClassName}
        iconBoxClassName={aspectUi.iconBox}
        icon={<AnalysisAspectIconProximity className="w-5 h-5" />}
        onAutoAdjust={onAutoAdjust}
        autoAdjustClassName={aspectUi.autoAdjust!}
      />

      <AnalysisScoreCard
        title="Puntuación póster"
        score={dim.overallPercent}
        description={scoreDesc}
        detail="Promedio de % de cumplimiento en ΔE₀₀, ratio Y y |ΔL*| sobre pares evaluados."
        cardClassName={aspectUi.scoreCard}
        scoreClassName={aspectUi.scoreValueGradient}
      >
        <p className="text-[10px] font-medium text-slate-500 mb-1.5">
          {ANALYSIS_CENTRAL_SECTION.posterDimensionSummaryCaption}
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {dimPill('ΔE₀₀', dim.deltaEPercent)}
          {dimPill('Y ratio', dim.luminancePercent)}
          {dimPill('|L*|', dim.deltaLStarPercent)}
          {dimPill('Global', dim.overallPercent)}
        </div>
      </AnalysisScoreCard>

      <div className="flex flex-col xl:flex-row gap-5 items-stretch">
        <div className="flex-1 flex items-center justify-center rounded-2xl bg-slate-950/50 border border-slate-800/80 p-6 min-h-[320px]">
          <div
            className="relative w-full max-w-[420px] aspect-[3/4] rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
            aria-hidden
          >
            <div className="absolute inset-0" style={{ backgroundColor: P }} />

            {/* Pelotas: grande S (arriba-dcha), mediana A (izq., más abajo), pequeña A2 (dcha, más izq. y abajo) */}
            <div
              className="poster-shape absolute rounded-full w-[72%] max-w-[280px] aspect-square -top-[18%] -right-[18%] opacity-90 animate-[floatY_8s_ease-in-out_infinite]"
              style={{ backgroundColor: S }}
            />
            <div
              className="poster-shape absolute rounded-full w-[42%] max-w-[168px] aspect-square top-[58%] -translate-y-1/2 -left-[7%] opacity-82 animate-[floatY_7s_ease-in-out_infinite_0.5s]"
              style={{ backgroundColor: A }}
            />
            <div
              className="poster-shape absolute rounded-full w-[26%] max-w-[104px] aspect-square top-[54%] -translate-y-1/2 right-[14%] opacity-88 animate-[floatY_6s_ease-in-out_infinite_1s]"
              style={{ backgroundColor: A2 }}
            />

            {/* Borde acento sobre P (debajo del marco S donde se solapan) */}
            <div
              className="absolute inset-[4.2%] rounded-[1.15rem] pointer-events-none"
              style={{ borderWidth: 2, borderStyle: 'solid', borderColor: A, backgroundColor: 'transparent' }}
            />
            <div
              className="absolute inset-[6%] rounded-xl pointer-events-none"
              style={{ borderWidth: 3, borderStyle: 'solid', borderColor: S }}
            />

            <div className="absolute top-[10%] left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {[40, 60, 50, 70, 45].map((h, i) => (
                <div
                  key={i}
                  className="w-2 rounded-sm"
                  style={{
                    height: h,
                    backgroundColor: A,
                    opacity: [0.6, 0.8, 0.7, 0.9, 0.65][i],
                  }}
                />
              ))}
            </div>

            <div className="absolute top-1/2 left-1/2 z-10 flex w-[min(92%,17rem)] -translate-x-1/2 -translate-y-1/2 justify-center gap-2 sm:gap-2.5 px-0.5">
              {(
                [
                  <svg key="s" viewBox="0 0 24 24" className="h-7 w-7 sm:h-8 sm:w-8" fill={A}>
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z" />
                  </svg>,
                  <svg
                    key="c"
                    viewBox="0 0 24 24"
                    className="h-7 w-7 sm:h-8 sm:w-8"
                    fill="none"
                    stroke={A}
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>,
                  <svg
                    key="p"
                    viewBox="0 0 24 24"
                    className="h-7 w-7 sm:h-8 sm:w-8"
                    fill="none"
                    stroke={A}
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                    <line x1="12" y1="22.08" x2="12" y2="12" />
                  </svg>,
                ] as const
              ).map((icon, idx) => (
                <div
                  key={idx}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-lg sm:h-12 sm:w-12"
                  style={{
                    borderWidth: 2,
                    borderStyle: 'solid',
                    borderColor: A,
                    backgroundColor: S,
                  }}
                >
                  {icon}
                </div>
              ))}
            </div>

            <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2 flex gap-3 z-10">
              <div
                className="px-4 py-2.5 rounded-full text-xs font-bold shadow-md tracking-tight"
                style={{
                  borderWidth: 2,
                  borderStyle: 'solid',
                  borderColor: A2,
                  backgroundColor: S,
                  color: A2,
                }}
              >
                ★★★★★
              </div>
              <div
                className="px-4 py-2.5 rounded-full text-xs font-bold uppercase shadow-md tracking-wide"
                style={{
                  borderWidth: 2,
                  borderStyle: 'solid',
                  borderColor: A,
                  backgroundColor: S,
                  color: A,
                }}
              >
                PREMIUM
              </div>
            </div>
          </div>
        </div>

        <section className="w-full xl:w-[min(100%,320px)] flex-shrink-0 rounded-2xl bg-slate-900/70 border border-slate-800 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-800/80">
            <h3 className="text-sm font-semibold text-slate-200">{ANALYSIS_CENTRAL_SECTION.perceptualPosterPairsTitle}</h3>
            <p className="mt-0.5 text-[11px] text-slate-500">
              {ANALYSIS_CENTRAL_SECTION.perceptualPosterPairsSubtitle}
            </p>
            <p className="mt-1 text-[10px] text-slate-600">{ANALYSIS_CENTRAL_SECTION.perceptualPosterInformativeHint}</p>
          </div>
          <div className="px-4 py-3 space-y-4">
            <AnalysisSectionBlock
              title={ANALYSIS_CENTRAL_SECTION.posterEvaluatedPairsTitle}
              titleClassName="text-[10px] uppercase tracking-wide mb-1.5"
              className="space-y-0"
            >
              <div className="space-y-2">
                {evaluatedRows
                  .filter((r) => !r.informativeOnly)
                  .map(
                    ({
                      row,
                      deltaE00,
                      luminanceRatio,
                      absDeltaLStar,
                      passDeltaE,
                      passLuminance,
                      passDeltaLStar,
                      pass,
                    }) => {
                      const fgHex = posterColors[row.fgRole as keyof PosterUiColors] ?? posterColors.S;
                      const bgHex = posterColors[row.bgRole as keyof PosterUiColors] ?? posterColors.P;
                      const tri = (
                        <span className="text-[10px] font-mono text-slate-400 leading-tight block mt-0.5">
                          ΔE₀₀ {deltaE00.toFixed(1)}
                          <span className={passDeltaE ? ' text-emerald-400' : ' text-rose-400'}> {passDeltaE ? '✓' : '✗'}</span>
                          {' · '}
                          Y {luminanceRatio.toFixed(2)}:1
                          <span className={passLuminance ? ' text-emerald-400' : ' text-rose-400'}> {passLuminance ? '✓' : '✗'}</span>
                          {' · '}
                          |L*| {absDeltaLStar.toFixed(1)}
                          <span className={passDeltaLStar ? ' text-emerald-400' : ' text-rose-400'}> {passDeltaLStar ? '✓' : '✗'}</span>
                        </span>
                      );
                      return (
                        <div
                          key={row.id}
                          className="rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 flex flex-col gap-0.5"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="flex gap-1 flex-shrink-0">
                                <span className="w-3.5 h-3.5 rounded-full border border-white/10" style={{ backgroundColor: fgHex }} />
                                <span className="w-3.5 h-3.5 rounded-full border border-white/10" style={{ backgroundColor: bgHex }} />
                              </span>
                              <span className="text-[11px] text-slate-200 truncate">{row.name}</span>
                            </div>
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded flex-shrink-0 ${
                                pass ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/15 text-rose-300'
                              }`}
                            >
                              {pass ? '✓' : '✗'}
                            </span>
                          </div>
                          {tri}
                        </div>
                      );
                    }
                  )}
              </div>
            </AnalysisSectionBlock>
            <AnalysisSectionBlock
              title={ANALYSIS_CENTRAL_SECTION.posterInformativePairsTitle}
              titleClassName="text-[10px] uppercase tracking-wide mb-1.5"
              className="space-y-0"
            >
              <div className="space-y-2">
                {evaluatedRows
                  .filter((r) => r.informativeOnly)
                  .map(
                    ({
                      row,
                      deltaE00,
                      luminanceRatio,
                      absDeltaLStar,
                      passDeltaE,
                      passLuminance,
                      passDeltaLStar,
                    }) => {
                      const fgHex = posterColors[row.fgRole as keyof PosterUiColors] ?? posterColors.S;
                      const bgHex = posterColors[row.bgRole as keyof PosterUiColors] ?? posterColors.P;
                      const tri = (
                        <span className="text-[10px] font-mono text-slate-500 leading-tight block mt-0.5">
                          ΔE₀₀ {deltaE00.toFixed(1)}
                          <span className={passDeltaE ? ' text-slate-400' : ' text-slate-500'}> {passDeltaE ? '✓' : '✗'}</span>
                          {' · '}
                          Y {luminanceRatio.toFixed(2)}:1
                          <span className={passLuminance ? ' text-slate-400' : ' text-slate-500'}> {passLuminance ? '✓' : '✗'}</span>
                          {' · '}
                          |L*| {absDeltaLStar.toFixed(1)}
                          <span className={passDeltaLStar ? ' text-slate-400' : ' text-slate-500'}> {passDeltaLStar ? '✓' : '✗'}</span>
                        </span>
                      );
                      return (
                        <div
                          key={row.id}
                          className="rounded-lg border border-slate-800/60 bg-slate-950/40 px-3 py-2 flex flex-col gap-0.5 opacity-90"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="flex gap-1 flex-shrink-0">
                                <span className="w-3.5 h-3.5 rounded-full border border-white/10" style={{ backgroundColor: fgHex }} />
                                <span className="w-3.5 h-3.5 rounded-full border border-white/10" style={{ backgroundColor: bgHex }} />
                              </span>
                              <span className="text-[11px] text-slate-300 truncate">{row.name}</span>
                            </div>
                            <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded flex-shrink-0 bg-slate-700/50 text-slate-400">
                              Ref.
                            </span>
                          </div>
                          {tri}
                        </div>
                      );
                    }
                  )}
              </div>
            </AnalysisSectionBlock>
          </div>
        </section>
      </div>

      <style>{`
        @keyframes floatY {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
    </div>
  );
}
