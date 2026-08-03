import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { usePortfolio, useShellClass } from "@/lib/portfolio-store";
import type { Project, ProjectStatus, SiteSettings } from "@/lib/portfolio-data";
import { SECTION_LABELS } from "@/lib/portfolio-data";

const TITLE = "Admin Console — Portfolio Content Management";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: "Restricted content management console for the portfolio." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: "Restricted content management console." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminRoute,
});

const ADMIN_USER = "admin";
const ADMIN_PASS = "Krrish@SR4";
const SESSION_KEY = "portfolio.admin.session";

function AdminRoute() {
  const shell = useShellClass();
  const [authed, setAuthed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setAuthed(window.sessionStorage.getItem(SESSION_KEY) === "1");
    setReady(true);
  }, []);

  return (
    <div className={`${shell} min-h-screen bg-background text-foreground`}>
      {!ready ? null : authed ? (
        <Console
          onExit={() => {
            window.sessionStorage.removeItem(SESSION_KEY);
            setAuthed(false);
          }}
        />
      ) : (
        <LoginGate
          onPass={() => {
            window.sessionStorage.setItem(SESSION_KEY, "1");
            setAuthed(true);
          }}
        />
      )}
    </div>
  );
}

/* ------------------------------ LOGIN ------------------------------ */

function LoginGate({ onPass }: { onPass: () => void }) {
  const [name, setName] = useState("");
  const [pass, setPass] = useState("");
  const [reveal, setReveal] = useState(false);
  const [error, setError] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (name.trim() === ADMIN_USER && pass === ADMIN_PASS) {
      setError("");
      onPass();
    } else {
      setError("ACCESS DENIED — credentials rejected");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md border border-border-strong bg-card">
        <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-3">
          <span className="label-xs text-muted-foreground">auth / admin</span>
          <span className="label-xs text-accent">RESTRICTED</span>
        </div>

        <form onSubmit={submit} className="p-5 sm:p-6">
          <h1 className="text-2xl font-bold uppercase tracking-tight">Admin Console</h1>
          <p className="mt-2 text-[0.8rem] leading-relaxed text-muted-foreground">
            Content management only. This area is not part of the public site and is not intended for visitors.
          </p>

          <label className="label-xs mt-7 block text-muted-foreground" htmlFor="admin-name">
            Admin name
          </label>
          <input
            id="admin-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="username"
            className="mt-2 w-full border border-border bg-background px-3 py-3 text-sm outline-none focus:border-primary"
          />

          <label className="label-xs mt-5 block text-muted-foreground" htmlFor="admin-pass">
            Password
          </label>
          <div className="mt-2 flex">
            <input
              id="admin-pass"
              type={reveal ? "text" : "password"}
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              autoComplete="current-password"
              className="min-w-0 flex-1 border border-border bg-background px-3 py-3 text-sm outline-none focus:border-primary"
            />
            <button
              type="button"
              onClick={() => setReveal((r) => !r)}
              aria-pressed={reveal}
              className="label-xs shrink-0 border border-l-0 border-border px-3 text-muted-foreground transition-colors hover:text-foreground"
            >
              {reveal ? "Hide" : "Show"}
            </button>
          </div>

          {error ? (
            <p className="label-xs mt-5 border border-destructive px-3 py-2.5 text-destructive">{error}</p>
          ) : null}

          <button
            type="submit"
            className="label-xs mt-7 w-full border border-primary bg-primary px-4 py-4 text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            Authenticate
          </button>

          <Link to="/" className="label-xs mt-4 block text-center text-muted-foreground hover:text-foreground">
            ← Back to site
          </Link>

          <p className="label-xs mt-6 border-t border-border pt-4 leading-relaxed text-muted-foreground">
            Warning: this gate protects content editing in this browser only. Anything saved here is stored locally on
            this device.
          </p>
        </form>
      </div>
    </div>
  );
}

/* ------------------------------ CONSOLE ------------------------------ */

const TABS = ["Content", "Projects", "Appearance", "Sections", "Contact"] as const;
type Tab = (typeof TABS)[number];

