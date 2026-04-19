import React from 'react';
import type { ColorItem } from '../../../types/guidedPalette';
import { getContrastRatioHex, hexToHsl, hslToHex, getLuminanceFromHex } from '../../../utils/colorUtils';
import { buildRoleHexMap } from './buildRoleHexMap';
import { computeAutoAdjustedPerceptualHexes } from './perceptual/autoAdjustPerceptualDeltaE';
import { computeAutoAdjustedTemperatureHexes } from './temperature/autoAdjustTemperatureHarmony';
import { computeAutoAdjustedVibrancyHexes } from './vibrancy/autoAdjustVibrancyHarmony';
import { computeAutoAdjustedCvdHexes } from './cvd/autoAdjustCvd';
import { computeAutoAdjustedHarmonyHexes } from './harmony/autoAdjustHarmony';
import { computeAutoAdjustedLightnessHexes } from './lightness/autoAdjustLightness';
import { toggleExclusivePanel } from './analysisAsideAccordionToggle';
import type { ContrastComboConfig, InfoPanelKey, RoleKey, SupportSwatch } from './types';
import { DEFAULT_CONTRAST_COMBOS, TOP_COMBOS_ROLE } from './types';

const INFO_PANEL_KEYS: readonly InfoPanelKey[] = ['ratio', 'importance', 'tip', 'references'];

type UseWcagContrastAnalysisParams = {
  colors: ColorItem[];
  supportColorsList: SupportSwatch[] | undefined;
  updateColorsWithHistory: (colors: ColorItem[]) => void;
  updateSupportColor?: (role: string, hex: string) => void;
  effectiveColors: ColorItem[];
  effectiveSupportColors: SupportSwatch[] | null | undefined;
};

const MAIN_PALETTE_ROLE_SET = new Set(['P', 'S', 'A', 'A2']);
const MAIN_ROLE_TO_INDEX: Record<string, number> = { P: 0, S: 1, A: 2, A2: 3 };

