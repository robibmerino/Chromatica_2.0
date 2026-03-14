import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import type { ColorItem, Phase, InspirationMode, SavedPalette } from '../../../types/guidedPalette';
import { useAuth } from '../../../contexts/AuthContext';
import { fetchPalettes, insertPalette, deletePalette } from '../../../lib/supabasePalettes';
import { invalidatePalettes } from '../../../hooks/usePalettesQuery';

/** Estado guardado por modo de inspiración para restaurar al volver desde Refinar. */
export type InspirationDetailSavedState = Partial<Record<InspirationMode, unknown>>;

/** Posiciones de los sliders de "Ajusta la paleta" (tono, saturación, luminosidad) para persistir al cambiar de sección. */
export interface RefinementGeneralSliders {
  tone: number;
  sat: number;
  light: number;
}

const DEFAULT_REFINEMENT_SLIDERS: RefinementGeneralSliders = { tone: 0, sat: 0, light: 0 };

/** Estado de Refinar guardado por flujo (origen de inspiración) para restaurar al volver desde Inspiración en la cadena. */
export interface RefinementSavedState {
  colors: ColorItem[];
  history: ColorItem[][];
  historyIndex: number;
  originalPalette: ColorItem[];
  sliderReference: ColorItem[];
  supportOverridesByVariant: Record<SupportPaletteVariant, Partial<Record<SupportPaletteRole, string>>>;
  supportVariant: SupportPaletteVariant;
  selectedColorIndex: number | null;
  selectedSupportRole: SupportPaletteRole | null;
  refinementMode: 'color' | 'general';
  lastRemovedColor: ColorItem | null;
  /** Posiciones de los sliders de Ajusta la paleta (para no resetear al volver). */
  refinementGeneralSliders?: RefinementGeneralSliders;
}

/** Qué secciones del eje Refinar-Aplicar-Análisis han tenido ediciones en este flujo (para mostrar check solo en esas). */
export interface FlowSectionEdited {
  refinement: boolean;
  application: boolean;
  analysis: boolean;
}

/** Paleta común única por flujo para Refinar, Aplicar, Análisis y Guardar. Una vez activada no se borra salvo que se confirme "Usar paleta" en Inspiración. */
export interface FlowPaletteState extends RefinementSavedState {
  editedInRefinement?: boolean;
  editedInApplication?: boolean;
  editedInAnalysis?: boolean;
}
import { buildColorPaletteFromHarmony } from '../../../types/palette';
import { COPY } from '../config/copy';
import { PHASES, STEPPER_STEPS } from '../config/phasesConfig';
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

/** Petición para abrir una paleta guardada en el flujo Paleta combinada (Refinar o Guardar). */
export interface OpenPaletteRequest {
  palette: SavedPalette;
  openInPhase: 'refinement' | 'save';
}

export interface UseGuidedPaletteOptions {
  /** Si se proporciona, al montar se carga esta paleta en el flujo "Paleta combinada" y se va a Refinar o Guardar. */
  initialPaletteRequest?: OpenPaletteRequest | null;
  /** Se invoca después de aplicar la petición para que el padre limpie la referencia. */
  onConsumeOpenPalette?: () => void;
}

/**
 * Toda la lógica de estado y acciones del flujo Guided Palette.
 * El componente principal solo orquesta la vista usando este hook.
 */
