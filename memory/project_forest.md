---
name: Project Refuge
description: AI-powered meditation course app — now a product launch for Slowing Down 21-day course
type: project
---

Refuge is a meditation web app built with Next.js 16, Supabase, and deployed on Vercel at therefuge.app.

**Current product:** Single course — "Slowing Down" (21-day guided meditation, $29 one-time)

**Tech stack:**
- Next.js 16 (App Router), React 19, TypeScript, Tailwind v4
- Supabase for auth (magic link + Google OAuth) and purchases table
- Stripe for payments (checkout.session.completed webhook)
- Vercel hosting, Namecheap domain (therefuge.app)
- ImprovMX for email forwarding (hello@therefuge.app → Gmail)

**Payment flow:**
1. Landing page → Stripe Checkout → /success page
2. /success: user enters email → Supabase magic link sent → clicks link → logged in
3. Webhook: generateLink creates/finds user, records purchase in `purchases` table
4. Course page checks auth + purchase before allowing access
5. Audio files served via /api/audio/[day] (auth + purchase gated)

**Why:** Launching as a real product to sell meditation course

**How to apply:** When adding features, consider the single-product focus. The app is now a sales + course delivery platform, not a free app.
