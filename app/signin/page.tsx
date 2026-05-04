"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RefugeWash from "@/app/components/RefugeWash";
import { createClient } from "@/app/lib/supabase";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;
    setLoading(true);
    setErrorMsg(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    setSent(true);
  }

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        background: "var(--paper)",
        fontFamily: "var(--font-sans)",
        color: "var(--ink)",
        overflow: "hidden",
      }}
    >
      <RefugeWash variant="forest" opacity={0.4} />

      {/* Top bar */}
      <div
        style={{
          position: "absolute",
          top: 32,
          left: 64,
          right: 64,
          zIndex: 5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontSize: 22,
            letterSpacing: "0.02em",
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: "var(--sage)",
              animation: "refuge-breath 4s ease-in-out infinite",
            }}
          />
          <span>Refuge</span>
        </div>
        <button
          onClick={() => router.back()}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "var(--ink-muted)",
            fontFamily: "var(--font-sans)",
            fontSize: 12,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
          }}
        >
          ← Back
        </button>
      </div>

      {/* Center */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "120px 48px 80px",
        }}
      >
        <div style={{ maxWidth: 480, width: "100%", textAlign: "center" }}>
          {!sent ? (
            <div className="refuge-fade-in">
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: "0.32em",
                  textTransform: "uppercase",
                  color: "var(--ink-muted)",
                  marginBottom: 32,
                }}
              >
                Sign in
              </div>
              <h1
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(40px, 5vw, 56px)",
                  fontWeight: 400,
                  margin: 0,
                  color: "var(--ink)",
                  lineHeight: 1.15,
                  letterSpacing: "-0.01em",
                }}
              >
                <em style={{ fontStyle: "italic" }}>Welcome back.</em>
              </h1>
              <p
                style={{
                  marginTop: 20,
                  fontFamily: "var(--font-serif)",
                  fontStyle: "italic",
                  fontSize: 17,
                  color: "var(--ink-soft)",
                  lineHeight: 1.7,
                  maxWidth: 380,
                  margin: "20px auto 0",
                }}
              >
                We will send you a single quiet link. No password to remember.
                If you are new, this also creates your account.
              </p>

              <form onSubmit={handleSubmit} style={{ marginTop: 56 }}>
                <label
                  style={{
                    display: "block",
                    textAlign: "left",
                    fontSize: 11,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: "var(--ink-muted)",
                    marginBottom: 12,
                  }}
                >
                  Your email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@somewhere.com"
                  required
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "16px 18px",
                    background: "rgba(247, 241, 230, 0.6)",
                    border: "1px solid var(--card-edge)",
                    borderRadius: 2,
                    fontFamily: "var(--font-serif)",
                    fontSize: 18,
                    fontStyle: "italic",
                    color: "var(--ink)",
                    outline: "none",
                    transition: "border-color 400ms ease",
                    boxSizing: "border-box",
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "var(--sage)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "var(--card-edge)";
                  }}
                />

                {errorMsg && (
                  <div
                    style={{
                      marginTop: 10,
                      fontSize: 13,
                      color: "#b05a3a",
                      textAlign: "left",
                      fontStyle: "italic",
                      fontFamily: "var(--font-serif)",
                    }}
                  >
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: "100%",
                    marginTop: 16,
                    padding: "16px 24px",
                    background: loading ? "var(--ink-muted)" : "var(--ink)",
                    color: "var(--paper)",
                    border: "none",
                    borderRadius: 2,
                    fontFamily: "var(--font-sans)",
                    fontSize: 13,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    cursor: loading ? "default" : "pointer",
                    transition: "opacity 400ms ease",
                  }}
                >
                  {loading ? "Sending..." : "Send the link"}
                </button>
              </form>

              <div
                style={{
                  marginTop: 40,
                  fontSize: 12,
                  color: "var(--ink-muted)",
                  lineHeight: 1.7,
                }}
              >
                By continuing you agree to our quiet terms and privacy policy.
              </div>
            </div>
          ) : (
            <div className="refuge-fade-in-slow">
              <div
                style={{
                  width: 56,
                  height: 56,
                  margin: "0 auto 32px",
                  borderRadius: "50%",
                  border: "1px solid var(--sage)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  animation: "refuge-breath 4s ease-in-out infinite",
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="var(--sage)"
                  strokeWidth="1"
                >
                  <rect x="3" y="5" width="14" height="10" rx="0.5" />
                  <path d="M3 6 L10 11 L17 6" />
                </svg>
              </div>
              <h1
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(36px, 4.5vw, 48px)",
                  fontWeight: 400,
                  margin: 0,
                  color: "var(--ink)",
                  fontStyle: "italic",
                  lineHeight: 1.2,
                }}
              >
                Check your email.
              </h1>
              <p
                style={{
                  marginTop: 20,
                  fontFamily: "var(--font-serif)",
                  fontStyle: "italic",
                  fontSize: 17,
                  color: "var(--ink-soft)",
                  lineHeight: 1.7,
                  maxWidth: 360,
                  margin: "20px auto 0",
                }}
              >
                A link is on its way to{" "}
                <span style={{ color: "var(--ink)" }}>{email}</span>. Open it
                on this device when you are ready.
              </p>
              <div
                style={{
                  marginTop: 48,
                  fontSize: 12,
                  color: "var(--ink-muted)",
                  letterSpacing: "0.06em",
                  cursor: "pointer",
                }}
                onClick={() => setSent(false)}
              >
                No email yet? Try again
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
