/* ============================================================
   THE REFUGE — product framework

   One place to define everything a member gets. Add new audio by
   filling an item's `audio` and flipping `status`. Add a whole new
   bundle by appending to PRODUCT_MODULES. The member pages read
   from here, so content changes never touch the UI.

   Modules:
     THE PATH            — 21 daily guided sessions (audio, exists)
     THE QUIET LETTERS   — a written reflection per day (text, below)
     THE 3-MINUTE DOOR   — emergency short sessions (audio, to record)
     THE NIGHT REFUGE    — 2 a.m. wind-downs (audio, to record)
     THE OPEN DOOR       — 14 sessions for after Day 21 (audio, to record)
   ============================================================ */

/* ---------- Written product: The Quiet Letters ---------- */

export type QuietLetter = {
  day: number;
  title: string;
  line: string; // the one line worth keeping
  body: string; // a short reflection — one idea
  question: string; // one quiet question to sit with
};

export const QUIET_LETTERS: QuietLetter[] = [
  {
    day: 1,
    title: "Beginning — why we sit",
    line: "You are not here to empty your mind. You are here to meet it.",
    body: "Most people think meditation means stopping thought. It doesn't. We sit because the mind has been running your days without ever being watched — and being watched, gently, is how it begins to soften. There is nothing to achieve today. Just arrive, and let the arriving be enough.",
    question: "What made you open the door today?",
  },
  {
    day: 2,
    title: "Finding your anchor",
    line: "The breath is always now. That is why we return to it.",
    body: "An anchor isn't a cage; it's a place to come back to. When the mind drifts — and it will — the breath is waiting, unbothered, exactly where you left it. You don't have to hold on tightly. You only have to come back, as many times as it takes.",
    question: "Where in the body do you feel the breath most clearly?",
  },
  {
    day: 3,
    title: "When the mind wanders",
    line: "The wandering is not the problem. The returning is the practice.",
    body: "Today your mind will leave a hundred times. Good. Each time you notice and come back is one repetition — the only rep that counts. People who think they can't meditate believe drifting means failing. It means you're human, and you're practicing.",
    question: "Can you greet a wandering thought without irritation?",
  },
  {
    day: 4,
    title: "Body scan — lower",
    line: "The body has been carrying you. Today you turn and notice it.",
    body: "We start low — feet, legs, the seat beneath you — because the body is the most honest thing you own. It doesn't lie about tension the way the mind lies about being fine. Move your attention slowly, like warm light, and let each part be exactly as it is.",
    question: "Where were you holding without knowing?",
  },
  {
    day: 5,
    title: "Body scan — upper",
    line: "Softness is not weakness. It is permission.",
    body: "The shoulders, the jaw, the space between the brows — this is where the day collects. You don't have to force them to release. You only have to notice, and noticing is often enough for the body to let go a little on its own.",
    question: "What would it feel like to set the weight down, just here?",
  },
  {
    day: 6,
    title: "Breath and body together",
    line: "Two anchors are steadier than one.",
    body: "Today the breath and the body meet. Feel the breath move through the places you scanned — the chest rising, the belly softening, the whole body breathing rather than just the nose. This is the practice growing roots.",
    question: "Does the breath feel different when the body is included?",
  },
  {
    day: 7,
    title: "One week — what's shifted",
    line: "You came back seven times. That is not nothing.",
    body: "A week ago this was an idea. Now it's a small, real thing you've done. Don't look for fireworks — look for the quieter evidence: a pause before a reaction, a breath you remembered to take. The shift is usually that small, and that is exactly how it begins.",
    question: "What is one moment this week you noticed sooner?",
  },
  {
    day: 8,
    title: "Sounds as anchor",
    line: "You don't have to chase silence. Let sound come to you.",
    body: "Instead of treating noise as the enemy of meditation, today we let it be the object of it. Sounds arrive, peak, and pass — exactly like thoughts, exactly like feelings. Practicing with sound is practicing with everything that comes and goes.",
    question: "Can you hear a sound without naming it?",
  },
  {
    day: 9,
    title: "Thoughts as events",
    line: "A thought is not a command. It is weather.",
    body: "You are not your thoughts; you are the sky they pass through. Today we watch thoughts the way you'd watch clouds — noting that one arrived, letting it drift, without climbing aboard. The storm still comes. You just stop living inside it.",
    question: "Can you watch a thought without believing it?",
  },
  {
    day: 10,
    title: "Emotions in the body",
    line: "Feelings live in the body before they have a name.",
    body: "Anxiety is a tightening. Sadness is a heaviness. Before the story, there is a sensation. Today we meet the feeling where it actually lives — in the chest, the throat, the gut — and we keep it company instead of fixing it. What is felt fully tends to move.",
    question: "Where does this feeling sit, right now?",
  },
  {
    day: 11,
    title: "Noting practice",
    line: "Name it gently, and it loosens its grip.",
    body: "A soft, silent word — thinking, planning, aching, longing — turns you from inside the experience to beside it. Noting isn't analysis; it's a light touch that says: I see you. That small distance is where freedom starts.",
    question: "What word fits what's here now?",
  },
  {
    day: 12,
    title: "Walking meditation",
    line: "Stillness can move. You don't always have to sit to come home.",
    body: "Today the practice stands up and walks. Slow steps, the soles meeting the ground, the body in motion as the anchor. This is the bridge between the cushion and the rest of your life — proof that presence isn't a posture, it's an attention.",
    question: "Can you feel the ground meet your foot?",
  },
  {
    day: 13,
    title: "Yoga nidra (NSDR)",
    line: "Rest is not the absence of practice. Sometimes it is the practice.",
    body: "Lying down, doing nothing, staying just awake — this is deep rest, and it restores the nervous system in a way effort never could. You spend so much of life pushing. Today, you practice being held.",
    question: "When did you last rest without earning it?",
  },
  {
    day: 14,
    title: "Two weeks — extended sit",
    line: "You can stay longer than you think.",
    body: "Two weeks in, we lengthen the sit. Not to prove anything — to discover that the restlessness which used to end the session is just another cloud. Past the urge to stop, there is often a deeper quiet waiting.",
    question: "What happens if you stay one minute past wanting to leave?",
  },
  {
    day: 15,
    title: "Mantra and counting",
    line: "A word repeated is a hand to hold in the dark.",
    body: "When the mind is too loud for the breath alone, a simple count or a quiet phrase gives it something steady to rest on. This isn't a downgrade — it's a tool. The wise practitioner uses whatever brings them home.",
    question: "What phrase would you want to repeat to yourself?",
  },
  {
    day: 16,
    title: "Metta — toward self",
    line: "You cannot pour kindness outward from an empty cup.",
    body: "Today we turn the practice toward the hardest person to be gentle with: you. May I be at ease. May I be kind to myself. It can feel awkward, even undeserved. Say it anyway. The awkwardness is the old armor, not the truth.",
    question: "What would you wish for yourself, if no one were watching?",
  },
  {
    day: 17,
    title: "Metta — outward circles",
    line: "Goodwill widens the freer it is given.",
    body: "From yourself, the kindness moves outward — to someone you love, someone neutral, and finally someone difficult. This isn't about pretending. It's about refusing to let your heart close. Even a flicker of may you be well changes the one who offers it.",
    question: "Who is hard to wish well — and can you try anyway?",
  },
  {
    day: 18,
    title: "Open awareness",
    line: "Put down the anchor. Let the whole moment hold you.",
    body: "By now you've practiced with breath, body, sound, thought, and feeling. Today you set down the single object and simply rest, aware of whatever arises. This is the open hand of practice — receiving the moment instead of managing it.",
    question: "Can you let everything be here at once?",
  },
  {
    day: 19,
    title: "Mindfulness in daily life",
    line: "The practice was never about the cushion. It was always about the dishes.",
    body: "One conscious breath before you answer. The feet on the floor in the queue. The taste of the first sip. Mindfulness off the cushion is a thousand tiny returns, woven through an ordinary day. This is where the twenty-one days actually live.",
    question: "What ordinary moment could become a doorway today?",
  },
  {
    day: 20,
    title: "Working with difficulty",
    line: "You don't have to like it to stop fighting it.",
    body: "Some days the mind is a storm and the body won't settle. This is not a failed sit; it's the most important one. Turning toward the difficulty with a little kindness — not to fix it, but to stay — is the whole strength you've been building. The hard days are where the practice becomes real.",
    question: "Can you stay with what's hard for three more breaths?",
  },
  {
    day: 21,
    title: "The rest of your life",
    line: "The door doesn't close. You've simply learned where it is.",
    body: "Twenty-one days ago, ten quiet minutes felt impossible. Now you know the way back to yourself, and you can take it anytime — on a train, in a hard hour, at 2 a.m. This was never a finish line. It's a beginning you get to keep. Come home as often as you need to.",
    question: "How will you keep the door open from here?",
  },
];

