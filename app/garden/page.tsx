"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AccountNav from "@/app/components/AccountNav";
import { getSessions, getTotalMinutes, getCurrentStreak, type Session } from "@/app/lib/sessions";

const MOOD_PALETTE: Record<string, { petal: string; glow: string; center: string }> = {
  Stressed:       { petal: "#e8a0b0", glow: "rgba(232,160,176,0.3)", center: "#f0d0a0" },
  Anxious:        { petal: "#7eb89a", glow: "rgba(126,184,154,0.3)", center: "#c0e8b0" },
  "Can't sleep":  { petal: "#b0bcd8", glow: "rgba(176,188,216,0.35)", center: "#e0e8f8" },
  Overwhelmed:    { petal: "#d4a050", glow: "rgba(212,160,80,0.3)", center: "#f0d888" },
  Sad:            { petal: "#8898c8", glow: "rgba(136,152,200,0.3)", center: "#b8c0e0" },
  "Need focus":   { petal: "#a0c878", glow: "rgba(160,200,120,0.3)", center: "#d8f0a0" },
  "Just stillness": { petal: "#d0b0d0", glow: "rgba(208,176,208,0.3)", center: "#f0e0f0" },
};

const DEFAULT_PALETTE = { petal: "#c0b098", glow: "rgba(192,176,152,0.3)", center: "#e0d8c8" };

// Pre-defined garden plot positions (x%, y% within the garden bed)
// Arranged so closer rows (higher y) are "in front" and further rows are "behind"
const PLOTS = [
  { x: 18, y: 78 }, { x: 45, y: 82 }, { x: 72, y: 76 }, { x: 88, y: 80 },
  { x: 8,  y: 66 }, { x: 32, y: 70 }, { x: 58, y: 64 }, { x: 82, y: 68 },
  { x: 22, y: 54 }, { x: 48, y: 58 }, { x: 70, y: 52 }, { x: 92, y: 56 },
  { x: 12, y: 44 }, { x: 38, y: 48 }, { x: 62, y: 42 }, { x: 85, y: 46 },
  { x: 26, y: 36 }, { x: 52, y: 34 }, { x: 76, y: 38 }, { x: 5,  y: 40 },
  { x: 42, y: 28 }, { x: 66, y: 30 }, { x: 15, y: 32 }, { x: 90, y: 33 },
];

function Plant({
  session,
  plot,
  index,
  selected,
  onSelect,
}: {
  session: Session;
  plot: { x: number; y: number };
  index: number;
  selected: boolean;
  onSelect: (e: React.MouseEvent) => void;
}) {
  const palette = MOOD_PALETTE[session.mood] ?? DEFAULT_PALETTE;
  const scale = 0.6 + (session.duration / 20) * 0.6;
  const petalCount = session.duration >= 15 ? 6 : session.duration >= 10 ? 5 : 4;
  const petalR = 6;
  const stemH = 18 + session.duration * 1.8;

  const date = new Date(session.completedAt);
  const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <div
      className="absolute cursor-pointer"
      onClick={(e) => onSelect(e)}
      style={{
        left: `${plot.x}%`,
        bottom: `${100 - plot.y}%`,
        transform: `translate(-50%, 100%) scale(${scale})`,
        zIndex: selected ? 200 : Math.round(plot.y),
        animation: `sway ${2.5 + (index % 3) * 0.5}s ease-in-out infinite`,
        animationDelay: `${index * 0.2}s`,
        transformOrigin: "bottom center",
      }}
    >
      {/* Tooltip */}
      {selected && (
        <div
          className="absolute -top-14 left-1/2 -translate-x-1/2 animate-fade-in whitespace-nowrap px-3 py-1.5 rounded-lg text-center"
          style={{
            background: "rgba(20,14,6,0.92)",
            border: "1px solid rgba(200,130,40,0.25)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
            zIndex: 201,
          }}
        >
          <p className="text-[10px] tracking-wider text-[#c8a060] font-light">
            {session.mood} · {session.duration}m
          </p>
          <p className="text-[9px] tracking-wider text-[#6a5030] font-light mt-0.5">
            {dateStr}
          </p>
        </div>
      )}
      <svg width="50" height={stemH + 30} viewBox={`0 0 50 ${stemH + 30}`} overflow="visible">
        <line x1="25" y1={stemH + 28} x2="25" y2="18" stroke="#3a5a28" strokeWidth="2" strokeLinecap="round" />
        <ellipse cx="20" cy={stemH * 0.6 + 10} rx="5" ry="2.5" fill="#4a7038" transform={`rotate(-35, 20, ${stemH * 0.6 + 10})`} />
        <ellipse cx="30" cy={stemH * 0.4 + 10} rx="5" ry="2.5" fill="#4a7038" transform={`rotate(30, 30, ${stemH * 0.4 + 10})`} />
        <circle cx="25" cy="14" r="14" fill={palette.glow} />
        {Array.from({ length: petalCount }).map((_, i) => {
          const angle = (360 / petalCount) * i - 90;
          const rad = (angle * Math.PI) / 180;
          const px = 25 + Math.cos(rad) * (petalR + 1);
          const py = 14 + Math.sin(rad) * (petalR + 1);
          return <circle key={i} cx={px} cy={py} r={petalR} fill={palette.petal} opacity={0.85} />;
        })}
        <circle cx="25" cy="14" r="4" fill={palette.center} />
      </svg>
    </div>
  );
}

