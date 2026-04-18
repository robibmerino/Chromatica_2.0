/** Id del contenedor capturado en `ArchetypesGlobalSummaryModal`. */
export const ARCHETYPES_GLOBAL_PNG_CAPTURE_ID = 'archetypes-summary-png-capture';

/** Id del contenedor capturado en `ColumnSummaryModal`. */
export const COLUMN_SUMMARY_PNG_CAPTURE_ID = 'column-summary-png-capture';

export type ArchetypePngExportCssOptions = {
  /** Ancho máximo de la nube de tags (p. ej. `58%` global, `100%` en columna estrecha). */
  tagWrapMaxWidth?: string;
  /** Modal "Resumen de tu selección": evita solapes (tags multilínea, cabecera con icono, translate). */
  columnModalCapture?: boolean;
};

const PNG_TAG_PILL_PADDING = '0.24rem 0.65rem 0.4rem';
const PNG_TAG_TEXT_LIFT = '-2px';
const PNG_CHAR_PILL_PADDING = '0.22rem 0.65rem 0.34rem';
const PNG_CHAR_TEXT_LIFT = '-3px';

function convertColorToRgbForHtml2Canvas(colorValue: string): string {
  try {
    if (!colorValue || colorValue === 'transparent' || colorValue === 'inherit') return colorValue;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext('2d');
    if (!ctx) return colorValue;
    ctx.fillStyle = colorValue;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
    if (a === 0) return 'transparent';
    return a < 255 ? `rgba(${r},${g},${b},${(a / 255).toFixed(2)})` : `rgb(${r},${g},${b})`;
  } catch {
    return colorValue;
  }
}

function colorValueNeedsRgbSanitize(value: string): boolean {
  if (!value || value === 'none' || value === 'inherit') return false;
  const v = value.trim();
  return (
    v.includes('oklab') ||
    v.includes('oklch') ||
    v.includes('lab(') ||
    v.includes('lch(') ||
    v.includes('color-mix(') ||
    /^#[0-9a-fA-F]{8}$/.test(v) ||
    /#[0-9a-fA-F]{8}\b/.test(v)
  );
}

/** Cualquier sintaxis de color que html2canvas 1.4 no parsea (p. ej. Tailwind v4). */
function styleValueHasHtml2CanvasUnsafeColor(value: string): boolean {
  if (!value || value === 'none' || value === 'inherit' || value === 'normal' || value === 'auto') {
    return false;
  }
  const v = value.toLowerCase();
  return (
    v.includes('oklch(') ||
    v.includes('oklab(') ||
    v.includes('lab(') ||
    v.includes('lch(') ||
    v.includes('color-mix(') ||
    v.includes('color(') ||
    /^#[0-9a-fA-F]{8}$/.test(value.trim()) ||
    /#[0-9a-fA-F]{8}\b/.test(value)
  );
}

const HTML2CANVAS_COLOR_PROPS = [
  'color',
  'background-color',
  'border-color',
  'border-top-color',
  'border-right-color',
  'border-bottom-color',
  'border-left-color',
  'outline-color',
  'text-decoration-color',
  'caret-color',
  'accent-color',
  'column-rule-color',
  'fill',
  'stroke',
] as const;

function isStylableCaptureNode(node: Element): node is HTMLElement | SVGElement {
  return node instanceof HTMLElement || node instanceof SVGElement;
}

function stripShadowOrFilter(el: HTMLElement | SVGElement, prop: string): void {
  el.style.setProperty(prop, 'none');
}

function sanitizeBackgroundImageAndFallback(
  el: HTMLElement | SVGElement,
  computedStyle: CSSStyleDeclaration
): void {
  const bgImage = computedStyle.getPropertyValue('background-image');
  if (
    bgImage &&
    bgImage !== 'none' &&
    (bgImage.includes('oklab') ||
      bgImage.includes('oklch') ||
      bgImage.includes('lab(') ||
      bgImage.includes('lch(') ||
      bgImage.includes('color-mix('))
  ) {
    const bgColor = computedStyle.getPropertyValue('background-color');
    el.style.setProperty('background-image', 'none');
    el.style.setProperty('background-color', convertColorToRgbForHtml2Canvas(bgColor) || '#111827');
  }
}

