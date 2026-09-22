-- Run this once in Supabase Dashboard → SQL Editor.
-- This lets every visitor read reviews, lets signed-in users add one, and lets
-- only pachpandeom60@gmail.com delete a review.

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  reviewer_name text not null check (char_length(reviewer_name) between 1 and 100),
  rating smallint not null check (rating between 1 and 5),
  body text not null check (char_length(body) between 3 and 1000),
  created_at timestamptz not null default now()
);

alter table public.reviews enable row level security;

grant select on public.reviews to anon, authenticated;
grant insert, delete on public.reviews to authenticated;

create policy "Anyone can read reviews"
on public.reviews for select
to anon, authenticated
using (true);

create policy "Signed-in users can create their own review"
on public.reviews for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Only the Ayuroma moderator can delete reviews"
on public.reviews for delete
to authenticated
using ((auth.jwt() ->> 'email') = 'pachpandeom60@gmail.com');
