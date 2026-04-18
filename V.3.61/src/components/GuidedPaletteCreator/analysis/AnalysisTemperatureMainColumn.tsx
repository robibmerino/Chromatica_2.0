import React from 'react';
import { hexToLabD65 } from '../../../utils/ciede2000';
import { ANALYSIS_CENTRAL_HEADER } from './analysisPhaseConvention';
import {
  buildTemperatureDiagnostics,
  type TemperatureHarmonyResult,
  warmCoolFromHex,
  wcToSpectrumPercent,
} from './temperature/temperatureHarmonyAnalysis';
import { AnalysisScoreCard } from './AnalysisScoreCard';
import { AnalysisMainHeader } from './AnalysisMainHeader';
import { AnalysisDiagnosticList } from './AnalysisDiagnosticList';
import { AnalysisQuickTipCard } from './AnalysisQuickTipCard';
import { AnalysisSectionBlock } from './AnalysisSectionBlock';

type AnalysisTemperatureMainColumnProps = {
  analysis: TemperatureHarmonyResult;
  badgeLabel: string;
  badgeClassName: string;
  onAutoAdjust?: () => void;
};

function pickDarkestHex(hexes: string[]): string {
  if (!hexes.length) return '#0c0a1f';
  return hexes.reduce((best, h) => {
    const Lb = hexToLabD65(best).L;
    const La = hexToLabD65(h).L;
    return La < Lb ? h : best;
  }, hexes[0]);
}

function atmosphereFromAnalysis(analysis: TemperatureHarmonyResult): {
  c1: string;
  c2: string;
  c3: string;
  sun: string;
  auraRgb: string;
  tag: string;
} {
  const hexes = analysis.swatches.map((s) => s.hex);
  if (!hexes.length) {
    return {
      c1: '#334155',
      c2: '#475569',
      c3: '#64748b',
      sun: '#94a3b8',
      auraRgb: '148, 163, 184',
      tag: 'Sin muestras',
    };
  }
  const sortedByWC = [...hexes].sort((a, b) => warmCoolFromHex(b) - warmCoolFromHex(a));
  const mid = sortedByWC[Math.floor(sortedByWC.length / 2)] ?? sortedByWC[0];
  const isWarmDominant = analysis.avgWC > 0.5;
  const isCoolDominant = analysis.avgWC < -0.5;

  if (isWarmDominant) {
    const c1 = sortedByWC[0];
    const c2 = mid;
    const c3 = sortedByWC[sortedByWC.length - 1];
    const sun = sortedByWC[1] ?? sortedByWC[0];
    const aura = sortedByWC[0];
    const { r, g, b } = hexToRgbForAura(aura);
    return {
      c1,
      c2,
      c3,
      sun,
      auraRgb: `${r}, ${g}, ${b}`,
      tag: 'Atardecer cálido',
    };
  }
  if (isCoolDominant) {
    const c1 = sortedByWC[sortedByWC.length - 1];
    const c2 = mid;
    const c3 = sortedByWC[0];
    const sun = sortedByWC[sortedByWC.length - 2] ?? sortedByWC[sortedByWC.length - 1];
    const aura = sortedByWC[sortedByWC.length - 1];
    const { r, g, b } = hexToRgbForAura(aura);
    return {
      c1,
      c2,
      c3,
      sun,
      auraRgb: `${r}, ${g}, ${b}`,
      tag: 'Atmósfera fría',
    };
  }
  const c1 = sortedByWC[0];
  const c2 = mid;
  const c3 = sortedByWC[sortedByWC.length - 1];
  const sun = mid;
  const aura = sortedByWC[0];
  const { r, g, b } = hexToRgbForAura(aura);
  return {
    c1,
    c2,
    c3,
    sun,
    auraRgb: `${r}, ${g}, ${b}`,
    tag: 'Atmósfera equilibrada',
  };
}

function hexToRgbForAura(hex: string): { r: number; g: number; b: number } {
  // RGB para halo (aura); parse directo del hex sRGB
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  return { r, g, b };
}

