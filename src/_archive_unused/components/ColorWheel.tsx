import { Color } from '../types/palette';
import { hslToHex } from '../utils/colorUtils';

interface ColorWheelProps {
  colors: Color[];
  selectedColorId: string | null;
  onSelectColor: (id: string) => void;
}

export function ColorWheel({ colors, selectedColorId, onSelectColor }: ColorWheelProps) {
  const wheelSize = 200;
  const centerX = wheelSize / 2;
  const centerY = wheelSize / 2;
  const radius = wheelSize / 2 - 20;

  // Generate wheel gradient
  const wheelGradient = Array.from({ length: 360 }, (_, i) => 
    `${hslToHex(i, 70, 50)} ${i}deg`
  ).join(', ');

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6">
      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" strokeWidth="2" />
          <path strokeLinecap="round" strokeWidth="2" d="M12 2v4M12 18v4M2 12h4M18 12h4" />
        </svg>
        Rueda de Color
      </h3>

      <div className="relative mx-auto" style={{ width: wheelSize, height: wheelSize }}>
        {/* Color wheel background */}
        <div 
          className="absolute inset-0 rounded-full"
          style={{
            background: `conic-gradient(${wheelGradient})`,
            mask: 'radial-gradient(circle, transparent 40%, black 41%, black 100%)',
            WebkitMask: 'radial-gradient(circle, transparent 40%, black 41%, black 100%)',
          }}
        />

        {/* Inner gradient for depth */}
        <div 
          className="absolute rounded-full"
          style={{
            top: '20%',
            left: '20%',
            right: '20%',
            bottom: '20%',
            background: 'radial-gradient(circle, rgba(30,41,59,1) 0%, rgba(30,41,59,0.8) 100%)',
          }}
        />

        {/* Color markers */}
        {colors.map((color, index) => {
          const angle = (color.hsl.h - 90) * (Math.PI / 180);
          const markerRadius = radius * 0.75;
          const x = centerX + Math.cos(angle) * markerRadius;
          const y = centerY + Math.sin(angle) * markerRadius;
          const isSelected = selectedColorId === color.id;

          return (
            <button
              key={color.id}
              onClick={() => onSelectColor(color.id)}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-125"
              style={{
                left: x,
                top: y,
              }}
            >
              <div
                className={`rounded-full border-2 shadow-lg transition-all ${
                  isSelected ? 'w-7 h-7 border-white ring-2 ring-white/50' : 'w-5 h-5 border-white/70'
                }`}
                style={{ backgroundColor: color.hex }}
              />
              {/* Connection line to center */}
              <svg
                className="absolute pointer-events-none"
                style={{
                  left: '50%',
                  top: '50%',
                  width: markerRadius,
                  height: 2,
                  transform: `rotate(${color.hsl.h - 90}deg)`,
                  transformOrigin: 'left center',
                  opacity: isSelected ? 0.5 : 0.2,
                }}
              >
                <line
                  x1="0"
                  y1="1"
                  x2={markerRadius * 0.6}
                  y2="1"
                  stroke={color.hex}
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
              </svg>
              {/* Index label */}
              <span 
                className={`absolute -bottom-5 left-1/2 -translate-x-1/2 text-xs font-medium ${
                  isSelected ? 'text-white' : 'text-slate-400'
                }`}
              >
                {index + 1}
              </span>
            </button>
          );
        })}

        {/* Center info */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <p className="text-slate-400 text-xs">Colores</p>
          <p className="text-white text-2xl font-bold">{colors.length}</p>
        </div>
      </div>

      {/* Harmony lines visualization */}
      <div className="mt-4 flex justify-center gap-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <div className="w-3 h-3 rounded-full border border-dashed border-slate-500" />
          <span>Posición en rueda</span>
        </div>
      </div>
    </div>
  );
}
