grant usage on schema public to service_role;
grant select, insert, update, delete on table
  public.documents,
  public.document_analyses,
  public.conversations,
  public.chat_messages
to service_role;
