# delete-user-after-decline

Elimina la cuenta del usuario que hace la petición (autenticado por JWT). Se usa cuando el usuario pulsa **"No iniciar sesión"** en el gate de investigación: así la cuenta no se mantiene en Supabase y la próxima vez que entre con Google/GitHub volverá a ver la pantalla de investigación.

**Despliegue:** `supabase functions deploy delete-user-after-decline`

No requiere secrets adicionales; usa `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` (ya definidos en el proyecto).
