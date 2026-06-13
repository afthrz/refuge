"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import {
  SITE_STATE,
  CHECKOUT_URL,
  FOUNDING_SEATS_REMAINING,
} from "@/app/lib/site-config";

/* ============================================================
   THE REFUGE — sales page (preview)
   Skim-path discipline: read bold ember spans top-to-bottom,
   the full pitch must survive.
   ============================================================ */

export default function PreviewPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <main className="rf">
        <Hero />
        <DoorDivider stage={1} />
        <Pain />
        <DoorDivider stage={2} />
        <Reframe />
        <DoorDivider stage={3} />
        <Timeline />
        <DoorDivider stage={4} />
        <Stack />
        <DoorDivider stage={5} />
        <Guarantee />
        <DoorDivider stage={6} />
        <FAQ />
        <DoorDivider stage={7} />
        <FinalClose />
        <Footer />
      </main>
    </>
  );
}

/* ───────────── Components ───────────── */

function Hero() {
  return (
    <section className="rf-section rf-hero">
      <div className="rf-door-light" aria-hidden />
      <div className="rf-wrap rf-hero-inner">
        <div className="rf-eyebrow">A 21-day guided path · Monk Samarn</div>
        <h1 className="rf-h1">
          <span className="rf-skim">Come home to yourself.</span>
        </h1>
        <p className="rf-lede">
          The quiet kind of healing.{" "}
          <span className="rf-skim">Ten minutes a day, for 21 days.</span>{" "}
          Sitting upright, eyes closed, guided by one voice. No experience
          needed — if your mind wanders, you&apos;re doing it right.
        </p>
        <div className="rf-cta-row">
          <PrimaryAction context="hero" />
        </div>
        {SITE_STATE === "live" && (
          <p className="rf-scarcity">
            The door closes Sunday night · Founding Circle:{" "}
            {FOUNDING_SEATS_REMAINING} of 100 places remain
          </p>
        )}
      </div>
    </section>
  );
}

function Pain() {
  return (
    <section className="rf-section">
      <div className="rf-wrap rf-narrow">
        <div className="rf-eyebrow">For the one still carrying it</div>
        <p className="rf-body">
          You&apos;ve been carrying it for a while now. Maybe it&apos;s a
          person. Maybe it&apos;s a version of you that ended. Maybe it&apos;s
          the weight of holding everything together for everyone else.
        </p>
        <p className="rf-body">
          People say &ldquo;give it time.&rdquo; You did. Time alone
          didn&apos;t do it.
        </p>
        <p className="rf-body">
          You don&apos;t need more advice. You need a place to set it down for
          ten minutes. That&apos;s what this is.
        </p>
      </div>
    </section>
  );
}

function Reframe() {
  return (
    <section className="rf-section">
      <div className="rf-wrap rf-narrow">
        <div className="rf-eyebrow">&ldquo;But I can&apos;t meditate&rdquo;</div>
        <p className="rf-body">Good. You&apos;re exactly who this was built for.</p>
        <p className="rf-body">
          The Refuge has one rule: a wandering mind is not failure. Noticing
          you wandered, and gently coming back — that&apos;s the entire
          practice. Every return is one rep.{" "}
          <span className="rf-skim">You cannot do it wrong here.</span>
        </p>
        <p className="rf-body">
          And you don&apos;t have to believe in any of it for it to work. Your
          breath works without your permission. It has been keeping you alive
          all this time without being asked. We&apos;re just going to sit with
          it, on a chair, eyes closed, ten minutes.
        </p>
      </div>
    </section>
  );
}

