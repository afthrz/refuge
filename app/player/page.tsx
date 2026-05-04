"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getCourse, getEpisodeUrl } from "@/app/lib/courses";
import { saveSession } from "@/app/lib/sessions";

type Phase = "player" | "reflect" | "closed";

function PlayerInner() {
  const params = useSearchParams();
  const router = useRouter();

  const courseId = params.get("course") ?? "slowing-down";
  const dayNum = Number(params.get("day") ?? 1);
  const dayTitle = params.get("title") ?? "Arriving";
  const course = getCourse(courseId);

  // Audio URL — undefined means no track exists yet (falls back to visual timer)
  const audioUrl = getEpisodeUrl(course, dayNum);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Duration: set from audio metadata if available, otherwise a formula fallback
  const fallbackDurationMin = 10 + (dayNum % 5);
  const [totalSeconds, setTotalSeconds] = useState(fallbackDurationMin * 60);
  const durationMin = Math.round(totalSeconds / 60);

  const [elapsed, setElapsed] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [phase, setPhase] = useState<Phase>("player");
  const [reflection, setReflection] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const savedRef = useRef(false);

  // Auto-start after fade-in
  useEffect(() => {
    const t = setTimeout(() => setPlaying(true), 1400);
    return () => clearTimeout(t);
  }, []);

  // Audio setup — runs once per audioUrl
  useEffect(() => {
    if (!audioUrl) return;

    const audio = new Audio(audioUrl);
    audioRef.current = audio;

    const onMeta = () => {
      if (audio.duration && isFinite(audio.duration))
        setTotalSeconds(Math.round(audio.duration));
    };
    const onTime = () => setElapsed(Math.floor(audio.currentTime));
    const onEnd = () => setTimeout(() => setPhase("reflect"), 800);

    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnd);

    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnd);
      audioRef.current = null;
    };
  }, [audioUrl]);

  // Sync play/pause state to the audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing && phase === "player") audio.play().catch(() => {});
    else audio.pause();
  }, [playing, phase]);

  // Fallback visual timer — only runs when there is no audio track
  useEffect(() => {
    if (audioUrl) return; // audio path handles timing
    if (!playing || phase !== "player") {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 1;
        if (next >= totalSeconds) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setTimeout(() => setPhase("reflect"), 800);
          return totalSeconds;
        }
        return next;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing, phase, totalSeconds, audioUrl]);

  // Save session and play chime when meditation ends
  useEffect(() => {
    if (phase === "reflect" && !savedRef.current) {
      savedRef.current = true;
      saveSession(course?.title ?? courseId, durationMin);
      playChime();
    }
  }, [phase, course, courseId, durationMin]);

  const progress = totalSeconds > 0 ? elapsed / totalSeconds : 0;
  const remaining = totalSeconds - elapsed;

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
  };

  // Sunrise → dusk gradient shifts as meditation progresses
  const sunriseBg = `
    radial-gradient(ellipse at 50% ${85 - progress * 35}%, #e8c39a 0%, transparent 55%),
    radial-gradient(ellipse at 30% ${70 - progress * 20}%, #c9a487 0%, transparent 60%),
    radial-gradient(ellipse at 70% ${30 + progress * 40}%, #8a7560 0%, transparent 65%),
    linear-gradient(180deg, #3d352c 0%, #6b5544 100%)
  `;

  const goBack = () => router.push(`/course/${courseId}`);

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        background: sunriseBg,
        fontFamily: "var(--font-sans)",
        color: "#f3ede2",
        overflow: "hidden",
      }}
    >
      {/* Drifting light bloom */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(circle at 50% 50%, #e8c39a 0%, transparent 50%)",
          opacity: 0.4,
          animation: "refuge-sunrise-shift 30s ease-in-out infinite",
          backgroundSize: "200% 200%",
          mixBlendMode: "screen",
        }}
      />

      {/* Grain */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/><feColorMatrix values='0 0 0 0 0.1 0 0 0 0 0.1 0 0 0 0 0.1 0 0 0 0.5 0'/></filter><rect width='240' height='240' filter='url(%23n)' opacity='0.5'/></svg>")`,
          opacity: 0.5,
          mixBlendMode: "overlay",
        }}
      />

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
        <button
          onClick={goBack}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "#f3ede2",
            fontFamily: "var(--font-sans)",
            fontSize: 12,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            opacity: 0.7,
          }}
        >
          ← Leave
        </button>
        <div
          style={{
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontSize: 18,
            opacity: 0.7,
          }}
        >
          {course?.title ?? courseId}
        </div>
      </div>

      {phase === "player" && (
        <PlayerStage
          dayNum={dayNum}
          dayTitle={dayTitle}
          teacher={course?.teacher ?? ""}
          elapsed={elapsed}
          remaining={remaining}
          totalSeconds={totalSeconds}
          progress={progress}
          playing={playing}
          onTogglePlay={() => setPlaying((p) => !p)}
          fmt={fmt}
        />
      )}

      {phase === "reflect" && (
        <ReflectionStage
          chosen={reflection}
          onChoose={(r) => {
            setReflection(r);
            setTimeout(() => setPhase("closed"), 1600);
          }}
        />
      )}

      {phase === "closed" && (
        <ClosedStage durationMin={durationMin} onFinish={goBack} />
      )}
    </div>
  );
}

