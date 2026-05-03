-- ============================================================
-- Petit Mokus Studio — Supabase migration
-- Run once in your Supabase project: SQL Editor → paste → Run
-- Safe to re-run (uses IF NOT EXISTS / ON CONFLICT).
-- ============================================================

-- 1. Tables -----------------------------------------------------

create extension if not exists "pgcrypto";

create table if not exists studio_projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  seed text not null,
  status text not null default 'brief'
    check (status in ('brief', 'manuscript', 'illustrations', 'published')),
  brief_data jsonb,
  brief_approved_at timestamptz,
  manuscript_data jsonb,
  manuscript_approved_at timestamptz,
  illustrations_data jsonb,
  illustrations_approved_at timestamptz,
  published_book_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists studio_projects_status_idx on studio_projects(status);

create table if not exists studio_versions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references studio_projects(id) on delete cascade,
  stage text not null check (stage in ('brief', 'manuscript', 'illustrations')),
  data jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists studio_versions_project_idx on studio_versions(project_id, created_at desc);

create table if not exists published_books (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  language text not null default 'EN',
  recurring_phrase text,
  pages jsonb not null,
  cover_image_url text,
  source_project_id uuid references studio_projects(id) on delete set null,
  published_at timestamptz not null default now()
);

create index if not exists published_books_pub_idx on published_books(published_at desc);

-- Single-row table: shared character bible used in every illustration prompt
-- and in brief/manuscript generation. Editable from the Studio dashboard so
-- the cast stays consistent across all stories.
create table if not exists studio_character_bible (
  id text primary key default 'global',
  papa text not null,
  maxime text not null,
  clothing_before_pajamas text not null,
  clothing_pajamas text not null,
  style text not null,
  additional_characters jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

alter table studio_character_bible
  add column if not exists additional_characters jsonb not null default '[]'::jsonb;

-- 2. Row-Level Security --------------------------------------------

alter table studio_projects enable row level security;
alter table studio_versions enable row level security;
alter table published_books enable row level security;

-- Studio tables: server uses service_role key (bypasses RLS automatically).
-- We add a deny-all policy for anon so the tables are safe even if the anon
-- key is leaked.
drop policy if exists "anon-no-access-studio-projects" on studio_projects;
create policy "anon-no-access-studio-projects"
  on studio_projects for all to anon using (false) with check (false);

drop policy if exists "anon-no-access-studio-versions" on studio_versions;
create policy "anon-no-access-studio-versions"
  on studio_versions for all to anon using (false) with check (false);

alter table studio_character_bible enable row level security;
drop policy if exists "anon-no-access-studio-character-bible" on studio_character_bible;
create policy "anon-no-access-studio-character-bible"
  on studio_character_bible for all to anon using (false) with check (false);

-- Published books: public read, no public write.
drop policy if exists "public-read-published-books" on published_books;
create policy "public-read-published-books"
  on published_books for select to anon using (true);

-- 3. Storage bucket for illustrations -------------------------------

insert into storage.buckets (id, name, public)
values ('bedtime-books', 'bedtime-books', true)
on conflict (id) do update set public = true;

-- Public can read images from the bucket.
drop policy if exists "public-read-bedtime-books" on storage.objects;
create policy "public-read-bedtime-books"
  on storage.objects for select to anon
  using (bucket_id = 'bedtime-books');

-- Server uses service_role for uploads (bypasses RLS automatically).
