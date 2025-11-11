
-- Enable pgvector extension
create extension if not exists vector;

-- user_items table
create table if not exists public.user_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null,
  title text not null,
  description text,
  type text not null, -- 'summary'|'quiz'|'flashcards'|'note'|'other'
  tool_version text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  content jsonb,
  tags text[],
  visibility text default 'private', -- 'private'|'shared'|'class'
  file_id uuid references public.files(id),
  embedding_id uuid
);
create index on public.user_items(user_id, created_at desc);

-- item_embeddings table
create table if not exists public.item_embeddings (
  id uuid primary key default gen_random_uuid(),
  item_id uuid references public.user_items(id) on delete cascade,
  user_id uuid references public.users(id) on delete cascade, -- for faster filtering
  embedding vector(1536), -- Using 1536 for OpenAI embeddings
  created_at timestamptz default now()
);
create index on public.item_embeddings using ivfflat (embedding vector_l2_ops) with (lists = 100);

-- Update user_items table to add foreign key to item_embeddings
-- This is done after item_embeddings table is created to avoid circular dependency
alter table public.user_items add constraint fk_embedding_id foreign key (embedding_id) references public.item_embeddings(id);

-- RLS policies for user_items
alter table public.user_items enable row level security;

create policy "user_items: insert own" on public.user_items
  for insert using (auth.uid() = (select auth_uid from public.users where id = new.user_id));

create policy "user_items: select own" on public.user_items
  for select using (exists (select 1 from public.users u where u.id = user_id and u.auth_uid = auth.uid()));

create policy "user_items: update own" on public.user_items
    for update using (exists (select 1 from public.users u where u.id = user_id and u.auth_uid = auth.uid()));

create policy "user_items: delete own" on public.user_items
    for delete using (exists (select 1 from public.users u where u.id = user_id and u.auth_uid = auth.uid()));

-- RLS policies for item_embeddings
alter table public.item_embeddings enable row level security;

create policy "item_embeddings: insert own" on public.item_embeddings
  for insert using (auth.uid() = (select auth_uid from public.users where id = new.user_id));

create policy "item_embeddings: select own" on public.item_embeddings
  for select using (exists (select 1 from public.users u where u.id = user_id and u.auth_uid = auth.uid()));

create policy "item_embeddings: delete own" on public.item_embeddings
    for delete using (exists (select 1 from public.users u where u.id = user_id and u.auth_uid = auth.uid()));
