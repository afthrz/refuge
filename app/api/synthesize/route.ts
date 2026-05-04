import { NextRequest, NextResponse } from "next/server";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

const client = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

// Default voice: Adam — calm, deep male voice.
// Change ELEVENLABS_VOICE_ID in .env.local to use a different voice.
// Browse voices at https://elevenlabs.io/voice-library
const VOICE_ID = process.env.ELEVENLABS_VOICE_ID ?? "pNInz6obpgDQGcFmaJgB";

// ElevenLabs has a per-request character limit (~5000 chars for most plans).
// Meditation scripts can be much longer, so we split on paragraph breaks
// and synthesise each chunk, then join the raw MP3 bytes together.
function splitIntoChunks(text: string, maxChars = 4500): string[] {
  const paragraphs = text.split(/\n{2,}/);
  const chunks: string[] = [];
  let current = "";

  for (const para of paragraphs) {
    if ((current + "\n\n" + para).length > maxChars && current.length > 0) {
      chunks.push(current.trim());
      current = para;
    } else {
      current = current ? current + "\n\n" + para : para;
    }
  }
  if (current.trim()) chunks.push(current.trim());
  return chunks;
}

async function synthesiseChunk(text: string): Promise<Buffer> {
  const stream = await client.textToSpeech.convert(VOICE_ID, {
    text,
    modelId: "eleven_turbo_v2_5",
    voiceSettings: {
      stability: 0.88,
      similarityBoost: 0.75,
      style: 0.0,
      useSpeakerBoost: false,
    },
  });

  // ReadableStream doesn't support for-await directly in all envs,
  // so we use the reader API instead.
  const reader = (stream as ReadableStream<Uint8Array>).getReader();
  const pieces: Uint8Array[] = [];
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    pieces.push(value);
  }
  return Buffer.concat(pieces);
}

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();
    const chunks = splitIntoChunks(text);

    // Synthesise each chunk in order (sequential to respect rate limits)
    const audioBuffers: Buffer[] = [];
    for (const chunk of chunks) {
      const buf = await synthesiseChunk(chunk);
      audioBuffers.push(buf);
    }

    const combined = Buffer.concat(audioBuffers);

    return new NextResponse(combined, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": combined.length.toString(),
      },
    });
  } catch (err) {
    console.error("Synthesise error:", err);
    return NextResponse.json(
      { error: "Failed to synthesise audio." },
      { status: 500 }
    );
  }
}
