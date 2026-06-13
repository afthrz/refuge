import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/* ============================================================
   GET /api/health
   Public, read-only status. Your AI agent pings this on a schedule.
   - supabase: "ok" | "down" | "unconfigured"  (down ⇒ project paused)
   - stripe:   "configured" | "missing"
   Returns 200 when healthy, 503 when something is degraded — so a
   simple "if status != 200, alert me" automation just works.
   ============================================================ */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  let supabase: "ok" | "down" | "unconfigured" = "unconfigured";

  if (supabaseUrl && serviceKey) {
    try {
      const client = createClient(supabaseUrl, serviceKey, {
        auth: { autoRefreshToken: false, persistSession: false },
      });
      // Lightweight count query. If the project is paused this errors/times out.
      const { error } = await client
        .from("purchases")
        .select("id", { count: "exact", head: true });
      supabase = error ? "down" : "ok";
    } catch {
      supabase = "down";
    }
  }

  const stripe =
    process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PRICE_ID
      ? "configured"
      : "missing";

  const ok = supabase === "ok" && stripe === "configured";

  return NextResponse.json(
    { ok, supabase, stripe, time: new Date().toISOString() },
    { status: ok ? 200 : 503 }
  );
}
