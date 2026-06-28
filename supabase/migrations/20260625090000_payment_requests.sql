create table if not exists public.payment_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  email text,
  display_name text,
  contact text,
  paid_at timestamptz,
  note text,
  requested_features jsonb not null default '["rank","manual","pdf"]'::jsonb,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  admin_note text,
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.payment_requests enable row level security;

create index if not exists payment_requests_user_created_idx on public.payment_requests(user_id, created_at desc);
create index if not exists payment_requests_status_created_idx on public.payment_requests(status, created_at desc);

drop policy if exists "payment_requests_read_own_or_admin" on public.payment_requests;
create policy "payment_requests_read_own_or_admin"
on public.payment_requests for select
to authenticated
using (user_id = auth.uid() or public.is_app_admin());

drop policy if exists "payment_requests_insert_own" on public.payment_requests;
create policy "payment_requests_insert_own"
on public.payment_requests for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "payment_requests_admin_update" on public.payment_requests;
create policy "payment_requests_admin_update"
on public.payment_requests for update
to authenticated
using (public.is_app_admin())
with check (public.is_app_admin());

create or replace function public.set_payment_requests_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists payment_requests_set_updated_at on public.payment_requests;
create trigger payment_requests_set_updated_at
  before update on public.payment_requests
  for each row execute procedure public.set_payment_requests_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'display_name', ''))
  on conflict (id) do nothing;

  insert into public.user_quotas (user_id, generation_limit, generation_used, unlimited, score_trial_limit, score_trial_used, rank_access, manual_access, pdf_access)
  values (new.id, 0, 0, false, 1, 0, false, false, false)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

notify pgrst, 'reload schema';