export function useGuidedPalette(options?: UseGuidedPaletteOptions) {
  const { initialPaletteRequest, onConsumeOpenPalette } = options ?? {};
  const { user } = useAuth();
  const appliedOpenRequestRef = useRef<string | null>(null);
  const inspirationModesVisitedRef = useRef<Set<string>>(new Set());
  const [phase, setPhase] = useState<Phase>('inspiration-menu');
  const [inspirationMode, setInspirationMode] = useState<InspirationMode | null>(null);
  /** Estado guardado de cada modo de inspiración para restaurar al volver desde Refinar. */
  const [inspirationDetailSavedState, setInspirationDetailSavedState] = useState<InspirationDetailSavedState>({});
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
  /** Posiciones de los sliders "Ajusta la paleta" (RefinementGeneralMode) para persistir al cambiar de sección. */
  const [refinementGeneralSliders, setRefinementGeneralSliders] = useState<RefinementGeneralSliders>({
    tone: 0,
    sat: 0,
    light: 0,
  });
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
  /** Paleta común por flujo (Refinar + Aplicar + Análisis + Guardar). Una sola fuente de verdad; se borra solo al confirmar "Usar paleta" en Inspiración. */
  const [flowPaletteStateByInspiration, setFlowPaletteStateByInspiration] = useState<
    Partial<Record<InspirationMode, FlowPaletteState>>
  >({});
  /** Última paleta generada en cada flujo de inspiración (para mostrar en Refinar si aún no hay estado guardado). */
  const [inspirationGeneratedPaletteByMode, setInspirationGeneratedPaletteByMode] = useState<
    Partial<Record<InspirationMode, string[]>>
  >({});
  /** Flujos en los que el usuario ya pulsó "Usar paleta" al menos una vez; sin esto no se puede ir a Refinar/Aplicar/etc. en esa cadena. */
  const [inspirationFlowEverCompleted, setInspirationFlowEverCompleted] = useState<
    Partial<Record<InspirationMode, true>>
  >({});
  const prevPhaseRef = useRef<Phase>('inspiration-menu');
  const historyIndexRef = useRef(historyIndex);
  const notificationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isRestoringRefinementRef = useRef(false);
  const isRestoringApplicationRef = useRef(false);
  historyIndexRef.current = historyIndex;

  useEffect(() => {
    return () => {
      if (notificationTimeoutRef.current) clearTimeout(notificationTimeoutRef.current);
    };
  }, []);

  /** Marcar modos de inspiración visitados (para lógica interna; sin envío a research). */
  useEffect(() => {
    if (phase !== 'inspiration-detail' || !inspirationMode) return;
    const mode = inspirationMode === 'archetypes-menu' ? 'archetypes' : inspirationMode;
    inspirationModesVisitedRef.current.add(mode);
  }, [phase, inspirationMode]);

  const saveToHistory = useCallback((newColors: ColorItem[]) => {
    const idx = historyIndexRef.current;
    setHistory((prev) => {
      const newHistory = prev.slice(0, idx + 1);
      newHistory.push([...newColors]);
      return newHistory.slice(-HISTORY_MAX_SIZE);
    });
    setHistoryIndex((prev) => Math.min(prev + 1, HISTORY_MAX_SIZE - 1));
  }, []);

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

  /** Carga paletas: desde Supabase si hay usuario, desde localStorage si no. */
  useEffect(() => {
    if (user?.id) {
      fetchPalettes(user.id).then(setSavedPalettes);
    } else {
      const saved = localStorage.getItem('colorPalettes');
      if (saved) {
        try {
          const parsed = JSON.parse(saved) as SavedPalette[];
          setSavedPalettes(
            parsed.map((p) => ({ ...p, createdAt: p.createdAt instanceof Date ? p.createdAt : new Date(p.createdAt) }))
          );
        } catch {
          setSavedPalettes([]);
        }
      } else setSavedPalettes([]);
    }
  }, [user?.id]);

  /** Abrir una paleta guardada en el flujo Paleta combinada (Refinar o Guardar). */
  useEffect(() => {
    const req = initialPaletteRequest;
    if (!req?.palette?.colors?.length) return;
    const key = `${req.palette.id}:${req.openInPhase}`;
    if (appliedOpenRequestRef.current === key) return;
    appliedOpenRequestRef.current = key;
    const mode: InspirationMode = 'multi-origin';
    setInspirationMode(mode);
    setInspirationFlowEverCompleted((prev) => ({ ...prev, [mode]: true }));
    const colorItems = req.palette.colors.map((hex) => ({
      id: generateId(),
      hex,
      locked: false,
    }));
    setColors(colorItems);
    setHistory([[...colorItems]]);
    setHistoryIndex(0);
    setOriginalPalette([...colorItems]);
    setSliderReference([...colorItems]);
    setRefinementGeneralSliders(DEFAULT_REFINEMENT_SLIDERS);
    if (req.openInPhase === 'refinement') {
      setPhase('refinement');
    } else {
      const flowSnapshot: FlowPaletteState = {
        colors: colorItems.map((c) => ({ ...c })),
        history: [[...colorItems.map((c) => ({ ...c }))]],
        historyIndex: 0,
        originalPalette: colorItems.map((c) => ({ ...c })),
        sliderReference: colorItems.map((c) => ({ ...c })),
        supportOverridesByVariant: { claro: {}, oscuro: {} },
        supportVariant: 'claro',
        selectedColorIndex: 0,
        selectedSupportRole: null,
        refinementMode: 'color',
        lastRemovedColor: null,
        refinementGeneralSliders: DEFAULT_REFINEMENT_SLIDERS,
        editedInRefinement: true,
        editedInApplication: true,
        editedInAnalysis: true,
      };
      setFlowPaletteStateByInspiration((prev) => ({ ...prev, [mode]: flowSnapshot }));
      setPhase('save');
    }
    onConsumeOpenPalette?.();
  }, [initialPaletteRequest, onConsumeOpenPalette]);

  useEffect(() => {
    const prevPhase = prevPhaseRef.current;
    if (phase === 'refinement' && colors.length > 0) {
      // Solo guardar la "paleta original" la primera vez que se entra a Refinar (desde Inspiración), salvo si estamos restaurando estado guardado
      const isFirstEntryToRefinement = prevPhase === 'inspiration-detail';
      if (isFirstEntryToRefinement && !isRestoringRefinementRef.current) {
        setOriginalPalette([...colors]);
        setSliderReference([...colors]);
        setHistory([[...colors]]);
        setHistoryIndex(0);
        setLastRemovedColor(null);
        setSelectedColorIndex(0);
        setSelectedSupportRole(null);
      }
      if (isRestoringRefinementRef.current) isRestoringRefinementRef.current = false;
    }
    if (prevPhase !== phase && phase === 'application' && colors.length > 0) {
      if (!isRestoringApplicationRef.current) {
        setApplicationSnapshot({
          colors: colors.map((c) => ({ ...c })),
          supportOverridesByVariant: {
            claro: { ...supportOverridesByVariant.claro },
            oscuro: { ...supportOverridesByVariant.oscuro },
          },
        });
      }
      if (isRestoringApplicationRef.current) isRestoringApplicationRef.current = false;
    }
    prevPhaseRef.current = phase;
  }, [phase, colors, supportOverridesByVariant]);

  const showNotification = useCallback((message: string) => {
    if (notificationTimeoutRef.current) clearTimeout(notificationTimeoutRef.current);
    setNotification(message);
    notificationTimeoutRef.current = setTimeout(() => {
      notificationTimeoutRef.current = null;
      setNotification(null);
    }, NOTIFICATION_DURATION_MS);
  }, []);

  const handleInspirationComplete = useCallback(
    (newColors: string[], savedState?: unknown) => {
      if (inspirationMode) {
        setInspirationFlowEverCompleted((prev) => ({ ...prev, [inspirationMode]: true }));
      }
      setColors(
        newColors.map((hex) => ({
          id: generateId(),
          hex,
          locked: false,
        }))
      );
      if (inspirationMode && savedState != null) {
        setInspirationDetailSavedState((prev) => ({ ...prev, [inspirationMode]: savedState }));
      }
      setRefinementGeneralSliders(DEFAULT_REFINEMENT_SLIDERS);
      setPhase('refinement');
    },
    [inspirationMode]
  );

  /** Pendiente de confirmación cuando "Usar paleta" borraría cambios en Refinar/Aplicar/etc. de este flujo */
  const [pendingInspirationComplete, setPendingInspirationComplete] = useState<{
    newColors: string[];
    savedState?: unknown;
    inspirationMode: InspirationMode;
  } | null>(null);

  const requestInspirationComplete = useCallback(
    (newColors: string[], savedState?: unknown) => {
      if (!inspirationMode) {
        handleInspirationComplete(newColors, savedState);
        return;
      }
      const hasFlowPalette = flowPaletteStateByInspiration[inspirationMode] != null;
      if (hasFlowPalette) {
        setPendingInspirationComplete({ newColors, savedState, inspirationMode });
      } else {
        handleInspirationComplete(newColors, savedState);
      }
    },
    [inspirationMode, flowPaletteStateByInspiration, handleInspirationComplete]
  );

  const confirmInspirationComplete = useCallback(() => {
    if (!pendingInspirationComplete) return;
    const { newColors, savedState, inspirationMode: mode } = pendingInspirationComplete;
    setInspirationFlowEverCompleted((prev) => ({ ...prev, [mode]: true }));
    setFlowPaletteStateByInspiration((prev) => {
      const next = { ...prev };
      delete next[mode];
      return next;
    });
    setApplicationSnapshot(null);
    setColors(
      newColors.map((hex) => ({
        id: generateId(),
        hex,
        locked: false,
      }))
    );
    if (mode && savedState != null) {
      setInspirationDetailSavedState((prev) => ({ ...prev, [mode]: savedState }));
    }
    setRefinementGeneralSliders(DEFAULT_REFINEMENT_SLIDERS);
    setPhase('refinement');
    setPendingInspirationComplete(null);
  }, [pendingInspirationComplete]);

  const cancelInspirationComplete = useCallback(() => {
    setPendingInspirationComplete(null);
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

  const savePalette = useCallback(async () => {
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
    if (user?.id) {
      const { error } = await insertPalette(user.id, newPalette);
      if (error) {
        setSavedPalettes(savedPalettes);
        showNotification(`Error al guardar: ${error}`);
        return;
      }
      invalidatePalettes(user.id);
    } else {
      localStorage.setItem('colorPalettes', JSON.stringify(updated));
    }
    showNotification(COPY.notifications.paletteSaved);
  }, [paletteName, colors, savedPalettes, showNotification, user?.id]);

  const removePalette = useCallback(
    async (id: string) => {
      const removed = savedPalettes.find((p) => p.id === id);
      const updated = savedPalettes.filter((p) => p.id !== id);
      setSavedPalettes(updated);
      if (user?.id) {
        const { error } = await deletePalette(user.id, id);
        if (error) {
          setSavedPalettes(savedPalettes);
          showNotification(`Error al eliminar: ${error}`);
          return;
        }
        invalidatePalettes(user.id);
      } else {
        localStorage.setItem('colorPalettes', JSON.stringify(updated));
      }
      if (removed) showNotification(COPY.notifications.removed(removed.name));
    },
    [savedPalettes, showNotification, user?.id]
  );

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

  /** Índice en la barra de 6 pasos: 0 = previa (menú 4 cartas), 1 = inspiración (opción elegida), 2–5 = Refinar, Aplicar, Análisis, Guardar */
  const currentStepperIndex =
    phase === 'inspiration-menu'
      ? 0
      : phase === 'inspiration-detail'
        ? 1
        : 1 + PHASES.findIndex((p) => p.id === phase);

  const saveFlowPaletteState = useCallback(
    (leavingPhase?: Phase) => {
      if (!inspirationMode || colors.length === 0) return;
      const hadRefinementEdits =
        leavingPhase === 'refinement' &&
        (historyIndex > 0 ||
          Object.keys(supportOverridesByVariant.claro).length > 0 ||
          Object.keys(supportOverridesByVariant.oscuro).length > 0);
      const hadApplicationEdits =
        leavingPhase === 'application' &&
        applicationSnapshot != null &&
        (JSON.stringify(colors.map((c) => c.hex)) !== JSON.stringify(applicationSnapshot.colors.map((c) => c.hex)) ||
          JSON.stringify(supportOverridesByVariant) !== JSON.stringify(applicationSnapshot.supportOverridesByVariant));
      setFlowPaletteStateByInspiration((p) => {
        const prev = p[inspirationMode];
        const snapshot: FlowPaletteState = {
          colors: colors.map((c) => ({ ...c })),
          history: history.map((row) => row.map((c) => ({ ...c }))),
          historyIndex,
          originalPalette: originalPalette.map((c) => ({ ...c })),
          sliderReference: sliderReference.map((c) => ({ ...c })),
          supportOverridesByVariant: {
            claro: { ...supportOverridesByVariant.claro },
            oscuro: { ...supportOverridesByVariant.oscuro },
          },
          supportVariant,
          selectedColorIndex,
          selectedSupportRole,
          refinementMode,
          lastRemovedColor: lastRemovedColor ? { ...lastRemovedColor } : null,
          refinementGeneralSliders: { ...refinementGeneralSliders },
          editedInRefinement: prev?.editedInRefinement || hadRefinementEdits || false,
          editedInApplication: prev?.editedInApplication || hadApplicationEdits || false,
          editedInAnalysis: prev?.editedInAnalysis ?? false,
        };
        return { ...p, [inspirationMode]: snapshot };
      });
    },
    [
      inspirationMode,
      colors,
      history,
      historyIndex,
      originalPalette,
      sliderReference,
      supportOverridesByVariant,
      supportVariant,
      selectedColorIndex,
      selectedSupportRole,
      refinementMode,
      lastRemovedColor,
      refinementGeneralSliders,
      applicationSnapshot,
    ]
  );

  const goToPhase = useCallback(
    (targetPhase: Phase) => {
      if (targetPhase === 'inspiration-menu') {
        setPendingInspirationComplete(null);
        if (inspirationMode && colors.length > 0 && (phase === 'refinement' || phase === 'application' || phase === 'analysis' || phase === 'save')) {
          saveFlowPaletteState(phase);
        }
        setInspirationMode(null);
        // No borrar inspirationDetailSavedState: así al reentrar en Armonía (u otra opción) se restaura el estado
      }
      if (targetPhase === 'inspiration-detail' && inspirationMode && colors.length > 0 && (phase === 'refinement' || phase === 'application' || phase === 'analysis' || phase === 'save')) {
        saveFlowPaletteState(phase);
      }
      if (targetPhase === 'refinement' && phase === 'inspiration-detail' && inspirationMode) {
        const flowState = flowPaletteStateByInspiration[inspirationMode];
        if (flowState) {
          isRestoringRefinementRef.current = true;
          setColors(flowState.colors.map((c) => ({ ...c })));
          setHistory(flowState.history.map((row) => row.map((c) => ({ ...c }))));
          setHistoryIndex(flowState.historyIndex);
          setOriginalPalette(flowState.originalPalette.map((c) => ({ ...c })));
          setSliderReference(flowState.sliderReference.map((c) => ({ ...c })));
          setSupportOverridesByVariant({
            claro: { ...flowState.supportOverridesByVariant.claro },
            oscuro: { ...flowState.supportOverridesByVariant.oscuro },
          });
          setSupportVariant(flowState.supportVariant);
          setSelectedColorIndex(flowState.selectedColorIndex);
          setSelectedSupportRole(flowState.selectedSupportRole);
          setRefinementMode(flowState.refinementMode);
          setLastRemovedColor(flowState.lastRemovedColor ? { ...flowState.lastRemovedColor } : null);
          setRefinementGeneralSliders(flowState.refinementGeneralSliders ?? DEFAULT_REFINEMENT_SLIDERS);
        } else {
          const generatedHexes = inspirationGeneratedPaletteByMode[inspirationMode];
          if (generatedHexes?.length) {
            setColors(
              generatedHexes.map((hex) => ({
                id: generateId(),
                hex,
                locked: false,
              }))
            );
          }
          setRefinementGeneralSliders(DEFAULT_REFINEMENT_SLIDERS);
        }
      }
      if (targetPhase === 'application' && phase === 'refinement' && inspirationMode) {
        setApplicationSnapshot({
          colors: colors.map((c) => ({ ...c })),
          supportOverridesByVariant: {
            claro: { ...supportOverridesByVariant.claro },
            oscuro: { ...supportOverridesByVariant.oscuro },
          },
        });
      }
      if (
        phase === 'inspiration-detail' &&
        inspirationMode &&
        (targetPhase === 'application' || targetPhase === 'analysis' || targetPhase === 'save')
      ) {
        const flowState = flowPaletteStateByInspiration[inspirationMode];
        const generatedHexes = inspirationGeneratedPaletteByMode[inspirationMode];
        if (flowState) {
          setColors(flowState.colors.map((c) => ({ ...c })));
          setHistory(flowState.history.map((row) => row.map((c) => ({ ...c }))));
          setHistoryIndex(flowState.historyIndex);
          setOriginalPalette(flowState.originalPalette.map((c) => ({ ...c })));
          setSliderReference(flowState.sliderReference.map((c) => ({ ...c })));
          setSupportOverridesByVariant({
            claro: { ...flowState.supportOverridesByVariant.claro },
            oscuro: { ...flowState.supportOverridesByVariant.oscuro },
          });
          setSupportVariant(flowState.supportVariant);
          setSelectedColorIndex(flowState.selectedColorIndex);
          setSelectedSupportRole(flowState.selectedSupportRole);
          setRefinementMode(flowState.refinementMode);
          setLastRemovedColor(flowState.lastRemovedColor ? { ...flowState.lastRemovedColor } : null);
          setRefinementGeneralSliders(flowState.refinementGeneralSliders ?? DEFAULT_REFINEMENT_SLIDERS);
          if (targetPhase === 'application') {
            isRestoringApplicationRef.current = true;
            setApplicationSnapshot({
              colors: flowState.colors.map((c) => ({ ...c })),
              supportOverridesByVariant: {
                claro: { ...flowState.supportOverridesByVariant.claro },
                oscuro: { ...flowState.supportOverridesByVariant.oscuro },
              },
            });
          }
        } else if (generatedHexes?.length) {
          setColors(
            generatedHexes.map((hex) => ({
              id: generateId(),
              hex,
              locked: false,
            }))
          );
          setRefinementGeneralSliders(DEFAULT_REFINEMENT_SLIDERS);
        }
      }
      setPhase(targetPhase);
    },
    [
      phase,
      inspirationMode,
      colors,
      supportOverridesByVariant,
      flowPaletteStateByInspiration,
      inspirationGeneratedPaletteByMode,
      saveFlowPaletteState,
    ]
  );

  /** Actualiza el estado guardado de un modo de inspiración (ej. al cambiar sliders en Armonía). Así, si el usuario vuelve al menú por el stepper, al reentrar se restaura. */
  const reportInspirationDetailState = useCallback((mode: InspirationMode, savedState: unknown) => {
    setInspirationDetailSavedState((prev) => ({ ...prev, [mode]: savedState }));
  }, []);

  /** Paleta generada actualmente en cada flujo (para cargar Refinar si no hay estado guardado aún). */
  const reportInspirationGeneratedPalette = useCallback((mode: InspirationMode, hexColors: string[]) => {
    setInspirationGeneratedPaletteByMode((prev) => ({ ...prev, [mode]: hexColors }));
  }, []);

  /** Volver desde una pantalla de detalle de inspiración; si se pasa savedState, se guarda para ese modo antes de volver. */
  const goBackFromInspirationDetail = useCallback((savedState?: unknown) => {
    setPendingInspirationComplete(null);
    if (savedState != null && inspirationMode) {
      setInspirationDetailSavedState((prev) => ({ ...prev, [inspirationMode]: savedState }));
    }
    setPhase('inspiration-menu');
    setInspirationMode(null);
  }, [inspirationMode]);

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

  const handleInspirationSelect = useCallback(
    (mode: InspirationMode) => {
      setInspirationMode(mode);
      setPhase('inspiration-detail');
    },
    []
  );

  const handleLogoClick = useCallback(() => {
    setPendingInspirationComplete(null);
    setColors([]);
    setPaletteName('');
    setPhase('inspiration-menu');
    setInspirationMode(null);
    setInspirationDetailSavedState({});
    setFlowPaletteStateByInspiration({});
    setInspirationGeneratedPaletteByMode({});
    setInspirationFlowEverCompleted({});
  }, []);

  const handleStartNewPalette = useCallback(() => {
    setPendingInspirationComplete(null);
    setColors([]);
    setPaletteName('');
    setPhase('inspiration-menu');
    setInspirationMode(null);
    setInspirationDetailSavedState({});
    setFlowPaletteStateByInspiration({});
    setInspirationGeneratedPaletteByMode({});
    setInspirationFlowEverCompleted({});
  }, []);

  const hasCompletedCurrentFlow =
    inspirationMode != null && !!inspirationFlowEverCompleted[inspirationMode];

  const hasPersonalizedCurrentFlow =
    inspirationMode != null && flowPaletteStateByInspiration[inspirationMode] != null;

  /** Indica si existe un flujo previo de paleta combinada ("multi-origin") con estado guardado. */
  const hasMultiOriginFlow = flowPaletteStateByInspiration['multi-origin'] != null;

  /** Paleta activa por flujo (cadena Refinar→Aplicar→Análisis→Guardar). Se usa para mostrarla en el menú de origen. */
  const flowActivePaletteByMode = useMemo(() => {
    const result: Partial<Record<InspirationMode, string[]>> = {};
    const modes = Object.keys(flowPaletteStateByInspiration) as InspirationMode[];
    for (const mode of modes) {
      const snapshot = flowPaletteStateByInspiration[mode];
      if (!snapshot) continue;
      result[mode] = snapshot.colors.map((c) => c.hex);
    }
    return result;
  }, [flowPaletteStateByInspiration]);

  /** Usa la paleta combinada de orígenes como un flujo propio ("multi-origin"). */
  const handleUseCombinedPalette = useCallback(
    (combinedColors: string[]) => {
      const mode: InspirationMode = 'multi-origin';
      setInspirationMode(mode);
      const hasFlowPalette = flowPaletteStateByInspiration[mode] != null;
      if (hasFlowPalette) {
        setPendingInspirationComplete({
          newColors: combinedColors,
          savedState: undefined,
          inspirationMode: mode,
        });
        return;
      }
      setInspirationFlowEverCompleted((prev) => ({ ...prev, [mode]: true }));
      setColors(
        combinedColors.map((hex) => ({
          id: generateId(),
          hex,
          locked: false,
        }))
      );
      setRefinementGeneralSliders(DEFAULT_REFINEMENT_SLIDERS);
      setPhase('refinement');
    },
    [
      flowPaletteStateByInspiration,
      setInspirationMode,
      setInspirationFlowEverCompleted,
      setColors,
      setRefinementGeneralSliders,
      setPhase,
      setPendingInspirationComplete,
    ]
  );

  /** Qué secciones del eje Refinar-Aplicar-Análisis tienen ediciones en el flujo actual (para mostrar check solo ahí). */
  const flowSectionEdited: FlowSectionEdited =
    inspirationMode != null && flowPaletteStateByInspiration[inspirationMode]
      ? {
          refinement: !!flowPaletteStateByInspiration[inspirationMode]!.editedInRefinement,
          application: !!flowPaletteStateByInspiration[inspirationMode]!.editedInApplication,
          analysis: !!flowPaletteStateByInspiration[inspirationMode]!.editedInAnalysis,
        }
      : { refinement: false, application: false, analysis: false };

  return {
    phase,
    inspirationMode,
    hasCompletedCurrentFlow,
    hasPersonalizedCurrentFlow,
    flowSectionEdited,
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
    refinementGeneralSliders,
    setRefinementGeneralSliders,
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
    requestInspirationComplete,
    pendingInspirationComplete,
    confirmInspirationComplete,
    cancelInspirationComplete,
    savePalette,
    removePalette,
    currentPhaseIndex,
    currentStepperIndex,
    totalStepperSteps: STEPPER_STEPS.length,
    goToPhase,
    goBack,
    goBackFromInspirationDetail,
    reportInspirationDetailState,
    reportInspirationGeneratedPalette,
    goNext,
    handleInspirationSelect,
    handleLogoClick,
    handleStartNewPalette,
    resetApplicationToSnapshot,
    hasApplicationSnapshot: applicationSnapshot !== null,
    inspirationDetailSavedState,
    flowActivePaletteByMode,
    handleUseCombinedPalette,
    hasMultiOriginFlow,
  };
}