function Timeline() {
  return (
    <section className="rf-section">
      <div className="rf-wrap rf-narrow">
        <div className="rf-eyebrow">What to expect, honestly</div>
        <p className="rf-body">
          <strong className="rf-lede-strong">Your first week:</strong> you
          start catching your own mind during the day. Mid-spiral, mid-replay
          — you notice sooner, instead of surfacing an hour later still
          tangled.{" "}
          <span className="rf-skim">
            The first shift arrives in week one.
          </span>{" "}
          It feels small. It&apos;s the whole skill.
        </p>
        <p className="rf-body">
          <strong className="rf-lede-strong">By Day 21:</strong> a pause opens
          between what happens and how you respond. The 2 a.m. replay loses
          its grip. You become a person who tends to their own mind.
        </p>
        <p className="rf-body">
          <strong className="rf-lede-strong">
            What daily practice builds toward:
          </strong>{" "}
          this isn&apos;t mystical.{" "}
          <span className="rf-skim">Real research, measurable results.</span>{" "}
          In a{" "}
          <a
            className="rf-link"
            href="https://www.nyu.edu/about/news-publications/news/2022/november/short-meditation-program-improves-cognitive-and-emotional-well-.html"
            target="_blank"
            rel="noopener"
          >
            randomized NYU study
          </a>
          , about 13 minutes of daily meditation lowered anxiety, lifted mood,
          and sharpened attention — in people who had never meditated — over 8
          weeks of practice.{" "}
          <a
            className="rf-link"
            href="https://news.harvard.edu/gazette/story/2011/01/eight-weeks-to-a-better-brain/"
            target="_blank"
            rel="noopener"
          >
            Harvard researchers
          </a>{" "}
          found consistent practice is associated with measurable changes on
          brain scans in regions tied to stress and memory. Twenty-one days is
          where the habit takes root. The science is what it grows into.
        </p>
      </div>
    </section>
  );
}

function Stack() {
  const items = [
    {
      name: "THE PATH",
      tag: "21 guided sessions with Monk Samarn",
      price: "$147",
      desc:
        "One session a day, in order, about ten minutes. Week one teaches you to notice. Week two, to release. Week three brings you home. Ten minutes in a chair is the entire cost of entry.",
    },
    {
      name: "THE QUIET LETTERS",
      tag: "",
      price: "$30",
      desc:
        "A short written reflection with every session. One idea, one line worth keeping — the teaching in your pocket for the days you can't sit.",
    },
    {
      name: "THE 3-MINUTE DOOR",
      tag: "",
      price: "$27",
      desc:
        "An emergency session for the moment it hits you mid-day. Three minutes, earbuds in, relief on demand, not on schedule.",
    },
    {
      name: "THE NIGHT REFUGE",
      tag: "",
      price: "$37",
      desc: "Built for the 2 a.m. replay. Instead of fighting the thoughts, you're guided past them.",
    },
    {
      name: "THE OPEN DOOR",
      tag: "14 sessions for life after the path",
      price: "$67",
      desc:
        "Unlocked when you finish Day 21. Sessions for real moments: the morning of a hard day, after an argument, the anniversary, the relapse day when the old weight visits. The path is 21 days; this carries you toward week eight, where the research says the deeper changes live.",
    },
  ];

  return (
    <section className="rf-section">
      <div className="rf-wrap rf-narrow">
        <div className="rf-eyebrow">What&apos;s inside</div>

        <div className="rf-stack">
          {items.map((it) => (
            <div className="rf-stack-item" key={it.name}>
              <div className="rf-stack-head">
                <div>
                  <div className="rf-stack-name">{it.name}</div>
                  {it.tag && <div className="rf-stack-tag">{it.tag}</div>}
                </div>
                <div className="rf-stack-price">{it.price}</div>
              </div>
              <p className="rf-stack-desc">{it.desc}</p>
            </div>
          ))}
        </div>

        <p className="rf-body rf-yours">
          <strong className="rf-lede-strong">YOURS FOR GOOD</strong> — not a
          subscription. Everything stays yours.
        </p>

        <div className="rf-total">
          <div className="rf-total-line">
            <span className="rf-total-strike">$288 total value</span>
            <span className="rf-total-arrow">→</span>
            <span className="rf-total-price">
              <span className="rf-skim">$288 of path for $49.</span>
            </span>
          </div>
          <p className="rf-total-sub">
            One ten-minute sit per day. Less than a single therapy session,
            for twenty-one guided ones.
          </p>
          <PrimaryAction context="stack" liveLabel="Step inside — $49" />
        </div>
      </div>
    </section>
  );
}

