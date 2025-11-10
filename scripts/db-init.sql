-- users
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  auth_uid text unique,
  email text,
  name text,
  guest boolean default false,
  settings jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- conversations
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  title text,
  mode text default 'chat',
  meta jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index on public.conversations(user_id, updated_at);

-- messages
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references public.conversations(id) on delete cascade,
  user_id uuid references public.users(id) on delete cascade,
  role text not null, -- user | assistant | system
  content text,
  meta jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);
create index on public.messages(conversation_id, created_at);

-- files
create table if not exists public.files (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  key text,
  name text,
  mime text,
  size bigint,
  meta jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- imports
create table if not exists public.imports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  file_id uuid references public.files(id),
  status text default 'pending',
  result jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- developer progress logs
create table if not exists public.developer_progress_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,
  conversation_id uuid,
  prompt text,
  assistant text,
  meta jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

-- enable RLS on sensitive tables
alter table public.messages enable row level security;
alter table public.conversations enable row level security;
alter table public.files enable row level security;
alter table public.imports enable row level security;

-- policies: users can only read/write their own records (use auth.uid())
create policy "users: insert own" on public.users for insert using (true); -- allow server to create
create policy "users: select by auth" on public.users for select using (auth.uid() = auth_uid);

-- messages: insert only by authenticated mapping to users table
create policy "messages: insert own" on public.messages
  for insert using (auth.uid() = (select auth_uid from public.users where id = new.user_id));

create policy "messages: select own" on public.messages
  for select using (exists (select 1 from public.users u where u.id = user_id and u.auth_uid = auth.uid()));

create policy "conversations: select own" on public.conversations
  for select using (exists (select 1 from public.users u where u.id = user_id and u.auth_uid = auth.uid()));
create policy "files: select own" on public.files
  for select using (exists (select 1 from public.users u where u.id = user_id and u.auth_uid = auth.uid()));