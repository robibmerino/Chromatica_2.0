import type { CardComponentProps } from '../types';

/** Familiar por defecto (ninguno visible). Placeholder para opciones sin familiar. */
export function DefaultFamiliar({ className = '' }: CardComponentProps) {
  return <div className={className} aria-hidden />;
}
