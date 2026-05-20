"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import RefugeWash from "@/app/components/RefugeWash";
import { createClient, hasSupabaseConfig } from "@/app/lib/supabase";
import { COURSE_DAYS } from "@/app/lib/courses";

export default function LandingPage() {
  const router = useRouter();
  const [buying, setBuying] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!hasSupabaseConfig()) {
      setChecking(false);
      return;
    }
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        const { data: purchase } = await supabase
          .from("purchases")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();
        if (purchase) {
          router.replace("/course/slowing-down");
          return;
        }
      }
      setChecking(false);
    });
  }, [router]);

  async function handleBuy() {
    setBuying(true);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const { url, error } = await res.json();
      if (error) { alert(error); setBuying(false); return; }
      if (url) window.location.href = url;
    } catch {
      setBuying(false);
    }
  }

  if (checking) return null;

  return (
    <div
      style={{
        background: "var(--paper)",
        color: "var(--ink)",
        fontFamily: "var(--font-sans)",
      }}
    >
      {/* ── Nav ── */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "22px 48px",
          background: "rgba(7,16,11,0.82)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(197,166,108,0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontSize: 20,
            letterSpacing: "0.02em",
          }}
        >
          <BreathDot />
          Refuge
        </div>
        <Link
          href="/signin"
          style={{
            fontSize: 12,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--ink-muted)",
            textDecoration: "none",
            borderBottom: "1px solid transparent",
            transition: "color 400ms, border-color 400ms",
          }}
        >
          Already have access? Sign in
        </Link>
      </nav>

      {/* ── Hero ── */}
      <section
        style={{
          position: "relative",
          minHeight: "100svh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "120px 48px 80px",
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        <RefugeWash variant="dawn" opacity={0.45} />

        <div
          className="refuge-fade-in"
          style={{ position: "relative", zIndex: 1, maxWidth: 760, width: "100%" }}
        >
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "var(--tan)",
              marginBottom: 32,
            }}
          >
            A 21-day guided meditation journey
          </div>

          <h1
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(52px, 7vw, 96px)",
              fontWeight: 400,
              lineHeight: 1.06,
              margin: "0 0 28px",
              color: "var(--ink)",
              letterSpacing: "-0.01em",
            }}
          >
            Slow down.
            <br />
            <em style={{ fontStyle: "italic", color: "var(--sage)" }}>
              Actually
            </em>{" "}
            slow down.
          </h1>

          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontSize: "clamp(17px, 2.2vw, 22px)",
              lineHeight: 1.65,
              color: "var(--ink-soft)",
              maxWidth: 560,
              margin: "0 auto 52px",
            }}
          >
            Daily meditations that teach you to breathe, rest, and return to
            yourself — even when life won&apos;t stop. No experience needed.
          </p>

          <BuyButton loading={buying} onClick={handleBuy} />

          <div
            style={{
              marginTop: 20,
              fontSize: 12,
              letterSpacing: "0.08em",
              color: "var(--ink-faint)",
            }}
          >
            $29 · one-time · lifetime access · works on any device
          </div>
        </div>

        {/* scroll cue */}
        <div
          style={{
            position: "absolute",
            bottom: 36,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            opacity: 0.4,
          }}
        >
          <div style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase" }}>
            scroll
          </div>
          <svg width="1" height="40" viewBox="0 0 1 40">
            <line x1="0.5" y1="0" x2="0.5" y2="40" stroke="var(--ink-faint)" strokeWidth="1" />
          </svg>
        </div>
      </section>

      {/* ── The Problem ── */}
      <section
        style={{
          padding: "100px 48px",
          maxWidth: 800,
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontSize: "clamp(22px, 3vw, 36px)",
            lineHeight: 1.55,
            color: "var(--ink-soft)",
            margin: 0,
          }}
        >
          We say we want to slow down.
          <br />
          Then we check the phone.
        </p>
        <div
          style={{
            width: 40,
            height: 1,
            background: "var(--card-edge)",
            margin: "48px auto",
          }}
        />
        <p
          style={{
            fontSize: 16,
            lineHeight: 1.85,
            color: "var(--ink-muted)",
            maxWidth: 600,
            margin: "0 auto",
          }}
        >
          This course is built for people who know they need to slow down but
          haven&apos;t found a way that sticks. Not another app. Not a streak to
          maintain. Just 21 short sessions that teach your nervous system what
          rest actually feels like.
        </p>
      </section>

      {/* ── What's inside ── */}
      <section
        style={{
          padding: "80px 48px",
          borderTop: "1px solid var(--card-edge)",
          borderBottom: "1px solid var(--card-edge)",
          background: "var(--paper-deep)",
        }}
      >
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "var(--ink-muted)",
              marginBottom: 48,
              textAlign: "center",
            }}
          >
            What&apos;s inside
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 2,
            }}
          >
            {[
              { label: "21 sessions", sub: "One per day. Nothing to binge." },
              { label: "8–14 min each", sub: "Short enough to actually do." },
              { label: "Audio-first", sub: "Listen anywhere — eyes closed." },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  padding: "36px 32px",
                  background: "var(--card)",
                  border: "1px solid var(--card-edge)",
                  textAlign: "center",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontSize: 28,
                    fontWeight: 400,
                    color: "var(--ink)",
                    marginBottom: 10,
                  }}
                >
                  {item.label}
                </div>
                <div style={{ fontSize: 13, color: "var(--ink-muted)", lineHeight: 1.5 }}>
                  {item.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── The 21 Days ── */}
      <section style={{ padding: "100px 48px", maxWidth: 960, margin: "0 auto" }}>
        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: "var(--ink-muted)",
            marginBottom: 12,
            textAlign: "center",
          }}
        >
          The journey
        </div>
        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(32px, 4vw, 52px)",
            fontWeight: 400,
            textAlign: "center",
            margin: "0 0 64px",
            color: "var(--ink)",
          }}
        >
          21 days. One breath at a time.
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "0 48px",
          }}
        >
          {COURSE_DAYS.map((title, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 16,
                padding: "14px 0",
                borderBottom: "1px solid rgba(197,166,108,0.1)",
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  letterSpacing: "0.12em",
                  color: "var(--ink-faint)",
                  minWidth: 28,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 17,
                  color: i < 2 ? "var(--ink)" : "var(--ink-soft)",
                  fontStyle: i >= 2 ? "italic" : "normal",
                }}
              >
                {title}
                {i < 2 && (
                  <span
                    style={{
                      marginLeft: 10,
                      fontSize: 9,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "var(--sage)",
                      fontStyle: "normal",
                      fontFamily: "var(--font-sans)",
                    }}
                  >
                    available
                  </span>
                )}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section
        style={{
          padding: "100px 48px",
          background: "var(--paper-deep)",
          borderTop: "1px solid var(--card-edge)",
        }}
      >
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "var(--ink-muted)",
              marginBottom: 64,
              textAlign: "center",
            }}
          >
            What people say
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 24,
            }}
          >
            {[
              {
                quote:
                  "I've tried a dozen meditation apps. This is the first one that made me feel actually different, not just like I completed something.",
                name: "M.",
              },
              {
                quote:
                  "Day 7 was when something shifted. I genuinely cannot explain it, but I stopped rushing everywhere.",
                name: "R.",
              },
              {
                quote:
                  "The sessions are short enough that I've actually done every single one. Worth every penny.",
                name: "J.",
              },
            ].map((t) => (
              <div
                key={t.name}
                style={{
                  padding: "32px 28px",
                  border: "1px solid var(--card-edge)",
                  background: "var(--card)",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontStyle: "italic",
                    fontSize: 17,
                    lineHeight: 1.65,
                    color: "var(--ink-soft)",
                    margin: "0 0 24px",
                  }}
                >
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: "var(--ink-faint)",
                  }}
                >
                  — {t.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section
        style={{
          padding: "120px 48px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <RefugeWash variant="forest" opacity={0.28} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 560, margin: "0 auto" }}>
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "var(--ink-muted)",
              marginBottom: 32,
            }}
          >
            Begin today
          </div>

          <div
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(64px, 10vw, 120px)",
              fontWeight: 400,
              color: "var(--ink)",
              lineHeight: 1,
              marginBottom: 8,
            }}
          >
            $29
          </div>
          <div
            style={{
              fontSize: 13,
              letterSpacing: "0.08em",
              color: "var(--ink-muted)",
              marginBottom: 48,
            }}
          >
            one-time · no subscription · no expiry
          </div>

          <BuyButton loading={buying} onClick={handleBuy} large />

          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: "44px auto 0",
              display: "flex",
              flexDirection: "column",
              gap: 14,
              textAlign: "left",
              maxWidth: 320,
            }}
          >
            {[
              "21 guided audio sessions",
              "8–14 minutes per day",
              "Lifetime access",
              "Works on phone, tablet, or laptop",
              "No app download required",
            ].map((item) => (
              <li
                key={item}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  fontSize: 14,
                  color: "var(--ink-soft)",
                }}
              >
                <span
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    border: "1px solid var(--sage)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                    <path d="M1 3 L3 5 L7 1" stroke="var(--sage)" strokeWidth="1.2" />
                  </svg>
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        style={{
          borderTop: "1px solid var(--card-edge)",
          padding: "32px 48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 11,
          letterSpacing: "0.1em",
          color: "var(--ink-faint)",
        }}
      >
        <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 16 }}>
          Refuge
        </span>
        <div style={{ display: "flex", gap: 32 }}>
          <Link
            href="/signin"
            style={{ color: "inherit", textDecoration: "none" }}
          >
            Sign in
          </Link>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </footer>

      <style>{`
        @media (max-width: 768px) {
          .landing-stats { grid-template-columns: 1fr !important; }
          .landing-days { grid-template-columns: 1fr !important; }
          .landing-testimonials { grid-template-columns: 1fr !important; }
          .landing-nav { padding: 18px 24px !important; }
        }
      `}</style>
    </div>
  );
}

function BreathDot() {
  return (
    <div
      style={{
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: "var(--sage)",
        animation: "refuge-breath 4s ease-in-out infinite",
      }}
    />
  );
}

function BuyButton({
  loading,
  onClick,
  large,
}: {
  loading: boolean;
  onClick: () => void;
  large?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      style={{
        padding: large ? "20px 56px" : "16px 48px",
        background: loading ? "var(--sage-deep)" : "var(--sage)",
        color: "#0d1711",
        border: "none",
        borderRadius: 999,
        fontFamily: "var(--font-sans)",
        fontSize: large ? 14 : 13,
        fontWeight: 600,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        cursor: loading ? "default" : "pointer",
        opacity: loading ? 0.7 : 1,
        transition: "opacity 300ms, background 300ms",
      }}
    >
      {loading ? "Opening checkout..." : "Begin for $29"}
    </button>
  );
}
