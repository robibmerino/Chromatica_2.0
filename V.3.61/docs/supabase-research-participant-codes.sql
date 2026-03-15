-- Códigos de participante (1, 2, 3, ...) para anonimización en análisis.
-- Cada user_id de research_demographics tiene un code único y estable.
-- Ejecutar en Supabase → SQL Editor después de research_demographics.

create table if not exists public.research_participant_codes (
  user_id uuid primary key references auth.users(id) on delete cascade,
  code integer not null unique
);

create index if not exists idx_research_participant_codes_code on public.research_participant_codes(code);

alter table public.research_participant_codes enable row level security;

-- Solo el service role (Edge Functions) puede leer/escribir; usuarios normales no.
drop policy if exists "Service role only" on public.research_participant_codes;
create policy "Service role only"
  on public.research_participant_codes
  for all
  using (false)
  with check (false);

-- RPC: asigna code a los user_id que aún no lo tienen (orden: max(code)+1, +2, ...).
-- LANGUAGE sql permite que WITH ... INSERT sea una sola sentencia (en plpgsql da error de sintaxis).
create or replace function public.ensure_participant_codes(p_user_ids uuid[])
returns void
language sql
security definer
set search_path = public
as $$
  with base as (select coalesce(max(code), 0) as b from public.research_participant_codes),
       missing as (
         select distinct u as user_id from unnest(p_user_ids) as u
         where u is not null
         and not exists (select 1 from public.research_participant_codes c where c.user_id = u)
       ),
       numbered as (select user_id, row_number() over (order by user_id) as rn from missing)
  insert into public.research_participant_codes (user_id, code)
  select n.user_id, (select b from base) + n.rn from numbered n;
$$;

-- Después de ejecutar este script, redespliega la Edge Function export-research-demographics.
