// Single source of truth for launch state + the founding window.

export const SITE_STATE: "prelaunch" | "live" = "live";

// ── Founding window ─────────────────────────────────────────────
// The founding price is live until this exact moment. After it, the
// page AND the Stripe checkout automatically switch to the regular
// price. SET THIS to one week from the day you launch.
export const LAUNCH_END = new Date("2026-05-31T23:59:00-07:00");

export const FOUNDING_PRICE = 49;
export const REGULAR_PRICE = 79;

// Update this by hand as seats sell. Shown as "{n} founding seats remaining".
export const FOUNDING_SEATS_REMAINING = 100;

export function doorOpen(now: Date = new Date()): boolean {
  return now.getTime() < LAUNCH_END.getTime();
}

export function currentPrice(now: Date = new Date()): number {
  return doorOpen(now) ? FOUNDING_PRICE : REGULAR_PRICE;
}

// e.g. "Sunday, May 31"
export function closesLabel(): string {
  return LAUNCH_END.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export const CHECKOUT_URL =
  process.env.NEXT_PUBLIC_CHECKOUT_URL || "/api/checkout";
