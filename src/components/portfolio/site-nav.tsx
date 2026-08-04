import { Link } from "@tanstack/react-router";
import { usePortfolio } from "@/lib/portfolio-store";
import { ThemeToggle } from "./theme-toggle";

const NAV = [
  { href: "#projects", label: "Projects" },
  { href: "#stack", label: "Stack" },
  { href: "#focus", label: "Focus" },
  { href: "#github", label: "Open Source" },
  { href: "#contact", label: "Contact" },
];

export function SiteNav() {
  const { content } = usePortfolio();
  return (
    <header className="sticky top-0 z-50 border-b border-border-strong bg-background/92 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-4 py-3 sm:px-6">
        <Link
          to="/"
          className="label-xs shrink-0 border border-border-strong px-2 py-1.5 hover:bg-primary hover:text-primary-foreground"
        >
          {content.identity.handle}
        </Link>
        <nav className="hidden min-w-0 flex-1 items-center gap-5 overflow-hidden lg:flex">
          {NAV.map((n) => (
            <Link
              key={n.href}
              to="/"
              hash={n.href.slice(1)}
              className="label-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              {n.label}
            </Link>
          ))}
          <Link
            to="/case-studies"
            className="label-xs text-muted-foreground transition-colors hover:text-foreground"
            activeProps={{ className: "label-xs text-foreground" }}
          >
            Case Studies
          </Link>
        </nav>
        <div className="ml-auto flex shrink-0 items-center gap-2">
          <span className="label-xs hidden items-center gap-2 text-muted-foreground xl:inline-flex">
            <span className="inline-block h-2 w-2 bg-signal" />
            AVAILABLE
          </span>
          <ThemeToggle />

          <a
            href={content.contact.github}
            target="_blank"
            rel="noreferrer"
            className="label-xs border border-border px-3 py-1.5 transition-colors hover:border-foreground"
          >
            GitHub
          </a>
          <a
            href="#contact"
            className="label-xs border border-primary bg-primary px-3 py-1.5 text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            Contact
          </a>
        </div>
      </div>
    </header>
  );
}
