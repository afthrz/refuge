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
    // 1. Ensure the buyer has an account. createUser always creates a new one;
    //    if they already exist we fall back to generateLink to fetch them.
    //    (generateLink alone fails for brand-new buyers — that was the bug
    //    where a purchase never got recorded and access silently failed.)
    let userId: string | undefined;

    const { data: created, error: createError } =
      await supabase.auth.admin.createUser({
        email,
        email_confirm: true,
      });

    if (created?.user) {
      userId = created.user.id;
    } else {
      // Already registered (or another error) — look them up via generateLink,
      // which returns the existing user for an email that's already on file.
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
          error: (createError ?? linkError)?.message,
        };
      }
      userId = linkData.user.id;
    }

    if (!userId) {
      return { ok: false, reason: "supabase_unreachable", error: "no user id" };
    }

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
