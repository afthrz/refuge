"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import RefugeWash from "@/app/components/RefugeWash";
import { ARRIVAL_OPTIONS } from "@/app/lib/courses";

type Phase = "intro" | "question" | "chosen";

export default function ArrivalPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("intro");
  const [chosen, setChosen] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setPhase("question"), 2200);
    return () => clearTimeout(t);
  }, []);

  function handleChoose(option: (typeof ARRIVAL_OPTIONS)[0]) {
    setChosen(option.id);
    setPhase("chosen");
    localStorage.setItem("refuge-arrival", JSON.stringify(option));
    setTimeout(() => router.push("/home"), 1800);
  }

  function handleSkip() {
    localStorage.removeItem("refuge-arrival");
    router.push("/home");
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
      <RefugeWash variant="dawn" opacity={0.5} />

      {/* Top bar */}
      <div
        style={{
          position: "absolute",
          top: 32,
          left: 48,
          right: 48,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 2,
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
        <button
          onClick={handleSkip}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "var(--ink-muted)",
            fontFamily: "var(--font-sans)",
            fontSize: 12,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Browse the courses
        </button>
      </div>

      {/* Center stage */}
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
        <div style={{ maxWidth: 720, width: "100%", textAlign: "center" }}>

          {phase === "intro" && (
            <div className="refuge-fade-in-slow">
              <div
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: 28,
                  fontStyle: "italic",
                  color: "var(--ink-soft)",
                  lineHeight: 1.5,
                  fontWeight: 400,
                }}
              >
                Welcome.
              </div>
              <div
                style={{
                  marginTop: 16,
                  color: "var(--ink-muted)",
                  fontSize: 14,
                  letterSpacing: "0.04em",
                }}
              >
                Take a breath before we begin.
              </div>
            </div>
          )}

          {(phase === "question" || phase === "chosen") && (
            <div className="refuge-fade-in">
              <div
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 11,
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  color: "var(--ink-muted)",
                  marginBottom: 24,
                }}
              >
                The Arrival
              </div>

              <h1
                style={{
                  fontFamily: "var(--font-serif)",
                  fontSize: "clamp(36px, 5.2vw, 56px)",
                  fontWeight: 400,
                  lineHeight: 1.15,
                  margin: 0,
                  color: "var(--ink)",
                  letterSpacing: "-0.01em",
                }}
              >
                How are you{" "}
                <em style={{ fontStyle: "italic", color: "var(--sage)" }}>arriving</em>{" "}
                today?
              </h1>

              <div
                style={{
                  marginTop: 18,
                  marginBottom: 56,
                  color: "var(--ink-soft)",
                  fontSize: 15,
                  lineHeight: 1.7,
                  fontFamily: "var(--font-serif)",
                  fontStyle: "italic",
                  maxWidth: 480,
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                There are no wrong answers. Choose what feels closest to true.
              </div>

              {/* Three doors */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: 16,
                  maxWidth: 880,
                  margin: "0 auto",
                }}
              >
                {ARRIVAL_OPTIONS.map((option) => {
                  const isHovered = hovered === option.id;
                  const isChosen = chosen === option.id;
                  const isFaded = chosen !== null && !isChosen;
                  return (
                    <button
                      key={option.id}
                      onMouseEnter={() => setHovered(option.id)}
                      onMouseLeave={() => setHovered(null)}
                      onClick={() => handleChoose(option)}
                      disabled={chosen !== null}
                      style={{
                        position: "relative",
                        padding: "40px 24px 36px",
                        background:
                          isHovered || isChosen
                            ? "var(--card)"
                            : "rgba(247, 241, 230, 0.4)",
                        border: `1px solid ${isHovered || isChosen ? "var(--sage)" : "var(--card-edge)"}`,
                        borderRadius: 2,
                        cursor: chosen !== null ? "default" : "pointer",
                        textAlign: "center",
                        fontFamily: "inherit",
                        color: "inherit",
                        opacity: isFaded ? 0.3 : 1,
                        transform:
                          isHovered && chosen === null
                            ? "translateY(-2px)"
                            : "translateY(0)",
                        transition: "all 900ms cubic-bezier(0.22, 1, 0.36, 1)",
                        backdropFilter: "blur(4px)",
                      }}
                    >
                      <div
                        style={{
                          width: 32,
                          height: 32,
                          margin: "0 auto 24px",
                          borderRadius: "50%",
                          border: "1px solid var(--sage)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: isChosen ? "var(--sage)" : "transparent",
                          transition: "background 600ms ease",
                        }}
                      >
                        <div
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: "50%",
                            background: isChosen ? "var(--paper)" : "var(--sage)",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-serif)",
                          fontSize: 22,
                          fontWeight: 400,
                          lineHeight: 1.3,
                          color: "var(--ink)",
                          marginBottom: 12,
                        }}
                      >
                        {option.label}
                      </div>
                      <div
                        style={{
                          fontSize: 13,
                          lineHeight: 1.6,
                          color: "var(--ink-muted)",
                          maxWidth: 200,
                          margin: "0 auto",
                        }}
                      >
                        {option.sub}
                      </div>
                    </button>
                  );
                })}
              </div>

              {phase === "chosen" && (
                <div
                  style={{
                    marginTop: 56,
                    fontFamily: "var(--font-serif)",
                    fontStyle: "italic",
                    fontSize: 18,
                    color: "var(--ink-soft)",
                    animation: "refuge-fade-in 1200ms ease both",
                  }}
                >
                  Thank you. Let us begin.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom tagline */}
      <div
        style={{
          position: "absolute",
          bottom: 32,
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 2,
          fontSize: 10,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          color: "var(--ink-faint)",
        }}
      >
        a quiet place to come back to
      </div>
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
