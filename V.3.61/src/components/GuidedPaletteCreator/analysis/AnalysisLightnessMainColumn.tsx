import { getContrastColor } from '../../../utils/colorUtils';
import { ANALYSIS_CENTRAL_HEADER } from './analysisPhaseConvention';
import { AnalysisAspectIconLightness } from './analysisAspectHeaderIcons';
import { ANALYSIS_ASPECT_UI } from './analysisAspectUiTokens';
import { AnalysisMainHeader } from './AnalysisMainHeader';
import { AnalysisQuickTipCard } from './AnalysisQuickTipCard';
import { AnalysisScoreCard } from './AnalysisScoreCard';
import { AnalysisSectionBlock } from './AnalysisSectionBlock';
import { gapStatusBadgeClass, grayHexFromLstar, type LightnessBalanceResult } from './lightness/lightnessBalanceAnalysis';

type AnalysisLightnessMainColumnProps = {
  analysis: LightnessBalanceResult;
  badgeLabel: string;
  badgeClassName: string;
  onAutoAdjust?: () => void;
};

export function AnalysisLightnessMainColumn({
  analysis,
  badgeLabel,
  badgeClassName,
  onAutoAdjust,
}: AnalysisLightnessMainColumnProps) {
  const aspectUi = ANALYSIS_ASPECT_UI.lightnessBalance;
  const hasData = analysis.swatches.length > 0;

  return (
    <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
      <AnalysisMainHeader
        title={ANALYSIS_CENTRAL_HEADER.titleLightnessBalance}
        badgeLabel={badgeLabel}
        badgeClassName={badgeClassName}
        iconBoxClassName={aspectUi.iconBox}
        icon={<AnalysisAspectIconLightness className="w-5 h-5" />}
        onAutoAdjust={hasData ? onAutoAdjust : undefined}
        autoAdjustClassName={aspectUi.autoAdjust}
      />

      <AnalysisScoreCard
        title="Balance tonal"
        score={hasData ? analysis.score : '—'}
        description={hasData ? analysis.scoreDesc : 'Añade colores a la paleta'}
        detail="L* en CIELAB (D65, sRGB) sobre P/S/A/A2/F/T y demás roles salvo Ts y Sf. La regularidad entre pasos consecutivos pesa más si ambos roles son de la paleta principal (P–S–A–A2); los huecos muy cercanos (ΔL* &lt; 8) solo entre principales restan nota de forma acentuada. Rango L*, zonas y bonus por extremos L* ≥85 / ≤20."
        cardClassName={aspectUi.scoreCard}
        scoreClassName={aspectUi.scoreValueGradient}
      >
        {hasData ? (
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="rounded-lg border border-slate-700/80 bg-slate-900/50 py-2">
              <p className="text-lg font-extrabold text-slate-100">{analysis.range}</p>
              <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-500">Rango L*</p>
            </div>
            <div className="rounded-lg border border-slate-700/80 bg-slate-900/50 py-2">
              <p className="text-lg font-extrabold text-slate-100">
                {analysis.zonesPresent}
                <span className="text-slate-500">/3</span>
              </p>
              <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-500">Zonas</p>
            </div>
            <div className="rounded-lg border border-slate-700/80 bg-slate-900/50 py-2">
              <p className="text-lg font-extrabold text-slate-100">{analysis.maxL}</p>
              <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-500">L* máx.</p>
            </div>
            <div className="rounded-lg border border-slate-700/80 bg-slate-900/50 py-2">
              <p className="text-lg font-extrabold text-slate-100">{analysis.minL}</p>
              <p className="text-[9px] font-semibold uppercase tracking-wide text-slate-500">L* mín.</p>
            </div>
          </div>
        ) : null}
      </AnalysisScoreCard>

      <AnalysisSectionBlock title="Escalera de luminosidad (L* CIELab)" titleClassName="uppercase tracking-wide">
        {!hasData ? (
          <p className="text-center text-sm text-slate-500">Sin datos</p>
        ) : (
          <div className="flex min-h-[280px] gap-3 sm:gap-4">
            <div className="flex w-7 shrink-0 flex-col justify-between py-1 text-right text-[9px] font-semibold text-slate-500">
              <span>100</span>
              <span>75</span>
              <span>50</span>
              <span>25</span>
              <span>0</span>
            </div>
            <div
              className="w-8 shrink-0 rounded-md border border-slate-700/80"
              style={{
                background: 'linear-gradient(to bottom, #ffffff, #333333)',
              }}
            />
            <div className="relative flex min-w-0 flex-1 gap-1.5 pr-[22px] sm:gap-2 sm:pr-6">
              {analysis.sorted.map((d) => {
                const h = Math.max(5, d.lstar);
                const fg = getContrastColor(d.hex);
                return (
                  <div key={d.key} className="relative flex min-w-0 flex-1 flex-col justify-end">
                    <div
                      className="absolute bottom-0 left-0 right-0 flex flex-col items-center rounded-t-md pt-2 transition-all duration-300"
                      style={{
                        height: `${h}%`,
                        backgroundColor: d.hex,
                        minHeight: 28,
                      }}
                    >
                      <span className="text-[10px] font-extrabold" style={{ color: fg }}>
                        {d.key}
                      </span>
                      <span className="mt-0.5 text-[9px] font-semibold opacity-90" style={{ color: fg }}>
                        L*{Math.round(d.lstar)}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div
                className="pointer-events-none absolute inset-y-0 right-0 z-[2] flex w-[22px] flex-col border-l border-slate-600/35 bg-slate-950/35 backdrop-blur-[2px] sm:w-6"
                aria-hidden
              >
                <div
                  className="flex flex-1 flex-col items-center justify-center border-b border-slate-600/20"
                  style={{ flex: '30 1 0%' }}
                >
                  <span className="text-[7px] font-semibold uppercase tracking-wide text-slate-400 [writing-mode:vertical-rl]">
                    Claro
                  </span>
                </div>
                <div
                  className="flex flex-1 flex-col items-center justify-center border-b border-slate-600/20"
                  style={{ flex: '40 1 0%' }}
                >
                  <span className="text-[7px] font-semibold uppercase tracking-wide text-slate-500 [writing-mode:vertical-rl]">
                    Medio
                  </span>
                </div>
                <div className="flex flex-1 flex-col items-center justify-center" style={{ flex: '30 1 0%' }}>
                  <span className="text-[7px] font-semibold uppercase tracking-wide text-slate-500 [writing-mode:vertical-rl]">
                    Oscuro
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </AnalysisSectionBlock>

      <AnalysisSectionBlock title="Cobertura tonal" titleClassName="uppercase tracking-wide">
        {!hasData ? null : (
          <>
            <div className="relative h-12 rounded-lg border border-slate-700/80">
              <div
                className="absolute inset-0 rounded-lg"
                style={{
                  background:
                    'linear-gradient(to right, #ffffff, #dddddd, #aaaaaa, #777777, #444444, #222222, #111111)',
                }}
              />
              {analysis.swatches.map((d) => {
                const x = 100 - Math.max(0, Math.min(100, d.lstar));
                return (
                  <div
                    key={`cov-${d.key}`}
                    className="absolute top-1/2 z-10 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white shadow-md transition-all duration-300"
                    style={{ left: `${x}%`, backgroundColor: d.hex }}
                    title={`${d.key}: L* ${d.lstar}`}
                  />
                );
              })}
            </div>
            <div className="mt-1 flex justify-between px-0.5 text-[9px] font-semibold text-slate-500">
              <span>L* 100</span>
              <span>75</span>
              <span>50</span>
              <span>25</span>
              <span>L* 0</span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <div className="rounded-lg border border-slate-700/80 bg-slate-900/50 py-2 text-center">
                <p className="text-[11px] font-bold text-slate-200">Oscuro</p>
                <p className="my-1 text-xl font-extrabold text-indigo-300">{analysis.darkCount}</p>
                <p className="text-[9px] text-slate-500">L* &lt; 30</p>
              </div>
              <div className="rounded-lg border border-slate-700/80 bg-slate-900/50 py-2 text-center">
                <p className="text-[11px] font-bold text-slate-200">Medio</p>
                <p className="my-1 text-xl font-extrabold text-amber-300">{analysis.midCount}</p>
                <p className="text-[9px] text-slate-500">30–70</p>
              </div>
              <div className="rounded-lg border border-slate-700/80 bg-slate-900/50 py-2 text-center">
                <p className="text-[11px] font-bold text-slate-200">Claro</p>
                <p className="my-1 text-xl font-extrabold text-slate-200">{analysis.lightCount}</p>
                <p className="text-[9px] text-slate-500">L* &gt; 70</p>
              </div>
            </div>
          </>
        )}
      </AnalysisSectionBlock>

      <AnalysisSectionBlock
        title="Tu paleta en escala de grises (solo luminosidad)"
        titleClassName="uppercase tracking-wide"
      >
        {!hasData ? null : (
          <div className="flex gap-1">
            {analysis.sorted.map((d) => {
              const gray = grayHexFromLstar(d.lstar);
              const fg1 = getContrastColor(d.hex);
              const fg2 = getContrastColor(gray);
              return (
                <div key={`gs-${d.key}`} className="flex min-w-0 flex-1 flex-col gap-1 text-center">
                  <div
                    className="flex h-10 items-center justify-center rounded-md border border-white/10 text-[10px] font-bold"
                    style={{ backgroundColor: d.hex, color: fg1 }}
                  >
                    {d.key}
                  </div>
                  <div
                    className="flex h-10 items-center justify-center rounded-md border border-white/10 text-[10px] font-bold"
                    style={{ backgroundColor: gray, color: fg2 }}
                  >
                    L*{Math.round(d.lstar)}
                  </div>
                  <p className="truncate text-[9px] font-semibold text-slate-500">
                    {d.key}: {d.hex}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </AnalysisSectionBlock>

      <AnalysisSectionBlock
        title="Separación tonal entre pares consecutivos (por L* decreciente)"
        titleClassName="uppercase tracking-wide"
      >
        {!hasData || !analysis.gaps.length ? (
          <p className="text-center text-sm text-slate-500">Se necesitan al menos dos colores</p>
        ) : (
          <div className="space-y-2">
            {analysis.gaps.map((g) => (
              <div
                key={`${g.higher.key}-${g.lower.key}`}
                className="flex items-center gap-2.5 rounded-lg border border-slate-700/80 bg-slate-900/55 px-3 py-2.5"
              >
                <div className="flex shrink-0 items-center gap-1">
                  <div
                    className="h-4 w-4 rounded-full border border-white/15"
                    style={{ backgroundColor: g.higher.hex }}
                  />
                  <div className="h-0.5 w-4 bg-slate-600" />
                  <div
                    className="h-4 w-4 rounded-full border border-white/15"
                    style={{ backgroundColor: g.lower.hex }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold text-slate-100">
                    {g.higher.key} → {g.lower.key}
                  </p>
                  <p className="text-[10px] text-slate-500">ΔL* = {g.delta}</p>
                </div>
                <span
                  className={`shrink-0 rounded px-2 py-0.5 text-[9px] font-bold ${gapStatusBadgeClass(g.status)}`}
                >
                  {g.statusLabel}
                </span>
              </div>
            ))}
          </div>
        )}
      </AnalysisSectionBlock>

      <AnalysisQuickTipCard>
        Este análisis omite <span className="font-semibold text-cyan-200">Ts</span> (texto secundario) y{' '}
        <span className="font-semibold text-cyan-200">Sf</span> (superficie). El texto principal (T) sí cuenta. Una
        paleta versátil suele incluir al menos un rol con <span className="font-semibold text-cyan-200">L* &gt; 85</span>{' '}
        y otro con <span className="font-semibold text-cyan-200">L* &lt; 25</span>, además de tonos medios para jerarquía
        de UI.
      </AnalysisQuickTipCard>
    </div>
  );
}
