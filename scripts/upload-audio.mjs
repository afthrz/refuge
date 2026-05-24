// One-time script to upload the 21 Slowing Down audio files to Supabase Storage.
//
// Usage:
//   1. Make sure your audio files are in /Users/alfa/coding stuff/refuge/checked/
//   2. Set env vars in your shell (DO NOT commit these):
//        export NEXT_PUBLIC_SUPABASE_URL="https://xxxxx.supabase.co"
//        export SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOi..."
//   3. Run: node scripts/upload-audio.mjs

import { createClient } from "@supabase/supabase-js";
import { readFile, readdir } from "fs/promises";
import path from "path";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const SOURCE_DIR = "/Users/alfa/coding stuff/refuge/checked";
const BUCKET = "course-audio";

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

// Make sure the bucket exists (private)
const { data: buckets } = await supabase.storage.listBuckets();
if (!buckets?.some((b) => b.name === BUCKET)) {
  console.log(`Creating private bucket: ${BUCKET}`);
  const { error } = await supabase.storage.createBucket(BUCKET, { public: false });
  if (error) {
    console.error("Failed to create bucket:", error);
    process.exit(1);
  }
}

const files = await readdir(SOURCE_DIR);
const dayFiles = files
  .filter((f) => /^day(\d{2})_/.test(f))
  .sort()
  .map((f) => ({
    day: parseInt(f.match(/^day(\d{2})_/)[1], 10),
    name: f,
  }));

console.log(`Uploading ${dayFiles.length} files to ${BUCKET}/slowing-down/`);

for (const { day, name } of dayFiles) {
  const filePath = path.join(SOURCE_DIR, name);
  const buffer = await readFile(filePath);
  const target = `slowing-down/day-${day}.mp3`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(target, buffer, {
      contentType: "audio/mpeg",
      upsert: true,
    });

  if (error) {
    console.error(`✗ day ${day}: ${error.message}`);
  } else {
    console.log(`✓ day ${day}: ${target}`);
  }
}

console.log("Done.");
