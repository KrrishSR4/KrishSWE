import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { usePortfolio } from "@/lib/portfolio-store";
import { gsap } from "@/lib/gsap";

const TAPE = [
  "SCALABLE SYSTEMS",
  "CLOUD NATIVE",
  "SITE RELIABILITY",
  "PLATFORM ENGINEERING",
  "PRODUCTION GRADE",
  "ZERO DOWNTIME",
];

const ROTATOR = [
  "RELIABILITY",
  "SCALABILITY",
  "AVAILABILITY",
  "OBSERVABILITY",
  "MAINTAINABILITY",
  "STABILITY",
];

const LEDGER = [
  { k: "BOOT", t: "Environment provisioned", v: "terraform apply" },
  { k: "BUILD", t: "Artifacts compiled", v: "17 pipelines" },
  { k: "TEST", t: "Suites green", v: "1,284 cases" },
  { k: "SCAN", t: "Trivy + CodeQL clean", v: "0 critical" },
  { k: "SHIP", t: "Canary → 100%", v: "zero downtime" },
  { k: "WATCH", t: "SLO healthy", v: "99.98% / 142ms" },
];

function Hatch({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,currentColor_5px,currentColor_6px)] text-border-strong ${className}`}
    />
  );
}

/** Animated equalizer bars — pure CSS-free, GSAP driven */
function Equalizer() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-bar]").forEach((bar, i) => {
        gsap.to(bar, {
          scaleY: () => 0.25 + Math.random() * 0.95,
          duration: 0.5 + Math.random() * 0.6,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.045,
          transformOrigin: "bottom center",
        });
      });
    }, el);
    return () => ctx.revert();
  }, []);
  return (
    <div ref={ref} className="flex h-24 items-end gap-[3px]" aria-hidden>
      {Array.from({ length: 34 }).map((_, i) => (
        <span
          key={i}
          data-bar
          className={`block h-full flex-1 origin-bottom ${i % 5 === 0 ? "bg-primary" : "bg-border-strong"}`}
          style={{ transform: "scaleY(0.3)" }}
        />
      ))}
    </div>
  );
}

function HeroLedger() {
  const barRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const listRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const doc = document.documentElement;
        const max = doc.scrollHeight - window.innerHeight;
        const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
        
        if (barRef.current) {
          barRef.current.style.width = `${p * 100}%`;
        }
        if (textRef.current) {
          textRef.current.innerText = `${String(Math.round(p * 100)).padStart(3, "0")}%`;
        }
        if (listRef.current) {
          Array.from(listRef.current.children).forEach((li, i) => {
            const done = p >= (i + 1) / LEDGER.length;
            const active = !done && p >= i / LEDGER.length;
            
            if (active) {
              li.className = "flex items-center gap-3 px-4 py-3 transition-colors duration-300 bg-primary text-primary-foreground";
            } else if (done) {
              li.className = "flex items-center gap-3 px-4 py-3 transition-colors duration-300 bg-surface-2";
            } else {
              li.className = "flex items-center gap-3 px-4 py-3 transition-colors duration-300 ";
            }
            
            const dot = li.children[0] as HTMLElement;
            if (active) {
              dot.className = "inline-block h-2 w-2 shrink-0 animate-pulse bg-primary-foreground";
            } else if (done) {
              dot.className = "inline-block h-2 w-2 shrink-0 bg-signal";
            } else {
              dot.className = "inline-block h-2 w-2 shrink-0 bg-border-strong";
            }
            
            const textRight = li.children[3] as HTMLElement;
            if (active) {
              textRight.className = "label-xs hidden shrink-0 tabular-nums sm:block ";
            } else {
              textRight.className = "label-xs hidden shrink-0 tabular-nums sm:block text-muted-foreground";
            }
          });
        }
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div data-intro="panel" className="border-b-2 border-border-strong">
      <div className="flex items-center justify-between border-b-2 border-border-strong px-4 py-3">
        <span className="label-xs text-muted-foreground">Systems ledger</span>
        <span ref={textRef} className="label-xs tabular-nums text-primary">
          000%
        </span>
      </div>
      <div className="h-1 w-full bg-surface-2">
        <div
          ref={barRef}
          className="h-full bg-primary transition-[width] duration-150"
          style={{ width: `0%` }}
        />
      </div>
      <ol ref={listRef} className="divide-y-2 divide-border-strong">
        {LEDGER.map((s) => (
          <li
            key={s.k}
            className="flex items-center gap-3 px-4 py-3 transition-colors duration-300"
          >
            <span className="inline-block h-2 w-2 shrink-0 bg-border-strong" />
            <span className="label-xs w-14 shrink-0 tabular-nums">{s.k}</span>
            <span className="min-w-0 flex-1 truncate text-[0.78rem] font-semibold uppercase tracking-wide">
              {s.t}
            </span>
            <span className="label-xs hidden shrink-0 tabular-nums sm:block text-muted-foreground">
              {s.v}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function Hero() {
  const { content } = usePortfolio();
  const { identity, contact, projects } = content;
  const root = useRef<HTMLElement>(null);
  const [rot, setRot] = useState(0);
  const [clock, setClock] = useState("--:--:--");

  useEffect(() => {
    const id = setInterval(() => setRot((r) => (r + 1) % ROTATOR.length), 1800);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const tick = () =>
      setClock(
        new Intl.DateTimeFormat("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          timeZone: "Asia/Kolkata",
        }).format(new Date()),
      );
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(el.querySelectorAll("[data-intro]"), {
        opacity: 1,
        y: 0,
        x: 0,
        yPercent: 0,
        scaleX: 1,
        scaleY: 1,
      });
      return;
    }
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .fromTo(
          "[data-intro='tag']",
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.4, stagger: 0.06 },
        )
        .fromTo(
          "[data-intro='line']",
          { opacity: 0, yPercent: 115, skewY: 5 },
          { opacity: 1, yPercent: 0, skewY: 0, duration: 1, stagger: 0.1 },
          "-=0.15",
        )
        .fromTo(
          "[data-intro='rule']",
          { scaleX: 0 },
          { scaleX: 1, duration: 0.7, transformOrigin: "left center" },
          "-=0.7",
        )
        .fromTo(
          "[data-intro='copy']",
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 },
          "-=0.5",
        )
        .fromTo(
          "[data-intro='cta']",
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.35, stagger: 0.05 },
          "-=0.35",
        )
        .fromTo(
          "[data-intro='panel']",
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 },
          "-=0.9",
        )
        .fromTo("[data-intro='tape']", { opacity: 0 }, { opacity: 1, duration: 0.4 }, "-=0.3");
    }, el);
    return () => ctx.revert();
  }, []);

  const name = identity.name.toUpperCase();
  const live = projects.filter((p) => p.status === "Production").length;

  return (
    <section ref={root} className="relative overflow-hidden border-b-2 border-border-strong">
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-[0.28]" aria-hidden />
      <div
        className="pointer-events-none absolute -right-32 -top-40 hidden h-[38rem] w-[38rem] rounded-full opacity-[0.16] blur-3xl lg:block"
        style={{ background: "radial-gradient(circle, var(--color-primary) 0%, transparent 70%)" }}
        aria-hidden
      />

      {/* top rail */}
      <div className="relative flex items-stretch justify-between border-b-2 border-border-strong bg-surface">
        <span
          data-intro="tag"
          className="label-xs flex items-center gap-2 bg-primary px-3 py-2 text-primary-foreground"
        >
          <span className="inline-block h-1.5 w-1.5 animate-pulse bg-primary-foreground" />
          {identity.role}
        </span>
        <Hatch className="hidden flex-1 sm:block" />
        <span
          data-intro="tag"
          className="label-xs hidden items-center border-x-2 border-border-strong px-3 py-2 text-muted-foreground md:flex"
        >
          {identity.location}
        </span>
        <span data-intro="tag" className="label-xs flex items-center gap-2 px-3 py-2 text-signal">
          <span className="inline-block h-1.5 w-1.5 bg-signal" />
          OPEN TO WORK
        </span>
      </div>

      {/* giant static name — centered */}
      <div className="relative border-b-2 border-border-strong">
        <div
          aria-hidden
          className="select-none px-4 py-2 text-center text-[11vw] font-black uppercase leading-[0.85] tracking-tighter text-transparent opacity-50 dark:opacity-100 [-webkit-text-stroke:1px_var(--color-border-strong)] dark:[-webkit-text-stroke:1px_rgba(255,255,255,0.85)]"
        >
          {name}
        </div>
      </div>

      <div className="relative mx-auto max-w-[1400px] px-0 sm:px-6">
        <div className="grid gap-0 border-x-2 border-border-strong lg:grid-cols-[1.45fr_1fr]">
          {/* LEFT — statement slab */}
          <div className="border-b-2 border-border-strong px-5 py-12 sm:px-8 sm:py-16 lg:border-b-0 lg:border-r-2 lg:py-20">
            <div className="flex flex-wrap items-center gap-2">
              {["FULL-STACK", "CLOUD", "DEVOPS", "SRE"].map((t) => (
                <span
                  key={t}
                  data-intro="tag"
                  className="label-xs border-2 border-border-strong px-2 py-1 transition-colors hover:bg-foreground hover:text-background"
                >
                  {t}
                </span>
              ))}
            </div>

            <h2 className="mt-8 text-[clamp(2.5rem,8.2vw,6.4rem)] font-black uppercase leading-[0.84] tracking-tighter">
              <span className="block overflow-hidden">
                <span data-intro="line" className="block">
                  I Build
                </span>
              </span>
              <span className="block overflow-hidden">
                <span
                  data-intro="line"
                  className="block text-transparent"
                  style={{ WebkitTextStroke: "2px var(--color-primary)" }}
                >
                  Systems That
                </span>
              </span>
              <span className="block overflow-hidden">
                <span data-intro="line" className="flex flex-wrap items-baseline gap-3">
                  <span className="bg-foreground px-3 text-background">Don&apos;t Break</span>
                  <span className="text-primary">.</span>
                </span>
              </span>
            </h2>

            <div data-intro="rule" className="mt-8 h-0.5 w-full bg-border-strong" />

            <div
              data-intro="copy"
              className="mt-8 grid gap-4 md:grid-cols-[minmax(0,7rem)_1fr] md:gap-8"
            >
              <span className="label-xs text-primary">Mandate</span>
              <p className="max-w-2xl border-l-4 border-primary pl-4 text-base font-semibold uppercase leading-snug tracking-wide sm:text-lg">
                {identity.tagline}
              </p>
            </div>
            <div
              data-intro="copy"
              className="mt-6 grid gap-4 md:grid-cols-[minmax(0,7rem)_1fr] md:gap-8"
            >
              <span className="label-xs text-muted-foreground">Context</span>
              <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {identity.intro}
              </p>
            </div>

            <div className="mt-10 grid gap-0 sm:grid-cols-2 lg:grid-cols-5">
              <a
                href="#projects"
                data-intro="cta"
                className="label-xs flex items-center justify-between border-2 border-primary bg-primary px-4 py-5 text-primary-foreground transition-transform hover:-translate-y-1"
              >
                Projects <span aria-hidden>→</span>
              </a>
              <Link
                to="/case-studies"
                data-intro="cta"
                className="label-xs flex items-center justify-between border-2 border-border-strong px-4 py-5 transition-colors hover:bg-foreground hover:text-background sm:border-l-0"
              >
                Case studies <span aria-hidden>↗</span>
              </Link>
              <Link
                to="/certificates"
                data-intro="cta"
                className="label-xs flex items-center justify-between border-2 border-border-strong px-4 py-5 transition-colors hover:bg-foreground hover:text-background lg:border-l-0"
              >
                Certificates <span aria-hidden>↗</span>
              </Link>
              <a
                href={contact.resumeUrl}
                data-intro="cta"
                className="label-xs flex items-center justify-between border-2 border-border-strong px-4 py-5 transition-colors hover:bg-foreground hover:text-background sm:border-l-0 lg:border-l-0"
              >
                Resume <span aria-hidden>↓</span>
              </a>
              <a
                href="#contact"
                data-intro="cta"
                className="label-xs flex items-center justify-between border-2 border-border-strong px-4 py-5 transition-colors hover:bg-foreground hover:text-background lg:border-l-0"
              >
                Contact <span aria-hidden>→</span>
              </a>
            </div>
          </div>

          {/* RIGHT — LIVE SIGNAL BOARD */}
          <div className="flex flex-col">
            <div
              data-intro="panel"
              className="flex items-center justify-between border-b-2 border-border-strong bg-foreground px-4 py-3"
            >
              <span className="label-xs text-background">Signal board</span>
              <span className="label-xs tabular-nums text-background">IST {clock}</span>
            </div>

            {/* rotating discipline word */}
            <div
              data-intro="panel"
              className="relative overflow-hidden border-b-2 border-border-strong px-4 py-6"
            >
              <span className="label-xs block text-muted-foreground">Operating mode</span>
              <div className="relative mt-2 h-[2.6rem] overflow-hidden sm:h-[3.2rem]">
                {ROTATOR.map((w, i) => (
                  <span
                    key={w}
                    className={`absolute inset-0 flex items-center text-[2rem] font-black uppercase leading-none tracking-tighter transition-all duration-500 sm:text-[2.6rem] ${
                      i === rot ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
                    }`}
                  >
                    {w}
                    <span className="ml-2 text-primary">/</span>
                  </span>
                ))}
              </div>
            </div>

            {/* equalizer */}
            <div
              data-intro="panel"
              className="scanline border-b-2 border-border-strong bg-surface-2 px-4 py-5"
            >
              <div className="flex items-center justify-between">
                <span className="label-xs text-muted-foreground">Throughput</span>
                <span className="label-xs text-signal">STREAMING</span>
              </div>
              <div className="mt-4">
                <Equalizer />
              </div>
            </div>

            {/* scroll-synced systems ledger */}
            <HeroLedger />

            {/* live systems counter */}
            <div
              data-intro="panel"
              className="flex flex-1 items-center justify-between gap-4 border-b-2 border-border-strong px-4 py-5"
            >
              <div className="min-w-0">
                <span className="label-xs block text-muted-foreground">Systems live</span>
                <span className="mt-1 block text-5xl font-black leading-none tracking-tighter text-primary">
                  {String(live).padStart(2, "0")}
                </span>
              </div>
              <div className="flex flex-col items-end gap-1">
                {projects.slice(0, 4).map((p) => (
                  <a
                    key={p.id}
                    href={`#project-${p.id}`}
                    className="label-xs flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {p.name}
                    <span
                      className={`inline-block h-1.5 w-1.5 ${p.status === "Production" ? "bg-signal" : "bg-accent"}`}
                    />
                  </a>
                ))}
              </div>
            </div>

            <div data-intro="panel" className="flex items-center gap-3 bg-surface px-4 py-4">
              <span className="inline-block h-2 w-2 shrink-0 animate-pulse bg-signal" />
              <span className="min-w-0 text-[0.78rem] leading-snug text-muted-foreground">
                {identity.availability}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* bottom tape */}
      <div
        data-intro="tape"
        className="relative overflow-hidden border-y-2 border-border-strong bg-primary py-2.5"
      >
        <div className="marquee-track flex w-max gap-6 whitespace-nowrap">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="label-xs flex gap-6 text-primary-foreground">
              {TAPE.map((t) => (
                <span key={t} className="flex items-center gap-6">
                  {t}
                  <span className="inline-block h-1.5 w-1.5 rotate-45 bg-primary-foreground" />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <div className="relative overflow-hidden bg-surface py-2.5">
        <div className="marquee-track flex w-max gap-8 whitespace-nowrap [animation-direction:reverse]">
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i} className="label-xs flex gap-8 text-muted-foreground">
              {[
                "TYPESCRIPT",
                "NODE.JS",
                "AWS",
                "GOOGLE CLOUD",
                "CLOUDFLARE WORKERS",
                "DOCKER",
                "KUBERNETES",
                "TERRAFORM",
                "POSTGRESQL",
                "REDIS",
                "GITHUB ACTIONS",
                "OBSERVABILITY",
                "REACT",
              ].map((t) => (
                <span key={t}>{t} ·</span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
