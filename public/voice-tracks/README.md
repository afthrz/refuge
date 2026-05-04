# Voice Tracks

Put guided meditation audio files in this folder.

Recommended formats:
- `.mp3` for the broadest support
- `.m4a`, `.wav`, or `.ogg` if your target browsers support them

Example:

```text
public/voice-tracks/first-refuge-01-arriving.mp3
```

Then reference it from `app/data/courses.ts`:

```ts
voiceTrack: "/voice-tracks/first-refuge-01-arriving.mp3"
```

Files in `public` are served from the site root, so that file becomes:

```text
/voice-tracks/first-refuge-01-arriving.mp3
```
