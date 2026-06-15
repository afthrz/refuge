-- Grant access by EMAIL, not just user_id, so a buyer gets in whether they
-- log in with email magic link or Google (which can create a different
-- user_id for the same email).

-- 1. Add an email column to purchases.
alter table purchases add column if not exists email text;

-- 2. Backfill existing rows from auth.users.
update purchases p
set email = lower(u.email)
from auth.users u
where p.user_id = u.id and p.email is null;

-- 3. Index for fast email lookups.
create index if not exists purchases_email_idx on purchases (lower(email));

-- 4. Replace the RLS policy: a logged-in user can see a purchase that matches
--    EITHER their user_id OR their email (from the JWT).
drop policy if exists "users_see_own_purchases" on purchases;
create policy "users_see_own_purchases" on purchases
  for select
  using (
    auth.uid() = user_id
    or lower(email) = lower(auth.jwt() ->> 'email')
  );