export function getLetter(day: number): QuietLetter | undefined {
  return QUIET_LETTERS.find((l) => l.day === day);
}

/* ---------- Audio bundles (slots wait for your scripts) ---------- */

export type AudioStatus = "planned" | "scripted" | "recorded";

export type AudioItem = {
  id: string;
  title: string;
  duration: string;
  description: string;
  /** Set to the protected URL (e.g. "/api/audio/three-minute-door/1") once recorded. */
  audio?: string;
  status: AudioStatus;
};

export const THREE_MINUTE_DOOR: AudioItem[] = [
  {
    id: "reset",
    title: "The 3-Minute Reset",
    duration: "3 min",
    description:
      "One long-exhale sequence to drop the shoulders fast. The default door when you only have a moment.",
    status: "planned",
  },
  {
    id: "before-the-meeting",
    title: "Before the Meeting",
    duration: "3 min",
    description:
      "Settle a racing pulse in the doorway, so you walk in as yourself.",
    status: "planned",
  },
  {
    id: "the-private-minute",
    title: "The Private Minute",
    duration: "3 min",
    description:
      "For the moment you step away to not fall apart. A hand on the shoulder, in audio.",
    status: "planned",
  },
  {
    id: "the-red-light-breath",
    title: "The Red-Light Breath",
    duration: "3 min",
    description: "A reset between two places — the commute used on purpose.",
    status: "planned",
  },
];

