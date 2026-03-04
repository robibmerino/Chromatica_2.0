import { cn } from '../../../../utils/cn';
import type { CardComponentProps } from '../types';
import { DEFAULT_BACKGROUND_STYLE } from './constants';

/**
 * Placeholder genérico para fondos 2–6 hasta que se incorporen los definitivos.
 */
export function BackgroundPlaceholder({ className = '' }: CardComponentProps) {
  return (
    <div className={cn('absolute inset-0 rounded-xl', className)} style={DEFAULT_BACKGROUND_STYLE} />
  );
}
