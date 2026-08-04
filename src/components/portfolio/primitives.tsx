import { useEffect, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

function reduced() {
  return (
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced()) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y: 26 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "power3.out",
          delay: delay / 1000,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [delay]);

  return (
    <div ref={ref} className={`will-change-transform ${className}`} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}

/** Staggered reveal of direct children matching `selector`. */
export function StaggerGroup({
  children,
  selector = ":scope > *",
  className = "",
  stagger = 0.05,
}: {
  children: ReactNode;
  selector?: string;
  className?: string;
  stagger?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const targets = Array.from(el.querySelectorAll(selector));
    if (!targets.length) return;
    if (reduced()) {
      gsap.set(targets, { opacity: 1, y: 0 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: "power2.out",
          stagger,
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [selector, stagger]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

export function SectionHeader({
  id,
  index,
  title,
  meta,
}: {
  id: string;
  index: string;
  title: string;
  meta?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;
    const line = el.querySelector<HTMLElement>("[data-rule]");
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el.querySelectorAll("[data-head]"),
        { opacity: 0, y: 22 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          stagger: 0.08,
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        },
      );
      if (line) {
        gsap.fromTo(
          line,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          },
        );
      }
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <div id={id} ref={ref} className="scroll-mt-24 pb-5">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
        <div className="flex items-baseline gap-4">
          <span data-head className="label-xs text-primary">
            {index}
          </span>
          <h2
            data-head
            className="text-3xl font-bold uppercase tracking-tight sm:text-4xl md:text-5xl"
          >
            {title}
          </h2>
        </div>
        {meta ? (
          <span data-head className="label-xs text-muted-foreground">
            {meta}
          </span>
        ) : null}
      </div>
      <div data-rule className="mt-5 h-px origin-left bg-border-strong" />
    </div>
  );
}

export function Tag({
  children,
  tone = "default",
}: {
  children: ReactNode;
  tone?: "default" | "primary" | "signal";
}) {
  const tones = {
    default: "border-border text-muted-foreground",
    primary: "border-primary text-primary",
    signal: "border-signal text-signal",
  } as const;
  return (
    <span className={`label-xs inline-flex items-center border px-2 py-1 ${tones[tone]}`}>
      {children}
    </span>
  );
}

// ScrollTrigger is registered in src/lib/gsap.ts
export { ScrollTrigger };
