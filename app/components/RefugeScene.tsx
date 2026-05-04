import type { SceneKind } from "@/app/lib/courses";

type Shape =
  | { type: "beam"; x: number; w: number; opacity: number }
  | { type: "trunk"; x: number; color: string }
  | { type: "hill"; y: number; color: string; opacity: number }
  | { type: "horizon"; y: number; color: string; opacity: number }
  | { type: "ripple"; y: number }
  | { type: "mist"; y: number; opacity: number }
  | { type: "moon"; x: number; y: number };

type SceneDef = { bg: string; shapes: Shape[] };

const SCENES: Record<SceneKind, SceneDef> = {
  slowing: {
    bg: "linear-gradient(180deg, #e8c39a 0%, #c9a487 45%, #6b5544 100%)",
    shapes: [
      { type: "beam", x: 25, w: 8, opacity: 0.35 },
      { type: "beam", x: 55, w: 5, opacity: 0.25 },
      { type: "beam", x: 75, w: 10, opacity: 0.30 },
      { type: "trunk", x: 18, color: "#3d352c" },
      { type: "trunk", x: 48, color: "#3d352c" },
      { type: "trunk", x: 82, color: "#3d352c" },
    ],
  },
  "letting-go": {
    bg: "linear-gradient(180deg, #e8c39a 0%, #d8c9ad 55%, #8a9b7a 100%)",
    shapes: [
      { type: "hill", y: 60, color: "#6b7c5e", opacity: 0.5 },
      { type: "hill", y: 70, color: "#6b5544", opacity: 0.6 },
      { type: "hill", y: 82, color: "#3d352c", opacity: 0.85 },
    ],
  },
  returning: {
    bg: "linear-gradient(180deg, #d8c9ad 0%, #8a9b7a 50%, #6b5544 100%)",
    shapes: [
      { type: "horizon", y: 50, color: "#3d352c", opacity: 0.7 },
      { type: "ripple", y: 65 },
      { type: "ripple", y: 75 },
      { type: "ripple", y: 85 },
    ],
  },
  "quiet-mind": {
    bg: "linear-gradient(180deg, #f3ede2 0%, #d8c9ad 60%, #6b7c5e 100%)",
    shapes: [
      { type: "mist", y: 35, opacity: 0.6 },
      { type: "mist", y: 55, opacity: 0.4 },
      { type: "mist", y: 75, opacity: 0.7 },
    ],
  },
  sleep: {
    bg: "linear-gradient(180deg, #6b5544 0%, #3d352c 55%, #1a1714 100%)",
    shapes: [
      { type: "moon", x: 78, y: 25 },
      { type: "mist", y: 70, opacity: 0.3 },
    ],
  },
  forest: {
    bg: "linear-gradient(180deg, #8a9b7a 0%, #6b5544 100%)",
    shapes: [],
  },
};

export default function RefugeScene({ kind = "forest" }: { kind?: SceneKind }) {
  const scene = SCENES[kind] ?? SCENES.forest;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: scene.bg,
        overflow: "hidden",
      }}
    >
      {scene.shapes.map((sh, i) => {
        if (sh.type === "beam") {
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${sh.x}%`,
                top: "-10%",
                width: `${sh.w}%`,
                height: "120%",
                background: `linear-gradient(180deg, rgba(255,240,210,${sh.opacity}) 0%, transparent 80%)`,
                transform: "skewX(-8deg)",
                filter: "blur(8px)",
              }}
            />
          );
        }
        if (sh.type === "trunk") {
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${sh.x}%`,
                top: "20%",
                width: "4%",
                height: "90%",
                background: `linear-gradient(90deg, transparent 0%, ${sh.color} 40%, ${sh.color} 60%, transparent 100%)`,
                opacity: 0.7,
                filter: "blur(2px)",
              }}
            />
          );
        }
        if (sh.type === "hill") {
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: "-10%",
                right: "-10%",
                top: `${sh.y}%`,
                bottom: 0,
                background: sh.color,
                opacity: sh.opacity,
                borderRadius: "50% 50% 0 0 / 30% 30% 0 0",
                filter: "blur(1px)",
              }}
            />
          );
        }
        if (sh.type === "horizon") {
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: `${sh.y}%`,
                height: 2,
                background: sh.color,
                opacity: sh.opacity,
                filter: "blur(2px)",
              }}
            />
          );
        }
        if (sh.type === "ripple") {
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: "10%",
                right: "10%",
                top: `${sh.y}%`,
                height: 1,
                background: "rgba(255,255,255,0.4)",
                filter: "blur(1px)",
              }}
            />
          );
        }
        if (sh.type === "mist") {
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: "-5%",
                right: "-5%",
                top: `${sh.y}%`,
                height: "20%",
                background: `linear-gradient(180deg, transparent, rgba(243,237,226,${sh.opacity}), transparent)`,
                filter: "blur(8px)",
              }}
            />
          );
        }
        if (sh.type === "moon") {
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${sh.x}%`,
                top: `${sh.y}%`,
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "radial-gradient(circle, #e8c39a 0%, #c9a487 70%, transparent 100%)",
                filter: "blur(2px)",
                opacity: 0.85,
              }}
            />
          );
        }
        return null;
      })}
      {/* Grain overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/><feColorMatrix values='0 0 0 0 0.1 0 0 0 0 0.1 0 0 0 0 0.1 0 0 0 0.5 0'/></filter><rect width='200' height='200' filter='url(%23n)' opacity='0.4'/></svg>")`,
          mixBlendMode: "overlay",
          opacity: 0.5,
        }}
      />
    </div>
  );
}
