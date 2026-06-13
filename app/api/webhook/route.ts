import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { grantAccess } from "@/app/lib/fulfillment";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secretKey || !webhookSecret) {
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
    // No email to fulfil — acknowledge so Stripe doesn't keep retrying.
    console.error("[webhook] checkout.session.completed with no email", session.id);
    return NextResponse.json({ received: true, note: "no email" });
  }

  const result = await grantAccess(email, session.id);

  if (!result.ok) {
    // SAFETY NET: the payment is already captured and lives in Stripe. By
    // returning a non-2xx we ask Stripe to RETRY this webhook automatically
    // (it retries for ~3 days). So if Supabase was paused, restoring it lets
    // a later retry finish fulfilment with no lost sale and no manual work.
    console.error("[webhook] fulfilment deferred — will retry", {
      email,
      sessionId: session.id,
      reason: result.reason,
      error: result.error,
    });
    return NextResponse.json(
      { error: "fulfilment_deferred", reason: result.reason },
      { status: 503 }
    );
  }

  return NextResponse.json({ received: true });
}
