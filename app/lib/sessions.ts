import { createClient } from "@/app/lib/supabase";

export type Session = {
  id: string;
  mood: string;
  duration: number;
  completedAt: string;
};

const STORAGE_KEY = "refuge-sessions";

// ── localStorage helpers (anonymous users + offline fallback) ─────────────────

function getLocalSessions(): Session[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalSession(session: Session): void {
  const sessions = getLocalSessions();
  sessions.push(session);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Returns the user's sessions.
 * - Signed in  → fetches from Supabase (persists across devices)
 * - Signed out → reads localStorage (lost on browser clear)
 */
export async function getSessions(): Promise<Session[]> {
  if (typeof window === "undefined") return [];

  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data, error } = await supabase
        .from("sessions")
        .select("id, mood, duration, completed_at")
        .order("completed_at", { ascending: false });

      if (error) {
        console.error("Supabase getSessions:", error.message);
        return getLocalSessions();
      }

      return (data ?? []).map((row) => ({
        id: row.id,
        mood: row.mood,
        duration: row.duration,
        completedAt: row.completed_at,
      }));
    }
  } catch {
    // Network error — fall through to localStorage
  }

  return getLocalSessions();
}

/**
 * Saves a meditation session.
 * - Always writes to localStorage immediately (works offline, no delay)
 * - Also writes to Supabase if signed in (cross-device persistence)
 */
export async function saveSession(
  mood: string,
  duration: number
): Promise<Session> {
  const session: Session = {
    id: crypto.randomUUID(),
    mood,
    duration,
    completedAt: new Date().toISOString(),
  };

  // Always save locally first — instant, works without network
  saveLocalSession(session);

  // Also save to Supabase if the user is signed in
  try {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { error } = await supabase.from("sessions").insert({
        id: session.id,
        user_id: user.id,
        mood: session.mood,
        duration: session.duration,
        completed_at: session.completedAt,
      });

      if (error) {
        console.error("Supabase saveSession:", error.message);
        // localStorage write already happened — data is safe
      }
    }
  } catch {
    // Supabase unavailable — localStorage copy already saved
  }

  return session;
}

// ── Stat helpers (unchanged — work on any Session[]) ──────────────────────────

export function getTotalMinutes(sessions: Session[]): number {
  return sessions.reduce((sum, s) => sum + s.duration, 0);
}

export function getCurrentStreak(sessions: Session[]): number {
  if (sessions.length === 0) return 0;
  const uniqueDays = [
    ...new Set(sessions.map((s) => new Date(s.completedAt).toDateString())),
  ].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const latest = new Date(uniqueDays[0]);
  latest.setHours(0, 0, 0, 0);
  const diffFromToday = Math.round(
    (today.getTime() - latest.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diffFromToday > 1) return 0;

  let streak = 1;
  for (let i = 0; i < uniqueDays.length - 1; i++) {
    const curr = new Date(uniqueDays[i]);
    const prev = new Date(uniqueDays[i + 1]);
    curr.setHours(0, 0, 0, 0);
    prev.setHours(0, 0, 0, 0);
    const gap = Math.round(
      (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (gap === 1) streak++;
    else break;
  }
  return streak;
}

export function playChime() {
  try {
    const ctx = new AudioContext();
    const now = ctx.currentTime;
    [528, 639, 741].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, now + i * 0.6);
      gain.gain.linearRampToValueAtTime(0.15, now + i * 0.6 + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.6 + 2.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + i * 0.6);
      osc.stop(now + i * 0.6 + 2.5);
    });
  } catch {}
}
