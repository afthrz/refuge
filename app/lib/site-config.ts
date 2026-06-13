// Single source of truth for launch state.
// Change SITE_STATE to "live" the day the door opens.
export const SITE_STATE: "prelaunch" | "live" = "prelaunch";

// Where the Begin Day 1 buttons send people when SITE_STATE === "live".
// Defaults to the existing Stripe checkout API.
export const CHECKOUT_URL =
  process.env.NEXT_PUBLIC_CHECKOUT_URL || "/api/checkout";

// Founding Circle seats — updated manually and truthfully.
// Surfaced in the hero scarcity line.
export const FOUNDING_SEATS_REMAINING = 100;
