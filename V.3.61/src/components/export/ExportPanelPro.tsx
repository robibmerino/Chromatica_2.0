import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import { toPng } from 'html-to-image';
import ButtonParticles from '../ButtonParticles';
import { evaluateChromaticHarmony } from '../GuidedPaletteCreator/analysis/harmony/harmonyAnalysis';
import {
  evaluateTemperatureHarmony,
  warmCoolFromHex,
  wcToSpectrumPercent,
} from '../GuidedPaletteCreator/analysis/temperature/temperatureHarmonyAnalysis';
import { evaluateVibrancy } from '../GuidedPaletteCreator/analysis/vibrancy/vibrancyAnalysis';
import { evaluateLightnessBalance, grayHexFromLstar } from '../GuidedPaletteCreator/analysis/lightness/lightnessBalanceAnalysis';
import { CVD_ROLES, simulateCvdHex } from '../GuidedPaletteCreator/analysis/cvd/cvdAnalysis';
import { ArchitectureSection } from '../ApplicationShowcase/ArchitectureSection';
import { BrandingSection } from '../ApplicationShowcase/BrandingSection';
import { PosterSection } from '../ApplicationShowcase/PosterSection';
import type {
  PosterPalette as ApplicationPosterPalette,
  PosterVariant as ApplicationPosterTemplate,
  ArchitectureVariant as ApplicationArchitectureTemplate,
  BrandingVariant as ApplicationBrandingTemplate,
} from '../ApplicationShowcase/types';
import { getContrastColor, getContrastRatioHex, hexToHsl, hslToHex } from '../../utils/colorUtils';
import { buildColorPaletteFromHarmony, type PosterVariant } from '../../types/palette';

/** Acento ámbar saturado (menos pálido que yellow-200) para el CTA de descarga PNG. */
const EXPORT_DOWNLOAD_GOLD = {
  text: '#fbbf24',
  border: 'rgba(245, 158, 11, 0.5)',
  bg: 'rgba(146, 64, 14, 0.35)',
  particle: '#fb923c',
} as const;

export type ExportPageFormat = 'A5' | 'A4' | 'A3';

/** ISO 216 retrato; píxeles CSS ≈ 96 DPI (25.4 mm = 1 in). */
const MM_TO_CSS_PX = 96 / 25.4;
const EXPORT_PAGE_SPECS: Record<ExportPageFormat, { label: string; widthMm: number; heightMm: number }> = {
  A5: { label: 'A5', widthMm: 148, heightMm: 210 },
  A4: { label: 'A4', widthMm: 210, heightMm: 297 },
  A3: { label: 'A3', widthMm: 297, heightMm: 420 },
};

function exportPagePixelSize(format: ExportPageFormat): { w: number; h: number } {
  const s = EXPORT_PAGE_SPECS[format];
  return {
    w: Math.round(s.widthMm * MM_TO_CSS_PX),
    h: Math.round(s.heightMm * MM_TO_CSS_PX),
  };
}

export type ExportSplitRenderApi = {
  renderControls: (opts?: { compact?: boolean }) => React.ReactNode;
  renderPreview: () => React.ReactNode;
  /** Botón Descargar PNG (estilo banner + partículas); en Guardar va fijo encima del scroll de la columna izquierda. */
  renderStickyDownload: () => React.ReactNode;
};

interface ExportPanelProProps {
  colors: string[];
  secondaryColors?: string[];
  paletteName: string;
  /** `split`: delega la colocación de controles y vista prevía vía `renderSplit` (p. ej. columnas Guardar). */
  layout?: 'stacked' | 'split';
  renderSplit?: (api: ExportSplitRenderApi) => React.ReactNode;
  /**
   * Estado persistente opcional para la fase Guardar.
   * Permite volver a la fase sin perder formato, bloques y ajustes del lienzo.
   */
  persistedState?: ExportPanelProPersistedState;
  onPersistedStateChange?: (next: ExportPanelProPersistedState) => void;
}

/** Bloques colocados libremente en el lienzo DIN (vista previa / export). */
export type ExportCanvasTextAlign = 'left' | 'center' | 'right' | 'justify';
export type ExportPaletteCodeFormat = 'hex' | 'rgb' | 'hsl';
export type ExportAnalysisHarmonyOption = 'tone-wheel' | 'type' | 'tone-spectrum' | 'degrees';
export type ExportAnalysisTemperatureOption = 'landscape' | 'distribution' | 'distribution-percent';
export type ExportAnalysisFocusOption = 'energy' | 'distribution' | 'distribution-percent';
export type ExportAnalysisLightnessOption = 'stair' | 'coverage' | 'grayscale';
export type ExportAnalysisCvdOption = 'original' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';
export type ExportAnalysisContrastOption = 'wcag' | 'proximity';
export type ExportApplicationPosterVariant = PosterVariant;
export type ExportApplicationPosterTemplate = ApplicationPosterTemplate;
export type ExportApplicationArchitectureTemplate = ApplicationArchitectureTemplate;
export type ExportApplicationBrandingTemplate = ApplicationBrandingTemplate;

export type ExportCanvasItem = {
  id: string;
  kind:
    | 'title'
    | 'body'
    | 'palette'
    | 'palette-secondary'
    | 'application-poster'
    | 'application-architecture'
    | 'application-branding'
    | 'analysis-harmony'
    | 'analysis-temperature'
    | 'analysis-focus'
    | 'analysis-lightness'
    | 'analysis-cvd'
    | 'analysis-contrast';
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  /** Tamaño de fuente del bloque (px); se acota a la altura del recuadro al renderizar y al redimensionar. */
  fontSizePx: number;
  /** Alineación del texto (título/cuerpo); por defecto izquierda en bloques antiguos sin campo. */
  textAlign?: ExportCanvasTextAlign;
  /** Formatos de códigos activos a mostrar bajo la paleta. */
  paletteCodeFormats?: ExportPaletteCodeFormat[];
  /** Opciones activas del bloque Armonía. */
  analysisHarmonyOptions?: ExportAnalysisHarmonyOption[];
  /** Opciones activas del bloque Temperatura. */
  analysisTemperatureOptions?: ExportAnalysisTemperatureOption[];
  /** Opciones activas del bloque Focus. */
  analysisFocusOptions?: ExportAnalysisFocusOption[];
  /** Opciones activas del bloque Luminosidad. */
  analysisLightnessOptions?: ExportAnalysisLightnessOption[];
  /** Opciones activas del bloque Daltonismo. */
  analysisCvdOptions?: ExportAnalysisCvdOption[];
  /** Opciones activas del bloque Contraste. */
  analysisContrastOptions?: ExportAnalysisContrastOption[];
  /** Escala visual de elementos activos de Armonía (porcentaje). */
  analysisHarmonyVisualScale?: number;
  /** Escala visual de las esferas del bloque Focus (porcentaje). */
  analysisFocusVisualScale?: number;
  /** Escala visual de tarjetas en Daltonismo (porcentaje). */
  analysisCvdVisualScale?: number;
  /** Escala visual de tarjetas en Contraste (porcentaje). */
  analysisContrastVisualScale?: number;
  /** Textos personalizados por combinación WCAG (editable en bloque Contraste). */
  contrastWcagTexts?: Record<string, string>;
  /** Variante del ejemplo «Poster» de aplicación: claro/oscuro. */
  applicationPosterVariant?: ExportApplicationPosterVariant;
  /** Plantilla del ejemplo «Poster» (Conference, Swiss, etc.). */
  applicationPosterTemplate?: ExportApplicationPosterTemplate;
  /** Variante del ejemplo «Arquitectura» de aplicación: claro/oscuro. */
  applicationArchitectureVariant?: ExportApplicationPosterVariant;
  /** Plantilla del ejemplo «Arquitectura» (estudio, cafetería, etc.). */
  applicationArchitectureTemplate?: ExportApplicationArchitectureTemplate;
  /** Escala visual de elementos internos del bloque Poster (porcentaje). */
  applicationPosterVisualScale?: number;
  /** Escala visual de elementos internos del bloque Arquitectura (porcentaje). */
  applicationArchitectureVisualScale?: number;
  /** Si es true, solo se muestra la ilustración de la escena (sin cabecera, paleta ni fichas). */
  applicationArchitectureSceneOnly?: boolean;
  /** Variante del ejemplo «Branding»: claro/oscuro (misma paleta que Poster). */
  applicationBrandingVariant?: ExportApplicationPosterVariant;
  /** Subapartado de Branding (Territorio visual, Mockup, etc.). */
  applicationBrandingTemplate?: ExportApplicationBrandingTemplate;
  /** Escala visual del bloque Branding (porcentaje). */
  applicationBrandingVisualScale?: number;
  /** Si es true, solo arte de escena (sin cabecera de marca, bloques de texto ni pie de hoja). */
  applicationBrandingSceneOnly?: boolean;
};

/** Etiquetas cortas para resúmenes de UI (acordeón Elementos, etc.). */
const EXPORT_CANVAS_KIND_LABEL_ES: Record<ExportCanvasItem['kind'], string> = {
  title: 'Título',
  body: 'Texto',
  palette: 'Paleta',
  'palette-secondary': 'Paleta Secundaria',
  'application-poster': 'Poster',
  'application-architecture': 'Arquitectura',
  'application-branding': 'Branding',
  'analysis-harmony': 'Armonía',
  'analysis-temperature': 'Temperatura',
  'analysis-focus': 'Focus',
  'analysis-lightness': 'Luminosidad',
  'analysis-cvd': 'Daltonismo',
  'analysis-contrast': 'Contraste',
};

type ExportElementsSection = 'basics' | 'application' | 'analysis';

export type ExportPanelProPersistedState = {
  exportSidebarAccordion: 'size' | 'style' | 'elements' | null;
  background: 'white' | 'dark' | 'custom';
  customBg: string;
  showBorder: boolean;
  transparentElementCards: boolean;
  borderRadius: 'none' | 'small' | 'medium' | 'large';
  exportPageFormat: ExportPageFormat;
  exportElementsSection: ExportElementsSection;
  canvasItems: ExportCanvasItem[];
};

const EXPORT_PANEL_PRO_DEFAULT_PERSISTED_STATE: ExportPanelProPersistedState = {
  exportSidebarAccordion: 'size',
  background: 'dark',
  customBg: '#1a1a2e',
  showBorder: true,
  transparentElementCards: false,
  borderRadius: 'medium',
  exportPageFormat: 'A4',
  exportElementsSection: 'basics',
  canvasItems: [],
};

const EXPORT_ELEMENTS_SECTION_OPTIONS: { id: ExportElementsSection; label: string }[] = [
  { id: 'basics', label: 'Básicos' },
  { id: 'application', label: 'Aplicación' },
  { id: 'analysis', label: 'Análisis' },
];

const EXPORT_CANVAS_ALIGN_OPTIONS: { align: ExportCanvasTextAlign; ariaLabel: string }[] = [
  { align: 'left', ariaLabel: 'Alinear a la izquierda' },
  { align: 'center', ariaLabel: 'Centrar' },
  { align: 'right', ariaLabel: 'Alinear a la derecha' },
  { align: 'justify', ariaLabel: 'Justificar' },
];

/** Icono «rayitas» de alineación (16×16). */
function ExportCanvasAlignIcon({ align }: { align: ExportCanvasTextAlign }) {
  const common = {
    className: 'h-3.5 w-3.5 shrink-0',
    viewBox: '0 0 16 16',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.25,
    strokeLinecap: 'round' as const,
    'aria-hidden': true as const,
  };
  switch (align) {
    case 'left':
      return (
        <svg {...common}>
          <line x1="2" y1="3.5" x2="14" y2="3.5" />
          <line x1="2" y1="8" x2="10" y2="8" />
          <line x1="2" y1="12.5" x2="12" y2="12.5" />
        </svg>
      );
    case 'center':
      return (
        <svg {...common}>
          <line x1="3" y1="3.5" x2="13" y2="3.5" />
          <line x1="4" y1="8" x2="12" y2="8" />
          <line x1="3" y1="12.5" x2="13" y2="12.5" />
        </svg>
      );
    case 'right':
      return (
        <svg {...common}>
          <line x1="2" y1="3.5" x2="14" y2="3.5" />
          <line x1="6" y1="8" x2="14" y2="8" />
          <line x1="4" y1="12.5" x2="14" y2="12.5" />
        </svg>
      );
    case 'justify':
      return (
        <svg {...common}>
          <line x1="2" y1="3.5" x2="14" y2="3.5" />
          <line x1="2" y1="8" x2="14" y2="8" />
          <line x1="2" y1="12.5" x2="14" y2="12.5" />
        </svg>
      );
    default:
      return null;
  }
}

type ExportCanvasFooterChrome = 'onLightCanvas' | 'onDarkCanvas';

/** Alineación del bloque respecto al área útil de la hoja DIN (padding 24px). */
export type ExportCanvasBlockSheetAlign =
  | 'sheetLeft'
  | 'sheetHCenter'
  | 'sheetRight'
  | 'sheetTop'
  | 'sheetVMiddle'
  | 'sheetBottom';

const EXPORT_CANVAS_SHEET_POSITION_OPTIONS: { mode: ExportCanvasBlockSheetAlign; ariaLabel: string }[] = [
  { mode: 'sheetLeft', ariaLabel: 'Bloque al borde izquierdo de la hoja' },
  { mode: 'sheetHCenter', ariaLabel: 'Bloque centrado horizontalmente en la hoja' },
  { mode: 'sheetRight', ariaLabel: 'Bloque al borde derecho de la hoja' },
  { mode: 'sheetTop', ariaLabel: 'Bloque arriba del área de la hoja' },
  { mode: 'sheetVMiddle', ariaLabel: 'Bloque centrado verticalmente en la hoja' },
  { mode: 'sheetBottom', ariaLabel: 'Bloque abajo del área de la hoja' },
];

const EXPORT_PALETTE_CODE_FORMAT_OPTIONS: {
  format: ExportPaletteCodeFormat;
  label: string;
  ariaLabel: string;
}[] = [
  { format: 'hex', label: 'HEX', ariaLabel: 'Alternar códigos HEX' },
  { format: 'rgb', label: 'RGB', ariaLabel: 'Alternar códigos RGB' },
  { format: 'hsl', label: 'HSL', ariaLabel: 'Alternar códigos HSL' },
];

const EXPORT_ANALYSIS_HARMONY_OPTIONS: {
  option: ExportAnalysisHarmonyOption;
  label: string;
  ariaLabel: string;
}[] = [
  { option: 'tone-wheel', label: 'Rueda', ariaLabel: 'Posición de tonos en la rueda cromática' },
  { option: 'degrees', label: 'Gº', ariaLabel: 'Mostrar grados de tono' },
  { option: 'type', label: 'Tipo', ariaLabel: 'Mostrar tipo de armonía' },
  { option: 'tone-spectrum', label: 'Espectro', ariaLabel: 'Distribución de tonos en el espectro' },
];

const EXPORT_ANALYSIS_TEMPERATURE_OPTIONS: {
  option: ExportAnalysisTemperatureOption;
  label: string;
  ariaLabel: string;
}[] = [
  { option: 'landscape', label: 'Paisaje', ariaLabel: 'Atmósfera de la paleta' },
  { option: 'distribution', label: 'Distribución', ariaLabel: 'Distribución térmica en espectro frío-neutro-cálido' },
  { option: 'distribution-percent', label: 'Distribución%', ariaLabel: 'Porcentaje de distribución térmica' },
];

const EXPORT_ANALYSIS_FOCUS_OPTIONS: {
  option: ExportAnalysisFocusOption;
  label: string;
  ariaLabel: string;
}[] = [
  { option: 'energy', label: 'Energía', ariaLabel: 'Campo de energía cromática' },
  { option: 'distribution', label: 'Distribución', ariaLabel: 'Distribución de vibrancia por rol' },
  { option: 'distribution-percent', label: 'Distribución%', ariaLabel: 'Porcentaje de distribución de vibrancia' },
];

const EXPORT_ANALYSIS_LIGHTNESS_OPTIONS: {
  option: ExportAnalysisLightnessOption;
  label: string;
  ariaLabel: string;
}[] = [
  { option: 'stair', label: 'Escalera', ariaLabel: 'Escalera de luminosidad L*' },
  { option: 'coverage', label: 'Cobertura', ariaLabel: 'Cobertura tonal en escala L*' },
  { option: 'grayscale', label: 'Grises', ariaLabel: 'Paleta en escala de grises' },
];

const EXPORT_ANALYSIS_CVD_OPTIONS: {
  option: ExportAnalysisCvdOption;
  label: string;
  ariaLabel: string;
}[] = [
  { option: 'original', label: 'Original', ariaLabel: 'Vista original sin simulación' },
  { option: 'protanopia', label: 'Protanopia', ariaLabel: 'Simulación de protanopia' },
  { option: 'deuteranopia', label: 'Deuteranopia', ariaLabel: 'Simulación de deuteranopia' },
  { option: 'tritanopia', label: 'Tritanopia', ariaLabel: 'Simulación de tritanopia' },
  { option: 'achromatopsia', label: 'Acromatopsia', ariaLabel: 'Simulación de acromatopsia' },
];

const EXPORT_ANALYSIS_CONTRAST_OPTIONS: {
  option: ExportAnalysisContrastOption;
  label: string;
  ariaLabel: string;
}[] = [
  { option: 'wcag', label: 'WCAG', ariaLabel: 'Combinaciones de contraste WCAG' },
  { option: 'proximity', label: 'Proximidad', ariaLabel: 'Mockup de proximidad visual' },
];

const EXPORT_APPLICATION_POSTER_TEMPLATE_OPTIONS: {
  option: ExportApplicationPosterTemplate;
  label: string;
  ariaLabel: string;
}[] = [
  { option: 'conference', label: 'Conf', ariaLabel: 'Poster tipo Conference' },
  { option: 'exhibition-swiss', label: 'Swiss', ariaLabel: 'Poster tipo Exhibition Swiss' },
  { option: 'festival-gig', label: 'Fest', ariaLabel: 'Poster tipo Festival Gig' },
  { option: 'collage', label: 'Collage', ariaLabel: 'Poster tipo Collage' },
  { option: 'competition', label: 'Comp', ariaLabel: 'Poster tipo Competition' },
];

const EXPORT_APPLICATION_ARCHITECTURE_TEMPLATE_OPTIONS: {
  option: ExportApplicationArchitectureTemplate;
  label: string;
  ariaLabel: string;
}[] = [
  { option: 'estudio', label: 'Est', ariaLabel: 'Arquitectura tipo Estudio' },
  { option: 'cafeteria', label: 'Café', ariaLabel: 'Arquitectura tipo Cafetería' },
  { option: 'oficina', label: 'Ofi', ariaLabel: 'Arquitectura tipo Oficina' },
  { option: 'stand', label: 'Stand', ariaLabel: 'Arquitectura tipo Stand corporativo' },
  { option: 'fachada', label: 'Fach', ariaLabel: 'Arquitectura tipo Fachada corporativa' },
];

const EXPORT_APPLICATION_BRANDING_TEMPLATE_OPTIONS: {
  option: ExportApplicationBrandingTemplate;
  label: string;
  ariaLabel: string;
}[] = [
  { option: 'territorio-visual', label: 'Terr', ariaLabel: 'Branding: Territorio visual' },
  { option: 'direccion-fotografica', label: 'Foto', ariaLabel: 'Branding: Dirección fotográfica' },
  { option: 'mockup', label: 'Mock', ariaLabel: 'Branding: Mockup' },
  { option: 'packaging', label: 'Pack', ariaLabel: 'Branding: Packaging' },
  { option: 'redes-sociales-webs', label: 'Web', ariaLabel: 'Branding: Redes sociales y webs' },
  { option: 'aplicacion-espacio', label: 'Esp', ariaLabel: 'Branding: Aplicación al espacio' },
  { option: 'ilustraciones', label: 'Ilus', ariaLabel: 'Branding: Ilustraciones' },
  { option: 'patrones', label: 'Pat', ariaLabel: 'Branding: Patrones' },
  { option: 'papeleria', label: 'Pap', ariaLabel: 'Branding: Papelería' },
  { option: 'publicidad', label: 'Pub', ariaLabel: 'Branding: Publicidad' },
  { option: 'storytelling', label: 'Story', ariaLabel: 'Branding: Storytelling' },
];

/** Icono de alineación del bloque en la hoja (16×16). */
function ExportCanvasBlockSheetAlignIcon({ mode }: { mode: ExportCanvasBlockSheetAlign }) {
  const common = {
    className: 'h-3.5 w-3.5 shrink-0',
    viewBox: '0 0 16 16',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.25,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true as const,
  };
  switch (mode) {
    case 'sheetLeft':
      return (
        <svg {...common}>
          <line x1="2.5" y1="2" x2="2.5" y2="14" />
          <rect x="4.5" y="4.5" width="9" height="7" rx="1" />
        </svg>
      );
    case 'sheetHCenter':
      return (
        <svg {...common}>
          <line x1="2" y1="2" x2="2" y2="14" />
          <line x1="14" y1="2" x2="14" y2="14" />
          <rect x="5" y="4.5" width="6" height="7" rx="1" />
        </svg>
      );
    case 'sheetRight':
      return (
        <svg {...common}>
          <line x1="13.5" y1="2" x2="13.5" y2="14" />
          <rect x="2.5" y="4.5" width="9" height="7" rx="1" />
        </svg>
      );
    case 'sheetTop':
      return (
        <svg {...common}>
          <line x1="2" y1="2.5" x2="14" y2="2.5" />
          <rect x="4" y="4.5" width="8" height="9" rx="1" />
        </svg>
      );
    case 'sheetVMiddle':
      return (
        <svg {...common}>
          <line x1="2" y1="2" x2="14" y2="2" />
          <line x1="2" y1="14" x2="14" y2="14" />
          <rect x="4" y="5" width="8" height="6" rx="1" />
        </svg>
      );
    case 'sheetBottom':
      return (
        <svg {...common}>
          <line x1="2" y1="13.5" x2="14" y2="13.5" />
          <rect x="4" y="2.5" width="8" height="9" rx="1" />
        </svg>
      );
    default:
      return null;
  }
}

