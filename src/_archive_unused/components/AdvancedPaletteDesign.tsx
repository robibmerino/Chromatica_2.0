import { useState, useMemo } from 'react';
import { cn } from '../utils/cn';

// Types
interface HSLColor {
  h: number;
  s: number;
  l: number;
}

interface SimpleColor {
  id: string;
  hex: string;
  hsl: HSLColor;
}

interface DistributionRule {
  id: string;
  name: string;
  description: string;
  icon: string;
  roles: { name: string; percentage: number }[];
}

const distributionRules: DistributionRule[] = [
  {
    id: '60-30-10',
    name: 'Regla 60-30-10',
    description: 'Clásica regla de decoración de interiores',
    icon: '📐',
    roles: [
      { name: 'Dominante', percentage: 60 },
      { name: 'Secundario', percentage: 30 },
      { name: 'Acento', percentage: 10 },
    ],
  },
  {
    id: 'golden',
    name: 'Proporción Áurea',
    description: 'Basado en la proporción φ (1.618)',
    icon: '🌀',
    roles: [
      { name: 'Principal', percentage: 62 },
      { name: 'Complementario', percentage: 24 },
      { name: 'Detalle', percentage: 14 },
    ],
  },
  {
    id: '50-30-20',
    name: 'Regla 50-30-20',
    description: 'Equilibrio visual moderno',
    icon: '⚖️',
    roles: [
      { name: 'Base', percentage: 50 },
      { name: 'Soporte', percentage: 30 },
      { name: 'Énfasis', percentage: 20 },
    ],
  },
  {
    id: '70-25-5',
    name: 'Minimalista 70-25-5',
    description: 'Diseño limpio con acento sutil',
    icon: '✨',
    roles: [
      { name: 'Fondo', percentage: 70 },
      { name: 'Contenido', percentage: 25 },
      { name: 'Llamada', percentage: 5 },
    ],
  },
  {
    id: 'equal-3',
    name: 'Tripartita',
    description: 'Distribución equilibrada en tercios',
    icon: '△',
    roles: [
      { name: 'Primario', percentage: 33 },
      { name: 'Secundario', percentage: 33 },
      { name: 'Terciario', percentage: 34 },
    ],
  },
  {
    id: 'equal-4',
    name: 'Cuatripartita',
    description: 'Cuatro colores en equilibrio',
    icon: '◇',
    roles: [
      { name: 'Primario', percentage: 25 },
      { name: 'Secundario', percentage: 25 },
      { name: 'Terciario', percentage: 25 },
      { name: 'Cuaternario', percentage: 25 },
    ],
  },
  {
    id: 'emphasis',
    name: 'Alto Énfasis',
    description: 'Un color dominante, resto como acentos',
    icon: '🎯',
    roles: [
      { name: 'Dominante', percentage: 75 },
      { name: 'Acento 1', percentage: 15 },
      { name: 'Acento 2', percentage: 10 },
    ],
  },
  {
    id: 'gradient-5',
    name: 'Gradiente 5',
    description: 'Distribución gradual para 5 colores',
    icon: '🌈',
    roles: [
      { name: 'Principal', percentage: 35 },
      { name: 'Secundario', percentage: 25 },
      { name: 'Terciario', percentage: 20 },
      { name: 'Cuaternario', percentage: 12 },
      { name: 'Acento', percentage: 8 },
    ],
  },
];

interface AdvancedPaletteDesignProps {
  colors: HSLColor[];
}

type PreviewType = 'ui' | 'web' | 'card' | 'dashboard' | 'poster' | 'app';

// Helper function to convert HSL to HEX
function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

