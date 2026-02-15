export interface RefinementModeTab {
  id: 'color' | 'general';
  label: string;
  icon: string;
}

export const REFINEMENT_MODE_TABS: RefinementModeTab[] = [
  { id: 'color', label: 'Por color', icon: '🎨' },
  { id: 'general', label: 'General', icon: '⚙️' },
];
