import { useState, useCallback } from 'react';
import { Color, Palette, HarmonyType } from '../../types/palette';
import { 
  createColor, 
  generateRandomColor, 
  generateHarmony, 
  generateGradientPalette,
  generateId,
  adjustColor
} from '../../utils/colorUtils';

const defaultColors: Color[] = [
  createColor('#6366F1'),
  createColor('#8B5CF6'),
  createColor('#EC4899'),
  createColor('#F59E0B'),
  createColor('#10B981'),
];

export const usePalette = () => {
  const [colors, setColors] = useState<Color[]>(defaultColors);
  const [paletteName, setPaletteName] = useState<string>('Mi Paleta');
  const [savedPalettes, setSavedPalettes] = useState<Palette[]>([]);
  const [selectedColorId, setSelectedColorId] = useState<string | null>(null);
  const [history, setHistory] = useState<Color[][]>([defaultColors]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const addToHistory = useCallback((newColors: Color[]) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push(newColors);
      return newHistory.slice(-20); // Keep last 20 states
    });
    setHistoryIndex(prev => Math.min(prev + 1, 19));
  }, [historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setColors(history[historyIndex - 1]);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setColors(history[historyIndex + 1]);
    }
  }, [history, historyIndex]);

  const addColor = useCallback((hex?: string) => {
    const newColor = hex ? createColor(hex) : generateRandomColor();
    const newColors = [...colors, newColor];
    setColors(newColors);
    addToHistory(newColors);
    setSelectedColorId(newColor.id);
  }, [colors, addToHistory]);

  const removeColor = useCallback((id: string) => {
    if (colors.length <= 2) return;
    const newColors = colors.filter(c => c.id !== id);
    setColors(newColors);
    addToHistory(newColors);
    if (selectedColorId === id) {
      setSelectedColorId(null);
    }
  }, [colors, selectedColorId, addToHistory]);

  const updateColor = useCallback((id: string, hex: string) => {
    const newColors = colors.map(c => 
      c.id === id ? createColor(hex, c.locked) : c
    );
    // Preserve the original id
    const index = colors.findIndex(c => c.id === id);
    if (index !== -1) {
      newColors[index] = { ...newColors[index], id };
    }
    setColors(newColors);
    addToHistory(newColors);
  }, [colors, addToHistory]);

  const adjustSelectedColor = useCallback((adjustment: { h?: number; s?: number; l?: number }) => {
    if (!selectedColorId) return;
    const color = colors.find(c => c.id === selectedColorId);
    if (!color) return;
    const adjusted = adjustColor(color, adjustment);
    const newColors = colors.map(c => 
      c.id === selectedColorId ? { ...adjusted, id: selectedColorId } : c
    );
    setColors(newColors);
    addToHistory(newColors);
  }, [colors, selectedColorId, addToHistory]);

  const toggleLock = useCallback((id: string) => {
    setColors(colors.map(c => 
      c.id === id ? { ...c, locked: !c.locked } : c
    ));
  }, [colors]);

  const reorderColors = useCallback((startIndex: number, endIndex: number) => {
    const result = Array.from(colors);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    setColors(result);
    addToHistory(result);
  }, [colors, addToHistory]);

  const generateRandom = useCallback(() => {
    const newColors = colors.map(c => 
      c.locked ? c : generateRandomColor()
    );
    setColors(newColors);
    addToHistory(newColors);
  }, [colors, addToHistory]);

  const generateFromHarmony = useCallback((type: HarmonyType) => {
    const baseColor = colors.find(c => c.locked) || colors[0];
    const newColors = generateHarmony(baseColor, type, colors.length);
    // Preserve locked colors
    const result = newColors.map((c, i) => 
      colors[i]?.locked ? colors[i] : c
    );
    setColors(result);
    addToHistory(result);
  }, [colors, addToHistory]);

  const generateGradient = useCallback(() => {
    if (colors.length < 2) return;
    const lockedIndices = colors.map((c, i) => c.locked ? i : -1).filter(i => i !== -1);
    
    if (lockedIndices.length >= 2) {
      const start = colors[lockedIndices[0]];
      const end = colors[lockedIndices[lockedIndices.length - 1]];
      const newColors = generateGradientPalette(start, end, colors.length);
      // Preserve locked colors positions
      lockedIndices.forEach(i => {
        newColors[i] = colors[i];
      });
      setColors(newColors);
      addToHistory(newColors);
    } else {
      const newColors = generateGradientPalette(colors[0], colors[colors.length - 1], colors.length);
      setColors(newColors);
      addToHistory(newColors);
    }
  }, [colors, addToHistory]);

  const setColorCount = useCallback((count: number) => {
    if (count < 2 || count > 10) return;
    
    if (count > colors.length) {
      const newColors = [...colors];
      while (newColors.length < count) {
        newColors.push(generateRandomColor());
      }
      setColors(newColors);
      addToHistory(newColors);
    } else {
      const newColors = colors.slice(0, count);
      setColors(newColors);
      addToHistory(newColors);
    }
  }, [colors, addToHistory]);

  const savePalette = useCallback(() => {
    const palette: Palette = {
      id: generateId(),
      name: paletteName,
      colors: [...colors],
      createdAt: new Date(),
    };
    setSavedPalettes(prev => [...prev, palette]);
    return palette;
  }, [colors, paletteName]);

  const loadPalette = useCallback((palette: Palette) => {
    setColors(palette.colors);
    setPaletteName(palette.name);
    addToHistory(palette.colors);
  }, [addToHistory]);

  const deletePalette = useCallback((id: string) => {
    setSavedPalettes(prev => prev.filter(p => p.id !== id));
  }, []);

  const duplicateColor = useCallback((id: string) => {
    const index = colors.findIndex(c => c.id === id);
    if (index === -1) return;
    const color = colors[index];
    const newColor = createColor(color.hex);
    const newColors = [...colors];
    newColors.splice(index + 1, 0, newColor);
    setColors(newColors);
    addToHistory(newColors);
  }, [colors, addToHistory]);

  const reverseColors = useCallback(() => {
    const newColors = [...colors].reverse();
    setColors(newColors);
    addToHistory(newColors);
  }, [colors, addToHistory]);

  const shuffleColors = useCallback(() => {
    const unlockedColors = colors.filter(c => !c.locked);
    
    // Fisher-Yates shuffle for unlocked colors
    for (let i = unlockedColors.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [unlockedColors[i], unlockedColors[j]] = [unlockedColors[j], unlockedColors[i]];
    }
    
    // Reconstruct array maintaining locked positions
    const newColors: Color[] = [];
    let unlockedIndex = 0;
    colors.forEach((c, i) => {
      if (c.locked) {
        newColors[i] = c;
      } else {
        newColors[i] = unlockedColors[unlockedIndex++];
      }
    });
    
    setColors(newColors);
    addToHistory(newColors);
  }, [colors, addToHistory]);

  return {
    colors,
    setColors,
    paletteName,
    setPaletteName,
    savedPalettes,
    selectedColorId,
    setSelectedColorId,
    addColor,
    removeColor,
    updateColor,
    adjustSelectedColor,
    toggleLock,
    reorderColors,
    generateRandom,
    generateFromHarmony,
    generateGradient,
    setColorCount,
    savePalette,
    loadPalette,
    deletePalette,
    duplicateColor,
    reverseColors,
    shuffleColors,
    undo,
    redo,
    canUndo: historyIndex > 0,
    canRedo: historyIndex < history.length - 1,
  };
};
