"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AccountNav from "@/app/components/AccountNav";
import RefugeWash from "@/app/components/RefugeWash";
import RefugeScene from "@/app/components/RefugeScene";
import { COURSES, type Course, type ArrivalOption } from "@/app/lib/courses";

export default function HomePage() {
  const router = useRouter();
  const [hovered, setHovered] = useState<string | null>(null);
  const [arrival, setArrival] = useState<ArrivalOption | null>(null);

  useEffect(() => {
    const id = window.setTimeout(() => {
      try {
        const raw = localStorage.getItem("refuge-arrival");
        if (raw) setArrival(JSON.parse(raw));
      } catch {}
    }, 0);

    return () => window.clearTimeout(id);
  }, []);

  return (
    <div
      className="home-page"
      style={{
        position: "relative",
        minHeight: "100svh",
        background: "var(--paper)",
        fontFamily: "var(--font-sans)",
        color: "var(--ink)",
      }}
    >
      <RefugeWash variant="forest" opacity={0.4} />

      {/* Header */}
      <header
        className="home-header"
        style={{
          position: "relative",
          zIndex: 2,
          padding: "36px 64px 0",
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
          <BreathDot />
          <span>Refuge</span>
        </div>
        <nav
          className="home-nav"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 36,
            fontSize: 13,
            letterSpacing: "0.06em",
            color: "var(--ink-soft)",
          }}
        >
          <Link href="/home" className="refuge-link" style={{ borderColor: "transparent" }}>
            Courses
          </Link>
          <Link href="/garden" className="refuge-link" style={{ borderColor: "transparent" }}>
            Garden
          </Link>
          <AccountNav />
        </nav>
      </header>

      {/* Hero */}
      <section
        className="home-hero"
        style={{
          position: "relative",
          zIndex: 1,
          padding: "110px 64px 88px",
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 11,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "var(--ink-muted)",
            marginBottom: 32,
          }}
        >
          <span style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
            <span
              style={{
                width: 24,
                height: 1,
                background: "var(--ink-muted)",
                display: "inline-block",
              }}
            />
            Now open
          </span>
        </div>

        <h1
          className="refuge-fade-in"
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(40px, 5.6vw, 72px)",
            fontWeight: 400,
            lineHeight: 1.05,
            margin: 0,
            color: "#f3e7cf",
            letterSpacing: 0,
            maxWidth: 900,
            textShadow: "0 0 46px rgba(197, 166, 108, 0.18)",
          }}
        >
          A quiet place to come back to,
          <br />
          <em
            style={{
              fontStyle: "italic",
              color: "#b9c3a6",
              fontWeight: 400,
            }}
          >
            in a world that won&rsquo;t let you stop.
          </em>
        </h1>

        <p
          style={{
            marginTop: 36,
            maxWidth: 560,
            fontFamily: "var(--font-serif)",
            fontSize: 18,
            lineHeight: 1.7,
            color: "var(--ink-soft)",
            fontStyle: "italic",
          }}
        >
          Refuge is not a productivity app. There are no streaks here, and nothing
          to win. Five courses to slow you down, and a small library you can return
          to as often as you need.
        </p>

        {arrival && (
          <div
            style={{
              marginTop: 40,
              padding: "18px 22px",
              background: "rgba(138, 155, 122, 0.08)",
              border: "1px solid var(--card-edge)",
              borderRadius: 2,
              display: "inline-flex",
              alignItems: "center",
              gap: 16,
              fontSize: 13,
              color: "var(--ink-soft)",
            }}
          >
            <BreathDot size={6} />
            <span>
              Based on how you arrived, we suggest{" "}
              <em
                style={{
                  fontFamily: "var(--font-serif)",
                  fontStyle: "italic",
                  fontSize: 15,
                  color: "var(--ink)",
                }}
              >
                {COURSES.find((c) => c.id === arrival.suggested)?.title}
              </em>
              .
            </span>
          </div>
        )}
      </section>

      {/* Course library */}
      <section
        className="home-library"
        style={{
          position: "relative",
          zIndex: 1,
          padding: "0 64px 120px",
          maxWidth: 1100,
          margin: "0 auto",
        }}
      >
        <div
          className="home-library-head"
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            marginBottom: 32,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: "var(--ink-muted)",
                marginBottom: 10,
              }}
            >
              The library
            </div>
            <h2
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: 32,
                fontWeight: 400,
                margin: 0,
                color: "var(--ink)",
                fontStyle: "italic",
              }}
            >
              Five courses, in no particular order.
            </h2>
          </div>
          <div
            style={{
              fontSize: 12,
              color: "var(--ink-muted)",
              letterSpacing: "0.06em",
            }}
          >
            Begin with day one, free.
          </div>
        </div>

        <div
          style={{
            height: 1,
            background: "var(--card-edge)",
            marginBottom: 8,
          }}
        />

        <div style={{ display: "flex", flexDirection: "column" }}>
          {COURSES.map((course, i) => (
            <CourseRow
              key={course.id}
              course={course}
              index={i + 1}
              isHovered={hovered === course.id}
              isSuggested={arrival?.suggested === course.id}
              onMouseEnter={() => setHovered(course.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => router.push(`/course/${course.id}`)}
            />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        className="home-footer"
        style={{
          position: "relative",
          zIndex: 1,
          padding: "64px 64px 48px",
          borderTop: "1px solid var(--card-edge)",
          maxWidth: 1100,
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          fontSize: 12,
          color: "var(--ink-muted)",
        }}
      >
        <div style={{ maxWidth: 320, lineHeight: 1.7 }}>
          <div
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontSize: 16,
              color: "var(--ink-soft)",
              marginBottom: 8,
            }}
          >
            The forest does not keep score.
          </div>
          Built quietly. No notifications, no tracking, no streaks.
        </div>
        <div style={{ display: "flex", gap: 32 }}>
          <Link href="/" className="refuge-link" style={{ borderColor: "transparent" }}>
            The Arrival
          </Link>
          <Link href="/garden" className="refuge-link" style={{ borderColor: "transparent" }}>
            Garden
          </Link>
        </div>
      </footer>
    </div>
  );
}

