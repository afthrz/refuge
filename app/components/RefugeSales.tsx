"use client";

import { useState } from "react";
import Link from "next/link";
import {
  SITE_STATE,
  FOUNDING_SEATS_REMAINING,
  REGULAR_PRICE,
  doorOpen,
  currentPrice,
  closesLabel,
} from "@/app/lib/site-config";

/* ============================================================
   THE REFUGE — sales page (Refuge green/cream design)
   Full $100M Offers structure. Skim path = the .rg-skim spans.
   ============================================================ */

export default function RefugeSales() {
  const [buying, setBuying] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [stackOpen, setStackOpen] = useState(false);

  const open = doorOpen();
  const price = currentPrice();
  const closes = closesLabel();

  async function handleBuy() {
    setBuying(true);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const { url, error } = await res.json();
      if (error) {
        alert(error);
        setBuying(false);
        return;
      }
      if (url) window.location.href = url;
    } catch {
      setBuying(false);
    }
  }

  const goStack = () =>
    document.getElementById("stack")?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="rg">
        {/* NAV */}
        <nav className="rg-nav">
          <a className="rg-brand" href="#top">
            <span className="rg-dot" />
            <span>Refuge</span>
          </a>
          <div className="rg-nav-right">
            <Link className="rg-nav-link" href="/signin">
              Sign in
            </Link>
            <button className="rg-nav-cta" onClick={goStack}>
              Begin
            </button>
          </div>
        </nav>

        {/* HERO */}
        <section className="rg-hero" id="top">
          <div className="rg-hero-grid">
            <div className="rg-hero-copy">
              <div className="rg-eyebrow">A 21-day guided path · Monk Samarn</div>
              <h1 className="rg-h1">
                <span className="rg-skim">Come home to yourself.</span>
              </h1>
              <p className="rg-lede">
                The quiet kind of healing.{" "}
                <span className="rg-skim">Ten minutes a day, for 21 days.</span>{" "}
                Sitting upright, eyes closed, guided by one voice. No experience
                needed — if your mind wanders, you&apos;re doing it right.
              </p>
              <div className="rg-cta-col">
                <button className="rg-btn" onClick={goStack} disabled={buying}>
                  Begin Day 1 <span className="rg-arrow">→</span>
                </button>
                {SITE_STATE === "live" && (
                  <p className="rg-scarcity">
                    {open ? (
                      <>
                        The door closes {closes} · {FOUNDING_SEATS_REMAINING}{" "}
                        founding seats remaining
                      </>
                    ) : (
                      <>The founding window has closed · now ${REGULAR_PRICE}</>
                    )}
                  </p>
                )}
              </div>
            </div>

            <figure className="rg-portrait">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/monk-portrait.png"
                alt="Monk Samarn seated beneath a banyan tree"
              />
              <div className="rg-portrait-vig" aria-hidden />
              <figcaption className="rg-portrait-cap">
                Monk Samarn · your guide
              </figcaption>
            </figure>
          </div>
        </section>

        {/* PAIN — cream */}
        <section className="rg-sec rg-light">
          <div className="rg-narrow">
            <div className="rg-eyebrow rg-eyebrow-dark">
              For the one still carrying it
            </div>
            <p className="rg-body">
              You&apos;ve been carrying it for a while now. Maybe it&apos;s a
              person. Maybe it&apos;s a version of you that ended. Maybe
              it&apos;s the weight of holding everything together for everyone
              else.
            </p>
            <p className="rg-body">
              People say &ldquo;give it time.&rdquo; You did. Time alone
              didn&apos;t do it.
            </p>
            <p className="rg-body">
              You don&apos;t need more advice. You need a place to set it down
              for ten minutes. That&apos;s what this is.
            </p>
          </div>
        </section>

        {/* REFRAME — dark */}
        <section className="rg-sec">
          <div className="rg-narrow">
            <div className="rg-eyebrow">
              &ldquo;But I can&apos;t meditate&rdquo;
            </div>
            <p className="rg-body">
              Good. You&apos;re exactly who this was built for.
            </p>
            <p className="rg-body">
              The Refuge has one rule: a wandering mind is not failure. Noticing
              you wandered, and gently coming back — that&apos;s the entire
              practice. Every return is one rep.{" "}
              <span className="rg-skim">You cannot do it wrong here.</span>
            </p>
            <p className="rg-body">
              And you don&apos;t have to believe in any of it for it to work.
              Your breath works without your permission. It has been keeping you
              alive all this time without being asked. We&apos;re just going to
              sit with it, on a chair, eyes closed, ten minutes.
            </p>
          </div>
        </section>

        {/* BRAIN — cream (moved up: the proof, before the timeline) */}
        <section className="rg-sec rg-light">
          <div className="rg-brain-grid">
            <figure className="rg-brain-figure">
              <BrainGlyph />
              <div className="rg-brain-legend">
                <span>
                  <i className="rg-dot-hip" /> Hippocampus · memory — grows
                  denser ↑
                </span>
                <span>
                  <i className="rg-dot-amy" /> Amygdala · stress alarm — thins ↓
                </span>
              </div>
            </figure>

            <div className="rg-brain-copy">
              <div className="rg-eyebrow rg-eyebrow-dark">
                What the scans show
              </div>
              <h2 className="rg-h2 rg-h2-dark">
                The same quiet practice.<br />
                <em>Seen from inside the skull.</em>
              </h2>
              <p className="rg-body">
                After eight weeks of practice, the change is visible on an MRI.
                In a Harvard / MGH study, grey matter grew{" "}
                <span className="rg-skim">denser in the hippocampus</span> — the
                seat of learning and memory — while it thinned in the amygdala,
                the brain&apos;s stress alarm, in step with how much calmer
                people reported feeling.
              </p>
              <p className="rg-body">
                Those studies ran eight weeks. Twenty-one days is where the
                habit takes root — the daily ten minutes that gets you there.
              </p>
              <div className="rg-cite">
                <a
                  className="rg-link"
                  href="https://www.sciencedirect.com/science/article/abs/pii/S092549271000288X"
                  target="_blank"
                  rel="noopener"
                >
                  Hölzel et al., Harvard / MGH (2011)
                </a>
                <a
                  className="rg-link"
                  href="https://www.nyu.edu/about/news-publications/news/2022/november/short-meditation-program-improves-cognitive-and-emotional-well-.html"
                  target="_blank"
                  rel="noopener"
                >
                  Dwyer et al., NYU (2022)
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* TIMELINE — dark, with forest photo */}
        <section className="rg-sec">
          <div className="rg-split">
            <div className="rg-split-copy">
              <div className="rg-eyebrow">What to expect, honestly</div>
              <p className="rg-body">
                <strong className="rg-strong">Your first week:</strong> you
                start catching your own mind during the day. Mid-spiral,
                mid-replay — you notice sooner, instead of surfacing an hour
                later still tangled.{" "}
                <span className="rg-skim">
                  The first shift arrives in week one.
                </span>{" "}
                It feels small. It&apos;s the whole skill.
              </p>
              <p className="rg-body">
                <strong className="rg-strong">By Day 21:</strong> a pause opens
                between what happens and how you respond. The 2 a.m. replay
                loses its grip. You become a person who tends to their own mind.
              </p>
              <p className="rg-body">
                <strong className="rg-strong">
                  What daily practice builds toward:
                </strong>{" "}
                this isn&apos;t mystical.{" "}
                <span className="rg-skim">
                  Real research, measurable results.
                </span>{" "}
                In a{" "}
                <a
                  className="rg-link"
                  href="https://www.nyu.edu/about/news-publications/news/2022/november/short-meditation-program-improves-cognitive-and-emotional-well-.html"
                  target="_blank"
                  rel="noopener"
                >
                  randomized NYU study
                </a>
                , about 13 minutes of daily meditation lowered anxiety, lifted
                mood, and sharpened attention — in people who had never
                meditated — over 8 weeks of practice. Twenty-one days is where
                the habit takes root. The science is what it grows into.
              </p>
            </div>
            <figure className="rg-split-figure">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/images/monk-forest.png"
                alt="Monk Samarn at the forest temple"
              />
              <div className="rg-portrait-vig" aria-hidden />
            </figure>
          </div>
        </section>

        {/* STACK / PRICE — dark. Price + CTA lead; the value stack collapses below. */}
        <section className="rg-sec" id="stack">
          <div className="rg-narrow">
            <div className="rg-eyebrow">Begin when you&apos;re ready</div>

            {/* Price card — the first thing you see when you tap Begin Day 1 */}
            <div className="rg-pricecard">
              <div className="rg-total-line">
                <span className="rg-total-strike">$288 value</span>
                <span className="rg-total-arrow">→</span>
                <span className="rg-total-now">
                  <span className="rg-skim">Today: ${price}, once.</span>
                </span>
              </div>
              <p className="rg-total-sub">
                Everything below, yours for life. One ten-minute sit a day —
                less than a single therapy session, for twenty-one guided ones.
              </p>
              <button
                className="rg-btn rg-btn-full"
                onClick={handleBuy}
                disabled={buying}
              >
                {buying ? (
                  "Opening checkout…"
                ) : (
                  <>
                    Step inside — ${price} <span className="rg-arrow">→</span>
                  </>
                )}
              </button>
              <div className="rg-foot-line">
                Secure checkout · Apple Pay · No subscription · 30-day refund
              </div>
            </div>

            {/* Collapsible value stack */}
            <button
              className="rg-stack-toggle"
              onClick={() => setStackOpen((o) => !o)}
              aria-expanded={stackOpen}
            >
              <span>
                {stackOpen ? "Hide the details" : "See everything included"}
                <span className="rg-stack-toggle-count"> · 5 things, $288 value</span>
              </span>
              <span className="rg-stack-toggle-chev">{stackOpen ? "–" : "+"}</span>
            </button>

            {stackOpen && (
              <div className="rg-stack-reveal">
                <div className="rg-stack">
                  {STACK.map((it) => (
                    <div className="rg-stack-item" key={it.name}>
                      <div className="rg-stack-head">
                        <div>
                          <div className="rg-stack-name">{it.name}</div>
                          {it.tag && <div className="rg-stack-tag">{it.tag}</div>}
                        </div>
                        <div className="rg-stack-price">{it.price}</div>
                      </div>
                      <p className="rg-stack-desc">{it.desc}</p>
                    </div>
                  ))}
                </div>
                <p className="rg-body rg-yours">
                  <strong className="rg-strong">YOURS FOR GOOD</strong> — not a
                  subscription. Everything stays yours.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* GUARANTEE — moss */}
        <section className="rg-sec rg-moss">
          <div className="rg-narrow">
            <div className="rg-eyebrow rg-eyebrow-moss">
              The Homecoming Guarantee
            </div>
            <p className="rg-body rg-body-bright">
              Sit with all 21 days. If by the end you don&apos;t feel the
              beginning of a shift — more noticing, more space, more quiet —
              reply to any email and{" "}
              <span className="rg-skim">I&apos;ll refund you in full.</span> No
              forms, no questions.
            </p>
            <p className="rg-body rg-body-bright">
              You risk ten minutes a day. The rest is on me.
            </p>

            {SITE_STATE === "live" && open && (
              <div className="rg-quiet-block">
                <p className="rg-quiet">
                  The founding door is open until{" "}
                  <span className="rg-skim">{closes}</span>. Begin before it
                  closes and your price — ${currentPrice()} — is locked for
                  life. After that, it rises to ${REGULAR_PRICE}, and the next
                  opening hasn&apos;t been set.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* FAQ — dark */}
        <section className="rg-sec">
          <div className="rg-narrow">
            <div className="rg-eyebrow">Quiet questions</div>
            <div className="rg-faq">
              {FAQ.map((it, i) => (
                <div
                  className={`rg-faq-item ${openFaq === i ? "open" : ""}`}
                  key={it.q}
                >
                  <button
                    className="rg-faq-q"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    aria-expanded={openFaq === i}
                  >
                    <span>{it.q}</span>
                    <span className="rg-faq-plus" aria-hidden>
                      {openFaq === i ? "–" : "+"}
                    </span>
                  </button>
                  {openFaq === i && <p className="rg-faq-a">{it.a}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL — dark */}
        <section className="rg-sec rg-final">
          <div className="rg-narrow rg-final-inner">
            <p className="rg-final-body">
              You&apos;ve spent a long time being strong for everyone else.
            </p>
            <p className="rg-final-body">
              This is ten minutes a day that belongs to you. Twenty-one days. A
              chair, your breath, and a voice that knows the way back.
            </p>
            <p className="rg-final-body rg-final-line">The door is open.</p>
            <button className="rg-btn" onClick={handleBuy} disabled={buying}>
              {buying ? "Opening checkout…" : "Begin Day 1"}{" "}
              {!buying && <span className="rg-arrow">→</span>}
            </button>
            {SITE_STATE === "live" && open && (
              <p className="rg-scarcity rg-scarcity-center">
                <span className="rg-skim">The door closes {closes}.</span>
              </p>
            )}
          </div>
        </section>

        {/* FOOTER */}
        <footer className="rg-footer">
          <div className="rg-foot-inner">
            <span>© The Refuge</span>
            <a href="mailto:hello@therefuge.app" className="rg-foot-link">
              Contact
            </a>
            <Link href="/signin" className="rg-foot-link">
              Sign in
            </Link>
            <span className="rg-foot-fine">
              The Refuge is a meditation practice, not medical or psychological
              treatment.
            </span>
          </div>
        </footer>
      </div>
    </>
  );
}

/* ───────────── Data ───────────── */

const STACK = [
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
    desc:
      "Built for the 2 a.m. replay. Instead of fighting the thoughts, you're guided past them.",
  },
  {
    name: "THE OPEN DOOR",
    tag: "14 sessions for life after the path",
    price: "$67",
    desc:
      "Unlocked when you finish Day 21. Sessions for real moments: the morning of a hard day, after an argument, the anniversary, the relapse day when the old weight visits. The path is 21 days; this carries you toward week eight, where the research says the deeper changes live.",
  },
];

const FAQ = [
  {
    q: "Is this therapy?",
    a: "No. The Refuge is a meditation practice, not treatment for grief, trauma, or a mental health condition. It sits beautifully alongside therapy. If you're in crisis, please reach for professional support first.",
  },
  {
    q: "I've failed at meditation apps before.",
    a: "Most apps hand you a library and wish you luck. This is a path: one session a day, in order, with a voice that expects your mind to wander. Wandering is the practice here.",
  },
  {
    q: "Do I have to sit on the floor?",
    a: "No. A chair is perfect. Upright, dignified, eyes closed. Ten minutes.",
  },
  {
    q: "Is this religious?",
    a: "Monk Samarn draws from a contemplative tradition, but the practice is open to anyone. No belief required. Just sitting.",
  },
  {
    q: "What if I miss a day?",
    a: "You resume where you left off. The door doesn't lock.",
  },
];

/* ───────────── Brain illustration (inline SVG, animated scan) ───────────── */

function BrainGlyph() {
  return (
    <svg
      className="rg-brain-svg"
      viewBox="0 0 240 210"
      fill="none"
      role="img"
      aria-label="Stylised brain with the hippocampus and amygdala highlighted"
    >
      <defs>
        <clipPath id="rgBrainClip">
          <path d="M70 152 C40 152 30 122 42 106 C30 94 36 72 54 68 C56 48 78 40 94 50 C104 38 128 38 138 52 C160 46 182 58 182 80 C200 86 202 112 186 124 C194 142 178 160 156 154 C148 168 122 170 112 156 C98 166 78 164 70 152 Z" />
        </clipPath>
        <linearGradient id="rgScan" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3d5a32" stopOpacity="0" />
          <stop offset="50%" stopColor="#7d9070" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#3d5a32" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* outer brain */}
      <path
        d="M70 152 C40 152 30 122 42 106 C30 94 36 72 54 68 C56 48 78 40 94 50 C104 38 128 38 138 52 C160 46 182 58 182 80 C200 86 202 112 186 124 C194 142 178 160 156 154 C148 168 122 170 112 156 C98 166 78 164 70 152 Z"
        stroke="#3d5a32"
        strokeWidth="1.6"
        opacity="0.9"
      />
      {/* central fissure */}
      <path d="M114 52 C112 80 116 106 112 156" stroke="#3d5a32" strokeWidth="1.2" opacity="0.5" />
      {/* gyri */}
      <path d="M64 80 C80 76 86 94 76 102 C90 104 92 122 78 126" stroke="#3d5a32" strokeWidth="1.1" opacity="0.45" />
      <path d="M150 66 C140 78 154 88 148 100 C162 102 158 122 146 124" stroke="#3d5a32" strokeWidth="1.1" opacity="0.45" />
      <path d="M96 72 C92 88 104 94 98 110 C92 122 102 134 96 146" stroke="#3d5a32" strokeWidth="1.1" opacity="0.4" />
      <path d="M132 72 C136 88 126 98 132 112 C138 126 128 136 134 148" stroke="#3d5a32" strokeWidth="1.1" opacity="0.4" />
      {/* brainstem */}
      <path d="M110 156 C108 170 112 182 120 190" stroke="#3d5a32" strokeWidth="1.4" opacity="0.6" />

      {/* scan sweep, clipped to the brain */}
      <g clipPath="url(#rgBrainClip)">
        <rect x="28" y="0" width="186" height="14" fill="url(#rgScan)">
          <animate attributeName="y" values="36;160;36" dur="5s" repeatCount="indefinite" />
        </rect>
      </g>

      {/* hippocampus — memory — grows (green) */}
      <circle cx="138" cy="126" r="18" fill="#5f7a4f" opacity="0.14" />
      <circle cx="138" cy="126" r="5.5" fill="#5f7a4f" />
      <circle cx="138" cy="126" r="5.5" fill="#5f7a4f" opacity="0.5">
        <animate attributeName="r" values="5.5;13;5.5" dur="3.4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;0;0.5" dur="3.4s" repeatCount="indefinite" />
      </circle>

      {/* amygdala — stress — thins (copper) */}
      <circle cx="92" cy="122" r="14" fill="#c69a6d" opacity="0.12" />
      <circle cx="92" cy="122" r="4.5" fill="#c69a6d" />
      <circle cx="92" cy="122" r="4.5" fill="#c69a6d" opacity="0.4">
        <animate attributeName="r" values="4.5;9;4.5" dur="3.4s" begin="1.2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.4;0;0.4" dur="3.4s" begin="1.2s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

/* ───────────── Styles ───────────── */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Inter:wght@400;500;600&display=swap');

.rg{
  --bg:#0a1610;--bg-deep:#081210;--cream:#f3ede0;--cream-dim:#c8c1b1;
  --sage:#b8c7a4;--sage-deep:#7d9070;--copper:#c69a6d;--gold:#e6c489;
  --line:rgba(243,237,224,.12);--line-strong:rgba(243,237,224,.22);
  --serif:'Cormorant Garamond',Georgia,serif;--sans:'Inter',-apple-system,system-ui,sans-serif;
  background:var(--bg);color:var(--cream);font-family:var(--serif);line-height:1.7;min-height:100vh;
}
.rg *,.rg *::before,.rg *::after{box-sizing:border-box}
.rg p{margin:0 0 1.3em}
.rg-sec{position:relative;padding:90px 24px}
.rg-narrow{max-width:640px;margin:0 auto}

.rg-nav{position:fixed;top:0;left:0;right:0;z-index:50;padding:20px 28px;display:flex;align-items:center;justify-content:space-between;background:rgba(10,22,16,.72);backdrop-filter:blur(12px);border-bottom:1px solid var(--line)}
.rg-brand{display:inline-flex;align-items:center;gap:10px;font-family:var(--serif);font-style:italic;font-size:20px;font-weight:500;color:var(--cream);text-decoration:none}
.rg-dot{width:8px;height:8px;border-radius:50%;background:var(--sage);box-shadow:0 0 14px 2px rgba(184,199,164,.5)}
.rg-nav-right{display:flex;align-items:center;gap:22px}
.rg-nav-link{font-family:var(--sans);font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:var(--cream-dim);text-decoration:none}
.rg-nav-link:hover{color:var(--cream)}
.rg-nav-cta{font-family:var(--sans);font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:var(--cream);background:none;border:1px solid var(--line-strong);border-radius:999px;padding:9px 18px;cursor:pointer;transition:background .2s,border-color .2s}
.rg-nav-cta:hover{background:rgba(184,199,164,.1);border-color:var(--sage)}

.rg-eyebrow{font-family:var(--sans);font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:var(--sage);margin-bottom:26px;font-weight:500;display:block}
.rg-eyebrow-dark{color:#3d5a32}
.rg-eyebrow-moss{color:#9bac86}
.rg-h1{font-family:var(--serif);font-weight:400;font-size:clamp(44px,7vw,86px);line-height:1.02;letter-spacing:-.01em;margin:0 0 26px}
.rg-h2{font-family:var(--serif);font-weight:400;font-size:clamp(30px,4vw,52px);line-height:1.06;margin:0 0 24px}
.rg-h2-dark{color:#10261a}
.rg-h2 em{font-style:italic;color:var(--sage-deep)}
.rg-h2-dark em{color:#3d5a32}
.rg-lede{font-family:var(--serif);font-weight:300;font-size:clamp(20px,2.2vw,26px);line-height:1.5;color:var(--cream);margin:0 0 36px;max-width:560px}
.rg-body{font-family:var(--serif);font-size:clamp(18px,2vw,21px);line-height:1.7;color:rgba(243,237,224,.82);max-width:60ch}
.rg-body-bright{color:var(--cream)}
.rg-strong{color:var(--cream);font-weight:500}
.rg-link{color:var(--sage);text-decoration:underline;text-decoration-color:rgba(184,199,164,.4);text-underline-offset:3px}
.rg-link:hover{text-decoration-color:var(--sage)}
.rg-skim{color:var(--gold);font-weight:500;text-shadow:0 0 18px rgba(230,196,137,.2)}
.rg-h1 .rg-skim{text-shadow:0 0 34px rgba(230,196,137,.28)}

.rg-light{background:var(--cream);color:#1f2e23}
.rg-light .rg-body{color:#23332a;font-weight:500}
.rg-light .rg-skim{color:#2d4a25;font-weight:600;text-shadow:none}
.rg-light .rg-link{color:#3d5a32;text-decoration-color:rgba(61,90,50,.4)}
.rg-moss{background:linear-gradient(180deg,var(--bg) 0%,rgba(107,117,89,.10) 50%,var(--bg) 100%)}

.rg-cta-col{display:flex;flex-direction:column;gap:14px;align-items:flex-start;margin-top:8px}
.rg-btn{display:inline-flex;align-items:center;gap:12px;background:var(--sage);color:#0e1c12;font-family:var(--sans);font-weight:600;font-size:13px;letter-spacing:.14em;text-transform:uppercase;padding:16px 34px;border-radius:999px;border:none;cursor:pointer;transition:transform .15s,background .2s,box-shadow .25s;box-shadow:0 14px 40px -16px rgba(184,199,164,.6)}
.rg-btn:hover:not(:disabled){background:#cbd9b7;transform:translateY(-1px)}
.rg-btn:disabled{opacity:.7;cursor:wait}
.rg-btn-full{width:100%;justify-content:center;margin-top:30px}
.rg-arrow{display:inline-block;transition:transform .25s}
.rg-btn:hover .rg-arrow{transform:translateX(4px)}
.rg-scarcity{font-family:var(--sans);font-size:12px;letter-spacing:.04em;color:var(--cream-dim);margin:6px 0 0}
.rg-scarcity-center{margin-top:18px}

.rg-hero{padding:150px 24px 110px}
.rg-hero-grid{max-width:1180px;margin:0 auto;display:grid;grid-template-columns:1fr;gap:44px;align-items:center}
.rg-hero-copy{order:2}
.rg-portrait{order:1;position:relative;margin:0;border-radius:8px;overflow:hidden;aspect-ratio:4/5;background:#0e1a14;box-shadow:0 70px 90px -50px rgba(0,0,0,.8),0 0 0 1px var(--line)}
.rg-portrait img{width:100%;height:100%;object-fit:cover;object-position:center 18%;display:block}
.rg-portrait-vig{position:absolute;inset:0;pointer-events:none;background:linear-gradient(180deg,transparent 50%,rgba(10,22,16,.7) 100%)}
.rg-portrait-cap{position:absolute;left:22px;bottom:18px;font-family:var(--sans);font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:var(--cream);opacity:.9}

.rg-split{max-width:1080px;margin:0 auto;display:grid;grid-template-columns:1fr;gap:48px;align-items:center}
.rg-split-figure{position:relative;margin:0;border-radius:8px;overflow:hidden;aspect-ratio:4/5;background:#0e1a14;box-shadow:0 60px 80px -50px rgba(0,0,0,.8),0 0 0 1px var(--line)}
.rg-split-figure img{width:100%;height:100%;object-fit:cover;display:block}

.rg-brain-grid{max-width:1020px;margin:0 auto;display:grid;grid-template-columns:1fr;gap:36px;align-items:center}
.rg-brain-figure{margin:0;display:flex;flex-direction:column;align-items:center;gap:18px}
.rg-brain-svg{width:min(300px,78%);height:auto}
.rg-brain-legend{display:flex;flex-direction:column;gap:8px;font-family:var(--sans);font-size:12px;letter-spacing:.02em;color:#3a4a3e}
.rg-brain-legend span{display:flex;align-items:center;gap:9px}
.rg-dot-amy,.rg-dot-hip{width:9px;height:9px;border-radius:50%;display:inline-block;flex-shrink:0}
.rg-dot-amy{background:#c69a6d}
.rg-dot-hip{background:#5f7a4f}
.rg-cite{display:flex;flex-wrap:wrap;gap:18px;margin-top:8px;font-family:var(--sans);font-size:12px;letter-spacing:.02em}

.rg-stack-intro{color:var(--cream);font-weight:500;margin-bottom:6px}
.rg-stack{margin:22px 0 36px}
.rg-stack-item{padding:26px 0;border-top:1px solid var(--line)}
.rg-stack-item:last-child{border-bottom:1px solid var(--line)}
.rg-stack-head{display:flex;justify-content:space-between;gap:20px;align-items:baseline;margin-bottom:10px}
.rg-stack-name{font-family:var(--sans);font-size:13px;letter-spacing:.16em;text-transform:uppercase;color:var(--cream);font-weight:600}
.rg-stack-tag{font-family:var(--serif);font-style:italic;font-size:16px;color:var(--cream-dim);margin-top:4px}
.rg-stack-price{font-family:var(--serif);font-size:22px;color:var(--sage);white-space:nowrap}
.rg-stack-desc{font-family:var(--serif);font-size:17px;line-height:1.65;color:rgba(243,237,224,.74);margin:0;max-width:58ch}
.rg-yours{margin-top:30px;font-family:var(--sans);font-size:13px;letter-spacing:.04em;color:var(--cream-dim)}
.rg-pricecard{margin-top:8px;padding:36px 32px;border:1px solid var(--line-strong);border-radius:12px;background:linear-gradient(180deg,rgba(184,199,164,.05),rgba(184,199,164,.01))}
.rg-stack-toggle{margin-top:18px;width:100%;display:flex;align-items:center;justify-content:space-between;gap:14px;padding:18px 22px;background:none;border:1px solid var(--line);border-radius:10px;cursor:pointer;font-family:var(--sans);font-size:13px;letter-spacing:.06em;color:var(--cream);transition:border-color .2s,background .2s}
.rg-stack-toggle:hover{border-color:var(--sage);background:rgba(184,199,164,.05)}
.rg-stack-toggle-count{color:var(--cream-dim)}
.rg-stack-toggle-chev{font-size:20px;color:var(--sage);line-height:1}
.rg-stack-reveal{animation:rgReveal .4s ease}
@keyframes rgReveal{from{opacity:0;transform:translateY(-6px)}to{opacity:1;transform:translateY(0)}}
.rg-total{margin-top:22px;padding:34px 0 0;border-top:1px solid var(--line)}
.rg-total-line{display:flex;align-items:baseline;gap:14px;flex-wrap:wrap;margin-bottom:8px}
.rg-total-strike{font-family:var(--serif);font-size:20px;color:var(--cream-dim);text-decoration:line-through;text-decoration-color:rgba(198,154,109,.7)}
.rg-total-arrow{color:var(--cream-dim)}
.rg-total-now{font-family:var(--serif);font-size:28px}
.rg-total-sub{font-family:var(--serif);font-size:15px;color:var(--cream-dim);margin:0 0 4px}
.rg-foot-line{margin-top:16px;text-align:center;font-family:var(--sans);font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--cream-dim)}

.rg-quiet-block{margin-top:34px;padding:22px 0 0;border-top:1px solid var(--line)}
.rg-quiet{font-family:var(--serif);font-size:16px;color:var(--cream-dim);line-height:1.7;margin:0;max-width:58ch}

.rg-faq{margin-top:6px;border-top:1px solid var(--line)}
.rg-faq-item{border-bottom:1px solid var(--line)}
.rg-faq-q{width:100%;display:flex;justify-content:space-between;align-items:center;gap:16px;padding:22px 0;background:none;border:none;color:var(--cream);font-family:var(--serif);font-size:20px;text-align:left;cursor:pointer;transition:color .15s}
.rg-faq-q:hover{color:var(--sage)}
.rg-faq-plus{font-family:var(--sans);font-size:22px;color:var(--cream-dim);width:20px;text-align:center}
.rg-faq-a{padding:0 0 24px;font-family:var(--serif);font-size:17px;color:rgba(243,237,224,.74);line-height:1.7;margin:0;max-width:58ch}

.rg-final{text-align:center;padding-top:130px;padding-bottom:140px;position:relative;overflow:hidden}
.rg-final::before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse 60% 80% at 50% 55%,rgba(184,199,164,.10),transparent 65%);pointer-events:none}
.rg-final-inner{position:relative}
.rg-final-body{font-family:var(--serif);font-weight:300;font-size:clamp(20px,2.4vw,26px);color:var(--cream);max-width:520px;margin:0 auto 1.3em}
.rg-final-line{font-size:clamp(28px,4vw,42px);font-weight:400;margin-top:1em;margin-bottom:1.4em}

.rg-footer{background:var(--bg-deep);border-top:1px solid var(--line);padding:48px 24px;font-family:var(--sans);font-size:12px;color:var(--cream-dim)}
.rg-foot-inner{max-width:1080px;margin:0 auto;display:flex;flex-wrap:wrap;align-items:center;gap:18px}
.rg-foot-link{color:var(--cream-dim);text-decoration:none}
.rg-foot-link:hover{color:var(--cream)}
.rg-foot-fine{flex-basis:100%;margin-top:8px;font-size:11px;opacity:.75}

@media (min-width:840px){
  .rg-sec{padding:130px 32px}
  .rg-hero{padding:170px 32px 130px}
  .rg-hero-grid{grid-template-columns:1.1fr .9fr;gap:72px}
  .rg-hero-copy{order:1}
  .rg-portrait{order:2;max-height:80vh}
  .rg-split{grid-template-columns:1.15fr .85fr;gap:64px}
  .rg-brain-grid{grid-template-columns:.85fr 1.15fr;gap:56px}
  .rg-brain-svg{width:100%}
}
@media (prefers-reduced-motion:reduce){
  .rg-btn{transition:none}
  .rg-btn:hover{transform:none}
  .rg-brain-svg animate{display:none}
}
`;
