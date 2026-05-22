import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { readFile } from "fs/promises";
import path from "path";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ day: string }> }
) {
  const { day } = await params;

  // Only days 1 and 2 exist so far
  const allowed = ["1", "2"];
  if (!allowed.includes(day)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: () => {},
    },
  });

  // Check auth
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  // Check purchase
  const { data: purchase } = await supabase
    .from("purchases")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!purchase) {
    return NextResponse.json({ error: "No active purchase" }, { status: 403 });
  }

  // Serve the file
  try {
    const filePath = path.join(process.cwd(), "public", "audio", `slowingdown-${day}.mov`);
    const fileBuffer = await readFile(filePath);
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": "video/quicktime",
        "Cache-Control": "private, no-store",
        "Content-Disposition": "inline",
      },
    });
  } catch {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }
}
