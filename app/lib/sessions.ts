export type Session = {
  id: string;
  mood: string;
  duration: number;
  completedAt: string;
};

const STORAGE_KEY = "refuge-sessions";

export function getSessions(): Session[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveSession(mood: string, duration: number): Session {
  const session: Session = {
    id: crypto.randomUUID(),
    mood,
    duration,
    completedAt: new Date().toISOString(),
  };
  const sessions = getSessions();
  sessions.push(session);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  return session;
}

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
