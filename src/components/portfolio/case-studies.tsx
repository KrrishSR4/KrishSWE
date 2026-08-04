import { useEffect, useRef } from "react";
import { usePortfolio } from "@/lib/portfolio-store";
import type { Project } from "@/lib/portfolio-data";
import { gsap } from "@/lib/gsap";
import { Reveal, SectionHeader } from "./primitives";

function reduced() {
  return (
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function Hatch({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,currentColor_5px,currentColor_6px)] text-border-strong ${className}`}
    />
  );
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-3 border-t-2 border-border-strong py-6 md:grid-cols-[minmax(0,11rem)_1fr] md:gap-8">
      <span className="label-xs text-primary">{label}</span>
      <div className="min-w-0 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </div>
  );
}

/** Marquee strip of the project's stack. */
function StackTape({ items, reverse }: { items: string[]; reverse?: boolean }) {
  const row = [...items, ...items, ...items, ...items];
  return (
    <div className="overflow-hidden border-y-2 border-border-strong bg-foreground py-2">
      <div
        className={`marquee-track flex w-max gap-6 whitespace-nowrap ${reverse ? "[animation-direction:reverse]" : ""}`}
      >
        {row.map((s, i) => (
          <span key={`${s}-${i}`} className="label-xs flex items-center gap-6 text-background">
            {s}
            <span className="inline-block h-1.5 w-1.5 rotate-45 bg-background/60" />
          </span>
        ))}
      </div>
    </div>
  );
}

/** Numbered architecture pipeline with a drawing spine. */
function Pipeline({ steps }: { steps: string[] }) {
  const ref = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    const ctx = gsap.context(() => {
      const spine = el.querySelector("[data-spine]");
      if (spine) {
        gsap.fromTo(
          spine,
          { scaleY: 0 },
          {
            scaleY: 1,
            transformOrigin: "top center",
            ease: "none",
            scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 70%", scrub: 0.5 },
          },
        );
      }
      gsap.fromTo(
        el.querySelectorAll("[data-step]"),
        { opacity: 0, x: -18 },
        {
          opacity: 1,
          x: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        },
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <ol ref={ref} className="relative pl-1">
      <span
        data-spine
        aria-hidden
        className="absolute left-[1.05rem] top-2 h-[calc(100%-1rem)] w-0.5 bg-primary"
      />
      {steps.map((s, i) => (
        <li
          key={s}
          data-step
          className="relative grid grid-cols-[2.2rem_1fr] items-start gap-4 py-3"
        >
          <span className="label-xs z-10 grid h-9 w-9 place-items-center border-2 border-border-strong bg-background text-primary">
            {String(i + 1).padStart(2, "0")}
          </span>
          <span className="min-w-0 pt-2 text-sm leading-relaxed text-foreground">{s}</span>
        </li>
      ))}
    </ol>
  );
}

function CaseCard({ p, i }: { p: Project; i: number }) {
  const alt = i % 2 === 1;
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    const num = el.querySelector("[data-bignum]");
    if (!num) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        num,
        { yPercent: alt ? 18 : -18 },
        {
          yPercent: 0,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [alt]);

  return (
    <Reveal delay={i * 40}>
      <article
        ref={ref}
        id={`case-${p.id}`}
        className="group scroll-mt-24 border-2 border-border-strong bg-background transition-colors duration-200 hover:border-primary"
      >
        {/* rail */}
        <div className="flex items-stretch justify-between border-b-2 border-border-strong bg-surface">
          <span className="label-xs bg-primary px-3 py-2 text-primary-foreground">
            CASE_{p.index}
          </span>
          <span className="label-xs flex items-center px-3 py-2 text-muted-foreground">
            {p.id}.study
          </span>
          <Hatch className="hidden flex-1 sm:block" />
          <span className="label-xs flex items-center border-l-2 border-border-strong px-3 py-2 text-signal">
            {p.status}
          </span>
        </div>

        {/* headline */}
        <div className="relative overflow-hidden border-b-2 border-border-strong">
          <span
            data-bignum
            aria-hidden
            className="pointer-events-none absolute -right-3 -top-10 select-none text-[8rem] font-black leading-none tracking-tighter text-transparent opacity-70 sm:text-[13rem]"
            style={{ WebkitTextStroke: "2px var(--color-border-strong)" }}
          >
            {p.index}
          </span>
          <div className="relative px-4 py-8 sm:px-8 sm:py-12">
            <h3 className="text-[clamp(2rem,6.4vw,4.6rem)] font-black uppercase leading-[0.85] tracking-tighter">
              {p.name}
            </h3>
            <p className="mt-4 max-w-3xl border-l-4 border-primary pl-4 text-sm font-semibold uppercase leading-relaxed tracking-wide sm:text-base">
              {p.positioning}
            </p>
          </div>
        </div>

        <StackTape items={p.stack} reverse={alt} />

        {/* metrics strip */}
        <div className="grid grid-cols-1 divide-y-2 divide-border-strong border-b-2 border-border-strong sm:grid-cols-3 sm:divide-x-2 sm:divide-y-0">
          {p.metrics.map((m) => (
            <div key={m.label} className="px-4 py-5 transition-colors hover:bg-surface">
              <p className="label-xs text-muted-foreground">{m.label}</p>
              <p className="mt-2 text-2xl font-black uppercase tracking-tighter sm:text-3xl">
                {m.value}
              </p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-[1.1fr_1fr]">
          <div
            className={`p-4 sm:p-8 ${alt ? "lg:order-2 lg:border-l-2" : "lg:border-r-2"} border-border-strong`}
          >
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
              {p.summary}
            </p>
            <Block label="Problem">{p.problem}</Block>
            <Block label="Solution">{p.solution}</Block>
            <Block label="Impact">
              <span className="font-semibold text-foreground">{p.impact}</span>
            </Block>
            <Block label="Tags">
              <div className="flex flex-wrap gap-0 border-2 border-border-strong">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="label-xs border-b-2 border-r-2 border-border-strong px-3 py-2 text-primary last:border-r-0"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </Block>
          </div>

          <div className={`flex flex-col bg-surface ${alt ? "lg:order-1" : ""}`}>
            <div className="label-xs border-b-2 border-border-strong bg-foreground px-4 py-2 text-background">
              Architecture · {p.architecture.length} stages
            </div>
            <div className="p-4 sm:p-6">
              <Pipeline steps={p.architecture} />
            </div>

            <div className="mt-auto border-t-2 border-border-strong">
              <div className="scanline px-4 py-4 text-[0.75rem] leading-relaxed text-muted-foreground">
                <p>
                  <span className="text-primary">$</span> cat {p.id}/ARCHITECTURE.md
                </p>
                <p className="mt-1 truncate text-foreground">{p.stack.join(" · ")}</p>
                <p className="mt-3">
                  <span className="text-primary">$</span> deploy --status
                </p>
                <p className="mt-1 text-foreground">{p.status.toLowerCase()}</p>
              </div>
              <div className="grid grid-cols-2 border-t-2 border-border-strong">
                {p.live ? (
                  <a
                    href={p.live}
                    target="_blank"
                    rel="noreferrer"
                    className="label-xs flex items-center justify-between gap-2 border-r-2 border-border-strong bg-primary px-4 py-4 text-primary-foreground transition-transform hover:-translate-y-1"
                  >
                    Live <span aria-hidden>↗</span>
                  </a>
                ) : (
                  <span className="label-xs flex items-center justify-between gap-2 border-r-2 border-border-strong px-4 py-4 text-muted-foreground">
                    No deploy <span aria-hidden>×</span>
                  </span>
                )}
                <a
                  href={p.repo}
                  target="_blank"
                  rel="noreferrer"
                  className="label-xs flex items-center justify-between gap-2 px-4 py-4 transition-colors hover:bg-foreground hover:text-background"
                >
                  Repo <span aria-hidden>↗</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

export function CaseStudies() {
  const { content } = usePortfolio();
  const projects = content.projects;

  return (
    <section className="section-pad border-t-2 border-border-strong bg-surface">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <SectionHeader
          id="casestudies"
          index="02"
          title="Case Studies"
          meta="problem · solution · architecture · impact"
        />

        {/* index board */}
        <Reveal>
          <div className="mt-8 grid grid-cols-1 divide-y-2 divide-border-strong border-2 border-border-strong bg-background sm:grid-cols-2 sm:divide-x-2 lg:grid-cols-4 lg:divide-y-0">
            {projects.map((p) => (
              <a
                key={p.id}
                href={`#case-${p.id}`}
                className="group px-4 py-5 transition-colors hover:bg-foreground hover:text-background"
              >
                <span className="label-xs text-primary group-hover:text-background">{p.index}</span>
                <p className="mt-3 truncate text-lg font-black uppercase tracking-tighter">
                  {p.name}
                </p>
                <p className="mt-2 line-clamp-2 text-[0.75rem] leading-relaxed text-muted-foreground group-hover:text-background/70">
                  {p.positioning}
                </p>
                <span className="label-xs mt-4 inline-block">Read ↓</span>
              </a>
            ))}
          </div>
        </Reveal>

        <div className="mt-10 flex flex-col gap-12 sm:gap-16">
          {projects.map((p, i) => (
            <CaseCard key={p.id} p={p} i={i} />
          ))}
        </div>

        {/* closing slab */}
        <Reveal>
          <div className="mt-16 border-2 border-border-strong bg-background">
            <div className="label-xs border-b-2 border-border-strong bg-foreground px-4 py-2 text-background">
              Engineering principles
            </div>
            <div className="grid divide-y-2 divide-border-strong sm:grid-cols-2 sm:divide-x-2 lg:grid-cols-4 lg:divide-y-0">
              {[
                {
                  t: "Design for failure",
                  d: "Every path has a timeout, a retry budget and a fallback. Failure modes are written down before the happy path.",
                },
                {
                  t: "Measure, then optimise",
                  d: "No optimisation ships without a before/after number from real traffic — p95 latency, cost per request, error rate.",
                },
                {
                  t: "Boring infrastructure",
                  d: "Postgres, Redis, containers, IaC. Novelty is spent on the product, not on the platform underneath it.",
                },
                {
                  t: "Ship small, ship often",
                  d: "Trunk-based flow, CI gates, automated rollbacks. Small diffs make incidents short and reversible.",
                },
              ].map((x) => (
                <div key={x.t} className="px-4 py-6 transition-colors hover:bg-surface">
                  <p className="text-base font-black uppercase tracking-tight">{x.t}</p>
                  <p className="mt-3 text-[0.8rem] leading-relaxed text-muted-foreground">{x.d}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
