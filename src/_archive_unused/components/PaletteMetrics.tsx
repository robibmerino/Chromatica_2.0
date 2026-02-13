import { Color } from '../types/palette';
import { calculatePaletteMetrics, getContrastRatio } from '../utils/colorUtils';
import { cn } from '../utils/cn';

interface PaletteMetricsProps {
  colors: Color[];
}

export function PaletteMetrics({ colors }: PaletteMetricsProps) {
  const metrics = calculatePaletteMetrics(colors);

  if (!metrics) return null;

  const MetricCard = ({ 
    label, 
    value, 
    icon, 
    color = 'violet' 
  }: { 
    label: string; 
    value: string | number; 
    icon: React.ReactNode;
    color?: 'violet' | 'pink' | 'cyan' | 'green' | 'orange';
  }) => {
    const colorClasses = {
      violet: 'from-violet-500/20 to-violet-600/20 border-violet-500/30',
      pink: 'from-pink-500/20 to-pink-600/20 border-pink-500/30',
      cyan: 'from-cyan-500/20 to-cyan-600/20 border-cyan-500/30',
      green: 'from-green-500/20 to-green-600/20 border-green-500/30',
      orange: 'from-orange-500/20 to-orange-600/20 border-orange-500/30',
    };

    return (
      <div className={cn(
        "p-3 rounded-xl bg-gradient-to-br border",
        colorClasses[color]
      )}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-slate-400">{icon}</span>
          <span className="text-slate-400 text-xs">{label}</span>
        </div>
        <p className="text-white font-bold text-lg">{value}</p>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6">
      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        Análisis de Paleta
      </h3>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <MetricCard
          label="Saturación media"
          value={`${metrics.avgSaturation}%`}
          color="pink"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4z" />
            </svg>
          }
        />
        <MetricCard
          label="Luminosidad media"
          value={`${metrics.avgLightness}%`}
          color="cyan"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
        />
        <MetricCard
          label="Rango de tonos"
          value={`${metrics.hueRange}°`}
          color="violet"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" strokeWidth="2" />
            </svg>
          }
        />
        <MetricCard
          label="Contraste máx"
          value={metrics.maxContrast}
          color="green"
          icon={
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          }
        />
      </div>

      {/* Accessibility Badge */}
      <div className={cn(
        "p-4 rounded-xl text-center",
        metrics.accessibilityScore === 'AA' 
          ? 'bg-green-500/20 border border-green-500/30' 
          : metrics.accessibilityScore === 'AA Large'
            ? 'bg-yellow-500/20 border border-yellow-500/30'
            : 'bg-red-500/20 border border-red-500/30'
      )}>
        <p className="text-slate-400 text-xs mb-1">Accesibilidad WCAG</p>
        <p className={cn(
          "font-bold text-lg",
          metrics.accessibilityScore === 'AA' 
            ? 'text-green-400' 
            : metrics.accessibilityScore === 'AA Large'
              ? 'text-yellow-400'
              : 'text-red-400'
        )}>
          {metrics.accessibilityScore}
        </p>
        <p className="text-slate-500 text-xs mt-1">
          {metrics.accessibilityScore === 'AA' 
            ? 'Cumple estándares de contraste'
            : metrics.accessibilityScore === 'AA Large'
              ? 'Solo para texto grande'
              : 'Bajo contraste'}
        </p>
      </div>

      {/* Contrast Matrix Preview */}
      <div className="mt-4">
        <p className="text-slate-400 text-xs mb-2">Matriz de Contraste</p>
        <div className="flex flex-wrap gap-1">
          {colors.slice(0, 4).map((c1, i) => (
            colors.slice(i + 1, 5).map((c2, j) => {
              const ratio = getContrastRatio(c1, c2);
              const isGood = ratio >= 4.5;
              return (
                <div
                  key={`${i}-${j}`}
                  className={cn(
                    "flex-1 min-w-[60px] p-2 rounded-lg text-center text-xs",
                    isGood ? 'bg-green-500/20' : 'bg-slate-700/50'
                  )}
                >
                  <div className="flex justify-center gap-1 mb-1">
                    <div 
                      className="w-3 h-3 rounded-full border border-white/20"
                      style={{ backgroundColor: c1.hex }}
                    />
                    <div 
                      className="w-3 h-3 rounded-full border border-white/20"
                      style={{ backgroundColor: c2.hex }}
                    />
                  </div>
                  <span className={isGood ? 'text-green-400' : 'text-slate-400'}>
                    {ratio.toFixed(1)}:1
                  </span>
                </div>
              );
            })
          ))}
        </div>
      </div>
    </div>
  );
}
