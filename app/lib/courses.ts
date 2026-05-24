export type Course = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  days: number;
  scene: SceneKind;
  duration: string;
  teacher: string;
  // day number → public audio URL (e.g. { 1: "/audio/slowingdown-1.mov" })
  // add one line here each time a new episode is recorded
  episodes?: Partial<Record<number, string>>;
};

export type SceneKind = "slowing" | "letting-go" | "returning" | "quiet-mind" | "sleep" | "forest";

export type ArrivalOption = {
  id: string;
  label: string;
  sub: string;
  suggested: string;
};

export const COURSES: Course[] = [
  {
    id: "slowing-down",
    title: "Slowing Down",
    subtitle: "for the chronically overwhelmed",
    description:
      "Twenty-one days of learning to move at the pace of your own breath. A gentle invitation to do less, on purpose.",
    days: 21,
    scene: "slowing",
    duration: "8 — 14 min",
    teacher: "Voiced by Maren",
    episodes: {
      1: "/api/audio/1",
      2: "/api/audio/2",
      3: "/api/audio/3",
      4: "/api/audio/4",
      5: "/api/audio/5",
      6: "/api/audio/6",
      7: "/api/audio/7",
      8: "/api/audio/8",
      9: "/api/audio/9",
      10: "/api/audio/10",
      11: "/api/audio/11",
      12: "/api/audio/12",
      13: "/api/audio/13",
      14: "/api/audio/14",
      15: "/api/audio/15",
      16: "/api/audio/16",
      17: "/api/audio/17",
      18: "/api/audio/18",
      19: "/api/audio/19",
      20: "/api/audio/20",
      21: "/api/audio/21",
    },
  },
];

export const COURSE_DAYS: string[] = [
  "Beginning — why we sit",
  "Finding your anchor",
  "When the mind wanders",
  "Body scan — lower",
  "Body scan — upper",
  "Breath and body together",
  "One week — what's shifted",
  "Sounds as anchor",
  "Thoughts as events",
  "Emotions in the body",
  "Noting practice",
  "Walking meditation",
  "Yoga nidra (NSDR)",
  "Two weeks — extended sit",
  "Mantra and counting",
  "Metta — toward self",
  "Metta — outward circles",
  "Open awareness",
  "Mindfulness in daily life",
  "Working with difficulty",
  "The rest of your life",
];

export const ARRIVAL_OPTIONS: ArrivalOption[] = [
  {
    id: "overwhelmed",
    label: "I am overwhelmed",
    sub: "A short practice to set down what you are carrying.",
    suggested: "slowing-down",
  },
  {
    id: "slow-down",
    label: "I need to slow down",
    sub: "A few quiet minutes to step out of the current.",
    suggested: "slowing-down",
  },
  {
    id: "feel-real",
    label: "I want to feel something real",
    sub: "A practice for returning to your own body.",
    suggested: "slowing-down",
  },
];

export function getCourse(id: string): Course | undefined {
  return COURSES.find((c) => c.id === id);
}

export function getEpisodeUrl(course: Course | undefined, day: number): string | undefined {
  return course?.episodes?.[day];
}
