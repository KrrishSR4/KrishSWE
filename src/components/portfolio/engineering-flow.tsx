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

        <div className="overflow-x-auto pb-8 scrollbar-hide">
          <div className="min-w-[800px] flex items-stretch py-4">
            
            {/* Root Node */}
            <div className="flex items-center flow-node relative z-10">
              <div className="border-2 border-primary bg-primary px-6 py-4 font-black text-primary-foreground uppercase tracking-widest shadow-[6px_6px_0_0_var(--color-border-strong)]">
                ENGINEERING
              </div>
            </div>

            {/* Trunk Horizontal Line */}
            <div className="flex items-center relative z-0">
              <div className="h-[2px] w-12 march-h opacity-90"></div>
            </div>

            {/* Branches Area */}
            <div className="flex flex-col justify-between relative py-6">
              {/* Main Vertical Connecting Trunk */}
              <div className="absolute left-0 top-[3.7rem] bottom-[3.7rem] w-[2px] march-v opacity-90 z-0"></div>

              {FLOW_DATA.map((node) => (
                <div key={node.id} className="flex items-stretch my-3 relative group">
                  {/* Branch Horizontal Left (Connecting to Main Trunk) */}
                  <div className="flex items-center z-0">
                    {/* Shows grey by default, primary animated on hover */}
                    <div className="h-[2px] w-12 absolute march-h-subdued transition-opacity group-hover:opacity-0"></div>
                    <div className="h-[2px] w-12 march-h opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>

                  {/* Category Node */}
                  <div className="flex items-center flow-node z-10">
                    <div className="border-2 border-border-strong bg-surface px-4 py-2 font-bold uppercase tracking-wider text-foreground w-[150px] text-center transition-all duration-300 group-hover:border-primary group-hover:bg-foreground group-hover:text-background group-hover:shadow-[4px_4px_0_0_var(--color-primary)]">
                      {node.id}
                    </div>
                  </div>

                  {/* Branch Horizontal Right (Connecting to Sub-branches) */}
                  <div className="flex items-center z-0 relative">
                    <div className="h-[2px] w-12 absolute march-h-subdued transition-opacity group-hover:opacity-0"></div>
                    <div className="h-[2px] w-12 march-h opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>

                  {/* Sub-branches Area */}
                  <div className="flex flex-col justify-between relative py-2 w-full">
                    {/* Vertical Connector for Sub-branches */}
                    <div className="absolute left-0 top-[1.6rem] bottom-[1.6rem] w-[2px] march-v opacity-0 group-hover:opacity-100 transition-opacity z-0"></div>
                    <div className="absolute left-0 top-[1.6rem] bottom-[1.6rem] w-[2px] march-v opacity-30 transition-opacity group-hover:opacity-0 z-0" style={{ animationPlayState: 'paused', background: 'linear-gradient(180deg, var(--color-border-strong) 50%, transparent 50%)', backgroundSize: '100% 16px' }}></div>

                    {node.children.map((child) => (
                      <div key={child} className="flex items-center my-1.5 relative z-10 flow-node">
                        {/* Sub-branch Horizontal Link */}
                        <div className="relative flex items-center">
                          <div className="h-[2px] w-8 absolute march-h-subdued transition-opacity group-hover:opacity-0"></div>
                          <div className="h-[2px] w-8 march-h opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                        
                        {/* Leaf Node */}
                        <div className="px-4 py-1.5 text-xs font-semibold tracking-wide text-muted-foreground border-2 border-border-strong bg-surface-2 transition-all duration-300 group-hover:border-primary group-hover:text-foreground group-hover:bg-surface w-[200px]">
                          {child}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