/** Ajusta bordes cuando el shorthand sigue exponiendo oklch a html2canvas. */
function sanitizeBorderColorsFromComputed(
  el: HTMLElement | SVGElement,
  computedStyle: CSSStyleDeclaration
): void {
  for (const side of ['top', 'right', 'bottom', 'left'] as const) {
    const prop = `border-${side}-color`;
    const v = computedStyle.getPropertyValue(prop);
    if (v && styleValueHasHtml2CanvasUnsafeColor(v)) {
      el.style.setProperty(prop, convertColorToRgbForHtml2Canvas(v));
    }
  }
}

/**
 * Recorre todas las propiedades calculadas: Tailwind v4 deja oklch en sombras, filtros, etc.
 * que no cubría solo la lista corta de color.
 */
function sanitizeAllComputedColorLikeProps(
  el: HTMLElement | SVGElement,
  view: Window,
  computedStyle: CSSStyleDeclaration
): void {
  for (let i = 0; i < computedStyle.length; i++) {
    const prop = computedStyle.item(i);
    const value = computedStyle.getPropertyValue(prop);
    if (!styleValueHasHtml2CanvasUnsafeColor(value)) continue;

    if (prop === 'background-image') {
      sanitizeBackgroundImageAndFallback(el, computedStyle);
      continue;
    }
    if (prop === 'background') {
      sanitizeBackgroundImageAndFallback(el, computedStyle);
      const bgc = computedStyle.getPropertyValue('background-color');
      if (bgc && styleValueHasHtml2CanvasUnsafeColor(bgc)) {
        el.style.setProperty('background-color', convertColorToRgbForHtml2Canvas(bgc));
      }
      continue;
    }
    if (
      prop === 'box-shadow' ||
      prop === 'text-shadow' ||
      prop === 'filter' ||
      prop === 'backdrop-filter' ||
      prop === '-webkit-backdrop-filter'
    ) {
      stripShadowOrFilter(el, prop);
      continue;
    }
    if (prop === 'border-image' || prop === 'border-image-source') {
      el.style.setProperty('border-image', 'none');
      continue;
    }
    if (prop === 'mask' || prop === 'mask-image' || prop === '-webkit-mask-image') {
      el.style.setProperty(prop, 'none');
      continue;
    }
    if (
      prop === 'color' ||
      prop.endsWith('-color') ||
      prop === 'fill' ||
      prop === 'stroke' ||
      prop === 'flood-color' ||
      prop === 'lighting-color'
    ) {
      const converted = convertColorToRgbForHtml2Canvas(value);
      if (!styleValueHasHtml2CanvasUnsafeColor(converted)) {
        el.style.setProperty(prop, converted);
      }
      continue;
    }
    if (prop.startsWith('border') && prop !== 'border-collapse' && prop !== 'border-spacing') {
      sanitizeBorderColorsFromComputed(el, view.getComputedStyle(el));
      continue;
    }
    if (prop === 'outline' && styleValueHasHtml2CanvasUnsafeColor(value)) {
      const oc = computedStyle.getPropertyValue('outline-color');
      if (oc && styleValueHasHtml2CanvasUnsafeColor(oc)) {
        el.style.setProperty('outline-color', convertColorToRgbForHtml2Canvas(oc));
      }
      continue;
    }
  }
}

/**
 * CSS inyectado en el documento clonado: tipografía, cabecera sin botones, tags inline-block,
 * paletas y footers (compensaciones para html2canvas + Tailwind v4).
 */