// Get text color based on background luminance
function getTextColorFromHex(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

// Convert HSLColor array to SimpleColor array
function convertToSimpleColors(hslColors: HSLColor[]): SimpleColor[] {
  return hslColors.map((color, index) => ({
    id: `color-${index}`,
    hex: hslToHex(color.h, color.s, color.l),
    hsl: color
  }));
}

export function AdvancedPaletteDesign({ colors: hslColors }: AdvancedPaletteDesignProps) {
  const colors = convertToSimpleColors(hslColors);
  const [selectedRule, setSelectedRule] = useState<string>('60-30-10');
  const [colorAssignments, setColorAssignments] = useState<Record<string, string>>({});
  const [activePreview, setActivePreview] = useState<PreviewType>('ui');

  const currentRule = distributionRules.find(r => r.id === selectedRule) || distributionRules[0];

  // Auto-assign colors to roles based on position if not manually assigned
  const assignedColors = useMemo(() => {
    const result: Record<string, SimpleColor | null> = {};
    currentRule.roles.forEach((role, index) => {
      const assignedColorId = colorAssignments[role.name];
      if (assignedColorId) {
        result[role.name] = colors.find(c => c.id === assignedColorId) || null;
      } else {
        result[role.name] = colors[index] || null;
      }
    });
    return result;
  }, [colors, currentRule, colorAssignments]);

  const handleColorDrop = (roleName: string, colorId: string) => {
    setColorAssignments(prev => ({ ...prev, [roleName]: colorId }));
  };

  const getColorForRole = (roleName: string): SimpleColor | null => {
    return assignedColors[roleName] || null;
  };

  const previews: { id: PreviewType; name: string; icon: string }[] = [
    { id: 'ui', name: 'UI Elements', icon: '🎨' },
    { id: 'web', name: 'Web Layout', icon: '🌐' },
    { id: 'card', name: 'Tarjetas', icon: '📄' },
    { id: 'dashboard', name: 'Dashboard', icon: '📊' },
    { id: 'poster', name: 'Póster', icon: '🖼️' },
    { id: 'app', name: 'App Móvil', icon: '📱' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Distribution Rules Selector */}
      <div>
        <h4 className="text-white font-medium mb-3 flex items-center gap-2">
          <span>📏</span> Regla de Distribución
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {distributionRules.map((rule) => (
            <button
              key={rule.id}
              onClick={() => {
                setSelectedRule(rule.id);
                setColorAssignments({});
              }}
              className={cn(
                "p-3 rounded-xl text-left transition-all border",
                selectedRule === rule.id
                  ? "bg-violet-600/30 border-violet-500/50 ring-2 ring-violet-500/30"
                  : "bg-slate-700/30 border-slate-600/30 hover:bg-slate-700/50"
              )}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{rule.icon}</span>
                <span className="text-white text-sm font-medium">{rule.name}</span>
              </div>
              <p className="text-slate-400 text-xs">{rule.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Color Hierarchy Assignment */}
      <div>
        <h4 className="text-white font-medium mb-3 flex items-center gap-2">
          <span>🎨</span> Asignación de Jerarquía
          <span className="text-xs text-slate-500 ml-2">Arrastra colores a los roles</span>
        </h4>
        
        {/* Available Colors */}
        <div className="flex gap-2 mb-4 p-3 bg-slate-700/30 rounded-xl">
          <span className="text-slate-400 text-sm self-center mr-2">Colores:</span>
          {colors.map((color) => (
            <div
              key={color.id}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('colorId', color.id);
                e.dataTransfer.effectAllowed = 'copy';
              }}
              className="w-10 h-10 rounded-lg cursor-grab active:cursor-grabbing border-2 border-white/20 hover:border-white/50 hover:scale-110 transition-all shadow-lg"
              style={{ backgroundColor: color.hex }}
              title={color.hex}
            />
          ))}
        </div>

        {/* Role Cards */}
        <div className="space-y-2">
          {currentRule.roles.map((role) => {
            const color = getColorForRole(role.name);
            return (
              <div
                key={role.name}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const colorId = e.dataTransfer.getData('colorId');
                  if (colorId) {
                    handleColorDrop(role.name, colorId);
                  }
                }}
                className="flex items-center gap-4 p-3 rounded-xl bg-slate-700/30 hover:bg-slate-700/50 border border-slate-600/30"
              >
                {/* Percentage Bar */}
                <div className="w-24 flex-shrink-0">
                  <div className="h-3 bg-slate-600/50 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${role.percentage}%`,
                        backgroundColor: color?.hex || '#4B5563',
                      }}
                    />
                  </div>
                  <p className="text-xs text-slate-400 mt-1 text-center">{role.percentage}%</p>
                </div>

                {/* Role Info */}
                <div className="flex-1">
                  <p className="text-white font-medium text-sm">{role.name}</p>
                  <p className="text-slate-500 text-xs">
                    {role.percentage}% del diseño
                  </p>
                </div>

                {/* Color Preview */}
                <div
                  className="w-16 h-12 rounded-lg border-2 border-dashed border-slate-500/50 flex items-center justify-center transition-all hover:border-violet-500/50"
                  style={{
                    backgroundColor: color?.hex || 'transparent',
                    borderStyle: color ? 'solid' : 'dashed',
                    borderColor: color ? 'transparent' : undefined,
                  }}
                >
                  {color ? (
                    <span
                      className="font-mono text-xs font-bold"
                      style={{ color: getTextColorFromHex(color.hex) }}
                    >
                      {color.hex}
                    </span>
                  ) : (
                    <span className="text-slate-500 text-xs">Suelta</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Preview Type Selector */}
      <div>
        <h4 className="text-white font-medium mb-3 flex items-center gap-2">
          <span>👁️</span> Ejemplos Visuales
        </h4>
        <div className="flex flex-wrap gap-2 mb-4">
          {previews.map((preview) => (
            <button
              key={preview.id}
              onClick={() => setActivePreview(preview.id)}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2",
                activePreview === preview.id
                  ? "bg-violet-600 text-white"
                  : "bg-slate-700/50 text-slate-300 hover:bg-slate-700"
              )}
            >
              <span>{preview.icon}</span>
              {preview.name}
            </button>
          ))}
        </div>

        {/* Preview Container */}
        <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-700/30">
          {activePreview === 'ui' && (
            <UIPreview roles={currentRule.roles} colors={assignedColors} allColors={colors} />
          )}
          {activePreview === 'web' && (
            <WebLayoutPreview roles={currentRule.roles} colors={assignedColors} allColors={colors} />
          )}
          {activePreview === 'card' && (
            <CardPreview roles={currentRule.roles} colors={assignedColors} allColors={colors} />
          )}
          {activePreview === 'dashboard' && (
            <DashboardPreview roles={currentRule.roles} colors={assignedColors} allColors={colors} />
          )}
          {activePreview === 'poster' && (
            <PosterPreview roles={currentRule.roles} colors={assignedColors} allColors={colors} />
          )}
          {activePreview === 'app' && (
            <AppPreview roles={currentRule.roles} colors={assignedColors} allColors={colors} />
          )}
        </div>
      </div>

      {/* Distribution Visualization */}
      <div>
        <h4 className="text-white font-medium mb-3 flex items-center gap-2">
          <span>📊</span> Distribución Visual
        </h4>
        <div className="flex h-16 rounded-xl overflow-hidden">
          {currentRule.roles.map((role) => {
            const color = getColorForRole(role.name);
            return (
              <div
                key={role.name}
                className="relative flex items-center justify-center transition-all hover:brightness-110"
                style={{
                  flex: role.percentage,
                  backgroundColor: color?.hex || '#4B5563',
                }}
              >
                <div
                  className="text-center px-2"
                  style={{ color: color ? getTextColorFromHex(color.hex) : '#fff' }}
                >
                  <p className="font-bold text-sm">{role.percentage}%</p>
                  <p className="text-xs opacity-75">{role.name}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 rounded-xl p-4 border border-violet-500/20">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <p className="text-violet-300 font-medium mb-1">Consejo de diseño</p>
            <p className="text-slate-400 text-sm">
              {selectedRule === '60-30-10' && "El color dominante (60%) crea el ambiente general. El secundario (30%) añade interés visual. El acento (10%) guía la atención a elementos clave."}
              {selectedRule === 'golden' && "La proporción áurea crea una sensación natural y armoniosa. Utilízala para diseños que necesiten sentirse orgánicos y equilibrados."}
              {selectedRule === '50-30-20' && "Esta distribución más equilibrada es ideal para interfaces que necesitan mayor variedad visual sin perder coherencia."}
              {selectedRule === '70-25-5' && "Perfecta para diseños minimalistas donde el contenido es protagonista. El 5% de acento debe usarse con precisión quirúrgica."}
              {selectedRule === 'equal-3' && "La distribución tripartita crea dinamismo visual. Ideal para composiciones creativas y artísticas."}
              {selectedRule === 'equal-4' && "Cuatro colores en equilibrio requieren cuidado. Asegúrate de que haya suficiente contraste entre ellos."}
              {selectedRule === 'emphasis' && "El alto énfasis centra toda la atención. Úsalo cuando tengas un mensaje o elemento muy importante que destacar."}
              {selectedRule === 'gradient-5' && "Con 5 colores, cada uno tiene su propósito. Piensa en una narrativa visual de más a menos importante."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Preview Components
interface PreviewProps {
  roles: { name: string; percentage: number }[];
  colors: Record<string, SimpleColor | null>;
  allColors: SimpleColor[];
}

function getPreviewColor(colors: Record<string, SimpleColor | null>, roleName: string, fallbackIndex: number, allColors: SimpleColor[]): string {
  return colors[roleName]?.hex || allColors[fallbackIndex]?.hex || '#4B5563';
}

function UIPreview({ roles, colors, allColors }: PreviewProps) {
  const primary = getPreviewColor(colors, roles[0]?.name, 0, allColors);
  const secondary = getPreviewColor(colors, roles[1]?.name, 1, allColors);
  const accent = getPreviewColor(colors, roles[2]?.name, 2, allColors);
  const tertiary = getPreviewColor(colors, roles[3]?.name, 3, allColors);

  return (
    <div className="space-y-4">
      <p className="text-slate-400 text-sm mb-4">Elementos de interfaz con tu paleta:</p>
      
      {/* Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          className="px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg"
          style={{ backgroundColor: primary, color: getTextColorFromHex(primary) }}
        >
          Botón Primario
        </button>
        <button
          className="px-6 py-3 rounded-xl font-semibold transition-all hover:scale-105"
          style={{ backgroundColor: secondary, color: getTextColorFromHex(secondary) }}
        >
          Secundario
        </button>
        <button
          className="px-6 py-3 rounded-xl font-semibold border-2 transition-all hover:scale-105"
          style={{ borderColor: accent, color: accent, backgroundColor: 'transparent' }}
        >
          Outline
        </button>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2">
        {['Etiqueta 1', 'Etiqueta 2', 'Nuevo', 'Popular'].map((tag, i) => (
          <span
            key={tag}
            className="px-3 py-1 rounded-full text-sm font-medium"
            style={{
              backgroundColor: [primary, secondary, accent, tertiary || primary][i] + '30',
              color: [primary, secondary, accent, tertiary || primary][i],
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Campo de texto..."
          className="flex-1 px-4 py-3 rounded-xl bg-slate-800 border-2 focus:outline-none transition-all"
          style={{ borderColor: primary + '50' }}
        />
        <button
          className="px-6 py-3 rounded-xl font-semibold"
          style={{ backgroundColor: accent, color: getTextColorFromHex(accent) }}
        >
          Enviar
        </button>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Progreso</span>
          <span style={{ color: primary }}>75%</span>
        </div>
        <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: '75%',
              background: `linear-gradient(to right, ${primary}, ${secondary})`,
            }}
          />
        </div>
      </div>

      {/* Toggle */}
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-6 rounded-full relative cursor-pointer"
          style={{ backgroundColor: primary }}
        >
          <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-md" />
        </div>
        <span className="text-slate-300">Activado</span>
      </div>
    </div>
  );
}

function WebLayoutPreview({ roles, colors, allColors }: PreviewProps) {
  const primary = getPreviewColor(colors, roles[0]?.name, 0, allColors);
  const secondary = getPreviewColor(colors, roles[1]?.name, 1, allColors);
  const accent = getPreviewColor(colors, roles[2]?.name, 2, allColors);

  return (
    <div className="space-y-3 text-sm">
      <p className="text-slate-400 mb-4">Layout de página web:</p>
      
      {/* Mini Browser */}
      <div className="rounded-xl overflow-hidden border border-slate-700/50 bg-slate-800">
        {/* Browser Chrome */}
        <div className="flex items-center gap-2 px-3 py-2 bg-slate-700/50 border-b border-slate-700">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <div className="flex-1 px-3 py-1 bg-slate-800 rounded text-slate-400 text-xs">
            www.tupaleta.com
          </div>
        </div>

        {/* Website Content */}
        <div style={{ backgroundColor: primary + '10' }}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3" style={{ backgroundColor: primary }}>
            <div className="font-bold" style={{ color: getTextColorFromHex(primary) }}>Logo</div>
            <div className="flex gap-4" style={{ color: getTextColorFromHex(primary) + '99' }}>
              <span>Inicio</span>
              <span>Servicios</span>
              <span>Contacto</span>
            </div>
          </div>

          {/* Hero */}
          <div className="p-6 text-center" style={{ backgroundColor: secondary + '20' }}>
            <h2 className="text-xl font-bold text-white mb-2">Bienvenido a nuestra web</h2>
            <p className="text-slate-400 mb-4 text-sm">Descubre lo que podemos hacer por ti</p>
            <button
              className="px-4 py-2 rounded-lg font-medium"
              style={{ backgroundColor: accent, color: getTextColorFromHex(accent) }}
            >
              Comenzar
            </button>
          </div>

          {/* Content Grid */}
          <div className="p-4 grid grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-800 p-3 rounded-lg">
                <div className="w-8 h-8 rounded-lg mb-2" style={{ backgroundColor: [primary, secondary, accent][i - 1] }} />
                <div className="h-2 bg-slate-700 rounded w-3/4 mb-1" />
                <div className="h-2 bg-slate-700 rounded w-1/2" />
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-3 text-center text-xs" style={{ backgroundColor: primary, color: getTextColorFromHex(primary) + '80' }}>
            © 2024 Tu Empresa
          </div>
        </div>
      </div>
    </div>
  );
}

function CardPreview({ roles, colors, allColors }: PreviewProps) {
  const primary = getPreviewColor(colors, roles[0]?.name, 0, allColors);
  const secondary = getPreviewColor(colors, roles[1]?.name, 1, allColors);
  const accent = getPreviewColor(colors, roles[2]?.name, 2, allColors);

  return (
    <div className="space-y-4">
      <p className="text-slate-400 text-sm mb-4">Diseño de tarjetas:</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1 - Solid header */}
        <div className="rounded-xl overflow-hidden bg-slate-800 shadow-xl">
          <div className="h-24" style={{ backgroundColor: primary }} />
          <div className="p-4">
            <h3 className="text-white font-bold mb-1">Tarjeta Premium</h3>
            <p className="text-slate-400 text-sm mb-3">Descripción breve del contenido.</p>
            <button
              className="w-full py-2 rounded-lg text-sm font-medium"
              style={{ backgroundColor: accent, color: getTextColorFromHex(accent) }}
            >
              Ver más
            </button>
          </div>
        </div>

        {/* Card 2 - Gradient */}
        <div className="rounded-xl overflow-hidden bg-slate-800 shadow-xl">
          <div className="h-24" style={{ background: `linear-gradient(135deg, ${primary}, ${secondary})` }} />
          <div className="p-4">
            <h3 className="text-white font-bold mb-1">Gradiente</h3>
            <p className="text-slate-400 text-sm mb-3">Con transición suave de colores.</p>
            <div className="flex gap-2">
              <span className="px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: primary + '30', color: primary }}>Tag 1</span>
              <span className="px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: secondary + '30', color: secondary }}>Tag 2</span>
            </div>
          </div>
        </div>

        {/* Card 3 - Border accent */}
        <div className="rounded-xl bg-slate-800 shadow-xl p-4 border-t-4" style={{ borderTopColor: accent }}>
          <div className="w-12 h-12 rounded-xl mb-3 flex items-center justify-center" style={{ backgroundColor: accent + '20' }}>
            <span className="text-2xl">⭐</span>
          </div>
          <h3 className="text-white font-bold mb-1">Destacado</h3>
          <p className="text-slate-400 text-sm mb-3">Con acento en el borde superior.</p>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full" style={{ backgroundColor: primary }} />
            <span className="text-slate-300 text-sm">Usuario</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardPreview({ roles, colors, allColors }: PreviewProps) {
  const primary = getPreviewColor(colors, roles[0]?.name, 0, allColors);
  const secondary = getPreviewColor(colors, roles[1]?.name, 1, allColors);
  const accent = getPreviewColor(colors, roles[2]?.name, 2, allColors);
  const tertiary = getPreviewColor(colors, roles[3]?.name, 3, allColors);

  return (
    <div className="space-y-4">
      <p className="text-slate-400 text-sm mb-4">Panel de control / Dashboard:</p>
      
      <div className="flex gap-4">
        {/* Sidebar */}
        <div className="w-16 bg-slate-800 rounded-xl p-3 flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl" style={{ backgroundColor: primary }} />
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-all"
              style={{ backgroundColor: i === 1 ? secondary + '30' : 'transparent' }}
            >
              <div className="w-4 h-4 rounded" style={{ backgroundColor: i === 1 ? secondary : '#475569' }} />
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="flex-1 space-y-3">
          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Ventas', value: '€12,450', change: '+12%', color: primary },
              { label: 'Usuarios', value: '1,234', change: '+5%', color: secondary },
              { label: 'Pedidos', value: '567', change: '+8%', color: accent },
              { label: 'Revenue', value: '€89,100', change: '+15%', color: tertiary || primary },
            ].map((stat) => (
              <div key={stat.label} className="bg-slate-800 rounded-xl p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-slate-400 text-xs">{stat.label}</span>
                  <span className="text-green-400 text-xs">{stat.change}</span>
                </div>
                <p className="text-white font-bold">{stat.value}</p>
                <div className="mt-2 h-1 bg-slate-700 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: '70%', backgroundColor: stat.color }} />
                </div>
              </div>
            ))}
          </div>

          {/* Chart Area */}
          <div className="bg-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-white font-medium">Gráfico de actividad</span>
              <div className="flex gap-2">
                {['Día', 'Semana', 'Mes'].map((period, i) => (
                  <button
                    key={period}
                    className="px-3 py-1 rounded text-xs"
                    style={{
                      backgroundColor: i === 0 ? primary : 'transparent',
                      color: i === 0 ? getTextColorFromHex(primary) : '#94a3b8',
                    }}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
            {/* Fake Chart */}
            <div className="flex items-end gap-1 h-20">
              {[40, 65, 45, 80, 55, 90, 70, 85, 50, 75, 60, 95].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t transition-all hover:opacity-80"
                  style={{
                    height: `${h}%`,
                    backgroundColor: i % 3 === 0 ? primary : i % 3 === 1 ? secondary : accent,
                    opacity: 0.8,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PosterPreview({ roles, colors, allColors }: PreviewProps) {
  const primary = getPreviewColor(colors, roles[0]?.name, 0, allColors);
  const secondary = getPreviewColor(colors, roles[1]?.name, 1, allColors);
  const accent = getPreviewColor(colors, roles[2]?.name, 2, allColors);

  return (
    <div className="space-y-4">
      <p className="text-slate-400 text-sm mb-4">Diseño de póster / arte gráfico:</p>
      
      <div className="flex gap-4 justify-center flex-wrap">
        {/* Poster 1 */}
        <div className="w-48 h-64 rounded-xl overflow-hidden shadow-2xl" style={{ backgroundColor: primary }}>
          <div className="h-full flex flex-col p-4">
            <div className="flex-1 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full" style={{ backgroundColor: accent }} />
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-black mb-1" style={{ color: getTextColorFromHex(primary) }}>EVENTO</h3>
              <p className="text-sm opacity-80" style={{ color: getTextColorFromHex(primary) }}>15 Marzo 2024</p>
            </div>
          </div>
        </div>

        {/* Poster 2 - Split */}
        <div className="w-48 h-64 rounded-xl overflow-hidden shadow-2xl flex">
          <div className="w-1/2 p-3 flex flex-col justify-between" style={{ backgroundColor: primary }}>
            <div className="text-xs font-bold" style={{ color: getTextColorFromHex(primary) }}>EXPOSICIÓN</div>
            <div className="space-y-1">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-1 rounded-full"
                  style={{
                    backgroundColor: getTextColorFromHex(primary),
                    opacity: 0.3,
                    width: `${100 - i * 20}%`,
                  }}
                />
              ))}
            </div>
          </div>
          <div className="w-1/2 p-3 flex flex-col justify-center items-center" style={{ backgroundColor: secondary }}>
            <div className="w-12 h-12 mb-2 rounded-lg transform rotate-45" style={{ backgroundColor: accent }} />
            <p className="text-xs font-bold text-center" style={{ color: getTextColorFromHex(secondary) }}>
              ARTE<br />MODERNO
            </p>
          </div>
        </div>

        {/* Poster 3 - Geometric */}
        <div className="w-48 h-64 rounded-xl overflow-hidden shadow-2xl relative" style={{ backgroundColor: '#0f172a' }}>
          <div
            className="absolute top-0 left-0 w-full h-1/2"
            style={{ backgroundColor: primary, clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 100%)' }}
          />
          <div
            className="absolute bottom-0 right-0 w-1/2 h-1/2"
            style={{ backgroundColor: secondary, clipPath: 'polygon(100% 50%, 100% 100%, 50% 100%)' }}
          />
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-4"
            style={{ borderColor: accent }}
          />
          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-white text-lg font-black">2024</p>
            <p className="text-slate-400 text-xs">Festival de Diseño</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function AppPreview({ roles, colors, allColors }: PreviewProps) {
  const primary = getPreviewColor(colors, roles[0]?.name, 0, allColors);
  const secondary = getPreviewColor(colors, roles[1]?.name, 1, allColors);
  const accent = getPreviewColor(colors, roles[2]?.name, 2, allColors);

  return (
    <div className="space-y-4">
      <p className="text-slate-400 text-sm mb-4">Interfaz de aplicación móvil:</p>
      
      <div className="flex justify-center">
        {/* Phone Frame */}
        <div className="w-52 bg-slate-800 rounded-[2rem] p-2 shadow-2xl">
          <div className="bg-slate-900 rounded-[1.5rem] overflow-hidden">
            {/* Status Bar */}
            <div className="flex items-center justify-between px-4 py-2 text-xs text-slate-400">
              <span>9:41</span>
              <div className="w-20 h-5 bg-slate-800 rounded-full" />
              <span>100%</span>
            </div>

            {/* App Content */}
            <div className="px-4 pb-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-slate-400 text-xs">Buenos días</p>
                  <p className="text-white font-bold">Usuario</p>
                </div>
                <div className="w-10 h-10 rounded-full" style={{ backgroundColor: primary }} />
              </div>

              {/* Balance Card */}
              <div
                className="p-4 rounded-2xl mb-4"
                style={{ background: `linear-gradient(135deg, ${primary}, ${secondary})` }}
              >
                <p className="text-sm opacity-80" style={{ color: getTextColorFromHex(primary) }}>Balance total</p>
                <p className="text-2xl font-bold" style={{ color: getTextColorFromHex(primary) }}>€12,450.00</p>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                {['Enviar', 'Recibir', 'Pagar', 'Más'].map((action, i) => (
                  <button key={action} className="flex flex-col items-center gap-1">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: [primary, secondary, accent, '#475569'][i] + '30' }}
                    >
                      <div className="w-4 h-4 rounded" style={{ backgroundColor: [primary, secondary, accent, '#475569'][i] }} />
                    </div>
                    <span className="text-slate-400 text-[10px]">{action}</span>
                  </button>
                ))}
              </div>

              {/* Transactions */}
              <div className="space-y-2">
                <p className="text-slate-400 text-xs font-medium mb-2">Recientes</p>
                {[
                  { name: 'Netflix', amount: '-€12.99', color: primary },
                  { name: 'Transferencia', amount: '+€500.00', color: secondary },
                  { name: 'Amazon', amount: '-€45.00', color: accent },
                ].map((tx) => (
                  <div key={tx.name} className="flex items-center gap-3 p-2 bg-slate-800 rounded-xl">
                    <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: tx.color + '30' }} />
                    <div className="flex-1">
                      <p className="text-white text-sm">{tx.name}</p>
                      <p className="text-slate-500 text-xs">Hoy</p>
                    </div>
                    <p className={`text-sm font-medium ${tx.amount.startsWith('+') ? 'text-green-400' : 'text-white'}`}>
                      {tx.amount}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Tab Bar */}
            <div className="flex items-center justify-around py-3 border-t border-slate-800" style={{ backgroundColor: '#0f172a' }}>
              {['🏠', '📊', '💳', '👤'].map((icon, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: i === 0 ? primary + '30' : 'transparent' }}
                >
                  <span className={i === 0 ? 'text-lg' : 'text-lg opacity-50'}>{icon}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
