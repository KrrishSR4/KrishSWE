import { Link } from "@tanstack/react-router";
import { usePortfolio } from "@/lib/portfolio-store";

export function AdminAccess() {
  return (
    <section className="border-t border-border-strong bg-background">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-4 px-4 py-8 sm:px-6 md:grid-cols-[1fr_auto]">
        <div className="min-w-0">
          <span className="label-xs text-muted-foreground">Restricted</span>
          <p className="mt-2 text-sm text-muted-foreground">
            Content management console. Authorised operator access only — not part of the public
            site.
          </p>
        </div>
        <Link
          to="/admin"
          className="label-xs border border-border-strong px-5 py-4 text-center transition-colors hover:bg-surface-2"
        >
          Admin Console →
        </Link>
      </div>
    </section>
  );
}

export function SiteFooter() {
  const { content } = usePortfolio();
  return (
    <footer className="border-t border-border-strong bg-surface">
      <div className="mx-auto grid max-w-[1400px] gap-6 px-4 py-10 sm:px-6 md:grid-cols-[1.2fr_1fr_1fr]">
        <div className="min-w-0">
          <p className="text-lg font-bold uppercase tracking-tight">{content.identity.name}</p>
          <p className="mt-2 text-sm text-muted-foreground">{content.identity.role}</p>
          <p className="mt-1 text-sm text-muted-foreground">{content.identity.location}</p>
        </div>
        <div>
          <span className="label-xs text-muted-foreground">Index</span>
          <ul className="mt-3 space-y-2 text-sm">
            {[
              ["projects", "Projects"],
              ["stack", "Stack"],
              ["focus", "Focus"],
            ].map(([h, l]) => (
              <li key={h}>
                <Link
                  to="/"
                  hash={h}
                  className="text-muted-foreground transition-colors hover:text-foreground"
                >
                  {l}
                </Link>
              </li>
            ))}
            <li>
              <Link
                to="/case-studies"
                className="text-muted-foreground transition-colors hover:text-foreground"
              >
                Case Studies
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <span className="label-xs text-muted-foreground">Channels</span>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <a
                href={`mailto:${content.contact.email}`}
                className="text-muted-foreground hover:text-foreground"
              >
                Email
              </a>
            </li>
            <li>
              <a
                href={content.contact.github}
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                GitHub
              </a>
            </li>
            <li>
              <a
                href={content.contact.linkedin}
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground hover:text-foreground"
              >
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
          <span className="label-xs text-muted-foreground">
            © {new Date().getFullYear()} {content.identity.handle}
          </span>
          <span className="label-xs text-muted-foreground">
            Built with TypeScript · Deployed on the edge
          </span>
        </div>
      </div>
    </footer>
  );
}
