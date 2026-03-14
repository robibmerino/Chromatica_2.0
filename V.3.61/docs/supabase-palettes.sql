-- Copia TODO este archivo y pégalo en Supabase → SQL Editor → New query → Run

-- Tabla de paletas por usuario
create table if not exists public.palettes (
  id text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  colors jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

-- Columnas opcionales para ver cada color en una celda (paletas de 1–8 colores)
alter table public.palettes add column if not exists color_1 text;
alter table public.palettes add column if not exists color_2 text;
alter table public.palettes add column if not exists color_3 text;
alter table public.palettes add column if not exists color_4 text;
alter table public.palettes add column if not exists color_5 text;
alter table public.palettes add column if not exists color_6 text;
alter table public.palettes add column if not exists color_7 text;
alter table public.palettes add column if not exists color_8 text;

-- Índice para listar rápido las paletas de un usuario
create index if not exists palettes_user_id_idx on public.palettes(user_id);

-- Solo el dueño puede ver/crear/actualizar/borrar sus paletas
alter table public.palettes enable row level security;

drop policy if exists "Users can do everything on own palettes" on public.palettes;
create policy "Users can do everything on own palettes"
  on public.palettes
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
