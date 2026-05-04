"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AccountNav from "@/app/components/AccountNav";
import RefugeScene from "@/app/components/RefugeScene";
import { getCourse, COURSE_DAYS } from "@/app/lib/courses";
import { createClient, hasSupabaseConfig } from "@/app/lib/supabase";

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

  useEffect(() => {
    if (!hasSupabaseConfig()) return;

    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      setSignedIn(!!user);
    });
  }, []);

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
      style={{
        position: "relative",
        minHeight: "100vh",
        background: "var(--paper)",
        fontFamily: "var(--font-sans)",
        color: "var(--ink)",
      }}
    >
      {/* Hero band */}
      <div style={{ position: "relative", height: 360, overflow: "hidden" }}>
        <RefugeScene kind={course.scene} />
        <div
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
          <button
            onClick={() => router.push("/home")}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "#f3ede2",
              fontFamily: "var(--font-sans)",
              fontSize: 12,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              gap: 10,
              opacity: 0.85,
            }}
          >
            ← Back to the library
          </button>
          <div
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
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(48px, 6vw, 84px)",
            fontWeight: 400,
            margin: 0,
            color: "#f3ede2",
            letterSpacing: "-0.02em",
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
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 22,
            padding: "24px 28px",
            background: "rgba(247, 241, 230, 0.5)",
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
    </div>
  );
}
