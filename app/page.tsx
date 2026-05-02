import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#070e09]">

      {/* Deep forest backdrop — layered radial gradients */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 110%, #1a3a22 0%, transparent 70%), " +
            "radial-gradient(ellipse 120% 80% at 50% 100%, #0d1f12 0%, transparent 60%), " +
            "radial-gradient(ellipse 60% 40% at 50% 50%, #0f1a10 0%, #070e09 100%)",
        }}
      />

      {/* Tall tree silhouettes — left */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute bottom-0 left-0 w-[28%] h-[85%] opacity-70"
          style={{
            background:
              "linear-gradient(to top, #050c07 40%, transparent 100%)",
            clipPath:
              "polygon(0% 100%, 8% 60%, 5% 55%, 12% 30%, 9% 28%, 18% 10%, 22% 5%, 26% 10%, 22% 28%, 28% 30%, 24% 55%, 30% 60%, 28% 100%)",
          }}
        />
        <div
          className="absolute bottom-0 left-[12%] w-[22%] h-[70%] opacity-60"
          style={{
            background:
              "linear-gradient(to top, #050c07 40%, transparent 100%)",
            clipPath:
              "polygon(0% 100%, 10% 65%, 8% 60%, 16% 35%, 12% 30%, 22% 8%, 28% 3%, 32% 8%, 26% 30%, 34% 35%, 28% 60%, 32% 65%, 30% 100%)",
          }}
        />
      </div>

      {/* Tall tree silhouettes — right */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute bottom-0 right-0 w-[28%] h-[80%] opacity-70"
          style={{
            background:
              "linear-gradient(to top, #050c07 40%, transparent 100%)",
            clipPath:
              "polygon(72% 100%, 70% 60%, 76% 55%, 70% 28%, 78% 30%, 72% 5%, 78% 10%, 82% 28%, 78% 30%, 86% 55%, 80% 60%, 82% 100%, 100% 100%)",
          }}
        />
        <div
          className="absolute bottom-0 right-[10%] w-[22%] h-[65%] opacity-55"
          style={{
            background:
              "linear-gradient(to top, #050c07 40%, transparent 100%)",
            clipPath:
              "polygon(68% 100%, 66% 65%, 72% 60%, 66% 30%, 74% 35%, 68% 8%, 74% 3%, 78% 8%, 72% 30%, 82% 35%, 74% 60%, 80% 65%, 100% 100%)",
          }}
        />
      </div>

      {/* Ground mist */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none animate-mist"
        style={{
          background:
            "radial-gradient(ellipse 100% 100% at 50% 100%, rgba(180,210,185,0.08) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(140,185,150,0.06) 0%, transparent 100%)",
          animationDelay: "3s",
        }}
      />

      {/* Hut — central glowing structure */}
      <div className="absolute bottom-[12%] left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
        {/* Roof */}
        <div
          className="w-0 h-0 opacity-80"
          style={{
            borderLeft: "54px solid transparent",
            borderRight: "54px solid transparent",
            borderBottom: "36px solid #1c2a1e",
          }}
        />
        {/* Walls */}
        <div className="relative w-[84px] h-[56px] bg-[#161f17] flex items-center justify-center">
          {/* Window glow — the warm light inside */}
          <div
            className="w-[34px] h-[28px] rounded-sm animate-flicker"
            style={{
              background:
                "radial-gradient(ellipse at 50% 40%, #f0c060 0%, #d4822a 50%, #8b4a1a 100%)",
              boxShadow:
                "0 0 18px 6px rgba(220,140,40,0.35), 0 0 40px 14px rgba(200,110,20,0.15)",
            }}
          />
          {/* Door */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[18px] h-[24px] rounded-t-sm"
            style={{ background: "#0d1510" }}
          />
        </div>
        {/* Base / ground shadow */}
        <div
          className="w-[90px] h-[3px] rounded-full opacity-40"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, #2a4a30 0%, transparent 100%)",
          }}
        />
        {/* Ambient glow on ground */}
        <div
          className="absolute -bottom-4 w-[160px] h-[40px] pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(210,130,30,0.12) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Stars */}
      {[
        { top: "8%", left: "15%", size: 1.5, delay: "0s" },
        { top: "12%", left: "72%", size: 1, delay: "1s" },
        { top: "5%", left: "45%", size: 2, delay: "2s" },
        { top: "18%", left: "88%", size: 1, delay: "0.5s" },
        { top: "22%", left: "30%", size: 1.5, delay: "1.5s" },
        { top: "9%", left: "58%", size: 1, delay: "2.5s" },
        { top: "6%", left: "82%", size: 1.5, delay: "0.8s" },
        { top: "15%", left: "10%", size: 1, delay: "3s" },
      ].map((star, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-breathe"
          style={{
            top: star.top,
            left: star.left,
            width: `${star.size * 2}px`,
            height: `${star.size * 2}px`,
            background: "rgba(220,210,190,0.8)",
            animationDelay: star.delay,
            boxShadow: `0 0 ${star.size * 3}px rgba(220,210,190,0.4)`,
          }}
        />
      ))}

      {/* Text and CTA — centered above the hut */}
      <div className="relative z-10 flex flex-col items-center gap-6 text-center px-6 mb-[22vh]">
        <p className="animate-rise text-[11px] tracking-[0.35em] uppercase text-[#7a9e80] font-light">
          a guided meditation
        </p>
        <h1
          className="animate-rise-delay text-5xl sm:text-6xl font-light tracking-widest text-[#ddd5bb]"
          style={{ textShadow: "0 0 40px rgba(200,180,120,0.2)" }}
        >
          Refuge
        </h1>
        <p className="animate-rise-delay text-base text-[#6b8a70] font-light tracking-wide max-w-[240px] leading-relaxed">
          Step inside. Leave the noise behind.
        </p>

        <div className="animate-rise-delay-2 mt-4">
          <Link
            href="/meditate"
            className="group relative inline-flex items-center gap-3 px-8 py-3 rounded-full border border-[#3a5a3f] text-[#b5c9b8] text-sm tracking-widest uppercase font-light transition-all duration-500 hover:border-[#8aae8f] hover:text-[#d4e6d6] hover:shadow-[0_0_24px_rgba(100,160,100,0.15)]"
          >
            <span
              className="w-1.5 h-1.5 rounded-full bg-[#c8903a] animate-flicker"
              style={{ boxShadow: "0 0 6px rgba(200,140,50,0.6)" }}
            />
            Enter
          </Link>
        </div>

        {/* Garden link — subtle, beneath the main CTA */}
        <div className="animate-rise-delay-2 mt-2">
          <Link
            href="/garden"
            className="text-[11px] tracking-[0.3em] uppercase text-[#3a5a3f] font-light hover:text-[#6a9a70] transition-colors"
          >
            your garden →
          </Link>
        </div>
      </div>
    </div>
  );
}
