-- GradePilot: Categories & Assignments tables with Row Level Security
-- Migration: 20260215000000_create_grades_tables

-- ============================================================
-- CATEGORIES TABLE
-- ============================================================
create table if not exists public.categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null default 'New Category',
  weight      numeric not null default 0,
  user_id     uuid not null references auth.users(id) on delete cascade,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Enable RLS
alter table public.categories enable row level security;

-- Users can only SELECT their own categories
create policy "Users can read own categories"
  on public.categories
  for select
  using (auth.uid() = user_id);

-- Users can only INSERT their own categories
create policy "Users can insert own categories"
  on public.categories
  for insert
  with check (auth.uid() = user_id);

-- Users can only UPDATE their own categories
create policy "Users can update own categories"
  on public.categories
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Users can only DELETE their own categories
create policy "Users can delete own categories"
  on public.categories
  for delete
  using (auth.uid() = user_id);


-- ============================================================
-- ASSIGNMENTS TABLE
-- ============================================================
create table if not exists public.assignments (
  id           uuid primary key default gen_random_uuid(),
  name         text not null default 'New Assignment',
  score        numeric,           -- points earned (nullable = ungraded)
  max_score    numeric not null default 100,
  category_id  uuid not null references public.categories(id) on delete cascade,
  user_id      uuid not null references auth.users(id) on delete cascade,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Enable RLS
alter table public.assignments enable row level security;

-- Users can only SELECT their own assignments
create policy "Users can read own assignments"
  on public.assignments
  for select
  using (auth.uid() = user_id);

-- Users can only INSERT their own assignments
create policy "Users can insert own assignments"
  on public.assignments
  for insert
  with check (auth.uid() = user_id);

-- Users can only UPDATE their own assignments
create policy "Users can update own assignments"
  on public.assignments
  for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Users can only DELETE their own assignments
create policy "Users can delete own assignments"
  on public.assignments
  for delete
  using (auth.uid() = user_id);


-- ============================================================
-- INDEXES for performance
-- ============================================================
create index if not exists idx_categories_user_id on public.categories(user_id);
create index if not exists idx_assignments_user_id on public.assignments(user_id);
create index if not exists idx_assignments_category_id on public.assignments(category_id);


-- ============================================================
-- AUTO-UPDATE updated_at TRIGGER
-- ============================================================
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_categories_updated_at
  before update on public.categories
  for each row
  execute function public.update_updated_at_column();

create trigger set_assignments_updated_at
  before update on public.assignments
  for each row
  execute function public.update_updated_at_column();
