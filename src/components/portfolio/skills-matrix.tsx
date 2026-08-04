import { useState } from "react";
import { usePortfolio } from "@/lib/portfolio-store";
import { useIsMobile } from "@/hooks/use-mobile";
import { Reveal, SectionHeader, StaggerGroup } from "./primitives";

function CoreMark({ core }: { core?: boolean }) {
  return (
    <span
      aria-hidden
      className={`mt-[0.35rem] block h-2 w-2 shrink-0 border ${
        core ? "border-primary bg-primary" : "border-border-strong bg-transparent"
      }`}
    />
  );
}

export function Skills() {
  const { content } = usePortfolio();
  const isMobile = useIsMobile();
  const [toggled, setToggled] = useState<Record<string, boolean>>({});

  const isOpen = (id: string) => (isMobile ? toggled[id] === true : toggled[id] !== false);
  const toggle = (id: string) => setToggled((p) => ({ ...p, [id]: !isOpen(id) }));

  const coreCount = content.capabilities.reduce(
    (n, d) => n + d.groups.reduce((m, g) => m + g.items.filter((i) => i.core).length, 0),
    0,
  );

  return (
    <section className="section-pad mx-auto max-w-[1400px] px-4 sm:px-6">
      <SectionHeader
        id="stack"
        index="03"
        title="Capability Matrix"
        meta={`${content.capabilities.length} domains · ${coreCount} core`}
      />

      {/* Legend */}
      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 border border-border bg-surface px-4 py-3">
        <span className="label-xs flex items-center gap-2">
          <span className="block h-2 w-2 border border-primary bg-primary" />
          <span className="text-foreground">Core expertise</span>
        </span>
        <span className="label-xs flex items-center gap-2">
          <span className="block h-2 w-2 border border-border-strong" />
          <span className="text-muted-foreground">Working knowledge</span>
        </span>
        <span className="label-xs ml-auto hidden text-muted-foreground sm:block">
          no ratings · no meters · shipped usage only
        </span>
      </div>

      {/* Domains */}
      <div className="mt-8 space-y-8">
        {content.capabilities.map((domain, di) => (
          <Reveal key={domain.id} delay={di * 60}>
            <div className="border border-border-strong bg-card">
              <div className="grid gap-2 border-b border-border-strong bg-surface px-4 py-4 sm:grid-cols-[auto_1fr] sm:items-baseline sm:gap-5 sm:px-6">
                <span className="label-xs text-primary">{domain.index}</span>
                <div>
                  <h3 className="text-xl font-bold uppercase tracking-tight sm:text-2xl">
                    {domain.title}
                  </h3>
                  <p className="mt-1.5 text-[0.8rem] leading-relaxed text-muted-foreground">
                    {domain.summary}
                  </p>
                </div>
              </div>

              <div className="divide-y divide-border">
                {domain.groups.map((group) => {
                  const open = isOpen(group.id);
                  return (
                    <div key={group.id}>
                      <button
                        type="button"
                        onClick={() => toggle(group.id)}
                        aria-expanded={open}
                        className="grid w-full grid-cols-[1fr_auto] items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-surface sm:px-6"
                      >
                        <span className="label-xs truncate text-foreground">{group.title}</span>
                        <span className="label-xs flex shrink-0 items-center gap-3 text-muted-foreground">
                          <span>{String(group.items.length).padStart(2, "0")}</span>
                          <span className={`transition-transform ${open ? "rotate-45" : ""}`}>
                            +
                          </span>
                        </span>
                      </button>

                      {open ? (
                        <StaggerGroup
                          selector="[data-cap]"
                          stagger={0.03}
                          className="grid gap-px border-t border-border bg-border sm:grid-cols-2 xl:grid-cols-3"
                        >
                          {group.items.map((item) => (
                            <div
                              key={item.name}
                              data-cap
                              className={`flex items-start gap-3 bg-background px-4 py-3 transition-colors hover:bg-surface sm:px-6 ${
                                item.core ? "" : "opacity-90"
                              }`}
                            >
                              <CoreMark core={item.core} />
                              <span
                                className={
                                  item.core
                                    ? "text-[0.95rem] font-bold leading-snug tracking-tight text-foreground"
                                    : "text-[0.82rem] leading-snug text-muted-foreground"
                                }
                              >
                                {item.name}
                              </span>
                            </div>
                          ))}
                        </StaggerGroup>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Engineering focus areas */}
      <div className="mt-14 border border-border-strong">
        <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-border-strong bg-surface px-4 py-4 sm:px-6">
          <h3 className="text-lg font-bold uppercase tracking-tight sm:text-xl">
            Engineering Focus
          </h3>
          <span className="label-xs text-muted-foreground">where the work is aimed</span>
        </div>
        <StaggerGroup
          selector="[data-focus]"
          stagger={0.04}
          className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4"
        >
          {content.focusAreas.map((f, i) => (
            <div
              key={f}
              data-focus
              className="group bg-background px-4 py-5 transition-colors hover:bg-primary hover:text-primary-foreground sm:px-6"
            >
              <span className="label-xs text-primary group-hover:text-primary-foreground">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-3 text-[0.95rem] font-bold uppercase leading-snug tracking-tight">
                {f}
              </p>
            </div>
          ))}
        </StaggerGroup>
      </div>

      {/* Currently exploring */}
      <div className="mt-8 border border-border-strong bg-surface">
        <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-border px-4 py-4 sm:px-6">
          <h3 className="text-lg font-bold uppercase tracking-tight sm:text-xl">
            Currently Exploring
          </h3>
          <span className="label-xs text-muted-foreground">2026 — 2027</span>
        </div>
        <StaggerGroup
          selector="[data-exp]"
          stagger={0.03}
          className="flex flex-wrap gap-2 px-4 py-5 sm:px-6"
        >
          {content.exploring.map((e) => (
            <span
              key={e}
              data-exp
              className="label-xs border border-dashed border-border-strong px-3 py-2 text-muted-foreground transition-colors hover:border-signal hover:text-signal"
            >
              {e}
            </span>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
