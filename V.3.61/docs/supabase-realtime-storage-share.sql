-- Ejecutar en Supabase → SQL Editor (después de supabase-palettes.sql)
-- Incluye: Realtime en palettes, bucket Storage, tabla para compartir paleta por link

-- ---------- Realtime ----------
-- Habilitar Realtime en la tabla palettes (sincronización entre pestañas/dispositivos).
-- Si falla con "already in publication", la tabla ya estaba añadida; puedes ignorar el error.
alter publication supabase_realtime add table public.palettes;

-- ---------- Storage: bucket para assets del usuario (avatares, imágenes de inspiración) ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'user-assets',
  'user-assets',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- RLS: solo el usuario puede leer/escribir en su carpeta (path = user_id/...)
create policy "Users can read own assets"
  on storage.objects for select
  using (bucket_id = 'user-assets' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can upload to own folder"
  on storage.objects for insert
  with check (bucket_id = 'user-assets' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can update own assets"
  on storage.objects for update
  using (bucket_id = 'user-assets' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "Users can delete own assets"
  on storage.objects for delete
  using (bucket_id = 'user-assets' and (storage.foldername(name))[1] = auth.uid()::text);

-- ---------- Compartir paleta por link ----------
create table if not exists public.palette_share_tokens (
  id uuid primary key default gen_random_uuid(),
  token text not null unique,
  palette_id text not null references public.palettes(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  expires_at timestamptz
);

create index if not exists palette_share_tokens_token_idx on public.palette_share_tokens(token);
create index if not exists palette_share_tokens_palette_id_idx on public.palette_share_tokens(palette_id);

alter table public.palette_share_tokens enable row level security;

-- Solo el dueño de la paleta puede crear/ver/borrar sus tokens
create policy "Users can manage own share tokens"
  on public.palette_share_tokens
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Función RPC para leer una paleta compartida por token (sin Edge Function, evita el gateway).
-- Ejecutable por anon para que quien abra el enlace ?share=TOKEN pueda cargar la paleta.
create or replace function public.get_shared_palette(share_token text)
returns json
language sql
security definer
set search_path = public
as $$
  select json_build_object(
    'id', p.id,
    'name', p.name,
    'colors', p.colors,
    'createdAt', p.created_at
  )
  from palette_share_tokens t
  join palettes p on p.id = t.palette_id
  where t.token = share_token
    and (t.expires_at is null or t.expires_at > now());
$$;

grant execute on function public.get_shared_palette(text) to anon;
grant execute on function public.get_shared_palette(text) to authenticated;
