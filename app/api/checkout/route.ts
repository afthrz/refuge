import { NextResponse } from "next/server";
import Stripe from "stripe";
import { doorOpen } from "@/app/lib/site-config";

export async function POST() {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  // Founding price while the door is open, regular price after it closes.
  // STRIPE_PRICE_ID = founding ($49). STRIPE_PRICE_ID_REGULAR = regular ($79).
  const foundingPrice = process.env.STRIPE_PRICE_ID;
  const regularPrice = process.env.STRIPE_PRICE_ID_REGULAR;
  const priceId = doorOpen() ? foundingPrice : regularPrice || foundingPrice;

  if (!secretKey || !priceId) {
    return NextResponse.json(
      { error: "Stripe is not configured yet. Add STRIPE_SECRET_KEY and STRIPE_PRICE_ID to .env.local." },
      { status: 503 }
    );
  }

  const stripe = new Stripe(secretKey);
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: priceId, quantity: 1 }],
    customer_email: undefined, // Stripe collects the email on the checkout page
    billing_address_collection: "auto",
    success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/`,
    metadata: { course: "slowing-down" },
  });

  return NextResponse.json({ url: session.url });
}
