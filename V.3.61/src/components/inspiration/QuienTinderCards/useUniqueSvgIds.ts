import { useId } from 'react';

/**
 * Genera IDs únicos para elementos SVG (gradientes, etc.) cuando hay múltiples
 * instancias del mismo componente en pantalla (p. ej. varias tarjetas visibles).
 */
export function useUniqueSvgIds(prefix: string): (name: string) => string {
  const id = useId();
  const cleanId = id.replace(/:/g, '-');
  return (name: string) => `${prefix}-${name}-${cleanId}`;
}
