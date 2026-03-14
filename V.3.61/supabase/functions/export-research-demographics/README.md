# Edge Function: export-research-demographics

Devuelve todas las filas de `public.research_demographics` (sociodemográficas de usuarios registrados que dieron consentimiento). Solo responde si el usuario autenticado está en la allowlist.

## Requisito

Crear antes la tabla con `docs/supabase-research-demographics.sql` en el SQL Editor de Supabase.

## Despliegue

```bash
npx supabase functions deploy export-research-demographics
```

Usa el mismo secreto `RESEARCH_ADMIN_EMAILS` que la función `export-research-data`.