function Firefly({ delay, x, y }: { delay: number; x: number; y: number }) {
  return (
    <div
      className="absolute w-1.5 h-1.5 rounded-full animate-breathe pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        background: "rgba(200,210,140,0.7)",
        boxShadow: "0 0 6px rgba(200,210,140,0.5)",
        animationDelay: `${delay}s`,
        animationDuration: `${3 + delay}s`,
      }}
    />
  );
}

export default function GardenPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [selectedPlant, setSelectedPlant] = useState<string | null>(null);

  useEffect(() => {
    getSessions().then((data) => {
      setSessions(data);
      setLoaded(true);
    });
  }, []);

  const total = sessions.length;
  const totalMin = getTotalMinutes(sessions);
  const hours = Math.floor(totalMin / 60);
  const mins = totalMin % 60;
  const streak = getCurrentStreak(sessions);

  return (
    <div
      className="relative min-h-screen flex flex-col overflow-hidden"
      style={{ background: "linear-gradient(to bottom, #060d08 0%, #0a1a0d 40%, #142010 70%, #1a2a14 100%)" }}
    >
      {/* Moon */}
      <div
        className="absolute top-[6%] right-[12%] w-10 h-10 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle at 35% 35%, #f0e8c8 0%, #d0c898 60%, transparent 100%)",
          boxShadow: "0 0 30px rgba(220,210,170,0.2), 0 0 60px rgba(200,190,140,0.1)",
        }}
      />

      {/* Stars */}
      {[
        { x: 10, y: 5, s: 1.5, d: "0s" }, { x: 28, y: 8, s: 1, d: "1.2s" },
        { x: 55, y: 4, s: 2, d: "0.5s" }, { x: 78, y: 10, s: 1, d: "2s" },
        { x: 42, y: 12, s: 1.5, d: "1.5s" }, { x: 65, y: 7, s: 1, d: "0.8s" },
      ].map((star, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-breathe pointer-events-none"
          style={{
            left: `${star.x}%`, top: `${star.y}%`,
            width: star.s * 2, height: star.s * 2,
            background: "rgba(200,210,180,0.7)",
            animationDelay: star.d,
            boxShadow: `0 0 ${star.s * 3}px rgba(200,210,180,0.4)`,
          }}
        />
      ))}

      {/* Fireflies */}
      {loaded && total > 0 && (
        <>
          <Firefly x={15} y={35} delay={0} />
          <Firefly x={70} y={28} delay={1.5} />
          <Firefly x={45} y={40} delay={2.8} />
          <Firefly x={82} y={45} delay={0.6} />
          {total >= 3 && <Firefly x={30} y={50} delay={1.8} />}
          {total >= 5 && <Firefly x={60} y={55} delay={3.2} />}
        </>
      )}

      {/* Header */}
      <div className="relative z-10 px-6 pt-12 pb-4 flex items-start justify-between">
        <Link
          href="/"
          className="text-[#6a9a6f] text-xs tracking-widest uppercase hover:text-[#8ac090] transition-colors"
        >
          ← the forest
        </Link>
        <AccountNav />
      </div>

      {/* Title + stats */}
      <div className="relative z-10 px-6 pb-6 flex flex-col items-center gap-2 animate-rise">
        <p className="text-[10px] tracking-[0.4em] uppercase text-[#4a7a50]">
          your backyard
        </p>
        <h1 className="text-3xl font-light tracking-wide text-[#b0d4a8]">
          The Garden
        </h1>
        {loaded && total > 0 && (
          <div className="flex flex-col items-center gap-1.5 mt-1">
            <p className="text-xs text-[#5a8a58] font-light tracking-wider">
              {total} {total === 1 ? "session" : "sessions"} · {hours > 0 ? `${hours}h ` : ""}{mins}m of rest
            </p>
            {streak > 0 && (
              <p className="text-[10px] text-[#8ab060] tracking-widest font-light">
                🔥 {streak} day{streak > 1 ? "s" : ""} streak
              </p>
            )}
          </div>
        )}
      </div>

      {/* Garden bed — this is the main visual area */}
      <div className="relative z-10 flex-1 min-h-[400px]" onClick={() => setSelectedPlant(null)}>
        {/* Earth / soil gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, transparent 0%, rgba(40,28,12,0.3) 30%, rgba(50,32,14,0.5) 60%, rgba(45,30,15,0.7) 100%)",
          }}
        />

        {/* Fence */}
        <div className="absolute left-0 right-0 pointer-events-none" style={{ top: "18%" }}>
          {/* Horizontal rail */}
          <div className="w-full h-[3px] bg-[#3a2810] opacity-60" />
          <div className="w-full h-[3px] bg-[#3a2810] opacity-40 mt-3" />
          {/* Fence posts */}
          {[5, 20, 35, 50, 65, 80, 95].map((x) => (
            <div
              key={x}
              className="absolute w-[4px] h-8 bg-[#3a2810] opacity-50 rounded-t-sm"
              style={{ left: `${x}%`, top: "-10px" }}
            />
          ))}
        </div>

        {/* Plants */}
        {loaded && sessions.map((session, i) => {
          const plot = PLOTS[i % PLOTS.length];
          return (
            <Plant
              key={session.id}
              session={session}
              plot={plot}
              index={i}
              selected={selectedPlant === session.id}
              onSelect={(e) => { e.stopPropagation(); setSelectedPlant(selectedPlant === session.id ? null : session.id); }}
            />
          );
        })}

        {/* Empty garden message */}
        {loaded && total === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center px-8">
            <div className="w-16 h-16 rounded-full border border-[#2a4a2e] flex items-center justify-center opacity-60">
              <span className="text-2xl">🌱</span>
            </div>
            <p className="text-sm text-[#4a7a4e] font-light tracking-wide leading-relaxed max-w-[220px]">
              Your garden is waiting. Complete a meditation to plant your first flower.
            </p>
            <Link
              href="/meditate"
              className="mt-2 px-6 py-2.5 rounded-full border border-[#3a5a3f] text-[#7a9e7f] text-xs tracking-widest uppercase font-light hover:border-[#5a8a5f] hover:text-[#a0c8a4] transition-all"
            >
              Begin
            </Link>
          </div>
        )}
      </div>

      {/* Bottom bar — navigate to meditate */}
      {loaded && total > 0 && (
        <div className="relative z-10 px-6 py-8 flex flex-col items-center gap-4 animate-rise-delay">
          {/* Mood legend */}
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1.5">
            {Object.entries(MOOD_PALETTE).map(([mood, { petal }]) => {
              const count = sessions.filter(s => s.mood === mood).length;
              if (count === 0) return null;
              return (
                <div key={mood} className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full" style={{ background: petal }} />
                  <span className="text-[10px] text-[#5a8a58] tracking-wide font-light">
                    {mood}
                  </span>
                </div>
              );
            })}
          </div>
          <Link
            href="/meditate"
            className="px-8 py-3 rounded-full border border-[#3a5a3f] text-[#7a9e7f] text-sm tracking-widest uppercase font-light hover:border-[#5a8a5f] hover:text-[#a0c8a4] transition-all"
          >
            Plant another
          </Link>
        </div>
      )}
    </div>
  );
}
