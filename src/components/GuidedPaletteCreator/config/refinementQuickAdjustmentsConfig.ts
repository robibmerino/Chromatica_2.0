export interface QuickAdjustmentItem {
  label: string;
  type: 'complement' | 'triadic' | 'square';
  /** Grados en la rueda (se muestra al pasar el cursor). */
  degrees: number;
}

export const REFINEMENT_QUICK_ADJUSTMENTS: QuickAdjustmentItem[] = [
  { label: 'Complementario', type: 'complement', degrees: 180 },
  { label: 'Triádico', type: 'triadic', degrees: 120 },
  { label: 'Cuadrado', type: 'square', degrees: 90 },
];
