import { useState, useCallback } from 'react';
import { usePalette } from './hooks/usePalette';
import { ColorCard } from './ColorCard';
import { ColorEditor } from './ColorEditor';
import { ColorWheel } from './ColorWheel';
import { ToolsPanel } from './ToolsPanel';
import { PaletteMetrics } from './PaletteMetrics';
import { SavePanel } from './SavePanel';
import { AdvancedPaletteDesign } from './AdvancedPaletteDesign';
import { createColor } from '../utils/colorUtils';
import { cn } from '../utils/cn';

type RightPanelTab = 'editor' | 'analysis' | 'save';

export function PaletteCreator() {
  const {
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
    canUndo,
    canRedo,
  } = usePalette();

  const [rightPanelTab, setRightPanelTab] = useState<RightPanelTab>('editor');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [showNotification, setShowNotification] = useState(false);

  const selectedColor = colors.find(c => c.id === selectedColorId) || null;

  const handleDragStart = useCallback((e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
      reorderColors(draggedIndex, index);
    }
    setDraggedIndex(null);
  }, [draggedIndex, reorderColors]);

  const handleExtractFromImage = useCallback((extractedColors: string[]) => {
    const newColors = extractedColors.map(hex => createColor(hex));
    setColors(newColors);
  }, [setColors]);

  const handleSave = useCallback(() => {
    savePalette();
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  }, [savePalette]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Notification */}
      <div className={cn(
        "fixed top-4 right-4 z-50 transform transition-all duration-300",
        showNotification ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0 pointer-events-none"
      )}>
        <div className="bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          ¡Paleta guardada!
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-900/80 border-b border-slate-700/50">
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Crear Paleta</h1>
                <p className="text-slate-400 text-sm">Diseña tu paleta perfecta</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Keyboard shortcuts hint */}
              <div className="hidden lg:flex items-center gap-2 text-slate-500 text-sm">
                <kbd className="px-2 py-1 bg-slate-700 rounded text-xs">Espacio</kbd>
                <span>Aleatorio</span>
              </div>

              <button
                onClick={() => addColor()}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="hidden sm:inline">Añadir Color</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1800px] mx-auto px-6 py-6">
        <div className="flex gap-6">
          {/* Left Sidebar - Tools */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              <ToolsPanel
                colorCount={colors.length}
                onSetColorCount={setColorCount}
                onGenerateRandom={generateRandom}
                onGenerateHarmony={generateFromHarmony}
                onGenerateGradient={generateGradient}
                onReverseColors={reverseColors}
                onShuffleColors={shuffleColors}
                onUndo={undo}
                onRedo={redo}
                canUndo={canUndo}
                canRedo={canRedo}
                onExtractFromImage={handleExtractFromImage}
              />
            </div>
          </aside>

          {/* Main Content - Palette Display */}
          <main className="flex-1 min-w-0">
            {/* Palette Preview Card */}
            <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-3xl p-6 mb-6 border border-slate-700/50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-semibold">{paletteName}</h2>
                <div className="flex items-center gap-2 text-slate-400 text-sm">
                  <span>{colors.length} colores</span>
                  <span>•</span>
                  <span>Arrastra para reordenar</span>
                </div>
              </div>

              {/* Color Cards Container */}
              <div className="flex h-[400px] rounded-2xl overflow-hidden shadow-2xl">
                {colors.map((color, index) => (
                  <ColorCard
                    key={color.id}
                    color={color}
                    isSelected={selectedColorId === color.id}
                    index={index}
                    totalColors={colors.length}
                    onSelect={() => setSelectedColorId(color.id)}
                    onRemove={() => removeColor(color.id)}
                    onToggleLock={() => toggleLock(color.id)}
                    onDuplicate={() => duplicateColor(color.id)}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    canRemove={colors.length > 2}
                  />
                ))}
              </div>

              {/* Gradient Preview */}
              <div className="mt-4">
                <p className="text-slate-400 text-xs mb-2">Vista de gradiente</p>
                <div 
                  className="h-8 rounded-lg"
                  style={{
                    background: `linear-gradient(to right, ${colors.map(c => c.hex).join(', ')})`
                  }}
                />
              </div>
            </div>

            {/* Mobile Tools */}
            <div className="lg:hidden mb-6">
              <ToolsPanel
                colorCount={colors.length}
                onSetColorCount={setColorCount}
                onGenerateRandom={generateRandom}
                onGenerateHarmony={generateFromHarmony}
                onGenerateGradient={generateGradient}
                onReverseColors={reverseColors}
                onShuffleColors={shuffleColors}
                onUndo={undo}
                onRedo={redo}
                canUndo={canUndo}
                canRedo={canRedo}
                onExtractFromImage={handleExtractFromImage}
              />
            </div>

            {/* Bottom Palette Strip - Compact View */}
            <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
              <div className="flex items-center justify-between mb-3">
                <p className="text-slate-400 text-sm font-medium">Vista compacta</p>
                <div className="flex gap-2">
                  {colors.map((color) => (
                    <button
                      key={color.id}
                      onClick={() => setSelectedColorId(color.id)}
                      className={cn(
                        "w-8 h-8 rounded-lg border-2 transition-all hover:scale-110",
                        selectedColorId === color.id 
                          ? "border-white shadow-lg scale-110" 
                          : "border-transparent"
                      )}
                      style={{ backgroundColor: color.hex }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex h-12 rounded-xl overflow-hidden">
                {colors.map((color) => (
                  <div
                    key={color.id}
                    className="flex-1 flex items-center justify-center cursor-pointer hover:flex-[1.2] transition-all"
                    style={{ backgroundColor: color.hex }}
                    onClick={() => {
                      navigator.clipboard.writeText(color.hex);
                    }}
                  >
                    <span 
                      className="font-mono text-xs font-medium opacity-70 hover:opacity-100 transition-opacity"
                      style={{ color: color.hsl.l > 50 ? '#000' : '#fff' }}
                    >
                      {color.hex}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Advanced Palette Design Section */}
            <AdvancedPaletteDesign
              colors={colors.map(c => ({ h: c.hsl.h, s: c.hsl.s, l: c.hsl.l }))}
            />
          </main>

          {/* Right Sidebar - Editor & Analysis */}
          <aside className="hidden xl:block w-80 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Tab Selector */}
              <div className="flex bg-slate-800 rounded-xl p-1">
                {[
                  { id: 'editor' as const, label: 'Editor', icon: '🎨' },
                  { id: 'analysis' as const, label: 'Análisis', icon: '📊' },
                  { id: 'save' as const, label: 'Guardar', icon: '💾' },
                ].map(({ id, label, icon }) => (
                  <button
                    key={id}
                    onClick={() => setRightPanelTab(id)}
                    className={cn(
                      "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-1.5",
                      rightPanelTab === id 
                        ? "bg-violet-600 text-white" 
                        : "text-slate-400 hover:text-white"
                    )}
                  >
                    <span>{icon}</span>
                    <span>{label}</span>
                  </button>
                ))}
              </div>

              {rightPanelTab === 'editor' && (
                <>
                  <ColorEditor
                    color={selectedColor}
                    onUpdateColor={updateColor}
                    onAdjustColor={adjustSelectedColor}
                  />
                  <ColorWheel
                    colors={colors}
                    selectedColorId={selectedColorId}
                    onSelectColor={setSelectedColorId}
                  />
                </>
              )}

              {rightPanelTab === 'analysis' && (
                <>
                  <PaletteMetrics colors={colors} />
                  <ColorWheel
                    colors={colors}
                    selectedColorId={selectedColorId}
                    onSelectColor={setSelectedColorId}
                  />
                </>
              )}

              {rightPanelTab === 'save' && (
                <SavePanel
                  paletteName={paletteName}
                  onPaletteNameChange={setPaletteName}
                  onSave={handleSave}
                  savedPalettes={savedPalettes}
                  onLoadPalette={loadPalette}
                  onDeletePalette={deletePalette}
                  colors={colors}
                />
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* Floating Action Button - Mobile */}
      <div className="xl:hidden fixed bottom-6 right-6 flex flex-col gap-3">
        <button
          onClick={generateRandom}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/25 flex items-center justify-center hover:scale-110 transition-transform"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Keyboard listener for spacebar */}
      <KeyboardListener onSpace={generateRandom} />
    </div>
  );
}

// Keyboard listener component
function KeyboardListener({ onSpace }: { onSpace: () => void }) {
  useState(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        onSpace();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  return null;
}
