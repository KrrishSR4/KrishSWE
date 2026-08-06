import { useState, useEffect } from "react";
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
  const [isOpen, setIsOpen] = useState(false);

  // Disable background scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-border-strong bg-background/92 backdrop-blur-sm relative">
      <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-4 py-3 sm:px-6">
        <Link
          to="/"
          className="label-xs shrink-0 border border-border-strong px-2 py-1.5 hover:bg-primary hover:text-primary-foreground"
          onClick={() => setIsOpen(false)}
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
          <Link
            to="/certificates"
            className="label-xs text-muted-foreground transition-colors hover:text-foreground"
            activeProps={{ className: "label-xs text-foreground" }}
          >
            Certificates
          </Link>
        </nav>
        <div className="ml-auto flex shrink-0 items-center gap-2">
          <a
            href={content.contact.github}
            target="_blank"
            rel="noreferrer"
            className="label-xs border border-border-strong p-2 transition-colors hover:border-foreground flex items-center justify-center"
            aria-label="GitHub"
          >
            <svg
              className="h-4 w-4 fill-current"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
            </svg>
          </a>

          <ThemeToggle />

          {/* Animated Hamburger Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden label-xs border border-border-strong p-2 transition-colors hover:border-foreground flex items-center justify-center relative w-8 h-8 focus:outline-none"
            aria-label="Toggle menu"
          >
            <div className="relative w-4.5 h-4 flex flex-col justify-between">
              <span
                className={`h-[2px] w-full bg-current transform transition-transform duration-300 origin-center ${
                  isOpen ? "rotate-45 translate-y-[6px]" : ""
                }`}
              />
              <span
                className={`h-[2px] w-full bg-current transition-opacity duration-300 ${
                  isOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`h-[2px] w-full bg-current transform transition-transform duration-300 origin-center ${
                  isOpen ? "-rotate-45 -translate-y-[6px]" : ""
                }`}
              />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel - Absolute overlay connected to header */}
      <div
        className={`lg:hidden absolute top-full left-0 right-0 bg-background/96 backdrop-blur-md border-b-2 border-border-strong z-40 transition-all duration-300 ease-in-out h-[calc(100vh-100%)] overflow-hidden ${
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-4 pointer-events-none"
        }`}
      >
        <div className="flex flex-col p-6 gap-6 h-full justify-between overflow-y-auto">
          <nav className="flex flex-col gap-2">
            {NAV.map((n, idx) => (
              <Link
                key={n.href}
                to="/"
                hash={n.href.slice(1)}
                onClick={() => setIsOpen(false)}
                className={`label-sm text-foreground hover:text-primary border-b border-border py-4 flex items-center justify-between transition-all duration-300 transform ${
                  isOpen ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
                }`}
                style={{ transitionDelay: `${idx * 40}ms` }}
              >
                <span className="font-bold tracking-wider">{n.label}</span>
                <span className="text-[10px] text-muted-foreground font-mono">0{idx + 1}</span>
              </Link>
            ))}
            <Link
              to="/case-studies"
              onClick={() => setIsOpen(false)}
              className={`label-sm text-foreground hover:text-primary border-b border-border py-4 flex items-center justify-between transition-all duration-300 transform ${
                isOpen ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
              }`}
              style={{ transitionDelay: `${NAV.length * 40}ms` }}
            >
              <span className="font-bold tracking-wider">Case Studies</span>
              <span className="text-[10px] text-muted-foreground font-mono">0{NAV.length + 1}</span>
            </Link>
            <Link
              to="/certificates"
              onClick={() => setIsOpen(false)}
              className={`label-sm text-foreground hover:text-primary border-b border-border py-4 flex items-center justify-between transition-all duration-300 transform ${
                isOpen ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
              }`}
              style={{ transitionDelay: `${(NAV.length + 1) * 40}ms` }}
            >
              <span className="font-bold tracking-wider">Certificates</span>
              <span className="text-[10px] text-muted-foreground font-mono">0{NAV.length + 2}</span>
            </Link>
          </nav>

          {/* Socials / Footer in Mobile Menu */}
          <div className="border-t border-border-strong pt-6 flex justify-between items-center mt-auto">
            <span className="text-xs text-muted-foreground font-mono">
              © {new Date().getFullYear()}
            </span>
            <a
              href={content.contact.github}
              target="_blank"
              rel="noreferrer"
              className="label-xs border border-border-strong p-2 hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center"
              aria-label="GitHub"
            >
              <svg
                className="h-4 w-4 fill-current"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