function PlayerStage({
  dayNum,
  dayTitle,
  teacher,
  elapsed,
  remaining,
  totalSeconds,
  progress,
  playing,
  onTogglePlay,
  fmt,
}: {
  dayNum: number;
  dayTitle: string;
  teacher: string;
  elapsed: number;
  remaining: number;
  totalSeconds: number;
  progress: number;
  playing: boolean;
  onTogglePlay: () => void;
  fmt: (s: number) => string;
}) {
  return (
    <div
      className="refuge-fade-in-slow"
      style={{
        position: "relative",
        zIndex: 2,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "120px 48px 80px",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 11,
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          opacity: 0.7,
          marginBottom: 24,
        }}
      >
        Day {String(dayNum).padStart(2, "0")}
      </div>

      <h1
        style={{
          fontFamily: "var(--font-serif)",
          fontSize: "clamp(40px, 5.5vw, 64px)",
          fontWeight: 400,
          margin: 0,
          textAlign: "center",
          maxWidth: 720,
          letterSpacing: "-0.01em",
          lineHeight: 1.1,
        }}
      >
        {dayTitle}
      </h1>

      {teacher && (
        <div
          style={{
            marginTop: 24,
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            fontSize: 18,
            opacity: 0.7,
          }}
        >
          {teacher}
        </div>
      )}

      {/* Breathing orb — also the play/pause button */}
      <div style={{ marginTop: 80, position: "relative" }}>
        {playing && (
          <>
            <div
              style={{
                position: "absolute",
                inset: -20,
                borderRadius: "50%",
                border: "1px solid rgba(243, 237, 226, 0.3)",
                animation: "refuge-pulse-ring 4s ease-out infinite",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: -20,
                borderRadius: "50%",
                border: "1px solid rgba(243, 237, 226, 0.2)",
                animation: "refuge-pulse-ring 4s ease-out infinite",
                animationDelay: "2s",
              }}
            />
          </>
        )}
        <button
          onClick={onTogglePlay}
          style={{
            width: 96,
            height: 96,
            borderRadius: "50%",
            background: "rgba(243, 237, 226, 0.12)",
            border: "1px solid rgba(243, 237, 226, 0.5)",
            backdropFilter: "blur(12px)",
            cursor: "pointer",
            color: "#f3ede2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "background 600ms ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(243, 237, 226, 0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(243, 237, 226, 0.12)";
          }}
        >
          {playing ? (
            <svg width="22" height="22" viewBox="0 0 22 22">
              <rect x="6" y="4" width="3" height="14" fill="currentColor" />
              <rect x="13" y="4" width="3" height="14" fill="currentColor" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 22 22">
              <path d="M7 4 L17 11 L7 18 Z" fill="currentColor" />
            </svg>
          )}
        </button>
      </div>

      {/* Progress hairline */}
      <div
        style={{
          marginTop: 80,
          width: "100%",
          maxWidth: 480,
          display: "flex",
          flexDirection: "column",
          gap: 14,
        }}
      >
        <div
          style={{
            height: 1,
            width: "100%",
            background: "rgba(243, 237, 226, 0.2)",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              height: "100%",
              width: `${progress * 100}%`,
              background: "rgba(243, 237, 226, 0.7)",
              transition: "width 1000ms linear",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: -3,
              left: `${progress * 100}%`,
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#f3ede2",
              transform: "translateX(-50%)",
              transition: "left 1000ms linear",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 11,
            opacity: 0.7,
            fontFeatureSettings: '"tnum"',
            letterSpacing: "0.08em",
          }}
        >
          <span>{fmt(elapsed)}</span>
          <span>{fmt(remaining)} remaining</span>
        </div>
      </div>

      <div
        style={{
          marginTop: 48,
          fontFamily: "var(--font-serif)",
          fontStyle: "italic",
          fontSize: 13,
          opacity: 0.5,
          textAlign: "center",
          maxWidth: 360,
          lineHeight: 1.7,
        }}
      >
        There is nothing to do but listen. The session will end on its own.
      </div>
    </div>
  );
}

function ReflectionStage({
  chosen,
  onChoose,
}: {
  chosen: string | null;
  onChoose: (r: string) => void;
}) {
  const OPTIONS = [
    { id: "lighter", label: "lighter" },
    { id: "same", label: "the same" },
    { id: "heavier", label: "heavier" },
  ];

  return (
    <div
      className="refuge-fade-in"
      style={{
        position: "relative",
        zIndex: 2,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "120px 48px 80px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-serif)",
          fontStyle: "italic",
          fontSize: "clamp(36px, 4.6vw, 52px)",
          fontWeight: 400,
          margin: 0,
          letterSpacing: "-0.01em",
          lineHeight: 1.2,
        }}
      >
        Welcome back.
      </div>
      <div
        style={{
          marginTop: 24,
          fontFamily: "var(--font-serif)",
          fontSize: 22,
          opacity: 0.85,
        }}
      >
        How do you feel?
      </div>

      <div
        style={{
          marginTop: 64,
          display: "flex",
          gap: 8,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {OPTIONS.map((opt) => {
          const isChosen = chosen === opt.id;
          const isFaded = chosen !== null && !isChosen;
          return (
            <button
              key={opt.id}
              onClick={() => !chosen && onChoose(opt.id)}
              disabled={chosen !== null}
              style={{
                padding: "20px 40px",
                background: isChosen ? "rgba(243, 237, 226, 0.2)" : "transparent",
                border: "1px solid rgba(243, 237, 226, 0.35)",
                color: "#f3ede2",
                fontFamily: "var(--font-serif)",
                fontSize: 22,
                fontStyle: "italic",
                cursor: chosen !== null ? "default" : "pointer",
                opacity: isFaded ? 0.25 : 1,
                transition: "all 800ms ease",
                borderRadius: 2,
                minWidth: 160,
              }}
              onMouseEnter={(e) => {
                if (!chosen) e.currentTarget.style.background = "rgba(243, 237, 226, 0.1)";
              }}
              onMouseLeave={(e) => {
                if (!chosen) e.currentTarget.style.background = "transparent";
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      <div
        style={{
          marginTop: 64,
          fontSize: 11,
          letterSpacing: "0.24em",
          textTransform: "uppercase",
          opacity: 0.5,
        }}
      >
        Your answer is anonymous
      </div>
    </div>
  );
}

function ClosedStage({
  durationMin,
  onFinish,
}: {
  durationMin: number;
  onFinish: () => void;
}) {
  return (
    <div
      className="refuge-fade-in-slow"
      style={{
        position: "relative",
        zIndex: 2,
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "120px 48px 80px",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-serif)",
          fontStyle: "italic",
          fontSize: "clamp(32px, 4vw, 44px)",
          fontWeight: 400,
          margin: 0,
          maxWidth: 600,
          lineHeight: 1.4,
        }}
      >
        Thank you for sitting with us.
      </div>
      <div
        style={{
          marginTop: 32,
          maxWidth: 480,
          fontSize: 14,
          lineHeight: 1.8,
          opacity: 0.75,
        }}
      >
        Tomorrow there will be another day waiting, when you are ready.
        There is no streak to maintain. There is no one keeping score.
      </div>
      <div
        style={{
          marginTop: 12,
          fontSize: 12,
          opacity: 0.5,
          fontFamily: "var(--font-serif)",
          fontStyle: "italic",
        }}
      >
        {durationMin} minutes of rest, saved to your garden.
      </div>
      <button
        onClick={onFinish}
        style={{
          marginTop: 56,
          padding: "14px 36px",
          background: "transparent",
          color: "#f3ede2",
          border: "1px solid rgba(243, 237, 226, 0.5)",
          fontFamily: "var(--font-sans)",
          fontSize: 12,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          cursor: "pointer",
          borderRadius: 2,
          transition: "all 600ms ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(243, 237, 226, 0.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
        }}
      >
        Return to the course
      </button>
    </div>
  );
}

function playChime() {
  try {
    const ctx = new AudioContext();
    const now = ctx.currentTime;
    [528, 639, 741].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, now + i * 0.6);
      gain.gain.linearRampToValueAtTime(0.12, now + i * 0.6 + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.6 + 2.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.6);
      osc.stop(now + i * 0.6 + 2.5);
    });
  } catch {}
}

export default function PlayerPage() {
  return (
    <Suspense>
      <PlayerInner />
    </Suspense>
  );
}