/** Controles de selección bajo el marco (excluidos del PNG vía `data-export-handle`). */
function ExportCanvasSelectionFooter(props: {
  sizePx: number;
  currentAlign: ExportCanvasTextAlign;
  /** Lienzo claro → barra oscura; lienzo oscuro → barra clara (mejor contraste). */
  chrome: ExportCanvasFooterChrome;
  /** Si es false, oculta controles de tipografía/alineación de texto. */
  showTextControls?: boolean;
  onBumpFont: (delta: number) => void;
  onSetAlign: (align: ExportCanvasTextAlign) => void;
  paletteCodeFormats?: ExportPaletteCodeFormat[];
  onTogglePaletteCodeFormat?: (format: ExportPaletteCodeFormat) => void;
  analysisHarmonyOptions?: ExportAnalysisHarmonyOption[];
  onToggleAnalysisHarmonyOption?: (option: ExportAnalysisHarmonyOption) => void;
  analysisTemperatureOptions?: ExportAnalysisTemperatureOption[];
  onToggleAnalysisTemperatureOption?: (option: ExportAnalysisTemperatureOption) => void;
  analysisFocusOptions?: ExportAnalysisFocusOption[];
  onToggleAnalysisFocusOption?: (option: ExportAnalysisFocusOption) => void;
  analysisLightnessOptions?: ExportAnalysisLightnessOption[];
  onToggleAnalysisLightnessOption?: (option: ExportAnalysisLightnessOption) => void;
  analysisCvdOptions?: ExportAnalysisCvdOption[];
  onToggleAnalysisCvdOption?: (option: ExportAnalysisCvdOption) => void;
  analysisContrastOptions?: ExportAnalysisContrastOption[];
  onToggleAnalysisContrastOption?: (option: ExportAnalysisContrastOption) => void;
  applicationPosterVariant?: ExportApplicationPosterVariant;
  onSetApplicationPosterVariant?: (variant: ExportApplicationPosterVariant) => void;
  applicationPosterTemplate?: ExportApplicationPosterTemplate;
  onSetApplicationPosterTemplate?: (variant: ExportApplicationPosterTemplate) => void;
  applicationArchitectureVariant?: ExportApplicationPosterVariant;
  onSetApplicationArchitectureVariant?: (variant: ExportApplicationPosterVariant) => void;
  applicationArchitectureTemplate?: ExportApplicationArchitectureTemplate;
  onSetApplicationArchitectureTemplate?: (variant: ExportApplicationArchitectureTemplate) => void;
  applicationArchitectureSceneOnly?: boolean;
  onToggleApplicationArchitectureSceneOnly?: () => void;
  applicationBrandingVariant?: ExportApplicationPosterVariant;
  onSetApplicationBrandingVariant?: (variant: ExportApplicationPosterVariant) => void;
  applicationBrandingTemplate?: ExportApplicationBrandingTemplate;
  onSetApplicationBrandingTemplate?: (template: ExportApplicationBrandingTemplate) => void;
  applicationBrandingSceneOnly?: boolean;
  onToggleApplicationBrandingSceneOnly?: () => void;
  visualScalePercent?: number;
  onBumpVisualScale?: (delta: number) => void;
  /** Alinear el bloque dentro del área útil de la hoja (opcional). */
  onAlignBlockInSheet?: (mode: ExportCanvasBlockSheetAlign) => void;
}) {
  const {
    sizePx,
    currentAlign,
    chrome,
    showTextControls = true,
    onBumpFont,
    onSetAlign,
    paletteCodeFormats = [],
    onTogglePaletteCodeFormat,
    analysisHarmonyOptions = [],
    onToggleAnalysisHarmonyOption,
    analysisTemperatureOptions = [],
    onToggleAnalysisTemperatureOption,
    analysisFocusOptions = [],
    onToggleAnalysisFocusOption,
    analysisLightnessOptions = [],
    onToggleAnalysisLightnessOption,
    analysisCvdOptions = [],
    onToggleAnalysisCvdOption,
    analysisContrastOptions = [],
    onToggleAnalysisContrastOption,
    applicationPosterVariant,
    onSetApplicationPosterVariant,
    applicationPosterTemplate,
    onSetApplicationPosterTemplate,
    applicationArchitectureVariant,
    onSetApplicationArchitectureVariant,
    applicationArchitectureTemplate,
    onSetApplicationArchitectureTemplate,
    applicationArchitectureSceneOnly = false,
    onToggleApplicationArchitectureSceneOnly,
    applicationBrandingVariant,
    onSetApplicationBrandingVariant,
    applicationBrandingTemplate,
    onSetApplicationBrandingTemplate,
    applicationBrandingSceneOnly = false,
    onToggleApplicationBrandingSceneOnly,
    visualScalePercent,
    onBumpVisualScale,
    onAlignBlockInSheet,
  } = props;
  const darkBar = chrome === 'onLightCanvas';
  const barClass = darkBar
    ? 'bg-gray-950/95 text-gray-100 shadow-md ring-2 ring-white/20'
    : 'bg-zinc-50/98 text-zinc-900 shadow-lg ring-2 ring-amber-400/45';
  const sepClass = darkBar ? 'border-white/20' : 'border-zinc-400/70';
  const chipIdle = darkBar
    ? 'border border-white/15 bg-gray-800 text-gray-100 hover:bg-gray-700'
    : 'border border-zinc-400/80 bg-white text-zinc-900 hover:bg-zinc-100';
  const alignIdle = darkBar
    ? 'border border-white/12 bg-gray-800 text-gray-100 hover:bg-gray-700'
    : 'border border-zinc-400/70 bg-zinc-100 text-zinc-900 hover:bg-zinc-200';
  const alignActive = 'border border-purple-500/80 bg-purple-600 text-white hover:bg-purple-500';
  const sizeLabelClass = darkBar ? 'text-gray-100' : 'text-zinc-800';

  return (
    <div
      data-export-handle
      onPointerDown={(e) => e.stopPropagation()}
      className={`pointer-events-auto flex w-full max-w-full shrink-0 flex-wrap items-center justify-center gap-1.5 rounded-md px-1.5 py-1 text-[10px] ${barClass}`}
    >
      {showTextControls && (
      <div data-export-handle className="flex shrink-0 items-center justify-center gap-0.5">
        <button
          type="button"
          data-export-handle
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded ${chipIdle}`}
          aria-label="Reducir tamaño de fuente"
          onClick={(e) => {
            e.stopPropagation();
            onBumpFont(-1);
          }}
        >
          −
        </button>
        <span
          data-export-handle
          className={`min-w-[2.5rem] text-center tabular-nums text-[10px] font-medium ${sizeLabelClass}`}
        >
          {sizePx}px
        </span>
        <button
          type="button"
          data-export-handle
          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded ${chipIdle}`}
          aria-label="Aumentar tamaño de fuente"
          onClick={(e) => {
            e.stopPropagation();
            onBumpFont(1);
          }}
        >
          +
        </button>
      </div>
      )}
      {showTextControls && (
      <div data-export-handle className={`flex shrink-0 items-center justify-center gap-0.5 border-l pl-1.5 ${sepClass}`}>
        {EXPORT_CANVAS_ALIGN_OPTIONS.map(({ align, ariaLabel }) => (
          <button
            key={align}
            type="button"
            data-export-handle
            aria-label={ariaLabel}
            title={ariaLabel}
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded ${
              currentAlign === align ? alignActive : alignIdle
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onSetAlign(align);
            }}
          >
            <ExportCanvasAlignIcon align={align} />
          </button>
        ))}
      </div>
      )}
      {onAlignBlockInSheet && (
        <div
          data-export-handle
          className={`flex shrink-0 items-center justify-center gap-0.5 ${showTextControls ? `border-l pl-1.5 ${sepClass}` : ''}`}
        >
          <span className="sr-only">Posición del bloque en la hoja</span>
          {EXPORT_CANVAS_SHEET_POSITION_OPTIONS.map(({ mode, ariaLabel }) => (
            <button
              key={mode}
              type="button"
              data-export-handle
              aria-label={ariaLabel}
              title={ariaLabel}
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded ${alignIdle}`}
              onClick={(e) => {
                e.stopPropagation();
                onAlignBlockInSheet(mode);
              }}
            >
              <ExportCanvasBlockSheetAlignIcon mode={mode} />
            </button>
          ))}
        </div>
      )}
      {onTogglePaletteCodeFormat && (
        <div
          data-export-handle
          className={`flex shrink-0 items-center justify-center gap-0.5 ${showTextControls || onAlignBlockInSheet ? `border-l pl-1.5 ${sepClass}` : ''}`}
        >
          {EXPORT_PALETTE_CODE_FORMAT_OPTIONS.map(({ format, label, ariaLabel }) => (
            <button
              key={format}
              type="button"
              data-export-handle
              aria-label={ariaLabel}
              title={ariaLabel}
              className={`flex h-5 shrink-0 items-center justify-center rounded px-1.5 text-[9px] font-semibold ${
                paletteCodeFormats.includes(format) ? alignActive : alignIdle
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onTogglePaletteCodeFormat(format);
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}
      {onToggleAnalysisHarmonyOption && (
        <div
          data-export-handle
          className={`flex max-w-full flex-wrap items-center justify-center gap-0.5 ${
            showTextControls || onAlignBlockInSheet || onTogglePaletteCodeFormat ? `border-l pl-1.5 ${sepClass}` : ''
          }`}
        >
          {EXPORT_ANALYSIS_HARMONY_OPTIONS.map(({ option, label, ariaLabel }) => (
            <button
              key={option}
              type="button"
              data-export-handle
              aria-label={ariaLabel}
              title={ariaLabel}
              className={`flex h-5 shrink-0 items-center justify-center rounded px-1.5 text-[9px] font-semibold ${
                analysisHarmonyOptions.includes(option) ? alignActive : alignIdle
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleAnalysisHarmonyOption(option);
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}
      {onToggleAnalysisTemperatureOption && (
        <div
          data-export-handle
          className={`flex max-w-full flex-wrap items-center justify-center gap-0.5 ${
            showTextControls || onAlignBlockInSheet || onTogglePaletteCodeFormat || onToggleAnalysisHarmonyOption
              ? `border-l pl-1.5 ${sepClass}`
              : ''
          }`}
        >
          {EXPORT_ANALYSIS_TEMPERATURE_OPTIONS.map(({ option, label, ariaLabel }) => (
            <button
              key={option}
              type="button"
              data-export-handle
              aria-label={ariaLabel}
              title={ariaLabel}
              className={`flex h-5 shrink-0 items-center justify-center rounded px-1.5 text-[9px] font-semibold ${
                analysisTemperatureOptions.includes(option) ? alignActive : alignIdle
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleAnalysisTemperatureOption(option);
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}
      {onToggleAnalysisFocusOption && (
        <div
          data-export-handle
          className={`flex max-w-full flex-wrap items-center justify-center gap-0.5 ${
            showTextControls ||
            onAlignBlockInSheet ||
            onTogglePaletteCodeFormat ||
            onToggleAnalysisHarmonyOption ||
            onToggleAnalysisTemperatureOption
              ? `border-l pl-1.5 ${sepClass}`
              : ''
          }`}
        >
          {EXPORT_ANALYSIS_FOCUS_OPTIONS.map(({ option, label, ariaLabel }) => (
            <button
              key={option}
              type="button"
              data-export-handle
              aria-label={ariaLabel}
              title={ariaLabel}
              className={`flex h-5 shrink-0 items-center justify-center rounded px-1.5 text-[9px] font-semibold ${
                analysisFocusOptions.includes(option) ? alignActive : alignIdle
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleAnalysisFocusOption(option);
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}
      {onToggleAnalysisLightnessOption && (
        <div
          data-export-handle
          className={`flex max-w-full flex-wrap items-center justify-center gap-0.5 ${
            showTextControls ||
            onAlignBlockInSheet ||
            onTogglePaletteCodeFormat ||
            onToggleAnalysisHarmonyOption ||
            onToggleAnalysisTemperatureOption ||
            onToggleAnalysisFocusOption
              ? `border-l pl-1.5 ${sepClass}`
              : ''
          }`}
        >
          {EXPORT_ANALYSIS_LIGHTNESS_OPTIONS.map(({ option, label, ariaLabel }) => (
            <button
              key={option}
              type="button"
              data-export-handle
              aria-label={ariaLabel}
              title={ariaLabel}
              className={`flex h-5 shrink-0 items-center justify-center rounded px-1.5 text-[9px] font-semibold ${
                analysisLightnessOptions.includes(option) ? alignActive : alignIdle
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleAnalysisLightnessOption(option);
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}
      {onToggleAnalysisCvdOption && (
        <div
          data-export-handle
          className={`flex max-w-full flex-wrap items-center justify-center gap-0.5 ${
            showTextControls ||
            onAlignBlockInSheet ||
            onTogglePaletteCodeFormat ||
            onToggleAnalysisHarmonyOption ||
            onToggleAnalysisTemperatureOption ||
            onToggleAnalysisFocusOption ||
            onToggleAnalysisLightnessOption
              ? `border-l pl-1.5 ${sepClass}`
              : ''
          }`}
        >
          {EXPORT_ANALYSIS_CVD_OPTIONS.map(({ option, label, ariaLabel }) => (
            <button
              key={option}
              type="button"
              data-export-handle
              aria-label={ariaLabel}
              title={ariaLabel}
              className={`flex h-5 shrink-0 items-center justify-center rounded px-1.5 text-[9px] font-semibold ${
                analysisCvdOptions.includes(option) ? alignActive : alignIdle
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleAnalysisCvdOption(option);
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}
      {onToggleAnalysisContrastOption && (
        <div
          data-export-handle
          className={`flex max-w-full flex-wrap items-center justify-center gap-0.5 ${
            showTextControls ||
            onAlignBlockInSheet ||
            onTogglePaletteCodeFormat ||
            onToggleAnalysisHarmonyOption ||
            onToggleAnalysisTemperatureOption ||
            onToggleAnalysisFocusOption ||
            onToggleAnalysisLightnessOption ||
            onToggleAnalysisCvdOption
              ? `border-l pl-1.5 ${sepClass}`
              : ''
          }`}
        >
          {EXPORT_ANALYSIS_CONTRAST_OPTIONS.map(({ option, label, ariaLabel }) => (
            <button
              key={option}
              type="button"
              data-export-handle
              aria-label={ariaLabel}
              title={ariaLabel}
              className={`flex h-5 shrink-0 items-center justify-center rounded px-1.5 text-[9px] font-semibold ${
                analysisContrastOptions.includes(option) ? alignActive : alignIdle
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onToggleAnalysisContrastOption(option);
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}
      {onSetApplicationPosterVariant && (
        <div
          data-export-handle
          className={`flex max-w-full flex-wrap items-center justify-center gap-0.5 ${
            showTextControls ||
            onAlignBlockInSheet ||
            onTogglePaletteCodeFormat ||
            onToggleAnalysisHarmonyOption ||
            onToggleAnalysisTemperatureOption ||
            onToggleAnalysisFocusOption ||
            onToggleAnalysisLightnessOption ||
            onToggleAnalysisCvdOption ||
            onToggleAnalysisContrastOption
              ? `border-l pl-1.5 ${sepClass}`
              : ''
          }`}
        >
          {(['claro', 'oscuro'] as const).map((variant) => (
            <button
              key={variant}
              type="button"
              data-export-handle
              aria-label={`Mostrar versión ${variant} del poster`}
              title={`Poster ${variant}`}
              className={`flex h-5 shrink-0 items-center justify-center rounded px-1.5 text-[9px] font-semibold ${
                applicationPosterVariant === variant ? alignActive : alignIdle
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onSetApplicationPosterVariant(variant);
              }}
            >
              {variant === 'claro' ? 'Claro' : 'Oscuro'}
            </button>
          ))}
        </div>
      )}
      {onSetApplicationPosterTemplate && (
        <div
          data-export-handle
          className={`flex max-w-full flex-wrap items-center justify-center gap-0.5 ${
            showTextControls ||
            onAlignBlockInSheet ||
            onTogglePaletteCodeFormat ||
            onToggleAnalysisHarmonyOption ||
            onToggleAnalysisTemperatureOption ||
            onToggleAnalysisFocusOption ||
            onToggleAnalysisLightnessOption ||
            onToggleAnalysisCvdOption ||
            onToggleAnalysisContrastOption ||
            onSetApplicationPosterVariant
              ? `border-l pl-1.5 ${sepClass}`
              : ''
          }`}
        >
          {EXPORT_APPLICATION_POSTER_TEMPLATE_OPTIONS.map(({ option, label, ariaLabel }) => (
            <button
              key={option}
              type="button"
              data-export-handle
              aria-label={ariaLabel}
              title={ariaLabel}
              className={`flex h-5 shrink-0 items-center justify-center rounded px-1.5 text-[9px] font-semibold ${
                applicationPosterTemplate === option ? alignActive : alignIdle
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onSetApplicationPosterTemplate(option);
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}
      {onSetApplicationArchitectureVariant && (
        <div
          data-export-handle
          className={`flex max-w-full flex-wrap items-center justify-center gap-0.5 ${
            showTextControls ||
            onAlignBlockInSheet ||
            onTogglePaletteCodeFormat ||
            onToggleAnalysisHarmonyOption ||
            onToggleAnalysisTemperatureOption ||
            onToggleAnalysisFocusOption ||
            onToggleAnalysisLightnessOption ||
            onToggleAnalysisCvdOption ||
            onToggleAnalysisContrastOption ||
            onSetApplicationPosterVariant ||
            onSetApplicationPosterTemplate
              ? `border-l pl-1.5 ${sepClass}`
              : ''
          }`}
        >
          {(['claro', 'oscuro'] as const).map((variant) => (
            <button
              key={`arch-${variant}`}
              type="button"
              data-export-handle
              aria-label={`Mostrar versión ${variant} de arquitectura`}
              title={`Arquitectura ${variant}`}
              className={`flex h-5 shrink-0 items-center justify-center rounded px-1.5 text-[9px] font-semibold ${
                applicationArchitectureVariant === variant ? alignActive : alignIdle
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onSetApplicationArchitectureVariant(variant);
              }}
            >
              {variant === 'claro' ? 'Claro' : 'Oscuro'}
            </button>
          ))}
        </div>
      )}
      {onSetApplicationArchitectureTemplate && (
        <div
          data-export-handle
          className={`flex max-w-full flex-wrap items-center justify-center gap-0.5 ${
            showTextControls ||
            onAlignBlockInSheet ||
            onTogglePaletteCodeFormat ||
            onToggleAnalysisHarmonyOption ||
            onToggleAnalysisTemperatureOption ||
            onToggleAnalysisFocusOption ||
            onToggleAnalysisLightnessOption ||
            onToggleAnalysisCvdOption ||
            onToggleAnalysisContrastOption ||
            onSetApplicationPosterVariant ||
            onSetApplicationPosterTemplate ||
            onSetApplicationArchitectureVariant
              ? `border-l pl-1.5 ${sepClass}`
              : ''
          }`}
        >
          {EXPORT_APPLICATION_ARCHITECTURE_TEMPLATE_OPTIONS.map(({ option, label, ariaLabel }) => (
            <button
              key={option}
              type="button"
              data-export-handle
              aria-label={ariaLabel}
              title={ariaLabel}
              className={`flex h-5 shrink-0 items-center justify-center rounded px-1.5 text-[9px] font-semibold ${
                applicationArchitectureTemplate === option ? alignActive : alignIdle
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onSetApplicationArchitectureTemplate(option);
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}
      {onToggleApplicationArchitectureSceneOnly && (
        <div
          data-export-handle
          className={`flex max-w-full flex-wrap items-center justify-center gap-0.5 ${
            showTextControls ||
            onAlignBlockInSheet ||
            onTogglePaletteCodeFormat ||
            onToggleAnalysisHarmonyOption ||
            onToggleAnalysisTemperatureOption ||
            onToggleAnalysisFocusOption ||
            onToggleAnalysisLightnessOption ||
            onToggleAnalysisCvdOption ||
            onToggleAnalysisContrastOption ||
            onSetApplicationPosterVariant ||
            onSetApplicationPosterTemplate ||
            onSetApplicationArchitectureVariant ||
            onSetApplicationArchitectureTemplate
              ? `border-l pl-1.5 ${sepClass}`
              : ''
          }`}
        >
          <button
            type="button"
            data-export-handle
            aria-label="Mostrar solo la ilustración de la escena"
            title="Solo escena: oculta cabecera, paleta de materiales y especificaciones"
            className={`flex h-5 shrink-0 items-center justify-center rounded px-1.5 text-[9px] font-semibold ${
              applicationArchitectureSceneOnly ? alignActive : alignIdle
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleApplicationArchitectureSceneOnly();
            }}
          >
            Solo escena
          </button>
        </div>
      )}
      {onSetApplicationBrandingVariant && (
        <div
          data-export-handle
          className={`flex max-w-full flex-wrap items-center justify-center gap-0.5 ${
            showTextControls ||
            onAlignBlockInSheet ||
            onTogglePaletteCodeFormat ||
            onToggleAnalysisHarmonyOption ||
            onToggleAnalysisTemperatureOption ||
            onToggleAnalysisFocusOption ||
            onToggleAnalysisLightnessOption ||
            onToggleAnalysisCvdOption ||
            onToggleAnalysisContrastOption ||
            onSetApplicationPosterVariant ||
            onSetApplicationPosterTemplate ||
            onSetApplicationArchitectureVariant ||
            onSetApplicationArchitectureTemplate ||
            onToggleApplicationArchitectureSceneOnly ||
            onToggleApplicationBrandingSceneOnly
              ? `border-l pl-1.5 ${sepClass}`
              : ''
          }`}
        >
          {(['claro', 'oscuro'] as const).map((variant) => (
            <button
              key={`brand-${variant}`}
              type="button"
              data-export-handle
              aria-label={`Mostrar versión ${variant} de branding`}
              title={`Branding ${variant}`}
              className={`flex h-5 shrink-0 items-center justify-center rounded px-1.5 text-[9px] font-semibold ${
                applicationBrandingVariant === variant ? alignActive : alignIdle
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onSetApplicationBrandingVariant(variant);
              }}
            >
              {variant === 'claro' ? 'Claro' : 'Oscuro'}
            </button>
          ))}
        </div>
      )}
      {onSetApplicationBrandingTemplate && (
        <div
          data-export-handle
          className={`flex max-w-full flex-wrap items-center justify-center gap-0.5 ${
            showTextControls ||
            onAlignBlockInSheet ||
            onTogglePaletteCodeFormat ||
            onToggleAnalysisHarmonyOption ||
            onToggleAnalysisTemperatureOption ||
            onToggleAnalysisFocusOption ||
            onToggleAnalysisLightnessOption ||
            onToggleAnalysisCvdOption ||
            onToggleAnalysisContrastOption ||
            onSetApplicationPosterVariant ||
            onSetApplicationPosterTemplate ||
            onSetApplicationArchitectureVariant ||
            onSetApplicationArchitectureTemplate ||
            onToggleApplicationArchitectureSceneOnly ||
            onSetApplicationBrandingVariant ||
            onToggleApplicationBrandingSceneOnly
              ? `border-l pl-1.5 ${sepClass}`
              : ''
          }`}
        >
          {EXPORT_APPLICATION_BRANDING_TEMPLATE_OPTIONS.map(({ option, label, ariaLabel }) => (
            <button
              key={option}
              type="button"
              data-export-handle
              aria-label={ariaLabel}
              title={ariaLabel}
              className={`flex h-5 shrink-0 items-center justify-center rounded px-1.5 text-[9px] font-semibold ${
                applicationBrandingTemplate === option ? alignActive : alignIdle
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onSetApplicationBrandingTemplate(option);
              }}
            >
              {label}
            </button>
          ))}
        </div>
      )}
      {onToggleApplicationBrandingSceneOnly && (
        <div
          data-export-handle
          className={`flex max-w-full flex-wrap items-center justify-center gap-0.5 ${
            showTextControls ||
            onAlignBlockInSheet ||
            onTogglePaletteCodeFormat ||
            onToggleAnalysisHarmonyOption ||
            onToggleAnalysisTemperatureOption ||
            onToggleAnalysisFocusOption ||
            onToggleAnalysisLightnessOption ||
            onToggleAnalysisCvdOption ||
            onToggleAnalysisContrastOption ||
            onSetApplicationPosterVariant ||
            onSetApplicationPosterTemplate ||
            onSetApplicationArchitectureVariant ||
            onSetApplicationArchitectureTemplate ||
            onToggleApplicationArchitectureSceneOnly ||
            onSetApplicationBrandingVariant ||
            onSetApplicationBrandingTemplate
              ? `border-l pl-1.5 ${sepClass}`
              : ''
          }`}
        >
          <button
            type="button"
            data-export-handle
            aria-label="Mostrar solo el arte de la escena (sin marco de hoja ni bloques de texto)"
            title="Solo escena: oculta cabecera de marca, leyendas, especificaciones y pie de hoja"
            className={`flex h-5 shrink-0 items-center justify-center rounded px-1.5 text-[9px] font-semibold ${
              applicationBrandingSceneOnly ? alignActive : alignIdle
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleApplicationBrandingSceneOnly();
            }}
          >
            Solo escena
          </button>
        </div>
      )}
      {typeof visualScalePercent === 'number' && onBumpVisualScale && (
        <div
          data-export-handle
          className={`flex shrink-0 items-center justify-center gap-0.5 ${
            showTextControls ||
            onAlignBlockInSheet ||
            onTogglePaletteCodeFormat ||
            onToggleAnalysisHarmonyOption ||
            onToggleAnalysisTemperatureOption ||
            onToggleAnalysisFocusOption ||
            onToggleAnalysisLightnessOption ||
            onToggleAnalysisCvdOption ||
            onToggleAnalysisContrastOption ||
            onSetApplicationPosterVariant ||
            onSetApplicationPosterTemplate ||
            onSetApplicationArchitectureVariant ||
            onSetApplicationArchitectureTemplate ||
            onToggleApplicationArchitectureSceneOnly ||
            onSetApplicationBrandingVariant ||
            onSetApplicationBrandingTemplate ||
            onToggleApplicationBrandingSceneOnly
              ? `border-l pl-1.5 ${sepClass}`
              : ''
          }`}
        >
          <button
            type="button"
            data-export-handle
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded ${chipIdle}`}
            aria-label="Reducir tamaño de visualización"
            onClick={(e) => {
              e.stopPropagation();
              onBumpVisualScale(-5);
            }}
          >
            −
          </button>
          <span
            data-export-handle
            className={`min-w-[2.6rem] text-center tabular-nums text-[10px] font-medium ${sizeLabelClass}`}
          >
            {visualScalePercent}%
          </span>
          <button
            type="button"
            data-export-handle
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded ${chipIdle}`}
            aria-label="Aumentar tamaño de visualización"
            onClick={(e) => {
              e.stopPropagation();
              onBumpVisualScale(5);
            }}
          >
            +
          </button>
        </div>
      )}
    </div>
  );
}

function clampExportCanvas(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n));
}

function hexToRgbChannels(hex: string): { r: number; g: number; b: number } | null {
  const cleaned = hex.trim().replace('#', '');
  if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(cleaned)) return null;
  const normalized =
    cleaned.length === 3
      ? cleaned
          .split('')
          .map((ch) => ch + ch)
          .join('')
      : cleaned;
  const num = Number.parseInt(normalized, 16);
  if (Number.isNaN(num)) return null;
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

function formatPaletteColorCode(hex: string, format: ExportPaletteCodeFormat): string {
  if (format === 'hex') return hex.toUpperCase();
  if (format === 'rgb') {
    const rgb = hexToRgbChannels(hex);
    if (!rgb) return hex.toUpperCase();
    return `(${rgb.r},${rgb.g},${rgb.b})`;
  }
  const hsl = hexToHsl(hex);
  return `(${Math.round(hsl.h)} ${Math.round(hsl.s)}% ${Math.round(hsl.l)}%)`;
}

function getCanvasPaletteCodeFormats(item: ExportCanvasItem): ExportPaletteCodeFormat[] {
  const current = item.paletteCodeFormats;
  if (Array.isArray(current)) {
    return current.filter((f): f is ExportPaletteCodeFormat => f === 'hex' || f === 'rgb' || f === 'hsl');
  }
  // Compatibilidad con estado persistido antiguo (monoselección).
  const legacy = (item as ExportCanvasItem & { paletteCodeFormat?: unknown }).paletteCodeFormat;
  if (legacy === 'hex' || legacy === 'rgb' || legacy === 'hsl') return [legacy];
  return [];
}

function getCanvasAnalysisHarmonyOptions(item: ExportCanvasItem): ExportAnalysisHarmonyOption[] {
  const current = item.analysisHarmonyOptions;
  if (Array.isArray(current)) {
    return current.filter(
      (opt): opt is ExportAnalysisHarmonyOption =>
        opt === 'tone-wheel' || opt === 'type' || opt === 'tone-spectrum' || opt === 'degrees',
    );
  }
  return [];
}

function getCanvasAnalysisTemperatureOptions(item: ExportCanvasItem): ExportAnalysisTemperatureOption[] {
  const current = item.analysisTemperatureOptions;
  if (Array.isArray(current)) {
    return current.filter(
      (opt): opt is ExportAnalysisTemperatureOption =>
        opt === 'landscape' || opt === 'distribution' || opt === 'distribution-percent',
    );
  }
  return [];
}

function getCanvasAnalysisFocusOptions(item: ExportCanvasItem): ExportAnalysisFocusOption[] {
  const current = item.analysisFocusOptions;
  if (Array.isArray(current)) {
    return current.filter(
      (opt): opt is ExportAnalysisFocusOption =>
        opt === 'energy' || opt === 'distribution' || opt === 'distribution-percent',
    );
  }
  return [];
}

function getCanvasAnalysisLightnessOptions(item: ExportCanvasItem): ExportAnalysisLightnessOption[] {
  const current = item.analysisLightnessOptions;
  if (Array.isArray(current)) {
    return current.filter(
      (opt): opt is ExportAnalysisLightnessOption =>
        opt === 'stair' || opt === 'coverage' || opt === 'grayscale',
    );
  }
  return [];
}

function getCanvasAnalysisCvdOptions(item: ExportCanvasItem): ExportAnalysisCvdOption[] {
  const current = item.analysisCvdOptions;
  if (Array.isArray(current)) {
    return current.filter(
      (opt): opt is ExportAnalysisCvdOption =>
        opt === 'original' ||
        opt === 'protanopia' ||
        opt === 'deuteranopia' ||
        opt === 'tritanopia' ||
        opt === 'achromatopsia',
    );
  }
  return [];
}

function getCanvasAnalysisContrastOptions(item: ExportCanvasItem): ExportAnalysisContrastOption[] {
  const current = item.analysisContrastOptions;
  if (Array.isArray(current)) {
    return current.filter(
      (opt): opt is ExportAnalysisContrastOption => opt === 'wcag' || opt === 'proximity',
    );
  }
  return [];
}

function getCanvasApplicationPosterVariant(item: ExportCanvasItem): ExportApplicationPosterVariant {
  return item.applicationPosterVariant === 'oscuro' ? 'oscuro' : 'claro';
}

function getCanvasApplicationPosterTemplate(item: ExportCanvasItem): ExportApplicationPosterTemplate {
  const current = item.applicationPosterTemplate;
  return current === 'conference' ||
    current === 'exhibition-swiss' ||
    current === 'festival-gig' ||
    current === 'collage' ||
    current === 'competition'
    ? current
    : 'conference';
}

function getCanvasApplicationArchitectureVariant(item: ExportCanvasItem): ExportApplicationPosterVariant {
  return item.applicationArchitectureVariant === 'oscuro' ? 'oscuro' : 'claro';
}

function getCanvasApplicationArchitectureTemplate(item: ExportCanvasItem): ExportApplicationArchitectureTemplate {
  const current = item.applicationArchitectureTemplate;
  return current === 'estudio' ||
    current === 'cafeteria' ||
    current === 'oficina' ||
    current === 'stand' ||
    current === 'fachada'
    ? current
    : 'estudio';
}

function getCanvasApplicationBrandingVariant(item: ExportCanvasItem): ExportApplicationPosterVariant {
  return item.applicationBrandingVariant === 'oscuro' ? 'oscuro' : 'claro';
}

function getCanvasApplicationBrandingTemplate(item: ExportCanvasItem): ExportApplicationBrandingTemplate {
  const current = item.applicationBrandingTemplate;
  return EXPORT_APPLICATION_BRANDING_TEMPLATE_OPTIONS.some((o) => o.option === current)
    ? (current as ExportApplicationBrandingTemplate)
    : 'territorio-visual';
}

type ExportWcagCombo = {
  id: string;
  fgRole: string;
  bgRole: string;
  title: string;
  ratio: number;
  fgHex: string;
  bgHex: string;
  scoreLabel: 'AAA' | 'AA' | 'AA grande' | 'Bajo';
};

function getExportWcagCombos(roleHexMap: Record<string, string>): ExportWcagCombo[] {
  const defaults = [
    { fgRole: 'T', bgRole: 'F', title: 'Texto principal sobre Fondo' },
    { fgRole: 'P', bgRole: 'F', title: 'Primario sobre Fondo' },
    { fgRole: 'S', bgRole: 'P', title: 'Secundario sobre Primario' },
    { fgRole: 'A', bgRole: 'P', title: 'Acento sobre Primario' },
  ];

  const roles = Object.keys(roleHexMap);
  const candidates: { fgRole: string; bgRole: string; ratio: number }[] = [];
  for (const fgRole of roles) {
    for (const bgRole of roles) {
      if (fgRole === bgRole) continue;
      const fgHex = roleHexMap[fgRole];
      const bgHex = roleHexMap[bgRole];
      if (!fgHex || !bgHex) continue;
      candidates.push({ fgRole, bgRole, ratio: getContrastRatioHex(fgHex, bgHex) });
    }
  }
  candidates.sort((a, b) => b.ratio - a.ratio);

  const selected: { fgRole: string; bgRole: string; ratio: number }[] = [];
  const usedBg = new Set<string>();
  for (const c of candidates.filter((c) => c.ratio >= 4.5)) {
    if (selected.length >= 4) break;
    if (!usedBg.has(c.bgRole)) {
      selected.push(c);
      usedBg.add(c.bgRole);
    }
  }
  if (selected.length < 4) {
    for (const c of candidates) {
      if (selected.length >= 4) break;
      if (!selected.some((s) => s.fgRole === c.fgRole && s.bgRole === c.bgRole)) selected.push(c);
    }
  }

  const fallback = defaults
    .map((d) => {
      const fgHex = roleHexMap[d.fgRole];
      const bgHex = roleHexMap[d.bgRole];
      if (!fgHex || !bgHex) return null;
      return {
        id: `${d.fgRole}->${d.bgRole}`,
        fgRole: d.fgRole,
        bgRole: d.bgRole,
        title: d.title,
        ratio: getContrastRatioHex(fgHex, bgHex),
        fgHex,
        bgHex,
      };
    })
    .filter((x): x is NonNullable<typeof x> => Boolean(x));

  const base = selected.length
    ? selected.map((s) => {
        const fgHex = roleHexMap[s.fgRole];
        const bgHex = roleHexMap[s.bgRole];
        return {
          id: `${s.fgRole}->${s.bgRole}`,
          fgRole: s.fgRole,
          bgRole: s.bgRole,
          title: `${s.fgRole} sobre ${s.bgRole}`,
          ratio: s.ratio,
          fgHex,
          bgHex,
        };
      })
    : fallback;

  return base
    .filter((r): r is Omit<ExportWcagCombo, 'scoreLabel'> => Boolean(r.fgHex && r.bgHex))
    .map((r) => ({
      ...r,
      scoreLabel: r.ratio >= 7 ? 'AAA' : r.ratio >= 4.5 ? 'AA' : r.ratio >= 3 ? 'AA grande' : 'Bajo',
    }));
}

function buildExportTemperatureAtmosphere(hexes: string[], avgWC: number) {
  if (!hexes.length) {
    return {
      c1: '#334155',
      c2: '#475569',
      c3: '#64748b',
      sun: '#94a3b8',
      auraRgb: '148, 163, 184',
      tag: 'Sin muestras',
      darkHex: '#1e293b',
    };
  }
  const sortedByWC = [...hexes].sort((a, b) => warmCoolFromHex(b) - warmCoolFromHex(a));
  const mid = sortedByWC[Math.floor(sortedByWC.length / 2)] ?? sortedByWC[0];
  const darkest = hexes.reduce((best, h) => (hexToHsl(h).l < hexToHsl(best).l ? h : best), hexes[0]);
  const rgb = hexToRgbChannels(sortedByWC[0] ?? '#94a3b8') ?? { r: 148, g: 163, b: 184 };

  if (avgWC > 0.5) {
    return {
      c1: sortedByWC[0],
      c2: mid,
      c3: sortedByWC[sortedByWC.length - 1],
      sun: sortedByWC[1] ?? sortedByWC[0],
      auraRgb: `${rgb.r}, ${rgb.g}, ${rgb.b}`,
      tag: 'Atardecer cálido',
      darkHex: darkest,
    };
  }
  if (avgWC < -0.5) {
    const cold = sortedByWC[sortedByWC.length - 1];
    const rgbCold = hexToRgbChannels(cold) ?? rgb;
    return {
      c1: cold,
      c2: mid,
      c3: sortedByWC[0],
      sun: sortedByWC[sortedByWC.length - 2] ?? cold,
      auraRgb: `${rgbCold.r}, ${rgbCold.g}, ${rgbCold.b}`,
      tag: 'Atmósfera fría',
      darkHex: darkest,
    };
  }

  return {
    c1: sortedByWC[0],
    c2: mid,
    c3: sortedByWC[sortedByWC.length - 1],
    sun: mid,
    auraRgb: `${rgb.r}, ${rgb.g}, ${rgb.b}`,
    tag: 'Atmósfera equilibrada',
    darkHex: darkest,
  };
}

function detectHarmonyLabel(hexes: string[]): string {
  if (hexes.length <= 1) return 'Monocromática';
  const hues = hexes.map((h) => Math.round(hexToHsl(h).h));
  const sorted = [...hues].sort((a, b) => a - b);
  const gaps: number[] = [];
  for (let i = 0; i < sorted.length; i++) {
    const cur = sorted[i];
    const nxt = sorted[(i + 1) % sorted.length] + (i + 1 === sorted.length ? 360 : 0);
    gaps.push(nxt - cur);
  }
  const maxGap = Math.max(...gaps);
  const spread = 360 - maxGap;
  const near = (a: number, b: number, tol: number) => Math.abs(a - b) <= tol;

  if (hexes.length === 2) {
    const delta = Math.min(Math.abs(hues[0] - hues[1]), 360 - Math.abs(hues[0] - hues[1]));
    if (near(delta, 180, 18)) return 'Complementaria';
  }
  if (hexes.length === 3) {
    const tri = gaps.every((g) => near(g, 120, 22));
    if (tri) return 'Triádica';
  }
  if (hexes.length >= 4 && spread > 150 && spread < 260) return 'Tetrádica';
  if (spread <= 60) return 'Análoga';
  return 'Compuesta';
}

function harmonyWheelMarkerPosition(h: number): { left: string; top: string } {
  const angle = ((h - 90) * Math.PI) / 180;
  const radius = 42;
  const x = 50 + Math.cos(angle) * radius;
  const y = 50 + Math.sin(angle) * radius;
  return { left: `${x}%`, top: `${y}%` };
}

/** Espacio mínimo bajo el bloque (px lógicos de la hoja) para mostrar el footer debajo sin recortes. */
const EXPORT_CANVAS_FOOTER_CLEARANCE_PX = 76;

/** Ancho de layout del HUD para que, tras `scale(1/fit)`, coincida con el ancho del bloque (marco). */
function getExportSelectionFooterHudLayoutStyle(blockWidthPx: number, fit: number): React.CSSProperties {
  const inv = fit > 0.001 ? 1 / fit : 1;
  if (Math.abs(inv - 1) <= 0.001) {
    return { width: '100%', maxWidth: '100%', boxSizing: 'border-box' };
  }
  const wPx = blockWidthPx / inv;
  return { width: wPx, maxWidth: wPx, boxSizing: 'border-box' };
}

function getExportSelectionFooterHudStyle(
  fit: number,
  pinFooterAbove: boolean,
  spaceBelowSheet: number,
): React.CSSProperties {
  const inv = fit > 0.001 ? 1 / fit : 1;
  if (Math.abs(inv - 1) <= 0.001) return {};
  const tightBelow =
    !pinFooterAbove && spaceBelowSheet < EXPORT_CANVAS_FOOTER_CLEARANCE_PX;
  return {
    transform: `scale(${inv})`,
    transformOrigin: pinFooterAbove || tightBelow ? 'bottom left' : 'top left',
  };
}

/**
 * Tipografía del bloque «Título» en px/em explícitos: html2canvas suele desviarse con padding/márgenes en rem
 * solo por clases Tailwind; así la captura coincide con la vista previa.
 */
const EXPORT_TITLE_FONT_STACK =
  'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif';
const EXPORT_TITLE_TEXT_INSET_PX = { left: 8, right: 8, top: 10, bottom: 8 } as const;
const EXPORT_TITLE_SUB_MARGIN_TOP_PX = 4;
const EXPORT_TITLE_SUB_FONT_PX = 10;
const EXPORT_TITLE_SUB_LINE_HEIGHT_PX = 14;

/** Tamaños que caben en la altura del bloque (padding + 2 líneas); evita overflow que en html2canvas parece texto «hundido». */
function getExportTitleTextMetrics(blockHeightPx: number) {
  const { left: pl, right: pr, top: pt, bottom: pb } = EXPORT_TITLE_TEXT_INSET_PX;
  const innerH = Math.max(0, blockHeightPx - pt - pb);
  const subStack = EXPORT_TITLE_SUB_MARGIN_TOP_PX + EXPORT_TITLE_SUB_LINE_HEIGHT_PX;
  const safety = 3;

  let fs = clampExportCanvas(Math.floor(blockHeightPx * 0.36), 11, 44);
  for (let i = 0; i < 48; i++) {
    const titleLH = Math.max(
      Math.ceil(fs * 1.12),
      Math.min(Math.round(fs * 1.3), Math.max(innerH - subStack - safety, fs + 2)),
    );
    const used = pt + pb + titleLH + subStack;
    if (used <= blockHeightPx && titleLH >= fs) {
      return {
        fs,
        titleLineHeightPx: titleLH,
        subLineHeightPx: EXPORT_TITLE_SUB_LINE_HEIGHT_PX,
        subFontPx: EXPORT_TITLE_SUB_FONT_PX,
        pl,
        pr,
        pt,
        pb,
      };
    }
    fs -= 1;
    if (fs < 11) break;
  }
  const fs0 = 11;
  const titleLH0 = Math.max(
    fs0 + 2,
    Math.min(16, Math.max(0, innerH - subStack - safety)),
  );
  return {
    fs: fs0,
    titleLineHeightPx: titleLH0,
    subLineHeightPx: EXPORT_TITLE_SUB_LINE_HEIGHT_PX,
    subFontPx: EXPORT_TITLE_SUB_FONT_PX,
    pl,
    pr,
    pt,
    pb,
  };
}

const EXPORT_BODY_TEXT_INSET_PX = { left: 10, right: 10, top: 10, bottom: 10 } as const;

/** Tipografía cuerpo de texto libre (una columna, multilínea con pre-wrap). */
function getExportBodyTextMetrics(blockHeightPx: number) {
  const { left: pl, right: pr, top: pt, bottom: pb } = EXPORT_BODY_TEXT_INSET_PX;
  const innerH = Math.max(0, blockHeightPx - pt - pb);
  const safety = 4;

  let fs = clampExportCanvas(Math.floor(innerH / 7), 10, 17);
  for (let i = 0; i < 28; i++) {
    const lineH = Math.max(
      Math.ceil(fs * 1.18),
      Math.min(Math.round(fs * 1.48), Math.max(innerH - safety, fs + 4)),
    );
    if (pt + pb + lineH <= blockHeightPx && lineH >= fs) {
      return { fs, lineHeightPx: lineH, pl, pr, pt, pb };
    }
    fs -= 1;
    if (fs < 9) break;
  }
  const fs0 = 10;
  const lineH0 = Math.max(fs0 + 4, Math.min(18, Math.max(0, innerH - safety)));
  return { fs: fs0, lineHeightPx: lineH0, pl, pr, pt, pb };
}

/** Máxima fs que cabe en un bloque «Título» (título + subtítulo). */
function clampTitleFontForBlock(blockHeightPx: number, desiredFs: number): number {
  let f = clampExportCanvas(Math.round(desiredFs), 8, 56);
  const { top: pt, bottom: pb } = EXPORT_TITLE_TEXT_INSET_PX;
  const innerH = Math.max(0, blockHeightPx - pt - pb);
  const subStack = EXPORT_TITLE_SUB_MARGIN_TOP_PX + EXPORT_TITLE_SUB_LINE_HEIGHT_PX;
  const safety = 3;
  for (let i = 0; i < 56; i++) {
    const titleLH = Math.max(
      Math.ceil(f * 1.12),
      Math.min(Math.round(f * 1.3), Math.max(innerH - subStack - safety, f + 2)),
    );
    if (pt + pb + titleLH + subStack <= blockHeightPx && titleLH >= f) return f;
    f -= 1;
  }
  return 8;
}

function titleLineHeightForBlock(blockHeightPx: number, fs: number): number {
  const { top: pt, bottom: pb } = EXPORT_TITLE_TEXT_INSET_PX;
  const innerH = Math.max(0, blockHeightPx - pt - pb);
  const subStack = EXPORT_TITLE_SUB_MARGIN_TOP_PX + EXPORT_TITLE_SUB_LINE_HEIGHT_PX;
  const safety = 3;
  return Math.max(
    Math.ceil(fs * 1.12),
    Math.min(Math.round(fs * 1.3), Math.max(innerH - subStack - safety, fs + 2)),
  );
}

function clampBodyFontForBlock(blockHeightPx: number, desiredFs: number): number {
  const { top: pt, bottom: pb } = EXPORT_BODY_TEXT_INSET_PX;
  const innerH = Math.max(0, blockHeightPx - pt - pb);
  const safety = 4;
  let f = clampExportCanvas(Math.round(desiredFs), 8, 28);
  for (let i = 0; i < 48; i++) {
    const lineH = Math.max(
      Math.ceil(f * 1.18),
      Math.min(Math.round(f * 1.48), Math.max(innerH - safety, f + 4)),
    );
    if (pt + pb + lineH <= blockHeightPx && lineH >= f) return f;
    f -= 1;
  }
  return 8;
}

function bodyLineHeightForBlock(blockHeightPx: number, fs: number): number {
  const { top: pt, bottom: pb } = EXPORT_BODY_TEXT_INSET_PX;
  const innerH = Math.max(0, blockHeightPx - pt - pb);
  const safety = 4;
  return Math.max(
    Math.ceil(fs * 1.18),
    Math.min(Math.round(fs * 1.48), Math.max(innerH - safety, fs + 4)),
  );
}

export const ExportPanelPro: React.FC<ExportPanelProProps> = ({
  colors,
  secondaryColors = [],
  paletteName,
  layout = 'stacked',
  renderSplit,
  persistedState,
  onPersistedStateChange,
}) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const canvasSurfaceRef = useRef<HTMLDivElement>(null);
  /** Área visible alrededor de la vista previa (para escalar A3/A4/A5 sin scroll). */
  const previewShellRef = useRef<HTMLDivElement>(null);
  const [previewFitScale, setPreviewFitScale] = useState(1);
  const [isExporting, setIsExporting] = useState(false);
  const [downloadButtonHovered, setDownloadButtonHovered] = useState(false);
  /** Acordeón exclusivo en columna izquierda (layout split / compact). */
  const [exportSidebarAccordion, setExportSidebarAccordion] = useState<'size' | 'style' | 'elements' | null>(
    () =>
      persistedState?.exportSidebarAccordion ??
      EXPORT_PANEL_PRO_DEFAULT_PERSISTED_STATE.exportSidebarAccordion,
  );

  // Configuración visual - fondo oscuro por defecto
  const [background, setBackground] = useState<'white' | 'dark' | 'custom'>(
    () => persistedState?.background ?? EXPORT_PANEL_PRO_DEFAULT_PERSISTED_STATE.background,
  );
  const [customBg, setCustomBg] = useState(
    () => persistedState?.customBg ?? EXPORT_PANEL_PRO_DEFAULT_PERSISTED_STATE.customBg,
  );
  const [showBorder, setShowBorder] = useState(
    () => persistedState?.showBorder ?? EXPORT_PANEL_PRO_DEFAULT_PERSISTED_STATE.showBorder,
  );
  const [transparentElementCards, setTransparentElementCards] = useState(
    () =>
      persistedState?.transparentElementCards ??
      EXPORT_PANEL_PRO_DEFAULT_PERSISTED_STATE.transparentElementCards,
  );
  const [borderRadius, setBorderRadius] = useState<'none' | 'small' | 'medium' | 'large'>(
    () => persistedState?.borderRadius ?? EXPORT_PANEL_PRO_DEFAULT_PERSISTED_STATE.borderRadius,
  );
  const [exportPageFormat, setExportPageFormat] = useState<ExportPageFormat>(
    () => persistedState?.exportPageFormat ?? EXPORT_PANEL_PRO_DEFAULT_PERSISTED_STATE.exportPageFormat,
  );
  const [exportElementsSection, setExportElementsSection] = useState<ExportElementsSection>(
    () => persistedState?.exportElementsSection ?? EXPORT_PANEL_PRO_DEFAULT_PERSISTED_STATE.exportElementsSection,
  );
  const [canvasItems, setCanvasItems] = useState<ExportCanvasItem[]>(
    () => persistedState?.canvasItems ?? EXPORT_PANEL_PRO_DEFAULT_PERSISTED_STATE.canvasItems,
  );
  const [selectedCanvasId, setSelectedCanvasId] = useState<string | null>(null);
  const [editingCanvasId, setEditingCanvasId] = useState<string | null>(null);
  const [activeContrastTextEditorId, setActiveContrastTextEditorId] = useState<string | null>(null);

  useEffect(() => {
    if (!onPersistedStateChange) return;
    onPersistedStateChange({
      exportSidebarAccordion,
      background,
      customBg,
      showBorder,
      transparentElementCards,
      borderRadius,
      exportPageFormat,
      exportElementsSection,
      canvasItems,
    });
  }, [
    exportSidebarAccordion,
    background,
    customBg,
    showBorder,
    transparentElementCards,
    borderRadius,
    exportPageFormat,
    exportElementsSection,
    canvasItems,
    onPersistedStateChange,
  ]);

  /** Resumen una línea para acordeón «Estilo» colapsado (columna compacta). */
  const exportAccordionStyleSummary = () => {
    const bgLabel =
      background === 'dark' ? 'Oscuro' : background === 'white' ? 'Claro' : 'Custom';
    const r =
      borderRadius === 'none' ? '—' : borderRadius === 'small' ? 'S' : borderRadius === 'medium' ? 'M' : 'L';
    const elementBorderLabel = showBorder ? 'Borde elem ✓' : 'Borde elem —';
    const elementBgLabel = transparentElementCards ? 'Fondo elem —' : 'Fondo elem ✓';
    return `${bgLabel} · ${r} · ${elementBorderLabel} · ${elementBgLabel}`;
  };

  /** Resumen para acordeón «Elementos» colapsado. */
  const exportAccordionElementsSummary = () => {
    const n = canvasItems.length;
    if (n === 0) return 'Lienzo vacío';
    const labels = canvasItems.map((c) => EXPORT_CANVAS_KIND_LABEL_ES[c.kind]);
    const head = labels.slice(0, 3).join(', ');
    return n > 3 ? `${n} bloques · ${head}…` : `${n} bloque${n === 1 ? '' : 's'} · ${head}`;
  };

  const handleAddCanvasTitle = () => {
    const { w, h } = exportPagePixelSize(exportPageFormat);
    const iw = w - 48;
    const ih = h - 48;
    const ww = clampExportCanvas(Math.floor(iw * 0.78), 120, iw);
    const hh = 72;
    const id = crypto.randomUUID();
    const initialFs = getExportTitleTextMetrics(hh).fs;
    setCanvasItems((prev) => [
      ...prev,
      {
        id,
        kind: 'title',
        x: Math.max(0, (iw - ww) / 2),
        y: Math.max(0, Math.min(ih * 0.08, ih - hh - 4)),
        width: ww,
        height: hh,
        text: 'Paleta Principal',
        fontSizePx: clampTitleFontForBlock(hh, initialFs),
        textAlign: 'left',
      },
    ]);
    setSelectedCanvasId(id);
    setEditingCanvasId(null);
  };

  const handleAddCanvasBody = () => {
    const { w, h } = exportPagePixelSize(exportPageFormat);
    const iw = w - 48;
    const ih = h - 48;
    const ww = clampExportCanvas(Math.floor(iw * 0.72), 140, iw);
    const hh = 140;
    const id = crypto.randomUUID();
    const initialFs = getExportBodyTextMetrics(hh).fs;
    setCanvasItems((prev) => [
      ...prev,
      {
        id,
        kind: 'body',
        x: Math.max(0, (iw - ww) / 2),
        y: Math.max(0, Math.min(ih * 0.22, ih - hh - 4)),
        width: ww,
        height: hh,
        text: 'Escribe tu texto aquí…',
        fontSizePx: clampBodyFontForBlock(hh, initialFs),
        textAlign: 'left',
      },
    ]);
    setSelectedCanvasId(id);
    setEditingCanvasId(null);
  };

  const handleAddCanvasPalette = () => {
    const { w, h } = exportPagePixelSize(exportPageFormat);
    const iw = w - 48;
    const ih = h - 48;
    const ww = clampExportCanvas(Math.floor(iw * 0.78), 140, iw);
    const hh = 54;
    const id = crypto.randomUUID();
    setCanvasItems((prev) => [
      ...prev,
      {
        id,
        kind: 'palette',
        x: Math.max(0, (iw - ww) / 2),
        y: Math.max(0, Math.min(ih * 0.38, ih - hh - 4)),
        width: ww,
        height: hh,
        text: 'Paleta Principal',
        fontSizePx: 12,
        textAlign: 'left',
        paletteCodeFormats: [],
      },
    ]);
    setSelectedCanvasId(id);
    setEditingCanvasId(null);
  };

  const handleAddCanvasSecondaryPalette = () => {
    const { w, h } = exportPagePixelSize(exportPageFormat);
    const iw = w - 48;
    const ih = h - 48;
    const ww = clampExportCanvas(Math.floor(iw * 0.78), 140, iw);
    const hh = 54;
    const id = crypto.randomUUID();
    setCanvasItems((prev) => [
      ...prev,
      {
        id,
        kind: 'palette-secondary',
        x: Math.max(0, (iw - ww) / 2),
        y: Math.max(0, Math.min(ih * 0.5, ih - hh - 4)),
        width: ww,
        height: hh,
        text: 'Paleta Secundaria',
        fontSizePx: 12,
        textAlign: 'left',
        paletteCodeFormats: [],
      },
    ]);
    setSelectedCanvasId(id);
    setEditingCanvasId(null);
  };

  const handleAddCanvasApplicationPoster = () => {
    const { w, h } = exportPagePixelSize(exportPageFormat);
    const iw = w - 48;
    const ih = h - 48;
    const ww = clampExportCanvas(Math.floor(iw * 0.62), 260, iw);
    const hh = 520;
    const id = crypto.randomUUID();
    setCanvasItems((prev) => [
      ...prev,
      {
        id,
        kind: 'application-poster',
        x: Math.max(0, (iw - ww) / 2),
        y: Math.max(0, Math.min(ih * 0.16, ih - hh - 4)),
        width: ww,
        height: hh,
        text: 'Poster',
        fontSizePx: 12,
        textAlign: 'left',
        applicationPosterVariant: 'claro',
        applicationPosterTemplate: 'conference',
        applicationPosterVisualScale: 60,
      },
    ]);
    setSelectedCanvasId(id);
    setEditingCanvasId(null);
  };

  const handleAddCanvasApplicationArchitecture = () => {
    const { w, h } = exportPagePixelSize(exportPageFormat);
    const iw = w - 48;
    const ih = h - 48;
    const ww = clampExportCanvas(Math.floor(iw * 0.62), 260, iw);
    const hh = 520;
    const id = crypto.randomUUID();
    setCanvasItems((prev) => [
      ...prev,
      {
        id,
        kind: 'application-architecture',
        x: Math.max(0, (iw - ww) / 2),
        y: Math.max(0, Math.min(ih * 0.16, ih - hh - 4)),
        width: ww,
        height: hh,
        text: 'Arquitectura',
        fontSizePx: 12,
        textAlign: 'left',
        applicationArchitectureVariant: 'claro',
        applicationArchitectureTemplate: 'estudio',
        applicationArchitectureVisualScale: 60,
      },
    ]);
    setSelectedCanvasId(id);
    setEditingCanvasId(null);
  };

  const handleAddCanvasApplicationBranding = () => {
    const { w, h } = exportPagePixelSize(exportPageFormat);
    const iw = w - 48;
    const ih = h - 48;
    const ww = clampExportCanvas(Math.floor(iw * 0.62), 260, iw);
    const hh = 520;
    const id = crypto.randomUUID();
    setCanvasItems((prev) => [
      ...prev,
      {
        id,
        kind: 'application-branding',
        x: Math.max(0, (iw - ww) / 2),
        y: Math.max(0, Math.min(ih * 0.16, ih - hh - 4)),
        width: ww,
        height: hh,
        text: 'Branding',
        fontSizePx: 12,
        textAlign: 'left',
        applicationBrandingVariant: 'claro',
        applicationBrandingTemplate: 'territorio-visual',
        applicationBrandingVisualScale: 60,
      },
    ]);
    setSelectedCanvasId(id);
    setEditingCanvasId(null);
  };

  const handleAddCanvasAnalysisHarmony = () => {
    const { w, h } = exportPagePixelSize(exportPageFormat);
    const iw = w - 48;
    const ih = h - 48;
    const ww = clampExportCanvas(Math.floor(iw * 0.62), 180, iw);
    const hh = 220;
    const id = crypto.randomUUID();
    setCanvasItems((prev) => [
      ...prev,
      {
        id,
        kind: 'analysis-harmony',
        x: Math.max(0, (iw - ww) / 2),
        y: Math.max(0, Math.min(ih * 0.18, ih - hh - 4)),
        width: ww,
        height: hh,
        text: 'Armonía',
        fontSizePx: 12,
        textAlign: 'left',
        analysisHarmonyOptions: [],
        analysisHarmonyVisualScale: 100,
      },
    ]);
    setSelectedCanvasId(id);
    setEditingCanvasId(null);
  };

  const handleAddCanvasAnalysisTemperature = () => {
    const { w, h } = exportPagePixelSize(exportPageFormat);
    const iw = w - 48;
    const ih = h - 48;
    const ww = clampExportCanvas(Math.floor(iw * 0.7), 220, iw);
    const hh = 240;
    const id = crypto.randomUUID();
    setCanvasItems((prev) => [
      ...prev,
      {
        id,
        kind: 'analysis-temperature',
        x: Math.max(0, (iw - ww) / 2),
        y: Math.max(0, Math.min(ih * 0.36, ih - hh - 4)),
        width: ww,
        height: hh,
        text: 'Temperatura',
        fontSizePx: 12,
        textAlign: 'left',
        analysisTemperatureOptions: [],
      },
    ]);
    setSelectedCanvasId(id);
    setEditingCanvasId(null);
  };

  const handleAddCanvasAnalysisFocus = () => {
    const { w, h } = exportPagePixelSize(exportPageFormat);
    const iw = w - 48;
    const ih = h - 48;
    const ww = clampExportCanvas(Math.floor(iw * 0.7), 220, iw);
    const hh = 240;
    const id = crypto.randomUUID();
    setCanvasItems((prev) => [
      ...prev,
      {
        id,
        kind: 'analysis-focus',
        x: Math.max(0, (iw - ww) / 2),
        y: Math.max(0, Math.min(ih * 0.42, ih - hh - 4)),
        width: ww,
        height: hh,
        text: 'Focus',
        fontSizePx: 12,
        textAlign: 'left',
        analysisFocusOptions: [],
        analysisFocusVisualScale: 100,
      },
    ]);
    setSelectedCanvasId(id);
    setEditingCanvasId(null);
  };

  const handleAddCanvasAnalysisLightness = () => {
    const { w, h } = exportPagePixelSize(exportPageFormat);
    const iw = w - 48;
    const ih = h - 48;
    const ww = clampExportCanvas(Math.floor(iw * 0.76), 240, iw);
    const hh = 250;
    const id = crypto.randomUUID();
    setCanvasItems((prev) => [
      ...prev,
      {
        id,
        kind: 'analysis-lightness',
        x: Math.max(0, (iw - ww) / 2),
        y: Math.max(0, Math.min(ih * 0.46, ih - hh - 4)),
        width: ww,
        height: hh,
        text: 'Luminosidad',
        fontSizePx: 12,
        textAlign: 'left',
        analysisLightnessOptions: [],
      },
    ]);
    setSelectedCanvasId(id);
    setEditingCanvasId(null);
  };

  const handleAddCanvasAnalysisCvd = () => {
    const { w, h } = exportPagePixelSize(exportPageFormat);
    const iw = w - 48;
    const ih = h - 48;
    const ww = clampExportCanvas(Math.floor(iw * 0.78), 260, iw);
    const hh = 260;
    const id = crypto.randomUUID();
    setCanvasItems((prev) => [
      ...prev,
      {
        id,
        kind: 'analysis-cvd',
        x: Math.max(0, (iw - ww) / 2),
        y: Math.max(0, Math.min(ih * 0.5, ih - hh - 4)),
        width: ww,
        height: hh,
        text: 'Daltonismo',
        fontSizePx: 12,
        textAlign: 'left',
        analysisCvdOptions: [],
        analysisCvdVisualScale: 100,
      },
    ]);
    setSelectedCanvasId(id);
    setEditingCanvasId(null);
  };

  const handleAddCanvasAnalysisContrast = () => {
    const { w, h } = exportPagePixelSize(exportPageFormat);
    const iw = w - 48;
    const ih = h - 48;
    const ww = clampExportCanvas(Math.floor(iw * 0.82), 280, iw);
    const hh = 250;
    const id = crypto.randomUUID();
    setCanvasItems((prev) => [
      ...prev,
      {
        id,
        kind: 'analysis-contrast',
        x: Math.max(0, (iw - ww) / 2),
        y: Math.max(0, Math.min(ih * 0.54, ih - hh - 4)),
        width: ww,
        height: hh,
        text: 'Contraste',
        fontSizePx: 12,
        textAlign: 'left',
        analysisContrastOptions: [],
        analysisContrastVisualScale: 100,
        contrastWcagTexts: {},
      },
    ]);
    setSelectedCanvasId(id);
    setEditingCanvasId(null);
  };

  const beginResizeCanvasBlock = (
    e: React.PointerEvent,
    id: string,
    sw: number,
    sh: number,
    fit: number,
    handle: 'se' | 'sw' | 'nw' = 'se',
  ) => {
    e.stopPropagation();
    e.preventDefault();
    const item = canvasItems.find((c) => c.id === id);
    if (!item) return;
    const minW =
      item.kind === 'title'
        ? 100
        : item.kind === 'body'
          ? 120
          : item.kind === 'analysis-harmony'
            ? 170
            : item.kind === 'application-poster'
              ? 170
            : item.kind === 'application-architecture'
              ? 220
            : item.kind === 'application-branding'
              ? 170
            : item.kind === 'analysis-temperature' ||
                item.kind === 'analysis-focus' ||
                item.kind === 'analysis-lightness' ||
                item.kind === 'analysis-cvd' ||
                item.kind === 'analysis-contrast'
              ? 220
              : 120;
    const minH =
      item.kind === 'title'
        ? 52
        : item.kind === 'body'
          ? 72
          : item.kind === 'analysis-harmony'
            ? 130
            : item.kind === 'application-poster'
              ? 220
            : item.kind === 'application-architecture'
              ? 180
            : item.kind === 'application-branding'
              ? 220
            : item.kind === 'analysis-temperature' ||
                item.kind === 'analysis-focus' ||
                item.kind === 'analysis-lightness' ||
                item.kind === 'analysis-cvd' ||
                item.kind === 'analysis-contrast'
              ? 150
              : 38;
    const f = fit > 0 ? fit : 1;
    const start = { cx: e.clientX, cy: e.clientY, w: item.width, h: item.height, x: item.x, y: item.y };
    const onMove = (ev: PointerEvent) => {
      const dx = (ev.clientX - start.cx) / f;
      const dy = (ev.clientY - start.cy) / f;
      let nx = start.x;
      let ny = start.y;
      let nw = start.w;
      let nh = start.h;

      if (handle === 'se') {
        nw = clampExportCanvas(start.w + dx, minW, sw - start.x);
        nh = clampExportCanvas(start.h + dy, minH, sh - start.y);
      } else if (handle === 'sw') {
        nw = clampExportCanvas(start.w - dx, minW, start.x + start.w);
        nx = start.x + (start.w - nw);
        nh = clampExportCanvas(start.h + dy, minH, sh - start.y);
      } else if (handle === 'nw') {
        nw = clampExportCanvas(start.w - dx, minW, start.x + start.w);
        nx = start.x + (start.w - nw);
        nh = clampExportCanvas(start.h - dy, minH, start.y + start.h);
        ny = start.y + (start.h - nh);
      }
      setCanvasItems((prev) =>
        prev.map((c) => {
          if (c.id !== id) return c;
          const next = { ...c, x: nx, y: ny, width: nw, height: nh };
          if (c.kind === 'title') {
            return { ...next, fontSizePx: clampTitleFontForBlock(nh, c.fontSizePx) };
          }
          if (c.kind === 'body') {
            return { ...next, fontSizePx: clampBodyFontForBlock(nh, c.fontSizePx) };
          }
          return next;
        }),
      );
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  const renderCanvasResizeHandles = (id: string, iw: number, ih: number, fit: number) => (
    <>
      <div
        data-export-handle
        data-resize-handle
        className="absolute bottom-1 right-1 z-10 h-4 w-4 cursor-se-resize rounded-br-md border-b-2 border-r-2 border-amber-400/90 bg-transparent"
        title="Redimensionar"
        onPointerDown={(e) => beginResizeCanvasBlock(e, id, iw, ih, fit, 'se')}
      />
      <div
        data-export-handle
        data-resize-handle
        className="absolute bottom-1 left-1 z-10 h-4 w-4 cursor-nesw-resize rounded-bl-md border-b-2 border-l-2 border-amber-400/90 bg-transparent"
        title="Redimensionar"
        onPointerDown={(e) => beginResizeCanvasBlock(e, id, iw, ih, fit, 'sw')}
      />
      <div
        data-export-handle
        data-resize-handle
        className="absolute left-1 top-1 z-10 h-4 w-4 cursor-nwse-resize rounded-tl-md border-l-2 border-t-2 border-amber-400/90 bg-transparent"
        title="Redimensionar"
        onPointerDown={(e) => beginResizeCanvasBlock(e, id, iw, ih, fit, 'nw')}
      />
    </>
  );

  const beginDragCanvasItem = (e: React.PointerEvent, id: string, iw: number, ih: number, fit: number) => {
    e.stopPropagation();
    const item = canvasItems.find((c) => c.id === id);
    if (!item) return;
    const f = fit > 0 ? fit : 1;
    const start = {
      cx: e.clientX,
      cy: e.clientY,
      x: item.x,
      y: item.y,
      w: item.width,
      h: item.height,
    };
    const onMove = (ev: PointerEvent) => {
      const dx = (ev.clientX - start.cx) / f;
      const dy = (ev.clientY - start.cy) / f;
      const nx = clampExportCanvas(start.x + dx, 0, iw - start.w);
      const ny = clampExportCanvas(start.y + dy, 0, ih - start.h);
      setCanvasItems((prev) => prev.map((c) => (c.id === id ? { ...c, x: nx, y: ny } : c)));
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  const bumpCanvasFontSize = (id: string, delta: number) => {
    setCanvasItems((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        if (c.kind === 'title') {
          const next = clampTitleFontForBlock(c.height, c.fontSizePx + delta);
          return next === c.fontSizePx ? c : { ...c, fontSizePx: next };
        }
        if (c.kind === 'body') {
          const next = clampBodyFontForBlock(c.height, c.fontSizePx + delta);
          return next === c.fontSizePx ? c : { ...c, fontSizePx: next };
        }
        return c;
      }),
    );
  };

  const setCanvasTextAlign = (id: string, align: ExportCanvasTextAlign) => {
    setCanvasItems((prev) =>
      prev.map((c) =>
        c.id === id && (c.kind === 'title' || c.kind === 'body') ? { ...c, textAlign: align } : c,
      ),
    );
  };

  const toggleCanvasPaletteCodeFormat = (id: string, format: ExportPaletteCodeFormat) => {
    setCanvasItems((prev) =>
      prev.map((c) => {
        if (c.id !== id || (c.kind !== 'palette' && c.kind !== 'palette-secondary')) return c;
        const current = getCanvasPaletteCodeFormats(c);
        const next = current.includes(format)
          ? current.filter((f) => f !== format)
          : [...current, format];
        return { ...c, paletteCodeFormats: next };
      }),
    );
  };

  const toggleCanvasAnalysisHarmonyOption = (id: string, option: ExportAnalysisHarmonyOption) => {
    setCanvasItems((prev) =>
      prev.map((c) => {
        if (c.id !== id || c.kind !== 'analysis-harmony') return c;
        const current = getCanvasAnalysisHarmonyOptions(c);
        const next = current.includes(option)
          ? current.filter((o) => o !== option)
          : [...current, option];
        return { ...c, analysisHarmonyOptions: next };
      }),
    );
  };

  const toggleCanvasAnalysisTemperatureOption = (id: string, option: ExportAnalysisTemperatureOption) => {
    setCanvasItems((prev) =>
      prev.map((c) => {
        if (c.id !== id || c.kind !== 'analysis-temperature') return c;
        const current = getCanvasAnalysisTemperatureOptions(c);
        const next = current.includes(option)
          ? current.filter((o) => o !== option)
          : [...current, option];
        return { ...c, analysisTemperatureOptions: next };
      }),
    );
  };

  const toggleCanvasAnalysisFocusOption = (id: string, option: ExportAnalysisFocusOption) => {
    setCanvasItems((prev) =>
      prev.map((c) => {
        if (c.id !== id || c.kind !== 'analysis-focus') return c;
        const current = getCanvasAnalysisFocusOptions(c);
        const next = current.includes(option)
          ? current.filter((o) => o !== option)
          : [...current, option];
        return { ...c, analysisFocusOptions: next };
      }),
    );
  };

  const toggleCanvasAnalysisLightnessOption = (id: string, option: ExportAnalysisLightnessOption) => {
    setCanvasItems((prev) =>
      prev.map((c) => {
        if (c.id !== id || c.kind !== 'analysis-lightness') return c;
        const current = getCanvasAnalysisLightnessOptions(c);
        const next = current.includes(option)
          ? current.filter((o) => o !== option)
          : [...current, option];
        return { ...c, analysisLightnessOptions: next };
      }),
    );
  };

  const toggleCanvasAnalysisCvdOption = (id: string, option: ExportAnalysisCvdOption) => {
    setCanvasItems((prev) =>
      prev.map((c) => {
        if (c.id !== id || c.kind !== 'analysis-cvd') return c;
        const current = getCanvasAnalysisCvdOptions(c);
        const next = current.includes(option)
          ? current.filter((o) => o !== option)
          : [...current, option];
        return { ...c, analysisCvdOptions: next };
      }),
    );
  };

  const toggleCanvasAnalysisContrastOption = (id: string, option: ExportAnalysisContrastOption) => {
    setCanvasItems((prev) =>
      prev.map((c) => {
        if (c.id !== id || c.kind !== 'analysis-contrast') return c;
        const current = getCanvasAnalysisContrastOptions(c);
        const next = current.includes(option)
          ? current.filter((o) => o !== option)
          : [...current, option];
        return { ...c, analysisContrastOptions: next };
      }),
    );
  };

  const setCanvasApplicationPosterVariant = (id: string, variant: ExportApplicationPosterVariant) => {
    setCanvasItems((prev) =>
      prev.map((c) =>
        c.id === id && c.kind === 'application-poster'
          ? { ...c, applicationPosterVariant: variant }
          : c,
      ),
    );
  };

  const setCanvasApplicationPosterTemplate = (id: string, template: ExportApplicationPosterTemplate) => {
    setCanvasItems((prev) =>
      prev.map((c) =>
        c.id === id && c.kind === 'application-poster'
          ? { ...c, applicationPosterTemplate: template }
          : c,
      ),
    );
  };

  const setCanvasApplicationArchitectureVariant = (id: string, variant: ExportApplicationPosterVariant) => {
    setCanvasItems((prev) =>
      prev.map((c) =>
        c.id === id && c.kind === 'application-architecture'
          ? { ...c, applicationArchitectureVariant: variant }
          : c,
      ),
    );
  };

  const setCanvasApplicationArchitectureTemplate = (id: string, template: ExportApplicationArchitectureTemplate) => {
    setCanvasItems((prev) =>
      prev.map((c) =>
        c.id === id && c.kind === 'application-architecture'
          ? { ...c, applicationArchitectureTemplate: template }
          : c,
      ),
    );
  };

  const toggleCanvasApplicationArchitectureSceneOnly = (id: string) => {
    setCanvasItems((prev) =>
      prev.map((c) =>
        c.id === id && c.kind === 'application-architecture'
          ? { ...c, applicationArchitectureSceneOnly: !c.applicationArchitectureSceneOnly }
          : c,
      ),
    );
  };

  const bumpCanvasApplicationArchitectureVisualScale = (id: string, delta: number) => {
    setCanvasItems((prev) =>
      prev.map((c) => {
        if (c.id !== id || c.kind !== 'application-architecture') return c;
        const current = c.applicationArchitectureVisualScale ?? 60;
        const next = clampExportCanvas(current + delta, 60, 300);
        return next === current ? c : { ...c, applicationArchitectureVisualScale: next };
      }),
    );
  };

  const bumpCanvasApplicationPosterVisualScale = (id: string, delta: number) => {
    setCanvasItems((prev) =>
      prev.map((c) => {
        if (c.id !== id || c.kind !== 'application-poster') return c;
        const current = c.applicationPosterVisualScale ?? 60;
        const next = clampExportCanvas(current + delta, 60, 300);
        return next === current ? c : { ...c, applicationPosterVisualScale: next };
      }),
    );
  };

  const setCanvasApplicationBrandingVariant = (id: string, variant: ExportApplicationPosterVariant) => {
    setCanvasItems((prev) =>
      prev.map((c) =>
        c.id === id && c.kind === 'application-branding' ? { ...c, applicationBrandingVariant: variant } : c,
      ),
    );
  };

  const setCanvasApplicationBrandingTemplate = (id: string, template: ExportApplicationBrandingTemplate) => {
    setCanvasItems((prev) =>
      prev.map((c) =>
        c.id === id && c.kind === 'application-branding' ? { ...c, applicationBrandingTemplate: template } : c,
      ),
    );
  };

  const bumpCanvasApplicationBrandingVisualScale = (id: string, delta: number) => {
    setCanvasItems((prev) =>
      prev.map((c) => {
        if (c.id !== id || c.kind !== 'application-branding') return c;
        const current = c.applicationBrandingVisualScale ?? 60;
        const next = clampExportCanvas(current + delta, 60, 300);
        return next === current ? c : { ...c, applicationBrandingVisualScale: next };
      }),
    );
  };

  const toggleCanvasApplicationBrandingSceneOnly = (id: string) => {
    setCanvasItems((prev) =>
      prev.map((c) =>
        c.id === id && c.kind === 'application-branding'
          ? { ...c, applicationBrandingSceneOnly: !c.applicationBrandingSceneOnly }
          : c,
      ),
    );
  };

  const bumpCanvasAnalysisHarmonyVisualScale = (id: string, delta: number) => {
    setCanvasItems((prev) =>
      prev.map((c) => {
        if (c.id !== id || c.kind !== 'analysis-harmony') return c;
        const current = c.analysisHarmonyVisualScale ?? 100;
        const next = clampExportCanvas(current + delta, 60, 130);
        return next === current ? c : { ...c, analysisHarmonyVisualScale: next };
      }),
    );
  };

  const bumpCanvasAnalysisFocusVisualScale = (id: string, delta: number) => {
    setCanvasItems((prev) =>
      prev.map((c) => {
        if (c.id !== id || c.kind !== 'analysis-focus') return c;
        const current = c.analysisFocusVisualScale ?? 100;
        const next = clampExportCanvas(current + delta, 60, 130);
        return next === current ? c : { ...c, analysisFocusVisualScale: next };
      }),
    );
  };

  const bumpCanvasAnalysisCvdVisualScale = (id: string, delta: number) => {
    setCanvasItems((prev) =>
      prev.map((c) => {
        if (c.id !== id || c.kind !== 'analysis-cvd') return c;
        const current = c.analysisCvdVisualScale ?? 100;
        const next = clampExportCanvas(current + delta, 60, 130);
        return next === current ? c : { ...c, analysisCvdVisualScale: next };
      }),
    );
  };

  const bumpCanvasAnalysisContrastVisualScale = (id: string, delta: number) => {
    setCanvasItems((prev) =>
      prev.map((c) => {
        if (c.id !== id || c.kind !== 'analysis-contrast') return c;
        const current = c.analysisContrastVisualScale ?? 100;
        const next = clampExportCanvas(current + delta, 60, 130);
        return next === current ? c : { ...c, analysisContrastVisualScale: next };
      }),
    );
  };

  const alignCanvasBlockInSheet = (id: string, innerW: number, innerH: number, mode: ExportCanvasBlockSheetAlign) => {
    setCanvasItems((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        let x = c.x;
        let y = c.y;
        const maxX = Math.max(0, innerW - c.width);
        const maxY = Math.max(0, innerH - c.height);
        switch (mode) {
          case 'sheetLeft':
            x = 0;
            break;
          case 'sheetHCenter':
            x = Math.round((innerW - c.width) / 2);
            break;
          case 'sheetRight':
            x = maxX;
            break;
          case 'sheetTop':
            y = 0;
            break;
          case 'sheetVMiddle':
            y = Math.round((innerH - c.height) / 2);
            break;
          case 'sheetBottom':
            y = maxY;
            break;
          default:
            break;
        }
        return {
          ...c,
          x: clampExportCanvas(x, 0, maxX),
          y: clampExportCanvas(y, 0, maxY),
        };
      }),
    );
  };

  const getBgColor = () => {
    switch (background) {
      case 'white': return '#ffffff';
      case 'dark': return '#0f0f1a';
      case 'custom': return customBg;
    }
  };

  const getBgColorSolid = () => {
    switch (background) {
      case 'white': return '#ffffff';
      case 'dark': return '#0f0f1a';
      case 'custom': return customBg;
    }
  };

  const getTextColor = () => background === 'dark' || (background === 'custom' && hexToHsl(customBg).l < 50) ? '#ffffff' : '#1a1a2e';
  const getSubtextColor = () => background === 'dark' || (background === 'custom' && hexToHsl(customBg).l < 50) ? '#a0a0b0' : '#666680';
  const getElementCardBackground = (lightAlpha = 0.045, darkAlpha = 0.055) => {
    if (transparentElementCards) return 'transparent';
    return background === 'white'
      ? `rgba(0,0,0,${lightAlpha})`
      : `rgba(255,255,255,${darkAlpha})`;
  };

  const getApplicationPosterPalette = (variant: ExportApplicationPosterVariant): ApplicationPosterPalette => {
    const col = buildColorPaletteFromHarmony(colors, variant).colors;
    return {
      primary: col.primario,
      secondary: col.secondario,
      accent: col.acento,
      accent2: col.apagado,
      background: col.fondo,
      surface: col.primario2 ? (col.sobrefondo2 ?? col.sobrefondo) : col.sobrefondo,
      muted: col.línea,
      text: col.texto,
      textLight: col['texto fino'],
    };
  };

  const getApplicationArchitecturePalette = (variant: ExportApplicationPosterVariant) => {
    const col = buildColorPaletteFromHarmony(colors, variant).colors;
    return {
      background: col.fondo,
      surface: col.primario2 ? (col.sobrefondo2 ?? col.sobrefondo) : col.sobrefondo,
      primary: col.primario,
      secondary: col.secondario,
      accent: col.acento,
      muted: col.línea,
    };
  };

  const getBorderRadiusValue = () => {
    switch (borderRadius) {
      case 'none': return '0';
      case 'small': return '8px';
      case 'medium': return '16px';
      case 'large': return '24px';
    }
  };

  const convertColorToRgb = (colorValue: string): string => {
    if (!colorValue || colorValue === 'transparent' || colorValue === 'none' || colorValue === 'rgba(0, 0, 0, 0)') {
      return colorValue;
    }
    
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      const ctx = canvas.getContext('2d');
      if (!ctx) return colorValue;
      
      ctx.clearRect(0, 0, 1, 1);
      ctx.fillStyle = '#000000';
      ctx.fillStyle = colorValue;
      ctx.fillRect(0, 0, 1, 1);
      
      const data = ctx.getImageData(0, 0, 1, 1).data;
      
      if (data[3] === 0) return 'transparent';
      if (data[3] < 255) {
        return `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${(data[3] / 255).toFixed(3)})`;
      }
      return `rgb(${data[0]}, ${data[1]}, ${data[2]})`;
    } catch {
      return colorValue;
    }
  };

  /** Escala la vista previa DIN para que quepa en el hueco sin scroll (A5/A4/A3). */
  useLayoutEffect(() => {
    const shell = previewShellRef.current;
    if (!shell) return;
    const update = () => {
      const rect = shell.getBoundingClientRect();
      const pad = 12;
      const cw = Math.max(0, rect.width - pad);
      const ch = Math.max(0, rect.height - pad);
      const dims = exportPagePixelSize(exportPageFormat);
      if (!dims.w || !dims.h || cw < 1 || ch < 1) return;
      const next = Math.min(1, cw / dims.w, ch / dims.h);
      setPreviewFitScale((prev) => (Math.abs(prev - next) > 0.001 ? next : prev));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(shell);
    window.addEventListener('resize', update);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
    };
  }, [exportPageFormat, layout]);

  /**
   * PNG del lienzo DIN (`[data-preview="true"]`):
   * - **Principal:** `html-to-image` → `toPng` (SVG + foreignObject). Replica el layout del navegador;
   *   evita desajustes de texto que daba `html2canvas` en bloques del lienzo (p. ej. título).
   * - **Respaldo:** `html2canvas` + `onclone` (oklch → rgb) si `toPng` falla.
   * Nuevos elementos en «Elementos del exportable» que se pinten en esta vista previa:
   * - Marca UI solo edición (×, asas, etc.) con **`data-export-handle`** para excluirlos del PNG (`filter` de `toPng`).
   * - Para tipografía/espaciado crítico en raster, preferir **estilos inline en px** (padding, lineHeight, fontSize)
   *   y cajas claras; si algo se ve bien en web pero mal al exportar, revisar primero `toPng`, no retocar solo para html2canvas.
   */
  const handleExport = async () => {
    if (!previewRef.current) {
      showErrorNotification('Error: No se encontró el elemento de vista previa');
      return;
    }
    
    if (canvasItems.length === 0) {
      showErrorNotification('Error: Añade al menos un bloque al lienzo para exportar');
      return;
    }
    
    setIsExporting(true);
    
    try {
      const dpr =
        typeof window !== 'undefined' && window.devicePixelRatio
          ? Math.min(2, Math.max(1, Math.round(window.devicePixelRatio)))
          : 1;
      const bgColor = getBgColorSolid();
      const dims = exportPagePixelSize(exportPageFormat);

      let dataUrl: string;
      try {
        dataUrl = await toPng(previewRef.current, {
          pixelRatio: dpr,
          backgroundColor: bgColor,
          width: dims.w,
          height: dims.h,
          cacheBust: true,
          style: {
            transform: 'none',
            width: `${dims.w}px`,
            height: `${dims.h}px`,
            minWidth: `${dims.w}px`,
            minHeight: `${dims.h}px`,
          },
          filter: (node) => !(node instanceof HTMLElement && node.hasAttribute('data-export-handle')),
        });
      } catch (toPngErr) {
        try {
          const canvas = await html2canvas(previewRef.current, {
            scale: dpr,
            backgroundColor: bgColor,
            useCORS: true,
            allowTaint: true,
            logging: false,
            onclone: (clonedDoc) => {
              const previewEl = clonedDoc.querySelector('[data-preview="true"]');
              if (previewEl instanceof HTMLElement) {
                previewEl.style.transform = 'none';
                const d = exportPagePixelSize(exportPageFormat);
                previewEl.style.width = `${d.w}px`;
                previewEl.style.height = `${d.h}px`;
                previewEl.style.minWidth = `${d.w}px`;
                previewEl.style.minHeight = `${d.h}px`;
              }
              const allElements = clonedDoc.querySelectorAll('*');

              allElements.forEach((element) => {
                if (!(element instanceof HTMLElement)) return;

                const computed = window.getComputedStyle(element);

                const colorProps = [
                  'color',
                  'background-color',
                  'border-color',
                  'border-top-color',
                  'border-right-color',
                  'border-bottom-color',
                  'border-left-color',
                  'outline-color',
                  'text-decoration-color',
                ];

                colorProps.forEach((prop) => {
                  const value = computed.getPropertyValue(prop);
                  if (
                    value &&
                    (value.includes('oklab') ||
                      value.includes('oklch') ||
                      value.includes('lab(') ||
                      value.includes('lch('))
                  ) {
                    const converted = convertColorToRgb(value);
                    element.style.setProperty(prop, converted, 'important');
                  }
                });

                const boxShadow = computed.getPropertyValue('box-shadow');
                if (boxShadow && boxShadow !== 'none' && (boxShadow.includes('oklab') || boxShadow.includes('oklch'))) {
                  let converted = boxShadow;
                  const colorRegex = /(oklab|oklch|lab|lch)\([^)]+\)/g;
                  const matches = boxShadow.match(colorRegex);
                  if (matches) {
                    matches.forEach((match) => {
                      converted = converted.replace(match, convertColorToRgb(match));
                    });
                  }
                  element.style.setProperty('box-shadow', converted, 'important');
                }

                const bgImage = computed.getPropertyValue('background-image');
                if (bgImage && bgImage !== 'none' && (bgImage.includes('oklab') || bgImage.includes('oklch'))) {
                  let converted = bgImage;
                  const colorRegex = /(oklab|oklch|lab|lch)\([^)]+\)/g;
                  const matches = bgImage.match(colorRegex);
                  if (matches) {
                    matches.forEach((match) => {
                      converted = converted.replace(match, convertColorToRgb(match));
                    });
                  }
                  element.style.setProperty('background-image', converted, 'important');
                }
              });
            },
          });
          dataUrl = canvas.toDataURL('image/png');
        } catch (canvasError) {
          const a = toPngErr instanceof Error ? toPngErr.message : String(toPngErr);
          const b = canvasError instanceof Error ? canvasError.message : String(canvasError);
          showErrorNotification(`Error al capturar: ${a} · Respaldo: ${b}`);
          setIsExporting(false);
          return;
        }
      }

      try {
        const link = document.createElement('a');
        link.download = `${paletteName?.replace(/\s+/g, '-') || 'paleta'}.png`;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showSuccessNotification(`${paletteName || 'Paleta'}.png`);
      } catch (pngError) {
        showErrorNotification(`Error PNG: ${pngError instanceof Error ? pngError.message : String(pngError)}`);
      }

    } catch (error) {
      const errorMessage = error instanceof Error 
        ? `${error.name}: ${error.message}` 
        : String(error);
      showErrorNotification(`Error: ${errorMessage}`);
    } finally {
      setIsExporting(false);
    }
  };
  
  const showSuccessNotification = (fileName: string) => {
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg z-50';
    notification.innerHTML = `✓ ${fileName} descargado`;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
  };
  
  const showErrorNotification = (message: string) => {
    const notification = document.createElement('div');
    notification.className = 'fixed bottom-4 right-4 bg-red-600 text-white px-6 py-4 rounded-xl shadow-lg z-50 max-w-md';
    notification.innerHTML = `
      <div class="font-semibold mb-1">✕ Error al exportar</div>
      <div class="text-sm opacity-90">${message}</div>
      <div class="text-xs mt-2 opacity-70">Revisa la consola del navegador (F12) para más detalles</div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 8000);
  };
  

  const renderExportSizeFields = () => (
    <>
      <p className="mb-4 text-[11px] text-gray-500">
        Formato de hoja DIN (vertical). La vista previa y el PNG usan la misma proporción y tamaño lógico (~96 DPI).
      </p>
      <div className="flex gap-1">
        {(['A5', 'A4', 'A3'] as const).map((fmt) => (
          <button
            key={fmt}
            type="button"
            onClick={() => setExportPageFormat(fmt)}
            className={`flex-1 rounded-lg py-2.5 text-xs font-medium transition-all ${
              exportPageFormat === fmt
                ? 'bg-gray-600 text-white'
                : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {EXPORT_PAGE_SPECS[fmt].label}
          </button>
        ))}
      </div>
    </>
  );

  const renderExportStyleFields = () => (
    <>
      <h4 className="text-xs font-medium text-gray-400 mb-2">Fondo</h4>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { id: 'dark' as const, label: 'Oscuro', color: '#0f0f1a' },
          { id: 'white' as const, label: 'Claro', color: '#ffffff' },
          { id: 'custom' as const, label: 'Custom', color: customBg },
        ].map((bg) => (
          <button
            key={bg.id}
            type="button"
            onClick={() => setBackground(bg.id)}
            className={`relative flex h-12 flex-col items-center justify-center gap-1 rounded-xl border-2 transition-all ${
              background === bg.id
                ? 'scale-105 border-purple-500'
                : 'border-gray-600 hover:border-gray-500'
            }`}
            style={{ background: bg.color }}
          >
            <span className={`text-[10px] font-medium ${bg.id === 'white' ? 'text-gray-600' : 'text-white'}`}>{bg.label}</span>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {background === 'custom' && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mb-4 overflow-hidden"
          >
            <div className="rounded-xl border border-gray-700/50 bg-gray-900/50 p-4">
              <div className="mb-3 flex items-center gap-3">
                <div
                  className="relative h-12 w-12 cursor-pointer overflow-hidden rounded-xl shadow-lg"
                  style={{ backgroundColor: customBg }}
                >
                  <input
                    type="color"
                    value={customBg}
                    onChange={(e) => setCustomBg(e.target.value)}
                    className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                  />
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={customBg}
                    onChange={(e) => setCustomBg(e.target.value)}
                    className="w-full rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 font-mono text-sm text-white"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="mb-1 flex justify-between text-xs text-gray-400">
                    <span>Luminosidad</span>
                    <span>{hexToHsl(customBg).l}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={hexToHsl(customBg).l}
                    onChange={(e) => {
                      const hsl = hexToHsl(customBg);
                      const l = parseInt(e.target.value, 10);
                      setCustomBg(hslToHex(hsl.h, hsl.s, l));
                    }}
                    className="h-2 w-full cursor-pointer appearance-none rounded-full"
                    style={{
                      background: `linear-gradient(to right, #000, ${customBg}, #fff)`,
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        <h4 className="mb-2 text-xs font-medium text-gray-400">Bordes Formato</h4>
        <div className="flex gap-1">
          {[
            { id: 'none', label: '—' },
            { id: 'small', label: 'S' },
            { id: 'medium', label: 'M' },
            { id: 'large', label: 'L' },
          ].map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setBorderRadius(r.id as typeof borderRadius)}
              className={`flex-1 py-2 text-xs font-medium transition-all ${
                borderRadius === r.id
                  ? 'bg-gray-600 text-white'
                  : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
              }`}
              style={{
                borderRadius: r.id === 'none' ? '4px' : r.id === 'small' ? '6px' : r.id === 'medium' ? '8px' : '12px',
              }}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <h4 className="mb-2 text-xs font-medium text-gray-400">Borde Elementos</h4>
          <button
            type="button"
            onClick={() => setShowBorder((v) => !v)}
            className={`flex w-full items-center justify-center rounded-lg py-2 text-xs font-medium transition-all ${
              showBorder
                ? 'border border-purple-500/50 bg-purple-600/30 text-purple-300'
                : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {showBorder ? 'Activo' : 'Inactivo'}
          </button>
        </div>
        <div>
          <h4 className="mb-2 text-xs font-medium text-gray-400">Fondo Elementos</h4>
          <button
            type="button"
            onClick={() => setTransparentElementCards((v) => !v)}
            className={`flex w-full items-center justify-center rounded-lg py-2 text-xs font-medium transition-all ${
              !transparentElementCards
                ? 'border border-purple-500/50 bg-purple-600/30 text-purple-300'
                : 'bg-gray-700/50 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {!transparentElementCards ? 'Activo' : 'Inactivo'}
          </button>
        </div>
      </div>
    </>
  );

  const renderExportElementsFields = () => (
    <>
      <p className="mb-3 text-[11px] leading-relaxed text-gray-500">
        Añade bloques al lienzo de la vista previa. En el centro puedes moverlos, redimensionarlos, editarlos o
        eliminarlos.
      </p>
      <div className="mb-2 flex items-center justify-between rounded-lg border border-gray-700/60 bg-gray-900/40 px-2 py-1">
        <button
          type="button"
          aria-label="Sección anterior"
          onClick={() =>
            setExportElementsSection((cur) => {
              const idx = EXPORT_ELEMENTS_SECTION_OPTIONS.findIndex((s) => s.id === cur);
              const next = (idx - 1 + EXPORT_ELEMENTS_SECTION_OPTIONS.length) % EXPORT_ELEMENTS_SECTION_OPTIONS.length;
              return EXPORT_ELEMENTS_SECTION_OPTIONS[next].id;
            })
          }
          className="flex h-6 w-6 items-center justify-center rounded text-gray-300 hover:bg-gray-700/60 hover:text-white"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex items-center gap-1">
          {EXPORT_ELEMENTS_SECTION_OPTIONS.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => setExportElementsSection(section.id)}
              className={`rounded-md px-2 py-1 text-[10px] font-semibold transition-colors ${
                exportElementsSection === section.id
                  ? 'bg-purple-600/75 text-white'
                  : 'text-gray-300 hover:bg-gray-700/60 hover:text-white'
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          aria-label="Siguiente sección"
          onClick={() =>
            setExportElementsSection((cur) => {
              const idx = EXPORT_ELEMENTS_SECTION_OPTIONS.findIndex((s) => s.id === cur);
              const next = (idx + 1) % EXPORT_ELEMENTS_SECTION_OPTIONS.length;
              return EXPORT_ELEMENTS_SECTION_OPTIONS[next].id;
            })
          }
          className="flex h-6 w-6 items-center justify-center rounded text-gray-300 hover:bg-gray-700/60 hover:text-white"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      {exportElementsSection === 'basics' ? (
        <div className="grid min-w-0 grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleAddCanvasTitle}
            className="flex min-w-0 items-center justify-center gap-2 rounded-lg border border-gray-600 bg-gray-700/50 py-2.5 px-2 text-xs font-medium text-gray-200 transition-colors hover:border-gray-500 hover:bg-gray-700 sm:px-3 sm:text-sm"
          >
            <svg className="h-4 w-4 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span className="truncate">Título</span>
          </button>
          <button
            type="button"
            onClick={handleAddCanvasBody}
            className="flex min-w-0 items-center justify-center gap-2 rounded-lg border border-gray-600 bg-gray-700/50 py-2.5 px-2 text-xs font-medium text-gray-200 transition-colors hover:border-gray-500 hover:bg-gray-700 sm:px-3 sm:text-sm"
          >
            <svg className="h-4 w-4 shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h12M4 18h16" />
            </svg>
            <span className="truncate">Texto</span>
          </button>
          <button
            type="button"
            onClick={handleAddCanvasPalette}
            className="flex min-w-0 items-center justify-center gap-2 rounded-lg border border-gray-600 bg-gray-700/50 py-2.5 px-2 text-xs font-medium text-gray-200 transition-colors hover:border-gray-500 hover:bg-gray-700 sm:px-3 sm:text-sm"
          >
            <svg className="h-4 w-4 shrink-0 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
              <rect x="3.5" y="6.5" width="17" height="11" rx="2" />
              <path d="M9.2 6.5v11M14.8 6.5v11" />
            </svg>
            <span className="truncate">Paleta</span>
          </button>
          <button
            type="button"
            onClick={handleAddCanvasSecondaryPalette}
            className="flex min-w-0 items-center justify-center gap-2 rounded-lg border border-gray-600 bg-gray-700/50 py-2.5 px-2 text-xs font-medium text-gray-200 transition-colors hover:border-gray-500 hover:bg-gray-700 sm:px-3 sm:text-sm"
          >
            <svg className="h-4 w-4 shrink-0 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
              <rect x="3.5" y="6.5" width="17" height="11" rx="2" />
              <path d="M9.2 6.5v11M14.8 6.5v11" />
            </svg>
            <span className="truncate">Paleta S</span>
          </button>
        </div>
      ) : exportElementsSection === 'application' ? (
        <div className="grid min-w-0 grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleAddCanvasApplicationPoster}
            className="flex min-w-0 items-center justify-center gap-2 rounded-lg border border-gray-600 bg-gray-700/50 py-2.5 px-2 text-xs font-medium text-gray-200 transition-colors hover:border-gray-500 hover:bg-gray-700 sm:px-3 sm:text-sm"
          >
            <svg className="h-4 w-4 shrink-0 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
              <rect x="5.5" y="3.5" width="13" height="17" rx="2" />
              <path d="M8 8.5h8M8 12h5M8 15.5h6" />
            </svg>
            <span className="truncate">Poster</span>
          </button>
          <button
            type="button"
            onClick={handleAddCanvasApplicationArchitecture}
            className="flex min-w-0 items-center justify-center gap-2 rounded-lg border border-gray-600 bg-gray-700/50 py-2.5 px-2 text-xs font-medium text-gray-200 transition-colors hover:border-gray-500 hover:bg-gray-700 sm:px-3 sm:text-sm"
          >
            <svg className="h-4 w-4 shrink-0 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
              <path d="M3 21h18" />
              <path d="M6 21v-7h12v7" />
              <path d="M9 14V8h6v6" />
              <path d="M12 8V4" />
            </svg>
            <span className="truncate">Arquitectura</span>
          </button>
          <button
            type="button"
            onClick={handleAddCanvasApplicationBranding}
            className="flex min-w-0 items-center justify-center gap-2 rounded-lg border border-gray-600 bg-gray-700/50 py-2.5 px-2 text-xs font-medium text-gray-200 transition-colors hover:border-gray-500 hover:bg-gray-700 sm:px-3 sm:text-sm"
          >
            <svg className="h-4 w-4 shrink-0 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
              <path d="M4 4h16v16H4z" />
              <path d="M8 8h8M8 12h5M8 16h6" />
            </svg>
            <span className="truncate">Branding</span>
          </button>
        </div>
      ) : exportElementsSection === 'analysis' ? (
        <div className="grid min-w-0 grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleAddCanvasAnalysisHarmony}
            className="flex min-w-0 items-center justify-center gap-2 rounded-lg border border-gray-600 bg-gray-700/50 py-2.5 px-2 text-xs font-medium text-gray-200 transition-colors hover:border-gray-500 hover:bg-gray-700 sm:px-3 sm:text-sm"
          >
            <svg className="h-4 w-4 shrink-0 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
              <path d="M12 3l2.5 4.5L19.5 10l-4 3.5.8 5.2L12 16.6 7.7 18.7l.8-5.2-4-3.5 5-2.5L12 3z" />
            </svg>
            <span className="truncate">Armonía</span>
          </button>
          <button
            type="button"
            onClick={handleAddCanvasAnalysisTemperature}
            className="flex min-w-0 items-center justify-center gap-2 rounded-lg border border-gray-600 bg-gray-700/50 py-2.5 px-2 text-xs font-medium text-gray-200 transition-colors hover:border-gray-500 hover:bg-gray-700 sm:px-3 sm:text-sm"
          >
            <svg className="h-4 w-4 shrink-0 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
              <path d="M4 15l4.5-4.5 3.5 3.5L20 6" />
              <path d="M3 19h18" />
            </svg>
            <span className="truncate">Temperatura</span>
          </button>
          <button
            type="button"
            onClick={handleAddCanvasAnalysisFocus}
            className="flex min-w-0 items-center justify-center gap-2 rounded-lg border border-gray-600 bg-gray-700/50 py-2.5 px-2 text-xs font-medium text-gray-200 transition-colors hover:border-gray-500 hover:bg-gray-700 sm:px-3 sm:text-sm"
          >
            <svg className="h-4 w-4 shrink-0 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
              <circle cx="12" cy="12" r="7" />
              <circle cx="12" cy="12" r="2.2" />
              <path d="M12 3v2.2M12 18.8V21M3 12h2.2M18.8 12H21" />
            </svg>
            <span className="truncate">Focus</span>
          </button>
          <button
            type="button"
            onClick={handleAddCanvasAnalysisLightness}
            className="flex min-w-0 items-center justify-center gap-2 rounded-lg border border-gray-600 bg-gray-700/50 py-2.5 px-2 text-xs font-medium text-gray-200 transition-colors hover:border-gray-500 hover:bg-gray-700 sm:px-3 sm:text-sm"
          >
            <svg className="h-4 w-4 shrink-0 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
              <path d="M4 18h16" />
              <path d="M6 18V8M10 18V5M14 18v-9M18 18v-12" />
            </svg>
            <span className="truncate">Luminosidad</span>
          </button>
          <button
            type="button"
            onClick={handleAddCanvasAnalysisCvd}
            className="flex min-w-0 items-center justify-center gap-2 rounded-lg border border-gray-600 bg-gray-700/50 py-2.5 px-2 text-xs font-medium text-gray-200 transition-colors hover:border-gray-500 hover:bg-gray-700 sm:px-3 sm:text-sm"
          >
            <svg className="h-4 w-4 shrink-0 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
              <path d="M12 3a9 9 0 109 9" />
              <path d="M12 8v4l3 2" />
            </svg>
            <span className="truncate">Daltonismo</span>
          </button>
          <button
            type="button"
            onClick={handleAddCanvasAnalysisContrast}
            className="flex min-w-0 items-center justify-center gap-2 rounded-lg border border-gray-600 bg-gray-700/50 py-2.5 px-2 text-xs font-medium text-gray-200 transition-colors hover:border-gray-500 hover:bg-gray-700 sm:px-3 sm:text-sm"
          >
            <svg className="h-4 w-4 shrink-0 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
              <path d="M4 12h16" />
              <path d="M7 7h10M7 17h10" />
            </svg>
            <span className="truncate">Contraste</span>
          </button>
        </div>
      ) : (
        <div className="rounded-lg border border-gray-700/50 bg-gray-900/35 px-3 py-2.5">
          <p className="text-[11px] leading-relaxed text-gray-400">
            Sección <span className="font-semibold text-gray-200">{exportElementsSection === 'application' ? 'Aplicación' : 'Análisis'}</span> creada. Próximamente añadiremos bloques específicos aquí.
          </p>
        </div>
      )}
    </>
  );

  const renderControls = (opts?: { compact?: boolean }) => {
    const compact = !!opts?.compact;
    return (
    <div className={compact ? 'space-y-4' : 'space-y-6'}>
      {/* Panel de configuración */}
      <div id="chromatica-save-export-custom">
        {compact ? (
          <div className="space-y-2">
            <div className="overflow-hidden rounded-xl border border-gray-700/50 bg-gray-800/50">
              <button
                type="button"
                aria-expanded={exportSidebarAccordion === 'size'}
                onClick={() => setExportSidebarAccordion((o) => (o === 'size' ? null : 'size'))}
                className="flex w-full items-start justify-between gap-2 px-3 py-2.5 text-left transition-colors hover:bg-gray-700/25"
              >
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="flex items-center gap-2 text-sm font-semibold text-gray-200">
                    <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                    Tamaño de imagen
                  </span>
                  {exportSidebarAccordion !== 'size' && (
                    <span
                      className="truncate pl-6 text-[10px] font-medium leading-snug text-gray-400"
                      title={`Formato · ${EXPORT_PAGE_SPECS[exportPageFormat].label}`}
                    >
                      Formato · {EXPORT_PAGE_SPECS[exportPageFormat].label}
                    </span>
                  )}
                </span>
                <svg
                  className={`mt-0.5 h-4 w-4 shrink-0 text-gray-400 transition-transform ${exportSidebarAccordion === 'size' ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {exportSidebarAccordion === 'size' && (
                <div className="border-t border-gray-700/40 px-3 py-3">{renderExportSizeFields()}</div>
              )}
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-700/50 bg-gray-800/50">
              <button
                type="button"
                aria-expanded={exportSidebarAccordion === 'style'}
                onClick={() => setExportSidebarAccordion((o) => (o === 'style' ? null : 'style'))}
                className="flex w-full items-start justify-between gap-2 px-3 py-2.5 text-left transition-colors hover:bg-gray-700/25"
              >
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="flex items-center gap-2 text-sm font-semibold text-gray-200">
                    <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                    </svg>
                    Estilo
                  </span>
                  {exportSidebarAccordion !== 'style' && (
                    <span className="truncate pl-6 text-[10px] font-medium leading-snug text-gray-400" title={exportAccordionStyleSummary()}>
                      {exportAccordionStyleSummary()}
                    </span>
                  )}
                </span>
                <svg
                  className={`mt-0.5 h-4 w-4 shrink-0 text-gray-400 transition-transform ${exportSidebarAccordion === 'style' ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {exportSidebarAccordion === 'style' && (
                <div className="border-t border-gray-700/40 px-3 py-3">{renderExportStyleFields()}</div>
              )}
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-700/50 bg-gray-800/50">
              <button
                type="button"
                aria-expanded={exportSidebarAccordion === 'elements'}
                onClick={() => setExportSidebarAccordion((o) => (o === 'elements' ? null : 'elements'))}
                className="flex w-full items-start justify-between gap-2 px-3 py-2.5 text-left transition-colors hover:bg-gray-700/25"
              >
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className="flex items-center gap-2 text-sm font-semibold text-gray-200">
                    <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    Elementos del exportable
                  </span>
                  {exportSidebarAccordion !== 'elements' && (
                    <span className="truncate pl-6 text-[10px] font-medium leading-snug text-gray-400" title={exportAccordionElementsSummary()}>
                      {exportAccordionElementsSummary()}
                    </span>
                  )}
                </span>
                <svg
                  className={`mt-0.5 h-4 w-4 shrink-0 text-gray-400 transition-transform ${exportSidebarAccordion === 'elements' ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {exportSidebarAccordion === 'elements' && (
                <div className="border-t border-gray-700/40 px-3 py-3">{renderExportElementsFields()}</div>
              )}
            </div>
          </div>
        ) : (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Columna 1: Tamaño de imagen + estilo */}
        <div className="space-y-4">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50">
            <h3 className="text-sm font-semibold text-gray-200 mb-1 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              Tamaño de imagen
            </h3>
            {renderExportSizeFields()}
          </div>

          {/* Estilo visual */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50">
            <h3 className="text-sm font-semibold text-gray-200 mb-4 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              Estilo
            </h3>
            {renderExportStyleFields()}
          </div>
        </div>

        {/* Columna 2: Elementos */}
        <div className="lg:col-span-2 min-w-0">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-5 border border-gray-700/50">
            <h3 className="text-sm font-semibold text-gray-200 mb-4 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Elementos del exportable
            </h3>

            {renderExportElementsFields()}
          </div>
        </div>
      </div>
        )}
      </div>
    </div>
    );
  };

  const renderStickyDownload = () => {
    const disabled = isExporting || canvasItems.length === 0;
    return (
      <motion.button
        type="button"
        onClick={() => void handleExport()}
        disabled={disabled}
        onMouseEnter={() => setDownloadButtonHovered(true)}
        onMouseLeave={() => setDownloadButtonHovered(false)}
        whileHover={!disabled ? { scale: 1.02, y: -1 } : {}}
        whileTap={!disabled ? { scale: 0.98 } : {}}
        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        className="group relative flex w-full items-center justify-center gap-2 rounded-lg border py-3 px-3 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900 disabled:cursor-not-allowed disabled:opacity-45"
        style={{
          borderColor: EXPORT_DOWNLOAD_GOLD.border,
          backgroundColor: EXPORT_DOWNLOAD_GOLD.bg,
          color: EXPORT_DOWNLOAD_GOLD.text,
        }}
      >
        <span className="absolute inset-0 overflow-hidden rounded-[inherit] pointer-events-none">
          <ButtonParticles
            isHovered={canvasItems.length > 0 || downloadButtonHovered || isExporting}
            color={EXPORT_DOWNLOAD_GOLD.particle}
            count={10}
            intensity="light"
          />
        </span>
        <span className="relative z-10 flex shrink-0 items-center justify-center rounded-md bg-black/25 ring-1 ring-amber-500/25 w-8 h-8">
          {isExporting ? (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden>
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          )}
        </span>
        <span className="relative z-10">{isExporting ? 'Exportando…' : 'Descargar PNG'}</span>
      </motion.button>
    );
  };

  const previewIsSplitChrome = layout === 'split' && Boolean(renderSplit);

  const renderPreview = () => {
    const pagePx = exportPagePixelSize(exportPageFormat);
    const fit = previewFitScale;
    const exportFooterChrome: ExportCanvasFooterChrome =
      background === 'white' || (background === 'custom' && hexToHsl(customBg).l >= 50)
        ? 'onLightCanvas'
        : 'onDarkCanvas';
    return (
      <div
        id="chromatica-save-export-preview"
        className={
          previewIsSplitChrome
            ? 'flex h-full min-h-0 min-w-0 flex-col'
            : 'flex h-full min-h-0 flex-col rounded-2xl border border-gray-700/50 bg-gray-800/50 p-6 backdrop-blur-sm'
        }
      >
        {!previewIsSplitChrome && (
          <div className="mb-4 shrink-0">
            <h3 className="flex flex-wrap items-center gap-2 text-sm font-semibold text-gray-200">
              <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Vista previa
              <span className="text-xs font-normal text-gray-400">({canvasItems.length} bloques)</span>
            </h3>
          </div>
        )}

        <div
          ref={previewShellRef}
          className="flex min-h-0 min-w-0 flex-1 items-center justify-center overflow-visible p-1"
          onPointerDown={(ev) => {
            const t = ev.target as HTMLElement;
            const shell = ev.currentTarget as HTMLElement;
            const pageHost = shell.querySelector('[data-export-preview-page-host]');
            if (pageHost instanceof HTMLElement && !pageHost.contains(t)) {
              setSelectedCanvasId(null);
              setEditingCanvasId(null);
            }
          }}
        >
          <div
            data-export-preview-page-host
            className="relative shrink-0 overflow-visible"
            style={{
              width: pagePx.w * fit,
              height: pagePx.h * fit,
            }}
          >
            <div
              ref={previewRef}
              data-preview="true"
              className="box-border overflow-visible"
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: `${pagePx.w}px`,
                height: `${pagePx.h}px`,
                minWidth: `${pagePx.w}px`,
                minHeight: `${pagePx.h}px`,
                transform: `scale(${fit})`,
                transformOrigin: 'top left',
                background: getBgColor(),
                border: `1px solid ${background === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)'}`,
                borderRadius: getBorderRadiusValue(),
                padding: '24px',
              }}
            >
              <div
                ref={canvasSurfaceRef}
                className="relative h-full w-full"
                onPointerDown={(ev) => {
                  if (!(ev.target as HTMLElement).closest('[data-canvas-item-root]')) {
                    setSelectedCanvasId(null);
                    setEditingCanvasId(null);
                  }
                }}
              >
                {canvasItems.map((item) => {
                  const iw = pagePx.w - 48;
                  const ih = pagePx.h - 48;
                  const textColor = getTextColor();
                  const subtextColor = getSubtextColor();
                  const sel = selectedCanvasId === item.id;
                  const spaceBelowSheet = ih - (item.y + item.height);
                  const pinExportSelectionFooterAbove =
                    spaceBelowSheet < EXPORT_CANVAS_FOOTER_CLEARANCE_PX &&
                    item.y >= EXPORT_CANVAS_FOOTER_CLEARANCE_PX * 0.45;
                  const exportFooterHudStyle = getExportSelectionFooterHudStyle(
                    fit,
                    pinExportSelectionFooterAbove,
                    spaceBelowSheet,
                  );
                  const exportFooterHudLayoutStyle = getExportSelectionFooterHudLayoutStyle(item.width, fit);
                  const exportFooterHudCombinedStyle: React.CSSProperties = {
                    ...exportFooterHudLayoutStyle,
                    ...exportFooterHudStyle,
                  };
                  const exportFooterHudAboveStyle: React.CSSProperties = {
                    ...exportFooterHudCombinedStyle,
                    position: 'absolute',
                    left: 0,
                    bottom: 'calc(100% + 6px)',
                  };
                  const exportFooterHudBelowStyle: React.CSSProperties = {
                    ...exportFooterHudCombinedStyle,
                    position: 'absolute',
                    left: 0,
                    top: 'calc(100% + 6px)',
                  };

                  if (item.kind === 'analysis-harmony') {
                    const harmonyOptions = getCanvasAnalysisHarmonyOptions(item);
                    const harmonyVisualScale = item.analysisHarmonyVisualScale ?? 100;
                    const harmonyWheelMaxSizePx = Math.round(190 * (harmonyVisualScale / 100));
                    const harmonyChipFontPx = Math.max(8, Math.round(9 * (harmonyVisualScale / 100)));
                    const harmonyRoleLabels = ['P', 'S', 'A', 'A2'];
                    const harmonySwatches = colors.map((hex, idx) => ({
                      hex,
                      role: harmonyRoleLabels[idx] ?? String(idx + 1),
                      h: hexToHsl(hex).h,
                    }));
                    const harmonyAnalysis = evaluateChromaticHarmony({
                      P: colors[0] ? { hex: colors[0], label: 'Principal' } : undefined,
                      S: colors[1] ? { hex: colors[1], label: 'Secundario' } : undefined,
                      A: colors[2] ? { hex: colors[2], label: 'Acento' } : undefined,
                      A2: colors[3] ? { hex: colors[3], label: 'Acento 2' } : undefined,
                    });
                    const harmonyTypeTitle = harmonyAnalysis.bestPattern?.name ?? detectHarmonyLabel(colors);
                    const harmonyTypeDesc = harmonyAnalysis.bestPattern?.desc ?? harmonyAnalysis.scoreDesc;
                    const harmonyTypeScore = harmonyAnalysis.bestPattern?.score ?? harmonyAnalysis.score ?? 0;
                    return (
                      <div
                        key={item.id}
                        data-canvas-item-root
                        className="absolute flex flex-col"
                        style={{
                          boxSizing: 'border-box',
                          left: item.x,
                          top: item.y,
                          width: item.width,
                          overflow: 'visible',
                          zIndex: sel ? 30 : 2,
                        }}
                      >
                        {sel && editingCanvasId !== item.id && pinExportSelectionFooterAbove && (
                          <div
                            data-export-handle
                            className="pointer-events-auto absolute left-0 z-10 min-w-0"
                            style={exportFooterHudAboveStyle}
                            onPointerDown={(e) => e.stopPropagation()}
                          >
                            <ExportCanvasSelectionFooter
                              chrome={exportFooterChrome}
                              showTextControls={false}
                              sizePx={12}
                              currentAlign="left"
                              onBumpFont={() => undefined}
                              onSetAlign={() => undefined}
                              analysisHarmonyOptions={harmonyOptions}
                              onToggleAnalysisHarmonyOption={(option) =>
                                toggleCanvasAnalysisHarmonyOption(item.id, option)
                              }
                              visualScalePercent={harmonyVisualScale}
                              onBumpVisualScale={(delta) => bumpCanvasAnalysisHarmonyVisualScale(item.id, delta)}
                              onAlignBlockInSheet={(mode) => alignCanvasBlockInSheet(item.id, iw, ih, mode)}
                            />
                          </div>
                        )}
                        <div
                          data-canvas-block
                          className={`relative transition-shadow ${
                            sel ? 'ring-2 ring-amber-400/80 ring-offset-1 ring-offset-transparent' : ''
                          }`}
                          style={{
                            boxSizing: 'border-box',
                            width: '100%',
                            height: item.height,
                            display: 'block',
                            overflow: 'visible',
                            cursor: 'grab',
                          }}
                          onPointerDown={(e) => {
                            if ((e.target as HTMLElement).closest('[data-export-handle]')) return;
                            setSelectedCanvasId(item.id);
                            beginDragCanvasItem(e, item.id, iw, ih, fit);
                          }}
                        >
                          <div
                            className={`rounded-lg ${showBorder ? 'shadow-sm' : ''}`}
                            style={{
                              position: 'absolute',
                              left: 0,
                              top: 0,
                              width: '100%',
                              height: '100%',
                              boxSizing: 'border-box',
                              overflow: 'hidden',
                              background: getElementCardBackground(),
                              border: showBorder
                                ? background === 'white'
                                  ? '1px solid rgba(0,0,0,0.08)'
                                  : '1px solid rgba(255,255,255,0.1)'
                                : 'none',
                              display: 'block',
                              padding: 10,
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                              <svg
                                className="h-3.5 w-3.5 shrink-0"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke={subtextColor}
                                strokeWidth={1.8}
                                aria-hidden
                              >
                                <path d="M12 3l2.5 4.5L19.5 10l-4 3.5.8 5.2L12 16.6 7.7 18.7l.8-5.2-4-3.5 5-2.5L12 3z" />
                              </svg>
                              <div
                                style={{
                                  color: textColor,
                                  fontFamily: EXPORT_TITLE_FONT_STACK,
                                  fontSize: 12,
                                  fontWeight: 700,
                                  lineHeight: '14px',
                                }}
                              >
                                Armonía
                              </div>
                            </div>
                            <div style={{ marginTop: 8, display: 'flex', flexDirection: 'column', gap: 8 }}>
                              {harmonyOptions.map((option) => {
                                if (option === 'tone-wheel') {
                                  if (harmonySwatches.length === 0) return null;
                                  return (
                                    <div key={`${item.id}-opt-wheel`}>
                                      <div
                                        className="relative mx-auto aspect-square w-full"
                                        style={{ maxWidth: `${harmonyWheelMaxSizePx}px` }}
                                      >
                                        <div
                                          className="absolute inset-0 rounded-full"
                                          style={{
                                            background:
                                              'conic-gradient(from 0deg, hsl(0,100%,50%), hsl(30,100%,50%), hsl(60,100%,50%), hsl(90,100%,50%), hsl(120,100%,50%), hsl(150,100%,50%), hsl(180,100%,50%), hsl(210,100%,50%), hsl(240,100%,50%), hsl(270,100%,50%), hsl(300,100%,50%), hsl(330,100%,50%), hsl(360,100%,50%))',
                                          }}
                                        />
                                        <div
                                          className="absolute inset-[20%] rounded-full"
                                          style={{
                                            background: background === 'white' ? 'rgba(248,250,252,0.96)' : 'rgba(15,23,42,0.96)',
                                            border:
                                              background === 'white'
                                                ? '1px solid rgba(0,0,0,0.08)'
                                                : '1px solid rgba(148,163,184,0.35)',
                                          }}
                                        />
                                        {harmonySwatches.map((swatch) => {
                                          const pos = harmonyWheelMarkerPosition(swatch.h);
                                          return (
                                            <div
                                              key={`${item.id}-wheel-${swatch.role}`}
                                              className="absolute -translate-x-1/2 -translate-y-1/2"
                                              style={{ left: pos.left, top: pos.top }}
                                            >
                                              <div
                                                className="h-5 w-5 rounded-full border border-white shadow-[0_0_0_1px_rgba(0,0,0,0.3)]"
                                                style={{ backgroundColor: swatch.hex }}
                                                title={`${Math.round(swatch.h)}°`}
                                              />
                                            </div>
                                          );
                                        })}
                                        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" aria-hidden>
                                          {harmonySwatches.map((swatch) => {
                                            const pos = harmonyWheelMarkerPosition(swatch.h);
                                            const x = Number.parseFloat(pos.left);
                                            const y = Number.parseFloat(pos.top);
                                            return (
                                              <line
                                                key={`${item.id}-ray-${swatch.role}`}
                                                x1="50"
                                                y1="50"
                                                x2={x}
                                                y2={y}
                                                stroke={swatch.hex}
                                                strokeWidth="1"
                                                strokeOpacity="0.9"
                                                strokeDasharray="1.6 1.8"
                                              />
                                            );
                                          })}
                                        </svg>
                                      </div>
                                    </div>
                                  );
                                }
                                if (option === 'degrees') {
                                  if (harmonySwatches.length === 0) return null;
                                  return (
                                    <div
                                      key={`${item.id}-opt-degrees`}
                                      style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 6 }}
                                    >
                                      {harmonySwatches.map((swatch) => (
                                        <div
                                          key={`${item.id}-deg-${swatch.role}`}
                                          style={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: 4,
                                            borderRadius: 9999,
                                            padding: '2px 6px',
                                            border:
                                              background === 'white'
                                                ? '1px solid rgba(0,0,0,0.08)'
                                                : '1px solid rgba(148,163,184,0.35)',
                                            background:
                                              background === 'white'
                                                ? 'rgba(255,255,255,0.7)'
                                                : 'rgba(15,23,42,0.65)',
                                            color: textColor,
                                            fontFamily: EXPORT_TITLE_FONT_STACK,
                                            fontSize: harmonyChipFontPx,
                                            lineHeight: '12px',
                                          }}
                                        >
                                          <span
                                            style={{
                                              width: 8,
                                              height: 8,
                                              borderRadius: 9999,
                                              backgroundColor: swatch.hex,
                                              border: '1px solid rgba(255,255,255,0.5)',
                                            }}
                                          />
                                          {Math.round(swatch.h)}°
                                        </div>
                                      ))}
                                    </div>
                                  );
                                }
                                if (option === 'type') {
                                  return (
                                    <div
                                      key={`${item.id}-opt-type`}
                                      style={{
                                        border:
                                          background === 'white'
                                            ? '1px solid rgba(0,0,0,0.1)'
                                            : '1px solid rgba(148,163,184,0.25)',
                                        borderRadius: 10,
                                        padding: '7px 8px',
                                        background:
                                          background === 'white'
                                            ? 'rgba(255,255,255,0.65)'
                                            : 'rgba(15,23,42,0.45)',
                                      }}
                                    >
                                      <div
                                        style={{
                                          display: 'flex',
                                          flexWrap: 'wrap',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          gap: 6,
                                          textAlign: 'center',
                                        }}
                                      >
                                        <span
                                          style={{
                                            color: textColor,
                                            fontFamily: EXPORT_TITLE_FONT_STACK,
                                            fontSize: 10,
                                            fontWeight: 700,
                                            lineHeight: '13px',
                                            whiteSpace: 'nowrap',
                                          }}
                                        >
                                          {harmonyTypeTitle}
                                        </span>
                                        <span
                                          style={{
                                            color: subtextColor,
                                            fontFamily: EXPORT_TITLE_FONT_STACK,
                                            fontSize: 9,
                                            lineHeight: '12px',
                                            whiteSpace: 'nowrap',
                                          }}
                                        >
                                          {harmonyTypeDesc}
                                        </span>
                                        <span
                                          style={{
                                            color: textColor,
                                            fontFamily: EXPORT_TITLE_FONT_STACK,
                                            fontSize: 9,
                                            fontWeight: 700,
                                            lineHeight: '12px',
                                            whiteSpace: 'nowrap',
                                            padding: '1px 6px',
                                            borderRadius: 9999,
                                            border:
                                              background === 'white'
                                                ? '1px solid rgba(0,0,0,0.12)'
                                                : '1px solid rgba(148,163,184,0.35)',
                                          }}
                                        >
                                          {harmonyTypeScore}%
                                        </span>
                                      </div>
                                    </div>
                                  );
                                }
                                if (option === 'tone-spectrum') {
                                  if (harmonySwatches.length === 0) return null;
                                  return (
                                    <div key={`${item.id}-opt-spectrum`}>
                                      <div
                                        style={{
                                          color: subtextColor,
                                          fontFamily: EXPORT_TITLE_FONT_STACK,
                                          fontSize: 9,
                                          fontWeight: 700,
                                          lineHeight: '12px',
                                          marginBottom: 5,
                                        }}
                                      >
                                        Distribución de tonos en el espectro
                                      </div>
                                      <div
                                        style={{
                                          position: 'relative',
                                          height: 22,
                                          borderRadius: 8,
                                          border:
                                            background === 'white'
                                              ? '1px solid rgba(0,0,0,0.12)'
                                              : '1px solid rgba(148,163,184,0.35)',
                                          background:
                                            'linear-gradient(to right, hsl(0,100%,50%), hsl(30,100%,50%), hsl(60,100%,50%), hsl(90,100%,50%), hsl(120,100%,50%), hsl(150,100%,50%), hsl(180,100%,50%), hsl(210,100%,50%), hsl(240,100%,50%), hsl(270,100%,50%), hsl(300,100%,50%), hsl(330,100%,50%), hsl(360,100%,50%))',
                                        }}
                                      >
                                        {harmonySwatches.map((swatch, idx) => (
                                          <div
                                            key={`${item.id}-spectrum-marker-${swatch.role}-${idx}`}
                                            style={{
                                              position: 'absolute',
                                              left: `${(swatch.h / 360) * 100}%`,
                                              top: '50%',
                                              width: 6,
                                              height: 24,
                                              transform: 'translate(-50%, -50%)',
                                              borderRadius: 9999,
                                              border: '1px solid rgba(255,255,255,0.95)',
                                              backgroundColor: swatch.hex,
                                              boxShadow: '0 0 0 1px rgba(0,0,0,0.25)',
                                            }}
                                            title={`${swatch.role} · ${Math.round(swatch.h)}°`}
                                          />
                                        ))}
                                      </div>
                                    </div>
                                  );
                                }
                                return null;
                              })}
                            </div>
                          </div>
                          {sel && editingCanvasId !== item.id && (
                            <>
                              <button
                                type="button"
                                data-export-handle
                                className="absolute right-1 top-1 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white shadow-md hover:bg-red-500"
                                title="Eliminar"
                                onPointerDown={(e) => e.stopPropagation()}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCanvasItems((prev) => prev.filter((c) => c.id !== item.id));
                                  setSelectedCanvasId((cur) => (cur === item.id ? null : cur));
                                  setEditingCanvasId((cur) => (cur === item.id ? null : cur));
                                }}
                              >
                                ×
                              </button>
                              {renderCanvasResizeHandles(item.id, iw, ih, fit)}
                            </>
                          )}
                        </div>
                        {sel && editingCanvasId !== item.id && !pinExportSelectionFooterAbove && (
                          <div
                            data-export-handle
                            className="pointer-events-auto absolute left-0 z-10 min-w-0"
                            style={exportFooterHudBelowStyle}
                            onPointerDown={(e) => e.stopPropagation()}
                          >
                            <ExportCanvasSelectionFooter
                              chrome={exportFooterChrome}
                              showTextControls={false}
                              sizePx={12}
                              currentAlign="left"
                              onBumpFont={() => undefined}
                              onSetAlign={() => undefined}
                              analysisHarmonyOptions={harmonyOptions}
                              onToggleAnalysisHarmonyOption={(option) =>
                                toggleCanvasAnalysisHarmonyOption(item.id, option)
                              }
                              visualScalePercent={harmonyVisualScale}
                              onBumpVisualScale={(delta) => bumpCanvasAnalysisHarmonyVisualScale(item.id, delta)}
                              onAlignBlockInSheet={(mode) => alignCanvasBlockInSheet(item.id, iw, ih, mode)}
                            />
                          </div>
                        )}
                      </div>
                    );
                  }

                  if (item.kind === 'analysis-temperature') {
                    const temperatureOptions = getCanvasAnalysisTemperatureOptions(item);
                    const temperatureRoleMap = {
                      P: colors[0] ? { hex: colors[0], label: 'Principal' } : undefined,
                      S: colors[1] ? { hex: colors[1], label: 'Secundario' } : undefined,
                      A: colors[2] ? { hex: colors[2], label: 'Acento' } : undefined,
                      A2: colors[3] ? { hex: colors[3], label: 'Acento 2' } : undefined,
                      F: secondaryColors[0] ? { hex: secondaryColors[0], label: 'Fondo' } : undefined,
                    };
                    const temperatureAnalysis = evaluateTemperatureHarmony(temperatureRoleMap);
                    const temperatureSwatches = temperatureAnalysis.swatches;
                    const atmosphere = buildExportTemperatureAtmosphere(
                      temperatureSwatches.map((sw) => sw.hex),
                      temperatureAnalysis.avgWC,
                    );
                    const distributionSegments: { key: string; pct: number; color: string; label: string }[] = [
                      { key: 'cool', pct: temperatureAnalysis.coolPct, color: '#0ea5e9', label: 'Fríos' },
                      { key: 'neutral', pct: temperatureAnalysis.neutralPct, color: '#64748b', label: 'Neutros' },
                      { key: 'warm', pct: temperatureAnalysis.warmPct, color: '#f97316', label: 'Cálidos' },
                    ].filter((seg) => seg.pct > 0);
                    return (
                      <div
                        key={item.id}
                        data-canvas-item-root
                        className="absolute flex flex-col"
                        style={{
                          boxSizing: 'border-box',
                          left: item.x,
                          top: item.y,
                          width: item.width,
                          overflow: 'visible',
                          zIndex: sel ? 30 : 2,
                        }}
                      >
                        {sel && editingCanvasId !== item.id && pinExportSelectionFooterAbove && (
                          <div
                            data-export-handle
                            className="pointer-events-auto absolute left-0 z-10 min-w-0"
                            style={exportFooterHudAboveStyle}
                            onPointerDown={(e) => e.stopPropagation()}
                          >
                            <ExportCanvasSelectionFooter
                              chrome={exportFooterChrome}
                              showTextControls={false}
                              sizePx={12}
                              currentAlign="left"
                              onBumpFont={() => undefined}
                              onSetAlign={() => undefined}
                              analysisTemperatureOptions={temperatureOptions}
                              onToggleAnalysisTemperatureOption={(option) =>
                                toggleCanvasAnalysisTemperatureOption(item.id, option)
                              }
                              onAlignBlockInSheet={(mode) => alignCanvasBlockInSheet(item.id, iw, ih, mode)}
                            />
                          </div>
                        )}
                        <div
                          data-canvas-block
                          className={`relative transition-shadow ${
                            sel ? 'ring-2 ring-amber-400/80 ring-offset-1 ring-offset-transparent' : ''
                          }`}
                          style={{
                            boxSizing: 'border-box',
                            width: '100%',
                            height: item.height,
                            display: 'block',
                            overflow: 'visible',
                            cursor: 'grab',
                          }}
                          onPointerDown={(e) => {
                            if ((e.target as HTMLElement).closest('[data-export-handle]')) return;
                            setSelectedCanvasId(item.id);
                            beginDragCanvasItem(e, item.id, iw, ih, fit);
                          }}
                        >
                          <div
                            className={`rounded-lg ${showBorder ? 'shadow-sm' : ''}`}
                            style={{
                              position: 'absolute',
                              left: 0,
                              top: 0,
                              width: '100%',
                              height: '100%',
                              boxSizing: 'border-box',
                              overflow: 'hidden',
                              background: getElementCardBackground(),
                              border: showBorder
                                ? background === 'white'
                                  ? '1px solid rgba(0,0,0,0.08)'
                                  : '1px solid rgba(255,255,255,0.1)'
                                : 'none',
                              display: 'block',
                              padding: 10,
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                              <svg
                                className="h-3.5 w-3.5 shrink-0"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke={subtextColor}
                                strokeWidth={1.8}
                                aria-hidden
                              >
                                <path d="M4 15l4.5-4.5 3.5 3.5L20 6" />
                                <path d="M3 19h18" />
                              </svg>
                              <div
                                style={{
                                  color: textColor,
                                  fontFamily: EXPORT_TITLE_FONT_STACK,
                                  fontSize: 12,
                                  fontWeight: 700,
                                  lineHeight: '14px',
                                }}
                              >
                                Temperatura
                              </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                              {temperatureOptions.map((option) => {
                                if (option === 'landscape') {
                                  return (
                                    <div
                                      key={`${item.id}-temp-opt-landscape`}
                                      style={{
                                        position: 'relative',
                                        width: '100%',
                                        aspectRatio: '16 / 10',
                                        overflow: 'hidden',
                                        borderRadius: 8,
                                        background: `linear-gradient(180deg, ${atmosphere.c1} 0%, ${atmosphere.c2} 52%, ${atmosphere.c3} 100%)`,
                                      }}
                                    >
                                      <div
                                        style={{
                                          position: 'absolute',
                                          left: '50%',
                                          top: '35%',
                                          width: 104,
                                          height: 104,
                                          borderRadius: 9999,
                                          transform: 'translate(-50%, -50%)',
                                          background: `radial-gradient(circle, rgba(${atmosphere.auraRgb},0.36) 0%, transparent 70%)`,
                                        }}
                                      />
                                      <div
                                        style={{
                                          position: 'absolute',
                                          left: '50%',
                                          top: '35%',
                                          width: 52,
                                          height: 52,
                                          borderRadius: 9999,
                                          transform: 'translate(-50%, -50%)',
                                          backgroundColor: atmosphere.sun,
                                        }}
                                      />
                                      <div style={{ position: 'absolute', insetInline: 0, bottom: 0, height: '34%' }}>
                                        <svg viewBox="0 0 800 200" preserveAspectRatio="none" className="h-full w-full">
                                          <polygon
                                            points="0,200 0,120 150,40 280,90 420,30 580,80 720,40 800,70 800,200"
                                            fill={atmosphere.darkHex}
                                            opacity={0.54}
                                          />
                                          <polygon
                                            points="0,200 0,160 100,100 220,140 360,80 500,130 640,90 800,120 800,200"
                                            fill={atmosphere.darkHex}
                                            opacity={0.95}
                                          />
                                        </svg>
                                      </div>
                                      <div
                                        style={{
                                          position: 'absolute',
                                          left: 8,
                                          top: 8,
                                          borderRadius: 9999,
                                          padding: '2px 8px',
                                          background: 'rgba(0,0,0,0.4)',
                                          color: '#ffffff',
                                          fontFamily: EXPORT_TITLE_FONT_STACK,
                                          fontSize: 9,
                                          fontWeight: 700,
                                          textTransform: 'uppercase',
                                          letterSpacing: '0.04em',
                                        }}
                                      >
                                        {atmosphere.tag}
                                      </div>
                                    </div>
                                  );
                                }
                                if (option === 'distribution') {
                                  return (
                                    <div
                                      key={`${item.id}-temp-opt-distribution`}
                                      style={{
                                        borderRadius: 8,
                                        padding: '6px 8px',
                                        border:
                                          background === 'white'
                                            ? '1px solid rgba(0,0,0,0.12)'
                                            : '1px solid rgba(148,163,184,0.3)',
                                        background:
                                          background === 'white'
                                            ? 'rgba(255,255,255,0.75)'
                                            : 'rgba(2,6,23,0.45)',
                                      }}
                                    >
                                      <div
                                        style={{
                                          display: 'flex',
                                          justifyContent: 'space-between',
                                          color: subtextColor,
                                          fontFamily: EXPORT_TITLE_FONT_STACK,
                                          fontSize: 9,
                                          fontWeight: 700,
                                          textTransform: 'uppercase',
                                          marginBottom: 6,
                                        }}
                                      >
                                        <span style={{ color: '#38bdf8' }}>Frío</span>
                                        <span>Neutro</span>
                                        <span style={{ color: '#fb923c' }}>Cálido</span>
                                      </div>
                                      <div
                                        style={{
                                          position: 'relative',
                                          height: 12,
                                          borderRadius: 9999,
                                          background: 'linear-gradient(90deg,#0ea5e9 0%,#64748b 50%,#f97316 100%)',
                                        }}
                                      >
                                        {temperatureSwatches.map((swatch) => (
                                          <div
                                            key={`${item.id}-temp-swatch-${swatch.role}`}
                                            style={{
                                              position: 'absolute',
                                              left: `${wcToSpectrumPercent(swatch.wc)}%`,
                                              top: '50%',
                                              transform: 'translate(-50%, -50%)',
                                              width: 15,
                                              height: 15,
                                              borderRadius: 9999,
                                              border:
                                                background === 'white'
                                                  ? '2px solid rgba(15,23,42,0.95)'
                                                  : '2px solid rgba(2,6,23,0.95)',
                                              backgroundColor: swatch.hex,
                                              boxShadow: '0 1px 2px rgba(0,0,0,0.35)',
                                            }}
                                            title={`${swatch.role} · WC ${swatch.wc.toFixed(2)}`}
                                          />
                                        ))}
                                      </div>
                                    </div>
                                  );
                                }
                                if (option === 'distribution-percent') {
                                  return (
                                    <div
                                      key={`${item.id}-temp-opt-distribution-percent`}
                                      style={{
                                        borderRadius: 8,
                                        padding: '6px 8px',
                                        border:
                                          background === 'white'
                                            ? '1px solid rgba(0,0,0,0.12)'
                                            : '1px solid rgba(148,163,184,0.3)',
                                        background:
                                          background === 'white'
                                            ? 'rgba(255,255,255,0.75)'
                                            : 'rgba(2,6,23,0.45)',
                                      }}
                                    >
                                      <div
                                        style={{
                                          height: 22,
                                          width: '100%',
                                          display: 'flex',
                                          overflow: 'hidden',
                                          borderRadius: 6,
                                          border:
                                            background === 'white'
                                              ? '1px solid rgba(0,0,0,0.12)'
                                              : '1px solid rgba(148,163,184,0.25)',
                                        }}
                                      >
                                        {distributionSegments.map((segment) => (
                                          <div
                                            key={`${item.id}-temp-seg-${segment.key}`}
                                            style={{
                                              width: `${segment.pct}%`,
                                              backgroundColor: segment.color,
                                              color: '#e2e8f0',
                                              display: 'flex',
                                              alignItems: 'center',
                                              justifyContent: 'center',
                                              fontFamily: EXPORT_TITLE_FONT_STACK,
                                              fontSize: 10,
                                              fontWeight: 700,
                                            }}
                                          >
                                            {segment.pct >= 14 ? `${Math.round(segment.pct)}%` : ''}
                                          </div>
                                        ))}
                                      </div>
                                      <div
                                        style={{
                                          marginTop: 4,
                                          display: 'flex',
                                          justifyContent: 'space-between',
                                          color: subtextColor,
                                          fontFamily: EXPORT_TITLE_FONT_STACK,
                                          fontSize: 9,
                                          lineHeight: '11px',
                                        }}
                                      >
                                        <span>Fríos {Math.round(temperatureAnalysis.coolPct)}%</span>
                                        <span>Neutros {Math.round(temperatureAnalysis.neutralPct)}%</span>
                                        <span>Cálidos {Math.round(temperatureAnalysis.warmPct)}%</span>
                                      </div>
                                    </div>
                                  );
                                }
                                return null;
                              })}
                              {temperatureOptions.length === 0 && (
                                <div
                                  style={{
                                    borderRadius: 8,
                                    minHeight: 48,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: subtextColor,
                                    fontFamily: EXPORT_TITLE_FONT_STACK,
                                    fontSize: 11,
                                    border:
                                      background === 'white'
                                        ? '1px dashed rgba(0,0,0,0.18)'
                                        : '1px dashed rgba(148,163,184,0.35)',
                                  }}
                                >
                                  Activa "Paisaje", "Distribución" o "Distribución%"
                                </div>
                              )}
                            </div>
                          </div>
                          {sel && editingCanvasId !== item.id && (
                            <>
                              <button
                                type="button"
                                data-export-handle
                                className="absolute right-1 top-1 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white shadow-md hover:bg-red-500"
                                title="Eliminar"
                                onPointerDown={(e) => e.stopPropagation()}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCanvasItems((prev) => prev.filter((c) => c.id !== item.id));
                                  setSelectedCanvasId((cur) => (cur === item.id ? null : cur));
                                  setEditingCanvasId((cur) => (cur === item.id ? null : cur));
                                }}
                              >
                                ×
                              </button>
                              {renderCanvasResizeHandles(item.id, iw, ih, fit)}
                            </>
                          )}
                        </div>
                        {sel && editingCanvasId !== item.id && !pinExportSelectionFooterAbove && (
                          <div
                            data-export-handle
                            className="pointer-events-auto absolute left-0 z-10 min-w-0"
                            style={exportFooterHudBelowStyle}
                            onPointerDown={(e) => e.stopPropagation()}
                          >
                            <ExportCanvasSelectionFooter
                              chrome={exportFooterChrome}
                              showTextControls={false}
                              sizePx={12}
                              currentAlign="left"
                              onBumpFont={() => undefined}
                              onSetAlign={() => undefined}
                              analysisTemperatureOptions={temperatureOptions}
                              onToggleAnalysisTemperatureOption={(option) =>
                                toggleCanvasAnalysisTemperatureOption(item.id, option)
                              }
                              onAlignBlockInSheet={(mode) => alignCanvasBlockInSheet(item.id, iw, ih, mode)}
                            />
                          </div>
                        )}
                      </div>
                    );
                  }

                  if (item.kind === 'analysis-focus') {
                    const focusOptions = getCanvasAnalysisFocusOptions(item);
                    const focusVisualScale = item.analysisFocusVisualScale ?? 100;
                    const focusRoleMap = {
                      P: colors[0] ? { hex: colors[0], label: 'Principal' } : undefined,
                      S: colors[1] ? { hex: colors[1], label: 'Secundario' } : undefined,
                      A: colors[2] ? { hex: colors[2], label: 'Acento' } : undefined,
                      A2: colors[3] ? { hex: colors[3], label: 'Acento 2' } : undefined,
                      F: secondaryColors[0] ? { hex: secondaryColors[0], label: 'Fondo' } : undefined,
                    };
                    const focusAnalysis = evaluateVibrancy(focusRoleMap);
                    const focusSwatches = focusAnalysis.swatches;
                    const focusDistSegments: { key: string; pct: number; color: string; label: string }[] = [
                      { key: 'muted', pct: focusAnalysis.mutedPct, color: '#64748b', label: 'Apagados' },
                      { key: 'medium', pct: focusAnalysis.mediumPct, color: '#a78bfa', label: 'Medios' },
                      { key: 'vibrant', pct: focusAnalysis.vibrantPct, color: '#d946ef', label: 'Vibrantes' },
                    ].filter((seg) => seg.pct > 0);
                    return (
                      <div
                        key={item.id}
                        data-canvas-item-root
                        className="absolute flex flex-col"
                        style={{
                          boxSizing: 'border-box',
                          left: item.x,
                          top: item.y,
                          width: item.width,
                          overflow: 'visible',
                          zIndex: sel ? 30 : 2,
                        }}
                      >
                        {sel && editingCanvasId !== item.id && pinExportSelectionFooterAbove && (
                          <div
                            data-export-handle
                            className="pointer-events-auto absolute left-0 z-10 min-w-0"
                            style={exportFooterHudAboveStyle}
                            onPointerDown={(e) => e.stopPropagation()}
                          >
                            <ExportCanvasSelectionFooter
                              chrome={exportFooterChrome}
                              showTextControls={false}
                              sizePx={12}
                              currentAlign="left"
                              onBumpFont={() => undefined}
                              onSetAlign={() => undefined}
                              analysisFocusOptions={focusOptions}
                              onToggleAnalysisFocusOption={(option) =>
                                toggleCanvasAnalysisFocusOption(item.id, option)
                              }
                              visualScalePercent={focusVisualScale}
                              onBumpVisualScale={(delta) => bumpCanvasAnalysisFocusVisualScale(item.id, delta)}
                              onAlignBlockInSheet={(mode) => alignCanvasBlockInSheet(item.id, iw, ih, mode)}
                            />
                          </div>
                        )}
                        <div
                          data-canvas-block
                          className={`relative transition-shadow ${
                            sel ? 'ring-2 ring-amber-400/80 ring-offset-1 ring-offset-transparent' : ''
                          }`}
                          style={{
                            boxSizing: 'border-box',
                            width: '100%',
                            height: item.height,
                            display: 'block',
                            overflow: 'visible',
                            cursor: 'grab',
                          }}
                          onPointerDown={(e) => {
                            if ((e.target as HTMLElement).closest('[data-export-handle]')) return;
                            setSelectedCanvasId(item.id);
                            beginDragCanvasItem(e, item.id, iw, ih, fit);
                          }}
                        >
                          <div
                            className={`rounded-lg ${showBorder ? 'shadow-sm' : ''}`}
                            style={{
                              position: 'absolute',
                              left: 0,
                              top: 0,
                              width: '100%',
                              height: '100%',
                              boxSizing: 'border-box',
                              overflow: 'hidden',
                              background: getElementCardBackground(),
                              border: showBorder
                                ? background === 'white'
                                  ? '1px solid rgba(0,0,0,0.08)'
                                  : '1px solid rgba(255,255,255,0.1)'
                                : 'none',
                              display: 'block',
                              padding: 10,
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                              <svg
                                className="h-3.5 w-3.5 shrink-0"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke={subtextColor}
                                strokeWidth={1.8}
                                aria-hidden
                              >
                                <circle cx="12" cy="12" r="7" />
                                <circle cx="12" cy="12" r="2.2" />
                                <path d="M12 3v2.2M12 18.8V21M3 12h2.2M18.8 12H21" />
                              </svg>
                              <div
                                style={{
                                  color: textColor,
                                  fontFamily: EXPORT_TITLE_FONT_STACK,
                                  fontSize: 12,
                                  fontWeight: 700,
                                  lineHeight: '14px',
                                }}
                              >
                                Focus
                              </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                              {focusOptions.map((option) => {
                                if (option === 'energy') {
                                  return (
                                    <div
                                      key={`${item.id}-focus-opt-energy`}
                                      style={{
                                        position: 'relative',
                                        width: '100%',
                                        aspectRatio: '16 / 7.4',
                                        overflow: 'hidden',
                                        borderRadius: 8,
                                        border:
                                          background === 'white'
                                            ? '1px solid rgba(0,0,0,0.12)'
                                            : '1px solid rgba(148,163,184,0.35)',
                                        background:
                                          'radial-gradient(ellipse at center, rgba(30,35,60,0.95) 0%, #0a0e1a 78%)',
                                      }}
                                    >
                                      <div
                                        style={{
                                          position: 'absolute',
                                          left: 8,
                                          top: 8,
                                          borderRadius: 9999,
                                          padding: '2px 8px',
                                          background: 'rgba(0,0,0,0.45)',
                                          color: '#ffffff',
                                          fontFamily: EXPORT_TITLE_FONT_STACK,
                                          fontSize: 9,
                                          fontWeight: 700,
                                          textTransform: 'uppercase',
                                          letterSpacing: '0.04em',
                                        }}
                                      >
                                        {focusSwatches.length
                                          ? `${focusAnalysis.colorfulnessLabel.toUpperCase()} · M=${focusAnalysis.colorfulnessVal.toFixed(1)}`
                                          : 'SIN MUESTRAS'}
                                      </div>
                                      <div
                                        style={{
                                          display: 'flex',
                                          width: '100%',
                                          height: '100%',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          gap: 10,
                                          padding: '18px 10px 10px',
                                        }}
                                      >
                                        {focusSwatches.map((swatch) => {
                                          const chroma = swatch.chromaPct;
                                          const focusScaleFactor = focusVisualScale / 100;
                                          const orbSize = (16 + (chroma / 100) * 30) * focusScaleFactor;
                                          const glowSize = orbSize * 1.6;
                                          const glowOpacity = Math.min(
                                            0.95,
                                            (0.24 + (chroma / 100) * 0.58) * (0.85 + focusScaleFactor * 0.15),
                                          );
                                          const glowBlur = (6 + (chroma / 100) * 16) * focusScaleFactor;
                                          const isAccent = swatch.role === 'A' || swatch.role === 'A2';
                                          return (
                                            <div
                                              key={`${item.id}-focus-energy-${swatch.role}`}
                                              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
                                            >
                                              <div
                                                style={{
                                                  position: 'relative',
                                                  width: glowSize,
                                                  height: glowSize,
                                                  display: 'flex',
                                                  alignItems: 'center',
                                                  justifyContent: 'center',
                                                }}
                                              >
                                                <div
                                                  style={{
                                                    position: 'absolute',
                                                    inset: 0,
                                                    borderRadius: 9999,
                                                    background: swatch.hex,
                                                    opacity: glowOpacity,
                                                    filter: `blur(${glowBlur}px)`,
                                                  }}
                                                />
                                                <div
                                                  style={{
                                                    position: 'relative',
                                                    width: orbSize,
                                                    height: orbSize,
                                                    borderRadius: 9999,
                                                    backgroundColor: swatch.hex,
                                                    boxShadow: `0 0 ${glowBlur}px ${swatch.hex}`,
                                                    border: isAccent ? '1px solid rgba(34,211,238,0.8)' : '1px solid rgba(255,255,255,0.28)',
                                                  }}
                                                />
                                              </div>
                                              <span
                                                style={{
                                                  color: isAccent ? '#22d3ee' : subtextColor,
                                                  fontFamily: EXPORT_TITLE_FONT_STACK,
                                                  fontSize: 10,
                                                  fontWeight: 700,
                                                  lineHeight: '11px',
                                                }}
                                              >
                                                {swatch.role}
                                              </span>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  );
                                }
                                if (option === 'distribution') {
                                  return (
                                    <div
                                      key={`${item.id}-focus-opt-distribution`}
                                      style={{
                                        borderRadius: 8,
                                        padding: '6px 8px',
                                        border:
                                          background === 'white'
                                            ? '1px solid rgba(0,0,0,0.12)'
                                            : '1px solid rgba(148,163,184,0.3)',
                                        background:
                                          background === 'white'
                                            ? 'rgba(255,255,255,0.75)'
                                            : 'rgba(2,6,23,0.45)',
                                      }}
                                    >
                                      <div
                                        style={{
                                          display: 'flex',
                                          justifyContent: 'space-between',
                                          color: subtextColor,
                                          fontFamily: EXPORT_TITLE_FONT_STACK,
                                          fontSize: 9,
                                          fontWeight: 700,
                                          textTransform: 'uppercase',
                                          marginBottom: 6,
                                        }}
                                      >
                                        <span>Apagado</span>
                                        <span>Medio</span>
                                        <span style={{ color: '#d946ef' }}>Vibrante</span>
                                      </div>
                                      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                        {focusSwatches.map((swatch) => {
                                          const isAccent = swatch.role === 'A' || swatch.role === 'A2';
                                          return (
                                            <div
                                              key={`${item.id}-focus-dist-${swatch.role}`}
                                              style={{ display: 'flex', alignItems: 'center', gap: 7 }}
                                            >
                                              <span
                                                style={{
                                                  width: 16,
                                                  color: isAccent ? '#67e8f9' : subtextColor,
                                                  fontFamily: EXPORT_TITLE_FONT_STACK,
                                                  fontSize: 10,
                                                  fontWeight: 700,
                                                }}
                                              >
                                                {swatch.role}
                                              </span>
                                              <div
                                                style={{
                                                  position: 'relative',
                                                  height: 10,
                                                  flex: 1,
                                                  borderRadius: 9999,
                                                  overflow: 'hidden',
                                                  background:
                                                    'linear-gradient(90deg, rgba(100,116,139,0.34) 0%, rgba(167,139,250,0.34) 50%, rgba(217,70,239,0.34) 100%)',
                                                }}
                                              >
                                                <div
                                                  style={{
                                                    height: '100%',
                                                    width: `${swatch.chromaPct}%`,
                                                    borderRadius: 9999,
                                                    backgroundColor: swatch.hex,
                                                    boxShadow: `0 0 8px ${swatch.hex}`,
                                                  }}
                                                />
                                              </div>
                                              <span
                                                style={{
                                                  width: 20,
                                                  textAlign: 'right',
                                                  color: textColor,
                                                  fontFamily: EXPORT_TITLE_FONT_STACK,
                                                  fontSize: 10,
                                                  fontWeight: 700,
                                                }}
                                              >
                                                {swatch.chromaPct.toFixed(0)}
                                              </span>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  );
                                }
                                if (option === 'distribution-percent') {
                                  return (
                                    <div
                                      key={`${item.id}-focus-opt-distribution-percent`}
                                      style={{
                                        borderRadius: 8,
                                        padding: '6px 8px',
                                        border:
                                          background === 'white'
                                            ? '1px solid rgba(0,0,0,0.12)'
                                            : '1px solid rgba(148,163,184,0.3)',
                                        background:
                                          background === 'white'
                                            ? 'rgba(255,255,255,0.75)'
                                            : 'rgba(2,6,23,0.45)',
                                      }}
                                    >
                                      <div
                                        style={{
                                          height: 22,
                                          width: '100%',
                                          display: 'flex',
                                          overflow: 'hidden',
                                          borderRadius: 6,
                                          border:
                                            background === 'white'
                                              ? '1px solid rgba(0,0,0,0.12)'
                                              : '1px solid rgba(148,163,184,0.25)',
                                        }}
                                      >
                                        {focusDistSegments.map((segment) => (
                                          <div
                                            key={`${item.id}-focus-seg-${segment.key}`}
                                            style={{
                                              width: `${segment.pct}%`,
                                              backgroundColor: segment.color,
                                              color: '#f8fafc',
                                              display: 'flex',
                                              alignItems: 'center',
                                              justifyContent: 'center',
                                              fontFamily: EXPORT_TITLE_FONT_STACK,
                                              fontSize: 10,
                                              fontWeight: 700,
                                            }}
                                          >
                                            {segment.pct >= 14 ? `${Math.round(segment.pct)}%` : ''}
                                          </div>
                                        ))}
                                      </div>
                                      <div
                                        style={{
                                          marginTop: 4,
                                          display: 'flex',
                                          justifyContent: 'space-between',
                                          color: subtextColor,
                                          fontFamily: EXPORT_TITLE_FONT_STACK,
                                          fontSize: 9,
                                          lineHeight: '11px',
                                        }}
                                      >
                                        <span>Apagados {Math.round(focusAnalysis.mutedPct)}%</span>
                                        <span>Medios {Math.round(focusAnalysis.mediumPct)}%</span>
                                        <span>Vibrantes {Math.round(focusAnalysis.vibrantPct)}%</span>
                                      </div>
                                    </div>
                                  );
                                }
                                return null;
                              })}
                              {focusOptions.length === 0 && (
                                <div
                                  style={{
                                    borderRadius: 8,
                                    minHeight: 48,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: subtextColor,
                                    fontFamily: EXPORT_TITLE_FONT_STACK,
                                    fontSize: 11,
                                    border:
                                      background === 'white'
                                        ? '1px dashed rgba(0,0,0,0.18)'
                                        : '1px dashed rgba(148,163,184,0.35)',
                                  }}
                                >
                                  Activa "Energía", "Distribución" o "Distribución%"
                                </div>
                              )}
                            </div>
                          </div>
                          {sel && editingCanvasId !== item.id && (
                            <>
                              <button
                                type="button"
                                data-export-handle
                                className="absolute right-1 top-1 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white shadow-md hover:bg-red-500"
                                title="Eliminar"
                                onPointerDown={(e) => e.stopPropagation()}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCanvasItems((prev) => prev.filter((c) => c.id !== item.id));
                                  setSelectedCanvasId((cur) => (cur === item.id ? null : cur));
                                  setEditingCanvasId((cur) => (cur === item.id ? null : cur));
                                }}
                              >
                                ×
                              </button>
                              {renderCanvasResizeHandles(item.id, iw, ih, fit)}
                            </>
                          )}
                        </div>
                        {sel && editingCanvasId !== item.id && !pinExportSelectionFooterAbove && (
                          <div
                            data-export-handle
                            className="pointer-events-auto absolute left-0 z-10 min-w-0"
                            style={exportFooterHudBelowStyle}
                            onPointerDown={(e) => e.stopPropagation()}
                          >
                            <ExportCanvasSelectionFooter
                              chrome={exportFooterChrome}
                              showTextControls={false}
                              sizePx={12}
                              currentAlign="left"
                              onBumpFont={() => undefined}
                              onSetAlign={() => undefined}
                              analysisFocusOptions={focusOptions}
                              onToggleAnalysisFocusOption={(option) =>
                                toggleCanvasAnalysisFocusOption(item.id, option)
                              }
                              visualScalePercent={focusVisualScale}
                              onBumpVisualScale={(delta) => bumpCanvasAnalysisFocusVisualScale(item.id, delta)}
                              onAlignBlockInSheet={(mode) => alignCanvasBlockInSheet(item.id, iw, ih, mode)}
                            />
                          </div>
                        )}
                      </div>
                    );
                  }

                  if (item.kind === 'analysis-lightness') {
                    const lightnessOptions = getCanvasAnalysisLightnessOptions(item);
                    const lightnessRoleMap = {
                      P: colors[0] ? { hex: colors[0], label: 'Principal' } : undefined,
                      S: colors[1] ? { hex: colors[1], label: 'Secundario' } : undefined,
                      A: colors[2] ? { hex: colors[2], label: 'Acento' } : undefined,
                      A2: colors[3] ? { hex: colors[3], label: 'Acento 2' } : undefined,
                      F: secondaryColors[0] ? { hex: secondaryColors[0], label: 'Fondo' } : undefined,
                      T: { hex: textColor, label: 'Texto' },
                    };
                    const lightnessAnalysis = evaluateLightnessBalance(lightnessRoleMap);
                    const lightnessSorted = lightnessAnalysis.sorted;
                    return (
                      <div
                        key={item.id}
                        data-canvas-item-root
                        className="absolute flex flex-col"
                        style={{
                          boxSizing: 'border-box',
                          left: item.x,
                          top: item.y,
                          width: item.width,
                          overflow: 'visible',
                          zIndex: sel ? 30 : 2,
                        }}
                      >
                        {sel && editingCanvasId !== item.id && pinExportSelectionFooterAbove && (
                          <div
                            data-export-handle
                            className="pointer-events-auto absolute left-0 z-10 min-w-0"
                            style={exportFooterHudAboveStyle}
                            onPointerDown={(e) => e.stopPropagation()}
                          >
                            <ExportCanvasSelectionFooter
                              chrome={exportFooterChrome}
                              showTextControls={false}
                              sizePx={12}
                              currentAlign="left"
                              onBumpFont={() => undefined}
                              onSetAlign={() => undefined}
                              analysisLightnessOptions={lightnessOptions}
                              onToggleAnalysisLightnessOption={(option) =>
                                toggleCanvasAnalysisLightnessOption(item.id, option)
                              }
                              onAlignBlockInSheet={(mode) => alignCanvasBlockInSheet(item.id, iw, ih, mode)}
                            />
                          </div>
                        )}
                        <div
                          data-canvas-block
                          className={`relative transition-shadow ${
                            sel ? 'ring-2 ring-amber-400/80 ring-offset-1 ring-offset-transparent' : ''
                          }`}
                          style={{
                            boxSizing: 'border-box',
                            width: '100%',
                            height: item.height,
                            display: 'block',
                            overflow: 'visible',
                            cursor: 'grab',
                          }}
                          onPointerDown={(e) => {
                            if ((e.target as HTMLElement).closest('[data-export-handle]')) return;
                            setSelectedCanvasId(item.id);
                            beginDragCanvasItem(e, item.id, iw, ih, fit);
                          }}
                        >
                          <div
                            className={`rounded-lg ${showBorder ? 'shadow-sm' : ''}`}
                            style={{
                              position: 'absolute',
                              left: 0,
                              top: 0,
                              width: '100%',
                              height: '100%',
                              boxSizing: 'border-box',
                              overflow: 'hidden',
                              background: getElementCardBackground(),
                              border: showBorder
                                ? background === 'white'
                                  ? '1px solid rgba(0,0,0,0.08)'
                                  : '1px solid rgba(255,255,255,0.1)'
                                : 'none',
                              display: 'block',
                              padding: 10,
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                              <svg
                                className="h-3.5 w-3.5 shrink-0"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke={subtextColor}
                                strokeWidth={1.8}
                                aria-hidden
                              >
                                <path d="M4 18h16" />
                                <path d="M6 18V8M10 18V5M14 18v-9M18 18v-12" />
                              </svg>
                              <div
                                style={{
                                  color: textColor,
                                  fontFamily: EXPORT_TITLE_FONT_STACK,
                                  fontSize: 12,
                                  fontWeight: 700,
                                  lineHeight: '14px',
                                }}
                              >
                                Luminosidad
                              </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                              {lightnessOptions.map((option) => {
                                if (option === 'stair') {
                                  return (
                                    <div
                                      key={`${item.id}-light-opt-stair`}
                                      style={{
                                        borderRadius: 8,
                                        padding: '6px 8px',
                                        border:
                                          background === 'white'
                                            ? '1px solid rgba(0,0,0,0.12)'
                                            : '1px solid rgba(148,163,184,0.3)',
                                        background:
                                          background === 'white'
                                            ? 'rgba(255,255,255,0.75)'
                                            : 'rgba(2,6,23,0.45)',
                                      }}
                                    >
                                      <div style={{ display: 'flex', minHeight: 90, gap: 6 }}>
                                        <div
                                          style={{
                                            width: 12,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                            color: subtextColor,
                                            fontFamily: EXPORT_TITLE_FONT_STACK,
                                            fontSize: 8,
                                            lineHeight: '9px',
                                          }}
                                        >
                                          <span>100</span>
                                          <span>75</span>
                                          <span>50</span>
                                          <span>25</span>
                                          <span>0</span>
                                        </div>
                                        <div style={{ flex: 1, display: 'flex', gap: 4, alignItems: 'end' }}>
                                          {lightnessSorted.map((swatch) => {
                                            const barMaxPx = 84;
                                            const h = Math.max(12, Math.round((swatch.lstar / 100) * barMaxPx));
                                            const fg = swatch.lstar >= 58 ? '#0f172a' : '#f8fafc';
                                            return (
                                              <div key={`${item.id}-lstar-${swatch.key}`} style={{ flex: 1, minWidth: 0 }}>
                                                <div
                                                  style={{
                                                    height: h,
                                                    borderRadius: '6px 6px 0 0',
                                                    backgroundColor: swatch.hex,
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'flex-start',
                                                    paddingTop: 2,
                                                  }}
                                                >
                                                  <span style={{ color: fg, fontFamily: EXPORT_TITLE_FONT_STACK, fontSize: 9, fontWeight: 700 }}>
                                                    {swatch.key}
                                                  </span>
                                                  <span style={{ color: fg, fontFamily: EXPORT_TITLE_FONT_STACK, fontSize: 8 }}>
                                                    {Math.round(swatch.lstar)}
                                                  </span>
                                                </div>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    </div>
                                  );
                                }
                                if (option === 'coverage') {
                                  return (
                                    <div
                                      key={`${item.id}-light-opt-coverage`}
                                      style={{
                                        borderRadius: 8,
                                        padding: '6px 8px',
                                        border:
                                          background === 'white'
                                            ? '1px solid rgba(0,0,0,0.12)'
                                            : '1px solid rgba(148,163,184,0.3)',
                                        background:
                                          background === 'white'
                                            ? 'rgba(255,255,255,0.75)'
                                            : 'rgba(2,6,23,0.45)',
                                      }}
                                    >
                                      <div
                                        style={{
                                          position: 'relative',
                                          height: 22,
                                          borderRadius: 9999,
                                          border:
                                            background === 'white'
                                              ? '1px solid rgba(0,0,0,0.12)'
                                              : '1px solid rgba(148,163,184,0.3)',
                                          background: 'linear-gradient(to right,#ffffff,#d1d5db,#9ca3af,#6b7280,#374151,#111827,#000000)',
                                        }}
                                      >
                                        {lightnessAnalysis.swatches.map((swatch) => {
                                          const x = 100 - Math.max(0, Math.min(100, swatch.lstar));
                                          return (
                                            <div
                                              key={`${item.id}-coverage-${swatch.key}`}
                                              style={{
                                                position: 'absolute',
                                                left: `${x}%`,
                                                top: '50%',
                                                width: 14,
                                                height: 14,
                                                borderRadius: 9999,
                                                transform: 'translate(-50%, -50%)',
                                                border: '2px solid rgba(255,255,255,0.95)',
                                                backgroundColor: swatch.hex,
                                                boxShadow: '0 0 0 1px rgba(0,0,0,0.35)',
                                              }}
                                              title={`${swatch.key} · L* ${Math.round(swatch.lstar)}`}
                                            />
                                          );
                                        })}
                                      </div>
                                      <div
                                        style={{
                                          marginTop: 4,
                                          display: 'flex',
                                          justifyContent: 'space-between',
                                          color: subtextColor,
                                          fontFamily: EXPORT_TITLE_FONT_STACK,
                                          fontSize: 8,
                                          lineHeight: '10px',
                                        }}
                                      >
                                        <span>L*100</span>
                                        <span>75</span>
                                        <span>50</span>
                                        <span>25</span>
                                        <span>L*0</span>
                                      </div>
                                    </div>
                                  );
                                }
                                if (option === 'grayscale') {
                                  return (
                                    <div
                                      key={`${item.id}-light-opt-grayscale`}
                                      style={{
                                        borderRadius: 8,
                                        padding: '6px 8px',
                                        border:
                                          background === 'white'
                                            ? '1px solid rgba(0,0,0,0.12)'
                                            : '1px solid rgba(148,163,184,0.3)',
                                        background:
                                          background === 'white'
                                            ? 'rgba(255,255,255,0.75)'
                                            : 'rgba(2,6,23,0.45)',
                                      }}
                                    >
                                      <div style={{ display: 'flex', gap: 4 }}>
                                        {lightnessSorted.map((swatch) => {
                                          const gray = grayHexFromLstar(swatch.lstar);
                                          const origFg = swatch.lstar >= 55 ? '#0f172a' : '#f8fafc';
                                          const grayFg = swatch.lstar >= 55 ? '#0f172a' : '#f8fafc';
                                          return (
                                            <div key={`${item.id}-gray-${swatch.key}`} style={{ flex: 1, minWidth: 0 }}>
                                              <div
                                                style={{
                                                  borderRadius: 6,
                                                  height: 19,
                                                  display: 'flex',
                                                  alignItems: 'center',
                                                  justifyContent: 'center',
                                                  backgroundColor: swatch.hex,
                                                  color: origFg,
                                                  fontFamily: EXPORT_TITLE_FONT_STACK,
                                                  fontSize: 9,
                                                  fontWeight: 700,
                                                }}
                                                title={`${swatch.key} · ${swatch.hex}`}
                                              >
                                                {swatch.key}
                                              </div>
                                              <div
                                                style={{
                                                  marginTop: 3,
                                                  borderRadius: 6,
                                                  height: 19,
                                                  display: 'flex',
                                                  alignItems: 'center',
                                                  justifyContent: 'center',
                                                  backgroundColor: gray,
                                                  color: grayFg,
                                                  fontFamily: EXPORT_TITLE_FONT_STACK,
                                                  fontSize: 9,
                                                  fontWeight: 700,
                                                }}
                                                title={`${swatch.key} · ${gray}`}
                                              >
                                                L*{Math.round(swatch.lstar)}
                                              </div>
                                              <div
                                                style={{
                                                  marginTop: 3,
                                                  color: subtextColor,
                                                  fontFamily: EXPORT_TITLE_FONT_STACK,
                                                  fontSize: 8,
                                                  textAlign: 'center',
                                                }}
                                              >
                                                {gray}
                                              </div>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  );
                                }
                                return null;
                              })}
                              {lightnessOptions.length === 0 && (
                                <div
                                  style={{
                                    borderRadius: 8,
                                    minHeight: 48,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: subtextColor,
                                    fontFamily: EXPORT_TITLE_FONT_STACK,
                                    fontSize: 11,
                                    border:
                                      background === 'white'
                                        ? '1px dashed rgba(0,0,0,0.18)'
                                        : '1px dashed rgba(148,163,184,0.35)',
                                  }}
                                >
                                  Activa "Escalera", "Cobertura" o "Grises"
                                </div>
                              )}
                            </div>
                          </div>
                          {sel && editingCanvasId !== item.id && (
                            <>
                              <button
                                type="button"
                                data-export-handle
                                className="absolute right-1 top-1 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white shadow-md hover:bg-red-500"
                                title="Eliminar"
                                onPointerDown={(e) => e.stopPropagation()}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCanvasItems((prev) => prev.filter((c) => c.id !== item.id));
                                  setSelectedCanvasId((cur) => (cur === item.id ? null : cur));
                                  setEditingCanvasId((cur) => (cur === item.id ? null : cur));
                                }}
                              >
                                ×
                              </button>
                              {renderCanvasResizeHandles(item.id, iw, ih, fit)}
                            </>
                          )}
                        </div>
                        {sel && editingCanvasId !== item.id && !pinExportSelectionFooterAbove && (
                          <div
                            data-export-handle
                            className="pointer-events-auto absolute left-0 z-10 min-w-0"
                            style={exportFooterHudBelowStyle}
                            onPointerDown={(e) => e.stopPropagation()}
                          >
                            <ExportCanvasSelectionFooter
                              chrome={exportFooterChrome}
                              showTextControls={false}
                              sizePx={12}
                              currentAlign="left"
                              onBumpFont={() => undefined}
                              onSetAlign={() => undefined}
                              analysisLightnessOptions={lightnessOptions}
                              onToggleAnalysisLightnessOption={(option) =>
                                toggleCanvasAnalysisLightnessOption(item.id, option)
                              }
                              onAlignBlockInSheet={(mode) => alignCanvasBlockInSheet(item.id, iw, ih, mode)}
                            />
                          </div>
                        )}
                      </div>
                    );
                  }

                  if (item.kind === 'analysis-cvd') {
                    const cvdOptions = getCanvasAnalysisCvdOptions(item);
                    const cvdVisualScale = item.analysisCvdVisualScale ?? 100;
                    const cvdScaleFactor = cvdVisualScale / 100;
                    const cvdPanelMinW = Math.max(150, Math.round(208 * cvdScaleFactor));
                    const cvdSceneH = Math.max(84, Math.round(116 * cvdScaleFactor));
                    const cvdSwatchH = Math.max(20, Math.round(34 * cvdScaleFactor));
                    const cvdTitleFs = Math.max(8, Math.round(10 * cvdScaleFactor));
                    const cvdRoleFs = Math.max(8, Math.round(9 * cvdScaleFactor));
                    const cvdRoleHexMap: Record<string, string> = {
                      P: colors[0] ?? '#64748b',
                      S: colors[1] ?? '#94a3b8',
                      A: colors[2] ?? '#c084fc',
                      A2: colors[3] ?? '#f472b6',
                      F: secondaryColors[0] ?? '#e2e8f0',
                    };
                    const cvdMeta: Record<ExportAnalysisCvdOption, { label: string; tint: string }> = {
                      original: { label: 'Original', tint: '#fb7185' },
                      protanopia: { label: 'Protanopia', tint: '#a78bfa' },
                      deuteranopia: { label: 'Deuteranopia', tint: '#60a5fa' },
                      tritanopia: { label: 'Tritanopia', tint: '#22d3ee' },
                      achromatopsia: { label: 'Acromatopsia', tint: '#cbd5e1' },
                    };
                    const transformByOption = (hex: string, option: ExportAnalysisCvdOption) =>
                      option === 'original' ? hex : simulateCvdHex(hex, option);

                    return (
                      <div
                        key={item.id}
                        data-canvas-item-root
                        className="absolute flex flex-col"
                        style={{
                          boxSizing: 'border-box',
                          left: item.x,
                          top: item.y,
                          width: item.width,
                          overflow: 'visible',
                          zIndex: sel ? 30 : 2,
                        }}
                      >
                        {sel && editingCanvasId !== item.id && pinExportSelectionFooterAbove && (
                          <div
                            data-export-handle
                            className="pointer-events-auto absolute left-0 z-10 min-w-0"
                            style={exportFooterHudAboveStyle}
                            onPointerDown={(e) => e.stopPropagation()}
                          >
                            <ExportCanvasSelectionFooter
                              chrome={exportFooterChrome}
                              showTextControls={false}
                              sizePx={12}
                              currentAlign="left"
                              onBumpFont={() => undefined}
                              onSetAlign={() => undefined}
                              analysisCvdOptions={cvdOptions}
                              onToggleAnalysisCvdOption={(option) => toggleCanvasAnalysisCvdOption(item.id, option)}
                              visualScalePercent={cvdVisualScale}
                              onBumpVisualScale={(delta) => bumpCanvasAnalysisCvdVisualScale(item.id, delta)}
                              onAlignBlockInSheet={(mode) => alignCanvasBlockInSheet(item.id, iw, ih, mode)}
                            />
                          </div>
                        )}
                        <div
                          data-canvas-block
                          className={`relative transition-shadow ${
                            sel ? 'ring-2 ring-amber-400/80 ring-offset-1 ring-offset-transparent' : ''
                          }`}
                          style={{
                            boxSizing: 'border-box',
                            width: '100%',
                            height: item.height,
                            display: 'block',
                            overflow: 'visible',
                            cursor: 'grab',
                          }}
                          onPointerDown={(e) => {
                            if ((e.target as HTMLElement).closest('[data-export-handle]')) return;
                            setSelectedCanvasId(item.id);
                            beginDragCanvasItem(e, item.id, iw, ih, fit);
                          }}
                        >
                          <div
                            className={`rounded-lg ${showBorder ? 'shadow-sm' : ''}`}
                            style={{
                              position: 'absolute',
                              left: 0,
                              top: 0,
                              width: '100%',
                              height: '100%',
                              boxSizing: 'border-box',
                              overflow: 'hidden',
                              background: getElementCardBackground(),
                              border: showBorder
                                ? background === 'white'
                                  ? '1px solid rgba(0,0,0,0.08)'
                                  : '1px solid rgba(255,255,255,0.1)'
                                : 'none',
                              display: 'block',
                              padding: 10,
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                              <svg
                                className="h-3.5 w-3.5 shrink-0"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke={subtextColor}
                                strokeWidth={1.8}
                                aria-hidden
                              >
                                <path d="M12 3a9 9 0 109 9" />
                                <path d="M12 8v4l3 2" />
                              </svg>
                              <div
                                style={{
                                  color: textColor,
                                  fontFamily: EXPORT_TITLE_FONT_STACK,
                                  fontSize: 12,
                                  fontWeight: 700,
                                  lineHeight: '14px',
                                }}
                              >
                                Daltonismo
                              </div>
                            </div>
                            {cvdOptions.length > 0 ? (
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'stretch' }}>
                                {cvdOptions.map((option) => {
                                  const meta = cvdMeta[option];
                                  return (
                                    <div
                                      key={`${item.id}-cvd-${option}`}
                                      style={{
                                        flex: `1 1 ${cvdPanelMinW}px`,
                                        minWidth: cvdPanelMinW,
                                        borderRadius: 8,
                                        overflow: 'hidden',
                                        border:
                                          background === 'white'
                                            ? '1px solid rgba(0,0,0,0.12)'
                                            : '1px solid rgba(148,163,184,0.3)',
                                        background:
                                          background === 'white'
                                            ? 'rgba(255,255,255,0.75)'
                                            : 'rgba(2,6,23,0.45)',
                                      }}
                                    >
                                      <div
                                        style={{
                                          padding: '4px 7px',
                                          borderBottom:
                                            background === 'white'
                                              ? '1px solid rgba(0,0,0,0.08)'
                                              : '1px solid rgba(148,163,184,0.25)',
                                          color: meta.tint,
                                          fontFamily: EXPORT_TITLE_FONT_STACK,
                                          fontSize: cvdTitleFs,
                                          fontWeight: 700,
                                          textTransform: 'uppercase',
                                          letterSpacing: '0.04em',
                                        }}
                                      >
                                        {meta.label}
                                      </div>
                                      <div
                                        style={{
                                          position: 'relative',
                                          height: cvdSceneH,
                                          overflow: 'hidden',
                                          backgroundColor: transformByOption(cvdRoleHexMap.F, option),
                                        }}
                                      >
                                        <div
                                          style={{
                                            position: 'absolute',
                                            width: '60%',
                                            height: '60%',
                                            right: '-14%',
                                            top: '-14%',
                                            borderRadius: 9999,
                                            backgroundColor: transformByOption(cvdRoleHexMap.P, option),
                                          }}
                                        />
                                        <div
                                          style={{
                                            position: 'absolute',
                                            width: '40%',
                                            height: '40%',
                                            left: '-10%',
                                            bottom: '10%',
                                            borderRadius: 9999,
                                            backgroundColor: transformByOption(cvdRoleHexMap.S, option),
                                          }}
                                        />
                                        <div
                                          style={{
                                            position: 'absolute',
                                            width: '30%',
                                            height: '30%',
                                            left: '50%',
                                            top: '50%',
                                            borderRadius: 9999,
                                            transform: 'translate(-50%, -50%)',
                                            backgroundColor: transformByOption(cvdRoleHexMap.A, option),
                                          }}
                                        />
                                        <div
                                          style={{
                                            position: 'absolute',
                                            left: '20%',
                                            bottom: '20%',
                                            width: '60%',
                                            height: '8%',
                                            borderRadius: 9999,
                                            backgroundColor: transformByOption(cvdRoleHexMap.A2, option),
                                          }}
                                        />
                                      </div>
                                      <div style={{ display: 'flex', gap: 3, padding: 4 }}>
                                        {CVD_ROLES.map((role) => {
                                          const hex = cvdRoleHexMap[role] ?? '#64748b';
                                          const simHex = transformByOption(hex, option);
                                          return (
                                            <div
                                              key={`${item.id}-cvd-${option}-${role}`}
                                              style={{
                                                flex: 1,
                                                minWidth: 0,
                                                height: cvdSwatchH,
                                                borderRadius: 5,
                                                backgroundColor: simHex,
                                                display: 'flex',
                                                alignItems: 'end',
                                                justifyContent: 'center',
                                                paddingBottom: 2,
                                              }}
                                            >
                                              <span
                                                style={{
                                                  color: '#f8fafc',
                                                  fontFamily: EXPORT_TITLE_FONT_STACK,
                                                  fontSize: cvdRoleFs,
                                                  fontWeight: 700,
                                                  textShadow: '0 1px 1px rgba(0,0,0,0.35)',
                                                }}
                                              >
                                                {role}
                                              </span>
                                            </div>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <div
                                style={{
                                  borderRadius: 8,
                                  minHeight: 48,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: subtextColor,
                                  fontFamily: EXPORT_TITLE_FONT_STACK,
                                  fontSize: 11,
                                  border:
                                    background === 'white'
                                      ? '1px dashed rgba(0,0,0,0.18)'
                                      : '1px dashed rgba(148,163,184,0.35)',
                                }}
                              >
                                Activa "Original", "Protanopia", "Deuteranopia", "Tritanopia" o "Acromatopsia"
                              </div>
                            )}
                          </div>
                          {sel && editingCanvasId !== item.id && (
                            <>
                              <button
                                type="button"
                                data-export-handle
                                className="absolute right-1 top-1 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white shadow-md hover:bg-red-500"
                                title="Eliminar"
                                onPointerDown={(e) => e.stopPropagation()}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCanvasItems((prev) => prev.filter((c) => c.id !== item.id));
                                  setSelectedCanvasId((cur) => (cur === item.id ? null : cur));
                                  setEditingCanvasId((cur) => (cur === item.id ? null : cur));
                                }}
                              >
                                ×
                              </button>
                              {renderCanvasResizeHandles(item.id, iw, ih, fit)}
                            </>
                          )}
                        </div>
                        {sel && editingCanvasId !== item.id && !pinExportSelectionFooterAbove && (
                          <div
                            data-export-handle
                            className="pointer-events-auto absolute left-0 z-10 min-w-0"
                            style={exportFooterHudBelowStyle}
                            onPointerDown={(e) => e.stopPropagation()}
                          >
                            <ExportCanvasSelectionFooter
                              chrome={exportFooterChrome}
                              showTextControls={false}
                              sizePx={12}
                              currentAlign="left"
                              onBumpFont={() => undefined}
                              onSetAlign={() => undefined}
                              analysisCvdOptions={cvdOptions}
                              onToggleAnalysisCvdOption={(option) => toggleCanvasAnalysisCvdOption(item.id, option)}
                              visualScalePercent={cvdVisualScale}
                              onBumpVisualScale={(delta) => bumpCanvasAnalysisCvdVisualScale(item.id, delta)}
                              onAlignBlockInSheet={(mode) => alignCanvasBlockInSheet(item.id, iw, ih, mode)}
                            />
                          </div>
                        )}
                      </div>
                    );
                  }

                  if (item.kind === 'analysis-contrast') {
                    const contrastOptions = getCanvasAnalysisContrastOptions(item);
                    const contrastVisualScale = item.analysisContrastVisualScale ?? 100;
                    const contrastScale = contrastVisualScale / 100;
                    const roleHexMap: Record<string, string> = {
                      P: colors[0] ?? '#6382f2',
                      S: colors[1] ?? '#af92f6',
                      A: colors[2] ?? '#d363f2',
                      A2: colors[3] ?? '#f69fda',
                      F: secondaryColors[0] ?? '#dbe2fa',
                      // Importante: usar roles reales de análisis (T de supportColors),
                      // no el color de texto derivado del fondo del lienzo de export.
                      T: secondaryColors[2] ?? textColor,
                    };
                    const wcagCombos = getExportWcagCombos(roleHexMap).slice(0, 4);
                    const titleFs = Math.max(9, Math.round(10 * contrastScale));
                    const bodyFs = Math.max(10, Math.round(12 * contrastScale));
                    const proxIconH = Math.max(16, Math.round(28 * contrastScale));
                    const proxCardPad = Math.max(6, Math.round(10 * contrastScale));
                    return (
                      <div
                        key={item.id}
                        data-canvas-item-root
                        className="absolute flex flex-col"
                        style={{
                          boxSizing: 'border-box',
                          left: item.x,
                          top: item.y,
                          width: item.width,
                          overflow: 'visible',
                          zIndex: sel ? 30 : 2,
                        }}
                      >
                        {sel && editingCanvasId !== item.id && pinExportSelectionFooterAbove && (
                          <div
                            data-export-handle
                            className="pointer-events-auto absolute left-0 z-10 min-w-0"
                            style={exportFooterHudAboveStyle}
                            onPointerDown={(e) => e.stopPropagation()}
                          >
                            <ExportCanvasSelectionFooter
                              chrome={exportFooterChrome}
                              showTextControls={false}
                              sizePx={12}
                              currentAlign="left"
                              onBumpFont={() => undefined}
                              onSetAlign={() => undefined}
                              analysisContrastOptions={contrastOptions}
                              onToggleAnalysisContrastOption={(option) =>
                                toggleCanvasAnalysisContrastOption(item.id, option)
                              }
                              visualScalePercent={contrastVisualScale}
                              onBumpVisualScale={(delta) => bumpCanvasAnalysisContrastVisualScale(item.id, delta)}
                              onAlignBlockInSheet={(mode) => alignCanvasBlockInSheet(item.id, iw, ih, mode)}
                            />
                          </div>
                        )}
                        <div
                          data-canvas-block
                          className={`relative transition-shadow ${
                            sel ? 'ring-2 ring-amber-400/80 ring-offset-1 ring-offset-transparent' : ''
                          }`}
                          style={{
                            boxSizing: 'border-box',
                            width: '100%',
                            height: item.height,
                            display: 'block',
                            overflow: 'visible',
                            cursor: 'grab',
                          }}
                          onPointerDown={(e) => {
                            if ((e.target as HTMLElement).closest('[data-export-handle]')) return;
                            setSelectedCanvasId(item.id);
                            beginDragCanvasItem(e, item.id, iw, ih, fit);
                          }}
                        >
                          <div
                            className={`rounded-lg ${showBorder ? 'shadow-sm' : ''}`}
                            style={{
                              position: 'absolute',
                              left: 0,
                              top: 0,
                              width: '100%',
                              height: '100%',
                              boxSizing: 'border-box',
                              overflow: 'hidden',
                              background: getElementCardBackground(),
                              border: showBorder
                                ? background === 'white'
                                  ? '1px solid rgba(0,0,0,0.08)'
                                  : '1px solid rgba(255,255,255,0.1)'
                                : 'none',
                              display: 'block',
                              padding: 10,
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                              <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke={subtextColor} strokeWidth={1.8} aria-hidden>
                                <path d="M4 12h16" />
                                <path d="M7 7h10M7 17h10" />
                              </svg>
                              <div style={{ color: textColor, fontFamily: EXPORT_TITLE_FONT_STACK, fontSize: 12, fontWeight: 700 }}>
                                Contraste
                              </div>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                              {contrastOptions.map((option) => {
                                if (option === 'wcag') {
                                  return (
                                    <div key={`${item.id}-contrast-wcag`} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 8 }}>
                                      {wcagCombos.map((combo) => {
                                        const sampleText =
                                          item.contrastWcagTexts?.[combo.id] ??
                                          'Texto de ejemplo para evaluar la legibilidad de esta combinación.';
                                        const textEditorId = `${item.id}-${combo.id}`;
                                        const isActiveTextEditor = activeContrastTextEditorId === textEditorId;
                                        return (
                                          <div
                                            key={`${item.id}-${combo.id}`}
                                            style={{
                                              borderRadius: 8,
                                              border:
                                                background === 'white'
                                                  ? '1px solid rgba(0,0,0,0.12)'
                                                  : '1px solid rgba(148,163,184,0.3)',
                                              backgroundColor: combo.bgHex,
                                              color: combo.fgHex,
                                              padding: `${Math.max(6, Math.round(8 * contrastScale))}px`,
                                              minHeight: Math.max(84, Math.round(96 * contrastScale)),
                                              display: 'flex',
                                              flexDirection: 'column',
                                              gap: 4,
                                            }}
                                          >
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                                              <div style={{ fontFamily: EXPORT_TITLE_FONT_STACK, fontSize: titleFs, fontWeight: 700, textTransform: 'uppercase' }}>
                                                {combo.fgRole} → {combo.bgRole}
                                              </div>
                                              <div
                                                style={{
                                                  borderRadius: 9999,
                                                  padding: '2px 6px',
                                                  background: combo.ratio >= 4.5 ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)',
                                                  color: combo.ratio >= 4.5 ? '#34d399' : '#f59e0b',
                                                  fontFamily: EXPORT_TITLE_FONT_STACK,
                                                  fontSize: Math.max(8, Math.round(10 * contrastScale)),
                                                  fontWeight: 700,
                                                  whiteSpace: 'nowrap',
                                                }}
                                              >
                                                {combo.ratio.toFixed(1)}:1 · {combo.scoreLabel}
                                              </div>
                                            </div>
                                            <textarea
                                              value={sampleText}
                                              onChange={(ev) => {
                                                const val = ev.target.value;
                                                setCanvasItems((prev) =>
                                                  prev.map((c) =>
                                                    c.id === item.id && c.kind === 'analysis-contrast'
                                                      ? {
                                                          ...c,
                                                          contrastWcagTexts: {
                                                            ...(c.contrastWcagTexts ?? {}),
                                                            [combo.id]: val,
                                                          },
                                                        }
                                                      : c,
                                                  ),
                                                );
                                              }}
                                              onPointerDown={(e) => e.stopPropagation()}
                                              onFocus={() => {
                                                setSelectedCanvasId(item.id);
                                                setActiveContrastTextEditorId(textEditorId);
                                              }}
                                              onBlur={() => {
                                                setActiveContrastTextEditorId((cur) =>
                                                  cur === textEditorId ? null : cur,
                                                );
                                              }}
                                              placeholder="Escribe tu texto…"
                                              style={{
                                                width: '100%',
                                                minHeight: Math.max(50, Math.round(58 * contrastScale)),
                                                resize: 'none',
                                                overflow: 'hidden',
                                                background: 'rgba(255,255,255,0.06)',
                                                border: isActiveTextEditor
                                                  ? '1px solid rgba(245, 158, 11, 0.95)'
                                                  : '1px solid rgba(148,163,184,0.35)',
                                                borderRadius: 6,
                                                outline: 'none',
                                                boxShadow: isActiveTextEditor
                                                  ? '0 0 0 2px rgba(245, 158, 11, 0.35)'
                                                  : 'none',
                                                color: combo.fgHex,
                                                fontFamily: EXPORT_TITLE_FONT_STACK,
                                                fontSize: bodyFs,
                                                lineHeight: `${Math.max(13, Math.round(16 * contrastScale))}px`,
                                                padding: '4px 6px',
                                                cursor: 'text',
                                              }}
                                            />
                                          </div>
                                        );
                                      })}
                                    </div>
                                  );
                                }
                                if (option === 'proximity') {
                                  const P = roleHexMap.P;
                                  const S = roleHexMap.S;
                                  const A = roleHexMap.A;
                                  const A2 = roleHexMap.A2;
                                  const F = roleHexMap.F;
                                  return (
                                    <div
                                      key={`${item.id}-contrast-proximity`}
                                      style={{
                                        borderRadius: 8,
                                        border:
                                          background === 'white'
                                            ? '1px solid rgba(0,0,0,0.12)'
                                            : '1px solid rgba(148,163,184,0.3)',
                                        background:
                                          background === 'white'
                                            ? 'rgba(255,255,255,0.75)'
                                            : 'rgba(2,6,23,0.45)',
                                        padding: 8,
                                        display: 'flex',
                                        justifyContent: 'center',
                                      }}
                                    >
                                      <div style={{ width: '100%', maxWidth: Math.round(220 * contrastScale), aspectRatio: '3 / 4', borderRadius: 14, overflow: 'hidden', position: 'relative', backgroundColor: P }}>
                                        <div style={{ position: 'absolute', width: '70%', aspectRatio: '1 / 1', borderRadius: 9999, backgroundColor: S, right: '-18%', top: '-14%', opacity: 0.92 }} />
                                        <div style={{ position: 'absolute', width: '44%', aspectRatio: '1 / 1', borderRadius: 9999, backgroundColor: A, left: '-7%', top: '46%', opacity: 0.84 }} />
                                        <div style={{ position: 'absolute', width: '26%', aspectRatio: '1 / 1', borderRadius: 9999, backgroundColor: A2, right: '14%', top: '46%', opacity: 0.88 }} />
                                        <div style={{ position: 'absolute', inset: '4.5%', borderRadius: 16, border: `2px solid ${A}` }} />
                                        <div style={{ position: 'absolute', inset: '6%', borderRadius: 14, border: `2px solid ${S}` }} />
                                        <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 7 }}>
                                          {[42, 62, 52, 70, 46].map((h, idx) => (
                                            <div key={`${item.id}-prox-line-${idx}`} style={{ width: Math.max(4, Math.round(7 * contrastScale)), height: Math.max(18, Math.round(h * contrastScale * 0.6)), borderRadius: 4, backgroundColor: A }} />
                                          ))}
                                        </div>
                                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', gap: 6 }}>
                                          {[0, 1, 2].map((idx) => (
                                            <div key={`${item.id}-prox-icon-${idx}`} style={{ width: Math.max(28, Math.round(44 * contrastScale)), height: Math.max(28, Math.round(44 * contrastScale)), borderRadius: 10, border: `2px solid ${A}`, backgroundColor: S, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                              <span style={{ color: A, fontSize: proxIconH, lineHeight: 1 }}>{idx === 0 ? '★' : idx === 1 ? '◷' : '⬡'}</span>
                                            </div>
                                          ))}
                                        </div>
                                        <div style={{ position: 'absolute', bottom: '8%', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8 }}>
                                          <div style={{ padding: `${Math.max(4, proxCardPad - 3)}px ${Math.max(8, proxCardPad + 2)}px`, borderRadius: 9999, border: `2px solid ${A2}`, backgroundColor: S, color: A2, fontFamily: EXPORT_TITLE_FONT_STACK, fontSize: Math.max(8, Math.round(10 * contrastScale)), fontWeight: 700 }}>★★★★★</div>
                                          <div style={{ padding: `${Math.max(4, proxCardPad - 3)}px ${Math.max(8, proxCardPad + 2)}px`, borderRadius: 9999, border: `2px solid ${A}`, backgroundColor: S, color: A, fontFamily: EXPORT_TITLE_FONT_STACK, fontSize: Math.max(8, Math.round(10 * contrastScale)), fontWeight: 700 }}>PREMIUM</div>
                                        </div>
                                        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundColor: F, mixBlendMode: 'soft-light', opacity: 0.08 }} />
                                      </div>
                                    </div>
                                  );
                                }
                                return null;
                              })}
                              {contrastOptions.length === 0 && (
                                <div
                                  style={{
                                    borderRadius: 8,
                                    minHeight: 48,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: subtextColor,
                                    fontFamily: EXPORT_TITLE_FONT_STACK,
                                    fontSize: 11,
                                    border:
                                      background === 'white'
                                        ? '1px dashed rgba(0,0,0,0.18)'
                                        : '1px dashed rgba(148,163,184,0.35)',
                                  }}
                                >
                                  Activa "WCAG" o "Proximidad"
                                </div>
                              )}
                            </div>
                          </div>
                          {sel && editingCanvasId !== item.id && (
                            <>
                              <button
                                type="button"
                                data-export-handle
                                className="absolute right-1 top-1 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white shadow-md hover:bg-red-500"
                                title="Eliminar"
                                onPointerDown={(e) => e.stopPropagation()}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCanvasItems((prev) => prev.filter((c) => c.id !== item.id));
                                  setSelectedCanvasId((cur) => (cur === item.id ? null : cur));
                                  setEditingCanvasId((cur) => (cur === item.id ? null : cur));
                                }}
                              >
                                ×
                              </button>
                              {renderCanvasResizeHandles(item.id, iw, ih, fit)}
                            </>
                          )}
                        </div>
                        {sel && editingCanvasId !== item.id && !pinExportSelectionFooterAbove && (
                          <div
                            data-export-handle
                            className="pointer-events-auto absolute left-0 z-10 min-w-0"
                            style={exportFooterHudBelowStyle}
                            onPointerDown={(e) => e.stopPropagation()}
                          >
                            <ExportCanvasSelectionFooter
                              chrome={exportFooterChrome}
                              showTextControls={false}
                              sizePx={12}
                              currentAlign="left"
                              onBumpFont={() => undefined}
                              onSetAlign={() => undefined}
                              analysisContrastOptions={contrastOptions}
                              onToggleAnalysisContrastOption={(option) =>
                                toggleCanvasAnalysisContrastOption(item.id, option)
                              }
                              visualScalePercent={contrastVisualScale}
                              onBumpVisualScale={(delta) => bumpCanvasAnalysisContrastVisualScale(item.id, delta)}
                              onAlignBlockInSheet={(mode) => alignCanvasBlockInSheet(item.id, iw, ih, mode)}
                            />
                          </div>
                        )}
                      </div>
                    );
                  }

                  if (item.kind === 'application-poster') {
                    const posterVariant = getCanvasApplicationPosterVariant(item);
                    const posterTemplate = getCanvasApplicationPosterTemplate(item);
                    const posterColors = getApplicationPosterPalette(posterVariant);
                    const posterVisualScale = item.applicationPosterVisualScale ?? 60;
                    const posterScaleFactor = posterVisualScale / 100;
                    const posterScaleInsetPercent =
                      posterScaleFactor > 1 ? (1 - 1 / posterScaleFactor) * 50 : 0;
                    return (
                      <div
                        key={item.id}
                        data-canvas-item-root
                        className="absolute flex flex-col"
                        style={{
                          boxSizing: 'border-box',
                          left: item.x,
                          top: item.y,
                          width: item.width,
                          overflow: 'visible',
                          zIndex: sel ? 30 : 2,
                        }}
                      >
                        {sel && editingCanvasId !== item.id && pinExportSelectionFooterAbove && (
                          <div
                            data-export-handle
                            className="pointer-events-auto absolute left-0 z-10 min-w-0"
                            style={exportFooterHudAboveStyle}
                            onPointerDown={(e) => e.stopPropagation()}
                          >
                            <ExportCanvasSelectionFooter
                              chrome={exportFooterChrome}
                              showTextControls={false}
                              sizePx={12}
                              currentAlign="left"
                              onBumpFont={() => undefined}
                              onSetAlign={() => undefined}
                              applicationPosterVariant={posterVariant}
                              onSetApplicationPosterVariant={(variant) =>
                                setCanvasApplicationPosterVariant(item.id, variant)
                              }
                              applicationPosterTemplate={posterTemplate}
                              onSetApplicationPosterTemplate={(template) =>
                                setCanvasApplicationPosterTemplate(item.id, template)
                              }
                              visualScalePercent={posterVisualScale}
                              onBumpVisualScale={(delta) =>
                                bumpCanvasApplicationPosterVisualScale(item.id, delta)
                              }
                              onAlignBlockInSheet={(mode) => alignCanvasBlockInSheet(item.id, iw, ih, mode)}
                            />
                          </div>
                        )}
                        <div
                          data-canvas-block
                          className={`relative transition-shadow ${
                            sel ? 'ring-2 ring-amber-400/80 ring-offset-1 ring-offset-transparent' : ''
                          }`}
                          style={{
                            boxSizing: 'border-box',
                            width: '100%',
                            height: item.height,
                            display: 'block',
                            overflow: 'visible',
                            cursor: 'grab',
                          }}
                          onPointerDown={(e) => {
                            if ((e.target as HTMLElement).closest('[data-export-handle]')) return;
                            setSelectedCanvasId(item.id);
                            beginDragCanvasItem(e, item.id, iw, ih, fit);
                          }}
                        >
                          <div
                            className={`rounded-lg ${showBorder ? 'shadow-sm' : ''}`}
                            style={{
                              position: 'absolute',
                              left: 0,
                              top: 0,
                              width: '100%',
                              height: '100%',
                              boxSizing: 'border-box',
                              overflow: 'hidden',
                              background: getElementCardBackground(),
                              border: showBorder
                                ? background === 'white'
                                  ? '1px solid rgba(0,0,0,0.08)'
                                  : '1px solid rgba(255,255,255,0.1)'
                                : 'none',
                              display: 'block',
                              padding: 10,
                            }}
                          >
                            <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                              <div
                                style={{
                                  width: '100%',
                                  maxWidth: Math.max(120, Math.round(item.width * 0.78)),
                                  height: '100%',
                                  maxHeight: Math.max(180, item.height - 42),
                                  aspectRatio: '3 / 4.2',
                                  borderRadius: 12,
                                  overflow: 'hidden',
                                  position: 'relative',
                                  backgroundColor: 'transparent',
                                }}
                              >
                                <div
                                  className="absolute"
                                  style={{
                                    inset: `${posterScaleInsetPercent}%`,
                                    transform: `scale(${posterScaleFactor})`,
                                    transformOrigin: 'center center',
                                  }}
                                >
                                  <PosterSection posterColors={posterColors} variant={posterTemplate} />
                                </div>
                              </div>
                            </div>
                          </div>
                          {sel && editingCanvasId !== item.id && (
                            <>
                              <button
                                type="button"
                                data-export-handle
                                className="absolute right-1 top-1 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white shadow-md hover:bg-red-500"
                                title="Eliminar"
                                onPointerDown={(e) => e.stopPropagation()}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCanvasItems((prev) => prev.filter((c) => c.id !== item.id));
                                  setSelectedCanvasId((cur) => (cur === item.id ? null : cur));
                                  setEditingCanvasId((cur) => (cur === item.id ? null : cur));
                                }}
                              >
                                ×
                              </button>
                              {renderCanvasResizeHandles(item.id, iw, ih, fit)}
                            </>
                          )}
                        </div>
                        {sel && editingCanvasId !== item.id && !pinExportSelectionFooterAbove && (
                          <div
                            data-export-handle
                            className="pointer-events-auto absolute left-0 z-10 min-w-0"
                            style={exportFooterHudBelowStyle}
                            onPointerDown={(e) => e.stopPropagation()}
                          >
                            <ExportCanvasSelectionFooter
                              chrome={exportFooterChrome}
                              showTextControls={false}
                              sizePx={12}
                              currentAlign="left"
                              onBumpFont={() => undefined}
                              onSetAlign={() => undefined}
                              applicationPosterVariant={posterVariant}
                              onSetApplicationPosterVariant={(variant) =>
                                setCanvasApplicationPosterVariant(item.id, variant)
                              }
                              applicationPosterTemplate={posterTemplate}
                              onSetApplicationPosterTemplate={(template) =>
                                setCanvasApplicationPosterTemplate(item.id, template)
                              }
                              visualScalePercent={posterVisualScale}
                              onBumpVisualScale={(delta) =>
                                bumpCanvasApplicationPosterVisualScale(item.id, delta)
                              }
                              onAlignBlockInSheet={(mode) => alignCanvasBlockInSheet(item.id, iw, ih, mode)}
                            />
                          </div>
                        )}
                      </div>
                    );
                  }

                  if (item.kind === 'application-branding') {
                    const brandingVariant = getCanvasApplicationBrandingVariant(item);
                    const brandingTemplate = getCanvasApplicationBrandingTemplate(item);
                    const brandingColors = getApplicationPosterPalette(brandingVariant);
                    const brandingVisualScale = item.applicationBrandingVisualScale ?? 60;
                    const brandingScaleFactor = brandingVisualScale / 100;
                    const brandingScaleInsetPercent =
                      brandingScaleFactor > 1 ? (1 - 1 / brandingScaleFactor) * 50 : 0;
                    const brandingSceneOnly = item.applicationBrandingSceneOnly === true;
                    return (
                      <div
                        key={item.id}
                        data-canvas-item-root
                        className="absolute flex flex-col"
                        style={{
                          boxSizing: 'border-box',
                          left: item.x,
                          top: item.y,
                          width: item.width,
                          overflow: 'visible',
                          zIndex: sel ? 30 : 2,
                        }}
                      >
                        {sel && editingCanvasId !== item.id && pinExportSelectionFooterAbove && (
                          <div
                            data-export-handle
                            className="pointer-events-auto absolute left-0 z-10 min-w-0"
                            style={exportFooterHudAboveStyle}
                            onPointerDown={(e) => e.stopPropagation()}
                          >
                            <ExportCanvasSelectionFooter
                              chrome={exportFooterChrome}
                              showTextControls={false}
                              sizePx={12}
                              currentAlign="left"
                              onBumpFont={() => undefined}
                              onSetAlign={() => undefined}
                              applicationBrandingVariant={brandingVariant}
                              onSetApplicationBrandingVariant={(variant) =>
                                setCanvasApplicationBrandingVariant(item.id, variant)
                              }
                              applicationBrandingTemplate={brandingTemplate}
                              onSetApplicationBrandingTemplate={(template) =>
                                setCanvasApplicationBrandingTemplate(item.id, template)
                              }
                              applicationBrandingSceneOnly={item.applicationBrandingSceneOnly === true}
                              onToggleApplicationBrandingSceneOnly={() =>
                                toggleCanvasApplicationBrandingSceneOnly(item.id)
                              }
                              visualScalePercent={brandingVisualScale}
                              onBumpVisualScale={(delta) =>
                                bumpCanvasApplicationBrandingVisualScale(item.id, delta)
                              }
                              onAlignBlockInSheet={(mode) => alignCanvasBlockInSheet(item.id, iw, ih, mode)}
                            />
                          </div>
                        )}
                        <div
                          data-canvas-block
                          className={`relative transition-shadow ${
                            sel ? 'ring-2 ring-amber-400/80 ring-offset-1 ring-offset-transparent' : ''
                          }`}
                          style={{
                            boxSizing: 'border-box',
                            width: '100%',
                            height: item.height,
                            display: 'block',
                            overflow: 'visible',
                            cursor: 'grab',
                          }}
                          onPointerDown={(e) => {
                            if ((e.target as HTMLElement).closest('[data-export-handle]')) return;
                            setSelectedCanvasId(item.id);
                            beginDragCanvasItem(e, item.id, iw, ih, fit);
                          }}
                        >
                          <div
                            className={
                              brandingSceneOnly ? '' : `rounded-lg ${showBorder ? 'shadow-sm' : ''}`
                            }
                            style={{
                              position: 'absolute',
                              left: 0,
                              top: 0,
                              width: '100%',
                              height: '100%',
                              boxSizing: 'border-box',
                              overflow: 'hidden',
                              background: brandingSceneOnly ? 'transparent' : getElementCardBackground(),
                              border: brandingSceneOnly
                                ? 'none'
                                : showBorder
                                  ? background === 'white'
                                    ? '1px solid rgba(0,0,0,0.08)'
                                    : '1px solid rgba(255,255,255,0.1)'
                                  : 'none',
                              display: 'block',
                              padding: brandingSceneOnly ? 0 : 10,
                            }}
                          >
                            <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                              <div
                                style={{
                                  width: '100%',
                                  maxWidth: brandingSceneOnly
                                    ? '100%'
                                    : Math.max(120, Math.round(item.width * 0.78)),
                                  height: '100%',
                                  maxHeight: brandingSceneOnly
                                    ? item.height
                                    : Math.max(180, item.height - 42),
                                  aspectRatio: '3 / 4.2',
                                  borderRadius: brandingSceneOnly ? 0 : 12,
                                  overflow: 'hidden',
                                  position: 'relative',
                                  backgroundColor: 'transparent',
                                }}
                              >
                                <div
                                  className="absolute"
                                  style={{
                                    inset: `${brandingScaleInsetPercent}%`,
                                    transform: `scale(${brandingScaleFactor})`,
                                    transformOrigin: 'center center',
                                  }}
                                >
                                  <BrandingSection
                                    posterColors={brandingColors}
                                    variant={brandingTemplate}
                                    sceneOnly={brandingSceneOnly}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          {sel && editingCanvasId !== item.id && (
                            <>
                              <button
                                type="button"
                                data-export-handle
                                className="absolute right-1 top-1 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white shadow-md hover:bg-red-500"
                                title="Eliminar"
                                onPointerDown={(e) => e.stopPropagation()}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCanvasItems((prev) => prev.filter((c) => c.id !== item.id));
                                  setSelectedCanvasId((cur) => (cur === item.id ? null : cur));
                                  setEditingCanvasId((cur) => (cur === item.id ? null : cur));
                                }}
                              >
                                ×
                              </button>
                              {renderCanvasResizeHandles(item.id, iw, ih, fit)}
                            </>
                          )}
                        </div>
                        {sel && editingCanvasId !== item.id && !pinExportSelectionFooterAbove && (
                          <div
                            data-export-handle
                            className="pointer-events-auto absolute left-0 z-10 min-w-0"
                            style={exportFooterHudBelowStyle}
                            onPointerDown={(e) => e.stopPropagation()}
                          >
                            <ExportCanvasSelectionFooter
                              chrome={exportFooterChrome}
                              showTextControls={false}
                              sizePx={12}
                              currentAlign="left"
                              onBumpFont={() => undefined}
                              onSetAlign={() => undefined}
                              applicationBrandingVariant={brandingVariant}
                              onSetApplicationBrandingVariant={(variant) =>
                                setCanvasApplicationBrandingVariant(item.id, variant)
                              }
                              applicationBrandingTemplate={brandingTemplate}
                              onSetApplicationBrandingTemplate={(template) =>
                                setCanvasApplicationBrandingTemplate(item.id, template)
                              }
                              applicationBrandingSceneOnly={item.applicationBrandingSceneOnly === true}
                              onToggleApplicationBrandingSceneOnly={() =>
                                toggleCanvasApplicationBrandingSceneOnly(item.id)
                              }
                              visualScalePercent={brandingVisualScale}
                              onBumpVisualScale={(delta) =>
                                bumpCanvasApplicationBrandingVisualScale(item.id, delta)
                              }
                              onAlignBlockInSheet={(mode) => alignCanvasBlockInSheet(item.id, iw, ih, mode)}
                            />
                          </div>
                        )}
                      </div>
                    );
                  }

                  if (item.kind === 'application-architecture') {
                    const architectureVariant = getCanvasApplicationArchitectureVariant(item);
                    const architectureTemplate = getCanvasApplicationArchitectureTemplate(item);
                    const architecturePalette = getApplicationArchitecturePalette(architectureVariant);
                    const architectureVisualScale = item.applicationArchitectureVisualScale ?? 60;
                    const architectureScaleFactor = architectureVisualScale / 100;
                    const architectureScaleInsetPercent =
                      architectureScaleFactor > 1 ? (1 - 1 / architectureScaleFactor) * 50 : 0;
                    const architectureSceneOnly = item.applicationArchitectureSceneOnly === true;
                    return (
                      <div
                        key={item.id}
                        data-canvas-item-root
                        className="absolute flex flex-col"
                        style={{
                          boxSizing: 'border-box',
                          left: item.x,
                          top: item.y,
                          width: item.width,
                          overflow: 'visible',
                          zIndex: sel ? 30 : 2,
                        }}
                      >
                        {sel && editingCanvasId !== item.id && pinExportSelectionFooterAbove && (
                          <div
                            data-export-handle
                            className="pointer-events-auto absolute left-0 z-10 min-w-0"
                            style={exportFooterHudAboveStyle}
                            onPointerDown={(e) => e.stopPropagation()}
                          >
                            <ExportCanvasSelectionFooter
                              chrome={exportFooterChrome}
                              showTextControls={false}
                              sizePx={12}
                              currentAlign="left"
                              onBumpFont={() => undefined}
                              onSetAlign={() => undefined}
                              applicationArchitectureVariant={architectureVariant}
                              onSetApplicationArchitectureVariant={(variant) =>
                                setCanvasApplicationArchitectureVariant(item.id, variant)
                              }
                              applicationArchitectureTemplate={architectureTemplate}
                              onSetApplicationArchitectureTemplate={(template) =>
                                setCanvasApplicationArchitectureTemplate(item.id, template)
                              }
                              applicationArchitectureSceneOnly={item.applicationArchitectureSceneOnly === true}
                              onToggleApplicationArchitectureSceneOnly={() =>
                                toggleCanvasApplicationArchitectureSceneOnly(item.id)
                              }
                              visualScalePercent={architectureVisualScale}
                              onBumpVisualScale={(delta) =>
                                bumpCanvasApplicationArchitectureVisualScale(item.id, delta)
                              }
                              onAlignBlockInSheet={(mode) => alignCanvasBlockInSheet(item.id, iw, ih, mode)}
                            />
                          </div>
                        )}
                        <div
                          data-canvas-block
                          className={`relative transition-shadow ${
                            sel ? 'ring-2 ring-amber-400/80 ring-offset-1 ring-offset-transparent' : ''
                          }`}
                          style={{
                            boxSizing: 'border-box',
                            width: '100%',
                            height: item.height,
                            display: 'block',
                            overflow: 'visible',
                            cursor: 'grab',
                          }}
                          onPointerDown={(e) => {
                            if ((e.target as HTMLElement).closest('[data-export-handle]')) return;
                            setSelectedCanvasId(item.id);
                            beginDragCanvasItem(e, item.id, iw, ih, fit);
                          }}
                        >
                          <div
                            className={
                              architectureSceneOnly ? '' : `rounded-lg ${showBorder ? 'shadow-sm' : ''}`
                            }
                            style={{
                              position: 'absolute',
                              left: 0,
                              top: 0,
                              width: '100%',
                              height: '100%',
                              boxSizing: 'border-box',
                              overflow: 'hidden',
                              background: architectureSceneOnly ? 'transparent' : getElementCardBackground(),
                              border: architectureSceneOnly
                                ? 'none'
                                : showBorder
                                  ? background === 'white'
                                    ? '1px solid rgba(0,0,0,0.08)'
                                    : '1px solid rgba(255,255,255,0.1)'
                                  : 'none',
                              display: 'block',
                              padding: architectureSceneOnly ? 0 : 10,
                            }}
                          >
                            <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                              <div
                                style={{
                                  width: '100%',
                                  maxWidth: architectureSceneOnly
                                    ? '100%'
                                    : Math.max(180, Math.round(item.width * 0.84)),
                                  height: '100%',
                                  maxHeight: architectureSceneOnly
                                    ? item.height
                                    : Math.max(180, item.height - 42),
                                  aspectRatio: '3 / 4.2',
                                  borderRadius: architectureSceneOnly ? 0 : 12,
                                  overflow: 'hidden',
                                  position: 'relative',
                                  backgroundColor: 'transparent',
                                }}
                              >
                                <div
                                  className="absolute"
                                  style={{
                                    inset: `${architectureScaleInsetPercent}%`,
                                    transform: `scale(${architectureScaleFactor})`,
                                    transformOrigin: 'center center',
                                  }}
                                >
                                  <ArchitectureSection
                                    palette={architecturePalette}
                                    variant={architectureTemplate}
                                    sceneOnly={architectureSceneOnly}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                          {sel && editingCanvasId !== item.id && (
                            <>
                              <button
                                type="button"
                                data-export-handle
                                className="absolute right-1 top-1 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white shadow-md hover:bg-red-500"
                                title="Eliminar"
                                onPointerDown={(e) => e.stopPropagation()}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCanvasItems((prev) => prev.filter((c) => c.id !== item.id));
                                  setSelectedCanvasId((cur) => (cur === item.id ? null : cur));
                                  setEditingCanvasId((cur) => (cur === item.id ? null : cur));
                                }}
                              >
                                ×
                              </button>
                              {renderCanvasResizeHandles(item.id, iw, ih, fit)}
                            </>
                          )}
                        </div>
                        {sel && editingCanvasId !== item.id && !pinExportSelectionFooterAbove && (
                          <div
                            data-export-handle
                            className="pointer-events-auto absolute left-0 z-10 min-w-0"
                            style={exportFooterHudBelowStyle}
                            onPointerDown={(e) => e.stopPropagation()}
                          >
                            <ExportCanvasSelectionFooter
                              chrome={exportFooterChrome}
                              showTextControls={false}
                              sizePx={12}
                              currentAlign="left"
                              onBumpFont={() => undefined}
                              onSetAlign={() => undefined}
                              applicationArchitectureVariant={architectureVariant}
                              onSetApplicationArchitectureVariant={(variant) =>
                                setCanvasApplicationArchitectureVariant(item.id, variant)
                              }
                              applicationArchitectureTemplate={architectureTemplate}
                              onSetApplicationArchitectureTemplate={(template) =>
                                setCanvasApplicationArchitectureTemplate(item.id, template)
                              }
                              applicationArchitectureSceneOnly={item.applicationArchitectureSceneOnly === true}
                              onToggleApplicationArchitectureSceneOnly={() =>
                                toggleCanvasApplicationArchitectureSceneOnly(item.id)
                              }
                              visualScalePercent={architectureVisualScale}
                              onBumpVisualScale={(delta) =>
                                bumpCanvasApplicationArchitectureVisualScale(item.id, delta)
                              }
                              onAlignBlockInSheet={(mode) => alignCanvasBlockInSheet(item.id, iw, ih, mode)}
                            />
                          </div>
                        )}
                      </div>
                    );
                  }

                  if (item.kind === 'palette' || item.kind === 'palette-secondary') {
                    const isEditingPaletteTitle = editingCanvasId === item.id;
                    const paletteTitle = item.text.trim();
                    const showPaletteTitleRow = isEditingPaletteTitle || paletteTitle.length > 0;
                    const paletteTitleRowHeight = showPaletteTitleRow ? 18 : 0;
                    const paletteCodeFormats = getCanvasPaletteCodeFormats(item);
                    const paletteSwatches = item.kind === 'palette-secondary' ? secondaryColors : colors;
                    const showPaletteCodes = paletteCodeFormats.length > 0 && paletteSwatches.length > 0;
                    const paletteCodesRowHeight = showPaletteCodes ? paletteCodeFormats.length * 10 + (paletteCodeFormats.length - 1) * 1 : 0;
                    return (
                      <div
                        key={item.id}
                        data-canvas-item-root
                        className="absolute flex flex-col"
                        style={{
                          boxSizing: 'border-box',
                          left: item.x,
                          top: item.y,
                          width: item.width,
                          overflow: 'visible',
                          zIndex: sel ? 30 : 2,
                        }}
                      >
                        {sel && editingCanvasId !== item.id && pinExportSelectionFooterAbove && (
                          <div
                            data-export-handle
                            className="pointer-events-auto absolute left-0 z-10 min-w-0"
                            style={exportFooterHudAboveStyle}
                            onPointerDown={(e) => e.stopPropagation()}
                          >
                            <ExportCanvasSelectionFooter
                              chrome={exportFooterChrome}
                              showTextControls={false}
                              sizePx={12}
                              currentAlign="left"
                              onBumpFont={() => undefined}
                              onSetAlign={() => undefined}
                              paletteCodeFormats={paletteCodeFormats}
                              onTogglePaletteCodeFormat={(format) => toggleCanvasPaletteCodeFormat(item.id, format)}
                              onAlignBlockInSheet={(mode) => alignCanvasBlockInSheet(item.id, iw, ih, mode)}
                            />
                          </div>
                        )}
                        <div
                          data-canvas-block
                          className={`relative transition-shadow ${
                            sel ? 'ring-2 ring-amber-400/80 ring-offset-1 ring-offset-transparent' : ''
                          }`}
                          style={{
                            boxSizing: 'border-box',
                            width: '100%',
                            height: item.height,
                            display: 'block',
                            overflow: 'visible',
                            cursor: isEditingPaletteTitle ? 'text' : 'grab',
                          }}
                          onPointerDown={(e) => {
                            if ((e.target as HTMLElement).closest('[data-export-handle]')) return;
                            if (isEditingPaletteTitle) return;
                            setSelectedCanvasId(item.id);
                            beginDragCanvasItem(e, item.id, iw, ih, fit);
                          }}
                        >
                          <div
                            className={`rounded-lg ${showBorder ? 'shadow-sm' : ''}`}
                            style={{
                              position: 'absolute',
                              left: 0,
                              top: 0,
                              width: '100%',
                              height: '100%',
                              boxSizing: 'border-box',
                              overflow: 'hidden',
                              background: getElementCardBackground(0.04, 0.06),
                              display: 'block',
                              padding: 8,
                            }}
                          >
                            {isEditingPaletteTitle ? (
                              <input
                                className="rounded-md border border-purple-500/40 bg-black/30 px-1 py-0.5 text-xs outline-none focus:ring-1 focus:ring-purple-400"
                                style={{
                                  boxSizing: 'border-box',
                                  width: '100%',
                                  height: 18,
                                  color: textColor,
                                  fontFamily: EXPORT_TITLE_FONT_STACK,
                                  fontSize: 12,
                                  lineHeight: '16px',
                                  marginBottom: 6,
                                }}
                                value={item.text}
                                autoFocus
                                placeholder="Título de paleta"
                                onChange={(ev) =>
                                  setCanvasItems((prev) =>
                                    prev.map((c) =>
                                      c.id === item.id && c.kind === 'palette' ? { ...c, text: ev.target.value } : c,
                                    ),
                                  )
                                }
                                onPointerDown={(e) => e.stopPropagation()}
                                onBlur={() => setEditingCanvasId(null)}
                              />
                            ) : (
                              showPaletteTitleRow && (
                                <div
                                  style={{
                                    width: '100%',
                                    height: paletteTitleRowHeight,
                                    marginBottom: 6,
                                    display: 'block',
                                    overflow: 'hidden',
                                    color: textColor,
                                    fontFamily: EXPORT_TITLE_FONT_STACK,
                                    fontSize: 12,
                                    fontWeight: 600,
                                    lineHeight: '18px',
                                    whiteSpace: 'nowrap',
                                    textOverflow: 'ellipsis',
                                  }}
                                  onDoubleClick={(e) => {
                                    e.stopPropagation();
                                    setEditingCanvasId(item.id);
                                  }}
                                >
                                  {item.text}
                                </div>
                              )
                            )}
                            <div
                              style={{
                                width: '100%',
                                height: `calc(100% - ${(showPaletteTitleRow ? paletteTitleRowHeight + 6 : 0) + (showPaletteCodes ? paletteCodesRowHeight + 4 : 0)}px)`,
                                display: 'flex',
                                overflow: 'hidden',
                                borderRadius: 6,
                                boxShadow: showBorder
                                  ? background === 'white'
                                    ? 'inset 0 0 0 1px rgba(0,0,0,0.08)'
                                    : 'inset 0 0 0 1px rgba(255,255,255,0.12)'
                                  : 'none',
                              }}
                            >
                              {paletteSwatches.length > 0 ? (
                                paletteSwatches.map((hex, idx) => (
                                  <div key={`${item.id}-swatch-${idx}`} style={{ flex: 1, backgroundColor: hex }} />
                                ))
                              ) : (
                                <div
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: subtextColor,
                                    fontFamily: EXPORT_TITLE_FONT_STACK,
                                    fontSize: 11,
                                  }}
                                >
                                  Sin colores
                                </div>
                              )}
                            </div>
                            {showPaletteCodes && (
                              <div
                                style={{
                                  marginTop: 4,
                                  width: '100%',
                                  height: paletteCodesRowHeight,
                                  display: 'flex',
                                  gap: 4,
                                  overflow: 'hidden',
                                }}
                              >
                                {paletteSwatches.map((hex, idx) => (
                                  <div
                                    key={`${item.id}-code-${idx}`}
                                    style={{
                                      flex: 1,
                                      minWidth: 0,
                                      display: 'flex',
                                      flexDirection: 'column',
                                      justifyContent: 'center',
                                      gap: 1,
                                    }}
                                  >
                                    {paletteCodeFormats.map((fmt) => (
                                      <div
                                        key={`${item.id}-code-${idx}-${fmt}`}
                                        style={{
                                          color: subtextColor,
                                          fontFamily: EXPORT_TITLE_FONT_STACK,
                                          fontSize: 9,
                                          lineHeight: '10px',
                                          letterSpacing: '0.01em',
                                          whiteSpace: 'nowrap',
                                          overflow: 'hidden',
                                          textOverflow: 'ellipsis',
                                          textAlign: 'center',
                                        }}
                                        title={formatPaletteColorCode(hex, fmt)}
                                      >
                                        {formatPaletteColorCode(hex, fmt)}
                                      </div>
                                    ))}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                          {sel && editingCanvasId !== item.id && (
                            <>
                              <button
                                type="button"
                                data-export-handle
                                className="absolute right-1 top-1 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white shadow-md hover:bg-red-500"
                                title="Eliminar"
                                onPointerDown={(e) => e.stopPropagation()}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCanvasItems((prev) => prev.filter((c) => c.id !== item.id));
                                  setSelectedCanvasId((cur) => (cur === item.id ? null : cur));
                                  setEditingCanvasId((cur) => (cur === item.id ? null : cur));
                                }}
                              >
                                ×
                              </button>
                              {renderCanvasResizeHandles(item.id, iw, ih, fit)}
                            </>
                          )}
                        </div>
                        {sel && editingCanvasId !== item.id && !pinExportSelectionFooterAbove && (
                          <div
                            data-export-handle
                            className="pointer-events-auto absolute left-0 z-10 min-w-0"
                            style={exportFooterHudBelowStyle}
                            onPointerDown={(e) => e.stopPropagation()}
                          >
                            <ExportCanvasSelectionFooter
                              chrome={exportFooterChrome}
                              showTextControls={false}
                              sizePx={12}
                              currentAlign="left"
                              onBumpFont={() => undefined}
                              onSetAlign={() => undefined}
                              paletteCodeFormats={paletteCodeFormats}
                              onTogglePaletteCodeFormat={(format) => toggleCanvasPaletteCodeFormat(item.id, format)}
                              onAlignBlockInSheet={(mode) => alignCanvasBlockInSheet(item.id, iw, ih, mode)}
                            />
                          </div>
                        )}
                      </div>
                    );
                  }

                  if (item.kind === 'body') {
                    const bm = getExportBodyTextMetrics(item.height);
                    const bodyFs = clampBodyFontForBlock(item.height, item.fontSizePx);
                    const bodyLH = bodyLineHeightForBlock(item.height, bodyFs);
                    const bodyAlign: React.CSSProperties['textAlign'] = item.textAlign ?? 'left';
                    return (
                      <div
                        key={item.id}
                        data-canvas-item-root
                        className="absolute flex flex-col"
                        style={{
                          boxSizing: 'border-box',
                          left: item.x,
                          top: item.y,
                          width: item.width,
                          overflow: 'visible',
                          zIndex: sel ? 30 : 2,
                        }}
                      >
                        {sel && editingCanvasId !== item.id && pinExportSelectionFooterAbove && (
                          <div
                            data-export-handle
                            className="pointer-events-auto absolute left-0 z-10 min-w-0"
                            style={exportFooterHudAboveStyle}
                            onPointerDown={(e) => e.stopPropagation()}
                          >
                            <ExportCanvasSelectionFooter
                              chrome={exportFooterChrome}
                              sizePx={bodyFs}
                              currentAlign={item.textAlign ?? 'left'}
                              onBumpFont={(delta) => bumpCanvasFontSize(item.id, delta)}
                              onSetAlign={(align) => setCanvasTextAlign(item.id, align)}
                              onAlignBlockInSheet={(mode) => alignCanvasBlockInSheet(item.id, iw, ih, mode)}
                            />
                          </div>
                        )}
                        <div
                          data-canvas-block
                          className={`relative transition-shadow ${
                            sel ? 'ring-2 ring-amber-400/80 ring-offset-1 ring-offset-transparent' : ''
                          }`}
                          style={{
                            boxSizing: 'border-box',
                            width: '100%',
                            height: item.height,
                            display: 'block',
                            overflow: 'visible',
                            cursor: editingCanvasId === item.id ? 'text' : 'grab',
                          }}
                          onPointerDown={(e) => {
                            if ((e.target as HTMLElement).closest('[data-export-handle]')) return;
                            if (editingCanvasId === item.id) return;
                            setSelectedCanvasId(item.id);
                            beginDragCanvasItem(e, item.id, iw, ih, fit);
                          }}
                        >
                        <div
                          data-export-body-surface
                          className={`rounded-lg ${showBorder ? 'shadow-sm' : ''}`}
                          style={{
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            width: '100%',
                            height: '100%',
                            boxSizing: 'border-box',
                            overflow: 'hidden',
                            background: getElementCardBackground(0.04, 0.06),
                            display: 'block',
                          }}
                        >
                          {editingCanvasId === item.id ? (
                            <textarea
                              className="resize-none rounded-md border border-purple-500/40 bg-black/30 text-sm outline-none focus:ring-1 focus:ring-purple-400"
                              style={{
                                boxSizing: 'border-box',
                                position: 'absolute',
                                left: bm.pl,
                                top: bm.pt,
                                right: bm.pr,
                                bottom: bm.pb,
                                width: 'auto',
                                height: 'auto',
                                margin: 0,
                                display: 'block',
                                overflow: 'auto',
                                color: textColor,
                                fontFamily: EXPORT_TITLE_FONT_STACK,
                                fontSize: bodyFs,
                                fontWeight: 400,
                                lineHeight: `${bodyLH}px`,
                                letterSpacing: '0.01em',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word',
                                textAlign: bodyAlign,
                              }}
                              value={item.text}
                              autoFocus
                              onChange={(ev) =>
                                setCanvasItems((prev) =>
                                  prev.map((c) =>
                                    c.id === item.id && c.kind === 'body' ? { ...c, text: ev.target.value } : c,
                                  ),
                                )
                              }
                              onPointerDown={(e) => e.stopPropagation()}
                              onBlur={() => setEditingCanvasId(null)}
                            />
                          ) : (
                            <div
                              data-export-body-text
                              style={{
                                position: 'absolute',
                                left: bm.pl,
                                top: bm.pt,
                                right: bm.pr,
                                bottom: bm.pb,
                                width: 'auto',
                                height: 'auto',
                                margin: 0,
                                boxSizing: 'border-box',
                                display: 'block',
                                textAlign: bodyAlign,
                                overflow: 'hidden',
                                color: textColor,
                                fontFamily: EXPORT_TITLE_FONT_STACK,
                                fontSize: bodyFs,
                                fontWeight: 400,
                                lineHeight: `${bodyLH}px`,
                                letterSpacing: '0.01em',
                                whiteSpace: 'pre-wrap',
                                wordBreak: 'break-word',
                              }}
                              onDoubleClick={(e) => {
                                e.stopPropagation();
                                setEditingCanvasId(item.id);
                              }}
                            >
                              {item.text}
                            </div>
                          )}
                        </div>
                        {sel && editingCanvasId !== item.id && (
                          <>
                            <button
                              type="button"
                              data-export-handle
                              className="absolute right-1 top-1 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white shadow-md hover:bg-red-500"
                              title="Eliminar"
                              onPointerDown={(e) => e.stopPropagation()}
                              onClick={(e) => {
                                e.stopPropagation();
                                setCanvasItems((prev) => prev.filter((c) => c.id !== item.id));
                                setSelectedCanvasId((cur) => (cur === item.id ? null : cur));
                                setEditingCanvasId((cur) => (cur === item.id ? null : cur));
                              }}
                            >
                              ×
                            </button>
                              {renderCanvasResizeHandles(item.id, iw, ih, fit)}
                          </>
                        )}
                      </div>
                      {sel && editingCanvasId !== item.id && !pinExportSelectionFooterAbove && (
                        <div
                          data-export-handle
                          className="pointer-events-auto absolute left-0 z-10 min-w-0"
                          style={exportFooterHudBelowStyle}
                          onPointerDown={(e) => e.stopPropagation()}
                        >
                          <ExportCanvasSelectionFooter
                            chrome={exportFooterChrome}
                            sizePx={bodyFs}
                            currentAlign={item.textAlign ?? 'left'}
                            onBumpFont={(delta) => bumpCanvasFontSize(item.id, delta)}
                            onSetAlign={(align) => setCanvasTextAlign(item.id, align)}
                            onAlignBlockInSheet={(mode) => alignCanvasBlockInSheet(item.id, iw, ih, mode)}
                          />
                        </div>
                      )}
                    </div>
                    );
                  }

                  if (item.kind !== 'title') return null;
                  const tm = getExportTitleTextMetrics(item.height);
                  const titleFs = clampTitleFontForBlock(item.height, item.fontSizePx);
                  const titleLH = titleLineHeightForBlock(item.height, titleFs);
                  const titleAlign: React.CSSProperties['textAlign'] = item.textAlign ?? 'left';
                  return (
                    <div
                      key={item.id}
                      data-canvas-item-root
                      className="absolute flex flex-col"
                      style={{
                        boxSizing: 'border-box',
                        left: item.x,
                        top: item.y,
                        width: item.width,
                        overflow: 'visible',
                        zIndex: sel ? 30 : 2,
                      }}
                    >
                      {sel && editingCanvasId !== item.id && pinExportSelectionFooterAbove && (
                        <div
                          data-export-handle
                          className="pointer-events-auto absolute left-0 z-10 min-w-0"
                          style={exportFooterHudAboveStyle}
                          onPointerDown={(e) => e.stopPropagation()}
                        >
                          <ExportCanvasSelectionFooter
                            chrome={exportFooterChrome}
                            sizePx={titleFs}
                            currentAlign={item.textAlign ?? 'left'}
                            onBumpFont={(delta) => bumpCanvasFontSize(item.id, delta)}
                            onSetAlign={(align) => setCanvasTextAlign(item.id, align)}
                            onAlignBlockInSheet={(mode) => alignCanvasBlockInSheet(item.id, iw, ih, mode)}
                          />
                        </div>
                      )}
                      <div
                        data-canvas-block
                        className={`relative transition-shadow ${
                          sel ? 'ring-2 ring-amber-400/80 ring-offset-1 ring-offset-transparent' : ''
                        }`}
                        style={{
                          boxSizing: 'border-box',
                          width: '100%',
                          height: item.height,
                          display: 'block',
                          overflow: 'visible',
                          cursor: editingCanvasId === item.id ? 'text' : 'grab',
                        }}
                        onPointerDown={(e) => {
                          if ((e.target as HTMLElement).closest('[data-export-handle]')) return;
                          if (editingCanvasId === item.id) return;
                          setSelectedCanvasId(item.id);
                          beginDragCanvasItem(e, item.id, iw, ih, fit);
                        }}
                      >
                      <div
                        data-export-title-surface
                        className={`rounded-lg ${showBorder ? 'shadow-sm' : ''}`}
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          width: '100%',
                          height: '100%',
                          boxSizing: 'border-box',
                          overflow: 'hidden',
                          background: getElementCardBackground(0.04, 0.06),
                          display: 'block',
                        }}
                      >
                        {editingCanvasId === item.id ? (
                          <textarea
                            className="resize-none rounded-md border border-purple-500/40 bg-black/30 text-sm outline-none focus:ring-1 focus:ring-purple-400"
                            style={{
                              boxSizing: 'border-box',
                              position: 'absolute',
                              left: tm.pl,
                              top: tm.pt,
                              right: tm.pr,
                              bottom: tm.pb,
                              width: 'auto',
                              height: 'auto',
                              margin: 0,
                              display: 'block',
                              color: textColor,
                              fontFamily: EXPORT_TITLE_FONT_STACK,
                              fontSize: titleFs,
                              lineHeight: `${titleLH}px`,
                              letterSpacing: '0.02em',
                              textAlign: titleAlign,
                            }}
                            value={item.text}
                            autoFocus
                            onChange={(ev) =>
                              setCanvasItems((prev) =>
                                prev.map((c) =>
                                  c.id === item.id && c.kind === 'title' ? { ...c, text: ev.target.value } : c,
                                ),
                              )
                            }
                            onPointerDown={(e) => e.stopPropagation()}
                            onBlur={() => setEditingCanvasId(null)}
                          />
                        ) : (
                          <div
                            data-export-title-body
                            style={{
                              position: 'absolute',
                              left: tm.pl,
                              top: tm.pt,
                              right: tm.pr,
                              bottom: tm.pb,
                              width: 'auto',
                              height: 'auto',
                              margin: 0,
                              boxSizing: 'border-box',
                              display: 'block',
                              textAlign: titleAlign,
                            }}
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              setEditingCanvasId(item.id);
                            }}
                          >
                            <span
                              className="break-words"
                              style={{
                                boxSizing: 'border-box',
                                display: 'block',
                                color: textColor,
                                fontFamily: EXPORT_TITLE_FONT_STACK,
                                fontSize: titleFs,
                                fontWeight: 700,
                                lineHeight: `${titleLH}px`,
                                letterSpacing: '0.02em',
                              }}
                            >
                              {item.text}
                            </span>
                            <span
                              style={{
                                boxSizing: 'border-box',
                                display: 'block',
                                marginTop: EXPORT_TITLE_SUB_MARGIN_TOP_PX,
                                color: subtextColor,
                                fontFamily: EXPORT_TITLE_FONT_STACK,
                                fontSize: tm.subFontPx,
                                lineHeight: `${tm.subLineHeightPx}px`,
                                letterSpacing: '0.02em',
                              }}
                            >
                              {colors.length} colores · Palette Studio
                            </span>
                          </div>
                        )}
                      </div>
                      {sel && editingCanvasId !== item.id && (
                        <>
                          <button
                            type="button"
                            data-export-handle
                            className="absolute right-1 top-1 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white shadow-md hover:bg-red-500"
                            title="Eliminar"
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                              e.stopPropagation();
                              setCanvasItems((prev) => prev.filter((c) => c.id !== item.id));
                              setSelectedCanvasId((cur) => (cur === item.id ? null : cur));
                              setEditingCanvasId((cur) => (cur === item.id ? null : cur));
                            }}
                          >
                            ×
                          </button>
                              {renderCanvasResizeHandles(item.id, iw, ih, fit)}
                        </>
                      )}
                    </div>
                    {sel && editingCanvasId !== item.id && !pinExportSelectionFooterAbove && (
                      <div
                        data-export-handle
                        className="pointer-events-auto absolute left-0 z-10 min-w-0"
                        style={exportFooterHudBelowStyle}
                        onPointerDown={(e) => e.stopPropagation()}
                      >
                        <ExportCanvasSelectionFooter
                          chrome={exportFooterChrome}
                          sizePx={titleFs}
                          currentAlign={item.textAlign ?? 'left'}
                          onBumpFont={(delta) => bumpCanvasFontSize(item.id, delta)}
                          onSetAlign={(align) => setCanvasTextAlign(item.id, align)}
                          onAlignBlockInSheet={(mode) => alignCanvasBlockInSheet(item.id, iw, ih, mode)}
                        />
                      </div>
                    )}
                  </div>
                  );
                })}

                {canvasItems.length === 0 && (
                  <div className="pointer-events-none flex h-full min-h-[120px] flex-col items-center justify-center py-10 text-center text-gray-400">
                    <svg className="mb-4 h-16 w-16 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="mb-1 text-lg font-medium">Lienzo vacío</p>
                    <p className="max-w-[240px] text-sm text-gray-500">
                      Usa «Título» o «Texto» en Elementos del exportable para añadir bloques editables al lienzo.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (layout === 'split' && renderSplit) {
    return <>{renderSplit({ renderControls, renderPreview, renderStickyDownload })}</>;
  }

  return (
    <div className="space-y-6">
      <div className="w-full max-w-md mx-auto">{renderStickyDownload()}</div>
      {renderControls({ compact: false })}
      {renderPreview()}
    </div>
  );
};
