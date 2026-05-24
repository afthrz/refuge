import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { createClient as createServiceClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

export const runtime = "nodejs";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ day: string }> }
) {
  const { day } = await params;
  const dayNum = parseInt(day, 10);
  if (!Number.isFinite(dayNum) || dayNum < 1 || dayNum > 21) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseAnonKey || !serviceKey) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  // 1. Verify the caller is logged in and has a purchase
  const cookieStore = await cookies();
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: () => {},
    },
  });

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const { data: purchase } = await supabase
    .from("purchases")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!purchase) {
    return NextResponse.json({ error: "No active purchase" }, { status: 403 });
  }

  // 2. Generate a signed URL for the audio file in Supabase Storage
  // The bucket "course-audio" is private; service role can generate signed URLs.
  const admin = createServiceClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const fileName = `slowing-down/day-${dayNum}.mp3`;
  const { data: signed, error: signError } = await admin.storage
    .from("course-audio")
    .createSignedUrl(fileName, 60 * 60); // 1 hour

  if (signError || !signed?.signedUrl) {
    console.error("Sign URL failed:", signError);
    return NextResponse.json({ error: "Audio unavailable" }, { status: 404 });
  }

  // 3. Redirect the browser to the signed URL — audio streams from Supabase CDN
  return NextResponse.redirect(signed.signedUrl, 302);
}
