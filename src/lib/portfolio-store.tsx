import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { DEFAULT_CONTENT, type PortfolioContent } from "./portfolio-data";

const STORAGE_KEY = "portfolio.content.v8";

function merge(stored: unknown): PortfolioContent {
  if (!stored || typeof stored !== "object") return DEFAULT_CONTENT;
  const s = stored as Partial<PortfolioContent>;
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
    settings: { ...DEFAULT_CONTENT.settings, ...(s.settings ?? {}) },
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
