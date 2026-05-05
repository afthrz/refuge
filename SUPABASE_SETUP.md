# Refuge Supabase Setup

## Environment Variables

Add these in Netlify under Project configuration -> Environment variables:

```txt
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

Use the values from Supabase -> Project Settings -> API.

For local development, create `.env.local` with the same two values. Do not commit `.env.local`.

## Database

In Supabase, open SQL Editor and run:

```sql
-- Copy the contents of supabase/refuge_schema.sql
```

This creates the `sessions` table and row-level security policies so each signed-in user can only see and write their own meditation sessions.

## Auth Redirects

In Supabase -> Authentication -> URL Configuration:

```txt
Site URL:
https://afthrz-refuge.netlify.app

Redirect URLs:
https://afthrz-refuge.netlify.app/auth/callback
http://localhost:3001/auth/callback
```

## Google Provider

In Supabase -> Authentication -> Providers -> Google:

1. Enable Google.
2. Paste the Google Client ID.
3. Paste the Google Client Secret.
4. Save.

In Google Cloud OAuth, use the Supabase OAuth callback URL shown on the Supabase Google provider screen.
