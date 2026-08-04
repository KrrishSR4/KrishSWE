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
  { id: "MONITOR", children: ["Metrics", "Logs", "Traces"] },
];

function MobileTimeline() {
  return (
    <div className="relative w-full py-8 md:hidden mt-8">
      {/* Central Spine */}
      <div className="absolute left-[50%] top-0 bottom-0 w-[3px] -ml-[1.5px] bg-border-strong z-0">
        <div className="absolute inset-0 march-v opacity-90"></div>
      </div>

      <div className="flex flex-col w-full">
        {FLOW_DATA.map((node, index) => {
          const isLeft = index % 2 === 0;

          return (
            <div key={node.id} className={`w-full flex ${isLeft ? "justify-start" : "justify-end"} mb-12`}>
              {/* Half-width container for the node */}
              <div className={`w-1/2 relative flex ${isLeft ? "justify-end pr-4 sm:pr-8" : "justify-start pl-4 sm:pl-8"}`}>
                
                {/* Horizontal Connector to Central Spine */}
                <div className={`absolute top-[18px] w-4 sm:w-8 h-[3px] bg-border-strong z-0 ${isLeft ? "right-0" : "left-0"}`}>
                  <div className={`absolute inset-0 opacity-90 ${isLeft ? "march-h-reverse" : "march-h"}`}></div>
                </div>

                {/* Node Box and Children */}
                <div className={`relative z-10 flex flex-col ${isLeft ? "items-end" : "items-start"}`}>
                  
                  {/* Root Box */}
                  <div className="flow-node z-10 relative inline-block border-2 border-border-strong bg-surface px-4 py-2 text-xs font-bold uppercase tracking-wider text-foreground min-w-[120px] text-center transition-all duration-300 group-hover:border-primary group-hover:bg-foreground group-hover:text-background">
                    {node.id}
                  </div>

                  {/* Children Container */}
                  <div className={`mt-2.5 relative flex flex-col ${isLeft ? "items-end mr-4" : "items-start ml-4"}`}>
                    {/* Vertical Connector down to children */}
                    <div className={`absolute -top-2.5 w-[3px] h-2.5 bg-border-strong z-0 ${isLeft ? "right-0" : "left-0"}`}>
                      <div className="absolute inset-0 march-v opacity-30"></div>
                    </div>

                    {node.children.map((child, childIdx) => {
                      const isLastChild = childIdx === node.children.length - 1;
                      return (
                        <div key={child} className={`relative flex items-center mb-2 group/child ${isLeft ? "flex-row-reverse" : "flex-row"}`}>
                          {/* Vertical Trunk segment for child */}
                          <div className={`absolute top-0 w-[3px] bg-border-strong z-0 ${isLastChild ? "h-[50%]" : "h-[calc(100%+0.5rem)]"} ${isLeft ? "right-0" : "left-0"}`}>
                            <div className="absolute inset-0 march-v opacity-30 group-hover/child:opacity-100 transition-opacity"></div>
                          </div>
                          
                          {/* Horizontal Connector to child */}
                          <div className="w-4 h-[3px] bg-border-strong z-0 relative shrink-0">
                            <div className={`absolute inset-0 opacity-30 group-hover/child:opacity-100 transition-opacity ${isLeft ? "march-h-reverse" : "march-h"}`}></div>
                          </div>

                          {/* Child Box */}
                          <div className="flow-node z-10 relative inline-block px-3 py-1.5 text-[11px] font-semibold tracking-wide text-muted-foreground border-2 border-border-strong bg-surface-2 whitespace-nowrap min-w-[120px] text-center transition-all duration-300 group-hover/child:border-primary group-hover/child:text-foreground group-hover/child:bg-surface">
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
        })}
      </div>
    </div>
  );
}

function FlowNodeTree({
  node,
  isLastInColumn,
  isIndented,
}: {
  node: typeof FLOW_DATA[0];
  isLastInColumn: boolean;
  isIndented?: boolean;
}) {
  const connectorWidth = isIndented ? "w-12 sm:w-24 lg:w-16 xl:w-24" : "w-5";

  return (
    <div className="relative mb-6 group">
      {/* Trunk Vertical Segment for this node */}
      <div
        className={`absolute left-0 top-0 w-[3px] bg-border-strong z-0 ${isLastInColumn ? "h-[19px]" : "h-[calc(100%+1.5rem)]"}`}
      >
        <div className="absolute inset-0 march-v opacity-90"></div>
      </div>

      <div className="flex items-start">
        {/* Horizontal Left Connector */}
        <div className={`${connectorWidth} h-[3px] bg-border-strong z-0 mt-[18px] relative shrink-0 transition-all duration-300`}>
          <div className="absolute inset-0 march-h opacity-90"></div>
        </div>

        {/* Node Box */}
        <div>
          <div className="flow-node z-10 relative inline-block border-2 border-border-strong bg-surface px-4 py-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-foreground min-w-[130px] text-center whitespace-nowrap transition-all duration-300 group-hover:border-primary group-hover:bg-foreground group-hover:text-background group-hover:shadow-[3px_3px_0_0_var(--color-primary)]">
            {node.id}
          </div>

          <div className="ml-4 relative mt-2.5">
            {/* Connector down to first child */}
            <div className="absolute left-0 -top-2.5 w-[3px] h-2.5 bg-border-strong z-0">
              <div className="absolute inset-0 march-v opacity-30 group-hover:opacity-100 transition-opacity"></div>
            </div>

            {node.children.map((child, j) => {
              const isLastChild = j === node.children.length - 1;
              return (
                <div key={child} className="relative flex items-center mb-2 group/child">
                  <div
                    className={`absolute left-0 top-0 w-[3px] bg-border-strong z-0 ${isLastChild ? "h-[50%]" : "h-[calc(100%+0.5rem)]"}`}
                  >
                    <div className="absolute inset-0 march-v opacity-30 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <div className="w-4 h-[3px] bg-border-strong z-0 relative shrink-0">
                    <div className="absolute inset-0 march-h opacity-30 group-hover:opacity-100 group-hover/child:opacity-100 transition-opacity"></div>
                  </div>
                  <div className="flow-node z-10 relative inline-block px-3 py-1.5 text-[12px] sm:text-[13px] font-semibold tracking-wide text-muted-foreground border-2 border-border-strong bg-surface-2 whitespace-nowrap transition-all duration-300 group-hover/child:border-primary group-hover/child:text-foreground group-hover/child:bg-surface min-w-[140px]">
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
        <div className={`absolute top-0 left-0 h-[3px] bg-border-strong z-0 ${gapClass}`}>
          <div className="absolute inset-0 march-h opacity-90"></div>
        </div>
      )}

      {/* Vertical drop down to the first node */}
      <div className="absolute top-0 left-0 w-[3px] h-6 bg-border-strong z-0">
        <div className="absolute inset-0 march-v opacity-90"></div>
      </div>

      <div className="pt-6">
        {indices.map((dataIndex, idx) => {
          const node = FLOW_DATA[dataIndex];
          const isLastInColumn = idx === indices.length - 1;
          const isIndented = dataIndex % 2 !== 0;

          return (
            <FlowNodeTree
              key={node.id}
              node={node}
              isLastInColumn={isLastInColumn}
              isIndented={isIndented}
            />
          );
        })}
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
          background-size: 32px 100%;
          animation: march-x 0.4s linear infinite;
        }
        .march-h-reverse {
          background: linear-gradient(90deg, var(--color-primary) 50%, transparent 50%);
          background-size: 32px 100%;
          animation: march-x-reverse 0.4s linear infinite;
        }
        .march-v {
          background: linear-gradient(180deg, var(--color-primary) 50%, transparent 50%);
          background-size: 100% 32px;
          animation: march-y 0.4s linear infinite;
        }
        @keyframes march-x {
          from { background-position: 0 0; }
          to { background-position: -32px 0; }
        }
        @keyframes march-x-reverse {
          from { background-position: 0 0; }
          to { background-position: 32px 0; }
        }
        @keyframes march-y {
          from { background-position: 0 0; }
          to { background-position: 0 -32px; }
        }
      `}</style>

      <div className="relative mx-auto max-w-[1800px] px-2 py-16 sm:px-6 sm:py-24">
        <div className="mb-12 border-l-4 border-primary pl-4 max-w-[1400px] mx-auto sm:ml-0">
          <span className="label-xs text-primary mb-2 block">Workflow</span>
          <h2 className="text-[clamp(2rem,5vw,4rem)] font-black uppercase leading-none tracking-tighter">
            Engineering Flow
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground uppercase tracking-wide">
            The end-to-end lifecycle for shipping robust software
          </p>
        </div>

        <div className="w-full overflow-x-auto overflow-y-hidden pb-8">
          {/* Root Node */}
          <div className="flow-node relative z-10 mb-6 inline-block">
            <div className="border-2 border-primary bg-primary px-5 py-2.5 font-black text-primary-foreground uppercase tracking-widest shadow-[4px_4px_0_0_var(--color-border-strong)]">
              ENGINEERING
            </div>
            {/* Trunk Connection from ENGINEERING downwards */}
            <div className="absolute top-full left-[14px] w-[3px] h-6 bg-border-strong z-0">
              <div className="absolute inset-0 march-v opacity-90"></div>
            </div>
          </div>

          <div className="ml-[14px] relative">
            {/* lg: 4 columns (Staggered desktop) */}
            <div className="hidden lg:grid grid-cols-4 gap-4 xl:gap-8 min-w-max">
              {[
                [0, 1],
                [2, 3],
                [4, 5],
                [6, 7],
              ].map((indices, colIndex) =>
                renderColumn(indices, colIndex, 4, "w-[calc(100%+1rem)] xl:w-[calc(100%+2rem)]"),
              )}
            </div>

            {/* md: 2 columns (Tablet) */}
            <div className="hidden md:grid lg:hidden grid-cols-2 gap-6 min-w-max">
              {[
                [0, 1, 2, 3],
                [4, 5, 6, 7],
              ].map((indices, colIndex) =>
                renderColumn(indices, colIndex, 2, "w-[calc(100%+1.5rem)]"),
              )}
            </div>

            {/* sm: 1 column (Mobile Central Spine) */}
            <MobileTimeline />
          </div>
        </div>
      </div>
    </section>
  );
}
