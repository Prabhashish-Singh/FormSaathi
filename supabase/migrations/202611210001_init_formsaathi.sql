create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  preferred_interface_language text not null default 'en'
    check (preferred_interface_language in ('en', 'hi', 'pa')),
  preferred_explanation_language text not null default 'en'
    check (preferred_explanation_language in ('en', 'hi', 'pa')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  original_filename text not null,
  storage_path text not null,
  file_type text not null,
  file_size bigint not null check (file_size >= 0),
  document_category text not null default 'Auto Detect',
  original_language text,
  explanation_language text not null default 'en'
    check (explanation_language in ('en', 'hi', 'pa')),
  extracted_text text,
  processing_status text not null default 'queued'
    check (processing_status in ('queued', 'processing', 'completed', 'failed')),
  error_message text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.document_analyses (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null unique references public.documents(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  document_title text,
  summary text,
  simplified_explanation text,
  eligibility jsonb not null default '[]'::jsonb,
  important_dates jsonb not null default '[]'::jsonb,
  financial_information jsonb not null default '[]'::jsonb,
  required_documents jsonb not null default '[]'::jsonb,
  application_procedure jsonb not null default '[]'::jsonb,
  conditions jsonb not null default '[]'::jsonb,
  action_checklist jsonb not null default '[]'::jsonb,
  key_takeaways jsonb not null default '[]'::jsonb,
  ai_model text,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  document_id uuid not null references public.documents(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  message text not null,
  created_at timestamptz not null default timezone('utc', now())
);

create index if not exists documents_user_created_idx on public.documents(user_id, created_at desc);
create index if not exists document_analyses_document_idx on public.document_analyses(document_id);
create index if not exists conversations_document_idx on public.conversations(document_id);
create index if not exists chat_messages_conversation_created_idx on public.chat_messages(conversation_id, created_at);

create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at before update on public.profiles
for each row execute function public.handle_updated_at();

drop trigger if exists documents_updated_at on public.documents;
create trigger documents_updated_at before update on public.documents
for each row execute function public.handle_updated_at();

create or replace function public.handle_new_auth_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.email, '')
  )
  on conflict (id) do update set
    full_name = excluded.full_name,
    email = excluded.email,
    updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();

alter table public.profiles enable row level security;
alter table public.documents enable row level security;
alter table public.document_analyses enable row level security;
alter table public.conversations enable row level security;
alter table public.chat_messages enable row level security;

drop policy if exists "Users read own profile" on public.profiles;
create policy "Users read own profile" on public.profiles
for select using (auth.uid() = id);

drop policy if exists "Users update own profile" on public.profiles;
create policy "Users update own profile" on public.profiles
for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "Users read own documents" on public.documents;
create policy "Users read own documents" on public.documents
for select using (auth.uid() = user_id);

drop policy if exists "Users insert own documents" on public.documents;
create policy "Users insert own documents" on public.documents
for insert with check (auth.uid() = user_id);

drop policy if exists "Users update own documents" on public.documents;
create policy "Users update own documents" on public.documents
for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "Users delete own documents" on public.documents;
create policy "Users delete own documents" on public.documents
for delete using (auth.uid() = user_id);

drop policy if exists "Users read own analyses" on public.document_analyses;
create policy "Users read own analyses" on public.document_analyses
for select using (
  auth.uid() = user_id
  and exists (
    select 1 from public.documents d
    where d.id = document_id and d.user_id = auth.uid()
  )
);

drop policy if exists "Users access own conversations" on public.conversations;
create policy "Users access own conversations" on public.conversations
for all using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users read own conversation messages" on public.chat_messages;
create policy "Users read own conversation messages" on public.chat_messages
for select using (
  exists (
    select 1 from public.conversations c
    where c.id = conversation_id and c.user_id = auth.uid()
  )
);

drop policy if exists "Users create own conversation messages" on public.chat_messages;
create policy "Users create own conversation messages" on public.chat_messages
for insert with check (
  exists (
    select 1 from public.conversations c
    where c.id = conversation_id and c.user_id = auth.uid()
  )
);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'formsaathi-documents',
  'formsaathi-documents',
  false,
  10485760,
  array['application/pdf', 'image/jpeg', 'image/png']
)
on conflict (id) do update set
  public = false,
  file_size_limit = 10485760,
  allowed_mime_types = array['application/pdf', 'image/jpeg', 'image/png'];

drop policy if exists "Users read own document files" on storage.objects;
create policy "Users read own document files" on storage.objects
for select using (
  bucket_id = 'formsaathi-documents'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Users upload own document files" on storage.objects;
create policy "Users upload own document files" on storage.objects
for insert with check (
  bucket_id = 'formsaathi-documents'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Users delete own document files" on storage.objects;
create policy "Users delete own document files" on storage.objects
for delete using (
  bucket_id = 'formsaathi-documents'
  and (storage.foldername(name))[1] = auth.uid()::text
);

grant usage on schema public to service_role;
grant select, insert, update, delete on table
  public.documents,
  public.document_analyses,
  public.conversations,
  public.chat_messages
to service_role;
