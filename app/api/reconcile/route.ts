import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { grantAccess } from "@/app/lib/fulfillment";

/* ============================================================
   POST /api/reconcile
   Catch-up fulfilment. Replays recent PAID Stripe sessions and makes
   sure each one has access granted in Supabase. Idempotent — safe to
   run anytime.

   Auth: header  x-reconcile-token: <RECONCILE_TOKEN>
   (set RECONCILE_TOKEN in Vercel; share it only with your agent.)

   Your AI agent flow:
     1. GET /api/health  → if supabase:"down", tell you to Restore it
     2. After restore, POST /api/reconcile → grants any missed buyers
   ============================================================ */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const token = process.env.RECONCILE_TOKEN;
  const provided = req.headers.get("x-reconcile-token");

  if (!token || provided !== token) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const stripe = new Stripe(secretKey);

  // How far back to look (days). Default 14, override with ?days=30.
  const days = Math.min(
    Math.max(parseInt(req.nextUrl.searchParams.get("days") ?? "14", 10) || 14, 1),
    90
  );
  const since = Math.floor(Date.now() / 1000) - days * 86400;

  const results: Array<{
    email: string | null;
    sessionId: string;
    ok: boolean;
    reason?: string;
  }> = [];

  try {
    // Page through sessions in the window.
    for await (const session of stripe.checkout.sessions.list({
      limit: 100,
      created: { gte: since },
    })) {
      if (session.payment_status !== "paid") continue;
      const email = session.customer_details?.email ?? null;
      if (!email) {
        results.push({ email, sessionId: session.id, ok: false, reason: "no_email" });
        continue;
      }
      const r = await grantAccess(email, session.id);
      results.push({
        email,
        sessionId: session.id,
        ok: r.ok,
        reason: r.ok ? undefined : r.reason,
      });
      // If Supabase is down, stop early — nothing else will succeed either.
      if (!r.ok && r.reason === "supabase_unreachable") {
        return NextResponse.json(
          {
            error: "supabase_unreachable",
            hint: "Restore the Supabase project, then call this again.",
            checked: results.length,
            results,
          },
          { status: 503 }
        );
      }
    }
  } catch (e) {
    return NextResponse.json(
      { error: "stripe_error", message: e instanceof Error ? e.message : String(e) },
      { status: 502 }
    );
  }

  const granted = results.filter((r) => r.ok).length;
  const failed = results.filter((r) => !r.ok).length;

  return NextResponse.json({
    ok: failed === 0,
    days,
    checked: results.length,
    granted,
    failed,
    results,
  });
}
