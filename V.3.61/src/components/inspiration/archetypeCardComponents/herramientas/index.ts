import type { CardComponentVariant } from '../types';
import type { HerramientaVersionId } from './herramientaMetadata';
import { HammerTool } from './HammerTool';
import { BrushTool } from './BrushTool';
import { ViolinTool } from './ViolinTool';
import { QuillTool } from './QuillTool';
import { SwordTool } from './SwordTool';
import { KeyTool } from './KeyTool';
import { LanternTool } from './LanternTool';
import { ChaliceTool } from './ChaliceTool';
import { TelescopeTool } from './TelescopeTool';
import { HourglassTool } from './HourglassTool';
import { ShieldTool } from './ShieldTool';
import { BookTool } from './BookTool';
import { CompassTool } from './CompassTool';
import { ScalesTool } from './ScalesTool';
import { AnchorTool } from './AnchorTool';
import { CrownTool } from './CrownTool';
import { ScissorsTool } from './ScissorsTool';
import { SickleTool } from './SickleTool';
import { MortarTool } from './MortarTool';
import { CrystalTool } from './CrystalTool';
import { TorchTool } from './TorchTool';
import { ArrowTool } from './ArrowTool';
import { GearTool } from './GearTool';
import { MagnifierTool } from './MagnifierTool';
import { DefaultHerramienta } from './DefaultHerramienta';

export {
  getHerramientaMetadata,
  HERRAMIENTAS_IDS,
  type HerramientaVersionId,
} from './herramientaMetadata';

/** Registro de variantes de herramienta. Eje Herramienta (solo UI Quién). */
const HERRAMIENTAS_VARIANTS_BASE: Record<HerramientaVersionId, CardComponentVariant> = {
  'herramienta-1': HammerTool,
  'herramienta-2': BrushTool,
  'herramienta-3': ViolinTool,
  'herramienta-4': QuillTool,
  'herramienta-5': SwordTool,
  'herramienta-6': KeyTool,
  'herramienta-7': LanternTool,
  'herramienta-8': ChaliceTool,
  'herramienta-9': TelescopeTool,
  'herramienta-10': HourglassTool,
  'herramienta-11': ShieldTool,
  'herramienta-12': BookTool,
  'herramienta-13': CompassTool,
  'herramienta-14': ScalesTool,
  'herramienta-15': AnchorTool,
  'herramienta-16': CrownTool,
  'herramienta-17': ScissorsTool,
  'herramienta-18': SickleTool,
  'herramienta-19': MortarTool,
  'herramienta-20': CrystalTool,
  'herramienta-21': TorchTool,
  'herramienta-22': ArrowTool,
  'herramienta-23': GearTool,
  'herramienta-24': MagnifierTool,
};

/** Incluye 'default' como fallback para versionId desconocido. */
export const HERRAMIENTAS_VARIANTS: Record<string, CardComponentVariant> = {
  default: DefaultHerramienta,
  ...HERRAMIENTAS_VARIANTS_BASE,
};
