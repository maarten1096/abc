CREATE TABLE users (
  id uuid references auth.users not null primary key,
  email text,
  created_at timestamptz,
  display_name text,
  avatar_url text
);

CREATE TABLE chats (
  id uuid primary key default uuid_generate_v4(),
  user_id    uuid references public.users not null,
  title      text,
  content    jsonb,
  mode       text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

CREATE TABLE recents (
  id uuid primary key default uuid_generate_v4(),
  user_id    uuid references public.users not null,
  type       text,
  ref_id     uuid,
  title      text,
  tool_used  text,
  created_at timestamptz default now()
);
