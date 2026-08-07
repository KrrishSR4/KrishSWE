import { useEffect, useRef, useState } from "react";

/** Fixed scroll progress ring + back-to-top control. */
export function ScrollProgress() {
  const [visible, setVisible] = useState(false);
  const barRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<SVGCircleElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  const r = 21;
  const c = 2 * Math.PI * r;

  useEffect(() => {
    let frame = 0;
    let lastVisible = false;

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const doc = document.documentElement;
        const max = doc.scrollHeight - window.innerHeight;
        const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
        const pct = Math.round(p * 100);

        if (barRef.current) {
          barRef.current.style.width = `${pct}%`;
        }
        if (circleRef.current) {
          circleRef.current.style.strokeDashoffset = `${c * (1 - p)}`;
        }
        if (textRef.current) {
          textRef.current.innerText = `${pct}%`;
        }

        const isVisible = window.scrollY > 420;
        if (isVisible !== lastVisible) {
          lastVisible = isVisible;
          setVisible(isVisible);
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
  }, [c]);

  const toTop = () => {
    const lenis = (window as unknown as { lenis?: { scrollTo: (t: number, o?: object) => void } })
      .lenis;
    if (lenis) lenis.scrollTo(0, { duration: 1.1 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* top bar */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] bg-transparent">
        <div
          ref={barRef}
          className="h-full bg-primary transition-[width] duration-100 ease-out"
          style={{ width: `0%` }}
        />
      </div>

      {/* ring button */}
      <button
        type="button"
        onClick={toTop}
        aria-label={`Back to top`}
        className={`fixed bottom-5 right-5 z-[60] grid h-14 w-14 place-items-center border-2 border-border-strong bg-background transition-all duration-300 hover:bg-foreground hover:text-background sm:bottom-8 sm:right-8 ${
          visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <svg viewBox="0 0 48 48" className="absolute inset-0 h-full w-full -rotate-90">
          <circle
            cx="24"
            cy="24"
            r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            opacity="0.15"
          />
          <circle
            ref={circleRef}
            cx="24"
            cy="24"
            r={r}
            fill="none"
            className="text-primary"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray={c}
            strokeDashoffset={c}
          />
        </svg>
        <span className="label-xs relative leading-none">↑</span>
        <span
          ref={textRef}
          className="label-xs absolute -top-6 right-0 hidden text-muted-foreground sm:block"
        >
          0%
        </span>
      </button>
    </>
  );
}
