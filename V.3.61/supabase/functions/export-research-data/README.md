# Edge Function: export-research-data

Devuelve **todas** las paletas de `public.palettes` para que el front pueda exportarlas a Excel. Solo responde si el usuario autenticado está en la allowlist de administración.

## Despliegue

1. Instala Supabase CLI y enlaza el proyecto:
   ```bash
   npx supabase link --project-ref <tu-project-ref>
   ```

2. Configura el secreto con los emails permitidos (opcional; por defecto usa `robi20leoc@gmail.com`):
   ```bash
   npx supabase secrets set RESEARCH_ADMIN_EMAILS=robi20leoc@gmail.com
   ```
   Para varios emails: `RESEARCH_ADMIN_EMAILS=email1@example.com,email2@example.com`

3. Despliega la función:
   ```bash
   npx supabase functions deploy export-research-data
   ```

En el dashboard de Supabase, **Project Settings → Edge Functions** puedes ver y editar los secrets.

## Uso desde la app

La vista "Análisis investigación" (solo visible para usuarios en la allowlist) llama a:

```
GET <SUPABASE_URL>/functions/v1/export-research-data
Authorization: Bearer <session.access_token>
```

Si la función no está desplegada o el usuario no está en la allowlist, la app mostrará un mensaje de error al intentar exportar.
