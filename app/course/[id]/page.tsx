"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AccountNav from "@/app/components/AccountNav";
import RefugeScene from "@/app/components/RefugeScene";
import { getCourse, COURSE_DAYS } from "@/app/lib/courses";
import { createClient, hasSupabaseConfig } from "@/app/lib/supabase";
import { PRODUCT_MODULES, bundleProgress, type AudioItem } from "@/app/data/product";

function PlayGlyph({ color }: { color: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14">
      <circle cx="7" cy="7" r="6.5" fill="none" stroke={color} strokeWidth="0.8" opacity="0.5" />
      <path d="M5.5 4.5 L9.5 7 L5.5 9.5 Z" fill={color} />
    </svg>
  );
}

function LockGlyph({ color }: { color: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke={color} strokeWidth="0.8">
      <rect x="3" y="6.5" width="8" height="6" rx="0.5" />
      <path d="M5 6.5 V4.5 a2 2 0 0 1 4 0 V6.5" />
    </svg>
  );
}

export default function CoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const course = getCourse(id);

  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const [signedIn, setSignedIn] = useState(false);
  const [accessChecked, setAccessChecked] = useState(false);

  useEffect(() => {
    if (!hasSupabaseConfig()) {
      setAccessChecked(true);
      return;
    }

    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        router.replace("/");
        return;
      }
      setSignedIn(true);

      // RLS returns a row if it matches this user's id OR their email, so
      // access works via email magic link or Google sign-in alike.
      const { data: purchase } = await supabase
        .from("purchases")
        .select("id")
        .limit(1)
        .maybeSingle();

      if (!purchase) {
        router.replace("/");
        return;
      }

      setAccessChecked(true);
    });
  }, [router]);

  if (!accessChecked) return null;

  if (!course) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--paper)",
          fontFamily: "var(--font-serif)",
          fontStyle: "italic",
          color: "var(--ink-muted)",
          fontSize: 18,
        }}
      >
        Course not found.{" "}
        <Link href="/home" style={{ color: "var(--sage)", marginLeft: 8 }}>
          Return to the library
        </Link>
      </div>
    );
  }

  return (
    <div
      className="course-page"
      style={{
        position: "relative",
        minHeight: "100svh",
        background: "var(--paper)",
        fontFamily: "var(--font-sans)",
        color: "var(--ink)",
      }}
    >
      {/* Hero band */}
      <div className="course-hero" style={{ position: "relative", height: 360, overflow: "hidden" }}>
        <RefugeScene kind={course.scene} />
        <div
          className="course-topbar"
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, transparent 0%, transparent 50%, var(--paper) 100%)",
          }}
        />

        {/* Top bar */}
        <div
          style={{
            position: "absolute",
            top: 32,
            left: 64,
            right: 64,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 2,
          }}
        >
          <div />
          <div
            className="course-brand-nav"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              color: "#f3ede2",
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontSize: 20,
            }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#f3ede2",
                  animation: "refuge-breath 4s ease-in-out infinite",
                }}
              />
              Refuge
            </span>
            <AccountNav />
          </div>
        </div>
      </div>

      {/* Title block — overlaps the gradient transition */}
      <div
        className="course-title-block"
        style={{
          position: "relative",
          zIndex: 2,
          marginTop: -200,
          padding: "0 64px",
          maxWidth: 1100,
          margin: "-200px auto 0",
        }}
      >
        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "#f3ede2",
            opacity: 0.85,
            marginBottom: 20,
          }}
        >
          A course in {course.days} days
        </div>
        <h1
          className="course-title"
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(48px, 6vw, 84px)",
            fontWeight: 400,
            margin: 0,
            color: "#f3ede2",
            letterSpacing: 0,
            lineHeight: 1,
            textShadow: "0 2px 30px rgba(0,0,0,0.2)",
          }}
        >
          {course.title}
        </h1>
        <div
          style={{
            marginTop: 16,
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontSize: 22,
            color: "#f3ede2",
            opacity: 0.85,
          }}
        >
          {course.subtitle}
        </div>
      </div>

      {/* Description + meta */}
      <section
        className="course-detail-grid"
        style={{
          position: "relative",
          zIndex: 1,
          padding: "120px 64px 60px",
          maxWidth: 1100,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr",
          gap: 64,
        }}
      >
        <div>
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: 22,
              lineHeight: 1.6,
              color: "var(--ink-soft)",
              fontStyle: "italic",
              margin: 0,
              fontWeight: 400,
              maxWidth: 560,
            }}
          >
            {course.description}
          </p>
          <p
            style={{
              marginTop: 28,
              fontSize: 14,
              lineHeight: 1.8,
              color: "var(--ink-soft)",
              maxWidth: 520,
            }}
          >
            Each day is a recorded session, between {course.duration}. You may begin
            the first day without an account. To unlock the rest of the course, sign
            in with your email — we will send you a single quiet link.
          </p>
        </div>

        <div
          className="course-meta-card"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 22,
            padding: "24px 28px",
            background: "var(--card)",
            border: "1px solid var(--card-edge)",
            borderRadius: 2,
            alignSelf: "start",
          }}
        >
          {[
            { label: "Length", value: `${course.days} days` },
            { label: "Per session", value: course.duration },
            { label: "Voice", value: course.teacher.replace("Voiced by ", "") },
            { label: "Pace", value: "Yours alone" },
          ].map(({ label, value }) => (
            <div
              key={label}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                gap: 16,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "var(--ink-muted)",
                }}
              >
                {label}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-serif)",
                  fontStyle: "italic",
                  fontSize: 16,
                  color: "var(--ink)",
                }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Days list */}
      <section
        className="course-path-section"
        style={{
          position: "relative",
          zIndex: 1,
          padding: "40px 64px 120px",
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        <div
          className="course-path-head"
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            marginBottom: 24,
          }}
        >
          <div
            style={{
              fontSize: 11,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              color: "var(--ink-muted)",
            }}
          >
            The path
          </div>
          {!signedIn && (
            <button
              onClick={() => router.push("/signin")}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: "var(--ink-soft)",
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontSize: 14,
                borderBottom: "1px solid var(--ink-soft)",
                paddingBottom: 1,
              }}
            >
              Sign in to unlock all days
            </button>
          )}
        </div>

        <div style={{ height: 1, background: "var(--card-edge)", marginBottom: 0 }} />

        {COURSE_DAYS.slice(0, course.days).map((title, i) => {
          const dayNum = i + 1;
          const locked = !signedIn && dayNum > 1;
          const isHovered = hoveredDay === dayNum;

          return (
            <div
              className="course-day-row"
              key={dayNum}
              onMouseEnter={() => setHoveredDay(dayNum)}
              onMouseLeave={() => setHoveredDay(null)}
              onClick={() =>
                locked
                  ? router.push("/signin")
                  : router.push(
                      `/player?course=${course.id}&day=${dayNum}&title=${encodeURIComponent(title)}`
                    )
              }
              style={{
                display: "grid",
                gridTemplateColumns: "80px 60px 1fr auto auto",
                gap: 24,
                alignItems: "center",
                padding: "20px 4px",
                borderBottom: "1px solid var(--card-edge)",
                cursor: "pointer",
                opacity: locked ? 0.55 : 1,
                background: isHovered ? "rgba(138, 155, 122, 0.04)" : "transparent",
                transition: "all 600ms ease",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--font-serif)",
                  fontStyle: "italic",
                  fontSize: 13,
                  color: "var(--ink-muted)",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                }}
              >
                Day {String(dayNum).padStart(2, "0")}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {locked ? (
                  <LockGlyph color="var(--ink-muted)" />
                ) : (
                  <PlayGlyph color={isHovered ? "var(--sage)" : "var(--ink-soft)"} />
                )}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 22,
                  fontWeight: 400,
                  color: "var(--ink)",
                  letterSpacing: "-0.005em",
                }}
              >
                {title}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "var(--ink-muted)",
                  letterSpacing: "0.04em",
                }}
              >
                {dayNum === 1 && !signedIn ? (
                  <span
                    style={{
                      color: "var(--sage)",
                      fontFamily: "var(--font-serif)",
                      fontStyle: "italic",
                      fontSize: 14,
                    }}
                  >
                    free to begin
                  </span>
                ) : (
                  `${10 + (dayNum % 5)} min`
                )}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-serif)",
                  fontStyle: "italic",
                  fontSize: 14,
                  color: locked
                    ? "var(--ink-muted)"
                    : isHovered
                    ? "var(--sage)"
                    : "var(--ink-soft)",
                  minWidth: 100,
                  textAlign: "right",
                  transition: "color 500ms ease",
                }}
              >
                {locked ? "sign in" : "begin"}
              </div>
            </div>
          );
        })}
      </section>

      {/* ── Beyond the path: the rest of the membership ── */}
      <section
        style={{
          position: "relative",
          zIndex: 1,
          padding: "40px 64px 120px",
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "var(--ink-muted)",
            marginBottom: 8,
          }}
        >
          Yours for good
        </div>
        <h2
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(28px, 3.4vw, 44px)",
            fontWeight: 400,
            margin: "0 0 40px",
            color: "var(--ink)",
          }}
        >
          Beyond the path
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {/* The Quiet Letters */}
          <div
            style={{
              border: "1px solid var(--card-edge)",
              background: "var(--card)",
              borderRadius: 4,
              padding: "26px 28px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontSize: 12, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink)", fontWeight: 600 }}>
                  The Quiet Letters
                </div>
                <div style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 16, color: "var(--ink-muted)", marginTop: 6, maxWidth: 520 }}>
                  A short written reflection with every session. It arrives the moment you finish each day&apos;s practice.
                </div>
              </div>
              <span style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--sage)" }}>
                All 21 · ready
              </span>
            </div>
          </div>

          {/* Audio bundles */}
          {PRODUCT_MODULES.filter((m) => m.kind === "audio-bundle").map((mod) => (
            <BundleCard key={mod.id} mod={mod} />
          ))}
        </div>
      </section>
    </div>
  );
}

