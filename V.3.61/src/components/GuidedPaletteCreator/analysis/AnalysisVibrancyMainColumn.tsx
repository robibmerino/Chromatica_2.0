import React from 'react';
import { ANALYSIS_CENTRAL_HEADER } from './analysisPhaseConvention';
import { buildVibrancyDiagnostics, type VibrancyAnalysisResult } from './vibrancy/vibrancyAnalysis';
import { AnalysisScoreCard } from './AnalysisScoreCard';
import { AnalysisAspectIconFocus } from './analysisAspectHeaderIcons';
import { ANALYSIS_ASPECT_UI } from './analysisAspectUiTokens';
import { AnalysisMainHeader } from './AnalysisMainHeader';
import { AnalysisDiagnosticList } from './AnalysisDiagnosticList';
import { AnalysisQuickTipCard } from './AnalysisQuickTipCard';
import { AnalysisSectionBlock } from './AnalysisSectionBlock';

type AnalysisVibrancyMainColumnProps = {
  analysis: VibrancyAnalysisResult;
  badgeLabel: string;
  badgeClassName: string;
  onAutoAdjust?: () => void;
};

function scoreDescFromScore(score: number): string {
  if (score >= 95) return 'Vibrancy excelente';
  if (score >= 85) return 'Buena jerarquía';
  if (score >= 70) return 'Vibrancy aceptable';
  if (score >= 55) return 'Mejorable';
  return 'Sin jerarquía clara';
}

