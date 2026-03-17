import React from 'react';
import { hexToHsl, hslToHex } from '../utils/colorUtils';

interface ColorEditPanelBodyProps {
  draftHex: string;
  setDraftHex: (hex: string) => void;
  onAccept: () => void;
}

export function ColorEditPanelBody({ draftHex, setDraftHex, onAccept }: ColorEditPanelBodyProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="w-full h-24 rounded-xl shadow-inner shrink-0" style={{ backgroundColor: draftHex }} />
      <div className="flex items-center gap-3">
        <div className="relative w-14 h-14 shrink-0 rounded-lg border-2 border-gray-600 overflow-hidden">
          <input
            type="color"
            value={draftHex}
            onChange={(e) => setDraftHex(e.target.value)}
            className="absolute inset-0 w-full h-full cursor-pointer bg-transparent opacity-0"
            style={{ padding: 0 }}
            aria-label="Elegir color"
          />
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ backgroundColor: draftHex }}
            aria-hidden
          >
            <span className="w-7 h-7 rounded-full bg-black/40 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <label className="text-[10px] text-gray-500 uppercase tracking-wider block mb-1">HEX</label>
          <input
            type="text"
            value={draftHex.toUpperCase()}
            onChange={(e) => {
              const v = e.target.value;
              if (/^#[0-9A-Fa-f]{6}$/.test(v)) setDraftHex(v);
              const noHash = v.replace(/^#/, '');
              if (/^[0-9A-Fa-f]{6}$/.test(noHash)) setDraftHex('#' + noHash);
            }}
            className="w-full bg-gray-700 text-white text-sm font-mono px-3 py-2 rounded-lg border border-gray-600 focus:border-indigo-500 focus:outline-none"
            aria-label="Código HEX"
          />
        </div>
      </div>
      {/* Sliders HSL */}
      <div className="space-y-3">
        {(() => {
          const hsl = hexToHsl(draftHex);
          const update = (nextH: number, nextS: number, nextL: number) => {
            setDraftHex(hslToHex(nextH, nextS, nextL));
          };
          const hueGradient = 'linear-gradient(to right, red, yellow, lime, cyan, blue, magenta, red)';
          const satGradient = `linear-gradient(to right, ${hslToHex(hsl.h, 0, hsl.l)}, ${hslToHex(
            hsl.h,
            100,
            hsl.l
          )})`;
          const lumGradient = `linear-gradient(to right, #000000, ${hslToHex(
            hsl.h,
            hsl.s,
            50
          )}, #ffffff)`;

          return (
            <>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-[0.14em]">
                    Matiz
                  </span>
                  <span className="text-[11px] text-gray-300 font-mono">{hsl.h}°</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={360}
                  value={hsl.h}
                  onChange={(e) => update(Number(e.target.value), hsl.s, hsl.l)}
                  className="w-full h-1.5 rounded-full outline-none accent-white"
                  style={{ backgroundImage: hueGradient }}
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-[0.14em]">
                    Saturación
                  </span>
                  <span className="text-[11px] text-gray-300 font-mono">{hsl.s}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={hsl.s}
                  onChange={(e) => update(hsl.h, Number(e.target.value), hsl.l)}
                  className="w-full h-1.5 rounded-full outline-none accent-white"
                  style={{ backgroundImage: satGradient }}
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-[0.14em]">
                    Luminosidad
                  </span>
                  <span className="text-[11px] text-gray-300 font-mono">{hsl.l}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={hsl.l}
                  onChange={(e) => update(hsl.h, hsl.s, Number(e.target.value))}
                  className="w-full h-1.5 rounded-full outline-none accent-white"
                  style={{ backgroundImage: lumGradient }}
                />
              </div>
            </>
          );
        })()}
      </div>
      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={onAccept}
          className="flex-1 py-2.5 bg-green-600 hover:bg-green-500 text-white text-sm rounded-lg transition-colors font-medium"
        >
          ✓ Aceptar cambio
        </button>
      </div>
    </div>
  );
}

