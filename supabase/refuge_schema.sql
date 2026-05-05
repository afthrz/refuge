-- Refuge Supabase schema
-- Paste this into Supabase SQL Editor and run it once.

create extension if not exists pgcrypto;

create table if not exists public.sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  mood text not null,
  duration integer not null check (duration > 0),
  completed_at timestamptz not null default now()
);

alter table public.sessions enable row level security;

create policy "Users can read their own sessions"
on public.sessions
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can create their own sessions"
on public.sessions
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their own sessions"
on public.sessions
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own sessions"
on public.sessions
for delete
to authenticated
using (auth.uid() = user_id);

create index if not exists sessions_user_completed_at_idx
on public.sessions (user_id, completed_at desc);
