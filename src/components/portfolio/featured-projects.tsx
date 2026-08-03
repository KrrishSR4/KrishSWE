import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import type { Project } from "@/lib/portfolio-data";
import { usePortfolio } from "@/lib/portfolio-store";
import { gsap } from "@/lib/gsap";
import { Reveal, SectionHeader } from "./primitives";

function StatusPill({ status }: { status: Project["status"] }) {
  const live = status === "Production" || status === "Maintained";
  return (
    <span
      className={`label-xs inline-flex items-center gap-2 border-2 px-2 py-1 ${
        live ? "border-signal text-signal" : "border-accent text-accent"
      }`}
    >
      <span className={`inline-block h-1.5 w-1.5 ${live ? "bg-signal" : "bg-accent"}`} />
      {status}
    </span>
  );
}

/** Infinite horizontal ticker of the project stack. */
function StackTicker({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  const row = [...items, ...items, ...items, ...items];
  return (
    <div className="relative overflow-hidden border-y-2 border-border-strong bg-foreground py-2">
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

function ProjectCard({ project, i }: { project: Project; i: number }) {
  const alt = i % 2 === 1;
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const num = el.querySelector<HTMLElement>("[data-bignum]");
    if (!num) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        num,
        { xPercent: alt ? 12 : -12 },
        {
          xPercent: 0,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.6 },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [alt]);

  return (
    <Reveal delay={i * 60}>
      <article
        ref={ref}
        id={`project-${project.id}`}
        className="group relative scroll-mt-24 border-2 border-border-strong bg-card transition-colors duration-200 hover:border-primary"
      >
        {/* top rail */}
        <div className="flex items-stretch justify-between border-b-2 border-border-strong bg-surface">
          <div className="flex min-w-0 items-center gap-3 px-3 py-2 sm:gap-4 sm:px-4">
            <span className="label-xs bg-primary px-2 py-1 text-primary-foreground">PRJ_{project.index}</span>
            <span className="label-xs truncate text-muted-foreground">{project.id}.system</span>
          </div>
          <div className="hidden flex-1 self-stretch bg-[repeating-linear-gradient(45deg,transparent,transparent_6px,currentColor_6px,currentColor_7px)] text-border-strong sm:block" />
          <div className="flex items-center gap-3 border-l-2 border-border-strong px-3 py-2 sm:px-4">
            <StatusPill status={project.status} />
          </div>
        </div>

        {/* headline slab */}
        <div className="relative overflow-hidden border-b-2 border-border-strong">
          <div
            data-bignum
            aria-hidden
            className="pointer-events-none absolute -right-2 -top-6 select-none text-[7rem] font-black leading-none tracking-tighter text-border-strong/45 sm:text-[11rem] lg:text-[14rem]"
          >
            {project.index}
          </div>
          <div className="relative px-4 py-7 sm:px-8 sm:py-10">
            <h3 className="text-[clamp(2.1rem,7vw,5.5rem)] font-black uppercase leading-[0.85] tracking-tighter">
              {project.name}
            </h3>
            <p className="mt-4 max-w-2xl border-l-4 border-primary pl-4 text-sm font-semibold uppercase leading-relaxed tracking-wide text-foreground sm:text-base">
              {project.positioning}
            </p>
          </div>
        </div>

        <StackTicker items={project.stack} reverse={alt} />

        <div className={`grid gap-0 lg:grid-cols-[1.15fr_1fr] ${alt ? "" : ""}`}>
          {/* body */}
          <div
            className={`border-b-2 border-border-strong p-4 sm:p-8 lg:border-b-0 ${
              alt ? "lg:order-2 lg:border-l-2" : "lg:border-r-2"
            }`}
          >
            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">{project.summary}</p>

            <div className="mt-7 border-2 border-border-strong bg-surface">
              <div className="label-xs border-b-2 border-border-strong bg-foreground px-3 py-1.5 text-background">
                Impact
              </div>
              <p className="px-3 py-4 text-sm font-semibold leading-relaxed sm:text-base">{project.impact}</p>
            </div>

            <div className="mt-6 flex flex-wrap gap-0 border-2 border-border-strong">
              {project.tags.map((t) => (
                <span
                  key={t}
                  className="label-xs border-b-2 border-r-2 border-border-strong px-3 py-2 text-primary last:border-r-0"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="mt-7 grid gap-0 sm:grid-cols-3">
              {project.live ? (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noreferrer"
                  className="label-xs flex items-center justify-between gap-2 border-2 border-primary bg-primary px-4 py-4 text-primary-foreground transition-transform hover:-translate-y-1"
                >
                  Live <span aria-hidden>↗</span>
                </a>
              ) : (
                <span className="label-xs flex cursor-not-allowed items-center justify-between gap-2 border-2 border-border px-4 py-4 text-muted-foreground">
                  No deploy <span aria-hidden>×</span>
                </span>
              )}
              <a
                href={project.repo}
                target="_blank"
                rel="noreferrer"
                className="label-xs flex items-center justify-between gap-2 border-2 border-border-strong px-4 py-4 transition-colors hover:bg-foreground hover:text-background sm:border-l-0"
              >
                Repo <span aria-hidden>↗</span>
              </a>
              <Link
                to="/case-studies"
                hash={`case-${project.id}`}
                className="label-xs flex items-center justify-between gap-2 border-2 border-border-strong px-4 py-4 text-muted-foreground transition-colors hover:bg-foreground hover:text-background sm:border-l-0"
              >
                Deep dive <span aria-hidden>↗</span>
              </Link>
            </div>
          </div>

          {/* panel */}
          <div className={`flex flex-col bg-surface ${alt ? "lg:order-1" : ""}`}>
            <div className="grid grid-cols-1 divide-y-2 divide-border-strong sm:grid-cols-3 sm:divide-x-2 sm:divide-y-0">
              {project.metrics.map((m) => (
                <div key={m.label} className="px-4 py-5 transition-colors hover:bg-surface-2">
                  <p className="label-xs text-muted-foreground">{m.label}</p>
                  <p className="mt-2 text-xl font-black uppercase tracking-tight sm:text-2xl">{m.value}</p>
                </div>
              ))}
            </div>

            <div className="flex-1 border-t-2 border-border-strong px-4 py-5">
              <span className="label-xs text-muted-foreground">Dependencies · {project.stack.length}</span>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.stack.map((s) => (
                  <span
                    key={s}
                    className="border-2 border-border-strong bg-background px-2 py-1 text-[0.72rem] font-semibold transition-colors hover:bg-foreground hover:text-background"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="scanline mt-auto border-t-2 border-border-strong px-4 py-4 text-[0.75rem] leading-relaxed text-muted-foreground">
              <p>
                <span className="text-primary">$</span> git remote -v
              </p>
              <p className="mt-1 truncate">{project.repo.replace("https://", "")}</p>
              <p className="mt-3">
                <span className="text-primary">$</span> deploy --status
              </p>
              <p className="mt-1 text-foreground">{project.status.toLowerCase()}</p>
            </div>
          </div>
        </div>
      </article>
    </Reveal>
  );
}

export function FeaturedProjects() {
  const { content } = usePortfolio();
  return (
    <section className="section-pad relative overflow-hidden">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <SectionHeader
          id="projects"
          index="01"
          title="Featured Projects"
          meta={`${content.projects.length} systems · shipped`}
        />
        <div className="mt-10 flex flex-col gap-10 sm:gap-14">
          {content.projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
