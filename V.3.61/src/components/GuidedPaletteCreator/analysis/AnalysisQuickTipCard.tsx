import type React from 'react';

type AnalysisQuickTipCardProps = {
  children: React.ReactNode;
  title?: string;
  className?: string;
  titleClassName?: string;
  bodyClassName?: string;
};

export function AnalysisQuickTipCard({
  children,
  title = 'Consejo',
  className,
  titleClassName,
  bodyClassName,
}: AnalysisQuickTipCardProps) {
  return (
    <div
      className={`rounded-xl border border-emerald-500/30 bg-emerald-500/5 px-3 py-3${
        className ? ` ${className}` : ''
      }`}
    >
      <h4
        className={`flex items-center gap-2 text-[11px] font-semibold text-emerald-300${
          titleClassName ? ` ${titleClassName}` : ''
        }`}
      >
        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" aria-hidden fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        {title}
      </h4>
      <div className={`mt-1.5 text-[11px] leading-relaxed text-emerald-50/90${bodyClassName ? ` ${bodyClassName}` : ''}`}>
        {children}
      </div>
    </div>
  );
}
