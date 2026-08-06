import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/portfolio/site-nav";
import { Certificates } from "@/components/portfolio/certificates";
import { SiteFooter } from "@/components/portfolio/footer";
import { SmoothScroll } from "@/components/portfolio/smooth-scroll";
import { useShellClass } from "@/lib/portfolio-store";

const TITLE = "Certificates — Krish Mishra";
const DESC = "Professional certifications and achievements.";

export const Route = createFileRoute("/certificates")({
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
  component: CertificatesPage,
});

function CertificatesPage() {
  const shell = useShellClass();
  return (
    <div className={`${shell} min-h-screen bg-background text-foreground`}>
      <SmoothScroll />
      <SiteNav />
      <main>
        <div className="border-b border-border-strong bg-surface">
          <div className="mx-auto flex max-w-[1400px] flex-wrap items-baseline justify-between gap-4 px-4 py-10 sm:px-6">
            <div className="min-w-0">
              <span className="label-xs text-muted-foreground">Archive · 03</span>
              <h1 className="mt-3 text-[clamp(2.2rem,6vw,4rem)] font-bold uppercase leading-[0.9] tracking-tighter">
                <span className="text-primary">Certificates</span>
              </h1>
            </div>
            <Link
              to="/"
              className="label-xs border border-border-strong px-4 py-3 transition-colors hover:bg-surface-2"
            >
              ← Back to index
            </Link>
          </div>
        </div>
        <Certificates />
      </main>
      <SiteFooter />
    </div>
  );
}
