import { Color } from '../types/palette';
import { getTextColor, getColorName } from '../utils/colorUtils';
import { cn } from '../utils/cn';

interface ColorCardProps {
  color: Color;
  isSelected: boolean;
  index: number;
  totalColors: number;
  onSelect: () => void;
  onRemove: () => void;
  onToggleLock: () => void;
  onDuplicate: () => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
  canRemove: boolean;
}

export function ColorCard({
  color,
  isSelected,
  index,
  onSelect,
  onRemove,
  onToggleLock,
  onDuplicate,
  onDragStart,
  onDragOver,
  onDrop,
  canRemove,
}: ColorCardProps) {
  const textColor = getTextColor(color);
  const colorName = getColorName(color.hex);

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, index)}
      onClick={onSelect}
      className={cn(
        'group relative flex-1 min-w-[100px] cursor-pointer transition-all duration-300 ease-out',
        'hover:flex-[1.2] hover:shadow-2xl hover:z-10',
        isSelected && 'flex-[1.3] ring-4 ring-white/50 shadow-2xl z-20 scale-[1.02]'
      )}
      style={{ backgroundColor: color.hex }}
    >
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/20 pointer-events-none" />
      
      {/* Lock indicator */}
      {color.locked && (
        <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center">
          <svg className="w-4 h-4" fill={textColor} viewBox="0 0 24 24">
            <path d="M12 1C8.676 1 6 3.676 6 7v2H4v14h16V9h-2V7c0-3.324-2.676-6-6-6zm0 2c2.276 0 4 1.724 4 4v2H8V7c0-2.276 1.724-4 4-4zm0 10c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z"/>
          </svg>
        </div>
      )}

      {/* Color info - always visible */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="transform transition-transform duration-300">
          <p 
            className="font-mono text-lg font-bold tracking-wider mb-1"
            style={{ color: textColor }}
          >
            {color.hex}
          </p>
          <p 
            className="text-sm opacity-70 font-medium"
            style={{ color: textColor }}
          >
            {colorName}
          </p>
        </div>
      </div>

      {/* Action buttons - visible on hover */}
      <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={(e) => { e.stopPropagation(); onToggleLock(); }}
          className="w-9 h-9 rounded-xl bg-black/20 backdrop-blur-sm hover:bg-black/40 flex items-center justify-center transition-colors"
          title={color.locked ? 'Desbloquear' : 'Bloquear'}
        >
          <svg className="w-4 h-4" fill={textColor} viewBox="0 0 24 24">
            {color.locked ? (
              <path d="M12 1C8.676 1 6 3.676 6 7v2H4v14h16V9h-2V7c0-3.324-2.676-6-6-6zm0 2c2.276 0 4 1.724 4 4v2H8V7c0-2.276 1.724-4 4-4z"/>
            ) : (
              <path d="M12 1c-3.324 0-6 2.676-6 6h2c0-2.276 1.724-4 4-4s4 1.724 4 4v2H4v14h16V9h-6V7c0-3.324-2.676-6-6-6z"/>
            )}
          </svg>
        </button>
        
        <button
          onClick={(e) => { e.stopPropagation(); onDuplicate(); }}
          className="w-9 h-9 rounded-xl bg-black/20 backdrop-blur-sm hover:bg-black/40 flex items-center justify-center transition-colors"
          title="Duplicar"
        >
          <svg className="w-4 h-4" fill={textColor} viewBox="0 0 24 24">
            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
          </svg>
        </button>

        {canRemove && (
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="w-9 h-9 rounded-xl bg-red-500/40 backdrop-blur-sm hover:bg-red-500/70 flex items-center justify-center transition-colors"
            title="Eliminar"
          >
            <svg className="w-4 h-4" fill={textColor} viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/>
            </svg>
          </button>
        )}
      </div>

      {/* HSL values on hover */}
      <div 
        className="absolute bottom-20 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ color: textColor }}
      >
        <div className="text-xs font-mono space-y-1 bg-black/10 backdrop-blur-sm rounded-lg p-2">
          <p>H: {color.hsl.h}° S: {color.hsl.s}% L: {color.hsl.l}%</p>
          <p>R: {color.rgb.r} G: {color.rgb.g} B: {color.rgb.b}</p>
        </div>
      </div>

      {/* Drag handle indicator */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-30 transition-opacity"
        style={{ color: textColor }}
      >
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11 18c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-2-8c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm6 4c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
        </svg>
      </div>
    </div>
  );
}
