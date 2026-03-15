/**
 * Edge Function: export-research-data
 * Devuelve todas las filas de public.palettes solo si el usuario que llama
 * está en la allowlist (RESEARCH_ADMIN_EMAILS).
 *
 * Configuración en Supabase:
 * - Secrets: RESEARCH_ADMIN_EMAILS = robi20leoc@gmail.com (o varios separados por coma)
 * - SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY suelen estar ya definidos.
 */

import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const ADMIN_EMAILS_RAW = Deno.env.get('RESEARCH_ADMIN_EMAILS') ?? 'robi20leoc@gmail.com';
const ADMIN_EMAILS = ADMIN_EMAILS_RAW.split(',').map((e) => e.trim().toLowerCase()).filter(Boolean);

function allowlistIncludes(email: string | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.trim().toLowerCase());
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Apikey, X-User-Token',
      },
    });
  }

  const userToken = req.headers.get('X-User-Token')?.trim() ?? req.headers.get('Authorization')?.replace(/^Bearer\s+/i, '').trim();
  if (!userToken) {
    return Response.json({ error: 'Missing X-User-Token or Authorization' }, { status: 401 });
  }
  const authHeader = `Bearer ${userToken}`;
  const token = userToken;

  const authClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: { user }, error: userError } = await authClient.auth.getUser(token);
  if (userError || !user?.email) {
    return Response.json({ error: 'Invalid or expired token' }, { status: 401 });
  }
  if (!allowlistIncludes(user.email)) {
    return Response.json({ error: 'Forbidden: not in research admin allowlist' }, { status: 403 });
  }

  const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  const { data: rows, error } = await adminClient
    .from('palettes')
    .select('id, user_id, name, colors, color_1, color_2, color_3, color_4, color_5, color_6, color_7, color_8, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return new Response(JSON.stringify(rows ?? []), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
});
