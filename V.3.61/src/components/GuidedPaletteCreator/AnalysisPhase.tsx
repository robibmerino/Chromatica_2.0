import React from 'react';
import { createPortal } from 'react-dom';
import { SectionBanner, SECTION_ICON_ACCENTS } from './SectionBanner';
import { COPY } from './config/copy';
import { PhaseLayout } from './PhaseLayout';
import { FloatingPanel } from './FloatingPanel';
import { ColorEditPanelBody } from '../ColorEditPanelBody';
import type { AnalysisTypeId } from './config/analysisTypeTabsConfig';
import type { ColorItem } from '../../types/guidedPalette';
import { getContrastColor, getContrastRatioHex, hexToHsl, hslToHex, getLuminanceFromHex } from '../../utils/colorUtils';

interface AnalysisPhaseProps {
  colors: ColorItem[];
  analysisType: AnalysisTypeId;
  setAnalysisType: (t: AnalysisTypeId) => void;
  updateColorsWithHistory: (colors: ColorItem[]) => void;
  setColors: (colors: ColorItem[] | ((prev: ColorItem[]) => ColorItem[])) => void;
  showNotification: (msg: string) => void;
  /** Paleta de apoyo actual (se puede editar por rol, igual que en Aplicar). */
  supportColorsList?: { role: string; label: string; initial: string; hex: string }[];
  updateSupportColor?: (role: string, hex: string) => void;
  resetSupportPalette?: () => void;
  goBack: () => void;
  goNext: () => void;
  undo: () => void;
  redo: () => void;
  undoDisabled: boolean;
  redoDisabled: boolean;
  onSavePalette?: () => void;
  lockPinned?: boolean;
  onLockToggle?: () => void;
  onOpenHistory?: () => void;
}

const ANALYSIS_ICON = (
  <svg
    className="w-4 h-4"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <circle cx="11" cy="11" r="6" />
    <line x1="16" y1="16" x2="21" y2="21" />
  </svg>
);

type EditingColor =
  | { type: 'main'; index: number }
  | { type: 'support'; role: string }
  | null;

type RoleKey = string;
const TOP_COMBOS_ROLE = '__TOP_COMBOS__';

type ContrastComboConfig = {
  fgRole: RoleKey;
  bgRole: RoleKey;
  description: string;
};

const DEFAULT_CONTRAST_COMBOS: ContrastComboConfig[] = [
  { fgRole: 'T', bgRole: 'F', description: 'Texto sobre fondo' },
  { fgRole: 'P', bgRole: 'F', description: 'Primario sobre fondo' },
  { fgRole: 'S', bgRole: 'P', description: 'Secundario sobre primario' },
  { fgRole: 'A', bgRole: 'P', description: 'Acento sobre primario' },
];

