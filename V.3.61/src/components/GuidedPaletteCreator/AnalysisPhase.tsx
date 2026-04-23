import React from 'react';
import { SectionBanner, SECTION_ICON_ACCENTS } from './SectionBanner';
import { COPY } from './config/copy';
import { PhaseLayout } from './PhaseLayout';
import { FloatingPanel } from './FloatingPanel';
import { ColorEditPanelBody } from '../ColorEditPanelBody';
import type { AnalysisTypeId } from './config/analysisTypeTabsConfig';
import type { ColorItem } from '../../types/guidedPalette';
import { getContrastRatioHex } from '../../utils/colorUtils';
import { AnalysisAspectIconContrast } from './analysis/analysisAspectHeaderIcons';
import { ANALYSIS_ASPECT_UI, ANALYSIS_CONTRAST_EXPLORER_ACCENT } from './analysis/analysisAspectUiTokens';
import { ANALYSIS_CENTRAL_HEADER, ANALYSIS_CENTRAL_SECTION } from './analysis/analysisPhaseConvention';
import { AnalysisContrastLeftAside } from './analysis/AnalysisContrastLeftAside';
import { AnalysisContrastRightAside } from './analysis/AnalysisContrastRightAside';
import { AnalysisNonTextMainColumn } from './analysis/AnalysisNonTextMainColumn';
import { AnalysisNonTextRightAside } from './analysis/AnalysisNonTextRightAside';
import { AnalysisTemperatureMainColumn } from './analysis/AnalysisTemperatureMainColumn';
import { AnalysisTemperatureRightAside } from './analysis/AnalysisTemperatureRightAside';
import { AnalysisVibrancyMainColumn } from './analysis/AnalysisVibrancyMainColumn';
import { AnalysisVibrancyRightAside } from './analysis/AnalysisVibrancyRightAside';
import { AnalysisCvdMainColumn } from './analysis/AnalysisCvdMainColumn';
import { AnalysisCvdRightAside } from './analysis/AnalysisCvdRightAside';
import { AnalysisHarmonyMainColumn } from './analysis/AnalysisHarmonyMainColumn';
import { AnalysisHarmonyRightAside } from './analysis/AnalysisHarmonyRightAside';
import { AnalysisLightnessMainColumn } from './analysis/AnalysisLightnessMainColumn';
import { AnalysisLightnessRightAside } from './analysis/AnalysisLightnessRightAside';
import { AnalysisScoreCard } from './analysis/AnalysisScoreCard';
import { AnalysisMainHeader } from './analysis/AnalysisMainHeader';
import { AnalysisReferenceModal } from './analysis/AnalysisReferenceModal';
import { useWcagContrastAnalysis } from './analysis/useWcagContrastAnalysis';
import {
  augmentRoleMapWithIcon,
  evaluatePosterPerceptualDeltaE,
  posterPerceptualBadge,
  posterPerceptualSidebarTone,
  posterPerceptualScore,
} from './analysis/perceptual/posterPerceptualDeltaE';
import {
  evaluateTemperatureHarmony,
  temperatureHarmonyBadge,
  temperatureHarmonySidebarTone,
} from './analysis/temperature/temperatureHarmonyAnalysis';
import {
  evaluateVibrancy,
  vibrancyBadge,
  vibrancySidebarTone,
} from './analysis/vibrancy/vibrancyAnalysis';
import {
  cvdBadge,
  cvdScoreDesc,
  cvdSidebarTone,
  evaluateCvdGlobalScore,
  type CvdUiType,
} from './analysis/cvd/cvdAnalysis';
import {
  evaluateChromaticHarmony,
  harmonyBadge,
  harmonySidebarTone,
} from './analysis/harmony/harmonyAnalysis';
import {
  evaluateLightnessBalance,
  lightnessBadge,
  lightnessSidebarTone,
} from './analysis/lightness/lightnessBalanceAnalysis';
import type { AnalysisAspectId, EditingColor, ReferenceItem, RoleKey } from './analysis/types';
import { TOP_COMBOS_ROLE } from './analysis/types';

interface AnalysisPhaseProps {
  colors: ColorItem[];
  analysisType: AnalysisTypeId;
  setAnalysisType: (t: AnalysisTypeId) => void;
  updateColorsWithHistory: (colors: ColorItem[]) => void;
  setColors: (colors: ColorItem[] | ((prev: ColorItem[]) => ColorItem[])) => void;
  showNotification: (msg: string) => void;
  /** Paleta de apoyo actual (se puede editar por rol, igual que en Aplicar). */
  supportColorsList?: { role: string; label: string; initial: string; hex: string }[];
  updateSupportColor?: (role: string, hex: string) => void;
  resetSupportPalette?: () => void;
  goBack: () => void;
  goNext: () => void;
  undo: () => void;
  redo: () => void;
  undoDisabled: boolean;
  redoDisabled: boolean;
  onSavePalette?: () => void;
  lockPinned?: boolean;
  onLockToggle?: () => void;
  onOpenHistory?: () => void;
}

