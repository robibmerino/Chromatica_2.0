import React from 'react';
import { ANALYSIS_CENTRAL_HEADER } from './analysisPhaseConvention';
import {
  CVD_ROLES,
  CVD_TYPE_META,
  CVD_UI_TYPES,
  type CvdUiType,
  detectCvdConflicts,
  simulateCvdHex,
} from './cvd/cvdAnalysis';
import { AnalysisScoreCard } from './AnalysisScoreCard';
import { AnalysisMainHeader } from './AnalysisMainHeader';
import { AnalysisQuickTipCard } from './AnalysisQuickTipCard';
import { AnalysisSectionBlock } from './AnalysisSectionBlock';

type PosterSlice = { P: string; S: string; A: string; A2: string; F: string };

type AnalysisCvdMainColumnProps = {
  roleHexMap: Record<string, { hex: string; label: string } | undefined>;
  posterColors: PosterSlice;
  selectedCvd: CvdUiType;
  onSelectedCvdChange: (type: CvdUiType) => void;
  globalScore: number;
  globalScoreDesc: string;
  badgeLabel: string;
  badgeClassName: string;
};

function CvdMiniScene({
  poster,
  transform,
}: {
  poster: PosterSlice;
  transform: (hex: string) => string;
}) {
  const t = transform;
  return (
    <div className="relative aspect-square overflow-hidden">
      <div className="absolute inset-0" style={{ background: t(poster.F) }} />
      <div
        className="absolute rounded-full w-[60%] h-[60%] -top-[15%] -right-[15%]"
        style={{ background: t(poster.P) }}
      />
      <div
        className="absolute rounded-full w-[40%] h-[40%] bottom-[10%] -left-[10%]"
        style={{ background: t(poster.S) }}
      />
      <div
        className="absolute rounded-full w-[30%] h-[30%] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ background: t(poster.A) }}
      />
      <div
        className="absolute bottom-[20%] left-[20%] w-[60%] h-[8%] rounded-full"
        style={{ background: t(poster.A2) }}
      />
    </div>
  );
}