function Guarantee() {
  return (
    <section className="rf-section rf-moss">
      <div className="rf-wrap rf-narrow">
        <div className="rf-eyebrow rf-eyebrow-moss">
          The Homecoming Guarantee
        </div>
        <p className="rf-body">
          Sit with all 21 days. If by the end you don&apos;t feel the
          beginning of a shift — more noticing, more space, more quiet — reply
          to any email and{" "}
          <span className="rf-skim">I&apos;ll refund you in full.</span> No
          forms, no questions.
        </p>
        <p className="rf-body">
          You risk ten minutes a day. The rest is on me.
        </p>

        {SITE_STATE === "live" && (
          <div className="rf-quiet-block">
            <p className="rf-quiet">
              The door is open this week.{" "}
              <span className="rf-skim">It closes Sunday night.</span> The next
              opening hasn&apos;t been set. The first hundred who enter are
              the Founding Circle — their price stays at $49 forever, and
              their words shape the path for everyone after. At member 101,
              the price becomes $79 and never returns.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function FAQ() {
  const items = [
    {
      q: "Is this therapy?",
      a:
        "No. The Refuge is a meditation practice, not treatment for grief, trauma, or a mental health condition. It sits beautifully alongside therapy. If you're in crisis, please reach for professional support first.",
    },
    {
      q: "I've failed at meditation apps before.",
      a:
        "Most apps hand you a library and wish you luck. This is a path: one session a day, in order, with a voice that expects your mind to wander. Wandering is the practice here.",
    },
    {
      q: "Do I have to sit on the floor?",
      a: "No. A chair is perfect. Upright, dignified, eyes closed. Ten minutes.",
    },
    {
      q: "Is this religious?",
      a:
        "Monk Samarn draws from a contemplative tradition, but the practice is open to anyone. No belief required. Just sitting.",
    },
    {
      q: "What if I miss a day?",
      a: "You resume where you left off. The door doesn't lock.",
    },
  ];

  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="rf-section">
      <div className="rf-wrap rf-narrow">
        <div className="rf-eyebrow">Quiet questions</div>
        <div className="rf-faq">
          {items.map((it, i) => (
            <div className={`rf-faq-item ${open === i ? "open" : ""}`} key={it.q}>
              <button
                className="rf-faq-q"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span>{it.q}</span>
                <span className="rf-faq-plus" aria-hidden>
                  {open === i ? "–" : "+"}
                </span>
              </button>
              {open === i && <p className="rf-faq-a">{it.a}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FinalClose() {
  return (
    <section className="rf-section rf-final">
      <div className="rf-final-glow" aria-hidden />
      <div className="rf-wrap rf-narrow rf-final-inner">
        <p className="rf-body rf-final-body">
          You&apos;ve spent a long time being strong for everyone else.
        </p>
        <p className="rf-body rf-final-body">
          This is ten minutes a day that belongs to you. Twenty-one days. A
          chair, your breath, and a voice that knows the way back.
        </p>
        <p className="rf-body rf-final-body rf-final-line">
          The door is open.
        </p>
        <div className="rf-cta-row rf-cta-center">
          <PrimaryAction context="final" />
        </div>
        {SITE_STATE === "live" && (
          <p className="rf-scarcity rf-scarcity-center">
            <span className="rf-skim">Doors close Sunday night.</span>
          </p>
        )}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="rf-footer">
      <div className="rf-wrap rf-footer-inner">
        <span>© The Refuge</span>
        <Link href="/signin" className="rf-footer-link">
          Sign in
        </Link>
        <a href="mailto:hello@therefuge.app" className="rf-footer-link">
          Contact
        </a>
        <span className="rf-footer-fine">
          The Refuge is a meditation practice, not medical or psychological
          treatment.
        </span>
      </div>
    </footer>
  );
}

/* ───────────── Shared bits ───────────── */

function DoorDivider({ stage }: { stage: number }) {
  // Stage 1..7 — door opens slightly wider at each one.
  const width = 1 + stage * 0.8; // 1.8px → 6.6px
  const height = 40 + stage * 8; // 48 → 96
  const opacity = Math.min(0.22 + stage * 0.06, 0.65);
  const blur = Math.min(1 + stage * 0.5, 5);
  return (
    <div
      className="rf-door-divider"
      aria-hidden
      style={{
        width,
        height,
        opacity,
        filter: `blur(${blur}px)`,
      }}
    />
  );
}

function PrimaryAction({
  context,
  liveLabel = "Begin Day 1",
}: {
  context: "hero" | "stack" | "final";
  liveLabel?: string;
}) {
  if (SITE_STATE === "live") {
    return (
      <a className="rf-btn" href={CHECKOUT_URL}>
        {liveLabel}
      </a>
    );
  }

  // Prelaunch — email capture
  const heading =
    context === "hero"
      ? "The door opens soon. Leave your name."
      : context === "stack"
      ? "Get notified when the door opens."
      : "Get notified when the door opens.";

  return <Waitlist heading={heading} buttonLabel="Get notified when the door opens" />;
}

function Waitlist({ heading, buttonLabel }: { heading: string; buttonLabel: string }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handle(e: FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;
    setState("loading");
    try {
      const res = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });
      setState(res.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <p className="rf-waitlist-thanks">
        Thank you. Watch your inbox — the door opens soon.
      </p>
    );
  }

  return (
    <form className="rf-waitlist" onSubmit={handle}>
      <p className="rf-waitlist-heading">{heading}</p>
      <div className="rf-waitlist-row">
        <input
          className="rf-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          aria-label="Your name"
        />
        <input
          className="rf-input"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Your email"
          required
          aria-label="Your email"
        />
        <button
          type="submit"
          className="rf-btn rf-btn-wait"
          disabled={state === "loading"}
        >
          {state === "loading" ? "…" : buttonLabel}
        </button>
      </div>
      {state === "error" && (
        <p className="rf-waitlist-err">Something went quiet. Try once more.</p>
      )}
    </form>
  );
}

/* ───────────── Styles ───────────── */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500&family=Inter:wght@300;400;500;600&display=swap');

.rf{
  --rf-night:#07100b;
  --rf-ember:#E8A04C;
  --rf-ember-soft:#f1bc7c;
  --rf-linen:#EDE6DA;
  --rf-stone:#8A8178;
  --rf-moss:#6B7559;
  --rf-card:rgba(237,230,218,0.04);
  --rf-line:rgba(237,230,218,0.10);

  background:var(--rf-night);
  color:var(--rf-linen);
  font-family:'Inter',-apple-system,system-ui,sans-serif;
  font-weight:400;
  line-height:1.7;
  letter-spacing:0;
  min-height:100vh;
}

/* Reset within scope */
.rf *,
.rf *::before,
.rf *::after{box-sizing:border-box}
.rf p{margin:0 0 1.4em}

/* Layout */
.rf-section{
  position:relative;
  padding:80px 24px;
}
.rf-wrap{
  max-width:1080px;
  margin:0 auto;
}
.rf-narrow{
  max-width:620px;
}

/* Type */
.rf-eyebrow{
  font-family:'Inter',sans-serif;
  font-size:11px;
  letter-spacing:.28em;
  text-transform:uppercase;
  color:var(--rf-stone);
  margin-bottom:28px;
  font-weight:500;
}
.rf-eyebrow-moss{color:#9bac86}

.rf-h1{
  font-family:'Fraunces','Times New Roman',serif;
  font-weight:400;
  font-size:clamp(38px,6vw,68px);
  line-height:1.05;
  letter-spacing:-.01em;
  margin:0 0 28px;
}
.rf-lede{
  font-family:'Fraunces',serif;
  font-weight:300;
  font-size:clamp(19px,2.2vw,24px);
  line-height:1.55;
  color:var(--rf-linen);
  margin:0 0 40px;
  max-width:560px;
}
.rf-body{
  font-size:17px;
  line-height:1.75;
  color:rgba(237,230,218,0.78);
  max-width:60ch;
}
.rf-lede-strong{
  color:var(--rf-linen);
  font-weight:500;
}

/* SKIM path — the ember spans */
.rf-skim{
  color:var(--rf-ember);
  font-weight:500;
  text-shadow:0 0 18px rgba(232,160,76,0.18);
}
.rf-h1 .rf-skim{
  text-shadow:0 0 32px rgba(232,160,76,0.25);
}

.rf-link{
  color:var(--rf-ember-soft);
  text-decoration:underline;
  text-decoration-color:rgba(232,160,76,0.4);
  text-underline-offset:3px;
}
.rf-link:hover{text-decoration-color:var(--rf-ember)}

/* Hero */
.rf-hero{
  min-height:88vh;
  display:flex;
  align-items:center;
  padding-top:120px;
  padding-bottom:120px;
  overflow:hidden;
}
.rf-hero-inner{position:relative;z-index:1}
.rf-door-light{
  position:absolute;
  top:-10%;
  bottom:-10%;
  right:18%;
  width:42px;
  background:linear-gradient(180deg, transparent 0%, var(--rf-ember) 50%, transparent 100%);
  opacity:0.10;
  filter:blur(28px);
  pointer-events:none;
  z-index:0;
}

/* Door dividers — light through a door opening a little more each time */
.rf-door-divider{
  margin:32px auto;
  background:linear-gradient(180deg, transparent, var(--rf-ember), transparent);
  border-radius:2px;
}

/* CTA */
.rf-cta-row{
  margin-top:36px;
  display:flex;
  flex-direction:column;
  gap:12px;
  align-items:flex-start;
}
.rf-cta-center{align-items:center}
.rf-btn{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  background:var(--rf-ember);
  color:#1a0f00;
  font-family:'Inter',sans-serif;
  font-weight:600;
  font-size:15px;
  letter-spacing:.02em;
  padding:16px 30px;
  border-radius:8px;
  border:none;
  cursor:pointer;
  transition:transform .15s ease, background .15s ease, box-shadow .25s ease;
  box-shadow:0 8px 32px -8px rgba(232,160,76,0.4);
  text-decoration:none;
  text-align:center;
}
.rf-btn:hover{
  background:var(--rf-ember-soft);
  transform:translateY(-1px);
  box-shadow:0 14px 40px -10px rgba(232,160,76,0.55);
}
.rf-btn:focus-visible{
  outline:2px solid var(--rf-ember);
  outline-offset:3px;
}
.rf-btn:disabled{opacity:.6;cursor:wait;transform:none}

/* Scarcity */
.rf-scarcity{
  margin-top:16px;
  font-size:13px;
  color:var(--rf-stone);
  letter-spacing:.04em;
}
.rf-scarcity-center{text-align:center}

/* Stack */
.rf-stack{
  margin:24px 0 40px;
  display:flex;
  flex-direction:column;
  gap:0;
}
.rf-stack-item{
  padding:28px 0;
  border-top:1px solid var(--rf-line);
}
.rf-stack-item:last-child{border-bottom:1px solid var(--rf-line)}
.rf-stack-head{
  display:flex;
  justify-content:space-between;
  gap:24px;
  align-items:baseline;
  margin-bottom:10px;
}
.rf-stack-name{
  font-family:'Inter',sans-serif;
  font-size:13px;
  letter-spacing:.18em;
  text-transform:uppercase;
  color:var(--rf-linen);
  font-weight:600;
}
.rf-stack-tag{
  font-family:'Fraunces',serif;
  font-weight:300;
  font-style:italic;
  font-size:15px;
  color:var(--rf-stone);
  margin-top:4px;
}
.rf-stack-price{
  font-family:'Fraunces',serif;
  font-weight:300;
  font-size:20px;
  color:var(--rf-ember-soft);
  white-space:nowrap;
}
.rf-stack-desc{
  font-size:16px;
  line-height:1.7;
  color:rgba(237,230,218,0.72);
  margin:0;
  max-width:58ch;
}
.rf-yours{
  margin-top:32px;
  font-size:14px;
  letter-spacing:.06em;
  color:var(--rf-stone);
}

/* Total + price reveal */
.rf-total{
  margin-top:24px;
  padding:36px 0 0;
  border-top:1px solid var(--rf-line);
}
.rf-total-line{
  display:flex;
  align-items:baseline;
  gap:14px;
  flex-wrap:wrap;
  margin-bottom:8px;
}
.rf-total-strike{
  font-family:'Fraunces',serif;
  font-size:18px;
  color:var(--rf-stone);
  text-decoration:line-through;
}
.rf-total-arrow{color:var(--rf-stone);font-size:14px}
.rf-total-price{
  font-family:'Fraunces',serif;
  font-weight:400;
  font-size:26px;
}
.rf-total-sub{
  font-size:14px;
  color:var(--rf-stone);
  margin:0 0 28px;
}

/* Guarantee — moss */
.rf-moss{
  background:linear-gradient(180deg,
    var(--rf-night) 0%,
    rgba(107,117,89,0.06) 50%,
    var(--rf-night) 100%);
}
.rf-quiet-block{
  margin-top:36px;
  padding:24px 0 0;
  border-top:1px solid var(--rf-line);
}
.rf-quiet{
  font-size:15px;
  color:var(--rf-stone);
  line-height:1.7;
  margin:0;
  max-width:58ch;
}

/* FAQ */
.rf-faq{
  margin-top:8px;
  border-top:1px solid var(--rf-line);
}
.rf-faq-item{
  border-bottom:1px solid var(--rf-line);
}
.rf-faq-q{
  width:100%;
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:16px;
  padding:22px 0;
  background:transparent;
  border:none;
  color:var(--rf-linen);
  font-family:'Fraunces',serif;
  font-size:18px;
  text-align:left;
  cursor:pointer;
  transition:color .15s;
}
.rf-faq-q:hover{color:var(--rf-ember-soft)}
.rf-faq-q:focus-visible{outline:2px solid var(--rf-ember);outline-offset:4px}
.rf-faq-plus{
  font-family:'Inter',sans-serif;
  font-size:22px;
  color:var(--rf-stone);
  font-weight:300;
  width:20px;
  text-align:center;
}
.rf-faq-a{
  padding:0 0 24px;
  font-size:16px;
  color:rgba(237,230,218,0.72);
  line-height:1.7;
  margin:0;
  max-width:58ch;
}

/* Final close — door fully open */
.rf-final{
  padding-top:140px;
  padding-bottom:140px;
  text-align:center;
  position:relative;
  overflow:hidden;
}
.rf-final-glow{
  position:absolute;
  inset:0;
  background:radial-gradient(ellipse 60% 80% at 50% 60%, rgba(232,160,76,0.14), transparent 65%);
  pointer-events:none;
}
.rf-final-inner{position:relative;z-index:1}
.rf-final-body{
  margin:0 auto 1.4em;
  font-family:'Fraunces',serif;
  font-weight:300;
  font-size:clamp(19px,2.2vw,24px);
  color:var(--rf-linen);
  max-width:520px;
}
.rf-final-line{
  font-size:clamp(24px,3.4vw,36px);
  font-weight:400;
  margin-top:1.2em;
}

/* Waitlist (prelaunch) */
.rf-waitlist{
  display:flex;
  flex-direction:column;
  gap:14px;
  max-width:520px;
  width:100%;
}
.rf-waitlist-heading{
  margin:0 0 4px;
  font-family:'Fraunces',serif;
  font-size:17px;
  font-style:italic;
  color:var(--rf-linen);
}
.rf-waitlist-row{
  display:flex;
  flex-direction:column;
  gap:10px;
}
.rf-input{
  background:var(--rf-card);
  border:1px solid var(--rf-line);
  border-radius:8px;
  padding:14px 16px;
  font-family:'Inter',sans-serif;
  font-size:15px;
  color:var(--rf-linen);
  width:100%;
  transition:border-color .15s;
}
.rf-input::placeholder{color:var(--rf-stone)}
.rf-input:focus{
  outline:none;
  border-color:var(--rf-ember);
  background:rgba(237,230,218,0.06);
}
.rf-btn-wait{width:100%}
.rf-waitlist-thanks{
  font-family:'Fraunces',serif;
  font-style:italic;
  font-size:18px;
  color:var(--rf-ember-soft);
  margin:0;
}
.rf-waitlist-err{
  margin:0;
  font-size:13px;
  color:#c98a6f;
}

/* Footer */
.rf-footer{
  padding:48px 24px;
  border-top:1px solid var(--rf-line);
  font-size:12px;
  color:var(--rf-stone);
}
.rf-footer-inner{
  display:flex;
  flex-wrap:wrap;
  align-items:center;
  gap:18px;
}
.rf-footer-link{
  color:var(--rf-stone);
  text-decoration:none;
  transition:color .15s;
}
.rf-footer-link:hover{color:var(--rf-linen)}
.rf-footer-fine{
  flex-basis:100%;
  margin-top:8px;
  font-size:11px;
  opacity:0.7;
}

/* Larger screens */
@media (min-width: 720px){
  .rf-section{padding:120px 32px}
  .rf-hero{padding-top:160px;padding-bottom:160px}
  .rf-waitlist-row{flex-direction:row;gap:8px}
  .rf-input{flex:1}
  .rf-btn-wait{width:auto;white-space:nowrap}
  .rf-door-light{right:24%;width:60px}
}

/* Respect prefers-reduced-motion */
@media (prefers-reduced-motion: reduce){
  .rf-btn{transition:none}
  .rf-btn:hover{transform:none}
}
`;