export function buildArchetypeSummaryPngExportCss(
  rootId: string,
  opts?: ArchetypePngExportCssOptions
): string {
  const R = `#${rootId}`;
  const tagMax = opts?.tagWrapMaxWidth ?? '58%';
  const column = opts?.columnModalCapture === true;
  const columnOverrides = column
    ? `
    ${R}.column-summary-png-capture-root,
    ${R} {
      overflow: visible !important;
      text-rendering: auto !important;
    }
    ${R} .archetypes-png-header {
      align-items: center !important;
      padding-top: 1.15rem !important;
      padding-bottom: 1.15rem !important;
      overflow: visible !important;
    }
    ${R} .archetypes-png-header .archetypes-png-header-title {
      width: auto !important;
      max-width: 58% !important;
      flex: 1 1 auto !important;
    }
    ${R} .archetypes-png-header h2 {
      padding-top: 0.2rem !important;
      padding-bottom: 0.2rem !important;
      line-height: 1.35 !important;
      overflow: visible !important;
      word-break: break-word !important;
    }
    ${R} .column-summary-png-section-h3 {
      margin-top: 0.35rem !important;
      margin-bottom: 1rem !important;
      padding-left: 0.7rem !important;
      position: relative !important;
      z-index: 0 !important;
      line-height: 1.35 !important;
    }
    ${R} .column-summary-png-palette-block {
      margin-top: 0.75rem !important;
      padding-top: 1.35rem !important;
    }
    ${R} .column-summary-png-palette-block > p.text-xs {
      margin-top: 0.35rem !important;
      margin-bottom: 0.85rem !important;
    }
    ${R} .column-summary-png-axis-label {
      display: block !important;
      width: 100% !important;
      box-sizing: border-box !important;
      margin: 0 0 0.75rem 0 !important;
      padding: 0.15rem 0 0 0.7rem !important;
      line-height: 1.35 !important;
      text-align: left !important;
      font-size: 10px !important;
      position: relative !important;
      top: 0 !important;
    }
    ${R} .column-summary-png-axis-slot {
      padding-top: 1rem !important;
      padding-bottom: 1rem !important;
    }
    ${R} .column-summary-png-card-frame {
      display: flex !important;
      flex-direction: column !important;
      align-items: stretch !important;
      justify-content: flex-start !important;
      box-sizing: border-box !important;
      overflow: hidden !important;
    }
    ${R} .column-summary-png-card-frame > * {
      flex: 1 1 0 !important;
      min-height: 0 !important;
      width: 100% !important;
      max-width: 100% !important;
      display: flex !important;
      flex-direction: column !important;
      align-items: stretch !important;
      justify-content: flex-start !important;
    }
    ${R} .column-summary-png-card-frame .column-summary-png-card-surface {
      flex: 1 1 0 !important;
      min-height: 0 !important;
      width: 100% !important;
      align-self: stretch !important;
      box-sizing: border-box !important;
      border-width: 0 !important;
      box-shadow: none !important;
    }
    ${R} .column-summary-png-card-frame .column-summary-png-card-surface > svg {
      width: 100% !important;
      height: 100% !important;
    }
    ${R} .column-summary-png-no-lift {
      transform: none !important;
    }
    ${R} .inspiration-scroll-area {
      overflow: visible !important;
      max-height: none !important;
      height: auto !important;
    }
    ${R} .flex-1.flex.flex-col.md\\:flex-row.min-h-0 {
      min-height: 0 !important;
      align-items: stretch !important;
    }
    ${R} .archetypes-png-tag-wrap {
      display: flex !important;
      flex-wrap: wrap !important;
      justify-content: center !important;
      align-content: flex-start !important;
      gap: 0.5rem !important;
      row-gap: 0.5rem !important;
      font-size: initial !important;
      line-height: normal !important;
    }
    ${R} .archetypes-png-tag-wrap > span.rounded-full {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      margin: 0 !important;
      vertical-align: middle !important;
      padding: 0.28rem 0.7rem 0.36rem !important;
      line-height: 1.2 !important;
    }
    ${R} .archetypes-png-tag-wrap > span.rounded-full > span {
      transform: translateY(${PNG_TAG_TEXT_LIFT}) !important;
      vertical-align: middle !important;
      line-height: 1.2 !important;
    }
    ${R} .column-summary-png-char-label > span {
      display: inline-flex !important;
      align-items: center !important;
      justify-content: center !important;
      min-height: 1.65rem !important;
      padding: ${PNG_CHAR_PILL_PADDING} !important;
      line-height: 1.15 !important;
      box-sizing: border-box !important;
    }
    ${R} .column-summary-png-char-label .column-summary-png-char-label-text {
      display: inline-block !important;
      line-height: 1.15 !important;
      vertical-align: middle !important;
      transform: translateY(${PNG_CHAR_TEXT_LIFT}) !important;
    }
    ${R} .column-summary-png-axis-track {
      position: relative !important;
      z-index: 0 !important;
    }
    ${R} .column-summary-png-axis-thumb {
      z-index: 2 !important;
    }
    ${R} .palette-bar-png-export .flex.min-h-5 {
      align-items: center !important;
    }
  `
    : '';

  return `
    ${R} {
      font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif !important;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-rendering: geometricPrecision;
    }
    ${R} .archetypes-png-header {
      align-items: flex-start !important;
      justify-content: flex-start !important;
      box-sizing: border-box !important;
      padding: 1rem 1.75rem 1rem 1.375rem !important;
    }
    ${R} .archetypes-png-header .archetypes-png-header-title {
      flex: 0 0 auto !important;
      width: max-content !important;
      max-width: calc(100% - 0.5rem) !important;
      min-width: 0 !important;
      margin-left: 0 !important;
      padding-left: 0 !important;
    }
    ${R} .archetypes-png-header h2 {
      display: block !important;
      font-size: 1.25rem !important;
      line-height: 1.3 !important;
      font-weight: 600 !important;
      margin: 0 !important;
      padding: 0 0 0.15rem 0 !important;
      letter-spacing: -0.015em;
      white-space: normal !important;
    }
    ${R} .archetypes-png-header p {
      display: block !important;
      margin: 0.4rem 0 0 0 !important;
      padding: 0 !important;
      font-size: 0.8125rem !important;
      line-height: 1.5 !important;
      white-space: normal !important;
    }
    ${R} .text-sm {
      font-size: 0.9375rem !important;
      line-height: 1.35 !important;
    }
    ${R} .text-xs {
      font-size: 0.8125rem !important;
      line-height: 1.45 !important;
    }
    ${R} .archetypes-png-tag-wrap {
      display: block !important;
      max-width: ${tagMax} !important;
      margin-left: auto !important;
      margin-right: auto !important;
      text-align: center !important;
      font-size: 0 !important;
      line-height: 0 !important;
    }
    ${R} .archetypes-png-tag-wrap > span.rounded-full {
      display: inline-block !important;
      box-sizing: border-box !important;
      margin: 0.3rem !important;
      vertical-align: middle !important;
      white-space: nowrap !important;
      font-size: 0.8125rem !important;
      line-height: 1 !important;
      font-weight: 600 !important;
      letter-spacing: 0.01em;
      padding: 0.22rem 0.65rem 0.42rem !important;
      border-width: 1px !important;
      border-style: solid !important;
      border-color: rgba(255, 255, 255, 0.22) !important;
      background-clip: padding-box !important;
      -webkit-background-clip: padding-box !important;
    }
    ${R} .archetypes-png-tag-wrap > span.rounded-full > span {
      display: inline-block !important;
      font-size: inherit !important;
      line-height: 1.1 !important;
      vertical-align: middle !important;
      transform: translateY(-2px) !important;
    }
    ${R} section > p.text-xs.text-gray-500 {
      display: block !important;
      font-size: 0.75rem !important;
      line-height: 1.4 !important;
      margin-bottom: 0.45rem !important;
      text-align: center !important;
    }
    ${R} .palette-bar-png-export .flex.min-h-5 span {
      white-space: normal !important;
      overflow: visible !important;
      text-overflow: clip !important;
      word-break: normal !important;
      overflow-wrap: anywhere;
      font-size: 0.75rem !important;
      line-height: 1.35 !important;
      font-weight: 600 !important;
      text-align: center !important;
    }
    ${R} .palette-bar-png-export .flex.min-h-5 {
      min-height: 1.5rem !important;
      align-items: flex-start !important;
    }
    ${R} footer {
      padding-top: 0.3rem !important;
      padding-bottom: 0.5rem !important;
      margin-top: 0 !important;
      transform: translateY(-3px) !important;
    }
    ${R} footer p {
      display: block !important;
      font-size: 0.6875rem !important;
      line-height: 1.45 !important;
      font-weight: 600 !important;
      letter-spacing: 0.14em !important;
      text-transform: uppercase !important;
      padding: 0 !important;
      margin: 0 !important;
    }
    ${R} .text-gray-400 {
      color: #b6becb !important;
    }
    ${R} .text-gray-500 {
      color: #aeb6c2 !important;
    }
    ${columnOverrides}
  `;
}