export function AnalysisCvdMainColumn({
  roleHexMap,
  posterColors,
  selectedCvd,
  onSelectedCvdChange,
  globalScore,
  globalScoreDesc,
  badgeLabel,
  badgeClassName,
}: AnalysisCvdMainColumnProps) {
  const conflicts = React.useMemo(
    () => detectCvdConflicts(roleHexMap, selectedCvd),
    [roleHexMap, selectedCvd]
  );

  const meta = CVD_TYPE_META[selectedCvd];
  const sim = React.useCallback((hex: string) => simulateCvdHex(hex, selectedCvd), [selectedCvd]);

  return (
    <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
      <AnalysisMainHeader
        title={ANALYSIS_CENTRAL_HEADER.titleCvdSimulation}
        badgeLabel={badgeLabel}
        badgeClassName={badgeClassName}
        iconBoxClassName="bg-pink-500/15 text-pink-300"
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
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        }
      />

      <AnalysisScoreCard
        title="Accesibilidad CVD global"
        score={globalScore}
        description={globalScoreDesc}
        detail="Por cada par P–F se usa el menor ΔE Lab entre protanopia, deuteranopia y tritanopia (peor caso); si es < 10, no cuenta como distinguible."
        cardClassName="border-cyan-500/25 bg-gradient-to-br from-fuchsia-500/10 to-cyan-500/10"
        scoreClassName="bg-gradient-to-r from-fuchsia-400 to-cyan-300"
        className="-mt-1"
      />

      <div className="grid grid-cols-4 gap-1.5 sm:gap-2 min-w-0">
        {CVD_UI_TYPES.map((type) => {
          const m = CVD_TYPE_META[type];
          const active = selectedCvd === type;
          return (
            <button
              key={type}
              type="button"
              onClick={() => onSelectedCvdChange(type)}
              aria-pressed={active}
              className={`min-w-0 rounded-lg border px-1.5 sm:px-2 py-2 text-center transition ${
                active
                  ? 'border-cyan-400/80 bg-cyan-500/10 ring-1 ring-cyan-500/25'
                  : 'border-slate-700 bg-slate-950/50 hover:border-slate-500'
              }`}
            >
              <div className="text-[11px] font-bold text-slate-100">{m.label}</div>
              <div className="text-[9px] font-semibold text-slate-500 mt-0.5">{m.prevalence}</div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div className="px-3 py-2 border-b border-slate-800 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-cyan-400">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" aria-hidden fill="none" stroke="currentColor" strokeWidth={2}>
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            Original
          </div>
          <CvdMiniScene poster={posterColors} transform={(h) => h} />
          <div className="flex gap-1 p-2">
            {CVD_ROLES.map((role) => {
              const hex = roleHexMap[role]?.hex ?? '#64748b';
              return (
                <div
                  key={role}
                  className="flex-1 h-12 rounded-md flex items-end justify-center pb-1"
                  style={{ background: hex }}
                >
                  <span className="text-[9px] font-bold text-white drop-shadow-sm">{role}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div className="px-3 py-2 border-b border-slate-800 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-violet-400">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" aria-hidden fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M12 2 2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            Simulado: {meta.label}
          </div>
          <CvdMiniScene poster={posterColors} transform={sim} />
          <div className="flex gap-1 p-2">
            {CVD_ROLES.map((role) => {
              const hex = roleHexMap[role]?.hex ?? '#64748b';
              return (
                <div
                  key={role}
                  className="flex-1 h-12 rounded-md flex items-end justify-center pb-1"
                  style={{ background: simulateCvdHex(hex, selectedCvd) }}
                >
                  <span className="text-[9px] font-bold text-white drop-shadow-sm">{role}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <AnalysisSectionBlock
        title={`Pares conflictivos (${meta.label})`}
        className="rounded-2xl bg-slate-900/70 border border-slate-800 overflow-hidden space-y-0"
        titleClassName="text-sm text-slate-200 px-4 py-2.5 border-b border-slate-800/80"
      >
        <div className="px-4 py-3 space-y-2">
          {conflicts.length === 0 ? (
            <div className="text-center py-4 text-emerald-400 text-xs font-semibold border border-dashed border-emerald-500/30 rounded-lg bg-emerald-500/5">
              Todos los pares son distinguibles bajo {meta.label}
            </div>
          ) : (
            conflicts.map((c) => {
              const badge =
                c.severity === 'critical'
                  ? 'bg-rose-500/15 text-rose-300'
                  : 'bg-amber-500/15 text-amber-300';
              const label = c.severity === 'critical' ? 'Crítico' : 'Cuidado';
              return (
                <div
                  key={`${c.role1}-${c.role2}`}
                  className="flex items-center gap-2.5 rounded-lg border border-slate-800 bg-slate-950/50 px-3 py-2"
                >
                  <div className="flex gap-0.5">
                    <span
                      className="w-5 h-5 rounded border border-white/10"
                      style={{ background: c.simHex1 }}
                    />
                    <span
                      className="w-5 h-5 rounded border border-white/10"
                      style={{ background: c.simHex2 }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-100">
                      {c.role1} ↔ {c.role2}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                      ΔE simulado: {c.deltaE.toFixed(1)}
                    </div>
                  </div>
                  <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded ${badge}`}>{label}</span>
                </div>
              );
            })
          )}
        </div>
      </AnalysisSectionBlock>

      <AnalysisQuickTipCard className="border-emerald-500/20" bodyClassName="text-xs text-slate-400">
        Si dos colores se confunden bajo CVD, varía su <span className="font-semibold text-cyan-300">luminosidad</span>{' '}
        (no solo el tono). La luminancia se preserva mejor que el matiz en dicromacías.
      </AnalysisQuickTipCard>
    </div>
  );
}
