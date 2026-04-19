import { useCallback, useRef, useState } from 'react';
import { hexToHsl, hslToHex } from '../utils/colorUtils';

interface ColorEditPanelBodyProps {
  draftHex: string;
  setDraftHex: (hex: string) => void;
  onAccept: () => void;
}

type HslState = { h: number; s: number; l: number };

function clampHsl(p: HslState): HslState {
  return {
    h: Math.max(0, Math.min(360, Math.round(p.h))),
    s: Math.max(0, Math.min(100, Math.round(p.s))),
    l: Math.max(0, Math.min(100, Math.round(p.l))),
  };
}

/**
 * Los sliders gobiernan H/S/L en estado local; el hex se deriva solo con hslToHex.
 * Así evitamos el bucle HSL→RGB (enteros)→HSL que al mover L cerca de 0/100 alteraba
 * matiz/saturación y producía parpadeos al re-leer hexToHsl(draftHex) cada frame.
 */
function initialHslFromHex(hex: string): HslState {
  const p = hexToHsl(hex);
  return clampHsl({ h: p.h, s: p.s, l: p.l });
}

export function ColorEditPanelBody({ draftHex, setDraftHex, onAccept }: ColorEditPanelBodyProps) {
  const [hsl, setHsl] = useState(() => initialHslFromHex(draftHex));
  /** Copia síncrona del HSL actual para patch; no depender del retorno del updater de setState (p. ej. React 19) antes de setDraftHex. */
  const hslRef = useRef<HslState>(initialHslFromHex(draftHex));

  const patchHsl = useCallback(
    (patch: (prev: HslState) => HslState) => {
      const next = clampHsl(patch(hslRef.current));
      hslRef.current = next;
      setHsl(next);
      setDraftHex(hslToHex(next.h, next.s, next.l));
    },
    [setDraftHex]
  );

  const applyExternalHex = useCallback(
    (hex: string) => {
      const next = initialHslFromHex(hex);
      hslRef.current = next;
      setHsl(next);
      setDraftHex(hslToHex(next.h, next.s, next.l));
    },
    [setDraftHex]
  );

  const derivedHex = hslToHex(hsl.h, hsl.s, hsl.l);

  const hueGradient = 'linear-gradient(to right, red, yellow, lime, cyan, blue, magenta, red)';
  const satGradient = `linear-gradient(to right, ${hslToHex(hsl.h, 0, hsl.l)}, ${hslToHex(hsl.h, 100, hsl.l)})`;
  const lumGradient = `linear-gradient(to right, #000000, ${hslToHex(hsl.h, hsl.s, 50)}, #ffffff)`;

  return (
    <div className="flex flex-col gap-4">
      <div className="w-full h-24 rounded-xl shadow-inner shrink-0" style={{ backgroundColor: derivedHex }} />
      <div className="flex items-center gap-3">
        <div className="relative w-14 h-14 shrink-0 rounded-lg border-2 border-gray-600 overflow-hidden">
          <input
            type="color"
            value={derivedHex}
            onChange={(e) => applyExternalHex(e.target.value)}
            className="absolute inset-0 w-full h-full cursor-pointer bg-transparent opacity-0"
            style={{ padding: 0 }}
            aria-label="Elegir color"
          />
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ backgroundColor: derivedHex }}
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
            value={derivedHex.toUpperCase()}
            onChange={(e) => {
              const v = e.target.value;
              if (/^#[0-9A-Fa-f]{6}$/.test(v)) {
                applyExternalHex(v);
                return;
              }
              const noHash = v.replace(/^#/, '');
              if (/^[0-9A-Fa-f]{6}$/.test(noHash)) {
                applyExternalHex('#' + noHash);
              }
            }}
            className="w-full bg-gray-700 text-white text-sm font-mono px-3 py-2 rounded-lg border border-gray-600 focus:border-indigo-500 focus:outline-none"
            aria-label="Código HEX"
          />
        </div>
      </div>
      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-[0.14em]">Matiz</span>
            <span className="text-[11px] text-gray-300 font-mono">{hsl.h}°</span>
          </div>
          <input
            type="range"
            min={0}
            max={360}
            value={hsl.h}
            onChange={(e) => patchHsl((prev) => ({ ...prev, h: Number(e.target.value) }))}
            className="w-full h-1.5 rounded-full outline-none accent-white"
            style={{ backgroundImage: hueGradient }}
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-[0.14em]">Saturación</span>
            <span className="text-[11px] text-gray-300 font-mono">{hsl.s}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={hsl.s}
            onChange={(e) => patchHsl((prev) => ({ ...prev, s: Number(e.target.value) }))}
            className="w-full h-1.5 rounded-full outline-none accent-white"
            style={{ backgroundImage: satGradient }}
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-[0.14em]">Luminosidad</span>
            <span className="text-[11px] text-gray-300 font-mono">{hsl.l}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            value={hsl.l}
            onChange={(e) => patchHsl((prev) => ({ ...prev, l: Number(e.target.value) }))}
            className="w-full h-1.5 rounded-full outline-none accent-white"
            style={{ backgroundImage: lumGradient }}
          />
        </div>
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
