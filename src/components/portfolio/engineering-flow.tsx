import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useShellClass } from "@/lib/portfolio-store";

const FLOW_DATA = [
  { id: "PLAN", children: ["Requirements", "Architecture", "Design"] },
  { id: "CODE", children: ["Git", "Reviews", "Standards"] },
  { id: "BUILD", children: ["Docker", "CI", "Artifacts"] },
  { id: "TEST", children: ["Unit", "Integration", "Security"] },
  { id: "RELEASE", children: ["Continuous Delivery", "Canary", "Rollback"] },
  { id: "DEPLOY", children: ["Kubernetes", "Terraform", "Helm"] },
  { id: "OPERATE", children: ["Scaling", "Backups", "Recovery"] },
  { id: "OBSERVE", children: ["Metrics", "Logs", "Traces"] },
];

function FlowNodeTree({
  node,
  isLastInColumn,
}: {
  node: (typeof FLOW_DATA)[0];
  isLastInColumn?: boolean;
}) {
  return (
    <div className="relative mb-6 group">
      {/* Trunk Vertical Segment for this node */}
      <div
        className={`absolute left-0 top-0 w-[2px] bg-border-strong z-0 ${isLastInColumn ? "h-[19px]" : "h-[calc(100%+1.5rem)]"}`}
      >
        <div className="absolute inset-0 march-v opacity-90"></div>
      </div>

      <div className="flex items-start">
        {/* Horizontal Left Connector */}
        <div className="w-5 h-[2px] bg-border-strong z-0 mt-[18px] relative shrink-0">
          <div className="absolute inset-0 march-h opacity-90"></div>
        </div>

        {/* Node Box */}
        <div>
          <div className="flow-node z-10 relative inline-block border-2 border-border-strong bg-surface px-3 py-1.5 font-bold uppercase tracking-wider text-foreground min-w-[120px] text-center whitespace-nowrap transition-all duration-300 group-hover:border-primary group-hover:bg-foreground group-hover:text-background group-hover:shadow-[3px_3px_0_0_var(--color-primary)]">
            {node.id}
          </div>

          <div className="ml-4 relative mt-2.5">
            {/* Connector down to first child */}
            <div className="absolute left-0 -top-2.5 w-[2px] h-2.5 bg-border-strong z-0">
              <div className="absolute inset-0 march-v opacity-30 group-hover:opacity-100 transition-opacity"></div>
            </div>

            {node.children.map((child, j) => {
              const isLastChild = j === node.children.length - 1;
              return (
                <div key={child} className="relative flex items-center mb-2 group/child">
                  <div
                    className={`absolute left-0 top-0 w-[2px] bg-border-strong z-0 ${isLastChild ? "h-[50%]" : "h-[calc(100%+0.5rem)]"}`}
                  >
                    <div className="absolute inset-0 march-v opacity-30 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <div className="w-4 h-[2px] bg-border-strong z-0 relative shrink-0">
                    <div className="absolute inset-0 march-h opacity-30 group-hover:opacity-100 group-hover/child:opacity-100 transition-opacity"></div>
                  </div>
                  <div className="flow-node z-10 relative inline-block px-2.5 py-1 text-[11px] font-semibold tracking-wide text-muted-foreground border-2 border-border-strong bg-surface-2 whitespace-nowrap transition-all duration-300 group-hover/child:border-primary group-hover/child:text-foreground group-hover/child:bg-surface min-w-[130px]">
                    {child}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export function EngineeringFlow() {
  const containerRef = useRef<HTMLElement>(null);
  const shell = useShellClass();

  useEffect(() => {
    if (!containerRef.current) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(".flow-node", { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".flow-node",
        { opacity: 0, x: -10 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.05,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
          },
        },
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const renderColumn = (
    indices: number[],
    colIndex: number,
    totalCols: number,
    gapClass: string,
  ) => (
    <div key={colIndex} className="relative">
      {/* Horizontal connecting line to the NEXT column */}
      {colIndex < totalCols - 1 && (
        <div className={`absolute top-0 left-0 h-[2px] bg-border-strong z-0 ${gapClass}`}>
          <div className="absolute inset-0 march-h opacity-90"></div>
        </div>
      )}

      {/* Vertical drop down to the first node */}
      <div className="absolute top-0 left-0 w-[2px] h-6 bg-border-strong z-0">
        <div className="absolute inset-0 march-v opacity-90"></div>
      </div>

      <div className="w-full pt-6">
        {indices.map((i, idx) => (
          <FlowNodeTree key={i} node={FLOW_DATA[i]} isLastInColumn={idx === indices.length - 1} />
        ))}
      </div>
    </div>
  );

  return (
    <section
      ref={containerRef}
      className={`relative overflow-hidden border-b-2 border-border-strong ${shell}`}
    >
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-[0.28]" aria-hidden />

      <style>{`
        .march-h {
          background: linear-gradient(90deg, var(--color-primary) 50%, transparent 50%);
          background-size: 16px 100%;
          animation: march-x 1s linear infinite;
        }
        .march-v {
          background: linear-gradient(180deg, var(--color-primary) 50%, transparent 50%);
          background-size: 100% 16px;
          animation: march-y 1s linear infinite;
        }
        @keyframes march-x {
          from { background-position: 0 0; }
          to { background-position: -16px 0; }
        }
        @keyframes march-y {
          from { background-position: 0 0; }
          to { background-position: 0 -16px; }
        }
      `}</style>

      <div className="relative mx-auto max-w-[1400px] px-5 py-16 sm:px-8 sm:py-24">
        <div className="mb-12 border-l-4 border-primary pl-4">
          <span className="label-xs text-primary mb-2 block">Workflow</span>
          <h2 className="text-[clamp(2rem,5vw,4rem)] font-black uppercase leading-none tracking-tighter">
            Engineering Flow
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground uppercase tracking-wide">
            The end-to-end lifecycle for shipping robust software
          </p>
        </div>

        <div className="w-full pl-2 sm:pl-8 overflow-hidden">
          {/* Root Node */}
          <div className="flow-node relative z-10 mb-6 inline-block">
            <div className="border-2 border-primary bg-primary px-5 py-2.5 font-black text-primary-foreground uppercase tracking-widest shadow-[4px_4px_0_0_var(--color-border-strong)]">
              ENGINEERING
            </div>
            {/* Trunk Connection from ENGINEERING downwards */}
            <div className="absolute top-full left-[14px] w-[2px] h-6 bg-border-strong z-0">
              <div className="absolute inset-0 march-v opacity-90"></div>
            </div>
          </div>

          <div className="ml-[14px] relative">
            {/* lg: 4 columns */}
            <div className="hidden lg:grid grid-cols-4 gap-6">
              {[
                [0, 1],
                [2, 3],
                [4, 5],
                [6, 7],
              ].map((indices, colIndex) =>
                renderColumn(indices, colIndex, 4, "w-[calc(100%+1.5rem)]"),
              )}
            </div>

            {/* md: 2 columns */}
            <div className="hidden md:grid lg:hidden grid-cols-2 gap-6">
              {[
                [0, 1, 2, 3],
                [4, 5, 6, 7],
              ].map((indices, colIndex) =>
                renderColumn(indices, colIndex, 2, "w-[calc(100%+1.5rem)]"),
              )}
            </div>

            {/* sm: 1 column */}
            <div className="grid md:hidden grid-cols-1 gap-6">
              {[[0, 1, 2, 3, 4, 5, 6, 7]].map((indices, colIndex) =>
                renderColumn(indices, colIndex, 1, ""),
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
