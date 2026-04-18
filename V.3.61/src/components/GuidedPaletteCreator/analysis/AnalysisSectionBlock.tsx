import type React from 'react';

type AnalysisSectionBlockProps = {
  title: string;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
};

export function AnalysisSectionBlock({
  title,
  children,
  className,
  titleClassName,
}: AnalysisSectionBlockProps) {
  return (
    <section className={`space-y-2${className ? ` ${className}` : ''}`}>
      <h3 className={`text-xs font-semibold text-slate-500${titleClassName ? ` ${titleClassName}` : ''}`}>{title}</h3>
      {children}
    </section>
  );
}
