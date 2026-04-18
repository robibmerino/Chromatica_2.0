import { ANALYSIS_LEFT_ASIDE } from './analysisPhaseConvention';
import type { AnalysisAspectId } from './types';

type AnalysisContrastLeftAsideProps = {
  activeAspect: AnalysisAspectId;
  onSelectAspect: (aspect: AnalysisAspectId) => void;
  /** Puntuación grande del encabezado (promedio de los subanálisis disponibles). */
  headlineScore: number | null;
  textScore: number | null;
  posterPerceptualScore: number;
  temperatureHarmonyScore: number;
  vibrancyHarmonyScore: number;
  cvdSimulationScore: number;
  harmonyScore: number;
  textSidebarFillClass: string;
  textSidebarScoreClass: string;
  posterPerceptualSidebarFillClass: string;
  posterPerceptualSidebarScoreClass: string;
  temperatureSidebarFillClass: string;
  temperatureSidebarScoreClass: string;
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
  vibrancyHarmonyScore,
  cvdSimulationScore,
  harmonyScore,
  textSidebarFillClass,
  textSidebarScoreClass,
  posterPerceptualSidebarFillClass,
  posterPerceptualSidebarScoreClass,
  temperatureSidebarFillClass,
  temperatureSidebarScoreClass,
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
        <p className="text-[10px] text-center text-gray-500 -mt-1 leading-snug px-1">
          {ANALYSIS_LEFT_ASIDE.globalScoreCombinedHint}
        </p>
        <div className="flex items-baseline justify-center gap-1 mt-1">
          <span className="text-[28px] leading-none font-extrabold text-indigo-300">{headline}</span>
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
          {ANALYSIS_LEFT_ASIDE.accessibilityHeading}
        </p>

        <button
          type="button"
          onClick={() => onSelectAspect('wcagText')}
          aria-pressed={activeAspect === 'wcagText'}
          className={`w-full text-left rounded-xl border px-3 py-2.5 flex items-center gap-3 transition-colors ${
            activeAspect === 'wcagText'
              ? 'border-cyan-400/70 bg-gray-800/90 ring-1 ring-cyan-500/30'
              : 'border-gray-600/70 bg-gray-800/70 hover:bg-gray-700/70 hover:border-indigo-400/70'
          }`}
        >
          <div className="w-9 h-9 rounded-md bg-indigo-500/15 text-indigo-300 flex items-center justify-center flex-shrink-0">
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4"
              aria-hidden
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a10 10 0 0 1 0 20V2z" fill="currentColor" stroke="none" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-100 truncate">{ANALYSIS_LEFT_ASIDE.navButtonTextMode}</p>
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
          className={`w-full text-left rounded-xl border px-3 py-2.5 flex items-center gap-3 transition-colors ${
            activeAspect === 'perceptualDeltaE'
              ? 'border-cyan-400/70 bg-gray-800/90 ring-1 ring-cyan-500/30'
              : 'border-gray-600/70 bg-gray-800/70 hover:bg-gray-700/70 hover:border-indigo-400/70'
          }`}
        >
          <div className="w-9 h-9 rounded-md bg-cyan-500/15 text-cyan-300 flex items-center justify-center flex-shrink-0">
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4"
              aria-hidden
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="9" y1="3" x2="9" y2="21" />
              <line x1="15" y1="3" x2="15" y2="21" />
            </svg>
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
          className={`w-full text-left rounded-xl border px-3 py-2.5 flex items-center gap-3 transition-colors ${
            activeAspect === 'temperatureHarmony'
              ? 'border-orange-400/70 bg-gray-800/90 ring-1 ring-orange-500/30'
              : 'border-gray-600/70 bg-gray-800/70 hover:bg-gray-700/70 hover:border-orange-400/45'
          }`}
        >
          <div className="w-9 h-9 rounded-md bg-orange-500/15 text-orange-300 flex items-center justify-center flex-shrink-0">
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4"
              aria-hidden
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z" />
            </svg>
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
          onClick={() => onSelectAspect('vibrancyHarmony')}
          aria-pressed={activeAspect === 'vibrancyHarmony'}
          className={`w-full text-left rounded-xl border px-3 py-2.5 flex items-center gap-3 transition-colors ${
            activeAspect === 'vibrancyHarmony'
              ? 'border-fuchsia-400/70 bg-gray-800/90 ring-1 ring-fuchsia-500/30'
              : 'border-gray-600/70 bg-gray-800/70 hover:bg-gray-700/70 hover:border-fuchsia-400/45'
          }`}
        >
          <div className="w-9 h-9 rounded-md bg-fuchsia-500/15 text-fuchsia-300 flex items-center justify-center flex-shrink-0">
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4"
              aria-hidden
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
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
          className={`w-full text-left rounded-xl border px-3 py-2.5 flex items-center gap-3 transition-colors ${
            activeAspect === 'cvdSimulation'
              ? 'border-pink-400/70 bg-gray-800/90 ring-1 ring-pink-500/30'
              : 'border-gray-600/70 bg-gray-800/70 hover:bg-gray-700/70 hover:border-pink-400/45'
          }`}
        >
          <div className="w-9 h-9 rounded-md bg-pink-500/15 text-pink-300 flex items-center justify-center flex-shrink-0">
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4"
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
          className={`w-full text-left rounded-xl border px-3 py-2.5 flex items-center gap-3 transition-colors ${
            activeAspect === 'chromaticHarmony'
              ? 'border-violet-400/70 bg-gray-800/90 ring-1 ring-violet-500/30'
              : 'border-gray-600/70 bg-gray-800/70 hover:bg-gray-700/70 hover:border-violet-400/45'
          }`}
        >
          <div className="w-9 h-9 rounded-md bg-violet-500/15 text-violet-300 flex items-center justify-center flex-shrink-0">
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4"
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
