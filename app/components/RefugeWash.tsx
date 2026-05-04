type Variant = "forest" | "dusk" | "dawn";

const BLOOMS: Record<Variant, { c: string; x: string; y: string; s: string; anim: string }[]> = {
  forest: [
    { c: "#8a9b7a", x: "15%", y: "20%", s: "55%", anim: "refuge-drift-0 24s ease-in-out infinite" },
    { c: "#d8c9ad", x: "85%", y: "70%", s: "50%", anim: "refuge-drift-1 30s ease-in-out infinite" },
    { c: "#a87858", x: "50%", y: "110%", s: "60%", anim: "refuge-drift-2 36s ease-in-out infinite" },
  ],
  dusk: [
    { c: "#a87858", x: "20%", y: "85%", s: "60%", anim: "refuge-drift-0 24s ease-in-out infinite" },
    { c: "#8a9b7a", x: "80%", y: "15%", s: "50%", anim: "refuge-drift-1 30s ease-in-out infinite" },
    { c: "#6b5544", x: "50%", y: "50%", s: "70%", anim: "refuge-drift-2 36s ease-in-out infinite" },
  ],
  dawn: [
    { c: "#e8c39a", x: "50%", y: "80%", s: "70%", anim: "refuge-drift-0 24s ease-in-out infinite" },
    { c: "#d8c9ad", x: "85%", y: "20%", s: "55%", anim: "refuge-drift-1 30s ease-in-out infinite" },
    { c: "#8a9b7a", x: "15%", y: "40%", s: "50%", anim: "refuge-drift-2 36s ease-in-out infinite" },
  ],
};

export default function RefugeWash({
  variant = "forest",
  opacity = 0.55,
}: {
  variant?: Variant;
  opacity?: number;
}) {
  const blooms = BLOOMS[variant];

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 0,
      }}
    >
      {blooms.map((b, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: b.s,
            height: b.s,
            left: b.x,
            top: b.y,
            transform: "translate(-50%, -50%)",
            background: `radial-gradient(circle, ${b.c} 0%, transparent 65%)`,
            opacity,
            filter: "blur(40px)",
            animation: b.anim,
            mixBlendMode: "multiply",
          }}
        />
      ))}
      {/* Paper grain */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/><feColorMatrix values='0 0 0 0 0.18 0 0 0 0 0.16 0 0 0 0 0.13 0 0 0 0.08 0'/></filter><rect width='240' height='240' filter='url(%23n)' opacity='0.6'/></svg>")`,
          opacity: 0.7,
          mixBlendMode: "multiply",
        }}
      />
    </div>
  );
}
