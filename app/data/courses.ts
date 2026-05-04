export type CourseLesson = {
  title: string;
  duration: number;
  mood: string;
  pace: string;
  sound: string;
  intention: string;
  voiceTrack?: string;
};

export type Course = {
  slug: string;
  title: string;
  description: string;
  level: "Beginner" | "Gentle" | "Deepening";
  accent: string;
  lessons: CourseLesson[];
};

export const COURSES: Course[] = [
  {
    slug: "first-refuge",
    title: "First Refuge",
    description:
      "A quiet introduction for people who want meditation to feel simple, kind, and possible.",
    level: "Beginner",
    accent: "#c5a66c",
    lessons: [
      {
        title: "Arriving at the Door",
        duration: 5,
        mood: "Just stillness",
        pace: "balanced",
        sound: "hearth",
        intention: "This breath is enough.",
      },
      {
        title: "Finding the Floor",
        duration: 10,
        mood: "Overwhelmed",
        pace: "soft",
        sound: "rain",
        intention: "I do not need to solve everything.",
      },
      {
        title: "Leaving Slowly",
        duration: 10,
        mood: "Need focus",
        pace: "balanced",
        sound: "stream",
        intention: "I can go slowly.",
      },
    ],
  },
  {
    slug: "sleep-hut",
    title: "Sleep Hut",
    description:
      "Body scans and long exhales for nights when the mind stays awake after the room goes quiet.",
    level: "Gentle",
    accent: "#aebbd2",
    lessons: [
      {
        title: "Unlit Room",
        duration: 10,
        mood: "Can't sleep",
        pace: "sleep",
        sound: "rain",
        intention: "I can be kind to what is here.",
      },
      {
        title: "Heavy Body",
        duration: 15,
        mood: "Can't sleep",
        pace: "sleep",
        sound: "hearth",
        intention: "This breath is enough.",
      },
    ],
  },
  {
    slug: "steady-heart",
    title: "Steady Heart",
    description:
      "A short course for anxiety, sadness, and tender days that need less pushing and more presence.",
    level: "Deepening",
    accent: "#91ad91",
    lessons: [
      {
        title: "Long Exhale",
        duration: 10,
        mood: "Anxious",
        pace: "soft",
        sound: "stream",
        intention: "I can go slowly.",
      },
      {
        title: "Rain Is Allowed",
        duration: 10,
        mood: "Sad",
        pace: "soft",
        sound: "rain",
        intention: "I can be kind to what is here.",
      },
      {
        title: "The Next Small Thing",
        duration: 15,
        mood: "Overwhelmed",
        pace: "balanced",
        sound: "hearth",
        intention: "I do not need to solve everything.",
      },
    ],
  },
];
