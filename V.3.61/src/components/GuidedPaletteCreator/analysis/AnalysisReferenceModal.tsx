import React from 'react';
import type { ReferenceItem } from './types';

type AnalysisReferenceModalProps = {
  reference: ReferenceItem;
  onClose: () => void;
};

/** `**negrita**` y `^^énfasis cian^^` en textos de referencia (solo estos patrones). */
function renderReferenceSummaryInline(text: string): React.ReactNode {
  const segments = text.split(/(\*\*[^*]+\*\*|\^\^[^\^]+\^\^)/g).filter(Boolean);
  return segments.map((seg, i) => {
    if (seg.startsWith('**') && seg.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-slate-100">
          {seg.slice(2, -2)}
        </strong>
      );
    }
    if (seg.startsWith('^^') && seg.endsWith('^^')) {
      return (
        <span key={i} className="font-semibold text-cyan-300">
          {seg.slice(2, -2)}
        </span>
      );
    }
    return seg;
  });
}

export function AnalysisReferenceModal({ reference, onClose }: AnalysisReferenceModalProps) {
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-5">
      <button
        type="button"
        aria-label="Cerrar detalle de referencia"
        className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"
        onClick={onClose}
      />
      <article className="relative w-full max-w-lg sm:max-w-xl rounded-2xl border border-indigo-500/20 bg-[#0f1b36]/95 shadow-[0_20px_50px_rgba(2,6,23,0.85)] px-5 py-5 sm:px-6 sm:py-6 max-h-[min(90vh,640px)] flex flex-col">
        <button
          type="button"
          aria-label="Cerrar"
          onClick={onClose}
          className="absolute top-3.5 right-3.5 inline-flex h-8 w-8 items-center justify-center rounded-full border border-indigo-500/25 bg-[#122245] text-indigo-200 hover:text-white hover:border-indigo-300 transition-colors"
        >
          <svg
            viewBox="0 0 20 20"
            className="w-4 h-4"
            aria-hidden
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path d="M5 5 15 15M15 5 5 15" strokeLinecap="round" />
          </svg>
        </button>

        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-indigo-400 pr-10">{reference.category}</p>
        <h3 className="mt-1.5 pr-10 text-base sm:text-lg leading-snug font-semibold text-slate-100">{reference.title}</h3>
        <p className="mt-3 text-sm font-medium text-slate-300 leading-snug">{reference.authors}</p>
        <p className="mt-1 text-xs italic text-slate-400 leading-snug">{reference.source}</p>

        <div className="mt-4 min-h-0 flex-1 overflow-y-auto rounded-xl border border-slate-700/70 bg-slate-900/55 px-3.5 py-3.5">
          <div className="space-y-3 text-sm leading-relaxed text-slate-300">
            {reference.summaryParagraphs.map((paragraph, index) => (
              <p key={`${reference.id}-summary-${index}`}>{renderReferenceSummaryInline(paragraph)}</p>
            ))}
          </div>
        </div>

        <a
          href={reference.href}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-flex w-fit max-w-full items-center gap-2 rounded-xl border border-indigo-500/35 bg-indigo-500/8 px-3 py-2 text-xs font-semibold text-indigo-300 hover:bg-indigo-500/15 hover:text-indigo-200 transition-colors"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4 shrink-0"
            aria-hidden
            fill="none"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              d="M14 3h7v7m0-7L10 14m-4 7H3v-3m3 3h5m-8-8V6a3 3 0 0 1 3-3h7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="truncate">{reference.linkLabel}</span>
        </a>
      </article>
    </div>
  );
}
