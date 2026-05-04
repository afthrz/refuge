"use client";

import { FormEvent, Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import RefugeWash from "@/app/components/RefugeWash";
import { createClient, hasSupabaseConfig } from "@/app/lib/supabase";

function getErrorMessage(code: string | null) {
  if (code === "auth_config") {
    return "Supabase is not configured yet. Add the public URL and anon key.";
  }

  if (code === "auth_failed") {
    return "The sign-in link could not be confirmed. Please try again.";
  }

  return null;
}

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryErrorMsg = getErrorMessage(searchParams.get("error"));
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const shownErrorMsg = errorMsg ?? queryErrorMsg;

  useEffect(() => {
    if (!hasSupabaseConfig()) return;

    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) router.replace("/home");
    });
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!email.includes("@")) return;
    setLoading(true);
    setErrorMsg(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setErrorMsg(error.message);
        return;
      }

      setSent(true);
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : "Sign-in failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setOauthLoading(true);
    setErrorMsg(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setErrorMsg(error.message);
        setOauthLoading(false);
      }
    } catch (error) {
      setErrorMsg(error instanceof Error ? error.message : "Google sign-in failed.");
      setOauthLoading(false);
    }
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
      <RefugeWash variant="forest" opacity={0.34} />

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
              boxShadow: "0 0 18px rgba(159,189,135,0.35)",
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
          Back
        </button>
      </div>

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
        <div
          style={{
            maxWidth: 500,
            width: "100%",
            textAlign: "center",
            padding: "34px 28px",
            border: "1px solid var(--card-edge)",
            background: "rgba(13, 23, 17, 0.72)",
            boxShadow: "0 24px 90px rgba(0,0,0,0.28)",
            backdropFilter: "blur(10px)",
          }}
        >
          {!sent ? (
            <div className="refuge-fade-in">
              <div
                style={{
                  fontSize: 11,
                  letterSpacing: "0.32em",
                  textTransform: "uppercase",
                  color: "var(--ink-muted)",
                  marginBottom: 28,
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
                  maxWidth: 390,
                  margin: "20px auto 0",
                }}
              >
                Continue with Google, or receive a single quiet link by email.
                If you are new, this also creates your account.
              </p>

              {shownErrorMsg && (
                <div
                  style={{
                    margin: "26px auto 0",
                    maxWidth: 420,
                    padding: "12px 14px",
                    background: "rgba(208, 150, 86, 0.1)",
                    border: "1px solid rgba(208, 150, 86, 0.28)",
                    borderRadius: 8,
                    color: "#f0c08a",
                    fontSize: 13,
                    lineHeight: 1.6,
                  }}
                >
                  {shownErrorMsg}
                </div>
              )}

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={oauthLoading || loading}
                style={{
                  width: "100%",
                  marginTop: 44,
                  padding: "15px 24px",
                  background: "#efe9dc",
                  color: "#182319",
                  border: "1px solid rgba(255,255,255,0.28)",
                  borderRadius: 999,
                  fontFamily: "var(--font-sans)",
                  fontSize: 13,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  cursor: oauthLoading || loading ? "default" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 12,
                  opacity: oauthLoading || loading ? 0.65 : 1,
                }}
              >
                <span
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: "white",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 600,
                  }}
                >
                  G
                </span>
                {oauthLoading ? "Opening Google..." : "Continue with Google"}
              </button>

              <div
                style={{
                  margin: "28px 0",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  color: "var(--ink-faint)",
                  fontSize: 10,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                }}
              >
                <span style={{ height: 1, flex: 1, background: "var(--card-edge)" }} />
                or
                <span style={{ height: 1, flex: 1, background: "var(--card-edge)" }} />
              </div>

              <form onSubmit={handleSubmit}>
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
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@somewhere.com"
                  required
                  disabled={loading || oauthLoading}
                  style={{
                    width: "100%",
                    padding: "16px 18px",
                    background: "#0d1711",
                    border: "1px solid var(--card-edge)",
                    borderRadius: 8,
                    fontFamily: "var(--font-serif)",
                    fontSize: 18,
                    fontStyle: "italic",
                    color: "var(--ink)",
                    outline: "none",
                    transition: "border-color 400ms ease",
                    boxSizing: "border-box",
                  }}
                />

                <button
                  type="submit"
                  disabled={loading || oauthLoading}
                  style={{
                    width: "100%",
                    marginTop: 16,
                    padding: "16px 24px",
                    background: loading ? "var(--ink-muted)" : "#241f15",
                    color: "#fff0cd",
                    border: "1px solid var(--tan)",
                    borderRadius: 999,
                    fontFamily: "var(--font-sans)",
                    fontSize: 13,
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    cursor: loading || oauthLoading ? "default" : "pointer",
                    transition: "opacity 400ms ease",
                  }}
                >
                  {loading ? "Sending..." : "Send the link"}
                </button>
              </form>
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
              <button
                type="button"
                style={{
                  marginTop: 48,
                  fontSize: 12,
                  color: "var(--ink-muted)",
                  letterSpacing: "0.06em",
                  cursor: "pointer",
                  background: "transparent",
                  border: "none",
                }}
                onClick={() => setSent(false)}
              >
                No email yet? Try again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInContent />
    </Suspense>
  );
}
