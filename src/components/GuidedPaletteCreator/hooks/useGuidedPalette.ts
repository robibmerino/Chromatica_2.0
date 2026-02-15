import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import type { ColorItem, Phase, InspirationMode, SavedPalette } from '../../../types/guidedPalette';
import { buildColorPaletteFromHarmony } from '../../../types/palette';
import { COPY } from '../config/copy';
import { PHASES } from '../config/phasesConfig';
import { HISTORY_MAX_SIZE, NOTIFICATION_DURATION_MS, COLOR_COUNT_MAX } from '../config/refinementConstants';
import { generateId, generateHarmoniousNewColor, hexToHsl, hslToHex } from '../../../utils/colorUtils';

export type SupportPaletteRole = 'fondo' | 'sobrefondo' | 'texto' | 'texto fino' | 'fondo2' | 'sobrefondo2';

export type SupportPaletteVariant = 'claro' | 'oscuro';

/** Roles de la paleta de apoyo editables en Refinar. */
export const SUPPORT_PALETTE_ROLES: { role: SupportPaletteRole; label: string; initial: string }[] = [
  { role: 'fondo', label: 'Fondo', initial: 'F' },
  { role: 'sobrefondo', label: 'Sobrefondo', initial: 'Sf' },
  { role: 'texto', label: 'Texto principal', initial: 'T' },
  { role: 'texto fino', label: 'Texto secundario', initial: 'Ts' },
  { role: 'fondo2', label: 'Fondo 2', initial: 'F2' },
  { role: 'sobrefondo2', label: 'Sobrefondo 2', initial: 'Sf2' },
];

/**
 * Toda la lógica de estado y acciones del flujo Guided Palette.
 * El componente principal solo orquesta la vista usando este hook.
 */
