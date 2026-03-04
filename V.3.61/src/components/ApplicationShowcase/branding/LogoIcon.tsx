/**
 * Icono logo aura: taza + hoja. Compartido por Papeleria, Mockup y otros componentes de branding.
 * Tamaño y colores parametrizables.
 */
export function LogoIcon({
  width,
  height,
  borderWidth,
  cupColor,
  leafColor,
  opacity = 1,
}: {
  width: number;
  height: number;
  borderWidth: number;
  cupColor: string;
  leafColor: string;
  opacity?: number;
}) {
  return (
    <div className="relative flex-shrink-0 flex items-center justify-center" style={{ width, height, opacity }}>
      <div className="absolute bottom-[15%] left-1/2 -translate-x-1/2 w-[52%] h-[38%] rounded-b-[40%]" style={{ borderLeft: `${borderWidth}px solid ${cupColor}`, borderRight: `${borderWidth}px solid ${cupColor}`, borderBottom: `${borderWidth}px solid ${cupColor}` }} />
      <div className="absolute left-1/2 -translate-x-1/2 w-[28%] rounded-full" style={{ bottom: '13%', height: borderWidth, background: cupColor }} />
      <div className="absolute top-[32%] left-1/2 -translate-x-1/2 -rotate-[8deg] w-[28%] h-[38%] border rounded-[50%_2px_50%_2px]" style={{ borderColor: leafColor, borderWidth }} />
    </div>
  );
}
