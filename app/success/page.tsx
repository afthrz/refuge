"use client";

import Link from "next/link";
import RefugeWash from "@/app/components/RefugeWash";

export default function SuccessPage() {
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
          maxWidth: 520,
          width: "100%",
          textAlign: "center",
          padding: "48px 32px",
        }}
      >
        {/* envelope icon */}
        <div
          style={{
            width: 64,
            height: 64,
            margin: "0 auto 36px",
            borderRadius: "50%",
            border: "1px solid var(--sage)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animation: "refuge-breath 4s ease-in-out infinite",
          }}
        >
          <svg
            width="24"
            height="20"
            viewBox="0 0 24 20"
            fill="none"
            stroke="var(--sage)"
            strokeWidth="1"
          >
            <rect x="1" y="2" width="22" height="16" rx="0.5" />
            <path d="M1 3 L12 11 L23 3" />
          </svg>
        </div>

        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "var(--tan)",
            marginBottom: 20,
          }}
        >
          Payment complete
        </div>

        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(36px, 5vw, 52px)",
            fontWeight: 400,
            lineHeight: 1.2,
            margin: "0 0 24px",
            color: "var(--ink)",
          }}
        >
          <em>Check your email.</em>
        </h1>

        <p
          style={{
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontSize: 18,
            lineHeight: 1.65,
            color: "var(--ink-soft)",
            margin: "0 0 48px",
          }}
        >
          We&apos;ve sent you a link to access your course. Open it on any
          device — no password needed.
        </p>

        <div
          style={{
            padding: "24px 28px",
            border: "1px solid var(--card-edge)",
            background: "rgba(16,28,21,0.6)",
            textAlign: "left",
            marginBottom: 40,
          }}
        >
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "var(--ink-muted)",
              marginBottom: 16,
            }}
          >
            What happens next
          </div>
          {[
            "Open the email from Refuge",
            "Click the link (it logs you in automatically)",
            "Day 1 of Slowing Down is waiting for you",
          ].map((step, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 14,
                padding: "10px 0",
                borderBottom:
                  i < 2 ? "1px solid rgba(197,166,108,0.1)" : "none",
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  letterSpacing: "0.08em",
                  color: "var(--ink-faint)",
                  minWidth: 20,
                  paddingTop: 2,
                }}
              >
                {i + 1}.
              </span>
              <span
                style={{
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: "var(--ink-soft)",
                }}
              >
                {step}
              </span>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 13, color: "var(--ink-faint)", lineHeight: 1.6 }}>
          No email after a few minutes?{" "}
          <Link
            href="/signin"
            style={{ color: "var(--ink-muted)", textDecoration: "underline" }}
          >
            Sign in here
          </Link>{" "}
          with the email you used at checkout.
        </p>
      </div>
    </div>
  );
}
