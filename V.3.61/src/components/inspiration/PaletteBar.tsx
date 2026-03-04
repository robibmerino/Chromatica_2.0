/** Barra de paleta horizontal: segmentos de color con esquinas redondeadas. Labels opcionales encima, con color del eje. */
export function PaletteBar({
  colors,
  labels,
  className = '',
}: {
  colors: string[];
  labels?: string[];
  className?: string;
}) {
  const hasLabels = labels != null && labels.length === colors.length;

  return (
    <div className="flex flex-col gap-1.5">
      {hasLabels && (
        <div className="flex min-h-5 items-center">
          {colors.map((color, i) => (
            <div key={i} className="flex-1 min-w-0 flex justify-center px-0.5">
              <span
                className="text-xs font-medium truncate max-w-full"
                style={{ color }}
                title={labels[i]}
              >
                {labels[i]}
              </span>
            </div>
          ))}
        </div>
      )}
      <div className={`flex rounded-xl overflow-hidden border border-white/5 ${className}`}>
        {colors.map((color, i) => (
          <div
            key={i}
            className="flex-1 min-w-0"
            style={{ backgroundColor: color }}
            title={color}
          />
        ))}
      </div>
    </div>
  );
}
