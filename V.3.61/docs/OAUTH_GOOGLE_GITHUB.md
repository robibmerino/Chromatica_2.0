# Obtener Client ID y Client Secret (Google y GitHub)

Supabase te pide **Client ID** y **Client Secret** para activar "Iniciar sesión con Google" y "Iniciar sesión con GitHub". Esos datos **no están en Supabase**: los creas en Google y en GitHub y luego los pegas en Supabase.

**Callback URL:** Supabase ya te la muestra en la misma pantalla (ej. `https://TU_PROYECTO.supabase.co/auth/v1/callback`). Esa URL la usarás al crear la app en Google/GitHub.

---

## Google

1. Entra en la [Consola de desarrolladores de Google](https://console.developers.google.com/).
2. Crea un proyecto (o elige uno existente):
   - Arriba: **Select a project** → **New project** → nombre (ej. "Chromatica") → **Create**.
3. En el menú izquierdo: **APIs & Services** → **Credentials** (OAuth y credenciales).
4. Pulsa **+ Create Credentials** → **OAuth client ID**.
5. Si te pide configurar la pantalla de consentimiento:
   - **Configure consent screen** → elige **External** (o Internal si es solo para tu organización) → **Create**.
   - Rellena **App name** (ej. Chromatica), **User support email**, **Developer contact** → **Save and Continue** hasta terminar.
6. Vuelve a **Credentials** → **+ Create Credentials** → **OAuth client ID**.
7. **Application type:** **Web application**.
8. **Name:** por ejemplo "Chromatica web".
9. En **Authorized redirect URIs** pulsa **+ Add URI** y pega exactamente la **Callback URL** que muestra Supabase:
   - `https://cvpwxsussifqdiwupcco.supabase.co/auth/v1/callback`  
   (o la de tu proyecto si es distinta).
10. **Create**. Te saldrá un cuadro con:
    - **Client ID** (algo como `xxxx.apps.googleusercontent.com`) → cópialo a Supabase en **Client IDs**.
    - **Client secret** → cópialo a Supabase en **Client Secret (for OAuth)**.
11. En Supabase: **Authentication** → **Providers** → **Google** → pega Client ID y Client Secret → **Save**.

---

## GitHub

1. Entra en [GitHub](https://github.com) y ve a **Settings** (tu perfil, arriba a la derecha).
2. Menú izquierdo abajo: **Developer settings**.
3. **OAuth Apps** → **New OAuth App** (o "Register a new application").
4. Rellena:
   - **Application name:** Chromatica (o el que quieras).
   - **Homepage URL:** la URL de tu app, ej. `https://tu-dominio.vercel.app` o `http://localhost:5173` para pruebas.
   - **Authorization callback URL:** debe ser **exactamente** la que muestra Supabase:
     - `https://cvpwxsussifqdiwupcco.supabase.co/auth/v1/callback`  
     (sustituye por la de tu proyecto si es otra).
5. **Register application**.
6. En la página de la aplicación verás:
   - **Client ID** → cópialo a Supabase en **Client ID**.
   - Pulsa **Generate a new client secret**, copia el valor (solo se muestra una vez) → pégalo en Supabase en **Client Secret**.
7. En Supabase: **Authentication** → **Providers** → **GitHub** → pega Client ID y Client Secret → **Save**.

---

## Resumen

| Dónde       | Qué hacer |
|------------|-----------|
| **Google** | Console → Crear proyecto → Credentials → OAuth client ID (Web) → Redirect URI = Callback de Supabase → copiar Client ID y Secret. |
| **GitHub** | Settings → Developer settings → OAuth Apps → New → Callback URL = Callback de Supabase → copiar Client ID y generar Client Secret. |
| **Supabase** | Authentication → Providers → Google / GitHub → pegar Client ID y Client Secret → Save. |

La **Callback URL** es siempre la que pone Supabase en su pantalla (`.../auth/v1/callback`); no inventes otra.

---

## Después de guardar: Redirect URLs en Supabase (importante en producción)

Para que al iniciar sesión con Google o GitHub el navegador vuelva a **tu** app (y no falle), Supabase debe tener tu URL en la lista de permitidas:

1. En Supabase: **Authentication** → **URL Configuration** (o **Auth** → configuración de URLs).
2. **Site URL:** pon la URL principal de tu app.
   - **En producción (Vercel):** usa tu URL de Vercel, p. ej. `https://chromatica-2-0.vercel.app`.
   - Si dejas aquí `http://localhost:5173`, tras iniciar sesión con Google/GitHub te redirigirá a localhost y verás **"La página localhost ha rechazado la conexión"**. Cámbiala a la URL de tu app en producción.
3. **Redirect URLs:** añade todas las URLs desde las que los usuarios pueden iniciar sesión, por ejemplo:
   - `http://localhost:5173` (desarrollo)
   - `https://tu-dominio.vercel.app` (producción; la misma que Site URL si solo usas una)
   - Si usas previews: `https://*.vercel.app` (o las URLs concretas).

Si no añades tu URL aquí, OAuth puede redirigir a una página en blanco o mostrar error de "redirect URL not allowed".