function Field({
  label,
  value,
  onChange,
  area,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  area?: boolean;
}) {
  return (
    <label className="block">
      <span className="label-xs text-muted-foreground">{label}</span>
      {area ? (
        <textarea
          value={value}
          rows={4}
          onChange={(e) => onChange(e.target.value)}
          className="mt-2 w-full border border-border bg-background px-3 py-3 text-sm outline-none focus:border-primary"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-2 w-full border border-border bg-background px-3 py-3 text-sm outline-none focus:border-primary"
        />
      )}
    </label>
  );
}

const STATUSES: ProjectStatus[] = ["Production", "In Development", "Maintained", "Archived"];

function Console({ onExit }: { onExit: () => void }) {
  const { content, update, reset } = usePortfolio();
  const [tab, setTab] = useState<Tab>("Content");
  const [saved, setSaved] = useState(false);

  function flash() {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1600);
  }

  function patchProject(id: string, patch: Partial<Project>) {
    update((c) => ({ ...c, projects: c.projects.map((p) => (p.id === id ? { ...p, ...patch } : p)) }));
  }

  function addProject() {
    const id = `project-${Date.now()}`;
    update((c) => ({
      ...c,
      projects: [
        ...c.projects,
        {
          id,
          index: String(c.projects.length + 1).padStart(2, "0"),
          name: "New Project",
          positioning: "One-line positioning statement.",
          summary: "Short technical summary.",
          tags: ["Developer Tooling"],
          stack: ["TypeScript"],
          repo: "https://github.com/",
          live: "",
          status: "In Development",
          impact: "Why this matters.",
          problem: "Problem statement.",
          solution: "Solution approach.",
          architecture: ["Component one"],
          metrics: [{ label: "Status", value: "Building" }],
        },
      ],
    }));
    flash();
  }

  function removeProject(id: string) {
    update((c) => ({ ...c, projects: c.projects.filter((p) => p.id !== id) }));
    flash();
  }

  function setSetting<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    update((c) => ({ ...c, settings: { ...c.settings, [key]: value } }));
  }

  function moveSection(i: number, dir: -1 | 1) {
    const order = [...content.settings.sectionOrder];
    const j = i + dir;
    if (j < 0 || j >= order.length) return;
    [order[i], order[j]] = [order[j], order[i]];
    setSetting("sectionOrder", order);
  }

  return (
    <div>
      <header className="sticky top-0 z-40 border-b border-border-strong bg-background">
        <div className="mx-auto grid max-w-[1200px] grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-6">
          <div className="min-w-0">
            <span className="label-xs text-primary">ADMIN</span>
            <p className="truncate text-sm">Portfolio content management</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {saved ? <span className="label-xs text-signal">SAVED</span> : null}
            <Link to="/" className="label-xs border border-border px-3 py-2 hover:border-foreground">
              View site
            </Link>
            <button onClick={onExit} className="label-xs border border-border px-3 py-2 hover:border-destructive hover:text-destructive">
              Lock
            </button>
          </div>
        </div>
        <div className="mx-auto flex max-w-[1200px] gap-px overflow-x-auto border-t border-border bg-border px-4 sm:px-6">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`label-xs whitespace-nowrap px-4 py-3 ${
                tab === t ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </header>

      <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6">
        <p className="label-xs mb-8 border border-accent px-4 py-3 leading-relaxed text-accent">
          Warning — content management area. Changes save to this browser only and take effect immediately on the public
          site view.
        </p>

        {tab === "Content" && (
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Name" value={content.identity.name} onChange={(v) => update((c) => ({ ...c, identity: { ...c.identity, name: v } }))} />
            <Field label="Handle" value={content.identity.handle} onChange={(v) => update((c) => ({ ...c, identity: { ...c.identity, handle: v } }))} />
            <Field label="Role" value={content.identity.role} onChange={(v) => update((c) => ({ ...c, identity: { ...c.identity, role: v } }))} />
            <Field label="Location" value={content.identity.location} onChange={(v) => update((c) => ({ ...c, identity: { ...c.identity, location: v } }))} />
            <div className="md:col-span-2">
              <Field label="Tagline" area value={content.identity.tagline} onChange={(v) => update((c) => ({ ...c, identity: { ...c.identity, tagline: v } }))} />
            </div>
            <div className="md:col-span-2">
              <Field label="Intro paragraph" area value={content.identity.intro} onChange={(v) => update((c) => ({ ...c, identity: { ...c.identity, intro: v } }))} />
            </div>
            <div className="md:col-span-2">
              <Field label="Availability line" value={content.identity.availability} onChange={(v) => update((c) => ({ ...c, identity: { ...c.identity, availability: v } }))} />
            </div>
            <div className="md:col-span-2 flex flex-wrap gap-3 border-t border-border pt-6">
              <button onClick={flash} className="label-xs border border-primary bg-primary px-5 py-4 text-primary-foreground">
                Save changes
              </button>
              <button onClick={reset} className="label-xs border border-destructive px-5 py-4 text-destructive">
                Reset to defaults
              </button>
            </div>
          </div>
        )}

        {tab === "Projects" && (
          <div className="flex flex-col gap-5">
            <button onClick={addProject} className="label-xs self-start border border-primary bg-primary px-5 py-4 text-primary-foreground">
              + Add project
            </button>
            {content.projects.map((p) => (
              <details key={p.id} className="border border-border-strong bg-card" open={false}>
                <summary className="grid cursor-pointer grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border px-4 py-3">
                  <span className="truncate text-sm font-semibold">
                    {p.index} · {p.name}
                  </span>
                  <span className="label-xs shrink-0 text-muted-foreground">{p.status}</span>
                </summary>
                <div className="grid gap-4 p-4 md:grid-cols-2">
                  <Field label="Index" value={p.index} onChange={(v) => patchProject(p.id, { index: v })} />
                  <Field label="Name" value={p.name} onChange={(v) => patchProject(p.id, { name: v })} />
                  <div className="md:col-span-2">
                    <Field label="Positioning" value={p.positioning} onChange={(v) => patchProject(p.id, { positioning: v })} />
                  </div>
                  <div className="md:col-span-2">
                    <Field label="Summary" area value={p.summary} onChange={(v) => patchProject(p.id, { summary: v })} />
                  </div>
                  <Field label="Repository URL" value={p.repo} onChange={(v) => patchProject(p.id, { repo: v })} />
                  <Field label="Live URL" value={p.live ?? ""} onChange={(v) => patchProject(p.id, { live: v })} />
                  <label className="block">
                    <span className="label-xs text-muted-foreground">Status</span>
                    <select
                      value={p.status}
                      onChange={(e) => patchProject(p.id, { status: e.target.value as ProjectStatus })}
                      className="mt-2 w-full border border-border bg-background px-3 py-3 text-sm outline-none focus:border-primary"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </label>
                  <Field label="Tags (comma separated)" value={p.tags.join(", ")} onChange={(v) => patchProject(p.id, { tags: v.split(",").map((s) => s.trim()).filter(Boolean) })} />
                  <div className="md:col-span-2">
                    <Field label="Stack (comma separated)" value={p.stack.join(", ")} onChange={(v) => patchProject(p.id, { stack: v.split(",").map((s) => s.trim()).filter(Boolean) })} />
                  </div>
                  <div className="md:col-span-2">
                    <Field label="Impact" area value={p.impact} onChange={(v) => patchProject(p.id, { impact: v })} />
                  </div>
                  <div className="md:col-span-2">
                    <Field label="Problem" area value={p.problem} onChange={(v) => patchProject(p.id, { problem: v })} />
                  </div>
                  <div className="md:col-span-2">
                    <Field label="Solution" area value={p.solution} onChange={(v) => patchProject(p.id, { solution: v })} />
                  </div>
                  <div className="md:col-span-2">
                    <Field
                      label="Architecture (one step per line)"
                      area
                      value={p.architecture.join("\n")}
                      onChange={(v) => patchProject(p.id, { architecture: v.split("\n").map((s) => s.trim()).filter(Boolean) })}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Field
                      label="Metrics (label = value, one per line)"
                      area
                      value={p.metrics.map((m) => `${m.label} = ${m.value}`).join("\n")}
                      onChange={(v) =>
                        patchProject(p.id, {
                          metrics: v
                            .split("\n")
                            .map((line) => line.split("="))
                            .filter((parts) => parts.length >= 2)
                            .map((parts) => ({ label: parts[0].trim(), value: parts.slice(1).join("=").trim() })),
                        })
                      }
                    />
                  </div>
                  <div className="md:col-span-2 flex flex-wrap gap-3 border-t border-border pt-4">
                    <button onClick={flash} className="label-xs border border-primary bg-primary px-5 py-4 text-primary-foreground">
                      Save project
                    </button>
                    <button onClick={() => removeProject(p.id)} className="label-xs border border-destructive px-5 py-4 text-destructive">
                      Remove project
                    </button>
                  </div>
                </div>
              </details>
            ))}
          </div>
        )}

        {tab === "Appearance" && (
          <div className="grid gap-8">
            <div>
              <span className="label-xs text-muted-foreground">Theme</span>
              <div className="mt-3 flex flex-wrap gap-2">
                {(["void", "signal", "ember", "paper"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setSetting("theme", t)}
                    className={`label-xs border px-4 py-3 ${
                      content.settings.theme === t ? "border-primary bg-primary text-primary-foreground" : "border-border"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <span className="label-xs text-muted-foreground">Typeface</span>
              <div className="mt-3 flex flex-wrap gap-2">
                {(["jetbrains", "ibm", "archivo"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setSetting("font", f)}
                    className={`label-xs border px-4 py-3 ${
                      content.settings.font === f ? "border-primary bg-primary text-primary-foreground" : "border-border"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <span className="label-xs text-muted-foreground">Layout density</span>
              <div className="mt-3 flex flex-wrap gap-2">
                {(["compact", "normal", "spacious"] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => setSetting("density", d)}
                    className={`label-xs border px-4 py-3 ${
                      content.settings.density === d ? "border-primary bg-primary text-primary-foreground" : "border-border"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "Sections" && (
          <div className="divide-y divide-border border border-border-strong bg-card">
            {content.settings.sectionOrder.map((key, i) => (
              <div key={key} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-4">
                <span className="label-xs text-primary">{String(i + 1).padStart(2, "0")}</span>
                <span className="min-w-0 truncate text-sm">{SECTION_LABELS[key] ?? key}</span>
                <span className="flex shrink-0 gap-2">
                  <button onClick={() => moveSection(i, -1)} className="label-xs border border-border px-3 py-2 hover:border-foreground">
                    ↑
                  </button>
                  <button onClick={() => moveSection(i, 1)} className="label-xs border border-border px-3 py-2 hover:border-foreground">
                    ↓
                  </button>
                </span>
              </div>
            ))}
          </div>
        )}

        {tab === "Contact" && (
          <div className="grid gap-5 md:grid-cols-2">
            <Field label="Email" value={content.contact.email} onChange={(v) => update((c) => ({ ...c, contact: { ...c.contact, email: v } }))} />
            <Field label="GitHub URL" value={content.contact.github} onChange={(v) => update((c) => ({ ...c, contact: { ...c.contact, github: v } }))} />
            <Field label="LinkedIn URL" value={content.contact.linkedin} onChange={(v) => update((c) => ({ ...c, contact: { ...c.contact, linkedin: v } }))} />
            <Field label="Resume URL" value={content.contact.resumeUrl} onChange={(v) => update((c) => ({ ...c, contact: { ...c.contact, resumeUrl: v } }))} />
            <div className="md:col-span-2">
              <Field label="Contact note" area value={content.contact.note} onChange={(v) => update((c) => ({ ...c, contact: { ...c.contact, note: v } }))} />
            </div>
            <div className="md:col-span-2">
              <button onClick={flash} className="label-xs border border-primary bg-primary px-5 py-4 text-primary-foreground">
                Save contact info
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
