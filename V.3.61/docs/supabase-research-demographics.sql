-- Sociodemográficas de personas registradas que dan consentimiento.
-- Ejecutar en Supabase → SQL Editor. La app hace upsert por user_id al dar consent.

create table if not exists public.research_demographics (
  user_id uuid primary key references auth.users(id) on delete cascade,
  age_range text,
  gender text,
  design_career text,
  is_upv_student boolean,
  consented_at timestamptz not null default now()
);

alter table public.research_demographics enable row level security;

drop policy if exists "Users can insert/update own demographics" on public.research_demographics;
create policy "Users can insert/update own demographics"
  on public.research_demographics
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
