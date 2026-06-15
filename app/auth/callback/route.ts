import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

function getSafeNext(searchParams: URLSearchParams) {
  const next = searchParams.get("next");
  if (!next || !next.startsWith("/") || next.startsWith("//")) return "/home";
  return next;
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Email magic links: do NOT verify here. A plain GET (from an iOS/Gmail
  // link scanner) would burn the single-use token before the user taps it.
  // Hand off to the client page, which verifies in JS — scanners don't run
  // JS, so the token survives until a real browser opens it.
  if (tokenHash && !code) {
    const url = new URL(`${origin}/auth/confirm`);
    url.searchParams.set("token_hash", tokenHash);
    if (type) url.searchParams.set("type", type);
    url.searchParams.set("next", getSafeNext(searchParams));
    return NextResponse.redirect(url.toString());
  }

  // PKCE / OAuth flow (Google) — verify server-side; needs the same browser.
  if (code && supabaseUrl && supabaseAnonKey) {
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

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) return response;
  }

  return NextResponse.redirect(`${origin}/signin?error=auth_failed`);
}
