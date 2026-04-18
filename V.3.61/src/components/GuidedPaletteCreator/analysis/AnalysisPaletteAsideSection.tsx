import React from 'react';
import { createPortal } from 'react-dom';
import { getContrastColor } from '../../../utils/colorUtils';
import type { ColorItem } from '../../../types/guidedPalette';
import type { EditingColor, SupportSwatch } from './types';

type AnalysisPaletteAsideSectionProps = {
  effectiveColors: ColorItem[];
  effectiveSupportColors: SupportSwatch[] | null | undefined;
  resetSupportPalette: (() => void) | undefined;
  supportResetButtonRef: React.RefObject<HTMLButtonElement | null>;
  supportResetTooltipRect: DOMRect | null;
  setSupportResetTooltipRect: (rect: DOMRect | null) => void;
  setEditingColor: (v: EditingColor) => void;
  setDraftHex: (hex: string) => void;
};

export function AnalysisPaletteAsideSection({
  effectiveColors,
  effectiveSupportColors,
  resetSupportPalette,
  supportResetButtonRef,
  supportResetTooltipRect,
  setSupportResetTooltipRect,
  setEditingColor,
  setDraftHex,
}: AnalysisPaletteAsideSectionProps) {
  return (
    <>
      <section>
        <h3 className="text-sm font-medium text-gray-300 mb-2">Tu paleta</h3>
        <div className="flex gap-1.5">
          {effectiveColors.map((c, index) => {
            const ROLE_LABELS = ['P', 'S', 'A', 'A2'] as const;
            const label = ROLE_LABELS[index] ?? `${index + 1}`;
            const textColor = getContrastColor(c.hex);
            return (
              <button
                key={`${c.hex}-${index}`}
                type="button"
                className="flex-1 h-8 rounded-md border border-white/10 flex items-end justify-center pb-0.5 cursor-pointer"
                style={{ backgroundColor: c.hex }}
                onClick={() => {
                  setEditingColor({ type: 'main', index });
                  setDraftHex(c.hex);
                }}
              >
                <span
                  className="text-[9px] font-semibold mix-blend-normal drop-shadow-[0_0_4px_rgba(0,0,0,0.7)]"
                  style={{ color: textColor }}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {effectiveSupportColors != null && effectiveSupportColors.length > 0 && (
        <section className="mt-2">
          <div className="flex items-center justify-between gap-2 mb-2">
            <h3 className="text-sm font-medium text-gray-300">Tu paleta de apoyo</h3>
            {resetSupportPalette && (
              <div
                className="relative"
                onMouseEnter={() => {
                  const rect = supportResetButtonRef.current?.getBoundingClientRect();
                  if (rect) setSupportResetTooltipRect(rect);
                }}
                onMouseLeave={() => setSupportResetTooltipRect(null)}
              >
                {typeof document !== 'undefined' &&
                  supportResetTooltipRect &&
                  createPortal(
                    <span
                      role="tooltip"
                      className="fixed px-3 py-2 text-sm text-gray-100 bg-gray-900 border border-gray-600 rounded-lg shadow-xl whitespace-normal text-center pointer-events-none z-[200]"
                      style={{
                        left: supportResetTooltipRect.left + supportResetTooltipRect.width / 2,
                        top: supportResetTooltipRect.top,
                        transform: 'translate(-50%, calc(-100% - 8px))',
                        maxWidth: 'min(360px, 90vw)',
                        width: 'max-content',
                      }}
                    >
                      Restaurar paleta de apoyo al valor predeterminado
                    </span>,
                    document.body
                  )}
                <button
                  ref={supportResetButtonRef}
                  type="button"
                  onClick={resetSupportPalette}
                  className="p-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-gray-100 border border-gray-700 transition-colors"
                  aria-label="Restaurar paleta de apoyo al valor predeterminado"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
          <div className="flex gap-1.5">
            {effectiveSupportColors.map((item) => (
              <button
                key={item.initial}
                type="button"
                className="flex-1 h-8 rounded-md border border-white/10 flex items-end justify-center pb-0.5 cursor-pointer"
                style={{ backgroundColor: item.hex }}
                onClick={() => {
                  setEditingColor({ type: 'support', role: item.role });
                  setDraftHex(item.hex);
                }}
              >
                <span
                  className="text-[9px] font-semibold mix-blend-normal drop-shadow-[0_0_4px_rgba(0,0,0,0.7)]"
                  style={{ color: getContrastColor(item.hex) }}
                >
                  {item.initial}
                </span>
              </button>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