export function useGuidedPalette() {
  const [phase, setPhase] = useState<Phase>('inspiration-menu');
  const [inspirationMode, setInspirationMode] = useState<InspirationMode | null>(null);
  const [colors, setColors] = useState<ColorItem[]>([]);
  const [colorCount, setColorCount] = useState(4);
  const [selectedColorIndex, setSelectedColorIndex] = useState<number | null>(null);
  const [paletteName, setPaletteName] = useState('');
  const [savedPalettes, setSavedPalettes] = useState<SavedPalette[]>([]);
  const [notification, setNotification] = useState<string | null>(null);
  const [showMyPalettes, setShowMyPalettes] = useState(false);
  const [analysisType, setAnalysisType] = useState<'basic' | 'scientific'>('basic');
  const [refinementMode, setRefinementMode] = useState<'color' | 'general'>('color');
  const [history, setHistory] = useState<ColorItem[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [originalPalette, setOriginalPalette] = useState<ColorItem[]>([]);
  const [sliderReference, setSliderReference] = useState<ColorItem[]>([]);
  const [lastRemovedColor, setLastRemovedColor] = useState<ColorItem | null>(null);
  const [supportOverridesByVariant, setSupportOverridesByVariant] = useState<
    Record<SupportPaletteVariant, Partial<Record<SupportPaletteRole, string>>>
  >({ claro: {}, oscuro: {} });
  const [supportVariant, setSupportVariant] = useState<SupportPaletteVariant>('claro');
  const [selectedSupportRole, setSelectedSupportRole] = useState<SupportPaletteRole | null>(null);
  /** Snapshot al entrar en Aplicar: se usa para "Reiniciar" y deshacer todos los cambios en esta sección. */
  const [applicationSnapshot, setApplicationSnapshot] = useState<{
    colors: ColorItem[];
    supportOverridesByVariant: Record<SupportPaletteVariant, Partial<Record<SupportPaletteRole, string>>>;
  } | null>(null);
  const prevPhaseRef = useRef<Phase>('inspiration-menu');

  const saveToHistory = useCallback(
    (newColors: ColorItem[]) => {
      setHistory((prev) => {
        const newHistory = prev.slice(0, historyIndex + 1);
        newHistory.push([...newColors]);
        return newHistory.slice(-HISTORY_MAX_SIZE);
      });
      setHistoryIndex((prev) => Math.min(prev + 1, HISTORY_MAX_SIZE - 1));
    },
    [historyIndex]
  );

  const updateColorsWithHistory = useCallback(
    (newColors: ColorItem[]) => {
      setColors(newColors);
      saveToHistory(newColors);
    },
    [saveToHistory]
  );

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1);
      setColors(history[historyIndex - 1]);
    }
  }, [historyIndex, history]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((prev) => prev + 1);
      setColors(history[historyIndex + 1]);
    }
  }, [historyIndex, history]);

  const adjustPaletteSaturation = useCallback(
    (amount: number) => {
      const newColors = colors.map((c) => {
        if (c.locked) return c;
        const hsl = hexToHsl(c.hex);
        const newS = Math.max(0, Math.min(100, hsl.s + amount));
        return { ...c, hex: hslToHex(hsl.h, newS, hsl.l) };
      });
      setColors(newColors);
      saveToHistory(newColors);
    },
    [colors, saveToHistory]
  );

  const adjustPaletteLightness = useCallback(
    (amount: number) => {
      const newColors = colors.map((c) => {
        if (c.locked) return c;
        const hsl = hexToHsl(c.hex);
        const newL = Math.max(5, Math.min(95, hsl.l + amount));
        return { ...c, hex: hslToHex(hsl.h, hsl.s, newL) };
      });
      setColors(newColors);
      saveToHistory(newColors);
    },
    [colors, saveToHistory]
  );

  const adjustPaletteHue = useCallback(
    (amount: number) => {
      const newColors = colors.map((c) => {
        if (c.locked) return c;
        const hsl = hexToHsl(c.hex);
        const newH = (hsl.h + amount + 360) % 360;
        return { ...c, hex: hslToHex(newH, hsl.s, hsl.l) };
      });
      setColors(newColors);
      saveToHistory(newColors);
    },
    [colors, saveToHistory]
  );

  useEffect(() => {
    const saved = localStorage.getItem('colorPalettes');
    if (saved) setSavedPalettes(JSON.parse(saved));
  }, []);

  useEffect(() => {
    const prevPhase = prevPhaseRef.current;
    if (phase === 'refinement' && colors.length > 0) {
      // Solo guardar la "paleta original" la primera vez que se entra a Refinar (desde Inspiración)
      const isFirstEntryToRefinement = prevPhase === 'inspiration-detail';
      if (isFirstEntryToRefinement) {
        setOriginalPalette([...colors]);
        setSliderReference([...colors]);
        setHistory([[...colors]]);
        setHistoryIndex(0);
        setLastRemovedColor(null);
        setSelectedColorIndex(0);
        setSelectedSupportRole(null);
      }
    }
    if (prevPhase !== phase && phase === 'application' && colors.length > 0) {
      setApplicationSnapshot({
        colors: colors.map((c) => ({ ...c })),
        supportOverridesByVariant: {
          claro: { ...supportOverridesByVariant.claro },
          oscuro: { ...supportOverridesByVariant.oscuro },
        },
      });
    }
    prevPhaseRef.current = phase;
  }, [phase, colors, supportOverridesByVariant]);

  const showNotification = useCallback((message: string) => {
    setNotification(message);
    setTimeout(() => setNotification(null), NOTIFICATION_DURATION_MS);
  }, []);

  const handleInspirationComplete = useCallback((newColors: string[]) => {
    setColors(
      newColors.map((hex) => ({
        id: generateId(),
        hex,
        locked: false,
      }))
    );
    setPhase('refinement');
  }, []);

  const updateColor = useCallback((id: string, hex: string) => {
    setColors((prev) => prev.map((c) => (c.id === id ? { ...c, hex } : c)));
  }, []);

  const addColor = useCallback(() => {
    if (colors.length >= COLOR_COUNT_MAX) return;
    const newColor: ColorItem = lastRemovedColor
      ? { ...lastRemovedColor, locked: false }
      : {
          id: generateId(),
          hex: generateHarmoniousNewColor(colors.map((c) => c.hex)),
          locked: false,
        };
    const newColors = [...colors, newColor];
    setColors(newColors);
    saveToHistory(newColors);
    setSelectedColorIndex(colors.length);
    setLastRemovedColor(null);
    showNotification(COPY.notifications.colorAdded);
  }, [colors, lastRemovedColor, saveToHistory, showNotification]);

  const removeColorAt = useCallback(
    (index: number) => {
      if (colors.length <= 2) return;
      const removed = colors[index];
      const newColors = colors.filter((_, i) => i !== index);
      setColors(newColors);
      saveToHistory(newColors);
      setLastRemovedColor(removed);
      setSelectedColorIndex(
        selectedColorIndex === index
          ? Math.min(index, newColors.length - 1)
          : selectedColorIndex !== null && selectedColorIndex > index
            ? selectedColorIndex - 1
            : selectedColorIndex
      );
      showNotification(COPY.notifications.colorRemoved);
    },
    [colors, selectedColorIndex, saveToHistory, showNotification]
  );

  const shuffleColors = useCallback(() => {
    setColors((prev) => {
      const unlocked = prev.filter((c) => !c.locked);
      for (let i = unlocked.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [unlocked[i], unlocked[j]] = [unlocked[j], unlocked[i]];
      }
      const result: ColorItem[] = [];
      let unlockedIndex = 0;
      prev.forEach((c) => {
        if (c.locked) result.push(c);
        else result.push(unlocked[unlockedIndex++]);
      });
      return result;
    });
    showNotification(COPY.notifications.colorsShuffled);
  }, [showNotification]);

  const savePalette = useCallback(() => {
    if (!paletteName.trim()) {
      showNotification(COPY.notifications.addPaletteName);
      return;
    }
    const newPalette: SavedPalette = {
      id: generateId(),
      name: paletteName,
      colors: colors.map((c) => c.hex),
      createdAt: new Date(),
    };
    const updated = [...savedPalettes, newPalette];
    setSavedPalettes(updated);
    localStorage.setItem('colorPalettes', JSON.stringify(updated));
    showNotification(COPY.notifications.paletteSaved);
  }, [paletteName, colors, savedPalettes, showNotification]);

  const selectedColor = selectedColorIndex !== null ? colors[selectedColorIndex] : null;

  /** Paleta de apoyo: derivada de colores según variante (claro/oscuro) + overrides de esa variante. */
  const supportColorsList = useMemo(() => {
    const hexes = colors.map((c) => c.hex);
    if (hexes.length === 0) return [];
    const defaultPalette = buildColorPaletteFromHarmony(hexes, supportVariant);
    const col = defaultPalette.colors;
    const overrides = supportOverridesByVariant[supportVariant];
    const list: { role: SupportPaletteRole; label: string; initial: string; hex: string }[] = [];
    for (const { role, label, initial } of SUPPORT_PALETTE_ROLES) {
      const defaultHex = col[role as keyof typeof col];
      if (defaultHex == null) continue;
      list.push({ role, label, initial, hex: overrides[role] ?? defaultHex });
    }
    return list;
  }, [colors, supportVariant, supportOverridesByVariant]);

  const updateSupportColor = useCallback((role: SupportPaletteRole, hex: string) => {
    setSupportOverridesByVariant((prev) => ({
      ...prev,
      [supportVariant]: { ...prev[supportVariant], [role]: hex },
    }));
  }, [supportVariant]);

  const resetSupportPalette = useCallback(() => {
    setSupportOverridesByVariant((prev) => ({ ...prev, [supportVariant]: {} }));
    setSelectedSupportRole(null);
  }, [supportVariant]);

  /** Reinicia todas las overrides de paleta de apoyo (claro y oscuro). Usado al confirmar "Reiniciar" general. */
  const resetAllSupportOverrides = useCallback(() => {
    setSupportOverridesByVariant({ claro: {}, oscuro: {} });
    setSelectedSupportRole(null);
  }, []);

  /** Restaura paleta y paletas de apoyo al estado al entrar en Aplicar. Usado al confirmar "Reiniciar" en Aplicar. */
  const resetApplicationToSnapshot = useCallback(() => {
    if (!applicationSnapshot) return;
    setColors([...applicationSnapshot.colors]);
    setSupportOverridesByVariant({
      claro: { ...applicationSnapshot.supportOverridesByVariant.claro },
      oscuro: { ...applicationSnapshot.supportOverridesByVariant.oscuro },
    });
    setHistory([[...applicationSnapshot.colors]]);
    setHistoryIndex(0);
    setSelectedSupportRole(null);
    showNotification(COPY.application.restoreNotification);
  }, [applicationSnapshot, showNotification]);

  const currentPhaseIndex = PHASES.findIndex(
    (p) => p.id === phase || (phase === 'inspiration-detail' && p.id === 'inspiration-menu')
  );

  const goToPhase = useCallback((targetPhase: Phase) => {
    if (targetPhase === 'inspiration-menu') setInspirationMode(null);
    setPhase(targetPhase);
  }, []);

  const goBack = useCallback(() => {
    switch (phase) {
      case 'inspiration-detail':
        setPhase('inspiration-menu');
        setInspirationMode(null);
        break;
      case 'refinement':
        setPhase('inspiration-detail');
        break;
      case 'application':
        setPhase('refinement');
        break;
      case 'analysis':
        setPhase('application');
        break;
      case 'save':
        setPhase('analysis');
        break;
    }
  }, [phase]);

  const goNext = useCallback(() => {
    switch (phase) {
      case 'refinement':
        setPhase('application');
        break;
      case 'application':
        setPhase('analysis');
        break;
      case 'analysis':
        setPhase('save');
        break;
    }
  }, [phase]);

  const handleInspirationSelect = useCallback((mode: InspirationMode) => {
    setInspirationMode(mode);
    setPhase('inspiration-detail');
  }, []);

  const handleLogoClick = useCallback(() => {
    setColors([]);
    setPaletteName('');
    setPhase('inspiration-menu');
    setInspirationMode(null);
  }, []);

  const handleStartNewPalette = useCallback(() => {
    setColors([]);
    setPaletteName('');
    setPhase('inspiration-menu');
    setInspirationMode(null);
  }, []);

  return {
    phase,
    inspirationMode,
    setInspirationMode,
    colors,
    colorCount,
    setColorCount,
    selectedColorIndex,
    selectedColor,
    paletteName,
    setPaletteName,
    savedPalettes,
    setSavedPalettes,
    notification,
    showMyPalettes,
    setShowMyPalettes,
    analysisType,
    setAnalysisType,
    refinementMode,
    setRefinementMode,
    historyIndex,
    historyLength: history.length,
    originalPalette,
    sliderReference,
    setColors,
    setSelectedColorIndex,
    selectedSupportRole,
    setSelectedSupportRole,
    supportVariant,
    setSupportVariant,
    supportColorsList,
    supportOverridesByVariant,
    updateSupportColor,
    resetSupportPalette,
    resetAllSupportOverrides,
    setSliderReference,
    setPhase,
    saveToHistory,
    updateColorsWithHistory,
    showNotification,
    undo,
    redo,
    shuffleColors,
    updateColor,
    addColor,
    removeColorAt,
    lastRemovedColor,
    adjustPaletteSaturation,
    adjustPaletteLightness,
    adjustPaletteHue,
    handleInspirationComplete,
    savePalette,
    currentPhaseIndex,
    goToPhase,
    goBack,
    goNext,
    handleInspirationSelect,
    handleLogoClick,
    handleStartNewPalette,
    resetApplicationToSnapshot,
    hasApplicationSnapshot: applicationSnapshot !== null,
  };
}