function AnalysisPhaseInner(props: AnalysisPhaseProps) {
  const {
    colors,
    supportColorsList,
    updateSupportColor,
    resetSupportPalette,
    goBack,
    goNext,
    undo,
    redo,
    undoDisabled,
    redoDisabled,
    onSavePalette,
    lockPinned = false,
    onLockToggle,
    onOpenHistory,
    updateColorsWithHistory,
    showNotification,
  } = props;

  const [editingColor, setEditingColor] = React.useState<EditingColor>(null);
  const [draftHex, setDraftHex] = React.useState('#000000');
  const [supportResetTooltipRect, setSupportResetTooltipRect] = React.useState<DOMRect | null>(null);
  const supportResetButtonRef = React.useRef<HTMLButtonElement | null>(null);

  const [comboConfigs, setComboConfigs] = React.useState<ContrastComboConfig[]>(DEFAULT_CONTRAST_COMBOS);
  const [explorerSelectedRole, setExplorerSelectedRole] = React.useState<RoleKey>(TOP_COMBOS_ROLE);
  const [adjustingRole, setAdjustingRole] = React.useState<RoleKey | null>(null);
  const [activeComboIndex, setActiveComboIndex] = React.useState(0);
  const [selectedCombos, setSelectedCombos] = React.useState<ContrastComboConfig[]>([]);
  const [isComboEditorOpen] = React.useState(false);

  // Colores "efectivos" (incluyen vista previa del modal sin tocar el historial global)
  const effectiveColors = React.useMemo(() => {
    if (!editingColor || editingColor.type !== 'main') return colors;
    return colors.map((c, i) =>
      i === editingColor.index
        ? {
            ...c,
            hex: draftHex,
          }
        : c
    );
  }, [colors, editingColor, draftHex]);

  const effectiveSupportColors = React.useMemo(() => {
    if (!supportColorsList) return supportColorsList;
    if (!editingColor || editingColor.type !== 'support') return supportColorsList;
    return supportColorsList.map((s) =>
      s.role === editingColor.role
        ? {
            ...s,
            hex: draftHex,
          }
        : s
    );
  }, [supportColorsList, editingColor, draftHex]);

  // --- Mapa de roles para P/S/A/A2/F/T y soporte extra ---
  const roleHexMap = React.useMemo(() => {
    const map: Record<string, { hex: string; label: string }> = {};
    if (effectiveColors[0]) map.P = { hex: effectiveColors[0].hex, label: 'Primario' };
    if (effectiveColors[1]) map.S = { hex: effectiveColors[1].hex, label: 'Secundario' };
    if (effectiveColors[2]) map.A = { hex: effectiveColors[2].hex, label: 'Acento' };
    if (effectiveColors[3]) map.A2 = { hex: effectiveColors[3].hex, label: 'Acento 2' };

    if (effectiveSupportColors) {
      effectiveSupportColors.forEach((s) => {
        if (s.initial) {
          map[s.initial] = { hex: s.hex, label: s.label };
        }
      });

      // Asegurar alias F y T si existen entradas equivalentes
      const fondo =
        effectiveSupportColors.find((s) => s.initial === 'F') ??
        effectiveSupportColors.find((s) => s.role === 'fondo') ??
        effectiveSupportColors[0];
      const texto =
        effectiveSupportColors.find((s) => s.initial === 'T') ??
        effectiveSupportColors.find((s) => s.role === 'texto') ??
        effectiveSupportColors.find((s) => s.role === 'texto fino');

      if (fondo) map.F = { hex: fondo.hex, label: fondo.label };
      if (texto) map.T = { hex: texto.hex, label: texto.label };
    }

    return map;
  }, [effectiveColors, effectiveSupportColors]);

  const contrastCombos = React.useMemo(() => {
    return comboConfigs
      .map((combo) => ({
        ...combo,
        fg: roleHexMap[combo.fgRole],
        bg: roleHexMap[combo.bgRole],
      }))
      .filter((c) => c.fg && c.bg) as {
      fgRole: RoleKey;
      bgRole: RoleKey;
      description: string;
      fg: { hex: string; label: string };
      bg: { hex: string; label: string };
    }[];
  }, [comboConfigs, roleHexMap]);

  const displayCombos = React.useMemo(() => {
    // Si no hay selección explícita, usamos las combinaciones derivadas de comboConfigs
    if (!selectedCombos.length) return contrastCombos;

    // Si hay selección, construimos las tarjetas directamente desde selectedCombos + roleHexMap
    return selectedCombos
      .map((combo) => {
        const fg = roleHexMap[combo.fgRole];
        const bg = roleHexMap[combo.bgRole];
        if (!fg || !bg) return null;
        return {
          fgRole: combo.fgRole,
          bgRole: combo.bgRole,
          description: combo.description,
          fg,
          bg,
        };
      })
      .filter((c): c is NonNullable<typeof c> => Boolean(c));
  }, [contrastCombos, roleHexMap, selectedCombos]);

  // Selección inicial: 4 combinaciones más favorables (si no hay selección previa)
  React.useEffect(() => {
    if (!Object.keys(roleHexMap).length || selectedCombos.length > 0) return;

    const roles = Object.keys(roleHexMap) as RoleKey[];
    const all: { fgRole: RoleKey; bgRole: RoleKey; score: number }[] = [];
    roles.forEach((fg) => {
      roles.forEach((bg) => {
        if (fg === bg) return;
        const fgHex = roleHexMap[fg]?.hex;
        const bgHex = roleHexMap[bg]?.hex;
        if (!fgHex || !bgHex) return;
        const ratio = getContrastRatioHex(fgHex, bgHex);
        all.push({ fgRole: fg, bgRole: bg, score: ratio });
      });
    });

    all.sort((a, b) => b.score - a.score);

    const selected: { fgRole: RoleKey; bgRole: RoleKey }[] = [];
    const usedBg = new Set<RoleKey>();

    // 1) Priorizar combinaciones "verdes" (AA o superior) con fondos distintos
    const green = all.filter((c) => c.score >= 4.5);
    for (const combo of green) {
      if (selected.length >= 4) break;
      if (!usedBg.has(combo.bgRole)) {
        selected.push({ fgRole: combo.fgRole, bgRole: combo.bgRole });
        usedBg.add(combo.bgRole);
      }
    }

    // 2) Si aún faltan, completar con otras verdes (aunque repitan fondo)
    if (selected.length < 4) {
      for (const combo of green) {
        if (selected.length >= 4) break;
        const key = `${combo.fgRole}->${combo.bgRole}`;
        if (!selected.some((c) => `${c.fgRole}->${c.bgRole}` === key)) {
          selected.push({ fgRole: combo.fgRole, bgRole: combo.bgRole });
        }
      }
    }

    // 3) Si siguen faltando, rellenar con las mejores restantes (no verdes)
    if (selected.length < 4) {
      for (const combo of all) {
        if (selected.length >= 4) break;
        const key = `${combo.fgRole}->${combo.bgRole}`;
        if (!selected.some((c) => `${c.fgRole}->${c.bgRole}` === key)) {
          selected.push({ fgRole: combo.fgRole, bgRole: combo.bgRole });
        }
      }
    }

    const top = selected.map(({ fgRole, bgRole }) => ({
      fgRole,
      bgRole,
      description: `${roleHexMap[fgRole]?.label ?? fgRole} sobre ${roleHexMap[bgRole]?.label ?? bgRole}`,
    }));
    if (top.length) {
      setSelectedCombos(top);
    }
  }, [roleHexMap, selectedCombos.length]);

  const contrastScore = React.useMemo(() => {
    // El análisis se basa solo en las combinaciones activas/visibles
    if (!displayCombos.length) return null;
    let total = 0;
    displayCombos.forEach((c) => {
      const ratio = getContrastRatioHex(c.fg.hex, c.bg.hex);
      if (ratio >= 7) total += 100;
      else if (ratio >= 4.5) total += 75;
      else if (ratio >= 3) total += 40;
      else total += 10;
    });
    return Math.round(total / displayCombos.length);
  }, [displayCombos]);

  const { badgeLabel, badgeClassName } = React.useMemo(() => {
    if (contrastScore == null) {
      return {
        badgeLabel: '--',
        badgeClassName: 'bg-slate-700/80 text-slate-200',
      };
    }
    if (contrastScore >= 85) {
      return {
        badgeLabel: 'Excelente',
        badgeClassName: 'bg-emerald-500/15 text-emerald-300',
      };
    }
    if (contrastScore >= 65) {
      return {
        badgeLabel: 'Mejorable',
        badgeClassName: 'bg-amber-500/15 text-amber-300',
      };
    }
    if (contrastScore >= 45) {
      return {
        badgeLabel: 'Insuficiente',
        badgeClassName: 'bg-orange-500/15 text-orange-300',
      };
    }
    return {
      badgeLabel: 'Crítico',
      badgeClassName: 'bg-rose-500/15 text-rose-300',
    };
  }, [contrastScore]);

  const { sidebarScoreClass, sidebarFillClass } = React.useMemo(() => {
    if (contrastScore == null) {
      return {
        sidebarScoreClass: 'text-slate-500',
        sidebarFillClass: 'bg-slate-600',
      };
    }

    if (contrastScore >= 85) {
      return {
        sidebarScoreClass: 'text-emerald-400',
        sidebarFillClass: 'bg-emerald-400',
      };
    }

    if (contrastScore >= 65) {
      return {
        sidebarScoreClass: 'text-cyan-400',
        sidebarFillClass: 'bg-cyan-400',
      };
    }

    if (contrastScore >= 45) {
      return {
        sidebarScoreClass: 'text-amber-400',
        sidebarFillClass: 'bg-amber-400',
      };
    }

    return {
      sidebarScoreClass: 'text-rose-400',
      sidebarFillClass: 'bg-rose-500',
    };
  }, [contrastScore]);

  const applyHexToRole = React.useCallback(
    (role: RoleKey, hex: string) => {
      if (role === 'P' || role === 'S' || role === 'A' || role === 'A2') {
        const index = { P: 0, S: 1, A: 2, A2: 3 }[role];
        if (colors[index]) {
          const updated = colors.map((c, i) => (i === index ? { ...c, hex } : c));
          updateColorsWithHistory(updated);
        }
        return;
      }

      if (supportColorsList && updateSupportColor) {
        const target =
          supportColorsList.find((s) => s.initial === role) ??
          supportColorsList.find((s) => s.role === role);
        if (target) {
          updateSupportColor(target.role, hex);
        }
      }
    },
    [colors, supportColorsList, updateColorsWithHistory, updateSupportColor]
  );

  return (
    <PhaseLayout
      phaseKey="analysis"
      className="flex flex-col gap-4 min-h-0 max-h-[calc(100vh-10rem)]"
      header={
        <SectionBanner
          onBack={goBack}
          title="Análisis de la paleta"
          subtitle="Detecta problemas de contraste, equilibrio y accesibilidad"
          icon={ANALYSIS_ICON}
          iconBoxClassName={SECTION_ICON_ACCENTS.emerald}
          primaryLabel="Exportar →"
          onPrimaryClick={goNext}
          onUndo={undo}
          onRedo={redo}
          undoDisabled={undoDisabled}
          redoDisabled={redoDisabled}
          savePaletteLabel={COPY.nav.savePalette}
          onSavePalette={onSavePalette}
          lockPinned={lockPinned}
          onLockToggle={onLockToggle}
          lockTooltipSectionName="Análisis"
          onOpenHistory={onOpenHistory}
        />
      }
      footer={null}
    >
      {/* Layout principal de 3 columnas (inspirado en tu HTML de referencia). */}
      <div className="flex-1 min-h-0 overflow-hidden w-full flex">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)_280px] gap-4 flex-1 items-stretch min-h-[520px] md:min-h-[580px] lg:min-h-[640px]">
          {/* Columna izquierda: resumen y aspectos */}
          <aside className="hidden lg:flex flex-col bg-gray-900/80 border border-gray-700/80 rounded-2xl px-3 py-3 gap-3 overflow-hidden h-full">
              {/* Puntuación global (por ahora basada solo en contraste) */}
              <div className="rounded-2xl bg-gradient-to-br from-[#1e2140] via-[#252a63] to-[#3b2f7f] border border-indigo-500/40 px-6 py-3.5 flex flex-col gap-2 shadow-[0_10px_32px_rgba(15,23,42,0.75)]">
                <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-indigo-100/85 text-center">
                  Puntuación global
                </span>
                <div className="flex items-baseline justify-center gap-1 mt-1">
                  <span className="text-[28px] leading-none font-extrabold text-[#8da2ff]">
                    {contrastScore != null ? contrastScore : '--'}
                  </span>
                  <span className="text-xs text-indigo-200/85 font-medium mt-[2px]">/100</span>
                </div>
                <div className="mt-2 h-[4px] rounded-full bg-[#151936] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#8fd5ff] via-[#8f7bff] to-[#7a4ff5] transition-all duration-300"
                    style={{ width: `${contrastScore ?? 0}%` }}
                  />
                </div>
              </div>

              {/* Lista de aspectos */}
              <div className="flex-1 min-h-0 overflow-y-auto space-y-1.5 pr-1">
                <p className="px-1 text-[10px] font-semibold tracking-[0.16em] uppercase text-gray-500">
                  Accesibilidad
                </p>

                <button
                  type="button"
                  className="w-full text-left rounded-xl border border-indigo-500/60 bg-slate-900/70 hover:bg-slate-900 hover:border-indigo-400 transition-colors px-3 py-2.5 flex items-center gap-3 shadow-[0_0_0_1px_rgba(129,140,248,0.45)]"
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
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 2a10 10 0 0 1 0 20V2z" fill="currentColor" stroke="none" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-50 truncate">Contraste WCAG</p>
                    <div className="mt-1 h-[3px] rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${sidebarFillClass}`}
                        style={{ width: `${contrastScore ?? 0}%` }}
                      />
                    </div>
                  </div>
                  <span className={`text-xs font-bold min-w-[36px] text-right ${sidebarScoreClass}`}>
                    {contrastScore != null ? `${contrastScore}%` : '--'}
                  </span>
                </button>
              </div>
          </aside>

          {/* Columna central: área principal de análisis – Contraste WCAG */}
          <main className="rounded-2xl bg-slate-950/70 border border-slate-800 overflow-hidden h-full flex flex-col">
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
              {/* Header del aspecto */}
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-cyan-500/15 text-cyan-300 flex items-center justify-center">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-5 h-5"
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
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-semibold text-slate-50">Contraste WCAG</h2>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${badgeClassName}`}
                    >
                      {badgeLabel}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:shadow-md hover:from-indigo-400 hover:to-fuchsia-400 transition"
                  onClick={() => {
                    const roleHex: Record<'P' | 'S' | 'A' | 'A2' | 'F' | 'T', string | undefined> = {
                      P: roleHexMap.P?.hex,
                      S: roleHexMap.S?.hex,
                      A: roleHexMap.A?.hex,
                      A2: roleHexMap.A2?.hex,
                      F: roleHexMap.F?.hex,
                      T: roleHexMap.T?.hex,
                    };

                    // 1) Aclarar fondo
                    if (roleHex.F) {
                      const hsl = hexToHsl(roleHex.F);
                      roleHex.F = hslToHex(hsl.h, Math.min(hsl.s, 30), Math.max(hsl.l, 93));
                    }

                    // 2) Oscurecer texto
                    if (roleHex.T) {
                      const hsl = hexToHsl(roleHex.T);
                      roleHex.T = hslToHex(hsl.h, hsl.s, Math.min(hsl.l, 12));
                    }

                    // 3) Para cada combinación, ajustar fg si no pasa AA
                    comboConfigs.forEach((combo) => {
                      const fgHex = roleHex[combo.fgRole];
                      const bgHex = roleHex[combo.bgRole];
                      if (!fgHex || !bgHex) return;

                      let ratio = getContrastRatioHex(fgHex, bgHex);
                      if (ratio >= 4.5) return;

                      const bgLum = getLuminanceFromHex(bgHex);
                      const baseHsl = hexToHsl(fgHex);
                      let l = baseHsl.l;
                      const direction = bgLum > 0.5 ? -2 : 2;
                      let attempts = 0;

                      while (ratio < 4.5 && attempts < 50) {
                        l = Math.max(0, Math.min(100, l + direction));
                        const candidate = hslToHex(baseHsl.h, baseHsl.s, l);
                        ratio = getContrastRatioHex(candidate, bgHex);
                        roleHex[combo.fgRole] = candidate;
                        attempts += 1;
                      }
                    });

                    // Aplicar cambios por rol
                    (Object.keys(roleHex) as (keyof typeof roleHex)[]).forEach((role) => {
                      const nextHex = roleHex[role];
                      const currentHex = roleHexMap[role]?.hex;
                      if (nextHex && currentHex && nextHex.toLowerCase() !== currentHex.toLowerCase()) {
                        applyHexToRole(role, nextHex);
                      }
                    });
                  }}
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
                  Auto-ajustar
                </button>
              </div>

              {/* Combinaciones evaluadas */}
              <section className="rounded-2xl bg-slate-900/70 border border-slate-800 overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-800/80">
                  <h3 className="text-sm font-semibold text-slate-200">Combinaciones evaluadas</h3>
                </div>

                <div className="px-5 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {displayCombos.map((combo) => {
                      const ratio = getContrastRatioHex(combo.fg.hex, combo.bg.hex);
                      const ratioLabel = `${ratio.toFixed(1)}:1`;
                      const passAA = ratio >= 4.5;
                      const passLarge = ratio >= 3;

                      let tagClasses = 'bg-rose-500/20 text-rose-300';
                      let tagText = `${ratioLabel} · ✗ Falla`;
                      if (passAA) {
                        tagClasses = 'bg-emerald-500/20 text-emerald-300';
                        tagText = `${ratioLabel} · ✓ AA`;
                      } else if (passLarge) {
                        tagClasses = 'bg-amber-400/20 text-amber-300';
                        tagText = `${ratioLabel} · ~ AA lg`;
                      }

                      return (
                        <div
                          key={`${combo.fgRole}-${combo.bgRole}`}
                          className="relative rounded-2xl border-2 border-slate-800/90 px-4 py-4 min-h-[120px] flex flex-col justify-end shadow-sm hover:-translate-y-0.5 hover:shadow-lg transition"
                          style={{ backgroundColor: combo.bg.hex, color: combo.fg.hex }}
                        >
                          <div
                            className={`absolute top-2.5 right-2.5 inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold backdrop-blur-sm ${tagClasses}`}
                          >
                            {tagText}
                          </div>
                          <div className="text-[10px] font-semibold uppercase tracking-[0.16em] opacity-70 mb-1">
                            {combo.fg.label} → {combo.bg.label}
                          </div>
                          <div className="text-base font-semibold mb-0.5">
                            {combo.description}
                          </div>
                          <p className="text-xs opacity-90 leading-snug">
                            Texto de ejemplo para evaluar la legibilidad de esta combinación.
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Editor de combinaciones (inline) */}
                  {isComboEditorOpen && (
                    <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-900/80 px-4 py-3.5">
                      <p className="text-xs font-semibold text-slate-200 mb-3">
                        Personalizar combinaciones evaluadas
                      </p>
                      <div className="space-y-2">
                        {comboConfigs.map((combo, index) => (
                          <button
                            key={`${combo.fgRole}-${combo.bgRole}-${index}`}
                            type="button"
                            onClick={() => setActiveComboIndex(index)}
                            className={`w-full flex items-center gap-2 border-b border-slate-800/70 pb-2 last:border-b-0 last:pb-0 text-left ${
                              activeComboIndex === index ? 'ring-1 ring-indigo-400/70 rounded-md bg-slate-900' : ''
                            }`}
                          >
                            <span className="w-4 text-[11px] font-semibold text-slate-500">{index + 1}</span>
                            <select
                              className="flex-1 min-w-0 rounded-md border border-slate-700 bg-slate-900/80 px-2.5 py-1.5 text-xs font-semibold text-slate-100 focus:outline-none focus:border-indigo-500"
                              value={combo.fgRole}
                              onChange={(e) => {
                                const next = [...comboConfigs];
                                const fgRole = e.target.value as RoleKey;
                                next[index] = {
                                  ...next[index],
                                  fgRole,
                                  description: `${roleHexMap[fgRole]?.label ?? fgRole} sobre ${
                                    roleHexMap[next[index].bgRole]?.label ?? next[index].bgRole
                                  }`,
                                };
                                setComboConfigs(next);
                              }}
                            >
                    {(Object.keys(roleHexMap) as RoleKey[]).map((role) => (
                      <option key={role} value={role}>
                        {role} — {roleHexMap[role]?.label ?? ''}
                      </option>
                    ))}
                            </select>
                            <span className="text-[11px] font-semibold text-slate-500">sobre</span>
                            <select
                              className="flex-1 min-w-0 rounded-md border border-slate-700 bg-slate-900/80 px-2.5 py-1.5 text-xs font-semibold text-slate-100 focus:outline-none focus:border-indigo-500"
                              value={combo.bgRole}
                              onChange={(e) => {
                                const next = [...comboConfigs];
                                const bgRole = e.target.value as RoleKey;
                                next[index] = {
                                  ...next[index],
                                  bgRole,
                                  description: `${roleHexMap[next[index].fgRole]?.label ?? next[index].fgRole} sobre ${
                                    roleHexMap[bgRole]?.label ?? bgRole
                                  }`,
                                };
                                setComboConfigs(next);
                              }}
                            >
                              {(Object.keys(roleHexMap) as RoleKey[]).map((role) => (
                                <option key={role} value={role}>
                                  {role} — {roleHexMap[role]?.label ?? ''}
                                </option>
                              ))}
                            </select>
                            <button
                              type="button"
                              disabled={comboConfigs.length <= 1}
                              onClick={() => {
                                if (comboConfigs.length <= 1) return;
                                setComboConfigs((current) => current.filter((_, i) => i !== index));
                              }}
                              className="ml-1 inline-flex h-7 w-7 items-center justify-center rounded-md border border-transparent text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 disabled:opacity-40 disabled:cursor-default disabled:hover:bg-transparent disabled:hover:text-slate-500"
                            >
                              <svg
                                viewBox="0 0 24 24"
                                className="w-3.5 h-3.5"
                                aria-hidden
                                fill="none"
                                stroke="currentColor"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                              </svg>
                            </button>
                          </button>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const nextFg: ContrastComboConfig['fgRole'] = 'P';
                          const nextBg: ContrastComboConfig['bgRole'] = 'F';
                          setComboConfigs((current) => [
                            ...current,
                            {
                              fgRole: nextFg,
                              bgRole: nextBg,
                              description: `${roleHexMap[nextFg]?.label ?? nextFg} sobre ${
                                roleHexMap[nextBg]?.label ?? nextBg
                              }`,
                            },
                          ]);
                        }}
                        className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-md border border-dashed border-indigo-500/50 bg-indigo-500/5 px-3 py-1.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-500/10"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="w-3.5 h-3.5"
                          aria-hidden
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <line x1="12" y1="5" x2="12" y2="19" />
                          <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        Añadir combinación
                      </button>
                    </div>
                  )}
                </div>
              </section>

              {/* Explorador de ratios */}
              <section className="rounded-2xl bg-slate-900/70 border border-slate-800 overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-800/80">
                  <h3 className="text-sm font-semibold text-slate-200">Explorador de ratios</h3>
                </div>
                <div className="px-5 py-4 space-y-3">
                  {/* Selector de color */}
                  <div className="flex flex-wrap gap-1.5">
                    {/* Botón de 6 mejores combinaciones */}
                    <button
                      type="button"
                      onClick={() => setExplorerSelectedRole(TOP_COMBOS_ROLE)}
                      className={`inline-flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-xs font-semibold transition ${
                        explorerSelectedRole === TOP_COMBOS_ROLE
                          ? 'border-cyan-400 bg-cyan-500/10 text-slate-50'
                          : 'border-slate-700 bg-slate-900/80 text-slate-200 hover:border-slate-500'
                      }`}
                    >
                      <span className="inline-flex h-4 w-4 items-center justify-center rounded-full border border-white/40">
                        <svg
                          viewBox="0 0 24 24"
                          className="w-3 h-3"
                          aria-hidden
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                      <span>Top 6</span>
                    </button>

                    {(Object.keys(roleHexMap) as RoleKey[])
                      .filter((role) => roleHexMap[role])
                      .map((role) => {
                        const roleInfo = roleHexMap[role]!;
                        const isActive = explorerSelectedRole === role;
                        return (
                          <button
                            key={role}
                            type="button"
                            onClick={() => setExplorerSelectedRole(role)}
                            className={`inline-flex items-center gap-2 rounded-md border px-2.5 py-1.5 text-xs font-semibold transition ${
                              isActive
                                ? 'border-cyan-400 bg-cyan-500/10 text-slate-50'
                                : 'border-slate-700 bg-slate-900/80 text-slate-200 hover:border-slate-500'
                            }`}
                          >
                            <span
                              className="inline-block h-4 w-4 rounded-[4px] border border-white/10"
                              style={{ backgroundColor: roleInfo.hex }}
                            />
                            <span>{role}</span>
                          </button>
                        );
                      })}
                  </div>

                  {/* Grid de resultados */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {(() => {
                      const roles = Object.keys(roleHexMap) as RoleKey[];

                      // Vista "Top 6": mejores combinaciones globales
                      if (explorerSelectedRole === TOP_COMBOS_ROLE) {
                        const all: { fgRole: RoleKey; bgRole: RoleKey; ratio: number }[] = [];
                        roles.forEach((fg) => {
                          roles.forEach((bg) => {
                            if (fg === bg) return;
                            const fgHex = roleHexMap[fg]?.hex;
                            const bgHex = roleHexMap[bg]?.hex;
                            if (!fgHex || !bgHex) return;
                            const ratio = getContrastRatioHex(fgHex, bgHex);
                            all.push({ fgRole: fg, bgRole: bg, ratio });
                          });
                        });

                        all.sort((a, b) => b.ratio - a.ratio);
                        const top6 = all.slice(0, 6);

                        return top6.map(({ fgRole, bgRole, ratio }) => {
                          const selectedInfo = roleHexMap[fgRole]!;
                          const other = roleHexMap[bgRole]!;
                          const rLabel = `${ratio.toFixed(1)}:1`;
                          const passAAA = ratio >= 7;
                          const passAA = ratio >= 4.5;
                          const passLarge = ratio >= 3;

                          let valueColor = 'text-rose-400';
                          if (passAAA) valueColor = 'text-emerald-400';
                          else if (passAA) valueColor = 'text-cyan-400';
                          else if (passLarge) valueColor = 'text-amber-300';

                          const isSelected = selectedCombos.some(
                            (c) => c.fgRole === fgRole && c.bgRole === bgRole
                          );

                          return (
                            <button
                              key={`${fgRole}-${bgRole}`}
                              type="button"
                              onClick={() => {
                                setSelectedCombos((current) => {
                                  const exists = current.some(
                                    (c) => c.fgRole === fgRole && c.bgRole === bgRole
                                  );
                                  if (exists) {
                                    return current.filter(
                                      (c) => !(c.fgRole === fgRole && c.bgRole === bgRole)
                                    );
                                  }
                                  return [
                                    ...current,
                                    {
                                      fgRole,
                                      bgRole,
                                      description: `${roleHexMap[fgRole]?.label ?? fgRole} sobre ${
                                        roleHexMap[bgRole]?.label ?? bgRole
                                      }`,
                                    },
                                  ];
                                });
                              }}
                              className={`rounded-xl px-3.5 py-3 text-center transition border ${
                                isSelected
                                  ? 'bg-slate-900 border-cyan-400/80 shadow-[0_0_0_1px_rgba(34,211,238,0.5)]'
                                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-600'
                              }`}
                            >
                              <div
                                className="mb-2 flex h-9 items-center justify-center rounded-md border border-white/5 text-xs font-semibold"
                                style={{ backgroundColor: other.hex, color: selectedInfo.hex }}
                              >
                                Aa
                              </div>
                              <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                                <span>
                                  {fgRole} → {bgRole}
                                </span>
                                <span className={`text-xs font-bold ${valueColor}`}>{rLabel}</span>
                              </div>
                              <div className="mt-1.5 flex justify-center gap-1">
                                <span
                                  className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${
                                    passLarge ? 'bg-cyan-500/15 text-cyan-300' : 'bg-rose-500/10 text-rose-300'
                                  }`}
                                >
                                  AA lg
                                </span>
                                <span
                                  className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${
                                    passAA ? 'bg-cyan-500/15 text-cyan-300' : 'bg-rose-500/10 text-rose-300'
                                  }`}
                                >
                                  AA
                                </span>
                                <span
                                  className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${
                                    passAAA ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/10 text-rose-300'
                                  }`}
                                >
                                  AAA
                                </span>
                              </div>
                            </button>
                          );
                        });
                      }

                      // Vista por color seleccionado (comportamiento anterior)
                      const selected = roleHexMap[explorerSelectedRole];
                      if (!selected) return null;

                      const keys = roles;
                      return keys
                        .filter((k) => k !== explorerSelectedRole)
                        .map((k) => {
                          const other = roleHexMap[k]!;
                          const ratio = getContrastRatioHex(selected.hex, other.hex);
                          const rLabel = `${ratio.toFixed(1)}:1`;
                          const passAAA = ratio >= 7;
                          const passAA = ratio >= 4.5;
                          const passLarge = ratio >= 3;

                          let valueColor = 'text-rose-400';
                          if (passAAA) valueColor = 'text-emerald-400';
                          else if (passAA) valueColor = 'text-cyan-400';
                          else if (passLarge) valueColor = 'text-amber-300';

                          const isSelected = selectedCombos.some(
                            (c) => c.fgRole === explorerSelectedRole && c.bgRole === k
                          );

                          return (
                            <button
                              key={`${explorerSelectedRole}-${k}`}
                              type="button"
                              onClick={() => {
                                setSelectedCombos((current) => {
                                  const exists = current.some(
                                    (c) => c.fgRole === explorerSelectedRole && c.bgRole === k
                                  );
                                  if (exists) {
                                    return current.filter(
                                      (c) => !(c.fgRole === explorerSelectedRole && c.bgRole === k)
                                    );
                                  }
                                  return [
                                    ...current,
                                    {
                                      fgRole: explorerSelectedRole,
                                      bgRole: k,
                                      description: `${roleHexMap[explorerSelectedRole]?.label ?? explorerSelectedRole} sobre ${
                                        roleHexMap[k]?.label ?? k
                                      }`,
                                    },
                                  ];
                                });
                              }}
                              className={`rounded-xl px-3.5 py-3 text-center transition border ${
                                isSelected
                                  ? 'bg-slate-900 border-cyan-400/80 shadow-[0_0_0_1px_rgba(34,211,238,0.5)]'
                                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-600'
                              }`}
                            >
                              <div
                                className="mb-2 flex h-9 items-center justify-center rounded-md border border-white/5 text-xs font-semibold"
                                style={{ backgroundColor: other.hex, color: selected.hex }}
                              >
                                Aa
                              </div>
                              <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                                <span>
                                  {explorerSelectedRole} → {k}
                                </span>
                                <span className={`text-xs font-bold ${valueColor}`}>{rLabel}</span>
                              </div>
                              <div className="mt-1.5 flex justify-center gap-1">
                                <span
                                  className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${
                                    passLarge ? 'bg-cyan-500/15 text-cyan-300' : 'bg-rose-500/10 text-rose-300'
                                  }`}
                                >
                                  AA lg
                                </span>
                                <span
                                  className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${
                                    passAA ? 'bg-cyan-500/15 text-cyan-300' : 'bg-rose-500/10 text-rose-300'
                                  }`}
                                >
                                  AA
                                </span>
                                <span
                                  className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${
                                    passAAA ? 'bg-emerald-500/15 text-emerald-300' : 'bg-rose-500/10 text-rose-300'
                                  }`}
                                >
                                  AAA
                                </span>
                              </div>
                            </button>
                          );
                        });
                    })()}
                  </div>
                </div>
              </section>

            </div>
          </main>

          {/* Columna derecha: info contextual y paleta */}
          <aside className="hidden md:flex flex-col rounded-2xl bg-gray-900/80 border border-gray-700/80 px-3.5 py-3 gap-3 overflow-hidden h-full">
            <div className="flex-1 min-h-0 overflow-y-auto space-y-3 pr-1">
              {/* Paleta actual en formato “pastillas” */}
              <section>
                <h3 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400 mb-2">
                  <span className="inline-flex w-5 h-5 items-center justify-center rounded-md bg-gray-900/80 border border-gray-700/80 text-[10px]">
                    ◦
                  </span>
                  Tu paleta
                </h3>
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

              {/* Paleta de apoyo (mismo layout que la paleta principal) */}
              {effectiveSupportColors != null && effectiveSupportColors.length > 0 && (
                <section className="mt-2">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h3 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400">
                      Tu paleta de apoyo
                    </h3>
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

              {/* Info: Contraste WCAG */}
              <section className="mt-3 space-y-3">
                <div className="rounded-2xl bg-slate-900/80 border border-slate-800 px-3 py-3">
                  <h4 className="mb-2 flex items-center gap-2 text-[12px] font-semibold text-slate-100">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-3.5 h-3.5 text-cyan-400"
                      aria-hidden
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                    </svg>
                    ¿Qué es el ratio de contraste?
                  </h4>
                  <p className="text-[12px] leading-relaxed text-slate-300">
                    El <span className="text-cyan-300 font-semibold">ratio de contraste</span> mide la diferencia de
                    luminancia relativa entre dos colores superpuestos (texto / fondo). Se expresa como N:1, donde 21:1
                    es el máximo (blanco sobre negro).
                  </p>
                  <div className="mt-3 flex gap-1.5">
                    <div className="flex-1 rounded-md bg-slate-950/70 border border-slate-800 px-2.5 py-1.5 text-center">
                      <p className="text-[11px] font-semibold text-slate-100">AA</p>
                      <p className="mt-0.5 text-[10px] text-slate-400">≥ 4.5:1</p>
                    </div>
                    <div className="flex-1 rounded-md bg-slate-950/70 border border-slate-800 px-2.5 py-1.5 text-center">
                      <p className="text-[11px] font-semibold text-slate-100">AA grande</p>
                      <p className="mt-0.5 text-[10px] text-slate-400">≥ 3:1</p>
                    </div>
                    <div className="flex-1 rounded-md bg-slate-950/70 border border-slate-800 px-2.5 py-1.5 text-center">
                      <p className="text-[11px] font-semibold text-slate-100">AAA</p>
                      <p className="mt-0.5 text-[10px] text-slate-400">≥ 7:1</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-900/80 border border-slate-800 px-3 py-3">
                  <h4 className="mb-2 flex items-center gap-2 text-[12px] font-semibold text-slate-100">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-3.5 h-3.5 text-cyan-400"
                      aria-hidden
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="16" x2="12" y2="12" />
                      <line x1="12" y1="8" x2="12.01" y2="8" />
                    </svg>
                    ¿Por qué importa?
                  </h4>
                  <p className="text-[12px] leading-relaxed text-slate-300">
                    Cerca del <span className="text-cyan-300 font-semibold">15% de la población mundial</span>{' '}
                    experimenta algún tipo de discapacidad, y las deficiencias visuales son las más prevalentes. Un
                    contraste suficiente garantiza legibilidad en condiciones adversas: pantallas con brillo bajo, luz
                    solar directa o usuarios con baja visión.
                  </p>
                </div>

                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 px-3 py-3">
                  <h5 className="mb-1.5 flex items-center gap-2 text-[11px] font-semibold text-emerald-300">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-3.5 h-3.5"
                      aria-hidden
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 18h6" />
                      <path d="M10 22h4" />
                      <path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z" />
                    </svg>
                    Consejo rápido
                  </h5>
                  <p className="text-[11px] leading-relaxed text-emerald-50/90">
                    Ajustar la <span className="font-semibold">luminosidad</span> entre un 5‑15% suele ser suficiente
                    para pasar WCAG AA sin alterar la identidad cromática de tu paleta.
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-900/80 border border-slate-800 px-3 py-3 space-y-2">
                  <h4 className="flex items-center gap-2 text-[12px] font-semibold text-slate-100">
                    <svg
                      viewBox="0 0 24 24"
                      className="w-3.5 h-3.5 text-indigo-400"
                      aria-hidden
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                    </svg>
                    Referencias
                  </h4>

                  <div className="rounded-xl border border-indigo-500/25 bg-indigo-500/5 px-3 py-2">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-indigo-300">
                      Estándar internacional
                    </p>
                    <p className="mt-1 text-[12px] font-semibold text-slate-50">
                      Web Content Accessibility Guidelines (WCAG) 2.1
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Kirkpatrick, A., Connor, J. O., Campbell, A., &amp; Cooper, M. (2018) — W3C Recommendation.
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-indigo-200">
                      Artículo científico
                    </p>
                    <p className="mt-1 text-[12px] font-semibold text-slate-50">
                      Adjustable typography: an approach to enhancing low vision text accessibility
                    </p>
                    <p className="text-[11px] text-slate-400">Arditi, A. (2004).</p>
                    <p className="mt-0.5 text-[10px] font-mono text-indigo-300/80">
                      doi:10.1080/00140130410001695555
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-indigo-200">
                      Artículo científico
                    </p>
                    <p className="mt-1 text-[12px] font-semibold text-slate-50">
                      Psychophysics of reading—II. Low vision
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Legge, G. E., Rubin, G. S., &amp; Luebker, A. (1987).
                    </p>
                    <p className="mt-0.5 text-[10px] font-mono text-indigo-300/80">
                      doi:10.1016/0042-6989(87)90174-7
                    </p>
                  </div>
                </div>
              </section>
            </div>
          </aside>
        </div>
      </div>

      {/* Modal de edición de color (similar al de Aplicar, flotante y redimensionable) */}
      {editingColor && (
        <FloatingPanel
          open={true}
          onClose={() => setEditingColor(null)}
          title={
            editingColor.type === 'main'
              ? 'Editar color principal'
              : 'Editar color de apoyo'
          }
          initialWidth={360}
          initialHeight={560}
        >
          <ColorEditPanelBody
            draftHex={draftHex}
            setDraftHex={setDraftHex}
            onAccept={() => {
              if (editingColor?.type === 'main') {
                const updated = colors.map((c, i) =>
                  i === editingColor.index ? { ...c, hex: draftHex } : c
                );
                updateColorsWithHistory(updated);
                showNotification(COPY.notifications.changesApplied);
              } else if (editingColor?.type === 'support' && updateSupportColor) {
                updateSupportColor(editingColor.role, draftHex);
                showNotification(COPY.notifications.changesApplied);
              }
              setEditingColor(null);
            }}
          />
        </FloatingPanel>
      )}
    </PhaseLayout>
  );
}

export const AnalysisPhase = React.memo(AnalysisPhaseInner);
