import {
  AnalysisAspectIconContrast,
  AnalysisAspectIconCvd,
  AnalysisAspectIconFocus,
  AnalysisAspectIconHarmony,
  AnalysisAspectIconLightness,
  AnalysisAspectIconProximity,
  AnalysisAspectIconTemperature,
} from './analysisAspectHeaderIcons';
import { ANALYSIS_ASPECT_UI } from './analysisAspectUiTokens';
import { ANALYSIS_LEFT_ASIDE } from './analysisPhaseConvention';
import type { AnalysisAspectId } from './types';

function asideNavRow(isActive: boolean, aspect: AnalysisAspectId): string {
  const u = ANALYSIS_ASPECT_UI[aspect];
  return isActive
    ? u.asideActive
    : `border-gray-600/70 bg-gray-800/70 hover:bg-gray-700/70 ${u.asideHover}`;
}

type AnalysisContrastLeftAsideProps = {
  activeAspect: AnalysisAspectId;
  onSelectAspect: (aspect: AnalysisAspectId) => void;
  /** Puntuación grande del encabezado (promedio de los subanálisis disponibles). */
  headlineScore: number | null;
  textScore: number | null;
  posterPerceptualScore: number;
  temperatureHarmonyScore: number;
  lightnessScore: number;
  vibrancyHarmonyScore: number;
  cvdSimulationScore: number;
  harmonyScore: number;
  textSidebarFillClass: string;
  textSidebarScoreClass: string;
  posterPerceptualSidebarFillClass: string;
  posterPerceptualSidebarScoreClass: string;
  temperatureSidebarFillClass: string;
  temperatureSidebarScoreClass: string;
  lightnessSidebarFillClass: string;
  lightnessSidebarScoreClass: string;
  vibrancySidebarFillClass: string;
  vibrancySidebarScoreClass: string;
  cvdSidebarFillClass: string;
  cvdSidebarScoreClass: string;
  harmonySidebarFillClass: string;
  harmonySidebarScoreClass: string;
};

