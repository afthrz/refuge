"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import RefugeWash from "@/app/components/RefugeWash";
import { createClient, hasSupabaseConfig } from "@/app/lib/supabase";

export default function SuccessPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/course/slowing-down` },
      });
      if (error) {
        setError(
          "Your payment went through and is safe. We couldn't send your link just now — wait a minute and try again, or email hello@therefuge.app and we'll get you in."
        );
        return;
      }
      setSent(true);
    } catch {
      setError(
        "Your payment went through and is safe. We couldn't send your link just now — wait a minute and try again, or email hello@therefuge.app and we'll get you in."
      );
    } finally {
      setLoading(false);
    }
  }

  if (!hasSupabaseConfig()) {
    router.replace("/signin");
    return null;
  }

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100svh",
        background: "var(--paper)",
        color: "var(--ink)",
        fontFamily: "var(--font-sans)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <RefugeWash variant="dawn" opacity={0.4} />

      <div
        className="refuge-fade-in"
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 480,
          width: "100%",
          textAlign: "center",
          padding: "48px 32px",
        }}
      >
        {!sent ? (
          <>
            {/* checkmark */}
            <div
              style={{
                width: 64, height: 64, margin: "0 auto 36px",
                borderRadius: "50%", border: "1px solid var(--sage)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <svg width="22" height="16" viewBox="0 0 22 16" fill="none" stroke="var(--sage)" strokeWidth="1.5">
                <path d="M1 8 L7 14 L21 1" />
              </svg>
            </div>

            <div style={{ fontSize: 11, letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--tan)", marginBottom: 20 }}>
              Payment complete
            </div>

            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 400, lineHeight: 1.2, margin: "0 0 20px", color: "var(--ink)" }}>
              <em>Enter your email to access the course.</em>
            </h1>

            <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 17, lineHeight: 1.65, color: "var(--ink-soft)", margin: "0 0 36px" }}>
              Use the same email you entered at checkout. We&apos;ll send you a link — no password needed.
            </p>

            <form onSubmit={handleSubmit} style={{ textAlign: "left" }}>
              <label style={{ display: "block", fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink-muted)", marginBottom: 10 }}>
                Your email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@somewhere.com"
                required
                disabled={loading}
                style={{
                  width: "100%", padding: "16px 18px",
                  background: "#0d1711", border: "1px solid var(--card-edge)",
                  borderRadius: 8, fontFamily: "var(--font-serif)",
                  fontSize: 18, fontStyle: "italic", color: "var(--ink)",
                  outline: "none", boxSizing: "border-box",
                }}
              />
              {error && (
                <div style={{ marginTop: 12, padding: "10px 14px", background: "rgba(208,150,86,0.1)", border: "1px solid rgba(208,150,86,0.28)", borderRadius: 6, color: "#f0c08a", fontSize: 13 }}>
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%", marginTop: 14, padding: "16px 24px",
                  background: loading ? "var(--ink-muted)" : "#241f15",
                  color: "#fff0cd", border: "1px solid var(--tan)",
                  borderRadius: 999, fontFamily: "var(--font-sans)",
                  fontSize: 13, letterSpacing: "0.16em", textTransform: "uppercase",
                  cursor: loading ? "default" : "pointer",
                }}
              >
                {loading ? "Sending…" : "Send my access link"}
              </button>
            </form>
          </>
        ) : (
          <>
            <div
              style={{
                width: 64, height: 64, margin: "0 auto 36px",
                borderRadius: "50%", border: "1px solid var(--sage)",
                display: "flex", alignItems: "center", justifyContent: "center",
                animation: "refuge-breath 4s ease-in-out infinite",
              }}
            >
              <svg width="24" height="20" viewBox="0 0 24 20" fill="none" stroke="var(--sage)" strokeWidth="1">
                <rect x="1" y="2" width="22" height="16" rx="0.5" />
                <path d="M1 3 L12 11 L23 3" />
              </svg>
            </div>

            <div style={{ fontSize: 11, letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--tan)", marginBottom: 20 }}>
              Check your email
            </div>

            <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 400, lineHeight: 1.2, margin: "0 0 20px", color: "var(--ink)" }}>
              <em>Your link is on its way.</em>
            </h1>

            <p style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 17, lineHeight: 1.65, color: "var(--ink-soft)", margin: 0 }}>
              We sent a link to <strong style={{ color: "var(--ink)" }}>{email}</strong>. Open it on any device — it logs you straight into your course.
            </p>

            <button
              onClick={() => setSent(false)}
              style={{ marginTop: 40, fontSize: 12, color: "var(--ink-muted)", letterSpacing: "0.06em", cursor: "pointer", background: "transparent", border: "none" }}
            >
              Wrong email? Try again
            </button>
          </>
        )}
      </div>
    </div>
  );
}
