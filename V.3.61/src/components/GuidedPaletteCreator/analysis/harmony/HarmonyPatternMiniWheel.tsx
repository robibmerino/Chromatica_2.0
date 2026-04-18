import React from 'react';

const HUE_WHEEL_CONIC =
  'conic-gradient(from 0deg, hsl(0,100%,50%), hsl(30,100%,50%), hsl(60,100%,50%), hsl(90,100%,50%), hsl(120,100%,50%), hsl(150,100%,50%), hsl(180,100%,50%), hsl(210,100%,50%), hsl(240,100%,50%), hsl(270,100%,50%), hsl(300,100%,50%), hsl(330,100%,50%), hsl(360,100%,50%))';

/** Igual que `markerPosition` en la rueda grande: matiz 0° arriba, sentido horario. */
function dotPercentFromHueDegrees(h: number): { left: string; top: string } {
  const angle = ((h - 90) * Math.PI) / 180;
  const radius = 42;
  const x = 50 + Math.cos(angle) * radius;
  const y = 50 + Math.sin(angle) * radius;
  return { left: `${x}%`, top: `${y}%` };
}

export type HarmonyPatternMiniWheelProps = {
  /** Ángulos de la plantilla del patrón (0° = arriba). */
  anglesDegrees: number[];
  /** Rotación opcional (p. ej. `bestRotation`) para alinear con el encaje calculado. */
  rotationDegrees?: number;
  className?: string;
};

export function HarmonyPatternMiniWheel({
  anglesDegrees,
  rotationDegrees = 0,
  className,
}: HarmonyPatternMiniWheelProps) {
  const displayAngles = React.useMemo(
    () =>
      anglesDegrees.map((a) => {
        const v = (a + rotationDegrees) % 360;
        return v < 0 ? v + 360 : v;
      }),
    [anglesDegrees, rotationDegrees],
  );

  return (
    <div
      className={`relative mx-auto aspect-square w-14 shrink-0 ${className ?? ''}`}
      aria-hidden
    >
      <div className="absolute inset-0 rounded-full" style={{ background: HUE_WHEEL_CONIC }} />
      <div className="absolute inset-[22%] rounded-full border border-slate-800/90 bg-slate-950" />
      {displayAngles.map((deg, i) => {
        const pos = dotPercentFromHueDegrees(deg);
        return (
          <div
            key={`${deg}-${i}`}
            className="absolute h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/50 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.4)]"
            style={{ left: pos.left, top: pos.top }}
          />
        );
      })}
    </div>
  );
}
