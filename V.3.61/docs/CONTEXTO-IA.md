# Contexto para IA — Chormatica

Documento breve para que una IA (o una persona nueva) entienda la estructura del proyecto y pueda editar con criterio.

---

## 1. Qué es el proyecto

- **Chormatica**: aplicación que aplica **paletas de color** a plantillas de:
  - **Arquitectura** (interiores: estudio, cafetería, oficina, etc.)
  - **Poster** (carteles: conference, exhibition, festival, etc.)
  - **Branding** (identidad: territorio visual, dirección fotográfica, mockup, **ilustraciones**, etc.)

- La paleta viene de la “paleta principal” y la “paleta de apoyo” (claro/oscuro). El showcase muestra vistas previas según la variante elegida.

---

## 2. Dónde está lo importante

| Qué | Dónde |
|-----|--------|
| Tipos de categorías, variantes, **PosterPalette** | `src/components/ApplicationShowcase/types.tsx` |
| Construcción de la paleta para pósters/branding | `src/components/ApplicationShowcase.tsx` (p. ej. `getPosterColors`) |
| Constantes de póster (ancho, alto, escala, URLs) | `src/components/ApplicationShowcase/constants.ts` |
| **Póster Ilustraciones** (Bru, icon set, patrones, stickers) | `src/components/ApplicationShowcase/branding/Ilustraciones.tsx` |
| Fuentes usadas en branding | `src/components/ApplicationShowcase/branding/brandingFonts.ts` |

---

## 3. Paleta en código (PosterPalette)

- **Tipo:** `PosterPalette` = colores de interiores + `text`, `textLight`, `accent2?`.
- En **Ilustraciones** (y otros pósters) se usan alias:
  - **c1** = primary  
  - **c2** = accent  
  - **cA2** = accent2 (o c2 si no existe)  
  - **c3** = surface  
  - **c4** = secondary  
  - **c5** = background  
  - **c6** = muted  
  - **cText** = text  
  - **textAlpha** ≈ 0.58 para opacidad de rasgos (ojos, boca, líneas).

- Regla: en Ilustraciones **no usar colores fuera de esta paleta** (p. ej. verdes de emoji; usar SVG o `color` de paleta).

---

## 4. Ilustraciones.tsx — bloques del póster

1. **Header** — barra superior (c1) y logo “aura”.
2. **Hero** — escena con mascota **Bru** (fondo c3/c4), nubes, hojas, destellos, dos **mini beans** y Bru central con taza.
3. **Grid de 4 tarjetas** (posición `top: ILLUST_GRID_TOP_PCT` = 45%):
   - Icon Set  
   - Mascot Poses (4 emociones)  
   - Patterns (Foliage, Beans, Geometric, Waves)  
   - Sticker Sheet  
4. **Illustration Guidelines** (posición `ILLUST_GUIDELINES_TOP_PCT` = 78%).
5. **Footer** — “aura”.

Subcomponentes reutilizables:
- **MiniBru** — variantes `hero` y `pose`; recibe `colors`, `variant`, `pose?`, `wrapperClassName`, `wrapperStyle`.
- **PatternFoliage**, **PatternBeans**, **PatternGeometric**, **PatternWaves** — reciben colores y `labelStyle`.

Constantes útiles: `LEAF_SVG_PATH`, `WAVES_TOP_PERCENTS`, `GEOMETRIC_ROW_LEFT_PCTS`, `GEOMETRIC_DIAMOND_SIZE`.

---

## 5. Convenciones de código

- Respuesta al usuario en **español**.
- Estilos que dependen de la paleta: objeto `style={{ ... }}` con c1–c6, cText, etc.
- Tailwind para layout/utilidades; sin colores fijos fuera de la paleta en branding.
- Constantes y datos estáticos al inicio del archivo; estilos repetidos en variables o subcomponentes.

---

Si amplías el proyecto (nuevas variantes o pósters), actualiza este documento y la regla en `.cursor/rules/chormatica.mdc`.
