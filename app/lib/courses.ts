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
    },
  },
];

export const COURSE_DAYS: string[] = [
  "Arriving",
  "The body knows first",
  "The shape of a breath",
  "Doing less, on purpose",
  "The pause before the answer",
  "Walking without arriving",
  "A quiet morning",
  "When the mind wanders",
  "Listening, without fixing",
  "The weight you have been carrying",
  "A small kindness to yourself",
  "The space between thoughts",
  "Returning, again",
  "The unhurried life",
  "What is enough",
  "Letting the day end",
  "The room you are in",
  "Beneath the noise",
  "Resting in not-knowing",
  "The forest does not keep score",
  "Beginning, again",
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
