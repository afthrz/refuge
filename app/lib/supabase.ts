import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function hasSupabaseConfig() {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

// Default client — PKCE flow. Used for Google OAuth and reading sessions.
export function createClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

// Magic-link client — implicit flow. signInWithOtp from this client produces
// a plain (non-pkce_) token hash, so the email link verifies via verifyOtp on
// ANY device/app. (PKCE tokens require the verifier from the original browser,
// which is why cross-device magic links failed.) Use this ONLY for the email
// sign-in; keep createClient() (PKCE) for Google OAuth.
export function createOtpClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY"
    );
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey, {
    auth: { flowType: "implicit" },
  });
}
