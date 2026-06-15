"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { EmailOtpType } from "@supabase/supabase-js";
import RefugeWash from "@/app/components/RefugeWash";
import { createClient, hasSupabaseConfig } from "@/app/lib/supabase";

/* The email link lands here. Verification runs in the browser (JS), so an
   iOS/Gmail link scanner that merely fetches the URL can't consume the
   single-use token. Only a real tap completes the sign-in. */

function ConfirmInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const tokenHash = params.get("token_hash");
    const rawType = (params.get("type") || "magiclink") as EmailOtpType;
    const next = params.get("next");
    const safeNext =
      next && next.startsWith("/") && !next.startsWith("//")
        ? next
        : "/course/slowing-down";

    if (!tokenHash || !hasSupabaseConfig()) {
      setFailed(true);
      return;
    }

    const supabase = createClient();

    (async () => {
      const tries = [rawType, "magiclink", "email", "signup"] as EmailOtpType[];
      const seen = new Set<string>();
      for (const t of tries) {
        if (seen.has(t)) continue;
        seen.add(t);
        const { error } = await supabase.auth.verifyOtp({
          type: t,
          token_hash: tokenHash,
        });
        if (!error) {
          router.replace(safeNext);
          return;
        }
      }
      setFailed(true);
    })();
  }, [params, router]);

  useEffect(() => {
    if (failed) {
      const t = setTimeout(() => router.replace("/signin?error=auth_failed"), 1800);
      return () => clearTimeout(t);
    }
  }, [failed, router]);

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100svh",
        background: "var(--paper)",
        color: "var(--ink)",
        fontFamily: "var(--font-serif)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        textAlign: "center",
        padding: "40px",
      }}
    >
      <RefugeWash variant="dawn" opacity={0.35} />
      <div style={{ position: "relative", zIndex: 1 }}>
        <div
          style={{
            width: 44,
            height: 44,
            margin: "0 auto 24px",
            borderRadius: "50%",
            border: "1px solid var(--sage)",
            animation: "refuge-breath 4s ease-in-out infinite",
          }}
        />
        <div style={{ fontStyle: "italic", fontSize: 22, color: "var(--ink-soft)" }}>
          {failed ? "That link has expired — sending you to sign in…" : "Opening the door…"}
        </div>
      </div>
    </div>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense>
      <ConfirmInner />
    </Suspense>
  );
}
