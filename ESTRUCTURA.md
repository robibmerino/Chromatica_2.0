# Chormatica — Estructura del proyecto

Documento para orientación rápida (desarrollo y asistente IA). Estado: **V2 — Territorio visual listo**.

---

## Stack

- **React 19** + **TypeScript** + **Vite 7**
- **Tailwind CSS 4**
- **Framer Motion** (animaciones)
- **html2canvas** + **jspdf** + **jszip** (export)

---

## Entrada y flujo principal

| Archivo | Rol |
|--------|-----|
| `index.html` | HTML base; fuentes (Google Fonts / local). |
| `src/main.tsx` | Punto de entrada React. |
| `src/App.tsx` | Splash → `GuidedPaletteCreator`. |
| `src/index.css` | Estilos globales y Tailwind. |

La app es esencialmente el **Guided Palette Creator**: creación guiada de paletas y vistas de aplicación (Poster, Branding, etc.).

---

## Núcleo: creación de paletas

| Dónde | Qué |
|-------|-----|
| `src/components/GuidedPaletteCreator.tsx` | Contenedor del flujo por fases. |
| `src/components/GuidedPaletteCreator/config/` | Config de fases, pestañas, arquetipos, refinamiento, inspiración, etc. |
| `src/components/GuidedPaletteCreator/hooks/useGuidedPalette.ts` | Estado y lógica de la paleta guiada. |
| `src/components/GuidedPaletteCreator/*.tsx` | Fases: Analysis, Inspiration, Refinement, Application, Save; componentes compartidos (PhaseLayout, PhaseNav, SectionBanner, etc.). |

Las paletas y tipos están en `src/types/guidedPalette.ts` y `src/types/palette.ts`. Datos de conceptos en `src/data/colorConcepts.ts`.

---

## Utilidades de color

| Archivo | Contenido |
|---------|-----------|
| `src/utils/colorUtils.ts` | Conversiones (hex/rgb/hsl), generación por armonía, **`getPosterColors(palette, dark)`** para paleta de apoyo Poster/Branding (modo claro/oscuro). |
| `src/utils/cn.ts` | Utilidad `cn()` (clsx + tailwind-merge). |

`getPosterColors` es la referencia para colores en **Poster** y **Branding (Territorio visual)**.

---

## Vista de aplicaciones (showcase)

Todo el contenido “aplicado” (Poster, Branding, etc.) está en un solo componente grande:

| Archivo | Contenido |
|---------|-----------|
| `src/components/ApplicationShowcase.tsx` | Selector de categoría (Poster, Branding, …) y variantes. **Poster**: variantes (ej. Publicity, tendencias 2026, template A3/A2). **Branding**: variante **Territorio visual** (plantilla tipo Aura — Organic Coffee), misma base A2/A3 (620×877 px), tipografía (Libre Baskerville, Caveat, Plus Jakarta Sans), paleta, patrón de hoja, aplicaciones (Coffee Bag, Stamp Card, Apron), footer. |

- Constantes de tamaño: `POSTER_BASE_WIDTH`, `POSTER_HEIGHT`, escala 0.78.
- Colores de la plantilla: `getPosterColors(palette, dark)` (palette y dark del contexto de la paleta guiada).

---

## Otros componentes

| Componente | Uso |
|------------|-----|
| `BaseColorPicker.tsx` | Selector de color base. |
| `PosterExamples.tsx` | Ejemplos/plantillas de póster (si se usa fuera del showcase). |
| `PaletteAnalysis.tsx` | Análisis de paleta. |
| `ScientificAnalysis.tsx` | Análisis científico. |
| `InteriorPreviews.tsx` | Previews de interiores. |
| `ExportPanelPro.tsx` (en `export/`) | Exportación avanzada. |
| `SplashScreen.tsx`, `ChromaticaLogo.tsx`, `ButtonParticles.tsx` | UI de entrada y marca. |

Carpeta `src/components/inspiration/`: creadores por arquetipos, formas, armonías, extractor de color de imagen, paletas en tendencia, etc.

---

## Dónde tocar para…

- **Cambiar flujo o textos del asistente de paletas:** `GuidedPaletteCreator` y su `config/`.
- **Cambiar colores/tipografía del Poster o Branding:** `ApplicationShowcase.tsx` y `colorUtils.getPosterColors`.
- **Añadir una variante de Poster:** `ApplicationShowcase.tsx` → categoría Poster → `renderPoster*` y el mapa de variantes.
- **Añadir una variante o categoría de Branding:** `ApplicationShowcase.tsx` → categoría Branding → `renderBranding*`.
- **Export (PDF/ZIP):** `ExportPanelPro.tsx` y uso de html2canvas/jspdf/jszip.

---

## Notas

- **Territorio visual (Branding)** usa la misma plantilla base que Poster (A2/A3), con tipografía y patrón propios.
- Fuentes: definidas en `index.html`; en el componente se referencian por nombre (ej. `'Plus Jakarta Sans'`, `'Libre Baskerville'`).
