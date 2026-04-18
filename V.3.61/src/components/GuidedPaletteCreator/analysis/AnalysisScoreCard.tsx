import React from 'react';

type AnalysisScoreCardProps = {
  title: string;
  score: number | string;
  description: string;
  detail: string;
  cardClassName: string;
  scoreClassName: string;
  className?: string;
  children?: React.ReactNode;
};

export function AnalysisScoreCard({
  title,
  score,
  description,
  detail,
  cardClassName,
  scoreClassName,
  className,
  children,
}: AnalysisScoreCardProps) {
  return (
    <div className={`rounded-2xl border px-4 py-4 text-center ${cardClassName}${className ? ` ${className}` : ''}`}>
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">{title}</p>
      <p className={`mt-1 text-4xl font-extrabold leading-none bg-clip-text text-transparent ${scoreClassName}`}>{score}</p>
      <p className="mt-2 text-xs font-semibold text-slate-400">{description}</p>
      <p className="mt-2 text-[10px] text-slate-500 leading-snug">{detail}</p>
      {children ? <div className="mt-3 border-t border-white/10 pt-3">{children}</div> : null}
    </div>
  );
}
