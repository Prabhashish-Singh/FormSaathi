alter table public.profiles
  drop constraint if exists profiles_preferred_interface_language_check,
  drop constraint if exists profiles_preferred_explanation_language_check;

alter table public.profiles
  add constraint profiles_preferred_interface_language_check
    check (preferred_interface_language in ('en', 'hi', 'pa', 'bn', 'gu', 'mr', 'ta', 'te', 'kn', 'ml', 'or', 'ur')),
  add constraint profiles_preferred_explanation_language_check
    check (preferred_explanation_language in ('en', 'hi', 'pa', 'bn', 'gu', 'mr', 'ta', 'te', 'kn', 'ml', 'or', 'ur'));

alter table public.documents
  drop constraint if exists documents_explanation_language_check;

alter table public.documents
  add constraint documents_explanation_language_check
    check (explanation_language in ('en', 'hi', 'pa', 'bn', 'gu', 'mr', 'ta', 'te', 'kn', 'ml', 'or', 'ur'));
