import type { CardComponentProps } from '../types';

/** Inspiración por defecto (ninguna visible). Placeholder para opciones sin inspiración. */
export function DefaultInspiracion({ className = '' }: CardComponentProps) {
  return <div className={className} aria-hidden />;
}
