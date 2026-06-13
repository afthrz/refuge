import { NextRequest, NextResponse } from "next/server";

// Prelaunch email capture.
// TODO: wire to Supabase (a `waitlist` table with columns: email, name, created_at)
// or to your email tool of choice. For now this just acknowledges.

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body.email ?? "").trim().toLowerCase();
    const name = String(body.name ?? "").trim();

    if (!email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // Placeholder — log and return ok.
    // Later: insert into Supabase `waitlist` table here using the service role key.
    console.log("[waitlist]", { email, name, at: new Date().toISOString() });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}
