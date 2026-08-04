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

export function EngineeringFlow() {
  const containerRef = useRef<HTMLElement>(null);
  const shell = useShellClass();

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Check if user prefers reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(".flow-node", { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      // Reveal animation for nodes
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
          }
        }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={containerRef} 
      className={`relative overflow-hidden border-b-2 border-border-strong ${shell}`}
    >
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-[0.28]" aria-hidden />
      
      {/* Self-contained styles for marching ants animation */}
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
        /* Subdued styling for un-hovered lines */
        .march-h-subdued {
          background: linear-gradient(90deg, var(--color-border-strong) 50%, transparent 50%);
          background-size: 16px 100%;
        }
      `}</style>
      
      <div className="relative mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="mb-12 border-l-4 border-primary pl-4">
          <span className="label-xs text-primary mb-2 block">Workflow</span>
          <h2 className="text-[clamp(2rem,5vw,4rem)] font-black uppercase leading-none tracking-tighter">
            Engineering Flow
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground uppercase tracking-wide">
            The end-to-end lifecycle for shipping robust software
          </p>
        </div>

        <div className="pl-2 sm:pl-8 pb-8">
          {/* Root Node */}
          <div className="flow-node relative z-10 inline-block border-2 border-primary bg-primary px-6 py-4 font-black text-primary-foreground uppercase tracking-widest shadow-[6px_6px_0_0_var(--color-border-strong)]">
            ENGINEERING
          </div>

          <div className="ml-8 relative">
            {/* Trunk Connection from ENGINEERING to first item */}
            <div className="absolute left-0 top-0 w-[2px] h-8 bg-border-strong z-0">
              <div className="absolute inset-0 march-v opacity-90"></div>
            </div>

            <div className="pt-8">
              {FLOW_DATA.map((node, i) => {
                const isLastNode = i === FLOW_DATA.length - 1;
                return (
                  <div key={node.id} className="relative mb-8 group">
                    {/* Trunk Vertical Segment */}
                    <div className={`absolute left-0 top-0 w-[2px] bg-border-strong z-0 ${isLastNode ? 'h-[22px]' : 'h-[calc(100%+2rem)]'}`}>
                      <div className="absolute inset-0 march-v opacity-90"></div>
                    </div>

                    <div className="flex items-start">
                      {/* Branch Horizontal Left (Connecting to Main Trunk) */}
                      <div className="w-8 h-[2px] bg-border-strong z-0 mt-[21px] relative shrink-0">
                        <div className="absolute inset-0 march-h opacity-90"></div>
                      </div>

                      {/* Node Container */}
                      <div>
                        {/* Category Node */}
                        <div className="flow-node z-10 relative inline-block border-2 border-border-strong bg-surface px-5 py-2 font-bold uppercase tracking-wider text-foreground min-w-[160px] text-center transition-all duration-300 group-hover:border-primary group-hover:bg-foreground group-hover:text-background group-hover:shadow-[4px_4px_0_0_var(--color-primary)]">
                          {node.id}
                        </div>

                        {/* Sub-branches Area */}
                        <div className="ml-6 relative mt-4">
                          {/* Vertical Connector for Sub-branches from Node Box */}
                          <div className="absolute left-0 -top-4 w-[2px] h-4 bg-border-strong z-0">
                            <div className="absolute inset-0 march-v opacity-30 group-hover:opacity-100 transition-opacity"></div>
                          </div>

                          {node.children.map((child, j) => {
                            const isLastChild = j === node.children.length - 1;
                            return (
                              <div key={child} className="relative flex items-center mb-3 group/child">
                                {/* Vertical Connector passing through, or stopping if last */}
                                <div className={`absolute left-0 top-0 w-[2px] bg-border-strong z-0 ${isLastChild ? 'h-[50%]' : 'h-[calc(100%+0.75rem)]'}`}>
                                  <div className="absolute inset-0 march-v opacity-30 group-hover:opacity-100 transition-opacity"></div>
                                </div>
                                
                                {/* Horizontal Connector to Leaf */}
                                <div className="w-8 h-[2px] bg-border-strong z-0 relative shrink-0">
                                  <div className="absolute inset-0 march-h opacity-30 group-hover:opacity-100 group-hover/child:opacity-100 transition-opacity"></div>
                                </div>

                                {/* Leaf Node */}
                                <div className="flow-node z-10 relative inline-block px-4 py-1.5 text-xs sm:text-sm font-semibold tracking-wide text-muted-foreground border-2 border-border-strong bg-surface-2 transition-all duration-300 group-hover/child:border-primary group-hover/child:text-foreground group-hover/child:bg-surface min-w-[180px]">
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
        </div>
      </div>
    </section>
  );
}
