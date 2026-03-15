/**
 * Edge Function: delete-user-after-decline
 * Elimina la cuenta del usuario que hace la petición (autenticado por JWT).
 * Uso: cuando el usuario pulsa "No iniciar sesión" en el gate de investigación,
 * así la cuenta no se crea en Supabase y la próxima vez que entre con OAuth
 * volverá a ver el gate.
 *
 * El cliente envía: Authorization: Bearer <anon_key> y body: { access_token: <user_jwt> }.
 */

import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, Apikey',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return Response.json({ error: 'Method not allowed' }, { status: 405, headers: corsHeaders });
  }

  let body: { access_token?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Body JSON inválido' }, { status: 400, headers: corsHeaders });
  }
  const jwt = (body?.access_token ?? '').trim();
  if (!jwt) {
    return Response.json({ error: 'Falta access_token en el body' }, { status: 401, headers: corsHeaders });
  }

  const authClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data: { user }, error: getUserError } = await authClient.auth.getUser(jwt);
  if (getUserError || !user?.id) {
    return Response.json({ error: 'Token inválido o expirado' }, { status: 401, headers: corsHeaders });
  }

  const adminClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { error: deleteError } = await adminClient.auth.admin.deleteUser(user.id);
  if (deleteError) {
    return Response.json(
      { error: deleteError.message || 'Error al eliminar la cuenta' },
      { status: 500, headers: corsHeaders }
    );
  }

  return Response.json({ ok: true }, { status: 200, headers: corsHeaders });
});