export function useWcagContrastAnalysis({
  colors,
  supportColorsList,
  updateColorsWithHistory,
  updateSupportColor,
  effectiveColors,
  effectiveSupportColors,
}: UseWcagContrastAnalysisParams) {
  const [comboConfigs] = React.useState<ContrastComboConfig[]>(DEFAULT_CONTRAST_COMBOS);
  const [explorerSelectedRole, setExplorerSelectedRole] = React.useState<RoleKey>(TOP_COMBOS_ROLE);
  const [selectedCombos, setSelectedCombos] = React.useState<ContrastComboConfig[]>([]);
  const [openInfoPanels, setOpenInfoPanels] = React.useState<Record<InfoPanelKey, boolean>>({
    ratio: false,
    importance: false,
    tip: false,
    references: false,
  });

  const toggleInfoPanel = React.useCallback((panel: InfoPanelKey) => {
    setOpenInfoPanels((current) => toggleExclusivePanel(panel, current, INFO_PANEL_KEYS));
  }, []);

  const roleHexMap = React.useMemo(
    () => buildRoleHexMap(effectiveColors, effectiveSupportColors),
    [effectiveColors, effectiveSupportColors]
  );

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
    if (!selectedCombos.length) return contrastCombos;

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

    const green = all.filter((c) => c.score >= 4.5);
    for (const combo of green) {
      if (selected.length >= 4) break;
      if (!usedBg.has(combo.bgRole)) {
        selected.push({ fgRole: combo.fgRole, bgRole: combo.bgRole });
        usedBg.add(combo.bgRole);
      }
    }

    if (selected.length < 4) {
      for (const combo of green) {
        if (selected.length >= 4) break;
        const key = `${combo.fgRole}->${combo.bgRole}`;
        if (!selected.some((c) => `${c.fgRole}->${c.bgRole}` === key)) {
          selected.push({ fgRole: combo.fgRole, bgRole: combo.bgRole });
        }
      }
    }

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
          supportColorsList.find((s) => s.initial === role) ?? supportColorsList.find((s) => s.role === role);
        if (target) {
          updateSupportColor(target.role, hex);
        }
      }
    },
    [colors, supportColorsList, updateColorsWithHistory, updateSupportColor]
  );

  /** Una sola entrada en historial para P/S/A/A2; apoyo sigue con `applyHexToRole` (sin historial de paleta principal). */
  const applyRoleHexUpdatesBatched = React.useCallback(
    (updates: Record<string, string>) => {
      let newColors = colors;
      let mainChanged = false;
      for (const role of MAIN_PALETTE_ROLE_SET) {
        const nextHex = updates[role];
        if (!nextHex) continue;
        const currentHex = roleHexMap[role]?.hex;
        if (!currentHex || nextHex.toLowerCase() === currentHex.toLowerCase()) continue;
        const index = MAIN_ROLE_TO_INDEX[role];
        if (index === undefined || !newColors[index]) continue;
        newColors = newColors.map((c, i) => (i === index ? { ...c, hex: nextHex } : c));
        mainChanged = true;
      }
      if (mainChanged) {
        updateColorsWithHistory(newColors);
      }
      for (const [role, nextHex] of Object.entries(updates)) {
        if (MAIN_PALETTE_ROLE_SET.has(role)) continue;
        const currentHex = roleHexMap[role]?.hex;
        if (currentHex && nextHex && nextHex.toLowerCase() !== currentHex.toLowerCase()) {
          applyHexToRole(role as RoleKey, nextHex);
        }
      }
    },
    [applyHexToRole, colors, roleHexMap, updateColorsWithHistory]
  );

  const handleAutoAdjustContrast = React.useCallback(() => {
    const roleHex: Record<'P' | 'S' | 'A' | 'A2' | 'F' | 'T', string | undefined> = {
      P: roleHexMap.P?.hex,
      S: roleHexMap.S?.hex,
      A: roleHexMap.A?.hex,
      A2: roleHexMap.A2?.hex,
      F: roleHexMap.F?.hex,
      T: roleHexMap.T?.hex,
    };

    if (roleHex.F) {
      const hsl = hexToHsl(roleHex.F);
      roleHex.F = hslToHex(hsl.h, Math.min(hsl.s, 30), Math.max(hsl.l, 93));
    }

    if (roleHex.T) {
      const hsl = hexToHsl(roleHex.T);
      roleHex.T = hslToHex(hsl.h, hsl.s, Math.min(hsl.l, 12));
    }

    comboConfigs.forEach((combo) => {
      const fgHex = roleHex[combo.fgRole as keyof typeof roleHex];
      const bgHex = roleHex[combo.bgRole as keyof typeof roleHex];
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
        const fgRole = combo.fgRole as keyof typeof roleHex;
        roleHex[fgRole] = candidate;
        attempts += 1;
      }
    });

    const contrastUpdates: Record<string, string> = {};
    for (const role of Object.keys(roleHex) as (keyof typeof roleHex)[]) {
      const nextHex = roleHex[role];
      const currentHex = roleHexMap[role]?.hex;
      if (nextHex && currentHex && nextHex.toLowerCase() !== currentHex.toLowerCase()) {
        contrastUpdates[role] = nextHex;
      }
    }
    applyRoleHexUpdatesBatched(contrastUpdates);
  }, [applyRoleHexUpdatesBatched, comboConfigs, roleHexMap]);

  const handleAutoAdjustPerceptualDeltaE = React.useCallback(() => {
    applyRoleHexUpdatesBatched(computeAutoAdjustedPerceptualHexes(roleHexMap));
  }, [applyRoleHexUpdatesBatched, roleHexMap]);

  const handleAutoAdjustTemperatureHarmony = React.useCallback(() => {
    applyRoleHexUpdatesBatched(computeAutoAdjustedTemperatureHexes(roleHexMap));
  }, [applyRoleHexUpdatesBatched, roleHexMap]);

  const handleAutoAdjustVibrancyHarmony = React.useCallback(() => {
    applyRoleHexUpdatesBatched(computeAutoAdjustedVibrancyHexes(roleHexMap));
  }, [applyRoleHexUpdatesBatched, roleHexMap]);

  const handleAutoAdjustCvd = React.useCallback(() => {
    applyRoleHexUpdatesBatched(computeAutoAdjustedCvdHexes(roleHexMap));
  }, [applyRoleHexUpdatesBatched, roleHexMap]);

  const handleAutoAdjustHarmony = React.useCallback(() => {
    applyRoleHexUpdatesBatched(computeAutoAdjustedHarmonyHexes(roleHexMap));
  }, [applyRoleHexUpdatesBatched, roleHexMap]);

  const handleAutoAdjustLightness = React.useCallback(() => {
    applyRoleHexUpdatesBatched(computeAutoAdjustedLightnessHexes(roleHexMap));
  }, [applyRoleHexUpdatesBatched, roleHexMap]);

  return {
    roleHexMap,
    explorerSelectedRole,
    setExplorerSelectedRole,
    selectedCombos,
    setSelectedCombos,
    displayCombos,
    contrastScore,
    badgeLabel,
    badgeClassName,
    sidebarScoreClass,
    sidebarFillClass,
    openInfoPanels,
    toggleInfoPanel,
    handleAutoAdjustContrast,
    handleAutoAdjustPerceptualDeltaE,
    handleAutoAdjustTemperatureHarmony,
    handleAutoAdjustVibrancyHarmony,
    handleAutoAdjustCvd,
    handleAutoAdjustHarmony,
    handleAutoAdjustLightness,
  };
}
