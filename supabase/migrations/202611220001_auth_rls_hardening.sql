-- Tighten message access: users may create and read their own conversation messages,
-- and may delete messages in conversations they own.
drop policy if exists "Users delete own conversation messages" on public.chat_messages;
create policy "Users delete own conversation messages" on public.chat_messages
for delete using (
  exists (
    select 1
    from public.conversations c
    where c.id = conversation_id
      and c.user_id = auth.uid()
  )
);

drop policy if exists "Users update own conversation messages" on public.chat_messages;
create policy "Users update own conversation messages" on public.chat_messages
for update using (
  exists (
    select 1
    from public.conversations c
    where c.id = conversation_id
      and c.user_id = auth.uid()
  )
) with check (
  exists (
    select 1
    from public.conversations c
    where c.id = conversation_id
      and c.user_id = auth.uid()
  )
);
