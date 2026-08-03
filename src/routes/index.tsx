import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/portfolio/hero";
import { SiteNav } from "@/components/portfolio/site-nav";
import { FeaturedProjects } from "@/components/portfolio/featured-projects";
import { CurrentFocus } from "@/components/portfolio/stack-focus";
import { Skills } from "@/components/portfolio/skills-matrix";
import { OpenSource, Contact } from "@/components/portfolio/opensource-contact";
import { SiteFooter } from "@/components/portfolio/footer";
import { SmoothScroll } from "@/components/portfolio/smooth-scroll";
import { usePortfolio, useShellClass } from "@/lib/portfolio-store";

const TITLE = "Krish Mishra | DevOps, SRE & Full-Stack Engineer Portfolio";
const DESC =
  "Portfolio of Krish Mishra, a DevOps, SRE & Full-Stack Engineer building scalable, production-ready infrastructure and SaaS systems.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const SECTIONS: Record<string, () => React.ReactElement> = {
  projects: FeaturedProjects,
  
  stack: Skills,
  focus: CurrentFocus,
  github: OpenSource,
  contact: Contact,
};

function Index() {
  const shell = useShellClass();
  const { content } = usePortfolio();

  return (
    <div className={`${shell} min-h-screen bg-background text-foreground`}>
      <SmoothScroll />
      <SiteNav />
      <main>
        <h1 className="sr-only">
          {content.identity.name} — {content.identity.role}
        </h1>
        <Hero />
        {content.settings.sectionOrder.map((key) => {
          const Section = SECTIONS[key];
          return Section ? <Section key={key} /> : null;
        })}
      </main>

      <SiteFooter />
    </div>
  );
}
