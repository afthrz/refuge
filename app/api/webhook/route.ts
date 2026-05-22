import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

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

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  // generateLink creates the user if they don't exist, or finds them if they do.
  // It returns the user object either way — this replaces the broken auth.users query.
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://therefuge.app";
  const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
    type: "magiclink",
    email,
    options: { redirectTo: `${siteUrl}/auth/callback?next=/course/slowing-down` },
  });

  if (linkError || !linkData?.user) {
    console.error("Failed to find/create user:", linkError);
    return NextResponse.json({ error: "Could not create user" }, { status: 500 });
  }

  const userId = linkData.user.id;

  // Record the purchase
  const { error: purchaseError } = await supabase.from("purchases").upsert(
    {
      user_id: userId,
      course_id: "slowing-down",
      stripe_session_id: session.id,
    },
    { onConflict: "stripe_session_id" }
  );

  if (purchaseError) {
    console.error("Failed to record purchase:", purchaseError);
    return NextResponse.json({ error: "Could not record purchase" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
