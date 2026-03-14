# Integraciones (plugins y workflow)

Resumen de librerías y herramientas añadidas al proyecto.

## 1. Plugins y librerías npm

| Paquete | Uso |
|--------|-----|
| **zod** | Validación de variables de entorno en `src/lib/env.ts`; `getSupabaseConfig()` para Supabase. |
| **@tanstack/react-query** | Cache y estado servidor: `usePalettesQuery`, `usePaletteMutations`, `invalidatePalettes`. Provider en `main.tsx`. |
| **vite-plugin-pwa** | PWA: manifest, service worker, caché (incl. fuentes). Iconos: añadir `public/icon-192.png` y `public/icon-512.png` para "Añadir a pantalla de inicio". |
| **@playwright/test** | Tests E2E en `e2e/`. Scripts: `npm run e2e`, `npm run e2e:ui`, `npm run e2e:headed`. Primera ejecución: `npx playwright install` (navegadores). |
| **Storybook** | Documentación de componentes. Scripts: `npm run storybook`, `npm run build-storybook`. Config en `.storybook/`; ejemplo en `BaseColorPicker.stories.tsx`. Instalado con `--legacy-peer-deps` (Vite 7 no soportado oficialmente aún). |

## 2. Workflow y CI

- **GitHub Actions**: `.github/workflows/ci.yml` en la raíz del repo (Chromatica) con `working-directory: V.3.61`: lint, tests unitarios, build e **E2E (Playwright)**. Se instala solo Chromium para E2E. En builds de CI las variables de Supabase van vacías.
- **Reglas Cursor**:  
  - `tests-vitest.mdc`: convenciones Vitest y Testing Library.  
  - `supabase-react-query-env.mdc`: env con Zod, Supabase, React Query y query keys.

## 3. Scripts npm

- `npm run e2e` — Playwright (smoke y E2E).
- `npm run e2e:ui` — Playwright con interfaz.
- `npm run e2e:headed` — Playwright con navegador visible.
- `npm run storybook` — Storybook en http://localhost:6006.
- `npm run build-storybook` — Build estático de Storybook.

## 4. Supabase (más allá de auth y paletas)

- **OAuth (Google / GitHub)**: En `AuthContext` está `signInWithOAuth(provider)`; en `AuthPage` hay botones "Google" y "GitHub". Hay que activar los proveedores y configurar Client ID/Secret en Supabase → Authentication → Providers. Ver `docs/SUPABASE_SETUP.md` §5.
- **Realtime**: Suscripción a cambios en `palettes` en `usePalettesRealtime(userId)`; al insert/update/delete se invalida React Query. Se usa en `MainView`. Hay que ejecutar el SQL que añade la tabla a la publicación Realtime (`docs/supabase-realtime-storage-share.sql`).
- **Storage**: Bucket `user-assets` con RLS por carpeta `user_id/`. Helper en `src/lib/supabaseStorage.ts`: `uploadUserAsset(userId, file)`, `getPublicUrl(userId, filename)`. Pensado para avatares e imágenes de inspiración.
- **Compartir paleta por link**: Tabla `palette_share_tokens`, Edge Functions `create-share-link` (POST, auth) y `get-shared-palette` (GET, anónimo). En el panel de cuenta, botón "Compartir enlace" que copia la URL; quien abre `/?share=TOKEN` ve la paleta en la app. Ver `docs/SUPABASE_SETUP.md` §6.

## 5. Iconos PWA

Para que "Añadir a la pantalla de inicio" muestre iconos correctos, añade en `public/`:

- `icon-192.png` (192×192)
- `icon-512.png` (512×512)

Si no existen, la PWA sigue funcionando pero sin icono en la instalación.