export function AnalysisVibrancyMainColumn({
  analysis,
  badgeLabel,
  badgeClassName,
  onAutoAdjust,
}: AnalysisVibrancyMainColumnProps) {
  const aspectUi = ANALYSIS_ASPECT_UI.vibrancyHarmony;
  const diagnostics = React.useMemo(() => buildVibrancyDiagnostics(analysis), [analysis]);

  const distSegments = React.useMemo(
    () =>
      [
        { key: 'muted', pct: analysis.mutedPct, className: 'bg-slate-500', label: 'Apagado' },
        { key: 'medium', pct: analysis.mediumPct, className: 'bg-violet-400', label: 'Medio' },
        { key: 'vibrant', pct: analysis.vibrantPct, className: 'bg-fuchsia-500', label: 'Vibrante' },
      ].filter((s) => s.pct > 0),
    [analysis.mutedPct, analysis.mediumPct, analysis.vibrantPct]
  );

  const scoreDesc = scoreDescFromScore(analysis.score);

  return (
    <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
      <AnalysisMainHeader
        title={ANALYSIS_CENTRAL_HEADER.titleVibrancyHarmony}
        badgeLabel={badgeLabel}
        badgeClassName={badgeClassName}
        iconBoxClassName={aspectUi.iconBox}
        icon={<AnalysisAspectIconFocus className="w-5 h-5" />}
        onAutoAdjust={onAutoAdjust}
        autoAdjustClassName={aspectUi.autoAdjust!}
      />

      <AnalysisScoreCard
        title="Puntuación vibrancy"
        score={analysis.swatches.length ? analysis.score : '—'}
        description={analysis.swatches.length ? scoreDesc : 'Añade roles P…F'}
        detail="Equilibra patrón cromático global y foco visual de A/A2 frente a P/S."
        cardClassName={aspectUi.scoreCard}
        scoreClassName={aspectUi.scoreValueGradient}
      >
        <div className="grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-wide text-slate-500">Chroma medio</p>
            <p className="mt-0.5 font-mono text-sm font-bold text-slate-100">
              {analysis.swatches.length ? analysis.avgChromaPct.toFixed(1) : '—'}
            </p>
          </div>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-wide text-slate-500">Colorfulness M</p>
            <p className="mt-0.5 font-mono text-sm font-bold text-slate-100">
              {analysis.swatches.length ? analysis.colorfulnessVal.toFixed(1) : '—'}
            </p>
          </div>
          <div>
            <p className="text-[9px] font-bold uppercase tracking-wide text-slate-500">Foco A/A2</p>
            <p className="mt-0.5 font-mono text-sm font-bold text-slate-100">
              {analysis.swatches.length ? analysis.accentFocus.alignmentScore : '—'}
            </p>
          </div>
        </div>
        {analysis.swatches.length > 0 &&
          (analysis.accentFocusModifier !== 0 || analysis.score !== analysis.scoreBeforeAccentCap) && (
            <p className="mt-2 text-[10px] text-slate-500">
              Combinado: {analysis.patternScore}
              {analysis.accentFocusModifier >= 0 ? '+' : ''}
              {analysis.accentFocusModifier} → {analysis.scoreBeforeAccentCap}
              {analysis.score !== analysis.scoreBeforeAccentCap ? ` → tope ${analysis.score}` : ''}
            </p>
          )}
      </AnalysisScoreCard>

      <AnalysisSectionBlock title="Campo de energía cromática" titleClassName="uppercase tracking-wide">
        <div
          className="relative flex w-full items-center justify-center overflow-hidden rounded-xl border border-slate-700/80 bg-slate-950/80 shadow-[inset_0_0_40px_rgba(0,0,0,0.45)] aspect-[16/10]"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(30,35,60,0.95) 0%, #0a0e1a 78%)',
          }}
        >
          <div className="absolute left-3 top-3 rounded-full bg-black/50 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
            {analysis.swatches.length
              ? `${analysis.colorfulnessLabel} · M=${analysis.colorfulnessVal.toFixed(1)}`
              : '—'}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8 px-4 py-6">
            {analysis.swatches.map((s) => {
              const chroma = s.chromaPct;
              const orbSize = 24 + (chroma / 100) * 56;
              const glowSize = orbSize * 1.6;
              const glowOpacity = 0.2 + (chroma / 100) * 0.6;
              const glowBlur = 8 + (chroma / 100) * 24;
              return (
                <div key={s.role} className="flex flex-col items-center gap-2">
                  <div
                    className="relative flex items-center justify-center"
                    style={{ width: glowSize, height: glowSize }}
                  >
                    <div
                      className="absolute inset-0 animate-pulse rounded-full"
                      style={{
                        background: s.hex,
                        opacity: glowOpacity,
                        filter: `blur(${glowBlur}px)`,
                      }}
                    />
                    <div
                      className={`relative rounded-full ${s.role === 'A' || s.role === 'A2' ? 'ring-2 ring-cyan-400/70 ring-offset-2 ring-offset-slate-950' : ''}`}
                      style={{
                        background: s.hex,
                        width: orbSize,
                        height: orbSize,
                        boxShadow: `0 0 ${glowBlur}px ${s.hex}`,
                      }}
                    />
                  </div>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider ${
                      s.role === 'A' || s.role === 'A2' ? 'text-cyan-400' : 'text-slate-500'
                    }`}
                  >
                    {s.role}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </AnalysisSectionBlock>

      <section className="rounded-xl border border-slate-700/80 bg-slate-900/40 p-4 space-y-3">
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wide">
          <span className="text-slate-500">Apagado</span>
          <span className="text-slate-500">Medio</span>
          <span className="text-fuchsia-400">Vibrante</span>
        </div>
        <div className="flex flex-col gap-2">
          {analysis.swatches.map((s) => (
            <div key={s.role} className="flex items-center gap-3">
              <span
                className={`w-8 text-[11px] font-bold tabular-nums ${
                  s.role === 'A' || s.role === 'A2'
                    ? 'text-cyan-300'
                    : s.role === 'P' || s.role === 'S'
                      ? 'text-slate-400'
                      : 'text-slate-500'
                }`}
                title={s.role === 'A' || s.role === 'A2' ? 'Acento (foco visual)' : s.role === 'P' || s.role === 'S' ? 'Base marca' : undefined}
              >
                {s.role}
              </span>
              <div className="relative h-4 flex-1 overflow-hidden rounded-lg bg-gradient-to-r from-slate-600/25 via-violet-500/25 to-fuchsia-500/25">
                <div
                  className="h-full rounded-lg transition-[width] duration-500"
                  style={{
                    width: `${s.chromaPct}%`,
                    backgroundColor: s.hex,
                    boxShadow: `0 0 10px ${s.hex}`,
                  }}
                />
              </div>
              <span className="min-w-[36px] text-right font-mono text-[11px] font-bold text-slate-200">
                {s.chromaPct.toFixed(0)}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className={`rounded-xl border ${aspectUi.sectionBorder ?? 'border-fuchsia-500/25'} bg-slate-900/45 p-4 space-y-3`}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">Foco visual (A / A2)</h3>
          <span
            className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
              analysis.accentFocus.alignmentLabel === 'Óptimo'
                ? 'bg-emerald-500/15 text-emerald-300'
                : analysis.accentFocus.alignmentLabel === 'Bueno'
                  ? 'bg-cyan-500/15 text-cyan-300'
                  : analysis.accentFocus.alignmentLabel === 'Mejorable'
                    ? 'bg-amber-500/15 text-amber-300'
                    : 'bg-rose-500/15 text-rose-300'
            }`}
          >
            {analysis.accentFocus.alignmentLabel}
          </span>
        </div>
        <p className="text-[11px] leading-relaxed text-slate-500">
          Lo importante es que <span className="font-semibold text-slate-300">A</span> y{' '}
          <span className="font-semibold text-slate-300">A2</span> tengan más croma (misma escala que las barras) que{' '}
          <span className="font-semibold text-slate-300">P</span> y que <span className="font-semibold text-slate-300">S</span>,
          cada acento frente a cada base. Mínimo aceptable: superar al menos a P o a S; ideal (y requisito para nota{' '}
          <span className="font-semibold text-slate-300">100</span>): superar a ambos.
        </p>
        <div className="rounded-lg border border-slate-700/80 bg-slate-950/50 px-3 py-2.5 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-400">
            <span>
              Referencia P:{' '}
              <span className="font-mono font-bold text-slate-200">{analysis.accentFocus.chromaP.toFixed(0)}</span>
            </span>
            <span>
              Referencia S:{' '}
              <span className="font-mono font-bold text-slate-200">{analysis.accentFocus.chromaS.toFixed(0)}</span>
            </span>
          </div>
          <div className="space-y-2 border-t border-slate-700/60 pt-2">
            {analysis.accentFocus.accentVersusBases.map((row) => (
              <div
                key={row.role}
                className="flex flex-wrap items-center justify-between gap-2 rounded-md bg-slate-900/60 px-2 py-1.5"
              >
                <span className="text-[11px] font-bold text-cyan-300">
                  {row.role}{' '}
                  <span className="font-mono text-slate-200">· {row.chromaPct.toFixed(0)}</span>
                </span>
                <div className="flex flex-wrap gap-2 text-[10px] font-semibold">
                  <span className={row.beatsP ? 'text-emerald-400' : 'text-rose-400/90'}>
                    vs P {row.beatsP ? '✓' : '✗'}
                  </span>
                  <span className={row.beatsS ? 'text-emerald-400' : 'text-rose-400/90'}>
                    vs S {row.beatsS ? '✓' : '✗'}
                  </span>
                  {row.beatsBothBases ? (
                    <span className="text-cyan-400/90">ambos</span>
                  ) : (
                    <span className="text-amber-400/90">falta uno</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-1 flex justify-between text-[10px] font-semibold text-slate-500">
            <span>Índice alineación foco</span>
            <span className="font-mono text-slate-300">{analysis.accentFocus.alignmentScore}/100</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-500 transition-all duration-500"
              style={{ width: `${analysis.accentFocus.alignmentScore}%` }}
            />
          </div>
        </div>
      </section>

      <AnalysisSectionBlock title="Distribución vibrancy">
        <div className="flex h-8 overflow-hidden rounded-md border border-slate-700">
          {distSegments.map((seg) => (
            <div
              key={seg.key}
              className={`${seg.className} flex items-center justify-center text-[11px] font-bold text-white/95`}
              style={{ width: `${seg.pct}%` }}
            >
              {seg.pct >= 15 ? `${Math.round(seg.pct)}%` : ''}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-slate-500">
          <span>Apagados {Math.round(analysis.mutedPct)}%</span>
          <span>Medios {Math.round(analysis.mediumPct)}%</span>
          <span>Vibrantes {Math.round(analysis.vibrantPct)}%</span>
        </div>
      </AnalysisSectionBlock>

      <AnalysisSectionBlock title="Diagnóstico">
        <AnalysisDiagnosticList diagnostics={diagnostics} />
      </AnalysisSectionBlock>

      <AnalysisQuickTipCard>
        La <span className="font-semibold text-cyan-200">jerarquía de vibrancy</span> suele funcionar mejor con 1–2
        colores muy saturados como foco (habitualmente <span className="font-semibold text-cyan-200">A y/o A2</span>), y
        el resto en tonos medios o apagados que les den protagonismo frente a P y S. La nota 100 exige además que A y A2
        superen en croma a P y a S, cada uno.
      </AnalysisQuickTipCard>
    </div>
  );
}