export const NIGHT_REFUGE: AudioItem[] = [
  {
    id: "the-replay",
    title: "When You Can't Stop Replaying",
    duration: "15 min",
    description:
      "Built for the 2 a.m. loop. Instead of fighting the thoughts, you're guided past them.",
    status: "planned",
  },
  {
    id: "laying-the-day-down",
    title: "Laying the Day Down",
    duration: "12 min",
    description: "A wind-down to close the day before the light goes out.",
    status: "planned",
  },
  {
    id: "the-heavy-body-scan",
    title: "The Heavy-Body Scan",
    duration: "18 min",
    description: "Sink, slowly, into the mattress — a body scan made for sleep.",
    status: "planned",
  },
  {
    id: "if-you-wake-at-three",
    title: "If You Wake at 3 a.m.",
    duration: "15 min",
    description: "Getting back under, without fighting the dark.",
    status: "planned",
  },
];

export const OPEN_DOOR: AudioItem[] = [
  { id: "hard-morning", title: "The Morning of a Hard Day", duration: "10 min", description: "Ten minutes to meet the day you've been dreading.", status: "planned" },
  { id: "before-you-walk-in", title: "Before You Walk In", duration: "8 min", description: "For the threshold before something difficult.", status: "planned" },
  { id: "after-an-argument", title: "After an Argument", duration: "10 min", description: "When the adrenaline is still in your hands.", status: "planned" },
  { id: "let-someone-down", title: "When You've Let Someone Down", duration: "12 min", description: "Sitting with the ache without drowning in it.", status: "planned" },
  { id: "the-anniversary", title: "The Anniversary", duration: "15 min", description: "For the date the body remembers before the mind does.", status: "planned" },
  { id: "the-relapse-day", title: "The Relapse Day", duration: "12 min", description: "When the old pattern visits. No shame, just the next breath.", status: "planned" },
  { id: "the-old-weight", title: "When the Old Weight Visits", duration: "12 min", description: "Meeting the grief that comes back uninvited.", status: "planned" },
  { id: "cant-sleep-again", title: "Can't Sleep, Again", duration: "15 min", description: "For the nights the mind won't close.", status: "planned" },
  { id: "the-sunday-dread", title: "The Sunday Dread", duration: "10 min", description: "Easing the weight of the week ahead.", status: "planned" },
  { id: "heavy-news", title: "When the News Is Heavy", duration: "12 min", description: "Steadying yourself when something lands hard.", status: "planned" },
  { id: "justified-anger", title: "When You're Angry and It's Justified", duration: "10 min", description: "Feeling it fully without being run by it.", status: "planned" },
  { id: "the-lonely-hour", title: "The Lonely Hour", duration: "12 min", description: "Company for the quiet that aches.", status: "planned" },
  { id: "starting-over", title: "Starting Over", duration: "10 min", description: "For the morning after a decision changed everything.", status: "planned" },
  { id: "a-good-day", title: "When Things Are Actually Okay", duration: "8 min", description: "Savoring — so the good moment doesn't slip past unmet.", status: "planned" },
];

/* ---------- Module manifest (read by the member pages) ---------- */

export type ModuleKind = "path" | "letters" | "audio-bundle";

export type ProductModule = {
  id: string;
  name: string;
  kind: ModuleKind;
  blurb: string;
  unlock: "immediate" | "after-path";
  items?: AudioItem[];
};

export const PRODUCT_MODULES: ProductModule[] = [
  {
    id: "path",
    name: "The Path",
    kind: "path",
    blurb: "21 guided sessions with Monk Samarn, one a day, in order.",
    unlock: "immediate",
  },
  {
    id: "quiet-letters",
    name: "The Quiet Letters",
    kind: "letters",
    blurb: "A short written reflection with every session — one line worth keeping.",
    unlock: "immediate",
  },
  {
    id: "three-minute-door",
    name: "The 3-Minute Door",
    kind: "audio-bundle",
    blurb: "Emergency sessions for the moment it hits you mid-day.",
    unlock: "after-path",
    items: THREE_MINUTE_DOOR,
  },
  {
    id: "night-refuge",
    name: "The Night Refuge",
    kind: "audio-bundle",
    blurb: "Built for the 2 a.m. replay.",
    unlock: "after-path",
    items: NIGHT_REFUGE,
  },
  {
    id: "open-door",
    name: "The Open Door",
    kind: "audio-bundle",
    blurb: "14 sessions for life after the path — unlocked when you finish Day 21.",
    unlock: "after-path",
    items: OPEN_DOOR,
  },
];

/** Quick progress helper for showing "x of y recorded" in the UI. */
export function bundleProgress(items: AudioItem[] = []) {
  const recorded = items.filter((i) => i.status === "recorded").length;
  return { recorded, total: items.length };
}