export function AnalysisContrastLeftAside({
  activeAspect,
  onSelectAspect,
  headlineScore,
  textScore,
  posterPerceptualScore,
  temperatureHarmonyScore,
  lightnessScore,
  vibrancyHarmonyScore,
  cvdSimulationScore,
  harmonyScore,
  textSidebarFillClass,
  textSidebarScoreClass,
  posterPerceptualSidebarFillClass,
  posterPerceptualSidebarScoreClass,
  temperatureSidebarFillClass,
  temperatureSidebarScoreClass,
  lightnessSidebarFillClass,
  lightnessSidebarScoreClass,
  vibrancySidebarFillClass,
  vibrancySidebarScoreClass,
  cvdSidebarFillClass,
  cvdSidebarScoreClass,
  harmonySidebarFillClass,
  harmonySidebarScoreClass,
}: AnalysisContrastLeftAsideProps) {
  const headline = headlineScore != null ? headlineScore : '--';
  const headlineWidth = headlineScore != null ? headlineScore : 0;

  return (
    <aside className="hidden lg:flex flex-col bg-gray-800/45 backdrop-blur-sm border border-gray-700/50 rounded-2xl px-3 py-3 gap-3 overflow-hidden h-full">
      <div className="rounded-xl bg-gray-800/55 backdrop-blur-sm border border-gray-700/60 px-5 py-3.5 flex flex-col gap-2">
        <span className="text-[10px] font-semibold tracking-[0.16em] uppercase text-gray-300 text-center">
          {ANALYSIS_LEFT_ASIDE.globalScoreCaption}
        </span>
        <div className="flex items-baseline justify-center gap-1 mt-2">
          <span className="text-[28px] leading-none font-extrabold text-slate-100">{headline}</span>
          <span className="text-xs text-gray-400 font-medium mt-[2px]">/100</span>
        </div>
        <div className="mt-2 h-[4px] rounded-full bg-gray-900/90 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#8fd5ff] via-[#8f7bff] to-[#7a4ff5] transition-all duration-300"
            style={{ width: `${headlineWidth}%` }}
          />
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto space-y-1.5 pr-1">
        <p className="px-1 text-[10px] font-semibold tracking-[0.14em] uppercase text-gray-400">
          {ANALYSIS_LEFT_ASIDE.aspectListHeading}
        </p>

        <button
          type="button"
          onClick={() => onSelectAspect('wcagText')}
          aria-pressed={activeAspect === 'wcagText'}
          className={`w-full text-left rounded-xl border px-3 py-2.5 flex items-center gap-3 transition-colors ${asideNavRow(
            activeAspect === 'wcagText',
            'wcagText'
          )}`}
        >
          <div
            className={`w-9 h-9 rounded-md flex items-center justify-center flex-shrink-0 ${ANALYSIS_ASPECT_UI.wcagText.iconBox}`}
          >
            <AnalysisAspectIconContrast className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-100 truncate">{ANALYSIS_LEFT_ASIDE.navButtonTextMode}</p>
            <p className="text-[10px] text-gray-500 truncate">{ANALYSIS_LEFT_ASIDE.navButtonTextHint}</p>
            <div className="mt-1 h-[3px] rounded-full bg-gray-900/90 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${textSidebarFillClass}`}
                style={{ width: `${textScore ?? 0}%` }}
              />
            </div>
          </div>
          <span className={`text-xs font-bold min-w-[36px] text-right ${textSidebarScoreClass}`}>
            {textScore != null ? `${textScore}%` : '--'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => onSelectAspect('perceptualDeltaE')}
          aria-pressed={activeAspect === 'perceptualDeltaE'}
          className={`w-full text-left rounded-xl border px-3 py-2.5 flex items-center gap-3 transition-colors ${asideNavRow(
            activeAspect === 'perceptualDeltaE',
            'perceptualDeltaE'
          )}`}
        >
          <div
            className={`w-9 h-9 rounded-md flex items-center justify-center flex-shrink-0 ${ANALYSIS_ASPECT_UI.perceptualDeltaE.iconBox}`}
          >
            <AnalysisAspectIconProximity className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-100 truncate">{ANALYSIS_LEFT_ASIDE.shortLabelPerceptualMode}</p>
            <p className="text-[10px] text-gray-500 truncate">{ANALYSIS_LEFT_ASIDE.navButtonPerceptualHint}</p>
            <div className="mt-1 h-[3px] rounded-full bg-gray-900/90 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${posterPerceptualSidebarFillClass}`}
                style={{ width: `${posterPerceptualScore}%` }}
              />
            </div>
          </div>
          <span className={`text-xs font-bold min-w-[36px] text-right ${posterPerceptualSidebarScoreClass}`}>
            {posterPerceptualScore}%
          </span>
        </button>

        <button
          type="button"
          onClick={() => onSelectAspect('temperatureHarmony')}
          aria-pressed={activeAspect === 'temperatureHarmony'}
          className={`w-full text-left rounded-xl border px-3 py-2.5 flex items-center gap-3 transition-colors ${asideNavRow(
            activeAspect === 'temperatureHarmony',
            'temperatureHarmony'
          )}`}
        >
          <div
            className={`w-9 h-9 rounded-md flex items-center justify-center flex-shrink-0 ${ANALYSIS_ASPECT_UI.temperatureHarmony.iconBox}`}
          >
            <AnalysisAspectIconTemperature className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-100 truncate">
              {ANALYSIS_LEFT_ASIDE.navButtonTemperatureMode}
            </p>
            <p className="text-[10px] text-gray-500 truncate">{ANALYSIS_LEFT_ASIDE.navButtonTemperatureHint}</p>
            <div className="mt-1 h-[3px] rounded-full bg-gray-900/90 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${temperatureSidebarFillClass}`}
                style={{ width: `${temperatureHarmonyScore}%` }}
              />
            </div>
          </div>
          <span className={`text-xs font-bold min-w-[36px] text-right ${temperatureSidebarScoreClass}`}>
            {temperatureHarmonyScore}%
          </span>
        </button>

        <button
          type="button"
          onClick={() => onSelectAspect('lightnessBalance')}
          aria-pressed={activeAspect === 'lightnessBalance'}
          className={`w-full text-left rounded-xl border px-3 py-2.5 flex items-center gap-3 transition-colors ${asideNavRow(
            activeAspect === 'lightnessBalance',
            'lightnessBalance'
          )}`}
        >
          <div
            className={`w-9 h-9 rounded-md flex items-center justify-center flex-shrink-0 ${ANALYSIS_ASPECT_UI.lightnessBalance.iconBox}`}
          >
            <AnalysisAspectIconLightness className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-100 truncate">{ANALYSIS_LEFT_ASIDE.navButtonLightnessMode}</p>
            <p className="text-[10px] text-gray-500 truncate">{ANALYSIS_LEFT_ASIDE.navButtonLightnessHint}</p>
            <div className="mt-1 h-[3px] rounded-full bg-gray-900/90 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${lightnessSidebarFillClass}`}
                style={{ width: `${lightnessScore}%` }}
              />
            </div>
          </div>
          <span className={`text-xs font-bold min-w-[36px] text-right ${lightnessSidebarScoreClass}`}>
            {lightnessScore}%
          </span>
        </button>

        <button
          type="button"
          onClick={() => onSelectAspect('vibrancyHarmony')}
          aria-pressed={activeAspect === 'vibrancyHarmony'}
          className={`w-full text-left rounded-xl border px-3 py-2.5 flex items-center gap-3 transition-colors ${asideNavRow(
            activeAspect === 'vibrancyHarmony',
            'vibrancyHarmony'
          )}`}
        >
          <div
            className={`w-9 h-9 rounded-md flex items-center justify-center flex-shrink-0 ${ANALYSIS_ASPECT_UI.vibrancyHarmony.iconBox}`}
          >
            <AnalysisAspectIconFocus className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-100 truncate">{ANALYSIS_LEFT_ASIDE.navButtonVibrancyMode}</p>
            <p className="text-[10px] text-gray-500 truncate">{ANALYSIS_LEFT_ASIDE.navButtonVibrancyHint}</p>
            <div className="mt-1 h-[3px] rounded-full bg-gray-900/90 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${vibrancySidebarFillClass}`}
                style={{ width: `${vibrancyHarmonyScore}%` }}
              />
            </div>
          </div>
          <span className={`text-xs font-bold min-w-[36px] text-right ${vibrancySidebarScoreClass}`}>
            {vibrancyHarmonyScore}%
          </span>
        </button>

        <button
          type="button"
          onClick={() => onSelectAspect('cvdSimulation')}
          aria-pressed={activeAspect === 'cvdSimulation'}
          className={`w-full text-left rounded-xl border px-3 py-2.5 flex items-center gap-3 transition-colors ${asideNavRow(
            activeAspect === 'cvdSimulation',
            'cvdSimulation'
          )}`}
        >
          <div
            className={`w-9 h-9 rounded-md flex items-center justify-center flex-shrink-0 ${ANALYSIS_ASPECT_UI.cvdSimulation.iconBox}`}
          >
            <AnalysisAspectIconCvd className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-100 truncate">{ANALYSIS_LEFT_ASIDE.navButtonCvdMode}</p>
            <p className="text-[10px] text-gray-500 truncate">{ANALYSIS_LEFT_ASIDE.navButtonCvdHint}</p>
            <div className="mt-1 h-[3px] rounded-full bg-gray-900/90 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${cvdSidebarFillClass}`}
                style={{ width: `${cvdSimulationScore}%` }}
              />
            </div>
          </div>
          <span className={`text-xs font-bold min-w-[36px] text-right ${cvdSidebarScoreClass}`}>
            {cvdSimulationScore}%
          </span>
        </button>

        <button
          type="button"
          onClick={() => onSelectAspect('chromaticHarmony')}
          aria-pressed={activeAspect === 'chromaticHarmony'}
          className={`w-full text-left rounded-xl border px-3 py-2.5 flex items-center gap-3 transition-colors ${asideNavRow(
            activeAspect === 'chromaticHarmony',
            'chromaticHarmony'
          )}`}
        >
          <div
            className={`w-9 h-9 rounded-md flex items-center justify-center flex-shrink-0 ${ANALYSIS_ASPECT_UI.chromaticHarmony.iconBox}`}
          >
            <AnalysisAspectIconHarmony className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-100 truncate">{ANALYSIS_LEFT_ASIDE.navButtonHarmonyMode}</p>
            <p className="text-[10px] text-gray-500 truncate">{ANALYSIS_LEFT_ASIDE.navButtonHarmonyHint}</p>
            <div className="mt-1 h-[3px] rounded-full bg-gray-900/90 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${harmonySidebarFillClass}`}
                style={{ width: `${harmonyScore}%` }}
              />
            </div>
          </div>
          <span className={`text-xs font-bold min-w-[36px] text-right ${harmonySidebarScoreClass}`}>
            {harmonyScore}%
          </span>
        </button>
      </div>
    </aside>
  );
}
