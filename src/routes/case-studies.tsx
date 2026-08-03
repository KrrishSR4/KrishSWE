import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/portfolio/site-nav";
import { CaseStudies } from "@/components/portfolio/case-studies";
import { SiteFooter } from "@/components/portfolio/footer";
import { SmoothScroll } from "@/components/portfolio/smooth-scroll";
import { useShellClass } from "@/lib/portfolio-store";

const TITLE = "Case Studies — Krish Mishra";
const DESC =
  "Deep-dive engineering case studies: problem framing, solution design, architecture and measured impact across WebMetricsX, RepoXray, OpenSourceScout and SecureShare.";

export const Route = createFileRoute("/case-studies")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CaseStudiesPage,
});

function CaseStudiesPage() {
  const shell = useShellClass();
  return (
    <div className={`${shell} min-h-screen bg-background text-foreground`}>
      <SmoothScroll />
      <SiteNav />
      <main>
        <div className="border-b border-border-strong bg-surface">
          <div className="mx-auto flex max-w-[1400px] flex-wrap items-baseline justify-between gap-4 px-4 py-10 sm:px-6">
            <div className="min-w-0">
              <span className="label-xs text-muted-foreground">Archive · 02</span>
              <h1 className="mt-3 text-[clamp(2.2rem,6vw,4rem)] font-bold uppercase leading-[0.9] tracking-tighter">
                Case <span className="text-primary">Studies</span>
              </h1>
            </div>
            <Link to="/" className="label-xs border border-border-strong px-4 py-3 transition-colors hover:bg-surface-2">
              ← Back to index
            </Link>
          </div>
        </div>
        <CaseStudies />
      </main>
      <SiteFooter />
    </div>
  );
}
