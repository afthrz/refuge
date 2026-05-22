"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient, hasSupabaseConfig } from "@/app/lib/supabase";

export default function LandingPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [buying, setBuying] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!hasSupabaseConfig()) { setChecking(false); return; }
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        const { data: purchase } = await supabase
          .from("purchases").select("id").eq("user_id", user.id).maybeSingle();
        if (purchase) { router.replace("/course/slowing-down"); return; }
      }
      setChecking(false);
    });
  }, [router]);

  useEffect(() => {
    if (checking) return;
    const nav = navRef.current;
    const handleScroll = () => nav?.classList.toggle("scrolled", window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });

    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach(el => io.observe(el));

    type H = () => void;
    const faqHandlers: Array<{ el: Element; handler: H }> = [];
    document.querySelectorAll(".lp-faq-item").forEach(item => {
      const q = item.querySelector(".lp-faq-q");
      const a = item.querySelector<HTMLElement>(".lp-faq-a");
      if (!q || !a) return;
      const handler = () => {
        const open = item.classList.toggle("open");
        a.style.maxHeight = open ? a.scrollHeight + "px" : "0px";
      };
      q.addEventListener("click", handler);
      faqHandlers.push({ el: q, handler });
    });
    const first = document.querySelector<HTMLElement>(".lp-faq-item");
    if (first) {
      first.classList.add("open");
      const fa = first.querySelector<HTMLElement>(".lp-faq-a");
      if (fa) requestAnimationFrame(() => { fa.style.maxHeight = fa.scrollHeight + "px"; });
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      io.disconnect();
      faqHandlers.forEach(({ el, handler }) => el.removeEventListener("click", handler));
    };
  }, [checking]);

  useEffect(() => {
    if (checking) return;
    const wave = document.getElementById("wave");
    if (!wave) return;
    const N = 64;
    let seed = 7;
    const rand = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    for (let i = 0; i < N; i++) {
      const t = i / N;
      const env = Math.sin(t * Math.PI) * 0.7 + 0.3;
      const h = env * (0.4 + rand() * 0.6);
      const bar = document.createElement("i");
      bar.style.height = (10 + h * 44) + "px";
      bar.classList.add("coming");
      wave.appendChild(bar);
    }
    let playing = false, progress = 0, raf = 0;
    const btn = document.getElementById("playBtn");
    const tCur = document.getElementById("tCur");
    const fmt = (s: number) => { s = Math.max(0, Math.floor(s)); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); };
    const step = () => {
      progress += 1 / 60 * 1.5;
      const idx = Math.floor((progress / 30) * N);
      [...wave.children].forEach((b, i) => { b.classList.toggle("played", i <= idx); b.classList.toggle("coming", i > idx); });
      if (tCur) tCur.textContent = fmt(progress);
      if (progress > 642) progress = 0;
      if (playing) raf = requestAnimationFrame(step);
    };
    const handlePlay = () => {
      playing = !playing;
      if (btn) btn.innerHTML = playing
        ? `<svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/></svg>`
        : `<svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M8 5v14l11-7z"/></svg>`;
      if (playing) step(); else cancelAnimationFrame(raf);
    };
    btn?.addEventListener("click", handlePlay);
    return () => {
      btn?.removeEventListener("click", handlePlay);
      cancelAnimationFrame(raf);
      while (wave.firstChild) wave.removeChild(wave.firstChild);
    };
  }, [checking]);

  async function handleBuy() {
    setBuying(true);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const { url, error } = await res.json();
      if (error) { alert(error); setBuying(false); return; }
      if (url) window.location.href = url;
    } catch { setBuying(false); }
  }

  function scrollTo(id: string) {
    return (e: React.MouseEvent) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); };
  }

  if (checking) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      <nav className="lp-nav" id="nav" ref={navRef}>
        <a className="lp-brand" href="#top">
          <span className="lp-dot" />
          <span>Refuge</span>
        </a>
        <div className="lp-nav-right">
          <a className="lp-nav-link" href="#course" onClick={scrollTo("course")}>The course</a>
          <a className="lp-nav-link" href="#teacher" onClick={scrollTo("teacher")}>Teacher</a>
          <a className="lp-nav-link" href="#voices" onClick={scrollTo("voices")}>Voices</a>
          <a className="lp-nav-signin" href="/signin">Sign in</a>
          <button className="lp-nav-cta" onClick={scrollTo("pricing")}>Begin · $29</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="lp-hero" id="top">
        <div className="lp-hero-inner">
          <div className="lp-hero-copy">
            <div className="lp-eyebrow">A 21-day journey with Monk Samarn</div>
            <h1>Slow down.<br /><span className="lp-it">Actually</span> slow down.</h1>
            <p className="lp-lede" style={{ marginTop: 32, maxWidth: 560 }}>
              Daily meditations that teach you to breathe, rest, and return to yourself —{" "}
              <em style={{ fontStyle: "italic" }}>even when life won&apos;t stop</em>. No experience needed.
            </p>
            <div className="lp-hero-cta-row">
              <button className="lp-btn-primary" onClick={scrollTo("pricing")}>Begin for $29 <span className="lp-arrow">→</span></button>
              <div className="lp-guarantee">$29 one-time <span>·</span> Lifetime access <span>·</span> 30-day refund</div>
              <a href="/signin" className="lp-hero-signin">Already have access? Sign in →</a>
            </div>
          </div>
          <div className="lp-hero-portrait">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/monk-portrait.png" alt="Monk Samarn seated beneath a banyan tree" />
            <div className="lp-vignette" />
            <div className="lp-portrait-label">Monk Samarn · Your teacher</div>
          </div>
        </div>
        <div className="lp-scroll-cue"><span>Scroll</span><span className="lp-scroll-line" /></div>
      </section>

      {/* QUIET */}
      <section className="lp-quiet">
        <p className="reveal">
          &ldquo;You don&apos;t need more discipline. You don&apos;t need another app that gamifies your nervous system.
          You need <em className="lp-it">somewhere quiet</em> to come home to — and someone to walk you there.&rdquo;
        </p>
        <div className="lp-sig">— Monk Samarn</div>
      </section>

      {/* PROBLEM */}
      <section className="lp-light">
        <div className="lp-problem-head reveal">
          <div className="lp-eyebrow lp-eyebrow-dark">If you&apos;re reading this</div>
          <h2 style={{ marginTop: 28, color: "#10261a", fontFamily: "var(--lp-serif)", fontSize: "clamp(32px,5.2vw,70px)", lineHeight: 1.02, fontWeight: 400 }}>
            You&apos;re not broken.<br />You&apos;re just <em className="lp-it-green">running too fast</em>.
          </h2>
          <p className="lp-lede lp-lede-dark" style={{ marginTop: 32, maxWidth: 680, marginLeft: "auto", marginRight: "auto" }}>
            Most meditation tries to fix you. Slowing Down doesn&apos;t. It simply gives your mind a place to land — for ten minutes a day, for twenty-one days.
          </p>
        </div>
        <div className="lp-problem-grid">
          {[
            ["01 — The mind", <>Your thoughts <em className="lp-it-green">won&apos;t stop</em>.</>, "You wake up already behind. You finish the day with a head full of tabs. The practice teaches your mind to settle — not by force, but by familiarity."],
            ["02 — The body", <>Your body <em className="lp-it-green">forgets how to rest</em>.</>, "Tight shoulders. Shallow breath. Sleep that doesn't restore. Each session helps the nervous system remember what 'safe' feels like."],
            ["03 — The day", <>The hours feel <em className="lp-it-green">borrowed</em>.</>, "You're inside the day instead of moving through it. The 21 days give the hours back to you — quietly, without ceremony."],
          ].map(([num, title, desc]) => (
            <div key={num as string} className="lp-problem-card reveal">
              <div className="lp-pcard-num">{num}</div>
              <h3 className="lp-pcard-h">{title}</h3>
              <p className="lp-pcard-p">{desc as string}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TEACHER */}
      <section className="lp-teacher" id="teacher">
        <div className="lp-teacher-grid">
          <div className="lp-teacher-portrait reveal">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/monk-forest.png" alt="Monk Samarn at the forest temple" />
            <div className="lp-vignette" />
            <div className="lp-portrait-caption">Monk Samarn · Northern Thailand, 2024</div>
          </div>
          <div className="lp-teacher-copy reveal">
            <div className="lp-eyebrow">Your teacher</div>
            <h2 style={{ marginTop: 24, fontFamily: "var(--lp-serif)", fontSize: "clamp(28px,3.6vw,54px)", lineHeight: 1.1, fontWeight: 400, color: "var(--lp-cream)" }}>
              A monk who has spent <span className="lp-it">forty years</span> doing nothing in particular.
            </h2>
            <p className="lp-lede" style={{ marginTop: 32 }}>
              Monk Samarn trained in the Theravāda forest tradition and has guided thousands of beginners — from CEOs to nurses to recovering insomniacs — through a practice he calls{" "}
              <em style={{ fontStyle: "italic", color: "var(--lp-sage)" }}>&ldquo;the art of not chasing.&rdquo;</em>
            </p>
            <p className="lp-lede" style={{ marginTop: 18 }}>
              No incense required. No experience. No belief in anything except the possibility that ten quiet minutes can change a day.
            </p>
            <div className="lp-teacher-stats">
              {[
                ["Theravāda", "Forest tradition"],
                ["Secular", "No belief required"],
                ["10 min", "All you need"],
              ].map(([n, l]) => (
                <div key={l} className="lp-stat">
                  <div className="lp-stat-n" style={{ fontSize: 22, fontFamily: "var(--lp-serif)", fontStyle: "italic", fontWeight: 400 }}>{n}</div>
                  <div className="lp-stat-l">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CURRICULUM */}
      <section className="lp-curriculum" id="course">
        <div className="lp-curr-head reveal">
          <div className="lp-eyebrow lp-eyebrow-dark">What you&apos;ll do</div>
          <h2 style={{ marginTop: 28 }}>Twenty-one days.<br /><em className="lp-it-green">Ten minutes</em> each.</h2>
          <p className="lp-lede lp-lede-dark" style={{ marginTop: 32, maxWidth: 640, marginLeft: "auto", marginRight: "auto" }}>
            Three weeks. Three movements. Each builds quietly on the last — so by day 21, slowing down is something your body remembers on its own.
          </p>
        </div>
        <div className="lp-weeks">
          {[
            { tag: "Week 1 · Days 1–7", title: <>Arriving in <em>the body</em></>, desc: "We start where the breath already is. Short sessions to soften the shoulders, slow the breath, and end the day with something other than your phone.", days: [["Day 1","The first quiet minute"],["Day 3","Breathing without trying"],["Day 5","Where the shoulders live"],["Day 7","A different way to fall asleep"]] },
            { tag: "Week 2 · Days 8–14", title: <>Meeting <em>the mind</em></>, desc: "The thoughts don't go away — but you learn how to sit beside them. Lessons on noticing, naming, and letting the loud things become small things.", days: [["Day 8","The thought is not the thinker"],["Day 10","Watching the storm pass"],["Day 12","The space between thoughts"],["Day 14","Forgiving the inner critic"]] },
            { tag: "Week 3 · Days 15–21", title: <>Coming <em>home</em></>, desc: "Practice meets life. Short integrations for hard mornings, crowded trains, and the moments you'd usually reach for distraction.", days: [["Day 15","Stillness in a moving body"],["Day 17","Meditation for the difficult day"],["Day 19","A small practice you'll keep"],["Day 21","The road that begins now"]] },
          ].map((w, i) => (
            <div key={i} className="lp-week reveal">
              <div className="lp-week-tag">{w.tag}</div>
              <h3 className="lp-week-h">{w.title}</h3>
              <p className="lp-week-desc">{w.desc}</p>
              <ul className="lp-week-list">
                {w.days.map(([d, t]) => <li key={d}><span className="lp-day-num">{d}</span><span className="lp-day-title">{t}</span></li>)}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* SESSION */}
      <section className="lp-session">
        <div className="lp-session-inner">
          <div className="lp-session-copy reveal">
            <div className="lp-eyebrow">A sample of day three</div>
            <h2 style={{ marginTop: 22, fontFamily: "var(--lp-serif)", fontSize: "clamp(32px,4vw,64px)", lineHeight: 1.02, fontWeight: 400, color: "var(--lp-cream)" }}>Hear it<br /><em className="lp-it">before you buy.</em></h2>
            <p className="lp-lede" style={{ marginTop: 32, maxWidth: 480 }}>
              Press play. This is the same voice that will walk with you, every morning, for three weeks. If something in you settles — even slightly — you&apos;ll know.
            </p>
            <div className="lp-session-meta">
              <span>Length<b>10:42</b></span>
              <span>Voice<b>Monk Samarn</b></span>
              <span>Music<b>Soft ambient</b></span>
            </div>
          </div>
          <div className="lp-player reveal">
            <div className="lp-player-eyebrow">Day 03 · Free preview</div>
            <h3 className="lp-player-h">Breathing without trying.</h3>
            <div className="lp-player-day">A meditation on letting the breath breathe you</div>
            <div className="lp-wave" id="wave" />
            <div className="lp-player-controls">
              <div className="lp-time"><span id="tCur">0:00</span> <span style={{ opacity: 0.4 }}>/ 10:42</span></div>
              <button className="lp-play-btn" id="playBtn" aria-label="Play sample">
                <svg viewBox="0 0 24 24" fill="currentColor" width={22} height={22}><path d="M8 5v14l11-7z" /></svg>
              </button>
              <div className="lp-time" style={{ textAlign: "right", opacity: 0.6 }}>- 10:42</div>
            </div>
          </div>
        </div>
      </section>

      {/* INCLUDED */}
      <section className="lp-included">
        <div className="lp-included-head reveal">
          <div className="lp-eyebrow">What&apos;s inside</div>
          <h2 style={{ marginTop: 28, fontFamily: "var(--lp-serif)", fontSize: "clamp(32px,4.5vw,70px)", lineHeight: 1.02, fontWeight: 400, color: "var(--lp-cream)" }}>Everything you need.<br /><em className="lp-it">Nothing you don&apos;t.</em></h2>
        </div>
        <div className="lp-included-grid">
          {[
            ["01", <>21 guided <em>audio</em> sessions</>, "10–15 minutes each. Recorded in the temple at sunrise, mastered for headphones."],
            ["02", <>A printable <em>journey companion</em></>, "A small PDF — one page per day, one quiet question to sit with."],
            ["03", <>Three <em>&ldquo;hard day&rdquo;</em> meditations</>, "For the mornings after no sleep, the moment before the meeting, the long ride home."],
            ["04", <>Lifetime <em>access</em>, any device</>, "Web, mobile, offline downloads. No subscription. No ads. No notifications."],
            ["05", <>Two ambient <em>soundscapes</em></>, "Bonus tracks — temple rain, and a single bowl rung over forty minutes."],
            ["06", <>A quiet <em>guarantee</em></>, "Try it for thirty days. If it doesn't soften something, we'll return your $29 without a single question."],
          ].map(([num, title, desc]) => (
            <div key={num as string} className="lp-inc-item reveal">
              <div className="lp-inc-num">{num}</div>
              <div><h4 className="lp-inc-h">{title}</h4><p className="lp-inc-p">{desc as string}</p></div>
            </div>
          ))}
        </div>
      </section>

      {/* SCIENCE */}
      <section className="lp-voices" id="voices">
        <div className="lp-voices-head reveal">
          <div className="lp-eyebrow lp-eyebrow-dark">What the research shows</div>
          <h2 style={{ marginTop: 24 }}>Ten minutes a day.<br /><em className="lp-it-green">Measurable change.</em></h2>
          <p className="lp-lede lp-lede-dark" style={{ marginTop: 24 }}>
            Decades of peer-reviewed research confirm what meditators have always known — a consistent practice reshapes how the brain and body respond to stress.
          </p>
        </div>
        <div className="lp-testimonials">
          {[
            {
              dark: true,
              label: "Stress & anxiety",
              source: "Harvard Medical School",
              finding: "Regular mindfulness meditation reduces activity in the amygdala — the brain's threat-detection centre — leading to measurably lower cortisol and a calmer baseline response to daily stress.",
            },
            {
              dark: false,
              label: "Sleep quality",
              source: "JAMA Internal Medicine",
              finding: "A landmark randomised trial found that mindfulness meditation significantly improved sleep quality in adults with moderate sleep problems, outperforming sleep hygiene education alone.",
            },
            {
              dark: true,
              label: "Brain structure",
              source: "Massachusetts General Hospital",
              finding: "MRI studies show that just eight weeks of daily meditation produces measurable increases in grey matter density in regions associated with self-awareness, compassion, and attention.",
            },
          ].map((t, i) => (
            <div key={i} className={`lp-tcard ${t.dark ? "lp-tcard-dark" : "lp-tcard-light"} reveal`}>
              <div className="lp-sci-label">{t.label}</div>
              <q className="lp-tcard-q">{t.finding}</q>
              <div className="lp-byline">— {t.source}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section className="lp-pricing" id="pricing">
        <div className="lp-pricing-inner reveal">
          <div className="lp-eyebrow lp-eyebrow-no-rule">Begin when you&apos;re ready</div>
          <h2 style={{ marginTop: 24, fontFamily: "var(--lp-serif)", fontSize: "clamp(32px,4.5vw,70px)", lineHeight: 1.02, fontWeight: 400, color: "var(--lp-cream)" }}>
            One quiet price.<br /><span className="lp-it">Yours for life.</span>
          </h2>
          <div className="lp-price-card">
            <div className="lp-price-top">
              <div className="lp-price-name">Slowing Down</div>
            </div>
            <div className="lp-price-amount">
              <div className="lp-price-big">$29</div>
              <div className="lp-price-once">One-time<br />lifetime access</div>
            </div>
            <ul className="lp-price-list">
              {["21 guided audio sessions", "3 \"hard day\" meditations + 2 soundscapes", "Printable journey companion", "Web, iOS, Android — offline ready", "30-day, no-questions refund"].map(item => <li key={item}>{item}</li>)}
            </ul>
            <button className="lp-btn-primary lp-btn-full" onClick={handleBuy} disabled={buying}>
              {buying ? "Opening checkout…" : <>{`Begin for $29`} <span className="lp-arrow">→</span></>}
            </button>
            <div className="lp-price-foot">Secure checkout <span>·</span> Apple Pay <span>·</span> No subscription</div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="lp-faq">
        <div className="lp-faq-inner">
          <div className="lp-eyebrow lp-eyebrow-no-rule" style={{ display: "block", textAlign: "center" }}>A few common questions</div>
          <h2 style={{ marginTop: 24, textAlign: "center", fontFamily: "var(--lp-serif)", fontSize: "clamp(32px,4.5vw,64px)", fontWeight: 400, color: "var(--lp-cream)" }}>Before you begin.</h2>
          <p className="lp-lede" style={{ textAlign: "center", color: "var(--lp-cream-dim)", marginTop: 16 }}>The quiet kind of doubts that tend to come up.</p>
          <div className="lp-faq-list">
            {[
              ["I've never meditated. Is this for me?", "Especially for you. Slowing Down was built for the person who has tried before and stopped. No experience is assumed; the only requirement is ten minutes and a pair of headphones."],
              ["What if I miss a day?", "You miss a day. There are no streaks, no nudges, no guilt notifications. The sessions are yours for life — you can return tomorrow, or next month. The practice waits."],
              ["Is this religious?", "No. Monk Samarn is a Buddhist monk by ordination, but Slowing Down is a secular practice. There is no chanting, no doctrine, no asking you to believe anything. Just attention and breath."],
              ["How is this different from Calm or Headspace?", "Those are libraries. This is a single, deliberate path. One voice, twenty-one days, in order. You pay once. We will never send you a push notification or ask you to upgrade."],
              ["Refund policy?", "Thirty days from purchase. Email us one line — \"it wasn't for me\" — and your $29 is returned the same day, no questions, no exit survey."],
              ["Does it work offline?", "Yes. The app caches each session on first play, so you can practice on a plane, in a forest, in any place without a signal. Which, ideally, is the point."],
            ].map(([q, a]) => (
              <div key={q} className="lp-faq-item">
                <button className="lp-faq-q">{q} <span className="lp-plus" /></button>
                <div className="lp-faq-a"><div className="lp-faq-a-inner">{a}</div></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINALE */}
      <section className="lp-finale">
        <div className="lp-finale-inner reveal">
          <div className="lp-eyebrow lp-eyebrow-no-rule">Three weeks from today</div>
          <h2 className="lp-finale-h">
            You&apos;ll either be<br />where you are now —<br /><span className="lp-it">or somewhere quieter.</span>
          </h2>
          <p className="lp-lede" style={{ marginTop: 32, maxWidth: 600, marginLeft: "auto", marginRight: "auto" }}>
            That&apos;s the only thing twenty-one days can promise. But it&apos;s not nothing.
          </p>
          <div style={{ marginTop: 48 }}>
            <button className="lp-btn-primary" onClick={handleBuy} disabled={buying}>
              {buying ? "Opening checkout…" : <>{`Begin for $29`} <span className="lp-arrow">→</span></>}
            </button>
          </div>
          <div className="lp-guarantee" style={{ marginTop: 18 }}>Lifetime access <span>·</span> 30-day refund <span>·</span> No subscription</div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="lp-footer">
        <div className="lp-foot-inner">
          <a className="lp-brand" href="#top"><span className="lp-dot" /><span>Refuge</span></a>
          <div className="lp-foot-links">
            <a href="mailto:hello@therefuge.app">Contact</a>
            <a href="/signin">Sign in</a>
          </div>
        </div>
        <div className="lp-foot-bot">
          <span>© 2026 Refuge. <em>Made slowly</em> with Monk Samarn.</span>
          <span>therefuge.app · hello@therefuge.app</span>
        </div>
      </footer>
    </>
  );
}

const css = `
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500;1,600&display=swap');
:root{--lp-bg:#0a1610;--lp-cream:#f3ede0;--lp-cream-dim:#c8c1b1;--lp-sage:#b8c7a4;--lp-sage-deep:#7d9070;--lp-copper:#c69a6d;--lp-line:rgba(243,237,224,.12);--lp-line-strong:rgba(243,237,224,.22);--lp-serif:'Cormorant Garamond',Georgia,serif}
body{background:var(--lp-bg)}
.lp-nav{position:fixed;top:0;left:0;right:0;z-index:50;padding:22px 32px;display:flex;align-items:center;justify-content:space-between;transition:background .4s,border-color .4s;border-bottom:1px solid transparent}
.lp-nav.scrolled{background:rgba(10,22,16,.78);backdrop-filter:blur(14px);border-bottom-color:var(--lp-line)}
.lp-brand{display:inline-flex;align-items:center;gap:10px;font-family:var(--lp-serif);font-style:italic;font-size:22px;font-weight:500;color:var(--lp-cream);text-decoration:none}
.lp-dot{width:8px;height:8px;border-radius:50%;background:var(--lp-sage);box-shadow:0 0 14px 2px rgba(184,199,164,.5);display:inline-block}
.lp-nav-right{display:flex;align-items:center;gap:28px;font-family:var(--lp-serif);font-size:12px;letter-spacing:.28em;text-transform:uppercase;color:var(--lp-cream-dim)}
.lp-nav-link{color:inherit;text-decoration:none;background:none;border:none;cursor:pointer;font-family:var(--lp-serif);font-size:12px;letter-spacing:.28em;text-transform:uppercase}
.lp-nav-link:hover{color:var(--lp-cream)}
.lp-nav-cta{padding:10px 18px;border:1px solid var(--lp-line-strong);border-radius:999px;color:var(--lp-cream);background:none;cursor:pointer;font-family:var(--lp-serif);font-size:12px;letter-spacing:.28em;text-transform:uppercase;transition:background .2s,border-color .2s}
.lp-nav-cta:hover{background:rgba(184,199,164,.1);border-color:var(--lp-sage)}
.lp-nav-signin{color:var(--lp-cream-dim);text-decoration:none;font-family:var(--lp-serif);font-size:12px;letter-spacing:.2em;text-transform:uppercase;transition:color .2s}
.lp-nav-signin:hover{color:var(--lp-cream)}
.lp-hero-signin{font-family:var(--lp-serif);font-size:13px;color:var(--lp-cream-dim);text-decoration:none;letter-spacing:.06em;transition:color .2s;margin-top:4px}
.lp-hero-signin:hover{color:var(--lp-sage)}
.lp-eyebrow{font-family:var(--lp-serif);font-weight:500;font-size:12px;letter-spacing:.32em;text-transform:uppercase;color:var(--lp-sage);display:inline-flex;align-items:center;gap:.7em}
.lp-eyebrow::before{content:"";width:18px;height:1px;background:currentColor;opacity:.6}
.lp-eyebrow-dark{color:#3d5a32}.lp-eyebrow-no-rule::before{display:none}
.lp-it{font-style:italic;color:var(--lp-sage)}.lp-it-green{font-style:italic;color:#2d4a25;font-weight:600}
.lp-lede{font-family:var(--lp-serif);font-size:clamp(18px,1.6vw,24px);line-height:1.55;color:var(--lp-cream-dim);font-weight:300;margin:0}
.lp-lede-dark{color:#1f2e23;font-weight:500}
.lp-btn-primary{display:inline-flex;align-items:center;gap:14px;background:var(--lp-sage);color:#0e1c12;font-family:var(--lp-serif);font-weight:500;letter-spacing:.18em;text-transform:uppercase;font-size:13px;padding:18px 36px;border-radius:999px;border:none;cursor:pointer;white-space:nowrap;transition:transform .2s,background .2s,box-shadow .3s;box-shadow:0 0 0 1px rgba(255,255,255,.04),0 30px 60px -30px rgba(184,199,164,.5)}
.lp-btn-primary:hover:not(:disabled){background:#cbd9b7;transform:translateY(-1px)}.lp-btn-primary:disabled{opacity:.7;cursor:default}
.lp-btn-full{width:100%;justify-content:center;margin-top:32px}
.lp-arrow{display:inline-block;transition:transform .25s}.lp-btn-primary:hover .lp-arrow{transform:translateX(4px)}
.lp-guarantee{font-family:'Inter',-apple-system,sans-serif;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--lp-cream-dim);line-height:1.8;text-align:center}
.lp-guarantee span{opacity:.5;margin:0 .4em}
.lp-hero{min-height:100vh;padding:140px 32px 120px;position:relative;overflow:hidden;isolation:isolate;display:flex;align-items:center}
.lp-hero::before{content:"";position:absolute;inset:0;background:radial-gradient(55% 60% at 70% 50%,rgba(198,154,109,.22),transparent 70%),radial-gradient(40% 40% at 20% 30%,rgba(184,199,164,.08),transparent 70%);z-index:-1}
.lp-hero::after{content:"";position:absolute;inset:0;background:radial-gradient(120% 80% at 50% 100%,rgba(0,0,0,.55),transparent 60%);z-index:-1}
.lp-hero h1{font-family:var(--lp-serif);font-size:clamp(46px,6.4vw,112px);line-height:1.02;letter-spacing:-.025em;font-weight:400;margin:32px 0 0;color:var(--lp-cream)}
.lp-hero-inner{max-width:1320px;margin:0 auto;width:100%;display:grid;grid-template-columns:1.1fr .9fr;gap:80px;align-items:center}
.lp-hero-cta-row{margin-top:44px;display:flex;flex-direction:column;align-items:flex-start;gap:14px}
.lp-hero-portrait{position:relative;border-radius:8px;overflow:hidden;aspect-ratio:3/4;background:#0e1a14;box-shadow:0 80px 100px -50px rgba(0,0,0,.75),0 0 0 1px var(--lp-line);max-height:78vh}
.lp-hero-portrait img{width:100%;height:100%;object-fit:cover;object-position:center 18%}
.lp-vignette{position:absolute;inset:0;background:linear-gradient(180deg,transparent 50%,rgba(10,22,16,.7) 100%),linear-gradient(90deg,rgba(10,22,16,.35) 0%,transparent 30%);pointer-events:none}
.lp-portrait-label{position:absolute;left:24px;bottom:22px;font-family:var(--lp-serif);font-size:11px;letter-spacing:.3em;text-transform:uppercase;color:var(--lp-cream);opacity:.85;display:flex;align-items:center;gap:10px}
.lp-portrait-label::before{content:"";width:6px;height:6px;border-radius:50%;background:var(--lp-sage);box-shadow:0 0 10px rgba(184,199,164,.7)}
.lp-scroll-cue{position:absolute;bottom:36px;left:50%;transform:translateX(-50%);font-family:var(--lp-serif);font-size:11px;letter-spacing:.32em;text-transform:uppercase;color:var(--lp-cream-dim);display:flex;flex-direction:column;align-items:center;gap:14px;opacity:.7}
.lp-scroll-line{width:1px;height:48px;background:linear-gradient(to bottom,transparent,var(--lp-sage));animation:lpPulse 2.4s ease-in-out infinite;display:block}
@keyframes lpPulse{0%,100%{opacity:.3;transform:scaleY(.6);transform-origin:top}50%{opacity:1;transform:scaleY(1)}}
.lp-quiet{padding:140px 32px;text-align:center;background:var(--lp-bg);border-top:1px solid var(--lp-line);border-bottom:1px solid var(--lp-line)}
.lp-quiet p{font-family:var(--lp-serif);font-style:italic;font-size:clamp(22px,3.2vw,40px);line-height:1.35;color:var(--lp-cream);max-width:920px;margin:0 auto;font-weight:300}
.lp-sig{margin-top:36px;font-family:var(--lp-serif);font-size:12px;letter-spacing:.3em;text-transform:uppercase;color:var(--lp-sage-deep)}
.lp-light{background:var(--lp-cream);color:#1c2a20;padding:140px 0 160px}
.lp-problem-head{max-width:880px;margin:0 auto;text-align:center;padding:0 32px}
.lp-problem-grid{margin:96px auto 0;display:grid;grid-template-columns:repeat(3,1fr);gap:48px;padding:0 32px;max-width:1240px}
.lp-problem-card{position:relative;padding:40px 0 0}
.lp-pcard-num{font-family:var(--lp-serif);font-size:12px;letter-spacing:.3em;text-transform:uppercase;color:#3d5a32;font-weight:600;padding-top:24px;border-top:1px solid rgba(28,42,32,.18)}
.lp-pcard-h{font-family:var(--lp-serif);font-size:26px;font-weight:400;color:#10261a;margin:24px 0 0}
.lp-pcard-p{margin-top:18px;color:#1f2e23;font-size:17px;line-height:1.65;font-weight:500;font-family:var(--lp-serif)}
.lp-teacher{background:linear-gradient(180deg,var(--lp-bg) 0%,#081210 100%);padding:160px 0;border-top:1px solid var(--lp-line)}
.lp-teacher-grid{display:grid;grid-template-columns:1.05fr 1fr;gap:88px;align-items:center;max-width:1240px;margin:0 auto;padding:0 32px}
.lp-teacher-portrait{position:relative;border-radius:6px;overflow:hidden;aspect-ratio:3/4.2;background:#0e1a14;box-shadow:0 60px 80px -40px rgba(0,0,0,.7),0 0 0 1px var(--lp-line)}
.lp-teacher-portrait img{width:100%;height:100%;object-fit:cover;object-position:center top}
.lp-portrait-caption{position:absolute;left:24px;bottom:22px;font-family:var(--lp-serif);font-size:11px;letter-spacing:.3em;text-transform:uppercase;color:var(--lp-cream);opacity:.85}
.lp-teacher-stats{margin-top:48px;display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid var(--lp-line)}
.lp-stat{padding:24px 12px 0 0}
.lp-stat-n{font-family:'Inter',-apple-system,sans-serif;font-size:38px;line-height:1;color:var(--lp-cream);font-weight:300;letter-spacing:-.02em}
.lp-stat-l{margin-top:10px;font-family:var(--lp-serif);font-size:11px;letter-spacing:.26em;text-transform:uppercase;color:var(--lp-sage-deep)}
.lp-curriculum{background:var(--lp-cream);color:#1c2a20;padding:160px 0 180px}
.lp-curr-head{text-align:center;max-width:780px;margin:0 auto;padding:0 32px}
.lp-curr-head h2{font-family:var(--lp-serif);font-size:clamp(32px,5.2vw,70px);line-height:1.02;font-weight:400;color:#10261a}
.lp-weeks{margin:96px auto 0;display:grid;grid-template-columns:repeat(3,1fr);gap:32px;padding:0 32px;max-width:1240px}
.lp-week{background:#fff;border-radius:8px;padding:40px 32px;position:relative;overflow:hidden;box-shadow:0 1px 0 rgba(16,38,26,.06),0 30px 60px -36px rgba(16,38,26,.32);border:1px solid rgba(16,38,26,.08);display:flex;flex-direction:column}
.lp-week::before{content:"";position:absolute;left:0;top:0;width:100%;height:4px;background:linear-gradient(90deg,#3d5a32 0%,#7d9070 100%)}
.lp-week:nth-child(2)::before{background:linear-gradient(90deg,#4a6b3e 0%,#c69a6d 100%)}
.lp-week:nth-child(3)::before{background:linear-gradient(90deg,#c69a6d 0%,#3d5a32 100%)}
.lp-week-tag{font-family:var(--lp-serif);font-size:11px;letter-spacing:.3em;text-transform:uppercase;color:#3d5a32;font-weight:600}
.lp-week-h{font-family:var(--lp-serif);margin-top:10px;color:#10261a;font-size:28px;line-height:1.15;font-weight:400}
.lp-week-h em{color:#7d9070;font-weight:400}
.lp-week-desc{margin-top:18px;color:#1f2e23;font-size:16px;line-height:1.6;font-weight:500;font-family:var(--lp-serif)}
.lp-week-list{margin:28px 0 0;padding:0;list-style:none;border-top:1px solid rgba(16,38,26,.1)}
.lp-week-list li{display:flex;gap:14px;padding:14px 0;border-bottom:1px solid rgba(16,38,26,.08);font-size:16px;color:#1c2a20;font-weight:500;font-family:var(--lp-serif)}
.lp-week-list li:last-child{border-bottom:0}
.lp-day-num{font-family:var(--lp-serif);font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#3d5a32;font-weight:600;min-width:46px;padding-top:3px}
.lp-day-title{font-style:italic;color:#0e1a13;font-weight:600}
.lp-session{padding:160px 0 180px;background:linear-gradient(180deg,#0e1d15 0%,#142a1d 60%,#0e1d15 100%);border-top:1px solid var(--lp-line);position:relative;overflow:hidden}
.lp-session::before{content:"";position:absolute;inset:0;background:radial-gradient(50% 60% at 80% 50%,rgba(198,154,109,.18),transparent 70%),radial-gradient(40% 40% at 10% 20%,rgba(184,199,164,.08),transparent 70%);pointer-events:none}
.lp-session-inner{position:relative;max-width:1240px;margin:0 auto;padding:0 32px;display:grid;grid-template-columns:1fr 1fr;gap:88px;align-items:center}
.lp-session-meta{margin-top:40px;display:flex;gap:36px;font-family:var(--lp-serif);font-size:12px;letter-spacing:.24em;text-transform:uppercase;color:var(--lp-sage)}
.lp-session-meta span b{display:block;margin-top:8px;font-weight:500;font-family:var(--lp-serif);font-size:20px;letter-spacing:0;text-transform:none;color:var(--lp-cream)}
.lp-player{background:linear-gradient(160deg,#f3ede0 0%,#e8e1d0 100%);border-radius:14px;padding:40px;border:1px solid rgba(16,38,26,.1);box-shadow:0 60px 90px -40px rgba(0,0,0,.6),inset 0 1px 0 rgba(255,255,255,.6);position:relative;overflow:hidden}
.lp-player::after{content:"";position:absolute;right:-30%;top:-30%;width:60%;height:80%;background:radial-gradient(circle,rgba(198,154,109,.22),transparent 60%);pointer-events:none}
.lp-player-eyebrow{font-family:var(--lp-serif);font-size:11px;letter-spacing:.3em;text-transform:uppercase;color:#3d5a32;font-weight:600}
.lp-player-h{font-family:var(--lp-serif);font-style:italic;font-size:32px;line-height:1.2;color:#10261a;font-weight:500;margin:14px 0 0}
.lp-player-day{margin-top:8px;font-family:var(--lp-serif);font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:#3a4a3e;font-weight:500}
.lp-wave{margin-top:36px;display:flex;align-items:flex-end;gap:3px;height:54px;position:relative;z-index:2}
.lp-wave i{display:block;flex:1;background:linear-gradient(to top,rgba(61,90,50,.4),rgba(61,90,50,.95));border-radius:1px;transition:opacity .3s}
.lp-wave i.played{opacity:1}.lp-wave i.coming{opacity:.3}
.lp-player-controls{margin-top:28px;display:flex;align-items:center;justify-content:space-between;position:relative;z-index:2}
.lp-time{font-family:'Inter',-apple-system,sans-serif;font-size:13px;letter-spacing:.08em;color:#3a4a3e;font-weight:400;font-variant-numeric:tabular-nums}
.lp-play-btn{width:60px;height:60px;border-radius:50%;background:#10261a;color:var(--lp-cream);display:grid;place-items:center;border:none;cursor:pointer;box-shadow:0 0 0 8px rgba(16,38,26,.08),0 10px 20px -8px rgba(16,38,26,.5);transition:transform .2s}
.lp-play-btn:hover{transform:scale(1.05)}
.lp-included{background:#081210;padding:140px 0 160px;border-top:1px solid var(--lp-line)}
.lp-included-head{max-width:680px;padding:0 32px;margin:0 auto;text-align:center}
.lp-included-grid{margin:80px auto 0;max-width:1240px;padding:0 32px;display:grid;grid-template-columns:repeat(2,1fr);gap:0;border-top:1px solid var(--lp-line)}
.lp-inc-item{padding:36px 36px 36px 0;border-bottom:1px solid var(--lp-line);display:grid;grid-template-columns:60px 1fr;gap:24px;align-items:start}
.lp-inc-item:nth-child(even){padding-left:48px;border-left:1px solid var(--lp-line)}
.lp-inc-num{font-family:var(--lp-serif);font-size:12px;letter-spacing:.28em;color:var(--lp-sage-deep);padding-top:6px}
.lp-inc-h{font-family:var(--lp-serif);font-size:20px;color:var(--lp-cream);font-weight:400;margin:0 0 8px}
.lp-inc-h em{color:var(--lp-sage);font-weight:400}
.lp-inc-p{color:var(--lp-cream-dim);font-size:16px;margin:0;line-height:1.6;font-family:var(--lp-serif)}
.lp-voices{background:var(--lp-cream);color:#1c2a20;padding:160px 0 180px}
.lp-voices-head{max-width:780px;margin:0 auto;padding:0 32px;text-align:center}
.lp-voices-head h2{font-family:var(--lp-serif);font-size:clamp(28px,4vw,64px);line-height:1.02;font-weight:400;color:#10261a}
.lp-testimonials{margin:88px auto 0;display:grid;grid-template-columns:repeat(3,1fr);gap:32px;padding:0 32px;max-width:1240px}
.lp-tcard{padding:40px 36px;border-radius:6px;position:relative;display:flex;flex-direction:column}
.lp-tcard-dark{background:#10261a;color:var(--lp-cream)}.lp-tcard-light{background:#fff;color:#1c2a20;box-shadow:0 30px 50px -40px rgba(16,38,26,.25);border:1px solid rgba(16,38,26,.06)}
.lp-stars{display:flex;gap:3px;color:var(--lp-copper);font-size:14px;letter-spacing:.2em}
.lp-tcard-q{display:block;font-family:var(--lp-serif);font-size:20px;line-height:1.45;font-weight:300;margin-top:22px;flex:1;quotes:'"' '"'}
.lp-tcard-q::before{content:open-quote}.lp-tcard-q::after{content:close-quote}
.lp-tcard-dark .lp-tcard-q{color:#e8e3d6}.lp-tcard-light .lp-tcard-q{color:#13201a;font-weight:500}
.lp-byline{margin-top:28px;font-family:var(--lp-serif);font-size:13px;letter-spacing:.16em;font-style:italic}
.lp-tcard-dark .lp-byline{color:var(--lp-sage)}.lp-tcard-light .lp-byline{color:#3d5a32;font-weight:500}
.lp-sci-label{font-family:'Inter',-apple-system,sans-serif;font-size:10px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;color:var(--lp-sage);margin-bottom:4px}
.lp-pricing{background:var(--lp-bg);padding:160px 0 180px;position:relative;overflow:hidden;border-top:1px solid var(--lp-line)}
.lp-pricing::before{content:"";position:absolute;inset:0;background:radial-gradient(50% 60% at 50% 60%,rgba(198,154,109,.15),transparent 70%),radial-gradient(40% 30% at 50% 0%,rgba(184,199,164,.08),transparent 70%)}
.lp-pricing-inner{position:relative;max-width:760px;margin:0 auto;padding:0 32px;text-align:center}
.lp-price-card{margin:64px auto 0;max-width:540px;background:linear-gradient(180deg,rgba(243,237,224,.04),rgba(243,237,224,.01));border:1px solid var(--lp-line-strong);border-radius:12px;padding:48px 44px;text-align:left;backdrop-filter:blur(8px)}
.lp-price-top{display:flex;align-items:baseline;justify-content:space-between;padding-bottom:24px;border-bottom:1px solid var(--lp-line)}
.lp-price-name{font-family:var(--lp-serif);font-style:italic;font-size:28px;color:var(--lp-cream)}
.lp-price-badge{font-family:var(--lp-serif);font-size:11px;letter-spacing:.28em;text-transform:uppercase;color:var(--lp-copper);padding:6px 12px;border:1px solid var(--lp-copper);border-radius:999px}
.lp-price-amount{margin-top:28px;display:flex;align-items:baseline;gap:14px}
.lp-price-big{font-family:'Inter',-apple-system,sans-serif;font-size:80px;line-height:1;color:var(--lp-cream);font-weight:200;letter-spacing:-.04em}
.lp-price-strike{font-family:'Inter',-apple-system,sans-serif;font-size:22px;color:var(--lp-cream-dim);text-decoration:line-through;text-decoration-color:rgba(198,154,109,.7);font-weight:300}
.lp-price-once{font-family:'Inter',-apple-system,sans-serif;font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:var(--lp-sage-deep);margin-left:auto;line-height:1.6}
.lp-price-list{margin:28px 0 0;padding:0;list-style:none}
.lp-price-list li{padding:12px 0;font-family:var(--lp-serif);font-size:17px;color:var(--lp-cream);display:flex;align-items:center;gap:14px}
.lp-price-list li::before{content:"";width:7px;height:7px;border-radius:50%;background:var(--lp-sage);flex-shrink:0}
.lp-price-foot{margin-top:18px;text-align:center;font-family:var(--lp-serif);font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:var(--lp-cream-dim)}
.lp-price-foot span{opacity:.4;margin:0 .5em}
.lp-faq{background:#081210;padding:140px 0 160px;border-top:1px solid var(--lp-line)}
.lp-faq-inner{max-width:880px;margin:0 auto;padding:0 32px}
.lp-faq-list{margin-top:72px;border-top:1px solid var(--lp-line)}
.lp-faq-item{border-bottom:1px solid var(--lp-line)}
.lp-faq-q{width:100%;text-align:left;padding:28px 0;font-family:var(--lp-serif);font-size:22px;color:var(--lp-cream);display:flex;align-items:center;justify-content:space-between;gap:24px;transition:color .2s;background:none;border:none;cursor:pointer}
.lp-faq-q:hover{color:var(--lp-sage)}
.lp-plus{width:22px;height:22px;flex-shrink:0;position:relative;opacity:.6;transition:transform .3s,opacity .2s}
.lp-plus::before,.lp-plus::after{content:"";position:absolute;left:50%;top:50%;background:var(--lp-cream);transition:transform .3s}
.lp-plus::before{width:14px;height:1px;transform:translate(-50%,-50%)}
.lp-plus::after{width:1px;height:14px;transform:translate(-50%,-50%)}
.lp-faq-item.open .lp-faq-q .lp-plus{opacity:1}
.lp-faq-item.open .lp-faq-q .lp-plus::after{transform:translate(-50%,-50%) scaleY(0)}
.lp-faq-a{max-height:0;overflow:hidden;transition:max-height .4s ease}
.lp-faq-a-inner{padding:0 0 28px;color:var(--lp-cream-dim);font-family:var(--lp-serif);font-size:18px;line-height:1.65;max-width:680px}
.lp-finale{background:var(--lp-bg);padding:160px 0 180px;text-align:center;border-top:1px solid var(--lp-line);position:relative;overflow:hidden}
.lp-finale::before{content:"";position:absolute;inset:0;background:radial-gradient(50% 60% at 50% 50%,rgba(184,199,164,.1),transparent 70%)}
.lp-finale-inner{position:relative;max-width:880px;margin:0 auto;padding:0 32px}
.lp-finale-h{font-family:var(--lp-serif);font-size:clamp(40px,6vw,80px);line-height:1.05;font-weight:400;color:var(--lp-cream);margin:24px 0 0}
.lp-footer{background:#06100d;border-top:1px solid var(--lp-line);padding:64px 32px 48px}
.lp-foot-inner{max-width:1240px;margin:0 auto;display:flex;align-items:center;justify-content:space-between;gap:24px;flex-wrap:wrap}
.lp-foot-links{display:flex;gap:32px;font-family:var(--lp-serif);font-size:12px;letter-spacing:.28em;text-transform:uppercase;color:var(--lp-cream-dim)}
.lp-foot-links a{color:inherit;text-decoration:none}.lp-foot-links a:hover{color:var(--lp-cream)}
.lp-foot-bot{max-width:1240px;margin:48px auto 0;padding-top:28px;border-top:1px solid var(--lp-line);font-family:var(--lp-serif);font-size:12px;letter-spacing:.18em;color:var(--lp-cream-dim);display:flex;justify-content:space-between;flex-wrap:wrap;gap:16px}
.lp-foot-bot em{color:var(--lp-sage);font-style:italic}
.reveal{opacity:0;transform:translateY(24px);transition:opacity .9s ease,transform .9s ease}
.reveal.in{opacity:1;transform:translateY(0)}
@media(max-width:960px){
  .lp-nav-right .lp-nav-link{display:none}
  .lp-hero{padding-top:120px;padding-bottom:80px}
  .lp-hero-inner{grid-template-columns:1fr;gap:48px}
  .lp-hero-copy{text-align:center}
  .lp-hero-cta-row{align-items:center}
  .lp-hero-portrait{max-height:520px;order:-1}
  .lp-problem-grid,.lp-weeks,.lp-testimonials{grid-template-columns:1fr}
  .lp-teacher-grid,.lp-session-inner{grid-template-columns:1fr;gap:48px}
  .lp-included-grid{grid-template-columns:1fr}
  .lp-inc-item:nth-child(even){padding-left:0;border-left:0}
  .lp-teacher-stats{grid-template-columns:1fr}
  .lp-stat{padding:24px 0;border-bottom:1px solid var(--lp-line)}
}
@media(max-width:640px){
  .lp-nav{padding:18px 22px}
  .lp-hero{padding:140px 22px 80px}
  .lp-price-card{padding:32px 26px}
  .lp-price-big{font-size:64px}
  .lp-problem-grid,.lp-weeks,.lp-testimonials,.lp-included-grid,.lp-teacher-grid,.lp-session-inner,.lp-faq-inner,.lp-pricing-inner,.lp-finale-inner,.lp-problem-head,.lp-curr-head,.lp-voices-head,.lp-included-head{padding-left:22px;padding-right:22px}
  .lp-guarantee{letter-spacing:.06em;font-size:10px}
  .lp-hero-cta-row{gap:10px}
}
`;
