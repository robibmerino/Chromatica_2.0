import type { ColorItem } from '../../../types/guidedPalette';
import type { SupportSwatch } from './types';

/** Mapa de roles P/S/A/A2/F/T y demás iniciales de la paleta de apoyo. */
export function buildRoleHexMap(
  effectiveColors: ColorItem[],
  effectiveSupportColors: SupportSwatch[] | null | undefined
): Record<string, { hex: string; label: string }> {
  const map: Record<string, { hex: string; label: string }> = {};
  if (effectiveColors[0]) map.P = { hex: effectiveColors[0].hex, label: 'Primario' };
  if (effectiveColors[1]) map.S = { hex: effectiveColors[1].hex, label: 'Secundario' };
  if (effectiveColors[2]) map.A = { hex: effectiveColors[2].hex, label: 'Acento' };
  if (effectiveColors[3]) map.A2 = { hex: effectiveColors[3].hex, label: 'Acento 2' };

  if (effectiveSupportColors) {
    effectiveSupportColors.forEach((s) => {
      if (s.initial) {
        map[s.initial] = { hex: s.hex, label: s.label };
      }
    });

    const fondo =
      effectiveSupportColors.find((s) => s.initial === 'F') ??
      effectiveSupportColors.find((s) => s.role === 'fondo') ??
      effectiveSupportColors[0];
    const texto =
      effectiveSupportColors.find((s) => s.initial === 'T') ??
      effectiveSupportColors.find((s) => s.role === 'texto') ??
      effectiveSupportColors.find((s) => s.role === 'texto fino');

    if (fondo) map.F = { hex: fondo.hex, label: fondo.label };
    if (texto) map.T = { hex: texto.hex, label: texto.label };
  }

  return map;
}
