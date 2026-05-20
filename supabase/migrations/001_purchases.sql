-- Tracks who has purchased which course
CREATE TABLE IF NOT EXISTS purchases (
  id                uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id           uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  course_id         text NOT NULL DEFAULT 'slowing-down',
  stripe_session_id text UNIQUE NOT NULL,
  created_at        timestamptz DEFAULT now() NOT NULL
);

-- Users can only see their own purchases
ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users_see_own_purchases"
  ON purchases FOR SELECT
  USING (auth.uid() = user_id);
