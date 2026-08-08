import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePortfolio } from "@/lib/portfolio-store";
import { gsap } from "@/lib/gsap";
import { Reveal, SectionHeader } from "./primitives";

interface GithubEvent {
  id: string;
  type: string;
  repo: { name: string };
  created_at: string;
  payload: any;
}

function RecentActivity({ handle }: { handle: string }) {
  const { data, isPending, isError } = useQuery({
    queryKey: ["gh-events", handle],
    queryFn: async () => {
      const res = await fetch(`https://api.github.com/users/${handle}/events/public`);
      if (!res.ok) throw new Error("Failed to fetch events");
      const events = (await res.json()) as GithubEvent[];
      return events
        .filter((e) =>
          ["PushEvent", "IssuesEvent", "PullRequestEvent", "CreateEvent"].includes(e.type)
        )
        .slice(0, 3);
    },
    staleTime: 5 * 60_000,
  });

  if (isPending || isError || !data?.length) return null;

  return (
    <div className="flex flex-1 flex-col border border-border-strong bg-card">
      <div className="border-b border-border px-4 py-3">
        <span className="label-xs text-muted-foreground">Recent Activity</span>
      </div>
      <div className="flex flex-1 flex-col justify-center divide-y divide-border bg-background">
        {data.map((ev) => {
          let action = "did something in";
          if (ev.type === "PushEvent") action = "pushed to";
          if (ev.type === "IssuesEvent") action = `${ev.payload.action} an issue in`;
          if (ev.type === "PullRequestEvent") action = `${ev.payload.action} a PR in`;
          if (ev.type === "CreateEvent") action = `created ${ev.payload.ref_type} in`;

          const date = new Date(ev.created_at).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
          });
          const repoName = ev.repo.name.split("/")[1] || ev.repo.name;

          return (
            <div key={ev.id} className="px-4 py-4 text-[0.85rem] leading-relaxed">
              <span className="text-muted-foreground">{date} · </span>
              <span className="text-foreground/90">{action} </span>
              <a
                href={`https://github.com/${ev.repo.name}`}
                target="_blank"
                rel="noreferrer"
                className="font-bold tracking-tight hover:text-primary transition-colors"
              >
                {repoName}
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const GITHUB_LANGUAGES = [
  { name: "JavaScript", percent: 45, color: "#f1e05a" },
  { name: "TypeScript", percent: 30, color: "#3178c6" },
  { name: "PL/SQL", percent: 12, color: "#dad8d8" },
  { name: "Go", percent: 10, color: "#00ADD8" },
  { name: "Python", percent: 3, color: "#3572A5" },
];

function GitHubLanguageBar() {
  return (
    <div className="flex flex-1 flex-col border border-border-strong bg-card">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6 border-b border-border-strong bg-transparent">
        <span className="inline-block px-2 py-0.5 text-xs font-mono font-bold uppercase tracking-wider bg-primary text-primary-foreground border border-primary">
          PROGRAMMING LANGUAGES
        </span>
        <span className="text-xs font-mono text-muted-foreground opacity-70">
          05
        </span>
      </div>
      <div className="flex flex-1 flex-col justify-center p-4 sm:p-6 bg-background">
        <div className="flex h-2.5 w-full overflow-hidden rounded-full border border-border-strong">
          {GITHUB_LANGUAGES.map((lang) => (
            <div
              key={lang.name}
              style={{ width: `${lang.percent}%`, backgroundColor: lang.color }}
              className="h-full"
              title={`${lang.name} ${lang.percent}%`}
            />
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
          {GITHUB_LANGUAGES.map((lang) => (
            <div key={lang.name} className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: lang.color }}
              />
              <span className="text-[0.82rem] font-bold text-foreground/90 tracking-tight">{lang.name}</span>
              <span className="text-[0.82rem] font-medium text-muted-foreground">{lang.percent}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface GithubOrg {
  id: number;
  login: string;
  avatar_url: string;
}

function ActiveOrganizations({ handle }: { handle: string }) {
  const { data, isPending, isError } = useQuery({
    queryKey: ["gh-orgs", handle],
    queryFn: async () => {
      const res = await fetch(`https://api.github.com/users/${handle}/orgs`);
      if (!res.ok) throw new Error("Failed to fetch organizations");
      return res.json() as Promise<GithubOrg[]>;
    },
    staleTime: 5 * 60_000,
  });

  if (isPending || isError || !data?.length) return null;

  return (
    <div className="flex flex-1 flex-col border border-border-strong bg-card">
      <div className="border-b border-border px-4 py-3">
        <span className="label-xs text-muted-foreground">Active Organizations</span>
      </div>
      <div className="flex flex-wrap items-center gap-4 px-4 py-5 flex-1">
        {data.map((org) => (
          <a
            key={org.id}
            href={`https://github.com/${org.login}`}
            target="_blank"
            rel="noreferrer"
            title={org.login}
            className="transition-transform hover:scale-110"
          >
            <img
              src={org.avatar_url}
              alt={org.login}
              className="h-12 w-12 rounded-md object-cover border border-border bg-surface"
            />
          </a>
        ))}
      </div>
    </div>
  );
}

interface Day {
  date: string;
  count: number;
  level: number;
}

const LEVELS = ["bg-surface-2", "bg-primary/25", "bg-primary/45", "bg-primary/70", "bg-primary"];
const DAY_LABELS = ["Mon", "Wed", "Fri"];

async function fetchContributions(
  handle: string,
  year: string,
): Promise<{ days: Day[]; total: number }> {
  const res = await fetch(
    `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(handle)}?y=${year}`,
  );
  if (!res.ok) throw new Error(`GitHub contributions unavailable (${res.status})`);
  const json = (await res.json()) as {
    total: Record<string, number>;
    contributions: Day[];
  };
  const days = json.contributions ?? [];
  const total = Object.values(json.total ?? {}).reduce((a, b) => a + b, 0);
  return { days, total };
}

function longestStreak(days: Day[]) {
  let best = 0;
  let run = 0;
  for (const d of days) {
    if (d.count > 0) {
      run += 1;
      best = Math.max(best, run);
    } else run = 0;
  }
  return best;
}

function currentStreak(days: Day[]) {
  const today = new Date().toISOString().slice(0, 10);
  const past = days.filter((d) => d.date <= today);
  let run = 0;
  for (let i = past.length - 1; i >= 0; i--) {
    if (past[i].count > 0) run += 1;
    else break;
  }
  return run;
}

function ContributionGraph({ handle }: { handle: string }) {
  const thisYear = new Date().getFullYear();
  const years = useMemo(
    () => ["last", String(thisYear), String(thisYear - 1), String(thisYear - 2)],
    [thisYear],
  );
  const [year, setYear] = useState("last");
  const [hover, setHover] = useState<Day | null>(null);

  const { data, isPending, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["gh-contributions", handle, year],
    queryFn: () => fetchContributions(handle, year),
    staleTime: 5 * 60_000,
    retry: 1,
  });

  const days = data?.days ?? [];
  const offset = days.length ? (new Date(days[0].date).getDay() + 6) % 7 : 0;
  const cells: (Day | null)[] = [...Array.from({ length: offset }, () => null), ...days];

  const stats = useMemo(
    () => ({
      total: data?.total ?? 0,
      active: days.filter((d) => d.count > 0).length,
      streak: currentStreak(days),
      best: longestStreak(days),
    }),
    [data, days],
  );

  return (
    <div className="flex h-full flex-col border border-border-strong bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
        <span className="label-xs text-muted-foreground">
          Contribution rhythm{isFetching ? " · syncing" : ""}
        </span>
        <div className="flex flex-wrap gap-1.5">
          {years.map((y) => (
            <button
              key={y}
              type="button"
              onClick={() => setYear(y)}
              className={`label-xs border px-2 py-1 transition-colors ${
                year === y
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-muted-foreground hover:border-border-strong hover:text-foreground"
              }`}
            >
              {y === "last" ? "12 mo" : y}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-[9.5rem] flex-1 overflow-x-auto p-4">
        {isPending ? (
          <div className="grid w-max grid-flow-col grid-rows-7 gap-[3px]">
            {Array.from({ length: 371 }).map((_, i) => (
              <span key={i} className="h-3 w-3 animate-pulse border border-border bg-surface-2" />
            ))}
          </div>
        ) : isError ? (
          <div className="flex h-full flex-col items-start justify-center gap-3 py-6">
            <p className="text-sm text-muted-foreground">{(error as Error).message}</p>
            <button
              type="button"
              onClick={() => refetch()}
              className="label-xs border border-border-strong px-3 py-2 transition-colors hover:bg-surface"
            >
              Retry ↻
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <div className="grid grid-rows-7 gap-[3px] pt-[1px]">
              {Array.from({ length: 7 }).map((_, i) => (
                <span key={i} className="label-xs h-3 leading-3 text-muted-foreground">
                  {i === 0 ? DAY_LABELS[0] : i === 2 ? DAY_LABELS[1] : i === 4 ? DAY_LABELS[2] : ""}
                </span>
              ))}
            </div>
            <div
              className="grid w-max grid-flow-col grid-rows-7 gap-[3px]"
              onMouseLeave={() => setHover(null)}
            >
              {cells.map((d, i) =>
                d ? (
                  <button
                    key={d.date}
                    type="button"
                    onMouseEnter={() => setHover(d)}
                    onFocus={() => setHover(d)}
                    aria-label={`${d.count} contributions on ${d.date}`}
                    className={`h-3 w-3 border border-border transition-transform hover:scale-[1.6] hover:border-foreground ${LEVELS[d.level] ?? LEVELS[0]}`}
                  />
                ) : (
                  <span key={`pad-${i}`} className="h-3 w-3" />
                ),
              )}
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-border px-4 py-3">
        <p className="text-[0.8rem] text-muted-foreground">
          {hover ? (
            <span className="text-foreground">
              {hover.count} contribution{hover.count === 1 ? "" : "s"} ·{" "}
              <span className="text-muted-foreground">{hover.date}</span>
            </span>
          ) : (
            "Hover a cell for the exact day — data pulled live from GitHub"
          )}
        </p>
      </div>

      <div className="grid grid-cols-2 divide-x divide-y divide-border border-t border-border sm:grid-cols-4 sm:divide-y-0">
        {[
          { k: "total", v: stats.total },
          { k: "active days", v: stats.active },
          { k: "streak", v: stats.streak },
          { k: "longest", v: stats.best },
        ].map((s) => (
          <div key={s.k} className="px-4 py-3">
            <div className="text-lg font-bold tracking-tight">{isPending ? "—" : s.v}</div>
            <div className="label-xs mt-1 text-muted-foreground">{s.k}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3">
        <span className="label-xs text-muted-foreground">less</span>
        <span className="flex items-center gap-1.5">
          {LEVELS.map((c, i) => (
            <span key={i} className={`h-3 w-3 border border-border ${c}`} />
          ))}
        </span>
        <span className="label-xs text-muted-foreground">more</span>
      </div>
    </div>
  );
}

/** Animated 30-day contribution bar chart. */
function Last30({ handle }: { handle: string }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<Day | null>(null);

  const { data, isPending, isError } = useQuery({
    queryKey: ["gh-contributions", handle, "last"],
    queryFn: () => fetchContributions(handle, "last"),
    staleTime: 5 * 60_000,
    retry: 1,
  });

  const days = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return (data?.days ?? []).filter((d) => d.date <= today).slice(-30);
  }, [data]);

  const max = Math.max(1, ...days.map((d) => d.count));
  const total = days.reduce((a, d) => a + d.count, 0);
  const avg = days.length ? (total / days.length).toFixed(1) : "0.0";
  const peak = days.reduce<Day | null>((a, d) => (!a || d.count > a.count ? d : a), null);

  useEffect(() => {
    const el = wrap.current;
    if (!el || !days.length) return;
    const bars = el.querySelectorAll("[data-bar]");
    if (!bars.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(bars, { scaleY: 1, opacity: 1 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        bars,
        { scaleY: 0, opacity: 0.2 },
        {
          scaleY: 1,
          opacity: 1,
          transformOrigin: "bottom center",
          duration: 0.7,
          ease: "back.out(1.7)",
          stagger: 0.025,
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [days]);

  return (
    <div ref={wrap} className="flex flex-col border-2 border-border-strong bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-border-strong bg-foreground px-4 py-3">
        <span className="label-xs text-background">Last 30 days</span>
        <span className="label-xs text-background/70">
          {isPending
            ? "loading…"
            : isError
              ? "unavailable"
              : `${total} commits · peak ${peak?.count ?? 0}`}
        </span>
      </div>

      <div className="relative px-4 pb-3 pt-6">
        <div className="flex h-36 items-end gap-[3px] sm:gap-1.5">
          {(isPending || isError ? Array.from({ length: 30 }, () => null) : days).map((d, i) => {
            const h = d ? Math.max(6, Math.round((d.count / max) * 100)) : 6;
            return (
              <button
                key={d ? d.date : `s-${i}`}
                type="button"
                data-bar={d ? "1" : undefined}
                onMouseEnter={() => d && setHover(d)}
                onFocus={() => d && setHover(d)}
                onMouseLeave={() => setHover(null)}
                aria-label={d ? `${d.count} contributions on ${d.date}` : "loading"}
                style={{ height: `${h}%`, opacity: d ? 0 : 1 }}
                className={`group relative min-w-0 flex-1 border-2 border-border-strong transition-colors ${
                  d && d.count > 0 ? "bg-primary hover:bg-foreground" : "bg-surface-2"
                } ${isPending ? "animate-pulse" : ""}`}
              />
            );
          })}
        </div>
        <div className="mt-3 flex items-center justify-between border-t-2 border-border-strong pt-2">
          <span className="label-xs text-muted-foreground">-30d</span>
          <span className="label-xs text-foreground">
            {hover
              ? `${hover.date} · ${hover.count} contribution${hover.count === 1 ? "" : "s"}`
              : `avg ${avg}/day`}
          </span>
          <span className="label-xs text-muted-foreground">today</span>
        </div>
      </div>

      <div className="grid grid-cols-3 divide-x-2 divide-border-strong border-t-2 border-border-strong">
        {[
          { k: "30d total", v: isPending ? "—" : total },
          { k: "daily avg", v: isPending ? "—" : avg },
          { k: "peak day", v: isPending ? "—" : (peak?.count ?? 0) },
        ].map((s) => (
          <div key={s.k} className="px-4 py-3">
            <div className="text-2xl font-black leading-none tracking-tighter">{s.v}</div>
            <div className="label-xs mt-2 text-muted-foreground">{s.k}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function OpenSource() {
  const { content } = usePortfolio();

  return (
    <section className="section-pad mx-auto max-w-[1400px] px-4 sm:px-6">
      <SectionHeader
        id="github"
        index="05"
        title="Open Source"
        meta={`github.com/${content.identity.handle}`}
      />

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div className="flex flex-col gap-6">
          <Reveal>
            <ContributionGraph handle={content.identity.handle} />
          </Reveal>
          <Reveal delay={60}>
            <Last30 handle={content.identity.handle} />
          </Reveal>
        </div>

        <Reveal delay={80} className="h-full">
          <div className="flex h-full flex-col gap-6">
            <ActiveOrganizations handle={content.identity.handle} />
            <RecentActivity handle={content.identity.handle} />
            <GitHubLanguageBar />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Contact() {
  const { content } = usePortfolio();
  const c = content.contact;
  const rows = [
    { k: "Email", v: c.email, href: `mailto:${c.email}` },
    { k: "GitHub", v: c.github.replace("https://", ""), href: c.github },
    { k: "LinkedIn", v: c.linkedin.replace("https://", ""), href: c.linkedin },
    { k: "Resume", v: "Download PDF", href: c.resumeUrl },
  ];

  return (
    <section className="section-pad border-t border-border-strong bg-surface">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <SectionHeader id="contact" index="06" title="Contact" meta="direct channels" />
        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          <Reveal>
            <div>
              <p className="text-xl leading-snug sm:text-2xl">{content.identity.availability}</p>
              <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground">
                {c.note}
              </p>
            </div>
          </Reveal>
          <Reveal delay={60}>
            <div className="divide-y divide-border border border-border-strong bg-background">
              {rows.map((r) => (
                <a
                  key={r.k}
                  href={r.href}
                  target={r.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel="noreferrer"
                  className="group grid grid-cols-[minmax(0,7rem)_1fr_auto] items-center gap-3 px-4 py-5 transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  <span className="label-xs">{r.k}</span>
                  <span className="min-w-0 truncate text-sm">{r.v}</span>
                  <span className="label-xs shrink-0">↗</span>
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
