alter table public.user_quotas
  add column if not exists score_trial_limit integer not null default 1 check (score_trial_limit >= 0),
  add column if not exists score_trial_used integer not null default 0 check (score_trial_used >= 0),
  add column if not exists rank_access boolean not null default false,
  add column if not exists manual_access boolean not null default false,
  add column if not exists pdf_access boolean not null default false,
  add column if not exists paid_until timestamptz;

alter table public.recommendation_usage
  add column if not exists recommend_mode text not null default 'score'
  check (recommend_mode in ('score', 'rank'));