export function injectArchetypeSummaryPngExportStyles(
  clonedDoc: Document,
  options: { rootId: string; styleElementId: string; cssOptions?: ArchetypePngExportCssOptions }
): void {
  const { rootId, styleElementId, cssOptions } = options;
  const root = clonedDoc.getElementById(rootId);
  if (!root || clonedDoc.getElementById(styleElementId)) return;
  const style = clonedDoc.createElement('style');
  style.id = styleElementId;
  style.textContent = buildArchetypeSummaryPngExportCss(rootId, cssOptions);
  const head = clonedDoc.head ?? clonedDoc.querySelector('head');
  (head ?? clonedDoc.documentElement).appendChild(style);
}

function getCloneSubtreeElements(clonedDoc: Document, rootId: string): Element[] {
  const cap = clonedDoc.getElementById(rootId);
  if (cap) {
    return [cap, ...Array.from(cap.querySelectorAll('*'))];
  }
  return Array.from(clonedDoc.querySelectorAll('*'));
}

/**
 * Ajustes layout-only para el resumen de columna (Quién/Qué/Cómo) en el clon.
 * Forzamos inline styles para evitar que html2canvas ignore reglas de hoja.
 */
export function applyColumnSummaryCloneLayoutFixes(clonedDoc: Document, rootId: string): void {
  const root = clonedDoc.getElementById(rootId);
  if (!root) return;

  const header = root.querySelector('.archetypes-png-header');
  if (header instanceof HTMLElement) {
    const lead = header.querySelector<HTMLElement>(':scope > div:not([data-export-skip])');
    if (lead) {
      lead.style.setProperty('gap', '1rem');
      lead.style.setProperty('column-gap', '1rem');
    }
  }

  root.querySelectorAll<HTMLElement>('.column-summary-png-no-lift').forEach((el) => {
    el.style.setProperty('transform', 'none');
  });

  root.querySelectorAll<HTMLElement>('.inspiration-scroll-area').forEach((el) => {
    el.style.setProperty('overflow', 'visible');
    el.style.setProperty('max-height', 'none');
    el.style.setProperty('height', 'auto');
  });

  root.querySelectorAll<HTMLElement>('.archetypes-png-tag-wrap').forEach((el) => {
    el.style.setProperty('display', 'flex');
    el.style.setProperty('flex-wrap', 'wrap');
    el.style.setProperty('justify-content', 'center');
    el.style.setProperty('align-content', 'flex-start');
    el.style.setProperty('gap', '0.5rem');
    el.style.setProperty('row-gap', '0.5rem');
    el.style.setProperty('font-size', 'initial');
    el.style.setProperty('line-height', 'normal');
  });

  root.querySelectorAll<HTMLElement>('.archetypes-png-tag-wrap > span.rounded-full').forEach((el) => {
    el.style.setProperty('display', 'inline-flex');
    el.style.setProperty('align-items', 'center');
    el.style.setProperty('justify-content', 'center');
    el.style.setProperty('margin', '0');
    el.style.setProperty('line-height', '1.1');
    el.style.setProperty('padding', PNG_TAG_PILL_PADDING);
  });

  root.querySelectorAll<HTMLElement>('.archetypes-png-tag-wrap > span.rounded-full > span').forEach((el) => {
    el.style.setProperty('display', 'inline-block');
    el.style.setProperty('line-height', '1.2');
    el.style.setProperty('transform', `translateY(${PNG_TAG_TEXT_LIFT})`, 'important');
  });

  /** Persona / subtítulo (Quién): mismas reglas que tags, no llevan .archetypes-png-tag-wrap. */
  root.querySelectorAll<HTMLElement>('.column-summary-png-char-label').forEach((el) => {
    el.style.setProperty('display', 'flex');
    el.style.setProperty('flex-wrap', 'wrap');
    el.style.setProperty('justify-content', 'center');
    el.style.setProperty('align-items', 'center');
    el.style.setProperty('align-content', 'center');
    el.style.setProperty('gap', '0.5rem');
    el.style.setProperty('row-gap', '0.5rem');
    el.style.setProperty('font-size', 'initial');
    el.style.setProperty('line-height', 'normal');
    el.style.setProperty('width', '100%');
  });

  root.querySelectorAll<HTMLElement>('.column-summary-png-char-label > span').forEach((el) => {
    el.style.setProperty('display', 'inline-flex');
    el.style.setProperty('align-items', 'center');
    el.style.setProperty('justify-content', 'center');
    el.style.setProperty('flex-shrink', '0');
    el.style.setProperty('white-space', 'nowrap');
    el.style.setProperty('line-height', '1.15');
    el.style.setProperty('box-sizing', 'border-box');
    el.style.setProperty('padding', PNG_CHAR_PILL_PADDING);
  });

  root.querySelectorAll<HTMLElement>('.column-summary-png-char-label-text').forEach((el) => {
    el.style.setProperty('display', 'inline-block');
    el.style.setProperty('line-height', '1.15');
    el.style.setProperty('transform', `translateY(${PNG_CHAR_TEXT_LIFT})`, 'important');
  });

  root.querySelectorAll<HTMLElement>('.palette-bar-png-export .flex.min-h-5').forEach((el) => {
    el.style.setProperty('align-items', 'center', 'important');
  });

  root.querySelectorAll<HTMLElement>('.column-summary-png-axis-track').forEach((el) => {
    el.style.setProperty('position', 'relative');
    el.style.setProperty('z-index', '0');
  });

  root.querySelectorAll<HTMLElement>('.column-summary-png-axis-thumb').forEach((el) => {
    el.style.setProperty('z-index', '2');
  });

  root.querySelectorAll<HTMLElement>('.column-summary-png-axis-slot').forEach((el) => {
    const axisLabel = el.querySelector('.column-summary-png-axis-label');
    if (axisLabel instanceof HTMLElement) {
      axisLabel.style.setProperty('margin', '0 0 0.75rem 0', 'important');
      axisLabel.style.setProperty('padding-top', '0.1rem', 'important');
    }

    const row = el.querySelector('.flex.items-center.gap-3');
    if (row instanceof HTMLElement) {
      row.style.setProperty('align-items', 'center', 'important');
      row.style.setProperty('min-height', '2.75rem', 'important');
    }
  });

  root.querySelectorAll<HTMLElement>('.column-summary-png-card-frame').forEach((frame) => {
    frame.style.setProperty('display', 'flex', 'important');
    frame.style.setProperty('flex-direction', 'column', 'important');
    frame.style.setProperty('align-items', 'stretch', 'important');
    frame.style.setProperty('overflow', 'hidden', 'important');

    const tinderRoot = frame.firstElementChild;
    if (tinderRoot instanceof HTMLElement) {
      tinderRoot.style.setProperty('display', 'flex', 'important');
      tinderRoot.style.setProperty('flex-direction', 'column', 'important');
      tinderRoot.style.setProperty('align-items', 'stretch', 'important');
      tinderRoot.style.setProperty('justify-content', 'flex-start', 'important');
      tinderRoot.style.setProperty('flex', '1 1 0', 'important');
      tinderRoot.style.setProperty('min-height', '0', 'important');
      tinderRoot.style.setProperty('width', '100%', 'important');
      tinderRoot.style.setProperty('height', '100%', 'important');
    }

    frame.querySelectorAll<HTMLElement>('.column-summary-png-card-surface').forEach((surface) => {
      surface.style.setProperty('flex', '1 1 0', 'important');
      surface.style.setProperty('min-height', '0', 'important');
      surface.style.setProperty('width', '100%', 'important');
      surface.style.setProperty('align-self', 'stretch', 'important');
      surface.style.setProperty('border-width', '0', 'important');
      surface.style.setProperty('box-shadow', 'none', 'important');
    });
  });
}

