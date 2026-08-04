import { usePortfolio } from "@/lib/portfolio-store";
import { Reveal, SectionHeader } from "./primitives";

export function CurrentFocus() {
  const { content } = usePortfolio();
  return (
    <section className="section-pad border-y border-border-strong bg-surface">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <SectionHeader
          id="focus"
          index="04"
          title="Current Focus"
          meta="what I'm building & learning now"
        />
        <div className="mt-10 grid gap-px border border-border-strong bg-border md:grid-cols-2 lg:grid-cols-3">
          {content.focus.map((f, i) => (
            <Reveal key={f.id} delay={i * 40}>
              <div className="h-full bg-background p-5 sm:p-6">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                  <h3 className="truncate text-lg font-bold uppercase tracking-tight">{f.title}</h3>
                  <span className="label-xs shrink-0 border border-signal px-2 py-1 text-signal">
                    {f.state}
                  </span>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{f.detail}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
