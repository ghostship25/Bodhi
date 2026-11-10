create table if not exists bodhi_libraries (
  user_id text primary key,
  snapshot jsonb not null,
  updated_at timestamptz not null default now()
);