function BundleCard({
  mod,
}: {
  mod: (typeof PRODUCT_MODULES)[number];
}) {
  const [open, setOpen] = useState(false);
  const items: AudioItem[] = mod.items ?? [];
  const { recorded, total } = bundleProgress(items);
  const afterPath = mod.unlock === "after-path";

  return (
    <div
      style={{
        border: "1px solid var(--card-edge)",
        background: "var(--card)",
        borderRadius: 4,
        padding: "26px 28px",
        opacity: afterPath ? 0.78 : 1,
      }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          width: "100%",
          background: "transparent",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: 16,
        }}
      >
        <div>
          <div style={{ fontSize: 12, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink)", fontWeight: 600 }}>
            {mod.name}
          </div>
          <div style={{ fontFamily: "var(--font-serif)", fontStyle: "italic", fontSize: 16, color: "var(--ink-muted)", marginTop: 6, maxWidth: 520 }}>
            {mod.blurb}
          </div>
        </div>
        <span style={{ fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink-faint)", whiteSpace: "nowrap" }}>
          {afterPath ? "Finish 21 days first" : recorded > 0 ? `${recorded} of ${total} ready` : "Coming soon"}
        </span>
      </button>

      {open && (
        <div style={{ marginTop: 22, borderTop: "1px solid var(--card-edge)", paddingTop: 8 }}>
          {items.map((it) => {
            const playable = it.status === "recorded" && it.audio && !afterPath;
            return (
              <div
                key={it.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 16,
                  padding: "13px 0",
                  borderBottom: "1px solid rgba(197,166,108,0.08)",
                }}
              >
                <div>
                  <div style={{ fontFamily: "var(--font-serif)", fontSize: 17, color: playable ? "var(--ink)" : "var(--ink-soft)" }}>
                    {it.title}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--ink-faint)", marginTop: 3, maxWidth: 480 }}>
                    {it.description}
                  </div>
                </div>
                <span style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: playable ? "var(--sage)" : "var(--ink-faint)", whiteSpace: "nowrap" }}>
                  {playable ? `Play · ${it.duration}` : it.duration}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
