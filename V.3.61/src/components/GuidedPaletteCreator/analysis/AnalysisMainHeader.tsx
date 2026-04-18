import React from 'react';
import { ANALYSIS_CENTRAL_HEADER } from './analysisPhaseConvention';

type AnalysisMainHeaderProps = {
  title: string;
  badgeLabel: string;
  badgeClassName: string;
  icon: React.ReactNode;
  iconBoxClassName: string;
  onAutoAdjust?: () => void;
  autoAdjustClassName?: string;
};

export function AnalysisMainHeader({
  title,
  badgeLabel,
  badgeClassName,
  icon,
  iconBoxClassName,
  onAutoAdjust,
  autoAdjustClassName,
}: AnalysisMainHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${iconBoxClassName}`}>{icon}</div>
        <div className="min-w-0 flex flex-wrap items-center gap-2">
          <h2 className="text-lg font-semibold text-slate-50">{title}</h2>
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold shrink-0 ${badgeClassName}`}>
            {badgeLabel}
          </span>
        </div>
      </div>

      {onAutoAdjust && (
        <button
          type="button"
          className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:shadow-md transition shrink-0 ${autoAdjustClassName ?? 'bg-gradient-to-r from-indigo-500 to-fuchsia-500 hover:from-indigo-400 hover:to-fuchsia-400'}`}
          onClick={onAutoAdjust}
        >
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
            <path d="M12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2z" />
          </svg>
          {ANALYSIS_CENTRAL_HEADER.primaryActionAutoAdjust}
        </button>
      )}
    </div>
  );
}
