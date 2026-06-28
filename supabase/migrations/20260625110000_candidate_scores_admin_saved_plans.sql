create table if not exists public.candidate_scores (
  user_id uuid not null references auth.users(id) on delete cascade,
  subject text not null check (subject in ('history', 'physics')),
  culture_score numeric not null check (culture_score >= 0 and culture_score <= 750),
  major_score numeric not null check (major_score >= 0 and major_score <= 300),
  composite_score numeric not null,
  candidate_rank bigint,
  change_count integer not null default 0 check (change_count >= 0 and change_count <= 3),
  confirmed_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, subject)
);

create or replace function public.candidate_scores_before_update()
returns trigger
language plpgsql
as $$
begin
  if old.culture_score is distinct from new.culture_score
     or old.major_score is distinct from new.major_score
     or old.candidate_rank is distinct from new.candidate_rank
     or old.subject is distinct from new.subject then
    if old.change_count >= 3 then
      raise exception 'candidate score change limit reached';
    end if;
    new.change_count := old.change_count + 1;
    new.confirmed_at := now();
  else
    new.change_count := old.change_count;
    new.confirmed_at := old.confirmed_at;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists candidate_scores_before_update on public.candidate_scores;
create trigger candidate_scores_before_update
before update on public.candidate_scores
for each row execute function public.candidate_scores_before_update();

alter table public.candidate_scores enable row level security;

drop policy if exists "candidate_scores_read_own_or_admin" on public.candidate_scores;
create policy "candidate_scores_read_own_or_admin"
on public.candidate_scores for select to authenticated
using (user_id = auth.uid() or public.is_app_admin());

drop policy if exists "candidate_scores_insert_own" on public.candidate_scores;
create policy "candidate_scores_insert_own"
on public.candidate_scores for insert to authenticated
with check (user_id = auth.uid());

drop policy if exists "candidate_scores_update_own" on public.candidate_scores;
create policy "candidate_scores_update_own"
on public.candidate_scores for update to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "saved_plans_read_own_or_admin" on public.saved_volunteer_plans;
create policy "saved_plans_read_own_or_admin"
on public.saved_volunteer_plans for select to authenticated
using (user_id = auth.uid() or public.is_app_admin());

grant select, insert, update on public.candidate_scores to authenticated;
notify pgrst, 'reload schema';
