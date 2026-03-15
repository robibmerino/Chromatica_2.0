# Configurar Supabase para Chromatica (cuenta y paletas)

Chromatica puede usar Supabase para guardar la sesión y las paletas en la nube. Sin configurar Supabase, la app sigue funcionando y las paletas se guardan solo en el navegador (localStorage).

## 1. Crear proyecto en Supabase

1. Entra en [supabase.com](https://supabase.com) y crea una cuenta si no tienes.
2. **New project**: nombre (ej. `chromatica`), contraseña de base de datos (guárdala), región.
3. Espera a que el proyecto esté listo.

## 2. Tablas: `palettes` y `profiles`

### Tabla `palettes`

**Importante:** en el SQL Editor solo se puede ejecutar código SQL. No pegues títulos ni instrucciones (eso da error).

1. En Supabase: **SQL Editor** (menú izquierdo) → **New query**.
2. Abre el archivo **`docs/supabase-palettes.sql`** de este proyecto y copia **todo** su contenido.
3. Pégalo en el editor de Supabase (borra antes lo que hubiera).
4. Pulsa **Run** (o el botón de ejecutar).

Si todo va bien, verás un mensaje de éxito. La tabla `palettes` quedará creada.

### Tabla `profiles` (nombre de perfil que no pisa OAuth)

Para que el nombre que el usuario edita en "Mi perfil" se mantenga al cerrar sesión y volver a entrar con Google/GitHub:

1. En **SQL Editor** → **New query**, abre **`docs/supabase-profiles.sql`** y ejecuta su contenido.
2. Así se crea la tabla `profiles` (id, full_name) con RLS; la app guarda ahí el nombre al pulsar "Guardar cambios".

## 3. Variables de entorno

En Supabase: **Project Settings** → **API**: copia **Project URL** y **anon public** key.

- **En local**: crea un archivo `.env` en la raíz del proyecto (junto a `package.json`):

  ```
  VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
  VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  ```

  No subas `.env` a Git (debería estar en `.gitignore`).

- **En Vercel**: en tu proyecto → **Settings** → **Environment Variables**. Añade:
  - `VITE_SUPABASE_URL` = tu Project URL
  - `VITE_SUPABASE_ANON_KEY` = tu anon public key  
  Vuelve a desplegar para que se apliquen.

## 4. Confirmar email (opcional)

Por defecto Supabase puede exigir confirmar el email para iniciar sesión. En **Authentication** → **Providers** → **Email** puedes desactivar "Confirm email" si quieres probar sin correo de verificación.

## 5. OAuth (Google / GitHub) — opcional

Para que aparezcan los botones "Google" y "GitHub" en la pantalla de inicio de sesión:

1. En Supabase: **Authentication** → **Providers** → activa **Google** y/o **GitHub**.
2. **Client ID y Client Secret** no están en Supabase: hay que crearlos en Google y en GitHub. Guía paso a paso: **`docs/OAUTH_GOOGLE_GITHUB.md`** (qué hacer en la consola de Google, en GitHub Developer settings, y qué pegar en Supabase; la Callback URL es la que muestra Supabase en esa misma pantalla).
3. La app ya incluye la UI; al pulsar el botón se redirige al proveedor y luego de vuelta a tu app.

## 6. Realtime, Storage y compartir paleta — opcional

Ejecuta en **SQL Editor** el archivo **`docs/supabase-realtime-storage-share.sql`**. Eso habilita:

- **Realtime** en la tabla `palettes`: si cambias paletas desde otra pestaña o dispositivo, la lista se actualiza sola.
- **Storage** bucket `user-assets`: para avatares o imágenes de inspiración (rutas `user_id/nombre.png`). La app usa el helper `src/lib/supabaseStorage.ts` (upload, URL pública).
- **Tabla `palette_share_tokens`** y políticas RLS para compartir paleta por link.

En la app, el botón "Compartir enlace" (panel de cuenta) **crea el enlace en el cliente** (insert en `palette_share_tokens`). Quien abre `?share=TOKEN` **carga la paleta vía RPC** `get_shared_palette` en la BD (no usa Edge Function). Las Edge Functions `create-share-link` y `get-shared-palette` son opcionales; si quieres desplegarlas, ver **`docs/DESPLIEGUE_EDGE_FUNCTIONS.md`**.

## 7. Investigación (opcional)

Para la pestaña **Análisis de datos para investigación** (solo usuarios en allowlist):

1. **Tabla sociodemográficas**: en SQL Editor ejecuta `docs/supabase-research-demographics.sql`.
2. **Edge Functions**: despliega `export-research-data` y `export-research-demographics` (ver README en cada carpeta en `supabase/functions/`) y configura el secreto `RESEARCH_ADMIN_EMAILS`.

**Dónde se guardan las sociodemográficas en Supabase:** en la tabla **`public.research_demographics`** (columnas: `user_id`, `age_range`, `gender`, `design_career`, `is_upv_student`, `consented_at`). La app hace **upsert** cuando el usuario da consentimiento (pantalla de investigación o registro) y está logueado; el componente `SyncDemographics` sincroniza desde localStorage a esa tabla. Para ver los datos: en Supabase → **Table Editor** → **research_demographics**.

## Resumen (actualizado)

- Sin `.env` / sin variables en Vercel: Chromatica funciona igual, paletas solo en el navegador.
- Con Supabase configurado: "Iniciar sesión" en la cabecera; email/contraseña y, si los activas, Google/GitHub.
- Opcional: Realtime + Storage + compartir enlace (SQL `supabase-realtime-storage-share.sql` + RPC `get_shared_palette`; las Edge Functions de compartir son opcionales).
- Opcional: tabla `research_demographics` y Edge Functions para exportar datos de investigación.

## Lo que puede quedar pendiente (checklist)

| Qué | Dónde | Notas |
|-----|--------|--------|
| **Redirect URLs** (OAuth) | Supabase → **Authentication** → **URL Configuration** | **Site URL** en producción debe ser tu URL de Vercel (ej. `https://chromatica-2-0.vercel.app`). Si está en `localhost`, tras Google/GitHub verás "localhost ha rechazado la conexión". Añade también **Redirect URLs**. Ver `docs/OAUTH_GOOGLE_GITHUB.md` al final. |
| **Variables en producción** | Vercel (u otro host) → Environment Variables | `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` para que auth y paletas funcionen en la URL pública. |
| **Iconos PWA** | Carpeta `public/` | Añade `icon-192.png` e `icon-512.png` para que "Añadir a la pantalla de inicio" muestre icono. Opcional; la PWA funciona sin ellos. Ver `docs/INTEGRACIONES.md` §5. |
| **Investigación** | Solo si quieres la pestaña "Análisis de datos" | Ejecuta `docs/supabase-research-demographics.sql`, despliega Edge Functions `export-research-data` y `export-research-demographics`, configura `RESEARCH_ADMIN_EMAILS`. Solo usuarios en allowlist ven la pestaña. |
| **Confirmar email** | Supabase → **Providers** → **Email** | Si quieres probar sin verificar correo, desactiva "Confirm email". |