function CourseRow({
  course,
  index,
  isHovered,
  isSuggested,
  onMouseEnter,
  onMouseLeave,
  onClick,
}: {
  course: Course;
  index: number;
  isHovered: boolean;
  isSuggested: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
}) {
  return (
    <div
      className="course-row"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      style={{
        position: "relative",
        display: "grid",
        gridTemplateColumns: "64px 280px 1fr auto",
        gap: 32,
        alignItems: "center",
        padding: "32px 0",
        borderBottom: "1px solid var(--card-edge)",
        cursor: "pointer",
        transition: "all 700ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
    >
      {/* Number */}
      <div
        className="course-row-index"
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: 14,
          fontStyle: "italic",
          color: "var(--ink-faint)",
          letterSpacing: "0.04em",
        }}
      >
        {String(index).padStart(2, "0")}
      </div>

      {/* Thumbnail */}
      <div
        className="course-row-thumb"
        style={{
          position: "relative",
          width: "100%",
          height: 180,
          overflow: "hidden",
          borderRadius: 2,
          transform: isHovered ? "scale(1.02)" : "scale(1)",
          transition: "transform 1200ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <RefugeScene kind={course.scene} />
        {isSuggested && (
          <div
            className="course-suggested-badge"
            style={{
              position: "absolute",
              top: 12,
              left: 12,
              padding: "4px 10px",
              background: "rgba(243, 231, 207, 0.94)",
              backdropFilter: "blur(4px)",
              color: "var(--paper)",
              border: "1px solid rgba(7, 16, 11, 0.1)",
              fontSize: 9,
              fontWeight: 500,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              borderRadius: 1,
            }}
          >
            For you
          </div>
        )}
      </div>

      {/* Text */}
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontFamily: "var(--font-sans)",
            fontSize: 11,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: "var(--ink-muted)",
            marginBottom: 10,
          }}
        >
          {course.subtitle}
        </div>
        <h3
          className="course-row-title"
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: 36,
            fontWeight: 400,
            margin: 0,
            color: "var(--ink)",
            lineHeight: 1.05,
            letterSpacing: 0,
          }}
        >
          {course.title}
        </h3>
        <p
          style={{
            marginTop: 14,
            marginBottom: 0,
            fontSize: 14,
            lineHeight: 1.7,
            color: "var(--ink-soft)",
            maxWidth: 460,
          }}
        >
          {course.description}
        </p>
      </div>

      {/* Meta */}
      <div
        className="course-row-meta"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 14,
          textAlign: "right",
          fontSize: 12,
          color: "var(--ink-muted)",
          letterSpacing: "0.04em",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontSize: 24,
              color: "var(--ink)",
              lineHeight: 1,
            }}
          >
            {course.days}
          </div>
          <div
            style={{
              marginTop: 4,
              fontSize: 10,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
            }}
          >
            days
          </div>
        </div>
        <div style={{ fontSize: 11, color: "var(--ink-muted)" }}>{course.duration}</div>
        <div
          style={{
            marginTop: 8,
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontSize: 14,
            color: isHovered ? "var(--sage)" : "var(--ink-soft)",
            transition: "color 600ms ease",
          }}
        >
          enter →
        </div>
      </div>
    </div>
  );
}

function BreathDot({ size = 8 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "var(--sage)",
        animation: "refuge-breath 4s ease-in-out infinite",
        flexShrink: 0,
      }}
    />
  );
}