/** Convierte colores que rompen html2canvas dentro del subárbol `#rootId`. */
export function sanitizeHtml2CanvasCaptureSubtree(clonedDoc: Document, rootId: string): void {
  const view = clonedDoc.defaultView;
  if (!view) return;

  getCloneSubtreeElements(clonedDoc, rootId).forEach((element) => {
    if (!isStylableCaptureNode(element)) return;
    const el = element;
    try {
      const computedStyle = view.getComputedStyle(el);
      for (const prop of HTML2CANVAS_COLOR_PROPS) {
        const value = computedStyle.getPropertyValue(prop);
        if (value && colorValueNeedsRgbSanitize(value)) {
          el.style.setProperty(prop, convertColorToRgbForHtml2Canvas(value));
        }
      }
      const boxShadow = computedStyle.getPropertyValue('box-shadow');
      if (boxShadow && boxShadow !== 'none' && styleValueHasHtml2CanvasUnsafeColor(boxShadow)) {
        el.style.setProperty('box-shadow', 'none');
      }
      const textShadow = computedStyle.getPropertyValue('text-shadow');
      if (textShadow && textShadow !== 'none' && styleValueHasHtml2CanvasUnsafeColor(textShadow)) {
        el.style.setProperty('text-shadow', 'none');
      }
      for (const f of ['filter', 'backdrop-filter', '-webkit-backdrop-filter'] as const) {
        const fv = computedStyle.getPropertyValue(f);
        if (fv && fv !== 'none' && styleValueHasHtml2CanvasUnsafeColor(fv)) {
          el.style.setProperty(f, 'none');
        }
      }
      sanitizeBackgroundImageAndFallback(el, computedStyle);
      sanitizeAllComputedColorLikeProps(el, view, computedStyle);
    } catch {
      /* ignore */
    }
  });
}
