export type MoodOption = {
  label: string;
  icon: string;
  tone: string;
  guide: string;
};

export type PaceOption = {
  id: string;
  label: string;
  description: string;
  in: number;
  out: number;
};

export type SoundOption = {
  id: string;
  label: string;
  description: string;
};

export const MOODS: MoodOption[] = [
  {
    label: "Stressed",
    icon: "*",
    tone: "unclench",
    guide: "A steadier sit for pressure, tight shoulders, and a crowded day.",
  },
  {
    label: "Anxious",
    icon: "~",
    tone: "settle",
    guide: "Longer exhales and grounded cues for a nervous system asking for safety.",
  },
  {
    label: "Can't sleep",
    icon: "moon",
    tone: "soften",
    guide: "A slower body scan for a mind that is still awake.",
  },
  {
    label: "Overwhelmed",
    icon: "+",
    tone: "one thing",
    guide: "A small, simple practice when everything feels too much.",
  },
  {
    label: "Sad",
    icon: "rain",
    tone: "kindness",
    guide: "Gentle company for heaviness, without asking it to leave too quickly.",
  },
  {
    label: "Need focus",
    icon: ".",
    tone: "clear",
    guide: "A collecting practice for attention that has scattered.",
  },
  {
    label: "Just stillness",
    icon: "leaf",
    tone: "quiet",
    guide: "Plain breathing and quiet presence, with no goal to reach.",
  },
];

export const DURATIONS = [5, 10, 15, 20];

export const PACE_OPTIONS: PaceOption[] = [
  {
    id: "balanced",
    label: "Balanced",
    description: "4 in, 4 out",
    in: 4,
    out: 4,
  },
  {
    id: "soft",
    label: "Soft exhale",
    description: "4 in, 6 out",
    in: 4,
    out: 6,
  },
  {
    id: "sleep",
    label: "Sleepy",
    description: "4 in, 8 out",
    in: 4,
    out: 8,
  },
];

export const SOUND_OPTIONS: SoundOption[] = [
  {
    id: "silence",
    label: "Silence",
    description: "No background sound",
  },
  {
    id: "rain",
    label: "Rain",
    description: "Soft filtered rain",
  },
  {
    id: "stream",
    label: "Stream",
    description: "Bright low water",
  },
  {
    id: "hearth",
    label: "Hearth",
    description: "Warm low hum",
  },
];

export const INTENTIONS = [
  "I can go slowly.",
  "This breath is enough.",
  "I do not need to solve everything.",
  "I can be kind to what is here.",
];

export function getPace(id: string | null): PaceOption {
  return PACE_OPTIONS.find((option) => option.id === id) ?? PACE_OPTIONS[0];
}

export function getSound(id: string | null): SoundOption {
  return SOUND_OPTIONS.find((option) => option.id === id) ?? SOUND_OPTIONS[0];
}
