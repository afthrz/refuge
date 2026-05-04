import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// How many words to aim for at each duration.
// Slow meditation speech is roughly 80 words per minute.
const TARGET_WORDS: Record<number, number> = {
  5:  400,
  10: 800,
  15: 1200,
  20: 1600,
};

const STATE_DESCRIPTIONS: Record<string, string> = {
  "stressed":     "feeling stressed and tense, carrying the weight of demands and pressure",
  "anxious":      "feeling anxious, with a restless and worried mind",
  "cant-sleep":   "unable to sleep, lying awake with thoughts circling in the dark",
  "overwhelmed":  "feeling overwhelmed, as if there is too much to hold",
  "sad":          "feeling sad and heavy-hearted",
  "need-focus":   "seeking clarity and focus, with a scattered mind",
  "stillness":    "simply wanting stillness and quiet, with no particular goal",
};

export async function POST(request: NextRequest) {
  try {
    const { state, duration } = await request.json();

    const wordCount = TARGET_WORDS[duration] ?? 400;
    const stateDesc = STATE_DESCRIPTIONS[state] ?? "seeking peace";

    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      system: `You are a meditation guide in the tradition of forest Buddhism — the lineage of
Ajahn Chah, Ajahn Sumedho, Thich Nhat Hanh. Your language is calm, direct,
and grounded in the body and breath.

You do not use new-age jargon or flowery metaphors. You speak slowly, with
natural pauses built in through ellipses (...) and short sentences.
Your tone is like a quiet elder sitting with someone beneath the trees.

Write only the spoken words. No titles. No headings. No stage directions.
No preamble like "Here is your meditation." Just begin speaking.`,

      messages: [
        {
          role: "user",
          content: `Write a guided meditation for someone who is ${stateDesc}.

Duration: ${duration} minutes. Aim for approximately ${wordCount} words —
spoken slowly at meditation pace, this fills ${duration} minutes.

Structure it in three gentle movements (do not label them, just flow naturally):
1. Arriving — help them settle into the body and this present moment
2. The practice — the core of the meditation, tailored to their state
3. Returning — gently bring them back, with a closing word

Use ellipses (...) to mark natural pauses where the listener rests and breathes.
Keep sentences short. Use concrete language: breath, body, ground, stillness, weight.
Do not bypass difficulty or rush toward peace — meet them exactly where they are.`,
        },
      ],
    });

    const script =
      message.content[0].type === "text" ? message.content[0].text : "";

    return NextResponse.json({ script });
  } catch (err) {
    console.error("Generate error:", err);
    return NextResponse.json(
      { error: "Failed to generate meditation script." },
      { status: 500 }
    );
  }
}