export function AnalysisTemperatureMainColumn({
  analysis,
  badgeLabel,
  badgeClassName,
  onAutoAdjust,
}: AnalysisTemperatureMainColumnProps) {
  const diagnostics = React.useMemo(() => buildTemperatureDiagnostics(analysis), [analysis]);
  const atm = React.useMemo(() => atmosphereFromAnalysis(analysis), [analysis]);
  const darkest = React.useMemo(
    () => pickDarkestHex(analysis.swatches.map((s) => s.hex)),
    [analysis.swatches]
  );

  const scoreDesc = React.useMemo(() => {
    const s = analysis.score;
    if (s >= 95) return 'Armonía excelente';
    if (s >= 85) return 'Buena armonía';
    if (s >= 70) return 'Armonía aceptable';
    if (s >= 55) return 'Mejorable';
    return 'Disonante';
  }, [analysis.score]);

  const distSegments: { key: string; pct: number; className: string; label: string }[] = [
    { key: 'cool', pct: analysis.coolPct, className: 'bg-sky-500', label: 'Frío' },
    { key: 'neutral', pct: analysis.neutralPct, className: 'bg-slate-500', label: 'Neutro' },
    { key: 'warm', pct: analysis.warmPct, className: 'bg-orange-500', label: 'Cálido' },
  ].filter((s) => s.pct > 0);

  return (
    <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
      <AnalysisMainHeader
        title={ANALYSIS_CENTRAL_HEADER.titleTemperatureHarmony}
        badgeLabel={badgeLabel}
        badgeClassName={badgeClassName}
        iconBoxClassName="bg-orange-500/15 text-orange-300"
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
            <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
          </svg>
        }
        onAutoAdjust={onAutoAdjust}
        autoAdjustClassName="bg-gradient-to-r from-orange-500 to-sky-500 hover:from-orange-400 hover:to-sky-400"
      />

      <AnalysisScoreCard
        title="Armonía térmica"
        score={analysis.swatches.length ? analysis.score : '—'}
        description={analysis.swatches.length ? scoreDesc : 'Añade roles P…F'}
        detail="Combina balance cálido/frío, neutralidad y separación térmica entre roles (escala warm-cool en CIELAB)."
        cardClassName="border-orange-500/25 bg-gradient-to-br from-orange-500/10 to-sky-500/10"
        scoreClassName="bg-gradient-to-r from-orange-400 to-sky-400"
      />

      <AnalysisSectionBlock title="Atmósfera de la paleta" titleClassName="uppercase tracking-wide">
        <div className="relative w-full overflow-hidden rounded-xl aspect-[16/10] shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
          <div
            className="absolute inset-0 transition-[background] duration-500"
            style={{
              background: `linear-gradient(180deg, ${atm.c1} 0%, ${atm.c2} 50%, ${atm.c3} 100%)`,
            }}
          />
          <div
            className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] h-[240px] rounded-full pointer-events-none transition-[background] duration-500"
            style={{
              background: `radial-gradient(circle, rgba(${atm.auraRgb},0.38) 0%, transparent 70%)`,
            }}
          />
          <div
            className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120px] h-[120px] rounded-full transition-[background,box-shadow] duration-500"
            style={{
              background: atm.sun,
              boxShadow: `0 0 80px ${atm.sun}, 0 0 140px ${atm.sun}`,
            }}
          />
          <div className="absolute bottom-0 w-full h-[35%] pointer-events-none">
            <svg viewBox="0 0 800 200" preserveAspectRatio="none" className="w-full h-full block">
              <polygon
                points="0,200 0,120 150,40 280,90 420,30 580,80 720,40 800,70 800,200"
                fill={darkest}
                opacity={0.55}
              />
              <polygon
                points="0,200 0,160 100,100 220,140 360,80 500,130 640,90 800,120 800,200"
                fill={darkest}
                opacity={0.95}
              />
            </svg>
          </div>
          <div className="absolute top-3 left-3 rounded-full bg-black/45 backdrop-blur-sm px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
            {atm.tag}
          </div>
        </div>
      </AnalysisSectionBlock>

      <section className="rounded-xl border border-slate-700/80 bg-slate-900/40 p-4 space-y-3">
        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wide">
          <span className="text-sky-400">Frío</span>
          <span className="text-slate-500">Neutro</span>
          <span className="text-orange-400">Cálido</span>
        </div>
        <div className="relative h-3.5 rounded-full overflow-visible bg-gradient-to-r from-sky-500 via-slate-400 to-orange-500">
          {analysis.swatches.map((s) => (
            <div
              key={s.role}
              className="absolute top-1/2 -translate-y-1/2 w-[22px] h-[22px] rounded-full border-[3px] border-slate-950 shadow-md -translate-x-1/2 z-[1]"
              style={{ left: `${wcToSpectrumPercent(s.wc)}%`, backgroundColor: s.hex }}
              title={`${s.role}: WC ${s.wc.toFixed(2)}`}
            >
              <span className="absolute top-[26px] left-1/2 -translate-x-1/2 text-[9px] font-bold text-slate-400 bg-slate-900/90 px-1 rounded whitespace-nowrap">
                {s.role}
              </span>
            </div>
          ))}
        </div>
      </section>

      <AnalysisSectionBlock title="Distribución térmica">
        <div className="flex h-8 rounded-md overflow-hidden border border-slate-700">
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
          <span>Fríos {Math.round(analysis.coolPct)}%</span>
          <span>Neutros {Math.round(analysis.neutralPct)}%</span>
          <span>Cálidos {Math.round(analysis.warmPct)}%</span>
        </div>
      </AnalysisSectionBlock>

      <AnalysisSectionBlock title="Diagnóstico">
        <AnalysisDiagnosticList diagnostics={diagnostics} />
      </AnalysisSectionBlock>

      <AnalysisQuickTipCard>
        La regla 80/20 sugiere una temperatura dominante con un 15–25&nbsp;% de acento opuesto para interés sin tensión
        excesiva.
      </AnalysisQuickTipCard>
    </div>
  );
}
