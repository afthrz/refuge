import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import type { EmailOtpType } from "@supabase/supabase-js";

function getSafeNext(searchParams: URLSearchParams) {
  const next = searchParams.get("next");
  if (!next || !next.startsWith("/") || next.startsWith("//")) return "/home";
  return next;
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if ((code || tokenHash) && supabaseUrl && supabaseAnonKey) {
    const response = NextResponse.redirect(
      `${origin}${getSafeNext(searchParams)}`
    );

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    });

    // PKCE / OAuth flow (Google) — needs the same browser that started it.
    if (code) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) return response;
    }

    // Token-hash flow (email magic links) — works on ANY device or app,
    // because it carries no browser-bound verifier. Try the type from the
    // URL, then the common email types as a fallback.
    if (tokenHash) {
      const candidates = [type, "magiclink", "email", "signup"].filter(
        Boolean
      ) as EmailOtpType[];
      const seen = new Set<string>();
      for (const t of candidates) {
        if (seen.has(t)) continue;
        seen.add(t);
        const { error } = await supabase.auth.verifyOtp({
          type: t,
          token_hash: tokenHash,
        });
        if (!error) return response;
      }
    }
  }

  return NextResponse.redirect(`${origin}/signin?error=auth_failed`);
}