const ANALYSIS_ICON = (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <circle cx="11" cy="11" r="6" />
    <line x1="16" y1="16" x2="21" y2="21" />
  </svg>
);

function AnalysisPhaseInner(props: AnalysisPhaseProps) {
  const {
    colors,
    supportColorsList,
    updateSupportColor,
    resetSupportPalette,
    goBack,
    goNext,
    undo,
    redo,
    undoDisabled,
    redoDisabled,
    onSavePalette,
    lockPinned = false,
    onLockToggle,
    onOpenHistory,
    updateColorsWithHistory,
    showNotification,
    analysisType,
    setAnalysisType,
  } = props;

  const [editingColor, setEditingColor] = React.useState<EditingColor>(null);
  const [draftHex, setDraftHex] = React.useState('#000000');
  const [supportResetTooltipRect, setSupportResetTooltipRect] = React.useState<DOMRect | null>(null);
  const supportResetButtonRef = React.useRef<HTMLButtonElement | null>(null);
  const [activeReference, setActiveReference] = React.useState<ReferenceItem | null>(null);
  const [cvdSimulationType, setCvdSimulationType] = React.useState<CvdUiType>('protanopia');

  const analysisAspect: AnalysisAspectId =
    analysisType === 'basic'
      ? 'wcagText'
      : analysisType === 'temperature'
        ? 'temperatureHarmony'
        : analysisType === 'vibrancy'
          ? 'vibrancyHarmony'
          : analysisType === 'cvd'
          ? 'cvdSimulation'
          : analysisType === 'harmony'
            ? 'chromaticHarmony'
            : analysisType === 'lightness'
              ? 'lightnessBalance'
              : 'perceptualDeltaE';
  const setAnalysisAspect = React.useCallback(
    (aspect: AnalysisAspectId) => {
      if (aspect === 'wcagText') setAnalysisType('basic');
      else if (aspect === 'temperatureHarmony') setAnalysisType('temperature');
      else if (aspect === 'vibrancyHarmony') setAnalysisType('vibrancy');
      else if (aspect === 'cvdSimulation') setAnalysisType('cvd');
      else if (aspect === 'chromaticHarmony') setAnalysisType('harmony');
      else if (aspect === 'lightnessBalance') setAnalysisType('lightness');
      else setAnalysisType('scientific');
    },
    [setAnalysisType]
  );

  // Colores "efectivos" (incluyen vista previa del modal sin tocar el historial global)
  const effectiveColors = React.useMemo(() => {
    if (!editingColor || editingColor.type !== 'main') return colors;
    return colors.map((c, i) =>
      i === editingColor.index
        ? {
            ...c,
            hex: draftHex,
          }
        : c
    );
  }, [colors, editingColor, draftHex]);

  const effectiveSupportColors = React.useMemo(() => {
    if (!supportColorsList) return supportColorsList;
    if (!editingColor || editingColor.type !== 'support') return supportColorsList;
    return supportColorsList.map((s) =>
      s.role === editingColor.role
        ? {
            ...s,
            hex: draftHex,
          }
        : s
    );
  }, [supportColorsList, editingColor, draftHex]);

  const wcag = useWcagContrastAnalysis({
    colors,
    supportColorsList,
    updateColorsWithHistory,
    updateSupportColor,
    effectiveColors,
    effectiveSupportColors,
  });

  const {
    roleHexMap,
    explorerSelectedRole,
    setExplorerSelectedRole,
    selectedCombos,
    setSelectedCombos,
    displayCombos,
    contrastScore,
    badgeLabel,
    badgeClassName,
    sidebarScoreClass,
    sidebarFillClass,
    openInfoPanels,
    toggleInfoPanel,
    handleAutoAdjustContrast,
    handleAutoAdjustPerceptualDeltaE,
    handleAutoAdjustTemperatureHarmony,
    handleAutoAdjustVibrancyHarmony,
    handleAutoAdjustCvd,
    handleAutoAdjustHarmony,
    handleAutoAdjustLightness,
  } = wcag;

  const posterPerceptualEvaluated = React.useMemo(() => evaluatePosterPerceptualDeltaE(roleHexMap), [roleHexMap]);
  const posterPerceptualScoreValue = React.useMemo(
    () => posterPerceptualScore(posterPerceptualEvaluated),
    [posterPerceptualEvaluated]
  );
  const posterPerceptualTone = React.useMemo(
    () => posterPerceptualSidebarTone(posterPerceptualScoreValue),
    [posterPerceptualScoreValue]
  );
  const posterPerceptualBadgeInfo = React.useMemo(
    () => posterPerceptualBadge(posterPerceptualScoreValue),
    [posterPerceptualScoreValue]
  );
  const posterColors = React.useMemo(() => {
    const m = augmentRoleMapWithIcon(roleHexMap);
    return {
      P: m.P?.hex ?? '#6366f1',
      S: m.S?.hex ?? '#a78bfa',
      A: m.A?.hex ?? '#ec4899',
      A2: m.A2?.hex ?? m.A?.hex ?? '#c4b5fd',
      F: m.F?.hex ?? '#0f172a',
      Sf: m.Sf?.hex ?? m.F?.hex ?? '#faf5ff',
      I: m.I.hex,
    };
  }, [roleHexMap]);

  const temperatureAnalysis = React.useMemo(() => evaluateTemperatureHarmony(roleHexMap), [roleHexMap]);
  const temperatureHarmonyScoreValue = temperatureAnalysis.score;
  const temperatureHarmonyTone = React.useMemo(
    () => temperatureHarmonySidebarTone(temperatureHarmonyScoreValue),
    [temperatureHarmonyScoreValue]
  );
  const temperatureHarmonyBadgeInfo = React.useMemo(
    () => temperatureHarmonyBadge(temperatureHarmonyScoreValue),
    [temperatureHarmonyScoreValue]
  );

  const vibrancyAnalysis = React.useMemo(() => evaluateVibrancy(roleHexMap), [roleHexMap]);
  const vibrancyHarmonyScoreValue = vibrancyAnalysis.score;
  const vibrancyHarmonyTone = React.useMemo(
    () => vibrancySidebarTone(vibrancyHarmonyScoreValue),
    [vibrancyHarmonyScoreValue]
  );
  const vibrancyHarmonyBadgeInfo = React.useMemo(
    () => vibrancyBadge(vibrancyHarmonyScoreValue),
    [vibrancyHarmonyScoreValue]
  );

  const cvdGlobalScoreValue = React.useMemo(() => evaluateCvdGlobalScore(roleHexMap), [roleHexMap]);
  const cvdTone = React.useMemo(() => cvdSidebarTone(cvdGlobalScoreValue), [cvdGlobalScoreValue]);
  const cvdBadgeInfo = React.useMemo(() => cvdBadge(cvdGlobalScoreValue), [cvdGlobalScoreValue]);
  const cvdGlobalScoreDesc = React.useMemo(() => cvdScoreDesc(cvdGlobalScoreValue), [cvdGlobalScoreValue]);

  const harmonyAnalysis = React.useMemo(() => evaluateChromaticHarmony(roleHexMap), [roleHexMap]);
  const harmonyScoreValue = harmonyAnalysis.score;
  const harmonyTone = React.useMemo(() => harmonySidebarTone(harmonyScoreValue), [harmonyScoreValue]);
  const harmonyBadgeInfo = React.useMemo(() => harmonyBadge(harmonyScoreValue), [harmonyScoreValue]);

  const lightnessAnalysis = React.useMemo(() => evaluateLightnessBalance(roleHexMap), [roleHexMap]);
  const lightnessScoreValue = lightnessAnalysis.score;
  const lightnessTone = React.useMemo(() => lightnessSidebarTone(lightnessScoreValue), [lightnessScoreValue]);
  const lightnessBadgeInfo = React.useMemo(() => lightnessBadge(lightnessScoreValue), [lightnessScoreValue]);

  const headlineScore = React.useMemo(() => {
    const parts: number[] = [];
    if (contrastScore != null) parts.push(contrastScore);
    parts.push(posterPerceptualScoreValue);
    parts.push(temperatureHarmonyScoreValue);
    parts.push(lightnessScoreValue);
    parts.push(vibrancyHarmonyScoreValue);
    parts.push(cvdGlobalScoreValue);
    parts.push(harmonyScoreValue);
    return Math.round(parts.reduce((a, b) => a + b, 0) / parts.length);
  }, [
    contrastScore,
    posterPerceptualScoreValue,
    temperatureHarmonyScoreValue,
    lightnessScoreValue,
    vibrancyHarmonyScoreValue,
    cvdGlobalScoreValue,
    harmonyScoreValue,
  ]);

  return (
    <PhaseLayout
      phaseKey="analysis"
      className="flex flex-col gap-4 min-h-0 max-h-[calc(100vh-10rem)]"
      header={
        <SectionBanner
          onBack={goBack}
          title="Análisis de la paleta"
          subtitle="Detecta problemas de contraste, equilibrio y accesibilidad"
          icon={ANALYSIS_ICON}
          iconBoxClassName={SECTION_ICON_ACCENTS.emerald}
          primaryLabel="Exportar →"
          onPrimaryClick={goNext}
          primaryDisabled={colors.length === 0}
          onUndo={undo}
          onRedo={redo}
          undoDisabled={undoDisabled}
          redoDisabled={redoDisabled}
          savePaletteLabel={COPY.nav.savePalette}
          onSavePalette={onSavePalette}
          lockPinned={lockPinned}
          onLockToggle={onLockToggle}
          lockTooltipSectionName="Análisis"
          onOpenHistory={onOpenHistory}
        />
      }
      footer={null}
    >
      {/* Layout principal de 3 columnas (inspirado en tu HTML de referencia). */}
      <div className="flex-1 min-h-0 overflow-hidden w-full flex">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)_280px] gap-4 flex-1 items-stretch min-h-[520px] md:min-h-[580px] lg:min-h-[640px]">
          <AnalysisContrastLeftAside
            activeAspect={analysisAspect}
            onSelectAspect={setAnalysisAspect}
            headlineScore={headlineScore}
            textScore={contrastScore}
            posterPerceptualScore={posterPerceptualScoreValue}
            temperatureHarmonyScore={temperatureHarmonyScoreValue}
            lightnessScore={lightnessScoreValue}
            vibrancyHarmonyScore={vibrancyHarmonyScoreValue}
            cvdSimulationScore={cvdGlobalScoreValue}
            harmonyScore={harmonyScoreValue}
            textSidebarFillClass={sidebarFillClass}
            textSidebarScoreClass={sidebarScoreClass}
            posterPerceptualSidebarFillClass={posterPerceptualTone.fillClass}
            posterPerceptualSidebarScoreClass={posterPerceptualTone.textClass}
            temperatureSidebarFillClass={temperatureHarmonyTone.fillClass}
            temperatureSidebarScoreClass={temperatureHarmonyTone.textClass}
            lightnessSidebarFillClass={lightnessTone.fillClass}
            lightnessSidebarScoreClass={lightnessTone.textClass}
            vibrancySidebarFillClass={vibrancyHarmonyTone.fillClass}
            vibrancySidebarScoreClass={vibrancyHarmonyTone.textClass}
            cvdSidebarFillClass={cvdTone.fillClass}
            cvdSidebarScoreClass={cvdTone.textClass}
            harmonySidebarFillClass={harmonyTone.fillClass}
            harmonySidebarScoreClass={harmonyTone.textClass}
          />

          {/* Columna central: contraste texto WCAG o triple análisis del mockup (CIE + W3C) */}
          <main className="rounded-2xl border border-gray-700/30 overflow-hidden h-full flex flex-col bg-[#1a1a2e]">
            {analysisAspect === 'perceptualDeltaE' ? (
              <AnalysisNonTextMainColumn
                posterColors={posterColors}
                evaluatedRows={posterPerceptualEvaluated}
                badgeLabel={posterPerceptualBadgeInfo.label}
                badgeClassName={posterPerceptualBadgeInfo.className}
                onAutoAdjust={handleAutoAdjustPerceptualDeltaE}
              />
            ) : analysisAspect === 'temperatureHarmony' ? (
              <AnalysisTemperatureMainColumn
                analysis={temperatureAnalysis}
                badgeLabel={temperatureHarmonyBadgeInfo.label}
                badgeClassName={temperatureHarmonyBadgeInfo.className}
                onAutoAdjust={handleAutoAdjustTemperatureHarmony}
              />
            ) : analysisAspect === 'vibrancyHarmony' ? (
              <AnalysisVibrancyMainColumn
                analysis={vibrancyAnalysis}
                badgeLabel={vibrancyHarmonyBadgeInfo.label}
                badgeClassName={vibrancyHarmonyBadgeInfo.className}
                onAutoAdjust={handleAutoAdjustVibrancyHarmony}
              />
            ) : analysisAspect === 'cvdSimulation' ? (
              <AnalysisCvdMainColumn
                roleHexMap={roleHexMap}
                posterColors={{
                  P: posterColors.P,
                  S: posterColors.S,
                  A: posterColors.A,
                  A2: posterColors.A2,
                  F: posterColors.F,
                }}
                selectedCvd={cvdSimulationType}
                onSelectedCvdChange={setCvdSimulationType}
                globalScore={cvdGlobalScoreValue}
                globalScoreDesc={cvdGlobalScoreDesc}
                badgeLabel={cvdBadgeInfo.label}
                badgeClassName={cvdBadgeInfo.className}
                onAutoAdjust={handleAutoAdjustCvd}
              />
            ) : analysisAspect === 'chromaticHarmony' ? (
              <AnalysisHarmonyMainColumn
                analysis={harmonyAnalysis}
                badgeLabel={harmonyBadgeInfo.label}
                badgeClassName={harmonyBadgeInfo.className}
                onAutoAdjust={handleAutoAdjustHarmony}
              />
            ) : analysisAspect === 'lightnessBalance' ? (
              <AnalysisLightnessMainColumn
                analysis={lightnessAnalysis}
                badgeLabel={lightnessBadgeInfo.label}
                badgeClassName={lightnessBadgeInfo.className}
                onAutoAdjust={handleAutoAdjustLightness}
              />
            ) : (
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
              {/* Header del aspecto */}
              <AnalysisMainHeader
                title={ANALYSIS_CENTRAL_HEADER.titleTextContrast}
                badgeLabel={badgeLabel}
                badgeClassName={badgeClassName}
                iconBoxClassName={ANALYSIS_ASPECT_UI.wcagText.iconBox}
                icon={<AnalysisAspectIconContrast className="w-5 h-5" />}
                onAutoAdjust={handleAutoAdjustContrast}
                autoAdjustClassName={ANALYSIS_ASPECT_UI.wcagText.autoAdjust!}
              />

              <AnalysisScoreCard
                title="Puntuación contraste"
                score={contrastScore ?? '—'}
                description={
                  contrastScore == null
                    ? 'Añade combinaciones para evaluar'
                    : contrastScore >= 95
                      ? 'Contraste excelente'
                      : contrastScore >= 80
                        ? 'Buen contraste'
                        : contrastScore >= 65
                          ? 'Contraste aceptable'
                          : contrastScore >= 50
                            ? 'Mejorable'
                            : 'Conflictos de legibilidad'
                }
                detail="% de combinaciones seleccionadas que cumplen ratio WCAG (AA/AA grande según el tipo de texto mostrado)."
                cardClassName={ANALYSIS_ASPECT_UI.wcagText.scoreCard}
                scoreClassName={ANALYSIS_ASPECT_UI.wcagText.scoreValueGradient}
              />

              {/* Combinaciones evaluadas */}
              <section className="rounded-2xl bg-slate-900/70 border border-slate-800 overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-800/80">
                  <h3 className="text-sm font-semibold text-slate-200">{ANALYSIS_CENTRAL_SECTION.textEvaluatedCombos}</h3>
                </div>

                <div className="px-5 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {displayCombos.map((combo) => {
                      const ratio = getContrastRatioHex(combo.fg.hex, combo.bg.hex);
                      const ratioLabel = `${ratio.toFixed(1)}:1`;
                      const passAA = ratio >= 4.5;
                      const passLarge = ratio >= 3;

                      let tagClasses = 'bg-rose-500/20 text-rose-300';
                      let tagText = `${ratioLabel} · ✗ Falla`;
                      if (passAA) {
                        tagClasses = 'bg-emerald-500/20 text-emerald-300';
                        tagText = `${ratioLabel} · ✓ AA`;
                      } else if (passLarge) {
                        tagClasses = 'bg-amber-400/20 text-amber-300';
                        tagText = `${ratioLabel} · ~ AA lg`;
                      }

                      return (
                        <div
                          key={`${combo.fgRole}-${combo.bgRole}`}
                          className="relative rounded-2xl border-2 border-slate-800/90 px-4 py-4 min-h-[120px] flex flex-col justify-end shadow-sm hover:-translate-y-0.5 hover:shadow-lg transition"
                          style={{ backgroundColor: combo.bg.hex, color: combo.fg.hex }}
                        >
                          <div
                            className={`absolute top-2.5 right-2.5 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold backdrop-blur-sm ${tagClasses}`}
                          >
                            {tagText}
                          </div>
                          <div className="text-[10px] font-semibold uppercase tracking-[0.16em] opacity-70 mb-1">
                            {combo.fg.label} → {combo.bg.label}
                          </div>
                          <div className="text-base font-semibold mb-0.5">
                            {combo.description}
                          </div>
                          <p className="text-xs opacity-90 leading-snug">
                            Texto de ejemplo para evaluar la legibilidad de esta combinación.
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>

              {/* Explorador de ratios */}
              <section className="rounded-2xl bg-slate-900/70 border border-slate-800 overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-800/80">
                  <h3 className="text-sm font-semibold text-slate-200">{ANALYSIS_CENTRAL_SECTION.textRatioExplorer}</h3>
                </div>
                <div className="px-5 py-4 space-y-3">
                  {/* Selector de color */}
                  <div className="flex flex-wrap gap-1.5">
                    {/* Botón de 6 mejores combinaciones */}
                    <button
                      type="button"
                      onClick={() => setExplorerSelectedRole(TOP_COMBOS_ROLE)}
                      className={`inline-flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-xs font-semibold transition ${
                        explorerSelectedRole === TOP_COMBOS_ROLE
                          ? ANALYSIS_CONTRAST_EXPLORER_ACCENT.chipActive
                          : 'border-slate-700 bg-slate-900/80 text-slate-200 hover:border-slate-500'
                      }`}
                    >
                      <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-white/40">
                        <svg
                          viewBox="0 0 24 24"
                          className="w-3 h-3"
                          aria-hidden
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                      <span>Top 6</span>
                    </button>

                    {(Object.keys(roleHexMap) as RoleKey[])
                      .filter((role) => roleHexMap[role])
                      .map((role) => {
                        const roleInfo = roleHexMap[role]!;
                        const isActive = explorerSelectedRole === role;
                        return (
                          <button
                            key={role}
                            type="button"
                            onClick={() => setExplorerSelectedRole(role)}
                            className={`inline-flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-xs font-semibold transition ${
                              isActive
                                ? ANALYSIS_CONTRAST_EXPLORER_ACCENT.chipActive
                                : 'border-slate-700 bg-slate-900/80 text-slate-200 hover:border-slate-500'
                            }`}
                          >
                            <span
                              className="inline-block h-4 w-4 rounded-[4px] border border-white/10"
                              style={{ backgroundColor: roleInfo.hex }}
                            />
                            <span>{role}</span>
                          </button>
                        );
                      })}
                  </div>

                  {/* Grid de resultados */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {(() => {
                      const roles = Object.keys(roleHexMap) as RoleKey[];

                      // Vista "Top 6": mejores combinaciones globales
                      if (explorerSelectedRole === TOP_COMBOS_ROLE) {
                        const all: { fgRole: RoleKey; bgRole: RoleKey; ratio: number }[] = [];
                        roles.forEach((fg) => {
                          roles.forEach((bg) => {
                            if (fg === bg) return;
                            const fgHex = roleHexMap[fg]?.hex;
                            const bgHex = roleHexMap[bg]?.hex;
                            if (!fgHex || !bgHex) return;
                            const ratio = getContrastRatioHex(fgHex, bgHex);
                            all.push({ fgRole: fg, bgRole: bg, ratio });
                          });
                        });

                        all.sort((a, b) => b.ratio - a.ratio);
                        const top6 = all.slice(0, 6);

                        return top6.map(({ fgRole, bgRole, ratio }) => {
                          const selectedInfo = roleHexMap[fgRole]!;
                          const other = roleHexMap[bgRole]!;
                          const rLabel = `${ratio.toFixed(1)}:1`;
                          const passAAA = ratio >= 7;
                          const passAA = ratio >= 4.5;
                          const passLarge = ratio >= 3;

                          let valueColor = 'text-rose-400';
                          if (passAAA) valueColor = 'text-emerald-400';
                          else if (passAA) valueColor = ANALYSIS_CONTRAST_EXPLORER_ACCENT.textPassAa;
                          else if (passLarge) valueColor = 'text-amber-300';

                          const isSelected = selectedCombos.some(
                            (c) => c.fgRole === fgRole && c.bgRole === bgRole
                          );

                          return (
                            <button
                              key={`${fgRole}-${bgRole}`}
                              type="button"
                              onClick={() => {
                                setSelectedCombos((current) => {
                                  const exists = current.some(
                                    (c) => c.fgRole === fgRole && c.bgRole === bgRole
                                  );
                                  if (exists) {
                                    return current.filter(
                                      (c) => !(c.fgRole === fgRole && c.bgRole === bgRole)
                                    );
                                  }
                                  return [
                                    ...current,
                                    {
                                      fgRole,
                                      bgRole,
                                      description: `${roleHexMap[fgRole]?.label ?? fgRole} sobre ${
                                        roleHexMap[bgRole]?.label ?? bgRole
                                      }`,
                                    },
                                  ];
                                });
                              }}
                              className={`rounded-xl px-3.5 py-3 text-center transition border ${
                                isSelected
                                  ? ANALYSIS_CONTRAST_EXPLORER_ACCENT.gridSelected
                                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-600'
                              }`}
                            >
                              <div
                                className="mb-2 flex h-9 items-center justify-center rounded-md border border-white/5 text-xs font-semibold"
                                style={{ backgroundColor: other.hex, color: selectedInfo.hex }}
                              >
                                Aa
                              </div>
                              <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                                <span>
                                  {fgRole} → {bgRole}
                                </span>
                                <span className={`text-xs font-bold ${valueColor}`}>{rLabel}</span>
                              </div>
                              <div className="mt-1.5 flex justify-center gap-1">
                                <span
                                  className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${
                                    passLarge
                                      ? ANALYSIS_CONTRAST_EXPLORER_ACCENT.pillPass
                                      : 'bg-rose-500/10 text-rose-300'
                                  }`}
                                >
                                  AA lg
                                </span>
                                <span
                                  className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${
                                    passAA ? ANALYSIS_CONTRAST_EXPLORER_ACCENT.pillPass : 'bg-rose-500/10 text-rose-300'
                                  }`}
                                >
                                  AA
                                </span>
                                <span
                                  className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${
                                    passAAA ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/10 text-rose-300'
                                  }`}
                                >
                                  AAA
                                </span>
                              </div>
                            </button>
                          );
                        });
                      }

                      // Vista por color seleccionado (comportamiento anterior)
                      const selected = roleHexMap[explorerSelectedRole];
                      if (!selected) return null;

                      const keys = roles;
                      return keys
                        .filter((k) => k !== explorerSelectedRole)
                        .map((k) => {
                          const other = roleHexMap[k]!;
                          const ratio = getContrastRatioHex(selected.hex, other.hex);
                          const rLabel = `${ratio.toFixed(1)}:1`;
                          const passAAA = ratio >= 7;
                          const passAA = ratio >= 4.5;
                          const passLarge = ratio >= 3;

                          let valueColor = 'text-rose-400';
                          if (passAAA) valueColor = 'text-emerald-400';
                          else if (passAA) valueColor = ANALYSIS_CONTRAST_EXPLORER_ACCENT.textPassAa;
                          else if (passLarge) valueColor = 'text-amber-300';

                          const isSelected = selectedCombos.some(
                            (c) => c.fgRole === explorerSelectedRole && c.bgRole === k
                          );

                          return (
                            <button
                              key={`${explorerSelectedRole}-${k}`}
                              type="button"
                              onClick={() => {
                                setSelectedCombos((current) => {
                                  const exists = current.some(
                                    (c) => c.fgRole === explorerSelectedRole && c.bgRole === k
                                  );
                                  if (exists) {
                                    return current.filter(
                                      (c) => !(c.fgRole === explorerSelectedRole && c.bgRole === k)
                                    );
                                  }
                                  return [
                                    ...current,
                                    {
                                      fgRole: explorerSelectedRole,
                                      bgRole: k,
                                      description: `${roleHexMap[explorerSelectedRole]?.label ?? explorerSelectedRole} sobre ${
                                        roleHexMap[k]?.label ?? k
                                      }`,
                                    },
                                  ];
                                });
                              }}
                              className={`rounded-xl px-3.5 py-3 text-center transition border ${
                                isSelected
                                  ? ANALYSIS_CONTRAST_EXPLORER_ACCENT.gridSelected
                                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-600'
                              }`}
                            >
                              <div
                                className="mb-2 flex h-9 items-center justify-center rounded-md border border-white/5 text-xs font-semibold"
                                style={{ backgroundColor: other.hex, color: selected.hex }}
                              >
                                Aa
                              </div>
                              <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                                <span>
                                  {explorerSelectedRole} → {k}
                                </span>
                                <span className={`text-xs font-bold ${valueColor}`}>{rLabel}</span>
                              </div>
                              <div className="mt-1.5 flex justify-center gap-1">
                                <span
                                  className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${
                                    passLarge
                                      ? ANALYSIS_CONTRAST_EXPLORER_ACCENT.pillPass
                                      : 'bg-rose-500/10 text-rose-300'
                                  }`}
                                >
                                  AA lg
                                </span>
                                <span
                                  className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${
                                    passAA ? ANALYSIS_CONTRAST_EXPLORER_ACCENT.pillPass : 'bg-rose-500/10 text-rose-300'
                                  }`}
                                >
                                  AA
                                </span>
                                <span
                                  className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${
                                    passAAA ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/10 text-rose-300'
                                  }`}
                                >
                                  AAA
                                </span>
                              </div>
                            </button>
                          );
                        });
                    })()}
                  </div>
                </div>
              </section>

            </div>
            )}
          </main>

          {analysisAspect === 'wcagText' ? (
            <AnalysisContrastRightAside
              effectiveColors={effectiveColors}
              effectiveSupportColors={effectiveSupportColors}
              resetSupportPalette={resetSupportPalette}
              supportResetButtonRef={supportResetButtonRef}
              supportResetTooltipRect={supportResetTooltipRect}
              setSupportResetTooltipRect={setSupportResetTooltipRect}
              setEditingColor={setEditingColor}
              setDraftHex={setDraftHex}
              openInfoPanels={openInfoPanels}
              toggleInfoPanel={toggleInfoPanel}
              onOpenReference={setActiveReference}
            />
          ) : analysisAspect === 'perceptualDeltaE' ? (
            <AnalysisNonTextRightAside
              effectiveColors={effectiveColors}
              effectiveSupportColors={effectiveSupportColors}
              resetSupportPalette={resetSupportPalette}
              supportResetButtonRef={supportResetButtonRef}
              supportResetTooltipRect={supportResetTooltipRect}
              setSupportResetTooltipRect={setSupportResetTooltipRect}
              setEditingColor={setEditingColor}
              setDraftHex={setDraftHex}
              onOpenReference={setActiveReference}
            />
          ) : analysisAspect === 'temperatureHarmony' ? (
            <AnalysisTemperatureRightAside
              effectiveColors={effectiveColors}
              effectiveSupportColors={effectiveSupportColors}
              resetSupportPalette={resetSupportPalette}
              supportResetButtonRef={supportResetButtonRef}
              supportResetTooltipRect={supportResetTooltipRect}
              setSupportResetTooltipRect={setSupportResetTooltipRect}
              setEditingColor={setEditingColor}
              setDraftHex={setDraftHex}
              onOpenReference={setActiveReference}
            />
          ) : analysisAspect === 'vibrancyHarmony' ? (
            <AnalysisVibrancyRightAside
              effectiveColors={effectiveColors}
              effectiveSupportColors={effectiveSupportColors}
              resetSupportPalette={resetSupportPalette}
              supportResetButtonRef={supportResetButtonRef}
              supportResetTooltipRect={supportResetTooltipRect}
              setSupportResetTooltipRect={setSupportResetTooltipRect}
              setEditingColor={setEditingColor}
              setDraftHex={setDraftHex}
              onOpenReference={setActiveReference}
            />
          ) : analysisAspect === 'chromaticHarmony' ? (
            <AnalysisHarmonyRightAside
              effectiveColors={effectiveColors}
              effectiveSupportColors={effectiveSupportColors}
              resetSupportPalette={resetSupportPalette}
              supportResetButtonRef={supportResetButtonRef}
              supportResetTooltipRect={supportResetTooltipRect}
              setSupportResetTooltipRect={setSupportResetTooltipRect}
              setEditingColor={setEditingColor}
              setDraftHex={setDraftHex}
              onOpenReference={setActiveReference}
            />
          ) : analysisAspect === 'lightnessBalance' ? (
            <AnalysisLightnessRightAside
              effectiveColors={effectiveColors}
              effectiveSupportColors={effectiveSupportColors}
              resetSupportPalette={resetSupportPalette}
              supportResetButtonRef={supportResetButtonRef}
              supportResetTooltipRect={supportResetTooltipRect}
              setSupportResetTooltipRect={setSupportResetTooltipRect}
              setEditingColor={setEditingColor}
              setDraftHex={setDraftHex}
              onOpenReference={setActiveReference}
            />
          ) : (
            <AnalysisCvdRightAside
              effectiveColors={effectiveColors}
              effectiveSupportColors={effectiveSupportColors}
              resetSupportPalette={resetSupportPalette}
              supportResetButtonRef={supportResetButtonRef}
              supportResetTooltipRect={supportResetTooltipRect}
              setSupportResetTooltipRect={setSupportResetTooltipRect}
              setEditingColor={setEditingColor}
              setDraftHex={setDraftHex}
              onOpenReference={setActiveReference}
              selectedCvd={cvdSimulationType}
              onSelectedCvdChange={setCvdSimulationType}
            />
          )}
        </div>
      </div>

      {activeReference && (
        <AnalysisReferenceModal reference={activeReference} onClose={() => setActiveReference(null)} />
      )}

      {/* Modal de edición de color (similar al de Aplicar, flotante y redimensionable) */}
      {editingColor && (
        <FloatingPanel
          open={true}
          onClose={() => setEditingColor(null)}
          title={
            editingColor.type === 'main'
              ? 'Editar color principal'
              : 'Editar color de apoyo'
          }
          initialWidth={360}
          initialHeight={560}
        >
          <ColorEditPanelBody
            key={
              editingColor.type === 'main'
                ? `main-${editingColor.index}`
                : `support-${editingColor.role}`
            }
            draftHex={draftHex}
            setDraftHex={setDraftHex}
            onAccept={() => {
              if (editingColor?.type === 'main') {
                const updated = colors.map((c, i) =>
                  i === editingColor.index ? { ...c, hex: draftHex } : c
                );
                updateColorsWithHistory(updated);
                showNotification(COPY.notifications.changesApplied);
              } else if (editingColor?.type === 'support' && updateSupportColor) {
                updateSupportColor(editingColor.role, draftHex);
                showNotification(COPY.notifications.changesApplied);
              }
              setEditingColor(null);
            }}
          />
        </FloatingPanel>
      )}
    </PhaseLayout>
  );
}

export const AnalysisPhase = React.memo(AnalysisPhaseInner);
