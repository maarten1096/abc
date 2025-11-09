create table flashcards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  title text not null,
  cards jsonb not null,
  created_at timestamptz default now()
);

alter table recents add column if not exists tool_id uuid;