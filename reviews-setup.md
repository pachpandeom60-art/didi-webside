# Ayuroma reviews: one-time setup

The review UI is already included in the website. It needs Supabase to store reviews and let customers sign in with Google.

1. Create a project at [Supabase](https://supabase.com/dashboard), then open **SQL Editor** and run the SQL below.
2. In **Authentication → Providers → Google**, enable Google. Create a Google OAuth web client in [Google Cloud Console](https://console.cloud.google.com/apis/credentials) and paste its client ID and secret into Supabase. In Google, add the **Callback URL** Supabase shows in the provider screen as an authorized redirect URI.
3. In **Authentication → URL Configuration**, add your deployed website URL to **Redirect URLs**. For example: `https://your-domain.com/*`. Add `http://localhost:.../*` too only if you use a local development server.
4. In **Project Settings → API**, copy the project URL and the **anon** (or publishable) key into `review-config.js`. Never use or expose the `service_role` key in the website.
5. Deploy the edited files. Sign in using `pachpandeom60@gmail.com` to see moderation delete buttons.

## Database SQL

```sql
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
```

The database rule is what protects deletion. The email check is performed by Supabase, so a visitor cannot gain deletion access just by changing the web page in their browser.
