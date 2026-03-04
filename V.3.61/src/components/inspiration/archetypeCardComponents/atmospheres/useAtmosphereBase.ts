import type { CardComponentProps } from '../types';

/** Color base para atmósfera: blendedColor ?? colorLeft ?? colorRight ?? fallback */
export function getAtmosphereBase(
  props: Pick<CardComponentProps, 'blendedColor' | 'colorLeft' | 'colorRight' | 'defaultColorLeft'>,
  fallback: string
): string {
  return props.blendedColor ?? props.colorLeft ?? props.colorRight ?? props.defaultColorLeft ?? fallback;
}

/** Factor de fase para animaciones según slider (0-100) */
export function getAtmospherePhase(sliderValue: number = 50, factor: number = 0.5): number {
  return (sliderValue / 100) * factor;
}
