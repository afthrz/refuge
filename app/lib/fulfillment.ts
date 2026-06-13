import { createClient } from "@supabase/supabase-js";

/* ============================================================
   Fulfillment — grant a buyer access to the course.

   Used by both the Stripe webhook (real time) and the reconcile
   endpoint (catch-up). Idempotent: safe to run many times for the
   same Stripe session.
   ============================================================ */

export type GrantResult =
  | { ok: true; userId: string }
  | {
      ok: false;
      reason: "not_configured" | "supabase_unreachable" | "purchase_write_failed";
      error?: string;
    };

export async function grantAccess(
  email: string,
  sessionId: string
): Promise<GrantResult> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://therefuge.app";

  if (!supabaseUrl || !serviceKey) {
    return { ok: false, reason: "not_configured" };
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  try {
    // generateLink find-or-creates the user and returns it. If Supabase is
    // paused/unreachable this throws or errors — caught below so the caller
    // can return a retryable status.
    const { data: linkData, error: linkError } =
      await supabase.auth.admin.generateLink({
        type: "magiclink",
        email,
        options: {
          redirectTo: `${siteUrl}/auth/callback?next=/course/slowing-down`,
        },
      });

    if (linkError || !linkData?.user) {
      return {
        ok: false,
        reason: "supabase_unreachable",
        error: linkError?.message,
      };
    }

    const userId = linkData.user.id;

    const { error: purchaseError } = await supabase.from("purchases").upsert(
      {
        user_id: userId,
        course_id: "slowing-down",
        stripe_session_id: sessionId,
      },
      { onConflict: "stripe_session_id" }
    );

    if (purchaseError) {
      return {
        ok: false,
        reason: "purchase_write_failed",
        error: purchaseError.message,
      };
    }

    return { ok: true, userId };
  } catch (e) {
    return {
      ok: false,
      reason: "supabase_unreachable",
      error: e instanceof Error ? e.message : String(e),
    };
  }
}
