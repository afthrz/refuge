"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { createClient, hasSupabaseConfig } from "@/app/lib/supabase";

function getInitial(user: User | null) {
  const name =
    user?.user_metadata?.full_name ??
    user?.user_metadata?.name ??
    user?.email ??
    "";

  return String(name).trim().charAt(0).toUpperCase() || "R";
}

export default function AccountNav() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(hasSupabaseConfig());
  const [signingOut, setSigningOut] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!hasSupabaseConfig()) {
      return;
    }

    const supabase = createClient();
    let mounted = true;

    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      setUser(data.user);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const label = useMemo(() => {
    if (!user?.email) return "signed in";
    return user.email;
  }, [user]);

  async function handleSignOut() {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setMenuOpen(false);
    setSigningOut(false);
  }

  if (loading) {
    return (
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--card-edge)] bg-[rgba(13,23,17,0.74)]">
        <span className="h-2 w-2 animate-breathe rounded-full bg-[var(--sage)]" />
      </span>
    );
  }

  if (!user) {
    return (
      <Link
        href="/signin"
        className="inline-flex h-9 items-center rounded-full border border-[var(--card-edge)] bg-[rgba(13,23,17,0.74)] px-4 text-[11px] uppercase tracking-[0.18em] text-[var(--ink)] transition-all hover:border-[var(--tan)] hover:text-[#fff0cd]"
      >
        Sign in
      </Link>
    );
  }

  return (
    <div className="group relative">
      <button
        type="button"
        title={label}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
        className="inline-flex h-10 items-center gap-2 rounded-full border border-[var(--tan)] bg-[#241f15]/85 pl-1.5 pr-3 text-[#fff0cd] shadow-[0_0_28px_rgba(197,166,108,0.16)]"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--tan)] text-xs font-medium text-[#0d1711]">
          {getInitial(user)}
        </span>
        <span className="hidden max-w-36 truncate text-[10px] uppercase tracking-[0.16em] text-[#fff0cd] sm:block">
          {label}
        </span>
      </button>

      <div
        className={`absolute right-0 top-full z-50 min-w-52 pt-2 group-focus-within:block group-hover:block ${
          menuOpen ? "block" : "hidden"
        }`}
      >
        <div className="rounded-[8px] border border-[var(--card-edge)] bg-[#09120d] p-2 shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
          <p className="truncate px-3 py-2 text-xs normal-case tracking-normal text-[var(--ink-soft)]">
            {label}
          </p>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className="w-full rounded-[6px] px-3 py-2 text-left text-[11px] uppercase tracking-[0.18em] text-[var(--ink)] transition-colors hover:bg-[#14251b] disabled:text-[var(--ink-faint)]"
          >
            {signingOut ? "Leaving..." : "Sign out"}
          </button>
        </div>
      </div>
    </div>
  );
}
