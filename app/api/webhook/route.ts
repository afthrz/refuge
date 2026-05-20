import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

// Stripe sends the raw body — Next.js must not parse it
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!secretKey || !webhookSecret || !supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const stripe = new Stripe(secretKey);
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") ?? "";

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const email = session.customer_details?.email;

  if (!email) {
    return NextResponse.json({ error: "No email on session" }, { status: 400 });
  }

  // Use service role key so we can create users and read purchases
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // Find or create the user
  const { data: existing } = await supabase
    .from("auth.users")
    .select("id")
    .eq("email", email)
    .maybeSingle();

  let userId: string;

  if (existing?.id) {
    userId = existing.id;
  } else {
    const { data: created, error } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
    });
    if (error || !created.user) {
      console.error("Failed to create user:", error);
      return NextResponse.json({ error: "Could not create user" }, { status: 500 });
    }
    userId = created.user.id;
  }

  // Record the purchase
  await supabase.from("purchases").upsert(
    {
      user_id: userId,
      course_id: "slowing-down",
      stripe_session_id: session.id,
    },
    { onConflict: "stripe_session_id" }
  );

  // Send magic link so the user can log in without a password
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  await supabase.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: { redirectTo: `${siteUrl}/auth/callback?next=/course/slowing-down` },
  });

  return NextResponse.json({ received: true });
}
