import type { CardComponentProps } from '../types';

/** Herramienta por defecto (ninguna visible). Placeholder para opciones sin herramienta. */
export function DefaultHerramienta({ className = '' }: CardComponentProps) {
  return <div className={className} aria-hidden />;
}
