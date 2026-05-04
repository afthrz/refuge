"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { saveSession, playChime } from "@/app/lib/sessions";

const BREATH_DURATION = 4;

function SessionTimer() {
  const params = useSearchParams();
  const router = useRouter();

  const moodLabel = params.get("state") ?? "stillness";
  const durationMin = Number(params.get("duration") ?? 10);
  const totalSeconds = durationMin * 60;

  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [paused, setPaused] = useState(false);
  const [phase, setPhase] = useState<"in" | "out">("in");
  const [breathKey, setBreathKey] = useState(0);
  const [done, setDone] = useState(false);
  const [confirmEnd, setConfirmEnd] = useState(false);
  const savedRef = useRef(false);

  useEffect(() => {
    if (done && !savedRef.current) {
      savedRef.current = true;
      playChime();
      saveSession(moodLabel, durationMin);
    }
  }, [done, moodLabel, durationMin]);

  useEffect(() => {
    if (paused || done) return;
    if (secondsLeft <= 0) { setDone(true); return; }
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) { setDone(true); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [paused, done]);

  useEffect(() => {
    if (paused || done) return;
    const id = setInterval(() => {
      setPhase((p) => (p === "in" ? "out" : "in"));
      setBreathKey((k) => k + 1);
    }, BREATH_DURATION * 1000);
    return () => clearInterval(id);
  }, [paused, done]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeStr = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  const progress = 1 - secondsLeft / totalSeconds;
  const elapsedMin = Math.round((totalSeconds - secondsLeft) / 60);

  async function handleEndEarly() {
    if (elapsedMin >= 1) {
      await saveSession(moodLabel, elapsedMin);
    }
    router.push("/");
  }

  // --- Completion screen ---
  if (done) {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6"
        style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, #1a1005 0%, #080604 100%)" }}
      >
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(180,110,30,0.08) 0%, transparent 70%)" }}
        />
        <div className="relative z-10 flex flex-col items-center gap-8 text-center animate-fade-in">
          <div className="w-20 h-20 rounded-full border border-[#6a4a20] flex items-center justify-center"
            style={{ boxShadow: "0 0 30px rgba(180,110,30,0.15)" }}
          >
            <span className="text-3xl">🍃</span>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-[10px] tracking-[0.4em] uppercase text-[#7a5a35]">session complete</p>
            <h1 className="text-3xl font-light tracking-wide text-[#d4b882]">Well done.</h1>
            <p className="text-sm text-[#7a6040] font-light mt-1">
              {durationMin} minutes of rest for a {moodLabel.toLowerCase()} heart.
            </p>
          </div>
          <div className="flex flex-col gap-3 w-full max-w-[240px] mt-4">
            <button
              onClick={() => router.push("/meditate")}
              className="py-3.5 rounded-full border border-[#c08840] text-[#e8c87a] text-sm tracking-widest uppercase font-light hover:bg-[#1e1208] transition-all"
            >
              Rest again
            </button>
            <Link
              href="/garden"
              className="py-3.5 rounded-full border border-[#3a5a3f] text-[#7a9e7f] text-sm tracking-widest uppercase font-light hover:border-[#5a8a5f] hover:text-[#a0c8a4] transition-all text-center"
            >
              Visit your garden
            </Link>
            <Link
              href="/"
              className="py-3.5 rounded-full border border-[#2a1c0e] text-[#6a5030] text-sm tracking-widest uppercase font-light hover:border-[#4a2e16] hover:text-[#9a7040] transition-all text-center"
            >
              Return to forest
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --- Active session ---
  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "radial-gradient(ellipse 100% 80% at 50% 50%, #160d04 0%, #080604 100%)" }}
    >
      {/* Ambient center glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 50% 50% at 50% 50%, rgba(180,100,20,0.07) 0%, transparent 70%)",
        }}
      />

      {/* Progress arc */}
      <svg
        className="absolute pointer-events-none"
        width="320" height="320"
        style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
      >
        <circle cx="160" cy="160" r="140" fill="none" stroke="rgba(180,100,20,0.12)" strokeWidth="1" />
        <circle
          cx="160" cy="160" r="140" fill="none"
          stroke="rgba(200,130,40,0.4)" strokeWidth="1"
          strokeDasharray={`${2 * Math.PI * 140}`}
          strokeDashoffset={`${2 * Math.PI * 140 * (1 - progress)}`}
          strokeLinecap="round"
          style={{ transform: "rotate(-90deg)", transformOrigin: "160px 160px", transition: "stroke-dashoffset 1s linear" }}
        />
      </svg>

      {/* Breathing circle */}
      <div className="relative flex items-center justify-center">
        <div
          className="absolute rounded-full animate-pulse-ring"
          style={{
            width: 220, height: 220,
            background: "rgba(180,100,20,0.08)",
            animationDuration: `${BREATH_DURATION * 2}s`,
            animationPlayState: paused ? "paused" : "running",
          }}
        />
        <div
          key={breathKey}
          className={phase === "in" ? "animate-inhale" : "animate-exhale"}
          style={{
            width: 180, height: 180,
            borderRadius: "50%",
            background: "radial-gradient(ellipse at 40% 35%, rgba(230,160,50,0.35) 0%, rgba(160,80,20,0.25) 50%, rgba(80,30,8,0.3) 100%)",
            boxShadow: "0 0 40px rgba(180,100,20,0.2), inset 0 0 30px rgba(230,160,50,0.1)",
            border: "1px solid rgba(200,130,40,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            animationPlayState: paused ? "paused" : "running",
          }}
        >
          <span
            className="text-3xl font-light tracking-widest"
            style={{ color: "#d4b07a", textShadow: "0 0 20px rgba(200,140,50,0.4)" }}
          >
            {timeStr}
          </span>
        </div>
      </div>

      {/* Breathing prompt */}
      <div className="mt-12 flex flex-col items-center gap-2">
        <p
          key={`label-${breathKey}`}
          className="animate-fade-in text-sm tracking-[0.3em] uppercase font-light"
          style={{ color: phase === "in" ? "#c8a060" : "#8a7050" }}
        >
          {paused ? "paused" : phase === "in" ? "breathe in" : "breathe out"}
        </p>
        <p className="text-[11px] tracking-widest uppercase text-[#4a3520] font-light mt-1">
          {moodLabel}
        </p>
      </div>

      {/* Controls */}
      <div className="absolute bottom-12 flex items-center gap-6">
        <button
          onClick={() => setPaused((p) => !p)}
          className={`w-14 h-14 rounded-full border flex items-center justify-center transition-all ${
            paused
              ? "border-[#c08840] text-[#e8c87a] shadow-[0_0_20px_rgba(180,110,40,0.2)]"
              : "border-[#2a1c0e] text-[#8a6a40] hover:border-[#5a3a18] hover:text-[#c09050]"
          }`}
        >
          {paused ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M3 2l11 6-11 6V2z" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <rect x="3" y="2" width="4" height="12" rx="1" />
              <rect x="9" y="2" width="4" height="12" rx="1" />
            </svg>
          )}
        </button>
        <button
          onClick={() => setConfirmEnd(true)}
          className="text-[10px] tracking-[0.35em] uppercase text-[#3a2810] hover:text-[#7a5030] transition-colors font-light"
        >
          end session
        </button>
      </div>

      {/* Paused overlay */}
      {paused && !confirmEnd && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 animate-fade-in">
          <div className="flex flex-col items-center gap-5">
            <p className="text-xs tracking-[0.4em] uppercase text-[#8a7050]">session paused</p>
            <button
              onClick={() => setPaused(false)}
              className="px-8 py-3 rounded-full border border-[#c08840] text-[#e8c87a] text-sm tracking-widest uppercase font-light hover:bg-[#1e1208] transition-all"
            >
              Resume
            </button>
          </div>
        </div>
      )}

      {/* End session confirmation */}
      {confirmEnd && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/50 animate-fade-in">
          <div className="flex flex-col items-center gap-5 px-8 text-center">
            <p className="text-sm text-[#9a7a50] font-light tracking-wide leading-relaxed max-w-[250px]">
              {elapsedMin >= 1
                ? `End session? Your ${elapsedMin} minute${elapsedMin > 1 ? "s" : ""} of rest will still be saved.`
                : "End session? This one won't be saved — you haven't rested a full minute yet."}
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleEndEarly}
                className="px-6 py-2.5 rounded-full border border-[#5a3020] text-[#b07040] text-xs tracking-widest uppercase font-light hover:bg-[#1a0e06] transition-all"
              >
                End
              </button>
              <button
                onClick={() => setConfirmEnd(false)}
                className="px-6 py-2.5 rounded-full border border-[#c08840] text-[#e8c87a] text-xs tracking-widest uppercase font-light hover:bg-[#1e1208] transition-all"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SessionPage() {
  return (
    <Suspense>
      <SessionTimer />
    </Suspense>
  );
}
