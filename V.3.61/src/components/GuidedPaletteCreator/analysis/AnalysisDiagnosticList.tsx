export type AnalysisDiagnosticTone = 'good' | 'warning' | 'bad';

export type AnalysisDiagnosticItem = {
  tone: AnalysisDiagnosticTone;
  text: string;
};

type AnalysisDiagnosticListProps = {
  diagnostics: AnalysisDiagnosticItem[];
};

export function AnalysisDiagnosticList({ diagnostics }: AnalysisDiagnosticListProps) {
  return (
    <div className="space-y-2">
      {diagnostics.map((d, i) => (
        <div
          key={i}
          className="flex gap-2.5 items-start rounded-lg border border-slate-700/80 bg-slate-900/50 px-3 py-2.5"
        >
          <div
            className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
              d.tone === 'good'
                ? 'bg-emerald-500/15 text-emerald-400'
                : d.tone === 'warning'
                  ? 'bg-amber-500/15 text-amber-400'
                  : 'bg-rose-500/15 text-rose-400'
            }`}
          >
            {d.tone === 'good' ? (
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" aria-hidden fill="none" stroke="currentColor" strokeWidth={2.5}>
                <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : d.tone === 'warning' ? (
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" aria-hidden fill="none" stroke="currentColor" strokeWidth={2.5}>
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" aria-hidden fill="none" stroke="currentColor" strokeWidth={2.5}>
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            )}
          </div>
          <p className="text-[12px] leading-relaxed text-slate-400">{d.text}</p>
        </div>
      ))}
    </div>
  );
}
