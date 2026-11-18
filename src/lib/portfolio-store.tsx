import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_CONTENT,
  type PortfolioContent,
  type ThemeId,
  type FontId,
} from "./portfolio-data";

const STORAGE_KEY = "portfolio.content.v10";

const VALID_THEMES: ThemeId[] = ["void", "signal", "ember", "cobalt", "amethyst", "paper"];
const VALID_FONTS: FontId[] = ["jetbrains", "ibm", "archivo", "jakarta", "fira", "inter"];

function merge(stored: unknown): PortfolioContent {
  if (!stored || typeof stored !== "object") return DEFAULT_CONTENT;
  const s = stored as Partial<PortfolioContent>;
  const settings = { ...DEFAULT_CONTENT.settings, ...(s.settings ?? {}) };
  if (!VALID_THEMES.includes(settings.theme)) {
    settings.theme = "void";
  }
  if (!VALID_FONTS.includes(settings.font)) {
    settings.font = "jetbrains";
  }

  return {
    identity: { ...DEFAULT_CONTENT.identity, ...(s.identity ?? {}) },
    contact: { ...DEFAULT_CONTENT.contact, ...(s.contact ?? {}) },
    projects: s.projects ?? DEFAULT_CONTENT.projects,
    capabilities: s.capabilities ?? DEFAULT_CONTENT.capabilities,
    focusAreas: s.focusAreas ?? DEFAULT_CONTENT.focusAreas,
    exploring: s.exploring ?? DEFAULT_CONTENT.exploring,
    focus: s.focus ?? DEFAULT_CONTENT.focus,
    repos: s.repos ?? DEFAULT_CONTENT.repos,
    certificates: s.certificates ?? DEFAULT_CONTENT.certificates,
    settings,
  };
}

interface Store {
  content: PortfolioContent;
  hydrated: boolean;
  update: (updater: (draft: PortfolioContent) => PortfolioContent) => void;
  reset: () => void;
}

const PortfolioContext = createContext<Store | null>(null);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<PortfolioContent>(DEFAULT_CONTENT);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setContent(merge(JSON.parse(raw)));
    } catch {
      /* ignore corrupt payloads */
    }
    setHydrated(true);
  }, []);

  const update = useCallback((updater: (draft: PortfolioContent) => PortfolioContent) => {
    setContent((prev) => {
      const next = updater(prev);
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        /* storage unavailable */
      }
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* noop */
    }
    setContent(DEFAULT_CONTENT);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    VALID_THEMES.forEach((t) => root.classList.remove(`theme-${t}`));
    VALID_FONTS.forEach((f) => root.classList.remove(`font-${f}`));
    ["density-compact", "density-normal", "density-spacious"].forEach((d) =>
      root.classList.remove(d),
    );

    root.classList.add(
      `theme-${content.settings.theme}`,
      `font-${content.settings.font}`,
      `density-${content.settings.density}`,
    );
  }, [content.settings.theme, content.settings.font, content.settings.density]);

  const value = useMemo(
    () => ({ content, hydrated, update, reset }),
    [content, hydrated, update, reset],
  );

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
}

export function usePortfolio(): Store {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error("usePortfolio must be used inside PortfolioProvider");
  return ctx;
}

export function useShellClass() {
  const { content } = usePortfolio();
  const { theme, font, density } = content.settings;
  return `theme-${theme} font-${font} density-${density}`;
}
