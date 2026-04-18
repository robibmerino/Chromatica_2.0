import React from 'react';
import { ANALYSIS_CENTRAL_HEADER } from './analysisPhaseConvention';
import { AnalysisDiagnosticList } from './AnalysisDiagnosticList';
import { AnalysisMainHeader } from './AnalysisMainHeader';
import { AnalysisQuickTipCard } from './AnalysisQuickTipCard';
import { AnalysisScoreCard } from './AnalysisScoreCard';
import { AnalysisSectionBlock } from './AnalysisSectionBlock';
import { HarmonyPatternMiniWheel } from './harmony/HarmonyPatternMiniWheel';
import { buildHarmonyDiagnostics, type HarmonyAnalysisResult } from './harmony/harmonyAnalysis';

type AnalysisHarmonyMainColumnProps = {
  analysis: HarmonyAnalysisResult;
  badgeLabel: string;
  badgeClassName: string;
  onAutoAdjust?: () => void;
};

function markerPosition(h: number): { left: string; top: string } {
  const angle = ((h - 90) * Math.PI) / 180;
  const radius = 42;
  const x = 50 + Math.cos(angle) * radius;
  const y = 50 + Math.sin(angle) * radius;
  return { left: `${x}%`, top: `${y}%` };
}

export function AnalysisHarmonyMainColumn({
  analysis,
  badgeLabel,
  badgeClassName,
  onAutoAdjust,
}: AnalysisHarmonyMainColumnProps) {
  const diagnostics = React.useMemo(() => buildHarmonyDiagnostics(analysis), [analysis]);

  return (
    <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
      <AnalysisMainHeader
        title={ANALYSIS_CENTRAL_HEADER.titleChromaticHarmony}
        badgeLabel={badgeLabel}
        badgeClassName={badgeClassName}
        onAutoAdjust={onAutoAdjust}
        autoAdjustClassName="bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:from-violet-400 hover:to-fuchsia-400"
        iconBoxClassName="bg-violet-500/15 text-violet-300"
        icon={
          <svg
            viewBox="0 0 24 24"
            className="w-5 h-5"
            aria-hidden
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        }
      />

      <AnalysisScoreCard
        title="Armonía cromática"
        score={analysis.swatches.length ? analysis.score : '—'}
        description={analysis.swatches.length ? analysis.scoreDesc : 'Añade roles P…A2'}
        detail="Ocho patrones (como en Armonía de color). Por patrón: se prueba cada rotación de la plantilla; cada tono se asigna al ancla más cercana. Nota base = 100 − 50·(distancia media° / tolerancia). Solo si faltan tonos para el mínimo del patrón se restan 5 puntos por tono que falta."
        cardClassName="border-violet-500/25 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10"
        scoreClassName="bg-gradient-to-r from-violet-400 to-fuchsia-300"
      >
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-wide text-slate-500">Patrón</p>
            <p className="mt-0.5 text-xs font-semibold text-slate-200 truncate">
              {analysis.bestPattern?.name ?? '—'}
            </p>
          </div>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-wide text-slate-500">Rango tonal</p>
            <p className="mt-0.5 font-mono text-sm font-bold text-slate-100">{analysis.hueRange}°</p>
          </div>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-wide text-slate-500">Neutros</p>
            <p className="mt-0.5 font-mono text-sm font-bold text-slate-100">{analysis.neutralCount}</p>
          </div>
        </div>
      </AnalysisScoreCard>

      <AnalysisSectionBlock title="Posición de tonos en la rueda cromática" titleClassName="uppercase tracking-wide">
        <div className="relative mx-auto aspect-square w-full max-w-[360px] rounded-full border border-slate-700/70 bg-slate-950/60 p-6">
          <div
            className="absolute inset-5 rounded-full"
            style={{
              background:
                'conic-gradient(from 0deg, hsl(0,100%,50%), hsl(30,100%,50%), hsl(60,100%,50%), hsl(90,100%,50%), hsl(120,100%,50%), hsl(150,100%,50%), hsl(180,100%,50%), hsl(210,100%,50%), hsl(240,100%,50%), hsl(270,100%,50%), hsl(300,100%,50%), hsl(330,100%,50%), hsl(360,100%,50%))',
            }}
          />
          <div className="absolute inset-[24%] rounded-full border border-slate-700/80 bg-slate-950/95" />
          {analysis.chromatic.map((swatch) => {
            const pos = markerPosition(swatch.h);
            return (
              <div
                key={swatch.role}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: pos.left, top: pos.top }}
              >
                <div
                  className="h-6 w-6 rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.3)]"
                  style={{ backgroundColor: swatch.hex }}
                />
                <span className="absolute left-1/2 top-7 -translate-x-1/2 rounded bg-black/55 px-1 text-[9px] font-bold text-slate-200">
                  {swatch.role}
                </span>
              </div>
            );
          })}
          <div className="absolute inset-[34%] flex flex-col items-center justify-center text-center">
            <p className="text-[11px] font-semibold text-slate-400">
              {analysis.bestPattern ? analysis.bestPattern.name : 'Sin patrón'}
            </p>
            <p className="text-[10px] text-slate-500">
              {analysis.bestPattern ? analysis.bestPattern.desc : 'Añade tonos cromáticos'}
            </p>
          </div>
        </div>
      </AnalysisSectionBlock>

      <AnalysisSectionBlock title="Ajuste a patrones armónicos">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
          {analysis.patternScores.map((pattern) => {
            const isBest = pattern.id === analysis.bestPattern?.id;
            const scoreClass =
              pattern.score >= 75
                ? 'text-emerald-300'
                : pattern.score >= 50
                  ? 'text-amber-300'
                  : 'text-rose-300';
            return (
              <div
                key={pattern.id}
                className={`rounded-xl border px-3 py-2.5 text-center ${
                  isBest
                    ? 'border-emerald-500/40 bg-emerald-500/5'
                    : 'border-slate-700/80 bg-slate-900/60'
                }`}
              >
                <HarmonyPatternMiniWheel anglesDegrees={pattern.angles} className="mb-1.5" />
                <p className="text-xs font-semibold text-slate-100">{pattern.name}</p>
                <p className={`mt-1 text-sm font-bold ${scoreClass}`}>{pattern.score}%</p>
                <p className="mt-0.5 text-[10px] text-slate-500">{pattern.desc}</p>
                {isBest ? (
                  <span className="mt-1.5 inline-flex rounded-full bg-emerald-500/15 px-2 py-0.5 text-[9px] font-bold text-emerald-300">
                    Mejor ajuste
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>
      </AnalysisSectionBlock>

      <AnalysisSectionBlock title="Distribución de tonos en el espectro">
        <div className="space-y-3 rounded-xl border border-slate-700/80 bg-slate-900/40 p-4">
          <div
            className="relative h-7 rounded-md border border-slate-700"
            style={{
              background:
                'linear-gradient(to right, hsl(0,100%,50%), hsl(30,100%,50%), hsl(60,100%,50%), hsl(90,100%,50%), hsl(120,100%,50%), hsl(150,100%,50%), hsl(180,100%,50%), hsl(210,100%,50%), hsl(240,100%,50%), hsl(270,100%,50%), hsl(300,100%,50%), hsl(330,100%,50%), hsl(360,100%,50%))',
            }}
          >
            {analysis.chromatic.map((swatch) => (
              <div
                key={`strip-${swatch.role}`}
                className="absolute top-1/2 h-8 w-2 -translate-x-1/2 -translate-y-1/2 rounded border border-white/90 shadow-md"
                style={{ left: `${(swatch.h / 360) * 100}%`, backgroundColor: swatch.hex }}
                title={`${swatch.role} · ${Math.round(swatch.h)}°`}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {analysis.swatches.map((swatch) => (
              <span
                key={`chip-${swatch.role}`}
                className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[10px] ${
                  swatch.isNeutral
                    ? 'border-slate-700 bg-slate-800/70 text-slate-400'
                    : 'border-slate-700 bg-slate-900/70 text-slate-200'
                }`}
              >
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full border border-white/20"
                  style={{ backgroundColor: swatch.hex }}
                />
                {swatch.role} · {swatch.isNeutral ? 'Neutro' : `${Math.round(swatch.h)}°`}
              </span>
            ))}
          </div>
        </div>
      </AnalysisSectionBlock>

      <AnalysisSectionBlock title="Diagnóstico">
        <AnalysisDiagnosticList diagnostics={diagnostics} />
      </AnalysisSectionBlock>

      <AnalysisQuickTipCard>
        No existe un patrón universalmente mejor: lo clave es la{' '}
        <span className="font-semibold text-cyan-200">coherencia tonal</span>. Si hay dispersión, usa el autoajuste para
        acercar P/S/A/A2 a una geometría más clara.
      </AnalysisQuickTipCard>
    </div>
  );
}
