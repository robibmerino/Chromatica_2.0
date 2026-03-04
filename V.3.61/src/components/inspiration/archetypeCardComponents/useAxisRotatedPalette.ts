import { useMemo } from 'react';
import { computeAxisHueRotation, rotatePaletteHues } from '../../../utils/colorUtils';

/**
 * Parámetros para componentes que rotan su paleta según el eje arquetipo.
 * Compatible con CardComponentProps.
 */
export interface AxisRotationParams {
  colorLeft: string;
  colorRight: string;
  defaultColorLeft: string;
  sliderValue: number;
}

/**
 * Hook reutilizable para fondos y componentes que aplican la rotación del eje arquetipo
 * a una paleta de colores base. Usado en Quién, Qué y Cómo.
 *
 * @param palette - Objeto con colores hex por clave (ej. { sky: '#0a1628', ground: '#1b4332' })
 * @param params - colorLeft, colorRight, defaultColorLeft, sliderValue del eje
 * @returns Objeto con las mismas claves y colores rotados
 */
export function useAxisRotatedPalette<T extends Record<string, string>>(
  palette: T,
  params: AxisRotationParams
): T {
  const { colorLeft, colorRight, defaultColorLeft, sliderValue } = params;
  return useMemo(() => {
    const rotation = computeAxisHueRotation(
      colorLeft,
      colorRight,
      defaultColorLeft,
      sliderValue
    );
    return rotatePaletteHues(palette, rotation);
  }, [palette, colorLeft, colorRight, defaultColorLeft, sliderValue]);
}
