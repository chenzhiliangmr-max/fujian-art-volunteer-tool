alter table public.candidate_scores
  add column if not exists candidate_rank bigint;

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

notify pgrst, 'reload schema';
