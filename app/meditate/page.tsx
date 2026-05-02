"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const STATES = [
  { label: "Stressed", icon: "⚡" },
  { label: "Anxious", icon: "🌊" },
  { label: "Can't sleep", icon: "🌙" },
  { label: "Overwhelmed", icon: "🍂" },
  { label: "Sad", icon: "🌧" },
  { label: "Need focus", icon: "🕯" },
  { label: "Just stillness", icon: "🍃" },
];

const DURATIONS = [5, 10, 15, 20];

export default function MeditatePage() {
  const router = useRouter();
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [selectedDuration, setSelectedDuration] = useState<number | null>(null);

  const ready = selectedState !== null && selectedDuration !== null;

  function handleBegin() {
    if (!ready) return;
    router.push(`/session?state=${encodeURIComponent(selectedState!)}&duration=${selectedDuration}`);
  }

  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 py-16"
      style={{
        background:
          "radial-gradient(ellipse 90% 80% at 50% 0%, #2d1a08 0%, #1a0f05 50%, #0f0a04 100%)",
      }}
    >
      {/* Warm ceiling glow — the overhead lantern */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(200,120,30,0.18) 0%, transparent 70%)",
        }}
      />

      {/* Wood-grain floor texture suggestion */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none opacity-30"
        style={{
          background:
            "linear-gradient(to top, rgba(90,50,20,0.4) 0%, transparent 100%)",
        }}
      />

      {/* Candle flicker left */}
      <div className="absolute bottom-[10%] left-[8%] pointer-events-none flex flex-col items-center opacity-40">
        <div
          className="w-[6px] h-[6px] rounded-full animate-flicker"
          style={{
            background: "#f0c060",
            boxShadow: "0 0 12px 4px rgba(240,180,60,0.5)",
          }}
        />
        <div className="w-[4px] h-[20px] bg-[#3a2210] rounded-sm mt-0.5" />
      </div>

      {/* Candle flicker right */}
      <div className="absolute bottom-[10%] right-[8%] pointer-events-none flex flex-col items-center opacity-40">
        <div
          className="w-[6px] h-[6px] rounded-full animate-flicker"
          style={{
            background: "#f0c060",
            boxShadow: "0 0 12px 4px rgba(240,180,60,0.5)",
            animationDelay: "1.2s",
          }}
        />
        <div className="w-[4px] h-[20px] bg-[#3a2210] rounded-sm mt-0.5" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md flex flex-col items-center gap-10">

        {/* Nav */}
        <div className="self-stretch flex justify-between items-center">
          <Link
            href="/"
            className="text-[#8a6a45] text-xs tracking-widest uppercase hover:text-[#b08050] transition-colors"
          >
            ← the forest
          </Link>
          <Link
            href="/garden"
            className="text-[#5a4a30] text-[10px] tracking-widest uppercase hover:text-[#8a6a45] transition-colors"
          >
            garden →
          </Link>
        </div>

        {/* Heading */}
        <div className="text-center flex flex-col gap-2 animate-rise">
          <p className="text-[10px] tracking-[0.4em] uppercase text-[#7a5a35]">
            you have arrived
          </p>
          <h1 className="text-3xl font-light tracking-wide text-[#d4b882]">
            How are you feeling?
          </h1>
        </div>

        {/* State picker */}
        <div className="animate-rise-delay w-full flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-2.5">
            {STATES.map(({ label, icon }, i) => {
              const active = selectedState === label;
              const isLast = i === STATES.length - 1 && STATES.length % 2 === 1;
              return (
                <button
                  key={label}
                  onClick={() => setSelectedState(label)}
                  className={`
                    flex items-center justify-center gap-2.5 px-3 py-3.5 rounded-xl text-xs tracking-wide
                    border transition-all duration-300 font-light w-full min-w-0
                    ${isLast ? "col-span-2" : ""}
                    ${active
                      ? "border-[#b07840] bg-[#2a1808] text-[#e8c87a] shadow-[0_0_20px_rgba(180,110,40,0.2)]"
                      : "border-[#2a1c0e] bg-[#1a1008] text-[#9a7a50] hover:border-[#4a2e16] hover:text-[#c09060]"
                    }
                  `}
                >
                  <span className="text-sm shrink-0">{icon}</span>
                  <span className="leading-snug">{label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Duration picker */}
        <div className="animate-rise-delay-2 w-full flex flex-col gap-3">
          <p className="text-[10px] tracking-[0.35em] uppercase text-[#7a5a35] text-center">
            How long to rest?
          </p>
          <div className="flex gap-2.5 justify-center">
            {DURATIONS.map((min) => {
              const active = selectedDuration === min;
              return (
                <button
                  key={min}
                  onClick={() => setSelectedDuration(min)}
                  className={`
                    w-16 py-3 rounded-xl text-sm tracking-wider font-light
                    border transition-all duration-300
                    ${active
                      ? "border-[#b07840] bg-[#2a1808] text-[#e8c87a] shadow-[0_0_16px_rgba(180,110,40,0.18)]"
                      : "border-[#2a1c0e] bg-[#1a1008] text-[#9a7a50] hover:border-[#4a2e16] hover:text-[#c09060]"
                    }
                  `}
                >
                  {min}m
                </button>
              );
            })}
          </div>
        </div>

        {/* Begin button */}
        <div className="animate-rise-delay-2 w-full flex justify-center pb-4">
          <button
            onClick={handleBegin}
            disabled={!ready}
            className={`
              w-full max-w-[260px] py-4 rounded-full text-sm tracking-[0.3em] uppercase font-light
              border transition-all duration-500
              ${ready
                ? "border-[#c08840] text-[#e8c87a] hover:shadow-[0_0_30px_rgba(200,130,40,0.25)] hover:bg-[#1e1208] cursor-pointer"
                : "border-[#251a0d] text-[#4a3520] cursor-not-allowed"
              }
            `}
          >
            {ready ? "Begin" : "Choose to begin"}
          </button>
        </div>
      </div>
    </div>
  );
}
